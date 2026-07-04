// Receipt-scan endpoint for the Aqua Sport Supply dashboard demo.
// Takes a photo of a supplier invoice/receipt and returns structured line
// items (product, qty, unit cost) matched to the dive catalogue, so the owner
// can review and import them as stock-in without typing each line by hand.
//
// Real AI: the image is read by Claude vision. Set ANTHROPIC_API_KEY in the
// environment (locally in .env.local, on Vercel as a project env var).

import { NextResponse, type NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { PRODUCTS } from "@/lib/layouts/dive/catalog";

export const runtime = "nodejs";
export const maxDuration = 60;

// The client picks the model (and sees the per-scan price before confirming).
// Haiku 4.5 is the default — ~5× cheaper/faster than Opus and very capable at
// this extraction. Only allowlisted models may be requested.
const DEFAULT_MODEL = "claude-haiku-4-5";
const ALLOWED_MODELS = new Set(["claude-haiku-4-5", "claude-opus-4-8"]);

// Cap the payload — the client downscales to ~1600px JPEG, so anything much
// larger than this is either abuse or an un-downscaled upload.
const MAX_BASE64_CHARS = 7_000_000; // ≈ 5 MB decoded
const ALLOWED_MEDIA = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

// Best-effort per-IP rate limit. Serverless instances don't share memory, so
// this only throttles bursts to a single warm instance — a real deployment
// would gate this behind auth. Good enough to blunt casual abuse of the demo.
const HITS = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 6;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (HITS.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  HITS.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

interface ScanLine {
  rawName: string;
  slug: string;
  brand: string;
  qty: number;
  unit: number;
  confidence: number;
}

interface ScanResult {
  supplier: string;
  date: string;
  lines: ScanLine[];
}

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    supplier: {
      type: "string",
      description: "Supplier / vendor name if printed on the receipt, else empty string",
    },
    date: {
      type: "string",
      description: "Invoice date as yyyy-MM-dd if visible, else empty string",
    },
    lines: {
      type: "array",
      description: "One entry per purchased product line on the receipt",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          rawName: {
            type: "string",
            description: "Product description exactly as printed on the receipt",
          },
          slug: {
            type: "string",
            description:
              "Best-matching catalogue slug from the provided list, or empty string if there is no confident match",
          },
          brand: { type: "string", description: "Brand if identifiable, else empty string" },
          qty: { type: "integer", description: "Number of units purchased (whole units)" },
          unit: {
            type: "number",
            description: "Cost of a single unit in Thai Baht (line total ÷ quantity)",
          },
          confidence: {
            type: "number",
            description: "0..1 confidence that slug is the correct catalogue product",
          },
        },
        required: ["rawName", "slug", "brand", "qty", "unit", "confidence"],
      },
    },
  },
  required: ["supplier", "date", "lines"],
} as const;

function parseDataUrl(dataUrl: unknown): { mediaType: string; data: string } | null {
  if (typeof dataUrl !== "string") return null;
  const m = /^data:([^;]+);base64,([\s\S]+)$/.exec(dataUrl);
  if (!m) return null;
  return { mediaType: m[1], data: m[2] };
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Receipt scanning is not configured (missing ANTHROPIC_API_KEY)." },
      { status: 500 },
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many scans in a short time — please wait a minute and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const image = parseDataUrl((body as { image?: unknown })?.image);
  if (!image) {
    return NextResponse.json({ error: "No image provided." }, { status: 400 });
  }
  if (!ALLOWED_MEDIA.has(image.mediaType)) {
    return NextResponse.json({ error: "Unsupported image type." }, { status: 400 });
  }
  if (image.data.length > MAX_BASE64_CHARS) {
    return NextResponse.json({ error: "Image is too large — try a smaller photo." }, { status: 413 });
  }

  const requested = (body as { model?: unknown })?.model;
  const model = typeof requested === "string" && ALLOWED_MODELS.has(requested) ? requested : DEFAULT_MODEL;

  const catalogue = PRODUCTS.map((p) => `${p.slug}\t${p.name}\t${p.brand}`).join("\n");

  const client = new Anthropic();

  try {
    const response = await client.messages.create({
      model,
      max_tokens: 2048,
      output_config: { format: { type: "json_schema", schema: SCHEMA } },
      system:
        "You read photos of dive-shop supplier receipts and invoices and extract the purchased line items. " +
        "For each line, return the quantity in whole units and the cost of a SINGLE unit in Thai Baht " +
        "(if only a line total is shown, divide by the quantity). Match each line to the best catalogue " +
        "product slug from the list you are given; if nothing matches with reasonable confidence, return an " +
        "empty slug. Ignore subtotals, tax lines, shipping, and totals — only real product lines. If the " +
        "image is not a receipt, return an empty lines array.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: image.mediaType as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
                data: image.data,
              },
            },
            {
              type: "text",
              text:
                "Catalogue (slug\\tname\\tbrand), one product per line:\n" +
                catalogue +
                "\n\nExtract the purchased line items from this receipt.",
            },
          ],
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "Could not read the receipt." }, { status: 502 });
    }

    const parsed = JSON.parse(textBlock.text) as ScanResult;
    return NextResponse.json(parsed);
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Receipt reader error (${err.status ?? "unknown"}).` },
        { status: 502 },
      );
    }
    return NextResponse.json({ error: "Failed to read the receipt." }, { status: 500 });
  }
}

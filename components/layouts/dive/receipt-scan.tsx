"use client";

// Scan a supplier receipt → review each detected line → import as stock-in.
// The photo is read by Claude vision (POST /api/dive/scan-receipt); every line
// is editable and deletable before the owner commits it, so a wrong match or a
// mis-read number never lands in the ledger.

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Loader2, Plus, ScanLine, Trash2, Upload, X } from "lucide-react";
import { formatTHB, PRODUCTS, productBySlug, type Product } from "@/lib/layouts/dive/catalog";
import { EntitySearch } from "@/components/layouts/dive/entity-search";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const today = () => format(new Date(), "yyyy-MM-dd");

// Reader models the owner can pick, with the rough per-receipt API cost shown
// so they confirm before spending. Prices are approximate (see docs/route).
const MODELS = [
  { id: "claude-haiku-4-5", label: "Haiku 4.5", price: "~$0.006", blurb: "cheapest — recommended" },
  { id: "claude-opus-4-8", label: "Opus 4.8", price: "~$0.03", blurb: "highest accuracy" },
] as const;
type ModelId = (typeof MODELS)[number]["id"];
const priceOf = (id: ModelId) => MODELS.find((m) => m.id === id)!.price;

export interface ImportRow {
  slug: string;
  qty: number;
  unit: number;
  date: string;
}

interface Draft {
  id: string;
  product: Product | null;
  rawName: string;
  qty: string;
  unit: string;
  confidence: number;
}

interface ApiLine {
  rawName: string;
  slug: string;
  brand: string;
  qty: number;
  unit: number;
  confidence: number;
}
interface ApiResult {
  supplier: string;
  date: string;
  lines: ApiLine[];
}

/** Read a file into a downscaled JPEG data URL (keeps uploads + tokens small). */
function toDownscaledDataUrl(file: File, maxDim = 1600): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error("decode failed"));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no canvas"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

const rid = () => `d-${Date.now()}-${Math.round(Math.random() * 1e6)}`;

export function ReceiptScanImport({ onImport }: { onImport: (rows: ImportRow[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Draft[] | null>(null);
  const [supplier, setSupplier] = useState("");
  const [date, setDate] = useState(today());
  const [model, setModel] = useState<ModelId>("claude-haiku-4-5");
  const [pending, setPending] = useState<string | null>(null); // downscaled image, awaiting confirm

  // Step 1 — a photo was picked: downscale and show the price-confirm card.
  const onFilePicked = useCallback(async (file: File) => {
    setError(null);
    try {
      setPending(await toDownscaledDataUrl(file));
    } catch {
      setError("Couldn't read that image — try another photo.");
    }
  }, []);

  // Step 2 — owner confirmed: send to the reader with the chosen model.
  const runScan = useCallback(async (image: string, modelId: ModelId) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/dive/scan-receipt", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ image, model: modelId }),
      });
      const data = (await res.json()) as ApiResult & { error?: string };
      if (!res.ok) throw new Error(data.error || "Could not read the receipt.");

      const rows: Draft[] = (data.lines ?? []).map((l) => ({
        id: rid(),
        product: (l.slug && productBySlug(l.slug)) || null,
        rawName: l.rawName ?? "",
        qty: l.qty > 0 ? String(l.qty) : "",
        unit: l.unit > 0 ? String(Math.round(l.unit)) : "",
        confidence: l.confidence ?? 0,
      }));

      setSupplier(data.supplier || "");
      setDate(data.date && /^\d{4}-\d{2}-\d{2}$/.test(data.date) ? data.date : today());
      setDrafts(rows.length ? rows : [{ id: rid(), product: null, rawName: "", qty: "", unit: "", confidence: 0 }]);
      setPending(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read the receipt.");
    } finally {
      setBusy(false);
    }
  }, []);

  function patch(id: string, next: Partial<Draft>) {
    setDrafts((prev) => prev && prev.map((d) => (d.id === id ? { ...d, ...next } : d)));
  }
  function remove(id: string) {
    setDrafts((prev) => prev && prev.filter((d) => d.id !== id));
  }
  function addBlank() {
    setDrafts((prev) => [
      ...(prev ?? []),
      { id: rid(), product: null, rawName: "", qty: "", unit: "", confidence: 0 },
    ]);
  }

  const valid = (drafts ?? []).filter(
    (d) => d.product && Number(d.qty) > 0 && Number(d.unit) >= 0,
  );
  const total = valid.reduce((n, d) => n + Number(d.qty) * Number(d.unit), 0);

  function doImport() {
    if (!valid.length) return;
    onImport(valid.map((d) => ({ slug: d.product!.slug, qty: Number(d.qty), unit: Number(d.unit), date })));
    setDrafts(null);
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void onFilePicked(f);
          e.target.value = "";
        }}
      />

      <div className="flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor="scan-model">
          Reader model
        </label>
        <select
          id="scan-model"
          value={model}
          onChange={(e) => setModel(e.target.value as ModelId)}
          disabled={busy}
          className="rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-xs font-medium text-white outline-none focus:border-[#2ed3e8] disabled:opacity-50 [color-scheme:dark]"
        >
          {MODELS.map((m) => (
            <option key={m.id} value={m.id} className="bg-[#04263b]">
              {m.label} · {m.price}/scan
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-xl border border-[#2ed3e8]/40 bg-[#2ed3e8]/10 px-4 py-2.5 text-sm font-bold text-[#2ed3e8] transition hover:bg-[#2ed3e8]/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? <Loader2 className="size-4 animate-spin" /> : <ScanLine className="size-4" />}
          {busy ? "Reading receipt…" : "Scan receipt"}
        </button>
      </div>

      {/* Price-confirm card — shown after a photo is picked, before we spend. */}
      {pending && !busy && (
        <div className="mt-3 flex items-start gap-3 rounded-xl border border-[#2ed3e8]/30 bg-[#2ed3e8]/5 p-3">
          <Image
            src={pending}
            alt="Receipt preview"
            width={56}
            height={72}
            unoptimized
            className="h-[72px] w-14 shrink-0 rounded-lg border border-white/10 object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">
              Read this receipt with {MODELS.find((m) => m.id === model)!.label}?
            </p>
            <p className="mt-0.5 text-xs text-white/60">
              Estimated <span className="font-semibold text-[#2ed3e8]">{priceOf(model)}</span> for this
              scan, billed to the shop&rsquo;s Claude API key.
            </p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => void runScan(pending, model)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2ed3e8] px-3 py-1.5 text-xs font-bold text-[#04263b]"
              >
                <ScanLine className="size-3.5" /> Read receipt ({priceOf(model)})
              </button>
              <button
                type="button"
                onClick={() => setPending(null)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/10"
              >
                <X className="size-3.5" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {error && <p className="mt-2 text-xs text-[#ff8a99]">{error}</p>}

      <Sheet open={!!drafts} onOpenChange={(o) => !o && setDrafts(null)}>
        <SheetContent
          side="right"
          className="flex w-[95vw] max-w-lg flex-col border-white/10 text-white"
          style={{ backgroundColor: "#04263b" }}
        >
          <SheetHeader>
            <SheetTitle className="text-left text-white">Review scanned receipt</SheetTitle>
            <SheetDescription className="sr-only">
              Review, edit, or delete each line read from the receipt before importing it as stock.
            </SheetDescription>
          </SheetHeader>

          <div className="flex min-h-0 flex-1 flex-col px-4 pb-4">
            <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3 text-sm">
              {supplier && <span className="text-white/60">Supplier: <span className="font-semibold text-white">{supplier}</span></span>}
              <label className="ml-auto flex items-center gap-2 text-white/60">
                Date
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-xs text-white outline-none focus:border-[#2ed3e8] [color-scheme:dark]"
                />
              </label>
            </div>

            <p className="mt-3 text-xs font-light text-white/45">
              Check each line — fix the product or numbers, delete anything that isn&rsquo;t stock. Only
              matched lines import.
            </p>

            <ul className="mt-3 flex-1 space-y-3 overflow-y-auto pr-1">
              {(drafts ?? []).map((d) => (
                <li key={d.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <EntitySearch
                        items={PRODUCTS as Product[]}
                        value={d.product}
                        onChange={(p) => patch(d.id, { product: p })}
                        getKey={(p) => p.slug}
                        getLabel={(p) => p.name}
                        getSublabel={(p) => `${p.brand} · sells at ${formatTHB(p.price)}`}
                        getImage={(p) => p.image}
                        placeholder={d.rawName ? `Match “${d.rawName}”…` : "Pick a product…"}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(d.id)}
                      aria-label="Remove line"
                      className="mt-1 shrink-0 rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-[#ff8a99]"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  {!d.product && d.rawName && (
                    <p className="mt-2 text-xs text-[#ffcf8a]">
                      No confident match — printed as “{d.rawName}”. Pick the right product above.
                    </p>
                  )}

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <SmallNum label="Quantity" value={d.qty} onChange={(v) => patch(d.id, { qty: v })} />
                    <SmallNum label="Unit cost (฿)" value={d.unit} onChange={(v) => patch(d.id, { unit: v })} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-white/45">
                      {Number(d.qty) > 0 && Number(d.unit) >= 0
                        ? `${Number(d.qty)} × ${formatTHB(Number(d.unit) || 0)}`
                        : "Line total"}
                    </span>
                    <span className="font-semibold tabular-nums text-white">
                      {formatTHB((Number(d.qty) || 0) * (Number(d.unit) || 0))}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={addBlank}
              className="mt-3 inline-flex items-center gap-2 self-start rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/10"
            >
              <Plus className="size-3.5" /> Add line
            </button>

            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-white/60">
                  {valid.length} of {(drafts ?? []).length} ready
                </span>
                <span className="font-semibold text-white">Total {formatTHB(total)}</span>
              </div>
              <button
                type="button"
                onClick={doImport}
                disabled={!valid.length}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2ed3e8] px-4 py-2.5 text-sm font-bold text-[#04263b] transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Upload className="size-4" style={{ color: "#04263b" }} />
                Import {valid.length || ""} {valid.length === 1 ? "line" : "lines"} to stock
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function SmallNum({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium text-white/55">{label}</span>
      <input
        type="number"
        min={0}
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full rounded-lg border border-white/15 bg-white/5 px-2.5 py-2 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#2ed3e8]",
        )}
      />
    </label>
  );
}

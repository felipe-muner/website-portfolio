/**
 * Renders one seamless-loop scroll clip per captured template.
 *
 * Reads public/img/rail/manifest.json (written by capture-templates.ts) for each
 * shot's source height, bundles the Remotion project once, then renders the
 * "RailClip" composition per slug → public/video/rail/<slug>.mp4.
 *
 *   npm run rail:render              # all captured templates
 *   npm run rail:render -- gym-v1    # only matching slugs
 */
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { ALL_SITES } from "../lib/layouts/registry";
import { slugFor } from "./capture-templates";

const RAIL_DIR = path.join(process.cwd(), "public", "img", "rail");
const OUT_DIR = path.join(process.cwd(), "public", "video", "rail");

interface Manifest {
  viewport: { width: number; height: number };
  shots: Array<{ slug: string; height: number }>;
}

/** Map slug → display name, so the fake browser URL bar reads nicely. */
const LABELS = new Map(ALL_SITES.map((s) => [slugFor(s), s.name]));

async function main() {
  const filters = process.argv.slice(2).filter((a) => !a.startsWith("-"));

  const manifest: Manifest = JSON.parse(
    await readFile(path.join(RAIL_DIR, "manifest.json"), "utf8"),
  );
  const shots = filters.length
    ? manifest.shots.filter((s) => filters.some((f) => s.slug.includes(f)))
    : manifest.shots;

  if (!shots.length) {
    console.error(`No captured shots matched: ${filters.join(", ")}`);
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });
  console.log(`Bundling Remotion project…`);
  const serveUrl = await bundle({
    entryPoint: path.join(process.cwd(), "remotion", "index.ts"),
    // Keep the default webpack config; project uses Tailwind v4 only in Next.
  });

  console.log(`Rendering ${shots.length} clip(s) → public/video/rail/\n`);
  const failed: string[] = [];

  for (const [i, shot] of shots.entries()) {
    const label = `[${String(i + 1).padStart(2)}/${shots.length}] ${shot.slug}`;
    const inputProps = {
      slug: shot.slug,
      srcWidth: manifest.viewport.width,
      srcHeight: shot.height,
      label: LABELS.get(shot.slug) ?? shot.slug,
    };
    try {
      const composition = await selectComposition({
        serveUrl,
        id: "RailClip",
        inputProps,
      });
      await renderMedia({
        serveUrl,
        composition,
        codec: "h264",
        // Small, muted, autoplay-friendly loop cards; CRF trades a little
        // sharpness for a much smaller payload across 45 videos.
        crf: 26,
        outputLocation: path.join(OUT_DIR, `${shot.slug}.mp4`),
        inputProps,
        overwrite: true,
      });
      console.log(`${label}  ok`);
    } catch (err) {
      const reason = err instanceof Error ? err.message.split("\n")[0] : String(err);
      failed.push(`${shot.slug} — ${reason}`);
      console.log(`${label}  FAILED  ${reason}`);
    }
  }

  console.log(`\nRendered ${shots.length - failed.length}/${shots.length}`);
  if (failed.length) {
    for (const f of failed) console.log(`  ${f}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

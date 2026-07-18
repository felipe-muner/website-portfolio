/**
 * Captures a full-page screenshot of every template in the portfolio registry.
 *
 * Output: public/img/rail/<slug>.png — consumed by the Remotion "TemplateScroll"
 * composition, which pans down these tall images to fake a real page scroll.
 *
 *   npm run rail:capture              # all templates
 *   npm run rail:capture -- gym-v1    # only matching slugs
 *
 * Requires the dev server on BASE_URL (default http://localhost:3000).
 */
import { chromium, type Browser, type Page } from "@playwright/test";
import sharp from "sharp";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { ALL_SITES, type PortfolioSite } from "../lib/layouts/registry";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const OUT_DIR = path.join(process.cwd(), "public", "img", "rail");

/** Capture viewport. Height is the "window"; the shot itself is full-page. */
const VIEWPORT = { width: 1440, height: 900 } as const;
const SCALE = 1.5;

/** Cap very long pages — beyond this the scroll pan reads as a blur anyway. */
const MAX_HEIGHT = 5200;

/** Give heroes, fonts, and entrance animations time to settle before shooting. */
const SETTLE_MS = 2200;

export function slugFor(site: PortfolioSite): string {
  if (site.external) {
    return new URL(site.href).hostname.replace(/^www\./, "").split(".")[0];
  }
  return site.href.replace(/^\//, "").replace(/\//g, "-");
}

function urlFor(site: PortfolioSite): string {
  return site.external ? site.href : `${BASE_URL}${site.href}`;
}

async function capture(page: Page, site: PortfolioSite): Promise<number> {
  const slug = slugFor(site);
  // "load" over "networkidle": templates with looping video or polling widgets
  // never go idle, and the fixed settle below covers what idle would have.
  await page.goto(urlFor(site), { waitUntil: "load", timeout: 45_000 });

  // Scroll the whole page once so lazy/in-view content mounts, then return to
  // top. Driven from the Playwright side (mouse wheel) rather than an in-page
  // eval loop: some templates client-navigate during hydration, which destroys
  // an in-page execution context but leaves wheel scrolling unaffected.
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < pageHeight; y += VIEWPORT.height) {
    await page.mouse.wheel(0, VIEWPORT.height);
    await page.waitForTimeout(90);
  }
  await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
  await page.waitForTimeout(SETTLE_MS);

  // Freeze motion so the shot is deterministic between runs, and drop the
  // dev-only overlays (template switcher, Next.js dev badge) that would
  // otherwise be burned into the rail video.
  await page.addStyleTag({
    content: `*, *::before, *::after {
      animation-play-state: paused !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }
    [data-capture-hide],
    [data-nextjs-toast],
    [data-next-badge-root],
    nextjs-portal { display: none !important; }`,
  });

  const height = Math.min(
    await page.evaluate(() => document.body.scrollHeight),
    MAX_HEIGHT,
  );

  // fullPage (not clip): clip is clamped to the viewport, so it only ever
  // captures the top screen. fullPage keeps the viewport at 900px — so h-screen
  // heroes stay correct — while capturing the entire scroll height. Then crop
  // to the cap with sharp, since fullPage ignores any height limit.
  const full = await page.screenshot({ fullPage: true, type: "png" });
  const maxPx = Math.round(MAX_HEIGHT * SCALE);
  const img = sharp(full);
  const meta = await img.metadata();
  const buf =
    meta.height && meta.height > maxPx
      ? await img.extract({ left: 0, top: 0, width: meta.width, height: maxPx }).png().toBuffer()
      : full;
  await writeFile(path.join(OUT_DIR, `${slug}.png`), buf);
  return height;
}

async function main() {
  const filters = process.argv.slice(2).filter((a) => !a.startsWith("-"));
  const targets = filters.length
    ? ALL_SITES.filter((s) => filters.some((f) => slugFor(s).includes(f)))
    : ALL_SITES;

  if (!targets.length) {
    console.error(`No templates matched: ${filters.join(", ")}`);
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });
  console.log(`Capturing ${targets.length} template(s) → public/img/rail/\n`);

  let browser: Browser | undefined;
  const failed: Array<{ slug: string; reason: string }> = [];
  const manifest: Array<{ slug: string; height: number }> = [];

  try {
    browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { ...VIEWPORT },
      deviceScaleFactor: SCALE,
      // Templates key off this for weather/moon widgets; pin it so shots repeat.
      timezoneId: "Asia/Bangkok",
      reducedMotion: "reduce",
    });
    for (const [i, site] of targets.entries()) {
      const slug = slugFor(site);
      const label = `[${String(i + 1).padStart(2)}/${targets.length}] ${slug}`;
      let lastErr: unknown;
      for (let attempt = 1; attempt <= 2; attempt++) {
        // Fresh page per attempt: some templates client-navigate on hydration,
        // and a reused page lets a prior page's pending navigation destroy the
        // next capture's context. Isolation makes each shot deterministic.
        const page = await context.newPage();
        // Every template mounts a NextAuth SessionProvider. In this headless
        // context the session fetch fails, and its retry loop renavigates the
        // frame every ~500ms — destroying the execution context mid-capture.
        // Short-circuit the endpoint to a null session so it settles at once.
        await page.route("**/api/auth/session", (r) =>
          r.fulfill({ status: 200, contentType: "application/json", body: "{}" }),
        );
        try {
          const height = await capture(page, site);
          manifest.push({ slug, height });
          console.log(`${label}  ok  ${VIEWPORT.width}×${height}${attempt > 1 ? "  (retry)" : ""}`);
          lastErr = undefined;
          break;
        } catch (err) {
          lastErr = err;
        } finally {
          await page.close();
        }
      }
      if (lastErr) {
        const reason = lastErr instanceof Error ? lastErr.message.split("\n")[0] : String(lastErr);
        failed.push({ slug, reason });
        console.log(`${label}  FAILED  ${reason}`);
      }
    }
  } finally {
    await browser?.close();
  }

  // The rail render needs each shot's real height to compute its pan distance.
  // Merge into any existing manifest so a partial re-capture (a few slugs)
  // doesn't drop entries for shots it didn't touch this run.
  const prior: Array<{ slug: string; height: number }> = await readFile(
    path.join(OUT_DIR, "manifest.json"),
    "utf8",
  )
    .then((raw) => JSON.parse(raw).shots ?? [])
    .catch(() => []);
  const merged = new Map(prior.map((s) => [s.slug, s]));
  for (const s of manifest) merged.set(s.slug, s);

  await writeFile(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify(
      { viewport: VIEWPORT, scale: SCALE, shots: [...merged.values()] },
      null,
      2,
    ),
  );

  console.log(`\nCaptured ${manifest.length}/${targets.length}`);
  if (failed.length) {
    console.log(`Failed ${failed.length}:`);
    for (const f of failed) console.log(`  ${f.slug} — ${f.reason}`);
    process.exit(1);
  }
}

// Only run when executed directly (`bun scripts/capture-templates.ts`), not
// when render-rail.ts imports slugFor from this module. `import.meta.main` is a
// Bun runtime flag that TypeScript's lib doesn't declare.
if ((import.meta as { main?: boolean }).main) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

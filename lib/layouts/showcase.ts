// Data for the /showcase page: which templates play as horizontal-rail videos
// and which fill the static grid below. Everything is derived from the single
// PORTFOLIO registry so names, hrefs and categories never drift out of sync.

import { PORTFOLIO, type PortfolioSite } from "./registry";

export interface ShowcaseEntry {
  slug: string;
  href: string;
  name: string;
  brand: string;
  detail: string;
  category: string;
  cover: string;
  external: boolean;
}

/**
 * The slug used for a template's captured assets (public/img/rail/<slug>.png,
 * public/video/rail/<slug>.mp4). Mirrors slugFor() in scripts/capture-templates.
 */
export function railSlug(site: PortfolioSite): string {
  if (site.external) {
    return new URL(site.href).hostname.replace(/^www\./, "").split(".")[0];
  }
  return site.href.replace(/^\//, "").replace(/\//g, "-");
}

const ALL: ShowcaseEntry[] = PORTFOLIO.flatMap((group) =>
  group.sites.map((site) => ({
    slug: railSlug(site),
    href: site.href,
    name: site.name,
    brand: site.brand,
    detail: site.detail,
    category: group.label,
    cover: site.cover,
    external: site.external ?? false,
  })),
);

const BY_SLUG = new Map(ALL.map((e) => [e.slug, e]));

/** Every template, in registry order — used by the /portfolio scroll rail. */
export const TEMPLATES: ShowcaseEntry[] = ALL;

/**
 * Slugs that have a rendered scroll-through clip in public/video/rail/.
 * Templates not listed here fall back to an auto-panning full-page screenshot.
 */
export const VIDEO_SLUGS = new Set<string>([
  "barber",
  "beachclub",
  "biosphere",
  "biosphere-field",
  "coaching",
  "dive",
  "gym-v1",
  "restaurant",
  "studio",
  "villa-v7",
  "yoga-v1",
]);

export function hasRailVideo(slug: string): boolean {
  return VIDEO_SLUGS.has(slug);
}

/**
 * Contrasting card treatments cycled across the horizontal rails so each
 * template reads as visibly distinct from its neighbours (instead of dark
 * frames disappearing into a dark page).
 */
export interface RailTheme {
  bg: string;
  text: string;
  sub: string;
  accent: string;
  ring: string;
  dots: string;
}

export const RAIL_THEMES: RailTheme[] = [
  { bg: "#f4efe1", text: "#17130f", sub: "rgba(23,19,15,0.55)", accent: "#c2410c", ring: "rgba(0,0,0,0.12)", dots: "rgba(0,0,0,0.22)" },
  { bg: "#211d1a", text: "#f4f1ea", sub: "rgba(244,241,234,0.55)", accent: "#f97316", ring: "rgba(255,255,255,0.14)", dots: "rgba(255,255,255,0.28)" },
  { bg: "#2c1810", text: "#ffe7d2", sub: "rgba(255,231,210,0.6)", accent: "#fb923c", ring: "rgba(255,255,255,0.14)", dots: "rgba(255,255,255,0.28)" },
  { bg: "#e6e1d2", text: "#1c1a14", sub: "rgba(28,26,20,0.55)", accent: "#b45309", ring: "rgba(0,0,0,0.12)", dots: "rgba(0,0,0,0.22)" },
  { bg: "#132019", text: "#e6efe6", sub: "rgba(230,239,230,0.6)", accent: "#a3e635", ring: "rgba(255,255,255,0.14)", dots: "rgba(255,255,255,0.26)" },
  { bg: "#1a1622", text: "#efe9f4", sub: "rgba(239,233,244,0.6)", accent: "#c084fc", ring: "rgba(255,255,255,0.14)", dots: "rgba(255,255,255,0.26)" },
];

/**
 * Curated set that plays as looping scroll videos in the horizontal rail.
 * Order is deliberate — alternating light/dark and category for visual rhythm.
 * Each slug must have a rendered clip in public/video/rail/.
 */
export const RAIL_SLUGS = [
  "gym-v1",
  "yoga-v1",
  "villa-v7",
  "restaurant",
  "dive",
  "studio",
  "barber",
  "biosphere-field",
  "beachclub",
  "coaching",
] as const;

export const RAIL: ShowcaseEntry[] = RAIL_SLUGS.map((slug) => {
  const entry = BY_SLUG.get(slug);
  if (!entry) throw new Error(`showcase: unknown rail slug "${slug}"`);
  return entry;
});

/** Everything not in the rail, shown as static cover cards in the grid. */
export const GRID: ShowcaseEntry[] = ALL.filter(
  (e) => !RAIL_SLUGS.includes(e.slug as (typeof RAIL_SLUGS)[number]),
);

export const TOTAL = ALL.length;

// Data for the /showcase page: one grid of every template, curated lead first,
// with looping clips for the slugs in VIDEO_SLUGS. Everything is derived from the single
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

/** The newest showpieces lead the /portfolio rail; the rest follow in registry order. */
const RAIL_LEAD = ["artist", "goldenhour", "brasa", "blacklotus", "gym-v6", "yoga-v6", "beanbowl", "aircon"];

/** Every template — used by the /portfolio scroll rail. */
export const TEMPLATES: ShowcaseEntry[] = [
  ...RAIL_LEAD.map((slug) => BY_SLUG.get(slug)).filter((e): e is ShowcaseEntry => e !== undefined),
  ...ALL.filter((e) => !RAIL_LEAD.includes(e.slug)),
];

/**
 * Slugs that have a rendered scroll-through clip in public/video/rail/.
 * Templates not listed here fall back to an auto-panning full-page screenshot.
 */
export const VIDEO_SLUGS = new Set<string>([
  "aircon",
  "barber",
  "beachclub",
  "biosphere",
  "biosphere-field",
  "coaching",
  "dive",
  "gym-v1",
  "gym-v6",
  "restaurant",
  "studio",
  "villa-v7",
  "yoga-v1",
  "yoga-v5",
  "yoga-v6",
]);

export function hasRailVideo(slug: string): boolean {
  return VIDEO_SLUGS.has(slug);
}

/**
 * Curated lead of the /showcase grid: the templates with the strongest clips,
 * alternating light/dark and category. Each slug must have a clip in
 * public/video/rail/.
 */
export const SHOWCASE_LEAD = [
  "gym-v1",
  "yoga-v5",
  "villa-v7",
  "restaurant",
  "dive",
  "studio",
  "barber",
  "biosphere-field",
  "beachclub",
  "coaching",
] as const;

const LEAD_SET = new Set<string>(SHOWCASE_LEAD);

/** Every template for the /showcase grid: the curated lead first, then the rest. */
export const SHOWCASE: ShowcaseEntry[] = [
  ...SHOWCASE_LEAD.map((slug) => {
    const entry = BY_SLUG.get(slug);
    if (!entry) throw new Error(`showcase: unknown lead slug "${slug}"`);
    return entry;
  }),
  ...ALL.filter((e) => !LEAD_SET.has(e.slug)),
];

export const TOTAL = ALL.length;

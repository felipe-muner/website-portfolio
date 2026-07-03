// Catalogue for Aqua Sport Supply — the dive shop. Product data is REAL,
// pulled from the partner store aquamaster.net (WooCommerce Store API) and
// curated in lib/layouts/dive/catalog-data.ts. Images are hotlinked from
// aquamaster.net (host allowlisted in next.config). Prices are whole Thai Baht.

import { DIVE_PRODUCTS } from "@/lib/layouts/dive/catalog-data";

export type Category =
  | "masks"
  | "fins"
  | "wetsuits"
  | "regulators"
  | "bcds"
  | "computers"
  | "accessories";

export type GearArt =
  | "mask"
  | "fins"
  | "wetsuit"
  | "regulator"
  | "bcd"
  | "computer"
  | "accessory";

export interface CategoryInfo {
  slug: Category;
  label: string;
  blurb: string;
  /** Fallback vector illustration (used for category chips / missing images). */
  art: GearArt;
}

export const CATEGORIES: readonly CategoryInfo[] = [
  { slug: "masks", label: "Masks & Snorkels", blurb: "Low-volume masks, goggles and dry snorkels for a crystal window on the reef.", art: "mask" },
  { slug: "fins", label: "Fins", blurb: "Blades and travel fins that turn kicks into effortless glide.", art: "fins" },
  { slug: "wetsuits", label: "Wetsuits & Wear", blurb: "Neoprene, hoods, boots and rash guards tuned for warm tropical water.", art: "wetsuit" },
  { slug: "regulators", label: "Regulators", blurb: "Balanced first and second stages that breathe easy at depth.", art: "regulator" },
  { slug: "bcds", label: "BCDs", blurb: "Jacket and back-inflate buoyancy for trim you don't think about.", art: "bcd" },
  { slug: "computers", label: "Dive Computers", blurb: "Wrist and console computers to track no-deco time and nitrox.", art: "computer" },
  { slug: "accessories", label: "Accessories", blurb: "Torches, instruments, bags and the little things that save a dive.", art: "accessory" },
] as const;

export function categoryBySlug(slug: string): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export interface Product {
  slug: string;
  name: string;
  /** Brand string (derived from the source catalogue). */
  brand: string;
  category: Category;
  /** Price in whole Thai Baht. */
  price: number;
  /** Original price when on sale (whole Baht). */
  compareAt?: number;
  /** Hotlinked product photo URL. */
  image: string;
  imageAlt?: string;
  /** Optional short pitch. */
  blurb?: string;
  tags?: string[];
  bestseller?: boolean;
}

export const PRODUCTS: readonly Product[] = DIVE_PRODUCTS;

/** All brands present in the catalogue, alphabetically. */
export const BRANDS: readonly string[] = [...new Set(PRODUCTS.map((p) => p.brand))].sort((a, b) =>
  a.localeCompare(b),
);

export function productBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function productsByCategory(category: Category): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

/** Related products — same category first, then same brand. */
export function relatedProducts(p: Product, limit = 4): Product[] {
  const sameCategory = PRODUCTS.filter((x) => x.slug !== p.slug && x.category === p.category);
  const sameBrand = PRODUCTS.filter(
    (x) => x.slug !== p.slug && x.category !== p.category && x.brand === p.brand,
  );
  return [...sameCategory, ...sameBrand].slice(0, limit);
}

// ---------------------------------------------------------------------------
// Pricing / shipping
// ---------------------------------------------------------------------------

/** Free island delivery over this many Baht; a flat fee applies below it. */
export const FREE_SHIPPING_OVER = 8000;
export const FLAT_SHIPPING = 250;

export function shippingFor(subtotal: number): number {
  if (subtotal === 0) return 0;
  return subtotal >= FREE_SHIPPING_OVER ? 0 : FLAT_SHIPPING;
}

const BAHT = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** Formats whole Baht as "฿12,450". */
export function formatTHB(baht: number): string {
  return `฿${BAHT.format(baht)}`;
}

const INT = new Intl.NumberFormat("en-US");

export function formatInt(n: number): string {
  return INT.format(n);
}

/** Discount percentage vs. the compare-at price, rounded (0 if none). */
export function discountPct(p: Product): number {
  if (!p.compareAt || p.compareAt <= p.price) return 0;
  return Math.round((1 - p.price / p.compareAt) * 100);
}

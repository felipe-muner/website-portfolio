// Catálogo da Sacolaria Brasil — loja B2B fictícia de sacolas plásticas (template do portfólio).
// Preços baseados nas referências (bullplastic / soluçõesemembalagens), em pt-BR.
// Todo valor monetário é guardado em CENTAVOS (inteiro) para evitar erro de ponto flutuante.

export type Family = "boca-palhaco" | "camiseta" | "reciclada";

export interface Category {
  slug: Family;
  label: string;
  /** Texto curto para tiles/headers. */
  blurb: string;
  /** Tipo de arte/ilustração usada nos cards. */
  art: "die-cut" | "tshirt";
}

export const CATEGORIES: readonly Category[] = [
  {
    slug: "boca-palhaco",
    label: "Sacola Boca de Palhaço",
    blurb: "Alça vazada reforçada, acabamento premium para lojas e boutiques.",
    art: "die-cut",
  },
  {
    slug: "camiseta",
    label: "Sacola Alça Camiseta",
    blurb: "A clássica sacola de mercado e delivery — resistente e econômica.",
    art: "tshirt",
  },
  {
    slug: "reciclada",
    label: "Sacola Camiseta Reciclada",
    blurb: "Linha sustentável em plástico reciclado, com selo de reaproveitamento.",
    art: "tshirt",
  },
] as const;

export function categoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

// ---------------------------------------------------------------------------
// Cores
// ---------------------------------------------------------------------------

export type ColorName =
  | "Branca"
  | "Preta"
  | "Azul"
  | "Amarela"
  | "Laranja"
  | "Rosa"
  | "Rosa Pink"
  | "Bronze"
  | "Transparente"
  | "Verde";

export interface ColorSwatch {
  name: ColorName;
  /** Cor de preenchimento da ilustração da sacola. */
  hex: string;
  /** Sacolas claras precisam de contorno para aparecer no fundo branco. */
  needsOutline?: boolean;
  /** Transparente recebe tratamento especial (semi-opaco). */
  translucent?: boolean;
}

export const COLORS: Record<ColorName, ColorSwatch> = {
  Branca: { name: "Branca", hex: "#f3f3f0", needsOutline: true },
  Preta: { name: "Preta", hex: "#1f2024" },
  Azul: { name: "Azul", hex: "#1e5bd6" },
  Amarela: { name: "Amarela", hex: "#f5c518" },
  Laranja: { name: "Laranja", hex: "#f36100" },
  Rosa: { name: "Rosa", hex: "#f2a0bd" },
  "Rosa Pink": { name: "Rosa Pink", hex: "#e6197f" },
  Bronze: { name: "Bronze", hex: "#8a6d3b" },
  Transparente: { name: "Transparente", hex: "#dfeaf2", needsOutline: true, translucent: true },
  Verde: { name: "Verde", hex: "#2f8f57" },
};

const FULL_COLORS: ColorName[] = [
  "Branca",
  "Preta",
  "Azul",
  "Amarela",
  "Laranja",
  "Rosa",
  "Rosa Pink",
  "Bronze",
  "Transparente",
];

const RECYCLED_COLORS: ColorName[] = ["Verde", "Preta", "Branca"];

// ---------------------------------------------------------------------------
// Tiers de embalagem (quantidade de unidades por pacote)
// O preço-base de cada produto é o pacote de 100 unidades. Pacotes maiores
// têm preço por unidade menor (desconto por volume).
// ---------------------------------------------------------------------------

export interface PackTier {
  units: number;
  /** Multiplicador do preço por unidade (volume = mais barato). */
  unitMultiplier: number;
}

export const PACK_TIERS: readonly PackTier[] = [
  { units: 50, unitMultiplier: 1.12 },
  { units: 100, unitMultiplier: 1.0 },
  { units: 250, unitMultiplier: 0.94 },
  { units: 500, unitMultiplier: 0.88 },
  { units: 1000, unitMultiplier: 0.82 },
] as const;

export const DEFAULT_PACK_UNITS = 100;

export function tierByUnits(units: number): PackTier {
  return PACK_TIERS.find((t) => t.units === units) ?? PACK_TIERS[1];
}

// ---------------------------------------------------------------------------
// Produtos
// ---------------------------------------------------------------------------

export interface Product {
  slug: string;
  family: Family;
  /** "30x40" */
  size: string;
  /** Preço do pacote de 100 unidades, em centavos. */
  pricePer100: number;
  colors: ColorName[];
  /** Material/descrição curta. */
  material: string;
  bestseller?: boolean;
}

function makeProduct(
  family: Family,
  size: string,
  pricePer100: number,
  colors: ColorName[],
  material: string,
  bestseller = false,
): Product {
  return { slug: `${family}-${size}`, family, size, pricePer100, colors, material, bestseller };
}

const PEAD = "Plástico PEAD virgem, alta resistência";
const PEBD = "Plástico PEBD flexível, toque macio";
const RECICLADO = "Plástico 100% reciclado, certificado";

export const PRODUCTS: readonly Product[] = [
  // Boca de Palhaço
  makeProduct("boca-palhaco", "16x22", 1319, FULL_COLORS, PEBD),
  makeProduct("boca-palhaco", "20x30", 1442, FULL_COLORS, PEBD, true),
  makeProduct("boca-palhaco", "25x35", 1829, FULL_COLORS, PEBD),
  makeProduct("boca-palhaco", "30x40", 2889, FULL_COLORS, PEBD, true),
  makeProduct("boca-palhaco", "36x48", 3709, FULL_COLORS, PEBD),
  makeProduct("boca-palhaco", "40x50", 4585, FULL_COLORS, PEBD),
  // Alça Camiseta
  makeProduct("camiseta", "25x35", 991, FULL_COLORS, PEAD, true),
  makeProduct("camiseta", "30x40", 1633, FULL_COLORS, PEAD, true),
  makeProduct("camiseta", "35x45", 1481, FULL_COLORS, PEAD),
  makeProduct("camiseta", "40x50", 2544, FULL_COLORS, PEAD, true),
  makeProduct("camiseta", "45x60", 3350, FULL_COLORS, PEAD),
  makeProduct("camiseta", "50x60", 4985, FULL_COLORS, PEAD),
  makeProduct("camiseta", "50x70", 3519, FULL_COLORS, PEAD),
  makeProduct("camiseta", "60x80", 5436, FULL_COLORS, PEAD),
  makeProduct("camiseta", "70x90", 7578, FULL_COLORS, PEAD),
  makeProduct("camiseta", "90x100", 11009, ["Branca", "Preta", "Transparente"], PEAD),
  // Reciclada
  makeProduct("reciclada", "30x40", 973, RECYCLED_COLORS, RECICLADO, true),
  makeProduct("reciclada", "40x50", 1451, RECYCLED_COLORS, RECICLADO),
  makeProduct("reciclada", "50x60", 2050, RECYCLED_COLORS, RECICLADO),
  makeProduct("reciclada", "60x80", 3127, RECYCLED_COLORS, RECICLADO),
] as const;

export function productBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

/** Nome completo de exibição: "Sacola Alça Camiseta 30x40". */
export function productName(p: Product): string {
  const cat = categoryBySlug(p.family);
  return `${cat?.label ?? "Sacola"} ${p.size}`;
}

// ---------------------------------------------------------------------------
// Preço
// ---------------------------------------------------------------------------

/** Pix dá 5% de desconto, como nas referências. */
export const PIX_DISCOUNT = 0.05;

/** Pedido mínimo (em centavos) — exibido como "Pedido mínimo". */
export const MIN_ORDER = 25000; // R$ 250,00

/** Preço de UM pacote no tier informado, em centavos. */
export function packPrice(product: Product, units: number): number {
  const tier = tierByUnits(units);
  const unitPrice = product.pricePer100 / 100; // centavos por unidade @100
  return Math.round(units * unitPrice * tier.unitMultiplier);
}

/** Preço por unidade no tier, em centavos (pode ter fração). */
export function unitPrice(product: Product, units: number): number {
  return packPrice(product, units) / units;
}

export function applyPix(cents: number): number {
  return Math.round(cents * (1 - PIX_DISCOUNT));
}

export interface Installment {
  count: number;
  /** Valor de cada parcela, em centavos. */
  each: number;
}

const MIN_INSTALLMENT = 500; // R$ 5,00 por parcela
const MAX_INSTALLMENTS = 12;

/** Maior parcelamento sem juros possível (parcela mínima R$ 5, até 12x). */
export function installments(totalCents: number): Installment {
  let count = Math.min(MAX_INSTALLMENTS, Math.max(1, Math.floor(totalCents / MIN_INSTALLMENT)));
  if (count < 1) count = 1;
  return { count, each: Math.round(totalCents / count) };
}

// ---------------------------------------------------------------------------
// Formatação
// ---------------------------------------------------------------------------

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** Formata centavos como "R$ 28,89". */
export function formatBRL(cents: number): string {
  return BRL.format(cents / 100);
}

const INT = new Intl.NumberFormat("pt-BR");

export function formatInt(n: number): string {
  return INT.format(n);
}

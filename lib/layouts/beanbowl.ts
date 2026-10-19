// FICTIONAL content for the Bean & Bowl café template (/beanbowl): an
// all-day island café — specialty coffee and smoothie bowls. Every origin,
// dish and price here is invented.

export interface Origin {
  name: string;
  region: string;
  process: string;
  roast: string;
  notes: readonly string[];
}

export const ORIGINS: readonly Origin[] = [
  { name: "Doi Chang", region: "Chiang Rai, Thailand", process: "Honey", roast: "Medium", notes: ["Cacao", "Plum", "Brown sugar"] },
  { name: "Sidama", region: "Ethiopia", process: "Washed", roast: "Light", notes: ["Jasmine", "Peach", "Bergamot"] },
  { name: "Huila", region: "Colombia", process: "Natural", roast: "Medium", notes: ["Caramel", "Cherry", "Orange zest"] },
] as const;

export const MENU_CATEGORIES = ["Coffee", "Bowls", "Toast & eggs", "Bakery", "Cold drinks"] as const;
export type MenuCategory = (typeof MENU_CATEGORIES)[number];

export const DIET_TAGS = ["Vegan", "Veggie", "GF", "Spicy"] as const;
export type DietTag = (typeof DIET_TAGS)[number];

export interface MenuItem {
  name: string;
  detail: string;
  /** Thai Baht. */
  price: number;
  category: MenuCategory;
  tags: readonly DietTag[];
  image: string;
}

export const MENU: readonly MenuItem[] = [
  { name: "Espresso", detail: "A double of the Doi Chang house blend.", price: 70, category: "Coffee", tags: ["Vegan", "GF"], image: "/img/layouts/beanbowl-espresso.jpg" },
  { name: "Flat white", detail: "Ristretto and silky milk — oat at no extra charge.", price: 95, category: "Coffee", tags: ["Veggie", "GF"], image: "/img/layouts/beanbowl-flat-white.jpg" },
  { name: "Cappuccino", detail: "The classic, with a cocoa dusting.", price: 90, category: "Coffee", tags: ["Veggie", "GF"], image: "/img/layouts/beanbowl-cappuccino.jpg" },
  { name: "Pour-over", detail: "Single origin of the week, brewed to order.", price: 120, category: "Coffee", tags: ["Vegan", "GF"], image: "/img/layouts/beanbowl-pour-over.jpg" },
  { name: "Coconut cold brew", detail: "18-hour cold brew over young coconut water.", price: 130, category: "Coffee", tags: ["Vegan", "GF"], image: "/img/layouts/beanbowl-cold-brew.jpg" },
  { name: "Dirty matcha", detail: "Ceremonial matcha, oat milk and a shot.", price: 135, category: "Coffee", tags: ["Vegan", "GF"], image: "/img/layouts/beanbowl-dirty-matcha.jpg" },
  { name: "Island açaí", detail: "Açaí, banana, granola, coconut flakes and honey.", price: 220, category: "Bowls", tags: ["Veggie"], image: "/img/layouts/beanbowl-island-acai.jpg" },
  { name: "Mango tango", detail: "Mango base, kiwi, chia and toasted coconut.", price: 210, category: "Bowls", tags: ["Vegan", "GF"], image: "/img/layouts/beanbowl-mango-tango.jpg" },
  { name: "Dragon bowl", detail: "Pitaya base, berries, banana and cacao nibs.", price: 230, category: "Bowls", tags: ["Vegan", "GF"], image: "/img/layouts/beanbowl-dragon-bowl.jpg" },
  { name: "Poke of the day", detail: "Seared tuna, sushi rice, edamame, pickled ginger.", price: 260, category: "Bowls", tags: ["GF", "Spicy"], image: "/img/layouts/beanbowl-poke.jpg" },
  { name: "Smashed avo", detail: "Sourdough, lime, chilli flakes and a poached egg.", price: 190, category: "Toast & eggs", tags: ["Veggie", "Spicy"], image: "/img/layouts/beanbowl-smashed-avo.jpg" },
  { name: "Shakshuka", detail: "Eggs baked in spiced tomato, feta and flatbread.", price: 210, category: "Toast & eggs", tags: ["Veggie", "Spicy"], image: "/img/layouts/beanbowl-shakshuka.jpg" },
  { name: "Big island breakfast", detail: "Eggs, bacon, mushrooms, beans and toast.", price: 260, category: "Toast & eggs", tags: [], image: "/img/layouts/beanbowl-big-breakfast.jpg" },
  { name: "Banana bread", detail: "Toasted, with salted butter and honey.", price: 110, category: "Bakery", tags: ["Veggie"], image: "/img/layouts/beanbowl-banana-bread.jpg" },
  { name: "Almond croissant", detail: "Twice-baked, every morning.", price: 95, category: "Bakery", tags: ["Veggie"], image: "/img/layouts/beanbowl-almond-croissant.jpg" },
  { name: "Cardamom bun", detail: "Swedish-style, warm until ten.", price: 85, category: "Bakery", tags: ["Veggie"], image: "/img/layouts/beanbowl-cardamom-bun.jpg" },
  { name: "Green machine", detail: "Kale, apple, cucumber, ginger and lime.", price: 140, category: "Cold drinks", tags: ["Vegan", "GF"], image: "/img/layouts/beanbowl-green-machine.jpg" },
  { name: "Thai iced tea", detail: "Slow-steeped, with coconut condensed milk.", price: 90, category: "Cold drinks", tags: ["Vegan", "GF"], image: "/img/layouts/beanbowl-thai-iced-tea.jpg" },
  { name: "Fresh coconut", detail: "Straight from the shell.", price: 80, category: "Cold drinks", tags: ["Vegan", "GF"], image: "/img/layouts/beanbowl-fresh-coconut.jpg" },
] as const;

/* ------------------------------------------------------------------ */
/* The bowl builder                                                     */
/* ------------------------------------------------------------------ */

export type BaseKey = "acai" | "mango" | "pitaya";

export interface BowlBase {
  key: BaseKey;
  name: string;
  price: number;
  /** Smoothie colour, also the swatch. */
  color: string;
}

export const BOWL_BASES: readonly BowlBase[] = [
  { key: "acai", name: "Açaí", price: 160, color: "#4b2152" },
  { key: "mango", name: "Mango", price: 150, color: "#f0a12e" },
  { key: "pitaya", name: "Pitaya", price: 170, color: "#d63374" },
] as const;

export type ToppingKey =
  | "banana"
  | "strawberry"
  | "blueberry"
  | "kiwi"
  | "mango"
  | "granola"
  | "coconut"
  | "chia"
  | "honey";

export interface Topping {
  key: ToppingKey;
  name: string;
  price: number;
  swatch: string;
  /** On the house bowl. */
  standard: boolean;
}

export const TOPPINGS: readonly Topping[] = [
  { key: "banana", name: "Banana", price: 20, swatch: "#f1dea0", standard: true },
  { key: "strawberry", name: "Strawberry", price: 40, swatch: "#d7263d", standard: true },
  { key: "blueberry", name: "Blueberries", price: 50, swatch: "#30356f", standard: true },
  { key: "kiwi", name: "Kiwi", price: 30, swatch: "#7bb33a", standard: false },
  { key: "mango", name: "Mango cubes", price: 30, swatch: "#f6a623", standard: false },
  { key: "granola", name: "Granola", price: 25, swatch: "#b07a3c", standard: true },
  { key: "coconut", name: "Coconut flakes", price: 15, swatch: "#f3eee3", standard: true },
  { key: "chia", name: "Chia seeds", price: 10, swatch: "#2b2a28", standard: false },
  { key: "honey", name: "Honey drizzle", price: 15, swatch: "#e5a12a", standard: true },
] as const;

export const HOURS = { days: "Every day", open: "07:00", close: "16:00", kitchen: "Kitchen closes 15:30" } as const;

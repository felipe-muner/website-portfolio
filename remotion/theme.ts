import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadArchivo } from "@remotion/google-fonts/Archivo";

// Brand tokens — mirror the /portfolio + /work pages.
export const COLORS = {
  ink: "#15130f",
  paper: "#f4f1ea",
  accent: "#e8590c",
  white: "#ffffff",
} as const;

export const { fontFamily: fraunces } = loadFraunces();
export const { fontFamily: archivo } = loadArchivo();

// The template hero screenshots (public/img/showreel) the montage walks
// through — one large, centered site at a time. Ordered for visual variety.
export const FEATURED = [
  { src: "forge", label: "Gym & Fitness", name: "Forge" },
  { src: "sanctuary", label: "Yoga & Wellness", name: "Sanctuary" },
  { src: "horizon", label: "Villas & Stays", name: "Laguna Bay" },
  { src: "ember", label: "Local Business", name: "Ember" },
  { src: "moonlight", label: "Yoga & Wellness", name: "Moonlight" },
  { src: "cinema", label: "Villas & Stays", name: "Cinema" },
  { src: "dive", label: "Local Business", name: "Aqua Sport" },
  { src: "barber", label: "Local Business", name: "Fade District" },
] as const;

export const PACKAGES = [
  { name: "Launch", price: "390" },
  { name: "Grow", price: "690", featured: true },
  { name: "Signature", price: "1,290" },
] as const;

// ── v2 (feature-selling) content ─────────────────────────────────────
// customer-facing feature scenes: a real captured screenshot + selling copy
export const CUSTOMER_FEATURES = [
  {
    img: "feat-gym",
    eyebrow: "Searchable schedule",
    headline: "Find your class or teacher — in one tap.",
    sub: "Guests search the whole week and it lights up.",
  },
  {
    img: "feat-menu",
    eyebrow: "Searchable menu",
    headline: "“Vegan?” answered instantly.",
    sub: "They type a craving; the menu responds.",
  },
  {
    img: "feat-villa",
    eyebrow: "Live booking",
    headline: "Pick dates. See the price. Book.",
    sub: "Sync it with Airbnb · Booking · Stripe.",
  },
] as const;

export const INTEGRATIONS = ["Cloudbeds", "Airbnb", "Booking.com", "Stripe"] as const;

// owner-facing: automatic instructor payouts (a capability we'd build)
export const PAYOUTS = [
  { name: "Noah", classes: 18, pct: 70, total: 25200 },
  { name: "Amara", classes: 22, pct: 65, total: 28600 },
  { name: "Mali", classes: 14, pct: 60, total: 16800 },
] as const;
export const PAYOUT_TOTAL = 70600;

// 8 moon-phase glyphs for the built lunar-calendar scene
export const MOON_GLYPHS = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"] as const;

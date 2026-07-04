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

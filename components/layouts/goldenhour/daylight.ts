// Golden Hour — the day as a function of the hour: where the sun is, what
// colour the sky, the sea and the page accent are, how many stars are out.
// Pure maths, no three.js, so the hero's CSS variables can use it without
// pulling the 3D bundle onto the main path.

import { SUNSET, toMinutes } from "@/lib/layouts/goldenhour";

/** The slider runs from noon to ten at night. */
export const DAY_START = 12;
export const DAY_END = 22;
/** Where the hero lands when the real clock is outside the range. */
export const GOLDEN = 18 + 5 / 60;
/** Demo sunset, as a decimal hour. */
export const SUNSET_HOUR = toMinutes(SUNSET) / 60;

/** sRGB in 0..1. */
export type Rgb = readonly [number, number, number];

export interface Daylight {
  /** Sky overhead, mid-sky and at the horizon. */
  zenith: Rgb;
  sky: Rgb;
  horizon: Rgb;
  /** The sun's bloom and its disc. */
  glow: Rgb;
  sun: Rgb;
  /** Sea body colour and what its surface reflects. */
  deep: Rgb;
  surface: Rgb;
  /** Foreground silhouettes (never quite black). */
  silhouette: Rgb;
  /** Page accent (buttons, kicker) and a background tint. */
  accent: Rgb;
  tint: Rgb;
  /** 0..1 — overall light level, stars out, lanterns up, sun glitter on the water. */
  exposure: number;
  stars: number;
  night: number;
  glitter: number;
  /** Angular radius of the sun disc (radians) — fatter and redder near the horizon. */
  sunSize: number;
  /** Sun elevation (degrees) and azimuth (radians, + is right of centre). */
  elevation: number;
  azimuth: number;
}

type Key = Daylight & { at: number };

const hex = (s: string): Rgb => [
  parseInt(s.slice(1, 3), 16) / 255,
  parseInt(s.slice(3, 5), 16) / 255,
  parseInt(s.slice(5, 7), 16) / 255,
];

function key(
  at: number,
  colours: [zenith: string, sky: string, horizon: string, glow: string, sun: string, deep: string, surface: string, silhouette: string, accent: string, tint: string],
  numbers: [exposure: number, stars: number, night: number, glitter: number, sunSize: number, elevation: number, azimuth: number],
): Key {
  const [zenith, sky, horizon, glow, sun, deep, surface, silhouette, accent, tint] = colours.map(hex);
  const [exposure, stars, night, glitter, sunSize, elevation, azimuth] = numbers;
  return { at, zenith, sky, horizon, glow, sun, deep, surface, silhouette, accent, tint, exposure, stars, night, glitter, sunSize, elevation, azimuth };
}

/* The day in keyframes; everything in between is a blend of its neighbours. */
const KEYS: readonly Key[] = [
  key(12, ["#1a5cc2", "#63abe9", "#e6f3fb", "#ffffff", "#fffaf0", "#0b4d7a", "#3aa9c6", "#1d1a1c", "#ffbe4d", "#8ed0f7"], [1, 0, 0, 0.55, 0.011, 62, -0.3]),
  key(15, ["#2468c6", "#7bb8e6", "#f3e8cd", "#ffe2b0", "#fff3d6", "#0d5280", "#3e9fbd", "#1d1a1c", "#ffb547", "#ffd59a"], [0.98, 0, 0, 0.8, 0.013, 38, -0.1]),
  key(17, ["#2f5fa8", "#a48ca0", "#ffd39a", "#ffb36a", "#ffe6b8", "#15466f", "#b98a6c", "#1a1718", "#ffa446", "#ffbd6e"], [0.95, 0, 0, 1.1, 0.017, 16, 0.05]),
  key(18, ["#3a4f8f", "#c0707a", "#ffb46a", "#ff8c48", "#ffcf8e", "#1b3a62", "#cf7a5a", "#171316", "#ff9540", "#ff9d4a"], [0.9, 0, 0, 1.3, 0.024, 5.5, 0.13]),
  key(SUNSET_HOUR, ["#3a3a74", "#b7557c", "#ff8f55", "#ff6240", "#ffb070", "#1a2a4f", "#b9566a", "#130f16", "#ff7347", "#ff6a46"], [0.82, 0.05, 0, 1.1, 0.03, 0, 0.18]),
  key(19.1, ["#23214f", "#6a3468", "#e0577c", "#d64f72", "#ff9a70", "#10193a", "#5e2d55", "#0f0c14", "#ff5f88", "#b23a86"], [0.62, 0.35, 0.45, 0.25, 0.03, -4, 0.2]),
  key(19.8, ["#12122f", "#2e1f4c", "#6a3762", "#7a3a68", "#ff9a70", "#090e26", "#2a1b40", "#0b0912", "#ff9a5c", "#4a2a6a"], [0.5, 0.75, 0.9, 0.05, 0.03, -9, 0.22]),
  key(20.8, ["#080a22", "#151638", "#2c2650", "#3a2c5c", "#ff9a70", "#05081c", "#171634", "#08070f", "#ffb45c", "#26224f"], [0.4, 1, 1, 0, 0.03, -16, 0.26]),
  key(22, ["#04051a", "#0d0e2e", "#1f1c44", "#2a2350", "#ff9a70", "#03061a", "#11112c", "#06060d", "#ffb45c", "#1d1b46"], [0.36, 1, 1, 0, 0.03, -25, 0.3]),
];

const mixRgb = (a: Rgb, b: Rgb, t: number): Rgb => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const mixNum = (a: number, b: number, t: number) => a + (b - a) * t;

export const clampHour = (h: number) => Math.min(DAY_END, Math.max(DAY_START, h));

/** The light at a given hour (clamped to the slider's range). */
export function daylight(hour: number): Daylight {
  const h = clampHour(hour);
  let i = 0;
  while (i < KEYS.length - 2 && h > KEYS[i + 1].at) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const t = Math.min(1, Math.max(0, (h - a.at) / (b.at - a.at)));
  return {
    zenith: mixRgb(a.zenith, b.zenith, t),
    sky: mixRgb(a.sky, b.sky, t),
    horizon: mixRgb(a.horizon, b.horizon, t),
    glow: mixRgb(a.glow, b.glow, t),
    sun: mixRgb(a.sun, b.sun, t),
    deep: mixRgb(a.deep, b.deep, t),
    surface: mixRgb(a.surface, b.surface, t),
    silhouette: mixRgb(a.silhouette, b.silhouette, t),
    accent: mixRgb(a.accent, b.accent, t),
    tint: mixRgb(a.tint, b.tint, t),
    exposure: mixNum(a.exposure, b.exposure, t),
    stars: mixNum(a.stars, b.stars, t),
    night: mixNum(a.night, b.night, t),
    glitter: mixNum(a.glitter, b.glitter, t),
    sunSize: mixNum(a.sunSize, b.sunSize, t),
    elevation: mixNum(a.elevation, b.elevation, t),
    azimuth: mixNum(a.azimuth, b.azimuth, t),
  };
}

/** Unit vector toward the sun (x right, y up, z toward the viewer; the horizon is -z). */
export function sunDirection(d: Daylight): [number, number, number] {
  const el = (d.elevation * Math.PI) / 180;
  return [Math.sin(d.azimuth) * Math.cos(el), Math.sin(el), -Math.cos(d.azimuth) * Math.cos(el)];
}

/** CSS colour for an Rgb. */
export const css = (c: Rgb) => `rgb(${Math.round(c[0] * 255)} ${Math.round(c[1] * 255)} ${Math.round(c[2] * 255)})`;

/** 18.4 → "18:24". */
export function clock(hour: number): string {
  const total = Math.round(hour * 60);
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** What the sky is doing at this hour, in a word or two. */
export function phase(hour: number): string {
  if (hour < 15) return "high sun";
  if (hour < 17) return "afternoon";
  if (hour < SUNSET_HOUR - 1) return "late light";
  if (hour < SUNSET_HOUR - 1 / 60) return "golden hour";
  if (hour < SUNSET_HOUR + 2 / 60) return "sunset";
  if (hour < SUNSET_HOUR + 0.75) return "blue hour";
  return "night";
}

/** "sunset in 11 min" / "sunset now" / "35 min after sunset". */
export function sunsetNote(hour: number): string {
  const minutes = Math.round((SUNSET_HOUR - hour) * 60);
  const span = (m: number) => (m >= 60 ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")} min` : `${m} min`);
  if (Math.abs(minutes) <= 1) return "sunset now";
  return minutes > 0 ? `sunset in ${span(minutes)}` : `${span(-minutes)} after sunset`;
}

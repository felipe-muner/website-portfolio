// Lunar phase math for the moon-calendar schedules.
// Reference new moon: 2000-01-06 18:14 UTC. Synodic month ≈ 29.530588853 days.

const SYNODIC_MONTH = 29.530588853;
const REF_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14);
const DAY_MS = 86_400_000;

/** Phase of the moon for a date: 0 = new, 0.25 = first quarter, 0.5 = full, 0.75 = last quarter. */
export function moonPhase(date: Date): number {
  const days = (date.getTime() - REF_NEW_MOON_MS) / DAY_MS;
  const phase = (days % SYNODIC_MONTH) / SYNODIC_MONTH;
  return phase < 0 ? phase + 1 : phase;
}

/** Illuminated fraction 0..1 for a phase. */
export function moonIllumination(phase: number): number {
  return (1 - Math.cos(2 * Math.PI * phase)) / 2;
}

export type MoonPhaseName =
  | "New moon"
  | "Waxing crescent"
  | "First quarter"
  | "Waxing gibbous"
  | "Full moon"
  | "Waning gibbous"
  | "Last quarter"
  | "Waning crescent";

export function moonPhaseName(phase: number): MoonPhaseName {
  const idx = Math.round(phase * 8) % 8;
  return ([
    "New moon",
    "Waxing crescent",
    "First quarter",
    "Waxing gibbous",
    "Full moon",
    "Waning gibbous",
    "Last quarter",
    "Waning crescent",
  ] as const)[idx];
}

export function isFullMoon(date: Date): boolean {
  return moonPhaseName(moonPhase(date)) === "Full moon";
}

export function isNewMoon(date: Date): boolean {
  return moonPhaseName(moonPhase(date)) === "New moon";
}

/**
 * SVG path of the lit part of the moon for a phase, in a viewBox of
 * `0 0 d d` where d = 2 * r and the disc is centered.
 */
export function moonLitPath(phase: number, r: number): string {
  const cx = r;
  const top = 0.02 * r; // tiny inset so strokes don't clip
  const bottom = 2 * r - top;
  const rr = r - top;
  const waxing = phase < 0.5;
  const f = moonIllumination(phase);
  const rx = rr * Math.abs(Math.cos(2 * Math.PI * phase));
  // Outer edge: semicircle on the lit side; inner edge: the terminator ellipse.
  const outerSweep = waxing ? 1 : 0;
  const innerSweep = f > 0.5 ? outerSweep : 1 - outerSweep;
  return `M ${cx} ${top} A ${rr} ${rr} 0 1 ${outerSweep} ${cx} ${bottom} A ${rx} ${rr} 0 1 ${innerSweep} ${cx} ${top} Z`;
}

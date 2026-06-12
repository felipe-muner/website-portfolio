import { moonLitPath, moonPhase } from "@/lib/layouts/moon";

interface MoonPhaseIconProps {
  date: Date;
  /** Pixel size of the icon. */
  size: number;
  /** Color of the lit part of the moon. */
  light: string;
  /** Color of the shadowed disc. */
  dark: string;
  className?: string;
  /** Outline color for the disc edge (defaults to the light color, faint). */
  ring?: string;
}

/** A real moon-phase glyph for a given date, drawn as SVG. */
export function MoonPhaseIcon({ date, size, light, dark, ring, className }: MoonPhaseIconProps) {
  const phase = moonPhase(date);
  const r = 12;
  return (
    <svg
      viewBox={`0 0 ${2 * r} ${2 * r}`}
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      <circle cx={r} cy={r} r={r - 0.4} fill={dark} stroke={ring ?? `${light}55`} strokeWidth="0.8" />
      <path d={moonLitPath(phase, r)} fill={light} />
    </svg>
  );
}

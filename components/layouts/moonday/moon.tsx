"use client";

import { useEffect, useState } from "react";
import { SYNODIC_MONTH, moonIllumination, moonLitPath, moonPhase, moonPhaseName } from "@/lib/layouts/moon";
import type { MoonPhaseName } from "@/lib/layouts/moon";
import { LUNAR_STAGES } from "@/lib/layouts/moonday";

interface MoonGlyphProps {
  /** 0 = new, 0.5 = full. */
  phase: number;
  size: number | string;
  light: string;
  dark: string;
  className?: string;
  title?: string;
}

/** A moon drawn at an exact phase, as SVG. */
export function MoonGlyph({ phase, size, light, dark, className, title }: MoonGlyphProps) {
  const r = 50;
  return (
    <svg
      viewBox={`0 0 ${2 * r} ${2 * r}`}
      width={size}
      height={size}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx={r} cy={r} r={r - 0.5} fill={dark} />
      <path d={moonLitPath(phase, r)} fill={light} />
    </svg>
  );
}

export interface Tonight {
  date: Date;
  phase: number;
  /** Moon age in days since the last new moon. */
  age: number;
  name: MoonPhaseName;
  /** Illuminated share, 0 – 100. */
  lit: number;
  stageIndex: number;
  /** Days until the next full moon, and since the last one. */
  daysToFull: number;
  daysSinceFull: number;
  /** True when tonight is the night closest to the full moon. */
  fullTonight: boolean;
}

/** A date's evening (21:00 local): the moon you actually see that night. */
export function eveningOf(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 21);
}

/** Tonight's moon, resolved after mount so prerendered HTML never goes stale. */
export function useTonight(): Tonight | null {
  const [tonight, setTonight] = useState<Tonight | null>(null);
  useEffect(() => {
    const date = eveningOf(new Date());
    const phase = moonPhase(date);
    const age = phase * SYNODIC_MONTH;
    const stageIndex = Math.max(
      0,
      LUNAR_STAGES.findIndex((s) => age >= s.from && age < s.to),
    );
    const toFull = ((((0.5 - phase) % 1) + 1) % 1) * SYNODIC_MONTH;
    const sinceFull = SYNODIC_MONTH - toFull;
    setTonight({
      date,
      phase,
      age,
      name: moonPhaseName(phase),
      lit: Math.round(moonIllumination(phase) * 100),
      stageIndex,
      daysToFull: Math.round(toFull),
      daysSinceFull: Math.round(sinceFull),
      fullTonight: Math.min(toFull, sinceFull) < 0.5,
    });
  }, []);
  return tonight;
}

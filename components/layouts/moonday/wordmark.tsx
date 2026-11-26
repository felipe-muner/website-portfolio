"use client";

import { MoonGlyph, useTonight } from "./moon";

interface WordmarkProps {
  light: string;
  dark: string;
  className?: string;
}

/**
 * "Moonday", with the two o's drawn as moons: tonight's real phase, then the
 * full moon it is heading for.
 */
export function Wordmark({ light, dark, className }: WordmarkProps) {
  const tonight = useTonight();
  return (
    <span className={`inline-flex items-baseline whitespace-nowrap ${className ?? ""}`} aria-label="Moonday">
      <span aria-hidden>M</span>
      <span aria-hidden className="mx-[0.015em] inline-flex translate-y-[0.02em] gap-[0.03em]">
        <MoonGlyph phase={tonight?.phase ?? 0.25} size="0.6em" light={light} dark={dark} />
        <MoonGlyph phase={0.5} size="0.6em" light={light} dark={dark} />
      </span>
      <span aria-hidden>nday</span>
    </span>
  );
}

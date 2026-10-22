"use client";

import { useStudioTime } from "@/components/layouts/studio-clock";
import { OPEN_STUDIO } from "@/lib/layouts/meads";

const DAY = 86_400;
const WEEK = 7 * DAY;
const toSeconds = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 3600 + m * 60;
};

/** 190_000 → "2d 4h"; 9_000 → "2h 30m"; 500 → "8m". */
function soon(total: number): string {
  const d = Math.floor(total / DAY);
  const h = Math.floor((total % DAY) / 3600);
  const m = Math.floor((total % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${Math.max(1, m)}m`;
}

/** Open-studio afternoon on the studio's own clock: live now, or counting down. */
export function OpenStudio({ className = "" }: { className?: string }) {
  const now = useStudioTime(60);
  if (!now) return <span className={className} aria-hidden />;

  const t = now.weekday * DAY + now.seconds;
  const start = OPEN_STUDIO.weekday * DAY + toSeconds(OPEN_STUDIO.start);
  const end = OPEN_STUDIO.weekday * DAY + toSeconds(OPEN_STUDIO.end);
  const live = t >= start && t < end;
  const wait = (start - t + WEEK) % WEEK;

  return (
    <span className={`inline-flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.2em] ${className}`}>
      <span className={`size-1.5 rounded-full ${live ? "bg-[#42c8c0] shadow-[0_0_10px_#42c8c0]" : "bg-[#e9b44c]"}`} />
      {live ? (
        <>
          Open studio now · until {OPEN_STUDIO.end}
        </>
      ) : (
        <>
          Open studio · Sat {OPEN_STUDIO.start} · in <span className="text-[#f3ead9]">{soon(wait)}</span>
        </>
      )}
    </span>
  );
}

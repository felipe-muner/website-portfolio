"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import dynamic from "next/dynamic";
import { LocateFixed, Sun } from "lucide-react";
import { useStudioTime } from "@/components/layouts/studio-clock";
import { useWebglStage } from "@/components/layouts/use-webgl-stage";
import { SUNSET } from "@/lib/layouts/goldenhour";
import { DAY_END, DAY_START, GOLDEN, SUNSET_HOUR, clampHour, clock, css, daylight, phase, sunsetNote } from "./daylight";

/* WebGL is client-only and heavy — keep it off the SSR path. */
const SunsetScene = dynamic(() => import("./sunset-scene"), { ssr: false, loading: () => null });

const SPAN = DAY_END - DAY_START;
/** A full drag across the stage moves the day this far. */
const DRAG_HOURS = SPAN * 0.9;

/**
 * Golden Hour — the hero stage. Owns the time of day (12:00–22:00, Bangkok
 * time): the club's real clock while it is in range, golden hour otherwise,
 * or wherever the visitor dragged it. Feeds that hour to the 3D sunset and
 * sets `--gh-accent`, `--gh-tint`, `--gh-sky` and `--gh-horizon` on its root
 * so the copy's colours follow the sky. Children render over the stage.
 */
export function HeroStage({ children }: { children: React.ReactNode }) {
  const { ref, inView, reduced, webgl } = useWebglStage();
  const now = useStudioTime(30);
  const [manual, setManual] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; x: number; hour: number; moved: boolean } | null>(null);

  const real = now === null ? null : now.seconds / 3600;
  const live = real !== null && real >= DAY_START && real <= DAY_END ? real : null;
  const hour = manual ?? live ?? GOLDEN;
  const following = manual === null;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const d = daylight(hour);
    el.style.setProperty("--gh-accent", css(d.accent));
    el.style.setProperty("--gh-tint", css(d.tint));
    el.style.setProperty("--gh-sky", css(d.sky));
    el.style.setProperty("--gh-horizon", css(d.horizon));
  }, [hour]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    drag.current = { id: e.pointerId, x: e.clientX, hour, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) < 4) return;
    d.moved = true;
    const width = e.currentTarget.clientWidth || 1;
    setManual(clampHour(d.hour + (dx / width) * DRAG_HOURS));
  };
  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (drag.current?.id === e.pointerId) drag.current = null;
  };

  return (
    <div ref={root} className="relative isolate flex flex-col overflow-hidden bg-[#0b0a1a] lg:min-h-[max(100svh,820px)]">
      <div
        ref={ref}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative h-[500px] cursor-ew-resize touch-pan-y select-none sm:h-[580px] lg:absolute lg:inset-0 lg:h-auto"
      >
        {webgl ? (
          <div aria-hidden className="absolute inset-0">
            <SunsetScene active={inView} reduced={reduced} hour={hour} />
          </div>
        ) : (
          /* No WebGL: a flat sky and sea in the same colours, still driven by the slider. */
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--gh-sky,#c0707a)_0%,var(--gh-horizon,#ffb46a)_46%,#1b3a62_47%,#0b0a1a_100%)] transition-colors duration-700"
          />
        )}
        {/* Melt the sea into the page, and keep the copy side legible on wide screens. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,10,26,0.35)_0%,transparent_18%,transparent_74%,#0b0a1a_100%)] lg:bg-[linear-gradient(to_right,rgba(11,10,26,0.8)_0%,rgba(11,10,26,0.45)_34%,transparent_58%),linear-gradient(to_bottom,rgba(11,10,26,0.5)_0%,transparent_16%,transparent_82%,#0b0a1a_100%)]"
        />
        <TimeControl hour={hour} following={following} live={live} real={real} onChange={setManual} onNow={() => setManual(null)} />
      </div>
      <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 pb-16 pt-10 sm:px-8 lg:px-12 lg:pb-12 lg:pt-36 [&>*]:pointer-events-auto">
        {children}
      </div>
    </div>
  );
}

function TimeControl({
  hour,
  following,
  live,
  real,
  onChange,
  onNow,
}: {
  hour: number;
  following: boolean;
  live: number | null;
  real: number | null;
  onChange: (hour: number) => void;
  onNow: () => void;
}) {
  const sunsetAt = ((SUNSET_HOUR - DAY_START) / SPAN) * 100;
  const hint = following
    ? live !== null
      ? "Following the club's clock. Drag the sky, or the slider, to see another hour."
      : real !== null
        ? `It's ${clock(real)} at the club — showing golden hour. Drag the sky to move the day.`
        : "Showing golden hour. Drag the sky to move the day."
    : "Now returns to the club's clock.";

  return (
    <div
      onPointerDown={(e) => e.stopPropagation()}
      className="absolute inset-x-4 bottom-5 z-20 cursor-default rounded-2xl border border-[#f6ead7]/12 bg-[#0b0a1a]/55 p-4 text-[#f6ead7] backdrop-blur-xl sm:inset-x-6 lg:inset-x-auto lg:bottom-10 lg:right-12 lg:w-[440px]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--gh-accent,#ff9f43)] transition-colors duration-700">
            <Sun className="size-3.5" /> {phase(hour)}
          </p>
          <p className="font-display mt-1.5 text-[2rem] leading-none tabular-nums">
            {clock(hour)}
            <span className="ml-2 font-[family-name:var(--font-gh-sans)] text-[15px] font-normal text-[#f6ead7]/60">· {sunsetNote(hour)}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={onNow}
          disabled={following}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-[#f6ead7]/20 px-3.5 text-[13px] font-semibold text-[#f6ead7]/85 transition-colors hover:border-[var(--gh-accent,#ff9f43)] hover:text-[var(--gh-accent,#ff9f43)] disabled:cursor-default disabled:border-[#f6ead7]/10 disabled:text-[#f6ead7]/40"
        >
          <LocateFixed className="size-3.5" />
          {following && live !== null ? "Live" : "Now"}
        </button>
      </div>
      <div className="relative mt-4">
        <input
          type="range"
          min={DAY_START}
          max={DAY_END}
          step={1 / 60}
          value={hour}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label="Time of day at the club"
          aria-valuetext={`${clock(hour)}, ${sunsetNote(hour)}`}
          className="block h-6 w-full cursor-pointer [accent-color:var(--gh-accent,#ff9f43)]"
        />
        <div className="relative mt-1 h-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f6ead7]/45">
          <span className="absolute left-0">Noon</span>
          <span className="absolute -translate-x-1/2 text-[var(--gh-accent,#ff9f43)]/90" style={{ left: `${sunsetAt}%` }}>
            Sunset {SUNSET}
          </span>
          <span className="absolute right-0">22:00</span>
        </div>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-[#f6ead7]/45">{hint}</p>
    </div>
  );
}

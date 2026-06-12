"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Sun } from "lucide-react";
import { YOGA_WEEK, WEEKDAYS, WEEKDAYS_SHORT, sessionsOn } from "@/lib/layouts/schedule";
import { useScheduleSearch, useWeekDates } from "./use-schedule-search";

const INK = "#4a2c3a";
const ROSE = "#d96f5e";
const GOLD = "#e0a14f";
const PLUM = "#7e4663";

/** Position of the i-th sun (0–6) along a rising-and-setting arc. */
function arcXY(i: number): { x: number; y: number } {
  const t = i / 6; // 0..1
  const x = 6 + t * 88;
  const y = 78 - Math.sin(t * Math.PI) * 62;
  return { x, y };
}

/** Blend from morning peach to evening plum by start time. */
function timeColor(start: string): string {
  const h = Number(start.split(":")[0]);
  if (h < 10) return GOLD;
  if (h < 16) return ROSE;
  return PLUM;
}

/**
 * Yoga 3 · Dawn — "The Sun Arc". Seven suns rise across an arc, one per
 * day; choose one and its sessions pour out in sunrise order, colored from
 * dawn gold to dusk plum. Search keeps only the matching light.
 */
export function DawnArc({ displayClass }: { displayClass: string }) {
  const { query, setQuery, toggle, isActive, matches, hasQuery, matchCount, teachers } =
    useScheduleSearch(YOGA_WEEK);
  const dates = useWeekDates();
  const [day, setDay] = useState(0);

  const daySessions = sessionsOn(YOGA_WEEK, day);

  return (
    <div>
      {/* Search */}
      <div className="mx-auto max-w-xl text-center">
        <label htmlFor="dawn-search" className="text-xs font-extrabold uppercase tracking-[0.35em]" style={{ color: ROSE }}>
          Who lights your morning?
        </label>
        <div className="mt-3 flex items-center gap-3 rounded-full bg-white/70 px-6 py-3.5 shadow-lg shadow-[#d96f5e]/10 backdrop-blur">
          <Sun className="size-4 shrink-0 animate-landing-twinkle" style={{ color: GOLD }} />
          <input
            id="dawn-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Noah, sunset flow, breathwork…"
            className="w-full bg-transparent text-center text-sm font-semibold focus:outline-none"
            style={{ color: INK }}
          />
        </div>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {teachers.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggle(t)}
              className={`rounded-full px-3.5 py-1 text-xs font-extrabold uppercase tracking-[0.2em] transition-all ${
                isActive(t) ? "text-white shadow-md" : "bg-white/50 hover:bg-white"
              }`}
              style={isActive(t) ? { backgroundColor: ROSE } : { color: PLUM }}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs uppercase tracking-[0.3em]" style={{ color: `${INK}b3` }}>
          {hasQuery ? `${matchCount} sessions in the light` : "pick a sun below"}
        </p>
      </div>

      {/* The arc */}
      <div className="relative mx-auto mt-10 hidden h-56 max-w-3xl md:block">
        <svg viewBox="0 0 100 90" className="absolute inset-0 h-full w-full" aria-hidden>
          <path
            d="M 6 78 Q 50 -30 94 78"
            fill="none"
            stroke={`${GOLD}66`}
            strokeWidth="0.6"
            strokeDasharray="2 2"
          />
        </svg>
        {WEEKDAYS_SHORT.map((d, i) => {
          const { x, y } = arcXY(i);
          const active = day === i;
          return (
            <button
              key={d}
              type="button"
              onClick={() => setDay(i)}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center transition-transform hover:scale-110"
              style={{ left: `${x}%`, top: `${(y / 90) * 100}%` }}
            >
              <span
                className={`mx-auto flex items-center justify-center rounded-full transition-all ${
                  active ? "size-14 shadow-[0_0_36px_rgba(224,161,79,0.7)]" : "size-9 opacity-70"
                }`}
                style={{ background: `radial-gradient(circle, ${GOLD}, ${ROSE})` }}
              >
                <span className={`${displayClass} text-xs uppercase ${active ? "text-base" : ""}`} style={{ color: "#fff" }}>
                  {d}
                </span>
              </span>
              <span className="mt-1 block text-xs font-extrabold uppercase tracking-[0.15em]" style={{ color: active ? ROSE : `${INK}99` }}>
                {dates ? format(dates[i], "d MMM") : ""}
              </span>
            </button>
          );
        })}
      </div>
      {/* Mobile day picker */}
      <div className="mt-8 flex gap-2 overflow-x-auto pb-2 md:hidden">
        {WEEKDAYS_SHORT.map((d, i) => (
          <button
            key={d}
            type="button"
            onClick={() => setDay(i)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-[0.15em] ${
              day === i ? "text-white" : "bg-white/60"
            }`}
            style={day === i ? { backgroundColor: ROSE } : { color: INK }}
          >
            {d} {dates ? format(dates[i], "d") : ""}
          </button>
        ))}
      </div>

      {/* Day sessions */}
      <div className="mx-auto mt-6 max-w-2xl">
        <p className={`${displayClass} text-center text-3xl`} style={{ color: INK }}>
          {WEEKDAYS[day]}
          {dates && <span style={{ color: ROSE }}> · {format(dates[day], "d MMMM")}</span>}
        </p>
        <div className="mt-8 space-y-4">
          {daySessions.map((s, idx) => {
            const lit = matches(s);
            const color = timeColor(s.start);
            return (
              <Link
                key={s.id}
                href={s.href}
                className={`flex items-center gap-5 rounded-[2.5rem] bg-white/70 p-4 pr-7 shadow-sm transition-all duration-500 hover:shadow-lg ${
                  lit ? "" : "opacity-45 grayscale"
                } ${lit && hasQuery ? "ring-2 ring-offset-2" : ""}`}
                style={{
                  transitionDelay: `${idx * 50}ms`,
                  ...(lit && hasQuery ? ({ "--tw-ring-color": color } as React.CSSProperties) : {}),
                }}
              >
                <span
                  className="flex size-16 shrink-0 flex-col items-center justify-center rounded-full text-white"
                  style={{ background: `radial-gradient(circle at 35% 30%, ${color}, ${INK})` }}
                >
                  <span className={`${displayClass} text-sm leading-none`}>{s.start}</span>
                </span>
                <span className="flex-1">
                  <span className={`${displayClass} block text-2xl leading-tight`} style={{ color: INK }}>
                    {s.className}
                  </span>
                  <span className="block text-xs font-extrabold uppercase tracking-[0.25em]" style={{ color }}>
                    with {s.teacher} · until {s.end}
                  </span>
                </span>
                <span className="hidden text-xs font-extrabold uppercase tracking-[0.2em] sm:block" style={{ color: `${INK}99` }}>
                  {s.tags[0]}
                </span>
              </Link>
            );
          })}
          {daySessions.length === 0 && (
            <p className="text-center italic" style={{ color: `${INK}99` }}>
              The sun rests today — so can you.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Flag, Search } from "lucide-react";
import { format } from "date-fns";
import { GYM_WEEK, WEEKDAYS_SHORT, sessionsOn } from "@/lib/layouts/schedule";
import { useScheduleSearch, useWeekDates } from "./use-schedule-search";

const RED = "#ff2d2d";

// Lane runs 06:00 → 21:00.
const DAY_START = 6 * 60;
const DAY_END = 21 * 60;

function minutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function lanePos(t: string): number {
  return ((minutes(t) - DAY_START) / (DAY_END - DAY_START)) * 100;
}

/**
 * Gym 3 · Velocity — "Race Lanes". Each weekday is a lane on the track;
 * sessions sit at their start-time position like cars on a grid. Matches
 * glow red and pull ahead, the rest fall back into the dark.
 */
export function VelocityLanes({ displayClass }: { displayClass: string }) {
  const { query, setQuery, toggle, isActive, matches, hasQuery, matchCount, classNames, teachers } =
    useScheduleSearch(GYM_WEEK);
  const dates = useWeekDates();

  const hours = [6, 9, 12, 15, 18, 21];

  return (
    <div>
      {/* Telemetry search */}
      <div className="-skew-x-3 border border-white/15 bg-[#16181b] p-5 md:p-6">
        <div className="skew-x-3">
          <div className="flex flex-wrap items-center gap-4">
            <Flag className="size-5" style={{ color: RED }} />
            <div className="flex min-w-60 flex-1 items-center gap-3 border-b border-white/20 pb-2">
              <Search className="size-4 text-white/70" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Scan the grid — coach, class, style…"
                aria-label="Search the schedule"
                className="w-full bg-transparent text-sm font-bold uppercase tracking-[0.15em] text-white placeholder:text-white/50 focus:outline-none"
              />
            </div>
            <p className={`${displayClass} text-2xl font-black italic`} style={{ color: RED }}>
              {hasQuery ? matchCount : GYM_WEEK.length}
              <span className="ml-2 text-xs font-bold not-italic text-white/70">
                {hasQuery ? "ON PACE" : "SESSIONS"}
              </span>
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {[...classNames.slice(0, 6), ...teachers.slice(0, 4)].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => toggle(term)}
                className={`-skew-x-12 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] transition-colors ${
                  isActive(term) ? "text-white" : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
                }`}
                style={isActive(term) ? { backgroundColor: RED } : undefined}
              >
                <span className="block skew-x-12">{term}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Time ruler */}
      <div className="relative mt-10 hidden h-6 md:block">
        <div className="absolute inset-x-32 inset-y-0 right-4">
          {hours.map((h) => (
            <span
              key={h}
              className="absolute -translate-x-1/2 text-xs font-bold uppercase tracking-[0.2em] text-white/60"
              style={{ left: `${lanePos(`${String(h).padStart(2, "0")}:00`)}%` }}
            >
              {String(h).padStart(2, "0")}:00
            </span>
          ))}
        </div>
      </div>

      {/* Lanes */}
      <div className="mt-2 space-y-2">
        {WEEKDAYS_SHORT.map((day, i) => {
          const daySessions = sessionsOn(GYM_WEEK, i);
          return (
            <div key={day} className="flex flex-col gap-2 md:h-20 md:flex-row md:items-stretch md:gap-0">
              <div className="flex w-full items-center gap-3 border-l-4 bg-[#16181b] px-4 py-2 md:w-32 md:shrink-0" style={{ borderColor: RED }}>
                <span className={`${displayClass} text-2xl font-black italic uppercase`}>{day}</span>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">
                  {dates ? format(dates[i], "d MMM") : ""}
                </span>
              </div>
              {/* Desktop: positioned chips on the lane */}
              <div className="relative hidden flex-1 border-b border-dashed border-white/10 md:block">
                {[25, 50, 75].map((p) => (
                  <span key={p} aria-hidden className="absolute inset-y-0 w-px bg-white/5" style={{ left: `${p}%` }} />
                ))}
                {daySessions.map((s) => {
                  const lit = matches(s);
                  return (
                    <Link
                      key={s.id}
                      href={s.href}
                      title={`${s.className} · ${s.teacher} · ${s.start}`}
                      className={`group absolute top-1/2 -translate-y-1/2 -skew-x-12 border px-3 py-2 transition-all duration-300 ${
                        lit
                          ? hasQuery
                            ? "z-10 scale-105 border-transparent text-white shadow-[0_0_24px_rgba(255,45,45,0.5)]"
                            : "border-white/15 bg-[#1c1f24] hover:z-10 hover:border-[#ff2d2d]"
                          : "border-white/5 bg-[#121419] opacity-40"
                      }`}
                      style={{
                        left: `${lanePos(s.start)}%`,
                        backgroundColor: lit && hasQuery ? RED : undefined,
                      }}
                    >
                      <span className="block skew-x-12">
                        <span className="block text-xs font-black uppercase leading-none tracking-[0.1em]">
                          {s.start} {s.className}
                        </span>
                        <span
                          className={`mt-0.5 block text-xs font-bold uppercase tracking-[0.15em] ${
                            lit && hasQuery ? "text-white/85" : "text-white/70"
                          }`}
                        >
                          {s.teacher}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
              {/* Mobile: simple chip row */}
              <div className="flex flex-wrap gap-2 md:hidden">
                {daySessions.map((s) => {
                  const lit = matches(s);
                  return (
                    <Link
                      key={s.id}
                      href={s.href}
                      className={`-skew-x-6 border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] transition-all ${
                        lit ? "border-white/20 bg-[#1c1f24]" : "border-white/5 opacity-40"
                      }`}
                      style={lit && hasQuery ? { backgroundColor: RED, borderColor: RED } : undefined}
                    >
                      <span className="block skew-x-6">
                        {s.start} · {s.className} · {s.teacher}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

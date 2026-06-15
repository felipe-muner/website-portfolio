"use client";

import Link from "next/link";
import { format, isSameDay } from "date-fns";
import { Waves } from "lucide-react";
import { moonPhase, moonPhaseName } from "@/lib/layouts/moon";
import { YOGA_WEEK, WEEKDAYS, sessionsOn } from "@/lib/layouts/schedule";
import { DayWeather } from "./DayWeather";
import { MoonPhaseIcon } from "./MoonPhaseIcon";
import { useMonthGrid, useScheduleSearch, useWeekDates } from "./use-schedule-search";

const FOREST = "#2d4435";
const SAGE = "#aebfae";
const CLAY = "#b98a68";

function minutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

// Buoys float between 07:00 and 20:00.
function tidePos(t: string): number {
  return ((minutes(t) - 7 * 60) / (13 * 60)) * 100;
}

/**
 * Yoga 2 · Tide — "The Tide Chart". Each day is a band of water; classes
 * float on it like buoys at their hour. Search and the matching buoys rise
 * on the swell while the rest drift under the surface.
 */
export function TideChart({ displayClass }: { displayClass: string }) {
  const { query, setQuery, toggle, isActive, matches, hasQuery, matchCount, teachers } =
    useScheduleSearch(YOGA_WEEK);
  const dates = useWeekDates();
  const grid = useMonthGrid();

  const monthDays = (grid?.cells.filter(Boolean) as Date[] | undefined) ?? [];
  const fullMoon = monthDays.find((d) => moonPhaseName(moonPhase(d)) === "Full moon");

  return (
    <div>
      {/* Search amid the waves */}
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-3 rounded-full border-2 bg-white/80 px-6 py-4" style={{ borderColor: `${FOREST}30` }}>
          <Waves className="size-5 shrink-0" style={{ color: CLAY }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the water — a teacher, a practice, a feeling…"
            aria-label="Search the schedule"
            className="w-full bg-transparent text-sm focus:outline-none"
            style={{ color: FOREST }}
          />
          <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: `${FOREST}b3` }}>
            {hasQuery ? `${matchCount} afloat` : "calm seas"}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {teachers.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggle(t)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
                isActive(t) ? "text-white" : "bg-white/50"
              }`}
              style={
                isActive(t)
                  ? { backgroundColor: FOREST, borderColor: FOREST }
                  : { borderColor: `${FOREST}40`, color: FOREST }
              }
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Moon & tide ribbon — the tide follows the moon */}
      <div className="mx-auto mt-12 max-w-6xl">
        <div className="flex flex-wrap items-baseline justify-between gap-2 px-1">
          <p className={`${displayClass} text-2xl`} style={{ color: FOREST }}>
            {grid?.label ?? "This month"}, moon by moon
          </p>
          {fullMoon && (
            <p className="text-sm font-semibold" style={{ color: CLAY }}>
              ● Full-moon beach flow — {format(fullMoon, "EEEE d")}
            </p>
          )}
        </div>
        <div className="mt-4 overflow-x-auto pb-3">
          <div className="flex min-w-max gap-1.5 rounded-full px-4 py-4" style={{ background: `linear-gradient(90deg, ${SAGE}26, ${SAGE}4d, ${SAGE}26)` }}>
            {monthDays.map((d) => {
              const isToday = grid ? isSameDay(d, grid.today) : false;
              const full = moonPhaseName(moonPhase(d)) === "Full moon";
              return (
                <div
                  key={d.toISOString()}
                  className={`flex w-10 shrink-0 flex-col items-center ${full ? "animate-landing-float" : ""}`}
                  title={`${format(d, "d MMMM")} — ${moonPhaseName(moonPhase(d))}`}
                >
                  <MoonPhaseIcon date={d} size={full ? 30 : 22} light="#f5efe2" dark={FOREST} ring={`${FOREST}66`} />
                  <span
                    className={`mt-1.5 text-xs tabular-nums ${isToday ? "font-bold" : ""}`}
                    style={{ color: isToday ? CLAY : `${FOREST}b3` }}
                  >
                    {format(d, "d")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hour scale */}
      <div className="relative mx-auto mt-12 hidden h-5 max-w-6xl md:block">
        <div className="absolute inset-y-0 left-44 right-4">
          {[8, 11, 14, 17, 20].map((h) => (
            <span
              key={h}
              className="absolute -translate-x-1/2 text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ left: `${tidePos(`${String(h).padStart(2, "0")}:00`)}%`, color: `${FOREST}99` }}
            >
              {h}:00
            </span>
          ))}
        </div>
      </div>

      {/* Tide bands */}
      <div className="mx-auto mt-2 max-w-6xl space-y-3">
        {WEEKDAYS.map((dayName, i) => {
          const daySessions = sessionsOn(YOGA_WEEK, i);
          return (
            <div key={dayName} className="flex flex-col gap-3 md:h-24 md:flex-row md:items-stretch">
              <div className="flex w-full items-baseline gap-3 md:w-44 md:shrink-0 md:flex-col md:items-start md:justify-center md:gap-1 md:pr-4">
                <p className={`${displayClass} text-xl lg:text-2xl`} style={{ color: FOREST }}>
                  {dayName}
                </p>
                <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: CLAY }}>
                  {dates ? format(dates[i], "d MMMM") : ""}
                </p>
                {dates && (
                  <DayWeather
                    date={dates[i]}
                    displayClass={displayClass}
                    size="sm"
                    side="bottom"
                    className="-ml-2.5"
                    theme={{ accent: CLAY, panel: "#f5efe2", text: FOREST, muted: `${FOREST}b3`, border: `${FOREST}30` }}
                  />
                )}
              </div>
              {/* Desktop water band */}
              <div
                className="relative hidden flex-1 overflow-visible rounded-full md:block"
                style={{ background: `linear-gradient(90deg, ${SAGE}30, ${SAGE}55, ${SAGE}30)` }}
              >
                {daySessions.map((s, idx) => {
                  const lit = matches(s);
                  return (
                    <Link
                      key={s.id}
                      href={s.href}
                      title={`${s.className} · ${s.teacher} · ${s.start}`}
                      className={`absolute top-1/2 block -translate-x-1/2 rounded-full border-2 px-4 py-2 text-center transition-all duration-500 ${
                        lit
                          ? hasQuery
                            ? "z-10 -translate-y-[70%] bg-white shadow-lg"
                            : "-translate-y-1/2 bg-white/90 hover:z-10 hover:bg-white hover:shadow-md"
                          : "-translate-y-[30%] border-transparent bg-white/50 opacity-50"
                      } ${lit && idx % 2 === 0 ? "animate-landing-float" : ""}`}
                      style={{ left: `${Math.min(Math.max(tidePos(s.start), 6), 94)}%`, borderColor: lit && hasQuery ? CLAY : `${FOREST}25` }}
                    >
                      <span className="block text-xs font-bold uppercase tracking-[0.1em]" style={{ color: FOREST }}>
                        {s.start} · {s.className}
                      </span>
                      <span className="block text-xs italic" style={{ color: CLAY }}>
                        {s.teacher}
                      </span>
                    </Link>
                  );
                })}
                {daySessions.length === 0 && (
                  <p className="absolute left-8 top-1/2 -translate-y-1/2 text-xs italic" style={{ color: `${FOREST}b3` }}>
                    still water — no classes today
                  </p>
                )}
              </div>
              {/* Mobile list */}
              <div className="flex flex-wrap gap-2 md:hidden">
                {daySessions.map((s) => {
                  const lit = matches(s);
                  return (
                    <Link
                      key={s.id}
                      href={s.href}
                      className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all ${lit ? "bg-white" : "opacity-50"}`}
                      style={{ borderColor: lit && hasQuery ? CLAY : `${FOREST}30`, color: FOREST }}
                    >
                      {s.start} {s.className} · <em style={{ color: CLAY }}>{s.teacher}</em>
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

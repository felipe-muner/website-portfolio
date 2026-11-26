"use client";

import { useEffect, useMemo, useState } from "react";
import { format, isSameDay } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { moonPhase, moonPhaseName } from "@/lib/layouts/moon";
import { MOONDAY } from "@/lib/layouts/moonday";
import { WEEKDAYS_SHORT, YOGA_WEEK, sessionsOn } from "@/lib/layouts/schedule";
import type { ScheduleSession } from "@/lib/layouts/schedule";
import { mondayIndex, useMonthGrid, useScheduleSearch } from "@/components/layouts/schedule/use-schedule-search";
import { MoonGlyph, eveningOf } from "./moon";

// The weekly Sunday "Full Moon Flow" is replaced by the real thing: one
// evening on the beach, on the actual night of the full moon.
const WEEK = YOGA_WEEK.filter((s) => s.className !== "Full Moon Flow");
const MOON_FLOW: ScheduleSession = {
  id: "moon-flow",
  className: "Full Moon Flow on the beach",
  teacher: "Amara",
  weekday: 0,
  start: "19:00",
  end: "20:00",
  tags: ["yoga", "flow", "moonlight", "beach"],
  href: "#",
};

/** The day of the month closest to a target phase (0 new, 0.5 full). */
function closestTo(days: Date[], target: number): Date | undefined {
  let best: Date | undefined;
  let bestDistance = 1;
  for (const d of days) {
    const p = moonPhase(eveningOf(d));
    const dist = Math.min(Math.abs(p - target), 1 - Math.abs(p - target));
    if (dist < bestDistance) {
      bestDistance = dist;
      best = d;
    }
  }
  return bestDistance < 0.5 / 29.53 ? best : undefined;
}

/** Evening phase, so a day shows the moon you would actually see that night. */
function nightPhase(d: Date): number {
  return moonPhase(eveningOf(d));
}

export function MonthSky() {
  const grid = useMonthGrid();
  const { setQuery, toggle, isActive, matches, hasQuery, teachers } = useScheduleSearch(WEEK);
  const [selected, setSelected] = useState<Date | null>(null);

  const days = useMemo(() => (grid?.cells.filter((d): d is Date => d !== null) ?? []), [grid]);
  const fullMoon = useMemo(() => closestTo(days, 0.5), [days]);
  const newMoon = useMemo(() => closestTo(days, 0), [days]);

  useEffect(() => {
    if (grid && !selected) setSelected(grid.today);
  }, [grid, selected]);

  const sessionsFor = (d: Date): ScheduleSession[] => {
    const list = sessionsOn(WEEK, mondayIndex(d));
    return fullMoon && isSameDay(d, fullMoon) ? [...list, MOON_FLOW] : list;
  };

  const selectedSessions = selected ? sessionsFor(selected) : [];

  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:gap-8">
      {/* Month */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-sm font-semibold" style={{ color: MOONDAY.red }}>
            {grid?.label ?? " "}
          </span>
          {teachers.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggle(t)}
              className="rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors"
              style={
                isActive(t)
                  ? { backgroundColor: MOONDAY.red, borderColor: MOONDAY.red, color: MOONDAY.cream }
                  : { borderColor: MOONDAY.line, color: MOONDAY.red }
              }
            >
              {t}
            </button>
          ))}
          {hasQuery && (
            <button type="button" onClick={() => setQuery("")} className="text-sm underline underline-offset-4" style={{ color: MOONDAY.ink }}>
              Everyone
            </button>
          )}
        </div>

        <div className="mt-5 grid grid-cols-7 gap-1.5 sm:gap-2">
          {WEEKDAYS_SHORT.map((d) => (
            <span key={d} className="pb-1 text-center text-xs font-semibold" style={{ color: MOONDAY.red }}>
              {d}
            </span>
          ))}
          {(grid?.cells ?? Array.from({ length: 35 }, () => null)).map((date, i) => {
            if (!date) return <span key={`pad-${i}`} />;
            const list = sessionsFor(date);
            const lit = list.filter(matches).length;
            const on = selected ? isSameDay(date, selected) : false;
            const today = grid ? isSameDay(date, grid.today) : false;
            const isFull = fullMoon ? isSameDay(date, fullMoon) : false;
            const isNew = newMoon ? isSameDay(date, newMoon) : false;
            const dim = hasQuery && lit === 0;
            return (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => setSelected(date)}
                aria-pressed={on}
                aria-label={`${format(date, "EEEE d MMMM")}, ${moonPhaseName(nightPhase(date))}, ${list.length} classes`}
                className="group relative flex aspect-[4/5] flex-col items-center justify-between rounded-[12px] border px-1 pb-1.5 pt-2 transition-all duration-300 hover:-translate-y-0.5 sm:aspect-square sm:px-2"
                style={{
                  borderColor: on || isFull ? MOONDAY.red : MOONDAY.line,
                  backgroundColor: on ? MOONDAY.red : isFull ? MOONDAY.blush : "transparent",
                  opacity: dim ? 0.35 : 1,
                }}
              >
                <span className="flex w-full items-center justify-between text-[0.7rem] font-bold sm:text-xs" style={{ color: on ? MOONDAY.cream : MOONDAY.red }}>
                  {format(date, "d")}
                  {today && (
                    <span className="size-1.5 rounded-full" style={{ backgroundColor: on ? MOONDAY.cream : MOONDAY.frame }} />
                  )}
                </span>
                <MoonGlyph
                  phase={nightPhase(date)}
                  size="56%"
                  light={on ? MOONDAY.cream : MOONDAY.frame}
                  dark={on ? MOONDAY.deep : MOONDAY.blush}
                />
                {isFull || isNew ? (
                  <span className="h-2.5 text-[0.55rem] font-bold uppercase leading-none tracking-wide sm:text-[0.6rem]" style={{ color: on ? MOONDAY.cream : MOONDAY.red }}>
                    {isFull ? "Full" : "New"}
                  </span>
                ) : (
                  <span className="flex h-2.5 items-center gap-[3px]" aria-hidden>
                    {Array.from({ length: Math.min(4, hasQuery ? lit : list.length) }, (_, k) => (
                      <span key={k} className="size-1 rounded-full" style={{ backgroundColor: on ? MOONDAY.cream : MOONDAY.frame }} />
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Night */}
      <div className="rounded-[18px] p-6 md:p-8" style={{ backgroundColor: MOONDAY.red, color: MOONDAY.cream }}>
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.toISOString()}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <div className="flex items-center gap-5">
                <MoonGlyph phase={nightPhase(selected)} size={76} light={MOONDAY.cream} dark={MOONDAY.deep} />
                <div>
                  <p className="text-sm font-semibold opacity-90">
                    {grid && isSameDay(selected, grid.today) ? "Tonight" : format(selected, "EEEE")}
                  </p>
                  <p className="text-[2.2rem] font-[760] leading-none tracking-[-0.04em]">{format(selected, "d MMMM")}</p>
                  <p className="mt-1.5 text-sm font-semibold opacity-90">{moonPhaseName(nightPhase(selected))}</p>
                </div>
              </div>

              <ul className="mt-7 divide-y" style={{ borderColor: "rgba(246,242,231,0.25)" }}>
                {selectedSessions.map((s) => {
                  const lit = matches(s);
                  const special = s.id === MOON_FLOW.id;
                  return (
                    <li
                      key={s.id}
                      className="flex items-baseline gap-4 py-3.5 transition-opacity"
                      style={{ borderColor: "rgba(246,242,231,0.25)", opacity: lit ? 1 : 0.4 }}
                    >
                      <span className="w-12 shrink-0 text-sm font-bold tabular-nums">{s.start}</span>
                      <span className="flex-1">
                        <span className="block text-lg font-[700] leading-tight tracking-[-0.02em]">
                          {special && "● "}
                          {s.className}
                        </span>
                        <span className="text-sm opacity-85">
                          with {s.teacher} · until {s.end}
                        </span>
                      </span>
                    </li>
                  );
                })}
                {selectedSessions.length === 0 && (
                  <li className="py-4 text-lg">A dark, quiet night. The studio rests.</li>
                )}
              </ul>

              {fullMoon && !isSameDay(selected, fullMoon) && (
                <button
                  type="button"
                  onClick={() => setSelected(fullMoon)}
                  className="mt-6 rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                  style={{ backgroundColor: MOONDAY.cream, color: MOONDAY.red }}
                >
                  Full moon flow · {format(fullMoon, "EEE d MMM")} →
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { GYM_WEEK, WEEKDAYS, WEEKDAYS_SHORT, sessionsOn, type ScheduleSession } from "@/lib/layouts/schedule";
import { useScheduleSearch } from "@/components/layouts/schedule/use-schedule-search";
import { useGymTime } from "./clock";
import { chooseSession, useScheduleFilter } from "./events";

/* The board spans 06:30–20:30; every hour is HOUR_PX tall. */
const DAY_START = 6.5 * 60;
const DAY_END = 20.5 * 60;
const HOUR_PX = 54;
const HOURS = Array.from({ length: 14 }, (_, i) => i + 7);

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const yOf = (minutes: number) => ((minutes - DAY_START) / 60) * HOUR_PX;

interface Placed {
  session: ScheduleSession;
  lane: number;
  lanes: number;
}

/** Side-by-side lanes for sessions that overlap (Saturday morning does). */
function placeDay(sessions: ScheduleSession[]): Placed[] {
  const placed: Placed[] = [];
  let cluster: Placed[] = [];
  let laneEnds: number[] = [];
  let clusterEnd = -1;
  const flush = () => {
    for (const p of cluster) p.lanes = laneEnds.length;
    placed.push(...cluster);
    cluster = [];
    laneEnds = [];
    clusterEnd = -1;
  };
  for (const session of sessions) {
    const start = toMinutes(session.start);
    const end = toMinutes(session.end);
    if (cluster.length > 0 && start >= clusterEnd) flush();
    let lane = laneEnds.findIndex((e) => e <= start);
    if (lane < 0) {
      lane = laneEnds.length;
      laneEnds.push(end);
    } else {
      laneEnds[lane] = end;
    }
    cluster.push({ session, lane, lanes: 1 });
    clusterEnd = Math.max(clusterEnd, end);
  }
  if (cluster.length > 0) flush();
  return placed;
}

const bookLabel = (s: ScheduleSession) => `Book ${s.className} with ${s.teacher}, ${WEEKDAYS[s.weekday]} ${s.start}`;

/**
 * Gym 6 · Chalk — the week on the board. The whole week on a time grid on
 * wide screens (overlaps side by side, a "now" line on today, in gym time),
 * one day at a time on small ones. Search lights matching sessions; tapping a
 * session preselects it in the booking form.
 */
export function WeekBoard() {
  const { query, setQuery, toggle, isActive, matches, hasQuery, matchCount, teachers, classNames } =
    useScheduleSearch(GYM_WEEK);
  useScheduleFilter(setQuery);
  const now = useGymTime(60);
  const [picked, setPicked] = useState<number | null>(null);

  const today = now?.weekday ?? null;
  const nowMinutes = now ? Math.floor(now.seconds / 60) : null;
  const day = picked ?? today ?? 0;
  const week = useMemo(() => WEEKDAYS_SHORT.map((_, i) => placeDay(sessionsOn(GYM_WEEK, i))), []);

  return (
    <div>
      {/* Search */}
      <div className="rounded-md border border-white/10 bg-[#121211] p-5 sm:p-6">
        <div className="flex items-center gap-3 border-b-2 border-white/15 pb-3 transition-colors focus-within:border-[#f5c518]">
          <Search className="size-5 shrink-0 text-white/50" />
          <label htmlFor="chalk-search" className="sr-only">
            Search the timetable
          </label>
          <input
            id="chalk-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Coach, class or style — try “Nadia”"
            className="font-display w-full bg-transparent text-2xl uppercase tracking-[0.02em] text-white placeholder:text-white/30 focus:outline-none sm:text-3xl"
          />
          {hasQuery && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="grid size-8 shrink-0 place-items-center rounded-sm border border-white/15 text-white/70 transition-colors hover:border-[#f5c518] hover:text-[#f5c518]"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {[...teachers, ...classNames.slice(0, 5)].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => toggle(term)}
              aria-pressed={isActive(term)}
              className={`rounded-sm border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
                isActive(term)
                  ? "border-[#f5c518] bg-[#f5c518] text-black"
                  : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/30 hover:text-white"
              }`}
            >
              {term}
            </button>
          ))}
          <span className="ml-auto pl-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
            {hasQuery ? `${matchCount} matching sessions` : `${GYM_WEEK.length} sessions this week`}
          </span>
        </div>
      </div>

      {/* Wide screens: the whole week on a time grid */}
      <div className="mt-4 hidden overflow-hidden rounded-md border border-white/10 bg-[#0f0f0e] lg:block">
        <div className="grid grid-cols-[4.5rem_repeat(7,minmax(0,1fr))] border-b border-white/10">
          <div />
          {WEEKDAYS_SHORT.map((label, i) => (
            <div
              key={label}
              className={`border-l border-white/[0.07] px-3 py-3 ${i === today ? "bg-[#f5c518] text-black" : ""}`}
            >
              <p className="font-display text-2xl uppercase leading-none">{label}</p>
              <p className={`mt-1 font-mono text-[9.5px] uppercase tracking-[0.2em] ${i === today ? "text-black/60" : "text-white/35"}`}>
                {i === today ? "Today" : WEEKDAYS[i]}
              </p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[4.5rem_repeat(7,minmax(0,1fr))]" style={{ height: yOf(DAY_END) }}>
          <div className="relative">
            {HOURS.map((h) => (
              <span
                key={h}
                className="absolute right-3 -translate-y-1/2 font-mono text-[10px] text-white/35"
                style={{ top: yOf(h * 60) }}
              >
                {String(h).padStart(2, "0")}:00
              </span>
            ))}
          </div>
          {week.map((placed, i) => (
            <div
              key={WEEKDAYS_SHORT[i]}
              className={`relative border-l border-white/[0.07] ${i === today ? "bg-[#f5c518]/[0.04]" : ""}`}
            >
              {HOURS.map((h) => (
                <div key={h} className="absolute inset-x-0 border-t border-white/[0.05]" style={{ top: yOf(h * 60) }} />
              ))}
              {placed.map(({ session: s, lane, lanes }) => {
                const top = yOf(toMinutes(s.start));
                const height = yOf(toMinutes(s.end)) - top - 4;
                const lit = matches(s);
                const hot = hasQuery && lit;
                return (
                  <a
                    key={s.id}
                    href="#book"
                    onClick={() => chooseSession(s.id)}
                    aria-label={bookLabel(s)}
                    title={bookLabel(s)}
                    className={`absolute overflow-hidden rounded-[3px] border-l-[3px] px-2.5 py-1.5 transition-all duration-300 ${
                      hot
                        ? "z-10 border-black bg-[#f5c518] text-black"
                        : lit
                          ? "border-[#f5c518] bg-[#1a1a18] hover:bg-[#232320]"
                          : "border-white/10 bg-[#141413] opacity-25"
                    }`}
                    style={{
                      top: top + 2,
                      height,
                      left: `calc(${(lane / lanes) * 100}% + 4px)`,
                      width: `calc(${100 / lanes}% - 8px)`,
                    }}
                  >
                    <p className={`font-mono text-[10px] ${hot ? "text-black/60" : "text-[#f5c518]"}`}>{s.start}</p>
                    <p className="font-display truncate text-[15px] font-bold uppercase leading-[1.05] tracking-[0.01em]">{s.className}</p>
                    {height > 56 && (
                      <p
                        className={`mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.12em] ${
                          hot ? "text-black/60" : "text-white/45"
                        }`}
                      >
                        {s.teacher}
                      </p>
                    )}
                  </a>
                );
              })}
              {i === today && nowMinutes !== null && nowMinutes > DAY_START && nowMinutes < DAY_END && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 z-20 flex items-center"
                  style={{ top: yOf(nowMinutes) }}
                >
                  <span className="-ml-1 size-2 rounded-full bg-[#ff3b30]" />
                  <span className="h-[2px] flex-1 bg-[#ff3b30]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Small screens: one day at a time */}
      <div className="mt-4 lg:hidden">
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:px-8 [&::-webkit-scrollbar]:hidden">
          {WEEKDAYS_SHORT.map((label, i) => {
            const active = i === day;
            const hits = hasQuery && sessionsOn(GYM_WEEK, i).some(matches);
            return (
              <button
                key={label}
                type="button"
                onClick={() => setPicked(i)}
                aria-pressed={active}
                className={`relative flex min-w-16 shrink-0 flex-col items-center rounded-sm border px-4 py-2 transition-colors ${
                  active ? "border-[#f5c518] bg-[#f5c518] text-black" : "border-white/10 bg-[#121211] text-white"
                }`}
              >
                <span className="font-display text-xl uppercase leading-none">{label}</span>
                <span className={`mt-1 font-mono text-[9px] uppercase tracking-[0.16em] ${active ? "text-black/60" : "text-white/40"}`}>
                  {i === today ? "Today" : " "}
                </span>
                {hits && (
                  <span className={`absolute right-1.5 top-1.5 size-1.5 rounded-full ${active ? "bg-black" : "bg-[#f5c518]"}`} />
                )}
              </button>
            );
          })}
        </div>
        <ul className="mt-3 flex flex-col gap-2">
          {sessionsOn(GYM_WEEK, day).map((s) => {
            const lit = matches(s);
            return (
              <li key={s.id}>
                <a
                  href="#book"
                  onClick={() => chooseSession(s.id)}
                  aria-label={bookLabel(s)}
                  className={`flex items-center gap-4 rounded-sm border-l-[3px] px-4 py-3 transition-colors ${
                    hasQuery && lit
                      ? "border-black bg-[#f5c518] text-black"
                      : lit
                        ? "border-[#f5c518] bg-[#141413]"
                        : "border-white/10 bg-[#121211] opacity-30"
                  }`}
                >
                  <span className={`w-[6.5rem] shrink-0 font-mono text-xs ${hasQuery && lit ? "text-black/70" : "text-[#f5c518]"}`}>
                    {s.start}–{s.end}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="font-display truncate text-xl uppercase leading-none">{s.className}</span>
                    <span className={`mt-1 truncate font-mono text-[10px] uppercase tracking-[0.16em] ${hasQuery && lit ? "text-black/60" : "text-white/45"}`}>
                      {s.teacher} · {s.tags.join(" · ")}
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

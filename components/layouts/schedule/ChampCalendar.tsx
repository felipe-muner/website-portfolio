"use client";

import Link from "next/link";
import { isSameDay } from "date-fns";
import { Search, Star } from "lucide-react";
import { GYM_WEEK, WEEKDAYS_SHORT, sessionsOn } from "@/lib/layouts/schedule";
import { mondayIndex, useMonthGrid, useScheduleSearch } from "./use-schedule-search";

const CREAM = "#f3ead9";
const NAVY = "#1d2b4f";
const RED = "#b3322b";
const GOLDY = "#f3b13b";

/**
 * Gym 4 · Champ — "The Fight Calendar". A full month of bouts, day numbers
 * and all; today gets the title belt. Search a coach or class and only
 * their fights stay on the poster.
 */
export function ChampCalendar({ displayClass }: { displayClass: string }) {
  const { query, setQuery, toggle, isActive, matches, hasQuery, matchCount, teachers } =
    useScheduleSearch(GYM_WEEK);
  const grid = useMonthGrid();

  return (
    <div>
      {/* Matchmaker search */}
      <div
        className="rounded-xl border-4 bg-white/70 p-5 shadow-[6px_6px_0_0] shadow-[#1d2b4f] md:p-6"
        style={{ borderColor: NAVY }}
      >
        <label htmlFor="champ-search" className="text-xs font-extrabold uppercase tracking-[0.3em]" style={{ color: RED }}>
          ★ Find your matchup ★
        </label>
        <div className="mt-3 flex items-center gap-3 rounded-full border-2 bg-white px-4 py-2.5" style={{ borderColor: NAVY }}>
          <Search className="size-4 shrink-0" style={{ color: RED }} />
          <input
            id="champ-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Coach Marco? Boot Camp? Type it in…"
            className="w-full bg-transparent text-sm font-semibold focus:outline-none"
          />
          {hasQuery && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-xs font-extrabold uppercase tracking-widest hover:underline"
              style={{ color: RED }}
            >
              Clear
            </button>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {teachers.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggle(t)}
              className={`rounded-full border-2 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.15em] transition-transform hover:-rotate-2 ${
                isActive(t) ? "text-white" : ""
              }`}
              style={{
                borderColor: NAVY,
                backgroundColor: isActive(t) ? RED : "transparent",
              }}
            >
              {t}
            </button>
          ))}
          <span className="ml-auto text-xs font-extrabold uppercase tracking-[0.2em]" style={{ color: `${NAVY}cc` }}>
            {hasQuery ? `${matchCount} bouts on the card` : "Every bout, every week"}
          </span>
        </div>
      </div>

      {/* Month header */}
      <div className="mt-10 text-center">
        <p className={`${displayClass} text-4xl uppercase md:text-5xl`} style={{ color: NAVY }}>
          {grid?.label ?? "This month"}
        </p>
        <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.3em]" style={{ color: RED }}>
          One month — fights nightly
        </p>
      </div>

      {/* Calendar */}
      <div className="mt-6 overflow-x-auto pb-2">
        <div className="min-w-[56rem]">
          <div className="grid grid-cols-7">
            {WEEKDAYS_SHORT.map((d) => (
              <p key={d} className="px-2 py-2 text-center text-xs font-extrabold uppercase tracking-[0.25em]" style={{ color: NAVY }}>
                {d}
              </p>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {(grid?.cells ?? Array.from({ length: 35 }, () => null)).map((date, i) => {
              if (!date) {
                return <div key={`pad-${i}`} className="min-h-28 rounded-lg border-2 border-dashed opacity-30" style={{ borderColor: `${NAVY}40` }} />;
              }
              const daySessions = sessionsOn(GYM_WEEK, mondayIndex(date));
              const today = grid ? isSameDay(date, grid.today) : false;
              return (
                <div
                  key={date.toISOString()}
                  className={`min-h-28 rounded-lg border-2 p-1.5 transition-colors ${today ? "shadow-[4px_4px_0_0] shadow-[#b3322b]" : ""}`}
                  style={{ borderColor: NAVY, backgroundColor: today ? "#fff" : `${CREAM}` }}
                >
                  <div className="flex items-center justify-between px-1">
                    <span className={`${displayClass} text-lg`} style={{ color: today ? RED : NAVY }}>
                      {date.getDate()}
                    </span>
                    {today && <Star className="size-3.5 fill-current" style={{ color: GOLDY }} />}
                  </div>
                  <div className="mt-1 space-y-1">
                    {daySessions.map((s) => {
                      const lit = matches(s);
                      return (
                        <Link
                          key={`${date.toISOString()}-${s.id}`}
                          href={s.href}
                          className={`block rounded px-1.5 py-1 text-xs font-extrabold uppercase leading-tight tracking-[0.06em] transition-all duration-300 ${
                            lit ? (hasQuery ? "text-white" : "hover:text-white") : "opacity-45"
                          }`}
                          style={{
                            backgroundColor: lit && hasQuery ? RED : `${NAVY}1f`,
                            color: lit && hasQuery ? "#fff" : NAVY,
                          }}
                        >
                          {s.start} {s.className}
                          <span className="block text-[0.7rem] font-bold opacity-70">vs. {s.teacher}</span>
                        </Link>
                      );
                    })}
                    {daySessions.length === 0 && (
                      <p className="px-1.5 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: `${NAVY}88` }}>
                        Rest day
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

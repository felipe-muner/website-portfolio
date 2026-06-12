"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { format } from "date-fns";
import { GYM_WEEK, WEEKDAYS_SHORT, sessionsOn } from "@/lib/layouts/schedule";
import { useScheduleSearch, useWeekDates } from "./use-schedule-search";

/**
 * Gym 1 · Forge — "The Board". A wall-of-steel weekly grid: seven columns,
 * orange ignition on matches, everything else drops to ash.
 */
export function ForgeBoard({ displayClass }: { displayClass: string }) {
  const { query, setQuery, toggle, isActive, matches, hasQuery, matchCount, teachers, classNames } =
    useScheduleSearch(GYM_WEEK);
  const dates = useWeekDates();

  return (
    <div>
      {/* Search console */}
      <div className="border-2 border-white/15 bg-[#111] p-5 md:p-7">
        <label
          htmlFor="forge-search"
          className="text-sm font-bold uppercase tracking-[0.3em] text-brand-orange"
        >
          Find your fight
        </label>
        <div className="mt-3 flex items-center gap-3 border-b-2 border-brand-orange pb-3">
          <Search className="size-5 text-white/70" />
          <input
            id="forge-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Coach, class or style — try “Nadia” or “boot camp”…"
            className={`${displayClass} w-full bg-transparent text-2xl uppercase tracking-wide text-white placeholder:text-white/45 focus:outline-none md:text-3xl`}
          />
          {hasQuery && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="text-white/70 transition-colors hover:text-brand-orange"
            >
              <X className="size-5" />
            </button>
          )}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {[...teachers, ...classNames.slice(0, 4)].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => toggle(term)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] transition-all ${
                isActive(term)
                  ? "bg-brand-orange text-black"
                  : "bg-white/10 text-white/85 hover:bg-white/20 hover:text-white"
              }`}
            >
              {term}
            </button>
          ))}
          <span className="ml-auto text-xs font-bold uppercase tracking-[0.2em] text-white/75">
            {hasQuery ? `${matchCount} sessions lit` : `${GYM_WEEK.length} sessions / week`}
          </span>
        </div>
      </div>

      {/* The board */}
      <div className="mt-6 overflow-x-auto pb-2">
        <div className="grid min-w-[64rem] grid-cols-7 gap-px border border-white/10 bg-white/10">
          {WEEKDAYS_SHORT.map((day, i) => (
            <div key={day} className="bg-brand-orange px-3 py-3 text-black">
              <p className={`${displayClass} text-xl uppercase`}>{day}</p>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/75">
                {dates ? format(dates[i], "d MMM") : " "}
              </p>
            </div>
          ))}
          {WEEKDAYS_SHORT.map((day, i) => (
            <div key={`col-${day}`} className="flex min-h-[22rem] flex-col gap-px bg-[#0b0b0b]">
              {sessionsOn(GYM_WEEK, i).map((s) => {
                const lit = matches(s);
                return (
                  <Link
                    key={s.id}
                    href={s.href}
                    className={`group block border-l-2 p-3 transition-all duration-300 ${
                      lit
                        ? hasQuery
                          ? "border-brand-orange bg-brand-orange text-black"
                          : "border-brand-orange/40 bg-[#141414] hover:border-brand-orange hover:bg-[#1c1c1c]"
                        : "border-transparent bg-[#0e0e0e] opacity-40 grayscale"
                    }`}
                  >
                    <p className={`${displayClass} text-base leading-tight uppercase`}>{s.start}</p>
                    <p className="mt-1 text-sm font-bold uppercase leading-snug tracking-wide">
                      {s.className}
                    </p>
                    <p
                      className={`mt-1 text-xs font-bold uppercase tracking-[0.18em] ${
                        lit && hasQuery ? "text-black/60" : "text-brand-orange"
                      }`}
                    >
                      {s.teacher}
                    </p>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

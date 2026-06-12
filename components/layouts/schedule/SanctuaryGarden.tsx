"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Leaf } from "lucide-react";
import { YOGA_WEEK, WEEKDAYS, sessionsOn } from "@/lib/layouts/schedule";
import { useScheduleSearch, useWeekDates } from "./use-schedule-search";

const INK = "#33312b";
const TERRA = "#c4663f";
const PALM = "#41573f";

/**
 * Yoga 1 · Sanctuary — "The Week Garden". Seven arched beds, one per day;
 * each class is a seed pill. Search a teacher or practice and watch their
 * sessions bloom while the rest of the garden rests.
 */
export function SanctuaryGarden({ displayClass }: { displayClass: string }) {
  const { query, setQuery, toggle, isActive, matches, hasQuery, matchCount, teachers, classNames } =
    useScheduleSearch(YOGA_WEEK);
  const dates = useWeekDates();

  return (
    <div>
      {/* Gentle search */}
      <div className="mx-auto max-w-2xl text-center">
        <div className="flex items-center gap-3 rounded-full border-2 bg-white/70 px-6 py-3.5 shadow-sm transition-shadow focus-within:shadow-lg focus-within:shadow-[#c4663f]/15" style={{ borderColor: `${PALM}40` }}>
          <Leaf className="size-4 shrink-0" style={{ color: TERRA }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find your teacher or practice… Isla, reformer, breathwork"
            aria-label="Search the schedule"
            className="w-full bg-transparent text-sm focus:outline-none"
            style={{ color: INK }}
          />
          {hasQuery && (
            <button type="button" onClick={() => setQuery("")} className="text-xs font-bold uppercase tracking-widest" style={{ color: PALM }}>
              clear
            </button>
          )}
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {[...teachers, ...classNames.slice(0, 3)].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => toggle(term)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] transition-all ${
                isActive(term) ? "text-white" : "bg-white/60 hover:bg-white"
              }`}
              style={isActive(term) ? { backgroundColor: TERRA } : { color: PALM }}
            >
              {term}
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs uppercase tracking-[0.25em]" style={{ color: `${INK}b3` }}>
          {hasQuery ? `${matchCount} sessions in bloom` : `${YOGA_WEEK.length} sessions each week`}
        </p>
      </div>

      {/* The garden */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
        {WEEKDAYS.map((dayName, i) => {
          const daySessions = sessionsOn(YOGA_WEEK, i);
          const anyLit = daySessions.some(matches);
          return (
            <div
              key={dayName}
              className={`rounded-t-[4rem] rounded-b-2xl border bg-white/55 px-3 pb-4 pt-8 text-center transition-all duration-500 ${
                hasQuery && !anyLit ? "opacity-50" : ""
              }`}
              style={{ borderColor: `${PALM}30` }}
            >
              <p className={`${displayClass} text-2xl`} style={{ color: PALM }}>
                {dayName.slice(0, 3)}
              </p>
              <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: `${INK}99` }}>
                {dates ? format(dates[i], "d MMM") : " "}
              </p>
              <div className="mt-4 space-y-2">
                {daySessions.map((s) => {
                  const lit = matches(s);
                  return (
                    <Link
                      key={s.id}
                      href={s.href}
                      className={`block rounded-3xl px-3 py-2.5 transition-all duration-500 ${
                        lit
                          ? hasQuery
                            ? "scale-[1.04] text-white shadow-md"
                            : "bg-white hover:shadow-md"
                          : "opacity-45 grayscale"
                      }`}
                      style={lit && hasQuery ? { backgroundColor: TERRA } : !hasQuery ? undefined : { backgroundColor: "#fff" }}
                    >
                      <span className={`${displayClass} block text-lg leading-tight`} style={{ color: lit && hasQuery ? "#fff" : INK }}>
                        {s.start}
                      </span>
                      <span className="block text-xs font-bold uppercase leading-snug tracking-[0.08em]" style={{ color: lit && hasQuery ? "#fff" : PALM }}>
                        {s.className}
                      </span>
                      <span className="block text-xs italic" style={{ color: lit && hasQuery ? "#ffffffcc" : `${INK}b3` }}>
                        with {s.teacher}
                      </span>
                    </Link>
                  );
                })}
                {daySessions.length === 0 && (
                  <p className="px-2 py-4 text-xs italic" style={{ color: `${INK}99` }}>
                    a day of rest
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

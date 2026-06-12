"use client";

import Link from "next/link";
import { format } from "date-fns";
import { GYM_WEEK, WEEKDAYS_SHORT } from "@/lib/layouts/schedule";
import { useScheduleSearch, useWeekDates } from "./use-schedule-search";

const INK = "#161616";

/**
 * Gym 2 · Concrete — "The Punch Card". A time × weekday production matrix:
 * every session is a stamped slot; the search stamps matches in safety
 * orange and fades the rest of the card.
 */
export function ConcretePunchCard({ displayClass }: { displayClass: string }) {
  const { query, setQuery, toggle, isActive, matches, hasQuery, matchCount, teachers } =
    useScheduleSearch(GYM_WEEK);
  const dates = useWeekDates();

  const times = [...new Set(GYM_WEEK.map((s) => s.start))].sort();

  return (
    <div>
      {/* Requisition form */}
      <div className="border-2 px-6 py-5 md:px-12" style={{ borderColor: INK }}>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <label htmlFor="concrete-search" className="text-xs font-bold uppercase tracking-[0.25em]">
            Query personnel / program:
          </label>
          <div className="flex min-w-64 flex-1 items-center gap-2 border-b-2" style={{ borderColor: INK }}>
            <span className="text-[#f36100]">▸</span>
            <input
              id="concrete-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. DIANA, RACE PREP, MOBILITY…"
              className="w-full bg-transparent py-2 text-sm uppercase tracking-[0.15em] placeholder:text-[#161616]/55 focus:outline-none"
            />
            {hasQuery && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-xs font-bold uppercase tracking-widest text-[#161616]/75 hover:text-[#f36100]"
              >
                [clear]
              </button>
            )}
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#161616]/75">
            {hasQuery ? `→ ${matchCount} slots matched` : `→ ${GYM_WEEK.length} slots filed`}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {teachers.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggle(t)}
              className={`border px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
                isActive(t)
                  ? "border-transparent bg-[#f36100] text-black"
                  : "border-[#161616]/40 hover:bg-[#161616] hover:text-[#e8e6e0]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Matrix */}
      <div className="mt-6 overflow-x-auto pb-2">
        <table className="w-full min-w-[60rem] border-collapse border-2" style={{ borderColor: INK }}>
          <thead>
            <tr>
              <th className="border-2 bg-[#161616] px-3 py-3 text-left text-xs font-bold uppercase tracking-[0.25em] text-[#e8e6e0]" style={{ borderColor: INK }}>
                Time
              </th>
              {WEEKDAYS_SHORT.map((day, i) => (
                <th key={day} className="border-2 bg-[#161616] px-3 py-3 text-left text-[#e8e6e0]" style={{ borderColor: INK }}>
                  <span className={`${displayClass} block text-sm uppercase`}>{day}</span>
                  <span className="text-xs font-normal uppercase tracking-[0.2em] text-[#e8e6e0]/50">
                    {dates ? format(dates[i], "dd/MM") : "—"}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map((time) => (
              <tr key={time}>
                <td className={`${displayClass} border-2 px-3 py-2 text-sm`} style={{ borderColor: INK }}>
                  {time}
                </td>
                {WEEKDAYS_SHORT.map((_, day) => {
                  const slot = GYM_WEEK.find((s) => s.weekday === day && s.start === time);
                  if (!slot) {
                    return (
                      <td key={day} className="border-2 px-3 py-2" style={{ borderColor: INK }}>
                        <span className="text-xs uppercase tracking-[0.2em] text-[#161616]/35">
                          · · ·
                        </span>
                      </td>
                    );
                  }
                  const lit = matches(slot);
                  return (
                    <td
                      key={day}
                      className={`border-2 px-0 py-0 transition-all duration-300 ${
                        lit ? "" : "opacity-45"
                      }`}
                      style={{ borderColor: INK }}
                    >
                      <Link
                        href={slot.href}
                        className={`block h-full px-3 py-2 transition-colors ${
                          lit && hasQuery
                            ? "bg-[#f36100] text-black"
                            : "hover:bg-[#161616] hover:text-[#e8e6e0]"
                        }`}
                      >
                        <span className="block text-xs font-bold uppercase leading-tight tracking-[0.1em]">
                          {slot.className}
                        </span>
                        <span
                          className={`block text-xs uppercase tracking-[0.2em] ${
                            lit && hasQuery ? "text-black/60" : "text-[#f36100]"
                          }`}
                        >
                          {slot.teacher} · {slot.start}–{slot.end}
                        </span>
                      </Link>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs uppercase tracking-[0.25em] text-[#161616]/75">
        Form 07-B — weekly production schedule · stamped slots recur weekly
      </p>
    </div>
  );
}

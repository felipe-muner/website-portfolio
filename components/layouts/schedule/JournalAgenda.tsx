"use client";

import { useState } from "react";
import Link from "next/link";
import { format, isSameDay } from "date-fns";
import { YOGA_WEEK, sessionsOn } from "@/lib/layouts/schedule";
import { mondayIndex, useMonthGrid, useScheduleSearch } from "./use-schedule-search";

const INK = "#1f1d1a";
const RUST = "#a4502c";

/**
 * Yoga 4 · Journal — "The Agenda". The month set in type: every date a
 * heading, every class a line item with an italic byline. Search like a
 * card catalogue; matches keep their ink, the rest fade to ghost text.
 */
export function JournalAgenda({ displayClass }: { displayClass: string }) {
  const { query, setQuery, toggle, isActive, matches, hasQuery, matchCount, teachers } =
    useScheduleSearch(YOGA_WEEK);
  const grid = useMonthGrid();
  const [expanded, setExpanded] = useState(false);

  const monthDays = (grid?.cells.filter(Boolean) as Date[] | undefined) ?? [];
  const visibleDays = expanded ? monthDays : monthDays.slice(0, 10);

  return (
    <div>
      {/* Card-catalogue search */}
      <div className="border-y-2 py-6" style={{ borderColor: INK }}>
        <div className="flex flex-wrap items-baseline gap-x-8 gap-y-4">
          <label htmlFor="journal-search" className={`${displayClass} text-2xl italic`} style={{ color: RUST }}>
            Looking for…
          </label>
          <div className="min-w-64 flex-1 border-b border-dotted" style={{ borderColor: `${INK}b3` }}>
            <input
              id="journal-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="a teacher, a practice, a mood — e.g. Isla, reformer, slow"
              className="w-full bg-transparent pb-1 text-base italic placeholder:not-italic placeholder:text-sm focus:outline-none"
              style={{ color: INK }}
            />
          </div>
          <span className="text-xs uppercase tracking-[0.3em]" style={{ color: `${INK}99` }}>
            {hasQuery ? `${matchCount} entries / week` : "the full agenda"}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[0.7rem] uppercase tracking-[0.25em]">
          {teachers.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggle(t)}
              className={`transition-colors ${isActive(t) ? "underline underline-offset-4" : "hover:underline"}`}
              style={{ color: isActive(t) ? RUST : `${INK}99` }}
            >
              {isActive(t) ? "✕ " : ""}
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Month agenda */}
      <p className={`${displayClass} mt-10 text-3xl italic md:text-4xl`} style={{ color: INK }}>
        {grid?.label ?? "This month"}, day by day
      </p>
      <div className="mt-6 columns-1 gap-12 md:columns-2 lg:columns-3">
        {visibleDays.map((date) => {
          const daySessions = sessionsOn(YOGA_WEEK, mondayIndex(date));
          const today = grid ? isSameDay(date, grid.today) : false;
          if (daySessions.length === 0) return null;
          const anyLit = daySessions.some(matches);
          return (
            <div
              key={date.toISOString()}
              className={`mb-8 break-inside-avoid transition-opacity duration-500 ${hasQuery && !anyLit ? "opacity-45" : ""}`}
            >
              <div className="flex items-baseline gap-3 border-b pb-1" style={{ borderColor: today ? RUST : `${INK}40` }}>
                <span className={`${displayClass} text-3xl`} style={{ color: today ? RUST : INK }}>
                  {format(date, "d")}
                </span>
                <span className="text-xs uppercase tracking-[0.3em]" style={{ color: `${INK}b3` }}>
                  {format(date, "EEEE")}
                </span>
                {today && (
                  <span className="ml-auto text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: RUST }}>
                    today
                  </span>
                )}
              </div>
              <ul className="mt-3 space-y-2.5">
                {daySessions.map((s) => {
                  const lit = matches(s);
                  return (
                    <li key={`${date.toISOString()}-${s.id}`} className={`transition-opacity duration-500 ${lit ? "" : "opacity-45"}`}>
                      <Link href={s.href} className="group block">
                        <span className="flex items-baseline gap-3">
                          <span className="text-sm tabular-nums" style={{ color: RUST }}>
                            {s.start}
                          </span>
                          <span
                            className={`${displayClass} text-lg leading-snug transition-all group-hover:italic ${
                              lit && hasQuery ? "underline decoration-2 underline-offset-4" : ""
                            }`}
                            style={{ color: INK, textDecorationColor: RUST }}
                          >
                            {s.className}
                          </span>
                        </span>
                        <span className="block pl-12 text-sm italic" style={{ color: `${INK}b3` }}>
                          — taught by {s.teacher}, until {s.end}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
      {monthDays.length > 10 && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="border-2 border-[#1f1d1a] bg-transparent px-8 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f1d1a] transition-colors hover:bg-[#1f1d1a] hover:text-[#faf6ee]"
          >
            {expanded ? "Fold the agenda" : "Unfold the whole month"}
          </button>
        </div>
      )}
    </div>
  );
}

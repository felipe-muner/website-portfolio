"use client";

import { Search } from "lucide-react";
import { format } from "date-fns";
import type { ScheduleSession } from "@/lib/layouts/schedule";
import { MoonCalendar, type MoonCalendarTheme } from "./schedule/MoonCalendar";
import { useScheduleSearch } from "./schedule/use-schedule-search";

export interface MoonEventTheme extends MoonCalendarTheme {
  surface: string;
  border: string;
  radius: string;
  accentText: string;
}

interface MoonEventBoardProps {
  week: readonly ScheduleSession[];
  theme: MoonEventTheme;
  displayClass: string;
}

/**
 * Full-moon events calendar: a month of real moon phases with the party
 * line-up pinned to each night. Search a night, a DJ or a vibe and the
 * matching moons keep their glow.
 */
export function MoonEventBoard({ week, theme, displayClass }: MoonEventBoardProps) {
  const { query, setQuery, toggle, isActive, matches, hasQuery, matchCount } = useScheduleSearch(week);
  const chips = ["full moon", "sunset", "bass", "acoustic", "free"];

  return (
    <div>
      <div
        className="flex items-center gap-3 px-5 py-3.5"
        style={{ backgroundColor: theme.surface, border: `1.5px solid ${theme.border}`, borderRadius: theme.radius }}
      >
        <Search className="size-5 shrink-0" style={{ color: theme.accent }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Full moon? Bass? Sunset session?…"
          aria-label="Search the line-up"
          className="w-full bg-transparent text-base focus:outline-none"
          style={{ color: theme.text }}
        />
        <span className="shrink-0 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: theme.muted }}>
          {hasQuery ? `${matchCount} nights` : `${week.length} nights`}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {chips.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => toggle(c)}
            className="px-4 py-2 text-sm font-bold capitalize transition-all"
            style={{
              borderRadius: theme.radius,
              backgroundColor: isActive(c) ? theme.accent : "transparent",
              color: isActive(c) ? theme.accentText : theme.muted,
              border: `1.5px solid ${isActive(c) ? theme.accent : theme.border}`,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <MoonCalendar week={week} matches={matches} hasQuery={hasQuery} theme={theme} displayClass={displayClass}>
          {(selected, sessions) => (
            <div>
              <p className={`${displayClass} text-xl`} style={{ color: theme.text }}>
                {selected ? format(selected, "EEEE d MMMM") : ""}
              </p>
              {sessions.length === 0 ? (
                <p className="mt-2 text-sm" style={{ color: theme.muted }}>
                  No event this night — the beach rests. Grab a fire and a drink anyway.
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  {sessions.map((s) => {
                    const lit = matches(s);
                    return (
                      <div key={s.id} className={`flex items-baseline justify-between gap-4 ${lit ? "" : "opacity-40"}`}>
                        <div>
                          <p className="text-sm font-bold" style={{ color: theme.text }}>{s.className}</p>
                          <p className="text-xs" style={{ color: theme.muted }}>{s.teacher}</p>
                        </div>
                        <span className="shrink-0 text-xs font-bold tabular-nums" style={{ color: theme.accent }}>
                          {s.start}–{s.end}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </MoonCalendar>
      </div>
    </div>
  );
}

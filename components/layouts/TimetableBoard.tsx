"use client";

import { Search } from "lucide-react";
import type { ScheduleSession } from "@/lib/layouts/schedule";
import { WEEKDAYS, WEEKDAYS_SHORT, sessionsOn } from "@/lib/layouts/schedule";
import { useScheduleSearch, useWeekDates } from "./schedule/use-schedule-search";
import { format } from "date-fns";

export interface TimetableTheme {
  accent: string;
  accentText: string;
  text: string;
  muted: string;
  surface: string;
  card: string;
  border: string;
  radius: string;
}

interface TimetableBoardProps {
  week: readonly ScheduleSession[];
  theme: TimetableTheme;
  displayClass: string;
  placeholder?: string;
  /** Label of the searchable unit, e.g. "sessions". */
  unitLabel?: string;
}

/**
 * A themeable, searchable weekly timetable — free-text or chip matches keep
 * their ink, the rest fade. Shared by class-based templates (muay thai,
 * cooking, workshops).
 */
export function TimetableBoard({
  week,
  theme,
  displayClass,
  placeholder = "Search a class, coach or style…",
  unitLabel = "sessions",
}: TimetableBoardProps) {
  const { query, setQuery, toggle, isActive, matches, hasQuery, matchCount, classNames } =
    useScheduleSearch(week);
  const dates = useWeekDates();

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
          placeholder={placeholder}
          aria-label="Search the timetable"
          className="w-full bg-transparent text-base focus:outline-none"
          style={{ color: theme.text }}
        />
        <span className="shrink-0 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: theme.muted }}>
          {hasQuery ? `${matchCount} ${unitLabel}` : `${week.length} ${unitLabel}`}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {classNames.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => toggle(c)}
            className="px-4 py-2 text-sm font-bold transition-all"
            style={{
              borderRadius: theme.radius,
              backgroundColor: isActive(c.toLowerCase()) ? theme.accent : "transparent",
              color: isActive(c.toLowerCase()) ? theme.accentText : theme.muted,
              border: `1.5px solid ${isActive(c.toLowerCase()) ? theme.accent : theme.border}`,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {WEEKDAYS.map((day, wd) => {
          const sessions = sessionsOn(week, wd);
          return (
            <div
              key={day}
              className="flex flex-col p-4"
              style={{ backgroundColor: theme.card, borderRadius: theme.radius, border: `1px solid ${theme.border}` }}
            >
              <div className="flex items-baseline justify-between border-b pb-2" style={{ borderColor: theme.border }}>
                <span className={`${displayClass} text-lg`} style={{ color: theme.text }}>
                  {WEEKDAYS_SHORT[wd]}
                </span>
                <span className="text-xs" style={{ color: theme.muted }}>
                  {dates ? format(dates[wd], "d MMM") : ""}
                </span>
              </div>
              <div className="mt-3 flex flex-1 flex-col gap-2">
                {sessions.length === 0 && (
                  <span className="text-xs italic" style={{ color: theme.muted }}>
                    Rest day
                  </span>
                )}
                {sessions.map((s) => {
                  const lit = matches(s);
                  return (
                    <div
                      key={s.id}
                      className={`px-3 py-2 transition-all duration-300 ${lit ? "" : "opacity-35"}`}
                      style={{
                        borderRadius: theme.radius,
                        backgroundColor: lit && hasQuery ? `${theme.accent}1f` : "transparent",
                        border: `1px solid ${lit && hasQuery ? `${theme.accent}66` : theme.border}`,
                      }}
                    >
                      <p className="text-xs font-bold tabular-nums" style={{ color: theme.accent }}>
                        {s.start}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold leading-tight" style={{ color: theme.text }}>
                        {s.className}
                      </p>
                      <p className="text-xs" style={{ color: theme.muted }}>
                        {s.teacher}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs" style={{ color: theme.muted }}>
        Type a coach or style — the week lights up its matches. Representative week.
      </p>
    </div>
  );
}

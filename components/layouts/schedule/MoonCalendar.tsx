"use client";

import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { moonPhase, moonPhaseName } from "@/lib/layouts/moon";
import type { ScheduleSession } from "@/lib/layouts/schedule";
import { WEEKDAYS_SHORT, sessionsOn } from "@/lib/layouts/schedule";
import { MoonPhaseIcon } from "./MoonPhaseIcon";
import { mondayIndex, useMonthGrid } from "./use-schedule-search";

export interface MoonCalendarTheme {
  /** Lit part of the moons + accent text. */
  accent: string;
  /** Shadowed part of the moons. */
  dark: string;
  /** Primary text color. */
  text: string;
  /** Muted text color. */
  muted: string;
  /** Background of the selected-day ring. */
  selectedRing: string;
}

interface MoonCalendarProps {
  week: readonly ScheduleSession[];
  matches: (s: ScheduleSession) => boolean;
  hasQuery: boolean;
  theme: MoonCalendarTheme;
  /** Font class for date numbers / headings. */
  displayClass: string;
  /** Render the session list for the selected day. */
  children: (selected: Date | null, sessions: ScheduleSession[]) => React.ReactNode;
}

/**
 * A month of real moon phases, one moon per day. Days with matching classes
 * keep their glow; the rest wane. Tap a moon to read that day's sessions.
 * Shared by the night-themed templates and themed via props.
 */
export function MoonCalendar({ week, matches, hasQuery, theme, displayClass, children }: MoonCalendarProps) {
  const grid = useMonthGrid();
  const [selected, setSelected] = useState<Date | null>(null);

  const selectedSessions = selected ? sessionsOn(week, mondayIndex(selected)) : [];
  const fullMoon = grid?.cells.find(
    (d): d is Date => d !== null && moonPhaseName(moonPhase(d)) === "Full moon",
  );

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-1">
        <p className={`${displayClass} text-xl`} style={{ color: theme.text }}>
          {grid?.label ?? "This month"}
        </p>
        {fullMoon && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: theme.accent }}>
            ● Full moon — {format(fullMoon, "EEEE d")}
          </p>
        )}
      </div>

      <div className="mt-4 grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAYS_SHORT.map((d) => (
          <span key={d} className="pb-2 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: theme.muted }}>
            {d}
          </span>
        ))}
        {(grid?.cells ?? Array.from({ length: 35 }, () => null)).map((date, i) => {
          if (!date) return <span key={`pad-${i}`} />;
          const daySessions = sessionsOn(week, mondayIndex(date));
          const litCount = daySessions.filter(matches).length;
          const bright = hasQuery ? litCount > 0 : daySessions.length > 0;
          const isToday = grid ? isSameDay(date, grid.today) : false;
          const isSelected = selected ? isSameDay(date, selected) : false;
          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => setSelected(date)}
              aria-label={`${format(date, "d MMMM")} — ${moonPhaseName(moonPhase(date))} — ${daySessions.length} classes`}
              className={`group relative mx-auto flex h-16 w-full max-w-16 flex-col items-center justify-center rounded-xl transition-all duration-300 sm:h-20 ${
                bright ? "" : "opacity-40"
              } ${isSelected ? "scale-105" : "hover:scale-105"}`}
              style={isSelected ? { backgroundColor: theme.selectedRing } : undefined}
            >
              <MoonPhaseIcon
                date={date}
                size={26}
                light={theme.accent}
                dark={theme.dark}
                className={`transition-transform sm:size-8 ${bright && hasQuery ? "animate-landing-pop" : ""}`}
              />
              <span
                className={`${displayClass} mt-1 text-sm tabular-nums`}
                style={{ color: isToday ? theme.accent : bright ? theme.text : theme.muted }}
              >
                {format(date, "d")}
              </span>
              {bright && daySessions.length > 0 && (
                <span
                  className="absolute bottom-1 size-1 rounded-full"
                  style={{ backgroundColor: theme.accent, boxShadow: hasQuery && litCount > 0 ? `0 0 8px ${theme.accent}` : undefined }}
                />
              )}
              {isToday && (
                <span className="absolute -top-1 text-[0.6rem] font-bold uppercase tracking-[0.15em]" style={{ color: theme.accent }}>
                  today
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-center text-xs italic" style={{ color: theme.muted }}>
        Real lunar phases — tap a moon to read its day.
      </p>

      <div className="mt-8">{children(selected, selectedSessions)}</div>
    </div>
  );
}

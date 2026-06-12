"use client";

import { useEffect, useState } from "react";
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
 * keep their glow; the rest wane. Tap a moon and its sessions unfold right
 * below that week's row — like a month-view calendar expanding a day.
 */
export function MoonCalendar({ week, matches, hasQuery, theme, displayClass, children }: MoonCalendarProps) {
  const grid = useMonthGrid();
  const [selected, setSelected] = useState<Date | null>(null);

  // Preselect today once the month resolves, so the panel is never empty.
  useEffect(() => {
    if (grid) setSelected((prev) => prev ?? grid.today);
  }, [grid]);

  const fullMoon = grid?.cells.find(
    (d): d is Date => d !== null && moonPhaseName(moonPhase(d)) === "Full moon",
  );

  // Chunk the padded cells into week rows so the day panel can slot in
  // directly beneath the row that holds the selected moon.
  const cells = grid?.cells ?? Array.from({ length: 35 }, () => null);
  const weekRows: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weekRows.push(cells.slice(i, i + 7));

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
      </div>
      {weekRows.map((row, rowIndex) => {
        const rowSelected =
          selected !== null && row.some((d) => d !== null && isSameDay(d, selected))
            ? selected
            : null;
        return (
          <div key={`row-${rowIndex}`}>
            <div className="grid grid-cols-7 gap-y-1 text-center">
              {row.map((date, i) => {
                if (!date) return <span key={`pad-${rowIndex}-${i}`} />;
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
                    aria-expanded={isSelected}
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
                    {/* caret pointing from the moon into its day panel */}
                    {isSelected && (
                      <span
                        aria-hidden
                        className="absolute -bottom-2 size-3 rotate-45 rounded-[2px]"
                        style={{ backgroundColor: theme.accent }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
            {/* The selected day's sessions, straight below its moon's row. */}
            {rowSelected && (
              <div
                key={rowSelected.toISOString()}
                className="animate-landing-fade-down relative z-10 my-3 rounded-2xl border p-5 md:p-7"
                style={{ borderColor: `${theme.accent}66`, backgroundColor: theme.selectedRing }}
              >
                {children(rowSelected, sessionsOn(week, mondayIndex(rowSelected)))}
              </div>
            )}
          </div>
        );
      })}
      <p className="mt-3 text-center text-xs italic" style={{ color: theme.muted }}>
        Real lunar phases — tap a moon and its day opens right below.
      </p>
    </div>
  );
}

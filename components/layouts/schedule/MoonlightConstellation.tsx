"use client";

import { useState } from "react";
import Link from "next/link";
import { format, isSameDay } from "date-fns";
import { Moon, Search, Star } from "lucide-react";
import { moonPhase, moonPhaseName } from "@/lib/layouts/moon";
import { YOGA_WEEK, WEEKDAYS_SHORT, sessionsOn } from "@/lib/layouts/schedule";
import { DayWeather } from "./DayWeather";
import { MoonPhaseIcon } from "./MoonPhaseIcon";
import { mondayIndex, useMonthGrid, useScheduleSearch } from "./use-schedule-search";

const GOLD = "#d8b56c";
const MIST = "#c6cbe4";

/**
 * Yoga 5 · Moonlight — "The Lunar Month". Every night of the month drawn
 * with its true moon phase. Search the sky and only the matching nights
 * keep their gold; choose a moon to read its practices.
 */
export function MoonlightConstellation({ displayClass }: { displayClass: string }) {
  const { query, setQuery, toggle, isActive, matches, hasQuery, matchCount, teachers } =
    useScheduleSearch(YOGA_WEEK);
  const grid = useMonthGrid();
  const [selected, setSelected] = useState<Date | null>(null);

  const selectedSessions = selected ? sessionsOn(YOGA_WEEK, mondayIndex(selected)) : [];
  const fullMoonNight = grid?.cells.find(
    (d): d is Date => d !== null && moonPhaseName(moonPhase(d)) === "Full moon",
  );

  return (
    <div>
      {/* Sky search */}
      <div className="mx-auto max-w-xl">
        <div className="flex items-center gap-3 border-b px-2 pb-3" style={{ borderColor: `${GOLD}88` }}>
          <Search className="size-5 shrink-0" style={{ color: GOLD }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the night — Noah, breathwork, restorative…"
            aria-label="Search the schedule"
            className="w-full bg-transparent text-center text-base italic text-[#ece8dd] placeholder:text-[#ece8dd]/50 focus:outline-none"
          />
          <Moon className="size-5 shrink-0" style={{ color: MIST }} />
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {teachers.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggle(t)}
              className="text-sm uppercase tracking-[0.25em] transition-colors hover:text-[#d8b56c]"
              style={{ color: isActive(t) ? GOLD : MIST }}
            >
              {isActive(t) ? "✦ " : "✧ "}
              {t}
            </button>
          ))}
        </div>
        <p className="mt-3 text-center text-xs uppercase tracking-[0.3em]" style={{ color: MIST }}>
          {hasQuery ? `${matchCount} sessions shine this week` : grid?.label ?? ""}
        </p>
        {fullMoonNight && (
          <p className="mt-2 text-center text-sm italic" style={{ color: GOLD }}>
            ● Full moon flow — {format(fullMoonNight, "EEEE d MMMM")}
          </p>
        )}
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        {/* Lunar month */}
        <div>
          <div className="grid grid-cols-7 gap-y-1 text-center">
            {WEEKDAYS_SHORT.map((d) => (
              <span key={d} className="pb-2 text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: MIST }}>
                {d}
              </span>
            ))}
            {(grid?.cells ?? Array.from({ length: 35 }, () => null)).map((date, i) => {
              if (!date) return <span key={`pad-${i}`} />;
              const daySessions = sessionsOn(YOGA_WEEK, mondayIndex(date));
              const litCount = daySessions.filter(matches).length;
              const isToday = grid ? isSameDay(date, grid.today) : false;
              const isSelected = selected ? isSameDay(date, selected) : false;
              const bright = hasQuery ? litCount > 0 : daySessions.length > 0;
              const size = 20 + Math.min(daySessions.length, 4) * 3;
              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => setSelected(date)}
                  className={`group relative flex h-16 flex-col items-center justify-center transition-all duration-500 sm:h-20 ${
                    bright ? "" : "opacity-40"
                  } ${isSelected ? "scale-110" : "hover:scale-110"}`}
                  aria-label={`${format(date, "d MMMM")} — ${moonPhaseName(moonPhase(date))} — ${daySessions.length} classes`}
                >
                  <span
                    className={`rounded-full ${bright && hasQuery && litCount > 0 ? "animate-landing-twinkle" : ""}`}
                    style={{
                      boxShadow: isSelected
                        ? `0 0 24px ${GOLD}`
                        : bright
                          ? `0 0 ${hasQuery ? 14 : 6}px ${GOLD}66`
                          : undefined,
                      borderRadius: "9999px",
                    }}
                  >
                    <MoonPhaseIcon date={date} size={size} light={GOLD} dark="#232742" />
                  </span>
                  <span
                    className="mt-1 text-sm tabular-nums"
                    style={{ color: isToday ? GOLD : isSelected ? "#ece8dd" : MIST }}
                  >
                    {format(date, "d")}
                  </span>
                  {isToday && (
                    <span className="absolute -top-1 text-xs uppercase tracking-[0.2em]" style={{ color: GOLD }}>
                      tonight
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-center text-sm italic" style={{ color: MIST }}>
            real lunar phases, night by night — tap a moon to read its practices
          </p>
        </div>

        {/* Selected night */}
        <div className="lg:border-l lg:pl-8" style={{ borderColor: `${GOLD}44` }}>
          {selected ? (
            <>
              <div className="flex items-center gap-4">
                <MoonPhaseIcon date={selected} size={44} light={GOLD} dark="#232742" />
                <div>
                  <p className={`${displayClass} text-3xl`} style={{ color: GOLD }}>
                    {format(selected, "EEEE d")}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.35em]" style={{ color: MIST }}>
                    {moonPhaseName(moonPhase(selected))}
                  </p>
                </div>
                <DayWeather
                  date={selected}
                  displayClass={displayClass}
                  side="bottom"
                  className="ml-auto"
                  theme={{ accent: GOLD, panel: "#232742", text: "#ece8dd", muted: MIST, border: `${GOLD}55` }}
                />
              </div>
              <div className="mt-7 space-y-5">
                {selectedSessions.map((s) => {
                  const lit = matches(s);
                  return (
                    <Link
                      key={s.id}
                      href={s.href}
                      className={`group block transition-all duration-500 ${lit ? "" : "opacity-40"}`}
                    >
                      <span className="flex items-baseline gap-4">
                        <Star
                          className={`size-3.5 shrink-0 translate-y-[-1px] fill-current ${lit && hasQuery ? "animate-landing-twinkle" : ""}`}
                          style={{ color: GOLD }}
                        />
                        <span className={`${displayClass} text-xl transition-colors group-hover:[color:#d8b56c]`} style={{ color: "#ece8dd" }}>
                          {s.start} — {s.className}
                        </span>
                      </span>
                      <span className="block pl-7 text-base italic" style={{ color: MIST }}>
                        guided by {s.teacher} · until {s.end}
                      </span>
                    </Link>
                  );
                })}
                {selectedSessions.length === 0 && (
                  <p className="text-base italic" style={{ color: MIST }}>
                    A dark sky — the studio rests this night.
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex h-full min-h-48 flex-col items-center justify-center text-center">
              <Moon className="size-8 animate-landing-float" style={{ color: GOLD }} />
              <p className="mt-5 max-w-xs text-base italic leading-relaxed" style={{ color: MIST }}>
                Choose a moon from the month to see which practices light that
                night.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

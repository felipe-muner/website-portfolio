"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { GYM_WEEK } from "@/lib/layouts/schedule";
import { DayWeather } from "./DayWeather";
import { MoonCalendar } from "./MoonCalendar";
import { useScheduleSearch } from "./use-schedule-search";

const LIME = "#c8ff2d";

/**
 * Gym 5 · After Dark — "The Night Line". A month of real moon phases over
 * the gym floor: pick a night, read its sessions on the glowing timeline.
 * Matching sessions burn lime; everything else fades into the dark.
 */
export function AfterDarkTimeline({ displayClass }: { displayClass: string }) {
  const { query, setQuery, toggle, isActive, matches, hasQuery, matchCount, teachers, classNames } =
    useScheduleSearch(GYM_WEEK);

  return (
    <div>
      {/* Glow search */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur md:p-6">
        <div
          className="flex items-center gap-3 rounded-full border bg-[#070b14]/80 px-5 py-3.5 transition-shadow focus-within:shadow-[0_0_32px_rgba(200,255,45,0.35)]"
          style={{ borderColor: `${LIME}55` }}
        >
          <Search className="size-5 shrink-0" style={{ color: LIME }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Coach, class or vibe — try “Marco” or “HIIT”…"
            aria-label="Search the schedule"
            className="w-full bg-transparent text-base font-semibold text-white placeholder:text-white/50 focus:outline-none"
          />
          <span className="shrink-0 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
            {hasQuery ? `${matchCount} lit` : `${GYM_WEEK.length}/wk`}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {[...teachers, ...classNames.slice(0, 3)].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => toggle(term)}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-all ${
                isActive(term)
                  ? "text-black shadow-[0_0_16px_rgba(200,255,45,0.6)]"
                  : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
              }`}
              style={isActive(term) ? { backgroundColor: LIME } : undefined}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Moon-phase month + night timeline */}
      <div className="mt-10">
        <MoonCalendar
          week={GYM_WEEK}
          matches={matches}
          hasQuery={hasQuery}
          displayClass={displayClass}
          theme={{
            accent: LIME,
            dark: "#1a2438",
            text: "#ffffff",
            muted: "rgba(255,255,255,0.65)",
            selectedRing: "rgba(200,255,45,0.12)",
          }}
        >
          {(selected, sessions) => (
            <div className="relative pl-8">
              <span
                aria-hidden
                className="absolute bottom-2 left-[0.95rem] top-2 w-px"
                style={{ background: `linear-gradient(${LIME}00, ${LIME}aa, ${LIME}00)` }}
              />
              <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-1">
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-white/70">
                  {selected ? format(selected, "EEEE d MMMM") : "Pick a night above"}
                </p>
                {selected && (
                  <DayWeather
                    date={selected}
                    displayClass={displayClass}
                    size="sm"
                    side="bottom"
                    className="-ml-2"
                    theme={{ accent: LIME, panel: "#0d1424", text: "#ffffff", muted: "rgba(255,255,255,0.65)", border: `${LIME}55` }}
                  />
                )}
              </div>
              <div className="space-y-4">
                {sessions.map((s, idx) => {
                  const lit = matches(s);
                  return (
                    <Link
                      key={s.id}
                      href={s.href}
                      className={`group relative block transition-all duration-300 ${lit ? "" : "opacity-40"}`}
                      style={{ transitionDelay: `${idx * 40}ms` }}
                    >
                      <span
                        aria-hidden
                        className={`absolute -left-8 top-5 size-3.5 -translate-x-[0.32rem] rounded-full border-2 transition-all ${
                          lit && hasQuery ? "animate-pulse" : ""
                        }`}
                        style={{
                          borderColor: LIME,
                          backgroundColor: lit ? LIME : "transparent",
                          boxShadow: lit && hasQuery ? `0 0 16px ${LIME}` : undefined,
                        }}
                      />
                      <div
                        className={`flex flex-wrap items-center gap-x-6 gap-y-1 rounded-2xl border px-5 py-4 transition-colors ${
                          lit && hasQuery
                            ? "border-transparent"
                            : "border-white/10 bg-white/[0.03] group-hover:border-[#c8ff2d66]"
                        }`}
                        style={lit && hasQuery ? { backgroundColor: `${LIME}1f`, borderColor: `${LIME}88` } : undefined}
                      >
                        <span className={`${displayClass} w-24 text-xl font-bold`} style={{ color: LIME }}>
                          {s.start}
                        </span>
                        <div className="min-w-40 flex-1">
                          <p className="text-base font-bold uppercase tracking-[0.12em] text-white">{s.className}</p>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                            Coach {s.teacher} · until {s.end}
                          </p>
                        </div>
                        <div className="hidden gap-1.5 sm:flex">
                          {s.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-white/70">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  );
                })}
                {selected && sessions.length === 0 && (
                  <p className="text-base italic text-white/70">Recovery night — the floor is yours.</p>
                )}
              </div>
            </div>
          )}
        </MoonCalendar>
      </div>
    </div>
  );
}

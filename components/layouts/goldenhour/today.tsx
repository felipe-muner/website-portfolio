"use client";

import { Flame, Music, Sun, Umbrella, Utensils, Wine } from "lucide-react";
import { useStudioTime } from "@/components/layouts/studio-clock";
import { HOURS, SUNSET, TODAY, toMinutes } from "@/lib/layouts/goldenhour";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const START = toMinutes(HOURS.open);
const END = 24 * 60;

const clockOf = (minutes: number) => `${String(Math.floor(minutes / 60) % 24).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

const ICONS = [Umbrella, Utensils, Music, Wine, Music, Sun, Flame, Music, Wine] as const;

const inWords = (minutes: number) => (minutes >= 60 ? `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, "0")} min` : `${minutes} min`);

/**
 * Golden Hour — today at the club: the day's nine moments on one track, with a
 * marker on the club's real clock (Bangkok). What has passed dims, what is on
 * now lights up, and the next thing counts down.
 */
export function Today() {
  const now = useStudioTime(30);
  const minutes = now === null ? null : Math.floor(now.seconds / 60);
  const open = minutes !== null && minutes >= START;
  const pct = minutes === null ? 0 : Math.min(1, Math.max(0, (minutes - START) / (END - START))) * 100;
  const liveIndex = minutes === null || !open ? -1 : TODAY.reduce((acc, m, i) => (toMinutes(m.time) <= minutes ? i : acc), -1);
  const next = minutes === null ? null : (TODAY[liveIndex + 1] ?? null);
  const nextIn = next && minutes !== null ? toMinutes(next.time) - minutes : null;

  let status: string;
  if (minutes === null) status = "Reading the club's clock…";
  else if (!open) status = `Closed for the night — the pool opens at ${HOURS.open}, in ${inWords(START - minutes)}.`;
  else if (next && nextIn !== null) status = `Now: ${TODAY[liveIndex].title}. Next: ${next.title.toLowerCase()} in ${inWords(nextIn)}.`;
  else status = `Last call. The gate stays open until midnight.`;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <p className="font-display text-[2.6rem] leading-none tabular-nums sm:text-[3.2rem]">
          {minutes === null ? "--:--" : clockOf(minutes)}
          <span className="ml-3 font-[family-name:var(--font-gh-sans)] text-base font-normal text-[#f6ead7]/55">
            {now === null ? "at the club" : `${DAYS[now.weekday]}, at the club`}
          </span>
        </p>
        <p className="max-w-md text-sm leading-relaxed text-[#f6ead7]/65 sm:text-right" aria-live="polite">
          {status}
        </p>
      </div>

      {/* The track: the club's day, open to midnight. */}
      <div className="relative mt-8 h-14">
        <div className="absolute inset-x-0 top-6 h-px bg-[#f6ead7]/15" />
        {open && <div className="absolute left-0 top-6 h-px bg-[#ff9f43]" style={{ width: `${pct}%` }} />}
        {TODAY.map((m) => {
          const at = ((toMinutes(m.time) - START) / (END - START)) * 100;
          const passed = minutes !== null && open && toMinutes(m.time) <= minutes;
          const isSunset = m.time === SUNSET;
          return (
            <div key={m.time} className="absolute top-0 flex -translate-x-1/2 flex-col items-center" style={{ left: `${at}%` }}>
              <span className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${isSunset ? "text-[#ff9f43]" : "text-[#f6ead7]/40"}`}>{m.time}</span>
              <span className={`mt-[9px] block rounded-full ${isSunset ? "size-3 bg-[#ff9f43] shadow-[0_0_14px_2px_rgba(255,159,67,0.55)]" : `size-2 ${passed ? "bg-[#ff9f43]" : "bg-[#f6ead7]/40"}`}`} />
            </div>
          );
        })}
        {open && (
          <div className="absolute top-[14px] -translate-x-1/2" style={{ left: `${pct}%` }}>
            <span className="block h-6 w-[2px] bg-[#f6ead7]" />
            <span className="mt-1 block -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f6ead7]">
              Now
            </span>
          </div>
        )}
      </div>

      <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TODAY.map((m, i) => {
          const live = i === liveIndex;
          const passed = liveIndex > i;
          const upNext = next === m;
          const Icon = ICONS[i] ?? Sun;
          return (
            <li
              key={m.time}
              className={`relative flex gap-4 rounded-[22px] border p-5 transition-colors ${
                live
                  ? "border-[#ff9f43]/70 bg-[#ff9f43]/[0.08]"
                  : "border-[#f6ead7]/10 bg-[#100f24]"
              } ${passed ? "opacity-45" : ""}`}
            >
              <span className={`grid size-11 shrink-0 place-items-center rounded-full border ${live ? "border-[#ff9f43] text-[#ff9f43]" : "border-[#f6ead7]/12 text-[#f6ead7]/70"}`}>
                <Icon className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f6ead7]/45">
                  <span className="tabular-nums">{m.time}</span>
                  {live && <span className="rounded-full bg-[#ff9f43] px-2 py-0.5 text-[9px] text-[#0b0a1a]">Now</span>}
                  {upNext && nextIn !== null && <span className="rounded-full border border-[#f6ead7]/25 px-2 py-0.5 text-[9px] text-[#f6ead7]/70">in {inWords(nextIn)}</span>}
                </p>
                <h3 className="font-display mt-1.5 text-[1.35rem] leading-tight">{m.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#f6ead7]/55">{m.note}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

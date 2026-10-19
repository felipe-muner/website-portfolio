"use client";

import { GYM_WEEK } from "@/lib/layouts/schedule";
import { hms, upNext, useGymTime } from "./clock";
import { chooseSession } from "./events";

/**
 * Gym 6 · Chalk — the gym-wall clock as a strip: what's on the floor right
 * now (or the next class) and a live countdown, in gym time. Clicking it
 * books that class.
 */
export function NextClass() {
  const now = useGymTime(1);
  const next = now ? upNext(GYM_WEEK, now) : null;
  const s = next?.session;

  return (
    <a
      href="#book"
      onClick={() => s && chooseSession(s.id)}
      className="group flex w-full max-w-[34rem] flex-wrap items-center gap-x-4 gap-y-1 rounded-sm border border-white/10 bg-[#0e0e0d]/80 px-4 py-3 backdrop-blur transition-colors hover:border-[#f5c518]/60"
    >
      <span className="flex shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
        <span className={`size-2 rounded-full ${next?.live ? "bg-[#ff3b30] motion-safe:animate-pulse" : "bg-[#f5c518]"}`} />
        {next ? (next.live ? "On the floor now" : "Next class") : "Gym clock"}
      </span>
      <span className="font-display min-w-0 flex-1 truncate text-2xl font-extrabold uppercase leading-none">
        {s ? s.className : " "}
        {s && <span className="ml-2 text-lg font-bold text-white/45">· {s.teacher}</span>}
      </span>
      <span className="flex items-baseline gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {next?.live ? "ends in" : "in"}
        </span>
        <span className="font-mono text-xl font-semibold leading-none tabular-nums text-[#f5c518]">
          {next ? hms(next.seconds) : "--:--:--"}
        </span>
      </span>
    </a>
  );
}

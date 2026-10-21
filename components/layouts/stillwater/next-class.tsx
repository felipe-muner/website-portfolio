"use client";

import { YOGA_WEEK } from "@/lib/layouts/schedule";
import { matsLeft } from "@/lib/layouts/stillwater";
import { hms, upNext, useStudioTime } from "@/components/layouts/studio-clock";
import { chooseSession } from "./events";

/**
 * Yoga 6 · Stillwater — the studio clock as a strip: the class in the sala
 * right now (or the next one) with a live countdown in studio time, and how
 * many mats are free. Clicking it books that class.
 */
export function NextClass() {
  const now = useStudioTime(1);
  const next = now ? upNext(YOGA_WEEK, now) : null;
  const s = next?.session;
  const free = s ? matsLeft(s.id) : 0;

  return (
    <a
      href="#book"
      onClick={() => s && chooseSession(s.id)}
      className="group flex w-full max-w-[33rem] items-center gap-4 rounded-2xl border border-[#ece4d6]/12 bg-[#0a1014]/55 py-3 pl-3 pr-5 backdrop-blur-md transition-colors hover:border-[#f2b46d]/50"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-[#f2b46d]/35">
        <span className={`size-2 rounded-full bg-[#f2b46d] ${next?.live ? "motion-safe:animate-pulse" : "opacity-70"}`} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#ece4d6]/45">
          {next ? (next.live ? "In the sala now" : "Next class") : "Studio clock"}
        </span>
        <span className="font-display truncate text-[1.6rem] leading-tight">
          {s ? s.className : " "}
          {s && <span className="text-[#ece4d6]/45"> · {s.teacher}</span>}
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end">
        <span className="text-lg font-semibold tabular-nums text-[#f2b46d]">{next ? hms(next.seconds) : "--:--:--"}</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#ece4d6]/40">
          {next ? (next.live ? "to go" : free > 0 ? `${free} mats free` : "waitlist") : " "}
        </span>
      </span>
    </a>
  );
}

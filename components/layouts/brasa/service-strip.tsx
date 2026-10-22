"use client";

import { ArrowRight } from "lucide-react";
import { useStudioTime, type StudioTime } from "@/components/layouts/studio-clock";
import { HOURS } from "@/lib/layouts/brasa";

const DAY = 86_400;
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const toSeconds = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 3600 + m * 60;
};
const OPEN = toSeconds(HOURS.open);
const LAST = toSeconds(HOURS.lastOrders);

/** 7_830 s → "2h 11m"; 540 s → "9m". Rounds up, so "1m" never reads as "0m". */
function span(seconds: number): string {
  const minutes = Math.max(1, Math.ceil(seconds / 60));
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m`;
}

export interface Service {
  open: boolean;
  line: string;
  sub: string;
}

/** What the kitchen is doing right now, in restaurant time. */
export function service(now: StudioTime): Service {
  const closedToday = now.weekday === HOURS.closedWeekday;
  if (!closedToday && now.seconds >= OPEN && now.seconds < LAST) {
    return { open: true, line: "Kitchen open", sub: `last orders in ${span(LAST - now.seconds)}` };
  }
  const closedLine = closedToday ? "Closed Mondays" : "Kitchen closed";
  for (let d = 0; d < 8; d++) {
    const day = (now.weekday + d) % 7;
    if (day === HOURS.closedWeekday) continue;
    const wait = d * DAY + OPEN - now.seconds;
    if (wait <= 0) continue;
    if (d === 0) return { open: false, line: `Opens at ${HOURS.open}`, sub: `in ${span(wait)}` };
    if (d === 1) return { open: false, line: closedLine, sub: `opens tomorrow at ${HOURS.open}` };
    return { open: false, line: closedLine, sub: `opens ${DAYS[day]} at ${HOURS.open}` };
  }
  return { open: false, line: closedLine, sub: `${HOURS.days} · ${HOURS.open}–${HOURS.lastOrders}` };
}

/**
 * Brasa — the kitchen on the real clock: open with a live countdown to last
 * orders, or when the pit is next lit. Clicking it goes to the booking form.
 */
export function ServiceStrip({ className = "" }: { className?: string }) {
  const now = useStudioTime(30);
  const s = now ? service(now) : null;

  return (
    <a
      href="#book"
      className={`group flex w-full max-w-[33rem] items-center gap-4 rounded-md border border-[#f4e9d8]/12 bg-[#0e0c0a]/60 py-3 pl-3 pr-4 backdrop-blur-md transition-colors hover:border-[#f26a1b]/60 ${className}`}
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-sm border border-[#f26a1b]/35">
        <span
          className={`size-2 rounded-full ${s?.open ? "bg-[#f26a1b] shadow-[0_0_12px_#f26a1b] motion-safe:animate-pulse" : "bg-[#f4e9d8]/35"}`}
        />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#f4e9d8]/45">
          {s ? (s.open ? "Service tonight" : "Next service") : "Kitchen hours"}
        </span>
        <span className="font-display truncate text-[1.35rem] leading-tight text-[#f4e9d8]">
          {s ? s.line : `${HOURS.days} · ${HOURS.open}–${HOURS.lastOrders}`}
          {s && <span className="text-[#f4e9d8]/45"> · {s.sub}</span>}
        </span>
      </span>
      <span className="hidden shrink-0 flex-col items-end sm:flex">
        <span className="font-mono text-[11px] tabular-nums text-[#f26a1b]">{HOURS.open}–{HOURS.lastOrders}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#f4e9d8]/40">{HOURS.days}</span>
      </span>
      <ArrowRight className="size-4 shrink-0 text-[#f4e9d8]/40 transition-transform group-hover:translate-x-1 group-hover:text-[#f26a1b]" />
    </a>
  );
}

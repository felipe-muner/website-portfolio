"use client";

import { useSyncExternalStore } from "react";
import type { ScheduleSession } from "@/lib/layouts/schedule";

// Gym 6 · Chalk — the gym's own clock. The timetable is in gym time
// (Thailand), so "today", "now" and countdowns ignore the visitor's zone.

const GYM_ZONE = "Asia/Bangkok";
const WEEK = 7 * 86_400;
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const parts = new Intl.DateTimeFormat("en-GB", {
  timeZone: GYM_ZONE,
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

export interface GymTime {
  /** 0 = Monday … 6 = Sunday, in gym time. */
  weekday: number;
  /** Seconds since gym-time midnight. */
  seconds: number;
}

function gymTime(epochSeconds: number): GymTime {
  const p = Object.fromEntries(parts.formatToParts(new Date(epochSeconds * 1000)).map((x) => [x.type, x.value]));
  return {
    weekday: DAYS.indexOf(p.weekday ?? "Mon"),
    seconds: Number(p.hour) * 3600 + Number(p.minute) * 60 + Number(p.second),
  };
}

const stores = new Map<number, { subscribe: (cb: () => void) => () => void; read: () => number }>();
/** One shared ticking store per resolution (seconds). */
function store(every: number) {
  let s = stores.get(every);
  if (!s) {
    s = {
      subscribe: (cb) => {
        const id = window.setInterval(cb, every * 1000);
        return () => window.clearInterval(id);
      },
      read: () => Math.floor(Date.now() / 1000 / every) * every,
    };
    stores.set(every, s);
  }
  return s;
}

/** Gym time, ticking every `every` seconds. Null while prerendering. */
export function useGymTime(every: number): GymTime | null {
  const s = store(every);
  const epoch = useSyncExternalStore(s.subscribe, s.read, () => null);
  return epoch === null ? null : gymTime(epoch);
}

const toSeconds = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 3600 + m * 60;
};

/** Seconds into the gym week. */
const weekSeconds = (weekday: number, seconds: number) => weekday * 86_400 + seconds;

/** The session on the floor right now, or the next one up, with seconds to go. */
export function upNext(
  week: readonly ScheduleSession[],
  now: GymTime,
): { session: ScheduleSession; live: boolean; seconds: number } | null {
  const t = weekSeconds(now.weekday, now.seconds);
  let best: { session: ScheduleSession; live: boolean; seconds: number } | null = null;
  for (const session of week) {
    const start = weekSeconds(session.weekday, toSeconds(session.start));
    const end = weekSeconds(session.weekday, toSeconds(session.end));
    if (t >= start && t < end) return { session, live: true, seconds: end - t };
    const wait = (start - t + WEEK) % WEEK;
    if (!best || wait < best.seconds) best = { session, live: false, seconds: wait };
  }
  return best;
}

/** 3725 → "01:02:05". */
export function hms(total: number): string {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

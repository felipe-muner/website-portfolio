"use client";

import { WEEKDAYS } from "@/lib/layouts/schedule";
import { useStudioTime } from "@/components/layouts/studio-clock";

/* A FICTIONAL week of workouts for the board — Monday first. */
const WODS = [
  { title: "Squat day", lines: ["Back squat 5×5 @ 75%", "then, for time:", "21-15-9", "thrusters 40/30 kg", "+ pull-ups"], note: "cap 12:00" },
  { title: "Engine", lines: ["EMOM 16:", "1 · 12 cal row", "2 · 10 burpees", "3 · 15 wall balls", "4 · rest"], note: "hold your pace!" },
  { title: "Pull heavy", lines: ["Deadlift 3-3-3-3", "build to heavy", "AMRAP 10:", "10 KB swings 24/16", "10 box jumps · 200 m run"], note: "chalk up" },
  { title: "Tabata", lines: ["8 rounds each:", "air squat", "push-up", "sit-up", "row"], note: "20 on / 10 off" },
  { title: "Friday grinder", lines: ["Strict press 3×10", "then, for time:", "21-15-9", "KB swings + toes-to-bar"], note: "scale it, no shame" },
  { title: "Team WOD", lines: ["In pairs, for time:", "100 cal row", "80 wall balls", "60 KB swings", "40 burpees"], note: "share the work" },
  { title: "Recovery", lines: ["20 min zone 2", "mobility flow", "breathwork", "ice bath + steam"], note: "earned it" },
] as const;

/**
 * Gym 6 · Chalk — the whiteboard by the rig: today's workout (in gym time),
 * written up in marker the way every box does it.
 */
export function Whiteboard() {
  const now = useStudioTime(60);
  const day = now?.weekday ?? 0;
  const wod = WODS[day];

  return (
    <figure className="relative -rotate-1 rounded-[3px] bg-[#f4f2ec] p-6 text-[#1b1b1b] shadow-[0_0_0_10px_#c8c8c3,0_0_0_11px_#9b9b96,0_40px_70px_-30px_rgba(0,0,0,0.95)] sm:p-7">
      <span aria-hidden className="absolute -top-1 left-8 size-4 rounded-full bg-[#f5c518] shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
      <span aria-hidden className="absolute -top-1 right-10 size-4 rounded-full bg-[#d6332b] shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
      <figcaption className="font-mono text-[10px] uppercase tracking-[0.22em] text-black/45">
        {now ? `${WEEKDAYS[day]} · Workout of the day` : "Workout of the day"}
      </figcaption>
      <p className="font-marker mt-2 text-[2rem] leading-tight text-[#d6332b]">{wod.title}</p>
      <ul className="font-marker mt-2 space-y-0.5 text-[1.3rem] leading-snug text-[#1f2a44]">
        {wod.lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <p className="font-marker mt-4 text-lg text-[#1d5fd6]">— {wod.note}</p>
    </figure>
  );
}

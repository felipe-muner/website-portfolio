"use client";

import { useCallback, useMemo, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { WEEKDAYS, WEEKDAYS_SHORT, YOGA_WEEK, sessionsOn, teachersOf, type ScheduleSession } from "@/lib/layouts/schedule";
import { PACE_LABEL, feelOf, matsLeft, type Pace } from "@/lib/layouts/stillwater";
import { useStudioTime } from "@/components/layouts/studio-clock";
import { chooseSession, useScheduleFilter } from "./events";

const TEACHERS = teachersOf(YOGA_WEEK);
const PACES: Pace[] = [1, 2, 3];
const PACE_COLOR: Record<Pace, string> = { 1: "#9fb8a4", 2: "#e7c08a", 3: "#f08a5d" };

const toSeconds = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 3600 + m * 60;
};

/** Does a session match the filter (a pace label, a teacher or a class)? */
function fits(s: ScheduleSession, term: string | null) {
  if (!term) return true;
  return PACE_LABEL[feelOf(s.className).pace] === term || s.teacher === term || s.className === term;
}

/** "3 classes · from 07:30" for a day's (filtered) sessions. */
function dayLine(sessions: ScheduleSession[]) {
  if (sessions.length === 0) return "No classes";
  return `${sessions.length} ${sessions.length === 1 ? "class" : "classes"} · from ${sessions[0].start}`;
}

function PaceDots({ pace, className = "" }: { pace: Pace; className?: string }) {
  return (
    <span aria-label={`${PACE_LABEL[pace]} pace`} className={`inline-flex items-center gap-[3px] ${className}`}>
      {PACES.map((p) => (
        <span
          key={p}
          className="size-[5px] rounded-full"
          style={{ backgroundColor: p <= pace ? PACE_COLOR[pace] : "rgba(236,228,214,0.18)" }}
        />
      ))}
    </span>
  );
}

/**
 * Yoga 6 · Stillwater — the week at the sala: a strip of days (each session a
 * dot, by pace) over the chosen day's classes, in studio time — what's on now,
 * what's next, how many mats are free. Filter by pace or teacher; tapping a
 * class preselects it in the booking form.
 */
export function WeekSchedule() {
  const now = useStudioTime(30);
  const [picked, setPicked] = useState<number | null>(null);
  const [term, setTerm] = useState<string | null>(null);

  const today = now?.weekday ?? null;
  const day = picked ?? today ?? 0;
  const week = useMemo(() => WEEKDAYS_SHORT.map((_, i) => sessionsOn(YOGA_WEEK, i)), []);

  // A filter from elsewhere on the page (a class card, a teacher): jump to its next day.
  useScheduleFilter(
    useCallback(
      (t: string) => {
        setTerm(t);
        const from = today ?? 0;
        for (let k = 0; k < 7; k++) {
          const d = (from + k) % 7;
          if (week[d].some((s) => fits(s, t))) {
            setPicked(d);
            break;
          }
        }
      },
      [today, week],
    ),
  );

  const sessions = week[day];
  const shown = sessions.filter((s) => fits(s, term));
  const nextDay = term
    ? [1, 2, 3, 4, 5, 6].map((k) => (day + k) % 7).find((d) => week[d].some((s) => fits(s, term)))
    : undefined;
  const nowSeconds = now && day === today ? now.seconds : null;
  const nextId = nowSeconds === null ? null : shown.find((s) => toSeconds(s.start) > nowSeconds)?.id;

  const chip = (label: string, active: boolean, onClick: () => void, extra?: React.ReactNode) => (
    <button
      key={label}
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-9 items-center gap-2 rounded-full border px-4 text-[13px] transition-colors ${
        active
          ? "border-[#f2b46d] bg-[#f2b46d] text-[#0a1014]"
          : "border-[#ece4d6]/12 text-[#ece4d6]/70 hover:border-[#ece4d6]/35 hover:text-[#ece4d6]"
      }`}
    >
      {extra}
      {label}
    </button>
  );

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {chip("All classes", term === null, () => setTerm(null))}
        {PACES.map((p) =>
          chip(PACE_LABEL[p], term === PACE_LABEL[p], () => setTerm(term === PACE_LABEL[p] ? null : PACE_LABEL[p]), <PaceDots pace={p} />),
        )}
        <span aria-hidden className="mx-1 hidden h-5 w-px bg-[#ece4d6]/12 sm:block" />
        {TEACHERS.map((t) => chip(t, term === t, () => setTerm(term === t ? null : t)))}
        {term && !PACES.some((p) => PACE_LABEL[p] === term) && !TEACHERS.includes(term) && (
          <button
            type="button"
            onClick={() => setTerm(null)}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-[#f2b46d] bg-[#f2b46d] px-4 text-[13px] text-[#0a1014]"
          >
            {term} <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* The week: each day a column of dots, one per class, coloured by pace */}
      <div className="-mx-5 mt-8 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
        <div className="grid min-w-[40rem] grid-cols-7 gap-2">
          {WEEKDAYS_SHORT.map((label, i) => {
            const active = i === day;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setPicked(i)}
                aria-pressed={active}
                className={`group flex flex-col items-start rounded-2xl border px-3 pb-3 pt-2.5 text-left transition-colors ${
                  active ? "border-[#f2b46d]/70 bg-[#f2b46d]/[0.08]" : "border-[#ece4d6]/8 hover:border-[#ece4d6]/25"
                }`}
              >
                <span className="flex w-full flex-col gap-1 xl:flex-row xl:items-baseline xl:justify-between">
                  <span className={`font-display text-2xl leading-none ${active ? "text-[#f2b46d]" : ""}`}>{label}</span>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#f2b46d]">
                    {i === today ? "Today" : "\u00a0"}
                  </span>
                </span>
                <span className="mt-3 flex min-h-[10px] flex-wrap gap-1">
                  {week[i].map((s) => (
                    <span
                      key={s.id}
                      title={`${s.start} ${s.className}`}
                      className={`size-2.5 rounded-full transition-opacity ${fits(s, term) ? "opacity-100" : "opacity-15"}`}
                      style={{ backgroundColor: PACE_COLOR[feelOf(s.className).pace] }}
                    />
                  ))}
                </span>
                <span className="mt-2 text-[10px] uppercase tracking-[0.16em] text-[#ece4d6]/40">
                  <span className="lg:hidden">{week[i].filter((s) => fits(s, term)).length} classes</span>
                  <span className="hidden lg:inline">{dayLine(week[i].filter((s) => fits(s, term)))}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* The day */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-[#ece4d6]/10 bg-[#0d1519]">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[#ece4d6]/8 px-5 py-4 sm:px-7">
          <p className="font-display text-3xl">
            {WEEKDAYS[day]}
            {day === today && <span className="italic text-[#f2b46d]"> · today</span>}
          </p>
          <p className="flex items-center gap-4 text-[11px] uppercase tracking-[0.18em] text-[#ece4d6]/45">
            {PACES.map((p) => (
              <span key={p} className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ backgroundColor: PACE_COLOR[p] }} />
                {PACE_LABEL[p]}
              </span>
            ))}
          </p>
        </div>
        {shown.length === 0 ? (
          <div className="px-5 py-10 text-center sm:px-7">
            <p className="font-display text-2xl italic text-[#ece4d6]/70">Nothing {term ? `with ${term}` : ""} on {WEEKDAYS[day]}.</p>
            {nextDay !== undefined && (
              <button
                type="button"
                onClick={() => setPicked(nextDay)}
                className="mt-4 inline-flex items-center gap-2 text-sm text-[#f2b46d] underline-offset-4 hover:underline"
              >
                Next on {WEEKDAYS[nextDay]} <ArrowRight className="size-3.5" />
              </button>
            )}
          </div>
        ) : (
          <ul>
            {shown.map((s) => {
              const feel = feelOf(s.className);
              const free = matsLeft(s.id);
              const live = nowSeconds !== null && nowSeconds >= toSeconds(s.start) && nowSeconds < toSeconds(s.end);
              const past = nowSeconds !== null && nowSeconds >= toSeconds(s.end);
              return (
                <li key={s.id} className={`border-b border-[#ece4d6]/[0.06] last:border-b-0 ${past ? "opacity-45" : ""}`}>
                  <a
                    href="#book"
                    onClick={() => chooseSession(s.id)}
                    aria-label={`Book ${s.className} with ${s.teacher}, ${WEEKDAYS[s.weekday]} ${s.start}`}
                    className="group grid grid-cols-[4.6rem_minmax(0,1fr)] items-center gap-x-4 gap-y-2 px-5 py-4 transition-colors hover:bg-[#ece4d6]/[0.03] sm:grid-cols-[6.5rem_minmax(0,1fr)_auto] sm:px-7"
                  >
                    <span className="tabular-nums">
                      <span className="block text-lg font-semibold">{s.start}</span>
                      <span className="block text-xs text-[#ece4d6]/40">to {s.end}</span>
                    </span>
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-display truncate text-[1.7rem] leading-tight">{s.className}</span>
                        {live && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f2b46d]/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f2b46d]">
                            <span className="size-1.5 rounded-full bg-[#f2b46d] motion-safe:animate-pulse" /> In session
                          </span>
                        )}
                        {s.id === nextId && !live && (
                          <span className="rounded-full border border-[#f2b46d]/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f2b46d]">
                            Next
                          </span>
                        )}
                      </span>
                      <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[#ece4d6]/50">
                        <span>with {s.teacher}</span>
                        <span className="inline-flex items-center gap-1.5">
                          <PaceDots pace={feel.pace} /> {PACE_LABEL[feel.pace]}
                        </span>
                        {feel.line && <span className="hidden md:inline">{feel.line}</span>}
                      </span>
                    </span>
                    <span className="col-span-2 flex items-center justify-between gap-4 sm:col-span-1 sm:justify-end">
                      <span className={`text-xs ${free > 0 ? "text-[#ece4d6]/55" : "text-[#f08a5d]"}`}>
                        {free > 0 ? `${free} mats free` : "Full — waitlist"}
                      </span>
                      <span className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#ece4d6]/15 px-4 text-[13px] transition-colors group-hover:border-[#f2b46d] group-hover:bg-[#f2b46d] group-hover:text-[#0a1014]">
                        {free > 0 ? "Book" : "Join list"} <ArrowRight className="size-3.5" />
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

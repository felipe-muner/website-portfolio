"use client";

import { useEffect } from "react";

// Gym 6 · Chalk — tiny page-wide signals, so a click anywhere (a hero chip, a
// program card, a coach) can drive the timetable or the booking form without
// lifting their state into the server-rendered page.

const FILTER = "chalk:schedule-filter";
const PLAN = "chalk:plan";
const SESSION = "chalk:session";

function emit(type: string, detail: string) {
  window.dispatchEvent(new CustomEvent<string>(type, { detail }));
}

function useSignal(type: string, onSignal: (detail: string) => void) {
  useEffect(() => {
    const handle = (e: Event) => {
      if (e instanceof CustomEvent && typeof e.detail === "string") onSignal(e.detail);
    };
    window.addEventListener(type, handle);
    return () => window.removeEventListener(type, handle);
  }, [type, onSignal]);
}

/** Ask the timetable to search for `term` (pair with a link to #schedule). */
export const filterSchedule = (term: string) => emit(FILTER, term);
export const useScheduleFilter = (onFilter: (term: string) => void) => useSignal(FILTER, onFilter);

/** Preselect a membership in the booking form (pair with a link to #book). */
export const choosePlan = (plan: string) => emit(PLAN, plan);
export const usePlanChoice = (onChoose: (plan: string) => void) => useSignal(PLAN, onChoose);

/** Preselect a timetable session (by id) in the booking form (pair with a link to #book). */
export const chooseSession = (sessionId: string) => emit(SESSION, sessionId);
export const useSessionChoice = (onChoose: (sessionId: string) => void) => useSignal(SESSION, onChoose);

"use client";

import { useEffect } from "react";

// Yoga 6 · Stillwater — tiny page-wide signals, so a click anywhere (a class
// card, a teacher, a pass, the class clock) can steer the timetable or the
// booking form without lifting their state into the server-rendered page.

const FILTER = "stillwater:schedule-filter";
const PASS = "stillwater:pass";
const SESSION = "stillwater:session";

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

/** Show only `term`'s sessions on the timetable (a class or a teacher; pair with a link to #schedule). */
export const filterSchedule = (term: string) => emit(FILTER, term);
export const useScheduleFilter = (onFilter: (term: string) => void) => useSignal(FILTER, onFilter);

/** Preselect a pass in the booking form (pair with a link to #book). */
export const choosePass = (pass: string) => emit(PASS, pass);
export const usePassChoice = (onChoose: (pass: string) => void) => useSignal(PASS, onChoose);

/** Preselect a timetable session (by id) in the booking form (pair with a link to #book). */
export const chooseSession = (sessionId: string) => emit(SESSION, sessionId);
export const useSessionChoice = (onChoose: (sessionId: string) => void) => useSignal(SESSION, onChoose);

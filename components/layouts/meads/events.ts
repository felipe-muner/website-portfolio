"use client";

import { useEffect } from "react";

// Artist · Maria Meads — tiny page-wide signals, so a work in the gallery can
// load itself onto the hero canvas, and a tier, a jacket or an original can
// hand the commission form a head start, without lifting that state into the
// server-rendered page.

const WORK = "meads:work";
const COMMISSION = "meads:commission";

function emit<T>(type: string, detail: T) {
  window.dispatchEvent(new CustomEvent<T>(type, { detail }));
}

function useSignal<T>(type: string, guard: (d: unknown) => d is T, onSignal: (detail: T) => void) {
  useEffect(() => {
    const handle = (e: Event) => {
      if (e instanceof CustomEvent && guard(e.detail)) onSignal(e.detail);
    };
    window.addEventListener(type, handle);
    return () => window.removeEventListener(type, handle);
  }, [type, guard, onSignal]);
}

const isString = (d: unknown): d is string => typeof d === "string";

export interface CommissionStart {
  type?: string;
  size?: string;
  note?: string;
}
const isCommissionStart = (d: unknown): d is CommissionStart => typeof d === "object" && d !== null;

/** Put a work (by slug) on the hero canvas (pair with a link to #top). */
export const chooseWork = (slug: string) => emit(WORK, slug);
export const useWorkChoice = (onChoose: (slug: string) => void) => useSignal(WORK, isString, onChoose);

/** Preselect the commission form (pair with a link to #commission). */
export const startCommission = (start: CommissionStart) => emit(COMMISSION, start);
export const useCommissionStart = (onStart: (start: CommissionStart) => void) =>
  useSignal(COMMISSION, isCommissionStart, onStart);

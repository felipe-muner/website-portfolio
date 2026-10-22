"use client";

import { useEffect } from "react";

// Golden Hour — a tiny page-wide signal, so tapping a bed on the deck map
// preselects it in the booking form without lifting state into the
// server-rendered page.

const BED = "goldenhour:bed";

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

/** Preselect a bed (by spot id) in the booking form (pair with a link to #book). */
export const chooseBed = (spotId: string) => emit(BED, spotId);
export const useBedChoice = (onChoose: (spotId: string) => void) => useSignal(BED, onChoose);

"use client";

import { useEffect } from "react";

// Brasa — tiny page-wide signals, so a chip in the hero ("Chef's counter",
// "Sunset table") or a card further down can preselect things in the booking
// form without lifting state into the server-rendered page.

const TABLE = "brasa:table";

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

/** Preselect a table (by name) in the booking form (pair with a link to #book). */
export const chooseTable = (table: string) => emit(TABLE, table);
export const useTableChoice = (onChoose: (table: string) => void) => useSignal(TABLE, onChoose);

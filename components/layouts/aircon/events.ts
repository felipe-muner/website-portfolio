"use client";

import { useEffect } from "react";

// MGM · tiny page-wide signals, so the services picker and the room sizer can
// hand the quote form a head start without lifting its state into the
// server-rendered page.

const SERVICE = "aircon:service";
const NOTE = "aircon:note";

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

/** Preselect a service in the quote form (pair with a link to #quote). */
export const chooseService = (title: string) => emit(SERVICE, title);
export const useServiceChoice = (onChoose: (title: string) => void) => useSignal(SERVICE, onChoose);

/** Put a note in the quote form's message (pair with a link to #quote). */
export const addQuoteNote = (note: string) => emit(NOTE, note);
export const useQuoteNote = (onNote: (note: string) => void) => useSignal(NOTE, onNote);

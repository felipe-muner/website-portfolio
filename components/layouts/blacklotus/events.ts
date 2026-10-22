"use client";

import { useEffect } from "react";

// Black Lotus — tiny page-wide signals, so a flash card can send its design to
// the forearm up top or preselect it in the booking form, and an artist card
// can pick its artist, without lifting state into the server-rendered page.

const TRY_ON = "blacklotus:try-on";
const FLASH = "blacklotus:flash";
const ARTIST = "blacklotus:artist";

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

/** Put a flash design (by id) on the hero forearm (pair with a link to #arm). */
export const tryOnArm = (id: string) => emit(TRY_ON, id);
export const useTryOn = (onTry: (id: string) => void) => useSignal(TRY_ON, onTry);

/** Preselect a flash design (by id) in the booking form (pair with a link to #book). */
export const chooseFlash = (id: string) => emit(FLASH, id);
export const useFlashChoice = (onChoose: (id: string) => void) => useSignal(FLASH, onChoose);

/** Preselect an artist (by slug) in the booking form (pair with a link to #book). */
export const chooseArtist = (slug: string) => emit(ARTIST, slug);
export const useArtistChoice = (onChoose: (slug: string) => void) => useSignal(ARTIST, onChoose);

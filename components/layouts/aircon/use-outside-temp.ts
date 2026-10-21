"use client";

import { useEffect, useState } from "react";
import { z } from "zod";

/** Maroochydore — the middle of the patch MGM covers. */
const URL =
  "https://api.open-meteo.com/v1/forecast?latitude=-26.66&longitude=153.1&current=temperature_2m&timezone=Australia%2FBrisbane";

const Weather = z.object({ current: z.object({ temperature_2m: z.number() }) });

/**
 * The live outside temperature on the Sunshine Coast, in whole °C — or null
 * until it arrives (or if the weather service can't be reached; the hero
 * simply leaves the reading out).
 */
export function useOutsideTemp(): number | null {
  const [temp, setTemp] = useState<number | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 6000);
    fetch(URL, { signal: ctrl.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((json: unknown) => {
        const parsed = Weather.safeParse(json);
        if (parsed.success) setTemp(Math.round(parsed.data.current.temperature_2m));
      })
      .catch(() => {})
      .finally(() => clearTimeout(timeout));
    return () => {
      clearTimeout(timeout);
      ctrl.abort();
    };
  }, []);

  return temp;
}

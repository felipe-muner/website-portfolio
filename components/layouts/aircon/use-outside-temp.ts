"use client";

import { useEffect, useState } from "react";
import { z } from "zod";

export type Location = { latitude: number; longitude: number };

/** Maroochydore — the middle of the patch MGM covers. */
const MAROOCHYDORE: Location = { latitude: -26.66, longitude: 153.1 };

const Weather = z.object({ current: z.object({ temperature_2m: z.number() }) });

/**
 * The live outside temperature (default: the Sunshine Coast), in whole °C —
 * or null until it arrives, if the weather service can't be reached, or if
 * `location` is null (the hero simply leaves the reading out).
 */
export function useOutsideTemp(location: Location | null = MAROOCHYDORE): number | null {
  const [temp, setTemp] = useState<number | null>(null);
  const latitude = location?.latitude;
  const longitude = location?.longitude;

  useEffect(() => {
    if (latitude === undefined || longitude === undefined) return;
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 6000);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&timezone=auto`;
    fetch(url, { signal: ctrl.signal })
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
  }, [latitude, longitude]);

  return temp;
}

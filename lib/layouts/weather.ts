// FICTIONAL tropical-island weather for the celestial schedule previews.
// Values are deterministic per date (same date → same forecast) so the moon
// and sun schedules can show a believable temperature without a live API.

import { getDayOfYear } from "date-fns";

export type WeatherIcon = "sun" | "cloud-sun" | "cloud" | "cloud-rain" | "cloud-lightning";

export interface DayWeather {
  /** Daytime high in whole °C. */
  high: number;
  /** Overnight low in whole °C. */
  low: number;
  /** "Feels like" / heat-index temperature in whole °C. */
  feelsLike: number;
  /** Short human label, e.g. "Partly cloudy". */
  condition: string;
  /** Icon key for the matching lucide glyph. */
  icon: WeatherIcon;
  /** Relative humidity, whole %. */
  humidity: number;
  /** Wind speed, whole km/h. */
  wind: number;
  /** Wind direction, compass abbreviation. */
  windDir: string;
  /** Local sunrise, "HH:mm". */
  sunrise: string;
  /** Local sunset, "HH:mm". */
  sunset: string;
}

const COMPASS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;

/** Deterministic 0..1 hash from an integer seed (no Math.random — stable per date). */
function hash01(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toClock(totalMinutes: number): string {
  const m = Math.round(totalMinutes);
  return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
}

/**
 * Forecast for a single day. Warm tropical baseline (~Gulf of Thailand): highs
 * in the high-20s to low-30s, a mild seasonal swing, and a daily wobble that
 * reads as natural variety across a month of moons.
 */
export function dayWeather(date: Date): DayWeather {
  const doy = getDayOfYear(date); // 1..366
  const seed = date.getFullYear() * 1000 + doy;

  // Seasonal term: warmest around April (≈ day 105), coolest around December.
  const season = Math.sin(((doy - 105) / 365) * 2 * Math.PI); // -1..1
  const wobble = hash01(seed) - 0.5; // -0.5..0.5

  const high = Math.round(30 + season * 2 + wobble * 3); // ~27..33
  const low = Math.round(high - 5 - hash01(seed + 7) * 2); // ~5–7° cooler
  const humidity = Math.round(72 + hash01(seed + 3) * 22); // 72..94 %
  const wind = Math.round(8 + hash01(seed + 11) * 17); // 8..25 km/h
  const windDir = COMPASS[Math.floor(hash01(seed + 17) * COMPASS.length)];

  // Heat index nudge: muggier days feel hotter.
  const feelsLike = Math.round(high + (humidity - 75) / 12 + 1);

  // Cloud/rain tendency rises with humidity, plus a daily roll.
  const cloud = humidity / 100 + hash01(seed + 23) * 0.45 - 0.35; // ~0.1..1.0
  let condition: string;
  let icon: WeatherIcon;
  if (cloud < 0.35) {
    condition = "Sunny";
    icon = "sun";
  } else if (cloud < 0.55) {
    condition = "Partly cloudy";
    icon = "cloud-sun";
  } else if (cloud < 0.72) {
    condition = "Humid & hazy";
    icon = "cloud-sun";
  } else if (cloud < 0.88) {
    condition = "Passing showers";
    icon = "cloud-rain";
  } else {
    condition = "Tropical storm";
    icon = "cloud-lightning";
  }

  // Sunrise ~06:00–06:25, sunset ~18:15–18:45, gently shifted by season.
  const sunrise = toClock(6 * 60 + 12 - season * 12 + (hash01(seed + 31) - 0.5) * 8);
  const sunset = toClock(18 * 60 + 28 + season * 12 + (hash01(seed + 37) - 0.5) * 8);

  return { high, low, feelsLike, condition, icon, humidity, wind, windDir, sunrise, sunset };
}

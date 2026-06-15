"use client";

import { useId, useState } from "react";
import { Cloud, CloudLightning, CloudRain, CloudSun, Droplets, Sun, Sunrise, Sunset, Wind } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { dayWeather } from "@/lib/layouts/weather";
import type { WeatherIcon } from "@/lib/layouts/weather";

const ICONS: Record<WeatherIcon, LucideIcon> = {
  sun: Sun,
  "cloud-sun": CloudSun,
  cloud: Cloud,
  "cloud-rain": CloudRain,
  "cloud-lightning": CloudLightning,
};

export interface DayWeatherTheme {
  /** Accent colour for icons / temperature. */
  accent: string;
  /** Tooltip background. */
  panel: string;
  /** Tooltip primary text. */
  text: string;
  /** Tooltip muted text. */
  muted: string;
  /** Tooltip border colour. */
  border: string;
}

interface DayWeatherProps {
  date: Date;
  theme: DayWeatherTheme;
  /** Font class for the temperature figure. */
  displayClass?: string;
  /** Visual size of the trigger chip. */
  size?: "sm" | "md";
  /** Tooltip side relative to the chip. */
  side?: "top" | "bottom";
  className?: string;
}

/**
 * A small temperature chip for a single day: shows the high in °C and, on
 * hover or tap, a detailed weather card (high/low, feels-like, humidity,
 * wind and sunrise/sunset). Data is fictional but deterministic per date.
 */
export function DayWeather({
  date,
  theme,
  displayClass = "",
  size = "md",
  side = "top",
  className = "",
}: DayWeatherProps) {
  const [open, setOpen] = useState(false);
  const tipId = useId();
  const w = dayWeather(date);
  const Icon = ICONS[w.icon];

  const iconSize = size === "sm" ? "size-3.5" : "size-4";
  const tempSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <span className={`relative inline-flex ${className}`}>
      <button
        type="button"
        aria-describedby={open ? tipId : undefined}
        aria-label={`Weather for the day — ${w.high}°C, ${w.condition}`}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
        style={{ color: theme.accent }}
      >
        <Icon className={`${iconSize} shrink-0`} />
        <span className={`${displayClass} ${tempSize} font-bold tabular-nums leading-none`}>
          {w.high}°C
        </span>
      </button>

      {open && (
        <span
          id={tipId}
          role="tooltip"
          className={`animate-landing-fade-down pointer-events-none absolute left-1/2 z-30 w-60 -translate-x-1/2 rounded-2xl border p-4 text-left shadow-xl ${
            side === "top" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
          style={{ backgroundColor: theme.panel, borderColor: theme.border, color: theme.text }}
        >
          <span className="flex items-center gap-2">
            <Icon className="size-5 shrink-0" style={{ color: theme.accent }} />
            <span className="text-sm font-semibold">{w.condition}</span>
            <span className={`${displayClass} ml-auto text-2xl tabular-nums`} style={{ color: theme.accent }}>
              {w.high}°
            </span>
          </span>

          <span className="mt-1 block text-xs" style={{ color: theme.muted }}>
            Low {w.low}° · Feels like {w.feelsLike}°
          </span>

          <span className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
            <span className="flex items-center gap-1.5">
              <Droplets className="size-3.5 shrink-0" style={{ color: theme.accent }} />
              {w.humidity}% humidity
            </span>
            <span className="flex items-center gap-1.5">
              <Wind className="size-3.5 shrink-0" style={{ color: theme.accent }} />
              {w.wind} km/h {w.windDir}
            </span>
            <span className="flex items-center gap-1.5">
              <Sunrise className="size-3.5 shrink-0" style={{ color: theme.accent }} />
              {w.sunrise}
            </span>
            <span className="flex items-center gap-1.5">
              <Sunset className="size-3.5 shrink-0" style={{ color: theme.accent }} />
              {w.sunset}
            </span>
          </span>

          <span className="mt-3 block text-[0.6rem] uppercase tracking-[0.18em]" style={{ color: theme.muted }}>
            Island forecast
          </span>
        </span>
      )}
    </span>
  );
}

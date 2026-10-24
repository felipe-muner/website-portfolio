"use client";

import { Droplets, Fan, Minus, MoveVertical, Plus, Power, Snowflake, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAX_TEMP, MIN_TEMP, MODE_LABEL, reading, type Climate, type FanSpeed, type Mode } from "./climate";

const MODES: { mode: Mode; icon: LucideIcon }[] = [
  { mode: "cool", icon: Snowflake },
  { mode: "dry", icon: Droplets },
  { mode: "fan", icon: Fan },
];

const NEXT_FAN: Record<FanSpeed, FanSpeed> = { 1: 2, 2: 3, 3: 1 };

const KEY =
  "flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#66e6ba] disabled:pointer-events-none disabled:opacity-35";

/**
 * The hero's remote control. Every button drives the 3D unit above it —
 * set point, mode, fan speed, louvre swing and power.
 */
export function Remote({
  climate,
  onChange,
  outside,
  fahrenheit,
  className,
}: {
  climate: Climate;
  onChange: (patch: Partial<Climate>) => void;
  /** Live outside temperature in °C, when known. */
  outside: number | null;
  /** Show temperatures in °F (the climate itself stays in °C). */
  fahrenheit?: boolean;
  className?: string;
}) {
  const { power, temp, mode, fan, swing } = climate;
  const setPoint = reading(temp, fahrenheit);

  return (
    <div
      className={cn(
        "w-full max-w-[21rem] rounded-[1.75rem] border border-white/10 bg-[oklch(0.17_0.02_170/0.72)] p-4 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-5",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
        <span className="flex items-center gap-2">
          <span
            className={cn(
              "size-1.5 rounded-full transition-colors",
              power ? "bg-[#66e6ba] shadow-[0_0_10px_#66e6ba]" : "bg-white/25",
            )}
          />
          Try the remote
        </span>
        {outside !== null ? (
          <span>
            Outside <span className="text-[#faab3f]">{reading(outside, fahrenheit).value}°</span>
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          type="button"
          aria-label="Lower temperature"
          disabled={!power || mode === "fan" || temp <= MIN_TEMP}
          onClick={() => onChange({ temp: temp - 1 })}
          className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/85 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#66e6ba] disabled:opacity-30"
        >
          <Minus className="size-5" />
        </button>

        <div className="text-center" aria-live="polite">
          <p className="font-mono text-[3.4rem] leading-none font-light tracking-tight tabular-nums">
            {power ? setPoint.value : "--"}
            <span className="ml-0.5 align-top text-xl text-white/55">{setPoint.unit}</span>
          </p>
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#99f2e0]/80">
            {power ? `${MODE_LABEL[mode]} · fan ${fan}${swing ? " · swing" : ""}` : "Standby"}
          </p>
        </div>

        <button
          type="button"
          aria-label="Raise temperature"
          disabled={!power || mode === "fan" || temp >= MAX_TEMP}
          onClick={() => onChange({ temp: temp + 1 })}
          className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/85 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#66e6ba] disabled:opacity-30"
        >
          <Plus className="size-5" />
        </button>
      </div>

      <div role="group" aria-label="Mode" className="mt-4 grid grid-cols-3 gap-1 rounded-2xl bg-white/[0.04] p-1">
        {MODES.map(({ mode: m, icon: Icon }) => (
          <button
            key={m}
            type="button"
            aria-pressed={power && mode === m}
            disabled={!power}
            onClick={() => onChange({ mode: m })}
            className={cn(
              KEY,
              power && mode === m ? "bg-[#66e6ba] text-[#001c12]" : "text-white/70 hover:bg-white/[0.06]",
            )}
          >
            <Icon className="size-3.5" />
            {MODE_LABEL[m]}
          </button>
        ))}
      </div>

      <div className="mt-1.5 grid grid-cols-3 gap-1.5">
        <button
          type="button"
          aria-label={`Fan speed ${fan} of 3`}
          disabled={!power}
          onClick={() => onChange({ fan: NEXT_FAN[fan] })}
          className={cn(KEY, "border border-white/10 text-white/75 hover:bg-white/[0.06]")}
        >
          <span className="flex items-end gap-0.5" aria-hidden>
            {[1, 2, 3].map((i) => (
              <span
                key={i}
                className={cn("w-1 rounded-sm", i <= fan ? "bg-[#99f2e0]" : "bg-white/20")}
                style={{ height: 4 + i * 3 }}
              />
            ))}
          </span>
          Fan
        </button>
        <button
          type="button"
          aria-pressed={power && swing}
          disabled={!power}
          onClick={() => onChange({ swing: !swing })}
          className={cn(
            KEY,
            "border",
            power && swing ? "border-[#99f2e0]/40 bg-[#99f2e0]/10 text-[#99f2e0]" : "border-white/10 text-white/75 hover:bg-white/[0.06]",
          )}
        >
          <MoveVertical className="size-3.5" />
          Swing
        </button>
        <button
          type="button"
          aria-pressed={power}
          aria-label={power ? "Turn off" : "Turn on"}
          onClick={() => onChange({ power: !power })}
          className={cn(
            KEY,
            "border",
            power ? "border-white/10 text-white/75 hover:bg-white/[0.06]" : "border-[#66e6ba]/50 bg-[#66e6ba]/15 text-[#66e6ba]",
          )}
        >
          <Power className="size-3.5" />
          {power ? "Off" : "On"}
        </button>
      </div>
    </div>
  );
}

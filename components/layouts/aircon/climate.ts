/** What the hero's remote controls — and what the 3D unit renders. */

export type Mode = "cool" | "dry" | "fan";
export type FanSpeed = 1 | 2 | 3;

export type Climate = {
  power: boolean;
  /** Set point in whole °C. */
  temp: number;
  mode: Mode;
  fan: FanSpeed;
  /** Louvre sweeping up and down. */
  swing: boolean;
};

export const MIN_TEMP = 16;
export const MAX_TEMP = 30;

export const INITIAL_CLIMATE: Climate = {
  power: true,
  temp: 22,
  mode: "cool",
  fan: 2,
  swing: false,
};

/** The set point is kept in °C; US sites show it in °F. */
export const toFahrenheit = (celsius: number) => Math.round((celsius * 9) / 5 + 32);

/** A temperature as the visitor reads it: the number and its unit. */
export const reading = (celsius: number, fahrenheit?: boolean) =>
  fahrenheit ? { value: toFahrenheit(celsius), unit: "°F" } : { value: celsius, unit: "°C" };

export const MODE_LABEL: Record<Mode, string> = {
  cool: "Cool",
  dry: "Dry",
  fan: "Fan",
};

/**
 * How cold the room should end up, 0 (still the heat outside) to 1 (crisp).
 * Drives the heat haze cooling to mint and the warm-to-cool backdrop.
 */
export function coolness({ power, temp, mode }: Climate): number {
  if (!power) return 0;
  if (mode === "fan") return 0.3;
  if (mode === "dry") return 0.55;
  const t = (MAX_TEMP - temp) / (MAX_TEMP - MIN_TEMP);
  return 0.45 + t * 0.55;
}

"use client";

import { useState } from "react";
import { differenceInCalendarDays, format, getDate, isBefore, isSameDay } from "date-fns";
import { VILLAS } from "@/lib/layouts/villas";
import { WEEKDAYS_SHORT } from "@/lib/layouts/schedule";
import { mondayIndex, useMonthGrid } from "./schedule/use-schedule-search";

export interface BookingTheme {
  accent: string;
  accentText: string;
  text: string;
  muted: string;
  surface: string;
  border: string;
  radius: string;
}

/**
 * Demo availability: deterministic per villa + day so the calendar renders
 * identically on every visit (no real bookings behind it).
 */
function isBooked(villaIndex: number, date: Date): boolean {
  const d = getDate(date) + mondayIndex(date);
  return (d * 31 + villaIndex * 17) % 5 === 0;
}

interface BookingCalendarProps {
  theme: BookingTheme;
  displayClass: string;
}

/** Pick-a-villa, pick-your-nights demo booking widget shared by the villa templates. */
export function BookingCalendar({ theme, displayClass }: BookingCalendarProps) {
  const grid = useMonthGrid();
  const [villaIndex, setVillaIndex] = useState(1);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const villa = VILLAS[villaIndex];
  const nights =
    checkIn && checkOut ? Math.max(differenceInCalendarDays(checkOut, checkIn), 0) : 0;

  function pick(date: Date) {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
    } else if (isBefore(date, checkIn) || isSameDay(date, checkIn)) {
      setCheckIn(date);
    } else {
      setCheckOut(date);
    }
  }

  const inRange = (date: Date) =>
    checkIn && checkOut && !isBefore(date, checkIn) && !isBefore(checkOut, date);

  return (
    <div
      className="grid gap-8 p-6 md:p-10 lg:grid-cols-[1.3fr_1fr]"
      style={{ backgroundColor: theme.surface, borderRadius: theme.radius, border: `1px solid ${theme.border}` }}
    >
      <div>
        {/* Villa picker */}
        <div className="flex flex-wrap gap-2">
          {VILLAS.map((v, i) => (
            <button
              key={v.slug}
              type="button"
              onClick={() => setVillaIndex(i)}
              className="px-4 py-2.5 text-sm font-semibold transition-all"
              style={{
                borderRadius: theme.radius,
                backgroundColor: i === villaIndex ? theme.accent : "transparent",
                color: i === villaIndex ? theme.accentText : theme.text,
                border: `1.5px solid ${i === villaIndex ? theme.accent : theme.border}`,
              }}
            >
              {v.name}
            </button>
          ))}
        </div>

        {/* Month */}
        <p className={`${displayClass} mt-7 text-2xl`} style={{ color: theme.text }}>
          {grid?.label ?? "This month"}
        </p>
        <div className="mt-3 grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS_SHORT.map((d) => (
            <span key={d} className="pb-1 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: theme.muted }}>
              {d}
            </span>
          ))}
          {(grid?.cells ?? Array.from({ length: 35 }, () => null)).map((date, i) => {
            if (!date) return <span key={`pad-${i}`} />;
            const booked = isBooked(villaIndex, date);
            const selected =
              (checkIn && isSameDay(date, checkIn)) || (checkOut && isSameDay(date, checkOut));
            const between = inRange(date);
            return (
              <button
                key={date.toISOString()}
                type="button"
                disabled={booked}
                onClick={() => pick(date)}
                aria-label={`${format(date, "d MMMM")}${booked ? " — booked" : ""}`}
                className={`relative flex h-11 items-center justify-center text-sm font-semibold transition-all sm:h-12 ${
                  booked ? "cursor-not-allowed line-through opacity-35" : "hover:scale-105"
                }`}
                style={{
                  borderRadius: theme.radius,
                  backgroundColor: selected ? theme.accent : between ? `${theme.accent}33` : "transparent",
                  color: selected ? theme.accentText : theme.text,
                  border: `1px solid ${selected ? theme.accent : theme.border}`,
                }}
              >
                {getDate(date)}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs" style={{ color: theme.muted }}>
          Crossed-out dates are taken. Pick a check-in, then a check-out.
        </p>
      </div>

      {/* Summary */}
      <div
        className="flex flex-col p-6"
        style={{ borderRadius: theme.radius, border: `1.5px solid ${theme.border}` }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: theme.muted }}>
          Your stay
        </p>
        <p className={`${displayClass} mt-3 text-3xl`} style={{ color: theme.text }}>
          {villa.name}
        </p>
        <p className="mt-1 text-sm" style={{ color: theme.muted }}>
          {villa.bedrooms} bedrooms · up to {villa.guests} guests
        </p>
        <div className="mt-6 space-y-2 text-base" style={{ color: theme.text }}>
          <p className="flex justify-between">
            <span style={{ color: theme.muted }}>Check-in</span>
            <span className="font-semibold">{checkIn ? format(checkIn, "EEE d MMM") : "—"}</span>
          </p>
          <p className="flex justify-between">
            <span style={{ color: theme.muted }}>Check-out</span>
            <span className="font-semibold">{checkOut ? format(checkOut, "EEE d MMM") : "—"}</span>
          </p>
          <p className="flex justify-between">
            <span style={{ color: theme.muted }}>Rate</span>
            <span className="font-semibold">฿{villa.pricePerNight.toLocaleString()} / night</span>
          </p>
        </div>
        <div className="my-5 h-px w-full" style={{ backgroundColor: theme.border }} />
        <p className="flex items-baseline justify-between" style={{ color: theme.text }}>
          <span className="text-sm font-bold uppercase tracking-[0.2em]">Total</span>
          <span className={`${displayClass} text-3xl`}>
            {nights > 0 ? `฿${(nights * villa.pricePerNight).toLocaleString()}` : "—"}
          </span>
        </p>
        <p className="mt-1 text-right text-xs" style={{ color: theme.muted }}>
          {nights > 0 ? `${nights} night${nights === 1 ? "" : "s"}` : "select your dates"}
        </p>
        <a
          href="#"
          className="mt-auto pt-6 text-center"
          onClick={(e) => e.preventDefault()}
        >
          <span
            className="block w-full px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] transition-opacity hover:opacity-90"
            style={{ backgroundColor: theme.accent, color: theme.accentText, borderRadius: theme.radius }}
          >
            Request to book
          </span>
        </a>
      </div>
    </div>
  );
}

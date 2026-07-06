"use client";

import { useState } from "react";
import { differenceInCalendarDays, format, getDate, isBefore, isSameDay } from "date-fns";
import { WEEKDAYS_SHORT } from "@/lib/layouts/schedule";
import { mondayIndex, useMonthGrid } from "./schedule/use-schedule-search";

export interface RangeItem {
  slug: string;
  name: string;
  sub: string;
  pricePerDay: number;
}

export interface BookingTheme {
  accent: string;
  accentText: string;
  text: string;
  muted: string;
  surface: string;
  border: string;
  radius: string;
}

/** Deterministic demo availability so the calendar renders identically every visit. */
function isBooked(itemIndex: number, date: Date): boolean {
  const d = getDate(date) + mondayIndex(date);
  return (d * 29 + itemIndex * 13) % 6 === 0;
}

interface DateRangeBookingProps {
  theme: BookingTheme;
  displayClass: string;
  items: readonly RangeItem[];
  /** Label above the item picker, e.g. "Choose your ride". */
  pickerLabel: string;
  /** Currency symbol. */
  currency?: string;
  /** Unit shown after price, e.g. "day". */
  unit?: string;
  ctaLabel?: string;
}

/**
 * Pick-an-item, pick-your-days rental widget. Shared by the day-rate
 * templates (scooter rental, gear hire). Demo only — nothing is submitted.
 */
export function DateRangeBooking({
  theme,
  displayClass,
  items,
  pickerLabel,
  currency = "฿",
  unit = "day",
  ctaLabel = "Request this booking",
}: DateRangeBookingProps) {
  const grid = useMonthGrid();
  const [index, setIndex] = useState(0);
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);

  const item = items[index];
  const days = from && to ? Math.max(differenceInCalendarDays(to, from), 1) : 0;

  function pick(date: Date) {
    if (!from || (from && to)) {
      setFrom(date);
      setTo(null);
    } else if (isBefore(date, from) || isSameDay(date, from)) {
      setFrom(date);
    } else {
      setTo(date);
    }
  }

  const inRange = (date: Date) =>
    from && to && !isBefore(date, from) && !isBefore(to, date);

  return (
    <div
      className="grid gap-8 p-6 md:p-10 lg:grid-cols-[1.3fr_1fr]"
      style={{ backgroundColor: theme.surface, borderRadius: theme.radius, border: `1px solid ${theme.border}` }}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: theme.muted }}>
          {pickerLabel}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((it, i) => (
            <button
              key={it.slug}
              type="button"
              onClick={() => setIndex(i)}
              className="px-4 py-2.5 text-left text-sm font-semibold transition-all"
              style={{
                borderRadius: theme.radius,
                backgroundColor: i === index ? theme.accent : "transparent",
                color: i === index ? theme.accentText : theme.text,
                border: `1.5px solid ${i === index ? theme.accent : theme.border}`,
              }}
            >
              {it.name}
            </button>
          ))}
        </div>

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
            const booked = isBooked(index, date);
            const selected =
              (from && isSameDay(date, from)) || (to && isSameDay(date, to));
            const between = inRange(date);
            return (
              <button
                key={date.toISOString()}
                type="button"
                disabled={booked}
                onClick={() => pick(date)}
                aria-label={`${format(date, "d MMMM")}${booked ? " — unavailable" : ""}`}
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
          Crossed-out days are already out. Pick a pickup day, then a return day.
        </p>
      </div>

      <div className="flex flex-col p-6" style={{ borderRadius: theme.radius, border: `1.5px solid ${theme.border}` }}>
        <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: theme.muted }}>
          Your booking
        </p>
        <p className={`${displayClass} mt-3 text-3xl`} style={{ color: theme.text }}>
          {item.name}
        </p>
        <p className="mt-1 text-sm" style={{ color: theme.muted }}>
          {item.sub}
        </p>
        <div className="mt-6 space-y-2 text-base" style={{ color: theme.text }}>
          <p className="flex justify-between">
            <span style={{ color: theme.muted }}>Pickup</span>
            <span className="font-semibold">{from ? format(from, "EEE d MMM") : "—"}</span>
          </p>
          <p className="flex justify-between">
            <span style={{ color: theme.muted }}>Return</span>
            <span className="font-semibold">{to ? format(to, "EEE d MMM") : "—"}</span>
          </p>
          <p className="flex justify-between">
            <span style={{ color: theme.muted }}>Rate</span>
            <span className="font-semibold">{currency}{item.pricePerDay.toLocaleString()} / {unit}</span>
          </p>
        </div>
        <div className="my-5 h-px w-full" style={{ backgroundColor: theme.border }} />
        <p className="flex items-baseline justify-between" style={{ color: theme.text }}>
          <span className="text-sm font-bold uppercase tracking-[0.2em]">Total</span>
          <span className={`${displayClass} text-3xl`}>
            {days > 0 ? `${currency}${(days * item.pricePerDay).toLocaleString()}` : "—"}
          </span>
        </p>
        <p className="mt-1 text-right text-xs" style={{ color: theme.muted }}>
          {days > 0 ? `${days} ${unit}${days === 1 ? "" : "s"}` : "select your days"}
        </p>
        <a href="#" className="mt-auto pt-6 text-center" onClick={(e) => e.preventDefault()}>
          <span
            className="block w-full px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] transition-opacity hover:opacity-90"
            style={{ backgroundColor: theme.accent, color: theme.accentText, borderRadius: theme.radius }}
          >
            {ctaLabel}
          </span>
        </a>
      </div>
    </div>
  );
}

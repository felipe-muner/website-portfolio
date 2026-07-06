"use client";

import { useState } from "react";
import { format, getDate, isSameDay } from "date-fns";
import { Minus, Plus } from "lucide-react";
import { WEEKDAYS_SHORT } from "@/lib/layouts/schedule";
import { mondayIndex, useMonthGrid } from "./schedule/use-schedule-search";

export interface SlotOption {
  slug: string;
  name: string;
  sub?: string;
  price: number;
}

export interface SlotTheme {
  accent: string;
  accentText: string;
  text: string;
  muted: string;
  surface: string;
  border: string;
  radius: string;
}

/** Deterministic demo availability (some days full). */
function isFull(optionIndex: number, date: Date): boolean {
  const d = getDate(date) + mondayIndex(date);
  return (d * 23 + optionIndex * 19) % 7 === 0;
}

interface SlotBookingProps {
  theme: SlotTheme;
  displayClass: string;
  options: readonly SlotOption[];
  pickerLabel: string;
  /** e.g. "per person", "per seat", "deposit". */
  priceUnit: string;
  currency?: string;
  /** Optional quantity stepper (guests / seats). Multiplies the total. */
  qty?: { label: string; min: number; max: number };
  /** Optional single-choice list (time slot / style / desk type). */
  variants?: { label: string; items: readonly string[] };
  ctaLabel?: string;
  note?: string;
}

/**
 * Pick-an-option, pick-a-day booking widget. Flexible enough for boat trips,
 * tattoo consults, cooking classes, day passes and table reservations.
 * Demo only — nothing is submitted.
 */
export function SlotBooking({
  theme,
  displayClass,
  options,
  pickerLabel,
  priceUnit,
  currency = "฿",
  qty,
  variants,
  ctaLabel = "Request booking",
  note,
}: SlotBookingProps) {
  const grid = useMonthGrid();
  const [index, setIndex] = useState(0);
  const [date, setDate] = useState<Date | null>(null);
  const [count, setCount] = useState(qty?.min ?? 1);
  const [variant, setVariant] = useState(variants?.items[0] ?? "");

  const option = options[index];
  const multiplier = qty ? count : 1;
  const total = option.price * multiplier;

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
          {options.map((o, i) => (
            <button
              key={o.slug}
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
              {o.name}
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
          {(grid?.cells ?? Array.from({ length: 35 }, () => null)).map((d, i) => {
            if (!d) return <span key={`pad-${i}`} />;
            const full = isFull(index, d);
            const selected = date && isSameDay(d, date);
            return (
              <button
                key={d.toISOString()}
                type="button"
                disabled={full}
                onClick={() => setDate(d)}
                aria-label={`${format(d, "d MMMM")}${full ? " — fully booked" : ""}`}
                className={`relative flex h-11 items-center justify-center text-sm font-semibold transition-all sm:h-12 ${
                  full ? "cursor-not-allowed line-through opacity-35" : "hover:scale-105"
                }`}
                style={{
                  borderRadius: theme.radius,
                  backgroundColor: selected ? theme.accent : "transparent",
                  color: selected ? theme.accentText : theme.text,
                  border: `1px solid ${selected ? theme.accent : theme.border}`,
                }}
              >
                {getDate(d)}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs" style={{ color: theme.muted }}>
          Crossed-out days are full. Pick an open day.
        </p>
      </div>

      <div className="flex flex-col p-6" style={{ borderRadius: theme.radius, border: `1.5px solid ${theme.border}` }}>
        <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: theme.muted }}>
          Your booking
        </p>
        <p className={`${displayClass} mt-3 text-3xl`} style={{ color: theme.text }}>
          {option.name}
        </p>
        {option.sub && (
          <p className="mt-1 text-sm" style={{ color: theme.muted }}>
            {option.sub}
          </p>
        )}

        {variants && (
          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: theme.muted }}>
              {variants.label}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {variants.items.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVariant(v)}
                  className="px-3 py-1.5 text-xs font-semibold transition-all"
                  style={{
                    borderRadius: theme.radius,
                    backgroundColor: v === variant ? theme.accent : "transparent",
                    color: v === variant ? theme.accentText : theme.text,
                    border: `1.5px solid ${v === variant ? theme.accent : theme.border}`,
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        )}

        {qty && (
          <div className="mt-5 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: theme.muted }}>
              {qty.label}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Decrease"
                onClick={() => setCount((c) => Math.max(qty.min, c - 1))}
                className="flex size-8 items-center justify-center transition-opacity hover:opacity-70"
                style={{ borderRadius: theme.radius, border: `1.5px solid ${theme.border}`, color: theme.text }}
              >
                <Minus className="size-4" />
              </button>
              <span className={`${displayClass} w-6 text-center text-xl`} style={{ color: theme.text }}>
                {count}
              </span>
              <button
                type="button"
                aria-label="Increase"
                onClick={() => setCount((c) => Math.min(qty.max, c + 1))}
                className="flex size-8 items-center justify-center transition-opacity hover:opacity-70"
                style={{ borderRadius: theme.radius, border: `1.5px solid ${theme.border}`, color: theme.text }}
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>
        )}

        <div className="mt-5 space-y-2 text-base" style={{ color: theme.text }}>
          <p className="flex justify-between">
            <span style={{ color: theme.muted }}>Date</span>
            <span className="font-semibold">{date ? format(date, "EEE d MMM") : "—"}</span>
          </p>
          <p className="flex justify-between">
            <span style={{ color: theme.muted }}>Price</span>
            <span className="font-semibold">{currency}{option.price.toLocaleString()} {priceUnit}</span>
          </p>
        </div>
        <div className="my-5 h-px w-full" style={{ backgroundColor: theme.border }} />
        <p className="flex items-baseline justify-between" style={{ color: theme.text }}>
          <span className="text-sm font-bold uppercase tracking-[0.2em]">Total</span>
          <span className={`${displayClass} text-3xl`}>
            {date ? `${currency}${total.toLocaleString()}` : "—"}
          </span>
        </p>
        <p className="mt-1 text-right text-xs" style={{ color: theme.muted }}>
          {date ? (qty ? `${count} × ${currency}${option.price.toLocaleString()}` : "confirmed on request") : "pick a day above"}
        </p>
        <a href="#" className="mt-auto pt-6 text-center" onClick={(e) => e.preventDefault()}>
          <span
            className="block w-full px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] transition-opacity hover:opacity-90"
            style={{ backgroundColor: theme.accent, color: theme.accentText, borderRadius: theme.radius }}
          >
            {ctaLabel}
          </span>
        </a>
        {note && (
          <p className="mt-3 text-center text-xs" style={{ color: theme.muted }}>
            {note}
          </p>
        )}
      </div>
    </div>
  );
}

"use client";

import { useCallback, useState, useSyncExternalStore, type FormEvent } from "react";
import { ArrowRight, Check, Minus, Plus } from "lucide-react";
import { ANY_TABLE, HOURS, SITTINGS, TABLES, type Sitting } from "@/lib/layouts/brasa";
import { useTableChoice } from "./events";

const ZONE = "Asia/Bangkok";
const MAX_PARTY = 10;
const BIG_PARTY = 8;
const isoFmt = new Intl.DateTimeFormat("en-CA", { timeZone: ZONE, year: "numeric", month: "2-digit", day: "2-digit" });
const longFmt = new Intl.DateTimeFormat("en-GB", { timeZone: ZONE, weekday: "long", day: "numeric", month: "long" });

/** Today's date at the restaurant, as yyyy-mm-dd. Null while prerendering. */
const subscribeNever = () => () => {};
const useToday = () => useSyncExternalStore(subscribeNever, () => isoFmt.format(new Date()), () => null);

/** Noon on a yyyy-mm-dd in restaurant time (date inputs give no zone). */
const noonOf = (iso: string) => new Date(`${iso}T12:00:00+07:00`);
/** 0 = Monday … 6 = Sunday, matching the studio clock. */
const weekdayOf = (iso: string) => (noonOf(iso).getUTCDay() + 6) % 7;
const shift = (iso: string, days: number) => isoFmt.format(new Date(noonOf(iso).getTime() + days * 86_400_000));
const isClosed = (iso: string) => weekdayOf(iso) === HOURS.closedWeekday;
/** The first night we're open, from `today`. */
const firstOpen = (today: string) => (isClosed(today) ? shift(today, 1) : today);

const FIELD =
  "h-12 w-full rounded-sm border border-[#f4e9d8]/12 bg-[#0e0c0a] px-4 text-[15px] text-[#f4e9d8] transition-colors placeholder:text-[#f4e9d8]/30 hover:border-[#f4e9d8]/25 focus:border-[#f26a1b] focus:outline-none";
const LABEL = "font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#f4e9d8]/50";
const CHIP_ON = "border-[#f26a1b] bg-[#f26a1b] text-[#140d08]";
const CHIP_OFF = "border-[#f4e9d8]/15 text-[#f4e9d8]/75 hover:border-[#f26a1b]/60 hover:text-[#f4e9d8]";

interface Booking {
  name: string;
  date: string;
  party: number;
  sitting: Sitting;
  table: string;
}

/**
 * Brasa — "book a table". Date, party size, sitting and a table preference
 * (preselected when a chip elsewhere on the page is clicked), then name and
 * WhatsApp. Demo only: submitting just confirms.
 */
export function BookForm() {
  const today = useToday();
  const [picked, setPicked] = useState<string | null>(null);
  const [party, setParty] = useState(2);
  const [sitting, setSitting] = useState<Sitting>("19:00");
  const [table, setTable] = useState(ANY_TABLE);
  const [booked, setBooked] = useState<Booking | null>(null);

  const date = picked ?? (today ? firstOpen(today) : "");
  const closed = date !== "" && isClosed(date);
  const tableInfo = TABLES.find((t) => t.name === table) ?? TABLES[0];

  useTableChoice(
    useCallback((name: string) => {
      const t = TABLES.find((x) => x.name === name);
      if (!t) return;
      setTable(t.name);
      if (t.sitting) setSitting(t.sitting);
      setBooked(null);
    }, []),
  );

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (closed || !date) return;
    const name = String(new FormData(event.currentTarget).get("name") ?? "").trim();
    setBooked({ name: name.split(/\s+/)[0] || "friend", date, party, sitting, table });
  };

  if (booked) {
    return (
      <div className="flex h-full flex-col items-start justify-center py-6">
        <span className="grid size-12 place-items-center rounded-sm bg-[#f26a1b] text-[#140d08]">
          <Check className="size-6" strokeWidth={3} />
        </span>
        <h3 className="font-display mt-6 text-4xl leading-none text-[#f4e9d8] sm:text-5xl">Table held, {booked.name}.</h3>
        <p className="mt-4 max-w-md leading-relaxed text-[#f4e9d8]/65">
          {booked.party} {booked.party === 1 ? "guest" : "guests"}, {longFmt.format(noonOf(booked.date))} at {booked.sitting}
          {booked.table !== ANY_TABLE && <> — {booked.table.toLowerCase()}</>}. We&apos;ll confirm on WhatsApp within the hour.
          The fire is lit at three, so come hungry.
        </p>
        <button
          type="button"
          onClick={() => setBooked(null)}
          className="font-display mt-8 rounded-sm border border-[#f4e9d8]/15 px-5 py-2 text-lg text-[#f4e9d8]/80 transition-colors hover:border-[#f26a1b] hover:text-[#f26a1b]"
        >
          Book another table
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className={LABEL}>Date</span>
          <input
            type="date"
            name="date"
            required
            value={date}
            min={today ?? undefined}
            onChange={(e) => setPicked(e.target.value)}
            className={`${FIELD} [color-scheme:dark]`}
          />
          {closed && <span className="text-xs text-[#ffb45c]">We&apos;re closed on Mondays — pick another night.</span>}
        </label>
        <div className="grid gap-2">
          <span className={LABEL}>Guests</span>
          <div className={`${FIELD} flex items-center justify-between px-1.5`}>
            <button
              type="button"
              onClick={() => setParty((p) => Math.max(1, p - 1))}
              aria-label="Fewer guests"
              disabled={party <= 1}
              className="grid size-9 place-items-center rounded-sm text-[#f4e9d8]/70 transition-colors hover:bg-[#f4e9d8]/10 hover:text-[#f4e9d8] disabled:opacity-30"
            >
              <Minus className="size-4" />
            </button>
            <span className="font-display text-2xl tabular-nums text-[#f4e9d8]" aria-live="polite">
              {party >= MAX_PARTY ? `${MAX_PARTY}+` : party}
            </span>
            <button
              type="button"
              onClick={() => setParty((p) => Math.min(MAX_PARTY, p + 1))}
              aria-label="More guests"
              disabled={party >= MAX_PARTY}
              className="grid size-9 place-items-center rounded-sm text-[#f4e9d8]/70 transition-colors hover:bg-[#f4e9d8]/10 hover:text-[#f4e9d8] disabled:opacity-30"
            >
              <Plus className="size-4" />
            </button>
          </div>
          {party > BIG_PARTY && (
            <span className="text-xs text-[#f4e9d8]/50">Over eight? We&apos;ll set the long table — WhatsApp us to lock it in.</span>
          )}
        </div>
      </div>

      <fieldset className="grid gap-2">
        <legend className={LABEL}>Sitting</legend>
        <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-8">
          {SITTINGS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSitting(t)}
              aria-pressed={sitting === t}
              className={`h-11 rounded-sm border font-mono text-[13px] tabular-nums transition-colors ${sitting === t ? CHIP_ON : CHIP_OFF}`}
            >
              {t}
            </button>
          ))}
        </div>
        <span className="text-xs text-[#f4e9d8]/45">
          Last orders {HOURS.lastOrders}. Sunset is around 18:15 — the 18:00 sitting gets it from the terrace.
        </span>
      </fieldset>

      <fieldset className="grid gap-2">
        <legend className={LABEL}>Where would you like to sit?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {TABLES.map((t) => (
            <button
              key={t.name}
              type="button"
              onClick={() => {
                setTable(t.name);
                if (t.sitting) setSitting(t.sitting);
              }}
              aria-pressed={table === t.name}
              className={`font-display rounded-sm border px-4 py-2 text-[17px] leading-none transition-colors ${table === t.name ? CHIP_ON : CHIP_OFF}`}
            >
              {t.name}
            </button>
          ))}
        </div>
        <p className="text-sm leading-relaxed text-[#f4e9d8]/55">
          <span className="text-[#f4e9d8]/80">{tableInfo.name}</span> · {tableInfo.seats} · {tableInfo.blurb}
        </p>
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className={LABEL}>Name</span>
          <input name="name" required autoComplete="name" placeholder="Your name" className={FIELD} />
        </label>
        <label className="grid gap-2">
          <span className={LABEL}>WhatsApp</span>
          <input name="phone" type="tel" required autoComplete="tel" placeholder="+66 …" className={FIELD} />
        </label>
      </div>

      <button
        type="submit"
        disabled={closed || !date}
        className="font-display group mt-1 inline-flex h-14 items-center justify-between gap-6 justify-self-start rounded-sm bg-[#f26a1b] px-6 text-2xl text-[#140d08] transition-colors hover:bg-[#f4e9d8] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Hold my table
        <ArrowRight className="size-6 transition-transform group-hover:translate-x-1" />
      </button>
      <p className="text-xs text-[#f4e9d8]/40">
        Demo form — nothing is sent. In the real site this holds the table and confirms on WhatsApp.
      </p>
    </form>
  );
}

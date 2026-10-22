"use client";

import { useCallback, useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { INCLUDED, KIND_LABEL, SPOTS, baht, spotName, toMinutes, type Spot } from "@/lib/layouts/goldenhour";
import { useBedChoice } from "./events";

const ANY = "any";
const BOOKABLE = SPOTS.filter((s) => s.kind !== "stool");
const ROWS = Array.from(new Set(BOOKABLE.map((s) => s.row)));
/** Half-hours from noon to half eight. */
const ARRIVALS = Array.from({ length: 18 }, (_, i) => {
  const m = 12 * 60 + i * 30;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
});
const PARTY = Array.from({ length: 12 }, (_, i) => i + 1);

const plus30 = (hhmm: string) => {
  const m = toMinutes(hhmm) + 30;
  return `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

const FIELD =
  "h-12 w-full rounded-xl border border-[#f6ead7]/12 bg-[#0b0a1a] px-4 text-[15px] text-[#f6ead7] transition-colors [color-scheme:dark] placeholder:text-[#f6ead7]/30 hover:border-[#f6ead7]/25 focus:border-[#ff9f43] focus:outline-none";
const LABEL = "text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#f6ead7]/50";

interface Booking {
  name: string;
  date: string;
  party: string;
  spot: Spot | null;
  arrival: string;
}

/**
 * Golden Hour — "hold a bed". Date, party size, bed (preselected when one is
 * tapped on the deck map), arrival time and a note. Demo only: submitting
 * just confirms.
 */
export function BookForm() {
  const [spotId, setSpotId] = useState(ANY);
  const [arrival, setArrival] = useState("16:30");
  const [booked, setBooked] = useState<Booking | null>(null);

  useBedChoice(
    useCallback((id: string) => {
      setSpotId(BOOKABLE.some((s) => s.id === id && !s.held) ? id : ANY);
      setBooked(null);
    }, []),
  );

  const spot = BOOKABLE.find((s) => s.id === spotId) ?? null;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    setBooked({
      name: name.split(/\s+/)[0] || "friend",
      date: String(data.get("date") ?? ""),
      party: String(data.get("party") ?? "2"),
      spot,
      arrival,
    });
  };

  if (booked) {
    const when = booked.date ? new Date(`${booked.date}T12:00:00`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }) : "your day";
    return (
      <div className="flex h-full flex-col items-start justify-center py-6">
        <span className="grid size-12 place-items-center rounded-full bg-[#ff9f43] text-[#0b0a1a]">
          <Check className="size-6" strokeWidth={3} />
        </span>
        <h3 className="font-display mt-6 text-[2.6rem] leading-none">Held for you, {booked.name}.</h3>
        <p className="mt-4 max-w-md leading-relaxed text-[#f6ead7]/70">
          {booked.spot ? spotName(booked.spot) : "The best free bed"} for {booked.party} on {when}, from {booked.arrival}. We keep it until{" "}
          {plus30(booked.arrival)}; after that it goes to the waitlist.
        </p>
        <p className="mt-2 max-w-md leading-relaxed text-[#f6ead7]/70">
          {booked.spot
            ? `${baht(booked.spot.minSpend)} minimum spend, every baht of it food and drink. `
            : "We'll match you to a bed and its minimum when you arrive. "}
          We&apos;ll confirm on WhatsApp.
        </p>
        <button
          type="button"
          onClick={() => setBooked(null)}
          className="mt-8 rounded-full border border-[#f6ead7]/15 px-5 py-2.5 text-sm text-[#f6ead7]/80 transition-colors hover:border-[#ff9f43] hover:text-[#ff9f43]"
        >
          Hold another bed
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className={LABEL}>Name</span>
          <input name="name" required autoComplete="name" placeholder="Your name" className={FIELD} />
        </label>
        <label className="grid gap-2">
          <span className={LABEL}>WhatsApp</span>
          <input name="phone" type="tel" required autoComplete="tel" placeholder="+66 …" className={FIELD} />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className={LABEL}>Date</span>
          <input name="date" type="date" required className={FIELD} />
        </label>
        <label className="grid gap-2">
          <span className={LABEL}>Party size</span>
          <select name="party" defaultValue="2" className={FIELD}>
            {PARTY.map((n) => (
              <option key={n} value={n} className="bg-[#0b0a1a]">
                {n} {n === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className={LABEL}>Bed</span>
          <select value={spotId} onChange={(e) => setSpotId(e.target.value)} className={FIELD}>
            <option value={ANY} className="bg-[#0b0a1a]">
              Any free bed — surprise us
            </option>
            {ROWS.map((row) => (
              <optgroup key={row} label={row} className="bg-[#0b0a1a]">
                {BOOKABLE.filter((s) => s.row === row).map((s) => (
                  <option key={s.id} value={s.id} disabled={s.held} className="bg-[#0b0a1a]">
                    {spotName(s)} · {s.held ? "taken today" : `${baht(s.minSpend)} min`}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <span className={LABEL}>Arriving at</span>
          <select value={arrival} onChange={(e) => setArrival(e.target.value)} className={FIELD}>
            {ARRIVALS.map((t) => (
              <option key={t} value={t} className="bg-[#0b0a1a]">
                {t}
                {t === "17:00" ? " · happy hour" : t === "18:00" ? " · golden hour" : ""}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="-mt-1 text-xs leading-relaxed text-[#f6ead7]/45">
        {spot
          ? `${KIND_LABEL[spot.kind]} for ${spot.seats} · hire ${baht(spot.price)} · ${baht(spot.minSpend)} minimum spend. ${INCLUDED[spot.kind]}`
          : "No preference? We'll give you the best bed free when you arrive — front row first, while it lasts."}
      </p>
      <label className="grid gap-2">
        <span className={LABEL}>Anything we should know</span>
        <textarea
          name="message"
          rows={3}
          placeholder="A birthday, a shuttle seat from Srithanu, a cake in the fridge…"
          className={`${FIELD} h-auto resize-none py-3`}
        />
      </label>
      <button
        type="submit"
        className="group mt-1 inline-flex h-14 items-center justify-between gap-6 justify-self-start rounded-full bg-[#ff9f43] px-7 text-[15px] font-semibold text-[#0b0a1a] transition-colors hover:bg-[#f6ead7]"
      >
        Hold my bed
        <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
      </button>
      <p className="text-xs text-[#f6ead7]/40">Demo form — nothing is sent. In the real site this holds the bed and confirms on WhatsApp.</p>
    </form>
  );
}

"use client";

import { useCallback, useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { ARTISTS, DESIGN_TYPES, PLACEMENTS, SESSION_TIMES, STUDIO, artistBySlug, type DesignType } from "@/lib/layouts/blacklotus";
import { baht, FLASH, FLASH_SIZES, flashById, type FlashSize } from "./flash";
import { useArtistChoice, useFlashChoice } from "./events";

const ANY_ARTIST = "any";
type SizeChoice = FlashSize | "xl";

const SIZES: readonly { id: SizeChoice; label: string; cm: string }[] = [
  ...FLASH_SIZES.map((s) => ({ id: s.id, label: s.label, cm: s.cm })),
  { id: "xl", label: "XL", cm: "bigger than a hand" },
];

const FIELD =
  "h-12 w-full rounded-md border border-white/12 bg-[#0f0e0c] px-4 text-[15px] text-[#efe7d8] transition-colors placeholder:text-white/30 hover:border-white/25 focus:border-[#c0262f] focus:outline-none";
const LABEL = "font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/50";
const chip = (on: boolean) =>
  `h-11 rounded-md border px-4 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
    on ? "border-[#efe7d8] bg-[#efe7d8] text-[#14100e]" : "border-white/12 text-white/65 hover:border-white/30 hover:text-white"
  }`;

interface Booking {
  name: string;
  artist: string;
  type: DesignType;
  flash: string | null;
  placement: string;
  size: string;
  date: string;
  when: string;
}

const typeLabel = (t: DesignType) => DESIGN_TYPES.find((d) => d.id === t)?.label ?? t;

/**
 * Black Lotus — "hold a chair". Artist, flash design and placement get
 * preselected when a card elsewhere on the page is clicked. Demo only:
 * submitting just confirms.
 */
export function BookForm() {
  const [artist, setArtist] = useState(ANY_ARTIST);
  const [type, setType] = useState<DesignType>("flash");
  const [flashId, setFlashId] = useState(FLASH.find((d) => !d.taken)?.id ?? FLASH[0].id);
  const [size, setSize] = useState<SizeChoice>("medium");
  const [booked, setBooked] = useState<Booking | null>(null);

  useFlashChoice(
    useCallback((id: string) => {
      const design = flashById(id);
      const owner = ARTISTS.find((a) => a.nickname === design.artist);
      setType("flash");
      setFlashId(design.id);
      setSize((s) => (s === "xl" ? "medium" : s));
      if (owner) setArtist(owner.slug);
      setBooked(null);
    }, []),
  );
  useArtistChoice(
    useCallback((slug: string) => {
      setArtist(slug);
      setBooked(null);
    }, []),
  );

  const flash = flashById(flashId);
  const sizes = type === "flash" ? SIZES.filter((s) => s.id !== "xl") : SIZES;
  const price = type === "flash" && size !== "xl" ? baht(flash.prices[size]) : null;

  const pickType = (t: DesignType) => {
    setType(t);
    if (t === "flash" && size === "xl") setSize("medium");
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = (key: string) => String(data.get(key) ?? "").trim();
    setBooked({
      name: text("name").split(/\s+/)[0] || "friend",
      artist: artistBySlug(artist)?.nickname ?? "the first free chair",
      type,
      flash: type === "flash" ? flash.name : null,
      placement: text("placement"),
      size: SIZES.find((s) => s.id === size)?.label ?? size,
      date: text("date"),
      when: text("when"),
    });
  };

  if (booked) {
    return (
      <div className="flex h-full flex-col items-start justify-center py-6">
        <span className="grid size-12 place-items-center rounded-full bg-[#c0262f] text-white">
          <Check className="size-6" strokeWidth={3} />
        </span>
        <h3 className="font-display mt-6 text-5xl leading-none text-[#efe7d8]">Chair held, {booked.name}.</h3>
        <p className="mt-4 max-w-md leading-relaxed text-white/65">
          {typeLabel(booked.type)}
          {booked.flash ? ` — ${booked.flash}` : ""} on the {booked.placement.toLowerCase()}, size {booked.size}, with{" "}
          {booked.artist}
          {booked.date ? ` around ${booked.date}` : ""}
          {booked.when && booked.when !== "Either" ? `, ${booked.when.toLowerCase()}` : ""}.
        </p>
        <p className="mt-2 max-w-md leading-relaxed text-white/65">
          We&apos;ll confirm on WhatsApp within a day and send the deposit link — {baht(STUDIO.deposit)}, which comes off the
          price.
        </p>
        <button
          type="button"
          onClick={() => setBooked(null)}
          className="mt-8 h-11 rounded-md border border-white/15 px-5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/80 transition-colors hover:border-[#c0262f] hover:text-[#efe7d8]"
        >
          Book another
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

      <label className="grid gap-2">
        <span className={LABEL}>Artist</span>
        <select value={artist} onChange={(e) => setArtist(e.target.value)} className={FIELD}>
          <option value={ANY_ARTIST} className="bg-[#0f0e0c]">
            No preference — first free chair
          </option>
          {ARTISTS.map((a) => (
            <option key={a.slug} value={a.slug} className="bg-[#0f0e0c]">
              {a.nickname} — {a.role} · {a.statusLabel}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-2">
        <span className={LABEL}>What are we doing</span>
        <div role="group" aria-label="Design type" className="flex flex-wrap gap-2">
          {DESIGN_TYPES.map((t) => (
            <button key={t.id} type="button" onClick={() => pickType(t.id)} aria-pressed={t.id === type} className={chip(t.id === type)}>
              {t.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-white/40">{DESIGN_TYPES.find((t) => t.id === type)?.hint}</p>
      </div>

      {type === "flash" && (
        <label className="grid gap-2">
          <span className={LABEL}>Flash design</span>
          <div className="flex items-center gap-3">
            <select value={flashId} onChange={(e) => setFlashId(e.target.value)} className={FIELD}>
              {FLASH.map((d) => (
                <option key={d.id} value={d.id} disabled={d.taken} className="bg-[#0f0e0c]">
                  {d.name} · {d.thai} · {d.artist}
                  {d.taken ? " (taken)" : ""}
                </option>
              ))}
            </select>
            {price && <span className="font-display shrink-0 text-2xl text-[#efe7d8]">{price}</span>}
          </div>
        </label>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className={LABEL}>Placement</span>
          <select name="placement" defaultValue={PLACEMENTS[0]} className={FIELD}>
            {PLACEMENTS.map((p) => (
              <option key={p} value={p} className="bg-[#0f0e0c]">
                {p}
              </option>
            ))}
          </select>
        </label>
        <div className="grid gap-2">
          <span className={LABEL}>Approximate size</span>
          <div role="group" aria-label="Approximate size" className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button key={s.id} type="button" onClick={() => setSize(s.id)} aria-pressed={s.id === size} title={s.cm} className={chip(s.id === size)}>
                {s.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-white/40">{sizes.find((s) => s.id === size)?.cm ?? SIZES[1].cm}</p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className={LABEL}>Date preference</span>
          <input name="date" type="date" className={`${FIELD} [color-scheme:dark]`} />
        </label>
        <label className="grid gap-2">
          <span className={LABEL}>Time of day</span>
          <select name="when" defaultValue={SESSION_TIMES[2]} className={FIELD}>
            {SESSION_TIMES.map((t) => (
              <option key={t} value={t} className="bg-[#0f0e0c]">
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="grid gap-2">
        <span className={LABEL}>Reference notes</span>
        <textarea
          name="notes"
          rows={3}
          placeholder={
            type === "cover"
              ? "What's there now, how old it is, how dark. You'll send a photo on WhatsApp."
              : "Links, the story behind it, anything about the placement we should know."
          }
          className={`${FIELD} h-auto resize-y py-3`}
        />
      </label>

      <p className="rounded-md border border-[#c0262f]/35 bg-[#c0262f]/10 px-4 py-3 text-sm leading-relaxed text-white/75">
        A <span className="text-[#efe7d8]">{baht(STUDIO.deposit)} deposit</span> holds the slot and comes off the final price. Move
        your appointment up to 48 hours before and it carries over; inside 48 hours it covers the drawing time.
      </p>

      <button
        type="submit"
        className="group mt-1 inline-flex h-14 items-center justify-between gap-6 justify-self-start rounded-md bg-[#efe7d8] px-6 font-mono text-[12px] uppercase tracking-[0.2em] text-[#14100e] transition-colors hover:bg-[#c0262f] hover:text-white"
      >
        Hold my chair
        <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
      </button>
      <p className="text-xs text-white/40">Demo form — nothing is sent. In the real site this holds the slot and confirms on WhatsApp.</p>
    </form>
  );
}

"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { BedDouble, Bath, Maximize, MapPin, Search } from "lucide-react";

export interface Listing {
  id: string;
  title: string;
  area: string;
  type: string;
  status: "For sale" | "For rent";
  price: number;
  /** "month" for rentals, "" for sale. */
  per: string;
  beds: number;
  baths: number;
  sqm: number;
  image: string;
  tags: readonly string[];
}

export interface ListingTheme {
  accent: string;
  accentText: string;
  text: string;
  muted: string;
  surface: string;
  card: string;
  border: string;
  radius: string;
}

interface ListingBrowserProps {
  listings: readonly Listing[];
  theme: ListingTheme;
  displayClass: string;
  currency?: string;
}

/** Searchable, filterable property grid for the real-estate template. */
export function ListingBrowser({ listings, theme, displayClass, currency = "฿" }: ListingBrowserProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | "For sale" | "For rent">("All");
  const q = query.trim().toLowerCase();

  const filters = useMemo(() => ["All", "For sale", "For rent"] as const, []);

  const shown = listings.filter((l) => {
    const statusOk = status === "All" || l.status === status;
    const textOk =
      q.length === 0 ||
      l.title.toLowerCase().includes(q) ||
      l.area.toLowerCase().includes(q) ||
      l.type.toLowerCase().includes(q) ||
      l.tags.some((t) => t.toLowerCase().includes(q));
    return statusOk && textOk;
  });

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div
          className="flex flex-1 items-center gap-3 px-5 py-3.5"
          style={{ backgroundColor: theme.surface, border: `1.5px solid ${theme.border}`, borderRadius: theme.radius }}
        >
          <Search className="size-5 shrink-0" style={{ color: theme.accent }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Area, type, sea view, pool…"
            aria-label="Search listings"
            className="w-full bg-transparent text-base focus:outline-none"
            style={{ color: theme.text }}
          />
          <span className="shrink-0 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: theme.muted }}>
            {shown.length} homes
          </span>
        </div>
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setStatus(f)}
              className="px-4 py-2.5 text-sm font-bold transition-all"
              style={{
                borderRadius: theme.radius,
                backgroundColor: status === f ? theme.accent : "transparent",
                color: status === f ? theme.accentText : theme.muted,
                border: `1.5px solid ${status === f ? theme.accent : theme.border}`,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((l) => (
          <div
            key={l.id}
            className="group flex flex-col overflow-hidden transition-transform hover:-translate-y-1.5"
            style={{ backgroundColor: theme.card, borderRadius: theme.radius, border: `1px solid ${theme.border}` }}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={l.image}
                alt={l.title}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <span
                className="absolute left-3 top-3 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]"
                style={{ backgroundColor: theme.accent, color: theme.accentText, borderRadius: theme.radius }}
              >
                {l.status}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: theme.muted }}>
                <MapPin className="size-3.5" style={{ color: theme.accent }} />
                {l.area} · {l.type}
              </p>
              <h3 className={`${displayClass} mt-2 text-xl leading-snug`} style={{ color: theme.text }}>
                {l.title}
              </h3>
              <div className="mt-4 flex flex-wrap gap-4 text-sm" style={{ color: theme.muted }}>
                <span className="flex items-center gap-1.5"><BedDouble className="size-4" /> {l.beds}</span>
                <span className="flex items-center gap-1.5"><Bath className="size-4" /> {l.baths}</span>
                <span className="flex items-center gap-1.5"><Maximize className="size-4" /> {l.sqm} m²</span>
              </div>
              <p className={`${displayClass} mt-auto pt-5 text-2xl`} style={{ color: theme.accent }}>
                {currency}{l.price.toLocaleString()}
                {l.per && <span className="text-sm" style={{ color: theme.muted }}> / {l.per}</span>}
              </p>
            </div>
          </div>
        ))}
      </div>

      {shown.length === 0 && (
        <p className="mt-10 text-center text-base" style={{ color: theme.muted }}>
          No homes match that search yet — try “sea view” or clear the filters.
        </p>
      )}
    </div>
  );
}

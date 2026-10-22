"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { HEAT_LABEL, MENU, MENU_SECTIONS, MENU_TAGS, type Heat, type MenuSection, type MenuTag } from "@/lib/layouts/brasa";

const HEATS: readonly Heat[] = [1, 2, 3];
const TAG_TERMS: Readonly<Record<MenuTag, string>> = {
  spicy: "chilli",
  seafood: "fish",
  vegan: "plant",
  vegetarian: "veg",
  "gluten-free": "gf",
  "to share": "share",
};

/** Three chilli dots; filled ones show the heat. */
export function HeatDots({ heat, className = "" }: { heat: Heat; className?: string }) {
  if (heat === 0) return null;
  return (
    <span aria-label={HEAT_LABEL[heat]} title={HEAT_LABEL[heat]} className={`inline-flex items-center gap-[3px] ${className}`}>
      {HEATS.map((h) => (
        <span
          key={h}
          className={`size-[6px] rounded-full ${h <= heat ? "bg-[#f26a1b]" : "bg-[#f4e9d8]/15"}`}
          style={h <= heat && heat === 3 ? { boxShadow: "0 0 6px #f26a1b" } : undefined}
        />
      ))}
    </span>
  );
}

/**
 * Brasa — the menu as the printed one reads, in sections with dotted leaders,
 * filterable by section, by tag (spicy, seafood, vegan …) and a free-text
 * search. Chilli dots show heat.
 */
export function FireMenu() {
  const [section, setSection] = useState<MenuSection | "All">("All");
  const [tags, setTags] = useState<ReadonlySet<MenuTag>>(new Set());
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const shown = MENU.filter(
    (dish) =>
      (section === "All" || dish.section === section) &&
      [...tags].every((t) => dish.tags.includes(t)) &&
      (!q ||
        dish.name.toLowerCase().includes(q) ||
        dish.detail.toLowerCase().includes(q) ||
        (dish.wood ?? "").includes(q) ||
        dish.tags.some((t) => t.includes(q) || TAG_TERMS[t].includes(q))),
  );
  const groups = MENU_SECTIONS.map((s) => ({ s, dishes: shown.filter((d) => d.section === s) })).filter(
    (g) => g.dishes.length > 0,
  );

  const toggleTag = (t: MenuTag) =>
    setTags((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });

  const clear = () => {
    setSection("All");
    setTags(new Set());
    setQuery("");
  };

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
          {(["All", ...MENU_SECTIONS] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSection(s)}
              aria-pressed={section === s}
              className={`font-display shrink-0 rounded-sm border px-4 py-2 text-[17px] leading-none transition-colors ${
                section === s
                  ? "border-[#f26a1b] bg-[#f26a1b] text-[#140d08]"
                  : "border-[#f4e9d8]/15 text-[#f4e9d8]/75 hover:border-[#f26a1b]/60 hover:text-[#f4e9d8]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <label className="flex h-11 items-center gap-2 rounded-sm border border-[#f4e9d8]/15 bg-[#0e0c0a]/70 px-4 focus-within:border-[#f26a1b] lg:w-72">
          <Search className="size-4 shrink-0 text-[#f4e9d8]/40" />
          <span className="sr-only">Search the menu</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search — try “prawns” or “tamarind”"
            className="w-full bg-transparent text-[15px] text-[#f4e9d8] placeholder:text-[#f4e9d8]/35 focus:outline-none"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="text-[#f4e9d8]/50 hover:text-[#f4e9d8]">
              <X className="size-4" />
            </button>
          )}
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.24em] text-[#f26a1b]">Only show</span>
        {MENU_TAGS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => toggleTag(t)}
            aria-pressed={tags.has(t)}
            className={`rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
              tags.has(t)
                ? "border-[#f4e9d8] bg-[#f4e9d8] text-[#140d08]"
                : "border-[#f4e9d8]/15 text-[#f4e9d8]/65 hover:border-[#f4e9d8]/45"
            }`}
          >
            {t}
          </button>
        ))}
        <span className="ml-auto flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[#f4e9d8]/45">
          <span className="inline-flex items-center gap-2">
            <HeatDots heat={3} /> heat
          </span>
          <span>
            {shown.length} {shown.length === 1 ? "dish" : "dishes"}
          </span>
        </span>
      </div>

      {groups.length === 0 ? (
        <div className="mt-14 flex flex-col items-center gap-4 text-center">
          <p className="text-[#f4e9d8]/60">Nothing on the pit matches that — try fewer filters.</p>
          <button
            type="button"
            onClick={clear}
            className="font-display rounded-sm border border-[#f4e9d8]/15 px-4 py-2 text-lg text-[#f4e9d8]/80 transition-colors hover:border-[#f26a1b] hover:text-[#f26a1b]"
          >
            Show the whole menu
          </button>
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-14">
          {groups.map(({ s, dishes }) => (
            <section key={s}>
              <div className="flex items-baseline justify-between gap-4 border-b border-[#f4e9d8]/12 pb-3">
                <h3 className="font-display text-3xl text-[#f4e9d8] sm:text-4xl">{s}</h3>
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#f4e9d8]/40">
                  {dishes.length} {dishes.length === 1 ? "item" : "items"}
                </span>
              </div>
              <ul className="mt-2 grid gap-x-12 lg:grid-cols-2">
                {dishes.map((dish) => (
                  <li key={dish.name} className="border-b border-[#f4e9d8]/[0.07] py-5">
                    <div className="flex items-baseline gap-3">
                      <h4 className="text-[17px] font-semibold leading-snug text-[#f4e9d8]">
                        {dish.name}
                        <HeatDots heat={dish.heat} className="ml-2 align-middle" />
                      </h4>
                      <span aria-hidden className="mb-1 flex-1 border-b border-dotted border-[#f4e9d8]/25" />
                      <span className="font-display shrink-0 text-xl tabular-nums text-[#ffb45c]">
                        ฿{dish.price.toLocaleString("en-US")}
                        {dish.note && <span className="ml-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#f4e9d8]/45">{dish.note}</span>}
                      </span>
                    </div>
                    <p className="mt-1.5 max-w-[34rem] text-[15px] leading-relaxed text-[#f4e9d8]/60">{dish.detail}</p>
                    {(dish.tags.length > 0 || dish.wood) && (
                      <p className="mt-2.5 flex flex-wrap items-center gap-1.5">
                        {dish.wood && (
                          <span className="rounded-full border border-[#f26a1b]/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#f26a1b]">
                            over {dish.wood}
                          </span>
                        )}
                        {dish.tags.map((t) => (
                          <span key={t} className="rounded-full bg-[#f4e9d8]/[0.06] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#f4e9d8]/60">
                            {t}
                          </span>
                        ))}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

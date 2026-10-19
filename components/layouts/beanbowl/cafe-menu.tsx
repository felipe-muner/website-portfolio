"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { DIET_TAGS, MENU, MENU_CATEGORIES, type DietTag, type MenuCategory } from "@/lib/layouts/beanbowl";

/** Wide screens: 3 or 4 columns, whichever leaves fewer gaps in the last row (ties go to 4). */
function wideColumns(n: number): 3 | 4 {
  const gaps = (cols: number) => (cols - (n % cols)) % cols;
  return gaps(3) < gaps(4) ? 3 : 4;
}
const WIDE_GRID = { 3: "xl:grid-cols-3", 4: "xl:grid-cols-4" } as const;
const WIDE_CARD = { 3: "440px", 4: "330px" } as const;

/**
 * Bean & Bowl — the full menu as photo cards, filterable by section, dietary
 * tag and a free-text search, grouped by section like the printed one.
 */
export function CafeMenu() {
  const [section, setSection] = useState<MenuCategory | "All">("All");
  const [diet, setDiet] = useState<ReadonlySet<DietTag>>(new Set());
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const shown = MENU.filter(
    (item) =>
      (section === "All" || item.category === section) &&
      [...diet].every((d) => item.tags.includes(d)) &&
      (!q || item.name.toLowerCase().includes(q) || item.detail.toLowerCase().includes(q)),
  );
  const groups = MENU_CATEGORIES.map((c) => ({ c, items: shown.filter((i) => i.category === c) })).filter(
    (g) => g.items.length > 0,
  );

  const toggleDiet = (d: DietTag) =>
    setDiet((prev) => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return next;
    });

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
          {(["All", ...MENU_CATEGORIES] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSection(c)}
              aria-pressed={section === c}
              className={`shrink-0 rounded-full border px-4 py-2 text-[15px] transition-colors ${
                section === c
                  ? "border-[#2a1a10] bg-[#2a1a10] text-[#f5ecdf]"
                  : "border-[#2a1a10]/15 text-[#2a1a10]/75 hover:border-[#2a1a10]/40"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="flex h-11 items-center gap-2 rounded-full border border-[#2a1a10]/15 bg-white/70 px-4 focus-within:border-[#2a1a10]/50 lg:w-72">
          <Search className="size-4 shrink-0 text-[#2a1a10]/45" />
          <span className="sr-only">Search the menu</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search — try “coconut”"
            className="w-full bg-transparent text-[15px] text-[#2a1a10] placeholder:text-[#2a1a10]/40 focus:outline-none"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="text-[#2a1a10]/50 hover:text-[#2a1a10]">
              <X className="size-4" />
            </button>
          )}
        </label>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="font-hand mr-1 text-2xl leading-none text-[#b5562b]">only show</span>
        {DIET_TAGS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => toggleDiet(d)}
            aria-pressed={diet.has(d)}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              diet.has(d) ? "border-[#b5562b] bg-[#b5562b] text-white" : "border-[#2a1a10]/15 text-[#2a1a10]/70 hover:border-[#2a1a10]/40"
            }`}
          >
            {d}
          </button>
        ))}
        <span className="ml-auto text-sm text-[#2a1a10]/50">
          {shown.length} {shown.length === 1 ? "dish" : "dishes"}
        </span>
      </div>

      {groups.length === 0 ? (
        <p className="mt-14 text-center text-[#2a1a10]/60">Nothing matches — try fewer filters.</p>
      ) : (
        <div className="mt-10 flex flex-col gap-14">
          {groups.map(({ c, items }) => {
            const cols = wideColumns(items.length);
            return (
              <section key={c}>
                <div className="flex items-baseline justify-between gap-4 border-b border-[#2a1a10]/15 pb-3">
                  <h3 className="font-display text-3xl sm:text-4xl">{c}</h3>
                  <span className="text-sm text-[#2a1a10]/45">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </div>
                <ul className={`mt-6 grid gap-x-5 gap-y-5 sm:grid-cols-2 sm:gap-y-9 lg:grid-cols-3 ${WIDE_GRID[cols]}`}>
                  {items.map((item) => (
                    <li key={item.name} className="group flex gap-4 sm:flex-col sm:gap-0">
                      {/* Phones: a square thumbnail beside the text. Wider: a photo card. */}
                      <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-2xl bg-[#e9dccb] sm:aspect-[4/3] sm:w-full sm:rounded-[22px]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes={`(min-width: 1280px) ${WIDE_CARD[cols]}, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 96px`}
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                        />
                        {item.tags.length > 0 && (
                          <p className="absolute left-3 top-3 hidden flex-wrap gap-1.5 sm:flex">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-[#f5ecdf]/90 px-2.5 py-0.5 text-xs font-medium text-[#2a1a10] backdrop-blur"
                              >
                                {tag}
                              </span>
                            ))}
                          </p>
                        )}
                      </div>
                      <div className="min-w-0 flex-1 sm:px-1 sm:pt-4">
                        <div className="flex items-baseline gap-3">
                          <h4 className="text-lg font-semibold leading-snug">{item.name}</h4>
                          <span aria-hidden className="mb-1 flex-1 border-b-2 border-dotted border-[#2a1a10]/20" />
                          <span className="font-display text-lg">฿{item.price}</span>
                        </div>
                        <p className="mt-1 text-[15px] leading-relaxed text-[#2a1a10]/60">{item.detail}</p>
                        {item.tags.length > 0 && (
                          <p className="mt-2 flex flex-wrap gap-1.5 sm:hidden">
                            {item.tags.map((tag) => (
                              <span key={tag} className="rounded-full bg-[#2a1a10]/[0.06] px-2 py-0.5 text-xs text-[#2a1a10]/65">
                                {tag}
                              </span>
                            ))}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

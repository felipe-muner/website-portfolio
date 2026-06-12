"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

export interface MenuItem {
  name: string;
  detail: string;
  price: number;
  category: string;
  tags?: readonly string[];
}

export interface MenuTheme {
  accent: string;
  accentText: string;
  text: string;
  muted: string;
  surface: string;
  border: string;
  radius: string;
}

interface MenuFinderProps {
  items: readonly MenuItem[];
  theme: MenuTheme;
  displayClass: string;
  placeholder: string;
  currency?: string;
  /** Label shown next to the match counter, e.g. "dishes" / "treatments". */
  unitLabel: string;
}

/**
 * Searchable menu/service list shared by the business templates — same
 * entity-search idea as the gym schedules: matches keep their ink, the rest
 * fade back. Quick chips per category, themed via props.
 */
export function MenuFinder({ items, theme, displayClass, placeholder, currency = "฿", unitLabel }: MenuFinderProps) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const categories = useMemo(() => [...new Set(items.map((i) => i.category))], [items]);

  const matches = (item: MenuItem) =>
    q.length === 0 ||
    item.name.toLowerCase().includes(q) ||
    item.detail.toLowerCase().includes(q) ||
    item.category.toLowerCase().includes(q) ||
    (item.tags ?? []).some((t) => t.toLowerCase().includes(q));

  const matchCount = items.filter(matches).length;
  const hasQuery = q.length > 0;

  return (
    <div>
      {/* Search */}
      <div
        className="flex items-center gap-3 px-5 py-3.5"
        style={{
          backgroundColor: theme.surface,
          border: `1.5px solid ${theme.border}`,
          borderRadius: theme.radius,
        }}
      >
        <Search className="size-5 shrink-0" style={{ color: theme.accent }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Search the menu"
          className="w-full bg-transparent text-base focus:outline-none"
          style={{ color: theme.text }}
        />
        <span className="shrink-0 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: theme.muted }}>
          {hasQuery ? `${matchCount} ${unitLabel}` : `${items.length} ${unitLabel}`}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((c) => {
          const active = q === c.toLowerCase();
          return (
            <button
              key={c}
              type="button"
              onClick={() => setQuery(active ? "" : c)}
              className="px-4 py-2 text-sm font-bold transition-all"
              style={{
                borderRadius: theme.radius,
                backgroundColor: active ? theme.accent : "transparent",
                color: active ? theme.accentText : theme.muted,
                border: `1.5px solid ${active ? theme.accent : theme.border}`,
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Items */}
      <div className="mt-8 grid gap-x-12 gap-y-1 md:grid-cols-2">
        {items.map((item) => {
          const lit = matches(item);
          return (
            <div
              key={item.name}
              className={`flex items-baseline gap-3 py-3.5 transition-all duration-300 ${
                lit ? "" : "opacity-40"
              }`}
              style={{ borderBottom: `1px solid ${theme.border}` }}
            >
              <div className="min-w-0 flex-1">
                <p className="flex items-baseline gap-3">
                  <span
                    className={`${displayClass} text-lg leading-snug`}
                    style={{ color: lit && hasQuery ? theme.accent : theme.text }}
                  >
                    {item.name}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: theme.muted }}>
                    {item.category}
                  </span>
                </p>
                <p className="mt-0.5 text-sm leading-relaxed" style={{ color: theme.muted }}>
                  {item.detail}
                </p>
              </div>
              <span
                className="flex-1 border-b border-dotted"
                style={{ borderColor: theme.border, maxWidth: "4rem" }}
                aria-hidden
              />
              <span className={`${displayClass} text-lg`} style={{ color: lit && hasQuery ? theme.accent : theme.text }}>
                {currency}
                {item.price.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

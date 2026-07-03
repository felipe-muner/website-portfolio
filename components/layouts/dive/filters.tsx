"use client";

import { X } from "lucide-react";
import { BRANDS, CATEGORIES, type Category } from "@/lib/layouts/dive/catalog";
import { cn } from "@/lib/utils";

export interface FilterState {
  category: Category | "all";
  /** Selected brands (empty = all brands). */
  brands: string[];
  /** Max price in Baht (empty string = no limit). */
  maxPrice: string;
  /** Only show items on sale. */
  onSale: boolean;
}

export const DEFAULT_FILTERS: FilterState = {
  category: "all",
  brands: [],
  maxPrice: "",
  onSale: false,
};

interface FiltersProps {
  value: FilterState;
  onChange: (next: FilterState) => void;
}

export function Filters({ value, onChange }: FiltersProps) {
  const toggleBrand = (b: string) =>
    onChange({
      ...value,
      brands: value.brands.includes(b)
        ? value.brands.filter((x) => x !== b)
        : [...value.brands, b],
    });

  const dirty =
    value.category !== "all" ||
    value.brands.length > 0 ||
    value.maxPrice !== "" ||
    value.onSale;

  return (
    <aside className="space-y-7 text-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white">Filter</h2>
        {dirty && (
          <button
            type="button"
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#2ed3e8] hover:underline"
          >
            <X className="size-3" /> Clear
          </button>
        )}
      </div>

      {/* Category */}
      <Group title="Category">
        <FilterRow
          active={value.category === "all"}
          onClick={() => onChange({ ...value, category: "all" })}
          label="All gear"
        />
        {CATEGORIES.map((c) => (
          <FilterRow
            key={c.slug}
            active={value.category === c.slug}
            onClick={() => onChange({ ...value, category: c.slug })}
            label={c.label}
          />
        ))}
      </Group>

      {/* Brand — the new filter axis for the shop */}
      <Group title="Brand">
        <div className="flex flex-wrap gap-2">
          {BRANDS.map((b) => {
            const selected = value.brands.includes(b);
            return (
              <button
                key={b}
                type="button"
                onClick={() => toggleBrand(b)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                  selected
                    ? "border-[#2ed3e8] bg-[#2ed3e8] text-[#04263b]"
                    : "border-white/20 text-white/75 hover:border-white/50",
                )}
              >
                {b}
              </button>
            );
          })}
        </div>
      </Group>

      {/* Price */}
      <Group title="Max price">
        <label className="flex items-center gap-2 text-white/75">
          <span className="text-white/45">฿</span>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={value.maxPrice}
            onChange={(e) => onChange({ ...value, maxPrice: e.target.value })}
            placeholder="no limit"
            className="w-32 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#2ed3e8]"
          />
        </label>
      </Group>

      {/* On sale */}
      <Group title="Deals">
        <label className="flex cursor-pointer items-center gap-2.5 text-white/75">
          <button
            type="button"
            role="switch"
            aria-checked={value.onSale}
            onClick={() => onChange({ ...value, onSale: !value.onSale })}
            className={cn(
              "relative h-5 w-9 rounded-full transition",
              value.onSale ? "bg-[#2ed3e8]" : "bg-white/20",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 size-4 rounded-full bg-white transition-all",
                value.onSale ? "left-4" : "left-0.5",
              )}
            />
          </button>
          On sale only
        </label>
      </Group>
    </aside>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-white/45">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function FilterRow({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition",
        active ? "bg-white/10 font-semibold text-white" : "text-white/70 hover:bg-white/5",
      )}
    >
      <span
        className={cn(
          "grid size-4 place-items-center rounded-full border",
          active ? "border-[#2ed3e8] bg-[#2ed3e8]" : "border-white/30",
        )}
      >
        {active && <span className="size-1.5 rounded-full bg-[#04263b]" />}
      </span>
      {label}
    </button>
  );
}

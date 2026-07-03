"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { PRODUCTS, type Category } from "@/lib/layouts/dive/catalog";
import {
  DEFAULT_FILTERS,
  Filters,
  type FilterState,
} from "@/components/layouts/dive/filters";
import { ProductCard } from "@/components/layouts/dive/product-card";

type Sort = "featured" | "low" | "high";

const SORTS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "low", label: "Price: low to high" },
  { value: "high", label: "Price: high to low" },
];

export function ProductsBrowser({ initialCategory }: { initialCategory: Category | "all" }) {
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    category: initialCategory,
  });
  const [sort, setSort] = useState<Sort>("featured");
  const [showFilters, setShowFilters] = useState(false);

  const products = useMemo(() => {
    const maxBaht = filters.maxPrice ? Number(filters.maxPrice) : null;

    const list = PRODUCTS.filter((p) => {
      if (filters.category !== "all" && p.category !== filters.category) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;
      if (maxBaht !== null && p.price > maxBaht) return false;
      if (filters.onSale && !(p.compareAt && p.compareAt > p.price)) return false;
      return true;
    });

    const sorted = [...list];
    if (sort === "low") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "high") sorted.sort((a, b) => b.price - a.price);
    else sorted.sort((a, b) => Number(b.bestseller ?? false) - Number(a.bestseller ?? false));
    return sorted;
  }, [filters, sort]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Dive gear shop</h1>
          <p className="mt-1 text-sm font-light text-white/60">
            {products.length} {products.length === 1 ? "product" : "products"} · shipped island-wide
            from our partner Aquamaster
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/80 lg:hidden"
          >
            <SlidersHorizontal className="size-4" /> Filters
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-full border border-white/20 bg-[#04263b] px-4 py-2 text-sm font-medium text-white/85 outline-none focus:border-[#2ed3e8]"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[230px_1fr]">
        <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 lg:sticky lg:top-24">
            <Filters value={filters} onChange={setFilters} />
          </div>
        </div>

        <div>
          {products.length === 0 ? (
            <div className="grid place-items-center rounded-2xl border border-dashed border-white/20 py-20 text-center">
              <p className="text-white/60">No gear matches these filters.</p>
              <button
                type="button"
                onClick={() => setFilters({ ...DEFAULT_FILTERS })}
                className="mt-3 text-sm font-semibold text-[#2ed3e8] hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

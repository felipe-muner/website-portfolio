"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import {
  PRODUCTS,
  packPrice,
  type Family,
} from "@/lib/layouts/sacolaria/catalog";
import {
  DEFAULT_FILTERS,
  Filters,
  type FilterState,
} from "@/components/layouts/sacolaria/filters";
import { ProductCard } from "@/components/layouts/sacolaria/product-card";

type Sort = "relevancia" | "menor" | "maior";

const SORTS: { value: Sort; label: string }[] = [
  { value: "relevancia", label: "Mais vendidos" },
  { value: "menor", label: "Menor preço" },
  { value: "maior", label: "Maior preço" },
];

export function ProductsBrowser({ initialCategoria }: { initialCategoria: Family | "all" }) {
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    categoria: initialCategoria,
  });
  const [sort, setSort] = useState<Sort>("relevancia");
  const [showFilters, setShowFilters] = useState(false);

  const products = useMemo(() => {
    const maxCents = filters.maxPrice ? Math.round(Number(filters.maxPrice) * 100) : null;

    const list = PRODUCTS.filter((p) => {
      if (filters.categoria !== "all" && p.family !== filters.categoria) return false;
      if (filters.colors.length > 0 && !filters.colors.some((c) => p.colors.includes(c)))
        return false;
      if (maxCents !== null && packPrice(p, filters.units) > maxCents) return false;
      return true;
    });

    const sorted = [...list];
    if (sort === "menor") {
      sorted.sort((a, b) => packPrice(a, filters.units) - packPrice(b, filters.units));
    } else if (sort === "maior") {
      sorted.sort((a, b) => packPrice(b, filters.units) - packPrice(a, filters.units));
    } else {
      sorted.sort((a, b) => Number(b.bestseller ?? false) - Number(a.bestseller ?? false));
    }
    return sorted;
  }, [filters, sort]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0b3d2e]">
            Sacolas plásticas
          </h1>
          <p className="mt-1 text-sm text-[#7c8076]">
            {products.length} {products.length === 1 ? "produto" : "produtos"} · preços por pacote
            de {filters.units} un.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-[#e2ddd0] bg-white px-4 py-2 text-sm font-medium text-[#4b4f47] lg:hidden"
          >
            <SlidersHorizontal className="size-4" /> Filtros
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-full border border-[#e2ddd0] bg-white px-4 py-2 text-sm font-medium text-[#4b4f47] outline-none focus:border-[#0b3d2e]"
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
          <div className="rounded-2xl border border-[#e7e3d8] bg-white p-5 lg:sticky lg:top-28">
            <Filters value={filters} onChange={setFilters} />
          </div>
        </div>

        <div>
          {products.length === 0 ? (
            <div className="grid place-items-center rounded-2xl border border-dashed border-[#d8d3c5] bg-white py-20 text-center">
              <p className="text-[#7c8076]">Nenhuma sacola encontrada com esses filtros.</p>
              <button
                type="button"
                onClick={() => setFilters({ ...DEFAULT_FILTERS })}
                className="mt-3 text-sm font-semibold text-[#0b3d2e] hover:underline"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.slug} product={p} units={filters.units} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

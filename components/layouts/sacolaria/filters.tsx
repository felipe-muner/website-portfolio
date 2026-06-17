"use client";

import { X } from "lucide-react";
import {
  CATEGORIES,
  COLORS,
  PACK_TIERS,
  formatInt,
  type ColorName,
  type Family,
} from "@/lib/layouts/sacolaria/catalog";
import { cn } from "@/lib/utils";

export interface FilterState {
  categoria: Family | "all";
  colors: ColorName[];
  /** Pacote usado para prévia de preço. */
  units: number;
  /** Preço máximo do pacote em reais (string vazia = sem limite). */
  maxPrice: string;
}

export const DEFAULT_FILTERS: FilterState = {
  categoria: "all",
  colors: [],
  units: 100,
  maxPrice: "",
};

interface FiltersProps {
  value: FilterState;
  onChange: (next: FilterState) => void;
}

const ALL_COLORS = Object.values(COLORS);

export function Filters({ value, onChange }: FiltersProps) {
  const toggleColor = (c: ColorName) =>
    onChange({
      ...value,
      colors: value.colors.includes(c)
        ? value.colors.filter((x) => x !== c)
        : [...value.colors, c],
    });

  const dirty =
    value.categoria !== "all" ||
    value.colors.length > 0 ||
    value.units !== 100 ||
    value.maxPrice !== "";

  return (
    <aside className="space-y-7 text-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-[#0b3d2e]">Filtrar por</h2>
        {dirty && (
          <button
            type="button"
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="inline-flex items-center gap-1 text-xs font-medium text-[#8a6d12] hover:underline"
          >
            <X className="size-3" /> Limpar
          </button>
        )}
      </div>

      {/* Categoria */}
      <Group title="Categoria">
        <FilterRow
          active={value.categoria === "all"}
          onClick={() => onChange({ ...value, categoria: "all" })}
          label="Todas"
        />
        {CATEGORIES.map((c) => (
          <FilterRow
            key={c.slug}
            active={value.categoria === c.slug}
            onClick={() => onChange({ ...value, categoria: c.slug })}
            label={c.label}
          />
        ))}
      </Group>

      {/* Cores */}
      <Group title="Cores disponíveis">
        <div className="flex flex-wrap gap-2">
          {ALL_COLORS.map((c) => {
            const selected = value.colors.includes(c.name);
            return (
              <button
                key={c.name}
                type="button"
                title={c.name}
                aria-label={c.name}
                onClick={() => toggleColor(c.name)}
                className={cn(
                  "size-7 rounded-full border-2 transition",
                  selected
                    ? "border-[#0b3d2e] ring-2 ring-[#0b3d2e]/20"
                    : "border-black/10 hover:border-black/30",
                )}
                style={{ backgroundColor: c.hex, opacity: c.translucent ? 0.6 : 1 }}
              />
            );
          })}
        </div>
      </Group>

      {/* Quantidade de embalagens */}
      <Group title="Quantidade de embalagens">
        {PACK_TIERS.map((t) => (
          <FilterRow
            key={t.units}
            active={value.units === t.units}
            onClick={() => onChange({ ...value, units: t.units })}
            label={`${formatInt(t.units)} unidades`}
          />
        ))}
      </Group>

      {/* Preço */}
      <Group title="Preço do pacote">
        <label className="flex items-center gap-2 text-[#4b4f47]">
          <span>Até</span>
          <span className="text-[#8a8f84]">R$</span>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={value.maxPrice}
            onChange={(e) => onChange({ ...value, maxPrice: e.target.value })}
            placeholder="sem limite"
            className="w-28 rounded-lg border border-[#e2ddd0] bg-white px-3 py-1.5 text-sm outline-none focus:border-[#0b3d2e]"
          />
        </label>
      </Group>
    </aside>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-[#8a8f84]">{title}</h3>
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
        active ? "bg-[#eef4f0] font-semibold text-[#0b3d2e]" : "text-[#4b4f47] hover:bg-[#f5f3ec]",
      )}
    >
      <span
        className={cn(
          "grid size-4 place-items-center rounded-full border",
          active ? "border-[#0b3d2e] bg-[#0b3d2e]" : "border-[#c4c8bd]",
        )}
      >
        {active && <span className="size-1.5 rounded-full bg-white" />}
      </span>
      {label}
    </button>
  );
}

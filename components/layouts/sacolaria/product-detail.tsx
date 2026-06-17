"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Minus, Plus, ShoppingCart, Truck } from "lucide-react";
import {
  COLORS,
  PACK_TIERS,
  categoryBySlug,
  formatBRL,
  formatInt,
  packPrice,
  productName,
  unitPrice,
  type ColorName,
  type Product,
} from "@/lib/layouts/sacolaria/catalog";
import { useCart } from "@/lib/layouts/sacolaria/cart";
import { BagArt } from "@/components/layouts/sacolaria/bag-art";
import { PriceBlock } from "@/components/layouts/sacolaria/price-block";
import { ProductCard } from "@/components/layouts/sacolaria/product-card";
import { cn } from "@/lib/utils";

export function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const { add } = useCart();
  const [color, setColor] = useState<ColorName>(product.colors[0]);
  const [units, setUnits] = useState<number>(100);
  const [packs, setPacks] = useState<number>(1);
  const [added, setAdded] = useState(false);

  const category = categoryBySlug(product.family);
  const total = packPrice(product, units) * packs;

  function handleAdd() {
    add({ productSlug: product.slug, color, units, packs });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6">
      {/* breadcrumb */}
      <nav className="text-xs text-[#8a8f84]">
        <Link href="/sacolaria" className="hover:text-[#0b3d2e]">
          Início
        </Link>{" "}
        ·{" "}
        <Link href="/sacolaria/produtos" className="hover:text-[#0b3d2e]">
          Sacolas
        </Link>{" "}
        ·{" "}
        <Link
          href={`/sacolaria/produtos?categoria=${product.family}`}
          className="hover:text-[#0b3d2e]"
        >
          {category?.label}
        </Link>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* imagem */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="grid place-items-center rounded-3xl border border-[#e7e3d8] bg-white p-10">
            <BagArt family={product.family} color={color} className="h-80 w-auto drop-shadow-md" />
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[#7c8076]">
            <Truck className="size-4 text-[#0b3d2e]" /> Envio em 1 dia útil para todo o Brasil
          </div>
        </div>

        {/* infos */}
        <div>
          {product.bestseller && (
            <span className="inline-block rounded-full bg-[#0b3d2e] px-3 py-1 text-[0.62rem] font-bold uppercase tracking-wider text-white">
              Mais vendido
            </span>
          )}
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0b3d2e]">
            {productName(product)}
          </h1>
          <p className="mt-1.5 text-sm text-[#7c8076]">{product.material}</p>

          <div className="mt-6">
            <PriceBlock cents={total} size="lg" />
            <p className="mt-1 text-xs text-[#8a8f84]">
              {formatBRL(unitPrice(product, units))} por unidade · {packs}{" "}
              {packs === 1 ? "pacote" : "pacotes"} de {units} un.
            </p>
          </div>

          {/* cores */}
          <div className="mt-7">
            <p className="text-sm font-semibold text-[#23261f]">
              Cor: <span className="font-normal text-[#5b5f57]">{color}</span>
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2.5">
              {product.colors.map((c) => {
                const sw = COLORS[c];
                return (
                  <button
                    key={c}
                    type="button"
                    aria-label={c}
                    title={c}
                    onClick={() => setColor(c)}
                    className={cn(
                      "size-9 rounded-full border-2 transition",
                      color === c
                        ? "border-[#0b3d2e] ring-2 ring-[#0b3d2e]/20"
                        : "border-black/10 hover:border-black/30",
                    )}
                    style={{ backgroundColor: sw.hex, opacity: sw.translucent ? 0.6 : 1 }}
                  />
                );
              })}
            </div>
          </div>

          {/* pacotes (tier) */}
          <div className="mt-7">
            <p className="text-sm font-semibold text-[#23261f]">Quantidade por pacote</p>
            <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {PACK_TIERS.map((t) => {
                const active = units === t.units;
                return (
                  <button
                    key={t.units}
                    type="button"
                    onClick={() => setUnits(t.units)}
                    className={cn(
                      "rounded-xl border p-3 text-left transition",
                      active
                        ? "border-[#0b3d2e] bg-[#eef4f0]"
                        : "border-[#e2ddd0] bg-white hover:border-[#0b3d2e]/40",
                    )}
                  >
                    <span className="block text-sm font-bold text-[#23261f]">
                      {formatInt(t.units)} un.
                    </span>
                    <span className="block text-xs text-[#7c8076]">
                      {formatBRL(unitPrice(product, t.units))}/un.
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* quantidade de pacotes */}
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center rounded-full border border-[#e2ddd0] bg-white">
              <button
                type="button"
                aria-label="Diminuir"
                onClick={() => setPacks((p) => Math.max(1, p - 1))}
                className="grid size-11 place-items-center text-[#0b3d2e] disabled:opacity-30"
                disabled={packs <= 1}
              >
                <Minus className="size-4" />
              </button>
              <span className="w-12 text-center text-base font-bold text-[#23261f]">{packs}</span>
              <button
                type="button"
                aria-label="Aumentar"
                onClick={() => setPacks((p) => Math.min(999, p + 1))}
                className="grid size-11 place-items-center text-[#0b3d2e]"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <span className="text-sm text-[#7c8076]">
              {formatInt(units * packs)} unidades no total
            </span>
          </div>

          {/* add */}
          <button
            type="button"
            onClick={handleAdd}
            className={cn(
              "mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-bold transition sm:w-auto",
              added ? "bg-[#1f9d55] text-white" : "bg-[#0b3d2e] text-white hover:bg-[#0e5440]",
            )}
          >
            {added ? (
              <>
                <Check className="size-5" /> Adicionado ao carrinho
              </>
            ) : (
              <>
                <ShoppingCart className="size-5" /> Adicionar — {formatBRL(total)}
              </>
            )}
          </button>

          {/* specs */}
          <div className="mt-9 overflow-hidden rounded-2xl border border-[#e7e3d8]">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-[#eee9dd]">
                {[
                  ["Modelo", category?.label ?? "—"],
                  ["Tamanho", `${product.size} cm`],
                  ["Material", product.material],
                  ["Cores", product.colors.join(", ")],
                  ["Embalagens", "50, 100, 250, 500 ou 1000 unidades"],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <th className="w-40 bg-[#f6f4ee] px-4 py-2.5 text-left font-semibold text-[#4b4f47]">
                      {k}
                    </th>
                    <td className="px-4 py-2.5 text-[#5b5f57]">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* relacionados */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-extrabold tracking-tight text-[#0b3d2e]">
            Você também pode gostar
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

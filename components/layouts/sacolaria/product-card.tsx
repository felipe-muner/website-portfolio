"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Plus } from "lucide-react";
import {
  DEFAULT_PACK_UNITS,
  packPrice,
  productName,
  type Product,
} from "@/lib/layouts/sacolaria/catalog";
import { useCart } from "@/lib/layouts/sacolaria/cart";
import { BagArt } from "@/components/layouts/sacolaria/bag-art";
import { PriceBlock } from "@/components/layouts/sacolaria/price-block";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  units = DEFAULT_PACK_UNITS,
}: {
  product: Product;
  units?: number;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const href = `/sacolaria/produtos/${product.slug}`;
  const defaultColor = product.colors[0];

  function quickAdd() {
    add({ productSlug: product.slug, color: defaultColor, units, packs: 1 });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[#e7e3d8] bg-white transition hover:-translate-y-1 hover:shadow-[0_22px_45px_-28px_rgba(11,61,46,0.45)]">
      <Link href={href} className="relative block bg-[#f6f4ee] p-6">
        {product.bestseller && (
          <span className="absolute left-3 top-3 rounded-full bg-[#0b3d2e] px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-white">
            Mais vendido
          </span>
        )}
        <BagArt
          family={product.family}
          color={defaultColor}
          className="mx-auto h-44 w-auto drop-shadow-sm transition group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={href}>
          <h3 className="text-sm font-semibold leading-snug text-[#23261f] hover:text-[#0b3d2e]">
            {productName(product)}
          </h3>
        </Link>
        <p className="mt-0.5 text-xs text-[#7c8076]">
          Pacote de {units} un. · {product.colors.length} cores
        </p>

        <div className="mt-3">
          <PriceBlock cents={packPrice(product, units)} />
        </div>

        <button
          type="button"
          onClick={quickAdd}
          className={cn(
            "mt-4 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
            added
              ? "bg-[#1f9d55] text-white"
              : "bg-[#0b3d2e] text-white hover:bg-[#0e5440]",
          )}
        >
          {added ? (
            <>
              <Check className="size-4" /> Adicionado
            </>
          ) : (
            <>
              <Plus className="size-4" /> Adicionar
            </>
          )}
        </button>
      </div>
    </div>
  );
}

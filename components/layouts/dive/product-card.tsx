"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Plus } from "lucide-react";
import { discountPct, type Product } from "@/lib/layouts/dive/catalog";
import { useCart } from "@/lib/layouts/dive/cart";
import { PriceTag } from "@/components/layouts/dive/price-tag";
import { cn } from "@/lib/utils";

const CYAN = "#2ed3e8";
const ABYSS = "#04263b";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const href = `/dive/shop/${product.slug}`;
  const off = discountPct(product);

  function quickAdd() {
    add(product.slug, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-[#2ed3e8]/40">
      <Link href={href} className="relative block aspect-square bg-white">
        {product.bestseller && (
          <span
            className="absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider"
            style={{ backgroundColor: CYAN, color: ABYSS }}
          >
            Bestseller
          </span>
        )}
        {off > 0 && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-[#ff5d73] px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-white">
            −{off}%
          </span>
        )}
        <Image
          src={product.image}
          alt={product.imageAlt ?? product.name}
          fill
          sizes="(min-width: 1024px) 22vw, 45vw"
          className="object-contain p-4 transition duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/45">
          {product.brand}
        </p>
        <Link href={href}>
          <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug tracking-tight text-white hover:text-[#2ed3e8]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3">
          <PriceTag product={product} />
        </div>

        <button
          type="button"
          onClick={quickAdd}
          className={cn(
            "mt-4 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition",
            added ? "bg-[#1fbf6b] text-white" : "text-[#04263b]",
          )}
          style={added ? undefined : { backgroundColor: CYAN }}
        >
          {added ? (
            <>
              <Check className="size-4" /> Added
            </>
          ) : (
            <>
              <Plus className="size-4" /> Add to cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}

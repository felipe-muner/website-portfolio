"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ChevronLeft, Minus, Plus, ShoppingCart, Truck } from "lucide-react";
import {
  categoryBySlug,
  discountPct,
  FREE_SHIPPING_OVER,
  formatTHB,
  type Product,
} from "@/lib/layouts/dive/catalog";
import { useCart } from "@/lib/layouts/dive/cart";
import { PriceTag } from "@/components/layouts/dive/price-tag";
import { ProductCard } from "@/components/layouts/dive/product-card";
import { cn } from "@/lib/utils";

const CYAN = "#2ed3e8";

export function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const category = categoryBySlug(product.category);
  const off = discountPct(product);

  function addToCart() {
    add(product.slug, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-10">
      <Link
        href="/dive/shop"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/60 transition hover:text-white"
      >
        <ChevronLeft className="size-4" /> Back to shop
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Photo */}
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-white">
          {off > 0 && (
            <span className="absolute left-4 top-4 z-10 rounded-full bg-[#ff5d73] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Save {off}%
            </span>
          )}
          <Image
            src={product.image}
            alt={product.imageAlt ?? product.name}
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-contain p-8"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
            {product.brand} ·{" "}
            <Link href={`/dive/shop?category=${product.category}`} className="hover:text-[#2ed3e8]">
              {category?.label}
            </Link>
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{product.name}</h1>
          {product.blurb && (
            <p className="mt-4 text-lg font-light leading-relaxed text-white/75">{product.blurb}</p>
          )}

          {product.tags && product.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {product.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-white/70"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-7">
            <PriceTag product={product} size="lg" />
            <p className="mt-2 flex items-center gap-2 text-sm font-light text-white/60">
              <Truck className="size-4" style={{ color: CYAN }} />
              {product.price >= FREE_SHIPPING_OVER
                ? "Free island delivery on this item"
                : `Free island delivery over ${formatTHB(FREE_SHIPPING_OVER)}`}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-white/20">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid size-11 place-items-center text-white transition hover:text-[#2ed3e8]"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center text-base font-bold">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => q + 1)}
                className="grid size-11 place-items-center text-white transition hover:text-[#2ed3e8]"
              >
                <Plus className="size-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={addToCart}
              className={cn(
                "inline-flex flex-1 items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-bold transition",
                added ? "bg-[#1fbf6b] text-white" : "text-[#04263b]",
              )}
              style={added ? undefined : { backgroundColor: CYAN }}
            >
              {added ? (
                <>
                  <Check className="size-5" /> Added to cart
                </>
              ) : (
                <>
                  <ShoppingCart className="size-5" /> Add to cart
                </>
              )}
            </button>
          </div>

          <Link
            href="/dive/cart"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2ed3e8] hover:underline"
          >
            View cart <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-bold tracking-tight">You might also need</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

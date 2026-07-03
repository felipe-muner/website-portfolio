"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { formatTHB, FREE_SHIPPING_OVER } from "@/lib/layouts/dive/catalog";
import { useCart } from "@/lib/layouts/dive/cart";

const CYAN = "#2ed3e8";

export default function CartPage() {
  const { lines, totals, setQty, remove, hydrated } = useCart();

  if (!hydrated) {
    return <main className="min-h-[60vh] pt-16" />;
  }

  if (lines.length === 0) {
    return (
      <main className="pt-16">
        <div className="mx-auto grid max-w-2xl place-items-center px-5 py-24 text-center">
          <div className="grid size-20 place-items-center rounded-full border border-white/10 bg-white/5">
            <ShoppingBag className="size-9" style={{ color: CYAN }} />
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight">Your cart is empty</h1>
          <p className="mt-2 font-light text-white/60">
            Add masks, fins or a full kit from our partner Aquamaster to get started.
          </p>
          <Link
            href="/dive/shop"
            className="mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-[#04263b]"
            style={{ backgroundColor: CYAN }}
          >
            Browse the shop <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>
    );
  }

  const toFreeShipping = Math.max(0, FREE_SHIPPING_OVER - totals.subtotal);
  const progress = Math.min(100, (totals.subtotal / FREE_SHIPPING_OVER) * 100);

  return (
    <main className="pt-16">
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-10">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Your cart</h1>
        <p className="mt-1 text-sm font-light text-white/60">
          {totals.itemCount} {totals.itemCount === 1 ? "item" : "items"}
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Items */}
          <ul className="space-y-4">
            {lines.map((l) => {
              return (
                <li
                  key={l.slug}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <Link
                    href={`/dive/shop/${l.slug}`}
                    className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-white"
                  >
                    <Image
                      src={l.product.image}
                      alt={l.product.name}
                      fill
                      sizes="96px"
                      className="object-contain p-2"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/45">
                          {l.product.brand}
                        </p>
                        <Link
                          href={`/dive/shop/${l.slug}`}
                          className="text-sm font-bold text-white hover:text-[#2ed3e8]"
                        >
                          {l.product.name}
                        </Link>
                        <p className="mt-0.5 text-xs font-light text-white/55">
                          {formatTHB(l.product.price)} each
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label="Remove"
                        onClick={() => remove(l.slug)}
                        className="text-white/40 transition hover:text-[#ff5d73]"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                      <div className="inline-flex items-center rounded-full border border-white/20">
                        <button
                          type="button"
                          aria-label="Decrease"
                          onClick={() => setQty(l.slug, l.qty - 1)}
                          className="grid size-9 place-items-center text-white transition hover:text-[#2ed3e8]"
                        >
                          <Minus className="size-4" />
                        </button>
                        <span className="w-9 text-center text-sm font-bold">{l.qty}</span>
                        <button
                          type="button"
                          aria-label="Increase"
                          onClick={() => setQty(l.slug, l.qty + 1)}
                          className="grid size-9 place-items-center text-white transition hover:text-[#2ed3e8]"
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
                      <span className="text-base font-bold" style={{ color: CYAN }}>
                        {formatTHB(l.lineTotal)}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Summary */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              {/* Free-shipping progress */}
              <div className="rounded-xl border border-white/10 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Truck className="size-4" style={{ color: CYAN }} />
                  {totals.freeShipping ? (
                    "You've unlocked free island delivery"
                  ) : (
                    <>Add {formatTHB(toFreeShipping)} for free delivery</>
                  )}
                </p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${progress}%`, backgroundColor: CYAN }}
                  />
                </div>
              </div>

              <h2 className="mt-5 text-base font-bold">Order summary</h2>
              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-white/70">
                  <dt>Subtotal</dt>
                  <dd>{formatTHB(totals.subtotal)}</dd>
                </div>
                <div className="flex justify-between text-white/70">
                  <dt>Delivery</dt>
                  <dd>{totals.shipping === 0 ? "Free" : formatTHB(totals.shipping)}</dd>
                </div>
                <div className="mt-2 flex items-end justify-between border-t border-white/10 pt-3">
                  <dt className="font-semibold">Total</dt>
                  <dd className="text-xl font-bold" style={{ color: CYAN }}>
                    {formatTHB(totals.total)}
                  </dd>
                </div>
              </dl>

              <Link
                href="/dive/checkout"
                className="mt-5 flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-[#04263b] transition-shadow hover:shadow-[0_0_24px_rgba(46,211,232,0.5)]"
                style={{ backgroundColor: CYAN }}
              >
                Checkout <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/dive/shop"
                className="mt-3 block text-center text-sm font-medium text-white/70 hover:text-white"
              >
                Continue shopping
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

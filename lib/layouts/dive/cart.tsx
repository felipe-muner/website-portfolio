"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  productBySlug,
  shippingFor,
  type Product,
} from "@/lib/layouts/dive/catalog";

export interface CartLine {
  slug: string;
  qty: number;
}

export interface ResolvedLine extends CartLine {
  product: Product;
  /** Line total in whole Baht. */
  lineTotal: number;
}

interface CartTotals {
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
  freeShipping: boolean;
}

interface CartContextValue {
  lines: ResolvedLine[];
  totals: CartTotals;
  /** Total item count for the nav badge. */
  count: number;
  /** How many of a given product are in the cart. */
  qtyOf: (slug: string) => number;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  hydrated: boolean;
}

const STORAGE_KEY = "dive.cart.v1";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [rawLines, setRawLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load once on the client so SSR markup stays stable.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartLine[];
        if (Array.isArray(parsed)) {
          setRawLines(parsed.filter((l) => l.qty > 0 && productBySlug(l.slug)));
        }
      }
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  // Persist on every change after hydration.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rawLines));
    } catch {
      // storage unavailable — carry on without persisting
    }
  }, [rawLines, hydrated]);

  const add = useCallback((slug: string, qty = 1) => {
    if (!productBySlug(slug)) return;
    setRawLines((prev) => {
      const existing = prev.find((l) => l.slug === slug);
      if (existing) {
        return prev.map((l) => (l.slug === slug ? { ...l, qty: l.qty + qty } : l));
      }
      return [...prev, { slug, qty }];
    });
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setRawLines((prev) =>
      prev
        .map((l) => (l.slug === slug ? { ...l, qty } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setRawLines((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const clear = useCallback(() => setRawLines([]), []);

  const lines = useMemo<ResolvedLine[]>(() => {
    return rawLines.flatMap((l) => {
      const product = productBySlug(l.slug);
      if (!product) return [];
      return [{ ...l, product, lineTotal: product.price * l.qty }];
    });
  }, [rawLines]);

  const totals = useMemo<CartTotals>(() => {
    const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
    const shipping = shippingFor(subtotal);
    return {
      subtotal,
      shipping,
      total: subtotal + shipping,
      itemCount: lines.reduce((sum, l) => sum + l.qty, 0),
      freeShipping: subtotal > 0 && shipping === 0,
    };
  }, [lines]);

  const qtyOf = useCallback(
    (slug: string) => rawLines.find((l) => l.slug === slug)?.qty ?? 0,
    [rawLines],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      totals,
      count: totals.itemCount,
      qtyOf,
      add,
      setQty,
      remove,
      clear,
      hydrated,
    }),
    [lines, totals, qtyOf, add, setQty, remove, clear, hydrated],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

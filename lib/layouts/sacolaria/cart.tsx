"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  applyPix,
  MIN_ORDER,
  packPrice,
  productBySlug,
  type ColorName,
  type Product,
} from "@/lib/layouts/sacolaria/catalog";

export interface CartLine {
  productSlug: string;
  color: ColorName;
  /** Unidades por pacote (tier). */
  units: number;
  /** Quantidade de pacotes. */
  packs: number;
}

export interface ResolvedLine extends CartLine {
  product: Product;
  /** Identificador estável da linha (slug+cor+tier). */
  id: string;
  /** Preço de um pacote, em centavos. */
  packPriceCents: number;
  /** Total da linha (pacotes), em centavos. */
  lineTotal: number;
  totalUnits: number;
}

interface CartTotals {
  subtotal: number;
  pixTotal: number;
  totalUnits: number;
  totalPacks: number;
  meetsMinimum: boolean;
}

interface CartContextValue {
  lines: ResolvedLine[];
  totals: CartTotals;
  /** Número de itens (pacotes) para o badge. */
  count: number;
  add: (line: CartLine) => void;
  setPacks: (id: string, packs: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  hydrated: boolean;
}

const lineId = (l: CartLine) => `${l.productSlug}__${l.color}__${l.units}`;

const STORAGE_KEY = "sacolaria.cart.v1";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [rawLines, setRawLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Carrega do localStorage uma vez (client-only para não quebrar o SSR).
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartLine[];
        if (Array.isArray(parsed)) setRawLines(parsed.filter((l) => productBySlug(l.productSlug)));
      }
    } catch {
      // ignora storage corrompido
    }
    setHydrated(true);
  }, []);

  // Persiste a cada mudança (após hidratar).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rawLines));
    } catch {
      // storage cheio/indisponível — segue sem persistir
    }
  }, [rawLines, hydrated]);

  const add = useCallback((line: CartLine) => {
    setRawLines((prev) => {
      const id = lineId(line);
      const existing = prev.find((l) => lineId(l) === id);
      if (existing) {
        return prev.map((l) => (lineId(l) === id ? { ...l, packs: l.packs + line.packs } : l));
      }
      return [...prev, line];
    });
  }, []);

  const setPacks = useCallback((id: string, packs: number) => {
    setRawLines((prev) =>
      prev
        .map((l) => (lineId(l) === id ? { ...l, packs } : l))
        .filter((l) => l.packs > 0),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setRawLines((prev) => prev.filter((l) => lineId(l) !== id));
  }, []);

  const clear = useCallback(() => setRawLines([]), []);

  const lines = useMemo<ResolvedLine[]>(() => {
    return rawLines.flatMap((l) => {
      const product = productBySlug(l.productSlug);
      if (!product) return [];
      const packPriceCents = packPrice(product, l.units);
      return [
        {
          ...l,
          product,
          id: lineId(l),
          packPriceCents,
          lineTotal: packPriceCents * l.packs,
          totalUnits: l.units * l.packs,
        },
      ];
    });
  }, [rawLines]);

  const totals = useMemo<CartTotals>(() => {
    const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
    return {
      subtotal,
      pixTotal: applyPix(subtotal),
      totalUnits: lines.reduce((sum, l) => sum + l.totalUnits, 0),
      totalPacks: lines.reduce((sum, l) => sum + l.packs, 0),
      meetsMinimum: subtotal >= MIN_ORDER,
    };
  }, [lines]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      totals,
      count: totals.totalPacks,
      add,
      setPacks,
      remove,
      clear,
      hydrated,
    }),
    [lines, totals, add, setPacks, remove, clear, hydrated],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de <CartProvider>");
  return ctx;
}

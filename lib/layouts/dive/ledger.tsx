"use client";

// Owner-dashboard demo ledger: purchases from suppliers (stock in) and sales
// (walk-in or from the online shop). Persisted to localStorage like the cart —
// this is a Phase-2 preview, no database.

import { useCallback, useEffect, useMemo, useState } from "react";
import { PRODUCTS, productBySlug, type Product } from "@/lib/layouts/dive/catalog";

export type TxType = "purchase" | "sale";
export type Channel = "walk-in" | "online";

export interface Tx {
  id: string;
  type: TxType;
  slug: string;
  qty: number;
  /** Unit amount in whole Baht — cost for a purchase, price for a sale. */
  unit: number;
  /** Sales only: how the sale happened. */
  channel?: Channel;
  /** yyyy-MM-dd */
  date: string;
}

const STORAGE_KEY = "dive.ledger.v1";

/** A believable starting history so the demo isn't empty. */
export function seedLedger(): Tx[] {
  const picks = PRODUCTS.slice(0, 6);
  const buyQty = [60, 40, 50, 30, 45, 25];
  const txs: Tx[] = picks.map((p, i) => ({
    id: `seed-buy-${i}`,
    type: "purchase",
    slug: p.slug,
    qty: buyQty[i],
    unit: Math.round(p.price * 0.62), // supplier cost ~62% of retail
    date: `2026-07-0${(i % 6) + 1}`,
  }));
  const saleQty = [4, 6, 3, 5, 2];
  picks.slice(0, 5).forEach((p, i) => {
    txs.push({
      id: `seed-sell-${i}`,
      type: "sale",
      slug: p.slug,
      qty: saleQty[i],
      unit: p.price,
      channel: i % 2 === 0 ? "online" : "walk-in",
      date: `2026-07-1${i}`,
    });
  });
  return txs;
}

/**
 * Append online sales to the ledger from a completed shop checkout, so they
 * decrement stock and show up on the dashboard automatically. Seeds the demo
 * baseline first if the ledger doesn't exist yet.
 */
export function recordOnlineSale(
  items: { slug: string; qty: number; unit: number }[],
  date: string,
): void {
  if (typeof window === "undefined" || items.length === 0) return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    let txs: Tx[] = [];
    if (raw) {
      const parsed = JSON.parse(raw) as Tx[];
      txs = Array.isArray(parsed) ? parsed : seedLedger();
    } else {
      txs = seedLedger();
    }
    const additions: Tx[] = items
      .filter((it) => productBySlug(it.slug) && it.qty > 0)
      .map((it, i) => ({
        id: `online-${Date.now()}-${i}`,
        type: "sale",
        slug: it.slug,
        qty: it.qty,
        unit: it.unit,
        channel: "online",
        date,
      }));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...additions, ...txs]));
  } catch {
    // ignore storage errors
  }
}

export interface StockRow {
  product: Product;
  bought: number;
  sold: number;
  available: number;
}

export function computeStock(txs: Tx[]): StockRow[] {
  const map = new Map<string, { bought: number; sold: number }>();
  for (const t of txs) {
    const row = map.get(t.slug) ?? { bought: 0, sold: 0 };
    if (t.type === "purchase") row.bought += t.qty;
    else row.sold += t.qty;
    map.set(t.slug, row);
  }
  const rows: StockRow[] = [];
  for (const [slug, { bought, sold }] of map) {
    const product = productBySlug(slug);
    if (!product) continue;
    rows.push({ product, bought, sold, available: bought - sold });
  }
  return rows.sort((a, b) => a.available - b.available);
}

export interface Totals {
  moneyIn: number;
  moneyOut: number;
  profit: number;
  unitsInStock: number;
  unitsSold: number;
}

export function computeTotals(txs: Tx[]): Totals {
  let moneyIn = 0;
  let moneyOut = 0;
  let bought = 0;
  let sold = 0;
  for (const t of txs) {
    if (t.type === "sale") {
      moneyIn += t.qty * t.unit;
      sold += t.qty;
    } else {
      moneyOut += t.qty * t.unit;
      bought += t.qty;
    }
  }
  return { moneyIn, moneyOut, profit: moneyIn - moneyOut, unitsInStock: bought - sold, unitsSold: sold };
}

/** Units currently available for one product. */
export function availableFor(txs: Tx[], slug: string): number {
  return txs.reduce((n, t) => n + (t.slug === slug ? (t.type === "purchase" ? t.qty : -t.qty) : 0), 0);
}

export function useLedger() {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Tx[];
        setTxs(Array.isArray(parsed) ? parsed : seedLedger());
      } else {
        setTxs(seedLedger());
      }
    } catch {
      setTxs(seedLedger());
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(txs));
    } catch {
      // ignore
    }
  }, [txs, hydrated]);

  const addTx = useCallback((tx: Omit<Tx, "id">) => {
    const id = `tx-${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    setTxs((prev) => [{ ...tx, id }, ...prev]);
  }, []);

  const removeTx = useCallback((id: string) => {
    setTxs((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const reset = useCallback(() => setTxs(seedLedger()), []);

  const stock = useMemo(() => computeStock(txs), [txs]);
  const totals = useMemo(() => computeTotals(txs), [txs]);

  return { txs, addTx, removeTx, reset, stock, totals, hydrated };
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  PackagePlus,
  RotateCcw,
  Search,
  Settings,
  ShoppingCart,
  Trash2,
  TrendingUp,
  Waves,
} from "lucide-react";
import {
  BRANDS,
  formatTHB,
  PRODUCTS,
  productBySlug,
  type Product,
} from "@/lib/layouts/dive/catalog";
import { availableFor, useLedger, type Channel, type TxType } from "@/lib/layouts/dive/ledger";
import { AuthProvider, useAuth } from "@/lib/layouts/dive/auth";
import { EntitySearch } from "@/components/layouts/dive/entity-search";
import { DashboardGate } from "@/components/layouts/dive/dashboard-gate";
import { DashboardSettings } from "@/components/layouts/dive/dashboard-settings";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const CYAN = "#2ed3e8";
const today = () => format(new Date(), "yyyy-MM-dd");

type Section = "overview" | "stock" | "report" | "settings";

const MENU: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard className="size-4" /> },
  { id: "stock", label: "Stock", icon: <Boxes className="size-4" /> },
  { id: "report", label: "Report", icon: <ClipboardList className="size-4" /> },
  { id: "settings", label: "Settings", icon: <Settings className="size-4" /> },
];

type TypeOption = { id: TxType; label: string };
const TYPE_OPTIONS: TypeOption[] = [
  { id: "sale", label: "Sales" },
  { id: "purchase", label: "Purchases" },
];

/** Read the active section from the URL (?section=…) so links are shareable. */
function readSection(): Section {
  if (typeof window === "undefined") return "overview";
  const s = new URLSearchParams(window.location.search).get("section");
  return MENU.some((m) => m.id === s) ? (s as Section) : "overview";
}

export default function DashboardPage() {
  return (
    <AuthProvider>
      <DashboardGate>
        <DashboardShell />
      </DashboardGate>
    </AuthProvider>
  );
}

function DashboardShell() {
  const { session, signOut } = useAuth();
  const [section, setSectionState] = useState<Section>(readSection);

  // Keep the URL in sync so every section has a shareable link.
  const setSection = useCallback((s: Section) => {
    setSectionState(s);
    window.history.replaceState(null, "", `${window.location.pathname}?section=${s}`);
  }, []);

  useEffect(() => {
    const onPop = () => setSectionState(readSection());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="shrink-0 border-b border-white/10 bg-[#04263b]/50 md:sticky md:top-0 md:h-dvh md:w-64 md:border-b-0 md:border-r">
        <div className="flex h-full flex-col">
          {/* Brand */}
          <div className="flex items-center justify-between gap-2 px-4 py-4">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl" style={{ backgroundColor: CYAN }}>
                <Waves className="size-5 text-[#04263b]" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-bold">Aqua Sport Supply</p>
                <p className="text-[0.6rem] uppercase tracking-wider text-white/45">Owner area</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Sign out"
              onClick={signOut}
              className="grid size-9 place-items-center rounded-full border border-white/15 text-white/60 transition hover:border-[#ff5d73] hover:text-[#ff8a99] md:hidden"
            >
              <LogOut className="size-4" />
            </button>
          </div>

          {/* Menu */}
          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:overflow-visible md:pb-0">
            {MENU.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSection(m.id)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition md:w-full",
                  section === m.id
                    ? "bg-[#2ed3e8] text-[#04263b]"
                    : "text-white/70 hover:bg-white/5 hover:text-white",
                )}
              >
                {m.icon}
                {m.label}
              </button>
            ))}
          </nav>

          {/* Account (desktop) */}
          <div className="hidden border-t border-white/10 p-3 md:block">
            <div className="flex items-center gap-2.5 px-1">
              <span
                className="grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold text-[#04263b]"
                style={{ backgroundColor: CYAN }}
              >
                {session?.name.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">{session?.email}</p>
                <p className="text-[0.6rem] uppercase tracking-wider text-white/40">Signed in</p>
              </div>
              <button
                type="button"
                aria-label="Sign out"
                onClick={signOut}
                className="grid size-8 shrink-0 place-items-center rounded-full border border-white/15 text-white/60 transition hover:border-[#ff5d73] hover:text-[#ff8a99]"
              >
                <LogOut className="size-4" />
              </button>
            </div>
            <Link
              href="/dive"
              className="mt-2 block rounded-xl px-3.5 py-2 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              ← Back to shop
            </Link>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">
        {section === "settings" ? (
          <DashboardSettings />
        ) : (
          <DashboardBody section={section} onGo={setSection} />
        )}
      </div>
    </div>
  );
}

function DashboardBody({ section, onGo }: { section: Section; onGo: (s: Section) => void }) {
  const { txs, addTx, removeTx, reset, stock, totals, hydrated } = useLedger();

  // Purchase (stock in) form
  const [pProduct, setPProduct] = useState<Product | null>(null);
  const [pQty, setPQty] = useState("");
  const [pCost, setPCost] = useState("");
  const [pDate, setPDate] = useState(today());

  // Sale form
  const [sProduct, setSProduct] = useState<Product | null>(null);
  const [sQty, setSQty] = useState("");
  const [sPrice, setSPrice] = useState("");
  const [sChannel, setSChannel] = useState<Channel>("walk-in");
  const [sDate, setSDate] = useState(today());

  // Report filters
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState("all");
  const [type, setType] = useState<TxType | "all">("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // Stock → sold-history sheet
  const [soldSheet, setSoldSheet] = useState<string | null>(null);
  const soldProduct = soldSheet ? productBySlug(soldSheet) : null;
  const soldTxs = useMemo(
    () =>
      soldSheet
        ? txs
            .filter((t) => t.type === "sale" && t.slug === soldSheet)
            .sort((a, b) => b.date.localeCompare(a.date))
        : [],
    [txs, soldSheet],
  );
  const soldUnits = soldTxs.reduce((n, t) => n + t.qty, 0);
  const soldValue = soldTxs.reduce((n, t) => n + t.qty * t.unit, 0);

  const sAvailable = sProduct ? availableFor(txs, sProduct.slug) : 0;
  const sOversell = !!sProduct && Number(sQty) > sAvailable;

  function addPurchase() {
    if (!pProduct || Number(pQty) <= 0 || Number(pCost) < 0) return;
    addTx({ type: "purchase", slug: pProduct.slug, qty: Number(pQty), unit: Number(pCost), date: pDate });
    setPProduct(null);
    setPQty("");
    setPCost("");
  }

  function addSale() {
    if (!sProduct || Number(sQty) <= 0 || Number(sPrice) < 0 || sOversell) return;
    addTx({ type: "sale", slug: sProduct.slug, qty: Number(sQty), unit: Number(sPrice), channel: sChannel, date: sDate });
    setSProduct(null);
    setSQty("");
    setSPrice("");
  }

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return txs.filter((t) => {
      const p = productBySlug(t.slug);
      if (!p) return false;
      if (type !== "all" && t.type !== type) return false;
      if (brand !== "all" && p.brand !== brand) return false;
      if (needle && !`${p.name} ${p.brand}`.toLowerCase().includes(needle)) return false;
      if (from && t.date < from) return false;
      if (to && t.date > to) return false;
      return true;
    });
  }, [txs, type, brand, q, from, to]);

  const filteredTotals = useMemo(() => {
    let inn = 0;
    let out = 0;
    for (const t of filtered) {
      if (t.type === "sale") inn += t.qty * t.unit;
      else out += t.qty * t.unit;
    }
    return { inn, out };
  }, [filtered]);

  if (!hydrated) return null;

  return (
    <div>
      {/* ---------------- Overview ---------------- */}
      {section === "overview" && (
        <>
          <SectionHead
            title="Overview"
            desc="Cash flow at a glance — a preview of the Phase 2 owner area."
            action={
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/70 transition hover:border-white hover:text-white"
              >
                <RotateCcw className="size-4" /> Reset demo data
              </button>
            }
          />
          <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
            <StatTile icon={<Boxes className="size-5" />} label="Units in stock" value={String(totals.unitsInStock)} tone="cyan" />
            <StatTile icon={<ArrowDownRight className="size-5" />} label="Money in (sales)" value={formatTHB(totals.moneyIn)} tone="green" />
            <StatTile icon={<ArrowUpRight className="size-5" />} label="Money out (stock)" value={formatTHB(totals.moneyOut)} tone="reef" />
            <StatTile icon={<TrendingUp className="size-5" />} label="Profit (in − out)" value={formatTHB(totals.profit)} tone="cyan" />
          </div>

          {/* Quick actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onGo("stock")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2ed3e8] px-4 py-2.5 text-sm font-bold text-[#04263b]"
            >
              <PackagePlus className="size-4" /> Add stock or sale
            </button>
            <button
              type="button"
              onClick={() => onGo("report")}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold transition hover:border-white"
            >
              <ClipboardList className="size-4" /> View report
            </button>
          </div>

          {/* Recent activity */}
          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight">Recent activity</h2>
              <button
                type="button"
                onClick={() => onGo("report")}
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#2ed3e8] hover:underline"
              >
                Full report <ArrowRight className="size-4" />
              </button>
            </div>
            <ul className="mt-3 divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10">
              {txs.slice(0, 6).map((t) => {
                const p = productBySlug(t.slug)!;
                const isSale = t.type === "sale";
                return (
                  <li key={t.id} className="flex items-center gap-3 px-4 py-3">
                    <ProductCell product={p} />
                    <span
                      className={cn(
                        "ml-auto shrink-0 rounded-full px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider",
                        isSale ? "bg-[#35d191]/15 text-[#35d191]" : "bg-white/10 text-white/70",
                      )}
                    >
                      {isSale ? "Sale" : "Stock in"}
                    </span>
                    <span className={cn("w-24 shrink-0 text-right text-sm font-semibold tabular-nums", isSale ? "text-[#35d191]" : "text-white/70")}>
                      {isSale ? "+" : "−"}
                      {formatTHB(t.qty * t.unit)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}

      {/* ---------------- Stock (forms + table) ---------------- */}
      {section === "stock" && (
        <>
          <SectionHead
            title="Stock"
            desc="Buy from suppliers, record sales, and watch stock move — one shared stock for online and walk-in."
          />
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {/* Purchase */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="flex items-center gap-2 text-base font-bold">
                <PackagePlus className="size-5" style={{ color: CYAN }} /> Add stock (buy from supplier)
              </h2>
              <div className="mt-4 space-y-3">
                <EntitySearch
                  items={PRODUCTS as Product[]}
                  value={pProduct}
                  onChange={setPProduct}
                  getKey={(p) => p.slug}
                  getLabel={(p) => p.name}
                  getSublabel={(p) => `${p.brand} · sells at ${formatTHB(p.price)}`}
                  getImage={(p) => p.image}
                  placeholder="Search a product to restock…"
                />
                <div className="grid grid-cols-2 gap-3">
                  <NumField label="Quantity" value={pQty} onChange={setPQty} placeholder="e.g. 50" />
                  <NumField label="Unit cost (฿)" value={pCost} onChange={setPCost} placeholder="e.g. 9000" />
                </div>
                <DateField label="Date" value={pDate} onChange={setPDate} />
                <button
                  type="button"
                  onClick={addPurchase}
                  disabled={!pProduct || Number(pQty) <= 0}
                  className="w-full rounded-xl bg-[#2ed3e8] px-4 py-2.5 text-sm font-bold text-[#04263b] transition disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Add to stock
                </button>
              </div>
            </section>

            {/* Sale */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="flex items-center gap-2 text-base font-bold">
                <ShoppingCart className="size-5" style={{ color: CYAN }} /> Record a sale
              </h2>
              <div className="mt-4 space-y-3">
                <EntitySearch
                  items={PRODUCTS as Product[]}
                  value={sProduct}
                  onChange={(p) => {
                    setSProduct(p);
                    if (p) setSPrice(String(p.price));
                  }}
                  getKey={(p) => p.slug}
                  getLabel={(p) => p.name}
                  getSublabel={(p) => `${p.brand} · ${availableFor(txs, p.slug)} in stock`}
                  getImage={(p) => p.image}
                  placeholder="Search a product to sell…"
                />
                <div className="grid grid-cols-2 gap-3">
                  <NumField label="Quantity" value={sQty} onChange={setSQty} placeholder="e.g. 1" error={sOversell ? `Only ${sAvailable} in stock` : undefined} />
                  <NumField label="Unit price (฿)" value={sPrice} onChange={setSPrice} placeholder="e.g. 9695" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="mb-1.5 block text-xs font-medium text-white/60">Channel</span>
                    <div className="inline-flex rounded-xl border border-white/15 p-0.5">
                      {(["walk-in", "online"] as Channel[]).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setSChannel(c)}
                          className={cn(
                            "rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition",
                            sChannel === c ? "bg-[#2ed3e8] text-[#04263b]" : "text-white/70",
                          )}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <DateField label="Date" value={sDate} onChange={setSDate} />
                </div>
                <button
                  type="button"
                  onClick={addSale}
                  disabled={!sProduct || Number(sQty) <= 0 || sOversell}
                  className="w-full rounded-xl bg-[#2ed3e8] px-4 py-2.5 text-sm font-bold text-[#04263b] transition disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Record sale
                </button>
                <p className="text-xs font-light text-white/45">
                  Online-shop orders would land here automatically; walk-in sales you add by hand.
                </p>
              </div>
            </section>
          </div>
        </>
      )}

      {/* ---------------- Live stock table ---------------- */}
      {section === "stock" && (
        <>
          <h2 className="mt-10 text-lg font-bold tracking-tight">Live stock</h2>
          <p className="mt-1 text-sm font-light text-white/55">
            Every purchase adds units; every sale removes one. Click a Sold count to see the sales.
          </p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-left text-xs uppercase tracking-wider text-white/50">
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 text-center font-semibold">Bought</th>
                  <th className="px-4 py-3 text-center font-semibold">Sold</th>
                  <th className="px-4 py-3 text-center font-semibold">Available</th>
                </tr>
              </thead>
              <tbody>
                {stock.map((r) => (
                  <tr key={r.product.slug} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3">
                      <ProductCell product={r.product} />
                    </td>
                    <td className="px-4 py-3 text-center tabular-nums text-white/80">{r.bought}</td>
                    <td className="px-4 py-3 text-center">
                      {r.sold > 0 ? (
                        <button
                          type="button"
                          onClick={() => setSoldSheet(r.product.slug)}
                          className="tabular-nums font-semibold text-[#2ed3e8] underline-offset-2 transition hover:underline"
                          title="View sales"
                        >
                          {r.sold}
                        </button>
                      ) : (
                        <span className="tabular-nums text-white/40">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StockBadge n={r.available} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sold-history sheet */}
          <Sheet open={!!soldSheet} onOpenChange={(o) => !o && setSoldSheet(null)}>
            <SheetContent
              side="right"
              className="flex w-[92vw] max-w-md flex-col border-white/10 text-white"
              style={{ backgroundColor: "#04263b" }}
            >
              <SheetHeader>
                <SheetTitle className="text-left text-white">Sales history</SheetTitle>
              </SheetHeader>
              {soldProduct && (
                <div className="flex min-h-0 flex-1 flex-col px-4 pb-6">
                  <div className="border-b border-white/10 pb-4">
                    <ProductCell product={soldProduct} />
                    <p className="mt-3 text-sm text-white/60">
                      {soldTxs.length} {soldTxs.length === 1 ? "sale" : "sales"} · {soldUnits} units
                      · <span className="font-semibold text-[#35d191]">{formatTHB(soldValue)}</span>
                    </p>
                  </div>
                  <ul className="mt-4 flex-1 space-y-2 overflow-y-auto">
                    {soldTxs.map((t) => (
                      <li
                        key={t.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white">
                            {format(parseISO(t.date), "d MMM yyyy")}
                          </p>
                          <p className="text-xs text-white/50">
                            {t.qty} × {formatTHB(t.unit)} ·{" "}
                            {t.channel === "online" ? "Online" : "Walk-in"}
                          </p>
                        </div>
                        <span className="shrink-0 text-sm font-semibold tabular-nums text-[#35d191]">
                          +{formatTHB(t.qty * t.unit)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </>
      )}

      {/* ---------------- Report ---------------- */}
      {section === "report" && (
        <>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <SectionHead title="Sales &amp; purchases report" desc="Filter by product, brand, type and date — this is the accountant export." />
            <div className="text-right text-sm">
              <span className="text-[#35d191]">In {formatTHB(filteredTotals.inn)}</span>
              <span className="mx-2 text-white/30">·</span>
              <span className="text-white/70">Out {formatTHB(filteredTotals.out)}</span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <div className="flex min-w-[200px] flex-1 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2">
              <Search className="size-4 text-white/40" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search product or brand…"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              />
            </div>
            <EntitySearch<string>
              items={[...BRANDS]}
              value={brand === "all" ? null : brand}
              onChange={(b) => setBrand(b ?? "all")}
              getKey={(b) => b}
              getLabel={(b) => b}
              placeholder="All brands"
              className="w-44"
            />
            <EntitySearch<TypeOption>
              items={TYPE_OPTIONS}
              value={type === "all" ? null : (TYPE_OPTIONS.find((o) => o.id === type) ?? null)}
              onChange={(o) => setType(o?.id ?? "all")}
              getKey={(o) => o.id}
              getLabel={(o) => o.label}
              placeholder="All types"
              className="w-40"
            />
            <DateField label="" value={from} onChange={setFrom} compact />
            <DateField label="" value={to} onChange={setTo} compact />
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-left text-xs uppercase tracking-wider text-white/50">
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 text-center font-semibold">Qty</th>
                  <th className="px-4 py-3 text-right font-semibold">Unit</th>
                  <th className="px-4 py-3 text-right font-semibold">Amount</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-white/50">
                      No transactions match these filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((t) => {
                    const p = productBySlug(t.slug)!;
                    const isSale = t.type === "sale";
                    return (
                      <tr key={t.id} className="border-b border-white/5 last:border-0">
                        <td className="whitespace-nowrap px-4 py-3 text-white/70">
                          {format(parseISO(t.date), "d MMM yyyy")}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider",
                              isSale ? "bg-[#35d191]/15 text-[#35d191]" : "bg-white/10 text-white/70",
                            )}
                          >
                            {isSale ? (t.channel === "online" ? "Sale · online" : "Sale · walk-in") : "Purchase"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <ProductCell product={p} />
                        </td>
                        <td className="px-4 py-3 text-center tabular-nums text-white/80">{t.qty}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-white/70">{formatTHB(t.unit)}</td>
                        <td className={cn("px-4 py-3 text-right font-semibold tabular-nums", isSale ? "text-[#35d191]" : "text-white/70")}>
                          {isSale ? "+" : "−"}
                          {formatTHB(t.qty * t.unit)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            aria-label="Delete"
                            onClick={() => removeTx(t.id)}
                            className="text-white/35 transition hover:text-[#ff5d73]"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs font-light text-white/40">
            Demo only — data is saved in your browser. In the real dashboard this exports to PDF /
            spreadsheet for your accountant, with a VAT summary.
          </p>
        </>
      )}
    </div>
  );
}

// ---- small pieces ----

function SectionHead({
  title,
  desc,
  action,
}: {
  title: string;
  desc?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
        {desc && <p className="mt-1 text-sm font-light text-white/55">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "cyan" | "green" | "reef";
}) {
  const color = tone === "green" ? "#35d191" : tone === "reef" ? "#7fb2c9" : CYAN;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-2" style={{ color }}>
        {icon}
      </div>
      <p className="mt-3 text-xl font-bold tracking-tight tabular-nums" style={{ color }}>
        {value}
      </p>
      <p className="mt-0.5 text-xs font-medium text-white/55">{label}</p>
    </div>
  );
}

function ProductCell({ product }: { product: Product }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="relative size-9 shrink-0 overflow-hidden rounded-lg bg-white">
        <Image src={product.image} alt="" fill sizes="36px" className="object-contain p-1" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white">{product.name}</p>
        <p className="truncate text-xs text-white/45">{product.brand}</p>
      </div>
    </div>
  );
}

function StockBadge({ n }: { n: number }) {
  const tone =
    n <= 5
      ? "bg-[#ff5d73]/15 text-[#ff8a99]"
      : n <= 15
        ? "bg-[#eab259]/15 text-[#eab259]"
        : "bg-[#35d191]/15 text-[#35d191]";
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold tabular-nums", tone)}>{n}</span>
  );
}

function NumField({
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-white/60">{label}</span>
      <input
        type="number"
        min={0}
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-xl border bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#2ed3e8]",
          error ? "border-[#ff5d73]" : "border-white/15",
        )}
      />
      {error && <span className="mt-1 block text-xs text-[#ff8a99]">{error}</span>}
    </label>
  );
}

function DateField({
  label,
  value,
  onChange,
  compact,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  compact?: boolean;
}) {
  return (
    <label className={compact ? "" : "block"}>
      {label && <span className="mb-1.5 block text-xs font-medium text-white/60">{label}</span>}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-[#2ed3e8] [color-scheme:dark]"
      />
    </label>
  );
}


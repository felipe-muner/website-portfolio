"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import {
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  LayoutDashboard,
  LogOut,
  PackagePlus,
  RotateCcw,
  Search,
  Settings,
  ShoppingCart,
  Trash2,
  TrendingUp,
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
import { cn } from "@/lib/utils";

const CYAN = "#2ed3e8";
const today = () => format(new Date(), "yyyy-MM-dd");

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
  const [tab, setTab] = useState<"overview" | "settings">("overview");
  return (
    <main className="pt-16">
      <div className="mx-auto max-w-6xl px-5 py-8 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="inline-flex rounded-full border border-white/15 p-0.5">
            <TabBtn active={tab === "overview"} onClick={() => setTab("overview")} icon={<LayoutDashboard className="size-4" />}>
              Overview
            </TabBtn>
            <TabBtn active={tab === "settings"} onClick={() => setTab("settings")} icon={<Settings className="size-4" />}>
              Settings
            </TabBtn>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-[0.6rem] uppercase tracking-wider text-white/40">Signed in</p>
              <p className="text-sm font-semibold text-white">{session?.email}</p>
            </div>
            <span
              className="grid size-9 place-items-center rounded-full text-sm font-bold text-[#04263b]"
              style={{ backgroundColor: CYAN }}
            >
              {session?.name.charAt(0)}
            </span>
            <button
              type="button"
              aria-label="Sign out"
              onClick={signOut}
              className="grid size-9 place-items-center rounded-full border border-white/15 text-white/60 transition hover:border-[#ff5d73] hover:text-[#ff8a99]"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
        {tab === "overview" ? <Overview /> : <DashboardSettings />}
      </div>
    </main>
  );
}

function TabBtn({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
        active ? "bg-[#2ed3e8] text-[#04263b]" : "text-white/70 hover:text-white",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function Overview() {
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
    addTx({
      type: "sale",
      slug: sProduct.slug,
      qty: Number(sQty),
      unit: Number(sPrice),
      channel: sChannel,
      date: sDate,
    });
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
    <div className="pt-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2ed3e8]">
              Owner dashboard · demo
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Cash flow, stock &amp; sales
            </h1>
            <p className="mt-1 text-sm font-light text-white/60">
              Buy stock from suppliers, record sales (walk-in or online), and watch the numbers — a
              preview of the Phase 2 owner area.
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/70 transition hover:border-white hover:text-white"
          >
            <RotateCcw className="size-4" /> Reset demo data
          </button>
        </div>

        {/* Stat tiles */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile icon={<Boxes className="size-5" />} label="Units in stock" value={String(totals.unitsInStock)} tone="cyan" />
          <StatTile icon={<ArrowDownRight className="size-5" />} label="Money in (sales)" value={formatTHB(totals.moneyIn)} tone="green" />
          <StatTile icon={<ArrowUpRight className="size-5" />} label="Money out (stock)" value={formatTHB(totals.moneyOut)} tone="reef" />
          <StatTile icon={<TrendingUp className="size-5" />} label="Profit (in − out)" value={formatTHB(totals.profit)} tone="cyan" />
        </div>

        {/* Entry forms */}
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
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

        {/* Stock */}
        <section className="mt-10">
          <h2 className="text-xl font-bold tracking-tight">Live stock</h2>
          <p className="mt-1 text-sm font-light text-white/55">
            Every purchase adds units; every sale removes one. Buy 100, sell one by one.
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
                    <td className="px-4 py-3 text-center tabular-nums text-white/80">{r.sold}</td>
                    <td className="px-4 py-3 text-center">
                      <StockBadge n={r.available} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Report */}
        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Sales &amp; purchases report</h2>
              <p className="mt-1 text-sm font-light text-white/55">
                Filter by product, brand, type and date — this is the accountant export.
              </p>
            </div>
            <div className="text-right text-sm">
              <span className="text-[#35d191]">In {formatTHB(filteredTotals.inn)}</span>
              <span className="mx-2 text-white/30">·</span>
              <span className="text-white/70">Out {formatTHB(filteredTotals.out)}</span>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="flex min-w-[200px] flex-1 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2">
              <Search className="size-4 text-white/40" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search product or brand…"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              />
            </div>
            <Select value={brand} onChange={setBrand} options={[["all", "All brands"], ...BRANDS.map((b) => [b, b] as [string, string])]} />
            <Select
              value={type}
              onChange={(v) => setType(v as TxType | "all")}
              options={[["all", "All types"], ["sale", "Sales"], ["purchase", "Purchases"]]}
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
        </section>
    </div>
  );
}

// ---- small pieces ----

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
      <div className="flex items-center gap-2 text-white/55" style={{ color }}>
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
    <div className="flex items-center gap-3">
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

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-white/15 bg-[#04263b] px-3 py-2.5 text-sm text-white/85 outline-none focus:border-[#2ed3e8]"
    >
      {options.map(([v, l]) => (
        <option key={v} value={v}>
          {l}
        </option>
      ))}
    </select>
  );
}

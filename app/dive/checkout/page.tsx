"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronLeft } from "lucide-react";
import { formatTHB } from "@/lib/layouts/dive/catalog";
import { useCart } from "@/lib/layouts/dive/cart";

const CYAN = "#2ed3e8";

type Fulfilment = "delivery" | "pickup";

interface FormState {
  name: string;
  email: string;
  phone: string;
  fulfilment: Fulfilment;
  address: string;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  phone: "",
  fulfilment: "delivery",
  address: "",
};

export default function CheckoutPage() {
  const { lines, totals, clear, hydrated } = useCart();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [orderRef, setOrderRef] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Please tell us your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email";
    if (!form.phone.trim()) next.phone = "Enter a contact number";
    if (form.fulfilment === "delivery" && !form.address.trim())
      next.address = "Enter a delivery address";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const ref = `DB-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    setOrderRef(ref);
    clear();
  }

  // Order placed — confirmation screen.
  if (orderRef) {
    return (
      <main className="pt-16">
        <div className="mx-auto grid max-w-2xl place-items-center px-5 py-24 text-center">
          <CheckCircle2 className="size-16" style={{ color: CYAN }} />
          <h1 className="mt-6 text-3xl font-bold tracking-tight">Order confirmed</h1>
          <p className="mt-3 max-w-md font-light text-white/70">
            Thanks{form.name ? `, ${form.name.split(" ")[0]}` : ""}! Your gear order{" "}
            <span className="font-semibold text-white">{orderRef}</span> is in. We&rsquo;ll email a
            confirmation and let you know the moment it&rsquo;s ready.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/dive/shop"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-[#04263b]"
              style={{ backgroundColor: CYAN }}
            >
              Keep shopping <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/dive"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold transition hover:border-white"
            >
              Back to Aqua Sport Supply
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!hydrated) {
    return <main className="min-h-[60vh] pt-16" />;
  }

  if (lines.length === 0) {
    return (
      <main className="pt-16">
        <div className="mx-auto grid max-w-2xl place-items-center px-5 py-24 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Nothing to check out</h1>
          <p className="mt-2 font-light text-white/60">Your cart is empty.</p>
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

  return (
    <main className="pt-16">
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-10">
        <Link
          href="/dive/cart"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/60 transition hover:text-white"
        >
          <ChevronLeft className="size-4" /> Back to cart
        </Link>
        <h1 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl">Checkout</h1>

        <form onSubmit={placeOrder} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Details */}
          <div className="space-y-6">
            <fieldset className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <legend className="px-2 text-sm font-bold uppercase tracking-wider text-white/60">
                Your details
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Full name"
                  value={form.name}
                  onChange={(v) => update("name", v)}
                  error={errors.name}
                  className="sm:col-span-2"
                />
                <Field
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(v) => update("email", v)}
                  error={errors.email}
                />
                <Field
                  label="Phone / WhatsApp"
                  value={form.phone}
                  onChange={(v) => update("phone", v)}
                  error={errors.phone}
                />
              </div>
            </fieldset>

            <fieldset className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <legend className="px-2 text-sm font-bold uppercase tracking-wider text-white/60">
                Fulfilment
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <FulfilmentOption
                  active={form.fulfilment === "delivery"}
                  onClick={() => update("fulfilment", "delivery")}
                  title="Island delivery"
                  note="To your resort or address"
                />
                <FulfilmentOption
                  active={form.fulfilment === "pickup"}
                  onClick={() => update("fulfilment", "pickup")}
                  title="Pick up at the centre"
                  note="Collect at Aqua Sport Supply"
                />
              </div>
              {form.fulfilment === "delivery" && (
                <div className="mt-4">
                  <Field
                    label="Delivery address"
                    value={form.address}
                    onChange={(v) => update("address", v)}
                    error={errors.address}
                  />
                </div>
              )}
            </fieldset>

            <p className="text-xs font-light text-white/45">
              This is a fictional demo store — no payment is taken and no order is placed.
            </p>
          </div>

          {/* Summary */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-base font-bold">Order summary</h2>
              <ul className="mt-4 space-y-3">
                {lines.map((l) => (
                  <li key={l.slug} className="flex items-start justify-between gap-3 text-sm">
                    <span className="font-light text-white/75">
                      <span className="font-semibold text-white">{l.qty}×</span> {l.product.brand}{" "}
                      {l.product.name}
                    </span>
                    <span className="shrink-0 font-semibold">{formatTHB(l.lineTotal)}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 space-y-2.5 border-t border-white/10 pt-4 text-sm">
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

              <button
                type="submit"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-[#04263b] transition-shadow hover:shadow-[0_0_24px_rgba(46,211,232,0.5)]"
                style={{ backgroundColor: CYAN }}
              >
                Place order <ArrowRight className="size-4" />
              </button>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-sm font-medium text-white/75">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#2ed3e8] ${
          error ? "border-[#ff5d73]" : "border-white/15"
        }`}
      />
      {error && <span className="mt-1 block text-xs text-[#ff8a99]">{error}</span>}
    </label>
  );
}

function FulfilmentOption({
  active,
  onClick,
  title,
  note,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  note: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition ${
        active ? "border-[#2ed3e8] bg-[#2ed3e8]/10" : "border-white/15 hover:border-white/40"
      }`}
    >
      <span className="block text-sm font-bold">{title}</span>
      <span className="mt-0.5 block text-xs font-light text-white/60">{note}</span>
    </button>
  );
}

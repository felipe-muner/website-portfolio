"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { GYM_PLANS, type LandingPlan } from "@/lib/layouts/content";
import { choosePlan } from "./events";

/* Explicit locale: this renders on the server and in the browser alike. */
const amount = (n: number) => Math.round(n).toLocaleString("en-US");

const MONTHLY = GYM_PLANS.find((p) => p.unit === "month")?.price ?? 0;

/** What a plan really costs: per visit for passes, per month (and the saving) for terms. */
function breakdown(plan: LandingPlan): string {
  const visits = /^(\d+)?\s*visits?$/.exec(plan.unit);
  if (visits) {
    const n = Number(visits[1] ?? 1);
    return n > 1 ? `฿${amount(plan.price / n)} per visit` : "Pay as you go";
  }
  const term = /^(\d+)?\s*(months?|year)$/.exec(plan.unit);
  if (term) {
    const months = Number(term[1] ?? 1) * (term[2] === "year" ? 12 : 1);
    if (months === 1) return "Rolling monthly";
    const perMonth = plan.price / months;
    const saving = MONTHLY ? Math.round((1 - perMonth / MONTHLY) * 100) : 0;
    return saving > 0 ? `฿${amount(perMonth)} a month · save ${saving}%` : `฿${amount(perMonth)} a month`;
  }
  return "";
}

/* Each plan gets a competition bumper plate — the bigger the commitment, the heavier the colour. */
interface PlateStyle {
  color: string;
  rim: string;
  ink: string;
  code: string;
}
const PLATES: Record<string, PlateStyle> = {
  "Gym Drop-in": { color: "#ece9e1", rim: "#bdb9ae", ink: "#151515", code: "DROP" },
  "Gym 5-Pass": { color: "#2b8a3e", rim: "#1d6630", ink: "#ffffff", code: "5×" },
  "Gym 1 Month": { color: "#f5c518", rim: "#c39c0b", ink: "#151515", code: "1M" },
  "Gym 3 Months": { color: "#1d5fd6", rim: "#1446a3", ink: "#ffffff", code: "3M" },
  "Gym 6 Months": { color: "#d6332b", rim: "#a1231d", ink: "#ffffff", code: "6M" },
  "Gym 12 Months": { color: "#1c1c1b", rim: "#050505", ink: "#f5c518", code: "12M" },
};
const DEFAULT_PLATE: PlateStyle = { color: "#2a2a28", rim: "#111", ink: "#f5c518", code: "GYM" };

function Plate({ style }: { style: PlateStyle }) {
  return (
    <span
      aria-hidden
      className="relative grid size-[5.5rem] shrink-0 place-items-center rounded-full shadow-[0_14px_30px_-12px_rgba(0,0,0,0.9)]"
      style={{
        background: `radial-gradient(circle, #0b0b0a 0 9%, #c7c7c4 9.5% 15%, #8b8b88 15.5% 17%, ${style.color} 17.5% 85%, ${style.rim} 85.5% 100%)`,
      }}
    >
      <span className="font-stencil absolute top-[19%] text-[13px] font-extrabold tracking-[0.05em]" style={{ color: style.ink }}>
        {style.code}
      </span>
      <span
        className="font-stencil absolute bottom-[20%] text-[8px] font-bold tracking-[0.3em] opacity-70"
        style={{ color: style.ink }}
      >
        CHALK
      </span>
    </span>
  );
}

const TABS = [
  { key: "flexible", label: "Flexible", hint: "Drop in, or grab a pass.", plans: GYM_PLANS.slice(0, 3) },
  { key: "committed", label: "Committed", hint: "Lock in a lower monthly rate.", plans: GYM_PLANS.slice(3) },
] as const;

/**
 * Gym 6 · Chalk — membership as bumper plates: flexible passes vs committed
 * terms, each showing what it really works out to. Choosing a plan
 * preselects it in the booking form.
 */
export function Membership() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("flexible");
  const current = TABS.find((t) => t.key === tab) ?? TABS[0];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="inline-flex rounded-sm border border-white/10 bg-[#121211] p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              aria-pressed={tab === t.key}
              className={`font-display rounded-[2px] px-5 py-1.5 text-lg uppercase tracking-[0.04em] transition-colors ${
                tab === t.key ? "bg-[#f5c518] text-black" : "text-white/60 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-white/45">{current.hint}</p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {current.plans.map((plan) => {
          const badge = plan.featured ? "Most popular" : plan.note === "Best value" ? "Best value" : null;
          const note = plan.note && plan.note !== badge ? plan.note : "No contracts";
          return (
            <article
              key={plan.name}
              className={`relative flex flex-col overflow-hidden rounded-md border p-6 transition-colors ${
                badge ? "border-[#f5c518] bg-[#15140f]" : "border-white/10 bg-[#121211] hover:border-white/25"
              }`}
            >
              {badge && (
                <span className="absolute right-0 top-0 bg-[#f5c518] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-black">
                  {badge}
                </span>
              )}
              <div className="flex items-center gap-4">
                <Plate style={PLATES[plan.name] ?? DEFAULT_PLATE} />
                <div>
                  <h3 className="font-display text-[1.7rem] uppercase leading-none">{plan.name.replace(/^Gym /, "")}</h3>
                  <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">{note}</p>
                </div>
              </div>
              <p className="mt-8 flex items-start leading-none">
                <span className="mr-1 mt-1.5 text-2xl text-white/60">฿</span>
                <span className="font-stencil text-6xl font-extrabold">{amount(plan.price)}</span>
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">per {plan.unit}</p>
              <p className="mt-6 border-t border-white/10 pt-4 text-[15px] text-white/80">{breakdown(plan)}</p>
              <a
                href="#book"
                onClick={() => choosePlan(plan.name)}
                className={`font-display group mt-6 inline-flex h-12 items-center justify-between rounded-sm px-5 text-lg uppercase tracking-[0.05em] transition-colors ${
                  badge ? "bg-[#f5c518] text-black hover:bg-white" : "border border-white/15 text-white hover:border-[#f5c518] hover:text-[#f5c518]"
                }`}
              >
                Choose this plan
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </a>
            </article>
          );
        })}
      </div>
    </div>
  );
}

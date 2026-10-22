"use client";

import { ArrowRight } from "lucide-react";
import { SOUL_PORTRAIT_TIERS } from "@/lib/layouts/meads";
import { startCommission, type CommissionStart } from "./events";

/** A link to the commission form that also preselects it on the way. */
export function CommissionLink({
  start,
  className,
  children,
}: {
  start: CommissionStart;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href="#commission" onClick={() => startCommission(start)} className={className}>
      {children}
    </a>
  );
}

/* Explicit locale: this renders on the server and in the browser alike. */
const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

/** Soul-portrait sizes as three canvases on a wall; each one starts the form. */
export function Tiers() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {SOUL_PORTRAIT_TIERS.map((tier) => (
        <article
          key={tier.name}
          className={`relative flex flex-col rounded-2xl border p-6 transition-transform duration-500 hover:-translate-y-1 ${
            tier.featured ? "border-[#e9b44c]/60 bg-[#e9b44c]/[0.06]" : "border-white/10 bg-[#1a131e]"
          }`}
        >
          {tier.featured && (
            <span className="absolute -top-3 left-6 rounded-full bg-[#e9b44c] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#120d14]">
              Most commissioned
            </span>
          )}
          <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/50">{tier.name}</p>
          <p className="font-display mt-3 text-4xl leading-none">{tier.size}</p>
          <p className="mt-5 text-[15px] leading-relaxed text-white/65">{tier.note}</p>
          <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-5 font-mono text-[10.5px] uppercase tracking-[0.16em]">
            <div>
              <dt className="text-white/40">From</dt>
              <dd className="mt-1 text-lg tracking-normal text-[#f3ead9]">{usd(tier.from)}</dd>
            </div>
            <div>
              <dt className="text-white/40">Takes</dt>
              <dd className="mt-1 text-lg tracking-normal text-[#f3ead9]">{tier.weeks}</dd>
            </div>
          </dl>
          <CommissionLink
            start={{ type: "Soul portrait", size: `${tier.name} · ${tier.size}` }}
            className={`mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors ${
              tier.featured ? "bg-[#e9b44c] text-[#120d14] hover:bg-[#f3ead9]" : "border border-white/15 text-white/85 hover:border-[#e9b44c] hover:text-[#e9b44c]"
            }`}
          >
            Begin a {tier.name.toLowerCase()} portrait <ArrowRight className="size-4" />
          </CommissionLink>
        </article>
      ))}
    </div>
  );
}

"use client";

import { ArrowRight } from "lucide-react";
import { PASSES, type Pass } from "@/lib/layouts/stillwater";
import { choosePass } from "./events";

/* Explicit locale: this renders on the server and in the browser alike. */
const baht = (n: number) => `฿${n.toLocaleString("en-US")}`;

/* Each pass is a river stone — bigger for a bigger commitment. */
const STONES = [
  { radius: "48% 52% 42% 58% / 58% 54% 46% 42%", tone: "#262d31", grain: "#3a4247", size: "lg:w-[16rem] lg:h-[13rem]" },
  { radius: "54% 46% 50% 50% / 52% 60% 40% 48%", tone: "#33373a", grain: "#4a4f52", size: "lg:w-[17.5rem] lg:h-[14rem]" },
  { radius: "46% 54% 56% 44% / 56% 48% 52% 44%", tone: "#2a3540", grain: "#3d4a57", size: "lg:w-[19rem] lg:h-[15rem]" },
  { radius: "52% 48% 46% 54% / 60% 52% 48% 40%", tone: "#e3c495", grain: "#f3dcb7", size: "lg:w-[21rem] lg:h-[16.5rem]" },
] as const;

function Pebble({ pass, index }: { pass: Pass; index: number }) {
  const stone = STONES[pass.size];
  const light = pass.featured;
  return (
    <article
      className={`group relative flex aspect-[1.3] w-full max-w-[22rem] flex-col items-center justify-center px-8 text-center transition-transform duration-700 ease-out hover:-translate-y-1.5 sm:max-w-none lg:aspect-auto ${stone.size} ${
        index % 2 ? "hover:rotate-[1.5deg]" : "hover:-rotate-[1.5deg]"
      }`}
      style={{
        borderRadius: stone.radius,
        background: `radial-gradient(120% 90% at 30% 22%, ${stone.grain}, ${stone.tone} 58%), ${stone.tone}`,
        boxShadow: light
          ? "inset -10px -18px 40px rgba(120,80,30,0.35), inset 10px 14px 30px rgba(255,255,255,0.35), 0 30px 60px -28px rgba(242,180,109,0.55)"
          : "inset -10px -18px 40px rgba(0,0,0,0.45), inset 10px 14px 30px rgba(255,255,255,0.06), 0 30px 60px -30px rgba(0,0,0,0.9)",
        color: light ? "#1d1610" : "#ece4d6",
      }}
    >
      {light && (
        <span className="absolute -top-3 rounded-full bg-[#0a1014] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f2b46d]">
          Most loved
        </span>
      )}
      <h3 className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${light ? "text-[#1d1610]/65" : "text-[#ece4d6]/55"}`}>
        {pass.name}
      </h3>
      <p className="font-display mt-2 text-[3.2rem] font-light leading-none lining-nums">{baht(pass.price)}</p>
      <p className={`mt-1 text-sm ${light ? "text-[#1d1610]/60" : "text-[#ece4d6]/50"}`}>{pass.unit}</p>
      <p className={`mt-2.5 max-w-[15rem] text-[13px] leading-snug ${light ? "text-[#1d1610]/75" : "text-[#ece4d6]/65"}`}>
        {pass.note}
      </p>
      <a
        href="#book"
        onClick={() => choosePass(pass.name)}
        className={`mt-4 inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition-colors ${
          light
            ? "bg-[#1d1610] text-[#f3dcb7] hover:bg-[#0a1014]"
            : "border border-[#ece4d6]/20 text-[#ece4d6]/85 hover:border-[#f2b46d] hover:text-[#f2b46d]"
        }`}
      >
        Choose <ArrowRight className="size-3.5" />
      </a>
    </article>
  );
}

/**
 * Yoga 6 · Stillwater — the passes as river stones laid along the water
 * line, from the drop-in pebble to the big unlimited stone. Choosing one
 * preselects it in the booking form.
 */
export function Passes() {
  return (
    <div className="grid justify-items-center gap-6 sm:grid-cols-2 lg:flex lg:items-end lg:justify-center lg:gap-5">
      {PASSES.map((pass, i) => (
        <Pebble key={pass.name} pass={pass} index={i} />
      ))}
    </div>
  );
}

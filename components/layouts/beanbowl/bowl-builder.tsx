"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { Check, Plus, RotateCcw } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useWebglStage } from "@/components/layouts/use-webgl-stage";
import { BOWL_BASES, TOPPINGS, type BaseKey, type ToppingKey } from "@/lib/layouts/beanbowl";

/* WebGL is client-only and heavy — keep it off the SSR path. */
const BowlScene = dynamic(() => import("./bowl-scene"), { ssr: false, loading: () => null });

const HOUSE: ReadonlySet<ToppingKey> = new Set(TOPPINGS.filter((t) => t.standard).map((t) => t.key));

const STEP = "font-hand text-[1.6rem] leading-none text-[#b5562b]";

/**
 * Bean & Bowl — build your own smoothie bowl. Pick a base and toppings; the
 * 3D bowl rebuilds live and the total adds up. "Add to order" is a demo.
 */
export function BowlBuilder() {
  const { ref: stageRef, inView, reduced, webgl } = useWebglStage();
  // The bowl builds itself once it's properly on screen, not at the first pixel.
  const { ref: startRef, inView: start } = useInView({ threshold: 0.45, triggerOnce: true });
  const setStage = useCallback(
    (node: HTMLDivElement | null) => {
      stageRef(node);
      startRef(node);
    },
    [stageRef, startRef],
  );

  const [base, setBase] = useState<BaseKey>("acai");
  const [picked, setPicked] = useState<ReadonlySet<ToppingKey>>(HOUSE);
  const [ordered, setOrdered] = useState(false);

  const chosenBase = BOWL_BASES.find((b) => b.key === base) ?? BOWL_BASES[0];
  const chosenToppings = TOPPINGS.filter((t) => picked.has(t.key));
  const total = chosenBase.price + chosenToppings.reduce((sum, t) => sum + t.price, 0);

  const toggle = (key: ToppingKey) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    setOrdered(false);
  };

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_27rem] lg:gap-14">
      <div ref={setStage} className="relative mx-auto aspect-square w-full max-w-[640px]">
        <div aria-hidden className="absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.75),transparent)]" />
        {webgl && (
          <div aria-hidden className="absolute inset-0">
            <BowlScene active={inView} start={start} reduced={reduced} base={chosenBase.color} toppings={picked} />
          </div>
        )}
        <div className="absolute right-[6%] top-[8%] rotate-6 rounded-full bg-[#2a1a10] px-5 py-3 text-center text-[#f5ecdf] shadow-[0_14px_30px_-12px_rgba(42,26,16,0.6)]">
          <span className="block text-[11px] uppercase tracking-[0.18em] text-[#f5ecdf]/60">Your bowl</span>
          <span className="font-display text-3xl leading-none">฿{total}</span>
        </div>
      </div>

      <div className="rounded-[28px] border border-[#2a1a10]/10 bg-white/70 p-6 shadow-[0_30px_60px_-40px_rgba(42,26,16,0.5)] backdrop-blur sm:p-8">
        <p className={STEP}>1 · pick a base</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {BOWL_BASES.map((b) => {
            const active = b.key === base;
            return (
              <button
                key={b.key}
                type="button"
                onClick={() => {
                  setBase(b.key);
                  setOrdered(false);
                }}
                aria-pressed={active}
                className={`flex flex-col items-center gap-2 rounded-2xl border px-2 py-3 transition-colors ${
                  active ? "border-[#2a1a10] bg-[#2a1a10] text-[#f5ecdf]" : "border-[#2a1a10]/15 hover:border-[#2a1a10]/40"
                }`}
              >
                <span
                  className="size-9 rounded-full shadow-[inset_0_-4px_8px_rgba(0,0,0,0.25)]"
                  style={{ backgroundColor: b.color }}
                />
                <span className="text-[15px] font-semibold leading-none">{b.name}</span>
                <span className={`text-xs ${active ? "text-[#f5ecdf]/60" : "text-[#2a1a10]/50"}`}>฿{b.price}</span>
              </button>
            );
          })}
        </div>

        <p className={`${STEP} mt-8`}>2 · top it</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {TOPPINGS.map((t) => {
            const on = picked.has(t.key);
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => toggle(t.key)}
                aria-pressed={on}
                className={`flex items-center gap-2.5 rounded-full border py-1.5 pl-1.5 pr-3 text-left text-sm transition-colors ${
                  on ? "border-[#2a1a10] bg-[#2a1a10] text-[#f5ecdf]" : "border-[#2a1a10]/15 text-[#2a1a10] hover:border-[#2a1a10]/40"
                }`}
              >
                <span
                  className="grid size-7 shrink-0 place-items-center rounded-full ring-1 ring-black/10"
                  style={{ backgroundColor: t.swatch }}
                >
                  {on ? <Check className="size-3.5 text-white mix-blend-difference" /> : <Plus className="size-3.5 text-black/50" />}
                </span>
                <span className="flex-1 truncate font-medium">{t.name}</span>
                <span className={`text-xs ${on ? "text-[#f5ecdf]/60" : "text-[#2a1a10]/45"}`}>+{t.price}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 border-t border-dashed border-[#2a1a10]/20 pt-5">
          <p className="text-sm leading-relaxed text-[#2a1a10]/65">
            {chosenBase.name} base
            {chosenToppings.length > 0 ? ` with ${chosenToppings.map((t) => t.name.toLowerCase()).join(", ")}.` : ", nothing on top (yet)."}
          </p>
          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.18em] text-[#2a1a10]/50">Total</span>
              <p className="font-display text-5xl leading-none">฿{total}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setPicked(HOUSE);
                setBase("acai");
                setOrdered(false);
              }}
              className="inline-flex items-center gap-1.5 text-sm text-[#2a1a10]/55 underline-offset-4 hover:text-[#2a1a10] hover:underline"
            >
              <RotateCcw className="size-3.5" /> House bowl
            </button>
          </div>
          <button
            type="button"
            onClick={() => setOrdered(true)}
            className="mt-6 h-[52px] w-full rounded-full bg-[#2a1a10] text-[16px] font-semibold text-[#f5ecdf] transition-colors hover:bg-[#b5562b]"
          >
            {ordered ? "Added to your order ✓" : "Add to order"}
          </button>
          <p className="mt-3 text-center text-xs text-[#2a1a10]/45">
            {ordered
              ? "We'll call your name at the counter. Demo — nothing is sent."
              : "Demo — in the real site this goes straight to the kitchen."}
          </p>
        </div>
      </div>
    </div>
  );
}

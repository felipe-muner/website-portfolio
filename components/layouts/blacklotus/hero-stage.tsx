"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { MoveHorizontal } from "lucide-react";
import { useWebglStage } from "@/components/layouts/use-webgl-stage";
import { baht, FLASH, FLASH_SIZES, flashById, sizeOption, type FlashSize } from "./flash";
import { FlashArt } from "./flash-art";
import { useTryOn } from "./events";
import { BookFlashLink } from "./links";

/* WebGL is client-only and heavy — keep it off the SSR path. */
const ArmScene = dynamic(() => import("./arm-scene"), { ssr: false, loading: () => null });

/**
 * Black Lotus — the hero stage: a forearm wearing the flash you pick, in the
 * size you pick. Drag to turn it; the sheet further down can send a design
 * up here too. Renders only while on screen; no idle motion if reduced.
 */
export function HeroStage() {
  const { ref, inView, reduced, webgl } = useWebglStage();
  const [designId, setDesignId] = useState(FLASH[0].id);
  const [size, setSize] = useState<FlashSize>("medium");
  const [turned, setTurned] = useState(false);
  const design = flashById(designId);
  const opt = sizeOption(size);

  useTryOn(useCallback((id: string) => setDesignId(id), []));
  const onTurn = useCallback(() => setTurned(true), []);

  return (
    <div id="arm" className="flex scroll-mt-28 flex-col gap-5">
      <div
        ref={ref}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.6rem] bg-[#0b0a09] ring-1 ring-white/[0.08] sm:aspect-square lg:aspect-auto lg:min-h-[600px] lg:flex-1"
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(60%_55%_at_38%_30%,rgba(120,150,200,0.22),transparent_70%),radial-gradient(45%_50%_at_82%_82%,rgba(255,120,70,0.16),transparent_70%)]"
        />
        {webgl ? (
          <ArmScene design={design} size={opt.scale} active={inView} reduced={reduced} onTurn={onTurn} />
        ) : (
          <div className="absolute inset-0 grid place-items-center p-10">
            <FlashArt design={design} className="w-full max-w-[18rem] text-[#efe7d8]" title={`${design.name} flash design`} />
          </div>
        )}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0b0a09] to-transparent" />
        <p className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/75 backdrop-blur-sm">
          <MoveHorizontal className="size-3.5" />
          {turned ? `${design.name} · ${opt.cm}` : webgl ? "Drag to turn the arm" : "Flash preview"}
        </p>
        <p className="pointer-events-none absolute bottom-4 right-5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
          Inner forearm · {opt.cm}
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ul className="flex flex-wrap items-center gap-2" aria-label="Choose a flash design">
          {FLASH.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => setDesignId(d.id)}
                aria-label={`Try ${d.name} on the arm`}
                aria-pressed={d.id === designId}
                className={`grid size-12 place-items-center rounded-xl border transition-all duration-300 ${
                  d.id === designId
                    ? "border-[#c0262f] bg-[#efe7d8] text-[#14100e] shadow-[0_0_0_3px_rgba(192,38,47,0.28)]"
                    : "border-white/12 bg-white/[0.04] text-[#efe7d8]/80 hover:border-white/30 hover:bg-white/[0.08]"
                }`}
              >
                <FlashArt design={d} className="size-9" />
              </button>
            </li>
          ))}
        </ul>
        <div
          role="group"
          aria-label="Size on the arm"
          className="inline-flex self-start overflow-hidden rounded-full border border-white/12 font-mono text-[11px] uppercase tracking-[0.18em]"
        >
          {FLASH_SIZES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSize(s.id)}
              aria-pressed={s.id === size}
              className={`h-9 px-4 transition-colors ${
                s.id === size ? "bg-[#efe7d8] text-[#14100e]" : "text-white/65 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {s.label}
              <span className="ml-1.5 hidden text-[9px] opacity-60 sm:inline">{s.cm}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-t border-white/10 pt-4">
        <div>
          <p className="font-display text-3xl leading-none text-[#efe7d8]">
            {design.name} <span className="italic text-white/45">{design.thai}</span>
          </p>
          <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/50">
            {design.style} · {design.artist} · about {design.minutes} min
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="font-display text-3xl leading-none text-[#efe7d8]">
            {design.taken ? <span className="text-[#c0262f]">Taken</span> : baht(design.prices[size])}
          </p>
          {!design.taken && (
            <BookFlashLink
              designId={design.id}
              className="inline-flex h-10 items-center rounded-full bg-[#c0262f] px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#efe7d8] hover:text-[#14100e]"
            >
              Book this
            </BookFlashLink>
          )}
        </div>
      </div>
    </div>
  );
}

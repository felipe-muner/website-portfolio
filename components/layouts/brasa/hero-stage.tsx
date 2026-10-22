"use client";

import dynamic from "next/dynamic";
import { useState, type KeyboardEvent } from "react";
import { Flame } from "lucide-react";
import { useWebglStage } from "@/components/layouts/use-webgl-stage";

/* WebGL is client-only and heavy — keep it off the SSR path. */
const FireScene = dynamic(() => import("./fire-scene"), { ssr: false, loading: () => null });

/**
 * Brasa — the hero stage: the fire pit, plus a hold-to-stoke button. Full-bleed
 * behind the copy on wide screens; its own block above it on small ones.
 * Renders the scene only while on screen.
 */
export function HeroStage() {
  const { ref, inView, reduced, webgl } = useWebglStage();
  const [stoking, setStoking] = useState(false);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if ((e.key === " " || e.key === "Enter") && !e.repeat) {
      e.preventDefault();
      setStoking(true);
    }
  };
  const onKeyUp = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") setStoking(false);
  };

  return (
    <div ref={ref} className="relative mt-12 h-[400px] sm:h-[480px] lg:absolute lg:inset-0 lg:mt-0 lg:h-auto">
      {/* Ember haze under the scene — and the whole hero when WebGL is missing. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(50%_55%_at_50%_72%,rgba(242,106,27,0.22),transparent_70%)] lg:bg-[radial-gradient(28%_60%_at_70%_70%,rgba(242,106,27,0.2),transparent_70%)]"
      />
      {webgl && (
        <div aria-hidden className="absolute inset-0">
          <FireScene active={inView} reduced={reduced} stoking={stoking} />
        </div>
      )}
      {webgl && !reduced && (
        <button
          type="button"
          aria-pressed={stoking}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setStoking(true);
          }}
          onPointerUp={() => setStoking(false)}
          onPointerCancel={() => setStoking(false)}
          onLostPointerCapture={() => setStoking(false)}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onBlur={() => setStoking(false)}
          onContextMenu={(e) => e.preventDefault()}
          className={`absolute bottom-4 left-1/2 z-20 inline-flex h-11 -translate-x-1/2 select-none items-center gap-2.5 rounded-full border px-5 font-mono text-[11px] uppercase tracking-[0.2em] backdrop-blur-md transition-colors [touch-action:none] lg:bottom-10 lg:left-auto lg:right-12 lg:translate-x-0 ${
            stoking
              ? "border-[#f26a1b] bg-[#f26a1b] text-[#140d08]"
              : "border-[#f4e9d8]/20 bg-[#0e0c0a]/60 text-[#f4e9d8]/80 hover:border-[#f26a1b] hover:text-[#f4e9d8]"
          }`}
        >
          <Flame className={`size-4 ${stoking ? "" : "text-[#f26a1b]"}`} />
          {stoking ? "Blowing on the coals…" : "Hold to stoke the fire"}
        </button>
      )}
    </div>
  );
}

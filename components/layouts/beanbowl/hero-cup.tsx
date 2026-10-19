"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { RotateCcw } from "lucide-react";
import { useWebglStage } from "@/components/layouts/use-webgl-stage";

/* WebGL is client-only and heavy — keep it off the SSR path. */
const CoffeeScene = dynamic(() => import("./coffee-scene"), { ssr: false, loading: () => null });

/**
 * Bean & Bowl — the hero's cup. Full-bleed behind the copy on wide screens,
 * its own block above it on small ones; "Pour again" replays the beans.
 */
export function HeroCup() {
  const { ref, inView, reduced, webgl } = useWebglStage();
  const [pour, setPour] = useState(0);

  return (
    <div ref={ref} className="relative mt-16 h-[400px] sm:h-[480px] lg:absolute lg:inset-0 lg:mt-0 lg:h-auto">
      {webgl && (
        <div aria-hidden className="absolute inset-0">
          <CoffeeScene active={inView} reduced={reduced} pour={pour} />
        </div>
      )}
      {webgl && !reduced && (
        <button
          type="button"
          onClick={() => setPour((n) => n + 1)}
          className="absolute bottom-5 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#f3e6d3]/20 bg-[#1c120b]/60 px-4 py-2 text-sm text-[#f3e6d3]/80 backdrop-blur transition-colors hover:border-[#f3e6d3]/50 hover:text-[#f3e6d3] lg:bottom-[9%] lg:left-[70%]"
        >
          <RotateCcw className="size-3.5" /> Pour again
        </button>
      )}
    </div>
  );
}

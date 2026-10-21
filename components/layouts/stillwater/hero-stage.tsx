"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { RotateCcw } from "lucide-react";
import { useWebglStage } from "@/components/layouts/use-webgl-stage";

/* WebGL is client-only and heavy — keep it off the SSR path. */
const CairnScene = dynamic(() => import("./cairn-scene"), { ssr: false, loading: () => null });

/**
 * Yoga 6 · Stillwater — the hero's lake and cairn. Full-bleed behind the copy
 * on wide screens, its own block above it on small ones; "Balance again"
 * lifts the stones off and stacks them anew. Renders only while on screen.
 */
export function HeroStage() {
  const { ref, inView, reduced, webgl } = useWebglStage();
  const [restack, setRestack] = useState(0);

  return (
    <div ref={ref} className="relative h-[460px] sm:h-[540px] lg:absolute lg:inset-0 lg:h-auto">
      {webgl && (
        <div aria-hidden className="absolute inset-0">
          <CairnScene active={inView} reduced={reduced} restack={restack} />
        </div>
      )}
      {/* Melt the lake into the page, and keep the copy side calm on wide screens. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,#0a1014_0%,transparent_22%,transparent_70%,#0a1014_100%)] lg:bg-[linear-gradient(to_right,rgba(10,16,20,0.82)_0%,rgba(10,16,20,0.5)_34%,transparent_58%),linear-gradient(to_bottom,rgba(10,16,20,0.6)_0%,transparent_18%,transparent_78%,#0a1014_100%)]"
      />
      {webgl && !reduced && (
        <button
          type="button"
          onClick={() => setRestack((n) => n + 1)}
          className="absolute bottom-6 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#ece4d6]/20 bg-[#0a1014]/50 px-4 py-2 text-sm text-[#ece4d6]/80 backdrop-blur transition-colors hover:border-[#ece4d6]/50 hover:text-[#ece4d6] lg:bottom-[7%] lg:left-[71%]"
        >
          <RotateCcw className="size-3.5" /> Balance again
        </button>
      )}
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useWebglStage } from "@/components/layouts/use-webgl-stage";

/* WebGL is client-only and heavy — keep it off the SSR path. */
const KettlebellScene = dynamic(() => import("./kettlebell-scene"), { ssr: false, loading: () => null });

/**
 * Gym 6 · Chalk — the hero stage: the kettlebell scene under its spotlight.
 * Full-bleed behind the copy on wide screens; its own block above it on
 * small ones. Renders only while on screen.
 */
export function HeroStage() {
  const { ref, inView, reduced, webgl } = useWebglStage();

  return (
    <div ref={ref} aria-hidden className="relative mt-16 h-[380px] sm:h-[460px] lg:absolute lg:inset-0 lg:mt-0 lg:h-auto">
      {webgl && (
        <div className="absolute inset-0">
          <KettlebellScene active={inView} reduced={reduced} />
        </div>
      )}
    </div>
  );
}

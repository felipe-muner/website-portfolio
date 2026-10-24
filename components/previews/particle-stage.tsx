"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useWebglStage } from "@/components/layouts/use-webgl-stage";
import type { Trade } from "@/lib/previews/trades";

/* WebGL is client-only and heavy — keep it off the SSR path. */
const ParticleScene = dynamic(() => import("./particle-scene"), { ssr: false, loading: () => null });

/**
 * The particle hero's stage, laid out like the AC template's HeroStage: the
 * copy (children) on the left, the scene behind it on wide screens and below
 * it on small ones, with a caption naming the shape being formed.
 */
export function ParticleStage({
  children,
  trade,
  colors,
  captions,
}: {
  children: React.ReactNode;
  trade: Trade;
  colors: [string, string];
  /** One per shape, in order ("Pipes", "Water", "Repairs"). */
  captions: string[];
}) {
  const { ref, inView, reduced, webgl } = useWebglStage();
  const [shape, setShape] = useState(0);

  return (
    <>
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_72%_35%,rgb(var(--pv-glow)/0.22),transparent_70%),radial-gradient(ellipse_55%_50%_at_10%_95%,rgb(var(--pv-glow)/0.12),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[var(--pv-bg)]" />
      </div>

      {children}

      <div
        ref={ref}
        aria-hidden
        className="relative order-2 -mt-6 h-[420px] sm:h-[480px] lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:h-auto lg:w-[58%]"
      >
        {webgl && (
          <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_85%_80%_at_50%_45%,black_65%,transparent)]">
            <ParticleScene trade={trade} colors={colors} active={inView} reduced={reduced} onShape={setShape} />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-6 flex justify-center lg:bottom-[12%]">
          <p className="flex items-center gap-3 rounded-full border border-white/10 bg-black/30 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/60 backdrop-blur">
            {captions.map((caption, i) => (
              <span key={caption} className={`transition-colors duration-700 ${i === shape ? "text-[var(--pv-accent)]" : ""}`}>
                {caption}
              </span>
            ))}
          </p>
        </div>
      </div>
    </>
  );
}

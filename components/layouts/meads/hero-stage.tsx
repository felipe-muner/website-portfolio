"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Eraser, Sparkles } from "lucide-react";
import { useWebglStage } from "@/components/layouts/use-webgl-stage";
import { HERO_WORKS } from "@/lib/layouts/meads";
import { useWorkChoice } from "./events";

/* WebGL is client-only and heavy — keep it off the SSR path. */
const PaintScene = dynamic(() => import("./paint-scene"), { ssr: false, loading: () => null });

const SRCS = HERO_WORKS.map((w) => w.image);

/**
 * Artist · Maria Meads — the hero stage: a canvas with one of her paintings
 * under a linen skin. Move across it to paint; leave it and the studio brush
 * carries on. The palette below swaps the painting; the gallery can too.
 */
export function HeroStage() {
  const { ref, inView, reduced, webgl } = useWebglStage();
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [clearToken, setClearToken] = useState(0);
  const [revealToken, setRevealToken] = useState(0);
  const work = HERO_WORKS[index];

  const pick = useCallback((i: number) => {
    setIndex(i);
    setProgress(0);
  }, []);

  useWorkChoice(
    useCallback(
      (slug: string) => {
        const i = HERO_WORKS.findIndex((w) => w.slug === slug);
        if (i >= 0) pick(i);
      },
      [pick],
    ),
  );

  const pct = Math.round(progress * 100);

  return (
    <div className="flex flex-col gap-5">
      <div
        ref={ref}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.4rem] bg-[radial-gradient(70%_60%_at_50%_40%,#2b2130,#140f17_75%)] sm:aspect-[5/4] lg:aspect-auto lg:min-h-[560px] lg:flex-1"
      >
        {webgl ? (
          <PaintScene
            src={work.image}
            aspect={work.aspect}
            preload={SRCS}
            active={inView}
            reduced={reduced}
            clearToken={clearToken}
            revealToken={revealToken}
            onProgress={setProgress}
          />
        ) : (
          <Image src={work.image} alt={work.title} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-contain p-6" />
        )}
        <p className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/75 backdrop-blur-sm">
          {reduced ? "Finished painting" : pct < 4 ? "Move across the canvas to paint" : pct >= 100 ? "Painted" : `Painted ${pct}%`}
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Palette: the paintings as daubs of paint */}
        <ul className="flex items-center gap-2" aria-label="Choose a painting">
          {HERO_WORKS.map((w, i) => (
            <li key={w.slug}>
              <button
                type="button"
                onClick={() => pick(i)}
                aria-label={`Paint ${w.title}`}
                aria-pressed={i === index}
                className={`relative block size-9 overflow-hidden rounded-[48%_52%_45%_55%/55%_45%_55%_45%] transition-all duration-300 sm:size-10 ${
                  i === index ? "scale-110 ring-2 ring-[#e9b44c] ring-offset-2 ring-offset-[#120d14]" : "opacity-70 hover:opacity-100 hover:scale-105"
                }`}
              >
                <Image src={w.image} alt="" fill sizes="40px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/55">
          <button
            type="button"
            onClick={() => setRevealToken((n) => n + 1)}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/12 px-3.5 transition-colors hover:border-[#e9b44c] hover:text-[#e9b44c]"
          >
            <Sparkles className="size-3.5" /> Reveal
          </button>
          <button
            type="button"
            onClick={() => {
              setClearToken((n) => n + 1);
              setProgress(0);
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/12 px-3.5 transition-colors hover:border-[#e9b44c] hover:text-[#e9b44c]"
          >
            <Eraser className="size-3.5" /> Start over
          </button>
        </div>
      </div>

      <div className="flex items-end justify-between gap-6 border-t border-white/10 pt-4">
        <div>
          <p className="font-display text-2xl leading-none text-[#f3ead9] sm:text-3xl">{work.title}</p>
          <p className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/45">
            {work.medium} · {work.size} · {work.year}
          </p>
        </div>
        <div className="hidden h-1 w-40 overflow-hidden rounded-full bg-white/10 sm:block" aria-hidden>
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#e9b44c,#ef6f8b,#9b6ff2,#42c8c0)] transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

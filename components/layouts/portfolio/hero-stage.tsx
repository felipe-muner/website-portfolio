"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useSwarmCycle } from "@/components/layouts/particles/use-swarm-cycle";
import { buildShapes, shapeIndex } from "./particle-shapes";

/* WebGL is client-only and heavy — keep it off the SSR path. */
const ParticleCanvas = dynamic(() => import("@/components/layouts/particles/particle-canvas"), {
  ssr: false,
  loading: () => null,
});

/** How long the swarm holds each shape (morph included) before moving on. */
const DWELL_MS = 6500;

export interface HeroCategory {
  /** PORTFOLIO group slug — also picks the particle shape. */
  slug: string;
  label: string;
  count: number;
  featured: { name: string; href: string; cover: string; external: boolean };
}

/* Where each category's chip floats around the swarm on wide screens. */
const CHIP_SPOTS = [
  { left: "53%", top: "25%" },
  { left: "84%", top: "27%" },
  { left: "91%", top: "52%" },
  { left: "51%", top: "68%" },
  { left: "86%", top: "74%" },
] as const;

/**
 * The hero's right-hand stage: the morphing particle swarm, a floating chip
 * per category (hover one to preview its shape, click to open its best
 * template), and a caption naming the shape on screen. Full-bleed behind the
 * copy on wide screens; its own block above the copy on small ones.
 */
export function HeroStage({ categories }: { categories: HeroCategory[] }) {
  // Every category, then "yours".
  const { ref, inView, reduced, webgl, current, index, cycling, preview, release } = useSwarmCycle(
    categories.length + 1,
    DWELL_MS,
  );
  const category = current < categories.length ? categories[current] : null;

  return (
    <div ref={ref} className="relative mt-16 h-[400px] sm:h-[480px] lg:absolute lg:inset-0 lg:mt-0 lg:h-auto">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,rgba(37,76,255,0.26),transparent)] lg:bg-[radial-gradient(30%_44%_at_72%_50%,rgba(37,76,255,0.2),transparent)] xl:bg-[radial-gradient(32%_46%_at_69%_50%,rgba(37,76,255,0.2),transparent)]"
      />
      {webgl && (
        <div className="absolute inset-0">
          <ParticleCanvas
            shape={shapeIndex(category ? category.slug : "yours")}
            active={inView}
            reduced={reduced}
            build={buildShapes}
          />
        </div>
      )}

      <p className="pointer-events-none absolute right-12 top-[13%] z-20 hidden max-w-[16rem] font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-white/50 xl:block">
        Real, working websites — designed, built and launched for gyms, studios, villas and local
        businesses.
      </p>

      <ul className="hidden xl:block">
        {categories.map((c, i) => (
          <li
            key={c.slug}
            className="absolute z-20 w-max -translate-x-1/2 -translate-y-1/2"
            style={CHIP_SPOTS[i % CHIP_SPOTS.length]}
          >
            <FeaturedChip
              category={c}
              active={i === current}
              floatDelay={i * -1.4}
              onPreview={() => preview(i)}
              onRelease={() => release(i)}
            />
          </li>
        ))}
      </ul>

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 flex w-60 -translate-x-1/2 flex-col items-center gap-1.5 text-center lg:bottom-[8%] lg:left-[72%] xl:left-[69%]">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8ea8ff]">Now shaping</span>
        <span className="text-lg font-light tracking-[-0.01em] text-white">
          {category ? category.label : "Your business"}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
          {category ? `${category.count} live designs` : "Made to measure"}
        </span>
        <span className="mt-1.5 h-px w-28 overflow-hidden bg-white/10">
          {cycling && (
            <span
              key={index}
              className="block h-full origin-left animate-[hero-dwell_linear_forwards] bg-[#4f7cff]"
              style={{ animationDuration: `${DWELL_MS}ms` }}
            />
          )}
        </span>
      </div>
    </div>
  );
}

function FeaturedChip({
  category,
  active,
  floatDelay,
  onPreview,
  onRelease,
}: {
  category: HeroCategory;
  active: boolean;
  floatDelay: number;
  onPreview: () => void;
  onRelease: () => void;
}) {
  const { featured } = category;
  return (
    <Link
      href={featured.href}
      target={featured.external ? "_blank" : undefined}
      rel={featured.external ? "noopener noreferrer" : undefined}
      onPointerEnter={onPreview}
      onPointerLeave={onRelease}
      onFocus={onPreview}
      onBlur={onRelease}
      style={{ animationDelay: `${floatDelay}s` }}
      className={`group flex items-center gap-3 rounded-2xl border py-1.5 pl-1.5 pr-3.5 backdrop-blur-md transition-[border-color,background-color,box-shadow] duration-500 motion-safe:animate-[hero-float_7s_ease-in-out_infinite] ${
        active
          ? "border-[#4f7cff]/60 bg-[#0c1438]/70 shadow-[0_0_44px_-10px_rgba(79,124,255,0.85)]"
          : "border-white/10 bg-white/[0.04] hover:border-white/25"
      }`}
    >
      <span className="relative size-10 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10">
        <Image src={featured.cover} alt="" fill sizes="40px" className="object-cover" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-medium text-white">{featured.name}</span>
        <span className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/45">
          {category.label}
        </span>
      </span>
      <ArrowUpRight className="size-3.5 text-white/40 transition-colors group-hover:text-white" />
    </Link>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

export interface HeroSlide {
  href: string;
  name: string;
  brand: string;
  detail: string;
  cover: string;
}

const SLIDE_MS = 7000;

/**
 * Full-bleed hero slideshow: template covers crossfade while each one settles
 * with a very slow zoom-out; the URL chip + caption follow the active slide.
 * Renders as the absolute background of the hero section (which must be
 * `relative`) — the section overlays its own copy on top. Includes navy scrims
 * so white text stays high-contrast over any photo.
 */
export function HeroCarousel({
  slides,
  monoClass,
  displayClass,
}: {
  slides: HeroSlide[];
  monoClass: string;
  displayClass: string;
}) {
  const [current, setCurrent] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Auto-advance; restarting on `current` keeps manual picks and the
  // progress bar in sync with the next rotation.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReducedMotion(true);
      return;
    }
    const id = setInterval(() => setCurrent((c) => (c + 1) % slides.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [current, slides.length]);

  const active = slides[current] ?? slides[0];

  return (
    <>
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.href}
          aria-hidden={i !== current}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.cover}
            alt={slide.brand}
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover ${i === current && !reducedMotion ? "slide-zoom-out" : ""}`}
          />
        </div>
      ))}

      {/* Contrast scrims: base tint + copy side + controls edge */}
      <div className="absolute inset-0 bg-[#0c2340]/35" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#081a30]/95 via-[#0c2340]/60 to-[#0c2340]/10" />
      <div className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-[#081a30]/95 via-[#0c2340]/55 to-transparent" />
      <div className="grain absolute inset-0" />

      {/* The whole slide opens the active template (copy overlay is pointer-transparent) */}
      <Link
        href={active.href}
        aria-label={`Open the ${active.name} live demo`}
        className="absolute inset-0 z-[5]"
      />

      {/* Bottom bar: browser chip + caption left, controls right */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-x-8 gap-y-5 px-5 pb-7 sm:px-6">
          <Link href={active.href} className="group min-w-0" aria-live="polite">
            <span className="flex items-center gap-2.5">
              <span className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-[#ff5a3c]" />
                <span className="size-2.5 rounded-full bg-[#ffd166]" />
                <span className="size-2.5 rounded-full bg-[#2fbf8f]" />
              </span>
              <span
                key={active.href}
                className={`${monoClass} truncate rounded-md bg-white/10 px-2.5 py-1 text-[0.65rem] text-[#c7d5e3] backdrop-blur animate-landing-fade-down`}
              >
                {active.href}
              </span>
            </span>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <h2 className={`${displayClass} text-2xl text-white`}>{active.name}</h2>
              <p className="text-sm text-[#c7d5e3]">{active.detail}</p>
            </div>
            <span className="mt-3.5 inline-flex items-center gap-2 rounded-full bg-[#ff5a3c] px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_28px_-10px_rgba(255,90,60,0.8)] transition group-hover:bg-[#e64a2e]">
              Open this template
              <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2.5">
              {slides.map((slide, i) => {
                const isActive = i === current;
                return (
                  <button
                    key={slide.href}
                    type="button"
                    aria-label={`Go to ${slide.name}`}
                    onClick={() => setCurrent(i)}
                    className="relative h-1.5 overflow-hidden rounded-full bg-white/25 transition-all duration-300"
                    style={{ width: isActive ? 40 : 14 }}
                  >
                    {isActive && (
                      <span
                        key={`prog-${current}`}
                        className="absolute inset-y-0 left-0 block w-full origin-left rounded-full bg-[#ff5a3c]"
                        // Static solid bar when the OS asks for reduced motion (autoplay is off too)
                        style={
                          reducedMotion
                            ? undefined
                            : { animation: `slideshow-progress ${SLIDE_MS}ms linear both` }
                        }
                      />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous template"
                onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
                className="grid size-9 place-items-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur transition hover:border-[#ffd166] hover:text-[#ffd166]"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Next template"
                onClick={() => setCurrent((c) => (c + 1) % slides.length)}
                className="grid size-9 place-items-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur transition hover:border-[#ffd166] hover:text-[#ffd166]"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

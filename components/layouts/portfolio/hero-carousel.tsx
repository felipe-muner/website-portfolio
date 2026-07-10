"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export interface HeroSlide {
  href: string;
  name: string;
  brand: string;
  detail: string;
  cover: string;
}

const AUTOPLAY_MS = 4000;

/**
 * Hero showcase: one browser window whose viewport autoplays through template
 * covers. The URL bar follows the active slide; each slide opens its live demo.
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
  const [autoplay] = useState(() =>
    Autoplay({ delay: AUTOPLAY_MS, stopOnInteraction: false, stopOnMouseEnter: true }),
  );
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (!api) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReducedMotion(true);
      autoplay.stop();
    }
    const onSelect = () => setSelected(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, autoplay]);

  const active = slides[selected] ?? slides[0];

  return (
    <div className="relative">
      {/* Soft glow behind the window so it lifts off the navy hero */}
      <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-[#1a3a66]/60 blur-2xl" />

      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#132c50] shadow-2xl">
        {/* Browser chrome — URL bar follows the active slide */}
        <div className="flex items-center gap-2.5 px-4 py-2.5">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff5a3c]" />
            <span className="size-2.5 rounded-full bg-[#ffd166]" />
            <span className="size-2.5 rounded-full bg-[#2fbf8f]" />
          </span>
          <span
            key={active.href}
            className={`${monoClass} min-w-0 flex-1 truncate rounded-md bg-white/10 px-2.5 py-1 text-[0.65rem] text-[#c7d5e3] animate-landing-fade-down`}
          >
            {active.href}
          </span>
        </div>

        <Carousel setApi={setApi} opts={{ loop: true }} plugins={[autoplay]}>
          <CarouselContent className="ml-0">
            {slides.map((slide, i) => (
              <CarouselItem key={slide.href} className="pl-0">
                <Link href={slide.href} className="group relative block aspect-[16/10]">
                  <Image
                    src={slide.cover}
                    alt={slide.brand}
                    fill
                    priority={i === 0}
                    sizes="(min-width: 1024px) 42vw, 92vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Caption on a bottom gradient */}
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-[#0c2340]/95 via-[#0c2340]/45 to-transparent p-4 pt-14">
                    <div className="min-w-0">
                      <h3 className={`${displayClass} text-lg text-white`}>{slide.name}</h3>
                      <p className="truncate text-xs text-[#c7d5e3]">{slide.detail}</p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur transition group-hover:bg-[#ff5a3c]">
                      Live demo <ArrowUpRight className="size-3.5" />
                    </span>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Prev / next */}
      <button
        type="button"
        aria-label="Previous template"
        onClick={() => api?.scrollPrev()}
        className="absolute -left-4 top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-[#0c2340]/80 text-white backdrop-blur transition hover:border-[#ffd166] hover:text-[#ffd166]"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Next template"
        onClick={() => api?.scrollNext()}
        className="absolute -right-4 top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-[#0c2340]/80 text-white backdrop-blur transition hover:border-[#ffd166] hover:text-[#ffd166]"
      >
        <ChevronRight className="size-4" />
      </button>

      {/* Dots + autoplay progress */}
      <div className="mt-5 flex items-center justify-center gap-2.5">
        {slides.map((slide, i) => {
          const isActive = i === selected;
          return (
            <button
              key={slide.href}
              type="button"
              aria-label={`Go to ${slide.name}`}
              onClick={() => api?.scrollTo(i)}
              className="relative h-1.5 overflow-hidden rounded-full bg-white/25 transition-all duration-300"
              style={{ width: isActive ? 40 : 14 }}
            >
              {isActive && (
                <span
                  key={`prog-${selected}`}
                  className="absolute inset-y-0 left-0 block w-full origin-left rounded-full bg-[#ff5a3c]"
                  // Static solid bar when the OS asks for reduced motion (autoplay is off too)
                  style={
                    reducedMotion
                      ? undefined
                      : { animation: `slideshow-progress ${AUTOPLAY_MS}ms linear both` }
                  }
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

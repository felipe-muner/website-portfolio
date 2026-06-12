"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type HeroSlide = {
  image: string;
  alt: string;
  label: string;
};

export function HeroSlideshow({
  slides,
  interval = 6000,
  className,
  controlsClassName,
  children,
}: {
  slides: readonly HeroSlide[];
  interval?: number;
  className?: string;
  /** Extra padding etc. for the label/progress bar block, e.g. to clear overlapping content. */
  controlsClassName?: string;
  children?: React.ReactNode;
}) {
  const [current, setCurrent] = useState(0);

  // Auto-advance; restarting the timer on `current` keeps manual selection
  // and the progress bar in sync with the next rotation.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setCurrent((c) => (c + 1) % slides.length),
      interval,
    );
    return () => clearInterval(id);
  }, [current, interval, slides.length]);

  return (
    <section className={cn("relative overflow-hidden", className)}>
      {slides.map((slide, index) => (
        <div
          key={slide.image}
          aria-hidden={index !== current}
          className={cn(
            "absolute inset-0 transition-opacity duration-[1600ms] ease-out",
            index === current ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className={cn(
              "object-cover",
              index === current && "slide-kenburns",
            )}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/65" />
      <div className="grain absolute inset-0" />

      <div className="relative z-10 h-full">{children}</div>

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-10 flex flex-col gap-4 px-5 pb-7 md:px-10",
          controlsClassName,
        )}
      >
        <p
          aria-live="polite"
          className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-white/70"
        >
          {slides[current].label}
        </p>
        <div className="flex gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`Show slide ${index + 1}: ${slide.label}`}
              className="cursor-pointer py-2"
            >
              <span className="block h-0.5 w-9 overflow-hidden rounded-full bg-white/30 md:w-12">
                {index === current && (
                  <span
                    className="block h-full w-full origin-left bg-white"
                    style={{
                      animation: `slideshow-progress ${interval}ms linear forwards`,
                    }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

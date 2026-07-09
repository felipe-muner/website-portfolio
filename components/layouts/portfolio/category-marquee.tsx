"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export interface CategoryItem {
  label: string;
  count: number;
  /** In-page anchor to the category's shelf, e.g. "#cat-gym-fitness". */
  anchor: string;
  cover: string;
}

/**
 * Category shelves drift by in a slow continuous loop. Hovering (desktop) or
 * touching and holding (mobile) pauses the scroll; clicking a card jumps to
 * that category's section. The list is repeated so the -50% loop stays
 * seamless on ultra-wide viewports.
 */
export function CategoryMarquee({
  items,
  displayClass,
  monoClass,
}: {
  items: CategoryItem[];
  displayClass: string;
  monoClass: string;
}) {
  const [paused, setPaused] = useState(false);

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#eef2f3] to-transparent sm:w-24"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#eef2f3] to-transparent sm:w-24"
      />
      <div
        className="marquee-viewport overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        onTouchCancel={() => setPaused(false)}
      >
        <div
          className="marquee-track"
          style={
            {
              "--marquee-duration": "80s",
              animationPlayState: paused ? "paused" : "running",
            } as React.CSSProperties
          }
        >
          {[0, 1, 2, 3].map((copy) => (
            <ul key={copy} aria-hidden={copy > 0} className="flex shrink-0 gap-5 pr-5">
              {items.map((item) => (
                <li key={item.label} className="w-72 sm:w-80">
                  <a
                    href={item.anchor}
                    tabIndex={copy > 0 ? -1 : undefined}
                    className="group relative block h-48 overflow-hidden rounded-2xl sm:h-52"
                  >
                    <Image
                      src={item.cover}
                      alt={item.label}
                      fill
                      sizes="20rem"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c2340]/95 via-[#0c2340]/45 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                      <div>
                        <p className={`${monoClass} text-xs text-[#ffd166]`}>
                          {item.count} templates
                        </p>
                        <h3 className={`${displayClass} mt-1 text-2xl text-white`}>
                          {item.label}
                        </h3>
                      </div>
                      <span className="mb-1 grid size-9 shrink-0 place-items-center rounded-full bg-[#ff5a3c] text-white transition group-hover:translate-x-1">
                        <ArrowRight className="size-4" />
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}

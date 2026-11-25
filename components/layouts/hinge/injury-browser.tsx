"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Region } from "@/lib/layouts/hinge";

/**
 * "Where does it hurt?" — a sticky photo on the left that changes as each body
 * region scrolls through the middle of the screen. On phones every region
 * carries its own photo instead.
 */
export function InjuryBrowser({ regions }: { regions: readonly Region[] }) {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid gap-2 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <div className="hinge-cell relative hidden overflow-clip lg:block">
        <div className="sticky top-24 h-[calc(100svh-8rem)] overflow-hidden rounded-[inherit]">
          {regions.map((r, i) => (
            <Image
              key={r.key}
              src={r.image}
              alt=""
              fill
              sizes="40vw"
              className={`object-cover transition-[opacity,transform] duration-700 ease-out ${i === active ? "scale-100 opacity-100" : "scale-105 opacity-0"}`}
            />
          ))}
          <div className="absolute bottom-5 left-5 rounded-full border-2 border-[var(--ink)] bg-[var(--sun)] px-4 py-1.5 text-sm font-semibold">
            {String(active + 1).padStart(2, "0")} / {String(regions.length).padStart(2, "0")} · {regions[active].title}
          </div>
        </div>
      </div>
      <div className="grid gap-2">
        {regions.map((r, i) => (
          <article
            key={r.key}
            ref={(el) => {
              items.current[i] = el;
            }}
            data-index={i}
            className={`hinge-cell flex min-h-[22rem] flex-col justify-center gap-4 p-7 transition-colors duration-500 sm:p-10 lg:min-h-[70svh] ${i === active ? "bg-[var(--sun)]" : "bg-[var(--pale)]"}`}
          >
            <div className="relative -mx-2 mb-2 aspect-[16/10] overflow-hidden rounded-2xl border-2 border-[var(--ink)] lg:hidden">
              <Image src={r.image} alt="" fill sizes="100vw" className="object-cover" />
            </div>
            <h3 className="font-display text-[2.6rem] uppercase leading-[0.9] sm:text-6xl">{r.title}</h3>
            <p className="font-display text-xl leading-snug sm:text-2xl">{r.common}</p>
            <p className="max-w-md text-[15px] leading-relaxed text-[var(--ink)]/75">{r.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

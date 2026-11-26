"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MOONDAY, MOONDAY_CLASSES } from "@/lib/layouts/moonday";

/**
 * The four classes as wide cards. The one nearest the middle of the screen
 * floods with red from the bottom up; the others stay paper with a red rule.
 */
export function ClassCards() {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight * 0.55;
      let best = 0;
      let bestDistance = Number.POSITIVE_INFINITY;
      refs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDistance) {
          bestDistance = d;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="mt-12 flex flex-col gap-4 md:mt-16">
      {MOONDAY_CLASSES.map((c, i) => {
        const on = i === active;
        return (
          <article
            key={c.name}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="relative grid overflow-hidden rounded-[16px] border p-3 transition-colors duration-500 md:grid-cols-[1fr_1.15fr_auto] md:items-center md:gap-8 md:p-3"
            style={{ borderColor: MOONDAY.line }}
          >
            {/* The flood */}
            <span
              aria-hidden
              className="absolute inset-0 origin-bottom transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
              style={{ backgroundColor: MOONDAY.red, transform: `scaleY(${on ? 1 : 0})` }}
            />

            <h3
              className="relative px-3 pt-4 text-[clamp(2.8rem,6vw,5.4rem)] font-[780] leading-[0.9] tracking-[-0.055em] transition-colors duration-500 md:px-6 md:pt-0"
              style={{ color: on ? MOONDAY.cream : MOONDAY.frame }}
            >
              {c.name}
            </h3>

            <div className="relative px-3 py-5 md:px-0 md:py-0">
              <p
                className="text-[0.95rem] font-semibold transition-colors duration-500"
                style={{ color: on ? MOONDAY.cream : MOONDAY.red }}
              >
                {c.when}
              </p>
              <p
                className="mt-2 max-w-md text-[1.05rem] leading-relaxed transition-colors duration-500"
                style={{ color: on ? MOONDAY.cream : MOONDAY.ink }}
              >
                {c.text}
              </p>
              <p
                className="mt-3 text-sm font-semibold transition-colors duration-500"
                style={{ color: on ? MOONDAY.cream : MOONDAY.red }}
              >
                {c.meta}
              </p>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[12px] md:aspect-[4/5] md:h-[min(46vh,360px)] md:w-auto">
              <Image
                src={c.image}
                alt=""
                fill
                sizes="(min-width: 768px) 300px, 92vw"
                className="object-cover transition-transform duration-1000"
                style={{ transform: on ? "scale(1.04)" : "scale(1)" }}
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

export interface PortfolioStat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

/** Counts 0 → target (easeOutCubic) once `run` turns true. */
function useCountUp(targets: number[], run: boolean, duration = 1800): number[] {
  const [vals, setVals] = useState<number[]>(() => targets.map(() => 0));
  const started = useRef(false);

  useEffect(() => {
    if (!run || started.current) return;
    started.current = true;

    // Reduced motion: show the final values immediately.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setVals(targets);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVals(targets.map((tg) => Math.round(tg * eased)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, targets, duration]);

  return vals;
}

/** Navy stats band (Sacolaria-style count-up), values fed by the index page. */
export function StatsBar({
  stats,
  monoClass,
  displayClass,
}: {
  stats: PortfolioStat[];
  monoClass: string;
  displayClass: string;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "-40px 0px" });
  const [targets] = useState(() => stats.map((s) => s.value));
  const vals = useCountUp(targets, inView);

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#0c2340]" aria-label="Shop numbers">
      {/* Soft mesh glow: layered radial washes of the shop's amber/coral/teal accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(85rem 30rem at 12% -40%, rgba(255, 209, 102, 0.16), transparent 55%),
            radial-gradient(70rem 28rem at 90% 150%, rgba(255, 90, 60, 0.15), transparent 60%),
            radial-gradient(55rem 22rem at 38% 130%, rgba(14, 124, 102, 0.18), transparent 60%),
            radial-gradient(60rem 26rem at 60% -20%, rgba(18, 44, 80, 0.9), transparent 70%)`,
        }}
      />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-5 py-10 text-center sm:px-6 md:grid-cols-4 md:py-12">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="flex flex-col items-center px-2 md:border-l md:border-white/15 md:first:border-l-0"
          >
            <p
              className={`${displayClass} whitespace-nowrap leading-none tabular-nums text-[#ffd166]`}
              style={{ fontSize: "clamp(1.6rem, 4.4vw, 2.6rem)" }}
            >
              {s.prefix}
              {vals[i]}
              {s.suffix && <span style={{ fontSize: "0.6em" }}>{s.suffix}</span>}
            </p>
            <p
              className={`${monoClass} mx-auto mt-2.5 max-w-[12rem] text-[0.65rem] uppercase tracking-[0.14em] text-[#9fb3c8] sm:text-xs`}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

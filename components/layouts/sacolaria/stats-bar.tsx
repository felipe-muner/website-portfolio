"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { formatInt } from "@/lib/layouts/sacolaria/catalog";

interface Stat {
  value: number;
  prefix: string;
  suffix: string;
  label: string;
}

const STATS: Stat[] = [
  { value: 15000, prefix: "+", suffix: "", label: "Clientes atendidos" },
  { value: 18000000, prefix: "+", suffix: " kg", label: "De plástico reciclado" },
  { value: 2500000, prefix: "+", suffix: "/mês", label: "Sacolas produzidas" },
  { value: 9, prefix: "", suffix: "", label: "Anos de tradição" },
];

const TARGETS = STATS.map((s) => s.value);

/** Anima 0 → alvo (easeOutCubic) quando `run` vira true, uma única vez. */
function useCountUp(targets: number[], run: boolean, duration = 2000): number[] {
  const [vals, setVals] = useState<number[]>(() => targets.map(() => 0));
  const started = useRef(false);

  useEffect(() => {
    if (!run || started.current) return;
    started.current = true;

    // Respeita quem prefere menos animação: mostra o valor final direto.
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

export function StatsBar() {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "-80px 0px" });
  const vals = useCountUp(TARGETS, inView);

  return (
    <section ref={ref} className="bg-[#0b3d2e]" aria-label="Números da Sacolaria Brasil">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-5 py-12 text-center sm:px-6 md:grid-cols-4 md:py-14">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className="px-2 md:border-l md:border-[#1d5340] md:first:border-l-0"
          >
            <p className="text-3xl font-black tabular-nums text-[#f5c518] sm:text-4xl">
              {s.prefix}
              {formatInt(vals[i])}
              {s.suffix}
            </p>
            <p className="mx-auto mt-2 max-w-[10rem] text-xs font-semibold uppercase tracking-wide text-[#a9cabd] sm:text-sm">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

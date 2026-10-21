"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { SERVICES } from "@/lib/layouts/aircon";
import { cn } from "@/lib/utils";
import { chooseService } from "./events";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * MGM · services as a picker: the systems listed on the left, the chosen one
 * shown large on the right with what's included — and a one-tap quote for it.
 */
export function SystemPicker() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const id = useId();
  const service = SERVICES[active];

  return (
    <div className="mt-14 grid gap-8 lg:mt-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
      <div role="tablist" aria-label="Services" aria-orientation="vertical" className="flex flex-col">
        {SERVICES.map((s, i) => {
          const selected = i === active;
          return (
            <button
              key={s.title}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={selected}
              aria-controls={`${id}-panel`}
              onClick={() => setActive(i)}
              className={cn(
                "group relative flex items-start gap-5 border-t border-white/[0.08] py-5 text-left transition-colors last:border-b focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#66e6ba] sm:py-6",
                selected ? "text-white" : "text-white/45 hover:text-white/80",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute top-[-1px] left-0 h-px bg-[#66e6ba] transition-all duration-500",
                  selected ? "w-full" : "w-0",
                )}
              />
              <span className="mt-1.5 font-mono text-xs text-white/35">0{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-4">
                  <span className="text-xl font-light tracking-tight sm:text-2xl">{s.title}</span>
                  <s.icon
                    className={cn(
                      "size-5 shrink-0 transition-all duration-300",
                      selected ? "text-[#66e6ba]" : "text-white/25 group-hover:text-white/50",
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "grid transition-all duration-500",
                    selected ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <span className="overflow-hidden text-sm leading-relaxed text-white/60">{s.short}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${active}`}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] lg:sticky lg:top-24 lg:self-start"
      >
        <div className="relative aspect-[4/3]">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={service.title}
              className="absolute inset-0"
              initial={reduce ? false : { opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <Image
                src={service.image}
                alt={service.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14_0.02_170/0.6)] to-transparent sm:from-[oklch(0.14_0.02_170)] sm:via-[oklch(0.14_0.02_170/0.35)]" />
        </div>

        {/* Below the photo on phones; laid over its lower half from sm up */}
        <div className="relative p-5 sm:absolute sm:inset-x-0 sm:bottom-0 sm:p-8">
          <p className="max-w-lg text-sm leading-relaxed text-white/75 sm:text-base">{service.description}</p>
          <ul className="mt-4 grid gap-x-5 gap-y-1.5 sm:grid-cols-2">
            {service.points.map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm text-white/80">
                <Check className="mt-0.5 size-4 shrink-0 text-[#66e6ba]" strokeWidth={2.5} />
                {point}
              </li>
            ))}
          </ul>
          <a
            href="#quote"
            onClick={() => chooseService(service.title)}
            className="group mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#031610] transition-transform hover:-translate-y-0.5"
          >
            Quote me for {service.title.toLowerCase()}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

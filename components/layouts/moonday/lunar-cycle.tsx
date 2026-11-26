"use client";

import Image from "next/image";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SYNODIC_MONTH } from "@/lib/layouts/moon";
import { LUNAR_STAGES, MOONDAY } from "@/lib/layouts/moonday";
import type { LunarStage } from "@/lib/layouts/moonday";
import { MoonGlyph, useTonight } from "./moon";

const TICKS = [0, 5, 10, 15, 20, 25];
const PHONE_HIDDEN = new Set([5, 15, 25]);

/**
 * "Twenty-nine days, in order": the section pins and the eight phases slide
 * past sideways as you scroll down. A dot rides the day ruler, the phase in
 * focus floods red, and a pin marks where tonight's moon really is.
 */
export function LunarCycle() {
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const tonight = useTonight();

  useEffect(() => {
    const measure = () => {
      if (!track.current || !viewport.current) return;
      setDistance(Math.max(0, track.current.scrollWidth - viewport.current.clientWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    if (viewport.current) ro.observe(viewport.current);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (p) => -p * distance);
  const dot = useTransform(scrollYProgress, (p) => `${p * 100}%`);
  const fill = useTransform(scrollYProgress, (p) => `scaleX(${p})`);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(Math.min(LUNAR_STAGES.length - 1, Math.floor(p * LUNAR_STAGES.length)));
  });

  const pinned = !reduce;

  return (
    <section
      id="cycle"
      ref={section}
      className="relative scroll-mt-20"
      style={pinned ? { height: `calc(100svh + ${distance}px)` } : undefined}
    >
      <div className={pinned ? "sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pt-20" : "py-24"}>
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <div className="grid gap-5 md:grid-cols-2 md:items-end md:gap-16">
            <h2 className="text-[clamp(2.5rem,5.2vw,4.6rem)] font-[760] leading-[0.95] tracking-[-0.05em]" style={{ color: MOONDAY.frame }}>
              Twenty-nine days, in&nbsp;order
            </h2>
            <p className="hidden max-w-xl text-[1.02rem] leading-relaxed sm:block md:justify-self-end" style={{ color: MOONDAY.ink }}>
              Every month follows the same arc, so your body learns its shape and
              you always know what the week is for. The timetable changes with the
              sky; the teachers change with it.
            </p>
          </div>

          {/* Day ruler */}
          <div className="relative mt-6 md:mt-10">
            <div className="relative h-5 text-xs font-semibold" style={{ color: MOONDAY.red }}>
              {TICKS.map((t) => (
                <span
                  key={t}
                  className={`absolute -translate-x-1/2 first:translate-x-0 ${PHONE_HIDDEN.has(t) ? "hidden sm:inline" : ""}`}
                  style={{ left: `${(t / SYNODIC_MONTH) * 100}%` }}
                >
                  {t}
                </span>
              ))}
              <span className="absolute right-0">29½ days</span>
            </div>
            <div className="relative mt-2 h-px" style={{ backgroundColor: MOONDAY.line }}>
              <motion.span
                className="absolute inset-0 origin-left"
                style={{ backgroundColor: MOONDAY.red, transform: pinned ? fill : "scaleX(0)" }}
              />
              {pinned && (
                <motion.span
                  className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ left: dot, backgroundColor: MOONDAY.red }}
                />
              )}
              {tonight && (
                <span
                  className="absolute top-2.5 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider"
                  style={{ left: `${(tonight.age / SYNODIC_MONTH) * 100}%`, backgroundColor: MOONDAY.frame, color: MOONDAY.cream }}
                >
                  Tonight
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Cards */}
        <div ref={viewport} className={`mt-10 w-full md:mt-12 ${pinned ? "overflow-hidden" : "overflow-x-auto pb-4"}`}>
          <motion.div
            ref={track}
            style={pinned ? { x } : undefined}
            className="flex w-max gap-3 px-6 md:gap-4 md:px-10 xl:px-[max(2.5rem,calc((100vw-1400px)/2+2.5rem))]"
          >
            {LUNAR_STAGES.map((stage, i) => (
              <StageCard
                key={stage.name}
                stage={stage}
                on={pinned ? i === active : false}
                isTonight={tonight?.stageIndex === i}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StageCard({ stage, on, isTonight }: { stage: LunarStage; on: boolean; isTonight: boolean }) {
  const solid = !stage.image;
  const filled = solid || on;
  return (
    <article
      className="relative flex h-[min(58svh,440px)] w-[78vw] shrink-0 flex-col overflow-hidden rounded-[16px] border p-3 sm:w-[340px]"
      style={{ borderColor: filled ? MOONDAY.red : MOONDAY.line }}
    >
      <span
        aria-hidden
        className="absolute inset-0 origin-bottom transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
        style={{ backgroundColor: MOONDAY.red, transform: `scaleY(${filled ? 1 : 0})` }}
      />

      {solid ? (
        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          <MoonGlyph phase={stage.phase} size="min(62%, 190px)" light={MOONDAY.cream} dark={MOONDAY.deep} title={stage.name} />
        </div>
      ) : (
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-[12px]">
          <Image src={stage.image ?? ""} alt="" fill sizes="340px" className="object-cover" />
          <span className="absolute left-2.5 top-2.5 rounded-full p-1.5" style={{ backgroundColor: MOONDAY.cream }}>
            <MoonGlyph phase={stage.phase} size={26} light={MOONDAY.frame} dark={MOONDAY.blush} title={stage.name} />
          </span>
        </div>
      )}

      {isTonight && (
        <span
          className="absolute right-5 top-5 rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider"
          style={{ backgroundColor: MOONDAY.cream, color: MOONDAY.red }}
        >
          We are here
        </span>
      )}

      <div className="relative px-1.5 pb-1.5 pt-4">
        <p className="text-xs font-semibold transition-colors duration-500" style={{ color: filled ? MOONDAY.cream : MOONDAY.red }}>
          {stage.label} · {stage.name}
        </p>
        <h3
          className="mt-1.5 text-[1.45rem] font-[740] leading-tight tracking-[-0.03em] transition-colors duration-500"
          style={{ color: filled ? MOONDAY.cream : MOONDAY.frame }}
        >
          {stage.title}
        </h3>
        <p
          className="mt-1.5 text-[0.95rem] leading-snug transition-colors duration-500"
          style={{ color: filled ? MOONDAY.cream : MOONDAY.ink }}
        >
          {stage.text}
        </p>
      </div>
    </article>
  );
}

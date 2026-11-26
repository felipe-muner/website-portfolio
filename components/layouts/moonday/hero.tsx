"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MOONDAY } from "@/lib/layouts/moonday";
import { MoonGlyph, useTonight } from "./moon";
import type { Tonight } from "./moon";

const EASE = [0.22, 1, 0.36, 1] as const;
const HEADLINE = ["Every", "practice", "follows", "the", "moon."];

export function MoondayHero() {
  const ref = useRef<HTMLElement>(null);
  const tonight = useTonight();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const moonY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ backgroundColor: MOONDAY.red, color: MOONDAY.cream }}
    >
      {/* A big, quiet moon behind the headline, drawn at tonight's phase */}
      <motion.div
        aria-hidden
        style={{ y: moonY }}
        className="pointer-events-none absolute -left-[18vw] top-[8%] w-[62vw] max-w-[860px] opacity-[0.13] md:-left-[8vw] md:w-[46vw]"
      >
        <MoonGlyph phase={tonight?.phase ?? 0.5} size="100%" light={MOONDAY.cream} dark="transparent" />
      </motion.div>

      <div className="relative mx-auto grid max-w-[1400px] items-center gap-10 px-6 pb-14 pt-10 md:min-h-[calc(100svh-6rem)] md:grid-cols-[1.15fr_1fr] md:gap-16 md:px-10 md:pb-16 md:pt-8">
        <div>
          <h1 className="text-[clamp(2.9rem,6.4vw,5.6rem)] font-[760] leading-[0.92] tracking-[-0.05em]">
            {HEADLINE.map((word, i) => (
              <span key={word} className="inline-block overflow-hidden pb-[0.08em] align-top">
                <motion.span
                  className="inline-block"
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.08, ease: EASE }}
                >
                  {word}
                  {i < HEADLINE.length - 1 ? " " : ""}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
            className="mt-7 max-w-[34rem] text-[clamp(1.1rem,1.6vw,1.55rem)] font-[450] leading-[1.32] tracking-[-0.012em]"
          >
            Twenty-nine and a half days from new moon to new moon. We plan the
            month around them: quiet when the sky is dark, stronger as it fills,
            wide open on the full moon, letting go as it wanes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4"
          >
            <a
              href="#contact"
              className="rounded-full px-6 py-3.5 text-[0.95rem] font-semibold transition-transform duration-300 hover:-translate-y-0.5"
              style={{ backgroundColor: MOONDAY.cream, color: MOONDAY.red }}
            >
              Book your first class
            </a>
            <span className="text-sm font-medium opacity-90">
              First class ฿300 · Full Moon Flow on the beach, monthly
            </span>
          </motion.div>
        </div>

        <motion.figure
          initial={{ clipPath: "inset(100% 0% 0% 0% round 18px)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0% round 18px)" }}
          transition={{ duration: 1.2, delay: 0.25, ease: EASE }}
          className="relative aspect-[4/5] w-full overflow-hidden rounded-[18px] md:aspect-[4/5] md:max-h-[78svh] md:justify-self-end"
        >
          <motion.div style={{ scale: photoScale }} className="absolute inset-0">
            <Image
              src="/img/layouts/yoga-sunset-pose.jpg"
              alt="A low lunge on the deck at dusk"
              fill
              priority
              sizes="(min-width: 768px) 45vw, 92vw"
              className="object-cover"
            />
          </motion.div>

          <TonightCard />
        </motion.figure>
      </div>
    </section>
  );
}

/** Tonight's real moon, pinned to the corner of the hero photo. */
function TonightCard() {
  const tonight = useTonight();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: tonight ? 1 : 0, y: tonight ? 0 : 20 }}
      transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
      className="absolute bottom-4 left-4 right-4 flex items-center gap-4 rounded-[14px] p-4 sm:right-auto sm:pr-6"
      style={{ backgroundColor: MOONDAY.cream, color: MOONDAY.ink }}
    >
      <div className="shrink-0 animate-landing-float">
        <MoonGlyph phase={tonight?.phase ?? 0.5} size={54} light={MOONDAY.frame} dark={MOONDAY.blush} />
      </div>
      <div className="leading-tight">
        <p className="text-xs font-semibold" style={{ color: MOONDAY.red }}>
          Tonight over the island
        </p>
        <p className="mt-1 text-lg font-[700] tracking-[-0.02em]" style={{ color: MOONDAY.frame }}>
          {tonight?.name ?? " "}
        </p>
        <p className="mt-0.5 text-sm">
          {tonight ? `${tonight.lit}% lit · ${fullMoonNote(tonight)}` : "\u00a0"}
        </p>
      </div>
    </motion.div>
  );
}

function fullMoonNote(t: Tonight): string {
  if (t.fullTonight) return "Moon flow on the beach tonight";
  const days = (n: number) => `${n} ${n === 1 ? "day" : "days"}`;
  if (t.daysSinceFull <= 4) return `full moon ${days(t.daysSinceFull)} ago`;
  return `full moon in ${days(t.daysToFull)}`;
}

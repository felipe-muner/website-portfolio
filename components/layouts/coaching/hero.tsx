"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  image: string;
  lines: readonly string[];
}

// Deliberately soft: opacity + a small lift, slow easing. No masks or blur
// jumps — the motion should feel like an exhale, not a flash.
const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.3 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
};

export function CoachingHero({ image, lines }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex h-[100svh] min-h-[640px] w-full flex-col justify-center overflow-hidden bg-[#2c3a30] text-[#f4efe4]"
    >
      <motion.div style={{ y: imgY }} className="absolute inset-0">
        <Image
          src={image}
          alt="Sonnenlicht auf einem ruhigen Waldweg"
          fill
          priority
          sizes="100vw"
          className="studio-kenburns object-cover"
        />
      </motion.div>
      {/* Warm, soft veils — keep the forest legible but calm */}
      <div className="absolute inset-0 bg-[#283528]/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#222e25] via-transparent to-[#222e25]/60" />

      <motion.div
        style={{ opacity: fade }}
        variants={group}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto w-full max-w-5xl px-6 text-center sm:px-10"
      >
        <motion.p
          variants={item}
          className="text-xs font-medium uppercase tracking-[0.28em] text-[#d8b48f]"
        >
          Coaching &amp; Beratung · Online / Bamberg
        </motion.p>

        <h1 className="mt-7 font-serif text-[clamp(2.4rem,7vw,5.5rem)] font-light leading-[1.04] tracking-[-0.01em]">
          {lines.map((l, i) => (
            <motion.span key={i} variants={item} className="block">
              {l}
            </motion.span>
          ))}
        </h1>

        <motion.p
          variants={item}
          className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-[#f4efe4]/80 sm:text-lg"
        >
          Heilung entsteht nicht durch Konfrontation, sondern durch Wiederverbindung —
          mit dir selbst, deinen Bedürfnissen und deinem ursprünglichen Wesen.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="#kontakt"
            className="flex items-center gap-2 rounded-full bg-[#d8b48f] px-7 py-3.5 text-sm font-semibold text-[#2c3a30] transition hover:bg-[#e4c4a2]"
          >
            Termin buchen <ArrowRight className="size-4" />
          </a>
          <a
            href="#arbeit"
            className="rounded-full border border-[#f4efe4]/30 px-7 py-3.5 text-sm font-semibold text-[#f4efe4]/90 transition hover:bg-[#f4efe4]/10"
          >
            Mehr erfahren
          </a>
        </motion.div>
      </motion.div>

      {/* Breathing cue — a slow, regulating pulse */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1.2 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="text-[0.65rem] uppercase tracking-[0.28em] text-[#f4efe4]/55">
          Ein- &amp; ausatmen
        </span>
        <span className="relative flex size-4 items-center justify-center">
          <span className="coach-breathe absolute inset-0 rounded-full bg-[#d8b48f]" />
          <span className="size-1.5 rounded-full bg-[#f4efe4]" />
        </span>
      </motion.div>
    </section>
  );
}

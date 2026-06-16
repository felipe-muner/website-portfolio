"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowRight, MoveDown, Search } from "lucide-react";

interface HeroProps {
  image: string;
  /** Words that fly up in sequence to form the headline; `accent` tints the dragon-red ones. */
  line1: readonly { text: string; accent?: boolean }[];
  line2: readonly { text: string; accent?: boolean }[];
}

// Each word sits in an overflow-hidden mask and slides up with a soft blur — the
// signature "assembling headline" reveal from the reference hero.
const wordParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const word: Variants = {
  hidden: { y: "110%", opacity: 0, filter: "blur(12px)" },
  show: {
    y: "0%",
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

// Generic fade-up for the supporting chrome (badge, sub-copy, controls, stats).
const fadeUp: Variants = {
  hidden: { y: 28, opacity: 0 },
  show: (delay: number = 0) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

export function CourierHero({ image, line1, line2 }: HeroProps) {
  const ref = useRef<HTMLElement>(null);

  // Scroll-driven cinematic departure: the frame keeps pushing in and drifting up
  // while the copy lifts away and the image dims — you "fly past" the scene.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.32]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const overlay = useTransform(scrollYProgress, [0, 1], [0.45, 0.92]);
  const overlayBg = useMotionTemplate`rgba(8,9,12,${overlay})`;
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Pointer parallax — layers drift opposite the cursor, springed so it feels weighty.
  const px = useSpring(useMotionValue(0), { stiffness: 60, damping: 18, mass: 0.6 });
  const py = useSpring(useMotionValue(0), { stiffness: 60, damping: 18, mass: 0.6 });
  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onMouseLeave = () => {
    px.set(0);
    py.set(0);
  };
  const bgPX = useTransform(px, [-0.5, 0.5], [26, -26]);
  const bgPY = useTransform(py, [-0.5, 0.5], [20, -20]);
  const copyPX = useTransform(px, [-0.5, 0.5], [-14, 14]);
  const copyPY = useTransform(py, [-0.5, 0.5], [-10, 10]);

  return (
    <section
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#08090c] text-white"
    >
      {/* Background plate: continuous Ken Burns drift + scroll zoom + pointer parallax */}
      <motion.div
        style={{ scale: imgScale, y: imgY, x: bgPX, translateY: bgPY }}
        className="absolute inset-0"
      >
        <motion.div
          initial={{ scale: 1.18 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-full w-full"
        >
          <Image
            src={image}
            alt="Aerial view of a container port at dawn"
            fill
            priority
            sizes="100vw"
            className="courier-drift object-cover"
          />
        </motion.div>
      </motion.div>

      {/* Tints: scroll-reactive darkness + fixed cinematic gradients */}
      <motion.div style={{ background: overlayBg }} className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-transparent to-[#08090c]/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#08090c]/85 via-[#08090c]/30 to-transparent" />

      {/* Foreground content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-6 pb-24 pt-28 sm:px-10"
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.1}
          className="mb-7 flex w-fit items-center gap-2.5 rounded-full border border-white/15 bg-white/5 py-1.5 pl-2 pr-4 backdrop-blur"
        >
          <span className="rounded-full bg-[#e0322d] px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white">
            Thailand
          </span>
          <span className="text-xs font-medium tracking-wide text-white/80">
            Door-to-door delivery to 220+ countries
          </span>
        </motion.div>

        <motion.h1
          variants={wordParent}
          initial="hidden"
          animate="show"
          style={{ x: copyPX, y: copyPY }}
          className="max-w-4xl font-sans text-[clamp(2.6rem,8vw,6rem)] font-semibold leading-[0.95] tracking-[-0.03em]"
        >
          <span className="block overflow-hidden pb-[0.12em]">
            {line1.map((w, i) => (
              <span key={i} className="mr-[0.28em] inline-flex overflow-hidden align-bottom">
                <motion.span
                  variants={word}
                  className={w.accent ? "inline-block text-[#e0322d]" : "inline-block"}
                >
                  {w.text}
                </motion.span>
              </span>
            ))}
          </span>
          <span className="block overflow-hidden pb-[0.12em]">
            {line2.map((w, i) => (
              <span key={i} className="mr-[0.28em] inline-flex overflow-hidden align-bottom">
                <motion.span
                  variants={word}
                  className={w.accent ? "inline-block text-[#e0322d]" : "inline-block"}
                >
                  {w.text}
                </motion.span>
              </span>
            ))}
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.95}
          className="mt-7 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg"
        >
          Wyvern Courier clears the customs, the duty and the tax for you. One flat,
          inclusive price — you just track the dragon to your doorstep.
        </motion.p>

        {/* Tracking pill + secondary CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1.1}
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full max-w-sm items-center gap-2 rounded-full border border-white/15 bg-white/10 p-1.5 pl-5 backdrop-blur-md focus-within:border-[#e0322d]/60"
          >
            <Search className="size-4 shrink-0 text-white/50" />
            <input
              type="text"
              placeholder="Enter tracking number"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/45 focus:outline-none"
            />
            <button
              type="submit"
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#e0322d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c4271f]"
            >
              Track <ArrowRight className="size-4" />
            </button>
          </form>
          <a
            href="#quote"
            className="flex items-center justify-center gap-1.5 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/10"
          >
            Get a quote
          </a>
        </motion.div>

        {/* Live stat strip */}
        <motion.dl
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1.3}
          className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/10 pt-6"
        >
          {[
            { v: "40,000+", l: "Monthly shipments" },
            { v: "30 yrs", l: "In Thai logistics" },
            { v: "220+", l: "Countries covered" },
          ].map((s) => (
            <div key={s.l}>
              <dt className="text-2xl font-semibold tracking-tight sm:text-3xl">{s.v}</dt>
              <dd className="mt-0.5 text-xs uppercase tracking-[0.15em] text-white/55">{s.l}</dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/55"
      >
        <span className="text-[0.65rem] uppercase tracking-[0.25em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <MoveDown className="size-4" />
        </motion.span>
      </motion.div>
    </section>
  );
}

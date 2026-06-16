"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowDown } from "lucide-react";

interface HeroProps {
  image: string;
  /** Headline split into lines; each line rises out of its own mask. */
  lines: readonly string[];
}

const lineParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const line: Variants = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};
const fade: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: d },
  }),
};

export function StudioHero({ image, lines }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.16]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex h-[100svh] min-h-[620px] w-full flex-col justify-end overflow-hidden bg-[#15140f] text-[#efe9df]"
    >
      <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0">
        <Image
          src={image}
          alt="Moody glass towers at dusk"
          fill
          priority
          sizes="100vw"
          className="studio-kenburns object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[#15140f]/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#15140f] via-[#15140f]/35 to-[#15140f]/70" />

      {/* Top bar */}
      <motion.header
        variants={fade}
        initial="hidden"
        animate="show"
        custom={0.05}
        className="absolute inset-x-0 top-0 z-20 mx-auto flex max-w-6xl items-center justify-between px-6 py-7 sm:px-10"
      >
        <span className="font-serif text-xl tracking-tight">Nocturne</span>
        <nav className="hidden gap-8 text-xs font-medium uppercase tracking-[0.18em] text-[#efe9df]/70 sm:flex">
          <a href="#work" className="transition hover:text-[#efe9df]">Work</a>
          <a href="#studio" className="transition hover:text-[#efe9df]">Studio</a>
          <a href="#contact" className="transition hover:text-[#efe9df]">Contact</a>
        </nav>
      </motion.header>

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 sm:px-10 sm:pb-24"
      >
        <motion.p
          variants={fade}
          initial="hidden"
          animate="show"
          custom={0.15}
          className="mb-7 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-[#c8a97f]"
        >
          <span className="h-px w-10 bg-[#c8a97f]" />
          Architecture & interiors — since 2009
        </motion.p>

        <motion.h1
          variants={lineParent}
          initial="hidden"
          animate="show"
          className="max-w-4xl font-serif text-[clamp(2.6rem,8.5vw,6.5rem)] font-light leading-[0.98] tracking-[-0.02em]"
        >
          {lines.map((l, i) => (
            <span key={i} className="block overflow-hidden pb-[0.08em]">
              <motion.span variants={line} className="block">
                {l}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.div
          variants={fade}
          initial="hidden"
          animate="show"
          custom={1.05}
          className="mt-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <p className="max-w-md text-base leading-relaxed text-[#efe9df]/70">
            A studio for quiet, durable buildings — designed to age gracefully and
            hold the light from Bangkok to the coast.
          </p>
          <a
            href="#work"
            className="group flex shrink-0 items-center gap-3 text-sm font-medium uppercase tracking-[0.18em]"
          >
            <span className="border-b border-[#c8a97f] pb-1 text-[#c8a97f] transition group-hover:text-[#efe9df]">
              See selected work
            </span>
            <ArrowDown className="size-4 text-[#c8a97f] transition group-hover:translate-y-1" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

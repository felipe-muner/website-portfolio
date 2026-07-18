"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { RAIL_THEMES, type ShowcaseEntry } from "@/lib/layouts/showcase";

/**
 * Horizontal-scroll rail: a tall pinned section whose inner track translates
 * left as the page scrolls down, so a row of looping template videos reads as a
 * sideways scroll. Travel is measured from the real track width (not a guessed
 * percentage) so the last card always lands flush at the right edge.
 */
export function VideoRail({
  entries,
  displayClass,
  monoClass,
}: {
  entries: ShowcaseEntry[];
  displayClass: string;
  monoClass: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);

  // Measure how far the track must slide: its full width minus the viewport,
  // plus the horizontal padding that frames the first and last card.
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setTravel(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [entries.length]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);

  return (
    <section
      ref={sectionRef}
      aria-label="Selected templates"
      // Tall enough that the whole track slides through while pinned; the extra
      // 100vh is the sticky viewport itself.
      style={{ height: `calc(100vh + ${travel}px)` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 z-10 w-full px-6 pt-8 sm:px-10">
          <span className={`${monoClass} text-xs uppercase tracking-[0.3em] text-[#e8590c]`}>
            Selected work · scroll →
          </span>
        </div>

        <motion.div ref={trackRef} style={{ x }} className="flex items-center gap-6 px-6 sm:gap-10 sm:px-10">
          {entries.map((entry, i) => (
            <RailCard key={entry.slug} entry={entry} index={i} displayClass={displayClass} monoClass={monoClass} />
          ))}

          {/* End cap — an invitation to the full grid below */}
          <Link
            href="#grid"
            className="group flex h-[58vh] w-[70vw] shrink-0 flex-col items-center justify-center gap-4 rounded-3xl border border-white/10 bg-white/[0.02] text-center transition-colors hover:bg-white/[0.05] sm:w-[34vw]"
          >
            <span className={`${displayClass} max-w-xs text-3xl leading-tight text-[#f4f1ea] sm:text-4xl`}>
              …and the rest below.
            </span>
            <span className={`${monoClass} text-xs uppercase tracking-[0.25em] text-[#e8590c]`}>
              See all templates ↓
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function RailCard({
  entry,
  index,
  displayClass,
  monoClass,
}: {
  entry: ShowcaseEntry;
  index: number;
  displayClass: string;
  monoClass: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Only play the clip while it's near the viewport — keeps ~10 videos cheap.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (video.readyState === 0) video.load(); // kick the deferred fetch, else play() stalls black
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { root: null, rootMargin: "200px", threshold: 0.1 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  const external = entry.external;
  const theme = RAIL_THEMES[index % RAIL_THEMES.length];

  return (
    <Link
      href={entry.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={{ backgroundColor: theme.bg, boxShadow: `0 0 0 1px ${theme.ring}, 0 40px 90px -45px rgba(0,0,0,0.9)` }}
      className="group relative flex w-[82vw] shrink-0 flex-col rounded-3xl p-4 transition-transform duration-500 hover:-translate-y-1.5 sm:w-[54vw] sm:p-5 lg:w-[46vw]"
    >
      <div className="relative aspect-[1200/790] overflow-hidden rounded-xl bg-[#0e0d0b]" style={{ boxShadow: `0 0 0 1px ${theme.ring}` }}>
        <video
          ref={videoRef}
          src={`/video/rail/${entry.slug}.mp4`}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 block h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 flex h-7 items-center gap-1.5 bg-gradient-to-b from-black/35 to-transparent px-3">
          <span className="size-2 rounded-full" style={{ backgroundColor: theme.dots }} />
          <span className="size-2 rounded-full" style={{ backgroundColor: theme.dots }} />
          <span className="size-2 rounded-full" style={{ backgroundColor: theme.dots }} />
        </div>
      </div>

      <div className="flex items-end justify-between gap-4 px-1 pt-4">
        <div>
          <span className={`${monoClass} text-[0.7rem] uppercase tracking-[0.22em]`} style={{ color: theme.accent }}>
            {String(index + 1).padStart(2, "0")} · {entry.category}
          </span>
          <h3 className={`${displayClass} mt-1 text-2xl sm:text-3xl`} style={{ color: theme.text }}>
            {entry.name}
          </h3>
        </div>
        <span className="mb-1 inline-flex items-center gap-1.5 whitespace-nowrap text-sm transition-transform group-hover:translate-x-0.5" style={{ color: theme.sub }}>
          {external ? "Live site" : "View live"}
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}

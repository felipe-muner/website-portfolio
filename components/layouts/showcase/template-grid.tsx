"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ShowcaseEntry } from "@/lib/layouts/showcase";

const ALL = "All";

/**
 * Every template in one filterable grid. Cards with a rendered clip loop it
 * while they are on screen; the rest slowly pan their full-page screenshot on
 * hover, so each card shows more than its first fold.
 */
export function TemplateGrid({
  entries,
  videoSlugs,
  displayClass,
}: {
  entries: ShowcaseEntry[];
  videoSlugs: string[];
  displayClass: string;
}) {
  const [category, setCategory] = useState(ALL);
  const videos = useMemo(() => new Set(videoSlugs), [videoSlugs]);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of entries) counts.set(e.category, (counts.get(e.category) ?? 0) + 1);
    return [[ALL, entries.length] as const, ...counts.entries()];
  }, [entries]);

  const shown = category === ALL ? entries : entries.filter((e) => e.category === category);

  return (
    <>
      <div className="sticky top-0 z-20 -mx-6 mt-8 bg-[#0e0d0b]/85 px-6 py-4 backdrop-blur-md sm:-mx-10 sm:px-10">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none]">
          {categories.map(([label, count]) => {
            const on = label === category;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setCategory(label)}
                aria-pressed={on}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  on
                    ? "border-[#e8590c] bg-[#e8590c] text-[#0e0d0b]"
                    : "border-white/15 text-[#f4f1ea]/70 hover:border-white/35 hover:text-[#f4f1ea]"
                }`}
              >
                {label}
                <span className={`ml-2 tabular-nums ${on ? "text-[#0e0d0b]/60" : "text-[#f4f1ea]/35"}`}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <motion.div layout className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((entry) => (
            <motion.div
              key={entry.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card entry={entry} video={videos.has(entry.slug)} displayClass={displayClass} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

function Card({ entry, video, displayClass }: { entry: ShowcaseEntry; video: boolean; displayClass: string }) {
  return (
    <Link
      href={entry.href}
      target={entry.external ? "_blank" : undefined}
      rel={entry.external ? "noopener noreferrer" : undefined}
      className="group relative block overflow-hidden rounded-2xl bg-[#161311] ring-1 ring-white/10 transition-colors hover:ring-white/25"
    >
      <div className="relative aspect-[1200/790] overflow-hidden">
        {video ? <LoopClip entry={entry} /> : <PanShot entry={entry} />}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#161311] to-transparent" />
        {video && (
          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#f4f1ea] backdrop-blur">
            <span className="size-1.5 animate-pulse rounded-full bg-[#e8590c]" />
            Live
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-3 p-5 pt-3">
        <div className="min-w-0">
          <span className="text-[0.68rem] uppercase tracking-[0.2em] text-[#e8590c]">{entry.category}</span>
          <h3 className={`${displayClass} mt-1 text-xl text-[#f4f1ea]`}>{entry.name}</h3>
          <p className="mt-1 truncate text-sm text-[#f4f1ea]/50">{entry.detail}</p>
        </div>
        <ArrowUpRight className="mb-1 size-5 shrink-0 text-[#f4f1ea]/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#e8590c]" />
      </div>
    </Link>
  );
}

/** Scroll-through clip that only plays (and only downloads) while on screen. */
function LoopClip({ entry }: { entry: ShowcaseEntry }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) el.play().catch(() => undefined);
        else el.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <video
      ref={ref}
      src={`/video/rail/${entry.slug}.mp4`}
      poster={`/img/rail/${entry.slug}.webp`}
      muted
      loop
      playsInline
      preload="none"
      aria-label={`${entry.brand} — ${entry.detail}`}
      className="absolute inset-0 size-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
    />
  );
}

/** Full-page screenshot that glides from top to bottom on hover. */
function PanShot({ entry }: { entry: ShowcaseEntry }) {
  return (
    <Image
      src={`/img/rail/${entry.slug}.webp`}
      alt={`${entry.brand} — ${entry.detail}`}
      fill
      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
      className="object-cover object-top transition-[object-position] duration-[6s] ease-in-out group-hover:object-bottom"
    />
  );
}

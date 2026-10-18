"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { hasRailVideo, type ShowcaseEntry } from "@/lib/layouts/showcase";

/** How many cards are visible at first, and how many each "See more" adds. */
const PAGE = 6;

/* Card width per breakpoint — shared by previews and the trailing tile. */
const CARD_W = "w-[84vw] sm:w-[58vw] lg:w-[min(44vw,40rem)]";

/**
 * A horizontal, swipeable rail of templates. It does NOT hijack vertical
 * scroll: the section is normal height, so a visitor can flick through a few
 * examples and then keep scrolling down the page (and come back later). Only
 * the first {@link PAGE} cards load up front; reaching the right end reveals a
 * "See more" tile that appends another {@link PAGE}, so nobody is forced
 * through the entire shelf at once.
 */
export function TemplateRail({ entries }: { entries: ShowcaseEntry[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(PAGE);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const shown = entries.slice(0, visible);
  const hasMore = visible < entries.length;

  // Track scroll position so the arrow buttons can dim at each edge.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const update = () => {
      setAtStart(el.scrollLeft <= 4);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [visible]);

  const nudge = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const loadMore = () => {
    setVisible((v) => Math.min(v + PAGE, entries.length));
    // Let the new cards mount, then slide toward them.
    requestAnimationFrame(() => nudge(1));
  };

  return (
    <section id="templates" className="relative scroll-mt-24 pb-12 pt-20 sm:pb-16 sm:pt-28">
      <div className="mx-auto flex max-w-[1440px] items-end justify-between gap-10 px-5 pb-10 sm:px-8 sm:pb-12 lg:px-12">
        <div>
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-[#8ea8ff]">
            <span className="size-1.5 rounded-full bg-[#4f7cff] shadow-[0_0_10px_2px_rgba(79,124,255,0.7)]" />
            Showing {shown.length} of {entries.length} · swipe →
          </span>
          <h2 className="mt-5 text-balance text-[2.6rem] font-light leading-[1.02] tracking-[-0.04em] sm:text-6xl">
            Every design, <span className="font-serif italic text-white/55">in motion.</span>
          </h2>
        </div>
        <div className="hidden items-center gap-6 lg:flex">
          <p className="max-w-xs text-sm leading-relaxed text-white/50">
            Each preview scrolls itself, just like a visitor would. Click any card to open the
            real, working demo.
          </p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => nudge(-1)}
              disabled={atStart}
              aria-label="Previous templates"
              className="grid size-12 place-items-center rounded-full border border-white/15 bg-white/[0.03] transition hover:border-white/30 hover:bg-white/[0.07] disabled:opacity-30"
            >
              <ArrowLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              disabled={atEnd}
              aria-label="More templates"
              className="grid size-12 place-items-center rounded-full border border-white/15 bg-white/[0.03] transition hover:border-white/30 hover:bg-white/[0.07] disabled:opacity-30"
            >
              <ArrowRight className="size-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scroller}
        className="flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto scroll-smooth px-5 pb-6 [scrollbar-width:none] sm:gap-6 sm:px-8 lg:px-[max(3rem,calc((100vw_-_1440px)/2_+_3rem))] [&::-webkit-scrollbar]:hidden"
      >
        {shown.map((entry, i) => (
          <PreviewCard key={entry.slug} entry={entry} index={i} />
        ))}

        {hasMore ? (
          <button
            type="button"
            onClick={loadMore}
            className={`group flex ${CARD_W} shrink-0 snap-center flex-col items-center justify-center gap-4 rounded-[28px] border border-dashed border-white/15 p-10 text-center transition-colors hover:border-[#4f7cff]/60 hover:bg-[#4f7cff]/[0.06]`}
          >
            <span className="grid size-14 place-items-center rounded-full bg-[#2f5bff] text-white shadow-[0_0_40px_-6px_rgba(79,124,255,0.8)] transition-transform group-hover:scale-110">
              <Plus className="size-6" />
            </span>
            <span className="text-3xl font-light tracking-[-0.03em] sm:text-4xl">See more</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
              {entries.length - visible} more · load {Math.min(PAGE, entries.length - visible)}
            </span>
          </button>
        ) : (
          <Link
            href="#contact"
            className={`group relative flex ${CARD_W} shrink-0 snap-center flex-col items-center justify-center gap-4 overflow-hidden rounded-[28px] bg-[#2f5bff] p-10 text-center text-white`}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(255,255,255,0.28),transparent)]"
            />
            <span className="relative max-w-[16ch] text-4xl font-light leading-tight tracking-[-0.03em] sm:text-5xl">
              Found one you <span className="font-serif italic">love?</span>
            </span>
            <span className="relative font-mono text-[11px] uppercase tracking-[0.22em] text-white/80">
              Let&apos;s make it yours →
            </span>
          </Link>
        )}
      </div>
    </section>
  );
}

function PreviewCard({ entry, index }: { entry: ShowcaseEntry; index: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const video = hasRailVideo(entry.slug);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        const v = videoRef.current;
        if (!v) return;
        if (e.isIntersecting) {
          if (v.readyState === 0) v.load();
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { root: null, rootMargin: "300px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Link
      href={entry.href}
      target={entry.external ? "_blank" : undefined}
      rel={entry.external ? "noopener noreferrer" : undefined}
      draggable={false}
      className={`group flex ${CARD_W} shrink-0 snap-center flex-col rounded-[28px] border border-white/10 bg-[#090b16] p-3 transition duration-500 hover:-translate-y-1.5 hover:border-[#4f7cff]/40 hover:shadow-[0_40px_90px_-45px_rgba(79,124,255,0.7)] sm:p-3.5`}
    >
      <div ref={wrap} className="relative aspect-[1200/790] overflow-hidden rounded-[20px] bg-[#05060d] ring-1 ring-white/10">
        {video ? (
          <video
            ref={videoRef}
            src={`/video/rail/${entry.slug}.mp4`}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 block h-full w-full object-cover"
          />
        ) : (
          <Image
            src={`/img/rail/${entry.slug}.webp`}
            alt={`${entry.name} — ${entry.detail}`}
            fill
            sizes="(min-width: 1024px) 44vw, (min-width: 640px) 58vw, 84vw"
            className={`object-cover object-top ${inView ? "rail-pan" : ""}`}
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex h-7 items-center gap-1.5 bg-gradient-to-b from-black/45 to-transparent px-3">
          <span className="size-2 rounded-full bg-white/30" />
          <span className="size-2 rounded-full bg-white/30" />
          <span className="size-2 rounded-full bg-white/30" />
        </div>
        {entry.external && (
          <span className="absolute right-3 top-3 rounded-full bg-[#2f5bff] px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-white">
            Live site
          </span>
        )}
      </div>

      <div className="flex items-end justify-between gap-4 px-2 pb-1.5 pt-5">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8ea8ff]">
            {String(index + 1).padStart(2, "0")} · {entry.category}
          </span>
          <h3 className="mt-2 text-2xl tracking-[-0.02em] text-white sm:text-[1.75rem]">{entry.name}</h3>
          <p className="mt-1 text-sm text-white/50">{entry.detail}</p>
        </div>
        <span className="mb-1 inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-white/70 transition-colors group-hover:border-white/25 group-hover:text-white">
          {entry.external ? "Live site" : "View live"}
          <ArrowUpRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}

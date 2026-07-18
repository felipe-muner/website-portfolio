"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { hasRailVideo, type ShowcaseEntry } from "@/lib/layouts/showcase";

/* Light section, darker card boxes — the cards read as distinct panels. */
const SECTION_BG = "#efe7d6";
const CARD = {
  bg: "#211d18",
  text: "#f4f1ea",
  sub: "rgba(244,241,234,0.55)",
  accent: "#fb923c",
  dots: "rgba(255,255,255,0.28)",
};

/** How many cards are visible at first, and how many each "See more" adds. */
const PAGE = 6;

/**
 * A horizontal, swipeable rail of templates. It does NOT hijack vertical
 * scroll: the section is normal height, so a visitor can flick through a few
 * examples and then keep scrolling down the page (and come back later). Only
 * the first {@link PAGE} cards load up front; reaching the right end reveals a
 * "See more" tile that appends another {@link PAGE}, so nobody is forced
 * through the entire shelf at once.
 */
export function TemplateRail({
  entries,
  displayClass,
}: {
  entries: ShowcaseEntry[];
  displayClass: string;
}) {
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
    <section
      id="templates"
      style={{ backgroundColor: SECTION_BG }}
      className="relative scroll-mt-20 py-20 text-[#17130f] sm:py-24"
    >
      <div className="flex items-start justify-between px-6 pb-8 sm:px-10">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-[#c2410c]">
            Showing {shown.length} of {entries.length} · swipe →
          </span>
          <h2 className={`${displayClass} mt-2 text-3xl leading-none sm:text-5xl`}>
            Every design, <span className="italic">in motion.</span>
          </h2>
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <p className="max-w-xs text-sm text-[#17130f]/55">
            Each preview scrolls itself, just like a visitor would. Click any card to open the
            real, working demo.
          </p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => nudge(-1)}
              disabled={atStart}
              aria-label="Previous templates"
              className="grid size-11 place-items-center rounded-full border border-black/15 transition-opacity hover:bg-black/5 disabled:opacity-30"
            >
              <ArrowLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              disabled={atEnd}
              aria-label="More templates"
              className="grid size-11 place-items-center rounded-full border border-black/15 transition-opacity hover:bg-black/5 disabled:opacity-30"
            >
              <ArrowRight className="size-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scroller}
        className="flex snap-x snap-mandatory items-stretch gap-6 overflow-x-auto scroll-smooth px-6 pb-4 [scrollbar-width:none] sm:gap-8 sm:px-10 [&::-webkit-scrollbar]:hidden"
      >
        {shown.map((entry, i) => (
          <PreviewCard key={entry.slug} entry={entry} index={i} displayClass={displayClass} />
        ))}

        {hasMore ? (
          <button
            type="button"
            onClick={loadMore}
            className="group flex w-[80vw] shrink-0 snap-center flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-black/25 bg-transparent p-10 text-center text-[#17130f] transition-colors hover:border-[#e8590c] hover:bg-[#e8590c]/5 sm:w-[54vw] lg:w-[42vw]"
          >
            <span className="grid size-14 place-items-center rounded-full bg-[#e8590c] text-[#f4f1ea] transition-transform group-hover:scale-110">
              <Plus className="size-6" />
            </span>
            <span className={`${displayClass} text-3xl leading-tight sm:text-4xl`}>See more</span>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#17130f]/55">
              {entries.length - visible} more · load {Math.min(PAGE, entries.length - visible)}
            </span>
          </button>
        ) : (
          <Link
            href="#contact"
            className="group flex w-[80vw] shrink-0 snap-center flex-col items-center justify-center gap-3 rounded-3xl bg-[#e8590c] p-10 text-center text-[#0b0a09] sm:w-[54vw] lg:w-[42vw]"
          >
            <span className={`${displayClass} max-w-[16ch] text-4xl leading-tight sm:text-5xl`}>
              Found one you love?
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.2em]">Let&apos;s make it yours →</span>
          </Link>
        )}
      </div>
    </section>
  );
}

function PreviewCard({
  entry,
  index,
  displayClass,
}: {
  entry: ShowcaseEntry;
  index: number;
  displayClass: string;
}) {
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
      style={{ backgroundColor: CARD.bg, boxShadow: "0 24px 60px -30px rgba(0,0,0,0.55)" }}
      className="group flex w-[80vw] shrink-0 snap-center flex-col overflow-hidden rounded-3xl p-4 ring-1 ring-black/10 transition-transform duration-500 hover:-translate-y-1.5 sm:w-[58vw] sm:p-5 lg:w-[46vw]"
    >
      <div ref={wrap} className="relative aspect-[1200/790] overflow-hidden rounded-xl bg-[#0e0d0b] ring-1 ring-white/10">
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
            sizes="(min-width: 1024px) 46vw, (min-width: 640px) 58vw, 80vw"
            className={`object-cover object-top ${inView ? "rail-pan" : ""}`}
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex h-7 items-center gap-1.5 bg-gradient-to-b from-black/35 to-transparent px-3">
          <span className="size-2 rounded-full" style={{ backgroundColor: CARD.dots }} />
          <span className="size-2 rounded-full" style={{ backgroundColor: CARD.dots }} />
          <span className="size-2 rounded-full" style={{ backgroundColor: CARD.dots }} />
        </div>
        {entry.external && (
          <span className="absolute right-3 top-3 rounded-full px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wide" style={{ backgroundColor: CARD.accent, color: CARD.bg }}>
            Live site
          </span>
        )}
      </div>

      <div className="flex items-end justify-between gap-4 px-1 pt-4">
        <div>
          <span className="text-[0.7rem] uppercase tracking-[0.22em]" style={{ color: CARD.accent }}>
            {String(index + 1).padStart(2, "0")} · {entry.category}
          </span>
          <h3 className={`${displayClass} mt-1 text-2xl sm:text-3xl`} style={{ color: CARD.text }}>
            {entry.name}
          </h3>
          <p className="mt-0.5 text-sm" style={{ color: CARD.sub }}>
            {entry.detail}
          </p>
        </div>
        <span className="mb-1 inline-flex items-center gap-1.5 whitespace-nowrap text-sm transition-transform group-hover:translate-x-0.5" style={{ color: CARD.sub }}>
          {entry.external ? "Live site" : "View live"}
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}

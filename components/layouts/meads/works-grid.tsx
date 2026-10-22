"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Brush, MessageCircle, X } from "lucide-react";
import { HERO_WORKS, SERIES, STATUS_LABEL, WORKS, type Series, type Work } from "@/lib/layouts/meads";
import { chooseWork, startCommission } from "./events";

type Filter = "All" | Series;
const FILTERS: readonly Filter[] = ["All", ...SERIES];
const PAINTABLE = new Set(HERO_WORKS.map((w) => w.slug));

const STATUS_TONE: Record<Work["status"], string> = {
  available: "bg-[#42c8c0]/15 text-[#7fe3dc]",
  sold: "bg-white/8 text-white/55",
  commission: "bg-[#e9b44c]/15 text-[#f0c76d]",
};

/**
 * Artist · Maria Meads — every work, filtered by series, in a masonry of
 * true aspect ratios. Tap one for the full image and its statement; from
 * there it can go onto the hero canvas or into a commission enquiry.
 */
export function WorksGrid() {
  const [filter, setFilter] = useState<Filter>("All");
  const [open, setOpen] = useState<Work | null>(null);
  const shown = filter === "All" ? WORKS : WORKS.filter((w) => w.series === filter);

  return (
    <>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Series">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={`h-10 rounded-full border px-4 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
              filter === f ? "border-[#e9b44c] bg-[#e9b44c] text-[#120d14]" : "border-white/12 text-white/65 hover:border-white/35 hover:text-white"
            }`}
          >
            {f}
            <span className="ml-2 opacity-60">{f === "All" ? WORKS.length : WORKS.filter((w) => w.series === f).length}</span>
          </button>
        ))}
      </div>

      <ul className="mt-10 columns-2 gap-4 sm:columns-3 lg:columns-4 [&>li]:mb-4 [&>li]:break-inside-avoid">
        {shown.map((w) => (
          <li key={w.slug}>
            <button
              type="button"
              onClick={() => setOpen(w)}
              className="group relative block w-full overflow-hidden rounded-xl bg-[#1a131e] text-left outline-none ring-[#e9b44c] focus-visible:ring-2"
              style={{ aspectRatio: w.aspect }}
            >
              <Image
                src={w.image}
                alt={`${w.title} — ${w.medium}`}
                fill
                sizes="(min-width: 1024px) 24vw, (min-width: 640px) 32vw, 48vw"
                className="object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#120d14]/90 via-[#120d14]/10 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
              <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
                <div>
                  <p className="font-display text-lg leading-tight text-[#f3ead9] sm:text-xl">{w.title}</p>
                  <p className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/55">
                    {w.series} · {w.year}
                  </p>
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-[#e9b44c] opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </button>
          </li>
        ))}
      </ul>

      <Lightbox work={open} onClose={() => setOpen(null)} />
    </>
  );
}

function Lightbox({ work, onClose }: { work: Work | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (work && !d.open) d.showModal();
    if (!work && d.open) d.close();
  }, [work]);

  const toHero = () => {
    if (!work) return;
    chooseWork(work.slug);
    onClose();
    document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
  };

  const toCommission = () => {
    if (!work) return;
    startCommission({
      type: work.series === "Wearable art" ? "Hand-painted denim" : work.series === "Soul portraits" ? "Soul portrait" : "Custom canvas",
      note: work.status === "available" ? `I'm interested in the original of "${work.title}".` : `Something in the spirit of "${work.title}".`,
    });
    onClose();
    document.getElementById("commission")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-auto w-[min(96vw,72rem)] max-w-none overflow-hidden rounded-2xl border border-white/10 bg-[#120d14] p-0 text-[#f3ead9] shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      {work && (
        <div className="grid max-h-[92vh] grid-rows-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:grid-rows-1">
          <div className="relative min-h-[46vh] bg-[#0c090e] lg:min-h-0">
            <Image src={work.image} alt={work.title} fill sizes="(min-width: 1024px) 60vw, 96vw" className="object-contain p-3 sm:p-6" priority />
          </div>
          <div className="flex flex-col gap-5 overflow-y-auto p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#e9b44c]">{work.series}</p>
                <h3 className="font-display mt-2 text-4xl leading-none sm:text-5xl">{work.title}</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid size-10 shrink-0 place-items-center rounded-full border border-white/12 text-white/70 transition-colors hover:border-white/40 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>
            <dl className="grid grid-cols-3 gap-3 border-y border-white/10 py-4 font-mono text-[10.5px] uppercase tracking-[0.16em]">
              <div>
                <dt className="text-white/40">Medium</dt>
                <dd className="mt-1 text-white/80">{work.medium}</dd>
              </div>
              <div>
                <dt className="text-white/40">Size</dt>
                <dd className="mt-1 text-white/80">{work.size}</dd>
              </div>
              <div>
                <dt className="text-white/40">Year</dt>
                <dd className="mt-1 text-white/80">{work.year}</dd>
              </div>
            </dl>
            <p className="text-[15px] leading-relaxed text-white/70">{work.statement}</p>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${STATUS_TONE[work.status]}`}>
                {STATUS_LABEL[work.status]}
              </span>
              {work.print && (
                <a
                  href="#prints"
                  onClick={onClose}
                  className="rounded-full bg-white/8 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/70 transition-colors hover:bg-white/15"
                >
                  Print available
                </a>
              )}
            </div>
            <div className="mt-auto flex flex-wrap gap-3 pt-2">
              {PAINTABLE.has(work.slug) && (
                <button
                  type="button"
                  onClick={toHero}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-[#e9b44c] px-5 text-sm font-semibold text-[#120d14] transition-colors hover:bg-[#f3ead9]"
                >
                  <Brush className="size-4" /> Paint it yourself
                </button>
              )}
              <button
                type="button"
                onClick={toCommission}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-sm text-white/85 transition-colors hover:border-[#e9b44c] hover:text-[#e9b44c]"
              >
                <MessageCircle className="size-4" /> {work.status === "available" ? "Ask about the original" : "Commission something like it"}
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

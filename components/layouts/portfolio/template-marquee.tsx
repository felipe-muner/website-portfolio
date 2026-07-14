"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import type { PortfolioSite } from "@/lib/layouts/registry";

const WHATSAPP = "5521984852802";

function wantLink(site: PortfolioSite) {
  const text = site.external
    ? `Hi Felipe! I want a site like "${site.name}" (${site.href}) for my business.`
    : `Hi Felipe! I want the "${site.name}" template (${site.href}) for my business.`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

/** A template sold as a product: cover framed in browser chrome, demo link + WhatsApp quick-buy. */
function Card({
  site,
  displayClass,
  monoClass,
}: {
  site: PortfolioSite;
  displayClass: string;
  monoClass: string;
}) {
  const newTab = site.external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e3e8ea] bg-white transition hover:-translate-y-1 hover:shadow-[0_24px_48px_-28px_rgba(12,35,64,0.45)]">
      <Link href={site.href} className="block" {...newTab}>
        <div className="flex items-center gap-2 border-b border-[#e3e8ea] bg-[#f4f6f6] px-3 py-2">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff5a3c]" />
            <span className="size-2.5 rounded-full bg-[#ffd166]" />
            <span className="size-2.5 rounded-full bg-[#2fbf8f]" />
          </span>
          <span
            className={`${monoClass} flex-1 truncate rounded-md bg-white px-2 py-0.5 text-[0.65rem] text-[#5c6b77]`}
          >
            {site.href.replace(/^https?:\/\//, "")}
          </span>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={site.cover}
            alt={site.brand}
            fill
            sizes="20rem"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          <h3 className={`${displayClass} text-lg text-[#16232f]`}>{site.name}</h3>
          {site.external && (
            <span
              className={`${monoClass} rounded-full bg-[#0e7c66]/10 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-[#0e7c66]`}
            >
              In production
            </span>
          )}
        </div>
        <p className="mt-1 flex-1 text-sm leading-snug text-[#5c6b77]">{site.detail}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <Link
            href={site.href}
            {...newTab}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0c2340] hover:text-[#ff5a3c]"
          >
            {site.external ? "Open live site" : "Open live demo"}{" "}
            <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <a
            href={wantLink(site)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`I want the ${site.name} template — WhatsApp`}
            title="I want this one"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#0e7c66] text-white transition hover:bg-[#0a5f4f]"
          >
            <MessageCircle className="size-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * A category's templates drift by in a slow continuous loop. Hovering (desktop)
 * or touching and holding (mobile) pauses the scroll. `reverse` flips the travel
 * direction so alternating shelves scroll opposite ways. The list is repeated so
 * the -50% loop stays seamless on wide viewports.
 */
export function TemplateMarquee({
  sites,
  reverse = false,
  displayClass,
  monoClass,
}: {
  sites: readonly PortfolioSite[];
  reverse?: boolean;
  displayClass: string;
  monoClass: string;
}) {
  const [paused, setPaused] = useState(false);

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#eef2f3] to-transparent sm:w-24"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#eef2f3] to-transparent sm:w-24"
      />
      <div
        className="marquee-viewport overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        onTouchCancel={() => setPaused(false)}
      >
        <div
          className="marquee-track"
          style={
            {
              "--marquee-duration": "90s",
              animationPlayState: paused ? "paused" : "running",
              animationDirection: reverse ? "reverse" : "normal",
            } as React.CSSProperties
          }
        >
          {[0, 1, 2, 3].map((copy) => (
            <ul key={copy} aria-hidden={copy > 0} className="flex shrink-0 items-stretch gap-5 pr-5">
              {sites.map((site) => (
                <li key={site.href} className="w-72 sm:w-80">
                  <Card site={site} displayClass={displayClass} monoClass={monoClass} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}

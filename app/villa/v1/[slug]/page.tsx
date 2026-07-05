"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Jost, Prata } from "next/font/google";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
  Users,
  X,
} from "lucide-react";
import { useVillaStore } from "@/lib/layouts/villa/store";
import { AZURE } from "@/lib/layouts/villa/theme";
import { CONTACT } from "@/lib/layouts/content";

const display = Prata({ subsets: ["latin"], weight: "400" });
const body = Jost({ subsets: ["latin"], weight: ["300", "400", "600"] });

export default function VillaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { getBySlug, hydrated } = useVillaStore();
  const villa = getBySlug(slug);
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!villa) {
    return (
      <div className={`${body.className} grid min-h-dvh place-items-center px-5 text-center`} style={{ backgroundColor: AZURE.ivory, color: AZURE.teal }}>
        <div>
          <p className={`${display.className} text-4xl`}>Villa not found</p>
          <p className="mt-2 text-sm" style={{ color: `${AZURE.teal}99` }}>
            {hydrated ? "This villa may have been removed or isn't published yet." : "Loading…"}
          </p>
          <Link href="/villa/v1" className="mt-6 inline-flex items-center gap-2 border-b-2 pb-1 text-sm font-semibold uppercase tracking-[0.2em]" style={{ borderColor: AZURE.gold }}>
            <ArrowLeft className="size-4" /> Back to all villas
          </Link>
        </div>
      </div>
    );
  }

  const photos = villa.photos.length ? villa.photos : [villa.coverImage];
  const showLightbox = (i: number) => setLightbox(i);
  const step = (dir: -1 | 1) =>
    setLightbox((i) => (i === null ? i : (i + dir + photos.length) % photos.length));

  return (
    <div className={`${body.className}`} style={{ backgroundColor: AZURE.ivory, color: AZURE.teal }}>
      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b bg-[color:var(--ivory)]/90 backdrop-blur" style={{ borderColor: `${AZURE.teal}14`, ["--ivory" as string]: AZURE.ivory }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="/villa/v1" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] transition hover:opacity-70">
            <ArrowLeft className="size-4" /> All villas
          </Link>
          <Link href="/villa/v1" className={`${display.className} text-xl tracking-[0.06em]`}>
            Azure <span style={{ color: AZURE.gold }}>Villas</span>
          </Link>
          <a href="#book" className="hidden border px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition hover:bg-[color:var(--gold)] hover:text-white sm:inline-block" style={{ borderColor: AZURE.gold, ["--gold" as string]: AZURE.gold }}>
            Enquire
          </a>
        </div>
      </header>

      {/* Hero cover */}
      <section className="relative h-[52vh] min-h-[360px] w-full overflow-hidden text-white">
        <Image src={villa.coverImage} alt={villa.name} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-5 pb-8 md:px-8 md:pb-12">
          {!villa.published && (
            <span className="mb-3 inline-block bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0e4a5a]">
              Draft — not yet published
            </span>
          )}
          <p className="flex items-center gap-2 text-sm uppercase tracking-[0.3em]" style={{ color: AZURE.gold }}>
            <MapPin className="size-4" /> {villa.location}
          </p>
          <h1 className={`${display.className} mt-2 text-5xl leading-tight md:text-7xl`}>{villa.name}</h1>
          <p className="mt-2 text-lg font-light text-white/90">{villa.tagline}</p>
        </div>
      </section>

      {/* Quick facts bar */}
      <section className="border-b" style={{ borderColor: `${AZURE.teal}14`, backgroundColor: "#fff" }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-8">
          <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
            <span className="flex items-center gap-2"><BedDouble className="size-5" style={{ color: AZURE.gold }} /> {villa.bedrooms} bedrooms</span>
            <span className="flex items-center gap-2"><Bath className="size-5" style={{ color: AZURE.gold }} /> {villa.bathrooms} bathrooms</span>
            <span className="flex items-center gap-2"><Users className="size-5" style={{ color: AZURE.gold }} /> up to {villa.guests} guests</span>
            <span
              className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider"
              style={villa.status === "available"
                ? { backgroundColor: "#e6f4ea", color: "#1c7a43" }
                : { backgroundColor: "#f7e9e3", color: "#b4593a" }}
            >
              {villa.status === "available" ? "Available" : "Booked"}
            </span>
          </div>
          <div className="text-right">
            <span className={`${display.className} text-3xl`}>฿{villa.pricePerNight.toLocaleString()}</span>
            <span className="text-sm" style={{ color: `${AZURE.teal}99` }}> / night</span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-14 md:grid-cols-[1.6fr_1fr] md:px-8 md:py-20">
        <div>
          <h2 className={`${display.className} text-3xl`}>The stay</h2>
          <p className="mt-4 whitespace-pre-line text-lg font-light leading-relaxed" style={{ color: `${AZURE.teal}cc` }}>
            {villa.story || villa.description}
          </p>

          {villa.features.length > 0 && (
            <>
              <h3 className={`${display.className} mt-12 text-2xl`}>What&rsquo;s included</h3>
              <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {villa.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full" style={{ backgroundColor: `${AZURE.gold}22` }}>
                      <Check className="size-3.5" style={{ color: AZURE.gold }} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Booking card */}
        <aside id="book" className="h-max md:sticky md:top-24">
          <div className="bg-white p-7 shadow-lg shadow-black/5" style={{ border: `1px solid ${AZURE.teal}14` }}>
            <div className="flex items-center gap-1" style={{ color: AZURE.gold }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </div>
            <p className={`${display.className} mt-3 text-2xl`}>Enquire about {villa.name}</p>
            <p className="mt-2 text-sm" style={{ color: `${AZURE.teal}99` }}>
              Tell us your dates and we&rsquo;ll confirm availability, rates and everything you need to arrive.
            </p>
            <a
              href={CONTACT.phoneHref}
              className="mt-6 block w-full py-3.5 text-center text-sm font-semibold uppercase tracking-[0.2em] text-[#0e4a5a] transition hover:opacity-90"
              style={{ backgroundColor: AZURE.gold }}
            >
              Check availability
            </a>
            <Link
              href="/villa/v1#book"
              className="mt-3 block w-full border py-3 text-center text-sm font-semibold uppercase tracking-[0.2em] transition hover:bg-black/[0.02]"
              style={{ borderColor: `${AZURE.teal}26` }}
            >
              Open booking calendar
            </Link>
            <p className="mt-4 text-center text-xs" style={{ color: `${AZURE.teal}80` }}>
              {CONTACT.phone}
            </p>
          </div>
        </aside>
      </section>

      {/* Gallery */}
      {photos.length > 1 && (
        <section className="mx-auto max-w-6xl px-5 pb-20 md:px-8">
          <h2 className={`${display.className} text-3xl`}>Gallery</h2>
          <div className="mt-6 grid grid-cols-2 gap-2.5 md:grid-cols-3">
            {photos.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => showLightbox(i)}
                className={`group relative overflow-hidden ${i === 0 ? "col-span-2 row-span-2 aspect-[4/3] md:aspect-square" : "aspect-square"}`}
              >
                <Image src={src} alt={`${villa.name} — photo ${i + 1}`} fill sizes="(min-width:768px) 33vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-14 text-white" style={{ backgroundColor: AZURE.teal }}>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 text-center md:px-8">
          <p className={`${display.className} text-3xl`}>The bay is waiting.</p>
          <Link href="/villa/v1" className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-white/85 transition hover:text-white">
            <ArrowLeft className="size-4" /> Back to all villas
          </Link>
          <p className="text-xs uppercase tracking-[0.3em] text-white/55">Azure Villas — fictional demo · Villa layout 1</p>
        </div>
      </footer>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90" role="dialog" aria-modal="true">
          <button type="button" onClick={() => setLightbox(null)} className="absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20" aria-label="Close">
            <X className="size-6" />
          </button>
          <button type="button" onClick={() => step(-1)} className="absolute left-3 grid size-12 place-items-center rounded-full text-white/80 transition hover:bg-white/10 md:left-6" aria-label="Previous">
            <ChevronLeft className="size-8" />
          </button>
          <div className="relative h-[80vh] w-[92vw] max-w-5xl">
            <Image src={photos[lightbox]} alt={`${villa.name} — photo ${lightbox + 1}`} fill sizes="92vw" className="object-contain" />
          </div>
          <button type="button" onClick={() => step(1)} className="absolute right-3 grid size-12 place-items-center rounded-full text-white/80 transition hover:bg-white/10 md:right-6" aria-label="Next">
            <ChevronRight className="size-8" />
          </button>
          <span className="absolute bottom-5 text-sm text-white/70">{lightbox + 1} / {photos.length}</span>
        </div>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fraunces, Archivo } from "next/font/google";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { LenisScroll } from "@/components/layouts/showcase/lenis-scroll";
import { VideoRail } from "@/components/layouts/showcase/video-rail";
import { RAIL, GRID, TOTAL } from "@/lib/layouts/showcase";

const display = Fraunces({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"] });
const body = Archivo({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const WHATSAPP = "5521984852802";

export const metadata: Metadata = {
  title: `Showcase — ${TOTAL} live website templates`,
  description: `A scroll through ${TOTAL} fully working website designs — gyms, yoga studios, villas, restaurants and more. Pick one and I'll make it yours.`,
  robots: { index: false },
};

export default function ShowcasePage() {
  return (
    <div className={`${body.className} min-h-dvh bg-[#0e0d0b] text-[#f4f1ea] antialiased`}>
      <LenisScroll />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative flex min-h-dvh flex-col justify-between overflow-hidden px-6 pb-10 pt-8 sm:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(80% 55% at 50% -5%, rgba(232,89,12,0.20) 0%, rgba(232,89,12,0) 60%), radial-gradient(60% 40% at 90% 110%, rgba(232,89,12,0.10) 0%, rgba(232,89,12,0) 60%)",
          }}
        />

        <header className="relative flex items-center justify-between">
          <span className={`${display.className} text-lg italic text-[#f4f1ea]`}>Felipe Muner</span>
          <nav className="flex items-center gap-6 text-sm text-[#f4f1ea]/60">
            <Link href="/portfolio" className="transition-colors hover:text-[#f4f1ea]">
              All templates
            </Link>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#f4f1ea]">
              Contact
            </a>
          </nav>
        </header>

        <div className="relative max-w-5xl">
          <span className="text-xs uppercase tracking-[0.35em] text-[#e8590c]">
            {TOTAL} live designs · one week each
          </span>
          <h1 className={`${display.className} mt-6 text-[3.25rem] font-medium leading-[0.95] tracking-tight sm:text-8xl`}>
            Your dream website,{" "}
            <span className="italic text-[#e8590c]">already&nbsp;built.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-[#f4f1ea]/70">
            A shelf of real, working websites for gyms, studios, villas and local
            businesses. Scroll through a few of them — every one is live code you can
            click, not a mockup.
          </p>
        </div>

        <div className="relative flex items-center gap-3 text-sm text-[#f4f1ea]/50">
          <ArrowDown className="size-4 animate-bounce" />
          Scroll to explore
        </div>
      </section>

      {/* ── Horizontal video rail ────────────────────────────── */}
      <VideoRail entries={RAIL} displayClass={display.className} monoClass={body.className} />

      {/* ── The rest, as a grid ──────────────────────────────── */}
      <section id="grid" className="scroll-mt-10 px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <h2 className={`${display.className} text-4xl leading-none sm:text-6xl`}>
              Every template
            </h2>
            <p className="max-w-md text-[#f4f1ea]/60">
              {GRID.length} more designs beyond the reel above. Tap any to open the
              live demo in a new context.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {GRID.map((entry) => (
              <Link
                key={entry.slug}
                href={entry.href}
                target={entry.external ? "_blank" : undefined}
                rel={entry.external ? "noopener noreferrer" : undefined}
                className="group relative block overflow-hidden rounded-2xl bg-[#161311] ring-1 ring-white/10 transition-colors hover:ring-white/25"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={`/img/rail/${entry.slug}.webp`}
                    alt={`${entry.brand} — ${entry.detail}`}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d0b] via-[#0e0d0b]/10 to-transparent" />
                </div>
                <div className="flex items-end justify-between gap-3 p-5">
                  <div>
                    <span className="text-[0.68rem] uppercase tracking-[0.2em] text-[#e8590c]">
                      {entry.category}
                    </span>
                    <h3 className={`${display.className} mt-1 text-xl text-[#f4f1ea]`}>{entry.name}</h3>
                    <p className="mt-1 text-sm text-[#f4f1ea]/50">{entry.detail}</p>
                  </div>
                  <ArrowUpRight className="mb-1 size-5 shrink-0 text-[#f4f1ea]/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#e8590c]" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="border-t border-white/10 px-6 py-24 text-center sm:px-10">
        <h2 className={`${display.className} mx-auto max-w-3xl text-4xl leading-tight sm:text-6xl`}>
          Found one you like?{" "}
          <span className="italic text-[#e8590c]">Let&apos;s make it yours.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-[#f4f1ea]/60">
          Tell me which template and what your business is. I&apos;ll come back with a
          price, a timeline and what I need from you — usually within the day.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#e8590c] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-[#0e0d0b] transition-transform hover:-translate-y-0.5"
          >
            Message me on WhatsApp
          </a>
          <a
            href="mailto:felipe.muner@gmail.com"
            className="rounded-full border border-white/15 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-[#f4f1ea] transition-colors hover:border-white/40"
          >
            felipe.muner@gmail.com
          </a>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center sm:px-10">
        <p className="text-xs text-[#f4f1ea]/40">
          Felipe Muner — software engineer. All template brands are fictional; the code is real.
        </p>
      </footer>
    </div>
  );
}

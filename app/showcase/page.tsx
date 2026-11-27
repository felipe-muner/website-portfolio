import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Archivo } from "next/font/google";
import { ArrowDown } from "lucide-react";
import { LenisScroll } from "@/components/layouts/showcase/lenis-scroll";
import { HeroStrip, HeroWall } from "@/components/layouts/showcase/hero-wall";
import { TemplateGrid } from "@/components/layouts/showcase/template-grid";
import { SHOWCASE, TOTAL, VIDEO_SLUGS } from "@/lib/layouts/showcase";

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
      <section className="relative flex flex-col gap-12 overflow-hidden px-6 pb-12 pt-8 sm:px-10 lg:min-h-[86svh] lg:justify-between lg:pb-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(80% 55% at 50% -5%, rgba(232,89,12,0.20) 0%, rgba(232,89,12,0) 60%), radial-gradient(60% 40% at 90% 110%, rgba(232,89,12,0.10) 0%, rgba(232,89,12,0) 60%)",
          }}
        />

        <header className="relative z-10 flex items-center justify-between">
          <span className={`${display.className} text-lg italic text-[#f4f1ea]`}>Felipe Muner</span>
          <nav className="flex items-center gap-6 rounded-full bg-[#0e0d0b]/70 px-5 py-2.5 text-sm text-[#f4f1ea]/75 ring-1 ring-white/10 backdrop-blur-md">
            <Link href="/portfolio" className="transition-colors hover:text-[#f4f1ea]">
              All templates
            </Link>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#f4f1ea]">
              Contact
            </a>
          </nav>
        </header>

        <HeroWall entries={SHOWCASE.slice(0, 18)} />

        <div className="pointer-events-none relative z-10 lg:max-w-[46%]">
          <span className="text-xs uppercase tracking-[0.35em] text-[#e8590c]">
            {TOTAL} live designs · one week each
          </span>
          <h1 className={`${display.className} mt-6 text-[3.25rem] font-medium leading-[0.95] tracking-tight sm:text-8xl lg:text-[clamp(4.5rem,6.6vw,7.5rem)]`}>
            Your dream website,{" "}
            <span className="italic text-[#e8590c]">already&nbsp;built.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-[#f4f1ea]/70">
            A shelf of real, working websites for gyms, studios, villas and local
            businesses. Every one is live code you can click, not a mockup.
          </p>
          <div className="pointer-events-auto mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#grid"
              className="inline-flex items-center gap-2 rounded-full bg-[#e8590c] px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-[#0e0d0b] transition-transform hover:-translate-y-0.5"
            >
              See all {TOTAL}
              <ArrowDown className="size-4" />
            </a>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-[#f4f1ea] transition-colors hover:border-white/40"
            >
              Ask about one
            </a>
          </div>
        </div>

        <HeroStrip entries={SHOWCASE.slice(0, 12)} />
      </section>

      {/* ── Every template ─────────────────────────────────── */}
      <section id="grid" className="scroll-mt-10 px-3 pb-24 pt-4 sm:px-4 lg:px-5">
        <div className="w-full">
          <div className="flex flex-col gap-4 border-b border-white/10 px-3 pb-8 sm:px-6 sm:flex-row sm:items-end sm:justify-between">
            <h2 className={`${display.className} text-4xl leading-none sm:text-6xl`}>
              Every template
            </h2>
            <p className="max-w-md text-[#f4f1ea]/60">
              {TOTAL} designs. Pick a category, hover to look around, tap any card
              to open the live site.
            </p>
          </div>

          <TemplateGrid entries={SHOWCASE} videoSlugs={[...VIDEO_SLUGS]} displayClass={display.className} />
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

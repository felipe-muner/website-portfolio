import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Archivo, Fraunces } from "next/font/google";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/layouts/Reveal";
import { PORTFOLIO } from "@/lib/layouts/registry";

export const metadata: Metadata = {
  title: "Website Portfolio — 20 Templates",
  description: "Twenty production-grade website templates: gyms, yoga studios, villas and local businesses.",
  robots: { index: false },
};

const display = Fraunces({ subsets: ["latin"], weight: ["400", "600"], style: ["normal", "italic"] });
const body = Archivo({ subsets: ["latin"], weight: ["400", "500", "700"] });

const INK = "#15130f";
const PAPER = "#f4f1ea";
const ACCENT = "#e8590c";

export default function PortfolioIndex() {
  return (
    <div className={`${body.className} min-h-dvh`} style={{ backgroundColor: PAPER, color: INK }}>
      <header className="mx-auto max-w-7xl px-5 pb-10 pt-16 md:px-10 md:pt-24">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.35em]" style={{ color: ACCENT }}>
            Website portfolio
          </p>
          <h1 className={`${display.className} mt-4 max-w-3xl text-5xl leading-[1.05] md:text-7xl`}>
            Twenty websites,
            <em style={{ color: ACCENT }}> ready to make yours.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg" style={{ color: `${INK}b3` }}>
            Every template below is a living, working site — searchable
            schedules, booking calendars, menus and all. Click any card,
            then use the floating switcher to keep browsing.
          </p>
        </Reveal>
      </header>

      <main className="mx-auto max-w-7xl px-5 pb-24 md:px-10">
        {PORTFOLIO.map((group, gi) => (
          <section key={group.label} className="mt-14 first:mt-4">
            <Reveal>
              <div className="flex items-baseline gap-4 border-b-2 pb-3" style={{ borderColor: INK }}>
                <span className={`${display.className} text-2xl italic`} style={{ color: ACCENT }}>
                  0{gi + 1}
                </span>
                <h2 className={`${display.className} text-3xl md:text-4xl`}>{group.label}</h2>
                <span className="ml-auto text-sm font-bold uppercase tracking-[0.2em]" style={{ color: `${INK}80` }}>
                  {group.sites.length} templates
                </span>
              </div>
            </Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {group.sites.map((site, i) => (
                <Reveal key={site.href} delay={i * 70} className="h-full">
                  <Link
                    href={site.href}
                    className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-xl"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={site.cover}
                        alt={site.brand}
                        fill
                        sizes="(min-width: 1024px) 18vw, (min-width: 640px) 45vw, 90vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <span
                        className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full text-white opacity-0 transition-opacity group-hover:opacity-100"
                        style={{ backgroundColor: ACCENT }}
                      >
                        <ArrowUpRight className="size-4" />
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className={`${display.className} text-xl`}>{site.name}</h3>
                      <p className="mt-1 flex-1 text-sm leading-snug" style={{ color: `${INK}99` }}>
                        {site.detail}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="border-t-2 py-10 text-center" style={{ borderColor: INK }}>
        <p className="text-sm font-bold uppercase tracking-[0.3em]" style={{ color: `${INK}80` }}>
          All brands fictional · built with Next.js — ask for yours
        </p>
      </footer>
    </div>
  );
}

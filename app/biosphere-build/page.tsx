import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import { Shippori_Mincho, Zen_Kaku_Gothic_New } from "next/font/google";
import logoImg from "@/public/img/layouts/biosphere-logo.png";
import buildImg from "@/public/img/layouts/biosphere-build.jpg";
import casaImg from "@/public/img/layouts/biosphere-casa.jpg";
import communityImg from "@/public/img/layouts/biosphere-community.jpg";
import earthImg from "@/public/img/layouts/biosphere-earth.jpg";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { BiosphereMobileMenu } from "@/components/layouts/biosphere/mobile-menu";
import { RaiseScene } from "@/components/layouts/biosphere/RaiseScene";
import { LenisScroll } from "@/components/layouts/showcase/lenis-scroll";
import { SlotBooking, type SlotOption } from "@/components/layouts/SlotBooking";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Business Layout — Biosphere Raising",
  robots: { index: false },
};

const mincho = Shippori_Mincho({ subsets: ["latin"], weight: ["400", "500", "600"] });
const gothic = Zen_Kaku_Gothic_New({ subsets: ["latin"], weight: ["300", "400", "500", "700"] });

/* Warm build-site palette — biosphere ink on paper, one clay seal. */
const PAPER = "#f4efe4";
const MAT = "#ede6d7";
const INK = "#243122";
const CLAY = "#b3572f";
const HAIRLINE = "rgba(36, 49, 34, 0.16)";
const MUTED = "rgba(36, 49, 34, 0.66)";

const NAV = [
  { label: "The build", href: "#build" },
  { label: "Phases", href: "#phases" },
  { label: "Projects", href: "#projects" },
  { label: "Visit", href: "#visit" },
] as const;

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const STATS: readonly { value: string; label: string }[] = [
  { value: "6", label: "Culm-posts, no concrete frame" },
  { value: "12", label: "Weeks, footing to handover" },
  { value: "0", label: "Trees felled off the plot" },
];

type PhaseState = "done" | "active" | "next";

const PHASES: readonly {
  n: string;
  weeks: string;
  title: string;
  text: string;
  state: PhaseState;
}[] = [
  { n: "I", weeks: "Week 1", title: "Footing", text: "Ground read, drained and pinned with stone pads set to the slope.", state: "done" },
  { n: "II", weeks: "Weeks 2–3", title: "Posts", text: "Cured whole-culm bamboo raised and plumbed — the load-bearing legs.", state: "done" },
  { n: "III", weeks: "Weeks 4–5", title: "Platform", text: "Ring beams lashed, bamboo deck laid — the first standing floor.", state: "active" },
  { n: "IV", weeks: "Weeks 6–7", title: "Frame", text: "Wall posts, ridge and rafters shape the roof before it's clad.", state: "next" },
  { n: "V", weeks: "Weeks 8–10", title: "Roof", text: "Thatch tied course by course from eave to ridge until it's dry.", state: "next" },
  { n: "VI", weeks: "Weeks 11–12", title: "The house", text: "Doors, ladder, veranda rail and lantern — handed over, ready.", state: "next" },
];

function stateStyle(state: PhaseState): CSSProperties {
  if (state === "done") return { borderColor: "rgba(36, 49, 34, 0.5)", backgroundColor: "rgba(36, 49, 34, 0.12)" };
  if (state === "active") return { borderColor: CLAY, backgroundImage: "repeating-linear-gradient(45deg, rgba(179, 87, 47, 0.28) 0 4px, transparent 4px 9px)" };
  return { borderColor: "rgba(36, 49, 34, 0.4)", borderStyle: "dashed" };
}

const PROJECTS = [
  { id: "la-casa", name: "La Casa — The Fibonacci", image: casaImg, note: "A spiral of bamboo pavilions raised on stone footings, roofed in a single continuous thatch.", stamp: "Handed over", stampColor: INK },
  { id: "the-bay", name: "The Bay", image: buildImg, note: "A tide-facing hillside house, currently mid-raise — posts up, platform laid, roof to come.", stamp: "In build · phase III", stampColor: CLAY },
] as const;

const VISITS: readonly SlotOption[] = [
  { slug: "walk", name: "Land discovery walk", sub: "Two hours on your plot — slope, water and where the house wants to sit", price: 2500 },
  { slug: "raising", name: "Watch a raising", sub: "Spend a build day on site as posts and platform go up", price: 4500 },
  { slug: "tour", name: "Finished-house tour", sub: "Walk La Casa with the crew who raised it", price: 6500 },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function BiosphereBuildPage() {
  return (
    <div className={`${gothic.className} min-h-dvh antialiased`} style={{ backgroundColor: PAPER, color: INK }}>
      <LenisScroll />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b backdrop-blur-md" style={{ borderColor: HAIRLINE, backgroundColor: "rgba(244, 239, 228, 0.88)" }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#top" className="flex items-center gap-3" style={{ color: INK }}>
            <Image src={logoImg} alt="" width={30} height={30} priority className="size-[30px]" />
            <span className={`${mincho.className} text-sm tracking-[0.3em]`}>BIOSPHERE</span>
          </a>
          <nav className="hidden items-center gap-7 text-[11px] uppercase tracking-[0.2em] md:flex" aria-label="Sections">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="transition-opacity hover:opacity-60" style={{ color: MUTED }}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <a href="#visit" className="rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-85" style={{ backgroundColor: CLAY, color: PAPER }}>
              Raise a house
            </a>
            <BiosphereMobileMenu
              links={NAV}
              cta={{ label: "Raise a house", href: "#visit" }}
              triggerColor={INK}
              panelStyle={{ backgroundColor: PAPER, color: INK, borderColor: HAIRLINE }}
              linkClassName={`${mincho.className} text-2xl`}
              ctaClassName="rounded-full px-5 py-3 text-center text-[11px] font-medium uppercase tracking-[0.16em]"
              ctaStyle={{ backgroundColor: CLAY, color: PAPER }}
            />
          </div>
        </div>
      </header>

      {/* Intro */}
      <section id="top" className="scroll-mt-16">
        <div className="mx-auto max-w-4xl px-6 pb-6 pt-16 text-center sm:px-10 md:pt-24">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.4em]" style={{ color: CLAY }}>
            Land & ecosystem studio · Koh Phangan
          </p>
          <h1 className={`${mincho.className} mx-auto mt-6 max-w-3xl text-5xl leading-[1.08] sm:text-6xl md:text-7xl`}>
            We raise houses
            <br />
            the way bamboo grows.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed" style={{ color: MUTED }}>
            Node by node, footing to ridge — a whole-culm bamboo home built from the
            ground up. Scroll on to watch one rise, then read the phases that get it there.
          </p>
          <div className="mt-9 flex items-center justify-center gap-3">
            <a href="#build" className="rounded-full px-6 py-3 text-sm font-medium transition-opacity hover:opacity-85" style={{ backgroundColor: INK, color: PAPER }}>
              Watch it rise
            </a>
            <a href="#visit" className="rounded-full border px-6 py-3 text-sm font-medium transition-colors hover:bg-black/[0.04]" style={{ borderColor: "rgba(36, 49, 34, 0.35)", color: INK }}>
              Book a walk
            </a>
          </div>
        </div>
      </section>

      {/* The scroll-built house */}
      <RaiseScene serifClass={mincho.className} />

      {/* Stats strip */}
      <section className="border-y" style={{ borderColor: HAIRLINE, backgroundColor: MAT }}>
        <div className="mx-auto grid max-w-4xl grid-cols-3 divide-x px-6 py-10 sm:px-10" style={{ borderColor: HAIRLINE }}>
          {STATS.map((s) => (
            <div key={s.label} className="px-3 text-center sm:px-6">
              <p className={`${mincho.className} text-4xl sm:text-5xl`} style={{ color: CLAY }}>
                {s.value}
              </p>
              <p className="mx-auto mt-2 max-w-[18ch] text-xs leading-relaxed" style={{ color: MUTED }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Phase detail */}
      <section id="phases" className="mx-auto max-w-5xl scroll-mt-16 px-6 py-16 sm:px-10 md:py-24">
        <div className="max-w-2xl">
          <h2 className={`${mincho.className} text-3xl sm:text-4xl`}>Six phases, twelve weeks</h2>
          <p className="mt-4 text-sm leading-relaxed sm:text-base" style={{ color: MUTED }}>
            The same sequence you just scrolled through, laid out to scale. Bamboo forgives
            nothing rushed — so every phase finishes before the next one starts.
          </p>
        </div>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-lg border sm:grid-cols-2 lg:grid-cols-3" style={{ borderColor: HAIRLINE, backgroundColor: HAIRLINE }}>
          {PHASES.map((phase) => (
            <li key={phase.n} className="flex flex-col p-6" style={{ backgroundColor: PAPER }}>
              <div className="flex items-center justify-between">
                <span className={`${mincho.className} text-2xl`} style={{ color: CLAY }}>
                  {phase.n}
                </span>
                <span aria-hidden className="h-3 w-12 rounded-sm border" style={stateStyle(phase.state)} />
              </div>
              <h3 className={`${mincho.className} mt-4 text-xl`}>{phase.title}</h3>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.22em]" style={{ color: MUTED }}>
                {phase.weeks}
              </p>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: MUTED }}>
                {phase.text}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
          {([["done", "Complete"], ["active", "In build — The Bay"], ["next", "Ahead"]] as const).map(([state, label]) => (
            <p key={state} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
              <span aria-hidden className="inline-block h-2.5 w-6 rounded-sm border" style={stateStyle(state)} />
              {label}
            </p>
          ))}
        </div>
      </section>

      {/* Manifesto with photo */}
      <section className="border-y" style={{ borderColor: HAIRLINE, backgroundColor: MAT }}>
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-16 sm:px-10 md:grid-cols-2 md:py-20">
          <div className="border p-2.5" style={{ borderColor: HAIRLINE, backgroundColor: PAPER }}>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image src={earthImg} alt="Bamboo posts being raised on a hillside plot" fill placeholder="blur" sizes="(min-width: 768px) 44vw, 90vw" className="object-cover" />
            </div>
          </div>
          <div>
            <p className={`${mincho.className} text-2xl leading-relaxed sm:text-3xl`}>
              A bamboo house isn&apos;t poured, it&apos;s tied — every joint lashed by hand,
              every post grown within a day&apos;s walk of where it stands.
            </p>
            <p className="mt-6 text-sm leading-relaxed" style={{ color: MUTED }}>
              We cure our own culms, cut nothing off-plot we don&apos;t replant, and leave the
              slope holding more water than we found. The house is the easy part — the
              ecosystem it sits in is the real build.
            </p>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="mx-auto max-w-5xl scroll-mt-16 px-6 py-16 sm:px-10 md:py-24">
        <h2 className={`${mincho.className} text-3xl sm:text-4xl`}>Two houses, one method</h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed sm:text-base" style={{ color: MUTED }}>
          Both raised by the studio crew — from stone footing to lit lantern.
        </p>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {PROJECTS.map((project) => (
            <figure key={project.id} id={project.id} className="scroll-mt-24">
              <div className="border p-2.5" style={{ borderColor: HAIRLINE, backgroundColor: MAT }}>
                <div className="relative aspect-[5/4] overflow-hidden">
                  <Image src={project.image} alt={project.name} fill placeholder="blur" sizes="(min-width: 768px) 44vw, 90vw" className="object-cover" />
                  <span
                    className="absolute right-3 top-3 -rotate-3 border-2 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em]"
                    style={{ borderColor: project.stampColor, color: project.stampColor, backgroundColor: "rgba(244, 239, 228, 0.85)" }}
                  >
                    {project.stamp}
                  </span>
                </div>
              </div>
              <figcaption className="pt-4">
                <h3 className={`${mincho.className} text-xl`}>{project.name}</h3>
                <p className="mt-1.5 max-w-sm text-sm leading-relaxed" style={{ color: MUTED }}>
                  {project.note}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Visit / booking */}
      <section id="visit" className="border-t scroll-mt-16" style={{ borderColor: HAIRLINE, backgroundColor: MAT }}>
        <div className="mx-auto max-w-5xl px-6 py-16 sm:px-10 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
            <div>
              <h2 className={`${mincho.className} text-3xl sm:text-4xl`}>Come stand where it&apos;ll rise</h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed sm:text-base" style={{ color: MUTED }}>
                Every house starts the same way: two hours on your plot, on foot, reading
                slope, water and light. Pick a visit and a day — we bring the tools.
              </p>
            </div>
            <div className="border p-2.5" style={{ borderColor: HAIRLINE, backgroundColor: PAPER }}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={communityImg} alt="The studio crew gathered under a finished bamboo roof" fill placeholder="blur" sizes="(min-width: 768px) 44vw, 90vw" className="object-cover" />
              </div>
            </div>
          </div>
          <div className="mt-10">
            <SlotBooking
              options={VISITS}
              displayClass={mincho.className}
              pickerLabel="Visit"
              priceUnit="per visit"
              currency="฿"
              ctaLabel="Request this visit"
              note="Visit fees are credited back in full when a build begins."
              theme={{ accent: CLAY, accentText: PAPER, text: INK, muted: MUTED, surface: PAPER, border: HAIRLINE, radius: "10px" }}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-16 text-center sm:px-10">
        <Image src={logoImg} alt="" width={40} height={40} className="mx-auto size-10" />
        <p className={`${mincho.className} mt-4 text-xl tracking-[0.3em]`}>BIOSPHERE</p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.24em]" style={{ color: MUTED }}>
          Biosphere Co. Ltd. — land & ecosystem studio
        </p>
        <p className="mt-4 text-sm" style={{ color: MUTED }}>
          {CONTACT.area} ·{" "}
          <a href={CONTACT.phoneHref} className="underline decoration-1 underline-offset-4">
            {CONTACT.phone}
          </a>{" "}
          ·{" "}
          <a href={CONTACT.emailHref} className="underline decoration-1 underline-offset-4">
            {CONTACT.email}
          </a>
        </p>
        <p className="mt-5 text-xs" style={{ color: MUTED }}>
          Concept redesign — demo content and prices.
        </p>
      </footer>

      <LayoutSwitcher />
    </div>
  );
}

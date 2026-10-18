import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ArrowRight, ArrowUpRight, MessageCircle, Mail, Plus } from "lucide-react";
import { Reveal } from "@/components/layouts/Reveal";
import { LenisScroll } from "@/components/layouts/showcase/lenis-scroll";
import { WhatsappFab } from "@/components/layouts/portfolio/whatsapp-fab";
import { TemplateRail } from "@/components/layouts/portfolio/template-rail";
import { HeroStage, type HeroCategory } from "@/components/layouts/portfolio/hero-stage";
import { PORTFOLIO, ALL_SITES } from "@/lib/layouts/registry";
import { TEMPLATES } from "@/lib/layouts/showcase";

const sans = Geist({ subsets: ["latin"], variable: "--font-pf-sans" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-pf-serif",
});
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-pf-mono" });

const SITE_COUNT = ALL_SITES.length;
const WHATSAPP = "5521984852802";

export const metadata: Metadata = {
  title: `${SITE_COUNT} Ready-Made Website Templates`,
  description: `Launch your dream website in days. ${SITE_COUNT} live, fully working designs for gyms, yoga studios, villas and local businesses — pick one and I'll make it yours: your name, colors, photos, content and language.`,
  robots: { index: false },
};

/** The template each category's hero chip opens — the strongest of its group. */
const FEATURED: Record<string, string> = {
  gym: "/gym/v1",
  yoga: "/yoga/v1",
  villas: "/villa/v7",
  local: "/restaurant",
  adventure: "/beachclub",
};

const HERO_CATEGORIES: HeroCategory[] = PORTFOLIO.map((group) => {
  const site = group.sites.find((s) => s.href === FEATURED[group.slug]) ?? group.sites[0];
  return {
    slug: group.slug,
    label: group.label,
    count: group.sites.length,
    featured: { name: site.name, href: site.href, cover: site.cover, external: site.external ?? false },
  };
});

const STATS = [
  { v: SITE_COUNT, l: "Live templates" },
  { v: PORTFOLIO.length, l: "Business categories" },
  { v: "100%", l: "Real working demos" },
  { v: "100+", l: "Websites launched" },
] as const;

const STEPS = [
  {
    n: "01",
    who: "you",
    title: "Pick a template",
    text: "Every card here opens a real working demo — click around, try the menus, calendars and carts.",
    image: "/img/rail/villa-v7.webp",
  },
  {
    n: "02",
    who: "you",
    title: "Send me your content",
    text: "Business name, logo, photos, prices and language — one WhatsApp message is enough to start.",
    image: "/img/rail/coaching.webp",
  },
  {
    n: "03",
    who: "me",
    title: "Launch",
    text: "I rebrand the template, deploy it on fast hosting and hand you the keys. Days, not months.",
    image: "/img/rail/beachclub.webp",
  },
] as const;

const FAQ = [
  { q: "Are these real, working sites?", a: "Yes. Every card opens a live demo — the menus, calendars, carts and booking flows all actually work. Nothing here is a static mockup." },
  { q: "How is a template made mine?", a: "I swap in your business name, logo, colors, photos, prices, content and language. When it's done, nobody can tell it started as a template." },
  { q: "How long does it take?", a: "Days, not months. The site is already built — only your branding and content go in, then I deploy it and hand you the keys." },
  { q: "Can I get something not on the shelf?", a: "Yes. If none of these fit, I build custom. Message me and tell me what you have in mind." },
] as const;

const NAV = [
  { href: "#templates", label: "Templates" },
  { href: "#how", label: "How it works" },
  { href: "#faq", label: "FAQ" },
  { href: "/showcase", label: "Showcase" },
] as const;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-[#8ea8ff]">
      <span className="size-1.5 rounded-full bg-[#4f7cff] shadow-[0_0_10px_2px_rgba(79,124,255,0.7)]" />
      {children}
    </span>
  );
}

export default function PortfolioIndex() {
  return (
    <div
      className={`${sans.variable} ${serif.variable} ${mono.variable} min-h-dvh overflow-x-clip bg-[#05060f] font-[family-name:var(--font-pf-sans)] text-[#eef1fb] antialiased selection:bg-[#2f5bff]/40 [&_.font-mono]:font-[family-name:var(--font-pf-mono)] [&_.font-serif]:font-[family-name:var(--font-pf-serif)]`}
    >
      <LenisScroll />

      {/* ── Nav: a floating glass pill over the hero ─────────── */}
      <header className="sticky top-0 z-50 h-0">
        <div className="px-3 pt-3 sm:px-5 sm:pt-4">
          <nav className="mx-auto flex max-w-[1440px] items-center justify-between rounded-full border border-white/10 bg-[#070914]/65 py-1.5 pl-4 pr-1.5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:pl-5">
            <Link href="/portfolio" className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="size-6 rounded-full bg-[radial-gradient(circle_at_35%_30%,#b4c8ff,#2f5bff_55%,#0d1a66)] shadow-[0_0_18px_rgba(79,124,255,0.7)]"
              />
              <span className="text-[15px] font-medium tracking-[-0.01em]">Felipe Muner</span>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 lg:inline">
                / Ready-made websites
              </span>
            </Link>
            <div className="hidden items-center md:flex">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <a
              href="#contact"
              className="group inline-flex h-10 items-center gap-2 rounded-full bg-white pl-4 pr-1.5 text-sm font-medium text-[#05060f] transition hover:shadow-[0_0_30px_-6px_rgba(79,124,255,0.8)]"
            >
              Contact
              <span className="grid size-7 place-items-center rounded-full bg-[#2f5bff] text-white transition-transform duration-300 group-hover:-rotate-45">
                <ArrowRight className="size-3.5" />
              </span>
            </a>
          </nav>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative isolate flex flex-col overflow-hidden lg:min-h-[max(100svh,780px)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(60%_55%_at_65%_45%,black,transparent)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-48 -top-48 -z-10 size-[44rem] rounded-full bg-[#5b3bff]/[0.13] blur-[120px]"
        />

        <HeroStage categories={HERO_CATEGORIES} />

        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 pb-16 sm:px-8 lg:px-12 lg:pb-14 lg:pt-32">
          <div className="max-w-[40rem] lg:my-auto lg:max-w-[47%]">
            <Reveal>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-2.5 pr-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/70 backdrop-blur">
                <span className="relative flex size-2">
                  <span className="absolute inset-0 rounded-full bg-[#4f7cff]/70 motion-safe:animate-ping" />
                  <span className="relative size-2 rounded-full bg-[#4f7cff]" />
                </span>
                {SITE_COUNT} live designs · one week each
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-7 text-[2.9rem] font-light leading-[0.98] tracking-[-0.045em] sm:text-7xl lg:text-[clamp(3.5rem,5.2vw,5.6rem)]">
                Pick a website.
                <br />
                <span className="bg-gradient-to-r from-white via-[#b9c9ff] to-[#5b84ff] bg-clip-text pr-[0.12em] font-serif text-[1.08em] italic tracking-[-0.02em] text-transparent">
                  I&apos;ll make it yours.
                </span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-7 max-w-[34rem] text-[17px] leading-relaxed text-white/60 sm:text-lg">
                A shelf of real, working websites for gyms, studios, villas and local
                businesses. Every one is live code you can click today — pick the one you
                love and I rebrand it around your business.
              </p>
            </Reveal>
            <Reveal delay={240} className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#templates"
                className="group inline-flex h-[52px] items-center gap-3 rounded-full bg-white pl-1.5 pr-6 text-[15px] font-medium text-[#05060f] shadow-[0_12px_44px_-12px_rgba(79,124,255,0.75)] transition hover:-translate-y-0.5"
              >
                <span className="grid size-10 place-items-center rounded-full bg-[#2f5bff] text-white transition-transform duration-300 group-hover:-rotate-45">
                  <ArrowRight className="size-4" />
                </span>
                Browse templates
              </a>
              <Link
                href="/showcase"
                className="inline-flex h-[52px] items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 text-[15px] text-white/80 backdrop-blur transition hover:border-white/30 hover:text-white"
              >
                Watch the reel <ArrowUpRight className="size-4" />
              </Link>
            </Reveal>
          </div>

          <Reveal delay={320} className="mt-14 max-w-[40rem] lg:mt-0 lg:max-w-[47%]">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/10 pt-7 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.l} className="flex flex-col gap-1.5">
                  <dt className="order-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{s.l}</dt>
                  <dd className="order-1 text-3xl font-light tracking-[-0.03em] sm:text-[2.1rem]">{s.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ── Every template name, drifting past ──────────────── */}
      <div className="marquee-viewport relative overflow-hidden border-y border-white/[0.06] bg-white/[0.012] py-5 [--marquee-duration:90s] [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
              {ALL_SITES.map((site) => (
                <li
                  key={site.href}
                  className="flex items-center whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.28em] text-white/45"
                >
                  <span className="px-7">{site.name}</span>
                  <span aria-hidden className="text-[#4f7cff]">
                    ✦
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* ── Horizontal rail: every template, one by one ─────── */}
      <TemplateRail entries={TEMPLATES} />

      {/* ── How it works ────────────────────────────────────── */}
      <section id="how" className="scroll-mt-24 border-t border-white/[0.06] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Eyebrow>How it works</Eyebrow>
              <h2 className="mt-5 max-w-3xl text-balance text-[2.6rem] font-light leading-[1.02] tracking-[-0.04em] sm:text-6xl">
                You&apos;re not hiring a project.{" "}
                <span className="font-serif italic text-white/55">You&apos;re buying a finished site.</span>
              </h2>
            </div>
            <p className="max-w-sm leading-relaxed text-white/55">
              Pick a design, send your content, and I take it from there. Two of the three steps
              are yours — and they take minutes.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:mt-20 lg:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 90} className="h-full">
                <article className="group flex h-full flex-col rounded-[28px] border border-white/10 bg-white/[0.025] p-3 transition-colors duration-500 hover:border-white/20">
                  <div className="relative aspect-[16/11] overflow-hidden rounded-[20px] bg-[#090b16] ring-1 ring-white/10">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      sizes="(min-width: 1024px) 30vw, 92vw"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05060f]/80 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/85 backdrop-blur">
                      {step.who === "me" ? "I do this" : "You do this"}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col px-4 pb-5 pt-6">
                    <span className="font-mono text-xs text-[#8ea8ff]">{step.n}</span>
                    <h3 className="mt-3 text-2xl tracking-[-0.02em] sm:text-3xl">{step.title}</h3>
                    <p className="mt-3 leading-relaxed text-white/55">{step.text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section id="faq" className="scroll-mt-24 border-t border-white/[0.06] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="mt-5 text-balance text-[2.6rem] font-light leading-[1.02] tracking-[-0.04em] sm:text-6xl">
              Questions, <span className="font-serif italic text-white/55">answered.</span>
            </h2>
            <p className="mt-6 max-w-sm leading-relaxed text-white/55">
              Anything else?{" "}
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
              >
                Ask me on WhatsApp
              </a>
              .
            </p>
          </Reveal>
          <div className="flex flex-col gap-3">
            {FAQ.map((item, i) => (
              <Reveal key={item.q} delay={i * 60}>
                <details
                  open={i === 0}
                  className="group rounded-2xl border border-white/10 bg-white/[0.025] px-6 py-5 transition-colors open:border-white/20 open:bg-white/[0.045]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg tracking-[-0.01em] [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/15 text-white/70 transition-transform duration-300 group-open:rotate-45">
                      <Plus className="size-4" />
                    </span>
                  </summary>
                  <p className="mt-3 max-w-xl pr-10 leading-relaxed text-white/55">{item.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ─────────────────────────────────────────── */}
      <section id="contact" className="scroll-mt-24 px-3 sm:px-5">
        <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-[32px] border border-white/10 bg-[#070a1c] px-6 py-24 text-center sm:rounded-[44px] sm:py-36">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_110%,rgba(47,91,255,0.5),transparent_70%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60 [background:repeating-radial-gradient(ellipse_120%_100%_at_50%_118%,transparent_0_46px,rgba(130,160,255,0.16)_47px,transparent_48px)] [mask-image:linear-gradient(to_top,black,transparent_75%)]"
          />
          <div className="relative">
            <Reveal>
              <Eyebrow>Talk to the builder</Eyebrow>
              <h2 className="mx-auto mt-6 max-w-4xl text-balance text-[2.6rem] font-light leading-[1.02] tracking-[-0.04em] sm:text-7xl">
                Found one you like?{" "}
                <span className="bg-gradient-to-r from-white via-[#b9c9ff] to-[#5b84ff] bg-clip-text pr-[0.1em] font-serif italic text-transparent">
                  Let&apos;s make it yours.
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-xl leading-relaxed text-white/60">
                Tell me which template and what your business is. I&apos;ll come back with a
                price, a timeline and what I need from you — usually within the day.
              </p>
            </Reveal>
            <Reveal delay={120} className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[52px] items-center gap-3 rounded-full bg-white pl-1.5 pr-6 text-[15px] font-medium text-[#05060f] shadow-[0_12px_44px_-12px_rgba(79,124,255,0.75)] transition hover:-translate-y-0.5"
              >
                <span className="grid size-10 place-items-center rounded-full bg-[#25D366] text-white">
                  <MessageCircle className="size-4" />
                </span>
                WhatsApp me
              </a>
              <a
                href="mailto:felipe.muner@gmail.com"
                className="inline-flex h-[52px] items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 text-[15px] text-white/80 backdrop-blur transition hover:border-white/30 hover:text-white"
              >
                <Mail className="size-4" /> felipe.muner@gmail.com
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Footer wordmark ─────────────────────────────────── */}
      <footer className="relative overflow-hidden px-5 pt-16 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span>Felipe Muner — software engineer</span>
          <span>All template brands are fictional; the code is real.</span>
        </div>
        <div className="relative mt-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-[radial-gradient(55%_100%_at_50%_120%,rgba(47,91,255,0.35),transparent_70%)]"
          />
          <p
            aria-hidden
            className="relative -mb-[0.14em] select-none whitespace-nowrap bg-gradient-to-b from-white/80 via-white/25 to-white/0 bg-clip-text text-center font-serif text-[17vw] italic leading-none tracking-[-0.04em] text-transparent"
          >
            Felipe Muner
          </p>
        </div>
      </footer>

      <WhatsappFab />
    </div>
  );
}

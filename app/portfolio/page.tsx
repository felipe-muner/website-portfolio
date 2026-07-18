import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fraunces, Archivo } from "next/font/google";
import { ArrowUpRight, ArrowDown, MessageCircle, Mail } from "lucide-react";
import { Reveal } from "@/components/layouts/Reveal";
import { LenisScroll } from "@/components/layouts/showcase/lenis-scroll";
import { WhatsappFab } from "@/components/layouts/portfolio/whatsapp-fab";
import { TemplateRail } from "@/components/layouts/portfolio/template-rail";
import { PORTFOLIO, ALL_SITES } from "@/lib/layouts/registry";
import { TEMPLATES } from "@/lib/layouts/showcase";

const display = Fraunces({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"] });
const body = Archivo({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const SITE_COUNT = ALL_SITES.length;
const WHATSAPP = "5521984852802";

export const metadata: Metadata = {
  title: `${SITE_COUNT} Ready-Made Website Templates`,
  description: `Launch your dream website in days. ${SITE_COUNT} live, fully working designs for gyms, yoga studios, villas and local businesses — pick one and I'll make it yours: your name, colors, photos, content and language.`,
  robots: { index: false },
};

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

export default function PortfolioIndex() {
  return (
    <div className={`${body.className} min-h-dvh bg-[#f4f1ea] text-[#17130f] antialiased`}>
      <LenisScroll />

      {/* ── Nav ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f4f1ea]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10">
          <Link href="/portfolio" className="leading-tight">
            <span className={`${display.className} block text-lg italic`}>Felipe Muner</span>
            <span className="block text-[0.6rem] uppercase tracking-[0.25em] text-[#17130f]/45">
              Ready-made websites
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-[#17130f]/60">
            <a href="#templates" className="hidden transition-colors hover:text-[#17130f] sm:inline">Templates</a>
            <Link href="/showcase" className="hidden transition-colors hover:text-[#17130f] sm:inline">Showcase</Link>
            <a href="#contact" className="rounded-full bg-[#e8590c] px-5 py-2 font-semibold text-[#f4f1ea] transition-transform hover:-translate-y-0.5">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative flex min-h-[86vh] flex-col justify-between overflow-hidden px-6 pb-12 pt-16 sm:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(75% 50% at 50% -5%, rgba(232,89,12,0.12) 0%, rgba(232,89,12,0) 60%), radial-gradient(55% 40% at 88% 108%, rgba(232,89,12,0.08) 0%, rgba(232,89,12,0) 60%)",
          }}
        />
        <div className="relative flex flex-1 flex-col justify-center">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.35em] text-[#e8590c]">
              {SITE_COUNT} live designs · one week each
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className={`${display.className} mt-6 max-w-4xl text-[3rem] font-medium leading-[0.95] tracking-tight sm:text-8xl`}>
              Pick a website.{" "}
              <span className="italic text-[#e8590c]">I&apos;ll make it yours.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-[#17130f]/70">
              A shelf of real, working websites for gyms, studios, villas and local
              businesses. Every one is live code you can click today — pick the one you
              love and I rebrand it around your business.
            </p>
          </Reveal>
          <Reveal delay={240} className="mt-9 flex flex-wrap items-center gap-4">
            <a href="#templates" className="rounded-full bg-[#e8590c] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-[#f4f1ea] transition-transform hover:-translate-y-0.5">
              Browse templates
            </a>
            <Link href="/showcase" className="inline-flex items-center gap-2 rounded-full border border-[#17130f]/20 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-[#17130f] transition-colors hover:border-[#17130f]/50">
              Watch the reel <ArrowUpRight className="size-4" />
            </Link>
          </Reveal>
        </div>

        <Reveal delay={320} className="relative flex flex-wrap items-end gap-x-12 gap-y-4 border-t border-black/10 pt-8">
          {[
            { v: SITE_COUNT, l: "Live templates" },
            { v: PORTFOLIO.length, l: "Business categories" },
            { v: "100%", l: "Real working demos" },
            { v: "100+", l: "Websites launched" },
          ].map((s) => (
            <div key={s.l}>
              <div className={`${display.className} text-3xl text-[#17130f] sm:text-4xl`}>{s.v}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.2em] text-[#17130f]/50">{s.l}</div>
            </div>
          ))}
          <div className="ml-auto hidden items-center gap-2 text-sm text-[#17130f]/40 sm:flex">
            <ArrowDown className="size-4 animate-bounce" /> Scroll
          </div>
        </Reveal>
      </section>

      {/* ── Horizontal rail: every template, one by one ─────── */}
      <TemplateRail entries={TEMPLATES} displayClass={display.className} />

      {/* ── How it works ────────────────────────────────────── */}
      <section id="how" className="scroll-mt-20 border-t border-black/10 px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-[#e8590c]">How it works</span>
            <h2 className={`${display.className} mt-3 max-w-2xl text-4xl leading-tight sm:text-6xl`}>
              You&apos;re not hiring a project.{" "}
              <span className="italic text-[#17130f]/55">You&apos;re buying a finished site.</span>
            </h2>
          </Reveal>
          <div className="mt-16 flex flex-col gap-16 sm:mt-20 sm:gap-24">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={(i % 2) * 80} className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
                <div className={`relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#161311] ring-1 ring-black/10 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    sizes="(min-width: 768px) 46vw, 90vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className={i % 2 === 1 ? "md:order-1" : ""}>
                  <div className="flex items-baseline justify-between border-t border-black/15 pt-5">
                    <span className={`${display.className} text-5xl text-[#e8590c] sm:text-6xl`}>{step.n}</span>
                    <span className="text-[0.65rem] uppercase tracking-[0.2em] text-[#17130f]/45">
                      {step.who === "me" ? "I do this" : "you do this"}
                    </span>
                  </div>
                  <h3 className={`${display.className} mt-5 text-3xl sm:text-4xl`}>{step.title}</h3>
                  <p className="mt-4 max-w-md text-lg leading-relaxed text-[#17130f]/60">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section id="faq" className="scroll-mt-20 border-t border-black/10 px-6 py-24 sm:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-[#e8590c]">FAQ</span>
            <h2 className={`${display.className} mt-3 text-4xl leading-tight sm:text-5xl`}>
              Questions, answered.
            </h2>
          </Reveal>
          <div>
            {FAQ.map((item, i) => (
              <Reveal key={item.q} delay={i * 60} className="border-t border-black/10 py-6 last:border-b">
                <h3 className={`${display.className} text-xl`}>{item.q}</h3>
                <p className="mt-2 max-w-xl leading-relaxed text-[#17130f]/60">{item.a}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ─────────────────────────────────────────── */}
      <section id="contact" className="scroll-mt-20 border-t border-black/10 px-6 py-24 text-center sm:px-10">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.3em] text-[#e8590c]">Talk to the builder</span>
          <h2 className={`${display.className} mx-auto mt-4 max-w-3xl text-4xl leading-tight sm:text-6xl`}>
            Found one you like?{" "}
            <span className="italic text-[#e8590c]">Let&apos;s make it yours.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[#17130f]/65">
            Tell me which template and what your business is. I&apos;ll come back with a
            price, a timeline and what I need from you — usually within the day.
          </p>
        </Reveal>
        <Reveal delay={120} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#e8590c] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-[#f4f1ea] transition-transform hover:-translate-y-0.5"
          >
            <MessageCircle className="size-4" /> WhatsApp me
          </a>
          <a
            href="mailto:felipe.muner@gmail.com"
            className="inline-flex items-center gap-2 rounded-full border border-[#17130f]/20 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-[#17130f] transition-colors hover:border-[#17130f]/50"
          >
            <Mail className="size-4" /> felipe.muner@gmail.com
          </a>
        </Reveal>
      </section>

      {/* ── Footer wordmark ─────────────────────────────────── */}
      <footer className="relative overflow-hidden border-t border-black/10 pt-14">
        <p className="px-6 text-center text-xs text-[#17130f]/45 sm:px-10">
          Felipe Muner — software engineer. All template brands are fictional; the code is real.
        </p>
        <div className="relative mt-6">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(60%_120%_at_50%_115%,rgba(232,89,12,0.22),transparent_70%)]"
          />
          <h2
            aria-label="Felipe Muner"
            className={`${display.className} -mb-[0.1em] block select-none whitespace-nowrap bg-gradient-to-b from-[#e8590c]/0 via-[#e8590c]/25 to-[#e8590c] bg-clip-text text-center text-[15vw] font-semibold italic leading-none tracking-tight text-transparent`}
          >
            Felipe Muner
          </h2>
        </div>
      </footer>

      <WhatsappFab />
    </div>
  );
}

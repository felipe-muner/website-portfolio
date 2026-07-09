import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  MessageCircle,
  Mail,
  Palette,
  Rocket,
  UserRound,
} from "lucide-react";
import { Reveal } from "@/components/layouts/Reveal";
import { CategoryMarquee } from "@/components/layouts/portfolio/category-marquee";
import { ALL_SITES, PORTFOLIO, type PortfolioSite } from "@/lib/layouts/registry";

const SITE_COUNT = ALL_SITES.length;

export const metadata: Metadata = {
  title: `Felipe Muner — ${SITE_COUNT} Ready-Made Website Templates`,
  description: `I'm a software engineer selling ready-made websites. ${SITE_COUNT} live templates for gyms, yoga studios, villas and local businesses — pick one and launch in days.`,
  robots: { index: false },
};

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["600", "700", "800"] });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "600"] });

const WHATSAPP = "5521984852802";

/** One representative photo per category shelf, distinct from the hero stack. */
const CATEGORY_COVER_HREFS = ["/gym/v3", "/yoga/v3", "/villa/v7", "/cafe", "/beachclub"] as const;

const FEATURED_HREFS = ["/dive", "/sacolaria", "/villa/v1", "/realestate"] as const;

const STEPS = [
  {
    n: "01",
    title: "Pick a template",
    text: "Every card below opens a real working demo — click around, try the menus, calendars and carts.",
  },
  {
    n: "02",
    title: "Send me your content",
    text: "Business name, logo, photos, prices and language — one WhatsApp message is enough to start.",
  },
  {
    n: "03",
    title: "Launch",
    text: "I rebrand the template, deploy it on fast hosting and hand you the keys. Days, not months.",
  },
] as const;

const TRUST = [
  { icon: Code2, title: "Real code, not mockups", text: "Every demo is a live site — everything you click actually works." },
  { icon: Rocket, title: "Launch in days", text: "The site is already built; only your branding and content go in." },
  { icon: Palette, title: "Made yours", text: "Your name, colors, photos and language — nobody will know it was a template." },
  { icon: UserRound, title: "Direct with the engineer", text: "No agency in between. You talk to the person who wrote the code." },
] as const;

function groupSlug(label: string) {
  return `cat-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`;
}

function wantLink(site: PortfolioSite) {
  const text = `Hi Felipe! I want the "${site.name}" template (${site.href}) for my business.`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

/** A template sold as a product: cover framed in browser chrome, demo link + WhatsApp quick-buy. */
function TemplateCard({ site, delay = 0 }: { site: PortfolioSite; delay?: number }) {
  return (
    <Reveal delay={delay} className="h-full">
      <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e3e8ea] bg-white transition hover:-translate-y-1 hover:shadow-[0_24px_48px_-28px_rgba(12,35,64,0.45)]">
        <Link href={site.href} className="block">
          <div className="flex items-center gap-2 border-b border-[#e3e8ea] bg-[#f4f6f6] px-3 py-2">
            <span className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-[#ff5a3c]" />
              <span className="size-2.5 rounded-full bg-[#ffd166]" />
              <span className="size-2.5 rounded-full bg-[#2fbf8f]" />
            </span>
            <span
              className={`${mono.className} flex-1 truncate rounded-md bg-white px-2 py-0.5 text-[0.65rem] text-[#5c6b77]`}
            >
              {site.href}
            </span>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={site.cover}
              alt={site.brand}
              fill
              sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </Link>
        <div className="flex flex-1 flex-col p-4">
          <h3 className={`${display.className} text-lg text-[#16232f]`}>{site.name}</h3>
          <p className="mt-1 flex-1 text-sm leading-snug text-[#5c6b77]">{site.detail}</p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <Link
              href={site.href}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0c2340] hover:text-[#ff5a3c]"
            >
              Open live demo <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
    </Reveal>
  );
}

export default function PortfolioIndex() {
  const featured = FEATURED_HREFS.map((href) => ALL_SITES.find((s) => s.href === href)).filter(
    (s): s is PortfolioSite => Boolean(s),
  );
  const heroCovers = [PORTFOLIO[2].sites[0], PORTFOLIO[0].sites[0], PORTFOLIO[3].sites[0]];

  return (
    <div className={`${body.className} min-h-dvh bg-[#eef2f3] text-[#16232f] antialiased`}>
      {/* Top strip */}
      <div className="bg-[#0c2340] px-4 py-1.5 text-center">
        <p className={`${mono.className} text-[0.65rem] text-[#9fb3c8]`}>
          {SITE_COUNT} live templates
          <span className="hidden sm:inline"> · answering on WhatsApp today</span>
        </p>
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-[#e3e8ea] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link href="/portfolio" className="flex shrink-0 items-center gap-2.5">
            <span
              className={`${mono.className} grid size-9 place-items-center rounded-lg bg-[#0c2340] text-sm font-semibold text-[#ffd166]`}
            >
              fm/
            </span>
            <span className="leading-tight">
              <span className={`${display.className} block text-base text-[#0c2340]`}>
                Felipe Muner
              </span>
              <span className="block text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[#8194a3]">
                Ready-made websites
              </span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-6 text-sm font-medium text-[#3d4f5e] md:flex">
            <a href="#templates" className="py-2 transition hover:text-[#0c2340]">Templates</a>
            <a href="#how" className="py-2 transition hover:text-[#0c2340]">How it works</a>
            <a href="#contact" className="py-2 transition hover:text-[#0c2340]">Contact</a>
          </nav>

          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-2 rounded-full bg-[#0e7c66] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0a5f4f] md:ml-0"
          >
            <MessageCircle className="size-4" /> WhatsApp
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0c2340] text-white">
        <div className="pointer-events-none absolute -right-28 -top-28 size-96 rounded-full bg-[#123056] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-36 left-1/4 size-80 rounded-full bg-[#0f2a4b] blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <span
              className={`${mono.className} inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs text-[#c7d5e3]`}
            >
              <Code2 className="size-4 text-[#ffd166]" /> Software engineer · templates for sale
            </span>
            <h1 className={`${display.className} mt-5 text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl`}>
              Ready-made websites.
              <br />
              <span className="text-[#ff5a3c]">Pick one</span>, it&apos;s yours.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#9fb3c8]">
              I&apos;m Felipe, a software engineer. Every template in this shop is a real
              working site I built — booking calendars, menus, carts and all. Open a demo,
              and if it fits your business, message me: I put your brand on it and you
              launch in days.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#templates"
                className="inline-flex items-center gap-2 rounded-full bg-[#ff5a3c] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#e64a2e]"
              >
                Browse {SITE_COUNT} templates <ArrowRight className="size-4" />
              </a>
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <MessageCircle className="size-4" /> Talk to me first
              </a>
            </div>
          </Reveal>

          {/* Browser-window stack */}
          <Reveal from="right" delay={150} className="hidden lg:block">
            <div className="relative h-[26rem]">
              {heroCovers.map((site, i) => (
                <div
                  key={site.href}
                  className="absolute w-72 overflow-hidden rounded-xl border border-white/10 shadow-2xl"
                  style={{
                    top: `${i * 3.5}rem`,
                    left: `${i * 5}rem`,
                    transform: `rotate(${(i - 1) * 3}deg)`,
                    zIndex: i,
                  }}
                >
                  <div className="flex items-center gap-2 bg-[#132c50] px-3 py-2">
                    <span className="flex gap-1.5">
                      <span className="size-2 rounded-full bg-[#ff5a3c]" />
                      <span className="size-2 rounded-full bg-[#ffd166]" />
                      <span className="size-2 rounded-full bg-[#2fbf8f]" />
                    </span>
                    <span className={`${mono.className} truncate text-[0.6rem] text-[#9fb3c8]`}>
                      {site.href}
                    </span>
                  </div>
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={site.cover}
                      alt={site.brand}
                      fill
                      sizes="18rem"
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <Reveal>
            <h2 className={`${display.className} text-3xl tracking-tight text-[#0c2340]`}>
              Choose by business
            </h2>
            <p className="mt-2 max-w-xl text-[#5c6b77]">
              Five shelves, one for each kind of business. Hover to pause, click to jump to yours.
            </p>
          </Reveal>
        </div>
        <Reveal className="mt-8">
          <CategoryMarquee
            items={PORTFOLIO.map((group, i) => ({
              label: group.label,
              count: group.sites.length,
              anchor: `#${groupSlug(group.label)}`,
              cover:
                ALL_SITES.find((s) => s.href === CATEGORY_COVER_HREFS[i])?.cover ??
                group.sites[0].cover,
            }))}
            displayClass={display.className}
            monoClass={mono.className}
          />
        </Reveal>
      </section>

      {/* Featured full builds */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className={`${display.className} text-3xl tracking-tight text-[#0c2340]`}>
                  Full builds
                </h2>
                <p className="mt-2 max-w-xl text-[#5c6b77]">
                  The heavy machinery: real carts, checkouts, search and owner dashboards.
                </p>
              </div>
              <a
                href="#templates"
                className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-[#0c2340] hover:text-[#ff5a3c] sm:inline-flex"
              >
                See everything <ArrowRight className="size-4" />
              </a>
            </div>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((site, i) => (
              <TemplateCard key={site.href} site={site} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* Catalog */}
      <main id="templates" className="mx-auto max-w-7xl scroll-mt-20 px-5 pb-8 sm:px-6">
        {PORTFOLIO.map((group) => (
          <section key={group.label} id={groupSlug(group.label)} className="scroll-mt-20 pt-16">
            <Reveal>
              <div className="flex items-baseline gap-3 border-b border-[#d6dee1] pb-3">
                <h2 className={`${display.className} text-2xl tracking-tight text-[#0c2340] md:text-3xl`}>
                  {group.label}
                </h2>
                <span className={`${mono.className} ml-auto text-xs text-[#8194a3]`}>
                  {group.sites.length} templates
                </span>
              </div>
            </Reveal>
            <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {group.sites.map((site, i) => (
                <TemplateCard key={site.href} site={site} delay={(i % 4) * 70} />
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* How it works */}
      <section id="how" className="scroll-mt-20 bg-[#0c2340] text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6">
          <Reveal>
            <h2 className={`${display.className} text-3xl tracking-tight`}>How it works</h2>
            <p className="mt-2 max-w-xl text-[#9fb3c8]">
              You&apos;re not hiring a web project — you&apos;re buying a finished site.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 100}>
                <div className="flex gap-4">
                  <span className={`${mono.className} text-2xl font-semibold text-[#ffd166]`}>
                    {step.n}
                  </span>
                  <div>
                    <h3 className={`${display.className} text-xl`}>{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#9fb3c8]">{step.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-[#e3e8ea] bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {TRUST.map((t) => (
            <div key={t.title} className="flex gap-3">
              <t.icon className="size-6 shrink-0 text-[#0e7c66]" />
              <div>
                <h3 className="text-sm font-bold text-[#16232f]">{t.title}</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-[#5c6b77]">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-16 sm:px-6">
        <div className="rounded-3xl border border-[#e3e8ea] bg-white p-8 text-center md:p-12">
          <p className={`${mono.className} text-xs uppercase tracking-[0.25em] text-[#0e7c66]`}>
            Talk to the builder
          </p>
          <h2 className={`${display.className} mt-3 text-3xl tracking-tight text-[#0c2340]`}>
            Found one you like?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[#5c6b77]">
            Tell me which template and what your business is. I&apos;ll answer with a price,
            a timeline and what I need from you — usually within the day.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 rounded-2xl bg-[#0e7c66] p-6 text-white transition hover:bg-[#0a5f4f]"
            >
              <MessageCircle className="size-7" />
              <span className="text-base font-bold">WhatsApp</span>
              <span className="text-sm text-white/90">+55 21 98485-2802</span>
              <span className="mt-1 text-xs font-semibold uppercase tracking-wide text-white/80">
                Fastest answer
              </span>
            </a>
            <a
              href="mailto:felipe.muner@gmail.com"
              className="flex flex-col items-center gap-2 rounded-2xl border border-[#e3e8ea] bg-[#eef2f3] p-6 transition hover:border-[#0c2340]/40"
            >
              <Mail className="size-7 text-[#0c2340]" />
              <span className="text-base font-bold text-[#16232f]">E-mail</span>
              <span className="break-all text-sm text-[#5c6b77]">felipe.muner@gmail.com</span>
              <span className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#8194a3]">
                Quotes &amp; details
              </span>
            </a>
            <Link
              href="/work"
              className="flex flex-col items-center gap-2 rounded-2xl border border-[#e3e8ea] bg-[#eef2f3] p-6 transition hover:border-[#0c2340]/40"
            >
              <ArrowUpRight className="size-7 text-[#0c2340]" />
              <span className="text-base font-bold text-[#16232f]">Custom work</span>
              <span className="text-sm text-[#5c6b77]">Need something not on the shelf?</span>
              <span className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#8194a3]">
                See how I work
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0c2340] py-10 text-center">
        <p className={`${mono.className} text-xs text-[#9fb3c8]`}>
          Felipe Muner — software engineer. All template brands are fictional; the code is real.
        </p>
      </footer>
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import {
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
import { PortfolioNav } from "@/components/layouts/portfolio/portfolio-nav";
import { SmoothScroll } from "@/components/layouts/portfolio/smooth-scroll";
import { StatsBar } from "@/components/layouts/portfolio/stats-bar";
import { TemplateMarquee } from "@/components/layouts/portfolio/template-marquee";
import { WhatsappFab } from "@/components/layouts/portfolio/whatsapp-fab";
import { ALL_SITES, PORTFOLIO } from "@/lib/layouts/registry";

const SITE_COUNT = ALL_SITES.length;

export const metadata: Metadata = {
  title: `${SITE_COUNT} Ready-Made Website Templates`,
  description: `Launch your website in days. ${SITE_COUNT} live, fully working templates for gyms, yoga studios, villas and local businesses — pick one and I'll make it yours: your name, colors, photos, content and language.`,
  robots: { index: false },
};

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["600", "700", "800"] });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "600"] });

const WHATSAPP = "5521984852802";

/** One representative photo per category shelf, distinct from the hero stack. */
const CATEGORY_COVER_HREFS = ["/gym/v3", "/yoga/v3", "/villa/v7", "/cafe", "/beachclub"] as const;

/**
 * Each category shelf sits on its own soft radial wash — same airy family, but a
 * visibly different hue per section. `edge` is the flat colour the marquee's
 * left/right fades blend to, so the shelf edges dissolve into the wash.
 */
const SECTION_THEMES = [
  { edge: "#e9f1f8", bg: "radial-gradient(120% 85% at 50% -15%, #f4f9fd 0%, rgba(244,249,253,0) 68%), radial-gradient(110% 70% at 50% 118%, #dfeaf5 0%, rgba(223,234,245,0) 62%), #e9f1f8" },
  { edge: "#e6f2ec", bg: "radial-gradient(120% 85% at 50% -15%, #f2f9f6 0%, rgba(242,249,246,0) 68%), radial-gradient(110% 70% at 50% 118%, #dbeee6 0%, rgba(219,238,230,0) 62%), #e6f2ec" },
  { edge: "#f1e9db", bg: "radial-gradient(120% 85% at 50% -15%, #f9f5ee 0%, rgba(249,245,238,0) 68%), radial-gradient(110% 70% at 50% 118%, #ece1cf 0%, rgba(236,225,207,0) 62%), #f1e9db" },
  { edge: "#f2e4e4", bg: "radial-gradient(120% 85% at 50% -15%, #faf1f1 0%, rgba(250,241,241,0) 68%), radial-gradient(110% 70% at 50% 118%, #ecdada 0%, rgba(236,218,218,0) 62%), #f2e4e4" },
  { edge: "#e9e6f4", bg: "radial-gradient(120% 85% at 50% -15%, #f5f3fb 0%, rgba(245,243,251,0) 68%), radial-gradient(110% 70% at 50% 118%, #e0dcef 0%, rgba(224,220,239,0) 62%), #e9e6f4" },
  { edge: "#e2f1f1", bg: "radial-gradient(120% 85% at 50% -15%, #f0f9f9 0%, rgba(240,249,249,0) 68%), radial-gradient(110% 70% at 50% 118%, #d5eaea 0%, rgba(213,234,234,0) 62%), #e2f1f1" },
] as const;

const STEPS = [
  {
    n: "01",
    who: "you do this",
    title: "Pick a template",
    text: "Every card below opens a real working demo — click around, try the menus, calendars and carts.",
    image: "/img/layouts/howit-pick.jpg",
  },
  {
    n: "02",
    who: "you do this",
    title: "Send me your content",
    text: "Business name, logo, photos, prices and language — one WhatsApp message is enough to start.",
    image: "/img/layouts/howit-send.jpg",
  },
  {
    n: "03",
    who: "I do this",
    title: "Launch",
    text: "I rebrand the template, deploy it on fast hosting and hand you the keys. Days, not months.",
    image: "/img/layouts/howit-launch.jpg",
  },
] as const;

const TRUST = [
  { icon: Code2, title: "Real code, not mockups", text: "Every demo is a live site — everything you click actually works." },
  { icon: Rocket, title: "Launch in days", text: "The site is already built; only your branding and content go in." },
  { icon: Palette, title: "Made yours", text: "Your name, colors, photos and language — nobody will know it was a template." },
  { icon: UserRound, title: "Direct with the engineer", text: "No agency in between. You talk to the person who wrote the code." },
] as const;

export default function PortfolioIndex() {
  return (
    <div className={`${body.className} min-h-dvh bg-[#eef2f3] text-[#16232f] antialiased`}>
      <SmoothScroll />
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

          <PortfolioNav />
        </div>
      </header>

      {/* Shop numbers */}
      <StatsBar
        stats={[
          { value: SITE_COUNT, label: "Live templates in the shop" },
          { value: PORTFOLIO.length, label: "Business categories" },
          { value: 100, suffix: "%", label: "Real working demos" },
          { value: 100, suffix: "+", label: "Websites launched" },
        ]}
        monoClass={mono.className}
        displayClass={display.className}
      />

      {/* Categories */}
      <section className="py-14">
        <Reveal>
          <CategoryMarquee
            items={PORTFOLIO.map((group, i) => ({
              label: group.label,
              count: group.sites.length,
              anchor: `#${group.slug}`,
              cover:
                ALL_SITES.find((s) => s.href === CATEGORY_COVER_HREFS[i])?.cover ??
                group.sites[0].cover,
            }))}
            displayClass={display.className}
            monoClass={mono.className}
          />
        </Reveal>
      </section>

      {/* Catalog — each category drifts horizontally, alternating direction shelf to shelf */}
      <main id="templates" className="scroll-mt-20 pb-8">
        {PORTFOLIO.map((group, gi) => {
          const theme = SECTION_THEMES[gi % SECTION_THEMES.length];
          return (
          <section
            key={group.label}
            id={group.slug}
            className="scroll-mt-20 pt-16 pb-20"
            style={{ background: theme.bg }}
          >
            <div className="mx-auto max-w-7xl px-5 sm:px-6">
              <Reveal>
                <div className="flex flex-col items-center pb-10 text-center">
                  <span
                    className={`${mono.className} inline-flex items-center gap-2 rounded-full bg-[#0c2340] px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] text-[#ffd166] shadow-[0_10px_24px_-10px_rgba(12,35,64,0.7)]`}
                  >
                    <span className="size-2 animate-pulse rounded-full bg-[#ff5a3c]" />
                    {group.sites.length} templates
                  </span>
                  <h2
                    className={`${display.className} mt-5 text-5xl font-extrabold tracking-tight text-[#0c2340] sm:text-6xl md:text-7xl`}
                  >
                    {group.label}
                  </h2>
                  <span
                    aria-hidden
                    className="mt-5 h-1.5 w-20 rounded-full bg-gradient-to-r from-[#ff5a3c] to-[#ffd166]"
                  />
                </div>
              </Reveal>
            </div>
            <div className="mt-7">
              <TemplateMarquee
                sites={group.sites}
                reverse={gi % 2 === 1}
                displayClass={display.className}
                monoClass={mono.className}
                fadeColor={theme.edge}
              />
            </div>
          </section>
          );
        })}
      </main>

      {/* How it works — vertical timeline ending at "live" */}
      <section id="how" className="scroll-mt-20 bg-[#0c2340] text-white">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-6 md:py-20">
          <Reveal>
            <span
              className={`${mono.className} inline-flex items-center rounded-full border border-[#ffd166]/30 bg-[#ffd166]/10 px-3.5 py-1.5 text-xs text-[#ffd166]`}
            >
              3 steps · days, not months
            </span>
            <h2 className={`${display.className} mt-4 text-3xl tracking-tight md:text-4xl`}>
              How it works
            </h2>
            <p className="mt-2 max-w-xl text-[#c7d5e3]">
              You&apos;re not hiring a web project — you&apos;re buying a finished site.
              Two of the steps are yours, and they take minutes.
            </p>
          </Reveal>

          <div className="relative mt-12">
            {/* The rail: starts at step 01, ends at the "live" dot */}
            <span
              aria-hidden
              className="absolute bottom-4 left-[1.375rem] top-4 w-px bg-gradient-to-b from-[#ffd166]/70 via-white/20 to-[#ff5a3c]"
            />
            <ol className="space-y-8 md:space-y-10">
              {STEPS.map((step, i) => (
                <li key={step.n} className="relative pl-16 sm:pl-20">
                  <span
                    className={`${mono.className} absolute left-0 top-1 grid size-11 place-items-center rounded-full border border-[#ffd166]/40 bg-[#0c2340] text-sm font-semibold text-[#ffd166]`}
                  >
                    {step.n}
                  </span>
                  <Reveal delay={i * 100}>
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#122c50] sm:grid sm:grid-cols-[15rem_1fr]">
                      <div className="relative aspect-[16/9] sm:aspect-auto sm:min-h-full">
                        <Image
                          src={step.image}
                          alt={step.title}
                          fill
                          sizes="(min-width: 640px) 15rem, 90vw"
                          className="object-cover"
                        />
                        {/* Navy tint keeps the photos in the section's palette */}
                        <div className="absolute inset-0 bg-[#0c2340]/25" />
                      </div>
                      <div className="p-5 sm:p-6">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className={`${display.className} text-xl md:text-2xl`}>{step.title}</h3>
                          <span
                            className={`${mono.className} rounded-full px-2.5 py-1 text-[0.62rem] uppercase tracking-wide ${
                              step.who === "I do this"
                                ? "bg-[#ff5a3c]/15 text-[#ff8a70]"
                                : "bg-white/10 text-[#c7d5e3]"
                            }`}
                          >
                            {step.who}
                          </span>
                        </div>
                        <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-[#c7d5e3] md:text-base">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}

              {/* Terminus: where the rail ends up */}
              <li className="relative pl-16 sm:pl-20">
                <span className="absolute left-[0.6875rem] top-1.5 grid size-6 place-items-center rounded-full bg-[#ff5a3c] shadow-[0_0_18px_rgba(255,90,60,0.7)]">
                  <span className="size-2 rounded-full bg-white" />
                </span>
                <Reveal delay={300}>
                  <p className={`${display.className} pt-0.5 text-lg text-white md:text-xl`}>
                    Your site is live.{" "}
                    <a href="#templates" className="text-[#ffd166] underline-offset-4 hover:underline">
                      Start with step 01 ↑
                    </a>
                  </p>
                </Reveal>
              </li>
            </ol>
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

      <WhatsappFab />
    </div>
  );
}

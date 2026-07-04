import type { Metadata } from "next";
import Link from "next/link";
import { Archivo, Fraunces } from "next/font/google";
import {
  ArrowUpRight,
  Check,
  Download,
  MessageCircle,
  Palette,
  Rocket,
  Send,
  Sparkles,
} from "lucide-react";
import { Reveal } from "@/components/layouts/Reveal";
import { ALL_SITES } from "@/lib/layouts/registry";

// ─────────────────────────────────────────────────────────────────────────────
// EDIT THIS BLOCK — your offer, prices, niche and contact live here.
// Everything below reads from these constants, so tailoring the page to your
// market is a one-place change. (See the notes I left you after building this.)
// ─────────────────────────────────────────────────────────────────────────────
const CONTACT = {
  whatsapp: "https://wa.me/5521984852802",
  email: "felipe.muner@gmail.com",
};

// TODO: set these for YOUR market before sending the link to anyone.
const CURRENCY = "$"; // e.g. "R$" (Brazil), "฿" (Thailand), "€", "$"
const NICHE = "small businesses"; // e.g. "Koh Phangan villas", "cafés & studios in Rio"

const TIERS = [
  {
    name: "Launch",
    tagline: "A sharp one-page site, live this week.",
    setup: "390",
    best: "Cafés, barbers, trainers, small shops",
    features: [
      "One-page site from a template you pick",
      "Your logo, colours, photos & words",
      "Mobile-perfect + fast",
      "Click-to-WhatsApp & contact button",
      "Live on your domain in ~5 days",
    ],
  },
  {
    name: "Grow",
    tagline: "A full site that turns visitors into bookings.",
    setup: "690",
    featured: true,
    best: "Villas, restaurants, studios, clinics",
    features: [
      "Everything in Launch, plus…",
      "Multi-section site (menu, rooms, services…)",
      "Booking / inquiry form that reaches you",
      "Photo gallery & reviews",
      "Google-ready (search + maps)",
      "2 rounds of revisions",
    ],
  },
  {
    name: "Signature",
    tagline: "A bespoke build when the template isn't enough.",
    setup: "1,290",
    best: "Brands that want something custom",
    features: [
      "Everything in Grow, plus…",
      "Custom sections & layout tweaks",
      "Copywriting help for your pages",
      "Multi-language if you need it",
      "Priority delivery",
    ],
  },
];

const CARE = {
  price: "39",
  features: [
    "Hosting, domain & SSL handled",
    "Content updates & small changes",
    "Uptime monitoring",
    "You always have someone to call",
  ],
};

const INCLUDED = [
  { icon: Palette, title: "Your brand, not a template", body: "You pick a design you love — I make it unmistakably yours: your name, colours, fonts, photos and voice." },
  { icon: Rocket, title: "Live in about a week", body: "No months-long agency process. Send me your details and your site goes live on your own domain in days." },
  { icon: Sparkles, title: "Built to win customers", body: "Fast, mobile-perfect, and easy to find on Google — with a clear button that pushes people to message or book you." },
  { icon: MessageCircle, title: "One person, always reachable", body: "No account managers, no tickets. You message me on WhatsApp and things get done." },
];

const STEPS = [
  { n: "01", title: "Pick a template", body: "Browse the portfolio and tell me which look fits your business." },
  { n: "02", title: "Send your stuff", body: "Logo, photos, prices, a few words about you — I handle the rest." },
  { n: "03", title: "I build it", body: "Your site, branded and polished, ready to review in about 5 days." },
  { n: "04", title: "Go live & relax", body: "It launches on your domain, and my care plan keeps it running." },
];

const FAQ = [
  { q: "How long does it take?", a: "Most sites are live in about a week once you've sent me your logo, photos and text. Bigger custom builds take a little longer." },
  { q: "What do you need from me?", a: "Your logo (or I'll set up simple type), a handful of photos, your services/prices, and a sentence or two about your business. That's it — I do the building." },
  { q: "Can I change things later?", a: "Yes. Small changes are part of the monthly care plan — just message me. Bigger additions are quoted separately." },
  { q: "Do I own my website?", a: "Yes — it's yours, on your own domain. The care plan keeps it hosted, updated and online." },
  { q: "What if I don't like it?", a: "The Grow package includes two rounds of revisions, and I don't consider it done until you're happy to put your name on it." },
];

const SITE_COUNT = ALL_SITES.length;

const display = Fraunces({ subsets: ["latin"], weight: ["400", "600"], style: ["normal", "italic"] });
const body = Archivo({ subsets: ["latin"], weight: ["400", "500", "700"] });

const INK = "#15130f";
const PAPER = "#f4f1ea";
const ACCENT = "#e8590c";

export const metadata: Metadata = {
  title: "Work with me — websites for small businesses",
  description: `Done-for-you websites for ${NICHE}: pick a template, I make it yours and keep it running. Live in about a week.`,
  // Flip this to index the page once you're happy with your prices & niche.
  robots: { index: false },
};

export default function WorkWithMe() {
  return (
    <div className={`${body.className} min-h-dvh`} style={{ backgroundColor: PAPER, color: INK }}>
      {/* Hero */}
      <header className="mx-auto max-w-6xl px-5 pb-14 pt-16 md:px-10 md:pt-24">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.35em]" style={{ color: ACCENT }}>
            Web design · done for you
          </p>
          <h1 className={`${display.className} mt-4 max-w-4xl text-5xl leading-[1.03] md:text-7xl`}>
            A website that brings
            <em style={{ color: ACCENT }}> you customers</em> — live in a week.
          </h1>
          <p className="mt-6 max-w-xl text-lg" style={{ color: `${INK}b3` }}>
            I build beautiful, fast websites for {NICHE}. You pick a design you
            love, I make it yours, put it on your domain, and keep it running.
            No agencies, no months of waiting.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: "#25D366" }}
            >
              <MessageCircle className="size-4" />
              Start on WhatsApp
            </a>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-full border-2 px-7 py-3.5 text-sm font-bold transition-colors hover:text-white"
              style={{ borderColor: INK, color: INK }}
            >
              See the {SITE_COUNT} templates
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </Reveal>
      </header>

      {/* Video tour */}
      <section className="mx-auto mt-6 max-w-6xl px-5 md:px-10">
        <Reveal>
          <div className="flex flex-col items-center gap-10 rounded-3xl bg-white p-8 shadow-sm md:flex-row md:p-14">
            {/* phone frame */}
            <div className="shrink-0" style={{ width: 292 }}>
              <div
                className="overflow-hidden rounded-[2.4rem] border-[11px] shadow-2xl"
                style={{ borderColor: INK, background: INK }}
              >
                <video
                  src="/video/showreel-vertical.mp4"
                  poster="/video/showreel-poster.jpg"
                  className="block aspect-[9/16] w-full rounded-[1.6rem] object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  aria-label="30-second tour of websites I've built"
                />
              </div>
            </div>
            <div className="text-center md:text-left">
              <p className="text-sm font-bold uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
                30-second tour
              </p>
              <h2 className={`${display.className} mt-3 text-4xl md:text-5xl`}>
                See what your site
                <em style={{ color: ACCENT }}> could be.</em>
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed" style={{ color: `${INK}99` }}>
                A fast look at real sites I&apos;ve built. Made for your phone —
                save it, send it to a friend, or post it to your story.
              </p>
              <a
                href="/video/showreel-vertical.mp4"
                download
                className="mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: INK }}
              >
                <Download className="size-4" />
                Download the video
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* What you get */}
      <section className="mx-auto mt-24 max-w-6xl px-5 md:px-10">
        <div className="grid gap-6 sm:grid-cols-2">
          {INCLUDED.map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <div className="flex h-full flex-col rounded-2xl bg-white p-7 shadow-sm">
                <span
                  className="flex size-11 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: ACCENT }}
                >
                  <item.icon className="size-5" />
                </span>
                <h3 className={`${display.className} mt-5 text-2xl`}>{item.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed" style={{ color: `${INK}99` }}>
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="mx-auto mt-24 max-w-6xl px-5 md:px-10">
        <Reveal>
          <div className="flex items-baseline gap-4 border-b-2 pb-3" style={{ borderColor: INK }}>
            <span className={`${display.className} text-2xl italic`} style={{ color: ACCENT }}>
              $
            </span>
            <h2 className={`${display.className} text-3xl md:text-4xl`}>Simple packages</h2>
            <span className="ml-auto text-sm font-bold uppercase tracking-[0.2em]" style={{ color: `${INK}80` }}>
              one-time build
            </span>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {TIERS.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 80} className="h-full">
              <div
                className="flex h-full flex-col rounded-2xl p-7 shadow-sm"
                style={{
                  backgroundColor: tier.featured ? INK : "#ffffff",
                  color: tier.featured ? PAPER : INK,
                }}
              >
                {tier.featured ? (
                  <span
                    className="mb-3 self-start rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white"
                    style={{ backgroundColor: ACCENT }}
                  >
                    Most popular
                  </span>
                ) : null}
                <h3 className={`${display.className} text-3xl`}>{tier.name}</h3>
                <p className="mt-1 text-sm" style={{ color: tier.featured ? `${PAPER}b3` : `${INK}99` }}>
                  {tier.tagline}
                </p>
                <p className="mt-6 flex items-baseline gap-1">
                  <span className="text-sm font-bold" style={{ color: tier.featured ? `${PAPER}99` : `${INK}80` }}>
                    from {CURRENCY}
                  </span>
                  <span className={`${display.className} text-5xl`}>{tier.setup}</span>
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.15em]" style={{ color: tier.featured ? `${PAPER}80` : `${INK}70` }}>
                  Best for {tier.best}
                </p>
                <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[15px]">
                      <Check className="mt-0.5 size-4 shrink-0" style={{ color: ACCENT }} />
                      <span style={{ color: tier.featured ? PAPER : `${INK}cc` }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5"
                  style={{
                    backgroundColor: tier.featured ? ACCENT : INK,
                    color: "#ffffff",
                  }}
                >
                  Start {tier.name}
                  <ArrowUpRight className="size-4" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Care plan */}
        <Reveal>
          <div
            className="mt-6 flex flex-col gap-6 rounded-2xl border-2 border-dashed p-7 md:flex-row md:items-center md:justify-between"
            style={{ borderColor: `${INK}40` }}
          >
            <div className="max-w-md">
              <h3 className={`${display.className} text-2xl`}>
                Care plan
                <span className="ml-2 text-base not-italic" style={{ color: `${INK}80` }}>
                  {CURRENCY}{CARE.price}/mo
                </span>
              </h3>
              <p className="mt-1 text-[15px]" style={{ color: `${INK}99` }}>
                The part that keeps it worth it: your site stays hosted, updated
                and online, and I&apos;m one message away whenever it needs a change.
              </p>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2">
              {CARE.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0" style={{ color: ACCENT }} />
                  <span style={{ color: `${INK}cc` }}>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* Process */}
      <section className="mx-auto mt-24 max-w-6xl px-5 md:px-10">
        <Reveal>
          <div className="flex items-baseline gap-4 border-b-2 pb-3" style={{ borderColor: INK }}>
            <span className={`${display.className} text-2xl italic`} style={{ color: ACCENT }}>
              →
            </span>
            <h2 className={`${display.className} text-3xl md:text-4xl`}>How it works</h2>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 70} className="h-full">
              <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm">
                <span className={`${display.className} text-4xl italic`} style={{ color: ACCENT }}>
                  {step.n}
                </span>
                <h3 className={`${display.className} mt-3 text-xl`}>{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed" style={{ color: `${INK}99` }}>
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Proof */}
      <section className="mx-auto mt-24 max-w-6xl px-5 md:px-10">
        <Reveal>
          <div
            className="flex flex-col items-start gap-6 rounded-3xl p-9 md:flex-row md:items-center md:justify-between"
            style={{ backgroundColor: INK, color: PAPER }}
          >
            <div>
              <h2 className={`${display.className} text-3xl md:text-4xl`}>
                {SITE_COUNT} sites. All built by me.
              </h2>
              <p className="mt-2 max-w-lg text-[15px]" style={{ color: `${PAPER}b3` }}>
                The whole portfolio is my own work — real, working websites, not
                stock previews. Yours will look just as sharp.
              </p>
            </div>
            <Link
              href="/portfolio"
              className="inline-flex shrink-0 items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: ACCENT }}
            >
              Browse the portfolio
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="mx-auto mt-24 max-w-3xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-3xl md:text-4xl`}>Questions</h2>
        </Reveal>
        <div className="mt-6 divide-y" style={{ borderColor: `${INK}20` }}>
          {FAQ.map((item, i) => (
            <Reveal key={item.q} delay={i * 50}>
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <span className={`${display.className} text-lg`}>{item.q}</span>
                  <span
                    className="flex size-6 shrink-0 items-center justify-center rounded-full text-white transition-transform group-open:rotate-45"
                    style={{ backgroundColor: ACCENT }}
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[15px] leading-relaxed" style={{ color: `${INK}99` }}>
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <footer className="mx-auto mt-24 max-w-6xl px-5 pb-20 md:px-10">
        <Reveal>
          <div className="rounded-3xl border-2 py-14 text-center" style={{ borderColor: INK }}>
            <h2 className={`${display.className} mx-auto max-w-2xl px-4 text-4xl md:text-5xl`}>
              Let&apos;s get your business
              <em style={{ color: ACCENT }}> online.</em>
            </h2>
            <p className="mx-auto mt-4 max-w-md px-4 text-[15px]" style={{ color: `${INK}99` }}>
              Tell me about your business and I&apos;ll show you exactly what your
              site could look like — no obligation.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: "#25D366" }}
              >
                <MessageCircle className="size-4" />
                Message me on WhatsApp
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="inline-flex items-center gap-2 rounded-full border-2 px-7 py-3.5 text-sm font-bold transition-colors hover:text-white"
                style={{ borderColor: INK, color: INK }}
              >
                <Send className="size-4" />
                {CONTACT.email}
              </a>
            </div>
          </div>
        </Reveal>
      </footer>
    </div>
  );
}

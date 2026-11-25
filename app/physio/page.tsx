import type { Metadata } from "next";
import Image from "next/image";
import { Hanken_Grotesk, Instrument_Serif } from "next/font/google";
import { ArrowUpRight, Clock, Mail, MapPin, Phone, Plus } from "lucide-react";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { CallbackForm } from "@/components/layouts/hinge/callback-form";
import { InjuryBrowser } from "@/components/layouts/hinge/injury-browser";
import { SlicedPhoto } from "@/components/layouts/hinge/sliced-photo";
import {
  BRAND,
  FACTS,
  FAQS,
  FIRST_VISIT,
  HOURS,
  MOVEMENT_PHASES,
  NAV,
  PRICES,
  REGIONS,
  REHAB_PLAN,
  REVIEWS,
  TEAM,
  VISIT_CHIPS,
} from "@/lib/layouts/hinge";
import { CONTACT } from "@/lib/layouts/content";
import "./hinge.css";

export const metadata: Metadata = {
  title: "Hinge — Physio & Sports Rehab",
  description: "Island physiotherapy and sports rehab for fighters, divers, yogis and everyone who rolled an ankle on the way.",
  robots: { index: false },
};

const sans = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hinge-sans" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-hinge-serif" });

function Btn({ href, children, ghost = false }: { href: string; children: React.ReactNode; ghost?: boolean }) {
  return (
    <a href={href} className={`hinge-btn ${ghost ? "hinge-btn--ghost" : ""}`}>
      {children}
      {!ghost && (
        <span className="hinge-btn-arrow">
          <ArrowUpRight className="size-4" />
        </span>
      )}
    </a>
  );
}

function Heading({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`font-display text-balance text-[2.7rem] uppercase leading-[0.9] sm:text-6xl lg:text-[4.6rem] ${className}`}>{children}</h2>;
}

export default function HingePage() {
  return (
    <div
      className={`${sans.variable} ${serif.variable} hinge relative min-h-dvh overflow-x-clip p-2 font-[family-name:var(--font-hinge-sans)] antialiased sm:p-3 [&_.font-display]:font-[family-name:var(--font-hinge-serif)] [&_.font-display]:font-normal`}
    >
      <div className="grid gap-2">
        <Header />
        <Hero />
        <Facts />
        <FirstVisit />
        <Injuries />
        <Movement />
        <Rehab />
        <Reviews />
        <Team />
        <ComeToYou />
        <Prices />
        <Faq />
        <Contact />
        <Footer />
      </div>
      <LayoutSwitcher />
    </div>
  );
}

function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display inline-flex items-baseline gap-1 italic leading-none ${className}`}>
      {BRAND.name}
      <svg aria-hidden viewBox="0 0 20 20" className="size-[0.42em] translate-y-[-0.1em] not-italic">
        <circle cx="10" cy="10" r="8" fill="none" stroke="var(--coral)" strokeWidth="3.4" />
        <circle cx="10" cy="10" r="2.6" fill="var(--ink)" />
      </svg>
    </span>
  );
}

function Header() {
  return (
    <header className="hinge-cell sticky top-2 z-40 flex h-16 items-center justify-between gap-6 px-5 sm:top-3 sm:px-7">
      <a href="#top" className="text-[1.9rem]" aria-label={`${BRAND.full} — home`}>
        <Logo />
      </a>
      <nav aria-label="Main" className="hidden items-center gap-7 text-[13.5px] font-medium lg:flex">
        {NAV.map((n) => (
          <a key={n.href} href={n.href} className="relative after:absolute after:inset-x-0 after:-bottom-1 after:h-[2px] after:origin-left after:scale-x-0 after:bg-[var(--coral)] after:transition-transform hover:after:scale-x-100">
            {n.label}
          </a>
        ))}
      </nav>
      <Btn href="#contact">Book a session</Btn>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="hinge-cell relative grid min-h-[calc(100svh-6.5rem)] items-center overflow-hidden px-6 py-16 sm:px-12 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:px-16">
      <div className="relative z-10 grid gap-9">
        <Reveal>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-[var(--ink)] bg-[var(--sun)] px-3.5 py-1 text-[13px] font-semibold">
            <span className="size-2 rounded-full bg-[var(--coral)]" />
            {BRAND.line} · Thong Sala, Koh Phangan
          </p>
          <h1 className="font-display max-w-[26ch] text-balance text-[2.35rem] leading-[1.04] sm:text-5xl lg:text-[3.7rem]">
            Since 2019, our three physios have put more than 6,000 Muay Thai fighters, divers, yoga teachers and{" "}
            <em className="text-[var(--lagoon)]">scooter-scraped travellers</em> back on their feet, and back on the island they came for.
          </h1>
        </Reveal>
        <Reveal delay={150} className="flex flex-wrap items-center gap-4">
          <Btn href="#contact">Book an assessment</Btn>
          <a href="#team" className="text-sm font-semibold underline decoration-2 underline-offset-[6px] hover:decoration-[var(--coral)]">
            Meet the physios
          </a>
        </Reveal>
      </div>
      <div className="relative mt-14 h-[22rem] lg:mt-0 lg:h-full" aria-hidden>
        <div className="hinge-float absolute right-[4%] top-0 size-44 overflow-hidden rounded-full border-2 border-[var(--ink)] sm:size-60 lg:top-[2%] lg:size-[15rem]">
          <Image src="/img/layouts/yoga-backbend.jpg" alt="" fill sizes="240px" className="object-cover" priority />
        </div>
        <div className="hinge-float hinge-float--slow absolute bottom-0 left-[6%] size-40 overflow-hidden rounded-full border-2 border-[var(--ink)] sm:size-52 lg:bottom-[6%] lg:left-[8%] lg:size-[13rem]">
          <Image src="/img/layouts/muaythai-2.jpg" alt="" fill sizes="210px" className="object-cover" priority />
        </div>
        <div className="absolute bottom-[38%] right-[12%] hidden rotate-[-8deg] rounded-2xl border-2 border-[var(--ink)] bg-[var(--sea)] px-4 py-3 text-sm font-semibold shadow-[4px_4px_0_var(--ink)] sm:block">
          <span className="font-display block text-3xl leading-none">4.9★</span>
          612 Google reviews
        </div>
      </div>
    </section>
  );
}

function Facts() {
  return (
    <section aria-label="Why Hinge" className="grid gap-2 md:grid-cols-3">
      {FACTS.map((f, i) => (
        <Reveal key={f.title} delay={i * 90} className="hinge-cell hinge-cell--sun px-6 py-5">
          <h2 className="font-display text-[1.65rem] leading-tight">{f.title}</h2>
          <p className="mt-1 text-sm text-[var(--ink)]/75">{f.text}</p>
        </Reveal>
      ))}
    </section>
  );
}

function FirstVisit() {
  return (
    <section id="first-visit" className="hinge-cell hinge-cell--sun scroll-mt-24 px-4 py-16 sm:px-8 lg:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <Heading>Your first session, step by step</Heading>
        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-[var(--ink)]/75">
          No jargon and no ten-session packages. This is the hour you spend with us, and what you leave with.
        </p>
      </Reveal>
      <div className="mx-auto mt-12 grid max-w-5xl gap-2 md:grid-cols-3 md:grid-rows-2">
        <Reveal className="hinge-cell relative min-h-[18rem] overflow-hidden md:row-span-2">
          <Image src="/img/layouts/fitness-mat-class.jpg" alt="A physio coaching a client through a floor exercise" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
        </Reveal>
        {FIRST_VISIT.map((s, i) => (
          <Reveal key={s.n} delay={i * 80} className={`hinge-cell flex flex-col gap-3 p-6 ${i === 0 ? "bg-[var(--sea)]" : ""}`}>
            <div className="flex items-start justify-between gap-4">
              <span className="font-display text-5xl leading-none text-[var(--lagoon)]">{s.n}</span>
              {s.image && (
                <span className="relative size-24 shrink-0 overflow-hidden rounded-full border-2 border-[var(--ink)]">
                  <Image src={s.image} alt="" fill sizes="96px" className="object-cover" />
                </span>
              )}
            </div>
            <h3 className="font-display text-[1.7rem] leading-tight">{s.title}</h3>
            <p className="text-sm leading-relaxed text-[var(--ink)]/75">{s.text}</p>
          </Reveal>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Btn href="#contact">Book an assessment</Btn>
        <Btn href="#prices" ghost>
          See the prices
        </Btn>
      </div>
    </section>
  );
}

function Injuries() {
  return (
    <section id="injuries" className="grid scroll-mt-24 gap-2">
      <div className="hinge-cell grid gap-6 px-6 py-10 sm:px-10 md:grid-cols-2 md:items-end">
        <Heading>Where does it hurt?</Heading>
        <p className="max-w-md text-[15px] leading-relaxed text-[var(--ink)]/75 md:justify-self-end">
          From a stiff neck after a week of laptop work to a wrist that took one teep too many: what we see most on the island, and how we
          fix it.
        </p>
      </div>
      <InjuryBrowser regions={REGIONS} />
    </section>
  );
}

function Movement() {
  return (
    <section id="movement" className="grid scroll-mt-24 gap-2">
      <div className="grid gap-2 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)]">
        <div className="hinge-cell flex flex-col justify-end gap-5 p-7 sm:p-10 lg:min-h-[44rem]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--lagoon)]">Movement lab</p>
          <Heading>We watch you move</Heading>
          <p className="max-w-sm text-[15px] leading-relaxed text-[var(--ink)]/75">
            Filmed from the front and the side at 240 frames a second. Slowed right down, a kick or a landing shows exactly which joint is
            doing another joint&apos;s job.
          </p>
        </div>
        <SlicedPhoto src="/img/layouts/muaythai-1.jpg" alt="A fighter driving a knee into the heavy bag" className="hinge-cell min-h-[26rem] bg-[var(--ink)] lg:min-h-[44rem]" />
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {MOVEMENT_PHASES.map((p, i) => (
          <Reveal key={p.title} delay={i * 80} className="hinge-cell hinge-cell--sun p-6">
            <h3 className="font-display text-[1.7rem] leading-tight">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]/75">{p.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Rehab() {
  return (
    <section id="rehab" className="grid scroll-mt-24 gap-2 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)]">
      <div className="hinge-cell hinge-cell--sea flex flex-col justify-between gap-10 p-7 sm:p-10">
        <div className="grid gap-5">
          <Heading>Rehab that fits your trip</Heading>
          <p className="max-w-sm text-[15px] leading-relaxed text-[var(--ink)]/75">
            Most of our patients fly home in weeks, not months. Every plan is built backwards from the day you leave, so you go home with a
            stronger joint, not a half-finished one.
          </p>
        </div>
        <div>
          <Btn href="#prices" ghost>
            Rehab week prices
          </Btn>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {REHAB_PLAN.map((s, i) => (
          <Reveal key={s.title} delay={i * 80} className="hinge-cell flex flex-col gap-3 p-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] border-2 border-[var(--ink)]">
              <Image src={s.image} alt="" fill sizes="(min-width: 640px) 30vw, 100vw" className="object-cover transition-transform duration-700 hover:scale-105" />
            </div>
            <div className="px-3 pb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--lagoon)]">{s.when}</p>
              <h3 className="font-display mt-1 text-[1.8rem] leading-tight">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-[var(--ink)]/75">{s.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section aria-label="What patients say" className="hinge-cell grid gap-12 px-6 py-16 sm:px-12 lg:gap-16 lg:py-24">
      {REVIEWS.map((r, i) => (
        <Reveal
          key={r.name}
          from={i % 2 ? "right" : "left"}
          className={`flex max-w-4xl flex-col items-start gap-6 sm:flex-row sm:items-center ${i % 2 ? "sm:ml-auto sm:flex-row-reverse sm:text-right" : ""}`}
        >
          <span className="relative size-28 shrink-0 overflow-hidden rounded-full border-2 border-[var(--ink)] sm:size-36">
            <Image src={r.image} alt="" fill sizes="144px" className="object-cover" />
          </span>
          <figure>
            <blockquote className="font-display text-balance text-[1.7rem] leading-[1.15] sm:text-[2.2rem]">“{r.quote}”</blockquote>
            <figcaption className="mt-3 text-[13px] text-[var(--ink)]/70">
              <strong className="font-semibold text-[var(--ink)]">{r.name}</strong> · {r.detail}
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </section>
  );
}

function Team() {
  return (
    <section id="team" className="grid scroll-mt-24 gap-2">
      <div className="hinge-cell hinge-cell--sea grid gap-6 px-6 py-10 sm:px-10 md:grid-cols-2 md:items-end">
        <Heading>Three physios, one standard</Heading>
        <p className="max-w-md text-[15px] leading-relaxed text-[var(--ink)]/75 md:justify-self-end">
          You see a licensed physiotherapist every time, never an assistant, and the same one from your first session to your last.
        </p>
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        {TEAM.map((m, i) => (
          <Reveal key={m.name} delay={i * 100} className="hinge-cell overflow-hidden">
            <div className="relative aspect-[4/5] bg-[var(--sea)]">
              <div className="hinge-keyhole absolute inset-0">
                <Image src={m.image} alt={m.name} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
            </div>
            <div className="border-t-2 border-[var(--ink)] p-6">
              <h3 className="font-display text-[1.9rem] leading-tight">{m.name}</h3>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--lagoon)]">{m.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--ink)]/75">{m.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ComeToYou() {
  return (
    <section className="hinge-cell hinge-cell--lagoon relative grid items-center gap-12 overflow-hidden px-6 py-16 sm:px-12 lg:grid-cols-2 lg:py-24">
      <Reveal className="grid gap-6">
        <Heading className="text-[var(--sun)]">We come to you</Heading>
        <p className="max-w-lg text-[15px] leading-relaxed text-[#f4fbe6]/80">
          Can&apos;t get on a scooter? Training twice a day at a camp up north? We bring the treatment table and the taping kit to villas,
          camps and retreats anywhere within 12 km of Thong Sala. Same physios, same prices, plus ฿500 for the ride.
        </p>
        <ul className="flex flex-wrap gap-2">
          {VISIT_CHIPS.map((c) => (
            <li key={c} className="rounded-full border-[1.5px] border-[var(--sun)] px-3.5 py-1 text-[13px] text-[var(--sun)]">
              {c}
            </li>
          ))}
        </ul>
        <div>
          <Btn href="#contact">Arrange a visit</Btn>
        </div>
      </Reveal>
      <div className="relative mx-auto aspect-square w-[min(80vw,26rem)]" aria-hidden>
        <span className="hinge-ring" />
        <span className="hinge-ring" />
        <span className="hinge-ring" />
        <div className="absolute inset-[14%] overflow-hidden rounded-full border-2 border-[var(--sun)]">
          <Image src="/img/layouts/villa-pool-palms.jpg" alt="" fill sizes="320px" className="object-cover" />
        </div>
      </div>
    </section>
  );
}

function Prices() {
  return (
    <section id="prices" className="grid scroll-mt-24 gap-2 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)]">
      <div className="hinge-cell hinge-cell--sun flex flex-col justify-between gap-8 p-7 sm:p-10">
        <div className="grid gap-5">
          <Heading>Prices</Heading>
          <p className="max-w-xs text-[15px] leading-relaxed text-[var(--ink)]/75">In Thai baht, paid after your session by card, QR or cash. Nothing to buy up front.</p>
        </div>
        <a href="#faq" className="text-sm font-semibold underline decoration-2 underline-offset-[6px]">
          Can I claim it on insurance?
        </a>
      </div>
      <div className="hinge-cell px-6 py-4 sm:px-10">
        <ul>
          {PRICES.map((p) => (
            <li key={p.name} className="grid grid-cols-[1fr_auto_auto] items-baseline gap-x-5 border-b-2 border-[var(--ink)]/15 py-5 last:border-0">
              <div>
                <h3 className="font-display text-[1.6rem] leading-tight">{p.name}</h3>
                <p className="text-[13px] text-[var(--ink)]/65">{p.detail}</p>
              </div>
              <span className="text-xs text-[var(--ink)]/60">{p.time}</span>
              <span className="font-display text-[1.7rem] tabular-nums">฿{p.price}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="grid scroll-mt-24 gap-2 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)]">
      <div className="hinge-cell hinge-cell--sea flex flex-col gap-5 p-7 sm:p-10">
        <Heading>Questions we hear at the desk</Heading>
        <p className="max-w-xs text-[15px] leading-relaxed text-[var(--ink)]/75">Something else on your mind? Message the front desk and ask, that&apos;s what it&apos;s for.</p>
        <a href={CONTACT.phoneHref} className="text-sm font-semibold">
          {CONTACT.phone}
        </a>
      </div>
      <div className="hinge-faq grid gap-2">
        {FAQS.map((f) => (
          <details key={f.q} className="hinge-cell group px-6 sm:px-8">
            <summary className="flex items-center justify-between gap-6 py-5">
              <span className="font-display text-[1.45rem] leading-tight sm:text-[1.6rem]">{f.q}</span>
              <span className="plus grid size-9 shrink-0 place-items-center rounded-full border-2 border-[var(--ink)] group-open:bg-[var(--coral)]">
                <Plus className="size-4" />
              </span>
            </summary>
            <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-[var(--ink)]/75">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="grid scroll-mt-24 gap-2 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <div className="hinge-cell p-7 sm:p-10">
        <Heading className="mb-3">Book a session</Heading>
        <p className="mb-8 max-w-md text-[15px] leading-relaxed text-[var(--ink)]/75">
          Leave your number and a physio (not a call centre) rings you back to find a time, usually the same day.
        </p>
        <CallbackForm />
      </div>
      <div className="hinge-cell hinge-cell--sun flex flex-col gap-8 p-7 sm:p-10">
        <div className="grid gap-3">
          <h3 className="font-display text-[1.9rem] leading-tight">Find us</h3>
          <p className="flex gap-3 text-[15px]">
            <MapPin className="mt-0.5 size-4 shrink-0" />
            {CONTACT.address}
          </p>
          <p className="text-sm text-[var(--ink)]/70">Two minutes from the pier, above the pharmacy. Scooter parking at the back.</p>
        </div>
        <div className="grid gap-2">
          <h3 className="font-display text-[1.9rem] leading-tight">Call or write</h3>
          <a href={CONTACT.phoneHref} className="flex items-center gap-3 text-[15px] hover:underline">
            <Phone className="size-4" />
            {CONTACT.phone}
          </a>
          <a href={CONTACT.emailHref} className="flex items-center gap-3 text-[15px] hover:underline">
            <Mail className="size-4" />
            {CONTACT.email}
          </a>
        </div>
        <div className="grid gap-2">
          <h3 className="font-display flex items-center gap-2 text-[1.9rem] leading-tight">
            <Clock className="size-5" /> Opening hours
          </h3>
          <dl className="grid gap-1.5 text-[15px]">
            {HOURS.map((h) => (
              <div key={h.days} className="flex justify-between gap-6 border-b border-[var(--ink)]/15 pb-1.5">
                <dt>{h.days}</dt>
                <dd className="tabular-nums">{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="hinge-cell hinge-cell--sun px-6 pb-6 pt-12 sm:px-10">
      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="grid content-start gap-3">
          <Logo className="text-6xl" />
          <p className="max-w-xs text-sm text-[var(--ink)]/75">Physio and sports rehab on Koh Phangan. Back to training, back in the water.</p>
        </div>
        <div className="grid content-start gap-2 text-sm">
          <h3 className="font-display mb-1 text-2xl">Clinic</h3>
          <a href="#first-visit" className="hover:underline">First visit</a>
          <a href="#injuries" className="hover:underline">Injuries</a>
          <a href="#team" className="hover:underline">Physios</a>
        </div>
        <div className="grid content-start gap-2 text-sm">
          <h3 className="font-display mb-1 text-2xl">Care</h3>
          <a href="#movement" className="hover:underline">Movement lab</a>
          <a href="#rehab" className="hover:underline">Rehab plans</a>
          <a href="#prices" className="hover:underline">Prices</a>
        </div>
        <div className="grid content-start gap-2 text-sm">
          <h3 className="font-display mb-1 text-2xl">Visit</h3>
          <p>{CONTACT.address}</p>
          <a href={CONTACT.phoneHref} className="hover:underline">{CONTACT.phone}</a>
        </div>
      </div>
      <div className="mt-12 flex flex-wrap justify-between gap-3 border-t-2 border-[var(--ink)] pt-5 text-xs">
        <p>© {new Date().getFullYear()} {BRAND.full}. Demo template, all people and details are fictional.</p>
        <a href="#top" className="font-semibold hover:underline">Back to the top ↑</a>
      </div>
    </footer>
  );
}

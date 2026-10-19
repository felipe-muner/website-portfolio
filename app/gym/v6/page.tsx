import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Big_Shoulders_Stencil, Geist, Geist_Mono, Permanent_Marker, Saira_Extra_Condensed } from "next/font/google";
import { ArrowDownRight, ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { BookForm } from "@/components/layouts/chalk/book-form";
import { HeroStage } from "@/components/layouts/chalk/hero-stage";
import { Membership } from "@/components/layouts/chalk/membership";
import { NextClass } from "@/components/layouts/chalk/next-class";
import { ScheduleLink } from "@/components/layouts/chalk/schedule-link";
import { WeekBoard } from "@/components/layouts/chalk/week-board";
import { Whiteboard } from "@/components/layouts/chalk/whiteboard";
import { CONTACT, FACILITY, GYM_CLASSES, GYM_COACHES, GYM_PLANS } from "@/lib/layouts/content";
import { GYM_WEEK } from "@/lib/layouts/schedule";

export const metadata: Metadata = {
  title: "Gym Layout 6 — Chalk",
  robots: { index: false },
};

const sans = Geist({ subsets: ["latin"], variable: "--font-chalk-sans" });
const display = Saira_Extra_Condensed({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-chalk-display",
});
const stencil = Big_Shoulders_Stencil({ subsets: ["latin"], variable: "--font-chalk-stencil" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-chalk-mono" });
const marker = Permanent_Marker({ subsets: ["latin"], weight: "400", variable: "--font-chalk-marker" });

const OPEN_DAYS = new Set(GYM_WEEK.map((s) => s.weekday)).size;
const FIRST_CLASS = GYM_WEEK.map((s) => s.start).sort()[0];
const LAST_CLASS = GYM_WEEK.map((s) => s.end).sort().reverse()[0];

const STATS = [
  { v: GYM_WEEK.length, l: "Classes a week" },
  { v: GYM_COACHES.length, l: "Coaches" },
  { v: `฿${GYM_PLANS[0].price}`, l: "Drop-in" },
  { v: OPEN_DAYS, l: "Days open" },
] as const;

const TICKER = ["Cross-Training", "Race Prep", "HIIT", "Weightlifting", "Boot Camp", "Jiu-Jitsu", "Open Gym", "Ice Bath"];

const NAV = [
  { href: "#programs", label: "Programs" },
  { href: "#schedule", label: "Schedule" },
  { href: "#membership", label: "Membership" },
  { href: "#coaches", label: "Coaches" },
] as const;

/** Timetable search for a program card ("HIIT & Tabata" spans two class names). */
const termFor = (name: string) => (name === "HIIT & Tabata" ? "intervals" : name);

/* Film grain over the whole page — grit, not glow. */
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const HAZARD = "bg-[repeating-linear-gradient(-45deg,#f5c518_0_14px,#111110_14px_28px)]";

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[#f5c518]">
      <span className="h-px w-8 bg-[#f5c518]" />
      {children}
    </p>
  );
}

function SectionHead({ kicker, title, aside }: { kicker: string; title: React.ReactNode; aside?: string }) {
  return (
    <Reveal className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <Kicker>{kicker}</Kicker>
        <h2 className="font-display mt-4 text-balance text-[3.4rem] font-black uppercase leading-[0.86] sm:text-7xl lg:text-[6.2rem]">
          {title}
        </h2>
      </div>
      {aside && <p className="max-w-sm leading-relaxed text-white/55 lg:pb-3">{aside}</p>}
    </Reveal>
  );
}

function PlateMark() {
  return (
    <span aria-hidden className="grid size-7 place-items-center rounded-full bg-[#f5c518] shadow-[inset_0_0_0_3px_#c39c0b]">
      <span className="size-2.5 rounded-full bg-[#0b0b0a] shadow-[0_0_0_2px_#9a9a96]" />
    </span>
  );
}

export default function ChalkLayout() {
  return (
    <div
      className={`${sans.variable} ${display.variable} ${stencil.variable} ${mono.variable} ${marker.variable} relative min-h-dvh overflow-x-clip bg-[#0b0b0a] font-[family-name:var(--font-chalk-sans)] text-[#f3efe6] antialiased selection:bg-[#f5c518] selection:text-black [&_.font-display]:font-[family-name:var(--font-chalk-display)] [&_.font-marker]:font-[family-name:var(--font-chalk-marker)] [&_.font-mono]:font-[family-name:var(--font-chalk-mono)] [&_.font-stencil]:font-[family-name:var(--font-chalk-stencil)]`}
    >
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[45] opacity-[0.09] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
      <Nav />
      <Hero />
      <Ticker />
      <Programs />
      <Schedule />
      <Pricing />
      <Coaches />
      <Recovery />
      <Book />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0b0b0a]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <PlateMark />
          <span className="font-stencil text-[1.7rem] font-extrabold leading-none tracking-[0.08em]">CHALK</span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-white/40 lg:inline">
            Strength club
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-display text-lg font-bold uppercase tracking-[0.06em] text-white/65 transition-colors hover:text-[#f5c518]"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href="#book"
          className="font-display inline-flex h-10 items-center gap-2 rounded-sm bg-[#f5c518] px-4 text-lg font-extrabold uppercase tracking-[0.05em] text-black transition-colors hover:bg-white"
        >
          Free class <ArrowRight className="size-4" strokeWidth={2.5} />
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative isolate flex flex-col overflow-hidden lg:min-h-[max(calc(100svh-4rem),760px)]">
      {/* The rack room behind it all, blacked down to a whisper. */}
      <Image
        src="/img/layouts/gym-racks-moody.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover opacity-[0.17] grayscale"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(42%_62%_at_70%_8%,rgba(255,236,200,0.17),transparent_72%),linear-gradient(to_bottom,rgba(11,11,10,0.35),#0b0b0a_94%)]"
      />
      <p
        aria-hidden
        className="font-stencil pointer-events-none absolute -bottom-[0.12em] right-[-0.03em] -z-10 select-none text-[34vw] font-black leading-none text-white/[0.04] lg:text-[25vw]"
      >
        CHALK
      </p>

      <HeroStage />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 pb-14 sm:px-8 lg:px-12 lg:pb-10 lg:pt-16">
        <div className="max-w-[40rem] lg:my-auto lg:max-w-[46%]">
          <Reveal>
            <Kicker>Strength &amp; conditioning · {CONTACT.area}</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display mt-6 text-[4.3rem] font-black uppercase leading-[0.84] sm:text-[6.6rem] lg:text-[clamp(5.6rem,8.4vw,9.6rem)]">
              Lift heavy.
              <br />
              <span className="text-[#f5c518]">Leave chalk.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-7 max-w-[32rem] text-[17px] leading-relaxed text-white/65 sm:text-lg">
              Coached strength, conditioning and jiu-jitsu on the island&apos;s heaviest floor — racks,
              platforms, sleds, and an ice bath to finish. Your first class is on us.
            </p>
          </Reveal>
          <Reveal delay={240} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#book"
              className="font-display group inline-flex h-14 items-center gap-4 rounded-sm bg-[#f5c518] px-6 text-2xl font-extrabold uppercase tracking-[0.04em] text-black transition-colors hover:bg-white"
            >
              Book a free class
              <ArrowRight className="size-6 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
            </a>
            <a
              href="#schedule"
              className="font-display inline-flex h-14 items-center gap-3 rounded-sm border border-white/20 px-6 text-2xl font-bold uppercase tracking-[0.04em] text-white/85 transition-colors hover:border-[#f5c518] hover:text-[#f5c518]"
            >
              See the board <ArrowDownRight className="size-5" />
            </a>
          </Reveal>
          <Reveal delay={300} className="mt-6">
            <NextClass />
          </Reveal>
        </div>

        <Reveal delay={360} className="mt-12 lg:mt-0">
          <dl className="grid max-w-[40rem] grid-cols-2 gap-x-8 gap-y-6 border-t border-white/10 pt-6 sm:grid-cols-4 lg:max-w-[46%]">
            {STATS.map((s) => (
              <div key={s.l} className="flex flex-col gap-1">
                <dt className="order-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{s.l}</dt>
                <dd className="font-stencil order-1 text-5xl font-extrabold leading-none">{s.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

function Ticker() {
  return (
    <div className="marquee-viewport overflow-hidden border-y border-black bg-[#f5c518] py-2.5 text-black [--marquee-duration:40s]">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
            {TICKER.map((item) => (
              <li key={item} className="font-display flex items-center whitespace-nowrap text-[2rem] font-black uppercase leading-none">
                <span className="px-6">{item}</span>
                <span aria-hidden className="font-stencil text-2xl font-black">
                  {"//"}
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

function Programs() {
  return (
    <section id="programs" className="scroll-mt-16 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          kicker="Programs"
          title={
            <>
              Six ways <span className="text-[#f5c518]">to earn it.</span>
            </>
          }
          aside="Every class coached, every level welcome. Tap a program to light up its sessions on the board."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GYM_CLASSES.map((item, i) => (
            <Reveal key={item.name} delay={(i % 3) * 80}>
              <ScheduleLink
                term={termFor(item.name)}
                className="group relative block aspect-[4/5] overflow-hidden rounded-md bg-[#121211] outline-2 outline-offset-0 outline-transparent transition-[outline-color] duration-300 hover:outline-[#f5c518]"
              >
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw"
                  className="object-cover grayscale contrast-125 transition duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0a] via-[#0b0b0a]/45 to-transparent" />
                <span className="font-stencil absolute left-5 top-3 text-7xl font-black leading-none text-[#f5c518]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="absolute inset-x-5 bottom-5">
                  <h3 className="font-display text-[2.6rem] font-black uppercase leading-[0.88]">{item.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{item.detail}</p>
                  <p className="mt-4 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#f5c518]">
                    {item.coach ? `Coach ${item.coach}` : "Coached"}
                    <span className="text-white/60 transition-colors group-hover:text-[#f5c518]">See times →</span>
                  </p>
                </div>
              </ScheduleLink>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Schedule() {
  return (
    <section id="schedule" className="scroll-mt-16 border-t border-white/[0.07] bg-[#0e0e0d] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          kicker="This week"
          title={
            <>
              The board. <span className="text-[#f5c518]">Show up.</span>
            </>
          }
          aside={`${GYM_WEEK.length} coached sessions, ${FIRST_CLASS} to ${LAST_CLASS}, ${OPEN_DAYS} days a week. Tap any session to book it.`}
        />
        <div className="mt-14 grid items-start gap-12 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-10">
          <Reveal className="px-3 pt-3 lg:sticky lg:top-24">
            <Whiteboard />
          </Reveal>
          <Reveal delay={100} className="min-w-0">
            <WeekBoard />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="membership" className="scroll-mt-16 border-t border-white/[0.07] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          kicker="Membership"
          title={
            <>
              Pick your <span className="text-[#f5c518]">weight.</span>
            </>
          }
          aside="Straightforward gym access in Thai Baht. Class packs and combos at the front desk."
        />
        <Reveal delay={100} className="mt-12">
          <Membership />
        </Reveal>
      </div>
    </section>
  );
}

function Coaches() {
  return (
    <section id="coaches" className="scroll-mt-16 border-t border-white/[0.07] bg-[#0e0e0d] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          kicker="Coaches"
          title={
            <>
              Your <span className="text-[#f5c518]">corner.</span>
            </>
          }
          aside="Tap a coach to light up every session they run this week."
        />
        <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3">
          {GYM_COACHES.map((coach, i) => (
            <Reveal key={coach.name} delay={(i % 3) * 80}>
              <ScheduleLink term={coach.name} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-[#121211]">
                  <Image
                    src={coach.image}
                    alt={`${coach.name} — ${coach.specialty}`}
                    fill
                    sizes="(min-width: 1024px) 30vw, 46vw"
                    className="object-cover grayscale contrast-110 transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0a] via-transparent to-transparent" />
                  <div className="absolute inset-x-4 bottom-3 flex flex-wrap items-end justify-between gap-x-3">
                    <h3 className="font-display text-5xl font-black uppercase leading-[0.9] sm:text-6xl">{coach.name}</h3>
                    <span className="mb-2 font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/60">
                      {coach.languages}
                    </span>
                  </div>
                </div>
                <p className="mt-3 flex flex-wrap justify-between gap-x-3 gap-y-1 font-mono text-[10.5px] uppercase tracking-[0.2em]">
                  <span className="text-[#f5c518]">{coach.specialty}</span>
                  <span className="text-white/45 transition-colors group-hover:text-white">Their classes →</span>
                </p>
              </ScheduleLink>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Recovery() {
  return (
    <section className="border-t border-white/[0.07] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          kicker="Recovery & facilities"
          title={
            <>
              Recover like <span className="text-[#f5c518]">you mean it.</span>
            </>
          }
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FACILITY.map((item, i) => (
            <Reveal key={item.title} delay={i * 80} className="h-full">
              <article className="group h-full overflow-hidden rounded-md border border-white/10 bg-[#121211]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 92vw"
                    className="object-cover grayscale transition duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-3xl font-black uppercase leading-none">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">{item.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Book() {
  return (
    <section id="book" className="scroll-mt-16 px-3 sm:px-5">
      <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-md border border-white/10 bg-[#111110]">
        <div aria-hidden className={`h-3 ${HAZARD}`} />
        <div className="grid gap-12 px-6 py-14 sm:px-12 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-16">
          <Reveal>
            <Kicker>Free first class</Kicker>
            <h2 className="font-display mt-4 text-[3.6rem] font-black uppercase leading-[0.86] sm:text-7xl lg:text-[6rem]">
              First class
              <br />
              <span className="text-[#f5c518]">is on us.</span>
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-white/60">
              Pick a class and a time, tell us who you are, and show up ten minutes early. No card, no contract.
            </p>
            <dl className="mt-10 grid gap-5 text-sm">
              {[
                { icon: MapPin, label: "Find us", value: CONTACT.address },
                { icon: Clock, label: "Hours", value: `Classes ${FIRST_CLASS}–${LAST_CLASS}, ${OPEN_DAYS} days a week` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-sm border border-white/10 text-[#f5c518]">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{label}</dt>
                    <dd className="mt-1 leading-relaxed text-white/80">{value}</dd>
                  </div>
                </div>
              ))}
              <div className="flex items-start gap-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-sm border border-white/10 text-[#f5c518]">
                  <Phone className="size-4" />
                </span>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Talk to us</dt>
                  <dd className="mt-1 flex flex-col gap-0.5 text-white/80">
                    <a href={CONTACT.phoneHref} className="transition-colors hover:text-[#f5c518]">
                      {CONTACT.phone}
                    </a>
                    <a href={CONTACT.emailHref} className="transition-colors hover:text-[#f5c518]">
                      {CONTACT.email}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-md border border-white/10 bg-[#0b0b0a] p-6 sm:p-8">
              <BookForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden pt-20">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-12">
        <div>
          <p className="flex items-center gap-3">
            <PlateMark />
            <span className="font-stencil text-[1.7rem] font-extrabold leading-none tracking-[0.08em]">CHALK</span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
            Strength, conditioning and recovery — one floor, coached every day.
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Visit</p>
          <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-white/75">
            <MapPin className="mt-0.5 size-4 shrink-0 text-[#f5c518]" />
            {CONTACT.address}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Talk</p>
          <div className="mt-3 flex flex-col gap-1.5 text-sm text-white/75">
            <a href={CONTACT.phoneHref} className="inline-flex items-center gap-2 transition-colors hover:text-[#f5c518]">
              <Phone className="size-4 text-[#f5c518]" /> {CONTACT.phone}
            </a>
            <a href={CONTACT.emailHref} className="inline-flex items-center gap-2 transition-colors hover:text-[#f5c518]">
              <Mail className="size-4 text-[#f5c518]" /> {CONTACT.email}
            </a>
          </div>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Follow</p>
          <div className="mt-3 flex items-center gap-3">
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid size-10 place-items-center rounded-sm border border-white/10 text-white/75 transition-colors hover:border-[#f5c518] hover:text-[#f5c518]"
            >
              <InstagramIcon className="size-4" />
            </a>
            <a
              href={CONTACT.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="grid size-10 place-items-center rounded-sm border border-white/10 text-white/75 transition-colors hover:border-[#f5c518] hover:text-[#f5c518]"
            >
              <FacebookIcon className="size-4" />
            </a>
            <span className="font-mono text-[11px] text-white/45">{CONTACT.instagramHandle}</span>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[1440px] flex-col gap-2 px-5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/35 sm:flex-row sm:justify-between sm:px-8 lg:px-12">
        <span>© {new Date().getFullYear()} Chalk Strength Club — fictional demo · Layout 6</span>
        <span>{CONTACT.area}</span>
      </div>
      <div aria-hidden className={`mt-8 h-3 ${HAZARD}`} />
      <p
        aria-hidden
        className="font-stencil -mb-[0.18em] select-none bg-gradient-to-b from-[#f5c518] via-[#f5c518]/40 to-transparent bg-clip-text text-center text-[37vw] font-black leading-[0.86] text-transparent"
      >
        CHALK
      </p>
    </footer>
  );
}

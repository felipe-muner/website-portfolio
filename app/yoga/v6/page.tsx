import type { Metadata } from "next";
import Image from "next/image";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { ArrowDownRight, ArrowUpRight, Clock, Mail, MapPin, Phone, Plus } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { BookForm } from "@/components/layouts/stillwater/book-form";
import { Breathe } from "@/components/layouts/stillwater/breathe";
import { HeroStage } from "@/components/layouts/stillwater/hero-stage";
import { NextClass } from "@/components/layouts/stillwater/next-class";
import { Passes } from "@/components/layouts/stillwater/passes";
import { ScheduleLink } from "@/components/layouts/stillwater/schedule-link";
import { WeekSchedule } from "@/components/layouts/stillwater/week-schedule";
import { CONTACT, YOGA_CLASSES, YOGA_COACHES } from "@/lib/layouts/content";
import { YOGA_WEEK } from "@/lib/layouts/schedule";
import { AMENITIES, FAQ, GALLERY, MATS, PACE_LABEL, PASSES, feelOf } from "@/lib/layouts/stillwater";

export const metadata: Metadata = {
  title: "Yoga Layout 6 — Stillwater",
  robots: { index: false },
};

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-sw-display",
});
const sans = Manrope({ subsets: ["latin"], variable: "--font-sw-sans" });

const NAV = [
  { href: "#breathe", label: "Breathe" },
  { href: "#classes", label: "Classes" },
  { href: "#schedule", label: "Schedule" },
  { href: "#passes", label: "Passes" },
  { href: "#sala", label: "The sala" },
] as const;

const FIRST_CLASS = YOGA_WEEK.map((s) => s.start).sort()[0];
const LAST_CLASS = YOGA_WEEK.map((s) => s.end).sort().reverse()[0];
const DROP_IN = PASSES.find((p) => p.name === "Drop-in")?.price ?? 0;

const STATS = [
  { v: YOGA_WEEK.length, l: "Classes a week" },
  { v: YOGA_COACHES.length, l: "Teachers" },
  { v: MATS, l: "Mats in the sala" },
  { v: `฿${DROP_IN}`, l: "Drop-in" },
] as const;

const TICKER = ["Vinyasa", "Yin & restore", "Breathwork", "Mat pilates", "Sound bath", "Mobility", "Full moon flow", "Ice bath"];

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f2b46d]">
      <span className="h-px w-8 bg-[#f2b46d]/70" />
      {children}
    </p>
  );
}

function SectionHead({ kicker, title, aside }: { kicker: string; title: React.ReactNode; aside?: string }) {
  return (
    <Reveal className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <Kicker>{kicker}</Kicker>
        <h2 className="font-display mt-5 max-w-3xl text-balance text-[3.1rem] font-light leading-[0.98] sm:text-6xl lg:text-[4.6rem]">
          {title}
        </h2>
      </div>
      {aside && <p className="max-w-sm leading-relaxed text-[#ece4d6]/55 lg:pb-3">{aside}</p>}
    </Reveal>
  );
}

/** Three river stones, balanced. */
function CairnMark() {
  return (
    <span aria-hidden className="flex w-7 flex-col items-center gap-[2px]">
      <span className="h-[6px] w-[11px] rounded-[50%] bg-[#f2b46d]" />
      <span className="h-[7px] w-[17px] -rotate-6 rounded-[50%] bg-[#ece4d6]/80" />
      <span className="h-[8px] w-[24px] rounded-[50%] bg-[#ece4d6]/45" />
    </span>
  );
}

export default function StillwaterLayout() {
  return (
    <div
      className={`${display.variable} ${sans.variable} min-h-dvh overflow-x-clip bg-[#0a1014] font-[family-name:var(--font-sw-sans)] text-[#ece4d6] antialiased selection:bg-[#f2b46d] selection:text-[#0a1014] [&_.font-display]:font-[family-name:var(--font-sw-display)]`}
    >
      <Nav />
      <Hero />
      <Ticker />
      <BreatheSection />
      <Classes />
      <Schedule />
      <Teachers />
      <PassesSection />
      <Sala />
      <Book />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 h-0">
      <div className="px-3 pt-3 sm:px-5 sm:pt-4">
        <nav className="mx-auto flex max-w-[1440px] items-center justify-between rounded-full border border-[#ece4d6]/10 bg-[#0a1014]/70 py-1.5 pl-4 pr-1.5 backdrop-blur-xl">
          <a href="#top" className="flex items-center gap-2.5">
            <CairnMark />
            <span className="font-display text-[1.6rem] leading-none tracking-[0.01em]">Stillwater</span>
          </a>
          <div className="hidden items-center lg:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-[14px] text-[#ece4d6]/65 transition-colors hover:bg-[#ece4d6]/[0.07] hover:text-[#ece4d6]"
              >
                {item.label}
              </a>
            ))}
          </div>
          <a
            href="#book"
            className="inline-flex h-10 items-center rounded-full bg-[#ece4d6] px-5 text-[14px] font-semibold text-[#0a1014] transition-colors hover:bg-[#f2b46d]"
          >
            Book a class
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative isolate flex flex-col overflow-hidden bg-[#0a1014] lg:min-h-[max(100svh,800px)]">
      <HeroStage />
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 pb-16 sm:px-8 lg:px-12 lg:pb-12 lg:pt-32">
        <div className="max-w-[40rem] lg:my-auto lg:max-w-[44%]">
          <Reveal>
            <Kicker>Yoga &amp; breath · {CONTACT.area}</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display mt-6 text-[3.9rem] font-light leading-[0.92] tracking-[-0.01em] sm:text-[5.4rem] lg:text-[clamp(5rem,7.2vw,8.2rem)]">
              Still water,
              <br />
              <em className="text-[#f2b46d]">steady mind.</em>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-7 max-w-[30rem] text-[17px] leading-relaxed text-[#ece4d6]/70">
              Slow flows, strong flows and breathwork in an open-air sala over the bay. Mats, props and
              ginger tea are on us — and so is your first class.
            </p>
          </Reveal>
          <Reveal delay={240} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#book"
              className="inline-flex h-[52px] items-center rounded-full bg-[#f2b46d] px-7 text-[15px] font-semibold text-[#0a1014] transition-colors hover:bg-[#ece4d6]"
            >
              Book a free class
            </a>
            <a
              href="#schedule"
              className="inline-flex h-[52px] items-center gap-2 rounded-full border border-[#ece4d6]/25 px-7 text-[15px] text-[#ece4d6]/85 transition-colors hover:border-[#ece4d6]/60 hover:text-[#ece4d6]"
            >
              This week&apos;s classes <ArrowDownRight className="size-4" />
            </a>
          </Reveal>
          <Reveal delay={300} className="mt-7">
            <NextClass />
          </Reveal>
        </div>

        <Reveal delay={360} className="mt-12 lg:mt-0">
          <dl className="grid max-w-[40rem] grid-cols-2 gap-x-8 gap-y-6 border-t border-[#ece4d6]/10 pt-6 sm:grid-cols-4 lg:max-w-[44%]">
            {STATS.map((s) => (
              <div key={s.l} className="flex flex-col gap-1">
                <dt className="order-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ece4d6]/40">{s.l}</dt>
                <dd className="font-display order-1 text-[2.6rem] font-light leading-none lining-nums">{s.v}</dd>
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
    <div className="marquee-viewport overflow-hidden border-y border-[#ece4d6]/10 py-4 [--marquee-duration:60s]">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
            {TICKER.map((item) => (
              <li key={item} className="font-display flex items-center whitespace-nowrap text-[2.1rem] font-light italic leading-none text-[#ece4d6]/80">
                <span className="px-7">{item}</span>
                <span aria-hidden className="h-[7px] w-[12px] rounded-[50%] bg-[#f2b46d]/70" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

function BreatheSection() {
  return (
    <section id="breathe" className="scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <Breathe
          intro={
            <Reveal>
              <Kicker>Before you book</Kicker>
              <h2 className="font-display mt-5 text-balance text-[3.1rem] font-light leading-[0.98] sm:text-6xl lg:text-[4.6rem]">
                Take one minute. <em className="text-[#f2b46d]">Ring the bowl.</em>
              </h2>
              <p className="mt-6 max-w-md leading-relaxed text-[#ece4d6]/55">
                Every class here starts the same way: one strike of the bowl and five slow breaths. Try it — the
                bowl is real enough to ring.
              </p>
            </Reveal>
          }
        />
      </div>
    </section>
  );
}

function Classes() {
  return (
    <section id="classes" className="scroll-mt-20 border-t border-[#ece4d6]/[0.07] bg-[#0c1317] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          kicker="Classes"
          title={
            <>
              Six ways onto <em className="text-[#f2b46d]">the mat.</em>
            </>
          }
          aside="From candle-lit yin to a sweaty power flow — each marked by pace, so you know what you're walking into. Tap one to see when it's on."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {YOGA_CLASSES.map((item, i) => {
            const feel = feelOf(item.name);
            return (
              <Reveal key={item.name} delay={(i % 3) * 80}>
                <ScheduleLink
                  term={item.name}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-[28px] bg-[#111a1f]"
                >
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw"
                    className="object-cover transition duration-1000 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1014] via-[#0a1014]/40 to-[#0a1014]/5" />
                  <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-[#0a1014]/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur">
                    <span className="flex gap-[3px]">
                      {[1, 2, 3].map((p) => (
                        <span key={p} className={`size-[5px] rounded-full ${p <= feel.pace ? "bg-[#f2b46d]" : "bg-[#ece4d6]/25"}`} />
                      ))}
                    </span>
                    {PACE_LABEL[feel.pace]} · {feel.minutes} min
                  </span>
                  <div className="absolute inset-x-6 bottom-6">
                    <h3 className="font-display text-[2.3rem] font-light leading-[1]">{item.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#ece4d6]/65">{item.detail}</p>
                    <p className="mt-4 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f2b46d]">
                      {item.coach ? `With ${item.coach}` : "All teachers"}
                      <span className="text-[#ece4d6]/55 transition-colors group-hover:text-[#f2b46d]">See times →</span>
                    </p>
                  </div>
                </ScheduleLink>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Schedule() {
  return (
    <section id="schedule" className="scroll-mt-20 border-t border-[#ece4d6]/[0.07] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          kicker="This week"
          title={
            <>
              The week <em className="text-[#f2b46d]">at the sala.</em>
            </>
          }
          aside={`${YOGA_WEEK.length} classes, ${FIRST_CLASS} to ${LAST_CLASS}, in island time. Pick a day, filter by pace or teacher, and tap a class to hold your mat.`}
        />
        <Reveal delay={100} className="mt-12">
          <WeekSchedule />
        </Reveal>
      </div>
    </section>
  );
}

function Teachers() {
  return (
    <section id="teachers" className="scroll-mt-20 border-t border-[#ece4d6]/[0.07] bg-[#0c1317] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          kicker="Teachers"
          title={
            <>
              Four teachers, <em className="text-[#f2b46d]">one sala.</em>
            </>
          }
          aside="Tap a teacher to see every class they lead this week."
        />
        <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {YOGA_COACHES.map((coach, i) => (
            <Reveal key={coach.name} delay={(i % 4) * 80}>
              <ScheduleLink term={coach.name} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-[#111a1f]">
                  <Image
                    src={coach.image}
                    alt={`${coach.name} — ${coach.specialty}`}
                    fill
                    sizes="(min-width: 1024px) 23vw, 46vw"
                    className="object-cover saturate-[0.8] transition duration-1000 group-hover:scale-[1.03] group-hover:saturate-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1014]/70 via-transparent to-transparent" />
                </div>
                <h3 className="font-display mt-4 text-4xl font-light leading-none">{coach.name}</h3>
                <p className="mt-2 text-sm text-[#ece4d6]/60">{coach.specialty}</p>
                <p className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-[0.18em]">
                  <span className="text-[#ece4d6]/40">{coach.languages}</span>
                  <span className="text-[#f2b46d] opacity-70 transition-opacity group-hover:opacity-100">Their classes →</span>
                </p>
              </ScheduleLink>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PassesSection() {
  return (
    <section id="passes" className="scroll-mt-20 border-t border-[#ece4d6]/[0.07] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          kicker="Passes"
          title={
            <>
              Your first class <em className="text-[#f2b46d]">is free.</em>
            </>
          }
          aside="Then pick a stone. Prices in Thai baht; mats, props, tea and the ice bath are always included."
        />
        <Reveal delay={100} className="mt-16">
          <Passes />
        </Reveal>
        <Reveal delay={160}>
          <div aria-hidden className="mx-auto mt-10 h-px max-w-5xl bg-gradient-to-r from-transparent via-[#ece4d6]/20 to-transparent" />
        </Reveal>
      </div>
    </section>
  );
}

function Sala() {
  return (
    <section id="sala" className="scroll-mt-20 border-t border-[#ece4d6]/[0.07] bg-[#0c1317] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          kicker="The sala"
          title={
            <>
              A teak floor <em className="text-[#f2b46d]">over the bay.</em>
            </>
          }
          aside="Open on three sides to the sea breeze, eighteen mats, and a garden path down to the water."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr_1fr] lg:grid-rows-2">
          {GALLERY.map((photo, i) => (
            <Reveal
              key={photo.src}
              delay={i * 80}
              className={`relative min-h-[260px] overflow-hidden rounded-[28px] ${i === 0 ? "lg:row-span-2" : ""} ${i === 3 ? "lg:col-start-3 lg:row-start-1 lg:row-span-2" : ""}`}
            >
              <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 34vw, (min-width: 640px) 46vw, 92vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1014]/70 via-transparent to-transparent" />
              <p className="font-display absolute bottom-4 left-5 text-xl italic text-[#ece4d6]/90">{photo.note}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {AMENITIES.map((a, i) => (
            <Reveal key={a.title} delay={i * 70} className="border-t border-[#ece4d6]/10 pt-5">
              <h3 className="font-display text-[1.75rem] font-light leading-tight">{a.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#ece4d6]/55">{a.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Book() {
  return (
    <section id="book" className="scroll-mt-20 px-3 py-20 sm:px-5 sm:py-28">
      <div className="mx-auto grid max-w-[1440px] gap-14 rounded-[36px] border border-[#ece4d6]/10 bg-[radial-gradient(80%_60%_at_100%_0%,rgba(242,180,109,0.09),transparent_70%),#0d1519] px-6 py-14 sm:px-12 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-16">
        <div>
          <Reveal>
            <Kicker>Your first class</Kicker>
            <h2 className="font-display mt-5 text-[3.2rem] font-light leading-[0.98] sm:text-6xl lg:text-[4.6rem]">
              Come as you are. <em className="text-[#f2b46d]">It&apos;s on us.</em>
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-[#ece4d6]/60">
              Pick a class and a time, tell us a little about your practice, and arrive ten minutes early for tea.
              No card, no contract.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <dl className="mt-10 grid gap-5 text-sm">
              {[
                { icon: MapPin, label: "Find us", value: CONTACT.address },
                { icon: Clock, label: "Classes", value: `Every day, ${FIRST_CLASS}–${LAST_CLASS}` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border border-[#ece4d6]/12 text-[#f2b46d]">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ece4d6]/40">{label}</dt>
                    <dd className="mt-1 leading-relaxed text-[#ece4d6]/80">{value}</dd>
                  </div>
                </div>
              ))}
              <div className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-[#ece4d6]/12 text-[#f2b46d]">
                  <Phone className="size-4" />
                </span>
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ece4d6]/40">Talk to us</dt>
                  <dd className="mt-1 flex flex-col gap-0.5 text-[#ece4d6]/80">
                    <a href={CONTACT.phoneHref} className="transition-colors hover:text-[#f2b46d]">
                      {CONTACT.phone}
                    </a>
                    <a href={CONTACT.emailHref} className="transition-colors hover:text-[#f2b46d]">
                      {CONTACT.email}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
          </Reveal>
          <Reveal delay={140} className="mt-12">
            <div className="divide-y divide-[#ece4d6]/10 border-y border-[#ece4d6]/10">
              {FAQ.map((item) => (
                <details key={item.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] text-[#ece4d6]/85 [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <Plus className="size-4 shrink-0 text-[#f2b46d] transition-transform duration-300 group-open:rotate-45" />
                  </summary>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#ece4d6]/55">{item.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal delay={120}>
          <div className="rounded-[28px] border border-[#ece4d6]/10 bg-[#0a1014] p-6 sm:p-8">
            <BookForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#ece4d6]/[0.07] pt-20">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-12">
        <div>
          <p className="flex items-center gap-2.5">
            <CairnMark />
            <span className="font-display text-[1.7rem] leading-none">Stillwater</span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#ece4d6]/50">
            Yoga, breath and a cold plunge in an open-air sala over the bay.
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ece4d6]/40">Visit</p>
          <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-[#ece4d6]/75">
            <MapPin className="mt-0.5 size-4 shrink-0 text-[#f2b46d]" />
            {CONTACT.address}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ece4d6]/40">Talk</p>
          <div className="mt-3 flex flex-col gap-1.5 text-sm text-[#ece4d6]/75">
            <a href={CONTACT.phoneHref} className="inline-flex items-center gap-2 transition-colors hover:text-[#f2b46d]">
              <Phone className="size-4 text-[#f2b46d]" /> {CONTACT.phone}
            </a>
            <a href={CONTACT.emailHref} className="inline-flex items-center gap-2 transition-colors hover:text-[#f2b46d]">
              <Mail className="size-4 text-[#f2b46d]" /> {CONTACT.email}
            </a>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ece4d6]/40">Follow</p>
          <div className="mt-3 flex items-center gap-3">
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid size-10 place-items-center rounded-full border border-[#ece4d6]/12 text-[#ece4d6]/75 transition-colors hover:border-[#f2b46d] hover:text-[#f2b46d]"
            >
              <InstagramIcon className="size-4" />
            </a>
            <a
              href={CONTACT.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="grid size-10 place-items-center rounded-full border border-[#ece4d6]/12 text-[#ece4d6]/75 transition-colors hover:border-[#f2b46d] hover:text-[#f2b46d]"
            >
              <FacebookIcon className="size-4" />
            </a>
            <span className="text-xs text-[#ece4d6]/45">{CONTACT.instagramHandle}</span>
          </div>
          <a href="#breathe" className="mt-5 inline-flex items-center gap-1.5 text-sm text-[#f2b46d] underline-offset-4 hover:underline">
            Ring the bowl once more <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[1440px] flex-col gap-2 px-5 text-[10.5px] uppercase tracking-[0.2em] text-[#ece4d6]/35 sm:flex-row sm:justify-between sm:px-8 lg:px-12">
        <span>© {new Date().getFullYear()} Stillwater Yoga — fictional demo · Layout 6</span>
        <span>{CONTACT.area}</span>
      </div>
      <p
        aria-hidden
        className="font-display -mb-[0.2em] mt-10 select-none bg-gradient-to-b from-[#ece4d6]/[0.14] to-transparent bg-clip-text text-center text-[24vw] font-light italic leading-[0.9] text-transparent"
      >
        Stillwater
      </p>
    </footer>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { DM_Sans, Syne } from "next/font/google";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Bike, Bus, Clock, Mail, MapPin, Navigation, Phone, Ship } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { BookForm } from "@/components/layouts/goldenhour/book-form";
import { DeckMap } from "@/components/layouts/goldenhour/deck-map";
import { HeroStage } from "@/components/layouts/goldenhour/hero-stage";
import { Today } from "@/components/layouts/goldenhour/today";
import { CONTACT } from "@/lib/layouts/content";
import { GALLERY, GETTING_THERE, HOURS, MENU, REVIEWS, RULES, SESSIONS, SPOTS, SUNSET, baht } from "@/lib/layouts/goldenhour";

export const metadata: Metadata = {
  title: "Golden Hour — beach club",
  robots: { index: false },
};

const display = Syne({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-gh-display" });
const sans = DM_Sans({ subsets: ["latin"], variable: "--font-gh-sans" });

const NAV = [
  { href: "#today", label: "Today" },
  { href: "#beds", label: "Beds" },
  { href: "#sessions", label: "Sessions" },
  { href: "#menu", label: "Food & drink" },
  { href: "#visit", label: "Visit" },
] as const;

const BEDS = SPOTS.filter((s) => s.kind === "bed").length;
const CABANAS = SPOTS.filter((s) => s.kind === "cabana").length;
const FROM = Math.min(...SPOTS.filter((s) => s.minSpend > 0).map((s) => s.minSpend));

const STATS = [
  { v: BEDS, l: "Day beds" },
  { v: CABANAS, l: "Cabanas" },
  { v: baht(FROM), l: "Min spend from" },
  { v: SUNSET, l: "Sunset today" },
] as const;

const WAYS = [Bus, Bike, Ship, Navigation] as const;

function Kicker({ children, follow = false }: { children: React.ReactNode; follow?: boolean }) {
  const colour = follow ? "text-[var(--gh-accent,#ff9f43)] transition-colors duration-700" : "text-[#ff9f43]";
  return (
    <p className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] ${colour}`}>
      <span className="h-px w-8 bg-current opacity-70" />
      {children}
    </p>
  );
}

function SectionHead({ kicker, title, aside }: { kicker: string; title: React.ReactNode; aside?: string }) {
  return (
    <Reveal className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <Kicker>{kicker}</Kicker>
        <h2 className="font-display mt-5 max-w-3xl text-balance text-[2.9rem] font-extrabold leading-[0.95] tracking-[-0.02em] sm:text-[3.8rem] lg:text-[4.6rem]">
          {title}
        </h2>
      </div>
      {aside && <p className="max-w-sm leading-relaxed text-[#f6ead7]/55 lg:pb-3">{aside}</p>}
    </Reveal>
  );
}

/** A sun on the sea line. */
function SunMark() {
  return (
    <span aria-hidden className="relative block size-7 overflow-hidden rounded-full border border-[#ff9f43]/60 bg-[#1b1736]">
      <span className="absolute left-1/2 top-[22%] size-3.5 -translate-x-1/2 rounded-full bg-[#ff9f43]" />
      <span className="absolute inset-x-0 top-[56%] h-px bg-[#f6ead7]/80" />
      <span className="absolute inset-x-0 bottom-0 top-[58%] bg-[#1e8fa3]/80" />
    </span>
  );
}

export default function GoldenHourLayout() {
  return (
    <div
      className={`${display.variable} ${sans.variable} min-h-dvh overflow-x-clip bg-[#0b0a1a] font-[family-name:var(--font-gh-sans)] text-[#f6ead7] antialiased selection:bg-[#ff9f43] selection:text-[#0b0a1a] [&_.font-display]:font-[family-name:var(--font-gh-display)]`}
    >
      <Nav />
      <Hero />
      <TodaySection />
      <Beds />
      <Sessions />
      <Menu />
      <Deck />
      <Visit />
      <Reviews />
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
        <nav className="mx-auto flex max-w-[1440px] items-center justify-between rounded-full border border-[#f6ead7]/10 bg-[#0b0a1a]/70 py-1.5 pl-4 pr-1.5 backdrop-blur-xl">
          <a href="#top" className="flex items-center gap-2.5">
            <SunMark />
            <span className="font-display text-[1.15rem] font-extrabold uppercase leading-none tracking-[0.04em]">Golden Hour</span>
          </a>
          <div className="hidden items-center lg:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-[14px] text-[#f6ead7]/65 transition-colors hover:bg-[#f6ead7]/[0.07] hover:text-[#f6ead7]"
              >
                {item.label}
              </a>
            ))}
          </div>
          <a
            href="#book"
            className="inline-flex h-10 items-center rounded-full bg-[#f6ead7] px-5 text-[14px] font-semibold text-[#0b0a1a] transition-colors hover:bg-[#ff9f43]"
          >
            Book a bed
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top">
      <HeroStage>
        <div className="max-w-[40rem] lg:my-auto lg:max-w-[46%]">
          <Reveal>
            <Kicker follow>Beach club · west coast · {CONTACT.area}</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display mt-6 text-[3.4rem] font-extrabold leading-[0.9] tracking-[-0.03em] sm:text-[4.8rem] lg:text-[clamp(4.6rem,6.6vw,7.4rem)]">
              Front row
              <br />
              for the{" "}
              <span className="text-[var(--gh-accent,#ff9f43)] transition-colors duration-700">
                sun going
                <br />
                down.
              </span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-7 max-w-[30rem] text-[17px] leading-relaxed text-[#f6ead7]/70">
              Day beds on the sand, cabanas by the pool, a kitchen on charcoal and a DJ who turns it down for the
              sunset. Drag the sky to see what time you&apos;ll want to be here.
            </p>
          </Reveal>
          <Reveal delay={240} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#book"
              className="inline-flex h-[52px] items-center rounded-full bg-[var(--gh-accent,#ff9f43)] px-7 text-[15px] font-semibold text-[#0b0a1a] transition-colors duration-700 hover:bg-[#f6ead7]"
            >
              Hold a bed
            </a>
            <a
              href="#today"
              className="inline-flex h-[52px] items-center gap-2 rounded-full border border-[#f6ead7]/25 px-7 text-[15px] text-[#f6ead7]/85 transition-colors hover:border-[#f6ead7]/60 hover:text-[#f6ead7]"
            >
              Today at the club <ArrowDownRight className="size-4" />
            </a>
          </Reveal>
        </div>

        <Reveal delay={360} className="mt-12 lg:mt-0 lg:max-w-[46%]">
          <dl className="grid max-w-[40rem] grid-cols-2 gap-x-8 gap-y-6 border-t border-[#f6ead7]/10 pt-6 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.l} className="flex flex-col gap-1">
                <dt className="order-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f6ead7]/40">{s.l}</dt>
                <dd className="font-display order-1 text-[2.3rem] font-extrabold leading-none tabular-nums tracking-[-0.02em]">{s.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </HeroStage>
    </section>
  );
}

function TodaySection() {
  return (
    <section id="today" className="scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          kicker="Today at the club"
          title={
            <>
              Nine moments, <span className="text-[#ff9f43]">one clock.</span>
            </>
          }
          aside={`The same every day, ${HOURS.open} to midnight: pool, kitchen, two sets, the sunset at ${SUNSET}, fire on the sand, then the night. The marker is the club's real clock.`}
        />
        <Reveal delay={100} className="mt-12">
          <Today />
        </Reveal>
      </div>
    </section>
  );
}

function Beds() {
  return (
    <section id="beds" className="scroll-mt-20 border-t border-[#f6ead7]/[0.07] bg-[#0d0c1f] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          kicker="The deck"
          title={
            <>
              The club, <span className="text-[#ff9f43]">bed by bed.</span>
            </>
          }
          aside="Eight on the sand, four cabanas, six on the deck and a row of stools at the bar. Tap one for its price and minimum, and it's picked for you in the booking form."
        />
        <Reveal delay={100} className="mt-12">
          <DeckMap />
        </Reveal>
      </div>
    </section>
  );
}

function Sessions() {
  return (
    <section id="sessions" className="scroll-mt-20 border-t border-[#f6ead7]/[0.07] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          kicker="Sunset sessions"
          title={
            <>
              Five nights <span className="text-[#ff9f43]">a week.</span>
            </>
          }
          aside="Monday and Wednesday the beds are open and the bar is quiet. The rest of the week, this."
        />
        <Reveal delay={100} className="mt-12 divide-y divide-[#f6ead7]/10 border-y border-[#f6ead7]/10">
          {SESSIONS.map((s) => (
            <a
              key={s.day}
              href="#book"
              className="group grid gap-3 py-6 transition-colors hover:bg-[#f6ead7]/[0.03] sm:grid-cols-[4.5rem_1fr_auto] sm:items-center sm:gap-8 lg:grid-cols-[6rem_1.1fr_1fr_auto]"
            >
              <span className="font-display text-[2.4rem] font-extrabold leading-none text-[#ff9f43] sm:text-[2.8rem]">{s.day}</span>
              <span>
                <span className="font-display block text-[1.6rem] leading-tight">{s.title}</span>
                <span className="mt-1 block text-sm text-[#f6ead7]/55">
                  {s.time} · {s.lineup}
                </span>
              </span>
              <span className="text-sm leading-relaxed text-[#f6ead7]/60 sm:col-span-full lg:col-span-1">{s.note}</span>
              <span className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f6ead7]/55 sm:col-start-3 sm:row-start-1 lg:col-start-4">
                <span className="rounded-full border border-[#f6ead7]/15 px-3 py-1.5">{s.cover}</span>
                <ArrowRight className="size-4 text-[#ff9f43] transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function Menu() {
  return (
    <section id="menu" className="scroll-mt-20 border-t border-[#f6ead7]/[0.07] bg-[#0d0c1f] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          kicker="Food & drink"
          title={
            <>
              Charcoal, lime <span className="text-[#ff9f43]">and ice.</span>
            </>
          }
          aside={`The kitchen runs ${toKitchen()} and the bar until last call. Minimum spends go on any of it. A few of the things people come back for:`}
        />
        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1fr_0.9fr]">
          {(["kitchen", "bar"] as const).map((part, col) => (
            <Reveal key={part} delay={col * 80}>
              <h3 className="font-display text-[1.6rem] text-[#f6ead7]/85">{part === "kitchen" ? "From the grill" : "From the bar"}</h3>
              <ul className="mt-5 divide-y divide-[#f6ead7]/10 border-t border-[#f6ead7]/10">
                {MENU[part].map((dish) => (
                  <li key={dish.name} className="py-4">
                    <div className="flex items-baseline gap-3">
                      <span className="text-[17px]">{dish.name}</span>
                      <span aria-hidden className="mb-1 flex-1 border-b border-dotted border-[#f6ead7]/25" />
                      <span className="font-display whitespace-nowrap text-[17px] text-[#ff9f43]">{baht(dish.price)}</span>
                    </div>
                    <p className="mt-1 text-sm text-[#f6ead7]/50">{dish.detail}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
          <Reveal delay={160} className="relative min-h-[320px] overflow-hidden rounded-[28px]">
            <Image
              src="/img/layouts/beachclub-3.jpg"
              alt="Dinner tables on the sunset deck under the palms"
              fill
              sizes="(min-width: 1024px) 30vw, 92vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a1a]/80 via-transparent to-transparent" />
            <p className="absolute bottom-5 left-6 right-6 text-sm leading-relaxed text-[#f6ead7]/90">
              Happy hour 17:00 to sunset: spritzes and house pours ฿150, draught ฿120.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const toKitchen = () => `12:30 to ${HOURS.kitchenClose}`;

function Deck() {
  return (
    <section id="deck" className="scroll-mt-20 border-t border-[#f6ead7]/[0.07] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          kicker="The deck"
          title={
            <>
              Sand, pool, <span className="text-[#ff9f43]">string lights.</span>
            </>
          }
          aside="Sixty metres of west-facing beach, an infinity pool on the deck above it, and nothing between you and the horizon."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1fr] lg:grid-rows-2">
          {GALLERY.map((photo, i) => (
            <Reveal
              key={photo.src}
              delay={i * 80}
              className={`relative min-h-[260px] overflow-hidden rounded-[28px] ${i === 0 ? "lg:row-span-2" : ""} ${i === 3 ? "lg:col-start-3 lg:row-start-1 lg:row-span-2" : ""}`}
            >
              <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 34vw, (min-width: 640px) 46vw, 92vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a1a]/70 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-5 text-sm text-[#f6ead7]/85">{photo.note}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Visit() {
  return (
    <section id="visit" className="scroll-mt-20 border-t border-[#f6ead7]/[0.07] bg-[#0d0c1f] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          kicker="House rules & getting here"
          title={
            <>
              Six rules, <span className="text-[#ff9f43]">four ways in.</span>
            </>
          }
          aside={`${CONTACT.address}. Open every day from ${HOURS.open}; last call ${HOURS.lastCall}.`}
        />
        <div className="mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {RULES.map((r, i) => (
            <Reveal key={r.title} delay={(i % 3) * 70} className="border-t border-[#f6ead7]/10 pt-5">
              <h3 className="font-display text-[1.35rem] leading-tight">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#f6ead7]/55">{r.body}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GETTING_THERE.map((w, i) => {
            const Icon = WAYS[i] ?? Navigation;
            return (
              <Reveal key={w.how} delay={i * 70} className="rounded-[22px] border border-[#f6ead7]/10 bg-[#100f24] p-6">
                <span className="grid size-10 place-items-center rounded-full border border-[#f6ead7]/12 text-[#ff9f43]">
                  <Icon className="size-4" />
                </span>
                <h3 className="font-display mt-5 text-[1.35rem]">{w.how}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#f6ead7]/55">{w.detail}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <div className="marquee-viewport overflow-hidden border-y border-[#f6ead7]/10 py-6 [--marquee-duration:90s]">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
            {REVIEWS.map((r) => (
              <li key={r.who} className="flex items-center whitespace-nowrap">
                <span className="px-6">
                  <span className="font-display text-[1.35rem] leading-none text-[#f6ead7]/90">“{r.quote}”</span>
                  <span className="ml-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f6ead7]/45">{r.who}</span>
                </span>
                <span aria-hidden className="size-2 rounded-full bg-[#ff9f43]" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

function Book() {
  return (
    <section id="book" className="scroll-mt-20 px-3 py-20 sm:px-5 sm:py-28">
      <div className="mx-auto grid max-w-[1440px] gap-14 rounded-[36px] border border-[#f6ead7]/10 bg-[radial-gradient(80%_60%_at_100%_0%,rgba(255,159,67,0.1),transparent_70%),#100f24] px-6 py-14 sm:px-12 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-16">
        <div>
          <Reveal>
            <Kicker>Hold a bed</Kicker>
            <h2 className="font-display mt-5 text-[2.9rem] font-extrabold leading-[0.95] tracking-[-0.02em] sm:text-[3.8rem] lg:text-[4.6rem]">
              Your bed, <span className="text-[#ff9f43]">your sunset.</span>
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-[#f6ead7]/60">
              Pick a day, a bed and a time. No card — the minimum spend is settled at the bed, in food and drink. We hold it
              for thirty minutes past your arrival.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <dl className="mt-10 grid gap-5 text-sm">
              {[
                { icon: MapPin, label: "Find us", value: CONTACT.address },
                { icon: Clock, label: "Open", value: `Every day ${HOURS.open} – midnight · kitchen ${toKitchen()} · sunset ${SUNSET}` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border border-[#f6ead7]/12 text-[#ff9f43]">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f6ead7]/40">{label}</dt>
                    <dd className="mt-1 leading-relaxed text-[#f6ead7]/80">{value}</dd>
                  </div>
                </div>
              ))}
              <div className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-[#f6ead7]/12 text-[#ff9f43]">
                  <Phone className="size-4" />
                </span>
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f6ead7]/40">Talk to us</dt>
                  <dd className="mt-1 flex flex-col gap-0.5 text-[#f6ead7]/80">
                    <a href={CONTACT.phoneHref} className="transition-colors hover:text-[#ff9f43]">
                      {CONTACT.phone}
                    </a>
                    <a href={CONTACT.emailHref} className="transition-colors hover:text-[#ff9f43]">
                      {CONTACT.email}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
          </Reveal>
          <Reveal delay={140} className="mt-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f6ead7]/40">Good to know</p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#f6ead7]/65">
              <li>Groups of eight or more: take a cabana, or two beds side by side — ask in the note.</li>
              <li>Saturday front-row beds go a week ahead. Weekdays, the day before is usually fine.</li>
              <li>Rain? The cabanas have roofs and the deck has awnings. Monsoon sunsets are the best ones.</li>
            </ul>
          </Reveal>
        </div>
        <Reveal delay={120}>
          <div className="rounded-[28px] border border-[#f6ead7]/10 bg-[#0b0a1a] p-6 sm:p-8">
            <BookForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#f6ead7]/[0.07] pt-20">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-12">
        <div>
          <p className="flex items-center gap-2.5">
            <SunMark />
            <span className="font-display text-[1.15rem] font-extrabold uppercase leading-none tracking-[0.04em]">Golden Hour</span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#f6ead7]/50">
            Day beds, sunset sessions and a kitchen on charcoal, on the west coast.
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f6ead7]/40">Visit</p>
          <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-[#f6ead7]/75">
            <MapPin className="mt-0.5 size-4 shrink-0 text-[#ff9f43]" />
            {CONTACT.address}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f6ead7]/40">Talk</p>
          <div className="mt-3 flex flex-col gap-1.5 text-sm text-[#f6ead7]/75">
            <a href={CONTACT.phoneHref} className="inline-flex items-center gap-2 transition-colors hover:text-[#ff9f43]">
              <Phone className="size-4 text-[#ff9f43]" /> {CONTACT.phone}
            </a>
            <a href={CONTACT.emailHref} className="inline-flex items-center gap-2 transition-colors hover:text-[#ff9f43]">
              <Mail className="size-4 text-[#ff9f43]" /> {CONTACT.email}
            </a>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f6ead7]/40">Follow</p>
          <div className="mt-3 flex items-center gap-3">
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid size-10 place-items-center rounded-full border border-[#f6ead7]/12 text-[#f6ead7]/75 transition-colors hover:border-[#ff9f43] hover:text-[#ff9f43]"
            >
              <InstagramIcon className="size-4" />
            </a>
            <a
              href={CONTACT.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="grid size-10 place-items-center rounded-full border border-[#f6ead7]/12 text-[#f6ead7]/75 transition-colors hover:border-[#ff9f43] hover:text-[#ff9f43]"
            >
              <FacebookIcon className="size-4" />
            </a>
            <span className="text-xs text-[#f6ead7]/45">{CONTACT.instagramHandle}</span>
          </div>
          <a href="#top" className="mt-5 inline-flex items-center gap-1.5 text-sm text-[#ff9f43] underline-offset-4 hover:underline">
            Back to the sunset <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[1440px] flex-col gap-2 px-5 text-[10.5px] uppercase tracking-[0.2em] text-[#f6ead7]/35 sm:flex-row sm:justify-between sm:px-8 lg:px-12">
        <span>© {new Date().getFullYear()} Golden Hour Beach Club — fictional demo</span>
        <span>{CONTACT.area}</span>
      </div>
      <p
        aria-hidden
        className="font-display -mb-[0.22em] mt-10 select-none bg-gradient-to-b from-[#ff9f43]/[0.16] to-transparent bg-clip-text text-center text-[19vw] font-extrabold uppercase leading-[0.9] tracking-[-0.04em] text-transparent"
      >
        Golden Hour
      </p>
    </footer>
  );
}

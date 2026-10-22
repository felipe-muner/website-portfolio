import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DM_Mono, Gloock, Instrument_Sans } from "next/font/google";
import { ArrowDownRight, ArrowRight, Clock, Mail, MapPin, MessageCircle, Phone, Star } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { BookForm } from "@/components/layouts/brasa/book-form";
import { FireMenu } from "@/components/layouts/brasa/fire-menu";
import { HeroStage } from "@/components/layouts/brasa/hero-stage";
import { ServiceStrip } from "@/components/layouts/brasa/service-strip";
import { TableLink } from "@/components/layouts/brasa/table-link";
import { BRAND, CHEF, GALLERY, HOURS, REVIEWS, STATS, TECHNIQUES, TICKER, VISIT, WOODS } from "@/lib/layouts/brasa";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Brasa — Fire Kitchen",
  robots: { index: false },
};

const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-brasa-sans" });
const display = Gloock({ subsets: ["latin"], weight: "400", variable: "--font-brasa-display" });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-brasa-mono" });

const EMBER = "#f26a1b";

const NAV = [
  { href: "#menu", label: "Menu" },
  { href: "#fire", label: "The fire" },
  { href: "#room", label: "Room & terrace" },
  { href: "#visit", label: "Find us" },
] as const;

/* Film grain over the whole page — soot, not glow. */
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

function FlameMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M12 2c.6 4.2 5.5 6.4 5.5 11.3A5.5 5.5 0 0 1 6.5 13.3c0-2.1 1-3.8 2.3-5 .1 2.2 1.1 3.4 2.2 3.4 1.2 0 2-1.1 2-3.1 0-2-1-4-1-6.6Z"
        fill={EMBER}
      />
      <path d="M12 21.5a3 3 0 0 1-3-3c0-1.6 1.4-2.6 2-4 .6 1.4 4 2.2 4 4a3 3 0 0 1-3 3Z" fill="#ffb45c" />
    </svg>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[#f26a1b]">
      <span className="h-px w-8 bg-[#f26a1b]" />
      {children}
    </p>
  );
}

function SectionHead({ kicker, title, aside }: { kicker: string; title: React.ReactNode; aside?: string }) {
  return (
    <Reveal className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <Kicker>{kicker}</Kicker>
        <h2 className="font-display mt-4 text-balance text-[2.9rem] leading-[0.95] sm:text-6xl lg:text-[5rem]">{title}</h2>
      </div>
      {aside && <p className="max-w-sm leading-relaxed text-[#f4e9d8]/55 lg:pb-3">{aside}</p>}
    </Reveal>
  );
}

export default function BrasaLayout() {
  return (
    <div
      className={`${sans.variable} ${display.variable} ${mono.variable} relative min-h-dvh overflow-x-clip bg-[#0e0c0a] font-[family-name:var(--font-brasa-sans)] text-[#f4e9d8] antialiased selection:bg-[#f26a1b] selection:text-[#140d08] [&_.font-display]:font-[family-name:var(--font-brasa-display)] [&_.font-mono]:font-[family-name:var(--font-brasa-mono)]`}
    >
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[45] opacity-[0.08] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
      <Nav />
      <Hero />
      <Ticker />
      <Menu />
      <TheFire />
      <Room />
      <ChefNote />
      <Reviews />
      <Visit />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#f4e9d8]/[0.08] bg-[#0e0c0a]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <FlameMark />
          <span className="font-display text-[1.55rem] leading-none tracking-[0.06em]">{BRAND.short}</span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-[#f4e9d8]/40 lg:inline">{BRAND.line}</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="text-[15px] text-[#f4e9d8]/65 transition-colors hover:text-[#f26a1b]">
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href="#book"
          className="font-display inline-flex h-10 items-center gap-2 rounded-sm bg-[#f26a1b] px-4 text-[17px] text-[#140d08] transition-colors hover:bg-[#f4e9d8]"
        >
          Book a table <ArrowRight className="size-4" strokeWidth={2.5} />
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative isolate flex flex-col overflow-hidden lg:min-h-[max(calc(100svh-4rem),780px)]">
      {/* The room behind it all, burned down to a whisper. */}
      <Image
        src="/img/layouts/restaurant-warm.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover opacity-[0.13] saturate-[0.6]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(40%_50%_at_75%_85%,rgba(242,106,27,0.16),transparent_70%),linear-gradient(to_bottom,rgba(14,12,10,0.4),#0e0c0a_96%)]"
      />
      {/* A slow drift of smoke across the top of the room. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/3 -z-10 h-[32rem] w-[48rem] rounded-full bg-[radial-gradient(closest-side,rgba(244,233,216,0.06),transparent)] blur-2xl motion-safe:animate-landing-breathe"
      />

      <HeroStage />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 pb-14 sm:px-8 lg:px-12 lg:pb-10 lg:pt-16">
        <div className="max-w-[40rem] lg:my-auto lg:max-w-[46%]">
          <Reveal>
            <Kicker>
              {BRAND.line} · {CONTACT.area}
            </Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display mt-6 text-[3.6rem] leading-[0.92] sm:text-[5.4rem] lg:text-[clamp(4.6rem,6.6vw,7.6rem)]">
              Cooked over fire.
              <br />
              <span className="text-[#f26a1b]">Nothing else.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-7 max-w-[32rem] text-[17px] leading-relaxed text-[#f4e9d8]/65 sm:text-lg">
              No gas, no induction, no shortcuts. Longan and tamarind wood, coconut-shell charcoal, a steel grate and a
              chef who has been feeding this fire since three o&apos;clock. Whole fish in salt, prawns over tamarind
              smoke, sticky rice buried in the embers.
            </p>
          </Reveal>
          <Reveal delay={240} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#book"
              className="font-display group inline-flex h-14 items-center gap-4 rounded-sm bg-[#f26a1b] px-6 text-2xl text-[#140d08] transition-colors hover:bg-[#f4e9d8]"
            >
              Book a table
              <ArrowRight className="size-6 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
            </a>
            <a
              href="#menu"
              className="font-display inline-flex h-14 items-center gap-3 rounded-sm border border-[#f4e9d8]/20 px-6 text-2xl text-[#f4e9d8]/85 transition-colors hover:border-[#f26a1b] hover:text-[#f26a1b]"
            >
              Tonight&apos;s menu <ArrowDownRight className="size-5" />
            </a>
          </Reveal>
          <Reveal delay={300} className="mt-5 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#f4e9d8]/40">Best seats</span>
            {["Chef's counter", "Sunset table"].map((table) => (
              <TableLink
                key={table}
                table={table}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-[#f4e9d8]/15 px-4 text-sm text-[#f4e9d8]/80 transition-colors hover:border-[#f26a1b] hover:text-[#f26a1b]"
              >
                <span className="size-1.5 rounded-full bg-[#f26a1b]" />
                {table}
              </TableLink>
            ))}
          </Reveal>
          <Reveal delay={360} className="mt-6">
            <ServiceStrip />
          </Reveal>
        </div>

        <Reveal delay={420} className="mt-12 lg:mt-0">
          <dl className="grid max-w-[40rem] grid-cols-2 gap-x-8 gap-y-6 border-t border-[#f4e9d8]/10 pt-6 sm:grid-cols-4 lg:max-w-[46%]">
            {STATS.map((s) => (
              <div key={s.l} className="flex flex-col gap-1">
                <dt className="order-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#f4e9d8]/40">{s.l}</dt>
                <dd className="font-display order-1 text-4xl leading-none text-[#f4e9d8] sm:text-5xl">{s.v}</dd>
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
    <div className="marquee-viewport overflow-hidden border-y border-[#f26a1b]/40 bg-[#f26a1b] py-2.5 text-[#140d08] [--marquee-duration:44s]">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
            {TICKER.map((item) => (
              <li key={item} className="font-display flex items-center whitespace-nowrap text-[1.5rem] leading-none">
                <span className="px-6">{item}</span>
                <FlameMark className="size-4 [&_path]:fill-[#140d08]" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

function Menu() {
  return (
    <section id="menu" className="scroll-mt-16 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          kicker="The menu"
          title={
            <>
              Tonight, <span className="text-[#f26a1b]">from the coals.</span>
            </>
          }
          aside="Everything is cooked on the pit — buried in embers, hung on hooks, packed in salt or seared on the plancha. Prices in ฿, service included. The chilli dots are honest; tell us and we'll turn it up or down."
        />
        <Reveal delay={100} className="mt-12">
          <FireMenu />
        </Reveal>
      </div>
    </section>
  );
}

function TheFire() {
  return (
    <section id="fire" className="scroll-mt-16 border-t border-[#f4e9d8]/[0.07] bg-[#120f0d] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          kicker="The fire"
          title={
            <>
              Three woods. <span className="text-[#f26a1b]">One pit.</span>
            </>
          }
          aside={`The fire is lit at three. By five the longan has burned down to a bed you can hold your hand over for four seconds — that's service heat. Last orders ${HOURS.lastOrders}, and it's still glowing at midnight.`}
        />
        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {WOODS.map((wood, i) => (
            <Reveal key={wood.name} delay={i * 90} className="h-full">
              <article className="flex h-full flex-col rounded-md border border-[#f4e9d8]/10 bg-[#0e0c0a] p-6 sm:p-8">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-[#f26a1b]">
                  {String(i + 1).padStart(2, "0")} · {wood.burns}
                </p>
                <h3 className="font-display mt-3 text-4xl leading-none sm:text-5xl">{wood.name}</h3>
                <p className="mt-5 leading-relaxed text-[#f4e9d8]/60">{wood.body}</p>
                <p className="mt-auto flex items-center gap-2 pt-6 text-sm text-[#f4e9d8]/75">
                  <span className="size-1.5 rounded-full bg-[#f26a1b]" />
                  {wood.use}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal className="relative min-h-[320px] overflow-hidden rounded-md sm:min-h-[420px]">
            <Image
              src="/img/layouts/cooking-4.jpg"
              alt="Blackened pans and a steel wok hanging on an old brick wall"
              fill
              sizes="(min-width: 1024px) 60vw, 92vw"
              className="object-cover saturate-[0.85]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c0a] via-[#0e0c0a]/20 to-transparent" />
            <p className="absolute inset-x-6 bottom-5 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#f4e9d8]/70">
              <span>The pans, between services</span>
              <span className="text-[#f26a1b]">Cast iron · carbon steel</span>
            </p>
          </Reveal>
          <Reveal delay={100} className="rounded-md border border-[#f4e9d8]/10 bg-[#0e0c0a] p-6 sm:p-8">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-[#f26a1b]">How it&apos;s cooked</p>
            <ul className="mt-5 divide-y divide-[#f4e9d8]/[0.08]">
              {TECHNIQUES.map((t) => (
                <li key={t.name} className="grid gap-1 py-4 first:pt-0 last:pb-0 sm:grid-cols-[9rem_1fr] sm:gap-6">
                  <h3 className="font-display text-2xl leading-tight">{t.name}</h3>
                  <p className="text-[15px] leading-relaxed text-[#f4e9d8]/60">{t.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Room() {
  return (
    <section id="room" className="scroll-mt-16 border-t border-[#f4e9d8]/[0.07] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          kicker="Room & terrace"
          title={
            <>
              Forty seats inside. <span className="text-[#f26a1b]">Thirty under the tree.</span>
            </>
          }
          aside="Six stools at the counter if you want the heat on your face; the terrace if you want the sea. Pick when you book — the sunset table goes first."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {GALLERY.map((shot, i) => (
            <Reveal
              key={shot.src}
              delay={(i % 2) * 80}
              className={`group relative overflow-hidden rounded-md bg-[#151210] ${
                i === 0 ? "aspect-[4/3] lg:col-span-7 lg:aspect-auto lg:min-h-[480px]" : i === 1 ? "aspect-[4/3] lg:col-span-5 lg:aspect-auto" : "aspect-[4/3] lg:col-span-6"
              }`}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(min-width: 1024px) 50vw, (min-width: 640px) 46vw, 92vw"
                className="object-cover transition duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c0a]/90 via-transparent to-transparent" />
              <p className="absolute inset-x-5 bottom-4 flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#f4e9d8]/80">
                <span className="h-px w-6 bg-[#f26a1b]" />
                {shot.note}
              </p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120} className="mt-6 flex flex-wrap items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#f4e9d8]/40">Reserve a spot</span>
          {["Chef's counter", "Sunset table", "Terrace", "The long table"].map((table) => (
            <TableLink
              key={table}
              table={table}
              className="font-display inline-flex h-10 items-center gap-2 rounded-sm border border-[#f4e9d8]/15 px-4 text-lg text-[#f4e9d8]/85 transition-colors hover:border-[#f26a1b] hover:text-[#f26a1b]"
            >
              {table} <ArrowRight className="size-4" />
            </TableLink>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function ChefNote() {
  return (
    <section className="border-t border-[#f4e9d8]/[0.07] bg-[#120f0d] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal className="relative aspect-[4/5] overflow-hidden rounded-md sm:aspect-[5/4] lg:aspect-[4/5]">
          <Image src={CHEF.image} alt={CHEF.imageAlt} fill sizes="(min-width: 1024px) 40vw, 92vw" className="object-cover saturate-[0.8]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c0a] via-transparent to-transparent" />
          <div className="absolute inset-x-6 bottom-6">
            <p className="font-display text-3xl leading-none">{CHEF.name}</p>
            <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#f26a1b]">
              &ldquo;{CHEF.nickname}&rdquo; · {CHEF.role}
            </p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <Kicker>A note from the pit</Kicker>
          <blockquote className="font-display mt-5 text-balance text-[2.4rem] leading-[1.05] sm:text-5xl">
            &ldquo;{CHEF.quote}&rdquo;
          </blockquote>
          <div className="mt-8 space-y-5 leading-relaxed text-[#f4e9d8]/65">
            {CHEF.note.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>
          <p className="font-display mt-8 text-3xl text-[#f26a1b]">— {CHEF.nickname}</p>
        </Reveal>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <div className="marquee-viewport overflow-hidden border-y border-[#f4e9d8]/[0.08] bg-[#0e0c0a] py-5 [--marquee-duration:70s]">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
            {REVIEWS.map((r) => (
              <li key={r.who} className="flex max-w-[34rem] shrink-0 items-start gap-4 px-8">
                <span className="mt-1 flex shrink-0 gap-0.5 text-[#f26a1b]">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="size-3.5" fill="currentColor" strokeWidth={0} />
                  ))}
                </span>
                <span className="whitespace-normal">
                  <span className="text-[15px] leading-snug text-[#f4e9d8]/85">&ldquo;{r.quote}&rdquo;</span>
                  <span className="ml-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#f4e9d8]/40">{r.who}</span>
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

function Visit() {
  return (
    <section id="visit" className="scroll-mt-16 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          kicker="Find us"
          title={
            <>
              Follow <span className="text-[#f26a1b]">the smoke.</span>
            </>
          }
          aside="Walk-ins are welcome at the bar while the room fills; the counter and the sunset table go by booking only."
        />
        <div id="book" className="mt-14 scroll-mt-24 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <dl className="grid gap-6 text-sm">
              {[
                { icon: MapPin, label: "Address", value: CONTACT.address },
                { icon: Clock, label: "Hours", value: `${HOURS.days} · kitchen ${HOURS.open}–${HOURS.lastOrders}, bar till ${HOURS.barClose}. Closed Mondays.` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-sm border border-[#f4e9d8]/10 text-[#f26a1b]">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#f4e9d8]/40">{label}</dt>
                    <dd className="mt-1 leading-relaxed text-[#f4e9d8]/80">{value}</dd>
                  </div>
                </div>
              ))}
              <div className="flex items-start gap-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-sm border border-[#f4e9d8]/10 text-[#f26a1b]">
                  <MessageCircle className="size-4" />
                </span>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#f4e9d8]/40">WhatsApp & phone</dt>
                  <dd className="mt-1 flex flex-col gap-0.5 text-[#f4e9d8]/80">
                    <a href={CONTACT.phoneHref} className="transition-colors hover:text-[#f26a1b]">
                      {CONTACT.phone}
                    </a>
                    <a href={CONTACT.emailHref} className="transition-colors hover:text-[#f26a1b]">
                      {CONTACT.email}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
            <ul className="mt-10 grid gap-x-8 gap-y-6 border-t border-[#f4e9d8]/10 pt-8 sm:grid-cols-2">
              {VISIT.map((item) => (
                <li key={item.title}>
                  <h3 className="font-display text-2xl leading-none">{item.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#f4e9d8]/55">{item.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-md border border-[#f4e9d8]/10 bg-[#120f0d] p-6 sm:p-8">
              <Kicker>Book a table</Kicker>
              <h2 className="font-display mt-4 text-[2.6rem] leading-[0.95] sm:text-5xl">
                Pull up <span className="text-[#f26a1b]">a stool.</span>
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-[#f4e9d8]/60">
                Pick a night, a sitting and where you&apos;d like to be. We hold the table for fifteen minutes past the sitting.
              </p>
              <div className="mt-8">
                <BookForm />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#f4e9d8]/[0.08] pt-16">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-12">
        <div>
          <p className="flex items-center gap-3">
            <FlameMark />
            <span className="font-display text-[1.55rem] leading-none tracking-[0.06em]">{BRAND.short}</span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#f4e9d8]/50">
            An island kitchen with no gas and one fire — lit at three, glowing past midnight.
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#f4e9d8]/40">Visit</p>
          <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-[#f4e9d8]/75">
            <MapPin className="mt-0.5 size-4 shrink-0 text-[#f26a1b]" />
            {CONTACT.address}
          </p>
          <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-[#f4e9d8]/75">
            <Clock className="mt-0.5 size-4 shrink-0 text-[#f26a1b]" />
            {HOURS.days} · {HOURS.open}–{HOURS.lastOrders}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#f4e9d8]/40">Talk</p>
          <div className="mt-3 flex flex-col gap-1.5 text-sm text-[#f4e9d8]/75">
            <a href={CONTACT.phoneHref} className="inline-flex items-center gap-2 transition-colors hover:text-[#f26a1b]">
              <Phone className="size-4 text-[#f26a1b]" /> {CONTACT.phone}
            </a>
            <a href={CONTACT.emailHref} className="inline-flex items-center gap-2 transition-colors hover:text-[#f26a1b]">
              <Mail className="size-4 text-[#f26a1b]" /> {CONTACT.email}
            </a>
          </div>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#f4e9d8]/40">Follow</p>
          <div className="mt-3 flex items-center gap-3">
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid size-10 place-items-center rounded-sm border border-[#f4e9d8]/10 text-[#f4e9d8]/75 transition-colors hover:border-[#f26a1b] hover:text-[#f26a1b]"
            >
              <InstagramIcon className="size-4" />
            </a>
            <a
              href={CONTACT.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="grid size-10 place-items-center rounded-sm border border-[#f4e9d8]/10 text-[#f4e9d8]/75 transition-colors hover:border-[#f26a1b] hover:text-[#f26a1b]"
            >
              <FacebookIcon className="size-4" />
            </a>
            <span className="font-mono text-[11px] text-[#f4e9d8]/45">{CONTACT.instagramHandle}</span>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[1440px] flex-col gap-2 px-5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#f4e9d8]/35 sm:flex-row sm:justify-between sm:px-8 lg:px-12">
        <span>© {new Date().getFullYear()} {BRAND.name} — fictional demo</span>
        <span>{CONTACT.area}</span>
      </div>
      <p
        aria-hidden
        className="font-display -mb-[0.2em] mt-8 select-none bg-gradient-to-b from-[#f26a1b] via-[#f26a1b]/35 to-transparent bg-clip-text text-center text-[30vw] leading-[0.9] text-transparent"
      >
        {BRAND.short}
      </p>
    </footer>
  );
}

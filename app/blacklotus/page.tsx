import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Bodoni_Moda, Schibsted_Grotesk, Space_Mono } from "next/font/google";
import { ArrowDownRight, ArrowRight, Clock, Mail, MapPin, Phone, Plus } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { BookForm } from "@/components/layouts/blacklotus/book-form";
import { FLASH } from "@/components/layouts/blacklotus/flash";
import { FlashArt } from "@/components/layouts/blacklotus/flash-art";
import { FlashSheet } from "@/components/layouts/blacklotus/flash-sheet";
import { HeroStage } from "@/components/layouts/blacklotus/hero-stage";
import { BookArtistLink } from "@/components/layouts/blacklotus/links";
import { AFTERCARE, ARTISTS, HERO_FACTS, HOURS, HOUSE_RULES, PROCESS, REVIEWS, STUDIO, type ArtistStatus } from "@/lib/layouts/blacklotus";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Black Lotus — Tattoo studio template",
  robots: { index: false },
};

const display = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-bl-display" });
const sans = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-bl-sans" });
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-bl-mono" });

const NAV = [
  { href: "#flash", label: "Flash" },
  { href: "#artists", label: "Artists" },
  { href: "#process", label: "Process" },
  { href: "#aftercare", label: "Aftercare" },
] as const;

const LOTUS = FLASH[0];
const OPEN_FLASH = FLASH.filter((d) => !d.taken).length;

/* Paper grain over the whole page — ink on stock, not pixels on glass. */
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const STATUS_STYLE: Record<ArtistStatus, string> = {
  open: "border-[#efe7d8]/30 bg-[#efe7d8] text-[#14100e]",
  waitlist: "border-[#c0262f] bg-[#c0262f] text-white",
  limited: "border-white/25 bg-transparent text-white/80",
};

type Tone = "ink" | "paper";

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.26em] text-[#c0262f]">
      <span className="h-px w-8 bg-[#c0262f]" />
      {children}
    </p>
  );
}

function SectionHead({ kicker, title, aside, tone = "ink" }: { kicker: string; title: React.ReactNode; aside?: string; tone?: Tone }) {
  return (
    <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <Kicker>{kicker}</Kicker>
        <h2 className="font-display mt-4 max-w-[14ch] text-balance text-[3.2rem] leading-[0.95] tracking-[-0.01em] sm:text-6xl lg:text-[5.4rem]">
          {title}
        </h2>
      </div>
      {aside && <p className={`max-w-md leading-relaxed lg:pb-3 ${tone === "ink" ? "text-white/55" : "text-[#14100e]/65"}`}>{aside}</p>}
    </Reveal>
  );
}

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <FlashArt design={LOTUS} className="size-8 shrink-0" />
      <span className="font-display text-[1.45rem] leading-none tracking-[0.02em]">
        Black <em>Lotus</em>
      </span>
    </span>
  );
}

export default function BlackLotusLayout() {
  return (
    <div
      className={`${display.variable} ${sans.variable} ${mono.variable} relative min-h-dvh overflow-x-clip bg-[#0f0e0c] font-[family-name:var(--font-bl-sans)] text-[#efe7d8] antialiased selection:bg-[#c0262f] selection:text-white [&_.font-display]:font-[family-name:var(--font-bl-display)] [&_.font-mono]:font-[family-name:var(--font-bl-mono)]`}
    >
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[45] opacity-[0.07] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
      <Nav />
      <Hero />
      <Ticker />
      <Flash />
      <Artists />
      <Process />
      <Aftercare />
      <Book />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0f0e0c]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" aria-label={STUDIO.name}>
          <Wordmark />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/60 transition-colors hover:text-[#efe7d8]"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href="#book"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[#c0262f] px-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#efe7d8] hover:text-[#14100e]"
        >
          Hold a chair <ArrowRight className="size-3.5" strokeWidth={2.5} />
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* The studio at work behind it all, pulled back to a murmur. */}
      <Image src="/img/layouts/tattoo-3.jpg" alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-[0.13] grayscale" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_18%_8%,rgba(120,150,200,0.14),transparent_70%),linear-gradient(to_bottom,rgba(15,14,12,0.25),#0f0e0c_94%)]"
      />
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16 lg:px-12 lg:pb-20 lg:pt-16">
        <div className="flex flex-col justify-center">
          <Reveal>
            <Kicker>Private tattoo studio · {CONTACT.area}</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display mt-6 text-[3.9rem] leading-[0.92] tracking-[-0.015em] sm:text-[5.6rem] lg:text-[clamp(4.6rem,6.3vw,7.4rem)]">
              Black ink,
              <br />
              <em className="text-[#c0262f]">island light.</em>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-7 max-w-[32rem] text-[17px] leading-relaxed text-white/65 sm:text-lg">
              {STUDIO.tagline} Try our flash on a forearm before you sit, bring a custom idea, or ask about sak-yant-inspired
              work done with care. Fixed prices in baht, deposits that carry over, no rush.
            </p>
          </Reveal>
          <Reveal delay={240} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#book"
              className="group inline-flex h-13 items-center gap-3 rounded-full bg-[#c0262f] px-6 font-mono text-[12px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#efe7d8] hover:text-[#14100e]"
            >
              Hold a chair
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
            </a>
            <a
              href="#flash"
              className="inline-flex h-13 items-center gap-3 rounded-full border border-white/20 px-6 font-mono text-[12px] uppercase tracking-[0.2em] text-white/85 transition-colors hover:border-[#efe7d8] hover:text-[#efe7d8]"
            >
              See the flash sheet <ArrowDownRight className="size-4" />
            </a>
          </Reveal>
          <Reveal delay={320} className="mt-12">
            <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/10 pt-6 sm:grid-cols-4 lg:max-w-[36rem]">
              {HERO_FACTS.map((s) => (
                <div key={s.l} className="flex flex-col gap-1">
                  <dt className="order-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{s.l}</dt>
                  <dd className="font-display order-1 text-[2.6rem] leading-none">{s.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={120} from="right" className="flex flex-col">
          <HeroStage />
        </Reveal>
      </div>
    </section>
  );
}

function Ticker() {
  return (
    <div className="marquee-viewport overflow-hidden border-y border-[#14100e] bg-[#c0262f] py-3 text-white [--marquee-duration:75s]">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
            {REVIEWS.map((r) => (
              <li key={r.name} className="flex items-center whitespace-nowrap">
                <span className="font-display px-5 text-[1.35rem] italic leading-none">“{r.quote}”</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/75">
                  {r.name} · {r.from}
                </span>
                <span aria-hidden className="px-6 text-white/60">
                  ✦
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

function Flash() {
  return (
    <section id="flash" className="scroll-mt-16 bg-[#efe7d8] px-5 py-20 text-[#14100e] sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          tone="paper"
          kicker="Flash sheet · drawn once, tattooed once"
          title={
            <>
              Pick one. <em className="text-[#c0262f]">Try it on.</em>
            </>
          }
          aside="Every design on this wall is tattooed a single time, then retired — the one you choose stays yours. Three sizes, fixed prices, no drawing fee. Try on arm puts it on the forearm up top; Book this fills in the form."
        />
        <div className="mt-14">
          <FlashSheet />
        </div>
        <Reveal className="mt-8 flex flex-col gap-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#14100e]/50 sm:flex-row sm:justify-between">
          <span>New sheet on the first Sunday of the month · walk-ins 12:00 – 17:00</span>
          <span>
            {OPEN_FLASH} of {FLASH.length} still available
          </span>
        </Reveal>
      </div>
    </section>
  );
}

function Artists() {
  return (
    <section id="artists" className="scroll-mt-16 border-t border-white/[0.07] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          kicker="Resident artists"
          title={
            <>
              Three chairs, <em className="text-[#c0262f]">three hands.</em>
            </>
          }
          aside="Each artist keeps their own diary and their own waitlist. Status is updated every Monday; tap a card to book straight into that chair."
        />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {ARTISTS.map((a, i) => (
            <Reveal key={a.slug} delay={i * 90} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#151311]">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={a.image}
                    alt={`${a.nickname} — ${a.role}`}
                    fill
                    sizes="(min-width: 768px) 31vw, 92vw"
                    className="object-cover grayscale contrast-110 transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151311] via-[#151311]/20 to-transparent" />
                  <span
                    className={`absolute left-4 top-4 rounded-full border px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.2em] ${STATUS_STYLE[a.status]}`}
                  >
                    {a.statusLabel}
                  </span>
                  <div className="absolute inset-x-5 bottom-4">
                    <h3 className="font-display text-[2.6rem] leading-none">{a.nickname}</h3>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">{a.name}</p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="font-display text-xl italic text-[#efe7d8]/90">{a.role}</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {a.styles.map((s) => (
                      <li key={s} className="rounded-full border border-white/12 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/65">
                        {s}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm leading-relaxed text-white/60">{a.bio}</p>
                  <div className="mt-auto flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                      {a.languages} · since {a.since}
                    </span>
                    <BookArtistLink
                      artist={a.slug}
                      className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#c0262f] transition-colors hover:text-[#efe7d8]"
                    >
                      Book {a.nickname} →
                    </BookArtistLink>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="process" className="scroll-mt-16 bg-[#efe7d8] px-5 py-20 text-[#14100e] sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          tone="paper"
          kicker="How a piece happens"
          title={
            <>
              Four steps, <em className="text-[#c0262f]">no surprises.</em>
            </>
          }
          aside="From the first message to the healed check, the same way every time — whether it's a thumb-sized flash or a sleeve across six sittings."
        />
        <ol className="mt-14 grid gap-px overflow-hidden rounded-xl border border-[#14100e]/12 bg-[#14100e]/12 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p, i) => (
            <li key={p.step} className="bg-[#f6efe1]">
              <Reveal delay={i * 80} className="h-full p-6 sm:p-7">
                <span className="font-display text-6xl leading-none text-[#c0262f]">{p.step}</span>
                <h3 className="font-display mt-6 text-3xl leading-none">{p.title}</h3>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#14100e]/50">{p.meta}</p>
                <p className="mt-4 text-sm leading-relaxed text-[#14100e]/65">{p.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
        <div className="mt-5 grid gap-5 md:grid-cols-[1.4fr_1fr]">
          <Reveal className="relative aspect-[16/9] overflow-hidden rounded-xl md:aspect-auto md:min-h-[320px]">
            <Image src="/img/layouts/tattoo-4.jpg" alt="Lining a forearm piece under the lamp" fill sizes="(min-width: 768px) 55vw, 92vw" className="object-cover" />
            <p className="absolute bottom-4 left-4 rounded-full bg-[#14100e]/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#efe7d8] backdrop-blur-sm">
              Step 03 · lining
            </p>
          </Reveal>
          <Reveal delay={100} className="relative aspect-[16/9] overflow-hidden rounded-xl md:aspect-auto">
            <Image src="/img/layouts/tattoo-2.jpg" alt="Ink caps and sealed needles laid out on the station" fill sizes="(min-width: 768px) 35vw, 92vw" className="object-cover grayscale" />
            <p className="absolute bottom-4 left-4 rounded-full bg-[#14100e]/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#efe7d8] backdrop-blur-sm">
              Sealed, opened in front of you
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Aftercare() {
  return (
    <section id="aftercare" className="scroll-mt-16 border-t border-white/[0.07] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal>
          <Kicker>Aftercare · the island edition</Kicker>
          <h2 className="font-display mt-4 text-[3.2rem] leading-[0.95] tracking-[-0.01em] sm:text-6xl lg:text-[5rem]">
            Heal it like <em className="text-[#c0262f]">we inked it.</em>
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-white/60">
            Sun, salt water and heat are hard on fresh ink. You leave with second-skin film, a printed sheet and our number;
            these are the questions we get asked most.
          </p>
          <ul className="mt-10 grid gap-3">
            {HOUSE_RULES.map((rule) => (
              <li key={rule} className="flex items-start gap-3 text-sm leading-relaxed text-white/70">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-[#c0262f]" />
                {rule}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={120}>
          <div className="border-t border-white/10">
            {AFTERCARE.map((item) => (
              <details key={item.q} className="group border-b border-white/10">
                <summary className="font-display flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-2xl text-[#efe7d8] transition-colors hover:text-white [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <Plus className="size-5 shrink-0 text-[#c0262f] transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <p className="pb-6 pr-10 leading-relaxed text-white/65">{item.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Book() {
  return (
    <section id="book" className="scroll-mt-16 px-3 pb-4 sm:px-5">
      <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-xl border border-white/10 bg-[#151311]">
        <div className="grid gap-12 px-6 py-14 sm:px-12 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-16">
          <Reveal>
            <Kicker>Hold a chair</Kicker>
            <h2 className="font-display mt-4 text-[3.2rem] leading-[0.95] tracking-[-0.01em] sm:text-6xl lg:text-[5rem]">
              Deposit, date, <em className="text-[#c0262f]">done.</em>
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-white/60">
              Tell us who, what and roughly where on you. We answer on WhatsApp within a day, send the deposit link, and the
              chair is yours.
            </p>
            <dl className="mt-10 grid gap-5 text-sm">
              <div className="flex items-start gap-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-md border border-white/10 text-[#c0262f]">
                  <Clock className="size-4" />
                </span>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Hours</dt>
                  <dd className="mt-1 grid gap-0.5 text-white/80">
                    {HOURS.map((h) => (
                      <span key={h.days} className="flex flex-wrap gap-x-3">
                        <span className="w-20 text-white/55">{h.days}</span>
                        <span>{h.time}</span>
                        <span className="text-white/40">· {h.note}</span>
                      </span>
                    ))}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-md border border-white/10 text-[#c0262f]">
                  <MapPin className="size-4" />
                </span>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Find us</dt>
                  <dd className="mt-1 leading-relaxed text-white/80">{CONTACT.address}</dd>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-md border border-white/10 text-[#c0262f]">
                  <Phone className="size-4" />
                </span>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Talk to us</dt>
                  <dd className="mt-1 flex flex-col gap-0.5 text-white/80">
                    <a href={CONTACT.phoneHref} className="transition-colors hover:text-[#c0262f]">
                      {CONTACT.phone}
                    </a>
                    <a href={CONTACT.emailHref} className="transition-colors hover:text-[#c0262f]">
                      {CONTACT.email}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-xl border border-white/10 bg-[#0f0e0c] p-6 sm:p-8">
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
          <Wordmark />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
            {STUDIO.tagline} Flash, custom and cover-ups since {STUDIO.since}; three chairs, one standard.
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Visit</p>
          <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-white/75">
            <MapPin className="mt-0.5 size-4 shrink-0 text-[#c0262f]" />
            {CONTACT.address}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Talk</p>
          <div className="mt-3 flex flex-col gap-1.5 text-sm text-white/75">
            <a href={CONTACT.phoneHref} className="inline-flex items-center gap-2 transition-colors hover:text-[#c0262f]">
              <Phone className="size-4 text-[#c0262f]" /> {CONTACT.phone}
            </a>
            <a href={CONTACT.emailHref} className="inline-flex items-center gap-2 transition-colors hover:text-[#c0262f]">
              <Mail className="size-4 text-[#c0262f]" /> {CONTACT.email}
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
              className="grid size-10 place-items-center rounded-full border border-white/10 text-white/75 transition-colors hover:border-[#c0262f] hover:text-[#c0262f]"
            >
              <InstagramIcon className="size-4" />
            </a>
            <a
              href={CONTACT.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="grid size-10 place-items-center rounded-full border border-white/10 text-white/75 transition-colors hover:border-[#c0262f] hover:text-[#c0262f]"
            >
              <FacebookIcon className="size-4" />
            </a>
            <span className="font-mono text-[11px] text-white/45">{CONTACT.instagramHandle}</span>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[1440px] flex-col gap-2 px-5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/35 sm:flex-row sm:justify-between sm:px-8 lg:px-12">
        <span>
          © {new Date().getFullYear()} {STUDIO.name} — fictional demo
        </span>
        <span>18+ with ID · {CONTACT.area}</span>
      </div>
      <p
        aria-hidden
        className="font-display -mb-[0.14em] mt-10 select-none whitespace-nowrap bg-gradient-to-b from-[#efe7d8]/40 via-[#efe7d8]/10 to-transparent bg-clip-text text-center text-[17.5vw] leading-[0.9] tracking-[-0.02em] text-transparent"
      >
        Black Lotus
      </p>
    </footer>
  );
}

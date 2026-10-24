import Image from "next/image";
import Link from "next/link";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import { ArrowRight, MapPin, Phone, ShieldCheck, Star } from "lucide-react";
import { Reveal } from "@/components/layouts/Reveal";
import { HeroStage } from "@/components/layouts/aircon/hero-stage";
import { QuoteForm } from "@/components/layouts/aircon/quote-form";
import { BRANDS } from "@/lib/layouts/aircon";
import type { PreviewLead } from "@/lib/previews";
import { TRADES } from "@/lib/previews/trades";
import { ParticleStage } from "./particle-stage";

/**
 * An outreach preview: the MGM template's layout (/aircon), recoloured and
 * rewritten for one local business. AC companies get its 3D split system and
 * remote, wearing their name, °F and their city's live weather; other trades
 * get a particle hero of their own. Only what we know about the business is
 * used — no licences, owners, photos or reviews that aren't theirs.
 */

const display = Sora({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-ac-display" });
const sans = Geist({ subsets: ["latin"], variable: "--font-ac-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-ac-mono" });

const RAISED = "border-t border-white/[0.07] bg-[var(--pv-raised)]";
const WRAP = "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12";
const ACCENT_BUTTON =
  "group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--pv-accent)] px-6 text-sm font-semibold text-[var(--pv-ink)] shadow-[0_0_40px_-8px_var(--pv-accent)] transition-transform hover:-translate-y-0.5";
const GHOST_BUTTON =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10";
const CARD_GLOW =
  "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgb(var(--pv-glow)/0.12),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100";

/** Words that say what the company does rather than who it is. */
const GENERIC =
  /^(ac|a\/c|air|conditioning|heating|cooling|hvac|repair|repairs|services?|company|co|llc|inc|and|&|of|the|pros?|experts?|solutions|plumbing|plumbers?|drain|cleaning|cleaners?|maids?|house|home)$/i;

/** A short brand mark: the distinctive word, or initials (the AC unit's badge, the footer). */
function badge(short: string, city: string) {
  const words = short
    .replace(/[^\w&/ ]/g, "")
    .split(/\s+/)
    .filter((w) => w && !GENERIC.test(w) && w.toLowerCase() !== city.toLowerCase());
  if (words.length === 1) return words[0].toUpperCase();
  if (words.length > 1) return words.slice(0, 3).map((w) => w[0].toUpperCase()).join("");
  return short.slice(0, 3).toUpperCase();
}

function Dim({ children }: { children: React.ReactNode }) {
  return <span className="text-white/45">{children}</span>;
}

function Stars({ className = "size-3.5" }: { className?: string }) {
  return (
    <span className="flex">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`${className} fill-[#faab3f] text-[#faab3f]`} />
      ))}
    </span>
  );
}

function SectionHeading({ index, eyebrow, title, description }: { index?: string; eyebrow: string; title: React.ReactNode; description?: string }) {
  return (
    <Reveal className="max-w-3xl">
      <p className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">
        {index ? (
          <>
            <span className="text-[var(--pv-accent)]">{index}</span>
            <span className="h-px w-8 bg-white/20" />
          </>
        ) : null}
        {eyebrow}
      </p>
      <h2 className="font-display text-[clamp(2.1rem,4.6vw,3.8rem)] font-light leading-[1.02] tracking-[-0.035em] text-balance">{title}</h2>
      {description ? <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">{description}</p> : null}
    </Reveal>
  );
}

function CallButton({ lead, className }: { lead: PreviewLead; className: string }) {
  if (!lead.phone) return null;
  return (
    <a href={`tel:${lead.phone.tel}`} className={className}>
      <Phone className="size-4" />
      {lead.phone.display}
    </a>
  );
}

/** A line of moving air (or water) joining the process steps. */
function Thread({ vertical }: { vertical?: boolean }) {
  const end = vertical ? { x2: "0", y2: "100%" } : { x2: "100%", y2: "0" };
  return (
    <svg
      aria-hidden
      className={
        vertical
          ? "absolute left-[22px] top-[22px] h-[calc(100%-44px)] w-px overflow-visible lg:hidden"
          : "absolute left-[22px] top-[22px] hidden h-px w-[calc(100%-44px)] overflow-visible lg:block"
      }
    >
      <line x1="0" y1="0" {...end} stroke="rgba(255,255,255,0.1)" />
      <line
        x1="0"
        y1="0"
        {...end}
        strokeOpacity="0.7"
        strokeWidth="1.5"
        strokeDasharray="4 20"
        strokeLinecap="round"
        className="aircon-airflow stroke-[var(--pv-accent)]"
      />
    </svg>
  );
}

export function TradePreview({ lead }: { lead: PreviewLead }) {
  const trade = TRADES[lead.trade];
  const t = trade.theme;
  const copy = { short: lead.short, city: lead.city, place: lead.place };
  const mark = badge(lead.short, lead.city);
  const rated = lead.rating >= 4 && lead.reviews >= 3;
  const nav = [
    { href: "#services", label: "Services" },
    { href: "#process", label: "How it works" },
    ...(rated ? [{ href: "#reviews", label: "Reviews" }] : []),
    { href: "#faq", label: "FAQ" },
  ];
  const trust = [
    rated
      ? { stat: lead.rating.toFixed(1), unit: "★", label: `Google rating · ${lead.reviews} reviews` }
      : { stat: "Fast", label: "Response when you need it" },
    { stat: "Free", label: "Quotes, no obligation" },
    { stat: "Upfront", label: "Pricing before any work starts" },
    { stat: lead.city, label: "Local team, local support" },
  ];
  const theme = {
    "--pv-bg": t.bg,
    "--pv-raised": t.raised,
    "--pv-strip": t.strip,
    "--pv-card": t.card,
    "--pv-card-hover": t.cardHover,
    "--pv-footer": t.footer,
    "--pv-accent": t.accent,
    "--pv-ink": t.ink,
    "--pv-soft": t.soft,
    "--pv-glow": t.glow,
    // The shared quote form reads these.
    "--ac-accent": t.accent,
    "--ac-accent-ink": t.ink,
    "--ac-accent-soft": t.soft,
    "--ac-field": t.bg,
    "--ac-option": t.card,
  } as React.CSSProperties;

  const heroCopy = (
    <div className="pointer-events-none relative z-10 order-1 mx-auto flex w-full max-w-7xl px-5 pt-28 sm:px-8 sm:pt-32 lg:flex-1 lg:items-center lg:px-12 lg:pt-24 lg:pb-32">
      <div className="pointer-events-auto max-w-xl">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">
          <span className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-[var(--pv-accent)]/60" />
              <span className="relative size-2 rounded-full bg-[var(--pv-accent)]" />
            </span>
            Free quotes
          </span>
          <span className="hidden text-white/25 sm:inline">/</span>
          {lead.place} &amp; nearby
        </p>

        <h1 className="font-display mt-6 text-[clamp(3rem,7.4vw,6.4rem)] font-light leading-[0.92] tracking-[-0.045em]">
          <span
            className="block bg-clip-text text-transparent"
            style={{ backgroundImage: `linear-gradient(to right, ${t.lineOne.join(", ")})` }}
          >
            {trade.headline[0]}
          </span>
          <span
            className="block bg-clip-text text-transparent"
            style={{ backgroundImage: `linear-gradient(to right, ${t.lineTwo.join(", ")})` }}
          >
            {trade.headline[1]}
          </span>
        </h1>

        <p className="mt-7 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">{trade.heroCopy(copy)}</p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a href="#quote" className={ACCENT_BUTTON}>
            Get a free quote
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <CallButton lead={lead} className={GHOST_BUTTON} />
        </div>

        <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/65">
          {rated && (
            <li className="flex items-center gap-2">
              <Stars />
              {lead.rating.toFixed(1)} on Google
            </li>
          )}
          <li className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-[var(--pv-accent)]" />
            Upfront pricing
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <div
      style={theme}
      className={`${display.variable} ${sans.variable} ${mono.variable} min-h-dvh w-full overflow-x-clip bg-[var(--pv-bg)] font-[family-name:var(--font-ac-sans)] text-[#ebf4f0] antialiased selection:bg-[var(--pv-accent)]/30 [&_.font-display]:font-[family-name:var(--font-ac-display)] [&_.font-mono]:font-[family-name:var(--font-ac-mono)]`}
    >
      <p className="relative z-[60] bg-black px-4 py-2 text-center font-mono text-[11px] tracking-wide text-white/60">
        Website preview made for <span className="text-white">{lead.short}</span> by{" "}
        <Link href="/portfolio" className="text-white underline underline-offset-2">
          Felipe
        </Link>{" "}
        · <span className="text-[#faab3f]">not live yet</span>
      </p>

      <header className="sticky top-0 z-50 h-0">
        <div className="px-3 pt-3 sm:px-5">
          <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 rounded-full border border-white/10 bg-[var(--pv-bg)]/70 pl-2 pr-2 backdrop-blur-xl">
            <a href="#top" className="flex min-w-0 items-center gap-2.5">
              <span className="font-display grid size-10 shrink-0 place-items-center rounded-full bg-[var(--pv-accent)] text-sm font-semibold text-[var(--pv-ink)]">
                {mark.slice(0, 2)}
              </span>
              <span className="font-display truncate text-[15px] font-medium tracking-tight">{lead.short}</span>
            </a>
            <div className="hidden items-center gap-0.5 lg:flex">
              {nav.map((item) => (
                <a key={item.href} href={item.href} className="rounded-full px-3.5 py-2 text-sm text-white/70 transition-colors hover:bg-white/[0.07] hover:text-white">
                  {item.label}
                </a>
              ))}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <CallButton
                lead={lead}
                className="hidden items-center gap-2 rounded-full px-3.5 py-2 font-mono text-[13px] text-white/80 transition-colors hover:text-white sm:inline-flex"
              />
              <a href="#quote" className="group inline-flex h-10 items-center gap-1.5 rounded-full bg-[var(--pv-accent)] px-4 text-sm font-semibold text-[var(--pv-ink)] transition-transform hover:-translate-y-px">
                Free quote
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </nav>
        </div>
      </header>

      <section id="top" className="relative isolate flex flex-col overflow-hidden lg:min-h-[max(100svh,800px)]">
        {trade.particles ? (
          <ParticleStage trade={lead.trade} colors={trade.particles.colors} captions={trade.particles.captions}>
            {heroCopy}
          </ParticleStage>
        ) : (
          <HeroStage brand={mark} fahrenheit location={lead.location}>
            {heroCopy}
          </HeroStage>
        )}
      </section>

      <section aria-label={`Why ${lead.city} trusts ${lead.short}`} className="border-y border-white/[0.07] bg-[var(--pv-strip)]">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 lg:grid-cols-4">
          {trust.map((item, i) => (
            <Reveal
              key={item.label}
              delay={i * 80}
              className={`border-white/[0.07] px-5 py-7 sm:px-8 lg:px-12 lg:py-9 ${i % 2 === 1 ? "border-l" : ""} ${i >= 2 ? "border-t lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
            >
              <p className="truncate font-mono text-2xl font-light tracking-tight sm:text-3xl">
                {item.stat}
                {item.unit ? <span className="ml-1.5 text-base text-[var(--pv-accent)]">{item.unit}</span> : null}
              </p>
              <p className="mt-1.5 text-xs leading-snug text-white/50 sm:text-sm">{item.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {lead.trade === "hvac" && (
        <section
          aria-label="Brands we install and service"
          className="group overflow-hidden border-b border-white/[0.07] py-10 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
        >
          <div className="marquee-track [--marquee-duration:38s] group-hover:[animation-play-state:paused]">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
                {BRANDS.map((brand) => (
                  <div
                    key={`${dup}-${brand.name}`}
                    className="relative mx-10 h-9 w-32 shrink-0 opacity-45 brightness-0 invert transition-opacity hover:opacity-90 sm:mx-14 sm:h-10 sm:w-36"
                  >
                    <Image src={brand.logo} alt={`${brand.name} air conditioning`} fill unoptimized className="object-contain" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="services" className="scroll-mt-20 py-24 sm:py-32">
        <div className={WRAP}>
          <SectionHeading
            index="01"
            eyebrow="What we do"
            title={
              <>
                {trade.services.title[0]} <Dim>{trade.services.title[1]}</Dim>
              </>
            }
            description={trade.services.body(copy)}
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {trade.services.items.map(({ icon: Icon, title, body }, i) => (
              <div key={title} className="group relative bg-[var(--pv-card)] p-7 transition-colors hover:bg-[var(--pv-card-hover)] sm:p-8">
                <span aria-hidden className={CARD_GLOW} />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[var(--pv-accent)]">0{i + 1}</span>
                  <Icon className="size-5 text-[var(--pv-accent)]" strokeWidth={1.5} />
                </div>
                <h3 className="font-display mt-6 text-xl font-light tracking-tight">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className={`scroll-mt-20 py-24 sm:py-32 ${RAISED}`}>
        <div className={WRAP}>
          <SectionHeading
            index="02"
            eyebrow="How it works"
            title={
              <>
                {trade.process.title[0]} <Dim>{trade.process.title[1]}</Dim>
              </>
            }
          />
          <div className="relative mt-16 lg:mt-20">
            <Thread />
            <Thread vertical />
            <div className="grid gap-10 lg:grid-cols-4 lg:gap-8">
              {trade.process.steps.map((item, i) => (
                <Reveal key={item.title} delay={i * 100} className="relative flex gap-6 lg:block">
                  <span className="relative flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-[var(--pv-bg)] font-mono text-xs text-[var(--pv-accent)]">
                    0{i + 1}
                  </span>
                  <div className="lg:mt-8 lg:pr-6">
                    <h3 className="font-display text-xl font-light tracking-tight">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/55">{item.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="why" className="scroll-mt-20 py-24 sm:py-32">
        <div className={WRAP}>
          <SectionHeading index="03" eyebrow={`Why ${lead.short}`} title={`Six reasons ${lead.city} calls us back.`} />
          <div className="mt-14 grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {trade.why(copy).map((item, i) => (
              <div key={item.title} className="group relative bg-[var(--pv-card)] p-7 transition-colors hover:bg-[var(--pv-card-hover)] sm:p-8">
                <span aria-hidden className={CARD_GLOW} />
                <span className="font-mono text-xs text-[var(--pv-accent)]">0{i + 1}</span>
                <h3 className="font-display mt-6 text-xl font-light tracking-tight">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {rated && (
        <section id="reviews" className={`scroll-mt-20 py-24 sm:py-32 ${RAISED}`}>
          <Reveal className={`${WRAP} flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end`}>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">Reviews</p>
              <p className="font-display mt-5 text-[clamp(4.5rem,13vw,10rem)] font-light leading-[0.85] tracking-[-0.06em]">
                {lead.rating.toFixed(1)}
                <span className="ml-3 align-top text-[0.35em] text-[#faab3f]">★</span>
              </p>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-white/65">
                From {lead.reviews} reviews on Google. <Dim>See what customers say.</Dim>
              </p>
            </div>
            <a href={lead.maps} target="_blank" rel="noopener noreferrer" className={GHOST_BUTTON}>
              <Stars />
              Read them on Google
              <ArrowRight className="size-4" />
            </a>
          </Reveal>
        </section>
      )}

      <section id="faq" className="scroll-mt-20 py-24 sm:py-32">
        <div className={`${WRAP} grid gap-12 lg:grid-cols-12`}>
          <div className="lg:col-span-5">
            <SectionHeading
              index="04"
              eyebrow="FAQ"
              title={
                <>
                  Questions, <Dim>answered straight.</Dim>
                </>
              }
            />
            {lead.phone && (
              <Reveal delay={100} className="mt-8">
                <a
                  href={`tel:${lead.phone.tel}`}
                  className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] py-2 pl-2 pr-5 text-sm transition-colors hover:bg-white/[0.07]"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-[var(--pv-accent)] text-[var(--pv-ink)]">
                    <Phone className="size-4" />
                  </span>
                  Still unsure? Call {lead.phone.display}
                </a>
              </Reveal>
            )}
          </div>
          <Reveal delay={80} className="border-t border-white/10 lg:col-span-7">
            {trade.faq(copy).map((item, i) => (
              <details key={item.q} open={i === 0} className="group border-b border-white/10">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                  <span className="flex gap-5">
                    <span className="mt-1.5 font-mono text-xs text-white/35">0{i + 1}</span>
                    <span className="font-display text-lg font-light tracking-tight sm:text-xl">{item.q}</span>
                  </span>
                  <span aria-hidden className="mt-1 grid size-7 shrink-0 place-items-center rounded-full border border-white/15 text-white/60 transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="pb-6 pl-10 pr-12 text-[15px] leading-relaxed text-white/60">{item.a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-t border-white/[0.07] py-24 sm:py-32">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_80%_at_50%_120%,rgb(var(--pv-glow)/0.35),transparent_70%),radial-gradient(ellipse_30%_40%_at_85%_0%,rgba(250,171,63,0.16),transparent_70%)]"
        />
        <Reveal className={`${WRAP} text-center`}>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">Free quotes · {lead.place}</p>
          <h2 className="font-display mx-auto mt-6 max-w-4xl text-[clamp(2.6rem,7vw,6rem)] font-light leading-[0.95] tracking-[-0.045em] text-balance">
            {trade.cta.title[0]} <span className="text-[var(--pv-soft)]">{trade.cta.title[1]}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg">{trade.cta.body}</p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="#quote" className={ACCENT_BUTTON}>
              Get my free quote
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <CallButton lead={lead} className={`${GHOST_BUTTON} font-mono font-normal`} />
          </div>
        </Reveal>
      </section>

      <section id="quote" className="scroll-mt-20 pb-24 sm:pb-32">
        <div className={`${WRAP} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <div className="lg:col-span-5">
            <SectionHeading
              index="05"
              eyebrow="Get in touch"
              title={
                <>
                  Request your <span className="text-[var(--pv-soft)]">free quote.</span>
                </>
              }
              description="Tell us a little about what you need and we'll get back to you quickly with honest advice and a clear quote. Prefer to talk? Call us anytime."
            />
            <Reveal delay={100} className="mt-10 divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {lead.phone && (
                <a href={`tel:${lead.phone.tel}`} className="flex items-center gap-4 py-4 transition-opacity hover:opacity-80">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-[var(--pv-accent)]">
                    <Phone className="size-4" />
                  </span>
                  <span className="leading-tight">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Call us</span>
                    <span className="mt-1 block text-sm text-white/90">{lead.phone.display}</span>
                  </span>
                </a>
              )}
              <div className="flex items-center gap-4 py-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-[var(--pv-accent)]">
                  <MapPin className="size-4" />
                </span>
                <span className="leading-tight">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Service area</span>
                  <span className="mt-1 block text-sm text-white/90">{lead.city} &amp; nearby</span>
                </span>
              </div>
            </Reveal>
          </div>
          <Reveal
            delay={120}
            className="rounded-[2rem] border border-white/10 bg-[var(--pv-card)] p-6 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] sm:p-10 lg:col-span-7 lg:self-start"
          >
            <QuoteForm
              contact={lead.short}
              phone={lead.phone?.display ?? "us"}
              services={trade.services.items.map((s) => s.title)}
              area={{ label: "ZIP code", placeholder: "e.g. 33602" }}
              phonePlaceholder="(555) 555-0123"
            />
          </Reveal>
        </div>
      </section>

      <footer className="relative overflow-hidden border-t border-white/[0.07] bg-[var(--pv-footer)]">
        <div className={`${WRAP} pb-10 pt-16`}>
          <div className="flex flex-col justify-between gap-10 md:flex-row">
            <div className="max-w-xs">
              <p className="font-display text-xl font-medium tracking-tight">{lead.short}</p>
              <p className="mt-4 text-sm leading-relaxed text-white/55">{trade.footer(copy)}</p>
            </div>
            <ul className="space-y-2.5 text-sm">
              {trade.services.items.map((s) => (
                <li key={s.title}>
                  <a href="#services" className="text-white/65 transition-colors hover:text-white">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="space-y-3 text-sm text-white/70">
              {lead.phone && (
                <li>
                  <a href={`tel:${lead.phone.tel}`} className="flex items-center gap-2.5 hover:text-white">
                    <Phone className="size-4 text-[var(--pv-accent)]" />
                    {lead.phone.display}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-2.5">
                <MapPin className="size-4 text-[var(--pv-accent)]" />
                {lead.place}
              </li>
            </ul>
          </div>
          <p
            aria-hidden
            className="font-display pointer-events-none mt-16 select-none truncate bg-gradient-to-b from-white/[0.09] to-transparent bg-clip-text text-center text-[clamp(4rem,18vw,16rem)] font-semibold leading-[0.85] tracking-[-0.06em] text-transparent"
          >
            {mark}
          </p>
          <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-white/[0.07] pt-6 font-mono text-[11px] text-white/40 sm:flex-row">
            <p>
              © {new Date().getFullYear()} {lead.short}
            </p>
            <p>{lead.place}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

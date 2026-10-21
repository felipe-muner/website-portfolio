import type { Metadata } from "next";
import Image from "next/image";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import { ArrowRight, Clock, Mail, MapPin, Phone, ShieldCheck, Star } from "lucide-react";
import { InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { CoverageMap } from "@/components/layouts/aircon/coverage-map";
import { HeroStage } from "@/components/layouts/aircon/hero-stage";
import { QuoteForm } from "@/components/layouts/aircon/quote-form";
import { RoomSizer } from "@/components/layouts/aircon/room-sizer";
import { SystemPicker } from "@/components/layouts/aircon/system-picker";
import { BRANDS, BUSINESS, FAQ, GALLERY, PROCESS, REVIEWS, SERVICES, WHY_US, type Review } from "@/lib/layouts/aircon";

export const metadata: Metadata = {
  title: "MGM Air Conditioning — Sunshine Coast air con",
  robots: { index: false },
};

const display = Sora({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-ac-display" });
const sans = Geist({ subsets: ["latin"], variable: "--font-ac-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-ac-mono" });

const NAV = [
  { href: "#services", label: "Services" },
  { href: "#sizer", label: "Sizing" },
  { href: "#work", label: "Our work" },
  { href: "#about", label: "About" },
  { href: "#reviews", label: "Reviews" },
  { href: "#areas", label: "Areas" },
] as const;

const QBCC = BUSINESS.licenses.find((l) => l.label === "QBCC")?.value;
const ARC = BUSINESS.licenses.find((l) => l.label === "ARC")?.value;

const TRUST = [
  { stat: "5.0", unit: "★", label: "Google rating from local homes" },
  { stat: "24/7", label: "Local support, any hour" },
  { stat: `${BRANDS.length}`, unit: "brands", label: "Daikin to Hisense, supplied & fitted" },
  { stat: "Licensed", label: `QBCC ${QBCC} · ARC ${ARC}` },
] as const;

/* Raised sections sit a shade lighter than the page. */
const RAISED = "border-t border-white/[0.07] bg-[#07130f]";
const WRAP = "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12";
const MINT_BUTTON =
  "group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#66e6ba] px-6 text-sm font-semibold text-[#001c12] shadow-[0_0_40px_-8px_#66e6ba] transition-transform hover:-translate-y-0.5";
const GHOST_BUTTON =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10";

function SectionHeading({
  index,
  eyebrow,
  title,
  description,
}: {
  index?: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
}) {
  return (
    <Reveal className="max-w-3xl">
      <p className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">
        {index ? (
          <>
            <span className="text-[#66e6ba]">{index}</span>
            <span className="h-px w-8 bg-white/20" />
          </>
        ) : null}
        {eyebrow}
      </p>
      <h2 className="font-display text-[clamp(2.1rem,4.6vw,3.8rem)] font-light leading-[1.02] tracking-[-0.035em] text-balance">
        {title}
      </h2>
      {description ? <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">{description}</p> : null}
    </Reveal>
  );
}

/** Muted second half of a two-part headline. */
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

export default function AirconLayout() {
  return (
    <div
      className={`${display.variable} ${sans.variable} ${mono.variable} min-h-dvh overflow-x-clip bg-[#06100c] font-[family-name:var(--font-ac-sans)] text-[#ebf4f0] antialiased selection:bg-[#66e6ba]/30 [&_.font-display]:font-[family-name:var(--font-ac-display)] [&_.font-mono]:font-[family-name:var(--font-ac-mono)]`}
    >
      <Nav />
      <Hero />
      <Trust />
      <Brands />
      <Services />
      <Sizer />
      <Process />
      <Work />
      <About />
      <Why />
      <Reviews />
      <Areas />
      <Faq />
      <Cta />
      <Quote />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 h-0">
      <div className="px-3 pt-3 sm:px-5">
        <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 rounded-full border border-white/10 bg-[#06100c]/70 pl-4 pr-2 backdrop-blur-xl sm:pl-5">
          <a href="#top" aria-label={`${BUSINESS.name} home`} className="shrink-0">
            <Image src="/img/layouts/aircon-logo.png" alt={`${BUSINESS.name} logo`} width={288} height={240} priority className="h-9 w-auto" />
          </a>
          <div className="hidden items-center gap-0.5 lg:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-3.5 py-2 text-sm text-white/70 transition-colors hover:bg-white/[0.07] hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <a
              href={BUSINESS.phoneHref}
              className="hidden items-center gap-2 rounded-full px-3.5 py-2 font-mono text-[13px] text-white/80 transition-colors hover:text-white sm:inline-flex"
            >
              <Phone className="size-3.5 text-[#66e6ba]" />
              {BUSINESS.phone}
            </a>
            <a
              href="#quote"
              className="group inline-flex h-10 items-center gap-1.5 rounded-full bg-[#66e6ba] px-4 text-sm font-semibold text-[#001c12] transition-transform hover:-translate-y-px"
            >
              Free quote
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative isolate flex flex-col overflow-hidden lg:min-h-[max(100svh,800px)]">
      <HeroStage>
        {/* Full-width so the copy lines up with the nav; clicks pass through
            beside the text column to the remote. */}
        <div className="pointer-events-none relative z-10 order-1 mx-auto flex w-full max-w-7xl px-5 pt-28 sm:px-8 sm:pt-32 lg:flex-1 lg:items-center lg:px-12 lg:pt-24 lg:pb-32">
          <div className="pointer-events-auto max-w-xl">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">
              <span className="flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#66e6ba]/60" />
                  <span className="relative size-2 rounded-full bg-[#66e6ba]" />
                </span>
                Open 24/7
              </span>
              <span className="hidden text-white/25 sm:inline">/</span>
              Caloundra → Noosa · North Brisbane
            </p>

            <h1 className="font-display mt-6 text-[clamp(3rem,7.4vw,6.4rem)] font-light leading-[0.92] tracking-[-0.045em]">
              <span className="block bg-gradient-to-r from-[#ffd59a] via-[#faab3f] to-[#ff9f5a] bg-clip-text text-transparent">
                Hot outside.
              </span>
              <span className="block bg-gradient-to-r from-white via-[#d9fff4] to-[#99f2e0] bg-clip-text text-transparent">
                Perfect inside.
              </span>
            </h1>

            <p className="mt-7 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
              Family-owned air conditioning for the Sunshine Coast. Split systems, ducted and VRF installed,
              serviced and repaired by {BUSINESS.owners} — honest advice, tidy work, and owners who answer the
              phone.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#quote" className={MINT_BUTTON}>
                Get a free quote
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a href={BUSINESS.phoneHref} className={GHOST_BUTTON}>
                <Phone className="size-4" />
                {BUSINESS.phone}
              </a>
            </div>

            <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/65">
              <li className="flex items-center gap-2">
                <Stars />
                5.0 on Google
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-[#66e6ba]" />
                QBCC &amp; ARC licensed
              </li>
            </ul>
          </div>
        </div>
      </HeroStage>
    </section>
  );
}

function Trust() {
  return (
    <section aria-label="Why locals trust MGM" className="border-y border-white/[0.07] bg-[#081410]">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 lg:grid-cols-4">
        {TRUST.map((item, i) => (
          <Reveal
            key={item.label}
            delay={i * 80}
            className={`border-white/[0.07] px-5 py-7 sm:px-8 lg:px-12 lg:py-9 ${i % 2 === 1 ? "border-l" : ""} ${i >= 2 ? "border-t lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
          >
            <p className="font-mono text-2xl font-light tracking-tight sm:text-3xl">
              {item.stat}
              {"unit" in item ? <span className="ml-1.5 text-base text-[#66e6ba]">{item.unit}</span> : null}
            </p>
            <p className="mt-1.5 text-xs leading-snug text-white/50 sm:text-sm">{item.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Brands() {
  return (
    <section
      aria-label="Brands we supply and install"
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
  );
}

function Services() {
  return (
    <section id="services" className="scroll-mt-20 py-24 sm:py-32">
      <div className={WRAP}>
        <SectionHeading
          index="01"
          eyebrow="What we do"
          title={
            <>
              Every kind of cool, <Dim>fitted and looked after properly.</Dim>
            </>
          }
          description="From a single bedroom split to whole-of-home ducted comfort — we supply, install, service and repair the lot."
        />
        <SystemPicker />
      </div>
    </section>
  );
}

function Sizer() {
  return (
    <section id="sizer" className={`scroll-mt-20 py-24 sm:py-32 ${RAISED}`}>
      <div className={WRAP}>
        <SectionHeading
          index="02"
          eyebrow="What size do I need?"
          title={
            <>
              Too small struggles. Too big wastes. <Dim>Find the size that&apos;s just right.</Dim>
            </>
          }
          description="Tell us about the room and we'll give you a ballpark in kilowatts — then send it straight to us for a proper quote."
        />
        <RoomSizer />
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="py-24 sm:py-32">
      <div className={WRAP}>
        <SectionHeading
          index="03"
          eyebrow="How it works"
          title={
            <>
              From hello to all done. <Dim>No pushy sales, no jargon.</Dim>
            </>
          }
        />

        <div className="relative mt-16 lg:mt-20">
          {/* The thread joining the steps — a line of moving air */}
          <svg aria-hidden className="absolute left-[22px] top-[22px] hidden h-px w-[calc(100%-44px)] overflow-visible lg:block">
            <line x1="0" y1="0" x2="100%" y2="0" stroke="rgba(255,255,255,0.1)" />
            <line x1="0" y1="0" x2="100%" y2="0" stroke="#66e6ba" strokeOpacity="0.7" strokeWidth="1.5" strokeDasharray="4 20" strokeLinecap="round" className="aircon-airflow" />
          </svg>
          <svg aria-hidden className="absolute left-[22px] top-[22px] h-[calc(100%-44px)] w-px overflow-visible lg:hidden">
            <line x1="0" y1="0" x2="0" y2="100%" stroke="rgba(255,255,255,0.1)" />
            <line x1="0" y1="0" x2="0" y2="100%" stroke="#66e6ba" strokeOpacity="0.7" strokeWidth="1.5" strokeDasharray="4 20" strokeLinecap="round" className="aircon-airflow" />
          </svg>

          <div className="grid gap-10 lg:grid-cols-4 lg:gap-8">
            {PROCESS.map((item, i) => (
              <Reveal key={item.step} delay={i * 100} className="relative flex gap-6 lg:block">
                <span className="relative flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-[#06100c] font-mono text-xs text-[#66e6ba]">
                  {item.step}
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
  );
}

function Work() {
  return (
    <section id="work" className={`scroll-mt-20 py-24 sm:py-32 ${RAISED}`}>
      <div className={WRAP}>
        <SectionHeading
          index="04"
          eyebrow="Our work"
          title={
            <>
              Neat pipe runs. Clean finishes. <Dim>Recent jobs across the Coast.</Dim>
            </>
          }
        />
      </div>
      {/* Swipe or scroll sideways; the strip starts aligned with the copy above */}
      <div className="mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-4 [scrollbar-width:none] sm:px-8 lg:px-[max(3rem,calc((100vw-80rem)/2+3rem))] [&::-webkit-scrollbar]:hidden">
        {GALLERY.map((item, i) => (
          <Reveal key={item.src} delay={i * 70} from="right" className="shrink-0 snap-start">
            <figure className="group relative h-[22rem] w-[78vw] overflow-hidden rounded-[2rem] border border-white/10 sm:h-[26rem] sm:w-[24rem] lg:h-[30rem] lg:w-[28rem]">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 78vw, 28rem"
                className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06100c]/90 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6">
                <span className="inline-block rounded-full bg-[#66e6ba] px-3 py-1 text-xs font-semibold text-[#001c12]">{item.tag}</span>
                <p className="mt-3 text-lg font-medium text-white">{item.alt}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="scroll-mt-20 border-t border-white/[0.07] py-24 sm:py-32">
      <div className={`${WRAP} grid items-center gap-14 lg:grid-cols-12 lg:gap-16`}>
        {/* The two of them at home, and out on the job */}
        <Reveal className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10">
            <Image
              src="/img/layouts/aircon-owners.jpg"
              alt={`${BUSINESS.owners} at home with their dog`}
              fill
              sizes="(max-width: 1024px) 90vw, 36vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06100c]/70 via-transparent to-transparent" />
            <p className="absolute bottom-5 left-5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/75">
              {BUSINESS.owners} · owners
            </p>
          </div>
          <div className="absolute -bottom-10 -right-4 w-[46%] rotate-3 overflow-hidden rounded-2xl border-4 border-[#06100c] shadow-2xl sm:-right-8">
            <div className="relative aspect-square">
              <Image
                src="/img/layouts/aircon-team-ute.jpg"
                alt={`${BUSINESS.owners} with the MGM service ute`}
                fill
                sizes="(max-width: 1024px) 42vw, 16vw"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <SectionHeading
            index="05"
            eyebrow="Our story"
            title={
              <>
                You deal with the owners. <Dim>Not a call centre.</Dim>
              </>
            }
          />
          <Reveal delay={100} className="mt-8 grid gap-6 text-base leading-relaxed text-white/60 sm:grid-cols-2">
            <p>
              MGM Air Conditioning is a husband-and-wife team who fell in love with the Sunshine Coast — and made it
              our mission to keep its homes comfortable. When you call, you talk to the people who&apos;ll actually be
              on the tools at your home.
            </p>
            <p>
              From the first quote to the final test, we treat every job with the same honesty and attention to detail
              we&apos;d want in our own house. That&apos;s how we&apos;ve earned a 5-star reputation across the Coast
              and North Brisbane.
            </p>
          </Reveal>
          <Reveal delay={180} className="mt-10 border-l-2 border-[#66e6ba] pl-5">
            <p className="font-display text-2xl font-light tracking-tight text-white sm:text-3xl">
              &ldquo;{BUSINESS.tagline}.&rdquo;
            </p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">Our promise on every job</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Why() {
  return (
    <section id="why" className="scroll-mt-20 pb-24 sm:pb-32">
      <div className={WRAP}>
        <SectionHeading index="06" eyebrow="Why MGM" title="Six reasons the Coast calls us back." />
        <div className="mt-14 grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_US.map((item, i) => (
            <div key={item.title} className="group relative bg-[#091712] p-7 transition-colors hover:bg-[#0b1b16] sm:p-8">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgba(102,230,186,0.12),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <span className="font-mono text-xs text-[#66e6ba]">0{i + 1}</span>
              <h3 className="font-display mt-6 text-xl font-light tracking-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

/** Google's four-colour "G", for review attribution. */
function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path fill="#4285F4" d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.5 5.5 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.57-5.17 3.57-8.82Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.09A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.28a12 12 0 0 0 0 10.76l3.99-3.09Z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.62l3.99 3.09C6.22 6.86 8.87 4.75 12 4.75Z" />
    </svg>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="mx-2 flex w-[19rem] shrink-0 flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:w-[24rem]">
      <div className="flex items-center justify-between">
        <Stars />
        <GoogleG className="size-4" />
      </div>
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-white/80">
        <span className="line-clamp-5">&ldquo;{review.quote}&rdquo;</span>
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-[#66e6ba]/15 font-mono text-xs text-[#66e6ba]">
          {initials(review.name)}
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-medium">{review.name}</span>
          <span className="block text-xs text-white/40">Google review</span>
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * One endless row: two identical tracks sliding -50% so the loop is seamless.
 * Each track repeats its five reviews so it stays wider than a large screen.
 */
function ReviewRow({ reviews, reverse }: { reviews: Review[]; reverse?: boolean }) {
  const track = [...reviews, ...reviews];
  return (
    <div
      className={`marquee-track items-stretch group-hover:[animation-play-state:paused] ${reverse ? "[--marquee-duration:140s] [animation-direction:reverse]" : "[--marquee-duration:120s]"}`}
    >
      {[0, 1].map((dup) => (
        <div key={dup} className="flex shrink-0 items-stretch" aria-hidden={dup === 1}>
          {track.map((review, i) => (
            <ReviewCard key={`${dup}-${i}`} review={review} />
          ))}
        </div>
      ))}
    </div>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="scroll-mt-20 overflow-hidden py-24 sm:py-32">
      <div className={`${WRAP} flex flex-col justify-between gap-8 lg:flex-row lg:items-end`}>
        <SectionHeading
          eyebrow="Reviews"
          title={
            <>
              5.0 on Google. <Dim>In their words, not ours.</Dim>
            </>
          }
        />
        <div className="flex items-center gap-3 self-start rounded-full border border-white/10 bg-white/[0.03] py-2 pl-2 pr-5 lg:self-auto">
          <span className="flex size-9 items-center justify-center rounded-full bg-white">
            <GoogleG className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-medium">5.0 ★★★★★</span>
            <span className="block text-xs text-white/45">Verified Google reviews</span>
          </span>
        </div>
      </div>

      <div className="group mt-14 flex flex-col gap-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <ReviewRow reviews={REVIEWS.filter((_, i) => i % 2 === 0)} />
        <ReviewRow reviews={REVIEWS.filter((_, i) => i % 2 === 1)} reverse />
      </div>
    </section>
  );
}

function Areas() {
  return (
    <section id="areas" className={`scroll-mt-20 py-24 sm:py-32 ${RAISED}`}>
      <div className={WRAP}>
        <SectionHeading
          index="07"
          eyebrow="Where we work"
          title={
            <>
              Caloundra to Noosa. <Dim>And down into North Brisbane.</Dim>
            </>
          }
          description="Local means we're never far away — for a quote, a service, or a breakdown on the hottest day of the year."
        />
        <CoverageMap />
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 py-24 sm:py-32">
      <div className={`${WRAP} grid gap-12 lg:grid-cols-12`}>
        <div className="lg:col-span-5">
          <SectionHeading
            index="08"
            eyebrow="FAQ"
            title={
              <>
                Questions, <Dim>answered straight.</Dim>
              </>
            }
          />
          <Reveal delay={100} className="mt-8">
            <a
              href={BUSINESS.phoneHref}
              className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] py-2 pl-2 pr-5 text-sm transition-colors hover:bg-white/[0.07]"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-[#66e6ba] text-[#001c12]">
                <Phone className="size-4" />
              </span>
              Still unsure? Call {BUSINESS.phone}
            </a>
          </Reveal>
        </div>

        <Reveal delay={80} className="border-t border-white/10 lg:col-span-7">
          {FAQ.map((item, i) => (
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
  );
}

function Cta() {
  return (
    <section className="relative isolate overflow-hidden border-t border-white/[0.07] py-24 sm:py-32">
      {/* A cold glow rising from below, with a last warm edge of sun */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_80%_at_50%_120%,rgba(56,190,160,0.4),transparent_70%),radial-gradient(ellipse_30%_40%_at_85%_0%,rgba(250,171,63,0.16),transparent_70%)]"
      />
      <Reveal className={`${WRAP} text-center`}>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">Open 24/7 · Free quotes</p>
        <h2 className="font-display mx-auto mt-6 max-w-4xl text-[clamp(2.6rem,7vw,6rem)] font-light leading-[0.95] tracking-[-0.045em] text-balance">
          Next scorcher? <span className="text-[#99f2e0]">Be ready for it.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg">
          A free, no-obligation quote from the owners — honest advice, tidy work and local support long after the
          install.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="#quote" className={MINT_BUTTON}>
            Get my free quote
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a href={BUSINESS.phoneHref} className={`${GHOST_BUTTON} font-mono font-normal`}>
            <Phone className="size-4" />
            {BUSINESS.phone}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

const DETAILS = [
  { icon: Phone, label: "Call us", value: BUSINESS.phone, href: BUSINESS.phoneHref },
  { icon: Mail, label: "Email", value: BUSINESS.email, href: `mailto:${BUSINESS.email}` },
  { icon: MapPin, label: "Service area", value: BUSINESS.serviceArea },
  { icon: Clock, label: "Hours", value: BUSINESS.hours },
] as const;

function Quote() {
  return (
    <section id="quote" className="scroll-mt-20 pb-24 sm:pb-32">
      <div className={`${WRAP} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
        <div className="lg:col-span-5">
          <SectionHeading
            index="09"
            eyebrow="Get in touch"
            title={
              <>
                Request your <span className="text-[#99f2e0]">free quote.</span>
              </>
            }
            description="Tell us a little about your space and we'll get back to you quickly with honest advice and a clear quote. Prefer to talk? Call us anytime."
          />
          <Reveal delay={100} className="mt-10 divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {DETAILS.map((d) => {
              const content = (
                <span className="flex items-center gap-4 py-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-[#66e6ba]">
                    <d.icon className="size-4" />
                  </span>
                  <span className="leading-tight">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{d.label}</span>
                    <span className="mt-1 block text-sm text-white/90">{d.value}</span>
                  </span>
                </span>
              );
              return "href" in d ? (
                <a key={d.label} href={d.href} className="block transition-opacity hover:opacity-80">
                  {content}
                </a>
              ) : (
                <div key={d.label}>{content}</div>
              );
            })}
            <a href={BUSINESS.instagram} target="_blank" rel="noopener noreferrer" className="block transition-opacity hover:opacity-80">
              <span className="flex items-center gap-4 py-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-[#66e6ba]">
                  <InstagramIcon className="size-4" />
                </span>
                <span className="leading-tight">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Instagram</span>
                  <span className="mt-1 block text-sm text-white/90">{BUSINESS.instagramHandle}</span>
                </span>
              </span>
            </a>
          </Reveal>
        </div>

        <Reveal
          delay={120}
          className="rounded-[2rem] border border-white/10 bg-[#091712] p-6 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] sm:p-10 lg:col-span-7 lg:self-start"
        >
          <QuoteForm />
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07] bg-[#040b08]">
      <div className={`${WRAP} pb-10 pt-16`}>
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Image src="/img/layouts/aircon-logo.png" alt={`${BUSINESS.name} logo`} width={288} height={240} className="h-16 w-auto" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
              {BUSINESS.tagline}. Family-owned air conditioning specialists for the Sunshine Coast &amp; North Brisbane.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {BUSINESS.licenses.map((l) => (
                <span key={l.label} className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] text-white/60">
                  {l.label} {l.value}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">Services</h3>
            <ul className="mt-5 space-y-2.5 text-sm">
              {SERVICES.map((s) => (
                <li key={s.title}>
                  <a href="#services" className="text-white/65 transition-colors hover:text-white">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">Explore</h3>
            <ul className="mt-5 space-y-2.5 text-sm">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-white/65 transition-colors hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">Get in touch</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li>
                <a href={BUSINESS.phoneHref} className="flex items-center gap-2.5 hover:text-white">
                  <Phone className="size-4 text-[#66e6ba]" />
                  {BUSINESS.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-2.5 hover:text-white">
                  <Mail className="size-4 text-[#66e6ba]" />
                  {BUSINESS.email}
                </a>
              </li>
              <li>
                <a href={BUSINESS.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-white">
                  <InstagramIcon className="size-4 text-[#66e6ba]" />
                  {BUSINESS.instagramHandle}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#66e6ba]" />
                {BUSINESS.serviceArea}
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="size-4 text-[#66e6ba]" />
                {BUSINESS.hours}
              </li>
            </ul>
          </div>
        </div>

        {/* Oversized wordmark, fading into the floor */}
        <p
          aria-hidden
          className="font-display pointer-events-none mt-16 select-none bg-gradient-to-b from-white/[0.09] to-transparent bg-clip-text text-center text-[clamp(5rem,24vw,20rem)] font-semibold leading-[0.8] tracking-[-0.06em] text-transparent"
        >
          MGM
        </p>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-white/[0.07] pt-6 font-mono text-[11px] text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} {BUSINESS.name}</p>
          <p>QBCC {QBCC} · ARC {ARC} · ABN AU 066 033</p>
        </div>
      </div>
    </footer>
  );
}

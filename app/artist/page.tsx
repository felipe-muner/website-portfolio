import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DM_Mono, Gloock, Outfit } from "next/font/google";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Mail, MapPin, Palette, ShoppingBag } from "lucide-react";
import { InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { CommissionForm } from "@/components/layouts/meads/commission-form";
import { CommissionLink, Tiers } from "@/components/layouts/meads/commission-link";
import { HeroStage } from "@/components/layouts/meads/hero-stage";
import { OpenStudio } from "@/components/layouts/meads/open-studio";
import { WorksGrid } from "@/components/layouts/meads/works-grid";
import { ARTIST, COLLECTORS, FAQ, OBJECTS, PRINTS, PROCESS, STUDIO_GALLERY, WORKS } from "@/lib/layouts/meads";

export const metadata: Metadata = {
  title: "Artist Layout — Maria Meads",
  robots: { index: false },
};

const display = Gloock({ subsets: ["latin"], weight: "400", variable: "--font-meads-display" });
const sans = Outfit({ subsets: ["latin"], variable: "--font-meads-sans" });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-meads-mono" });

const ORIGINALS = WORKS.filter((w) => w.series !== "Wearable art").length;
const WEARABLES = WORKS.filter((w) => w.series === "Wearable art").length;
const PRINT_COUNT = WORKS.filter((w) => w.print).length;

const STATS = [
  { v: ORIGINALS, l: "Original canvases" },
  { v: PRINT_COUNT, l: "Open-edition prints" },
  { v: WEARABLES, l: "Wearable one-offs" },
  { v: "1", l: "Portrait at a time" },
] as const;

const TICKER = ["Soul portraits", "Visionary canvases", "Animals & nature", "Hand-painted denim", "Fine-art prints", "Murals & live painting"];

const NAV = [
  { href: "#works", label: "Works" },
  { href: "#portraits", label: "Soul portraits" },
  { href: "#wearable", label: "Wearable" },
  { href: "#prints", label: "Prints" },
  { href: "#about", label: "About" },
] as const;

const SPECTRUM = "bg-[linear-gradient(90deg,#e9b44c,#ef6f8b,#9b6ff2,#42c8c0)]";

/* Explicit locale: this renders on the server and in the browser alike. */
const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

/* Film grain over the whole page — gesso, not gloss. */
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.26em] text-[#e9b44c]">
      <span className="h-px w-8 bg-[#e9b44c]" />
      {children}
    </p>
  );
}

function SectionHead({ kicker, title, aside }: { kicker: string; title: React.ReactNode; aside?: string }) {
  return (
    <Reveal className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <Kicker>{kicker}</Kicker>
        <h2 className="font-display mt-4 max-w-3xl text-balance text-[2.8rem] leading-[0.98] sm:text-6xl lg:text-[4.6rem]">{title}</h2>
      </div>
      {aside && <p className="max-w-sm leading-relaxed text-white/55 lg:pb-2">{aside}</p>}
    </Reveal>
  );
}

function Daub() {
  return (
    <span aria-hidden className={`block size-7 rounded-[48%_52%_45%_55%/55%_45%_55%_45%] ${SPECTRUM} shadow-[inset_-3px_-3px_6px_rgba(0,0,0,0.35)]`} />
  );
}

export default function ArtistLayout() {
  return (
    <div
      id="top"
      className={`${display.variable} ${sans.variable} ${mono.variable} relative min-h-dvh overflow-x-clip bg-[#120d14] font-[family-name:var(--font-meads-sans)] text-[#f3ead9] antialiased selection:bg-[#e9b44c] selection:text-[#120d14] [&_.font-display]:font-[family-name:var(--font-meads-display)] [&_.font-mono]:font-[family-name:var(--font-meads-mono)]`}
    >
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[45] opacity-[0.07] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
      <Nav />
      <Hero />
      <Ticker />
      <Works />
      <SoulPortraits />
      <Wearable />
      <Prints />
      <About />
      <Collectors />
      <Questions />
      <Commission />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#120d14]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <Daub />
          <span className="font-display text-xl leading-none tracking-wide">Maria Meads</span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-white/40 lg:inline">Visionary art</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="text-[15px] text-white/65 transition-colors hover:text-[#e9b44c]">
              {item.label}
            </a>
          ))}
        </nav>
        <CommissionLink
          start={{ type: "Soul portrait" }}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[#e9b44c] px-4 text-sm font-semibold text-[#120d14] transition-colors hover:bg-[#f3ead9]"
        >
          Commission <ArrowRight className="size-4" />
        </CommissionLink>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_15%_10%,rgba(233,180,76,0.14),transparent_70%),radial-gradient(40%_50%_at_90%_90%,rgba(66,200,192,0.12),transparent_70%),radial-gradient(45%_45%_at_60%_40%,rgba(155,111,242,0.1),transparent_70%)]"
      />
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 pb-16 pt-10 sm:px-8 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-stretch lg:gap-16 lg:px-12 lg:pb-14 lg:pt-14">
        <div className="flex flex-col justify-center">
          <Reveal>
            <Kicker>Visionary painter · soul portraits · wearable art</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display mt-6 text-[3.4rem] leading-[0.96] sm:text-[4.6rem] lg:text-[clamp(4rem,5.4vw,6.2rem)]">
              Colour for the
              <br />
              <span className="bg-[linear-gradient(90deg,#e9b44c,#ef6f8b_45%,#9b6ff2_75%,#42c8c0)] bg-clip-text text-transparent">beautiful chaos.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-7 max-w-[32rem] text-[17px] leading-relaxed text-white/65 sm:text-lg">
              {ARTIST.tagline}. Paintings layered glaze by glaze, portraits of the soul rather than the face, and denim you can dance in.
              The canvas on the right is yours: move across it and paint.
            </p>
          </Reveal>
          <Reveal delay={240} className="mt-9 flex flex-wrap items-center gap-3">
            <CommissionLink
              start={{ type: "Soul portrait" }}
              className="group inline-flex h-14 items-center gap-3 rounded-full bg-[#e9b44c] px-7 text-base font-semibold text-[#120d14] transition-colors hover:bg-[#f3ead9]"
            >
              Commission a soul portrait
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </CommissionLink>
            <a
              href="#works"
              className="inline-flex h-14 items-center gap-2 rounded-full border border-white/15 px-6 text-base text-white/85 transition-colors hover:border-[#e9b44c] hover:text-[#e9b44c]"
            >
              See the works <ArrowDownRight className="size-5" />
            </a>
          </Reveal>
          <Reveal delay={300} className="mt-6">
            <OpenStudio className="text-white/55" />
          </Reveal>
          <Reveal delay={360} className="mt-12">
            <dl className="grid max-w-[36rem] grid-cols-2 gap-x-8 gap-y-6 border-t border-white/10 pt-6 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.l} className="flex flex-col gap-1">
                  <dt className="order-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{s.l}</dt>
                  <dd className="font-display order-1 text-4xl leading-none">{s.v}</dd>
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
    <div className={`marquee-viewport overflow-hidden py-3 text-[#120d14] [--marquee-duration:46s] ${SPECTRUM}`}>
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
            {TICKER.map((item) => (
              <li key={item} className="font-display flex items-center whitespace-nowrap text-2xl leading-none">
                <span className="px-6">{item}</span>
                <span aria-hidden className="text-lg">
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

function Works() {
  return (
    <section id="works" className="scroll-mt-16 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          kicker="The works"
          title={
            <>
              Paintings that <em className="text-[#e9b44c]">listen back.</em>
            </>
          }
          aside="Acrylic glazes on canvas and paper, round canvases for commissions, and denim painted by hand. Tap any work for its story."
        />
        <div className="mt-12">
          <WorksGrid />
        </div>
      </div>
    </section>
  );
}

function SoulPortraits() {
  return (
    <section id="portraits" className="scroll-mt-16 border-t border-white/[0.07] bg-[#160f1a] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <SectionHead
              kicker="Soul portraits"
              title={
                <>
                  Not your face.
                  <br />
                  <em className="text-[#e9b44c]">The weather inside it.</em>
                </>
              }
            />
            <Reveal delay={80}>
              <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-white/65">
                A soul portrait starts with a long conversation, not a sitting. The animals that keep appearing in your life, the landscapes
                where you feel most yourself, the chapter you are closing: they become the composition. The likeness is there, but it is
                held by everything around it.
              </p>
            </Reveal>
            <ol className="mt-10 grid gap-6 sm:grid-cols-2">
              {PROCESS.map((p, i) => (
                <Reveal key={p.step} delay={i * 80}>
                  <li className="flex gap-4">
                    <span className="font-display text-3xl leading-none text-[#e9b44c]">{p.step}</span>
                    <div>
                      <h3 className="font-display text-2xl leading-tight">{p.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/55">{p.body}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
          <Reveal delay={120} from="right" className="relative">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
              <Image
                src="/img/layouts/meads-gentle-earthling.jpg"
                alt="Gentle Earthling — a soul portrait in leaves and butterflies"
                fill
                sizes="(min-width: 1024px) 45vw, 92vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 hidden w-[42%] overflow-hidden rounded-xl border-4 border-[#160f1a] shadow-2xl sm:block lg:-left-10">
              <div className="relative aspect-[3/4]">
                <Image src="/img/layouts/meads-detail-face.jpg" alt="Detail of the face in Gentle Earthling" fill sizes="20vw" className="object-cover" />
              </div>
            </div>
            <p className="mt-10 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/40 sm:pl-[46%]">Gentle Earthling · 50 × 70 cm · 2025</p>
          </Reveal>
        </div>
        <Reveal delay={100} className="mt-16">
          <Tiers />
        </Reveal>
      </div>
    </section>
  );
}

function Wearable() {
  const pieces = WORKS.filter((w) => w.series === "Wearable art");
  return (
    <section id="wearable" className="scroll-mt-16 border-t border-white/[0.07] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          kicker="Wearable art"
          title={
            <>
              Paintings that <em className="text-[#e9b44c]">leave the house.</em>
            </>
          }
          aside="One-of-one denim, painted and embellished by hand. Send your own jacket or choose a finished piece."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {pieces.map((w, i) => (
            <Reveal key={w.slug} delay={i * 90}>
              <article className="group relative aspect-[2/3] overflow-hidden rounded-2xl bg-[#1a131e]">
                <Image
                  src={w.image}
                  alt={`${w.title} — ${w.medium}`}
                  fill
                  sizes="(min-width: 640px) 31vw, 92vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120d14]/90 via-transparent to-transparent" />
                <div className="absolute inset-x-5 bottom-5">
                  <h3 className="font-display text-3xl leading-none">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{w.medium}</p>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#e9b44c]">{w.size}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120} className="mt-10 flex flex-wrap items-center gap-4">
          <CommissionLink
            start={{ type: "Hand-painted denim", note: "I'd like to send my own jacket." }}
            className="group inline-flex h-12 items-center gap-3 rounded-full bg-[#e9b44c] px-6 text-sm font-semibold text-[#120d14] transition-colors hover:bg-[#f3ead9]"
          >
            Paint my jacket <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </CommissionLink>
          <a
            href={ARTIST.etsy}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 px-6 text-sm text-white/85 transition-colors hover:border-[#e9b44c] hover:text-[#e9b44c]"
          >
            Finished pieces on Etsy <ArrowUpRight className="size-4" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function Prints() {
  return (
    <section id="prints" className="scroll-mt-16 border-t border-white/[0.07] bg-[#160f1a] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          kicker="Prints & objects"
          title={
            <>
              Take one <em className="text-[#e9b44c]">home today.</em>
            </>
          }
          aside="Signed open-edition prints on 250 gsm archival matte paper, museum-grade inks, shipped worldwide from the Etsy shop."
        />
        <ul className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {PRINTS.map((p, i) => (
            <Reveal key={p.title} delay={(i % 4) * 70}>
              <li>
                <a href={ARTIST.etsy} target="_blank" rel="noopener noreferrer" className="group block">
                  <div className="relative overflow-hidden rounded-xl bg-[#f3ead9] p-[7%] shadow-[0_20px_40px_-24px_rgba(0,0,0,0.9)] transition-transform duration-500 group-hover:-translate-y-1">
                    <div className="relative w-full" style={{ aspectRatio: p.aspect }}>
                      <Image src={p.image} alt={`${p.title} print`} fill sizes="(min-width: 1024px) 22vw, 45vw" className="object-cover" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-xl leading-tight">{p.title}</h3>
                    <span className="font-mono text-xs text-[#e9b44c]">from {usd(p.from)}</span>
                  </div>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">{p.sizes}</p>
                </a>
              </li>
            </Reveal>
          ))}
        </ul>
        <div className="mt-12 grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-stretch">
          {OBJECTS.map((o, i) => (
            <Reveal key={o.title} delay={i * 80} className="h-full">
              <article className="flex h-full items-center gap-4 rounded-2xl border border-white/10 bg-[#1a131e] p-4">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
                  <Image src={o.image} alt={o.title} fill sizes="80px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-lg leading-tight">{o.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-white/50">{o.note}</p>
                  <p className="mt-1.5 font-mono text-[11px] text-[#e9b44c]">from {usd(o.from)}</p>
                </div>
              </article>
            </Reveal>
          ))}
          <Reveal delay={260} className="h-full">
            <a
              href={ARTIST.etsy}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full min-h-28 flex-col items-start justify-between rounded-2xl bg-[#e9b44c] p-5 text-[#120d14] transition-colors hover:bg-[#f3ead9] md:w-56"
            >
              <ShoppingBag className="size-6" />
              <span className="font-display text-2xl leading-none">
                Shop on Etsy <ArrowUpRight className="inline size-5" />
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="scroll-mt-16 border-t border-white/[0.07] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          <Reveal from="left">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
              <Image
                src="/img/layouts/meads-portrait-2.jpg"
                alt="Maria Meads holding the painting Balance in her studio"
                fill
                sizes="(min-width: 1024px) 40vw, 92vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <div className="flex flex-col justify-center">
            <SectionHead
              kicker="About the artist"
              title={
                <>
                  Creatrix, <em className="text-[#e9b44c]">colourist,</em> keeper of symbols.
                </>
              }
            />
            <Reveal delay={80}>
              <div className="mt-8 grid gap-5 text-[17px] leading-relaxed text-white/65">
                <p>
                  Maria paints the way some people pray: slowly, in layers, with music on. Her canvases begin as pencil maps of a feeling and
                  end, twenty or thirty glazes later, as luminous worlds where lions and whales and meditating figures share one breath.
                </p>
                <p>
                  {ARTIST.base}, she works across three threads: visionary canvases from her own inner weather, soul portraits commissioned by
                  people in the middle of a change, and wearable art for the ones who want to carry colour into the night.
                </p>
              </div>
            </Reveal>
            <Reveal delay={140} className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={ARTIST.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-sm text-white/85 transition-colors hover:border-[#e9b44c] hover:text-[#e9b44c]"
              >
                <InstagramIcon className="size-4" /> {ARTIST.handle}
              </a>
              <span className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/45">
                <Palette className="size-4 text-[#e9b44c]" /> Acrylic · ink · denim
              </span>
            </Reveal>
          </div>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STUDIO_GALLERY.map((g, i) => (
            <Reveal key={g.src} delay={i * 80}>
              <figure>
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#1a131e]">
                  <Image src={g.src} alt={g.alt} fill sizes="(min-width: 1024px) 24vw, 46vw" className="object-cover" />
                </div>
                <figcaption className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">{g.note}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Collectors() {
  return (
    <section className="border-t border-white/[0.07] bg-[#160f1a] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          kicker="Collectors"
          title={
            <>
              Where the paintings <em className="text-[#e9b44c]">live now.</em>
            </>
          }
        />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {COLLECTORS.map((c, i) => (
            <Reveal key={c.name} delay={i * 90} className="h-full">
              <figure className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1a131e]">
                <div className="relative aspect-[4/3]">
                  <Image src={c.image} alt={`${c.name} with ${c.piece}`} fill sizes="(min-width: 768px) 31vw, 92vw" className="object-cover" />
                </div>
                <blockquote className="flex flex-1 flex-col p-6">
                  <p className="font-display text-xl leading-snug">“{c.quote}”</p>
                  <figcaption className="mt-auto pt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                    {c.name} · <span className="text-[#e9b44c]">{c.piece}</span>
                  </figcaption>
                </blockquote>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Questions() {
  return (
    <section className="border-t border-white/[0.07] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
        <SectionHead kicker="Questions" title={<>Before you write.</>} />
        <Reveal delay={80}>
          <dl className="divide-y divide-white/10 border-y border-white/10">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg [&::-webkit-details-marker]:hidden">
                  <dt>{f.q}</dt>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/15 text-[#e9b44c] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <dd className="mt-3 max-w-2xl leading-relaxed text-white/60">{f.a}</dd>
              </details>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

function Commission() {
  return (
    <section id="commission" className="scroll-mt-16 px-3 pb-6 sm:px-5">
      <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-2xl border border-white/10 bg-[#1a131e]">
        <div aria-hidden className={`h-2 ${SPECTRUM}`} />
        <div className="grid gap-12 px-6 py-14 sm:px-12 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-16">
          <Reveal>
            <Kicker>Commission</Kicker>
            <h2 className="font-display mt-4 text-[3rem] leading-[0.98] sm:text-6xl lg:text-[4.4rem]">
              Tell me the story.
              <br />
              <em className="text-[#e9b44c]">I&apos;ll find the colours.</em>
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-white/60">
              Soul portraits, custom canvases, your own jacket, a wall. Write a few lines and we start with a call.
            </p>
            <dl className="mt-10 grid gap-5 text-sm">
              <div className="flex items-start gap-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 text-[#e9b44c]">
                  <Mail className="size-4" />
                </span>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Write</dt>
                  <dd className="mt-1 flex flex-col gap-0.5 text-white/80">
                    <a href={ARTIST.emailHref} className="transition-colors hover:text-[#e9b44c]">
                      {ARTIST.email}
                    </a>
                    <a href={ARTIST.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#e9b44c]">
                      {ARTIST.handle}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 text-[#e9b44c]">
                  <MapPin className="size-4" />
                </span>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Studio</dt>
                  <dd className="mt-1 leading-relaxed text-white/80">{ARTIST.base}. Open-studio afternoons on Saturdays.</dd>
                  <dd className="mt-2">
                    <OpenStudio className="text-white/55" />
                  </dd>
                </div>
              </div>
            </dl>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-2xl border border-white/10 bg-[#120d14] p-6 sm:p-8">
              <CommissionForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden pt-16">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-12">
        <div>
          <p className="flex items-center gap-3">
            <Daub />
            <span className="font-display text-xl leading-none tracking-wide">Maria Meads</span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">{ARTIST.tagline}.</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Explore</p>
          <ul className="mt-3 grid gap-1.5 text-sm text-white/75">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="transition-colors hover:text-[#e9b44c]">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Shop</p>
          <div className="mt-3 flex flex-col gap-1.5 text-sm text-white/75">
            <a href={ARTIST.etsy} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-[#e9b44c]">
              <ShoppingBag className="size-4 text-[#e9b44c]" /> Prints, denim & objects on Etsy
            </a>
            <a href={ARTIST.emailHref} className="inline-flex items-center gap-2 transition-colors hover:text-[#e9b44c]">
              <Mail className="size-4 text-[#e9b44c]" /> {ARTIST.email}
            </a>
          </div>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Follow</p>
          <div className="mt-3 flex items-center gap-3">
            <a
              href={ARTIST.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid size-10 place-items-center rounded-full border border-white/10 text-white/75 transition-colors hover:border-[#e9b44c] hover:text-[#e9b44c]"
            >
              <InstagramIcon className="size-4" />
            </a>
            <span className="font-mono text-[11px] text-white/45">{ARTIST.handle}</span>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[1440px] flex-col gap-2 px-5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/35 sm:flex-row sm:justify-between sm:px-8 lg:px-12">
        <span>© {new Date().getFullYear()} Maria Meads Art — preview site; prices and schedule are placeholders</span>
        <span>All artwork © Maria Meads</span>
      </div>
      <div aria-hidden className={`mt-8 h-2 ${SPECTRUM}`} />
      <p
        aria-hidden
        className="font-display -mb-[0.2em] select-none bg-gradient-to-b from-[#e9b44c] via-[#e9b44c]/35 to-transparent bg-clip-text text-center text-[20vw] leading-[0.9] text-transparent"
      >
        Meads
      </p>
    </footer>
  );
}

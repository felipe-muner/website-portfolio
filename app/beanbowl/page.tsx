import type { Metadata } from "next";
import Image from "next/image";
import { Bricolage_Grotesque, Caveat, Young_Serif } from "next/font/google";
import { ArrowDownRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { BowlBuilder } from "@/components/layouts/beanbowl/bowl-builder";
import { CafeMenu } from "@/components/layouts/beanbowl/cafe-menu";
import { HeroCup } from "@/components/layouts/beanbowl/hero-cup";
import { CONTACT } from "@/lib/layouts/content";
import { HOURS, ORIGINS } from "@/lib/layouts/beanbowl";

export const metadata: Metadata = {
  title: "Bean & Bowl — All-day café",
  robots: { index: false },
};

const display = Young_Serif({ subsets: ["latin"], weight: "400", variable: "--font-bb-display" });
const sans = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bb-sans" });
const hand = Caveat({ subsets: ["latin"], variable: "--font-bb-hand" });

const NAV = [
  { href: "#coffee", label: "Coffee" },
  { href: "#bowls", label: "Bowls" },
  { href: "#menu", label: "Menu" },
  { href: "#visit", label: "Visit" },
] as const;

const BAR_FACTS = [
  { v: "Tuesdays", l: "Roast day — beans never older than a week" },
  { v: "18 h", l: "Cold brew, steeped overnight" },
  { v: "Free", l: "Oat, almond or coconut milk" },
] as const;

const GALLERY = [
  { src: "/img/layouts/cafe-latte.jpg", note: "two flat whites, no rush" },
  { src: "/img/layouts/food-salad.jpg", note: "lunch, the colourful way" },
  { src: "/img/layouts/cafe-pastries.jpg", note: "out of the oven at seven" },
  { src: "/img/layouts/food-pancakes.jpg", note: "weekend stacks" },
] as const;

/* Cream sections: dark espresso ink on oat. */
const CREAM = "bg-[#f5ecdf] text-[#2a1a10]";

function Kicker({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`font-hand text-[1.75rem] leading-none ${light ? "text-[#b5562b]" : "text-[#e0a86a]"}`}>{children}</p>
  );
}

function BeanMark() {
  return (
    <span aria-hidden className="grid size-8 place-items-center rounded-full bg-[#e0a86a]">
      <span className="h-4 w-2.5 rounded-[50%] bg-[#3a2114] shadow-[inset_1px_0_0_#1a110b]" />
    </span>
  );
}

export default function BeanBowlLayout() {
  return (
    <div
      className={`${display.variable} ${sans.variable} ${hand.variable} min-h-dvh overflow-x-clip bg-[#1a110b] font-[family-name:var(--font-bb-sans)] text-[#f3e6d3] antialiased selection:bg-[#e0a86a] selection:text-[#1a110b] [&_.font-display]:font-[family-name:var(--font-bb-display)] [&_.font-hand]:font-[family-name:var(--font-bb-hand)]`}
    >
      <Nav />
      <Hero />
      <Bar />
      <Bowls />
      <Menu />
      <Gallery />
      <Visit />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 h-0">
      <div className="px-3 pt-3 sm:px-5 sm:pt-4">
        <nav className="mx-auto flex max-w-[1440px] items-center justify-between rounded-full border border-[#f3e6d3]/10 bg-[#1a110b]/75 py-1.5 pl-2 pr-1.5 backdrop-blur-xl sm:pl-3">
          <a href="#top" className="flex items-center gap-2.5">
            <BeanMark />
            <span className="font-display text-xl leading-none">Bean &amp; Bowl</span>
          </a>
          <div className="hidden items-center md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-[15px] text-[#f3e6d3]/65 transition-colors hover:bg-[#f3e6d3]/[0.07] hover:text-[#f3e6d3]"
              >
                {item.label}
              </a>
            ))}
          </div>
          <a
            href="#bowls"
            className="inline-flex h-10 items-center rounded-full bg-[#f3e6d3] px-5 text-[15px] font-semibold text-[#1a110b] transition-colors hover:bg-[#e0a86a]"
          >
            Order ahead
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative isolate flex flex-col overflow-hidden lg:min-h-[max(100svh,780px)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(40%_55%_at_70%_35%,rgba(224,168,106,0.18),transparent_70%),radial-gradient(60%_60%_at_10%_100%,rgba(120,60,25,0.25),transparent_70%)]"
      />
      <HeroCup />
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 pb-16 sm:px-8 lg:px-12 lg:pb-14 lg:pt-28">
        <div className="max-w-[40rem] lg:my-auto lg:max-w-[46%]">
          <Reveal>
            <Kicker>an all-day island café ~</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display mt-4 text-[3.6rem] leading-[0.95] tracking-[-0.02em] sm:text-7xl lg:text-[clamp(4.4rem,6.6vw,7.2rem)]">
              Slow coffee.
              <br />
              <span className="text-[#e0a86a]">Loud bowls.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-7 max-w-[32rem] text-lg leading-relaxed text-[#f3e6d3]/70">
              Single-origin coffee roasted on the island and smoothie bowls piled high — all day, barefoot
              welcome.
            </p>
          </Reveal>
          <Reveal delay={240} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#bowls"
              className="inline-flex h-[52px] items-center rounded-full bg-[#f3e6d3] px-7 text-[16px] font-semibold text-[#1a110b] transition-colors hover:bg-[#e0a86a]"
            >
              Build your bowl
            </a>
            <a
              href="#menu"
              className="inline-flex h-[52px] items-center gap-2 rounded-full border border-[#f3e6d3]/25 px-7 text-[16px] text-[#f3e6d3]/85 transition-colors hover:border-[#f3e6d3]/60 hover:text-[#f3e6d3]"
            >
              See the menu <ArrowDownRight className="size-4" />
            </a>
          </Reveal>
          <Reveal delay={320} className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-[#f3e6d3]/10 pt-6 text-sm text-[#f3e6d3]/55">
            <span>
              {HOURS.days} {HOURS.open}–{HOURS.close}
            </span>
            <span>Roasted on the island</span>
            <span>{CONTACT.area}</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Bar() {
  return (
    <section id="coffee" className="scroll-mt-20 border-t border-[#f3e6d3]/[0.07] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <Reveal className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Kicker>on the bar this week</Kicker>
            <h2 className="font-display mt-3 max-w-3xl text-balance text-5xl leading-[1] sm:text-7xl">
              Three origins. <span className="text-[#e0a86a]">One small roaster.</span>
            </h2>
          </div>
          <p className="max-w-sm leading-relaxed text-[#f3e6d3]/60">
            We roast in small batches every Tuesday and pull every shot to order. Ask for a taste of
            whatever&apos;s on pour-over.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="relative min-h-[420px] overflow-hidden rounded-[28px]">
            <Image
              src="/img/layouts/cafe-latte.jpg"
              alt="Two flat whites with latte art"
              fill
              sizes="(min-width: 1024px) 42vw, 92vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a110b]/80 via-transparent to-transparent" />
            <p className="font-hand absolute bottom-5 left-6 text-3xl text-[#f3e6d3]">poured to order, never rushed</p>
          </Reveal>
          <div className="flex flex-col gap-4">
            {ORIGINS.map((o, i) => (
              <Reveal key={o.name} delay={i * 90}>
                <article className="rounded-[24px] border border-[#f3e6d3]/10 bg-[#f3e6d3]/[0.03] p-6 transition-colors hover:border-[#e0a86a]/40">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="font-display text-3xl">{o.name}</h3>
                    <span className="text-sm text-[#f3e6d3]/50">
                      {o.region} · {o.process} · {o.roast} roast
                    </span>
                  </div>
                  <p className="mt-4 flex flex-wrap gap-2">
                    {o.notes.map((n) => (
                      <span key={n} className="rounded-full bg-[#e0a86a]/12 px-3 py-1 text-sm text-[#e0a86a]">
                        {n}
                      </span>
                    ))}
                  </p>
                </article>
              </Reveal>
            ))}
            <Reveal delay={300} className="grid gap-4 sm:grid-cols-3">
              {BAR_FACTS.map((f) => (
                <div key={f.v} className="rounded-[20px] border border-[#f3e6d3]/10 p-5">
                  <p className="font-display text-3xl text-[#e0a86a]">{f.v}</p>
                  <p className="mt-2 text-sm leading-snug text-[#f3e6d3]/55">{f.l}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Bowls() {
  return (
    <section id="bowls" className={`scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28 lg:px-12 ${CREAM}`}>
      <div className="mx-auto max-w-[1440px]">
        <Reveal className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Kicker light>make it yours ~</Kicker>
            <h2 className="font-display mt-3 text-5xl leading-[1] sm:text-7xl">
              Build your <span className="text-[#b5562b]">bowl.</span>
            </h2>
          </div>
          <p className="max-w-sm leading-relaxed text-[#2a1a10]/60">
            Pick a base, pile it high. Everything is blended to order — your bowl is ready in about five
            minutes.
          </p>
        </Reveal>
        <div className="mt-12">
          <BowlBuilder />
        </div>
      </div>
    </section>
  );
}

function Menu() {
  return (
    <section id="menu" className={`scroll-mt-20 border-t border-[#2a1a10]/10 px-5 py-20 sm:px-8 sm:py-28 lg:px-12 ${CREAM}`}>
      <div className="mx-auto max-w-[1440px]">
        <Reveal className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Kicker light>all day, every day</Kicker>
            <h2 className="font-display mt-3 text-5xl leading-[1] sm:text-7xl">The menu.</h2>
          </div>
          <p className="max-w-sm leading-relaxed text-[#2a1a10]/60">
            Breakfast all day, lunch from eleven. Prices in Thai Baht; tell us about allergies and
            we&apos;ll sort you out.
          </p>
        </Reveal>
        <CafeMenu />
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto grid max-w-[1440px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {GALLERY.map((g, i) => (
          <Reveal key={g.src} delay={i * 80}>
            <figure className={`group relative aspect-[4/5] overflow-hidden rounded-[24px] ${i % 2 ? "lg:mt-10" : ""}`}>
              <Image
                src={g.src}
                alt={g.note}
                fill
                sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 92vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a110b]/75 via-transparent to-transparent" />
              <figcaption className="font-hand absolute bottom-4 left-5 text-2xl text-[#f3e6d3]">{g.note}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Visit() {
  return (
    <section id="visit" className="scroll-mt-20 border-t border-[#f3e6d3]/[0.07] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <Reveal>
          <Kicker>come say hi ~</Kicker>
          <h2 className="font-display mt-3 text-5xl leading-[1] sm:text-7xl">
            Find the table <span className="text-[#e0a86a]">by the window.</span>
          </h2>
          <dl className="mt-10 grid gap-6 text-[15px]">
            {[
              { icon: Clock, label: "Hours", value: `${HOURS.days} ${HOURS.open}–${HOURS.close} · ${HOURS.kitchen}` },
              { icon: MapPin, label: "Find us", value: CONTACT.address },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e0a86a]/12 text-[#e0a86a]">
                  <Icon className="size-4" />
                </span>
                <div>
                  <dt className="text-xs uppercase tracking-[0.18em] text-[#f3e6d3]/45">{label}</dt>
                  <dd className="mt-1 leading-relaxed text-[#f3e6d3]/85">{value}</dd>
                </div>
              </div>
            ))}
            <div className="flex items-start gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e0a86a]/12 text-[#e0a86a]">
                <Phone className="size-4" />
              </span>
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-[#f3e6d3]/45">Say hello</dt>
                <dd className="mt-1 flex flex-col gap-0.5 text-[#f3e6d3]/85">
                  <a href={CONTACT.phoneHref} className="transition-colors hover:text-[#e0a86a]">
                    {CONTACT.phone}
                  </a>
                  <a href={CONTACT.emailHref} className="transition-colors hover:text-[#e0a86a]">
                    {CONTACT.email}
                  </a>
                </dd>
              </div>
            </div>
          </dl>
        </Reveal>
        <Reveal delay={120} className="relative aspect-[5/4] overflow-hidden rounded-[28px]">
          <Image
            src="/img/layouts/cafe-interior-plants.jpg"
            alt="The café, plants and long tables"
            fill
            sizes="(min-width: 1024px) 46vw, 92vw"
            className="object-cover"
          />
          <p className="font-hand absolute right-5 top-5 rotate-3 rounded-full bg-[#f3e6d3] px-4 py-1 text-2xl text-[#2a1a10]">
            dogs welcome ♥
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden px-5 pt-16 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 border-t border-[#f3e6d3]/[0.07] pt-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <BeanMark />
          <span className="text-sm text-[#f3e6d3]/50">
            © {new Date().getFullYear()}{" "}Bean &amp; Bowl — fictional demo · Local business
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="grid size-10 place-items-center rounded-full border border-[#f3e6d3]/15 text-[#f3e6d3]/75 transition-colors hover:border-[#e0a86a] hover:text-[#e0a86a]"
          >
            <InstagramIcon className="size-4" />
          </a>
          <a
            href={CONTACT.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="grid size-10 place-items-center rounded-full border border-[#f3e6d3]/15 text-[#f3e6d3]/75 transition-colors hover:border-[#e0a86a] hover:text-[#e0a86a]"
          >
            <FacebookIcon className="size-4" />
          </a>
          <a
            href={CONTACT.emailHref}
            aria-label="Email"
            className="grid size-10 place-items-center rounded-full border border-[#f3e6d3]/15 text-[#f3e6d3]/75 transition-colors hover:border-[#e0a86a] hover:text-[#e0a86a]"
          >
            <Mail className="size-4" />
          </a>
        </div>
      </div>
      <p
        aria-hidden
        className="font-display -mb-[0.2em] mt-10 select-none whitespace-nowrap bg-gradient-to-b from-[#e0a86a] via-[#e0a86a]/45 to-transparent bg-clip-text text-center text-[13.5vw] leading-[1] tracking-[-0.03em] text-transparent"
      >
        Bean &amp; Bowl
      </p>
    </footer>
  );
}

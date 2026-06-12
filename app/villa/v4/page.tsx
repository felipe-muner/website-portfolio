import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Gilda_Display, Mulish } from "next/font/google";
import { MapPin, Moon, Sparkles } from "lucide-react";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { BookingCalendar } from "@/components/layouts/BookingCalendar";
import { CONTACT } from "@/lib/layouts/content";
import { VILLAS, VILLA_AMENITIES, VILLA_REVIEWS } from "@/lib/layouts/villas";

export const metadata: Metadata = {
  title: "Villa Layout 4 — Selva",
  robots: { index: false },
};

const display = Gilda_Display({ subsets: ["latin"], weight: "400" });
const body = Mulish({ subsets: ["latin"], weight: ["300", "400", "700"] });

const JUNGLE = "#101a13";
const MOSS = "#1a2a1f";
const BRASS = "#b4915a";
const FOG = "#d8dcd3";

export default function SelvaLayout() {
  return (
    <div className={`${body.className}`} style={{ backgroundColor: JUNGLE, color: FOG }}>
      <Nav />
      <Hero />
      <Promise />
      <Villas />
      <Booking />
      <Nights />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-24 max-w-6xl items-center justify-between px-5 md:px-10">
        <Link href="/" className={`${display.className} text-2xl tracking-[0.2em]`} style={{ color: BRASS }}>
          SELVA
        </Link>
        <nav className="hidden gap-10 text-sm uppercase tracking-[0.3em] md:flex" style={{ color: `${FOG}b3` }}>
          <a href="#villas" className="hover:text-[#b4915a]">Villas</a>
          <a href="#stay" className="hover:text-[#b4915a]">Reserve</a>
          <a href="#nights" className="hover:text-[#b4915a]">Nights</a>
        </nav>
        <a
          href="#stay"
          className="border px-7 py-3 text-sm uppercase tracking-[0.25em] transition-colors hover:bg-[#b4915a] hover:text-[#101a13]"
          style={{ borderColor: BRASS, color: BRASS }}
        >
          Reserve
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-dvh items-end overflow-hidden">
      <Image
        src="/img/layouts/villa-pool-night.jpg"
        alt="The Selva pool glowing after dark"
        fill
        priority
        sizes="100vw"
        className="animate-landing-kenburns object-cover opacity-75"
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(16,26,19,0.55) 0%, rgba(16,26,19,0.1) 45%, rgba(16,26,19,0.95) 100%)" }} />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-24 md:px-10">
        <Reveal>
          <p className="flex items-center gap-3 text-sm uppercase tracking-[0.4em]" style={{ color: BRASS }}>
            <Moon className="size-4" />
            Deep-jungle pool villas
          </p>
        </Reveal>
        <Reveal delay={140}>
          <h1 className={`${display.className} mt-6 max-w-3xl text-6xl leading-[1.05] md:text-8xl`}>
            The jungle turns
            <em style={{ color: BRASS }}> down the lights.</em>
          </h1>
        </Reveal>
        <Reveal delay={280}>
          <div className="mt-9 flex flex-wrap items-center gap-6">
            <a
              href="#villas"
              className="px-8 py-4 text-sm font-bold uppercase tracking-[0.25em] transition-opacity hover:opacity-90"
              style={{ backgroundColor: BRASS, color: JUNGLE }}
            >
              Explore the villas
            </a>
            <p className="max-w-sm text-base font-light leading-relaxed" style={{ color: `${FOG}cc` }}>
              Four villas under the canopy — cicadas for an alarm clock,
              brass lanterns for streetlights.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Promise() {
  return (
    <section className="py-24 md:py-28" style={{ backgroundColor: MOSS }}>
      <div className="mx-auto max-w-3xl px-5 text-center">
        <Reveal>
          <Sparkles className="mx-auto size-6" style={{ color: BRASS }} />
          <p className={`${display.className} mt-6 text-3xl leading-snug md:text-4xl`}>
            No televisions. No neighbours.
            <em style={{ color: BRASS }}> No reason to leave the water.</em>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Villas() {
  return (
    <section id="villas" className="mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <h2 className={`${display.className} text-5xl md:text-6xl`}>
          Choose your <em style={{ color: BRASS }}>canopy</em>
        </h2>
      </Reveal>
      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {VILLAS.map((villa, index) => (
          <Reveal key={villa.slug} delay={index * 90} className="h-full">
            <article className="group relative flex h-full min-h-[28rem] flex-col justify-end overflow-hidden">
              <Image
                src={villa.image}
                alt={villa.name}
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover brightness-[0.6] transition-all duration-700 group-hover:scale-105 group-hover:brightness-75"
              />
              <div className="relative border-t p-7" style={{ borderColor: `${BRASS}66`, background: "linear-gradient(180deg, transparent, rgba(16,26,19,0.92) 35%)" }}>
                <p className="text-sm uppercase tracking-[0.3em]" style={{ color: BRASS }}>
                  {villa.tagline}
                </p>
                <h3 className={`${display.className} mt-2 text-4xl`}>{villa.name}</h3>
                <p className="mt-3 max-w-md font-light leading-relaxed" style={{ color: `${FOG}cc` }}>
                  {villa.description}
                </p>
                <p className="mt-4 text-base font-bold" style={{ color: BRASS }}>
                  ฿{villa.pricePerNight.toLocaleString()} / night
                  <span className="ml-3 font-normal" style={{ color: `${FOG}99` }}>
                    {villa.bedrooms} BR · sleeps {villa.guests}
                  </span>
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Booking() {
  return (
    <section id="stay" className="border-y py-24 md:py-32" style={{ borderColor: `${BRASS}33`, backgroundColor: MOSS }}>
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-center text-5xl md:text-6xl`}>
            Reserve your <em style={{ color: BRASS }}>nights</em>
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <div className="mt-12">
            <BookingCalendar
              displayClass={display.className}
              theme={{
                accent: BRASS,
                accentText: JUNGLE,
                text: FOG,
                muted: `${FOG}99`,
                surface: JUNGLE,
                border: `${BRASS}40`,
                radius: "0px",
              }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Nights() {
  return (
    <section id="nights" className="mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-28">
      <div className="grid gap-12 lg:grid-cols-2">
        <Reveal>
          <h2 className={`${display.className} text-4xl md:text-5xl`}>
            Kept for you, <em style={{ color: BRASS }}>nightly</em>
          </h2>
          <div className="mt-10 space-y-7">
            {VILLA_AMENITIES.slice(0, 4).map((item) => (
              <div key={item.title} className="border-l pl-5" style={{ borderColor: `${BRASS}66` }}>
                <h3 className={`${display.className} text-2xl`} style={{ color: BRASS }}>
                  {item.title}
                </h3>
                <p className="mt-1.5 font-light leading-relaxed" style={{ color: `${FOG}b3` }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal from="right" delay={120}>
          <figure>
            <div className="overflow-hidden">
              <Image
                src="/img/layouts/villa-bedroom-luxe.jpg"
                alt="A villa bedroom at lantern hour"
                width={860}
                height={1000}
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="aspect-[5/6] w-full object-cover brightness-90"
              />
            </div>
            <figcaption className={`${display.className} mt-6 text-2xl italic`} style={{ color: `${FOG}cc` }}>
              &ldquo;{VILLA_REVIEWS[2].quote}&rdquo;
              <span className="mt-2 block text-sm not-italic uppercase tracking-[0.3em]" style={{ color: BRASS }}>
                — {VILLA_REVIEWS[2].author}, {VILLA_REVIEWS[2].origin}
              </span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t py-16" style={{ borderColor: `${BRASS}33` }}>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-5 text-center md:px-10">
        <p className={`${display.className} text-3xl tracking-[0.2em]`} style={{ color: BRASS }}>
          SELVA
        </p>
        <p className="flex items-center gap-2 text-base" style={{ color: `${FOG}b3` }}>
          <MapPin className="size-4" style={{ color: BRASS }} />
          {CONTACT.address}
        </p>
        <p className="text-base" style={{ color: `${FOG}b3` }}>
          <a href={CONTACT.phoneHref} className="hover:text-white">{CONTACT.phone}</a> ·{" "}
          <a href={CONTACT.emailHref} className="hover:text-white">{CONTACT.email}</a>
        </p>
        <p className="text-sm uppercase tracking-[0.3em]" style={{ color: `${FOG}66` }}>
          © {new Date().getFullYear()} Selva Villas — fictional demo · Villa layout 4
        </p>
      </div>
    </footer>
  );
}

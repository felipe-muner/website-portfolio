import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Quicksand, Shrikhand } from "next/font/google";
import { MapPin, Plane, Shell, Sun } from "lucide-react";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { BookingCalendar } from "@/components/layouts/BookingCalendar";
import { CONTACT } from "@/lib/layouts/content";
import { VILLAS, VILLA_REVIEWS } from "@/lib/layouts/villas";

export const metadata: Metadata = {
  title: "Villa Layout 5 — Postcard",
  robots: { index: false },
};

const display = Shrikhand({ subsets: ["latin"], weight: "400" });
const body = Quicksand({ subsets: ["latin"], weight: ["400", "500", "700"] });

const SKYBLUE = "#eaf6fb";
const OCEAN = "#1879a0";
const CORAL = "#ff6b5e";
const SUNNY = "#ffb84d";
const INKD = "#1e3a47";

export default function PostcardLayout() {
  return (
    <div className={`${body.className}`} style={{ backgroundColor: SKYBLUE, color: INKD }}>
      <Nav />
      <Hero />
      <Stamps />
      <Villas />
      <Booking />
      <Postcards />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b-4 border-dashed bg-[#eaf6fb]/95 backdrop-blur" style={{ borderColor: `${OCEAN}40` }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-10">
        <Link href="/" className={`${display.className} text-xl`} style={{ color: CORAL }}>
          Casa Coco
        </Link>
        <nav className="hidden gap-8 text-sm font-bold md:flex" style={{ color: OCEAN }}>
          <a href="#villas" className="hover:text-[#ff6b5e]">The casas</a>
          <a href="#book" className="hover:text-[#ff6b5e]">Book a stay</a>
          <a href="#postcards" className="hover:text-[#ff6b5e]">Postcards</a>
        </nav>
        <a
          href="#book"
          className="rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-md transition-transform hover:-rotate-2 hover:scale-105"
          style={{ backgroundColor: CORAL }}
        >
          Pack your bags!
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:px-10 md:py-24 lg:grid-cols-2">
        <div>
          <Reveal>
            <p
              className="inline-block -rotate-2 rounded-full px-5 py-2 text-sm font-bold uppercase tracking-[0.2em] text-white"
              style={{ backgroundColor: SUNNY }}
            >
              ☀ 365 days of summer
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className={`${display.className} mt-6 text-6xl leading-[1.05] md:text-8xl`} style={{ color: OCEAN }}>
              Wish you
              <br />
              were <span style={{ color: CORAL }}>here!</span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-6 max-w-md text-lg font-medium leading-relaxed" style={{ color: `${INKD}cc` }}>
              Casa Coco is four sunny little pool villas a flip-flop walk from
              the beach. Mango shakes on arrival, sandy floors forgiven.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#villas"
                className="rounded-full px-8 py-4 text-base font-bold text-white shadow-lg transition-transform hover:scale-105"
                style={{ backgroundColor: OCEAN }}
              >
                Meet the casas
              </a>
              <a
                href="#book"
                className="rounded-full border-4 border-dashed px-8 py-4 text-base font-bold transition-colors hover:bg-white"
                style={{ borderColor: CORAL, color: CORAL }}
              >
                Check the dates
              </a>
            </div>
          </Reveal>
        </div>
        <Reveal from="right" delay={150}>
          <div className="relative mx-auto max-w-md">
            <div className="rotate-2 rounded-xl bg-white p-3 pb-14 shadow-2xl shadow-[#1879a0]/25 transition-transform hover:rotate-1">
              <Image
                src="/img/layouts/beach-turquoise.jpg"
                alt="The turquoise water in front of Casa Coco"
                width={760}
                height={560}
                priority
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="aspect-[4/3] w-full rounded-md object-cover"
              />
              <p className={`${display.className} mt-4 text-center text-xl`} style={{ color: OCEAN }}>
                greetings from the island ✈
              </p>
            </div>
            <span
              className="absolute -right-4 -top-4 flex size-20 rotate-12 items-center justify-center rounded-full border-4 border-dashed bg-white text-center text-xs font-bold uppercase leading-tight"
              style={{ borderColor: CORAL, color: CORAL }}
            >
              Air
              <br />
              mail
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Stamps() {
  const stamps = [
    { icon: Sun, label: "Pool with every casa" },
    { icon: Shell, label: "Beach in 4 minutes" },
    { icon: Plane, label: "Pier pick-up included" },
  ];
  return (
    <section className="border-y-4 border-dashed bg-white py-10" style={{ borderColor: `${OCEAN}40` }}>
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-14 gap-y-6 px-5">
        {stamps.map((s, i) => (
          <Reveal key={s.label} delay={i * 90}>
            <p className="flex items-center gap-3 text-base font-bold" style={{ color: OCEAN }}>
              <span className="flex size-12 items-center justify-center rounded-full text-white" style={{ backgroundColor: [CORAL, SUNNY, OCEAN][i % 3] }}>
                <s.icon className="size-6" />
              </span>
              {s.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Villas() {
  return (
    <section id="villas" className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-28">
      <Reveal>
        <h2 className={`${display.className} text-center text-4xl md:text-6xl`} style={{ color: OCEAN }}>
          Pick your casa
        </h2>
        <p className="mt-3 text-center text-base font-medium" style={{ color: `${INKD}b3` }}>
          Four casas, four colours of happy.
        </p>
      </Reveal>
      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {VILLAS.map((villa, index) => (
          <Reveal key={villa.slug} delay={index * 80} className="h-full">
            <article
              className={`flex h-full flex-col rounded-2xl bg-white p-3 pb-5 shadow-lg transition-transform hover:-translate-y-2 ${
                index % 2 ? "rotate-1" : "-rotate-1"
              }`}
            >
              <div className="relative aspect-square overflow-hidden rounded-xl">
                <Image
                  src={villa.image}
                  alt={villa.name}
                  fill
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover"
                />
                <span
                  className="absolute left-3 top-3 rounded-full px-3 py-1 text-sm font-bold text-white"
                  style={{ backgroundColor: [CORAL, OCEAN, SUNNY, "#62b48f"][index % 4] }}
                >
                  ฿{villa.pricePerNight.toLocaleString()}/nt
                </span>
              </div>
              <h3 className={`${display.className} mt-4 text-center text-2xl`} style={{ color: CORAL }}>
                {villa.name}
              </h3>
              <p className="mt-1 text-center text-sm font-bold uppercase tracking-[0.15em]" style={{ color: `${INKD}80` }}>
                {villa.bedrooms} bed · sleeps {villa.guests}
              </p>
              <p className="mt-3 flex-1 text-center text-base leading-relaxed" style={{ color: `${INKD}b3` }}>
                {villa.tagline} — {villa.features[0].toLowerCase()} &amp; {villa.features[1].toLowerCase()}.
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Booking() {
  return (
    <section id="book" className="py-20 md:py-28" style={{ backgroundColor: OCEAN }}>
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-center text-4xl text-white md:text-5xl`}>
            When are you coming?
          </h2>
          <p className="mt-3 text-center text-base font-medium text-white/85">
            Tap a casa, then your dates — we&rsquo;ll keep the mangoes cold.
          </p>
        </Reveal>
        <Reveal delay={140}>
          <div className="mt-12">
            <BookingCalendar
              displayClass={display.className}
              theme={{
                accent: CORAL,
                accentText: "#ffffff",
                text: INKD,
                muted: `${INKD}99`,
                surface: "#ffffff",
                border: `${OCEAN}33`,
                radius: "1rem",
              }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Postcards() {
  return (
    <section id="postcards" className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-28">
      <Reveal>
        <h2 className={`${display.className} text-center text-4xl md:text-5xl`} style={{ color: OCEAN }}>
          Postcards from guests
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {VILLA_REVIEWS.map((review, index) => (
          <Reveal key={review.author} delay={index * 90}>
            <figure
              className={`flex h-full flex-col rounded-xl border-4 border-dashed bg-white p-7 ${
                index % 2 ? "-rotate-1" : "rotate-1"
              }`}
              style={{ borderColor: [CORAL, SUNNY, OCEAN][index % 3] }}
            >
              <blockquote className="flex-1 text-lg font-medium leading-relaxed" style={{ color: `${INKD}cc` }}>
                &ldquo;{review.quote}&rdquo;
              </blockquote>
              <figcaption className={`${display.className} mt-5 text-lg`} style={{ color: [CORAL, SUNNY, OCEAN][index % 3] }}>
                — {review.author}, {review.origin}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative pt-6 text-white" style={{ backgroundColor: CORAL }}>
      <svg viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden className="absolute -top-px left-0 h-10 w-full rotate-180">
        <path d="M0 24 C240 48 480 0 720 18 C960 36 1200 6 1440 28 L1440 48 L0 48 Z" fill={CORAL} />
      </svg>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-14 text-center md:px-10">
        <p className={`${display.className} text-3xl`}>Casa Coco</p>
        <p className="flex items-center justify-center gap-2 text-base font-medium text-white/90">
          <MapPin className="size-4" />
          {CONTACT.address}
        </p>
        <p className="text-base font-medium text-white/90">
          <a href={CONTACT.phoneHref} className="underline-offset-4 hover:underline">{CONTACT.phone}</a> ·{" "}
          <a href={CONTACT.emailHref} className="underline-offset-4 hover:underline">{CONTACT.email}</a>
        </p>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/70">
          © {new Date().getFullYear()} Casa Coco — fictional demo · Villa layout 5
        </p>
      </div>
    </footer>
  );
}

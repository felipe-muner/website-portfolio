import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Anton, Archivo } from "next/font/google";
import { addDays, format, startOfWeek } from "date-fns";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { SlotBooking, type SlotOption } from "@/components/layouts/SlotBooking";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Business Layout — Sundown Beach Club",
  robots: { index: false },
};

const display = Anton({ subsets: ["latin"], weight: "400" });
const body = Archivo({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

/* The sunset ramp — every section background is a step along this scale. */
const NOON = "#7EC5E8";
const HAZE = "#F2E9D3";
const GOLD = "#F5C55E";
const EMBER = "#EE7A3F";
const MAGENTA = "#C43A6E";
const DUSK = "#6E2A68";
const NIGHT = "#1A0E2E";
const BLACKOUT = "#0B0616";

const INK = "#221031";
const CREAM = "#F7EAD8";

const TICKER_ITEMS = [
  "Golden hour from 17:40 tonight",
  "No cover before sunset",
  "Barefoot always",
  "Kitchen till 22:30",
  "Full Moon Warmup every Saturday",
  "Daybeds from ฿2,000",
] as const;

interface LineupRow {
  offset: number; // days from Monday
  day: string;
  act: string;
  genre: string;
  time: string;
  image: string;
}

const LINEUP: readonly LineupRow[] = [
  { offset: 2, day: "Wed", act: "Vinyl on the Sand", genre: "Dusty disco & rare groove — all 45s", time: "16:00 — 22:00", image: "/img/layouts/beachclub-4.jpg" },
  { offset: 3, day: "Thu", act: "Low Tide Live", genre: "Acoustic trio on the tideline", time: "18:00 — 21:00", image: "/img/layouts/beachclub-3.jpg" },
  { offset: 4, day: "Fri", act: "Golden Hour Sessions", genre: "House & balearic — resident DJs", time: "17:00 — 02:00", image: "/img/layouts/beachclub-1.jpg" },
  { offset: 5, day: "Sat", act: "Full Moon Warmup", genre: "Guest selectors till late", time: "17:00 — 02:00", image: "/img/layouts/beachclub-5.jpg" },
  { offset: 6, day: "Sun", act: "Sundown Classics", genre: "Sunset band, then slow disco", time: "16:00 — 24:00", image: "/img/layouts/beachclub-2.jpg" },
];

const STRIP: readonly { src: string; alt: string }[] = [
  { src: "/img/layouts/beachclub-1.jpg", alt: "Golden hour over the beachfront daybeds" },
  { src: "/img/layouts/beachclub-2.jpg", alt: "Cabanas along the infinity pool edge" },
  { src: "/img/layouts/beachclub-3.jpg", alt: "Dinner tables on the sunset deck" },
  { src: "/img/layouts/beachclub-4.jpg", alt: "The lounge bar lit up after dark" },
  { src: "/img/layouts/beachclub-5.jpg", alt: "Dancers on the sand under string lights" },
];

const ZONES: readonly SlotOption[] = [
  { slug: "daybed", name: "Beachfront daybed", sub: "Toes-in-sand, shaded, your own drinks service.", price: 2000 },
  { slug: "poolside", name: "Poolside cabana", sub: "Private cabana over the infinity edge for up to 6.", price: 4000 },
  { slug: "sunsetdeck", name: "Sunset deck table", sub: "Front-row to the sundown, dinner & cocktails.", price: 3000 },
  { slug: "loungebar", name: "Lounge bar table", sub: "By the DJ booth once the sun's down.", price: 1500 },
];

export default function BeachClubLayout() {
  return (
    <div className={body.className} style={{ backgroundColor: BLACKOUT, color: INK }}>
      <style>{`
        @keyframes sundownx-sunset {
          from { transform: translateY(0); }
          to { transform: translateY(28px); }
        }
        @keyframes sundownx-flicker {
          0%, 100% { opacity: 1; }
          92% { opacity: 1; }
          93% { opacity: 0.35; }
          94% { opacity: 1; }
          96% { opacity: 0.5; }
          97% { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sundownx-sun, .sundownx-neon { animation: none !important; }
          .sundownx-ticker { animation-play-state: paused !important; }
        }
      `}</style>
      <Masthead />
      <Hero />
      <Ticker />
      <Lineup />
      <Filmstrip />
      <Booking />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

/* Static poster masthead — a printed top edge, not a floating bar. */
function Masthead() {
  return (
    <header style={{ backgroundColor: NOON, borderBottom: `2px solid ${INK}` }}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-5 py-4 md:px-10">
        <Link href="/" className={`${display.className} text-lg uppercase tracking-wide`}>
          Sundown Beach Club
        </Link>
        <p className="hidden text-xs font-semibold uppercase tracking-[0.3em] sm:block" style={{ color: `${INK}b3` }}>
          Srithanu · Koh Phangan
        </p>
        <nav className="flex gap-6 text-xs font-bold uppercase tracking-[0.2em]">
          <a href="#lineup" className="underline decoration-2 underline-offset-4 hover:decoration-4">Line-up</a>
          <a href="#book" className="underline decoration-2 underline-offset-4 hover:decoration-4">Book</a>
          <a href="#find" className="underline decoration-2 underline-offset-4 hover:decoration-4">Find us</a>
        </nav>
      </div>
    </header>
  );
}

/* Type-first hero: stacked poster letters over a setting sun disc. Noon → gold. */
function Hero() {
  const today = format(new Date(), "EEEE d MMMM");
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${NOON} 0%, ${HAZE} 52%, ${GOLD} 100%)` }}
    >
      <div
        aria-hidden
        className="sundownx-sun pointer-events-none absolute right-[6%] top-[16%] aspect-square w-[38vw] max-w-[420px] rounded-full"
        style={{
          background: "radial-gradient(circle at 38% 34%, #FFF3C4 0%, #FFB347 62%, #FF9B3D 100%)",
          boxShadow: "0 0 120px 40px rgba(255, 179, 71, 0.45)",
          animation: "sundownx-sunset 26s ease-in-out infinite alternate",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-14 md:px-10 md:pb-24 md:pt-20">
        <h1 className={`${display.className} uppercase leading-[0.84]`} style={{ fontSize: "clamp(4.5rem, 19vw, 15rem)" }}>
          <span className="block">Sun&mdash;</span>
          <span className="block" style={{ WebkitTextStroke: `3px ${INK}`, color: "transparent" }}>
            Down
          </span>
        </h1>
        <div
          className="mt-10 grid gap-x-8 gap-y-4 border-t-2 pt-5 sm:grid-cols-3"
          style={{ borderColor: INK }}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: `${INK}99` }}>Open</p>
            <p className="mt-1 text-sm font-semibold">Noon till late, every day</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: `${INK}99` }}>Where</p>
            <p className="mt-1 text-sm font-semibold">Srithanu sands, west coast</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: `${INK}99` }}>Today</p>
            <p className="mt-1 text-sm font-semibold">{today}</p>
          </div>
        </div>
        <p className="mt-8 max-w-md text-base leading-relaxed" style={{ color: `${INK}cc` }}>
          A bar on the sand that follows the light: pool and daybeds at noon,
          records at golden hour, dancing once the sun is gone. This page sets
          with it — keep scrolling.
        </p>
        <a
          href="#book"
          className={`${display.className} mt-6 inline-block text-2xl uppercase underline decoration-4 underline-offset-8 transition-colors hover:decoration-8 md:text-3xl`}
        >
          Reserve a night &darr;
        </a>
      </div>
    </section>
  );
}

/* Ink ticker band — the poster's fold line. */
function Ticker() {
  const line = TICKER_ITEMS.map((t) => t.toUpperCase()).join("  ★  ") + "  ★  ";
  return (
    <div className="overflow-hidden border-y-2 py-3" style={{ backgroundColor: INK, borderColor: INK }}>
      <div className="sundownx-ticker animate-landing-marquee flex w-max">
        <span className={`${display.className} whitespace-pre text-lg uppercase tracking-wide`} style={{ color: GOLD }}>
          {line}
        </span>
        <span aria-hidden className={`${display.className} whitespace-pre text-lg uppercase tracking-wide`} style={{ color: GOLD }}>
          {line}
        </span>
      </div>
    </div>
  );
}

/* Weekly line-up as full-width poster rows. Gold → ember. */
function Lineup() {
  const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
  return (
    <section id="lineup" style={{ background: `linear-gradient(180deg, ${GOLD}, ${EMBER})` }}>
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-16 md:px-10 md:pb-28 md:pt-24">
        <p className="text-xs font-bold uppercase tracking-[0.35em]" style={{ color: `${INK}99` }}>
          This week on the sand
        </p>
        <h2 className={`${display.className} mt-2 text-5xl uppercase md:text-7xl`}>The line-up</h2>
      </div>
      <div className="border-t-2" style={{ borderColor: INK }}>
        {LINEUP.map((row) => (
          <a
            key={row.day}
            href="#book"
            className="group relative block border-b-2 transition-colors hover:bg-black/10"
            style={{ borderColor: INK }}
          >
            <div className="mx-auto grid max-w-7xl grid-cols-[4.5rem_1fr] items-center gap-x-5 px-5 py-6 md:grid-cols-[10rem_1fr_16rem_10rem] md:gap-x-8 md:px-10 md:py-8">
              <p className={`${display.className} text-3xl uppercase md:text-5xl`}>{row.day}</p>
              <div>
                <p className={`${display.className} text-2xl uppercase leading-tight md:text-4xl`}>{row.act}</p>
                <p className="mt-1 text-sm font-medium md:hidden" style={{ color: `${INK}b3` }}>
                  {format(addDays(monday, row.offset), "d MMM")} · {row.genre} · {row.time}
                </p>
              </div>
              <p className="hidden text-sm font-semibold leading-snug md:block" style={{ color: `${INK}b3` }}>
                {row.genre}
              </p>
              <p className="hidden text-right text-sm font-bold uppercase tracking-wider md:block">
                {format(addDays(monday, row.offset), "d MMM")}
                <span className="mt-1 block font-semibold normal-case" style={{ color: `${INK}b3` }}>{row.time}</span>
              </p>
            </div>
            <div className="pointer-events-none absolute right-[22%] top-1/2 z-10 hidden w-52 -translate-y-1/2 rotate-3 opacity-0 shadow-2xl transition-all duration-300 group-hover:rotate-0 group-hover:opacity-100 lg:block">
              <Image
                src={row.image}
                alt={`${row.act} at Sundown Beach Club`}
                width={416}
                height={312}
                sizes="208px"
                className="aspect-[4/3] w-full border-2 object-cover"
                style={{ borderColor: INK }}
              />
            </div>
          </a>
        ))}
      </div>
      <p className="mx-auto max-w-7xl px-5 py-6 text-xs font-semibold uppercase tracking-[0.25em] md:px-10" style={{ color: `${INK}99` }}>
        Free entry every night before sunset · line-up rotates weekly
      </p>
    </section>
  );
}

/* One horizontal filmstrip of photos inside an ink film band. Ember → dusk. */
function Filmstrip() {
  const sprockets = `repeating-linear-gradient(90deg, transparent 0 14px, ${CREAM}2e 14px 26px)`;
  return (
    <section style={{ background: `linear-gradient(180deg, ${EMBER}, ${MAGENTA} 55%, ${DUSK})` }}>
      <div className="mx-auto max-w-7xl px-5 pt-16 md:px-10 md:pt-24">
        <p className="text-xs font-bold uppercase tracking-[0.35em]" style={{ color: `${INK}99` }}>
          One day, one strip
        </p>
        <h2 className={`${display.className} mt-2 text-5xl uppercase md:text-7xl`}>Noon to night</h2>
        <p className="mt-3 max-w-md text-base font-medium" style={{ color: `${INK}cc` }}>
          Five frames from a single day at Sundown — drag sideways.
        </p>
      </div>
      <div className="mt-10 pb-20 md:pb-28">
        <div style={{ backgroundColor: INK }}>
          <div aria-hidden className="h-4" style={{ background: sprockets }} />
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 py-3 md:px-10">
            {STRIP.map((frame, i) => (
              <figure key={frame.src} className="shrink-0 snap-start">
                <Image
                  src={frame.src}
                  alt={frame.alt}
                  width={520}
                  height={360}
                  sizes="(min-width: 768px) 420px, 300px"
                  className="h-56 w-auto object-cover md:h-80"
                />
                <figcaption className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: `${CREAM}99` }}>
                  {String(i + 1).padStart(2, "0")} / {frame.alt}
                </figcaption>
              </figure>
            ))}
          </div>
          <div aria-hidden className="h-4" style={{ background: sprockets }} />
        </div>
      </div>
    </section>
  );
}

/* Booking sits in the night zone. Dusk → night. */
function Booking() {
  return (
    <section id="book" style={{ background: `linear-gradient(180deg, ${DUSK}, ${NIGHT})`, color: CREAM }}>
      <div className="mx-auto max-w-6xl px-5 pb-24 pt-16 md:px-10 md:pb-32 md:pt-24">
        <p className="text-xs font-bold uppercase tracking-[0.35em]" style={{ color: `${CREAM}80` }}>
          After dark
        </p>
        <h2 className={`${display.className} mt-2 text-5xl uppercase md:text-7xl`}>Claim your spot</h2>
        <p className="mt-3 max-w-md text-base" style={{ color: `${CREAM}b3` }}>
          Sunset fills fast. Pick your zone, a night and your crew — the
          minimum spend is redeemable against food and drinks.
        </p>
        <div className="mt-10">
          <SlotBooking
            options={ZONES}
            displayClass={display.className}
            pickerLabel="Choose your spot"
            priceUnit="min. spend"
            qty={{ label: "Guests", min: 1, max: 10 }}
            variants={{ label: "Arrival", items: ["16:00", "18:00 (sunset)", "20:00", "22:00"] }}
            ctaLabel="Request this table"
            note="Minimum spend redeemable on the night. Demo only."
            theme={{
              accent: EMBER,
              accentText: BLACKOUT,
              text: CREAM,
              muted: `${CREAM}99`,
              surface: "#241338",
              border: `${CREAM}26`,
              radius: "4px",
            }}
          />
        </div>
      </div>
    </section>
  );
}

/* Footer as a neon-sign strip — the darkest point of the ramp. */
function Footer() {
  const neon = "#FF5D8F";
  return (
    <footer id="find" style={{ backgroundColor: BLACKOUT, color: CREAM }}>
      <div className="mx-auto max-w-7xl px-5 py-16 text-center md:px-10 md:py-20">
        <p
          className={`${display.className} sundownx-neon uppercase`}
          style={{
            fontSize: "clamp(3rem, 11vw, 8rem)",
            color: neon,
            textShadow: `0 0 6px ${neon}, 0 0 24px ${neon}66, 0 0 72px ${neon}40`,
            animation: "sundownx-flicker 7s linear infinite",
          }}
        >
          Sundown
        </p>
        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.35em]" style={{ color: `${CREAM}99` }}>
          See you at golden hour
        </p>
        <p className="mx-auto mt-8 max-w-3xl text-sm leading-relaxed" style={{ color: `${CREAM}b3` }}>
          {CONTACT.address}
          <span aria-hidden> · </span>
          <a href={CONTACT.phoneHref} className="underline underline-offset-4 hover:text-white">{CONTACT.phone}</a>
          <span aria-hidden> · </span>
          <a href={CONTACT.instagram} className="underline underline-offset-4 hover:text-white">{CONTACT.instagramHandle}</a>
        </p>
        <p className="mt-10 text-xs uppercase tracking-[0.25em]" style={{ color: `${CREAM}59` }}>
          © {format(new Date(), "yyyy")} Sundown Beach Club — fictional demo · Beach-club layout · Over-18s after 21:00
        </p>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Big_Shoulders, IBM_Plex_Mono } from "next/font/google";
import { format, nextFriday } from "date-fns";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { TimetableBoard } from "@/components/layouts/TimetableBoard";
import { MUAYTHAI_WEEK } from "@/lib/layouts/schedule";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Business Layout — Rai Sabai Muay Thai",
  robots: { index: false },
};

// Fight-bill pairing: a heavy condensed grotesque for the poster type,
// a typewriter mono for bill copy, records and captions.
const display = Big_Shoulders({ subsets: ["latin"], weight: ["700", "800"] });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "600"] });

const INK = "#161211";
const PAPER = "#ece1cc";
const RED = "#c1272d";

// ── Bill data ────────────────────────────────────────────────────────────────
// Records are consistent: fights = W + L per kru, and the tale-of-the-tape
// "combined pro fights" is the sum of all three (143 + 83 + 22 = 248).

interface FightRecord {
  wins: number;
  losses: number;
  ko: number;
}

interface FightCard {
  name: string;
  corner: "RED CORNER" | "BLUE CORNER";
  role: string;
  record: FightRecord;
  note: string;
  image: string;
}

const CARDS: readonly FightCard[] = [
  {
    name: "Kru Somchai",
    corner: "RED CORNER",
    role: "Head trainer · ex-Lumpinee",
    record: { wins: 112, losses: 31, ko: 58 },
    note: "Fought out of Bangkok for 14 years. Runs technique and fighter training. Corners every camp fighter at the local stadium.",
    image: "/img/layouts/muaythai-1.jpg",
  },
  {
    name: "Kru Nok",
    corner: "RED CORNER",
    role: "Pads & fundamentals",
    record: { wins: 64, losses: 19, ko: 22 },
    note: "The patient one. Takes every first-timer from zero — stance, guard, footwork — and holds pads five afternoons a week.",
    image: "/img/layouts/muaythai-2.jpg",
  },
  {
    name: "Coach Tai",
    corner: "BLUE CORNER",
    role: "Strength & conditioning",
    record: { wins: 20, losses: 2, ko: 9 },
    note: "Boxing background, conditioning obsession. Roadwork, bag rounds and the strength sessions that keep your kicks honest.",
    image: "/img/layouts/muaythai-3.jpg",
  },
] as const;

const TAPE: readonly { label: string; value: string; detail: string }[] = [
  { label: "Established", value: "2014", detail: "Same tin roof since day one" },
  { label: "Rings", value: "2", detail: "Full-size, stadium ropes" },
  { label: "Krus", value: "3", detail: "All former pros" },
  { label: "Combined pro fights", value: "248", detail: "Lumpinee, Rajadamnern, island stadiums" },
  { label: "Heaviest bag", value: "60 KG", detail: "The banana bag in the far corner" },
  { label: "Hottest hour", value: "16:00", detail: "Pad work. Bring two shirts" },
] as const;

const SHOTS: readonly { src: string; caption: string }[] = [
  { src: "/img/layouts/muaythai-1.jpg", caption: "07:31 — first bell" },
  { src: "/img/layouts/muaythai-2.jpg", caption: "10:12 — fundamentals" },
  { src: "/img/layouts/muaythai-3.jpg", caption: "16:47 — pad rounds" },
  { src: "/img/layouts/muaythai-4.jpg", caption: "18:55 — last clinch" },
] as const;

const PRICES: readonly { name: string; price: number; per: string; note: string }[] = [
  { name: "Drop-in", price: 400, per: "one class", note: "Gloves and wraps to borrow" },
  { name: "One week", price: 2500, per: "unlimited", note: "Both daily sessions" },
  { name: "One month", price: 7500, per: "unlimited", note: "Fighter's rate — ask about stadium fights" },
] as const;

const TICKER =
  "RAI SABAI MUAY THAI ★ SRITHANU, KOH PHANGAN ★ TWO SESSIONS DAILY ★ SIX DAYS A WEEK ★ ALL LEVELS ★ ";

// ── Page ─────────────────────────────────────────────────────────────────────

export default function MuayThaiLayout() {
  return (
    <div className={mono.className} style={{ backgroundColor: PAPER, color: INK }}>
      <style>{`
        @keyframes rsmt-ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .rsmt-ticker-track { animation: rsmt-ticker 28s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .rsmt-ticker-track { animation: none; }
        }
      `}</style>
      <Ticker />
      <Masthead />
      <PosterBill />
      <TaleOfTheTape />
      <ContactSheet />
      <FightCards />
      <Timetable />
      <PriceList />
      <StampStrip />
      <LayoutSwitcher />
    </div>
  );
}

function Ticker() {
  return (
    <div
      className="overflow-hidden border-b-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white"
      style={{ backgroundColor: RED, borderColor: INK }}
    >
      <div className="rsmt-ticker-track flex w-max whitespace-nowrap">
        <span className="pr-2">{TICKER.repeat(2)}</span>
        <span aria-hidden="true" className="pr-2">{TICKER.repeat(2)}</span>
      </div>
    </div>
  );
}

function Masthead() {
  return (
    <header className="mx-auto flex max-w-5xl flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-5 pb-2 pt-5">
      <Link href="/" className={`${display.className} text-2xl font-extrabold uppercase tracking-wide hover:underline`}>
        Rai Sabai
      </Link>
      <nav className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
        <a href="#tape" className="hover:underline">The tape</a>
        <a href="#krus" className="hover:underline">Fight cards</a>
        <a href="#timetable" className="hover:underline">Timetable</a>
        <a href="#prices" className="hover:underline">Prices</a>
      </nav>
    </header>
  );
}

function PosterBill() {
  const fightNight = format(nextFriday(new Date()), "EEEE d MMMM").toUpperCase();
  return (
    <section className="mx-auto max-w-5xl px-5 pb-16 pt-4 md:pb-24">
      <div className="relative border-4 p-1" style={{ borderColor: INK }}>
        <div className="border px-4 py-10 text-center md:px-10 md:py-14" style={{ borderColor: INK }}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em]">
            Srithanu ★ Koh Phangan ★ Thailand
          </p>
          <div className="mx-auto my-4 h-px max-w-md" style={{ backgroundColor: INK }} />
          <p className="text-xs font-semibold uppercase tracking-[0.2em]">
            The management proudly presents
          </p>
          <h1 className={`${display.className} mt-3 font-extrabold uppercase leading-[0.85]`}>
            <span className="block text-[clamp(4rem,17vw,11rem)]">Rai Sabai</span>
            <span className="block text-[clamp(2rem,8vw,5rem)]" style={{ color: RED }}>
              Muay Thai Camp
            </span>
          </h1>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em]">
            Two sessions daily ★ six days a week ★ tourists, fighters &amp; total beginners in the same ring
          </p>
          <div className="mx-auto mt-6 grid max-w-2xl border-2 text-[11px] font-semibold uppercase tracking-[0.16em] sm:grid-cols-3" style={{ borderColor: INK }}>
            <p className="border-b-2 px-3 py-2 sm:border-b-0 sm:border-r-2" style={{ borderColor: INK }}>
              Doors 07:00 — first bell 07:30
            </p>
            <p className="border-b-2 px-3 py-2 sm:border-b-0 sm:border-r-2" style={{ borderColor: INK }}>
              Clinch &amp; sparring Saturday 10:00
            </p>
            <p className="px-3 py-2">Rest day Sunday — open mat</p>
          </div>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.25em]" style={{ color: RED }}>
            Next fight night at the island stadium: {fightNight}
          </p>
        </div>
        <p
          className="absolute -right-3 top-6 rotate-6 border-4 px-3 py-1 text-sm font-semibold uppercase tracking-[0.14em] md:-right-5 md:top-10"
          style={{ borderColor: RED, color: RED, backgroundColor: PAPER }}
        >
          All levels
        </p>
      </div>
    </section>
  );
}

function TaleOfTheTape() {
  return (
    <section id="tape" className="border-y-4 py-16 md:py-24" style={{ backgroundColor: INK, borderColor: INK, color: PAPER }}>
      <div className="mx-auto max-w-5xl px-5">
        <h2 className={`${display.className} text-5xl font-extrabold uppercase md:text-7xl`}>
          Tale of <span style={{ color: RED }}>the tape</span>
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed" style={{ color: `${PAPER}b3` }}>
          The camp, measured the way a fight is measured. No slogans — just the numbers on the card.
        </p>
        <dl className="mt-10 border-2" style={{ borderColor: PAPER }}>
          {TAPE.map((row, i) => (
            <div
              key={row.label}
              className="grid items-baseline gap-x-6 gap-y-1 px-4 py-4 sm:grid-cols-[1fr_auto_1fr] md:px-6"
              style={{ borderTop: i === 0 ? "none" : `2px solid ${PAPER}` }}
            >
              <dt className="text-[11px] font-semibold uppercase tracking-[0.22em]">{row.label}</dt>
              <dd className={`${display.className} text-4xl font-extrabold tabular-nums sm:text-center md:text-5xl`} style={{ color: RED }}>
                {row.value}
              </dd>
              <dd className="text-xs sm:text-right" style={{ color: `${PAPER}99` }}>
                {row.detail}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function ContactSheet() {
  return (
    <section className="border-b-4" style={{ borderColor: INK }}>
      <div className="grid grid-cols-2 md:grid-cols-4">
        {SHOTS.map((shot, i) => (
          <figure key={shot.caption} className={i > 0 ? "border-l-0 md:border-l-4" : ""} style={{ borderColor: INK }}>
            <div className="relative aspect-square" style={{ backgroundColor: INK }}>
              <Image
                src={shot.src}
                alt={`Rai Sabai camp — ${shot.caption}`}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover grayscale contrast-125"
              />
            </div>
            <figcaption className="border-t-4 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ borderColor: INK }}>
              {shot.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function FightCards() {
  return (
    <section id="krus" className="mx-auto max-w-5xl px-5 py-16 md:py-24">
      <h2 className={`${display.className} text-5xl font-extrabold uppercase md:text-7xl`}>
        On <span style={{ color: RED }}>the card</span>
      </h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed" style={{ color: `${INK}b3` }}>
        Three krus, two-hundred-and-forty-eight professional fights between them. Read the records, then come take pads.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {CARDS.map((kru) => {
          const fights = kru.record.wins + kru.record.losses;
          return (
            <article key={kru.name} className="border-4" style={{ borderColor: INK }}>
              <p
                className="flex items-center justify-between border-b-4 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white"
                style={{ backgroundColor: kru.corner === "RED CORNER" ? RED : INK, borderColor: INK }}
              >
                <span>{kru.corner}</span>
                <span>{fights} pro fights</span>
              </p>
              <div className="relative aspect-[4/3]" style={{ backgroundColor: INK }}>
                <Image
                  src={kru.image}
                  alt={kru.name}
                  fill
                  sizes="(min-width: 768px) 30vw, 90vw"
                  className="object-cover grayscale contrast-125"
                />
              </div>
              <div className="border-t-4 p-4" style={{ borderColor: INK }}>
                <h3 className={`${display.className} text-3xl font-extrabold uppercase`}>{kru.name}</h3>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: `${INK}99` }}>
                  {kru.role}
                </p>
                <p className="mt-3 grid grid-cols-3 border-2 text-center" style={{ borderColor: INK }}>
                  {(
                    [
                      { n: kru.record.wins, l: "W" },
                      { n: kru.record.losses, l: "L" },
                      { n: kru.record.ko, l: "KO" },
                    ] as const
                  ).map((cell, i) => (
                    <span key={cell.l} className={`py-2 ${i > 0 ? "border-l-2" : ""}`} style={{ borderColor: INK }}>
                      <span className={`${display.className} block text-2xl font-extrabold tabular-nums`} style={{ color: cell.l === "L" ? INK : RED }}>
                        {cell.n}
                      </span>
                      <span className="text-[10px] font-semibold tracking-[0.2em]">{cell.l}</span>
                    </span>
                  ))}
                </p>
                <p className="mt-3 text-xs leading-relaxed" style={{ color: `${INK}b3` }}>
                  {kru.note}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Timetable() {
  return (
    <section id="timetable" className="border-y-4 py-16 md:py-24" style={{ borderColor: INK }}>
      <div className="mx-auto max-w-6xl px-5">
        <h2 className={`${display.className} text-5xl font-extrabold uppercase md:text-7xl`}>
          The week&apos;s <span style={{ color: RED }}>bill</span>
        </h2>
        <p className="mb-10 mt-3 max-w-md text-sm leading-relaxed" style={{ color: `${INK}b3` }}>
          Every round of the week. Search a class or a kru and the card lights up its matches.
        </p>
        <TimetableBoard
          week={MUAYTHAI_WEEK}
          displayClass={`${display.className} font-extrabold uppercase`}
          placeholder="Beginner? Clinch? Kru Nok?…"
          theme={{
            accent: RED,
            accentText: "#ffffff",
            text: INK,
            muted: `${INK}99`,
            surface: PAPER,
            card: PAPER,
            border: INK,
            radius: "0px",
          }}
        />
      </div>
    </section>
  );
}

function PriceList() {
  return (
    <section id="prices" className="mx-auto max-w-3xl px-5 py-16 md:py-24">
      <h2 className={`${display.className} text-center text-5xl font-extrabold uppercase md:text-7xl`}>
        Price <span style={{ color: RED }}>list</span>
      </h2>
      <div className="mt-10 border-4" style={{ borderColor: INK }}>
        {PRICES.map((p, i) => (
          <div key={p.name} className="px-5 py-5 md:px-8" style={{ borderTop: i === 0 ? "none" : `4px solid ${INK}` }}>
            <div className="flex items-baseline gap-3">
              <h3 className={`${display.className} shrink-0 text-2xl font-extrabold uppercase md:text-3xl`}>{p.name}</h3>
              <span aria-hidden="true" className="min-w-4 flex-1 border-b-2 border-dotted" style={{ borderColor: `${INK}66` }} />
              <p className={`${display.className} shrink-0 text-3xl font-extrabold tabular-nums md:text-4xl`} style={{ color: RED }}>
                ฿{p.price.toLocaleString("en-US")}
              </p>
            </div>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: `${INK}99` }}>
              {p.per} ★ {p.note}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: `${INK}99` }}>
        No sign-up fee ★ pay at the desk ★ ten-class pass available — ask{" "}
        <a href={CONTACT.phoneHref} className="underline" style={{ color: INK }}>
          {CONTACT.phone}
        </a>
      </p>
    </section>
  );
}

function StampStrip() {
  const year = format(new Date(), "yyyy");
  return (
    <footer className="border-t-4 px-5 py-5 text-white" style={{ backgroundColor: INK, borderColor: INK }}>
      <p className="mx-auto max-w-6xl text-center text-[10px] font-semibold uppercase leading-relaxed tracking-[0.2em]">
        © {year} Rai Sabai Muay Thai ★ {CONTACT.address} ★{" "}
        <a href={CONTACT.phoneHref} className="underline">{CONTACT.phone}</a> ★{" "}
        <a href={CONTACT.instagram} className="underline">{CONTACT.instagramHandle}</a> ★{" "}
        <span style={{ color: RED }}>fictional demo</span> — muay-thai layout
      </p>
    </footer>
  );
}

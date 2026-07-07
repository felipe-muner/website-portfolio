import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond, Karla } from "next/font/google";
import { format } from "date-fns";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { SlotBooking, type SlotOption } from "@/components/layouts/SlotBooking";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Business Layout — Sati Retreat",
  robots: { index: false },
};

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});
const sans = Karla({ subsets: ["latin"], weight: ["300", "400", "500"] });

const MIST = "#eef0ea";
const INK = "#2a2e26";
const MOSS = "#59684c";
const HAIRLINE = "rgba(42, 46, 38, 0.16)";
const MUTED = "rgba(42, 46, 38, 0.62)";
const PAPER = "#f7f8f4";

interface Moment {
  time: string;
  title: string;
  body: string;
  image?: { src: string; alt: string };
}

const MOMENTS: readonly Moment[] = [
  { time: "05:30", title: "Wake gong", body: "A single bell through the trees. There are no alarms at Sati." },
  { time: "06:00", title: "Morning sit", body: "Forty minutes of stillness in the sala while the jungle wakes around you." },
  { time: "07:30", title: "Vinyasa", body: "A slow, warming practice — strong enough to sweat, soft enough to stay kind." },
  {
    time: "09:00",
    title: "Juice & broth",
    body: "Cold-pressed greens, young coconut, warm vegetable broth. Fasting guests take theirs on the deck.",
  },
  {
    time: "11:00",
    title: "Rest & treatment",
    body: "Massage, herbal sauna, or nothing at all. The empty hours are part of the medicine.",
    image: { src: "/img/layouts/retreat-2.jpg", alt: "A quiet, shaded corner of the retreat" },
  },
  { time: "14:00", title: "Breathwork", body: "Guided pranayama in the shade — the afternoon's only appointment." },
  { time: "16:00", title: "Restorative yoga", body: "Long-held floor postures as the day's heat finally breaks." },
  {
    time: "18:00",
    title: "Sunset walk",
    body: "Down through the palms to the sea, in time for the light.",
    image: { src: "/img/layouts/retreat-5.jpg", alt: "Palms and sea at dusk on Koh Phangan" },
  },
  { time: "19:30", title: "Evening sit", body: "Candlelit meditation and a short reading, then quiet tea." },
  { time: "21:00", title: "Noble silence", body: "The lamps go down and the retreat falls silent until the morning gong." },
];

const PROGRAMS: readonly (SlotOption & { days: string; note: string })[] = [
  {
    slug: "three",
    name: "The Pause · 3 days",
    days: "Three days",
    sub: "A gentle unwind — the daily rhythm, clean food and sleep.",
    note: "For a first visit, or when a weekend is all you can give yourself.",
    price: 12500,
  },
  {
    slug: "five",
    name: "The Turn · 5 days",
    days: "Five days",
    sub: "The rhythm plus a short juice fast and two treatments.",
    note: "Long enough for the fast to turn — most guests choose this one.",
    price: 21000,
  },
  {
    slug: "seven",
    name: "The Deep Rest · 7 days",
    days: "Seven days",
    sub: "A full week of fasting, breathwork and one silent day.",
    note: "The complete cycle, ending with a day of noble silence.",
    price: 29500,
  },
];

export default function RetreatLayout() {
  return (
    <div className={`${sans.className} min-h-dvh font-light`} style={{ backgroundColor: MIST, color: INK }}>
      <style>{`
        @keyframes sati-rise {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: none; }
        }
        .sati-rise { animation: sati-rise 1.2s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .sati-rise-2 { animation-delay: 0.2s; }
        .sati-rise-3 { animation-delay: 0.4s; }
        .sati-rise-4 { animation-delay: 0.6s; }
        @media (prefers-reduced-motion: reduce) {
          .sati-rise, .sati-rise-2, .sati-rise-3, .sati-rise-4 { animation: none; }
        }
      `}</style>

      <Masthead />
      <Hero />
      <DayRhythm />
      <Programs />
      <Reserve />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Masthead() {
  return (
    <header className="px-6 pt-14 text-center">
      <Link href="/" className={`${serif.className} text-3xl italic tracking-wide`}>
        Sati
      </Link>
      <p className="mt-2 text-[11px] uppercase tracking-[0.35em]" style={{ color: MUTED }}>
        Detox &amp; yoga retreat · Koh Phangan
      </p>
      <nav className="mt-6 flex justify-center gap-8 text-xs uppercase tracking-[0.2em]">
        {[
          ["#day", "The day"],
          ["#programs", "Programs"],
          ["#reserve", "Reserve"],
        ].map(([href, label]) => (
          <a key={href} href={href} className="underline decoration-1 underline-offset-4 transition-colors hover:decoration-2" style={{ textDecorationColor: HAIRLINE }}>
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-2xl px-6 pt-24 text-center md:pt-32">
      <div className="sati-rise flex justify-center" aria-hidden>
        <span className="animate-landing-breathe block size-3 rounded-full" style={{ backgroundColor: MOSS }} />
      </div>
      <h1 className={`${serif.className} sati-rise-2 sati-rise mt-10 text-5xl leading-[1.08] md:text-7xl`}>
        Rise with the gong,
        <br />
        <em>rest with the sea.</em>
      </h1>
      <p className="sati-rise-3 sati-rise mx-auto mt-8 max-w-md text-lg leading-relaxed" style={{ color: MUTED }}>
        Sati is a small fasting and yoga retreat in the hills of Koh Phangan.
        Every day here follows one gentle rhythm — you only have to follow
        along.
      </p>
      <div className="sati-rise-4 sati-rise mt-16 flex justify-center">
        <div className="relative aspect-[4/5] w-56 overflow-hidden rounded-t-full md:w-72">
          <Image
            src="/img/layouts/retreat-3.jpg"
            alt="Morning light in the jungle above the retreat"
            fill
            priority
            sizes="(min-width: 768px) 288px, 224px"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function Connector({ fade }: { fade?: "in" | "out" }) {
  const background =
    fade === "in"
      ? `linear-gradient(to bottom, transparent, ${HAIRLINE})`
      : fade === "out"
        ? `linear-gradient(to bottom, ${HAIRLINE}, transparent)`
        : HAIRLINE;
  return <span aria-hidden className="mx-auto block h-16 w-px md:h-20" style={{ background }} />;
}

function DayRhythm() {
  const last = MOMENTS.length - 1;
  return (
    <section id="day" className="mx-auto max-w-2xl scroll-mt-10 px-6 pt-28 text-center md:pt-36">
      <p className="text-[11px] uppercase tracking-[0.35em]" style={{ color: MOSS }}>
        One day at Sati
      </p>
      <h2 className={`${serif.className} mx-auto mt-4 max-w-md text-4xl leading-tight md:text-5xl`}>
        Whether you stay three days or seven, the day is the same
      </h2>
      <p className="mx-auto mt-6 max-w-sm leading-relaxed" style={{ color: MUTED }}>
        The schedule is the treatment. From the first bell to noble silence,
        this is how the hours pass.
      </p>

      <ol className="mt-4 list-none">
        {MOMENTS.map((m, i) => (
          <li key={m.time} className="flex flex-col items-center">
            <Connector fade={i === 0 ? "in" : undefined} />
            <span aria-hidden className="block size-2 rounded-full" style={{ backgroundColor: i === last ? INK : MOSS }} />
            <p className="mt-5 text-sm tracking-[0.25em] tabular-nums" style={{ color: MOSS }}>
              {m.time}
            </p>
            <h3 className={`${serif.className} mt-2 text-3xl md:text-4xl ${i === last ? "italic" : ""}`}>{m.title}</h3>
            <p className="mt-3 max-w-xs leading-relaxed" style={{ color: MUTED }}>
              {m.body}
            </p>
            {m.image && (
              <>
                <Connector />
                <div className="relative aspect-[4/5] w-40 overflow-hidden rounded-t-full md:w-44">
                  <Image src={m.image.src} alt={m.image.alt} fill sizes="176px" className="object-cover" />
                </div>
              </>
            )}
            {i === last && <Connector fade="out" />}
          </li>
        ))}
      </ol>
    </section>
  );
}

function Programs() {
  return (
    <section id="programs" className="mx-auto max-w-3xl scroll-mt-10 px-6 pt-24 md:pt-32">
      <div className="text-center">
        <p className="text-[11px] uppercase tracking-[0.35em]" style={{ color: MOSS }}>
          Programs
        </p>
        <h2 className={`${serif.className} mt-4 text-4xl md:text-5xl`}>Three, five or seven days</h2>
      </div>

      <div className="mt-14">
        {PROGRAMS.map((p) => (
          <article
            key={p.slug}
            className="grid items-baseline gap-x-10 gap-y-2 border-t py-10 md:grid-cols-[1fr_auto] md:py-12"
            style={{ borderColor: HAIRLINE }}
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em]" style={{ color: MOSS }}>
                {p.days}
              </p>
              <h3 className={`${serif.className} mt-2 text-3xl md:text-4xl`}>{p.name.split(" · ")[0]}</h3>
              <p className="mt-3 max-w-md leading-relaxed" style={{ color: MUTED }}>
                {p.sub} {p.note}
              </p>
            </div>
            <p className={`${serif.className} text-2xl md:text-right md:text-3xl`}>
              ฿{p.price.toLocaleString()}
              <span className={`${sans.className} mt-1 block text-xs tracking-[0.2em]`} style={{ color: MUTED }}>
                per person
              </span>
            </p>
          </article>
        ))}
        <div className="border-t" style={{ borderColor: HAIRLINE }} />
      </div>
    </section>
  );
}

function Reserve() {
  return (
    <section id="reserve" className="mx-auto max-w-4xl scroll-mt-10 px-6 pt-24 md:pt-32">
      <div className="text-center">
        <p className="text-[11px] uppercase tracking-[0.35em]" style={{ color: MOSS }}>
          Reserve
        </p>
        <h2 className={`${serif.className} mt-4 text-4xl md:text-5xl`}>Choose a program and a day to arrive</h2>
        <p className="mx-auto mt-5 max-w-sm leading-relaxed" style={{ color: MUTED }}>
          We&rsquo;ll send an intake form and arrange a short call before you
          travel.
        </p>
      </div>
      <div className="mt-12">
        <SlotBooking
          options={PROGRAMS}
          displayClass={serif.className}
          pickerLabel="Program"
          priceUnit="per person"
          variants={{ label: "Room", items: ["Shared", "Private garden", "Private pool villa"] }}
          ctaLabel="Request this retreat"
          note="A deposit holds your place; the balance is settled on arrival."
          theme={{
            accent: MOSS,
            accentText: PAPER,
            text: INK,
            muted: MUTED,
            surface: PAPER,
            border: HAIRLINE,
            radius: "2px",
          }}
        />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-6 pb-16 pt-28 text-center md:pt-36">
      <span aria-hidden className="mx-auto mb-10 block size-2 rounded-full" style={{ backgroundColor: MOSS }} />
      <p className={`${serif.className} text-xl italic`}>Sati Retreat · {CONTACT.address}</p>
      <p className="mt-3 text-sm" style={{ color: MUTED }}>
        <a href={CONTACT.phoneHref} className="underline decoration-1 underline-offset-4">
          {CONTACT.phone}
        </a>
        {" · "}
        <a href={CONTACT.instagram} className="underline decoration-1 underline-offset-4">
          {CONTACT.instagramHandle}
        </a>
      </p>
      <p className="mt-3 text-xs uppercase tracking-[0.25em]" style={{ color: MUTED }}>
        © {format(new Date(), "yyyy")} — a fictional demo · wellness-retreat layout
      </p>
    </footer>
  );
}

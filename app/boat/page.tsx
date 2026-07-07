import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IBM_Plex_Mono, IBM_Plex_Sans, Marcellus } from "next/font/google";
import { format } from "date-fns";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { SlotBooking, type SlotOption } from "@/components/layouts/SlotBooking";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Business Layout — Blue Horizon Boat Co.",
  robots: { index: false },
};

const display = Marcellus({ subsets: ["latin"], weight: "400" });
const body = IBM_Plex_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"] });

/** Chart palette — magenta is the real ink used for plotted courses on marine charts. */
const INK = "#12303d";
const PAPER = "#edf2ef";
const WATER = "#d9e7e3";
const MAGENTA = "#b42d63";
const HAIR = "#12303d2b";
const GRID = "#12303d12";

interface Sailing extends SlotOption {
  code: string;
  image: string;
  plate: string;
  meta: string;
  departs: string;
  pier: string;
  status: string;
  blurb: string;
}

const SAILINGS: readonly Sailing[] = [
  {
    slug: "snorkel",
    code: "BH-01",
    name: "Snorkel Safari",
    sub: "Four bays, turtles & coral gardens, lunch on the beach.",
    price: 1600,
    image: "/img/layouts/boat-1.jpg",
    plate: "Pl. II — Koh Ma sandbar at low water",
    meta: "Full day · 4 stops · max 12 aboard",
    departs: "08:30 daily",
    pier: "Thong Sala",
    status: "ON TIME",
    blurb:
      "Our flagship course, plotted below hour by hour. We chase the tide and the visibility, not a fixed tourist loop — masks that fit, a crew that knows your name, and the good reefs when they are at their best.",
  },
  {
    slug: "sunset",
    code: "BH-02",
    name: "Sunset & Fire Cruise",
    sub: "Sundowners, a plankton swim and the fire show from the water.",
    price: 1200,
    image: "/img/layouts/boat-2.jpg",
    plate: "Pl. III — West coast, last light",
    meta: "Evening · 4 hrs · drinks aboard",
    departs: "16:45 Tue–Sun",
    pier: "Haad Rin",
    status: "ON TIME",
    blurb:
      "We motor out as the heat breaks, anchor for a swim in water gone gold, and hold position off the beach for the fire show. On dark-moon nights the wake glows with plankton — cut the engine, slip in, and watch your own hands light up.",
  },
  {
    slug: "island",
    code: "BH-03",
    name: "Hidden Islands Charter",
    sub: "Private longtail to the coves the ferries never reach.",
    price: 4500,
    image: "/img/layouts/boat-3.jpg",
    plate: "Pl. IV — Unnamed cove, north shore",
    meta: "Private · your route · whole boat",
    departs: "On request",
    pier: "Thong Sala",
    status: "ON REQUEST",
    blurb:
      "You bring the people; we bring the boat, the skipper and the chart. Point at any bay on it and we will tell you honestly whether it is worth the fuel — then plot the course together over coffee at the shore office.",
  },
  {
    slug: "fishing",
    code: "BH-04",
    name: "Dawn Fishing Trip",
    sub: "Hand-line with the local crew, cook your catch.",
    price: 1900,
    image: "/img/layouts/boat-4.jpg",
    plate: "Pl. V — Hauling in, first light",
    meta: "Half day · 5 hrs · gear included",
    departs: "05:45 Mon·Wed·Fri",
    pier: "Chaloklum",
    status: "ON TIME",
    blurb:
      "Off the pier before the ferries wake up, hand-lines over the drop east of the bay. Whatever comes up goes straight on the grill back at the beach — the crew's chili-lime sauce is the real reason people rebook.",
  },
];

interface Waypoint {
  time: string;
  place: string;
  note: string;
  /** Bearing/distance annotation for the leg sailed after this stop. */
  leg: string | null;
}

const COURSE: readonly Waypoint[] = [
  {
    time: "08:30",
    place: "Thong Sala Pier",
    note: "Muster at the blue flag. Boards and briefing, fresh fruit and cold water on deck.",
    leg: "hdg 322° T · 4.8 nm · flat water inside the reef",
  },
  {
    time: "10:00",
    place: "Koh Ma reef",
    note: "First drop. Turtles graze the north wall — drift with your buddy, the boat follows you.",
    leg: "hdg 048° T · 3.1 nm · open channel, light chop",
  },
  {
    time: "12:30",
    place: "Bottle Beach",
    note: "Anchor off the sand. Lunch under the casuarinas — grilled catch, sticky rice, green mango salad.",
    leg: "hdg 095° T · 2.6 nm · hugging the north cliffs",
  },
  {
    time: "14:00",
    place: "Than Sadet cove",
    note: "The cliff-jump ledge and the quiet second reef. Jumpers to port, drifters to starboard.",
    leg: "hdg 210° T · 5.4 nm · the long run home, engine slow",
  },
  {
    time: "17:30",
    place: "Thong Sala Pier",
    note: "Alongside with the light going gold behind Koh Tae Nai. Salt in your hair, dinner earned.",
    leg: null,
  },
];

const CONDITIONS = [
  { label: "Tide", value: "HW 11:42", unit: "1.9 m" },
  { label: "Wind", value: "ESE 9", unit: "kn" },
  { label: "Swell", value: "0.4", unit: "m @ 6 s" },
  { label: "Sea temp", value: "29", unit: "°C" },
  { label: "Visibility", value: "18", unit: "m" },
  { label: "Sailings", value: "ALL RUNNING", unit: "" },
] as const;

export default function BoatLayout() {
  return (
    <div className={body.className} style={{ backgroundColor: PAPER, color: INK }}>
      <style>{`
        @keyframes bhc-current { from { background-position-y: 0; } to { background-position-y: 28px; } }
        @media (prefers-reduced-motion: reduce) {
          .bhc-current { animation: none !important; }
        }
      `}</style>
      <Nav />
      <main>
        <Hero />
        <Conditions />
        <Course />
        <Sailings />
        <Booking />
      </main>
      <DeparturesBoard />
      <LayoutSwitcher />
    </div>
  );
}

function Rule({ double = false }: { double?: boolean }) {
  return double ? (
    <div aria-hidden style={{ borderTop: `1px solid ${HAIR}` }}>
      <div className="mt-[3px]" style={{ borderTop: `1px solid ${HAIR}` }} />
    </div>
  ) : (
    <div aria-hidden style={{ borderTop: `1px solid ${HAIR}` }} />
  );
}

function Nav() {
  return (
    <header>
      <div className={`${mono.className} flex flex-wrap items-center justify-between gap-x-6 px-5 py-2 text-[11px] tracking-[0.14em] md:px-10`} style={{ color: `${INK}99`, borderBottom: `1px solid ${HAIR}` }}>
        <span>CHART No. 84280 — GULF OF THAILAND</span>
        <span className="hidden sm:inline">9°45′ N · 100°02′ E</span>
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 px-5 py-5 md:px-10">
        <Link href="/" className={`${display.className} text-xl tracking-[0.06em]`}>
          Blue Horizon Boat Co.
        </Link>
        <nav className={`${mono.className} flex items-baseline gap-6 text-xs tracking-[0.14em]`}>
          <a href="#course" className="hidden hover:underline sm:inline" style={{ color: `${INK}b3` }}>THE DAY</a>
          <a href="#sailings" className="hidden hover:underline sm:inline" style={{ color: `${INK}b3` }}>SAILINGS</a>
          <a href="#departures" className="hidden hover:underline md:inline" style={{ color: `${INK}b3` }}>DEPARTURES</a>
          <a href="#book" className="underline underline-offset-4" style={{ color: MAGENTA }}>BOOK PASSAGE →</a>
        </nav>
      </div>
      <Rule double />
    </header>
  );
}

function CompassRose({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden fill="none" stroke={INK} strokeWidth="1">
      <circle cx="50" cy="50" r="34" opacity="0.5" />
      <circle cx="50" cy="50" r="2" fill={INK} stroke="none" opacity="0.7" />
      <path d="M50 8 L54 46 L50 50 L46 46 Z" fill={MAGENTA} stroke="none" opacity="0.85" />
      <path d="M50 92 L46 54 L50 50 L54 54 Z" fill={INK} stroke="none" opacity="0.4" />
      <path d="M8 50 L46 46 L50 50 L46 54 Z M92 50 L54 54 L50 50 L54 46 Z" fill={INK} stroke="none" opacity="0.4" />
      <text x="50" y="5" textAnchor="middle" fontSize="9" fill={INK} stroke="none" opacity="0.8">N</text>
    </svg>
  );
}

function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(${GRID} 1px, transparent 1px), linear-gradient(90deg, ${GRID} 1px, transparent 1px)`,
        backgroundSize: "72px 72px",
      }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-[1.1fr_1fr] md:px-10 md:py-24">
        <div className="relative">
          <CompassRose className="absolute -top-8 right-0 hidden w-24 md:block" />
          <h1 className={`${display.className} text-5xl uppercase leading-[1.08] tracking-[0.04em] md:text-6xl lg:text-7xl`}>
            The island, charted the slow way
          </h1>
          <p className={`${mono.className} mt-5 text-xs tracking-[0.14em]`} style={{ color: `${INK}8c` }}>
            SURVEYED 2019 — CORRECTIONS TO {format(new Date(), "MMM yyyy").toUpperCase()}
          </p>
          <p className="mt-6 max-w-md text-lg font-light leading-relaxed" style={{ color: `${INK}cc` }}>
            Boat trips and private charters out of Koh Phangan — small groups,
            local skippers, and every day plotted like a course: pier, reef,
            beach lunch, home with the light behind us.
          </p>
          <div className={`${mono.className} mt-9 flex flex-wrap items-baseline gap-x-8 gap-y-3 text-sm tracking-[0.1em]`}>
            <a href="#course" className="underline underline-offset-4 hover:opacity-70">
              Read the day&apos;s course ↓
            </a>
            <a href="#book" className="underline underline-offset-4 hover:opacity-80" style={{ color: MAGENTA }}>
              Book passage →
            </a>
          </div>
        </div>
        <figure className="mx-auto w-full max-w-sm rotate-1 bg-white p-3 pb-4 shadow-[0_18px_40px_-18px_rgba(18,48,61,0.45)] md:max-w-none">
          <div className="relative aspect-[4/5]">
            <Image
              src="/img/layouts/boat-5.jpg"
              alt="A longtail boat at anchor in a quiet turquoise bay"
              fill
              priority
              sizes="(min-width: 768px) 42vw, 90vw"
              className="object-cover"
            />
          </div>
          <figcaption className={`${mono.className} mt-3 flex justify-between text-[11px] tracking-[0.12em]`} style={{ color: `${INK}99` }}>
            <span>PL. I — LONGTAIL AT ANCHOR, WEST COAST</span>
            <span style={{ color: MAGENTA }}>fig. 1</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function Conditions() {
  return (
    <section aria-label="Today on the water" style={{ backgroundColor: WATER, borderTop: `1px solid ${HAIR}`, borderBottom: `1px solid ${HAIR}` }}>
      <div className={`${mono.className} mx-auto grid max-w-6xl grid-cols-2 gap-px px-5 py-6 sm:grid-cols-3 md:grid-cols-7 md:px-10`}>
        <div className="pr-4">
          <p className="text-[10px] tracking-[0.2em]" style={{ color: `${INK}8c` }}>TODAY ON THE WATER</p>
          <p className="mt-1 text-sm tracking-[0.1em]" style={{ color: MAGENTA }}>{format(new Date(), "EEE dd MMM").toUpperCase()}</p>
        </div>
        {CONDITIONS.map((c) => (
          <div key={c.label} className="pr-4">
            <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: `${INK}8c` }}>{c.label}</p>
            <p className="mt-1 text-sm tracking-[0.06em]">
              {c.value}
              {c.unit && <span style={{ color: `${INK}8c` }}> {c.unit}</span>}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionHead({ eyebrowLeft, title, marginNote }: { eyebrowLeft: string; title: string; marginNote: string }) {
  return (
    <div>
      <div className={`${mono.className} flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-[11px] tracking-[0.16em]`} style={{ color: `${INK}8c` }}>
        <span>{eyebrowLeft}</span>
        <span className="hidden sm:inline">{marginNote}</span>
      </div>
      <h2 className={`${display.className} mt-3 text-4xl uppercase tracking-[0.04em] md:text-5xl`}>{title}</h2>
    </div>
  );
}

/** The signature: the flagship day plotted as a course down the page. */
function Course() {
  return (
    <section id="course" className="mx-auto max-w-6xl scroll-mt-8 px-5 py-20 md:px-10 md:py-28">
      <SectionHead
        eyebrowLeft="SAILING BH-01 — SNORKEL SAFARI"
        marginNote="ALL TIMES LOCAL · WEATHER PERMITTING"
        title="The day, hour by hour"
      />
      <div className="mt-14 max-w-3xl">
        {COURSE.map((wp) => (
          <div key={wp.time} className="grid grid-cols-[3.5rem_2rem_1fr] gap-x-3 sm:grid-cols-[5rem_2.5rem_1fr] sm:gap-x-5">
            {/* time */}
            <p className={`${mono.className} pt-0.5 text-right text-sm tracking-[0.06em]`} style={{ color: MAGENTA }}>
              {wp.time}
            </p>
            {/* waypoint fix symbol + course line */}
            <div className="relative flex justify-center">
              <svg viewBox="0 0 20 20" className="relative z-10 mt-0.5 size-5 shrink-0" aria-hidden style={{ backgroundColor: PAPER }}>
                <circle cx="10" cy="10" r="6" fill="none" stroke={INK} strokeWidth="1.5" />
                <path d="M10 1v6M10 13v6M1 10h6M13 10h6" stroke={INK} strokeWidth="1.5" />
              </svg>
              {wp.leg !== null && (
                <span
                  aria-hidden
                  className="bhc-current absolute bottom-0 top-4 w-[2px]"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, ${MAGENTA} 0 8px, transparent 8px 14px)`,
                    backgroundSize: "2px 14px",
                    animation: "bhc-current 2.6s linear infinite",
                  }}
                />
              )}
            </div>
            {/* stop details + leg annotation */}
            <div className={wp.leg !== null ? "pb-10" : ""}>
              <h3 className={`${display.className} text-2xl leading-tight`}>{wp.place}</h3>
              <p className="mt-1.5 max-w-lg font-light leading-relaxed" style={{ color: `${INK}b3` }}>{wp.note}</p>
              {wp.leg !== null && (
                <p className={`${mono.className} mt-4 text-[11px] tracking-[0.14em]`} style={{ color: `${INK}80` }}>
                  ↓ {wp.leg}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className={`${mono.className} mt-4 max-w-3xl text-[11px] leading-relaxed tracking-[0.12em]`} style={{ color: `${INK}80` }}>
        COURSE VARIES WITH TIDE & VISIBILITY — THE SKIPPER TAKES YOU WHERE THE WATER IS BEST, NOT WHERE THE BROCHURE SAYS.
      </p>
    </section>
  );
}

function Sailings() {
  return (
    <section id="sailings" className="mx-auto max-w-6xl scroll-mt-8 px-5 pb-20 md:px-10 md:pb-28">
      <SectionHead
        eyebrowLeft="INDEX OF SAILINGS — BH-01 TO BH-04"
        marginNote="FARES IN THAI BAHT"
        title="Four ways out of the harbour"
      />
      <div className="mt-12">
        {SAILINGS.map((s, i) => (
          <article key={s.slug} className="py-10 first:pt-0 md:py-14" style={{ borderTop: i === 0 ? "none" : `1px solid ${HAIR}` }}>
            <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
              <figure className={`bg-white p-3 shadow-[0_14px_32px_-16px_rgba(18,48,61,0.4)] ${i % 2 === 1 ? "md:order-last" : ""}`}>
                <div className="relative aspect-[3/2]">
                  <Image
                    src={s.image}
                    alt={`${s.name} — ${s.plate}`}
                    fill
                    sizes="(min-width: 768px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className={`${mono.className} mt-3 flex justify-between text-[11px] uppercase tracking-[0.12em]`} style={{ color: `${INK}99` }}>
                  <span>{s.plate}</span>
                  <span style={{ color: MAGENTA }}>fig. {i + 2}</span>
                </figcaption>
              </figure>
              <div>
                <p className={`${mono.className} text-xs tracking-[0.16em]`} style={{ color: MAGENTA }}>
                  SAILING {s.code} — DEP {s.departs.toUpperCase()}, {s.pier.toUpperCase()} PIER
                </p>
                <h3 className={`${display.className} mt-3 text-3xl uppercase tracking-[0.04em] md:text-4xl`}>{s.name}</h3>
                <p className={`${mono.className} mt-2 text-xs tracking-[0.12em]`} style={{ color: `${INK}8c` }}>{s.meta.toUpperCase()}</p>
                <p className="mt-4 max-w-md font-light leading-relaxed" style={{ color: `${INK}b3` }}>{s.blurb}</p>
                <div className={`${mono.className} mt-6 flex flex-wrap items-baseline gap-x-8 gap-y-2 text-sm tracking-[0.08em]`}>
                  <span>
                    ฿{s.price.toLocaleString()} <span style={{ color: `${INK}8c` }}>{s.slug === "island" ? "whole boat" : "per person"}</span>
                  </span>
                  <a href="#book" className="underline underline-offset-4 hover:opacity-80" style={{ color: MAGENTA }}>
                    Plot this course →
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Booking() {
  return (
    <section id="book" className="scroll-mt-8" style={{ backgroundColor: WATER, borderTop: `1px solid ${HAIR}` }}>
      <div className="mx-auto max-w-5xl px-5 py-20 md:px-10 md:py-28">
        <SectionHead
          eyebrowLeft="RESERVATIONS — CONFIRMED BY MESSAGE, SAME DAY"
          marginNote="NO PAYMENT UNTIL YOU BOARD"
          title="Book passage"
        />
        <div className="mt-10">
          <SlotBooking
            options={SAILINGS.map(({ slug, name, sub, price }) => ({ slug, name, sub, price }))}
            displayClass={display.className}
            pickerLabel="Choose your sailing"
            priceUnit="per person"
            qty={{ label: "Souls aboard", min: 1, max: 12 }}
            ctaLabel="Request these seats"
            note="No payment now — settle with the crew on the day."
            theme={{
              accent: MAGENTA,
              accentText: "#ffffff",
              text: INK,
              muted: `${INK}99`,
              surface: "#ffffff",
              border: `${INK}26`,
              radius: "4px",
            }}
          />
        </div>
      </div>
    </section>
  );
}

function DeparturesBoard() {
  const year = format(new Date(), "yyyy");
  return (
    <footer id="departures" className={`${mono.className} scroll-mt-8`} style={{ backgroundColor: INK, color: `${PAPER}d9` }}>
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-10">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <h2 className={`${display.className} text-2xl uppercase tracking-[0.08em] text-white`}>Departures</h2>
          <p className="text-[11px] tracking-[0.18em]" style={{ color: `${PAPER}73` }}>
            BLUE HORIZON BOAT CO. — {CONTACT.area.toUpperCase()}
          </p>
        </div>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="text-[10px] tracking-[0.24em]" style={{ color: `${PAPER}66` }}>
                <th className="pb-3 font-normal">TRIP</th>
                <th className="pb-3 font-normal">DEPARTS</th>
                <th className="pb-3 font-normal">PIER</th>
                <th className="pb-3 font-normal">FARE</th>
                <th className="pb-3 text-right font-normal">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {SAILINGS.map((s) => (
                <tr key={s.slug} style={{ borderTop: `1px solid ${PAPER}1f` }}>
                  <td className="py-3 pr-6 tracking-[0.06em]">
                    <span style={{ color: `${PAPER}66` }}>{s.code}</span> {s.name.toUpperCase()}
                  </td>
                  <td className="py-3 pr-6 uppercase tracking-[0.06em]">{s.departs}</td>
                  <td className="py-3 pr-6 uppercase tracking-[0.06em]">{s.pier}</td>
                  <td className="py-3 pr-6 tracking-[0.06em]">฿{s.price.toLocaleString()}</td>
                  <td className="py-3 text-right tracking-[0.18em]" style={{ color: s.status === "ON REQUEST" ? `${PAPER}99` : "#e0679c" }}>
                    {s.status}
                  </td>
                </tr>
              ))}
              <tr style={{ borderTop: `1px solid ${PAPER}1f` }}>
                <td className="py-3 pr-6 tracking-[0.18em]" style={{ color: `${PAPER}66` }}>SHORE OFFICE</td>
                <td className="py-3 uppercase tracking-[0.06em]" colSpan={4}>{CONTACT.address}</td>
              </tr>
              <tr style={{ borderTop: `1px solid ${PAPER}1f` }}>
                <td className="py-3 pr-6 tracking-[0.18em]" style={{ color: `${PAPER}66` }}>HAIL</td>
                <td className="py-3 tracking-[0.06em]" colSpan={2}>
                  <a href={CONTACT.phoneHref} className="hover:underline">{CONTACT.phone}</a>
                </td>
                <td className="py-3 tracking-[0.06em]" colSpan={2}>
                  <a href={CONTACT.instagram} className="hover:underline">{CONTACT.instagramHandle.toUpperCase()}</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-10 text-[10px] tracking-[0.22em]" style={{ color: `${PAPER}59` }}>
          © {year} BLUE HORIZON BOAT CO. — FICTIONAL DEMO · NO REAL SAILINGS DEPART THIS BOARD · LIFE JACKETS FOR ALL AGES
        </p>
      </div>
    </footer>
  );
}

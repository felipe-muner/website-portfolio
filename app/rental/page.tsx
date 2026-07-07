import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Alfa_Slab_One, Karla, Permanent_Marker } from "next/font/google";
import { format } from "date-fns";
import { Phone } from "lucide-react";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { DateRangeBooking, type RangeItem } from "@/components/layouts/DateRangeBooking";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Business Layout — Loop Island Rides",
  robots: { index: false },
};

const display = Alfa_Slab_One({ subsets: ["latin"], weight: "400" });
const marker = Permanent_Marker({ subsets: ["latin"], weight: "400" });
const body = Karla({ subsets: ["latin"], weight: ["400", "700"] });

const MINT = "#dfeae0"; // faded shophouse-wall green
const INK = "#191915"; // soft signwriter black
const YELLOW = "#f2b90d"; // painted board yellow
const RED = "#c92f1d"; // price-brush red
const PAPER = "#fffdf4";

type FleetItem = RangeItem & {
  image: string | null;
  specs: readonly string[];
  note: string | null;
};

const FLEET: readonly FleetItem[] = [
  { slug: "click", name: "Honda Click 125", sub: "The island default — light, automatic, sips fuel.", pricePerDay: 250, image: "/img/layouts/rental-1.jpg", specs: ["125cc", "automatic", "2 helmets"], note: "most rented" },
  { slug: "fino", name: "Yamaha Fino", sub: "Retro scooter, comfy for two around town.", pricePerDay: 250, image: "/img/layouts/rental-2.jpg", specs: ["125cc", "automatic", "flat floor"], note: null },
  { slug: "pcx", name: "Honda PCX 160", sub: "Bigger and smoother — happy on the hill roads.", pricePerDay: 400, image: "/img/layouts/rental-3.jpg", specs: ["160cc", "automatic", "big seat"], note: null },
  { slug: "nmax", name: "Yamaha NMAX", sub: "Punchy 155cc with ABS for confident riders.", pricePerDay: 450, image: "/img/layouts/rental-4.jpg", specs: ["155cc", "automatic", "ABS"], note: "hills? yes" },
  { slug: "adv", name: "Honda ADV 160", sub: "Adventure stance, chunky tyres for dirt tracks.", pricePerDay: 550, image: "/img/layouts/rental-5.jpg", specs: ["160cc", "automatic", "chunky tyres"], note: "dirt roads OK" },
  { slug: "mtb", name: "Mountain bike", sub: "Pedal power for the coastal flats and cardio.", pricePerDay: 150, image: null, specs: ["21 gears", "lock included"], note: "no licence" },
];

const STOPS = [
  {
    n: "1",
    title: "Point at the board",
    text: "Pick your bike here or over WhatsApp and tell us where you're staying. No deposit online, no paperwork yet.",
  },
  {
    n: "2",
    title: "We ride it to you",
    text: "Your bike arrives fuelled at your villa or the pier, two helmets in the box. One page to sign, five minutes, done.",
  },
  {
    n: "3",
    title: "Loop the island, drop it anywhere",
    text: "Ride until your last day — then we collect from wherever you end up. Flat tyre at 2am? Call, we come.",
  },
];

export default function RentalLayout() {
  return (
    <div className={body.className} style={{ backgroundColor: MINT, color: INK }}>
      <style>{`
        @keyframes loop-rides-sway {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(3deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .loop-rides-sway { animation: none !important; }
        }
      `}</style>
      <UtilityBar />
      <PriceBoard />
      <RoadDivider />
      <FilmStrip />
      <HowItWorks />
      <RoadDivider />
      <Booking />
      <StickerFooter />
      <LayoutSwitcher />
    </div>
  );
}

function UtilityBar() {
  return (
    <div style={{ backgroundColor: INK, color: PAPER }}>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] md:px-10">
        <Link href="/" className="hover:underline">
          Loop Island Rides · Thong Sala
        </Link>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <span style={{ color: `${PAPER}b3` }}>Open 8:00–20:00, every day</span>
          <a href={CONTACT.phoneHref} className="flex items-center gap-1.5 hover:underline" style={{ color: YELLOW }}>
            <Phone className="size-3.5" /> {CONTACT.phone}
          </a>
        </div>
      </div>
    </div>
  );
}

function PriceBoard() {
  return (
    <section className="px-4 pb-16 pt-10 sm:px-6 md:pb-24 md:pt-16">
      <p className={`${marker.className} mx-auto mb-4 max-w-2xl text-center text-lg`} style={{ color: `${INK}b3` }}>
        as seen on the roadside, just past the 7-Eleven →
      </p>

      <div className="relative mx-auto max-w-2xl" style={{ transform: "rotate(-0.6deg)" }}>
        {/* hanging open tag */}
        <div
          className={`${marker.className} loop-rides-sway absolute -top-5 right-4 z-10 px-3 py-1.5 text-sm sm:right-8`}
          style={{
            backgroundColor: PAPER,
            border: `3px solid ${INK}`,
            transformOrigin: "top center",
            animation: "loop-rides-sway 4.5s ease-in-out infinite",
            boxShadow: `3px 3px 0 ${INK}40`,
          }}
        >
          yes, we&rsquo;re open
        </div>

        {/* the board */}
        <div style={{ backgroundColor: YELLOW, border: `4px solid ${INK}`, boxShadow: `10px 10px 0 ${INK}33` }}>
          <div className="px-5 py-8 sm:px-8 md:px-10" style={{ border: `3px solid ${INK}`, margin: "6px" }}>
            <p className="text-center text-xs font-bold uppercase tracking-[0.35em]" style={{ color: `${INK}99` }}>
              Loop Island Rides · Koh Phangan
            </p>
            <h1 className={`${display.className} mt-3 text-center text-5xl uppercase leading-[0.95] sm:text-6xl md:text-7xl`}>
              Bikes
              <br />
              for rent
            </h1>
            <p className="mt-3 text-center text-sm font-bold uppercase tracking-[0.15em]">
              per day · helmets + insurance included
            </p>

            <ul className="mt-8 space-y-4">
              {FLEET.map((bike) => (
                <li key={bike.slug} className="relative flex items-end gap-2 sm:gap-3">
                  <span className={`${display.className} text-base uppercase leading-tight sm:text-xl`}>
                    {bike.name}
                  </span>
                  <span
                    aria-hidden
                    className="mb-1 min-w-6 flex-1"
                    style={{ borderBottom: `3px dotted ${INK}8c` }}
                  />
                  <span className={`${display.className} text-2xl leading-none sm:text-3xl`} style={{ color: RED }}>
                    ฿{bike.pricePerDay}
                  </span>
                  {bike.note ? (
                    <span
                      className={`${marker.className} absolute -top-4 right-16 hidden text-sm sm:inline`}
                      style={{ color: RED, transform: "rotate(-3deg)" }}
                    >
                      {bike.note}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-4 text-center" style={{ borderTop: `3px solid ${INK}` }}>
              <p className={`${display.className} text-lg uppercase sm:text-xl`}>
                7 days — pay for 6 <span style={{ color: RED }}>·</span> month from ฿3,000
              </p>
              <p className="mt-1 text-sm font-bold uppercase tracking-[0.12em]" style={{ color: `${INK}99` }}>
                free delivery island-wide · fuel not included (sorry)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-4">
        <a
          href="#book"
          className={`${display.className} px-8 py-4 text-base uppercase tracking-wide`}
          style={{ backgroundColor: INK, color: YELLOW, boxShadow: `5px 5px 0 ${INK}40` }}
        >
          Check the calendar ↓
        </a>
        <a href={CONTACT.phoneHref} className={`${marker.className} text-lg underline underline-offset-4`} style={{ color: INK }}>
          or just call us
        </a>
      </div>
    </section>
  );
}

/** Strip of asphalt with a painted centre line — the divider between sections. */
function RoadDivider() {
  return (
    <div
      aria-hidden
      className="h-12"
      style={{
        backgroundColor: "#2b2b27",
        backgroundImage: `repeating-linear-gradient(90deg, ${YELLOW} 0 44px, transparent 44px 92px)`,
        backgroundSize: "100% 6px",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}

function FilmStrip() {
  const withPhotos = FLEET.filter(
    (b): b is FleetItem & { image: string } => b.image !== null
  );
  return (
    <section id="fleet" className="py-16 md:py-24" style={{ backgroundColor: PAPER }}>
      <div className="mx-auto mb-8 flex max-w-6xl flex-wrap items-end justify-between gap-4 px-5 md:px-10">
        <h2 className={`${display.className} text-3xl uppercase md:text-5xl`}>The fleet, in person</h2>
        <p className={`${marker.className} text-lg`} style={{ color: `${INK}99` }}>
          drag sideways — like browsing the lot →
        </p>
      </div>

      <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 md:px-10" style={{ scrollbarWidth: "thin" }}>
        {withPhotos.map((bike) => (
          <figure key={bike.slug} className="w-[78vw] shrink-0 snap-start sm:w-[420px]">
            <div className="relative aspect-[4/3]" style={{ border: `4px solid ${INK}`, boxShadow: `7px 7px 0 ${INK}26` }}>
              <Image
                src={bike.image}
                alt={bike.name}
                fill
                sizes="(min-width: 640px) 420px, 78vw"
                className="object-cover"
              />
              <span
                className={`${display.className} absolute bottom-0 right-0 px-3 py-1.5 text-xl`}
                style={{ backgroundColor: YELLOW, color: RED, borderTop: `3px solid ${INK}`, borderLeft: `3px solid ${INK}` }}
              >
                ฿{bike.pricePerDay}/day
              </span>
            </div>
            <figcaption className="mt-3">
              <p className={`${display.className} text-lg uppercase`}>{bike.name}</p>
              <p className="mt-1 text-sm" style={{ color: `${INK}99` }}>{bike.sub}</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {bike.specs.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 text-xs font-bold uppercase tracking-[0.1em]"
                    style={{ border: `2px solid ${INK}`, backgroundColor: MINT }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </figcaption>
          </figure>
        ))}

        {/* mountain bike gets a painted card instead of a photo */}
        <figure className="w-[78vw] shrink-0 snap-start sm:w-[420px]">
          <div
            className="relative flex aspect-[4/3] flex-col items-center justify-center px-8 text-center"
            style={{ backgroundColor: INK, border: `4px solid ${INK}`, boxShadow: `7px 7px 0 ${INK}26` }}
          >
            <p className={`${marker.className} text-2xl`} style={{ color: YELLOW }}>
              …and one honest mountain bike
            </p>
            <p className="mt-3 text-sm" style={{ color: `${PAPER}b3` }}>
              No licence, no fuel, no noise. ฿150 a day and the coast road is flat.
            </p>
          </div>
          <figcaption className="mt-3">
            <p className={`${display.className} text-lg uppercase`}>Mountain bike</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {FLEET[5].specs.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 text-xs font-bold uppercase tracking-[0.1em]"
                  style={{ border: `2px solid ${INK}`, backgroundColor: MINT }}
                >
                  {s}
                </span>
              ))}
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
      <h2 className={`${display.className} text-3xl uppercase md:text-5xl`}>Renting, in three stops</h2>

      <ol className="relative mt-12 space-y-12 md:grid md:grid-cols-3 md:gap-10 md:space-y-0">
        {/* the road: vertical on mobile, horizontal on desktop */}
        <span
          aria-hidden
          className="absolute bottom-2 left-[26px] top-2 md:hidden"
          style={{ borderLeft: `4px dashed ${INK}4d` }}
        />
        <span
          aria-hidden
          className="absolute left-[8%] right-[8%] top-[26px] hidden md:block"
          style={{ borderTop: `4px dashed ${INK}4d` }}
        />
        {STOPS.map((stop) => (
          <li key={stop.n} className="relative flex gap-5 md:block">
            <span
              className={`${display.className} relative z-10 flex size-[52px] shrink-0 items-center justify-center rounded-full text-2xl`}
              style={{ backgroundColor: INK, color: YELLOW, border: `4px solid ${MINT}`, boxShadow: `0 0 0 3px ${INK}` }}
            >
              {stop.n}
            </span>
            <div className="md:mt-5">
              <h3 className={`${display.className} text-xl uppercase`}>{stop.title}</h3>
              <p className="mt-2 max-w-sm leading-relaxed" style={{ color: `${INK}b3` }}>
                {stop.text}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Booking() {
  return (
    <section id="book" className="py-16 md:py-24" style={{ backgroundColor: PAPER }}>
      <div className="mx-auto max-w-5xl px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className={`${display.className} text-3xl uppercase md:text-5xl`}>Pick your days</h2>
          <p className={`${marker.className} text-lg`} style={{ color: `${INK}99` }}>
            we confirm by WhatsApp — no deposit online
          </p>
        </div>
        <div className="mt-10">
          <DateRangeBooking
            items={FLEET}
            displayClass={display.className}
            pickerLabel="Off the board"
            ctaLabel="Send it to WhatsApp"
            theme={{
              accent: RED,
              accentText: PAPER,
              text: INK,
              muted: `${INK}99`,
              surface: MINT,
              border: `${INK}59`,
              radius: "4px",
            }}
          />
        </div>
      </div>
    </section>
  );
}

function StickerFooter() {
  const year = format(new Date(), "yyyy");
  const stickers: readonly { label: string; href: string | null; bg: string; fg: string; tilt: string }[] = [
    { label: "Loop Island Rides ★", href: null, bg: YELLOW, fg: INK, tilt: "rotate(-2deg)" },
    { label: CONTACT.phone, href: CONTACT.phoneHref, bg: PAPER, fg: INK, tilt: "rotate(1.5deg)" },
    { label: CONTACT.address, href: null, bg: MINT, fg: INK, tilt: "rotate(-1deg)" },
    { label: CONTACT.instagramHandle, href: CONTACT.instagram, bg: RED, fg: PAPER, tilt: "rotate(2deg)" },
    { label: "100% fictional demo", href: null, bg: PAPER, fg: RED, tilt: "rotate(-2.5deg)" },
  ];
  return (
    <footer style={{ backgroundColor: INK }}>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-5 px-5 pb-6 pt-10 md:px-10">
        {stickers.map((s) => {
          const chip = (
            <span
              className={`${display.className} inline-block px-4 py-2 text-sm uppercase tracking-wide`}
              style={{ backgroundColor: s.bg, color: s.fg, borderRadius: "3px", transform: s.tilt, boxShadow: `3px 3px 0 #00000059` }}
            >
              {s.label}
            </span>
          );
          return s.href ? (
            <a key={s.label} href={s.href} className="transition-transform hover:scale-105">
              {chip}
            </a>
          ) : (
            <span key={s.label}>{chip}</span>
          );
        })}
      </div>
      <p className="pb-8 text-center text-xs uppercase tracking-[0.25em]" style={{ color: `${PAPER}59` }}>
        © {year} Loop Island Rides — a fictional demo shop · Rental layout
      </p>
    </footer>
  );
}

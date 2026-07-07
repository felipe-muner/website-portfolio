import type { Metadata } from "next";
import type { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lora, Pirata_One, Special_Elite } from "next/font/google";
import { format, getYear } from "date-fns";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { SlotBooking, type SlotOption } from "@/components/layouts/SlotBooking";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Business Layout — Lucky Hand Tattoo",
  robots: { index: false },
};

const display = Pirata_One({ subsets: ["latin"], weight: "400" });
const mono = Special_Elite({ subsets: ["latin"], weight: "400" });
const body = Lora({ subsets: ["latin"], weight: ["400", "500", "600"] });

const PAPER = "#e9ddbf";
const PAPER_LIGHT = "#f2e9d2";
const INK = "#1e1a14";
const INK_SOFT = "#1e1a14b3";
const RED = "#a4372b";

/* ---------------------------------------------------------------- flash data */

type FlashIcon = (props: { className?: string }) => ReactElement;

interface FlashDesign {
  name: string;
  size: string;
  price: number;
  taken?: boolean;
  tilt: string;
  icon: FlashIcon;
}

function iconProps(className?: string) {
  return {
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    className,
  } as const;
}

const DaggerIcon: FlashIcon = ({ className }) => (
  <svg {...iconProps(className)}>
    <path d="M24 44 20 32 V16 h8 v16 Z" />
    <path d="M13 16 h22 M24 10 v6 M20 21 h8" />
    <circle cx="24" cy="7" r="3" />
  </svg>
);

const SwallowIcon: FlashIcon = ({ className }) => (
  <svg {...iconProps(className)}>
    <path d="M6 14 Q15 5 24 15 Q33 5 42 14" />
    <path d="M11 19 Q17 14 23 19" />
    <path d="M24 15 q3 10 -2 18 l-5 8 m5 -8 l8 5" />
  </svg>
);

const SnakeIcon: FlashIcon = ({ className }) => (
  <svg {...iconProps(className)}>
    <path d="M33 11 c8 4 5 10 -3 12 l-13 3 c-8 2 -9 8 -1 10 h13 c6 0 8 5 2 8" />
    <circle cx="32" cy="8" r="3" />
    <path d="M35 6 l4 -3" />
  </svg>
);

const RoseIcon: FlashIcon = ({ className }) => (
  <svg {...iconProps(className)}>
    <path d="M24 26 c-5 0 -7 -4 -4 -7 c3 -3 8 -1 8 3 c0 3 -3 4 -4 2" />
    <path d="M24 30 c-7 0 -11 -5 -9 -12 M24 30 c7 0 11 -5 9 -12" />
    <path d="M24 30 V44 M24 37 c-4 -1 -6 -4 -6 -7 M24 41 c4 -1 6 -4 6 -7" />
  </svg>
);

const AnchorIcon: FlashIcon = ({ className }) => (
  <svg {...iconProps(className)}>
    <circle cx="24" cy="8" r="4" />
    <path d="M24 12 V40 M14 20 h20" />
    <path d="M10 29 q3 13 14 13 q11 0 14 -13" />
    <path d="M10 29 l6 3 M38 29 l-6 3" />
  </svg>
);

const SunIcon: FlashIcon = ({ className }) => (
  <svg {...iconProps(className)}>
    <circle cx="24" cy="24" r="9" />
    <path d="M24 4 v6 M24 38 v6 M4 24 h6 M38 24 h6 M9.5 9.5 l4 4 M34.5 34.5 l4 4 M38.5 9.5 l-4 4 M13.5 34.5 l-4 4" />
  </svg>
);

const MoonIcon: FlashIcon = ({ className }) => (
  <svg {...iconProps(className)}>
    <path d="M30 5 a19 19 0 1 0 0 38 a15.5 15.5 0 1 1 0 -38 Z" />
    <path d="M36 19 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5 Z" />
  </svg>
);

const LotusIcon: FlashIcon = ({ className }) => (
  <svg {...iconProps(className)}>
    <path d="M24 8 q6 10 0 20 q-6 -10 0 -20" />
    <path d="M24 28 q-12 -2 -16 -13 q12 2 16 13" />
    <path d="M24 28 q12 -2 16 -13 q-12 2 -16 13" />
    <path d="M10 33 q14 8 28 0" />
  </svg>
);

const FLASH: readonly FlashDesign[] = [
  { name: "Lucky Dagger", size: "6 × 14 cm", price: 2200, tilt: "-rotate-1", icon: DaggerIcon },
  { name: "Storm Swallow", size: "8 × 6 cm", price: 1800, tilt: "rotate-[0.6deg]", icon: SwallowIcon },
  { name: "Garden Snake", size: "5 × 16 cm", price: 2600, taken: true, tilt: "rotate-1", icon: SnakeIcon },
  { name: "Haad Rin Rose", size: "8 × 10 cm", price: 2400, tilt: "-rotate-[0.5deg]", icon: RoseIcon },
  { name: "Hold-Fast Anchor", size: "7 × 9 cm", price: 2000, tilt: "rotate-[0.8deg]", icon: AnchorIcon },
  { name: "Rising Sun", size: "9 × 9 cm", price: 2400, tilt: "-rotate-[0.7deg]", icon: SunIcon },
  { name: "Full Moon", size: "7 × 8 cm", price: 2000, taken: true, tilt: "rotate-[0.4deg]", icon: MoonIcon },
  { name: "Open Lotus", size: "10 × 8 cm", price: 2800, tilt: "-rotate-1", icon: LotusIcon },
];

/* -------------------------------------------------------------- artists data */

const ARTISTS: readonly (SlotOption & {
  image: string;
  alt: string;
  since: number;
  tags: readonly string[];
})[] = [
  {
    slug: "mai",
    name: "Mai",
    sub: "Draws from the garden: orchids, vines, single-needle script.",
    price: 1000,
    image: "/img/layouts/tattoo-2.jpg",
    alt: "Fine-line botanical tattoo work by Mai",
    since: 2019,
    tags: ["fine line", "botanical", "script"],
  },
  {
    slug: "juan",
    name: "Juan",
    sub: "Bold lines, packed colour. The flash wall is mostly his.",
    price: 1000,
    image: "/img/layouts/tattoo-3.jpg",
    alt: "Neo-traditional colour tattoo work by Juan",
    since: 2016,
    tags: ["neo-traditional", "colour", "flash"],
  },
  {
    slug: "ploy",
    name: "Ploy",
    sub: "Sleeves and back pieces measured in months, not hours.",
    price: 1500,
    image: "/img/layouts/tattoo-1.jpg",
    alt: "Japanese-style sleeve in progress by Ploy",
    since: 2016,
    tags: ["irezumi", "blackwork", "large scale"],
  },
  {
    slug: "sak",
    name: "Ajarn Sak",
    sub: "Hand-poked bamboo work in the old way, blessing included.",
    price: 800,
    image: "/img/layouts/tattoo-4.jpg",
    alt: "Traditional bamboo hand-poke tattoo by Ajarn Sak",
    since: 2004,
    tags: ["sak yant", "bamboo", "hand poke"],
  },
];

/* ------------------------------------------------------------ aftercare data */

const AFTERCARE: readonly { window: string; rule: string }[] = [
  { window: "First 3 hours", rule: "Leave the wrap on. Yes, even at the beach bar. Especially at the beach bar." },
  { window: "First wash", rule: "Lukewarm water, fragrance-free soap, fingertips only. Pat dry with clean paper towel — never a shared towel." },
  { window: "Days 1–3", rule: "Thin layer of unscented balm two or three times a day. Thin means thin; a shiny tattoo is an over-greased tattoo." },
  { window: "Days 4–14", rule: "It flakes and it itches. Slap, don't scratch. Never pick — you would be pulling ink out, not skin off." },
  { window: "Weeks 2–4", rule: "No sea, no pool, no midday sun. Quick showers are fine; soaking is not. The island will still be there." },
  { window: "Forever", rule: "SPF 50 on healed work. Sun is the only thing on this island that fades our lines." },
];

/* --------------------------------------------------------------------- page */

export default function TattooLayout() {
  return (
    <div
      className={body.className}
      style={{
        backgroundColor: PAPER,
        color: INK,
        backgroundImage:
          "radial-gradient(620px 420px at 85% 6%, rgba(122,82,24,0.08), transparent 70%), radial-gradient(520px 520px at 6% 55%, rgba(122,82,24,0.06), transparent 70%), radial-gradient(700px 480px at 60% 100%, rgba(94,62,20,0.06), transparent 70%)",
      }}
    >
      <style>{`
        @keyframes lucky-stamp-in {
          from { opacity: 0; transform: scale(1.6); }
          to { opacity: 0.92; transform: scale(1); }
        }
        .lucky-stamp { animation: lucky-stamp-in 0.35s ease-out 0.5s both; }
        .lucky-stamp-late { animation-delay: 1s; }
        @media (prefers-reduced-motion: reduce) {
          .lucky-stamp { animation: none; opacity: 0.92; }
        }
      `}</style>
      <Masthead />
      <FlashSheet />
      <Letter />
      <Artists />
      <Aftercare />
      <Booking />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

/* ----------------------------------------------------------------- masthead */

function Masthead() {
  return (
    <header className="mx-auto max-w-5xl px-5 pt-10 md:px-10">
      <div className="border-y-4 border-double py-6 text-center" style={{ borderColor: INK }}>
        <p className={`${mono.className} text-[11px] uppercase tracking-[0.35em]`} style={{ color: INK_SOFT }}>
          Koh Phangan · Thailand · est. 2016
        </p>
        <Link href="/" className="mt-2 block">
          <span className={`${display.className} text-6xl leading-none sm:text-7xl md:text-8xl`}>
            Lucky Hand Tattoo
          </span>
        </Link>
        <p className={`${mono.className} mt-3 text-xs uppercase tracking-[0.2em]`} style={{ color: INK_SOFT }}>
          custom tattoo — sak yant — walk-in flash
        </p>
      </div>
      <nav
        className={`${mono.className} flex flex-wrap items-center justify-center gap-x-6 gap-y-1 border-b py-3 text-xs uppercase tracking-[0.18em]`}
        style={{ borderColor: `${INK}55` }}
        aria-label="Page sections"
      >
        <a href="#flash" className="underline-offset-4 hover:underline">The wall</a>
        <a href="#letter" className="underline-offset-4 hover:underline">The letter</a>
        <a href="#artists" className="underline-offset-4 hover:underline">The hands</a>
        <a href="#aftercare" className="underline-offset-4 hover:underline">Aftercare</a>
        <a href="#book" className="underline-offset-4 hover:underline">Book a consult</a>
      </nav>
    </header>
  );
}

/* -------------------------------------------------------- hero: flash sheet */

function FlashSheet() {
  let stampCount = 0;
  return (
    <section id="flash" className="mx-auto max-w-5xl px-5 py-14 md:px-10 md:py-20">
      <div
        className="border-2 p-4 sm:p-6"
        style={{ borderColor: INK, outline: `1px solid ${INK}`, outlineOffset: "5px", backgroundColor: PAPER_LIGHT }}
      >
        <div
          className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b-2 pb-4"
          style={{ borderColor: INK }}
        >
          <h1 className={`${display.className} text-4xl sm:text-5xl`}>
            Flash Sheet <span style={{ color: RED }}>Nº 12</span>
          </h1>
          <p className={`${mono.className} text-[11px] uppercase tracking-[0.16em]`} style={{ color: INK_SOFT }}>
            every design inked once, then crossed off the wall
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {FLASH.map((f) => {
            const stampIndex = f.taken ? stampCount++ : 0;
            return (
              <div
                key={f.name}
                className={`relative flex flex-col items-center border px-3 pb-4 pt-5 text-center ${f.tilt}`}
                style={{ borderColor: `${INK}99`, backgroundColor: PAPER_LIGHT }}
              >
                <span className="absolute left-2 top-2 size-1.5 rounded-full" style={{ backgroundColor: `${INK}88` }} />
                <span className="absolute right-2 top-2 size-1.5 rounded-full" style={{ backgroundColor: `${INK}88` }} />
                <f.icon className="size-16 sm:size-20" />
                <p className={`${display.className} mt-3 text-xl leading-tight sm:text-2xl`}>{f.name}</p>
                <p className={`${mono.className} mt-1 text-[10px] uppercase tracking-[0.14em]`} style={{ color: INK_SOFT }}>
                  {f.size}
                </p>
                <p className={`${mono.className} mt-2 text-sm`} style={{ color: f.taken ? INK_SOFT : RED }}>
                  {f.taken ? <s>฿{f.price.toLocaleString()}</s> : `฿${f.price.toLocaleString()}`}
                </p>
                {f.taken && (
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className={stampIndex % 2 === 0 ? "-rotate-12" : "rotate-6"}>
                      <span
                        className={`${mono.className} lucky-stamp ${stampIndex % 2 === 1 ? "lucky-stamp-late" : ""} block border-2 px-3 py-1 text-lg uppercase tracking-[0.2em]`}
                        style={{ borderColor: RED, color: RED, backgroundColor: `${PAPER_LIGHT}cc` }}
                      >
                        Taken
                      </span>
                    </span>
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <p
          className={`${mono.className} mt-6 border-t pt-4 text-center text-[11px] uppercase tracking-[0.16em]`}
          style={{ borderColor: `${INK}55`, color: INK_SOFT }}
        >
          flash is first come, first inked — point at the wall, sit down, done the same day
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- typewritten letter */

function Letter() {
  return (
    <section id="letter" className="mx-auto max-w-5xl px-5 pb-14 md:px-10 md:pb-20">
      <div className="mx-auto max-w-2xl">
        <div
          className={`${mono.className} relative -rotate-[0.4deg] border px-6 py-10 sm:px-12`}
          style={{
            borderColor: `${INK}66`,
            backgroundColor: PAPER_LIGHT,
            boxShadow: "4px 5px 0 rgba(30,26,20,0.12)",
          }}
        >
          <p className="text-[11px] uppercase tracking-[0.3em]" style={{ color: INK_SOFT }}>
            Lucky Hand Tattoo · four chairs · Koh Phangan
          </p>
          <p className="mt-6 text-sm" style={{ color: INK_SOFT }}>
            {format(new Date(), "d MMMM yyyy")}
          </p>
          <p className="mt-6 text-sm leading-7">Dear future regular,</p>
          <p className="mt-5 text-sm leading-7">
            We opened this studio in 2016 with two machines, a rented shophouse
            and one promise: nothing leaves this shop that we would not wear
            ourselves.
          </p>
          <p className="mt-5 text-sm leading-7">
            Everything on the wall sheet is drawn in-house and inked exactly
            once. When a design is taken we cross it off and draw a new one.
            Custom work is by appointment — bring an idea, not a screenshot,
            and give us a day to draw it properly.
          </p>
          <p className="mt-5 text-sm leading-7">
            Needles are single-use. Ink caps are single-use. The autoclave log
            sits on the counter if you would like to read it. We tattoo sober
            clients, adults only, and we will gladly talk you out of your
            friend&apos;s name.
          </p>
          <p className="mt-8 text-sm leading-7">
            — Mai, Juan, Ploy &amp; Ajarn Sak
          </p>
          <span
            className="pointer-events-none absolute -right-3 -top-4 rotate-12 rounded-full border-2 px-4 py-5 text-[10px] uppercase tracking-[0.2em]"
            style={{ borderColor: RED, color: RED, opacity: 0.8 }}
            aria-hidden
          >
            read<br />first
          </span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- artist trading cards */

function Artists() {
  return (
    <section id="artists" className="mx-auto max-w-5xl px-5 pb-14 md:px-10 md:pb-20">
      <div className="flex items-baseline justify-between gap-6 border-b-2 pb-3" style={{ borderColor: INK }}>
        <h2 className={`${display.className} text-4xl sm:text-5xl`}>The Hands</h2>
        <p className={`${mono.className} text-[11px] uppercase tracking-[0.16em]`} style={{ color: INK_SOFT }}>
          collect all four
        </p>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ARTISTS.map((a, i) => (
          <article
            key={a.slug}
            className={`border-2 p-3 ${i % 2 === 0 ? "-rotate-[0.4deg]" : "rotate-[0.4deg]"}`}
            style={{ borderColor: INK, backgroundColor: PAPER_LIGHT, boxShadow: "3px 4px 0 rgba(30,26,20,0.12)" }}
          >
            <div
              className={`${mono.className} flex items-baseline justify-between text-[10px] uppercase tracking-[0.16em]`}
              style={{ color: INK_SOFT }}
            >
              <span>Card {i + 1} of {ARTISTS.length}</span>
              <span>since {a.since}</span>
            </div>
            <div className="relative mt-2 aspect-[4/5] border" style={{ borderColor: `${INK}66` }}>
              <Image
                src={a.image}
                alt={a.alt}
                fill
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                className="object-cover grayscale contrast-125"
              />
            </div>
            <h3 className={`${display.className} mt-3 text-3xl`}>{a.name}</h3>
            <p className="mt-1 text-sm leading-6" style={{ color: INK_SOFT }}>{a.sub}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`${a.name} specialties`}>
              {a.tags.map((t) => (
                <li
                  key={t}
                  className={`${mono.className} border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em]`}
                  style={{ borderColor: `${INK}66`, color: INK_SOFT }}
                >
                  {t}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------- aftercare instruction */

function Aftercare() {
  return (
    <section id="aftercare" className="mx-auto max-w-5xl px-5 pb-14 md:px-10 md:pb-20">
      <div className="mx-auto max-w-3xl border-2 p-6 sm:p-10" style={{ borderColor: INK, backgroundColor: PAPER_LIGHT }}>
        <h2 className={`${display.className} text-4xl sm:text-5xl`}>Aftercare</h2>
        <p className={`${mono.className} mt-2 text-[11px] uppercase tracking-[0.16em]`} style={{ color: INK_SOFT }}>
          this slip goes home with every tattoo — read twice, follow once
        </p>
        <ol className="mt-8">
          {AFTERCARE.map((step, i) => (
            <li
              key={step.window}
              className={`flex gap-5 py-5 ${i > 0 ? "border-t border-dashed" : ""}`}
              style={{ borderColor: `${INK}44` }}
            >
              <span
                className={`${mono.className} flex size-9 shrink-0 items-center justify-center border-2 text-base`}
                style={{ borderColor: INK }}
                aria-hidden
              >
                {i + 1}
              </span>
              <div>
                <h3 className={`${mono.className} text-xs uppercase tracking-[0.18em]`} style={{ color: RED }}>
                  {step.window}
                </h3>
                <p className="mt-1.5 leading-7">{step.rule}</p>
              </div>
            </li>
          ))}
        </ol>
        <p
          className={`${mono.className} border-t-2 pt-5 text-center text-xs uppercase tracking-[0.14em]`}
          style={{ borderColor: INK, color: INK_SOFT }}
        >
          hot, swollen or weeping after day three? message us — not the internet
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- booking */

function Booking() {
  return (
    <section id="book" className="mx-auto max-w-5xl px-5 pb-16 md:px-10 md:pb-24">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b-2 pb-3" style={{ borderColor: INK }}>
        <h2 className={`${display.className} text-4xl sm:text-5xl`}>Claim a Chair</h2>
        <p className={`${mono.className} text-[11px] uppercase tracking-[0.16em]`} style={{ color: INK_SOFT }}>
          flash is walk-in · custom starts with a consult
        </p>
      </div>
      <p className="mt-4 max-w-xl leading-7" style={{ color: INK_SOFT }}>
        Pick an artist and a day. The deposit holds your consult and comes off
        the final price of the tattoo.
      </p>
      <div className="mt-8">
        <SlotBooking
          options={ARTISTS}
          displayClass={display.className}
          pickerLabel="Choose your artist"
          priceUnit="deposit"
          variants={{ label: "Style", items: ["Fine line", "Neo-traditional", "Irezumi", "Blackwork", "Sak Yant"] }}
          ctaLabel="Request this consult"
          note="Deposit is redeemable against your tattoo."
          theme={{
            accent: RED,
            accentText: PAPER_LIGHT,
            text: INK,
            muted: INK_SOFT,
            surface: PAPER_LIGHT,
            border: `${INK}55`,
            radius: "2px",
          }}
        />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- footer */

function Footer() {
  return (
    <footer className="border-t-4 border-double" style={{ borderColor: INK }}>
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-8 gap-y-6 px-5 py-10 md:px-10">
        <svg viewBox="0 0 96 96" className="size-24 shrink-0 -rotate-6" style={{ color: RED, opacity: 0.85 }} aria-hidden>
          <circle cx="48" cy="48" r="45" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="48" cy="48" r="31" fill="none" stroke="currentColor" strokeWidth="1" />
          <path id="lucky-stamp-arc" d="M48 12 a36 36 0 1 1 -0.01 0" fill="none" />
          <text className={mono.className} fill="currentColor" fontSize="9.5" letterSpacing="1.5">
            <textPath href="#lucky-stamp-arc">LUCKY HAND TATTOO · KOH PHANGAN ·</textPath>
          </text>
          <path d="M40 40 l16 16 M56 40 l-16 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className={`${mono.className} min-w-0 text-xs leading-6`} style={{ color: INK_SOFT }}>
          <p className="uppercase tracking-[0.14em]">
            {CONTACT.address} ·{" "}
            <a href={CONTACT.phoneHref} className="underline-offset-4 hover:underline" style={{ color: INK }}>
              {CONTACT.phone}
            </a>{" "}
            ·{" "}
            <a href={CONTACT.instagram} className="underline-offset-4 hover:underline" style={{ color: INK }}>
              {CONTACT.instagramHandle}
            </a>
          </p>
          <p className="mt-2 uppercase tracking-[0.14em]">
            walk-ins for flash · custom by appointment · over-18s only
          </p>
          <p className="mt-2 uppercase tracking-[0.14em]">
            © {getYear(new Date())} Lucky Hand Tattoo — fictional demo · tattoo-studio layout
          </p>
        </div>
      </div>
    </footer>
  );
}

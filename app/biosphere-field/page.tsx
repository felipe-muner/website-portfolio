import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";
import { Fraunces, Karla, IBM_Plex_Mono } from "next/font/google";
import logoImg from "@/public/img/layouts/biosphere-logo.png";
import heroImg from "@/public/img/layouts/biosphere-hero.jpg";
import earthImg from "@/public/img/layouts/biosphere-earth.jpg";
import waterImg from "@/public/img/layouts/biosphere-water.jpg";
import windImg from "@/public/img/layouts/biosphere-wind.jpg";
import fireImg from "@/public/img/layouts/biosphere-fire.jpg";
import casaImg from "@/public/img/layouts/biosphere-casa.jpg";
import buildImg from "@/public/img/layouts/biosphere-build.jpg";
import communityImg from "@/public/img/layouts/biosphere-community.jpg";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { BiosphereMobileMenu } from "@/components/layouts/biosphere/mobile-menu";
import { SmoothScroll } from "@/components/layouts/portfolio/smooth-scroll";
import { SlotBooking, type SlotOption } from "@/components/layouts/SlotBooking";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Business Layout — Biosphere Field Guide",
  robots: { index: false },
};

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});
const body = Karla({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"] });

/* Field-guide palette: pale meadow paper, deep conifer plates, dried pollen. */
const FIELD = "#f0f2e9";
const MOUNT = "#22382b";
const PALE = "#e8eddd";
const INK = "#1d2b21";
const POLLEN = "#c2851f";
const HAIRLINE = "rgba(29, 43, 33, 0.18)";
const MUTED = "rgba(29, 43, 33, 0.66)";

type ElementKind = "earth" | "water" | "wind" | "fire";

/** Classical alchemical marks: ▲ fire, ▽ water, barred ▲ wind, barred ▽ earth. */
function ElementGlyph({
  kind,
  color,
  size = 20,
}: {
  kind: ElementKind;
  color: string;
  size?: number;
}) {
  const up = kind === "fire" || kind === "wind";
  const barred = kind === "wind" || kind === "earth";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      {up ? (
        <path d="M12 3.5 L21 20 H3 Z" stroke={color} strokeWidth="1.4" />
      ) : (
        <path d="M12 20.5 L3 4 H21 Z" stroke={color} strokeWidth="1.4" />
      )}
      {barred && (
        <line
          x1="6.5"
          y1={up ? 14.5 : 9.5}
          x2="17.5"
          y2={up ? 14.5 : 9.5}
          stroke={color}
          strokeWidth="1.4"
        />
      )}
    </svg>
  );
}

/**
 * The template's signature: a herbarium plate. Dark conifer mount with a
 * double rule, a strip of translucent tape at the top, and a catalog label
 * along the bottom edge — everything on the pale page is pressed onto one.
 */
function Plate({
  label,
  catalog,
  tilt = "",
  children,
}: {
  label: string;
  catalog: string;
  /** e.g. "rotate-1" — plates sit on the page like pressed specimens. */
  tilt?: string;
  children: ReactNode;
}) {
  return (
    <div className={`relative ${tilt}`} style={{ backgroundColor: MOUNT, color: PALE }}>
      <span
        aria-hidden
        className="absolute -top-2.5 left-1/2 z-10 h-5 w-20 -translate-x-1/2 -rotate-2"
        style={{ backgroundColor: "rgba(232, 237, 221, 0.6)" }}
      />
      <div className="border p-4 sm:p-5" style={{ borderColor: "rgba(232, 237, 221, 0.25)" }}>
        <div className="border p-4 sm:p-5" style={{ borderColor: "rgba(232, 237, 221, 0.16)" }}>
          {children}
        </div>
        <p
          className={`${mono.className} mt-3 flex items-baseline justify-between gap-3 text-[9px] uppercase tracking-[0.22em]`}
          style={{ color: "rgba(232, 237, 221, 0.6)" }}
        >
          <span>{label}</span>
          <span>{catalog}</span>
        </p>
      </div>
    </div>
  );
}

/**
 * Engraved field-guide figures, one per phase of the year — pale line
 * drawings on the dark note cards, gold where the work (or the sun) is.
 */
function PhaseFigure({
  index,
  stroke = "rgba(232, 237, 221, 0.72)",
  fill = "rgba(232, 237, 221, 0.6)",
}: {
  index: number;
  stroke?: string;
  fill?: string;
}) {
  return (
    <svg viewBox="0 0 64 48" className="h-11 w-[3.75rem]" aria-hidden>
      <g
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {index === 0 && (
          <>
            {/* walking the land: contours, footsteps, a survey pennant */}
            <path d="M4 38 C 12 28, 22 28, 30 34 C 38 40, 48 40, 60 32" />
            <path d="M10 43 C 20 37, 34 39, 44 43" opacity={0.55} />
            <path d="M40 33 V12" />
            <path d="M40 12 C 45 13.5, 49 13, 53 11 C 50 16, 45 17.5, 40 18 Z" fill={fill} stroke="none" />
            {[
              [14, 33.5],
              [20, 30.5],
              [26, 31.5],
            ].map(([cx, cy]) => (
              <circle key={cx} cx={cx} cy={cy} r={1} fill={fill} stroke="none" />
            ))}
          </>
        )}
        {index === 1 && (
          <>
            {/* the one drawing: a scroll-edged plan, footprint and contours */}
            <path d="M13 9 H51 V39 H13 Z" />
            <path d="M13 9 C 8.5 9.5, 8.5 15, 13 15.5" />
            <path d="M21 14 h9 v7 h-9 z" />
            <path d="M19 31 C 25 24, 35 23, 45 29" strokeDasharray="3 3" />
            <path d="M42 14 v6 M39 17 h6" />
          </>
        )}
        {index === 2 && (
          <>
            {/* frame rising, joints lashed in pollen gold */}
            <path d="M20 41 V12 M18.5 32 h3 M18.5 22 h3" />
            <path d="M44 41 V12 M42.5 30 h3 M42.5 20 h3" />
            <path d="M13 14 H51" />
            <path d="M20 38 L44 16" />
            <path d="M17.5 11.5 l5 5 M22.5 11.5 l-5 5" stroke={POLLEN} />
            <path d="M41.5 11.5 l5 5 M46.5 11.5 l-5 5" stroke={POLLEN} />
          </>
        )}
        {index === 3 && (
          <>
            {/* a lantern lit, a garden potted */}
            <path d="M23 6 V12" />
            <path d="M23 12 C 16 12, 14 18, 14 23 C 14 29, 18 32, 23 32 C 28 32, 32 29, 32 23 C 32 18, 30 12, 23 12 Z" />
            <path d="M14.5 22 H31.5" opacity={0.55} />
            <path d="M23 32 V36" />
            <path d="M42 35 H54 L52.5 41 H43.5 Z" />
            <path d="M47 35 C 47 29, 44 26, 41 23" />
            <path d="M48.5 35 C 49 28, 52 26, 55 22" />
            <path d="M41 23 C 37.5 21, 36 17.5, 37 14 C 40.5 16, 42 19.5, 41 23 Z" fill={fill} stroke="none" />
            <path d="M55 22 C 58.5 20, 60 16.5, 59 13 C 55.5 15, 54 18.5, 55 22 Z" fill={fill} stroke="none" />
          </>
        )}
        {index === 4 && (
          <>
            {/* the team, ready at the door */}
            <path d="M11.5 41 C 13 32.5, 23 32.5, 24.5 41" />
            <path d="M25 41 C 26.5 30, 37.5 30, 39 41" />
            <path d="M39.5 41 C 41 32.5, 51 32.5, 52.5 41" />
            <circle cx={18} cy={26.5} r={2.4} fill={fill} stroke="none" />
            <circle cx={32} cy={23.5} r={2.6} fill={fill} stroke="none" />
            <circle cx={46} cy={26.5} r={2.4} fill={fill} stroke="none" />
          </>
        )}
        {index === 5 && (
          <>
            {/* doors open: the house under green, sun risen in pollen gold */}
            <path d="M10 27 C 18 14, 46 14, 54 27" />
            <path d="M17 27 V41 M47 27 V41" />
            <path d="M10 41 H54" />
            <path d="M28.5 41 V33.5 C 28.5 31.5, 35.5 31.5, 35.5 33.5 V41" />
            <path d="M8 41 C 9.5 32, 12 24, 17 16" />
            <path d="M17 16 C 20 12.5, 24.5 11, 29 12 C 25.5 15.5, 21 16.8, 17 16 Z" fill={fill} stroke="none" />
            <path d="M14.5 22 C 11 19.5, 9.5 16, 10 12.5 C 13.5 15, 15 18.5, 14.5 22 Z" fill={fill} stroke="none" />
            <path d="M56 41 c 1 -2.5, 1 -4, .5 -5.5 M60 41 c .8 -2, 1.4 -3.2, 2.6 -4" />
            <circle cx={50} cy={10} r={4} fill={POLLEN} stroke="none" />
          </>
        )}
      </g>
    </svg>
  );
}

const ELEMENTS: readonly {
  id: ElementKind;
  numeral: string;
  name: string;
  image: StaticImageData;
  line: string;
  text: string;
  chips: readonly string[];
}[] = [
  {
    id: "earth",
    numeral: "I",
    name: "Earth",
    image: earthImg,
    line: "Every masterplan starts under your feet.",
    text: "We read soil, slope and stone before drawing a single wall. Terraces, swales and access roads are shaped from the land's own contours — so what gets built feels found, not forced.",
    chips: ["Land audit & masterplan", "Soil & terracing", "Architecture & construction"],
  },
  {
    id: "water",
    numeral: "II",
    name: "Water",
    image: waterImg,
    line: "Water decides where life gathers.",
    text: "Spring, rain and greywater are mapped into one living cycle: swales slow it, ponds hold it, gardens drink it. Pools sit exactly where the land already wants water to rest.",
    chips: ["Hydrology & swales", "Pools & ponds", "Ecology & reforestation"],
  },
  {
    id: "wind",
    numeral: "III",
    name: "Wind",
    image: windImg,
    line: "The invisible layers carry the plan.",
    text: "Breeze paths cool the buildings before electricity has to; drones read the canopy from above; titles, permits and governance move quietly underneath. Everything you don't see — handled.",
    chips: ["Nature intelligence & survey", "Passive cooling & orientation", "Legal & governance"],
  },
  {
    id: "fire",
    numeral: "IV",
    name: "Fire",
    image: fireImg,
    line: "A place is finished when people gather in it.",
    text: "Kitchens, fire pits and lantern light turn a masterplan into a living address. We train the team, open the doors and stay through the first season of hospitality.",
    chips: ["Hospitality & operations", "Community & events", "Brand & business"],
  },
];

const PHASES = [
  { n: "01", months: "Month 1", title: "Discovery & Strategy", text: "Understanding the land, defining the vision and establishing the legal foundation for the project." },
  { n: "02", months: "Months 2–3", title: "Master Planning", text: "Creating the masterplan, environmental strategy and infrastructure that will guide every future decision." },
  { n: "03", months: "Months 4–8", title: "Building With Nature", text: "Architecture, landscape and engineering come together as one integrated system." },
  { n: "04", months: "Months 9–11", title: "Crafting the Experience", text: "Interiors, gardens and shared spaces are refined to create a meaningful connection between people and place." },
  { n: "05", months: "Month 11", title: "Activation", text: "Operations, hospitality and management systems are prepared for a seamless launch." },
  { n: "06", months: "Month 12", title: "A Place Comes to Life", text: "The vision becomes reality — a destination where nature, people and purpose exist in harmony." },
] as const;

type YearState = "complete" | "build" | "planned";

/** Month spans for the collection calendar, drawn to scale like a phenology chart. */
const YEAR: readonly { start: number; end: number; state: YearState }[] = [
  { start: 1, end: 1, state: "complete" },
  { start: 2, end: 3, state: "complete" },
  { start: 4, end: 8, state: "build" },
  { start: 9, end: 11, state: "planned" },
  { start: 11, end: 11, state: "planned" },
  { start: 12, end: 12, state: "planned" },
];

function yearBarStyle(state: YearState): CSSProperties {
  if (state === "complete") {
    return { backgroundColor: MOUNT, color: PALE, border: `1px solid ${MOUNT}` };
  }
  if (state === "build") {
    return {
      border: `1px solid ${MOUNT}`,
      backgroundImage: "repeating-linear-gradient(45deg, rgba(34, 56, 43, 0.3) 0 4px, transparent 4px 9px)",
      color: INK,
    };
  }
  return { border: `1.5px dashed ${POLLEN}`, color: "#7d5613" };
}

const PROJECTS = [
  {
    id: "la-casa",
    name: "La Casa — The Fibonacci",
    image: casaImg,
    note: "A spiral of shared pavilions where the golden ratio sets every room's proportion.",
    status: "Completed · 14 months",
    catalog: "BSP-C1",
  },
  {
    id: "the-bay",
    name: "The Bay",
    image: buildImg,
    note: "A tide-facing hillside raised entirely in bamboo — currently in its build season.",
    status: "In progress · phase 03",
    catalog: "BSP-C2",
  },
] as const;

const VISITS: readonly SlotOption[] = [
  { slug: "walk", name: "Land discovery walk", sub: "Two hours on your plot, first impressions on paper", price: 2500 },
  { slug: "masterplan", name: "Masterplan day", sub: "Full-day session — contours, water, phasing, budget", price: 12000 },
  { slug: "tour", name: "Project site tour", sub: "Visit La Casa and The Bay with the design team", price: 6500 },
];

const NAV = [
  { label: "About", href: "#about" },
  { label: "Specimens", href: "#specimens" },
  { label: "Projects", href: "#projects" },
  { label: "Events", href: "#events" },
  { label: "Contact", href: "#contact" },
] as const;

export default function BiosphereFieldPage() {
  return (
    <div
      className={`${body.className} min-h-dvh antialiased`}
      style={{ backgroundColor: FIELD, color: INK }}
    >
      <SmoothScroll />

      {/* Nav */}
      <header
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{ borderColor: HAIRLINE, backgroundColor: "rgba(240, 242, 233, 0.9)" }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <a href="#top" className="flex items-center gap-3" style={{ color: INK }}>
            <Image src={logoImg} alt="" width={32} height={32} priority className="size-8" />
            <span className={`${display.className} text-lg tracking-[0.26em]`}>BIOSPHERE</span>
          </a>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex" style={{ color: MUTED }}>
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="transition-colors hover:text-[#1d2b21]">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <a
              href="#events"
              className="hidden rounded-full px-5 py-2.5 text-sm font-semibold transition hover:opacity-90 sm:inline-block"
              style={{ backgroundColor: MOUNT, color: PALE }}
            >
              Walk the land
            </a>
            <BiosphereMobileMenu
              links={NAV}
              cta={{ label: "Walk the land", href: "#events" }}
              triggerColor={INK}
              panelStyle={{ backgroundColor: MOUNT, color: PALE, borderColor: "rgba(232, 237, 221, 0.2)" }}
              linkClassName={`${display.className} text-2xl`}
              ctaClassName="rounded-full px-6 py-3 text-center text-sm font-semibold"
              ctaStyle={{ backgroundColor: POLLEN, color: INK }}
            />
          </div>
        </div>
      </header>

      {/* Hero — the light page itself; the land arrives as the first plate */}
      <section id="top" className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-20 pt-14 sm:px-8 md:pb-28 md:pt-20">
        <div className="grid items-center gap-12 md:grid-cols-[1.1fr_1fr] md:gap-14">
          <div>
            <p className={`${mono.className} text-[11px] uppercase tracking-[0.28em]`} style={{ color: POLLEN }}>
              Field guide to a masterplan · Koh Phangan
            </p>
            <h1 className={`${display.className} mt-6 text-5xl leading-[1.06] sm:text-6xl md:text-7xl`}>
              You bring the land.
              <br />
              <em className="font-normal">We reveal its future.</em>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed sm:text-lg" style={{ color: MUTED }}>
              A land & ecosystem studio. We press every layer of your plot — soil,
              water, wind, people — into one masterplan, catalogued like a naturalist
              would.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#events"
                className="rounded-full px-6 py-3 text-sm font-semibold transition hover:opacity-90"
                style={{ backgroundColor: MOUNT, color: PALE }}
              >
                Walk the land
              </a>
              <a
                href="#specimens"
                className="text-sm font-semibold underline decoration-2 underline-offset-4 transition-colors"
                style={{ color: INK, textDecorationColor: POLLEN }}
              >
                Open the guide ↓
              </a>
            </div>
          </div>

          <Plate label="Plate 00 · The land, before" catalog="BSP-00" tilt="rotate-1">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={heroImg}
                alt="Bamboo villas at dusk, pools reflecting the last light"
                fill
                priority
                placeholder="blur"
                sizes="(min-width: 768px) 44vw, 92vw"
                className="object-cover"
              />
            </div>
          </Plate>
        </div>
      </section>

      {/* Manifesto */}
      <section id="about" className="scroll-mt-24 border-y" style={{ borderColor: HAIRLINE }}>
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8 md:py-20">
          <p className={`${display.className} text-2xl leading-relaxed sm:text-3xl`}>
            We design life around nature — masterplans where{" "}
            <em>architecture, ecology, business and human wellbeing</em> grow as one
            ecosystem, not four competing plans.
          </p>
          <p className={`${mono.className} mt-6 text-[11px] uppercase tracking-[0.24em]`} style={{ color: MUTED }}>
            One studio · six disciplines · four elements in balance
          </p>
        </div>
      </section>

      {/* The four specimens */}
      <section id="specimens" className="mx-auto max-w-6xl scroll-mt-24 px-5 sm:px-8">
        <div className="pb-12 pt-16 text-center md:pt-20">
          <h2 className={`${display.className} text-3xl sm:text-4xl`}>The four specimens</h2>
          <p className="mx-auto mt-3 max-w-md text-sm sm:text-base" style={{ color: MUTED }}>
            Every masterplan is pressed from the same four elements, collected in
            this order.
          </p>
        </div>

        <div className="grid gap-10 pb-20 md:grid-cols-2 md:gap-x-12 md:gap-y-14">
          {ELEMENTS.map((el, i) => (
            <div key={el.id} id={el.id} className="scroll-mt-28">
              <Plate
                label={`Plate ${el.numeral} · ${el.name}`}
                catalog={`BSP-0${i + 1}`}
                tilt={i % 2 === 0 ? "-rotate-[0.4deg]" : "rotate-[0.4deg]"}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={el.image}
                    alt={el.name}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 768px) 42vw, 88vw"
                    className="object-cover"
                  />
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <ElementGlyph kind={el.id} color={POLLEN} />
                  <h3 className={`${display.className} text-2xl sm:text-3xl`}>{el.name}</h3>
                  <span className={`${display.className} ml-auto text-2xl italic`} style={{ color: POLLEN }}>
                    {el.numeral}
                  </span>
                </div>
                <p className={`${display.className} mt-3 text-lg italic leading-snug`} style={{ color: "rgba(232, 237, 221, 0.92)" }}>
                  {el.line}
                </p>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(232, 237, 221, 0.78)" }}>
                  {el.text}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {el.chips.map((chip) => (
                    <li
                      key={chip}
                      className="rounded-full border px-3 py-1 text-[11px] font-medium"
                      style={{ borderColor: "rgba(232, 237, 221, 0.35)", color: "rgba(232, 237, 221, 0.85)" }}
                    >
                      {chip}
                    </li>
                  ))}
                </ul>
              </Plate>
            </div>
          ))}
        </div>
      </section>

      {/* Field notes — the year */}
      <section id="year" className="scroll-mt-24 border-t" style={{ borderColor: HAIRLINE }}>
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-20">
          <div className="max-w-xl">
            <p className={`${mono.className} text-[11px] uppercase tracking-[0.28em]`} style={{ color: POLLEN }}>
              Field notes · one year
            </p>
            <h2 className={`${display.className} mt-3 text-3xl sm:text-4xl`}>
              From land to lasting value
            </h2>
            <p className="mt-4 text-sm leading-relaxed sm:text-base" style={{ color: MUTED }}>
              Twelve months from the first walk to your first guests. Every stage has
              a purpose — nature cannot be rushed, and neither can meaningful
              development.
            </p>
          </div>
          <div className="relative mt-12">
            <div className="overflow-x-auto pb-3">
              <div className="min-w-[960px]">
                {/* month scale */}
                <div className="grid grid-cols-[15rem_1fr]">
                  <span />
                  <div className="grid grid-cols-12">
                    {Array.from({ length: 12 }, (_, m) => (
                      <span
                        key={m}
                        className={`${mono.className} pb-2 text-center text-[9px] uppercase tracking-[0.18em]`}
                        style={{ color: MUTED }}
                      >
                        M{String(m + 1).padStart(2, "0")}
                      </span>
                    ))}
                  </div>
                </div>
                {PHASES.map((phase, i) => {
                  const row = YEAR[i];
                  return (
                    <div
                      key={phase.n}
                      className="grid grid-cols-[15rem_1fr] border-t"
                      style={{ borderColor: HAIRLINE }}
                    >
                      <div className="flex items-center justify-between gap-3 py-4 pr-5">
                        <div>
                          <p className={`${mono.className} text-[10px] uppercase tracking-[0.2em]`} style={{ color: POLLEN }}>
                            P-{phase.n}
                          </p>
                          <h3 className={`${display.className} mt-1 text-lg leading-tight`}>{phase.title}</h3>
                          <p className={`${mono.className} mt-1 text-[9px] uppercase tracking-[0.18em]`} style={{ color: MUTED }}>
                            {phase.months}
                          </p>
                        </div>
                        <PhaseFigure index={i} stroke="rgba(29, 43, 33, 0.7)" fill="rgba(29, 43, 33, 0.55)" />
                      </div>
                      <div
                        className="relative grid grid-cols-12 items-center"
                        style={{
                          backgroundImage: `linear-gradient(to right, ${HAIRLINE} 1px, transparent 1px)`,
                          backgroundSize: "calc(100% / 12) 100%",
                        }}
                      >
                        <div
                          className={`${mono.className} mx-0.5 flex h-9 items-center px-2.5 text-[9px] uppercase tracking-[0.16em]`}
                          style={{ ...yearBarStyle(row.state), gridColumn: `${row.start} / ${row.end + 1}` }}
                        >
                          {row.state === "complete" ? "Complete" : row.state === "build" ? "In build" : "Planned"}
                        </div>
                        {i === PHASES.length - 1 && (
                          <span
                            className={`${mono.className} absolute -top-2 right-1 rotate-6 border-2 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.16em]`}
                            style={{ borderColor: POLLEN, color: "#7d5613", backgroundColor: "rgba(240, 242, 233, 0.85)" }}
                          >
                            First guests
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div className="border-t" style={{ borderColor: HAIRLINE }} />
              </div>
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-10 md:hidden"
              style={{ background: "linear-gradient(to left, #f0f2e9, rgba(240, 242, 233, 0))" }}
            />
          </div>
          <p className={`${mono.className} mt-1 text-[10px] uppercase tracking-[0.2em] md:hidden`} style={{ color: MUTED }}>
            Slide for month 12 →
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
            {(
              [
                ["complete", "Complete"],
                ["build", "In build — The Bay"],
                ["planned", "Planned"],
              ] as const
            ).map(([state, label]) => (
              <p
                key={state}
                className={`${mono.className} flex items-center gap-2 text-[10px] uppercase tracking-[0.18em]`}
                style={{ color: MUTED }}
              >
                <span aria-hidden className="inline-block h-2.5 w-6" style={yearBarStyle(state)} />
                {label}
              </p>
            ))}
          </div>
          <p className={`${display.className} mt-12 max-w-md text-xl italic leading-relaxed sm:text-2xl`}>
            “Speed comes from preparation, not from rushing.”
            <span className={`${mono.className} mt-2 block text-[10px] uppercase tracking-[0.22em]`} style={{ color: MUTED }}>
              — site journal, month one
            </span>
          </p>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:px-8 md:py-20">
        <h2 className={`${display.className} text-3xl sm:text-4xl`}>Living proof</h2>
        <p className="mt-3 max-w-xl text-sm sm:text-base" style={{ color: MUTED }}>
          Two grounds, two stories — both designed, built and activated by the studio.
        </p>
        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-12">
          {PROJECTS.map((project, i) => (
            <div key={project.id} id={project.id} className="scroll-mt-28">
              <Plate
                label={project.name}
                catalog={project.catalog}
                tilt={i % 2 === 0 ? "rotate-[0.4deg]" : "-rotate-[0.4deg]"}
              >
                <div className="relative aspect-[5/4] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 768px) 42vw, 88vw"
                    className="object-cover"
                  />
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h3 className={`${display.className} text-xl sm:text-2xl`}>{project.name}</h3>
                  <span
                    className={`${mono.className} shrink-0 text-[10px] uppercase tracking-[0.18em]`}
                    style={{ color: POLLEN }}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="mt-2 max-w-sm text-sm leading-relaxed" style={{ color: "rgba(232, 237, 221, 0.78)" }}>
                  {project.note}
                </p>
              </Plate>
            </div>
          ))}
        </div>
      </section>

      {/* Visits & booking */}
      <section id="events" className="scroll-mt-24 border-t" style={{ borderColor: HAIRLINE }}>
        <span id="visit" className="block scroll-mt-24" />
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 md:gap-14 md:py-20">
          <div>
            <h2 className={`${display.className} text-3xl sm:text-4xl`}>Walk the land with us</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed sm:text-base" style={{ color: MUTED }}>
              Every project starts the same way: two hours on your plot, on foot,
              reading water, wind and soil together. Pick a visit and a day — we
              bring the maps.
            </p>
            <div className="mt-9 max-w-md">
              <Plate label="The studio, in the field" catalog="BSP-T1" tilt="-rotate-[0.6deg]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={communityImg}
                    alt="The studio team gathered under a bamboo pavilion"
                    fill
                    placeholder="blur"
                    sizes="(min-width: 768px) 40vw, 88vw"
                    className="object-cover"
                  />
                </div>
              </Plate>
            </div>
          </div>
          <SlotBooking
            options={VISITS}
            displayClass={display.className}
            pickerLabel="Visit"
            priceUnit="per visit"
            currency="฿"
            ctaLabel="Request this visit"
            note="Visit fees are credited back in full when a project begins."
            theme={{
              accent: MOUNT,
              accentText: PALE,
              text: INK,
              muted: MUTED,
              surface: "#f7f8f0",
              border: HAIRLINE,
              radius: "2px",
            }}
          />
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="scroll-mt-24 border-t px-5 pb-16 pt-14 text-center" style={{ borderColor: HAIRLINE }}>
        <div className="flex items-center justify-center gap-4">
          {ELEMENTS.map((el) => (
            <ElementGlyph key={el.id} kind={el.id} color={POLLEN} size={18} />
          ))}
        </div>
        <Image src={logoImg} alt="Biosphere logo" width={48} height={48} className="mx-auto mt-8 size-12" />
        <p className={`${display.className} mt-4 text-xl tracking-[0.28em]`}>BIOSPHERE</p>
        <p className={`${mono.className} mt-1 text-[10px] uppercase tracking-[0.2em]`} style={{ color: MUTED }}>
          Biosphere Co. Ltd.
        </p>
        <p className="mt-3 text-sm" style={{ color: MUTED }}>
          {CONTACT.area} ·{" "}
          <a href={CONTACT.phoneHref} className="underline decoration-1 underline-offset-4">
            {CONTACT.phone}
          </a>{" "}
          ·{" "}
          <a href={CONTACT.emailHref} className="underline decoration-1 underline-offset-4">
            {CONTACT.email}
          </a>
        </p>
        <p className="mt-5 text-xs" style={{ color: MUTED }}>
          Concept redesign — demo content and prices.
        </p>
      </footer>

      <LayoutSwitcher />
    </div>
  );
}

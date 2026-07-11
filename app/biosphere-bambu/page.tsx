import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";
import { Shippori_Mincho, Zen_Kaku_Gothic_New } from "next/font/google";
import logoImg from "@/public/img/layouts/biosphere-logo.png";
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
  title: "Business Layout — Biosphere Bambu",
  robots: { index: false },
};

const mincho = Shippori_Mincho({ subsets: ["latin"], weight: ["400", "500", "600"] });
const gothic = Zen_Kaku_Gothic_New({ subsets: ["latin"], weight: ["300", "400", "500", "700"] });

/* Ink-and-scroll palette: sumi ink on washi, one cinnabar seal, indigo mount. */
const WASHI = "#f7f4eb";
const MAT = "#efe9da";
const SUMI = "#242621";
const SEAL = "#b23a2a";
const MOUNT = "#252a34";
const BROCADE = "#2b3040";
const GOLDTHREAD = "rgba(211, 195, 143, 0.4)";
const HAIRLINE = "rgba(36, 38, 33, 0.16)";
const MUTED = "rgba(36, 38, 33, 0.66)";

/** Photographs sit in the painting as ink-tinted washes, not full-color prints. */
const INK_WASH: CSSProperties = { filter: "grayscale(0.3) saturate(0.85) contrast(1.02)" };

/* ------------------------------------------------------------------ */
/* Ink drawing system                                                  */
/* ------------------------------------------------------------------ */

const GROVE_BASE = 760;

/** Internode heights that sum to `total` — deterministic, no RNG. */
function internodes(total: number, count: number, seed: number): number[] {
  const raw = Array.from({ length: count }, (_, i) => 1 + 0.28 * Math.sin(seed + i * 2.1) - i * 0.05);
  const sum = raw.reduce((a, b) => a + b, 0);
  return raw.map((r) => (r / sum) * total);
}

/** One bamboo culm: tapering segments with node rings, rotated about its base. */
function BambooStalk({
  x,
  top,
  width,
  lean,
  ink,
  seed,
  delay,
}: {
  x: number;
  top: number;
  width: number;
  lean: number;
  ink: number;
  seed: number;
  delay: number;
}) {
  const height = GROVE_BASE - top;
  const count = Math.max(3, Math.round(height / 130));
  const segs = internodes(height, count, seed);
  const parts: ReactNode[] = [];
  let y = GROVE_BASE + 20; // start slightly below the frame so culms feel rooted
  segs.forEach((h, i) => {
    const w = width * (1 - i * 0.045);
    parts.push(
      <rect
        key={`s${i}`}
        x={x - w / 2}
        y={y - h + 3}
        width={w}
        height={h - 6}
        rx={3}
        fill={SUMI}
        fillOpacity={ink}
      />,
    );
    if (i > 0) {
      parts.push(
        <rect
          key={`n${i}`}
          x={x - w / 2 - 1.5}
          y={y - 1.2}
          width={w + 3}
          height={2.4}
          rx={1.2}
          fill={SUMI}
          fillOpacity={Math.min(1, ink + 0.18)}
        />,
      );
    }
    y -= h;
  });
  return (
    <g className="bio2-rise" style={{ animationDelay: `${delay}ms` }}>
      <g transform={`rotate(${lean} ${x} ${GROVE_BASE})`}>{parts}</g>
    </g>
  );
}

const LEAF = "M0 0 C 9 -6.5, 24 -8, 38 -1.5 C 24 3.5, 9 4.5, 0 0 Z";

/** A fan of sumi leaves hanging from one attach point. */
function LeafCluster({
  x,
  y,
  scale = 1,
  flip = false,
  ink,
  sway = false,
  delay,
}: {
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  ink: number;
  sway?: boolean;
  delay: number;
}) {
  return (
    <g className="bio2-rise" style={{ animationDelay: `${delay}ms` }}>
      <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
        <g
          className={sway ? "bio2-sway" : undefined}
          style={sway ? { transformBox: "fill-box", transformOrigin: "0% 20%" } : undefined}
        >
          <path d="M0 0 L-13 -9" stroke={SUMI} strokeOpacity={ink * 0.8} strokeWidth={1.4} />
          {[-18, 6, 30, 55].map((a) => (
            <path key={a} d={LEAF} transform={`rotate(${a})`} fill={SUMI} fillOpacity={ink} />
          ))}
        </g>
      </g>
    </g>
  );
}

const STALKS = [
  // far washes
  { x: 110, top: 260, width: 30, lean: -1.5, ink: 0.1, seed: 2.2, delay: 150 },
  { x: 700, top: 90, width: 30, lean: 1, ink: 0.12, seed: 4.8, delay: 250 },
  { x: 900, top: 140, width: 28, lean: -2, ink: 0.1, seed: 1.4, delay: 350 },
  // mid tones
  { x: 620, top: 200, width: 21, lean: 2, ink: 0.26, seed: 3.1, delay: 450 },
  { x: 1010, top: 70, width: 22, lean: -1.2, ink: 0.26, seed: 5.6, delay: 550 },
  { x: 1160, top: 230, width: 20, lean: 2.4, ink: 0.24, seed: 0.9, delay: 650 },
  // near, drawn dark
  { x: 770, top: 30, width: 15, lean: 2.8, ink: 0.78, seed: 2.9, delay: 750 },
  { x: 1100, top: 8, width: 16, lean: -2.2, ink: 0.78, seed: 4.2, delay: 850 },
] as const;

const CLUSTERS = [
  { x: 905, y: 300, scale: 0.7, ink: 0.16, delay: 500 },
  { x: 1010, y: 240, scale: 0.85, flip: true, ink: 0.32, delay: 700 },
  { x: 620, y: 330, scale: 0.9, ink: 0.38, delay: 800 },
  { x: 770, y: 200, scale: 1.15, ink: 0.8, sway: true, delay: 950 },
  { x: 1100, y: 150, scale: 1.05, flip: true, ink: 0.75, sway: true, delay: 1050 },
] as const;

/** The hero painting: a bamboo grove in three depths of ink. */
function Grove() {
  return (
    <svg
      viewBox="0 0 1200 760"
      preserveAspectRatio="xMidYMax slice"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    >
      {STALKS.map((s) => (
        <BambooStalk key={`${s.x}-${s.top}`} {...s} />
      ))}
      {CLUSTERS.map((c) => (
        <LeafCluster key={`${c.x}-${c.y}`} {...c} />
      ))}
    </svg>
  );
}

/** A single tapered brushstroke, used instead of border rules. */
function BrushRule({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 12" preserveAspectRatio="none" className={`h-2.5 w-full ${className}`} aria-hidden>
      <path
        d="M0 6 C 200 1, 420 10, 640 5 S 1020 8, 1200 5 L1200 6.5 C 1000 9.5, 700 4, 460 8 S 160 4.5, 0 7.5 Z"
        fill={SUMI}
        fillOpacity={0.28}
      />
    </svg>
  );
}

/** Studio seal: the four element marks carved into a cinnabar square. */
function SealMark({ size = 46, className = "" }: { size?: number; className?: string }) {
  const stroke = { stroke: WASHI, strokeWidth: 1.2, fill: "none" } as const;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden>
      <rect x="1.5" y="1.5" width="45" height="45" rx="5" fill={SEAL} />
      <rect x="5" y="5" width="38" height="38" rx="3" {...stroke} strokeOpacity={0.85} />
      {/* fire · water · wind · earth */}
      <path d="M14.5 9.7 L19.9 18.7 H9.1 Z" {...stroke} />
      <path d="M33.5 19.3 L28.1 10.3 H38.9 Z" {...stroke} />
      <path d="M14.5 28.7 L19.9 37.7 H9.1 Z" {...stroke} />
      <line x1="11.6" y1="35.2" x2="17.4" y2="35.2" {...stroke} />
      <path d="M33.5 38.3 L28.1 29.3 H38.9 Z" {...stroke} />
      <line x1="30.6" y1="31.6" x2="36.4" y2="31.6" {...stroke} />
    </svg>
  );
}

/** A photograph mounted as an album leaf: paper mat, hairline frame, ink veil. */
function AlbumLeaf({
  src,
  alt,
  sizes,
  aspect,
  className = "",
  children,
}: {
  src: StaticImageData;
  alt: string;
  sizes: string;
  aspect: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`border p-2.5 sm:p-3 ${className}`} style={{ borderColor: HAIRLINE, backgroundColor: MAT }}>
      <div className={`relative overflow-hidden ${aspect}`}>
        <Image src={src} alt={alt} fill placeholder="blur" sizes={sizes} className="object-cover" style={INK_WASH} />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ boxShadow: "inset 0 0 0 1px rgba(36,38,33,0.28), inset 0 0 44px rgba(36,38,33,0.16)" }}
        />
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const CHAPTERS = [
  {
    id: "earth",
    numeral: "I",
    name: "Earth",
    image: earthImg,
    line: "Every masterplan starts under your feet.",
    text: "We read soil, slope and stone before drawing a single wall. Terraces, swales and access roads are shaped from the land's own contours — so what gets built feels found, not forced.",
    tags: ["Land audit & masterplan", "Soil & terracing", "Architecture & construction"],
  },
  {
    id: "water",
    numeral: "II",
    name: "Water",
    image: waterImg,
    line: "Water decides where life gathers.",
    text: "Spring, rain and greywater are mapped into one living cycle: swales slow it, ponds hold it, gardens drink it. Pools sit exactly where the land already wants water to rest.",
    tags: ["Hydrology & swales", "Pools & ponds", "Ecology & reforestation"],
  },
  {
    id: "wind",
    numeral: "III",
    name: "Wind",
    image: windImg,
    line: "The invisible layers carry the plan.",
    text: "Breeze paths cool the buildings before electricity has to; drones read the canopy from above; titles, permits and governance move quietly underneath. Everything you don't see — handled.",
    tags: ["Nature intelligence & survey", "Passive cooling & orientation", "Legal & governance"],
  },
  {
    id: "fire",
    numeral: "IV",
    name: "Fire",
    image: fireImg,
    line: "A place is finished when people gather in it.",
    text: "Kitchens, fire pits and lantern light turn a masterplan into a living address. We train the team, open the doors and stay through the first season of hospitality.",
    tags: ["Hospitality & operations", "Community & events", "Brand & business"],
  },
] as const;

type PhaseState = "complete" | "active" | "ahead";

/** Internode spans mirror the real stage durations across twelve months. */
const PHASES: readonly {
  n: string;
  months: string;
  title: string;
  text: string;
  span: number;
  state: PhaseState;
}[] = [
  { n: "01", months: "Month 1", title: "Discovery & Strategy", text: "Understanding the land, the vision, the legal ground.", span: 1, state: "complete" },
  { n: "02", months: "Months 2–3", title: "Master Planning", text: "Masterplan, environment and infrastructure in one drawing.", span: 2, state: "complete" },
  { n: "03", months: "Months 4–8", title: "Building With Nature", text: "Architecture, landscape and engineering as one system.", span: 5, state: "active" },
  { n: "04", months: "Months 9–11", title: "Crafting the Experience", text: "Interiors, gardens and shared spaces tuned to place.", span: 2, state: "ahead" },
  { n: "05", months: "Month 11", title: "Activation", text: "Operations, hospitality and team ready for launch.", span: 1, state: "ahead" },
  { n: "06", months: "Month 12", title: "A Place Comes to Life", text: "Nature, people and purpose in harmony — doors open.", span: 1, state: "ahead" },
];

function internodeStyle(state: PhaseState): CSSProperties {
  if (state === "complete") {
    return { border: "1px solid rgba(36, 38, 33, 0.55)", backgroundColor: "rgba(36, 38, 33, 0.12)" };
  }
  if (state === "active") {
    return {
      border: `1px solid ${SEAL}`,
      backgroundImage: "repeating-linear-gradient(45deg, rgba(178, 58, 42, 0.3) 0 4px, transparent 4px 9px)",
    };
  }
  return { border: "1px dashed rgba(36, 38, 33, 0.5)" };
}

/**
 * Marginalia ink studies, one above each internode — the year sketched the
 * way a site journal would draw it. Ink weight follows the phase state:
 * finished months in full ink, the active build lashed in cinnabar, months
 * ahead in faint dashed underdrawing. The finale is always fully inked —
 * the finished picture the whole year is painting toward.
 */
function PhaseSketch({ index, state }: { index: number; state: PhaseState }) {
  const finale = index === 5;
  const ahead = state === "ahead" && !finale;
  const ink = ahead ? 0.5 : 0.72;
  const fillInk = ahead ? 0.4 : 0.6;
  const seal = state === "active" ? 0.85 : ahead ? 0.5 : 0.7;

  return (
    <svg viewBox="0 0 64 48" className="h-12 w-16" aria-hidden>
      <g
        fill="none"
        stroke={SUMI}
        strokeOpacity={ink}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={ahead ? "2.5 3.5" : undefined}
      >
        {index === 0 && (
          <>
            {/* walking the land: contours, footsteps, a survey pennant */}
            <path d="M4 38 C 12 28, 22 28, 30 34 C 38 40, 48 40, 60 32" />
            <path d="M10 43 C 20 37, 34 39, 44 43" strokeOpacity={ink * 0.55} />
            <path d="M40 33 V12" />
            <path
              d="M40 12 C 45 13.5, 49 13, 53 11 C 50 16, 45 17.5, 40 18 Z"
              fill={SUMI}
              fillOpacity={fillInk}
              stroke="none"
            />
            {[
              [14, 33.5],
              [20, 30.5],
              [26, 31.5],
            ].map(([cx, cy]) => (
              <circle key={cx} cx={cx} cy={cy} r={1} fill={SUMI} fillOpacity={fillInk} stroke="none" />
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
            {/* bamboo frame rising, joints lashed in cinnabar */}
            <path d="M20 41 V12 M18.5 32 h3 M18.5 22 h3" />
            <path d="M44 41 V12 M42.5 30 h3 M42.5 20 h3" />
            <path d="M13 14 H51" />
            <path d="M20 38 L44 16" />
            <path d="M17.5 11.5 l5 5 M22.5 11.5 l-5 5" stroke={SEAL} strokeOpacity={seal} />
            <path d="M41.5 11.5 l5 5 M46.5 11.5 l-5 5" stroke={SEAL} strokeOpacity={seal} />
            <path
              d={LEAF}
              transform="translate(51 14) scale(0.35) rotate(-28)"
              fill={SUMI}
              fillOpacity={fillInk}
              stroke="none"
            />
          </>
        )}
        {index === 3 && (
          <>
            {/* a lantern lit, a garden potted */}
            <path d="M23 6 V12" />
            <path d="M23 12 C 16 12, 14 18, 14 23 C 14 29, 18 32, 23 32 C 28 32, 32 29, 32 23 C 32 18, 30 12, 23 12 Z" />
            <path d="M14.5 22 H31.5" strokeOpacity={ink * 0.6} />
            <path d="M23 32 V36" />
            <path d="M42 35 H54 L52.5 41 H43.5 Z" />
            <path d="M47 35 C 47 29, 44 26, 41 23" />
            <path d="M48.5 35 C 49 28, 52 26, 55 22" />
            <path
              d="M41 23 C 37.5 21, 36 17.5, 37 14 C 40.5 16, 42 19.5, 41 23 Z"
              fill={SUMI}
              fillOpacity={fillInk}
              stroke="none"
            />
            <path
              d="M55 22 C 58.5 20, 60 16.5, 59 13 C 55.5 15, 54 18.5, 55 22 Z"
              fill={SUMI}
              fillOpacity={fillInk}
              stroke="none"
            />
          </>
        )}
        {index === 4 && (
          <>
            {/* the team, robed and ready at the door */}
            <path d="M11.5 41 C 13 32.5, 23 32.5, 24.5 41" />
            <path d="M25 41 C 26.5 30, 37.5 30, 39 41" />
            <path d="M39.5 41 C 41 32.5, 51 32.5, 52.5 41" />
            <circle cx={18} cy={26.5} r={2.4} fill={SUMI} fillOpacity={fillInk} stroke="none" />
            <circle cx={32} cy={23.5} r={2.6} fill={SUMI} fillOpacity={fillInk} stroke="none" />
            <circle cx={46} cy={26.5} r={2.4} fill={SUMI} fillOpacity={fillInk} stroke="none" />
          </>
        )}
        {finale && (
          <>
            {/* doors open: the house under bamboo, sun risen in seal red */}
            <path d="M10 27 C 18 14, 46 14, 54 27" />
            <path d="M17 27 V41 M47 27 V41" />
            <path d="M10 41 H54" />
            <path d="M28.5 41 V33.5 C 28.5 31.5, 35.5 31.5, 35.5 33.5 V41" />
            <path d="M8 41 C 9.5 32, 12 24, 17 16" />
            <path
              d="M17 16 C 20 12.5, 24.5 11, 29 12 C 25.5 15.5, 21 16.8, 17 16 Z"
              fill={SUMI}
              fillOpacity={fillInk}
              stroke="none"
            />
            <path
              d="M14.5 22 C 11 19.5, 9.5 16, 10 12.5 C 13.5 15, 15 18.5, 14.5 22 Z"
              fill={SUMI}
              fillOpacity={fillInk}
              stroke="none"
            />
            <path d="M56 41 c 1 -2.5, 1 -4, .5 -5.5 M60 41 c .8 -2, 1.4 -3.2, 2.6 -4" />
            <circle cx={50} cy={10} r={4} fill={SEAL} fillOpacity={0.82} stroke="none" />
          </>
        )}
      </g>
    </svg>
  );
}

const PROJECTS = [
  {
    id: "la-casa",
    name: "La Casa — The Fibonacci",
    image: casaImg,
    note: "A spiral of shared pavilions where the golden ratio sets every room's proportion.",
    stamp: "Signed · complete",
    stampColor: SEAL,
  },
  {
    id: "the-bay",
    name: "The Bay",
    image: buildImg,
    note: "A tide-facing hillside raised entirely in bamboo — currently in its build season.",
    stamp: "In build · phase 03",
    stampColor: SUMI,
  },
] as const;

const VISITS: readonly SlotOption[] = [
  { slug: "walk", name: "Land discovery walk", sub: "Two hours on your plot, first impressions in ink", price: 2500 },
  { slug: "masterplan", name: "Masterplan day", sub: "Full-day session — contours, water, phasing, budget", price: 12000 },
  { slug: "tour", name: "Project site tour", sub: "Visit La Casa and The Bay with the design team", price: 6500 },
];

const NAV = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Events", href: "#events" },
  { label: "Contact", href: "#contact" },
] as const;

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function BiosphereBambuPage() {
  return (
    <div className={`${gothic.className} min-h-dvh antialiased`} style={{ backgroundColor: MOUNT, color: SUMI }}>
      <style>{`
        @keyframes bio2-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .bio2-rise { animation: bio2-rise 1.4s cubic-bezier(0.22, 1, 0.36, 1) both; }
        @keyframes bio2-sway { 0%, 100% { transform: rotate(-1.2deg); } 50% { transform: rotate(1.6deg); } }
        .bio2-sway { animation: bio2-sway 7s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .bio2-rise, .bio2-sway { animation: none; }
        }
      `}</style>
      <SmoothScroll />

      {/* The wall the scroll hangs on */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-md"
        style={{ borderColor: "rgba(247, 244, 235, 0.14)", backgroundColor: "rgba(37, 42, 52, 0.9)" }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#top" className="flex items-center gap-3" style={{ color: WASHI }}>
            <Image src={logoImg} alt="" width={28} height={28} priority />
            <span className={`${mincho.className} text-sm tracking-[0.32em]`}>BIOSPHERE</span>
          </a>
          <nav
            className="hidden items-center gap-7 text-[11px] uppercase tracking-[0.2em] md:flex"
            aria-label="Sections"
          >
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition-opacity hover:opacity-70"
                style={{ color: "rgba(247, 244, 235, 0.85)" }}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <a
              href="#events"
              className="rounded-[2px] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-85"
              style={{ backgroundColor: SEAL, color: WASHI }}
            >
              Walk the land
            </a>
            <BiosphereMobileMenu
              links={NAV}
              cta={{ label: "Walk the land", href: "#events" }}
              triggerColor={WASHI}
              panelStyle={{ backgroundColor: WASHI, color: SUMI, borderColor: GOLDTHREAD }}
              linkClassName={`${mincho.className} text-2xl`}
              ctaClassName="rounded-[2px] px-5 py-3 text-center text-[11px] font-medium uppercase tracking-[0.16em]"
              ctaStyle={{ backgroundColor: SEAL, color: WASHI }}
            />
          </div>
        </div>
      </header>

      {/* The mounted scroll */}
      <div id="top" className="scroll-mt-24 px-3 pt-8 sm:px-6 sm:pt-12">
        <div className="mx-auto w-full max-w-5xl">
          {/* top brocade band */}
          <div
            className="h-8 border-x border-t"
            style={{
              borderColor: GOLDTHREAD,
              backgroundColor: BROCADE,
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(211, 195, 143, 0.13) 0 1px, transparent 1px 9px), repeating-linear-gradient(-45deg, rgba(211, 195, 143, 0.13) 0 1px, transparent 1px 9px)",
            }}
          />

          {/* the paper */}
          <div
            className="relative shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
            style={{ backgroundColor: WASHI }}
          >
            {/* -------- Hero: the grove, painted -------- */}
            <section className="relative overflow-hidden">
              <Grove />
              {/* title slip — the pasted paper label on a mounted scroll */}
              <p
                className="absolute right-4 top-8 hidden border px-1.5 py-4 text-[11px] uppercase tracking-[0.5em] md:block"
                style={{
                  color: MUTED,
                  writingMode: "vertical-rl",
                  backgroundColor: "rgba(247, 244, 235, 0.92)",
                  borderColor: "rgba(36, 38, 33, 0.22)",
                }}
              >
                Land & ecosystem studio — Koh Phangan
              </p>
              <div className="relative flex min-h-[82dvh] flex-col justify-center px-6 py-24 sm:px-10 md:px-14">
                <div className="bio2-rise max-w-xl" style={{ animationDelay: "1150ms" }}>
                  <h1 className={`${mincho.className} text-5xl leading-[1.12] sm:text-6xl md:text-7xl`}>
                    You bring
                    <br />
                    the land.
                    <br />
                    <span className="font-semibold">We reveal its future.</span>
                  </h1>
                  <div className="mt-8 flex items-end gap-5">
                    <SealMark className="-rotate-3" />
                    <p className="max-w-xs text-sm leading-relaxed" style={{ color: MUTED }}>
                      Masterplans painted in one ink — earth, water, wind and fire on a single scroll.
                    </p>
                  </div>
                </div>

                {/* chapter spines — the scroll's index */}
                <div className="bio2-rise mt-14 flex gap-7 sm:gap-9" style={{ animationDelay: "1350ms" }}>
                  {CHAPTERS.map((ch) => (
                    <a
                      key={ch.id}
                      href={`#${ch.id}`}
                      className="flex h-28 flex-col items-center gap-2 text-[11px] uppercase tracking-[0.35em] transition-opacity hover:opacity-60"
                      style={{ color: SUMI }}
                    >
                      <span className={`${mincho.className} text-xs normal-case tracking-normal`} style={{ color: SEAL }}>
                        {ch.numeral}
                      </span>
                      <span style={{ writingMode: "vertical-rl" }}>{ch.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </section>

            {/* -------- Manifesto -------- */}
            <section id="about" className="mx-auto max-w-2xl scroll-mt-24 px-6 pb-4 pt-14 text-center sm:px-10 md:pt-20">
              <p className={`${mincho.className} text-2xl leading-relaxed sm:text-3xl`}>
                We design life around nature — masterplans where architecture, ecology,
                business and human wellbeing grow as one ecosystem, not four competing plans.
              </p>
              <p className="mt-6 text-sm" style={{ color: MUTED }}>
                One studio, six disciplines, four elements — painted in one ink.
              </p>
            </section>

            {/* -------- Four chapters -------- */}
            <section id="elements" className="scroll-mt-24 px-6 sm:px-10 md:px-14">
              {CHAPTERS.map((ch, i) => (
                <div key={ch.id}>
                  {i > 0 && <BrushRule />}
                  <article
                    id={ch.id}
                    className="grid scroll-mt-28 items-center gap-8 py-14 md:grid-cols-[2.75rem_1fr_1fr] md:gap-10 md:py-18"
                  >
                    <p
                      className="hidden self-start text-[11px] uppercase tracking-[0.4em] md:block"
                      style={{ color: MUTED, writingMode: "vertical-rl" }}
                    >
                      Chapter {ch.numeral} — {ch.name}
                    </p>

                    <AlbumLeaf
                      src={ch.image}
                      alt={ch.name}
                      sizes="(min-width: 768px) 42vw, 92vw"
                      aspect="aspect-[4/3]"
                      className={i % 2 === 1 ? "md:order-3" : ""}
                    />

                    <div className={i % 2 === 1 ? "md:order-2" : ""}>
                      <p className={`${mincho.className} text-4xl`} style={{ color: SEAL }}>
                        {ch.numeral}
                      </p>
                      <h2 className={`${mincho.className} mt-2 text-3xl sm:text-4xl`}>{ch.name}</h2>
                      <p className={`${mincho.className} mt-4 text-xl font-medium leading-snug`}>{ch.line}</p>
                      <p className="mt-4 max-w-md text-sm leading-relaxed sm:text-base" style={{ color: MUTED }}>
                        {ch.text}
                      </p>
                      <ul className="mt-6 flex flex-wrap gap-2">
                        {ch.tags.map((tag) => (
                          <li
                            key={tag}
                            className="border px-2.5 py-1 text-[10px] uppercase tracking-[0.16em]"
                            style={{ borderColor: "rgba(36, 38, 33, 0.35)", color: MUTED }}
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </div>
              ))}
            </section>

            <BrushRule className="mx-auto max-w-[calc(100%-3rem)]" />

            {/* -------- The year, drawn as one culm -------- */}
            <section id="year" className="scroll-mt-24 px-6 py-16 sm:px-10 md:px-14 md:py-20">
              <h2 className={`${mincho.className} text-3xl sm:text-4xl`}>One year, one culm</h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed sm:text-base" style={{ color: MUTED }}>
                Bamboo grows the way we work: node by node, each internode a stage. Twelve
                months from the first walk to your first guests — from land to lasting
                value, drawn to scale below.
              </p>

              <div className="relative mt-12">
                <div className="overflow-x-auto pb-2 pt-1">
                <div
                  className="grid min-w-[780px] pr-4"
                  style={{ gridTemplateColumns: PHASES.map((p) => `${p.span}fr`).join(" ") }}
                >
                  {PHASES.map((phase, i) => (
                    <div key={phase.n} className="relative">
                      {/* the phase, sketched above its internode */}
                      <div className="flex h-14 items-end justify-center pb-2">
                        <PhaseSketch index={i} state={phase.state} />
                      </div>
                      <div className="relative">
                        {/* node ring straddling each joint */}
                        {i > 0 && (
                          <span
                            aria-hidden
                            className="absolute -top-[3px] left-0 z-10 h-7 w-[7px] -translate-x-1/2 rounded-full border"
                            style={{ borderColor: "rgba(36, 38, 33, 0.6)", backgroundColor: WASHI }}
                          />
                        )}
                        <div
                          className={`h-[23px] ${i === 0 ? "rounded-l-md" : ""} ${
                            i === PHASES.length - 1 ? "rounded-r-md" : ""
                          }`}
                          style={internodeStyle(phase.state)}
                        />
                      </div>
                      <div className="pr-3 pt-4">
                        <p className="flex items-baseline gap-2">
                          <span className="text-[10px] font-medium tracking-[0.2em]" style={{ color: SEAL }}>
                            {phase.n}
                          </span>
                          <span className={`${mincho.className} text-lg`}>{phase.title}</span>
                        </p>
                        <p className="mt-0.5 text-[10px] uppercase tracking-[0.22em]" style={{ color: MUTED }}>
                          {phase.months}
                        </p>
                        <p className="mt-2 max-w-[26ch] pr-4 text-xs leading-relaxed" style={{ color: MUTED }}>
                          {phase.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                </div>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:hidden"
                  style={{ background: "linear-gradient(to left, #f7f4eb, rgba(247, 244, 235, 0))" }}
                />
              </div>
              <p className="mt-2 text-[10px] uppercase tracking-[0.2em] sm:hidden" style={{ color: MUTED }}>
                Slide for month 12 →
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
                {(
                  [
                    ["complete", "Complete"],
                    ["active", "In build — The Bay"],
                    ["ahead", "Planned"],
                  ] as const
                ).map(([state, label]) => (
                  <p key={state} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
                    <span aria-hidden className="inline-block h-2.5 w-6 rounded-sm" style={internodeStyle(state)} />
                    {label}
                  </p>
                ))}
              </div>
              <p className={`${mincho.className} mt-8 max-w-md text-lg leading-relaxed`}>
                “Speed comes from preparation, not from rushing.”
                <span className="mt-1 block text-xs uppercase tracking-[0.22em]" style={{ color: MUTED }}>
                  — site journal, month one
                </span>
              </p>
            </section>

            <BrushRule className="mx-auto max-w-[calc(100%-3rem)]" />

            {/* -------- Projects: two paintings, signed -------- */}
            <section id="projects" className="scroll-mt-24 px-6 py-16 sm:px-10 md:px-14 md:py-20">
              <h2 className={`${mincho.className} text-3xl sm:text-4xl`}>Two paintings, signed</h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed sm:text-base" style={{ color: MUTED }}>
                Both grounds designed, built and activated by the studio — from first ink to
                first guests.
              </p>
              <div className="mt-10 grid gap-10 md:grid-cols-2">
                {PROJECTS.map((project) => (
                  <figure key={project.id} id={project.id} className="scroll-mt-28">
                    <AlbumLeaf
                      src={project.image}
                      alt={project.name}
                      sizes="(min-width: 768px) 42vw, 92vw"
                      aspect="aspect-[5/4]"
                    >
                      <span
                        className="absolute right-3 top-3 -rotate-6 border-2 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em]"
                        style={{
                          borderColor: project.stampColor,
                          color: project.stampColor,
                          backgroundColor: "rgba(247, 244, 235, 0.82)",
                        }}
                      >
                        {project.stamp}
                      </span>
                    </AlbumLeaf>
                    <figcaption className="pt-4">
                      <h3 className={`${mincho.className} text-xl`}>{project.name}</h3>
                      <p className="mt-1.5 max-w-sm text-sm leading-relaxed" style={{ color: MUTED }}>
                        {project.note}
                      </p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>

            <BrushRule className="mx-auto max-w-[calc(100%-3rem)]" />

            {/* -------- Visits & booking -------- */}
            <section id="events" className="scroll-mt-24 px-6 py-16 sm:px-10 md:px-14 md:py-20">
              <span id="visit" className="block scroll-mt-24" />
              <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
                <div>
                  <h2 className={`${mincho.className} text-3xl sm:text-4xl`}>Walk the land with us</h2>
                  <p className="mt-4 max-w-md text-sm leading-relaxed sm:text-base" style={{ color: MUTED }}>
                    Every scroll starts the same way: two hours on your plot, on foot, reading
                    water, wind and soil together. Pick a visit and a day — we bring the ink.
                  </p>
                </div>
                <div className="relative pr-8">
                  <AlbumLeaf
                    src={communityImg}
                    alt="The studio team gathered under a bamboo pavilion"
                    sizes="(min-width: 768px) 42vw, 85vw"
                    aspect="aspect-[4/3]"
                  />
                  {/* caption clipped to the leaf's height so it can never stretch the row */}
                  <p
                    className="absolute inset-y-0 right-0 overflow-hidden py-2 text-[10px] uppercase tracking-[0.3em]"
                    style={{ color: MUTED, writingMode: "vertical-rl" }}
                  >
                    The studio, under one roof of bamboo
                  </p>
                </div>
              </div>
              <div className="mt-10">
                <SlotBooking
                  options={VISITS}
                  displayClass={mincho.className}
                  pickerLabel="Visit"
                  priceUnit="per visit"
                  currency="฿"
                  ctaLabel="Request this visit"
                  note="Visit fees are credited back in full when a project begins."
                  theme={{
                    accent: SEAL,
                    accentText: WASHI,
                    text: SUMI,
                    muted: MUTED,
                    surface: "#fbf9f2",
                    border: HAIRLINE,
                    radius: "2px",
                  }}
                />
              </div>
            </section>

            {/* -------- Colophon -------- */}
            <footer id="contact" className="scroll-mt-24 px-6 pb-16 pt-4 text-center sm:px-10">
              <BrushRule className="mx-auto max-w-xs" />
              <SealMark className="mx-auto mt-10 rotate-2" size={52} />
              <p className={`${mincho.className} mt-5 text-xl tracking-[0.3em]`}>BIOSPHERE</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.24em]" style={{ color: MUTED }}>
                Biosphere Co. Ltd. — land & ecosystem studio
              </p>
              <p className="mt-4 text-sm" style={{ color: MUTED }}>
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
          </div>

          {/* bottom brocade band */}
          <div
            className="h-8 border-x border-b"
            style={{
              borderColor: GOLDTHREAD,
              backgroundColor: BROCADE,
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(211, 195, 143, 0.13) 0 1px, transparent 1px 9px), repeating-linear-gradient(-45deg, rgba(211, 195, 143, 0.13) 0 1px, transparent 1px 9px)",
            }}
          />
        </div>

        {/* the roller the scroll winds onto */}
        <div className="mx-auto flex w-full max-w-[66.5rem] items-center pb-14 pt-0.5">
          <span
            aria-hidden
            className="size-5 shrink-0 rounded-full"
            style={{ background: "radial-gradient(circle at 35% 35%, #3d332a, #16110c)" }}
          />
          <span
            aria-hidden
            className="-mx-1 h-3 min-w-0 flex-1 rounded-sm"
            style={{ background: "linear-gradient(to bottom, #3a3128, #241e17 55%, #120e0a)" }}
          />
          <span
            aria-hidden
            className="size-5 shrink-0 rounded-full"
            style={{ background: "radial-gradient(circle at 35% 35%, #3d332a, #16110c)" }}
          />
        </div>
      </div>

      <LayoutSwitcher />
    </div>
  );
}

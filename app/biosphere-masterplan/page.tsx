import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { Space_Grotesk, Fragment_Mono } from "next/font/google";
import logoImg from "@/public/img/layouts/biosphere-logo.png";
import heroImg from "@/public/img/layouts/biosphere-hero.jpg";
import casaImg from "@/public/img/layouts/biosphere-casa.jpg";
import buildImg from "@/public/img/layouts/biosphere-build.jpg";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { BiosphereMobileMenu } from "@/components/layouts/biosphere/mobile-menu";
import { SmoothScroll } from "@/components/layouts/portfolio/smooth-scroll";
import { SlotBooking, type SlotOption } from "@/components/layouts/SlotBooking";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Business Layout — Biosphere Masterplan",
  robots: { index: false },
};

const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "400", "500", "700"] });
const mono = Fragment_Mono({ subsets: ["latin"], weight: ["400"] });

/* Drafting-table palette */
const BG = "#0e1512";
const SHEET = "#121d18";
const HEAD = "#eef4ef";
const BODY = "#cfdad1";
const MUTED = "rgba(184, 200, 188, 0.66)";
const HAIRLINE = "rgba(184, 200, 188, 0.16)";
const HAIRLINE_STRONG = "rgba(184, 200, 188, 0.32)";
const PHOSPHOR = "#8fd08f";
const AMBER = "#d9a441";

const COORDS = "9.7419° N, 100.0136° E";

/* ------------------------------------------------------------------ */
/* Drawing system                                                      */
/* ------------------------------------------------------------------ */

/** Wobbly closed elevation ring around a peak — deterministic, no RNG. */
function ringPath(cx: number, cy: number, r: number, wobble: number, seed: number): string {
  const steps = 64;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const mod =
      1 +
      wobble *
        (0.5 * Math.sin(3 * a + seed) +
          0.3 * Math.sin(5 * a + seed * 1.7) +
          0.2 * Math.sin(2 * a - seed * 0.6));
    const x = cx + r * mod * Math.cos(a);
    const y = cy + r * 0.72 * mod * Math.sin(a);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${d}Z`;
}

const PEAKS = [
  { cx: 320, cy: 320, seed: 1.3, rings: 7, base: 42, step: 48, label: "PK +64.2" },
  { cx: 880, cy: 540, seed: 4.1, rings: 6, base: 48, step: 56, label: "PK +41.8" },
  { cx: 700, cy: 80, seed: 2.6, rings: 4, base: 36, step: 42, label: "" },
] as const;

/** Nested contour lines used as a large section background. */
function ContourField({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden
    >
      {PEAKS.map((p, pi) => (
        <g key={pi}>
          {Array.from({ length: p.rings }, (_, i) => (
            <path
              key={i}
              d={ringPath(p.cx, p.cy, p.base + i * p.step, 0.16, p.seed + i * 0.35)}
              fill="none"
              stroke="#b8c8bc"
              strokeOpacity={Math.max(0.03, 0.1 - i * 0.009)}
              strokeWidth={1}
            />
          ))}
          <circle cx={p.cx} cy={p.cy} r={2} fill={PHOSPHOR} fillOpacity={0.4} />
          {p.label && (
            <text
              x={p.cx + 10}
              y={p.cy - 8}
              fontSize={10}
              fill="#b8c8bc"
              fillOpacity={0.4}
              style={{ fontFamily: "monospace", letterSpacing: "0.1em" }}
            >
              {p.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

/** Circle-and-cross survey marker. */
function Crosshair({ className = "", color = PHOSPHOR }: { className?: string; color?: string }) {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" className={`pointer-events-none ${className}`} aria-hidden>
      <circle cx="22" cy="22" r="10" fill="none" stroke={color} strokeOpacity="0.75" strokeWidth="1" />
      <line x1="22" y1="2" x2="22" y2="13" stroke={color} strokeOpacity="0.75" strokeWidth="1" />
      <line x1="22" y1="31" x2="22" y2="42" stroke={color} strokeOpacity="0.75" strokeWidth="1" />
      <line x1="2" y1="22" x2="13" y2="22" stroke={color} strokeOpacity="0.75" strokeWidth="1" />
      <line x1="31" y1="22" x2="42" y2="22" stroke={color} strokeOpacity="0.75" strokeWidth="1" />
      <circle cx="22" cy="22" r="1.6" fill={color} />
    </svg>
  );
}

/** Dot + leader line + mono label, pinned onto photographs. */
function Callout({
  label,
  className = "",
  flip = false,
  tone = "sage",
  lineW = 34,
}: {
  label: string;
  className?: string;
  flip?: boolean;
  tone?: "sage" | "amber" | "phosphor";
  lineW?: number;
}) {
  const c = tone === "amber" ? AMBER : tone === "phosphor" ? PHOSPHOR : BODY;
  return (
    <div className={`pointer-events-none absolute z-10 flex items-center ${flip ? "flex-row-reverse" : ""} ${className}`}>
      <span aria-hidden className="relative flex size-2.5 items-center justify-center">
        <span className="absolute size-2.5 rounded-full" style={{ backgroundColor: c, opacity: 0.3 }} />
        <span className="size-1 rounded-full" style={{ backgroundColor: c }} />
      </span>
      <span aria-hidden className="h-px" style={{ width: lineW, backgroundColor: c, opacity: 0.6 }} />
      <span
        className={`${mono.className} whitespace-nowrap px-1.5 py-0.5 text-[10px] uppercase tracking-[0.14em]`}
        style={{ color: c, backgroundColor: "rgba(14, 21, 18, 0.8)" }}
      >
        {label}
      </span>
    </div>
  );
}

/** L-shaped registration ticks at the four corners of a sheet frame. */
function CornerTicks() {
  const s = { borderColor: HAIRLINE_STRONG };
  const base = "pointer-events-none absolute z-20 h-3.5 w-3.5";
  return (
    <>
      <span aria-hidden className={`${base} -left-1 -top-1 border-l border-t`} style={s} />
      <span aria-hidden className={`${base} -right-1 -top-1 border-r border-t`} style={s} />
      <span aria-hidden className={`${base} -bottom-1 -left-1 border-b border-l`} style={s} />
      <span aria-hidden className={`${base} -bottom-1 -right-1 border-b border-r`} style={s} />
    </>
  );
}

/** A numbered drawing sheet: hairline frame, corner ticks, title-block strip. */
function Sheet({
  id,
  num,
  title,
  children,
  className = "",
}: {
  id: string;
  num: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-24 ${className}`}>
      <div className="relative border" style={{ borderColor: HAIRLINE, backgroundColor: SHEET }}>
        <CornerTicks />
        <div
          className={`${mono.className} flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b px-4 py-2.5 text-[10px] uppercase tracking-[0.16em] sm:px-6`}
          style={{ borderColor: HAIRLINE }}
        >
          <span style={{ color: HEAD }}>
            SHEET {num} <span style={{ color: PHOSPHOR }}>—</span> {title}
          </span>
          <span className="hidden lg:inline" style={{ color: MUTED }}>
            BIOSPHERE CO. LTD. · LAND &amp; ECOSYSTEM DEVELOPMENT · KOH PHANGAN
          </span>
          <span className="hidden sm:inline" style={{ color: MUTED }}>
            {COORDS}
          </span>
        </div>
        {children}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Content data                                                        */
/* ------------------------------------------------------------------ */

const DISCIPLINES = [
  { idx: "D-01", name: "Strategic consulting", line: "Business model and land use resolved together, before capital moves." },
  { idx: "D-02", name: "Legal & governance", line: "Thai land law, titles and holding structures translated into plain decisions." },
  { idx: "D-03", name: "Nature intelligence", line: "Soil, species and microclimate surveyed as design instruments, not obstacles." },
  { idx: "D-04", name: "Water & ecology", line: "Swales, ponds and grey-water loops drawn before the first wall is." },
  { idx: "D-05", name: "Architecture & construction", line: "Bamboo and timber engineered for monsoon, raised by local hands." },
  { idx: "D-06", name: "Hospitality & community", line: "Operations, ritual and staffing designed into the plan from day one." },
] as const;

type PhaseState = "complete" | "active" | "ahead";

const PHASES: readonly {
  id: string;
  name: string;
  start: number;
  end: number;
  state: PhaseState;
}[] = [
  { id: "01", name: "Discovery & Strategy", start: 1, end: 1, state: "complete" },
  { id: "02", name: "Master Planning", start: 2, end: 3, state: "complete" },
  { id: "03", name: "Building With Nature", start: 4, end: 8, state: "active" },
  { id: "04", name: "Crafting the Experience", start: 9, end: 11, state: "ahead" },
  { id: "05", name: "Activation", start: 11, end: 11, state: "ahead" },
  { id: "06", name: "A Place Comes to Life", start: 12, end: 12, state: "ahead" },
];

function barStyle(state: PhaseState): CSSProperties {
  if (state === "complete") {
    return { backgroundColor: "rgba(184, 200, 188, 0.28)", border: "1px solid rgba(184, 200, 188, 0.6)" };
  }
  if (state === "active") {
    return {
      border: `1px solid ${PHOSPHOR}`,
      backgroundImage: `repeating-linear-gradient(45deg, rgba(143, 208, 143, 0.28) 0 4px, transparent 4px 9px)`,
    };
  }
  return { border: `1px dashed rgba(217, 164, 65, 0.75)` };
}

const MM = (n: number) => `M${String(n).padStart(2, "0")}`;

const VISIT_OPTIONS: readonly SlotOption[] = [
  { slug: "walk", name: "Land discovery walk", sub: "Two hours on your plot with a founding partner", price: 2500 },
  { slug: "masterplan-day", name: "Masterplan day", sub: "Full-day charrette — contours, water, law, budget", price: 12000 },
  { slug: "tour", name: "Site tour — both projects", sub: "La Casa + The Bay, transport from the pier included", price: 6500 },
];

const SPEC_CASA = [
  ["REF", "S-04.1 · REV C"],
  ["STATUS", "COMPLETE — HANDED OVER"],
  ["STRUCTURE", "BAMBOO · GOLDEN-RATIO GRID"],
  ["FOOTPRINT", "640 M² BUILT / 5.1 RAI"],
  ["FIRST GUESTS", "MONTH 12, AS DRAWN"],
] as const;

const SPEC_BAY = [
  ["REF", "S-04.2 · REV A"],
  ["STATUS", "IN PROGRESS — PHASE 03"],
  ["STRUCTURE", "BAMBOO · TIDE-FACING TERRACES"],
  ["FOOTPRINT", "1,180 M² PLANNED / 8.4 RAI"],
  ["FIRST GUESTS", "M12 · ON SCHEDULE"],
] as const;

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function BiosphereMasterplanPage() {
  return (
    <div
      className={`${grotesk.className} min-h-screen antialiased`}
      style={{
        backgroundColor: BG,
        color: BODY,
        backgroundImage:
          "linear-gradient(rgba(184, 200, 188, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(184, 200, 188, 0.05) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    >
      {/* -------- Header -------- */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-md"
        style={{ borderColor: HAIRLINE, backgroundColor: "rgba(14, 21, 18, 0.88)" }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#site" className="flex items-center gap-3">
            <Image src={logoImg} alt="" width={26} height={26} priority />
            <span className={`${mono.className} text-sm tracking-[0.3em]`} style={{ color: HEAD }}>
              BIOSPHERE
            </span>
            <span className={`${mono.className} hidden text-[9px] tracking-[0.24em] sm:inline`} style={{ color: MUTED }}>
              CO. LTD.
            </span>
          </a>
          <nav
            className={`${mono.className} hidden items-center gap-7 text-[11px] uppercase tracking-[0.18em] md:flex`}
            aria-label="Sections"
          >
            <a href="#survey" className="transition-colors hover:text-[#8fd08f]" style={{ color: BODY }}>
              About
            </a>
            <a href="#as-built" className="transition-colors hover:text-[#8fd08f]" style={{ color: BODY }}>
              Projects
            </a>
            <a href="#programme" className="transition-colors hover:text-[#8fd08f]" style={{ color: BODY }}>
              Events
            </a>
            <a href="#contact" className="transition-colors hover:text-[#8fd08f]" style={{ color: BODY }}>
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-1">
            <a
              href="#site-visit"
              className="rounded-[2px] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition-opacity hover:opacity-85"
              style={{ backgroundColor: AMBER, color: BG }}
            >
              Walk the land
            </a>
            <BiosphereMobileMenu
              links={[
                { label: "About", href: "#survey" },
                { label: "Projects", href: "#as-built" },
                { label: "Events", href: "#programme" },
                { label: "Contact", href: "#contact" },
              ]}
              cta={{ label: "Walk the land", href: "#site-visit" }}
              triggerColor={HEAD}
              panelStyle={{ backgroundColor: SHEET, color: HEAD, borderColor: HAIRLINE }}
              linkClassName={`${mono.className} text-lg uppercase tracking-[0.18em]`}
              ctaClassName="rounded-[2px] px-5 py-3 text-center text-[11px] font-bold uppercase tracking-[0.14em]"
              ctaStyle={{ backgroundColor: AMBER, color: BG }}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-12">
        {/* -------- SHEET 01 — SITE (hero) -------- */}
        <Sheet id="site" num="01" title="SITE">
          <div className="grain relative overflow-hidden">
            <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[2/1]">
              <Image
                src={heroImg}
                alt="Bamboo eco-villas with pools glowing at dusk on a jungle hillside"
                fill
                priority
                placeholder="blur"
                sizes="(min-width: 1280px) 1216px, 100vw"
                className="object-cover"
              />
              {/* night-render tint */}
              <div aria-hidden className="absolute inset-0" style={{ backgroundColor: "#22443a", mixBlendMode: "color", opacity: 0.45 }} />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(14,21,18,0.6) 0%, rgba(14,21,18,0.2) 38%, rgba(14,21,18,0.35) 62%, rgba(14,21,18,0.94) 100%)",
                }}
              />

              <Callout label="Villa cluster A" className="left-[8%] top-[24%] hidden md:flex" />
              <Callout label="Swale line — 2% grade" className="left-[38%] top-[52%] hidden md:flex" tone="phosphor" lineW={48} />
              <Callout label="Infinity pool — completed" className="right-[6%] top-[38%]" tone="amber" flip />
              <Crosshair className="absolute right-[16%] top-[12%] hidden sm:block" color="#b8c8bc" />

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-10">
                <p className={`${mono.className} text-[10px] uppercase tracking-[0.22em]`} style={{ color: PHOSPHOR }}>
                  DRG BIO-2026-014 · Concept masterplan — night render
                </p>
                <h1
                  className="mt-3 max-w-3xl text-4xl font-light leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
                  style={{ color: HEAD }}
                >
                  You bring the land.
                  <br />
                  <span className="font-medium">We reveal its future.</span>
                </h1>
              </div>
            </div>
          </div>
          <div
            className={`${mono.className} grid border-t text-[10px] uppercase tracking-[0.14em] sm:grid-cols-3 sm:text-[11px]`}
            style={{ borderColor: HAIRLINE }}
          >
            {[
              ["Plot area", "14.2 rai · 22,720 m²"],
              ["Elevation", "+18 to +64 m MSL"],
              ["Rainfall", "1,960 mm / yr · monsoon Oct–Dec"],
            ].map(([k, v], i) => (
              <p key={k} className={`flex justify-between gap-4 px-4 py-3 sm:px-6 ${i > 0 ? "border-t sm:border-l sm:border-t-0" : ""}`} style={{ borderColor: HAIRLINE }}>
                <span style={{ color: MUTED }}>{k}</span>
                <span style={{ color: BODY }}>{v}</span>
              </p>
            ))}
          </div>
        </Sheet>

        {/* -------- SHEET 02 — SURVEY -------- */}
        <Sheet id="survey" num="02" title="SURVEY — SIX DISCIPLINES" className="mt-10 sm:mt-14">
          <div className="relative overflow-hidden">
            <ContourField />
            <Crosshair className="absolute right-8 top-8 hidden lg:block" color="#b8c8bc" />
            <div className="relative px-4 py-10 sm:px-6 sm:py-14">
              <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
                <div>
                  <h2 className="max-w-xl text-3xl font-light tracking-tight sm:text-4xl" style={{ color: HEAD }}>
                    One survey. <span className="font-medium">Six instruments.</span>
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: BODY }}>
                    We design life around nature — architecture, nature, business and human wellbeing
                    drawn as one system. Before anything is built, six disciplines read the same
                    hectare and write on the same sheet.
                  </p>
                </div>
                <p className={`${mono.className} max-w-xs text-[11px] uppercase leading-relaxed tracking-[0.14em] lg:justify-self-end`} style={{ color: MUTED }}>
                  Note 01 — nothing is drawn that the land has not already suggested.
                </p>
              </div>

              <div className="mt-10 grid gap-px border sm:grid-cols-2 lg:grid-cols-3" style={{ borderColor: HAIRLINE, backgroundColor: HAIRLINE }}>
                {DISCIPLINES.map((d) => (
                  <div key={d.idx} className="p-5 sm:p-6" style={{ backgroundColor: "rgba(18, 29, 24, 0.82)" }}>
                    <p className={`${mono.className} text-[10px] tracking-[0.22em]`} style={{ color: PHOSPHOR }}>
                      {d.idx}
                    </p>
                    <h3 className="mt-3 text-lg font-medium" style={{ color: HEAD }}>
                      {d.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>
                      {d.line}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Sheet>

        {/* -------- SHEET 03 — PROGRAMME -------- */}
        <Sheet id="programme" num="03" title="PROGRAMME — 12 MONTHS" className="mt-10 sm:mt-14">
          <div className="px-4 py-10 sm:px-6 sm:py-14">
            <h2 className="text-3xl font-light tracking-tight sm:text-4xl" style={{ color: HEAD }}>
              From land to <span className="font-medium">lasting value.</span>
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: BODY }}>
              Six stages, twelve months, one monsoon cycle. Every stage has a purpose —
              nature cannot be rushed, and neither can meaningful development.
            </p>

            <div className="mt-10 overflow-x-auto">
              <div className="min-w-[540px]">
                {/* month scale */}
                <div className="md:grid md:grid-cols-[12.5rem_1fr]">
                  <span aria-hidden className="hidden md:block" />
                  <div className="grid" style={{ gridTemplateColumns: "repeat(12, minmax(0, 1fr))" }}>
                    {Array.from({ length: 12 }, (_, i) => (
                      <span
                        key={i}
                        className={`${mono.className} border-b py-1.5 text-center text-[9px] tracking-[0.1em] sm:text-[10px]`}
                        style={{ color: MUTED, borderColor: HAIRLINE, borderLeft: i > 0 ? `1px solid ${HAIRLINE}` : undefined }}
                      >
                        {MM(i + 1)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* phase rows */}
                {PHASES.map((p) => (
                  <div key={p.id} className="border-b md:grid md:grid-cols-[12.5rem_1fr] md:items-center" style={{ borderColor: HAIRLINE }}>
                    <div className="flex items-baseline gap-2 px-1 pt-3 md:py-3">
                      <span className={`${mono.className} whitespace-nowrap text-[10px] tracking-[0.18em]`} style={{ color: PHOSPHOR }}>
                        P-{p.id}
                      </span>
                      <span className="text-sm font-medium" style={{ color: HEAD }}>
                        {p.name}
                      </span>
                      <span className={`${mono.className} text-[9px] tracking-[0.1em]`} style={{ color: MUTED }}>
                        {p.start === p.end ? MM(p.start) : `${MM(p.start)}–${MM(p.end)}`}
                      </span>
                    </div>
                    <div className="relative grid h-10 md:h-12" style={{ gridTemplateColumns: "repeat(12, minmax(0, 1fr))" }}>
                      {Array.from({ length: 12 }, (_, i) => (
                        <span
                          key={i}
                          aria-hidden
                          style={{ gridColumn: i + 1, gridRow: 1, borderLeft: i > 0 ? `1px solid ${HAIRLINE}` : undefined }}
                        />
                      ))}
                      <div
                        className="my-2 flex items-center overflow-hidden px-2 md:my-2.5"
                        style={{ gridColumn: `${p.start} / ${p.end + 1}`, gridRow: 1, ...barStyle(p.state) }}
                      >
                        <span className={`${mono.className} hidden text-[9px] uppercase tracking-[0.14em] lg:inline`} style={{ color: HEAD }}>
                          {p.state === "complete" ? "complete" : p.state === "active" ? "in build" : "planned"}
                        </span>
                      </div>
                      {p.id === "06" && (
                        <span
                          className={`${mono.className} pointer-events-none absolute -top-1 right-0 hidden -rotate-6 border-2 px-2 py-0.5 text-[9px] tracking-[0.2em] lg:inline-block`}
                          style={{ borderColor: AMBER, color: AMBER }}
                        >
                          FIRST GUESTS
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* legend + stamp + note */}
            <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
              <p className={`${mono.className} flex items-center gap-2 text-[10px] uppercase tracking-[0.14em]`} style={{ color: MUTED }}>
                <span aria-hidden className="inline-block h-2.5 w-6" style={barStyle("complete")} /> complete
              </p>
              <p className={`${mono.className} flex items-center gap-2 text-[10px] uppercase tracking-[0.14em]`} style={{ color: MUTED }}>
                <span aria-hidden className="inline-block h-2.5 w-6" style={barStyle("active")} /> in progress — The Bay
              </p>
              <p className={`${mono.className} flex items-center gap-2 text-[10px] uppercase tracking-[0.14em]`} style={{ color: MUTED }}>
                <span aria-hidden className="inline-block h-2.5 w-6" style={barStyle("ahead")} /> planned
              </p>
              <span
                className={`${mono.className} inline-block -rotate-3 border-2 px-2.5 py-1 text-[10px] tracking-[0.22em] lg:hidden`}
                style={{ borderColor: AMBER, color: AMBER }}
              >
                M12 · FIRST GUESTS
              </span>
            </div>
            <p className={`${mono.className} mt-6 max-w-2xl text-[11px] uppercase leading-relaxed tracking-[0.14em]`} style={{ color: MUTED }}>
              Note 02 — “Speed comes from preparation, not from rushing.” — site journal, month one.
            </p>
          </div>
        </Sheet>

        {/* -------- SHEET 04 — AS BUILT -------- */}
        <Sheet id="as-built" num="04" title="AS BUILT — PROJECT RECORD" className="mt-10 sm:mt-14">
          <div className="px-4 py-10 sm:px-6 sm:py-14">
            <h2 className="text-3xl font-light tracking-tight sm:text-4xl" style={{ color: HEAD }}>
              Two records on file. <span className="font-medium">One plot open.</span>
            </h2>

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* La Casa */}
              <article className="border" style={{ borderColor: HAIRLINE, backgroundColor: "rgba(14, 21, 18, 0.6)" }}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={casaImg}
                    alt="Finished bamboo and wood interior of La Casa"
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1024px) 384px, (min-width: 768px) 45vw, 100vw"
                    className="object-cover"
                  />
                  <div aria-hidden className="absolute inset-0" style={{ backgroundColor: "rgba(14, 21, 18, 0.22)" }} />
                  <span
                    className={`${mono.className} absolute right-3 top-3 z-10 -rotate-6 border-2 px-2 py-1 text-[9px] tracking-[0.2em]`}
                    style={{ borderColor: AMBER, color: AMBER, backgroundColor: "rgba(14, 21, 18, 0.55)" }}
                  >
                    APPROVED · COMPLETE
                  </span>
                  <Callout label="Golden-ratio span" className="bottom-4 left-3" lineW={24} />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-medium" style={{ color: HEAD }}>
                    La Casa — The Fibonacci
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>
                    Golden-ratio pavilions stepping down a cacao slope — the record every new plot is
                    measured against.
                  </p>
                  <dl className={`${mono.className} mt-4 text-[10px] uppercase tracking-[0.12em] sm:text-[11px]`}>
                    {SPEC_CASA.map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-3 border-t py-1.5" style={{ borderColor: HAIRLINE }}>
                        <dt style={{ color: MUTED }}>{k}</dt>
                        <dd className="text-right" style={{ color: k === "STATUS" ? AMBER : BODY }}>
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </article>

              {/* The Bay */}
              <article className="border" style={{ borderColor: HAIRLINE, backgroundColor: "rgba(14, 21, 18, 0.6)" }}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={buildImg}
                    alt="Workers raising a bamboo frame on The Bay construction site"
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1024px) 384px, (min-width: 768px) 45vw, 100vw"
                    className="object-cover"
                  />
                  <div aria-hidden className="absolute inset-0" style={{ backgroundColor: "rgba(14, 21, 18, 0.22)" }} />
                  <span
                    className={`${mono.className} absolute right-3 top-3 z-10 -rotate-6 border-2 px-2 py-1 text-[9px] tracking-[0.2em]`}
                    style={{ borderColor: PHOSPHOR, color: PHOSPHOR, backgroundColor: "rgba(14, 21, 18, 0.55)" }}
                  >
                    PHASE 03 · BUILD
                  </span>
                  <Callout label="Ridge beam — day 141" className="bottom-4 left-3" tone="phosphor" lineW={24} />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-medium" style={{ color: HEAD }}>
                    The Bay
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>
                    A tide-facing bamboo hillside — frames up and roofs on before the rains return.
                  </p>
                  <dl className={`${mono.className} mt-4 text-[10px] uppercase tracking-[0.12em] sm:text-[11px]`}>
                    {SPEC_BAY.map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-3 border-t py-1.5" style={{ borderColor: HAIRLINE }}>
                        <dt style={{ color: MUTED }}>{k}</dt>
                        <dd className="text-right" style={{ color: k === "STATUS" ? PHOSPHOR : BODY }}>
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </article>

              {/* Plot 07 — conversion hook */}
              <article
                className="flex min-h-72 flex-col items-center justify-center gap-4 border border-dashed p-8 text-center md:col-span-2 lg:col-span-1"
                style={{ borderColor: "rgba(184, 200, 188, 0.4)" }}
              >
                <Crosshair color={AMBER} />
                <p className={`${mono.className} text-[10px] tracking-[0.22em]`} style={{ color: PHOSPHOR }}>
                  SHEET PENDING
                </p>
                <h3 className="text-xl font-medium" style={{ color: HEAD }}>
                  Plot 07 — Your land
                </h3>
                <div className={`${mono.className} space-y-1.5 text-[10px] uppercase tracking-[0.14em] sm:text-[11px]`} style={{ color: MUTED }}>
                  <p>STATUS: AWAITING SURVEY</p>
                  <p>CONTOURS: NOT YET WALKED</p>
                  <p>AREA: —— RAI</p>
                </div>
                <a
                  href="#site-visit"
                  className={`${mono.className} mt-2 border px-5 py-2.5 text-[10px] tracking-[0.2em] transition-colors hover:bg-[#d9a441] hover:text-[#0e1512]`}
                  style={{ borderColor: AMBER, color: AMBER }}
                >
                  COMMISSION THE SURVEY →
                </a>
              </article>
            </div>
          </div>
        </Sheet>

        {/* -------- SHEET 05 — SITE VISIT -------- */}
        <Sheet id="site-visit" num="05" title="SITE VISIT — BOOKING" className="mt-10 sm:mt-14">
          <div className="relative overflow-hidden">
            <ContourField className="opacity-60" />
            <div className="relative px-4 py-10 sm:px-6 sm:py-14">
              <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end">
                <div>
                  <h2 className="text-3xl font-light tracking-tight sm:text-4xl" style={{ color: HEAD }}>
                    Walk the land <span className="font-medium">with us.</span>
                  </h2>
                  <p className="mt-4 max-w-md text-base leading-relaxed" style={{ color: BODY }}>
                    Every masterplan starts on foot. Choose a survey, pick an open day — we bring the
                    maps, the water and the machetes.
                  </p>
                </div>
                <p className={`${mono.className} max-w-sm text-[11px] uppercase leading-relaxed tracking-[0.14em] lg:justify-self-end`} style={{ color: MUTED }}>
                  Note 03 — wear closed shoes. The jungle does not negotiate.
                </p>
              </div>

              <div className="mt-10">
                <SlotBooking
                  theme={{
                    accent: AMBER,
                    accentText: BG,
                    text: BODY,
                    muted: MUTED,
                    surface: SHEET,
                    border: "rgba(184, 200, 188, 0.22)",
                    radius: "2px",
                  }}
                  displayClass={grotesk.className}
                  options={VISIT_OPTIONS}
                  pickerLabel="Choose a survey"
                  priceUnit="per group"
                  qty={{ label: "People", min: 1, max: 8 }}
                  ctaLabel="Request site visit"
                  note="Demo booking — no payment taken. We confirm within one working day."
                />
              </div>
            </div>
          </div>
        </Sheet>
      </main>

      {/* -------- Footer: title block -------- */}
      <footer id="contact" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
        <div className="relative border" style={{ borderColor: HAIRLINE, backgroundColor: SHEET }}>
          <CornerTicks />
          <div className="grid gap-px md:grid-cols-3" style={{ backgroundColor: HAIRLINE }}>
            <div className="flex flex-col justify-between gap-6 p-6" style={{ backgroundColor: SHEET }}>
              <div className="flex items-center gap-3">
                <Image src={logoImg} alt="" width={34} height={34} />
                <div>
                  <p className={`${mono.className} text-sm tracking-[0.3em]`} style={{ color: HEAD }}>
                    BIOSPHERE
                  </p>
                  <p className={`${mono.className} mt-1 text-[9px] uppercase tracking-[0.2em]`} style={{ color: MUTED }}>
                    Land &amp; ecosystem development
                  </p>
                </div>
              </div>
              <p className={`${mono.className} text-[10px] uppercase tracking-[0.16em]`} style={{ color: MUTED }}>
                {COORDS} · {CONTACT.area}
              </p>
            </div>

            <div className={`${mono.className} p-6 text-[11px] uppercase tracking-[0.14em]`} style={{ backgroundColor: SHEET }}>
              <p style={{ color: MUTED }}>Title block — contact</p>
              <div className="mt-4 space-y-2.5">
                <p className="flex justify-between gap-4">
                  <span style={{ color: MUTED }}>TEL</span>
                  <a href={CONTACT.phoneHref} className="transition-colors hover:text-[#8fd08f]" style={{ color: BODY }}>
                    {CONTACT.phone}
                  </a>
                </p>
                <p className="flex justify-between gap-4">
                  <span style={{ color: MUTED }}>MAIL</span>
                  <a href={CONTACT.emailHref} className="normal-case transition-colors hover:text-[#8fd08f]" style={{ color: BODY }}>
                    {CONTACT.email}
                  </a>
                </p>
                <p className="flex justify-between gap-4 text-right">
                  <span style={{ color: MUTED }}>OFFICE</span>
                  <span style={{ color: BODY }}>{CONTACT.address}</span>
                </p>
              </div>
            </div>

            <div className={`${mono.className} p-6 text-[10px] uppercase tracking-[0.14em]`} style={{ backgroundColor: SHEET }}>
              <p style={{ color: MUTED }}>Revisions</p>
              <table className="mt-4 w-full border-collapse">
                <thead>
                  <tr>
                    {["REV", "DESCRIPTION", "DATE"].map((h) => (
                      <th key={h} className="border px-2 py-1.5 text-left font-normal" style={{ borderColor: HAIRLINE, color: MUTED }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-2 py-1.5" style={{ borderColor: HAIRLINE, color: AMBER }}>
                      A
                    </td>
                    <td className="border px-2 py-1.5" style={{ borderColor: HAIRLINE, color: BODY }}>
                      First light
                    </td>
                    <td className="border px-2 py-1.5" style={{ borderColor: HAIRLINE, color: BODY }}>
                      07.26
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1.5" style={{ borderColor: HAIRLINE, color: BODY }}>
                      0
                    </td>
                    <td className="border px-2 py-1.5" style={{ borderColor: HAIRLINE, color: BODY }}>
                      Issued for concept
                    </td>
                    <td className="border px-2 py-1.5" style={{ borderColor: HAIRLINE, color: BODY }}>
                      06.26
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div
            className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t px-6 py-4"
            style={{ borderColor: HAIRLINE }}
          >
            <p className="text-xs" style={{ color: MUTED }}>
              Concept redesign — demo content and prices.
            </p>
            <p className={`${mono.className} text-[10px] uppercase tracking-[0.18em]`} style={{ color: MUTED }}>
              Scale 1:1 · Do not scale from this drawing
            </p>
          </div>
        </div>
      </footer>

      <SmoothScroll />
      <LayoutSwitcher />
    </div>
  );
}

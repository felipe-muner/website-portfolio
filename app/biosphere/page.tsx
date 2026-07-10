import type { Metadata } from "next";
import Image from "next/image";
import { Newsreader, Figtree } from "next/font/google";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { BiosphereNav } from "@/components/layouts/biosphere/nav";
import { SmoothScroll } from "@/components/layouts/portfolio/smooth-scroll";
import { SlotBooking, type SlotOption } from "@/components/layouts/SlotBooking";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Business Layout — Biosphere",
  robots: { index: false },
};

const serif = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});
const sans = Figtree({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

const PAPER = "#f4efe4";
const INK = "#243122";
const CLAY = "#b3572f";
const TEAL = "#2a6157";
const AIR = "#5c7360";
const EMBER = "#c97a2b";
const HAIRLINE = "rgba(36, 49, 34, 0.16)";
const MUTED = "rgba(36, 49, 34, 0.7)";

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

/** Hand-drawn-feeling contour lines, used as a section divider. */
function Contours() {
  return (
    <svg
      viewBox="0 0 1200 80"
      preserveAspectRatio="none"
      className="h-14 w-full"
      aria-hidden
    >
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M0 ${30 + i * 14} C 200 ${8 + i * 14}, 380 ${52 + i * 14}, 620 ${26 + i * 14} S 1020 ${46 + i * 14}, 1200 ${20 + i * 14}`}
          fill="none"
          stroke={HAIRLINE}
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

const ELEMENTS: readonly {
  id: ElementKind;
  numeral: string;
  name: string;
  color: string;
  image: string;
  line: string;
  text: string;
  chips: readonly string[];
}[] = [
  {
    id: "earth",
    numeral: "I",
    name: "Earth",
    color: CLAY,
    image: "/img/layouts/biosphere-earth.jpg",
    line: "Every masterplan starts under your feet.",
    text: "We read soil, slope and stone before drawing a single wall. Terraces, swales and access roads are shaped from the land's own contours — so what gets built feels found, not forced.",
    chips: ["Land audit & masterplan", "Soil & terracing", "Architecture & construction"],
  },
  {
    id: "water",
    numeral: "II",
    name: "Water",
    color: TEAL,
    image: "/img/layouts/biosphere-water.jpg",
    line: "Water decides where life gathers.",
    text: "Spring, rain and greywater are mapped into one living cycle: swales slow it, ponds hold it, gardens drink it. Pools sit exactly where the land already wants water to rest.",
    chips: ["Hydrology & swales", "Pools & ponds", "Ecology & reforestation"],
  },
  {
    id: "wind",
    numeral: "III",
    name: "Wind",
    color: AIR,
    image: "/img/layouts/biosphere-wind.jpg",
    line: "The invisible layers carry the plan.",
    text: "Breeze paths cool the buildings before electricity has to; drones read the canopy from above; titles, permits and governance move quietly underneath. Everything you don't see — handled.",
    chips: ["Nature intelligence & survey", "Passive cooling & orientation", "Legal & governance"],
  },
  {
    id: "fire",
    numeral: "IV",
    name: "Fire",
    color: EMBER,
    image: "/img/layouts/biosphere-fire.jpg",
    line: "A place is finished when people gather in it.",
    text: "Kitchens, fire pits and lantern light turn a masterplan into a living address. We train the team, open the doors and stay through the first season of hospitality.",
    chips: ["Hospitality & operations", "Community & events", "Brand & business"],
  },
];

const PHASES = [
  { n: "01", months: "Months 1–2", title: "Discovery", text: "We walk the land with you — listening before drawing." },
  { n: "02", months: "Months 2–5", title: "Masterplan", text: "Contours, water, law and budget resolved in one integrated drawing." },
  { n: "03", months: "Months 5–11", title: "Build", text: "Bamboo and stone raised by local hands, supervised on site weekly." },
  { n: "04", months: "Month 12", title: "Activation", text: "Team trained, gardens planted, first guests by the fire." },
] as const;

const PROJECTS = [
  {
    id: "la-casa",
    name: "La Casa — The Fibonacci",
    image: "/img/layouts/biosphere-casa.jpg",
    note: "A spiral of shared pavilions where the golden ratio sets every room's proportion.",
    status: "Completed · 14 months",
  },
  {
    id: "the-bay",
    name: "The Bay",
    image: "/img/layouts/biosphere-build.jpg",
    note: "A tide-facing hillside raised entirely in bamboo — currently in its build season.",
    status: "In progress · phase 03",
  },
] as const;

const VISITS: readonly SlotOption[] = [
  { slug: "walk", name: "Land discovery walk", sub: "Two hours on your plot, first impressions on paper", price: 2500 },
  { slug: "masterplan", name: "Masterplan day", sub: "Full-day session — contours, water, phasing, budget", price: 12000 },
  { slug: "tour", name: "Project site tour", sub: "Visit La Casa and The Bay with the design team", price: 6500 },
];

export default function BiospherePage() {
  return (
    <div
      className={`${sans.className} min-h-dvh antialiased`}
      style={{ backgroundColor: PAPER, color: INK }}
    >
      <SmoothScroll />
      {/* Nav — same options as the live site: About ▾, Projects ▾, Contact, Events */}
      <BiosphereNav serifClass={serif.className} />

      {/* Hero */}
      <section id="top" className="relative flex min-h-[92dvh] items-end overflow-hidden">
        <Image
          src="/img/layouts/biosphere-hero.jpg"
          alt="Bamboo villas at dusk, pools reflecting the last light"
          fill
          priority
          sizes="100vw"
          className="slide-zoom-out object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(36,49,34,0.85) 0%, rgba(36,49,34,0.25) 45%, rgba(36,49,34,0.15) 100%)",
          }}
        />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-40 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#e4dcc8]">
            Land & ecosystem studio · Koh Phangan
          </p>
          <h1
            className={`${serif.className} mt-5 max-w-3xl text-4xl leading-[1.08] text-[#f4efe4] sm:text-6xl md:text-7xl`}
          >
            You bring the land.
            <br />
            <em className="font-normal">We reveal its future.</em>
          </h1>
          <div className="mt-8 flex items-center gap-5">
            {ELEMENTS.map((el) => (
              <a key={el.id} href={`#${el.id}`} aria-label={el.name} className="transition-transform hover:-translate-y-0.5">
                <ElementGlyph kind={el.id} color="#e4dcc8" size={22} />
              </a>
            ))}
            <span className="text-xs tracking-[0.2em] text-[#e4dcc8]/80">
              EARTH · WATER · WIND · FIRE
            </span>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section id="about" className="mx-auto max-w-3xl scroll-mt-24 px-5 pb-6 pt-20 text-center sm:px-8 md:pt-28">
        <p className={`${serif.className} text-2xl leading-relaxed sm:text-3xl`}>
          We design life around nature — masterplans where{" "}
          <em>architecture, ecology, business and human wellbeing</em> grow as one
          ecosystem, not four competing plans.
        </p>
        <p className="mt-6 text-sm" style={{ color: MUTED }}>
          One studio, six disciplines, four elements in balance.
        </p>
      </section>

      <Contours />

      {/* The four elements */}
      <section id="elements" className="mx-auto max-w-6xl scroll-mt-24 px-5 sm:px-8">
        {ELEMENTS.map((el, i) => (
          <article
            key={el.id}
            id={el.id}
            className={`grid scroll-mt-28 items-center gap-8 py-14 md:grid-cols-2 md:gap-14 md:py-20 ${
              i > 0 ? "border-t" : ""
            }`}
            style={{ borderColor: HAIRLINE }}
          >
            <div className={`relative overflow-hidden rounded-lg ${i % 2 === 1 ? "md:order-2" : ""}`}>
              <div className="relative aspect-[4/3]">
                <Image
                  src={el.image}
                  alt={el.name}
                  fill
                  sizes="(min-width: 768px) 45vw, 92vw"
                  className="object-cover"
                />
              </div>
              <span
                className="absolute left-4 top-4 grid size-10 place-items-center rounded-full backdrop-blur"
                style={{ backgroundColor: "rgba(244,239,228,0.85)" }}
              >
                <ElementGlyph kind={el.id} color={el.color} />
              </span>
            </div>

            <div>
              <p className={`${serif.className} text-5xl italic`} style={{ color: el.color }}>
                {el.numeral}
              </p>
              <h2 className={`${serif.className} mt-3 text-3xl sm:text-4xl`}>{el.name}</h2>
              <p className={`${serif.className} mt-4 text-xl italic`} style={{ color: el.color }}>
                {el.line}
              </p>
              <p className="mt-4 max-w-md leading-relaxed" style={{ color: MUTED }}>
                {el.text}
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {el.chips.map((chip) => (
                  <li
                    key={chip}
                    className="rounded-full border px-3.5 py-1.5 text-xs font-medium"
                    style={{ borderColor: el.color, color: el.color }}
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>

      {/* The year — process on dark ground */}
      <section id="year" className="scroll-mt-24 text-[#f4efe4]" style={{ backgroundColor: INK }}>
        <div className="relative h-64 w-full overflow-hidden sm:h-80">
          <Image
            src="/img/layouts/biosphere-plan.jpg"
            alt="Design team reviewing the masterplan on a bamboo construction site"
            fill
            sizes="100vw"
            className="object-cover opacity-80"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent 30%, #243122 100%)" }}
          />
        </div>
        <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
          <p className={`${serif.className} -mt-10 relative max-w-2xl text-2xl italic sm:text-3xl`}>
            "Speed comes from preparation, not from rushing."
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.3em] text-[#e4dcc8]/70">
            One year, four seasons of work
          </p>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {PHASES.map((phase) => (
              <div key={phase.n} className="border-t pt-5" style={{ borderColor: "rgba(244,239,228,0.25)" }}>
                <p className={`${serif.className} text-3xl italic`} style={{ color: EMBER }}>
                  {phase.n}
                </p>
                <p className="mt-1 text-[0.65rem] uppercase tracking-[0.25em] text-[#e4dcc8]/70">
                  {phase.months}
                </p>
                <h3 className={`${serif.className} mt-2.5 text-xl`}>{phase.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#e4dcc8]/85">{phase.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:px-8 md:py-24">
        <h2 className={`${serif.className} text-3xl sm:text-4xl`}>Living proof</h2>
        <p className="mt-3 max-w-xl" style={{ color: MUTED }}>
          Two grounds, two stories — both designed, built and activated by the studio.
        </p>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {PROJECTS.map((project) => (
            <figure key={project.name} id={project.id} className="group scroll-mt-28">
              <div className="relative aspect-[5/4] overflow-hidden rounded-lg">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  sizes="(min-width: 768px) 45vw, 92vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <figcaption className="flex items-baseline justify-between gap-4 pt-4">
                <div>
                  <h3 className={`${serif.className} text-xl`}>{project.name}</h3>
                  <p className="mt-1.5 max-w-sm text-sm leading-relaxed" style={{ color: MUTED }}>
                    {project.note}
                  </p>
                </div>
                <span
                  className="shrink-0 text-[0.65rem] font-medium uppercase tracking-[0.18em]"
                  style={{ color: CLAY }}
                >
                  {project.status}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <Contours />

      {/* Visit / booking — doubles as the "Events" destination */}
      <section id="events" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:px-8 md:py-20">
        <span id="visit" className="block scroll-mt-24" />
        <div className="grid items-start gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <h2 className={`${serif.className} text-3xl sm:text-4xl`}>Walk the land with us</h2>
            <p className="mt-4 max-w-md leading-relaxed" style={{ color: MUTED }}>
              Every project starts the same way: two hours on your plot, on foot,
              reading water, wind and soil together. Pick a visit and a day — we
              bring the maps.
            </p>
            <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src="/img/layouts/biosphere-community.jpg"
                alt="The studio team gathered under a bamboo pavilion"
                fill
                sizes="(min-width: 768px) 45vw, 92vw"
                className="object-cover"
              />
            </div>
          </div>
          <SlotBooking
            options={VISITS}
            displayClass={serif.className}
            pickerLabel="Visit"
            priceUnit="per visit"
            currency="฿"
            ctaLabel="Request this visit"
            note="Visit fees are credited back in full when a project begins."
            theme={{
              accent: CLAY,
              accentText: PAPER,
              text: INK,
              muted: MUTED,
              surface: "#faf7ef",
              border: HAIRLINE,
              radius: "8px",
            }}
          />
        </div>
      </section>

      {/* Footer — the "Contact" destination */}
      <footer id="contact" className="scroll-mt-24 border-t px-5 pb-16 pt-14 text-center" style={{ borderColor: HAIRLINE }}>
        <div className="flex items-center justify-center gap-4">
          {ELEMENTS.map((el) => (
            <ElementGlyph key={el.id} kind={el.id} color={el.color} size={18} />
          ))}
        </div>
        <Image
          src="/img/layouts/biosphere-logo.png"
          alt="Biosphere logo"
          width={48}
          height={48}
          className="mx-auto mt-8 size-12"
        />
        <p className={`${serif.className} mt-4 text-xl tracking-[0.28em]`}>BIOSPHERE</p>
        <p className="mt-1 text-xs uppercase tracking-[0.2em]" style={{ color: MUTED }}>
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

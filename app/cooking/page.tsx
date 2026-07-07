import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Anton, Caveat, Karla } from "next/font/google";
import { format } from "date-fns";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { SlotBooking, type SlotOption } from "@/components/layouts/SlotBooking";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Business Layout — Som Tam Kitchen",
  robots: { index: false },
};

const display = Anton({ subsets: ["latin"], weight: "400" });
const hand = Caveat({ subsets: ["latin"], weight: ["500", "700"] });
const body = Karla({ subsets: ["latin"], weight: ["400", "700"] });

/* Market palette — banana leaf, index-card paper, chili, unripe papaya. */
const LEAF = "#17402a";
const PAPER = "#fffbee";
const CHILI = "#c0331b";
const PAPAYA = "#e9efdb";
const INK = "#23281e";
const RULE = "#a9c4da"; // index-card blue rule
const MARGIN = "#e2574a"; // index-card red margin line

type Heat = 0 | 1 | 2 | 3;

const MENU: readonly { name: string; thai: string; note: string; heat: Heat }[] = [
  { name: "Som tam Thai", thai: "ส้มตำไทย", note: "Green papaya salad, pounded dish-by-dish in the clay mortar.", heat: 3 },
  { name: "Gaeng khiao wan", thai: "แกงเขียวหวาน", note: "Green curry — you pound the paste yourself, no jar in sight.", heat: 2 },
  { name: "Pad kaprao gai", thai: "ผัดกะเพราไก่", note: "Holy basil chicken over a proper flame, crispy egg on top.", heat: 2 },
  { name: "Khao niao mamuang", thai: "ข้าวเหนียวมะม่วง", note: "Mango sticky rice — the reward course.", heat: 0 },
];

const INGREDIENTS = [
  "green papaya",
  "bird's-eye chili",
  "kaffir lime leaf",
  "galangal",
  "lemongrass",
  "holy basil",
  "palm sugar",
  "tamarind",
  "coriander root",
  "sticky rice",
  "young coconut",
  "fish sauce",
] as const;

const STEPS: readonly { n: string; time: string; title: string; text: string }[] = [
  { n: "1", time: "09:00", title: "Market walk", text: "We meet between the stalls at Thongsala morning market. You learn to tell galangal from ginger by smell, pick a papaya that is still crunchy, and haggle — a little." },
  { n: "2", time: "10:15", title: "Pastes & pestles", text: "Back at the kitchen: dry chilies, coriander root, shrimp paste. You pound your own curry paste in a granite mortar until your arm complains. That is how you know it is ready." },
  { n: "3", time: "11:00", title: "Wok stations", text: "One burner each, real fire. Chef Nok calls the order — oil, paste, protein, basil last — and you cook every dish on the card with your own hands." },
  { n: "4", time: "12:30", title: "Eat together", text: "Everything lands on the long table at once and we eat what you made. You leave full, with the recipe book in your bag." },
];

const CLASSES: readonly (SlotOption & { time: string })[] = [
  { slug: "market", name: "Morning Market Class", sub: "Market walk included — shop with the chef, cook the full card.", price: 1400, time: "09:00 – 13:30" },
  { slug: "curry", name: "Curry & Wok Night", sub: "Same four dishes, evening pace, sunset from the wok station.", price: 1200, time: "16:00 – 19:30" },
  { slug: "vegan", name: "Plant-Based Thai", sub: "The whole menu without fish sauce — and nothing missing.", price: 1200, time: "10:00 – 13:00" },
  { slug: "private", name: "Private Family Class", sub: "The kitchen is yours, up to six cooks, menu of your choice.", price: 3500, time: "your time" },
];

const SNAPSHOTS: readonly { src: string; caption: string; tilt: string; lift?: string }[] = [
  { src: "/img/layouts/cooking-2.jpg", caption: "market haul, 7 a.m.", tilt: "-rotate-3" },
  { src: "/img/layouts/cooking-3.jpg", caption: "Chef Nok on paste duty", tilt: "rotate-2", lift: "md:translate-y-6" },
  { src: "/img/layouts/cooking-4.jpg", caption: "green curry, from scratch", tilt: "-rotate-2", lift: "md:-translate-y-3" },
  { src: "/img/layouts/cooking-1.jpg", caption: "the eating part", tilt: "rotate-3", lift: "md:translate-y-4" },
];

export default function CookingLayout() {
  return (
    <div className={body.className} style={{ backgroundColor: PAPER, color: INK }}>
      <style>{`
        @keyframes stk-settle {
          from { opacity: 0; transform: rotate(-3.5deg) translateY(18px); }
          to { opacity: 1; transform: rotate(-1.2deg) translateY(0); }
        }
        .stk-card { animation: stk-settle 0.7s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .stk-card { animation: none; transform: rotate(-1.2deg); }
          .stk-marquee * { animation: none !important; }
        }
      `}</style>
      <Hero />
      <IngredientTicker />
      <Steps />
      <Scrapbook />
      <Booking />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Tape({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute h-6 w-20 ${className}`}
      style={{ backgroundColor: "rgba(233, 214, 150, 0.7)", boxShadow: "0 1px 2px rgba(0,0,0,0.12)" }}
    />
  );
}

function HeatDots({ level }: { level: Heat }) {
  return (
    <span
      role="img"
      aria-label={level === 0 ? "No chili heat" : `Chili heat ${level} of 3`}
      className="flex shrink-0 items-center gap-1.5 pt-2"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden
          className="size-2.5 rounded-full"
          style={i < level ? { backgroundColor: CHILI } : { border: `1.5px solid ${CHILI}66` }}
        />
      ))}
    </span>
  );
}

function Hero() {
  return (
    <section style={{ backgroundColor: LEAF }}>
      <header className="mx-auto flex max-w-5xl flex-wrap items-baseline justify-between gap-x-8 gap-y-2 px-5 pt-7 md:px-10">
        <Link href="/" className={`${display.className} text-xl uppercase`} style={{ color: PAPER }}>
          Som Tam Kitchen
        </Link>
        <nav className="flex gap-6 text-sm font-bold" style={{ color: `${PAPER}b3` }}>
          <a href="#how" className="hover:underline hover:decoration-2 hover:underline-offset-4">The day</a>
          <a href="#wall" className="hover:underline hover:decoration-2 hover:underline-offset-4">Photos</a>
          <a href="#book" className="hover:underline hover:decoration-2 hover:underline-offset-4">Book</a>
        </nav>
      </header>

      <div className="mx-auto max-w-5xl px-5 pb-20 pt-12 md:px-10 md:pb-28 md:pt-16">
        <p className={`${hand.className} text-center text-2xl md:text-3xl`} style={{ color: "#cfe3a6" }}>
          tonight, and every day, in Srithanu — pinned to the kitchen door:
        </p>

        {/* The signature: tonight's menu as an index card. */}
        <article className="stk-card relative mx-auto mt-8 max-w-2xl rounded-[4px] px-6 pb-7 pt-8 sm:px-10" style={{ backgroundColor: PAPER, boxShadow: "0 18px 40px rgba(0,0,0,0.35)" }}>
          <Tape className="-top-3 left-6 -rotate-6" />
          <Tape className="-top-3 right-6 rotate-3" />
          {/* red margin line, like a real index card */}
          <span aria-hidden className="absolute bottom-0 left-4 top-0 w-px sm:left-7" style={{ backgroundColor: `${MARGIN}99` }} />

          <p className="text-xs font-bold" style={{ color: `${INK}80` }}>
            Som Tam Kitchen · Koh Phangan · four dishes, one afternoon
          </p>
          <h1 className={`${display.className} mt-2 text-4xl uppercase leading-none md:text-6xl`}>
            <span className="sr-only">Tonight at Som Tam Kitchen, </span>You will cook:
          </h1>

          <ul className="mt-6">
            {MENU.map((dish) => (
              <li key={dish.name} className="flex items-start justify-between gap-4 py-4" style={{ borderBottom: `1px solid ${RULE}` }}>
                <div>
                  <p className="text-lg font-bold leading-snug md:text-xl">
                    {dish.name} <span className="ml-1 text-sm font-normal" style={{ color: `${INK}73` }}>{dish.thai}</span>
                  </p>
                  <p className="mt-0.5 text-sm" style={{ color: `${INK}99` }}>{dish.note}</p>
                </div>
                <HeatDots level={dish.heat} />
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <p className="text-sm font-bold">
              from ฿1,200 · 8 wok stations · daily
            </p>
            <a href="#book" className={`${display.className} text-lg uppercase underline decoration-2 underline-offset-4 transition-opacity hover:opacity-70`} style={{ color: CHILI, textDecorationColor: CHILI }}>
              Save a wok station ↓
            </a>
          </div>
          <p className={`${hand.className} mt-4 text-lg`} style={{ color: `${INK}8c` }}>
            ● = chili heat — say &ldquo;pet nit noi&rdquo; and we go easy on you.
          </p>
        </article>
      </div>
    </section>
  );
}

function IngredientTicker() {
  const strip = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {INGREDIENTS.map((item) => (
        <li key={item} className={`${hand.className} flex items-center whitespace-nowrap text-xl md:text-2xl`}>
          <span className="px-5">{item}</span>
          <span aria-hidden className="size-1.5 rounded-full" style={{ backgroundColor: `${PAPER}80` }} />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="stk-marquee relative z-10 -my-5 -rotate-[1.2deg] py-2" aria-label="On tomorrow's market list" style={{ backgroundColor: CHILI, color: PAPER, marginLeft: "-2%", marginRight: "-2%" }}>
      <div className="overflow-hidden">
        <div className="flex w-max animate-landing-marquee">
          {strip(false)}
          {strip(true)}
        </div>
      </div>
    </div>
  );
}

function Steps() {
  return (
    <section id="how" className="mx-auto max-w-3xl scroll-mt-10 px-5 pb-20 pt-24 md:px-10 md:pb-24 md:pt-32">
      <p className={`${hand.className} text-2xl`} style={{ color: CHILI }}>the method —</p>
      <h2 className={`${display.className} mt-1 text-4xl uppercase leading-none md:text-5xl`}>
        Market to table, in four steps
      </h2>
      <p className="mt-3 max-w-md text-base" style={{ color: `${INK}99` }}>
        Times from the Morning Market Class. Evening classes run the same
        recipe, minus the market walk.
      </p>

      <ol className="mt-12">
        {STEPS.map((step, i) => (
          <li key={step.n} className="grid grid-cols-[3.25rem_1fr] gap-x-5 md:gap-x-8">
            <div className="flex flex-col items-center">
              <span className={`${display.className} flex size-[3.25rem] shrink-0 items-center justify-center rounded-full text-2xl`} style={{ border: `2px solid ${INK}`, color: INK }}>
                {step.n}
              </span>
              {i < STEPS.length - 1 && (
                <span aria-hidden className="w-px flex-1" style={{ borderLeft: `2px dashed ${INK}40` }} />
              )}
            </div>
            <div className={i < STEPS.length - 1 ? "pb-10" : ""}>
              <p className="flex flex-wrap items-baseline gap-x-3 pt-1">
                <span className={`${display.className} text-2xl uppercase`}>{step.title}</span>
                <span className={`${hand.className} text-xl`} style={{ color: CHILI }}>≈ {step.time}</span>
              </p>
              <p className="mt-2 max-w-xl leading-relaxed" style={{ color: `${INK}b3` }}>{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Scrapbook() {
  return (
    <section id="wall" className="scroll-mt-10 overflow-hidden py-16 md:py-20" style={{ backgroundColor: PAPAYA }}>
      <h2 className={`${hand.className} text-center text-3xl md:text-4xl`}>
        from the kitchen wall
      </h2>
      <div className="mx-auto mt-10 flex max-w-5xl flex-wrap items-start justify-center gap-8 px-5 md:gap-4 md:px-10">
        {SNAPSHOTS.map((shot) => (
          <figure key={shot.src} className={`relative w-60 p-3 pb-2 md:w-64 ${shot.tilt} ${shot.lift ?? ""}`} style={{ backgroundColor: "#fff", boxShadow: "0 10px 24px rgba(35,40,30,0.18)" }}>
            <Tape className="-top-3 left-1/2 w-16 -translate-x-1/2 -rotate-2" />
            <div className="relative aspect-[4/3]">
              <Image src={shot.src} alt={shot.caption} fill sizes="(min-width: 768px) 256px, 240px" className="object-cover" />
            </div>
            <figcaption className={`${hand.className} pt-2 text-center text-xl`} style={{ color: `${INK}b3` }}>
              {shot.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Booking() {
  return (
    <section id="book" className="mx-auto max-w-4xl scroll-mt-10 px-5 py-20 md:px-10 md:py-28">
      <p className={`${hand.className} text-2xl`} style={{ color: CHILI }}>the classes —</p>
      <h2 className={`${display.className} mt-1 text-4xl uppercase leading-none md:text-5xl`}>
        Pick your class
      </h2>

      <ul className="mt-10">
        {CLASSES.map((c) => (
          <li key={c.slug} className="py-4" style={{ borderBottom: `1px dotted ${INK}59` }}>
            <p className="flex items-baseline gap-3">
              <span className="text-lg font-bold">{c.name}</span>
              <span aria-hidden className="min-w-8 flex-1" style={{ borderBottom: `2px dotted ${INK}40` }} />
              <span className={`${display.className} text-xl`} style={{ color: CHILI }}>฿{c.price.toLocaleString()}</span>
            </p>
            <p className="mt-1 text-sm" style={{ color: `${INK}99` }}>
              {c.time} · {c.sub}
            </p>
          </li>
        ))}
      </ul>

      <p className="mt-10 max-w-md" style={{ color: `${INK}99` }}>
        Eight wok stations, so eight seats. Pick a class and an open day —
        crossed-out days are already full.
      </p>
      <div className="mt-6">
        <SlotBooking
          options={CLASSES}
          displayClass={hand.className}
          pickerLabel="Choose your class"
          priceUnit="per person"
          qty={{ label: "Seats", min: 1, max: 8 }}
          ctaLabel="Request these seats"
          note="Vegetarian & allergy-friendly on request."
          theme={{ accent: CHILI, accentText: PAPER, text: INK, muted: `${INK}99`, surface: "#fff", border: `${INK}30`, radius: "6px" }}
        />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-5 py-14 text-center md:px-10" style={{ backgroundColor: LEAF, color: PAPER }}>
      <p className={`${hand.className} text-3xl md:text-4xl`}>Som Tam Kitchen</p>
      <p className={`${hand.className} mx-auto mt-3 max-w-2xl text-xl leading-relaxed md:text-2xl`} style={{ color: `${PAPER}cc` }}>
        {CONTACT.address} · <a href={CONTACT.phoneHref} className="underline decoration-dotted underline-offset-4 hover:opacity-80">{CONTACT.phone}</a> · <a href={CONTACT.instagram} className="underline decoration-dotted underline-offset-4 hover:opacity-80">{CONTACT.instagramHandle}</a>
      </p>
      <p className={`${hand.className} mt-2 text-xl`} style={{ color: "#cfe3a6" }}>
        walk-ins welcome when a wok is free — daily except Songkran
      </p>
      <p className="mt-8 text-xs" style={{ color: `${PAPER}66` }}>
        © {format(new Date(), "yyyy")} Som Tam Kitchen — a fictional demo · cooking-class layout
      </p>
    </footer>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Barlow, Bebas_Neue } from "next/font/google";
import { Clock, MapPin, Scissors } from "lucide-react";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { MenuFinder, type MenuItem } from "@/components/layouts/MenuFinder";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Business Layout — Fade District Barbershop",
  robots: { index: false },
};

const display = Bebas_Neue({ subsets: ["latin"], weight: "400" });
const body = Barlow({ subsets: ["latin"], weight: ["400", "500", "700"] });

const COAL = "#121212";
const BONE = "#f4f1ea";
const POLE_RED = "#c8362e";
const POLE_BLUE = "#274f8e";

const SERVICES: readonly MenuItem[] = [
  { name: "The District fade", detail: "Skin fade, sharp lines, hot-towel finish.", price: 450, category: "Cuts", tags: ["fade", "signature"] },
  { name: "Scissor cut", detail: "Length kept, shape found. Wash included.", price: 400, category: "Cuts", tags: ["classic"] },
  { name: "Buzz & clean-up", detail: "All over, edges squared, out in twenty.", price: 250, category: "Cuts", tags: ["fast"] },
  { name: "Kids' chop", detail: "Under 12s, lollipop diplomacy included.", price: 200, category: "Cuts", tags: ["kids"] },
  { name: "Hot-towel shave", detail: "Straight razor, two lathers, cold finish.", price: 350, category: "Shaves", tags: ["razor", "classic"] },
  { name: "Beard sculpt", detail: "Trim, line-up, oil — jawline restored.", price: 250, category: "Shaves", tags: ["beard"] },
  { name: "The full service", detail: "Fade + shave + face towel. The works.", price: 700, category: "Combos", tags: ["signature", "best value"] },
  { name: "Grey blend", detail: "Subtle camo colour, ten-minute process.", price: 300, category: "Extras", tags: ["colour"] },
  { name: "Black mask facial", detail: "Deep clean while the cape is on.", price: 200, category: "Extras", tags: ["skin"] },
] as const;

const STRIPES: React.CSSProperties = {
  backgroundImage: `repeating-linear-gradient(135deg, ${POLE_RED} 0 14px, ${BONE} 14px 28px, ${POLE_BLUE} 28px 42px, ${BONE} 42px 56px)`,
};

export default function FadeDistrict() {
  return (
    <div className={`${body.className}`} style={{ backgroundColor: BONE, color: COAL }}>
      <PoleStripe />
      <Nav />
      <Hero />
      <Services />
      <Chairs />
      <Hours />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function PoleStripe() {
  return <div aria-hidden className="h-2.5 w-full" style={STRIPES} />;
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-[#121212] backdrop-blur" style={{ backgroundColor: `${BONE}f0` }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-10">
        <Link href="/" className={`${display.className} flex items-center gap-2 text-2xl tracking-[0.08em]`}>
          <Scissors className="size-5" style={{ color: POLE_RED }} />
          FADE DISTRICT
        </Link>
        <nav className="hidden gap-8 text-sm font-bold uppercase tracking-[0.2em] md:flex" style={{ color: `${COAL}99` }}>
          <a href="#services" className="hover:text-[#c8362e]">Price list</a>
          <a href="#chairs" className="hover:text-[#c8362e]">The chairs</a>
          <a href="#hours" className="hover:text-[#c8362e]">Hours</a>
        </nav>
        <a
          href="#hours"
          className="border-2 border-[#121212] bg-[#121212] px-6 py-2 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[4px_4px_0_0] shadow-[#c8362e] transition-transform hover:-translate-y-0.5"
        >
          Walk in today
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="border-b-2 border-[#121212]">
      <div className="mx-auto grid max-w-6xl items-stretch gap-0 md:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col justify-center px-5 py-16 md:px-10 md:py-24">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.35em]" style={{ color: POLE_RED }}>
              Est. 2018 · cuts, shaves &amp; talk
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className={`${display.className} mt-4 text-7xl leading-[0.92] md:text-9xl`}>
              Look sharp,
              <br />
              <span style={{ color: POLE_BLUE }}>leave sharper.</span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-6 max-w-md text-lg leading-relaxed" style={{ color: `${COAL}b3` }}>
              Three chairs, cold towels, good records and the cleanest fades
              on the island. Walk-ins welcome — the pole never lies.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#services"
                className="border-2 border-[#121212] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[5px_5px_0_0] shadow-[#274f8e] transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: POLE_RED }}
              >
                The price list
              </a>
              <a
                href={CONTACT.phoneHref}
                className="border-2 border-[#121212] bg-white px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] shadow-[5px_5px_0_0] shadow-[#121212] transition-transform hover:-translate-y-0.5"
              >
                {CONTACT.phone}
              </a>
            </div>
          </Reveal>
        </div>
        <Reveal from="right" className="relative min-h-[24rem] border-l-2 border-[#121212]">
          <Image
            src="/img/layouts/barber-chairs.jpg"
            alt="The chairs at Fade District"
            fill
            priority
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover grayscale-[0.35]"
          />
          <span className={`${display.className} absolute bottom-5 left-5 bg-[#121212] px-4 py-1.5 text-lg tracking-[0.1em] text-white`}>
            CHAIR № 1 · 2 · 3
          </span>
        </Reveal>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="mx-auto max-w-5xl px-5 py-20 md:px-10 md:py-28">
      <Reveal>
        <h2 className={`${display.className} text-center text-6xl tracking-[0.05em] md:text-7xl`}>
          The price list
        </h2>
        <p className="mx-auto mt-3 max-w-md text-center text-base" style={{ color: `${COAL}99` }}>
          Search what you need — fade, beard, razor — prices stay honest.
        </p>
      </Reveal>
      <Reveal delay={140}>
        <div className="mt-10">
          <MenuFinder
            items={SERVICES}
            displayClass={`${display.className} tracking-[0.05em]`}
            placeholder="Fade? Beard? The works?…"
            unitLabel="services"
            theme={{
              accent: POLE_RED,
              accentText: "#ffffff",
              text: COAL,
              muted: `${COAL}99`,
              surface: "#ffffff",
              border: `${COAL}33`,
              radius: "0px",
            }}
          />
        </div>
      </Reveal>
    </section>
  );
}

function Chairs() {
  const barbers = [
    { name: "Otto", chair: "Chair 1", spec: "Fades & flat-tops", img: "/img/layouts/person-m7.jpg" },
    { name: "June", chair: "Chair 2", spec: "Scissor work & colour", img: "/img/layouts/person-f3.jpg" },
    { name: "Beam", chair: "Chair 3", spec: "Razor shaves & beards", img: "/img/layouts/person-m5.jpg" },
  ];
  return (
    <section id="chairs" className="border-y-2 border-[#121212] py-20 text-white md:py-28" style={{ backgroundColor: COAL }}>
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-center text-6xl tracking-[0.05em]`}>
            Three chairs, three characters
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {barbers.map((b, i) => (
            <Reveal key={b.name} delay={i * 90}>
              <article className="group border-2 border-white/20 bg-white/5 p-4 transition-colors hover:border-white/50">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={b.img}
                    alt={`${b.name} — ${b.spec}`}
                    fill
                    sizes="(min-width: 768px) 30vw, 90vw"
                    className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                  />
                  <span className={`${display.className} absolute left-3 top-3 px-3 py-1 text-base tracking-[0.1em] text-white`} style={{ backgroundColor: i % 2 ? POLE_BLUE : POLE_RED }}>
                    {b.chair}
                  </span>
                </div>
                <h3 className={`${display.className} mt-4 text-3xl tracking-[0.06em]`}>{b.name}</h3>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/70">{b.spec}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Hours() {
  const rows = [
    { d: "Tuesday — Saturday", t: "10:00 – 20:00" },
    { d: "Sunday", t: "11:00 – 17:00" },
    { d: "Monday", t: "Closed — gone fishing" },
  ];
  return (
    <section id="hours" className="mx-auto max-w-4xl px-5 py-20 text-center md:py-28">
      <Reveal>
        <Clock className="mx-auto size-8" style={{ color: POLE_BLUE }} />
        <h2 className={`${display.className} mt-4 text-6xl tracking-[0.05em]`}>
          Pole hours
        </h2>
        <div className="mx-auto mt-8 max-w-md border-2 border-[#121212] bg-white shadow-[6px_6px_0_0] shadow-[#c8362e]">
          {rows.map((r, i) => (
            <p key={r.d} className={`flex items-baseline justify-between gap-4 px-6 py-4 text-base font-bold ${i < rows.length - 1 ? "border-b-2 border-dashed border-[#121212]/30" : ""}`}>
              <span className="uppercase tracking-[0.12em]">{r.d}</span>
              <span style={{ color: i === 2 ? POLE_RED : POLE_BLUE }}>{r.t}</span>
            </p>
          ))}
        </div>
        <p className="mt-6 flex items-center justify-center gap-2 text-base" style={{ color: `${COAL}b3` }}>
          <MapPin className="size-4" style={{ color: POLE_RED }} />
          {CONTACT.address}
        </p>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <PoleStripe />
      <div className="py-10 text-center" style={{ backgroundColor: COAL }}>
        <p className={`${display.className} text-2xl tracking-[0.1em] text-white`}>
          FADE DISTRICT
        </p>
        <p className="mt-2 text-sm font-bold uppercase tracking-[0.25em] text-white/55">
          © {new Date().getFullYear()} — fictional demo · Barbershop layout
        </p>
      </div>
    </footer>
  );
}

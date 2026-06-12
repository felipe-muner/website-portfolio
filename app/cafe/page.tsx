import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fredoka, Nunito } from "next/font/google";
import { Coffee, Croissant, Heart, MapPin, Sun } from "lucide-react";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { MenuFinder, type MenuItem } from "@/components/layouts/MenuFinder";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Business Layout — Crumb & Co. Café",
  robots: { index: false },
};

const display = Fredoka({ subsets: ["latin"], weight: ["500", "600"] });
const body = Nunito({ subsets: ["latin"], weight: ["400", "600", "800"] });

const PAPER2 = "#faf3e8";
const ESPRESSO = "#4a3225";
const BUTTER = "#f0b432";
const MATCHA = "#7c9a5e";

const MENU: readonly MenuItem[] = [
  { name: "Flat white", detail: "Double shot, silky milk, our island house blend.", price: 90, category: "Coffee", tags: ["espresso", "classic"] },
  { name: "Iced coconut latte", detail: "Cold brew over fresh coconut milk and palm syrup.", price: 110, category: "Coffee", tags: ["iced", "signature"] },
  { name: "Matcha cloud", detail: "Ceremonial matcha whisked into oat-milk foam.", price: 120, category: "Coffee", tags: ["iced", "matcha"] },
  { name: "Butter croissant", detail: "Laminated for three days, gone in three minutes.", price: 85, category: "Bakery", tags: ["pastry", "classic"] },
  { name: "Mango sticky bun", detail: "Brioche swirl, ripe mango, toasted coconut.", price: 105, category: "Bakery", tags: ["pastry", "signature"] },
  { name: "Dark rye sourdough", detail: "Whole loaf, baked at dawn — reserve yours.", price: 160, category: "Bakery", tags: ["bread"] },
  { name: "Avocado toast", detail: "Sourdough, chili flakes, lime, soft egg.", price: 165, category: "Brunch", tags: ["brunch", "vegetarian"] },
  { name: "Dragonfruit bowl", detail: "Pink smoothie bowl, granola, island fruit.", price: 150, category: "Brunch", tags: ["vegan", "bowl"] },
  { name: "Banana-caramel pancakes", detail: "Stack of three, burnt caramel, sea salt.", price: 170, category: "Brunch", tags: ["sweet", "signature"] },
] as const;

export default function CrumbCafe() {
  return (
    <div className={`${body.className}`} style={{ backgroundColor: PAPER2, color: ESPRESSO }}>
      <Nav />
      <Hero />
      <Counter />
      <Menu />
      <Mornings />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b-2 backdrop-blur" style={{ backgroundColor: `${PAPER2}f0`, borderColor: `${ESPRESSO}1f` }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-10">
        <Link href="/" className={`${display.className} flex items-center gap-2 text-2xl`}>
          <Croissant className="size-6" style={{ color: BUTTER }} />
          Crumb &amp; Co.
        </Link>
        <nav className="hidden gap-8 text-base font-extrabold md:flex" style={{ color: `${ESPRESSO}b3` }}>
          <a href="#menu" className="hover:text-[#f0b432]">Menu</a>
          <a href="#mornings" className="hover:text-[#f0b432]">Mornings</a>
          <a href="#visit" className="hover:text-[#f0b432]">Visit</a>
        </nav>
        <a
          href="#menu"
          className="rounded-full px-6 py-2.5 text-base font-extrabold text-white shadow-md transition-transform hover:scale-105"
          style={{ backgroundColor: MATCHA }}
        >
          Order ahead
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:px-10 md:py-24 lg:grid-cols-2">
      <div>
        <Reveal>
          <p
            className="inline-flex rotate-[-1.5deg] items-center gap-2 rounded-full px-5 py-2 text-sm font-extrabold uppercase tracking-[0.18em] text-white"
            style={{ backgroundColor: BUTTER }}
          >
            <Sun className="size-4" />
            Baking since 06:00
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h1 className={`${display.className} mt-6 text-6xl leading-[1.02] md:text-7xl`}>
            Warm bread,
            <br />
            <span style={{ color: MATCHA }}>slow mornings</span>
            <span style={{ color: BUTTER }}>.</span>
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-6 max-w-md text-lg font-semibold leading-relaxed" style={{ color: `${ESPRESSO}b3` }}>
            A tiny bakery-café with a big oven — croissants at dawn, flat
            whites all day, and the last sticky bun usually gone by ten.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#menu"
              className="rounded-full px-8 py-4 text-base font-extrabold text-white shadow-lg shadow-[#7c9a5e]/30 transition-transform hover:scale-105"
              style={{ backgroundColor: MATCHA }}
            >
              See the menu
            </a>
            <a
              href="#visit"
              className="rounded-full border-[3px] px-8 py-4 text-base font-extrabold transition-colors hover:bg-white"
              style={{ borderColor: BUTTER, color: ESPRESSO }}
            >
              06:00 – 15:00 daily
            </a>
          </div>
        </Reveal>
      </div>
      <Reveal from="right" delay={150}>
        <div className="relative mx-auto max-w-md">
          <div className="overflow-hidden rounded-[3rem] border-8 border-white shadow-2xl shadow-[#4a3225]/20">
            <Image
              src="/img/layouts/cafe-bread.jpg"
              alt="Fresh sourdough loaves at Crumb & Co."
              width={760}
              height={900}
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="aspect-[5/6] w-full animate-landing-kenburns object-cover"
            />
          </div>
          <span
            className="absolute -bottom-5 -left-5 flex size-24 -rotate-6 items-center justify-center rounded-full text-center text-xs font-extrabold uppercase leading-tight text-white animate-landing-float"
            style={{ backgroundColor: BUTTER }}
          >
            baked
            <br />
            today!
          </span>
        </div>
      </Reveal>
    </section>
  );
}

function Counter() {
  const items = [
    { icon: Croissant, big: "05:58", small: "first tray out" },
    { icon: Coffee, big: "212", small: "flat whites a day" },
    { icon: Heart, big: "1", small: "very loved oven" },
  ];
  return (
    <section className="border-y-2 bg-white py-10" style={{ borderColor: `${ESPRESSO}1f` }}>
      <div className="mx-auto grid max-w-5xl gap-8 px-5 sm:grid-cols-3">
        {items.map((it, i) => (
          <Reveal key={it.small} delay={i * 90}>
            <p className="flex items-center justify-center gap-4">
              <it.icon className="size-8" style={{ color: [MATCHA, BUTTER, "#d96f5e"][i] }} />
              <span>
                <span className={`${display.className} block text-3xl`}>{it.big}</span>
                <span className="text-sm font-extrabold uppercase tracking-[0.15em]" style={{ color: `${ESPRESSO}80` }}>
                  {it.small}
                </span>
              </span>
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Menu() {
  return (
    <section id="menu" className="mx-auto max-w-5xl px-5 py-20 md:px-10 md:py-28">
      <Reveal>
        <h2 className={`${display.className} text-center text-5xl md:text-6xl`}>
          The counter
        </h2>
        <p className="mx-auto mt-3 max-w-md text-center text-base font-semibold" style={{ color: `${ESPRESSO}99` }}>
          Type a craving — matcha, pastry, vegan — and the board lights up.
        </p>
      </Reveal>
      <Reveal delay={140}>
        <div className="mt-10">
          <MenuFinder
            items={MENU}
            displayClass={display.className}
            placeholder="Croissant? Matcha? Something iced?…"
            unitLabel="treats"
            theme={{
              accent: MATCHA,
              accentText: "#ffffff",
              text: ESPRESSO,
              muted: `${ESPRESSO}99`,
              surface: "#ffffff",
              border: `${ESPRESSO}26`,
              radius: "1.25rem",
            }}
          />
        </div>
      </Reveal>
    </section>
  );
}

function Mornings() {
  return (
    <section id="mornings" className="py-20 md:py-28" style={{ backgroundColor: "#f1e6d2" }}>
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-center text-4xl md:text-5xl`}>
            Three photos from this morning
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { src: "/img/layouts/cafe-latte.jpg", alt: "Latte art being poured", cap: "the 7 a.m. pour" },
            { src: "/img/layouts/cafe-pastries.jpg", alt: "The pastry case, fully loaded", cap: "the case, pre-rush" },
            { src: "/img/layouts/cafe-interior-plants.jpg", alt: "Plant-filled corner of the café", cap: "your corner table" },
          ].map((ph, i) => (
            <Reveal key={ph.src} delay={i * 100}>
              <figure className={`rounded-3xl bg-white p-3 pb-5 shadow-lg transition-transform hover:-translate-y-1.5 ${i % 2 ? "rotate-1" : "-rotate-1"}`}>
                <Image
                  src={ph.src}
                  alt={ph.alt}
                  width={600}
                  height={620}
                  sizes="(min-width: 768px) 30vw, 90vw"
                  className="aspect-square w-full rounded-2xl object-cover"
                />
                <figcaption className={`${display.className} mt-3 text-center text-lg`} style={{ color: MATCHA }}>
                  {ph.cap}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="visit" className="py-14 text-white" style={{ backgroundColor: ESPRESSO }}>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 text-center md:px-10">
        <p className={`${display.className} flex items-center gap-2 text-3xl`}>
          <Croissant className="size-7" style={{ color: BUTTER }} />
          Crumb &amp; Co.
        </p>
        <p className="flex items-center gap-2 text-base font-semibold text-white/85">
          <MapPin className="size-4" style={{ color: BUTTER }} />
          {CONTACT.address}
        </p>
        <p className="text-base font-semibold text-white/85">
          Every day 06:00 – 15:00 · <a href={CONTACT.phoneHref} className="underline-offset-4 hover:underline">{CONTACT.phone}</a>
        </p>
        <p className="text-sm font-extrabold uppercase tracking-[0.25em] text-white/55">
          © {new Date().getFullYear()} Crumb &amp; Co. — fictional demo · Café layout
        </p>
      </div>
    </footer>
  );
}

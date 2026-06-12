import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DM_Serif_Display, Hanken_Grotesk } from "next/font/google";
import { Clock, Flame, MapPin, Phone } from "lucide-react";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { MenuFinder, type MenuItem } from "@/components/layouts/MenuFinder";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Business Layout — Ember Restaurant",
  robots: { index: false },
};

const display = DM_Serif_Display({ subsets: ["latin"], weight: "400" });
const body = Hanken_Grotesk({ subsets: ["latin"], weight: ["300", "400", "600"] });

const CHAR = "#171311";
const SMOKE = "#221c19";
const EMBER = "#e25822";
const CREAMY = "#f3e9dc";

const MENU: readonly MenuItem[] = [
  { name: "Charred prawn skewers", detail: "River prawns, burnt lime, nam jim seafood.", price: 320, category: "From the fire", tags: ["seafood", "spicy"] },
  { name: "12-hour beef short rib", detail: "Massaman glaze, pickled shallot, roti.", price: 590, category: "From the fire", tags: ["beef", "signature"] },
  { name: "Whole grilled sea bass", detail: "Lemongrass belly, garlic-chili dressing.", price: 450, category: "From the fire", tags: ["seafood"] },
  { name: "Smoked eggplant larb", detail: "Toasted rice, mint, soft herbs.", price: 210, category: "Garden", tags: ["vegan", "spicy"] },
  { name: "Morning-market greens", detail: "Wok-fired, oyster sauce, crispy garlic.", price: 160, category: "Garden", tags: ["vegetarian"] },
  { name: "Green papaya salad", detail: "Pounded to order — tell us your chili number.", price: 140, category: "Garden", tags: ["vegan", "spicy", "classic"] },
  { name: "Khao soi gai", detail: "Northern curry noodles, braised chicken leg.", price: 240, category: "Comfort", tags: ["noodles", "classic"] },
  { name: "Crab fried rice", detail: "Picked blue crab, egg ribbons, cucumber.", price: 280, category: "Comfort", tags: ["seafood", "classic"] },
  { name: "Coconut ice cream", detail: "Young coconut, salted peanut, sticky rice.", price: 120, category: "Sweet", tags: ["dessert"] },
  { name: "Burnt honey banana", detail: "Caramelised over the coals, vanilla cream.", price: 140, category: "Sweet", tags: ["dessert", "signature"] },
] as const;

export default function EmberRestaurant() {
  return (
    <div className={`${body.className}`} style={{ backgroundColor: CHAR, color: CREAMY }}>
      <Nav />
      <Hero />
      <Story />
      <Menu />
      <Hours />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#171311]/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-10">
        <Link href="/" className={`${display.className} flex items-center gap-2 text-2xl`}>
          <Flame className="size-5" style={{ color: EMBER }} />
          Ember
        </Link>
        <nav className="hidden gap-9 text-sm font-semibold uppercase tracking-[0.2em] md:flex" style={{ color: `${CREAMY}b3` }}>
          <a href="#story" className="hover:text-[#e25822]">The fire</a>
          <a href="#menu" className="hover:text-[#e25822]">Menu</a>
          <a href="#hours" className="hover:text-[#e25822]">Find us</a>
        </nav>
        <a
          href={CONTACT.phoneHref}
          className="px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: EMBER }}
        >
          Reserve a table
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden pt-16">
      <Image
        src="/img/layouts/food-dark-plate.jpg"
        alt="A charred dish plated at Ember"
        fill
        priority
        sizes="100vw"
        className="animate-landing-kenburns object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#171311] via-[#171311]/60 to-transparent" />
      <div className="relative mx-auto w-full max-w-6xl px-5 md:px-10">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.4em]" style={{ color: EMBER }}>
            Open-fire Thai kitchen
          </p>
        </Reveal>
        <Reveal delay={140}>
          <h1 className={`${display.className} mt-5 max-w-2xl text-6xl leading-[1.02] md:text-8xl`}>
            Everything tastes
            <em style={{ color: EMBER }}> better burnt</em>
            <span className="align-top text-3xl">*</span>
          </h1>
        </Reveal>
        <Reveal delay={280}>
          <p className="mt-6 max-w-md text-lg font-light leading-relaxed" style={{ color: `${CREAMY}cc` }}>
            *a little. Charcoal, smoke and market-morning produce — a small
            menu cooked over a big fire, every night from five.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#menu"
              className="px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: EMBER }}
            >
              Read the menu
            </a>
            <a
              href="#hours"
              className="border border-white/25 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] transition-colors hover:border-white/60"
            >
              Tonight from 17:00
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section id="story" className="py-24 md:py-32" style={{ backgroundColor: SMOKE }}>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:px-10 lg:grid-cols-2">
        <Reveal>
          <div className="overflow-hidden">
            <Image
              src="/img/layouts/restaurant-warm.jpg"
              alt="The dining room at Ember, lit by lanterns"
              width={860}
              height={640}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </Reveal>
        <Reveal from="right" delay={120}>
          <p className="text-sm font-semibold uppercase tracking-[0.35em]" style={{ color: EMBER }}>
            One grill, twelve tables
          </p>
          <h2 className={`${display.className} mt-4 text-4xl leading-tight md:text-5xl`}>
            The fire is lit at four. The first skewer lands at five.
          </h2>
          <p className="mt-6 max-w-md text-lg font-light leading-relaxed" style={{ color: `${CREAMY}b3` }}>
            We buy whatever the morning boats and the market gardens are proud
            of, then cook it the oldest way there is. No freezer, no fryer, no
            shortcuts — when the board is sold out, the night is done.
          </p>
          <p className={`${display.className} mt-8 text-2xl italic`} style={{ color: EMBER }}>
            — Chef Dao &amp; the fire crew
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Menu() {
  return (
    <section id="menu" className="mx-auto max-w-5xl px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <h2 className={`${display.className} text-center text-5xl md:text-6xl`}>
          Tonight&rsquo;s board
        </h2>
        <p className="mx-auto mt-4 max-w-md text-center text-base font-light" style={{ color: `${CREAMY}99` }}>
          Search a craving — spicy, seafood, vegan — and watch the board answer.
        </p>
      </Reveal>
      <Reveal delay={140}>
        <div className="mt-12">
          <MenuFinder
            items={MENU}
            displayClass={display.className}
            placeholder="Spicy? Seafood? Khao soi?…"
            unitLabel="dishes"
            theme={{
              accent: EMBER,
              accentText: "#ffffff",
              text: CREAMY,
              muted: `${CREAMY}99`,
              surface: SMOKE,
              border: `${CREAMY}26`,
              radius: "0px",
            }}
          />
        </div>
      </Reveal>
    </section>
  );
}

function Hours() {
  const rows = [
    { d: "Wednesday — Monday", t: "17:00 – 23:00" },
    { d: "Tuesday", t: "The fire rests" },
    { d: "Last orders", t: "22:15" },
  ];
  return (
    <section id="hours" className="border-y border-white/10 py-24 md:py-28" style={{ backgroundColor: SMOKE }}>
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:px-10 lg:grid-cols-2">
        <Reveal>
          <h2 className={`${display.className} text-4xl md:text-5xl`}>
            Find the smoke
          </h2>
          <div className="mt-8 space-y-4 text-lg font-light">
            <p className="flex items-start gap-3">
              <MapPin className="mt-1 size-5 shrink-0" style={{ color: EMBER }} />
              {CONTACT.address}
            </p>
            <p className="flex items-center gap-3">
              <Phone className="size-5 shrink-0" style={{ color: EMBER }} />
              <a href={CONTACT.phoneHref} className="hover:text-white">{CONTACT.phone}</a>
            </p>
          </div>
          <div className="mt-8">
            {rows.map((r) => (
              <p key={r.d} className="flex items-baseline justify-between gap-4 border-b border-white/10 py-3 text-base">
                <span className="flex items-center gap-2 font-semibold">
                  <Clock className="size-4" style={{ color: EMBER }} />
                  {r.d}
                </span>
                <span style={{ color: `${CREAMY}b3` }}>{r.t}</span>
              </p>
            ))}
          </div>
        </Reveal>
        <Reveal from="right" delay={120}>
          <div className="grid grid-cols-2 gap-3">
            <Image src="/img/layouts/food-fine-dining.jpg" alt="A plated dish at Ember" width={600} height={700} sizes="(min-width: 1024px) 22vw, 45vw" className="aspect-[6/7] w-full object-cover" />
            <Image src="/img/layouts/food-feast.jpg" alt="A table full of shared plates" width={600} height={700} sizes="(min-width: 1024px) 22vw, 45vw" className="mt-8 aspect-[6/7] w-full object-cover" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 text-center md:px-10">
        <p className={`${display.className} flex items-center gap-2 text-3xl`}>
          <Flame className="size-6" style={{ color: EMBER }} />
          Ember
        </p>
        <p className="text-base font-light" style={{ color: `${CREAMY}99` }}>
          Open-fire Thai kitchen · dinner only · twelve tables
        </p>
        <p className="text-sm uppercase tracking-[0.3em]" style={{ color: `${CREAMY}66` }}>
          © {new Date().getFullYear()} Ember — fictional demo · Restaurant layout
        </p>
      </div>
    </footer>
  );
}

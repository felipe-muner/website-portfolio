import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Space_Grotesk, Inter } from "next/font/google";
import { Bike, Fuel, MapPin, Phone, ShieldCheck, Star, Zap } from "lucide-react";
import { InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { DateRangeBooking, type RangeItem } from "@/components/layouts/DateRangeBooking";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Business Layout — Loop Island Rides",
  robots: { index: false },
};

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"] });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

const CREAM = "#fbf5ea";
const INK = "#171310";
const CORAL = "#f4511e";
const TEAL = "#0e7c7b";

const FLEET: readonly (RangeItem & { image: string; badge: string })[] = [
  { slug: "click", name: "Honda Click 125i", sub: "The island default — light, automatic, sips fuel.", pricePerDay: 250, image: "/img/layouts/rental-1.jpg", badge: "Most rented" },
  { slug: "fino", name: "Yamaha Fino", sub: "Retro scooter, comfy for two around town.", pricePerDay: 250, image: "/img/layouts/rental-2.jpg", badge: "Cute" },
  { slug: "pcx", name: "Honda PCX 160", sub: "Bigger, smoother — happy on the hill roads.", pricePerDay: 400, image: "/img/layouts/rental-3.jpg", badge: "Comfort" },
  { slug: "nmax", name: "Yamaha NMAX", sub: "Punchy 155cc for confident riders and hills.", pricePerDay: 450, image: "/img/layouts/rental-4.jpg", badge: "Power" },
  { slug: "adv", name: "Honda ADV 160", sub: "Adventure stance, chunky tyres for dirt tracks.", pricePerDay: 550, image: "/img/layouts/rental-5.jpg", badge: "Off-road" },
  { slug: "mtb", name: "Mountain bike", sub: "Pedal power — for the coastal flats and cardio.", pricePerDay: 150, image: "/img/layouts/dive-reef.jpg", badge: "Eco" },
];

const INCLUDED = [
  { icon: ShieldCheck, title: "Insurance included", body: "Every rental comes with damage cover and two quality helmets — no fine print." },
  { icon: Fuel, title: "Delivered fuelled", body: "We drop the bike to your villa or the pier, tank full, ready to ride." },
  { icon: Zap, title: "24/7 roadside help", body: "Flat tyre or a dead battery? One call and we come to you, anywhere on the island." },
];

export default function RentalLayout() {
  return (
    <div className={body.className} style={{ backgroundColor: CREAM, color: INK }}>
      <Nav />
      <Hero />
      <Trust />
      <Fleet />
      <Booking />
      <Included />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b" style={{ borderColor: `${INK}12`, backgroundColor: `${CREAM}e6`, backdropFilter: "blur(8px)" }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-10">
        <Link href="/" className={`${display.className} flex items-center gap-2 text-xl font-bold`}>
          <Bike className="size-6" style={{ color: CORAL }} />
          Loop<span style={{ color: CORAL }}>.</span>
        </Link>
        <nav className="hidden gap-8 text-sm font-semibold md:flex" style={{ color: `${INK}b0` }}>
          <a href="#fleet" className="hover:text-[#f4511e]">Fleet</a>
          <a href="#book" className="hover:text-[#f4511e]">Book</a>
          <a href="#included" className="hover:text-[#f4511e]">What&rsquo;s included</a>
        </nav>
        <a href="#book" className="px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: CORAL, borderRadius: "999px" }}>
          Book a bike
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-dvh items-end overflow-hidden pt-16">
      <Image src="/img/layouts/rental-3.jpg" alt="Scooters on an island street" fill priority sizes="100vw" className="animate-landing-kenburns object-cover" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${INK}f2, ${INK}55 45%, ${INK}22)` }} />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 text-white md:px-10">
        <Reveal>
          <p className={`${display.className} flex items-center gap-2 text-sm font-bold uppercase tracking-[0.3em]`} style={{ color: "#ffcbb8" }}>
            <MapPin className="size-4" /> Delivered island-wide
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h1 className={`${display.className} mt-4 max-w-3xl text-5xl font-bold leading-[0.95] md:text-8xl`}>
            The island is yours.
            <span style={{ color: CORAL }}> Go find it.</span>
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-white/20 pt-6">
            <p className="max-w-md text-base leading-relaxed text-white/80">
              Clean, serviced scooters and bikes from ฿150 a day. Free delivery
              to your door, helmets and insurance always included.
            </p>
            <div className="flex gap-3">
              <a href="#book" className="px-7 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: CORAL, borderRadius: "999px" }}>
                Check availability
              </a>
              <a href={CONTACT.phoneHref} className="flex items-center gap-2 border border-white/40 px-7 py-3.5 text-sm font-bold transition-colors hover:bg-white/10" style={{ borderRadius: "999px" }}>
                <Phone className="size-4" /> Call
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Trust() {
  const stats = [
    { n: "40+", l: "bikes in the fleet" },
    { n: "4.9★", l: "from 600+ riders" },
    { n: "Free", l: "island-wide delivery" },
    { n: "24/7", l: "roadside rescue" },
  ];
  return (
    <div style={{ backgroundColor: TEAL }}>
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-5 py-10 text-white md:grid-cols-4 md:px-10">
        {stats.map((s) => (
          <div key={s.l}>
            <p className={`${display.className} text-4xl font-bold`}>{s.n}</p>
            <p className="mt-1 text-sm text-white/70">{s.l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Fleet() {
  return (
    <section id="fleet" className="mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <h2 className={`${display.className} text-4xl font-bold md:text-6xl`}>Pick your ride</h2>
          <p className="max-w-xs text-base" style={{ color: `${INK}99` }}>
            Automatics, big-boy scooters and push-bikes — all under two years old and freshly serviced.
          </p>
        </div>
      </Reveal>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FLEET.map((bike, i) => (
          <Reveal key={bike.slug} delay={i * 70} className="h-full">
            <div className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-transform hover:-translate-y-1.5" style={{ border: `1px solid ${INK}10` }}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={bike.image} alt={bike.name} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <span className="absolute left-3 top-3 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-white" style={{ backgroundColor: CORAL, borderRadius: "999px" }}>
                  {bike.badge}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className={`${display.className} text-xl font-bold`}>{bike.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: `${INK}99` }}>{bike.sub}</p>
                <p className={`${display.className} mt-4 text-2xl font-bold`} style={{ color: TEAL }}>
                  ฿{bike.pricePerDay}<span className="text-sm font-medium" style={{ color: `${INK}80` }}> / day</span>
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Booking() {
  return (
    <section id="book" className="py-24 md:py-28" style={{ backgroundColor: "#fff" }}>
      <div className="mx-auto max-w-5xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-4xl font-bold md:text-5xl`}>Book in thirty seconds</h2>
          <p className="mt-3 max-w-md text-base" style={{ color: `${INK}99` }}>
            Choose a bike and your days — we&rsquo;ll confirm delivery by WhatsApp. No deposit online.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-10">
            <DateRangeBooking
              items={FLEET}
              displayClass={display.className}
              pickerLabel="Choose your ride"
              ctaLabel="Request this bike"
              theme={{ accent: CORAL, accentText: "#ffffff", text: INK, muted: `${INK}80`, surface: CREAM, border: `${INK}1f`, radius: "16px" }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Included() {
  return (
    <section id="included" className="mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-32">
      <div className="grid gap-6 md:grid-cols-3">
        {INCLUDED.map((f, i) => (
          <Reveal key={f.title} delay={i * 90}>
            <div className="flex h-full flex-col rounded-2xl p-8" style={{ backgroundColor: "#fff", border: `1px solid ${INK}10` }}>
              <f.icon className="size-8" style={{ color: CORAL }} />
              <h3 className={`${display.className} mt-5 text-xl font-bold`}>{f.title}</h3>
              <p className="mt-2 text-base leading-relaxed" style={{ color: `${INK}99` }}>{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={120}>
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl p-6" style={{ backgroundColor: `${TEAL}12` }}>
          <Star className="size-5" style={{ color: TEAL }} />
          <p className="text-base font-medium" style={{ color: INK }}>
            &ldquo;Dropped the bike at our villa, spotless and full of fuel. Best few days of the trip.&rdquo; — a very happy demo rider.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ backgroundColor: INK }}>
      <div className="mx-auto max-w-6xl px-5 py-16 text-white md:px-10">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div>
            <p className={`${display.className} flex items-center gap-2 text-3xl font-bold`}>
              <Bike className="size-7" style={{ color: CORAL }} /> Loop Island Rides
            </p>
            <p className="mt-3 max-w-sm text-white/60">Scooter &amp; bike rental, delivered anywhere on the island.</p>
          </div>
          <div className="space-y-2 text-sm text-white/80">
            <p className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0" style={{ color: CORAL }} />{CONTACT.address}</p>
            <a href={CONTACT.phoneHref} className="flex items-center gap-2 hover:text-white"><Phone className="size-4" style={{ color: CORAL }} />{CONTACT.phone}</a>
            <a href={CONTACT.instagram} className="flex items-center gap-2 hover:text-white"><InstagramIcon className="size-4" />{CONTACT.instagramHandle}</a>
          </div>
        </div>
        <p className="mt-12 text-xs uppercase tracking-[0.25em] text-white/40">
          © {new Date().getFullYear()} Loop Island Rides — fictional demo · Rental layout
        </p>
      </div>
    </footer>
  );
}

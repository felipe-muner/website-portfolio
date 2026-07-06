import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import { Anchor, Clock, Compass, Fish, MapPin, Phone, Sunset, Users } from "lucide-react";
import { InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { SlotBooking, type SlotOption } from "@/components/layouts/SlotBooking";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Business Layout — Blue Horizon Boat Co.",
  robots: { index: false },
};

const display = Fraunces({ subsets: ["latin"], weight: ["400", "600"], style: ["normal", "italic"] });
const body = Hanken_Grotesk({ subsets: ["latin"], weight: ["300", "400", "600"] });

const NAVY = "#082f42";
const DEEP = "#0b3b52";
const AQUA = "#17b3c4";
const SAND = "#f4ecdd";

const TRIPS: readonly (SlotOption & { image: string; duration: string; icon: typeof Fish })[] = [
  { slug: "snorkel", name: "Snorkel Safari", sub: "Four bays, turtles & coral gardens, lunch on board.", price: 1600, image: "/img/layouts/boat-1.jpg", duration: "Full day · 6 stops", icon: Fish },
  { slug: "sunset", name: "Sunset & Fire Cruise", sub: "Sundowners, plankton swim and the fire show from the water.", price: 1200, image: "/img/layouts/boat-2.jpg", duration: "Evening · 4 hrs", icon: Sunset },
  { slug: "island", name: "Hidden Islands Charter", sub: "Private longtail to the coves the ferries never reach.", price: 4500, image: "/img/layouts/boat-3.jpg", duration: "Private · your route", icon: Compass },
  { slug: "fishing", name: "Dawn Fishing Trip", sub: "Hand-line with the local crew, cook your catch.", price: 1900, image: "/img/layouts/boat-4.jpg", duration: "Half day · 5 hrs", icon: Anchor },
];

export default function BoatLayout() {
  return (
    <div className={body.className} style={{ backgroundColor: SAND, color: NAVY }}>
      <Nav />
      <Hero />
      <Intro />
      <Trips />
      <Booking />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b" style={{ borderColor: "#ffffff22", backgroundColor: `${NAVY}cc`, backdropFilter: "blur(8px)" }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 text-white md:px-10">
        <Link href="/" className={`${display.className} flex items-center gap-2 text-xl italic`}>
          <Anchor className="size-5" style={{ color: AQUA }} /> Blue Horizon
        </Link>
        <nav className="hidden gap-8 text-sm font-semibold md:flex text-white/75">
          <a href="#trips" className="hover:text-white">Trips</a>
          <a href="#book" className="hover:text-white">Book</a>
          <a href="#find" className="hover:text-white">Find us</a>
        </nav>
        <a href="#book" className="px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90" style={{ backgroundColor: AQUA, color: NAVY, borderRadius: "999px" }}>
          Reserve a seat
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden pt-16">
      <Image src="/img/layouts/boat-3.jpg" alt="A longtail boat on turquoise water" fill priority sizes="100vw" className="animate-landing-kenburns object-cover" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(120deg, ${NAVY}e6, ${NAVY}66 55%, transparent)` }} />
      <div className="relative mx-auto w-full max-w-6xl px-5 text-white md:px-10">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.4em]" style={{ color: AQUA }}>
            Boat trips · charters · snorkel tours
          </p>
        </Reveal>
        <Reveal delay={140}>
          <h1 className={`${display.className} mt-5 max-w-3xl text-6xl leading-[1.02] md:text-8xl`}>
            Out past the last
            <em style={{ color: AQUA }}> mooring line.</em>
          </h1>
        </Reveal>
        <Reveal delay={280}>
          <p className="mt-6 max-w-lg text-lg font-light leading-relaxed text-white/85">
            Small groups, local skippers and the reefs, coves and sunsets you
            came all this way for. Fresh fruit, cold drinks and a mask that
            actually fits — all aboard.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#trips" className="px-8 py-4 text-sm font-semibold transition-opacity hover:opacity-90" style={{ backgroundColor: AQUA, color: NAVY, borderRadius: "999px" }}>
              See the trips
            </a>
            <a href="#book" className="border border-white/40 px-8 py-4 text-sm font-semibold transition-colors hover:bg-white/10" style={{ borderRadius: "999px" }}>
              Check dates
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Intro() {
  const points = [
    { icon: Users, title: "Max 12 aboard", body: "Never a cattle-boat. Room to breathe, and the crew knows your name." },
    { icon: Fish, title: "The good reefs", body: "We chase the tide and the visibility, not a fixed tourist loop." },
    { icon: Clock, title: "On island time", body: "No rushing you off the boat — the sunset waits for no schedule." },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-28">
      <div className="grid gap-6 md:grid-cols-3">
        {points.map((p, i) => (
          <Reveal key={p.title} delay={i * 90}>
            <div className="flex h-full flex-col">
              <p.icon className="size-8" style={{ color: AQUA }} />
              <h3 className={`${display.className} mt-4 text-2xl`}>{p.title}</h3>
              <p className="mt-2 text-base font-light leading-relaxed" style={{ color: `${NAVY}b0` }}>{p.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Trips() {
  return (
    <section id="trips" className="py-24 md:py-28" style={{ backgroundColor: DEEP }}>
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-4xl text-white md:text-6xl`}>Choose your day on the water</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {TRIPS.map((t, i) => (
            <Reveal key={t.slug} delay={i * 80} className="h-full">
              <div className="group relative flex h-full min-h-80 flex-col justify-end overflow-hidden rounded-3xl p-7">
                <Image src={t.image} alt={t.name} fill sizes="(min-width: 768px) 45vw, 90vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${NAVY}f2, ${NAVY}44 60%, transparent)` }} />
                <div className="relative text-white">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: AQUA }}>
                    <t.icon className="size-4" /> {t.duration}
                  </p>
                  <h3 className={`${display.className} mt-2 text-3xl`}>{t.name}</h3>
                  <p className="mt-2 max-w-md text-base font-light text-white/80">{t.sub}</p>
                  <p className={`${display.className} mt-4 text-2xl italic`} style={{ color: AQUA }}>
                    ฿{t.price.toLocaleString()} <span className="text-sm not-italic text-white/70">per person</span>
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Booking() {
  return (
    <section id="book" className="mx-auto max-w-5xl px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <h2 className={`${display.className} text-4xl md:text-5xl`}>Reserve your seats</h2>
        <p className="mt-3 max-w-md text-base font-light" style={{ color: `${NAVY}b0` }}>
          Pick a trip, a date and how many are coming. We confirm by message the same day.
        </p>
      </Reveal>
      <Reveal delay={120}>
        <div className="mt-10">
          <SlotBooking
            options={TRIPS.map(({ slug, name, sub, price }) => ({ slug, name, sub, price }))}
            displayClass={display.className}
            pickerLabel="Choose your trip"
            priceUnit="per person"
            qty={{ label: "Guests", min: 1, max: 12 }}
            ctaLabel="Request these seats"
            note="No payment now — pay the crew on the day."
            theme={{ accent: AQUA, accentText: NAVY, text: NAVY, muted: `${NAVY}99`, surface: "#ffffff", border: `${NAVY}22`, radius: "18px" }}
          />
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer id="find" style={{ backgroundColor: NAVY }}>
      <div className="mx-auto max-w-6xl px-5 py-16 text-white md:px-10">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div>
            <p className={`${display.className} flex items-center gap-2 text-3xl italic`}>
              <Anchor className="size-7" style={{ color: AQUA }} /> Blue Horizon Boat Co.
            </p>
            <p className="mt-3 max-w-sm font-light text-white/60">Departures from the main pier, weather permitting. Life jackets for all ages.</p>
          </div>
          <div className="space-y-2 text-sm text-white/80">
            <p className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0" style={{ color: AQUA }} />{CONTACT.address}</p>
            <a href={CONTACT.phoneHref} className="flex items-center gap-2 hover:text-white"><Phone className="size-4" style={{ color: AQUA }} />{CONTACT.phone}</a>
            <a href={CONTACT.instagram} className="flex items-center gap-2 hover:text-white"><InstagramIcon className="size-4" />{CONTACT.instagramHandle}</a>
          </div>
        </div>
        <p className="mt-12 text-xs uppercase tracking-[0.25em] text-white/40">
          © {new Date().getFullYear()} Blue Horizon Boat Co. — fictional demo · Boat-tour layout
        </p>
      </div>
    </footer>
  );
}

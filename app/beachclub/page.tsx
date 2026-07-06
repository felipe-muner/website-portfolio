import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Syne, Inter } from "next/font/google";
import { GlassWater, MapPin, Music, Phone, Sparkles, Sun, Waves } from "lucide-react";
import { InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { SlotBooking, type SlotOption } from "@/components/layouts/SlotBooking";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Business Layout — Sundown Beach Club",
  robots: { index: false },
};

const display = Syne({ subsets: ["latin"], weight: ["600", "700", "800"] });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

const PLUM = "#1c1024";
const DUSK = "#2a1533";
const SUNSET = "#ff7a3c";
const PINK = "#ff5d8f";

const ZONES: readonly (SlotOption & { image: string })[] = [
  { slug: "daybed", name: "Beachfront daybed", sub: "Toes-in-sand, shaded, your own drinks service.", price: 2000, image: "/img/layouts/beachclub-1.jpg" },
  { slug: "poolside", name: "Poolside cabana", sub: "Private cabana over the infinity edge for up to 6.", price: 4000, image: "/img/layouts/beachclub-2.jpg" },
  { slug: "sunsetdeck", name: "Sunset deck table", sub: "Front-row to the sundown, dinner & cocktails.", price: 3000, image: "/img/layouts/beachclub-3.jpg" },
  { slug: "loungebar", name: "Lounge bar table", sub: "By the DJ booth once the sun's down.", price: 1500, image: "/img/layouts/beachclub-4.jpg" },
];

const NIGHTS = [
  { day: "Fri", name: "Golden Hour Sessions", who: "House & disco · resident DJs", icon: Sun },
  { day: "Sat", name: "Full Moon Warmup", who: "Guest selectors till late", icon: Sparkles },
  { day: "Sun", name: "Live & Acoustic", who: "Sunset band + sea breeze", icon: Music },
];

export default function BeachClubLayout() {
  return (
    <div className={body.className} style={{ backgroundColor: PLUM, color: "#f6ecf2" }}>
      <Nav />
      <Hero />
      <Nights />
      <Booking />
      <Gallery />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b" style={{ borderColor: "#ffffff1a", backgroundColor: `${PLUM}d9`, backdropFilter: "blur(8px)" }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-10">
        <Link href="/" className={`${display.className} flex items-center gap-2 text-xl font-extrabold`}>
          <Waves className="size-5" style={{ color: SUNSET }} /> SUNDOWN
        </Link>
        <nav className="hidden gap-8 text-sm font-semibold md:flex" style={{ color: "#f6ecf2b0" }}>
          <a href="#nights" className="hover:text-white">What&rsquo;s on</a>
          <a href="#book" className="hover:text-white">Reserve</a>
          <a href="#find" className="hover:text-white">Find us</a>
        </nav>
        <a href="#book" className="px-5 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5" style={{ background: `linear-gradient(90deg, ${SUNSET}, ${PINK})`, borderRadius: "999px" }}>
          Reserve a table
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden pt-16">
      <Image src="/img/layouts/beachclub-1.jpg" alt="A beach club at sunset" fill priority sizes="100vw" className="animate-landing-kenburns object-cover" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${PLUM}f2, ${DUSK}99 45%, ${SUNSET}33)` }} />
      <div className="relative mx-auto w-full max-w-6xl px-5 md:px-10">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.4em]" style={{ color: SUNSET }}>
            Beach club · sunset bar · late nights
          </p>
        </Reveal>
        <Reveal delay={140}>
          <h1 className={`${display.className} mt-5 max-w-3xl text-6xl font-extrabold leading-[0.95] md:text-8xl`}>
            Where the island
            <span style={{ background: `linear-gradient(90deg, ${SUNSET}, ${PINK})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}> chases the sun down.</span>
          </h1>
        </Reveal>
        <Reveal delay={280}>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/85">
            Feet in the sand, a cocktail sweating in your hand and a DJ easing
            the day into night. Open from noon — magic from six.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#book" className="px-8 py-4 text-sm font-bold text-white transition-transform hover:-translate-y-0.5" style={{ background: `linear-gradient(90deg, ${SUNSET}, ${PINK})`, borderRadius: "999px" }}>
              Reserve a table
            </a>
            <a href="#nights" className="border border-white/40 px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-white/10" style={{ borderRadius: "999px" }}>
              This week&rsquo;s line-up
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Nights() {
  return (
    <section id="nights" className="mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-28">
      <Reveal>
        <h2 className={`${display.className} text-4xl font-extrabold md:text-6xl`}>This week on the sand</h2>
      </Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {NIGHTS.map((n, i) => (
          <Reveal key={n.name} delay={i * 90}>
            <div className="flex h-full flex-col rounded-3xl p-8" style={{ background: `linear-gradient(160deg, ${DUSK}, ${PLUM})`, border: "1px solid #ffffff14" }}>
              <div className="flex items-center justify-between">
                <span className={`${display.className} text-lg font-bold`} style={{ color: SUNSET }}>{n.day}</span>
                <n.icon className="size-6" style={{ color: PINK }} />
              </div>
              <h3 className={`${display.className} mt-6 text-2xl font-bold`}>{n.name}</h3>
              <p className="mt-2 text-base text-white/70">{n.who}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Booking() {
  return (
    <section id="book" className="py-24 md:py-28" style={{ background: `linear-gradient(180deg, ${PLUM}, ${DUSK})` }}>
      <div className="mx-auto max-w-5xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-4xl font-extrabold md:text-5xl`}>Claim your spot</h2>
          <p className="mt-3 max-w-md text-base text-white/70">
            Sunset fills fast. Pick your zone, a night and your crew — minimum
            spend is redeemable against food &amp; drinks.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-10">
            <SlotBooking
              options={ZONES}
              displayClass={display.className}
              pickerLabel="Choose your spot"
              priceUnit="min. spend"
              qty={{ label: "Guests", min: 1, max: 10 }}
              variants={{ label: "Arrival", items: ["16:00", "18:00 (sunset)", "20:00", "22:00"] }}
              ctaLabel="Request this table"
              note="Minimum spend redeemable on the night."
              theme={{ accent: SUNSET, accentText: "#1c1024", text: "#f6ecf2", muted: "#f6ecf299", surface: "#2a1533", border: "#ffffff1f", radius: "18px" }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Gallery() {
  const imgs = ["/img/layouts/beachclub-5.jpg", "/img/layouts/beachclub-2.jpg", "/img/layouts/beachclub-3.jpg"];
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-10">
      <div className="grid gap-4 sm:grid-cols-3">
        {imgs.map((src, i) => (
          <Reveal key={src} delay={i * 80}>
            <div className={`relative overflow-hidden rounded-2xl ${i === 1 ? "sm:mt-8" : ""}`}>
              <Image src={src} alt="Sundown Beach Club" width={600} height={720} sizes="(min-width: 640px) 30vw, 90vw" className="aspect-[5/6] w-full object-cover transition-transform duration-700 hover:scale-105" />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="find" style={{ backgroundColor: DUSK }}>
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-10">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div>
            <p className={`${display.className} flex items-center gap-2 text-3xl font-extrabold`}>
              <GlassWater className="size-7" style={{ color: SUNSET }} /> Sundown Beach Club
            </p>
            <p className="mt-3 max-w-sm text-white/60">Open noon till late · kitchen till 22:30 · over-18s after 21:00.</p>
          </div>
          <div className="space-y-2 text-sm text-white/80">
            <p className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0" style={{ color: SUNSET }} />{CONTACT.address}</p>
            <a href={CONTACT.phoneHref} className="flex items-center gap-2 hover:text-white"><Phone className="size-4" style={{ color: SUNSET }} />{CONTACT.phone}</a>
            <a href={CONTACT.instagram} className="flex items-center gap-2 hover:text-white"><InstagramIcon className="size-4" />{CONTACT.instagramHandle}</a>
          </div>
        </div>
        <p className="mt-12 text-xs uppercase tracking-[0.25em] text-white/40">
          © {new Date().getFullYear()} Sundown Beach Club — fictional demo · Beach-club layout
        </p>
      </div>
    </footer>
  );
}

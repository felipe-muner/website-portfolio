import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Building2, Handshake, Key, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { ListingBrowser, type Listing } from "@/components/layouts/ListingBrowser";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Business Layout — Baan & Bay Property",
  robots: { index: false },
};

const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600"] });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

const STONE = "#f5f3ee";
const INK = "#20241f";
const EMERALD = "#1f6b52";
const GOLD = "#b08b3f";

const LISTINGS: readonly Listing[] = [
  { id: "l1", title: "Ocean-view pool villa above the bay", area: "Sunset Coast", type: "Villa", status: "For sale", price: 18500000, per: "", beds: 3, baths: 3, sqm: 320, image: "/img/layouts/villa-pool-palms.jpg", tags: ["sea view", "pool", "new build"] },
  { id: "l2", title: "Modern glass house in the hills", area: "Jungle Ridge", type: "House", status: "For sale", price: 12900000, per: "", beds: 4, baths: 3, sqm: 280, image: "/img/layouts/villa-exterior-white.jpg", tags: ["hillside", "quiet", "pool"] },
  { id: "l3", title: "Beachfront bungalow, steps from sand", area: "Palm Bay", type: "Bungalow", status: "For rent", price: 55000, per: "month", beds: 2, baths: 2, sqm: 140, image: "/img/layouts/villa-terrace-view.jpg", tags: ["beachfront", "furnished", "sea view"] },
  { id: "l4", title: "Tropical garden villa with studio", area: "Srithanu", type: "Villa", status: "For rent", price: 68000, per: "month", beds: 3, baths: 2, sqm: 210, image: "/img/layouts/villa-home-pool.jpg", tags: ["garden", "pool", "long-term"] },
  { id: "l5", title: "Minimalist sea-view apartment", area: "Sunset Coast", type: "Apartment", status: "For sale", price: 6900000, per: "", beds: 1, baths: 1, sqm: 74, image: "/img/layouts/villa-living-bright.jpg", tags: ["sea view", "turnkey", "investment"] },
  { id: "l6", title: "Family home with mango orchard", area: "Inland Valley", type: "House", status: "For sale", price: 9500000, per: "", beds: 4, baths: 3, sqm: 260, image: "/img/layouts/villa-luxury-house.jpg", tags: ["land", "garden", "family"] },
  { id: "l7", title: "Boutique studio for the digital nomad", area: "Town", type: "Studio", status: "For rent", price: 22000, per: "month", beds: 1, baths: 1, sqm: 42, image: "/img/layouts/villa-bedroom-wood.jpg", tags: ["walkable", "wifi ready", "furnished"] },
  { id: "l8", title: "Cliffside villa with infinity pool", area: "North Point", type: "Villa", status: "For sale", price: 24500000, per: "", beds: 4, baths: 4, sqm: 380, image: "/img/layouts/villa-pool-night.jpg", tags: ["sea view", "pool", "luxury"] },
  { id: "l9", title: "Rustic teak house near the pier", area: "Thong Sala", type: "House", status: "For rent", price: 38000, per: "month", beds: 2, baths: 1, sqm: 120, image: "/img/layouts/villa-living-warm.jpg", tags: ["central", "traditional", "long-term"] },
];

export default function RealEstateLayout() {
  return (
    <div className={body.className} style={{ backgroundColor: STONE, color: INK }}>
      <Nav />
      <Hero />
      <Listings />
      <Assurance />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b" style={{ borderColor: `${INK}14`, backgroundColor: `${STONE}e6`, backdropFilter: "blur(8px)" }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-10">
        <Link href="/" className={`${display.className} flex items-center gap-2 text-2xl font-semibold`}>
          <Building2 className="size-5" style={{ color: EMERALD }} /> Baan &amp; Bay
        </Link>
        <nav className="hidden gap-8 text-sm font-semibold md:flex" style={{ color: `${INK}a6` }}>
          <a href="#listings" className="hover:text-[#1f6b52]">Listings</a>
          <a href="#why" className="hover:text-[#1f6b52]">Why us</a>
          <a href="#contact" className="hover:text-[#1f6b52]">Contact</a>
        </nav>
        <a href="#contact" className="px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: EMERALD, borderRadius: "6px" }}>
          Book a viewing
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-[92dvh] items-center overflow-hidden pt-16">
      <Image src="/img/layouts/villa-resort-aerial.jpg" alt="Island property from the air" fill priority sizes="100vw" className="animate-landing-kenburns object-cover" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(100deg, ${INK}e0, ${INK}55 55%, transparent)` }} />
      <div className="relative mx-auto w-full max-w-6xl px-5 text-white md:px-10">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.35em]" style={{ color: GOLD }}>
            Island homes · villas · land · rentals
          </p>
        </Reveal>
        <Reveal delay={140}>
          <h1 className={`${display.className} mt-4 max-w-3xl text-6xl font-medium leading-[1.02] md:text-8xl`}>
            Find your place under the palms.
          </h1>
        </Reveal>
        <Reveal delay={260}>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/85">
            A curated portfolio of sea-view villas, garden homes and honest
            long-term rentals — with a team that handles the paperwork, the
            due-diligence and the keys.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#listings" className="px-8 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: EMERALD, borderRadius: "6px" }}>
              Browse listings
            </a>
            <a href="#contact" className="border border-white/40 px-8 py-4 text-sm font-semibold transition-colors hover:bg-white/10" style={{ borderRadius: "6px" }}>
              Talk to an agent
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Listings() {
  return (
    <section id="listings" className="mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-28">
      <Reveal>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className={`${display.className} text-5xl font-medium md:text-6xl`}>Homes on the market</h2>
          <p className="max-w-xs text-base" style={{ color: `${INK}99` }}>
            Search by area or a feature — sea view, pool, long-term — and filter sale from rent.
          </p>
        </div>
      </Reveal>
      <Reveal delay={120}>
        <ListingBrowser
          listings={LISTINGS}
          displayClass={display.className}
          theme={{ accent: EMERALD, accentText: "#ffffff", text: INK, muted: `${INK}99`, surface: "#ffffff", card: "#ffffff", border: `${INK}18`, radius: "10px" }}
        />
      </Reveal>
    </section>
  );
}

function Assurance() {
  const items = [
    { icon: ShieldCheck, title: "Verified titles only", body: "Every listing is checked for clean title and legal build before it reaches you." },
    { icon: Handshake, title: "Bilingual, on your side", body: "We represent buyers and tenants — Thai and English, start to signature." },
    { icon: Key, title: "Handled end to end", body: "Lawyers, transfers, utilities and handover — we manage the whole move." },
  ];
  return (
    <section id="why" className="py-24 md:py-28" style={{ backgroundColor: "#fff" }}>
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="grid gap-8 md:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 90}>
              <div className="flex h-full flex-col">
                <it.icon className="size-9" style={{ color: EMERALD }} />
                <h3 className={`${display.className} mt-4 text-3xl font-medium`}>{it.title}</h3>
                <p className="mt-2 text-base leading-relaxed" style={{ color: `${INK}99` }}>{it.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" style={{ backgroundColor: INK }}>
      <div className="mx-auto max-w-6xl px-5 py-16 text-white md:px-10">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div>
            <p className={`${display.className} flex items-center gap-2 text-4xl font-medium`}>
              <Building2 className="size-8" style={{ color: GOLD }} /> Baan &amp; Bay Property
            </p>
            <p className="mt-3 max-w-sm text-white/60">Buying, selling or renting on the island — let&rsquo;s find the right fit.</p>
          </div>
          <div className="space-y-2 text-sm text-white/80">
            <p className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0" style={{ color: GOLD }} />{CONTACT.address}</p>
            <a href={CONTACT.phoneHref} className="flex items-center gap-2 hover:text-white"><Phone className="size-4" style={{ color: GOLD }} />{CONTACT.phone}</a>
            <a href={CONTACT.emailHref} className="flex items-center gap-2 hover:text-white"><Mail className="size-4" style={{ color: GOLD }} />{CONTACT.email}</a>
            <a href={CONTACT.instagram} className="flex items-center gap-2 hover:text-white"><InstagramIcon className="size-4" />{CONTACT.instagramHandle}</a>
          </div>
        </div>
        <p className="mt-12 text-xs uppercase tracking-[0.25em] text-white/40">
          © {new Date().getFullYear()} Baan &amp; Bay Property — fictional demo · Real-estate layout
        </p>
      </div>
    </footer>
  );
}

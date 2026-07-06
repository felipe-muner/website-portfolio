import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Bebas_Neue, Inter } from "next/font/google";
import { MapPin, Phone, ShieldCheck, Sparkles, Syringe } from "lucide-react";
import { InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { SlotBooking, type SlotOption } from "@/components/layouts/SlotBooking";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Business Layout — Lucky Hand Tattoo",
  robots: { index: false },
};

const display = Bebas_Neue({ subsets: ["latin"], weight: "400" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

const NIGHT = "#0a0908";
const CHAR = "#151311";
const BONE = "#ece6db";
const RUST = "#c0483a";

const ARTISTS: readonly (SlotOption & { image: string; style: string })[] = [
  { slug: "mai", name: "Mai", sub: "Fine-line, botanical & script.", price: 1000, image: "/img/layouts/tattoo-2.jpg", style: "Fine-line" },
  { slug: "juan", name: "Juan", sub: "Neo-traditional, bold colour.", price: 1000, image: "/img/layouts/tattoo-3.jpg", style: "Neo-traditional" },
  { slug: "ploy", name: "Ploy", sub: "Japanese irezumi & blackwork sleeves.", price: 1500, image: "/img/layouts/tattoo-1.jpg", style: "Japanese" },
  { slug: "sak", name: "Ajarn Sak", sub: "Traditional bamboo Sak Yant.", price: 800, image: "/img/layouts/tattoo-4.jpg", style: "Bamboo Sak Yant" },
];

const CARE = [
  { icon: ShieldCheck, title: "Sterile, single-use", body: "New needles, single-use ink caps, hospital-grade autoclave — every session, no exceptions." },
  { icon: Sparkles, title: "Custom, never traced", body: "Bring a reference or an idea; you leave with a design drawn for your body, not a flash sheet copy." },
  { icon: Syringe, title: "Bamboo or machine", body: "Traditional hand-poked Sak Yant or modern machine work — same clean standards, your choice." },
];

export default function TattooLayout() {
  return (
    <div className={body.className} style={{ backgroundColor: NIGHT, color: BONE }}>
      <Nav />
      <Hero />
      <Care />
      <Artists />
      <Booking />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10" style={{ backgroundColor: `${NIGHT}e0`, backdropFilter: "blur(8px)" }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-10">
        <Link href="/" className={`${display.className} text-2xl tracking-[0.08em]`}>
          LUCKY HAND<span style={{ color: RUST }}>.</span>
        </Link>
        <nav className="hidden gap-8 text-xs font-semibold uppercase tracking-[0.2em] md:flex" style={{ color: "#ece6dbaa" }}>
          <a href="#care" className="hover:text-[#c0483a]">Studio</a>
          <a href="#artists" className="hover:text-[#c0483a]">Artists</a>
          <a href="#book" className="hover:text-[#c0483a]">Book</a>
        </nav>
        <a href="#book" className="px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90" style={{ backgroundColor: RUST }}>
          Book a consult
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-dvh items-end overflow-hidden pt-16">
      <Image src="/img/layouts/tattoo-1.jpg" alt="A Japanese sleeve in progress" fill priority sizes="100vw" className="animate-landing-kenburns object-cover opacity-70" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${NIGHT}, ${NIGHT}55 50%, ${NIGHT}22)` }} />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 md:px-10">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.35em]" style={{ color: RUST }}>
            Custom tattoo · Sak Yant · piercing
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h1 className={`${display.className} mt-4 text-[19vw] uppercase leading-[0.82] tracking-[0.02em] md:text-[13rem]`}>
            Wear your<br />story
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6 border-t border-white/15 pt-6">
            <p className="max-w-md text-base leading-relaxed text-white/75">
              A small island studio of four resident artists. Custom work only,
              obsessive hygiene, and the calm to take your time getting it right.
            </p>
            <a href="#book" className="px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90" style={{ backgroundColor: RUST }}>
              Book a consult
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Care() {
  return (
    <section id="care" className="mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-32">
      <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-3">
        {CARE.map((c, i) => (
          <Reveal key={c.title} delay={i * 80} className="h-full">
            <div className="flex h-full flex-col p-8" style={{ backgroundColor: CHAR }}>
              <c.icon className="size-8" style={{ color: RUST }} />
              <h3 className={`${display.className} mt-5 text-3xl tracking-[0.04em]`}>{c.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-white/70">{c.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Artists() {
  return (
    <section id="artists" className="border-y border-white/10 py-24 md:py-28" style={{ backgroundColor: CHAR }}>
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} mb-12 text-6xl uppercase tracking-[0.04em] md:text-8xl`}>The chairs</h2>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ARTISTS.map((a, i) => (
            <Reveal key={a.slug} delay={i * 70}>
              <div className="group">
                <div className="relative aspect-[3/4] overflow-hidden" style={{ backgroundColor: NIGHT }}>
                  <Image src={a.image} alt={`${a.name} — ${a.style}`} fill sizes="(min-width: 1024px) 22vw, 45vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute bottom-3 left-3 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-white" style={{ backgroundColor: RUST }}>{a.style}</span>
                </div>
                <h3 className={`${display.className} mt-3 text-3xl tracking-[0.04em] group-hover:text-[#c0483a]`}>{a.name}</h3>
                <p className="text-sm text-white/60">{a.sub}</p>
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
        <h2 className={`${display.className} text-6xl uppercase tracking-[0.04em] md:text-7xl`}>Book your chair</h2>
        <p className="mt-3 max-w-md text-base text-white/60">
          Choose an artist, a style and a day for your consult. A small deposit
          holds the slot and comes off your final price.
        </p>
      </Reveal>
      <Reveal delay={120}>
        <div className="mt-10">
          <SlotBooking
            options={ARTISTS}
            displayClass={display.className}
            pickerLabel="Choose your artist"
            priceUnit="deposit"
            variants={{ label: "Style", items: ["Fine-line", "Neo-traditional", "Japanese", "Blackwork", "Sak Yant"] }}
            ctaLabel="Request this consult"
            note="Deposit is redeemable against your tattoo."
            theme={{ accent: RUST, accentText: "#ffffff", text: BONE, muted: "#ece6db99", surface: CHAR, border: "#ffffff1f", radius: "4px" }}
          />
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ backgroundColor: CHAR }}>
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-10">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div>
            <p className={`${display.className} text-4xl tracking-[0.06em]`}>Lucky Hand Tattoo</p>
            <p className="mt-3 max-w-sm text-white/60">Walk-ins welcome for flash · custom by appointment · over-18s only.</p>
          </div>
          <div className="space-y-2 text-sm text-white/80">
            <p className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0" style={{ color: RUST }} />{CONTACT.address}</p>
            <a href={CONTACT.phoneHref} className="flex items-center gap-2 hover:text-white"><Phone className="size-4" style={{ color: RUST }} />{CONTACT.phone}</a>
            <a href={CONTACT.instagram} className="flex items-center gap-2 hover:text-white"><InstagramIcon className="size-4" />{CONTACT.instagramHandle}</a>
          </div>
        </div>
        <p className="mt-12 text-xs uppercase tracking-[0.25em] text-white/40">
          © {new Date().getFullYear()} Lucky Hand Tattoo — fictional demo · Tattoo-studio layout
        </p>
      </div>
    </footer>
  );
}

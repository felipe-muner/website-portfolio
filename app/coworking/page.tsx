import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Space_Grotesk, Inter } from "next/font/google";
import { Coffee, MapPin, Phone, Users, Wifi, Zap } from "lucide-react";
import { InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { SlotBooking, type SlotOption } from "@/components/layouts/SlotBooking";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Business Layout — Beam Coworking",
  robots: { index: false },
};

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"] });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

const INK = "#12161a";
const SLATE = "#1b2127";
const MINT = "#15c79a";
const PAPER = "#f3f6f4";

const PLANS: readonly (SlotOption & { image: string })[] = [
  { slug: "day", name: "Hot desk — day pass", sub: "Any open desk, all day, unlimited coffee.", price: 350, image: "/img/layouts/coworking-1.jpg" },
  { slug: "week", name: "Hot desk — week pass", sub: "Seven days of flexible desks and fast fibre.", price: 1800, image: "/img/layouts/coworking-2.jpg" },
  { slug: "dedicated", name: "Dedicated desk", sub: "Your own desk & monitor, 24/7 keycard access.", price: 5500, image: "/img/layouts/coworking-4.jpg" },
  { slug: "office", name: "Private studio", sub: "Lockable room for a small team, month to month.", price: 14000, image: "/img/layouts/studio-1.jpg" },
];

const PERKS = [
  { icon: Wifi, title: "600 Mbps fibre", body: "Redundant lines and a backup 5G router — your call never drops mid-sprint." },
  { icon: Zap, title: "Backup power", body: "Full-building UPS and a generator, so island power cuts never cost you a deploy." },
  { icon: Coffee, title: "Barista café", body: "Proper espresso, cold brew and a lunch kitchen, all steps from your desk." },
  { icon: Users, title: "A real community", body: "Weekly demo nights, skill-shares and a members channel that actually helps." },
];

export default function CoworkingLayout() {
  return (
    <div className={body.className} style={{ backgroundColor: PAPER, color: INK }}>
      <Nav />
      <Hero />
      <Perks />
      <Booking />
      <Gallery />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b" style={{ borderColor: `${INK}12`, backgroundColor: `${PAPER}e6`, backdropFilter: "blur(8px)" }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-10">
        <Link href="/" className={`${display.className} flex items-center gap-1.5 text-xl font-bold`}>
          <span className="flex size-6 items-center justify-center rounded-md" style={{ backgroundColor: MINT, color: INK }}>B</span>
          Beam
        </Link>
        <nav className="hidden gap-8 text-sm font-semibold md:flex" style={{ color: `${INK}a6` }}>
          <a href="#perks" className="hover:text-[#0f9d7a]">The space</a>
          <a href="#plans" className="hover:text-[#0f9d7a]">Plans</a>
          <a href="#find" className="hover:text-[#0f9d7a]">Visit</a>
        </nav>
        <a href="#plans" className="px-5 py-2.5 text-sm font-bold transition-opacity hover:opacity-90" style={{ backgroundColor: MINT, color: INK, borderRadius: "8px" }}>
          Book a desk
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-10 md:py-24">
        <div>
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: "#0f9d7a" }}>
              Coworking · café · community
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className={`${display.className} mt-4 text-5xl font-bold leading-[0.98] md:text-7xl`}>
              Build your thing,
              <span style={{ color: "#0f9d7a" }}> island side.</span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-6 max-w-md text-lg leading-relaxed" style={{ color: `${INK}a6` }}>
              Fast fibre, backup power and a room full of founders, freelancers
              and remote teams — five minutes from the beach.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#plans" className="px-7 py-3.5 text-sm font-bold transition-opacity hover:opacity-90" style={{ backgroundColor: MINT, color: INK, borderRadius: "8px" }}>
                See plans &amp; book
              </a>
              <a href="#perks" className="border px-7 py-3.5 text-sm font-bold transition-colors hover:bg-black/5" style={{ borderColor: `${INK}22`, borderRadius: "8px" }}>
                Tour the space
              </a>
            </div>
            <div className="mt-8 flex items-center gap-2 text-sm font-medium" style={{ color: `${INK}99` }}>
              <span className="flex -space-x-2">
                {["m2", "f4", "m5"].map((p) => (
                  <span key={p} className="relative size-7 overflow-hidden rounded-full ring-2 ring-white">
                    <Image src={`/img/layouts/person-${p}.jpg`} alt="Member" fill sizes="28px" className="object-cover" />
                  </span>
                ))}
              </span>
              Join 200+ members from 30 countries
            </div>
          </Reveal>
        </div>
        <Reveal from="right" delay={160}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image src="/img/layouts/coworking-1.jpg" alt="Beam coworking space" fill priority sizes="(min-width: 768px) 45vw, 90vw" className="object-cover" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Perks() {
  return (
    <section id="perks" className="py-24 md:py-28" style={{ backgroundColor: INK }}>
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} mb-12 text-4xl font-bold text-white md:text-6xl`}>
            Everything you need to ship
          </h2>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map((p, i) => (
            <Reveal key={p.title} delay={i * 70}>
              <div className="flex h-full flex-col rounded-2xl p-6" style={{ backgroundColor: SLATE }}>
                <p.icon className="size-7" style={{ color: MINT }} />
                <h3 className={`${display.className} mt-4 text-lg font-bold text-white`}>{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{p.body}</p>
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
    <section id="plans" className="mx-auto max-w-5xl px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <h2 className={`${display.className} text-4xl font-bold md:text-5xl`}>Plans &amp; day passes</h2>
        <p className="mt-3 max-w-md text-base" style={{ color: `${INK}a6` }}>
          Drop in for a day or take a desk for the month. Pick a plan and a
          start date — first day&rsquo;s on us if you tour first.
        </p>
      </Reveal>
      <Reveal delay={120}>
        <div className="mt-10">
          <SlotBooking
            options={PLANS}
            displayClass={display.className}
            pickerLabel="Choose your plan"
            priceUnit="from"
            ctaLabel="Request this desk"
            note="Day passes charged per day; desks & studios billed monthly."
            theme={{ accent: MINT, accentText: INK, text: INK, muted: `${INK}99`, surface: "#ffffff", border: `${INK}1a`, radius: "12px" }}
          />
        </div>
      </Reveal>
    </section>
  );
}

function Gallery() {
  const imgs = ["/img/layouts/coworking-2.jpg", "/img/layouts/coworking-3.jpg", "/img/layouts/coworking-4.jpg"];
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 md:px-10">
      <div className="grid gap-4 sm:grid-cols-3">
        {imgs.map((src, i) => (
          <Reveal key={src} delay={i * 80}>
            <div className="relative overflow-hidden rounded-2xl">
              <Image src={src} alt="Inside Beam" width={600} height={480} sizes="(min-width: 640px) 30vw, 90vw" className="aspect-[5/4] w-full object-cover transition-transform duration-700 hover:scale-105" />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="find" style={{ backgroundColor: INK }}>
      <div className="mx-auto max-w-6xl px-5 py-16 text-white md:px-10">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div>
            <p className={`${display.className} flex items-center gap-2 text-3xl font-bold`}>
              <span className="flex size-8 items-center justify-center rounded-md" style={{ backgroundColor: MINT, color: INK }}>B</span>
              Beam Coworking
            </p>
            <p className="mt-3 max-w-sm text-white/60">Open 24/7 for members · day passes 08:00–20:00 · café till 17:00.</p>
          </div>
          <div className="space-y-2 text-sm text-white/80">
            <p className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0" style={{ color: MINT }} />{CONTACT.address}</p>
            <a href={CONTACT.phoneHref} className="flex items-center gap-2 hover:text-white"><Phone className="size-4" style={{ color: MINT }} />{CONTACT.phone}</a>
            <a href={CONTACT.instagram} className="flex items-center gap-2 hover:text-white"><InstagramIcon className="size-4" />{CONTACT.instagramHandle}</a>
          </div>
        </div>
        <p className="mt-12 text-xs uppercase tracking-[0.25em] text-white/40">
          © {new Date().getFullYear()} Beam Coworking — fictional demo · Coworking layout
        </p>
      </div>
    </footer>
  );
}

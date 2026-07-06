import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Anton, Barlow } from "next/font/google";
import { Flame, MapPin, Phone, Swords, Trophy, Users } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { TimetableBoard } from "@/components/layouts/TimetableBoard";
import { MUAYTHAI_WEEK } from "@/lib/layouts/schedule";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Business Layout — Rai Sabai Muay Thai",
  robots: { index: false },
};

const display = Anton({ subsets: ["latin"], weight: "400" });
const body = Barlow({ subsets: ["latin"], weight: ["400", "500", "600"] });

const BLACK = "#0c0a09";
const COAL = "#161311";
const RED = "#d9243b";
const GOLD = "#e6b325";
const BONE = "#f3ede3";

const LEVELS = [
  { icon: Users, title: "First-timers", body: "Never thrown a kick? Our beginner classes start with the basics — stance, guard, footwork — no pressure, no sparring." },
  { icon: Swords, title: "Fitness fighters", body: "Train like a nak muay for the conditioning: pads, bag work and clinch that will wreck you in the best way." },
  { icon: Trophy, title: "Fight team", body: "Serious about competing? Twice-daily sessions, real sparring and corner support for local stadium fights." },
];

const PLANS = [
  { name: "Drop-in", price: 400, unit: "class", note: "Gloves to borrow" },
  { name: "10-Class Pass", price: 3200, unit: "10 classes", note: "Valid 1 month" },
  { name: "1 Week Unlimited", price: 2500, unit: "week", featured: true },
  { name: "1 Month Unlimited", price: 7500, unit: "month", note: "Best value" },
];

const KRUS = [
  { name: "Kru Somchai", role: "Head coach · ex-Lumpinee", image: "/img/layouts/muaythai-1.jpg" },
  { name: "Kru Nok", role: "Technique & beginners", image: "/img/layouts/muaythai-2.jpg" },
  { name: "Coach Tai", role: "Strength & conditioning", image: "/img/layouts/muaythai-3.jpg" },
];

export default function MuayThaiLayout() {
  return (
    <div className={body.className} style={{ backgroundColor: BLACK, color: BONE }}>
      <Nav />
      <Hero />
      <Levels />
      <Schedule />
      <Pricing />
      <Krus />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10" style={{ backgroundColor: `${BLACK}e0`, backdropFilter: "blur(8px)" }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-10">
        <Link href="/" className={`${display.className} text-xl uppercase tracking-wide`}>
          Rai Sabai<span style={{ color: RED }}>.</span>
        </Link>
        <nav className="hidden gap-8 text-xs font-semibold uppercase tracking-[0.18em] md:flex" style={{ color: "#f3ede3aa" }}>
          <a href="#levels" className="hover:text-[#e6b325]">Train</a>
          <a href="#schedule" className="hover:text-[#e6b325]">Timetable</a>
          <a href="#pricing" className="hover:text-[#e6b325]">Prices</a>
          <a href="#krus" className="hover:text-[#e6b325]">Krus</a>
        </nav>
        <a href="#pricing" className="px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors" style={{ backgroundColor: RED }}>
          Start training
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-dvh items-end overflow-hidden pt-16">
      <Image src="/img/layouts/muaythai-1.jpg" alt="A fighter on the heavy bag" fill priority sizes="100vw" className="animate-landing-kenburns object-cover opacity-60" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${BLACK}, ${BLACK}66 45%, transparent)` }} />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 md:px-10">
        <Reveal>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: GOLD }}>
            <Flame className="size-4" /> Traditional Muay Thai · all levels
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h1 className={`${display.className} mt-4 text-[16vw] uppercase leading-[0.82] md:text-[10rem]`}>
            The art of
            <span className="block" style={{ color: RED }}>eight limbs</span>
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-white/15 pt-6">
            <p className="max-w-md text-base leading-relaxed text-white/75">
              An authentic island camp where tourists, fighters and total
              beginners share the same ring. Twice-daily classes, real krus,
              zero ego.
            </p>
            <div className="flex gap-3">
              <a href="#schedule" className="px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white" style={{ backgroundColor: RED }}>
                See the timetable
              </a>
              <a href={CONTACT.phoneHref} className="flex items-center gap-2 border border-white/30 px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] transition-colors hover:border-[#e6b325]">
                <Phone className="size-4" /> Call the camp
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Levels() {
  return (
    <section id="levels" className="mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <h2 className={`${display.className} mb-12 text-5xl uppercase md:text-7xl`}>
          Every <span style={{ color: RED }}>level</span> welcome
        </h2>
      </Reveal>
      <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-3">
        {LEVELS.map((l, i) => (
          <Reveal key={l.title} delay={i * 80} className="h-full">
            <div className="flex h-full flex-col p-8" style={{ backgroundColor: COAL }}>
              <l.icon className="size-9" style={{ color: GOLD }} />
              <h3 className={`${display.className} mt-5 text-2xl uppercase`}>{l.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-white/70">{l.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Schedule() {
  return (
    <section id="schedule" className="border-y border-white/10 py-24 md:py-28" style={{ backgroundColor: COAL }}>
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} mb-3 text-5xl uppercase md:text-7xl`}>Weekly grind</h2>
          <p className="mb-10 max-w-md text-base text-white/60">
            Search a class or a kru — the week lights up its matches. Morning
            and afternoon sessions, six days a week.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <TimetableBoard
            week={MUAYTHAI_WEEK}
            displayClass={display.className}
            placeholder="Beginner? Clinch? Kru Nok?…"
            theme={{ accent: RED, accentText: "#ffffff", text: BONE, muted: "#f3ede399", surface: BLACK, card: BLACK, border: "#ffffff1f", radius: "10px" }}
          />
        </Reveal>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <h2 className={`${display.className} mb-3 text-5xl uppercase md:text-7xl`}>Train with us</h2>
        <p className="mb-12 max-w-md text-base text-white/60">Pay as you go or go all-in. Locals and long-stays, ask about monthly rates.</p>
      </Reveal>
      <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((p, i) => (
          <Reveal key={p.name} delay={i * 70} className="h-full">
            <div className="flex h-full flex-col justify-between p-7" style={{ backgroundColor: p.featured ? RED : COAL, color: p.featured ? "#fff" : BONE }}>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.22em]">{p.name}</h3>
                <p className={`${display.className} mt-5 text-5xl`}>฿{p.price.toLocaleString()}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em]" style={{ color: p.featured ? "#ffffffcc" : "#f3ede380" }}>per {p.unit}</p>
              </div>
              <p className="mt-8 text-xs font-bold uppercase tracking-[0.16em]" style={{ color: p.featured ? "#fff" : GOLD }}>{p.note ?? "No sign-up fee"}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Krus() {
  return (
    <section id="krus" className="border-t border-white/10 py-24 md:py-28" style={{ backgroundColor: COAL }}>
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} mb-12 text-5xl uppercase md:text-7xl`}>Your <span style={{ color: RED }}>krus</span></h2>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-3">
          {KRUS.map((k, i) => (
            <Reveal key={k.name} delay={i * 80}>
              <div className="group">
                <div className="relative aspect-[4/5] overflow-hidden" style={{ backgroundColor: BLACK }}>
                  <Image src={k.image} alt={k.name} fill sizes="(min-width: 640px) 30vw, 90vw" className="object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0" />
                </div>
                <h3 className={`${display.className} mt-4 text-2xl uppercase group-hover:text-[#e6b325]`}>{k.name}</h3>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">{k.role}</p>
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
    <footer className="relative overflow-hidden" style={{ backgroundColor: RED, color: "#fff" }}>
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-[13vw] uppercase leading-[0.9] md:text-8xl`}>See you in the ring</h2>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-10 grid gap-8 border-t border-white/25 pt-8 md:grid-cols-3">
            <p className="flex items-start gap-3 text-sm font-medium"><MapPin className="mt-0.5 size-5 shrink-0" />{CONTACT.address}</p>
            <div className="space-y-1 text-sm font-medium">
              <a href={CONTACT.phoneHref} className="block hover:underline">{CONTACT.phone}</a>
              <a href={CONTACT.emailHref} className="block hover:underline">{CONTACT.email}</a>
            </div>
            <div className="flex items-start gap-4">
              <a href={CONTACT.instagram} aria-label="Instagram"><InstagramIcon className="size-6 hover:scale-110" /></a>
              <a href={CONTACT.facebook} aria-label="Facebook"><FacebookIcon className="size-6 hover:scale-110" /></a>
            </div>
          </div>
        </Reveal>
        <p className="mt-14 text-xs font-bold uppercase tracking-[0.25em] text-white/70">
          © {new Date().getFullYear()} Rai Sabai Muay Thai — fictional demo · Muay-Thai layout
        </p>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond, Karla } from "next/font/google";
import { Leaf, MapPin, Wind } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { SanctuaryGarden } from "@/components/layouts/schedule/SanctuaryGarden";
import {
  CLASS_PLANS,
  CONTACT,
  YOGA_CLASSES,
  YOGA_COACHES,
} from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Yoga Layout 1 — Sanctuary",
  robots: { index: false },
};

const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"] });
const body = Karla({ subsets: ["latin"], weight: ["400", "500", "700"] });

const SAND = "#f6f0e4";
const INK = "#33312b";
const TERRA = "#c4663f";
const PALM = "#41573f";

// Unique imagery for this layout (public/img/layouts).
const PRACTICE_IMAGES = [
  "/img/layouts/yoga-backbend.jpg",
  "/img/layouts/yoga-warrior-class.jpg",
  "/img/layouts/yoga-props-pink.jpg",
  "/img/layouts/mobility-ball.jpg",
  "/img/layouts/breathwork-group.jpg",
  "/img/layouts/yoga-palm-silhouette.jpg",
];

export default function SanctuaryLayout() {
  return (
    <div className={`${body.className}`} style={{ backgroundColor: SAND, color: INK }}>
      <Nav />
      <Hero />
      <Intro />
      <Practices />
      <Schedule />
      <Pricing />
      <Teachers />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#33312b]/10 backdrop-blur" style={{ backgroundColor: `${SAND}e6` }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-10">
        <Link href="/" className={`${display.className} text-2xl italic`} style={{ color: PALM }}>
          Sanctuary <span style={{ color: TERRA }}>Yoga</span>
        </Link>
        <nav className="hidden gap-8 text-xs font-bold uppercase tracking-[0.22em] text-[#33312b]/70 md:flex">
          <a href="#practices" className="hover:text-[#c4663f]">Practices</a>
          <a href="#rhythm" className="hover:text-[#c4663f]">Rhythm</a>
          <a href="#passes" className="hover:text-[#c4663f]">Passes</a>
          <a href="#teachers" className="hover:text-[#c4663f]">Teachers</a>
        </nav>
        <a
          href="#passes"
          className="rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-85"
          style={{ backgroundColor: PALM }}
        >
          Begin
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:px-10 md:py-24 lg:grid-cols-2">
        <div className="relative">
          <span
            aria-hidden
            className="absolute -left-10 -top-10 size-48 animate-landing-breathe rounded-full"
            style={{ backgroundColor: `${TERRA}22` }}
          />
          <Reveal>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: TERRA }}>
              <Leaf className="size-4" />
              A quiet corner of the island
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className={`${display.className} mt-6 text-6xl leading-[1.02] md:text-8xl`}>
              Move slowly,
              <br />
              <em style={{ color: PALM }}>breathe</em>
              <br />
              deeply.
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-7 max-w-md leading-relaxed text-[#33312b]/70">
              Yoga, pilates, breathwork and stillness — a sanctuary above the
              palms, where strength learns to soften.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <a
                href="#practices"
                className="rounded-full px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-85"
                style={{ backgroundColor: TERRA }}
              >
                Explore practices
              </a>
              <a
                href="#rhythm"
                className="text-xs font-bold uppercase tracking-[0.2em] underline underline-offset-8"
                style={{ color: PALM }}
              >
                This week&rsquo;s rhythm
              </a>
            </div>
          </Reveal>
        </div>
        <Reveal from="right" delay={150}>
          <div className="relative mx-auto max-w-md">
            <div className="overflow-hidden rounded-t-[14rem] border-8 border-white shadow-2xl shadow-[#33312b]/15">
              <Image
                src="/img/layouts/yoga-meditation-studio.jpg"
                alt="A calm practice at Sanctuary"
                width={1600}
                height={1280}
                priority
                sizes="(min-width: 1024px) 28rem, 90vw"
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
            <div
              className="absolute -bottom-6 -left-6 flex size-32 animate-landing-float items-center justify-center rounded-full p-4 text-center text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white"
              style={{ backgroundColor: PALM }}
            >
              Inhale · Exhale · Repeat
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section className="py-16 md:py-20" style={{ backgroundColor: "#efe6d3" }}>
      <div className="mx-auto max-w-3xl px-5 text-center md:px-10">
        <Reveal>
          <Wind className="mx-auto size-7" style={{ color: TERRA }} />
          <p className={`${display.className} mt-6 text-3xl leading-snug md:text-4xl`}>
            &ldquo;The day builds the body. <em style={{ color: PALM }}>This room builds the
            quiet</em> that carries it.&rdquo;
          </p>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-[#33312b]/50">
            Yoga · Pilates · Breathwork · Reformer
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Practices() {
  return (
    <section id="practices" className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-28">
      <Reveal>
        <h2 className={`${display.className} text-center text-5xl md:text-6xl`}>
          The <em style={{ color: TERRA }}>practices</em>
        </h2>
      </Reveal>
      <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {YOGA_CLASSES.map((item, index) => (
          <Reveal key={item.name} delay={index * 90}>
            <Link href={item.href} className="group block text-center">
              <div className="mx-auto max-w-xs overflow-hidden rounded-t-[10rem] border-4 border-white shadow-lg shadow-[#33312b]/10">
                <Image
                  src={PRACTICE_IMAGES[index % PRACTICE_IMAGES.length]}
                  alt={item.name}
                  width={600}
                  height={760}
                  sizes="(min-width: 1024px) 20rem, (min-width: 640px) 45vw, 90vw"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className={`${display.className} mt-6 text-3xl transition-colors group-hover:[color:#c4663f]`}>
                {item.name}
              </h3>
              {item.coach && (
                <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.25em]" style={{ color: PALM }}>
                  with {item.coach}
                </p>
              )}
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-[#33312b]/65">
                {item.detail}
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Schedule() {
  return (
    <section id="rhythm" className="py-20 md:py-28" style={{ backgroundColor: "#efe6d3" }}>
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-center text-5xl md:text-6xl`}>
            The week&rsquo;s <em style={{ color: TERRA }}>garden</em>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-center text-sm" style={{ color: `${INK}99` }}>
            Seven days, planted with practice. Search for who — or what — you
            love, and watch it bloom.
          </p>
        </Reveal>
        <div className="mt-12">
          <Reveal delay={120}>
            <SanctuaryGarden displayClass={display.className} />
          </Reveal>
        </div>
        <p className="mt-10 text-center text-xs uppercase tracking-[0.2em]" style={{ color: `${INK}80` }}>
          Representative week — every class recurs weekly
        </p>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="passes" className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-28">
      <Reveal>
        <h2 className={`${display.className} text-center text-5xl md:text-6xl`}>
          Practice <em style={{ color: TERRA }}>passes</em>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-center text-sm text-[#33312b]/60">
          Every class pass includes the full studio calendar. Prices in Thai
          Baht.
        </p>
      </Reveal>
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CLASS_PLANS.map((plan, index) => (
          <Reveal key={plan.name} delay={index * 80} className="h-full">
            <div
              className={`flex h-full flex-col items-center rounded-[2rem] border p-8 text-center ${
                plan.featured ? "text-white" : "border-[#33312b]/15 bg-white/50"
              }`}
              style={plan.featured ? { backgroundColor: TERRA, borderColor: TERRA } : undefined}
            >
              <h3 className="text-xs font-bold uppercase tracking-[0.22em]">{plan.name}</h3>
              <p className={`${display.className} mt-6 text-5xl`}>
                ฿{plan.price.toLocaleString()}
              </p>
              <p className={`mt-1 text-xs uppercase tracking-[0.2em] ${plan.featured ? "text-white/70" : "text-[#33312b]/50"}`}>
                per {plan.unit}
              </p>
              <p className={`mt-6 text-[0.65rem] font-bold uppercase tracking-[0.18em] ${plan.featured ? "text-white" : ""}`} style={plan.featured ? undefined : { color: PALM }}>
                {plan.note ?? "All studio classes"}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Teachers() {
  return (
    <section id="teachers" className="py-20 md:py-28" style={{ backgroundColor: "#efe6d3" }}>
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-center text-5xl md:text-6xl`}>
            Your <em style={{ color: PALM }}>guides</em>
          </h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {YOGA_COACHES.map((coach, index) => (
            <Reveal key={coach.name} delay={index * 90}>
              <Link href={coach.href} className="group block text-center">
                <div className="mx-auto size-36 overflow-hidden rounded-full border-4 border-white shadow-lg shadow-[#33312b]/10 md:size-44">
                  <Image
                    src={coach.image}
                    alt={`${coach.name} — ${coach.specialty}`}
                    width={300}
                    height={300}
                    sizes="176px"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <h3 className={`${display.className} mt-5 text-2xl`}>{coach.name}</h3>
                <p className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.22em]" style={{ color: TERRA }}>
                  {coach.specialty}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-16" style={{ backgroundColor: INK, color: SAND }}>
      <div className="mx-auto max-w-6xl px-5 text-center md:px-10">
        <Reveal>
          <p className={`${display.className} text-4xl italic md:text-5xl`}>
            See you on the mat.
          </p>
        </Reveal>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-[#f6f0e4]/70">
          <span className="flex items-center gap-2">
            <MapPin className="size-4" style={{ color: TERRA }} />
            {CONTACT.address}
          </span>
          <a href={CONTACT.phoneHref} className="hover:text-white">{CONTACT.phone}</a>
          <a href={CONTACT.emailHref} className="hover:text-white">{CONTACT.email}</a>
        </div>
        <div className="mt-6 flex items-center justify-center gap-5">
          <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <InstagramIcon className="size-5 hover:text-white" />
          </a>
          <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FacebookIcon className="size-5 hover:text-white" />
          </a>
        </div>
        <p className="mt-10 text-[0.65rem] uppercase tracking-[0.3em] text-[#f6f0e4]/40">
          © {new Date().getFullYear()} Sanctuary Yoga — fictional demo · Layout 1
        </p>
      </div>
    </footer>
  );
}

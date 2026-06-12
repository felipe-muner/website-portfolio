import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Anton, Archivo } from "next/font/google";
import { ArrowDownRight, ArrowUpRight, Dumbbell, Flame, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { ForgeBoard } from "@/components/layouts/schedule/ForgeBoard";
import {
  CONTACT,
  GYM_CLASSES,
  GYM_COACHES,
  GYM_PLANS,
} from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Gym Layout 1 — Forge",
  robots: { index: false },
};

const display = Anton({ subsets: ["latin"], weight: "400" });
const body = Archivo({ subsets: ["latin"], weight: ["400", "500", "700"] });

const TICKER = [
  "Cross-Training",
  "Race Prep",
  "HIIT",
  "Weightlifting",
  "Boot Camp",
  "BJJ",
  "Open Gym",
  "Ice Bath",
];

// Unique imagery for this layout (public/img/layouts).
const PROGRAM_IMAGES = [
  "/img/layouts/gym-rings.jpg",
  "/img/layouts/gym-battle-ropes.jpg",
  "/img/layouts/fitness-situps.jpg",
  "/img/layouts/gym-barbell-floor.jpg",
  "/img/layouts/gym-sled-push.jpg",
  "/img/layouts/gym-chalk-hands.jpg",
];

export default function ForgeLayout() {
  return (
    <div className={`${body.className} min-h-dvh bg-[#0b0b0b] text-white`}>
      <Nav />
      <Hero />
      <Ticker />
      <Programs />
      <Schedule />
      <Pricing />
      <Coaches />
      <Contact />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0b0b0b]/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-10">
        <Link href="/" className={`${display.className} text-xl tracking-wide`}>
          FORGE<span className="text-brand-orange">.</span>
        </Link>
        <nav className="hidden gap-8 text-xs font-bold uppercase tracking-[0.2em] text-white/70 md:flex">
          <a href="#programs" className="transition-colors hover:text-brand-orange">Programs</a>
          <a href="#schedule" className="transition-colors hover:text-brand-orange">Schedule</a>
          <a href="#pricing" className="transition-colors hover:text-brand-orange">Pricing</a>
          <a href="#coaches" className="transition-colors hover:text-brand-orange">Coaches</a>
        </nav>
        <a
          href="#pricing"
          className="bg-brand-orange px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-black transition-colors hover:bg-white"
        >
          Join now
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-dvh items-end overflow-hidden pt-16">
      <Image
        src="/img/layouts/gym-deadlift.jpg"
        alt="Deadlift on the Forge gym floor"
        fill
        priority
        sizes="100vw"
        className="animate-landing-kenburns object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/40 to-transparent" />
      <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 md:px-10">
        <Reveal>
          <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-brand-orange">
            <Flame className="size-4" />
            {CONTACT.area}
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h1
            className={`${display.className} text-[17vw] leading-[0.85] uppercase md:text-[10rem] lg:text-[12rem]`}
          >
            Train
            <span className="block text-transparent [-webkit-text-stroke:2px_#f36100]">
              Harder
            </span>
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-white/15 pt-6">
            <p className="max-w-md text-sm leading-relaxed text-white/70">
              Cross-training, race prep, heavy iron and an ice bath to finish —
              the island&rsquo;s biggest training floor, open to every level.
            </p>
            <div className="flex gap-3">
              <a
                href="#programs"
                className="flex items-center gap-2 bg-brand-orange px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-black transition-colors hover:bg-white"
              >
                Explore programs
                <ArrowDownRight className="size-4" />
              </a>
              <a
                href={CONTACT.phoneHref}
                className="flex items-center gap-2 border border-white/30 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] transition-colors hover:border-brand-orange hover:text-brand-orange"
              >
                <Phone className="size-4" />
                Call us
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Ticker() {
  const row = [...TICKER, ...TICKER];
  return (
    <div className="overflow-hidden border-y-4 border-brand-orange bg-brand-orange py-3 text-black">
      <div className="flex w-max animate-landing-marquee gap-10">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className={`${display.className} flex items-center gap-10 whitespace-nowrap text-2xl uppercase`}
          >
            {item}
            <Dumbbell className="size-5" />
          </span>
        ))}
      </div>
    </div>
  );
}

function Programs() {
  return (
    <section id="programs" className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
          <h2 className={`${display.className} text-5xl uppercase md:text-7xl`}>
            The <span className="text-brand-orange">programs</span>
          </h2>
          <p className="max-w-xs text-sm text-white/60">
            Six ways to suffer well. Every class coached, every level welcome.
          </p>
        </div>
      </Reveal>
      <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
        {GYM_CLASSES.map((item, index) => (
          <Reveal key={item.name} delay={index * 80} className="h-full">
            <Link
              href={item.href}
              className="group relative flex h-full min-h-72 flex-col justify-end overflow-hidden bg-[#111] p-7"
            >
              <Image
                src={PROGRAM_IMAGES[index % PROGRAM_IMAGES.length]}
                alt={item.name}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover opacity-20 transition-all duration-500 group-hover:scale-105 group-hover:opacity-50"
              />
              <span
                className={`${display.className} relative text-6xl text-white/10 transition-colors group-hover:text-brand-orange/60`}
              >
                0{index + 1}
              </span>
              <h3 className={`${display.className} relative mt-2 text-2xl uppercase`}>
                {item.name}
              </h3>
              <p className="relative mt-3 text-sm leading-relaxed text-white/60">
                {item.detail}
              </p>
              {item.coach && (
                <p className="relative mt-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
                  Coach {item.coach}
                </p>
              )}
              <ArrowUpRight className="absolute right-6 top-6 size-5 text-white/30 transition-all group-hover:text-brand-orange" />
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Schedule() {
  return (
    <section
      id="schedule"
      className="border-y border-white/10 bg-[#111] py-24 [clip-path:polygon(0_3rem,100%_0,100%_calc(100%-3rem),0_100%)] md:py-36"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} mb-12 text-5xl uppercase md:text-7xl`}>
            Daily <span className="text-transparent [-webkit-text-stroke:1.5px_#fff]">grind</span>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <ForgeBoard displayClass={display.className} />
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-8 text-xs uppercase tracking-[0.2em] text-white/40">
            Representative week — see the{" "}
            <a href="#schedule" className="text-brand-orange underline underline-offset-4">full timetable</a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <h2 className={`${display.className} mb-4 text-5xl uppercase md:text-7xl`}>
          Pay <span className="text-brand-orange">&amp;</span> lift
        </h2>
        <p className="mb-14 max-w-md text-sm text-white/60">
          Straightforward gym access in Thai Baht. Class packs and combos at
          the front desk.
        </p>
      </Reveal>
      <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
        {GYM_PLANS.map((plan, index) => (
          <Reveal key={plan.name} delay={index * 70} className="h-full">
            <div
              className={`flex h-full flex-col justify-between p-8 ${
                plan.featured ? "bg-brand-orange text-black" : "bg-[#0b0b0b]"
              }`}
            >
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.25em]">
                  {plan.name}
                </h3>
                <p className={`${display.className} mt-6 text-5xl`}>
                  ฿{plan.price.toLocaleString()}
                </p>
                <p
                  className={`mt-1 text-xs uppercase tracking-[0.2em] ${
                    plan.featured ? "text-black/60" : "text-white/50"
                  }`}
                >
                  per {plan.unit}
                </p>
              </div>
              <p
                className={`mt-8 text-xs font-bold uppercase tracking-[0.18em] ${
                  plan.featured ? "text-black" : "text-brand-orange"
                }`}
              >
                {plan.note ?? "No contracts"}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Coaches() {
  return (
    <section id="coaches" className="border-t border-white/10 bg-[#111] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} mb-14 text-5xl uppercase md:text-7xl`}>
            Your <span className="text-brand-orange">corner</span>
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
          {GYM_COACHES.map((coach, index) => (
            <Reveal key={coach.name} delay={index * 80}>
              <Link href={coach.href} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#0b0b0b] [clip-path:polygon(0_0,100%_0,100%_92%,0_100%)]">
                  <Image
                    src={coach.image}
                    alt={`${coach.name} — ${coach.specialty}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                  />
                </div>
                <h3 className={`${display.className} mt-4 text-2xl uppercase group-hover:text-brand-orange`}>
                  {coach.name}
                </h3>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
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

function Contact() {
  return (
    <footer className="relative overflow-hidden bg-brand-orange text-black">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-[14vw] leading-[0.9] uppercase md:text-9xl`}>
            No excuses
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <div className="mt-12 grid gap-10 border-t-2 border-black/20 pt-10 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 size-5 shrink-0" />
              <p className="text-sm font-medium leading-relaxed">{CONTACT.address}</p>
            </div>
            <div className="space-y-2 text-sm font-medium">
              <a href={CONTACT.phoneHref} className="block hover:underline">
                {CONTACT.phone}
              </a>
              <a href={CONTACT.emailHref} className="block hover:underline">
                {CONTACT.email}
              </a>
            </div>
            <div className="flex items-start gap-4">
              <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <InstagramIcon className="size-6 transition-transform hover:scale-110" />
              </a>
              <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FacebookIcon className="size-6 transition-transform hover:scale-110" />
              </a>
            </div>
          </div>
        </Reveal>
        <p className="mt-16 text-xs font-bold uppercase tracking-[0.25em] text-black/60">
          © {new Date().getFullYear()} Forge Strength Club — fictional demo · Layout 1
        </p>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Chakra_Petch, Saira_Condensed } from "next/font/google";
import { ChevronRight, Gauge, MapPin, Timer, Zap } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { VelocityLanes } from "@/components/layouts/schedule/VelocityLanes";
import {
  CONTACT,
  CROSSFIT_PLANS,
  GYM_CLASSES,
  GYM_COACHES,
} from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Gym Layout 3 — Velocity",
  robots: { index: false },
};

const display = Saira_Condensed({ subsets: ["latin"], weight: ["700", "900"] });
const body = Chakra_Petch({ subsets: ["latin"], weight: ["400", "500", "700"] });

const RED = "#ff2d2d";

// Unique imagery for this layout (public/img/layouts).
const PROGRAM_IMAGES = [
  "/img/layouts/gym-squat-bw.jpg",
  "/img/layouts/gym-battle-ropes.jpg",
  "/img/layouts/fitness-situps.jpg",
  "/img/layouts/gym-chalk-hands.jpg",
  "/img/layouts/gym-training-man.jpg",
  "/img/layouts/gym-rings.jpg",
];

export default function VelocityLayout() {
  return (
    <div className={`${body.className} min-h-dvh overflow-x-clip bg-[#101113] text-white`}>
      <Nav />
      <Hero />
      <Stats />
      <Programs />
      <Schedule />
      <Pricing />
      <Coaches />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-sm border border-white/10 bg-[#101113]/90 px-5 py-3 backdrop-blur md:mx-10 lg:mx-auto">
        <Link href="/" className={`${display.className} text-2xl font-black italic uppercase`}>
          VELOCITY<span style={{ color: RED }}>{"//"}</span>
        </Link>
        <nav className="hidden gap-7 text-xs font-bold uppercase tracking-[0.2em] text-white/60 md:flex">
          <a href="#programs" className="hover:text-white">Programs</a>
          <a href="#sessions" className="hover:text-white">Sessions</a>
          <a href="#membership" className="hover:text-white">Membership</a>
          <a href="#team" className="hover:text-white">Team</a>
        </nav>
        <a
          href="#membership"
          className="-skew-x-12 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white"
          style={{ backgroundColor: RED }}
        >
          <span className="block skew-x-12">Start today</span>
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden">
      <Image
        src="/img/layouts/gym-sled-push.jpg"
        alt="Sled push on race day"
        fill
        priority
        sizes="100vw"
        className="animate-landing-kenburns object-cover opacity-40 mix-blend-luminosity"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, #101113 35%, rgba(16,17,19,0.5) 70%, rgba(255,45,45,0.25) 100%)",
        }}
      />
      {/* speed lines */}
      <div aria-hidden className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="absolute h-[140%] w-px -rotate-12 bg-white/10"
            style={{ left: `${20 + i * 18}%`, top: "-20%" }}
          />
        ))}
      </div>
      <div className="relative mx-auto w-full max-w-6xl px-5 pt-24 md:px-10">
        <Reveal from="left">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: RED }}>
            <Gauge className="size-4" />
            Cross-Training · Race Prep · Island
          </p>
        </Reveal>
        <Reveal from="left" delay={120}>
          <h1
            className={`${display.className} mt-5 text-7xl font-black italic uppercase leading-[0.9] md:text-9xl`}
          >
            Built
            <br />
            for <span style={{ color: RED }}>race</span>
            <br />
            day.
          </h1>
        </Reveal>
        <Reveal from="left" delay={240}>
          <p className="mt-7 max-w-md text-sm leading-relaxed text-white/70">
            Engine work, barbells and compromised running — train the race-day
            way with coaches who compete.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#programs"
              className="-skew-x-12 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.15em]"
              style={{ backgroundColor: RED }}
            >
              <span className="flex skew-x-12 items-center gap-2">
                See programs <ChevronRight className="size-4" />
              </span>
            </a>
            <Link
              href="#programs"
              className="-skew-x-12 border border-white/30 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.15em] transition-colors hover:border-white"
            >
              <span className="block skew-x-12">Race programs</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { icon: Timer, label: "WODs / week", value: "11" },
    { icon: Zap, label: "Race stations", value: "8" },
    { icon: Gauge, label: "Coaches on floor", value: "13" },
  ];
  return (
    <section className="border-y border-white/10 bg-[#16181b]">
      <div className="mx-auto grid max-w-6xl gap-px sm:grid-cols-3">
        {stats.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 90}>
            <div className="flex items-center gap-5 px-8 py-8">
              <stat.icon className="size-8 shrink-0" style={{ color: RED }} />
              <div>
                <p className={`${display.className} text-4xl font-black italic`}>{stat.value}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">{stat.label}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Programs() {
  return (
    <section id="programs" className="mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <h2 className={`${display.className} text-6xl font-black italic uppercase md:text-8xl`}>
          Pick your <span style={{ color: RED }}>lane</span>
        </h2>
      </Reveal>
      <div className="mt-14 space-y-4">
        {GYM_CLASSES.map((item, index) => (
          <Reveal key={item.name} delay={index * 60} from={index % 2 ? "right" : "left"}>
            <Link
              href={item.href}
              className="group grid items-center gap-5 border border-white/10 bg-[#16181b] p-5 transition-colors hover:border-[#ff2d2d] md:grid-cols-[10rem_1fr_auto]"
            >
              <div className="relative h-24 w-full -skew-x-6 overflow-hidden md:w-40">
                <Image
                  src={PROGRAM_IMAGES[index % PROGRAM_IMAGES.length]}
                  alt={item.name}
                  fill
                  sizes="160px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 mix-blend-multiply" style={{ backgroundColor: "rgba(255,45,45,0.35)" }} />
              </div>
              <div>
                <h3 className={`${display.className} text-3xl font-black italic uppercase`}>
                  {item.name}
                </h3>
                <p className="mt-1 max-w-xl text-sm text-white/60">{item.detail}</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                {item.coach && <span>w/ {item.coach}</span>}
                <ChevronRight className="size-5 transition-transform group-hover:translate-x-1" style={{ color: RED }} />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Schedule() {
  return (
    <section id="sessions" className="relative overflow-hidden border-y border-white/10 bg-[#16181b] py-24 md:py-32">
      <span
        aria-hidden
        className={`${display.className} pointer-events-none absolute -top-8 left-0 whitespace-nowrap text-[11rem] font-black italic uppercase text-white/[0.04]`}
      >
        Session times session times
      </span>
      <div className="relative mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-5xl font-black italic uppercase md:text-7xl`}>
            The day<span style={{ color: RED }}>s</span> run
          </h2>
        </Reveal>
        <div className="mt-12">
          <Reveal delay={100}>
            <VelocityLanes displayClass={display.className} />
          </Reveal>
        </div>
        <Reveal delay={180}>
          <p className="mt-8 text-xs uppercase tracking-[0.2em] text-white/40">
            Times shown recur weekly — search the grid above
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="membership" className="mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className={`${display.className} text-5xl font-black italic uppercase md:text-7xl`}>
            Race <span style={{ color: RED }}>fees</span>
          </h2>
          <p className="max-w-xs text-xs uppercase tracking-[0.2em] text-white/50">
            Class packs · locals save 20%
          </p>
        </div>
      </Reveal>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CROSSFIT_PLANS.map((plan, index) => (
          <Reveal key={plan.name} delay={index * 80} className="h-full">
            <div
              className={`flex h-full flex-col justify-between border p-7 ${
                plan.featured
                  ? "border-transparent text-white"
                  : "border-white/15 bg-[#16181b]"
              }`}
              style={plan.featured ? { backgroundColor: RED } : undefined}
            >
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.25em]">{plan.name}</h3>
                <p className={`${display.className} mt-5 text-5xl font-black italic`}>
                  ฿{plan.price.toLocaleString()}
                </p>
                <p className={`mt-1 text-xs uppercase tracking-[0.2em] ${plan.featured ? "text-white/70" : "text-white/40"}`}>
                  / {plan.unit}
                </p>
              </div>
              {plan.note && (
                <p className={`mt-6 text-[0.65rem] font-bold uppercase tracking-[0.18em] ${plan.featured ? "text-white" : ""}`} style={plan.featured ? undefined : { color: RED }}>
                  {plan.note}
                </p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Coaches() {
  return (
    <section id="team" className="border-t border-white/10 bg-[#16181b] py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} mb-12 text-5xl font-black italic uppercase md:text-7xl`}>
            The pace<span style={{ color: RED }}>makers</span>
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {GYM_COACHES.map((coach, index) => (
            <Reveal key={coach.name} delay={index * 60}>
              <Link href={coach.href} className="group block">
                <div className="relative aspect-[3/4] -skew-x-3 overflow-hidden border border-white/10">
                  <Image
                    src={coach.image}
                    alt={`${coach.name} — ${coach.specialty}`}
                    fill
                    sizes="(min-width: 768px) 17vw, 50vw"
                    className="object-cover transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#101113] to-transparent p-3 pt-10">
                    <h3 className={`${display.className} text-xl font-black italic uppercase`}>
                      {coach.name}
                    </h3>
                    <p className="text-[0.6rem] uppercase tracking-[0.18em] text-white/60">
                      {coach.specialty}
                    </p>
                  </div>
                </div>
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
    <footer className="relative overflow-hidden py-20">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-6xl font-black italic uppercase leading-[0.9] md:text-8xl`}>
            Lights out,
            <br />
            <span style={{ color: RED }}>full send.</span>
          </h2>
        </Reveal>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-8 border-t border-white/10 pt-8 text-sm text-white/60">
          <p className="flex items-center gap-2">
            <MapPin className="size-4" style={{ color: RED }} />
            {CONTACT.address}
          </p>
          <div className="flex items-center gap-6">
            <a href={CONTACT.phoneHref} className="hover:text-white">{CONTACT.phone}</a>
            <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon className="size-5 hover:text-white" />
            </a>
            <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FacebookIcon className="size-5 hover:text-white" />
            </a>
          </div>
        </div>
        <p className="mt-8 text-[0.65rem] uppercase tracking-[0.25em] text-white/30">
          © {new Date().getFullYear()} Velocity Performance — fictional demo · Layout 3
        </p>
      </div>
    </footer>
  );
}

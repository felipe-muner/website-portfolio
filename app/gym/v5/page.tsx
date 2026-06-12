import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Manrope, Unbounded } from "next/font/google";
import { ArrowRight, MapPin, Moon, Snowflake, Sparkles } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { AfterDarkTimeline } from "@/components/layouts/schedule/AfterDarkTimeline";
import {
  CLASS_PLANS,
  CONTACT,
  FACILITY,
  GYM_CLASSES,
  GYM_COACHES,
} from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Gym Layout 5 — After Dark",
  robots: { index: false },
};

const display = Unbounded({ subsets: ["latin"], weight: ["400", "700", "900"] });
const body = Manrope({ subsets: ["latin"], weight: ["400", "500", "700"] });

const LIME = "#c8ff2d";

// Unique imagery for this layout (public/img/layouts).
const PROGRAM_IMAGES = [
  "/img/layouts/gym-battle-ropes.jpg",
  "/img/layouts/gym-rings.jpg",
  "/img/layouts/gym-racks-moody.jpg",
  "/img/layouts/gym-kettlebell-shoe.jpg",
  "/img/layouts/gym-training-man.jpg",
  "/img/layouts/gym-barbell-floor.jpg",
];

export default function AfterDarkLayout() {
  return (
    <div
      className={`${body.className} min-h-dvh text-white`}
      style={{ background: "radial-gradient(120% 90% at 50% 0%, #101d33 0%, #070b14 55%, #05070d 100%)" }}
    >
      <Nav />
      <Hero />
      <Programs />
      <Recovery />
      <Schedule />
      <Pricing />
      <Coaches />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function GlowDot() {
  return (
    <span
      className="inline-block size-2 animate-pulse rounded-full"
      style={{ backgroundColor: LIME, boxShadow: `0 0 12px ${LIME}` }}
    />
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#070b14]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-10">
        <Link href="/" className={`${display.className} text-sm font-black uppercase tracking-wider`}>
          AFTERDARK<span style={{ color: LIME }}>*</span>
        </Link>
        <nav className="hidden gap-8 text-xs font-semibold uppercase tracking-[0.18em] text-white/60 md:flex">
          <a href="#train" className="hover:text-white">Train</a>
          <a href="#recover" className="hover:text-white">Recover</a>
          <a href="#hours" className="hover:text-white">Hours</a>
          <a href="#join" className="hover:text-white">Join</a>
        </nav>
        <a
          href="#join"
          className="rounded-full px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-black transition-shadow hover:shadow-[0_0_24px_rgba(200,255,45,0.7)]"
          style={{ backgroundColor: LIME }}
        >
          Join the night shift
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-16">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Reveal>
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-white/60">
              <GlowDot />
              The island after sunset
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className={`${display.className} mt-6 text-5xl font-black uppercase leading-[1.02] md:text-7xl`}>
              The island
              <br />
              sleeps.
              <br />
              <span style={{ color: LIME, textShadow: `0 0 40px rgba(200,255,45,0.45)` }}>
                You lift.
              </span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-7 max-w-md leading-relaxed text-white/60">
              Evening WODs, late open-gym sessions and an ice bath under the
              stars. The floor runs from first light until the night shift
              clocks out.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#train"
                className="flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-black transition-shadow hover:shadow-[0_0_32px_rgba(200,255,45,0.6)]"
                style={{ backgroundColor: LIME }}
              >
                Tonight&rsquo;s sessions
                <ArrowRight className="size-4" />
              </a>
              <Link
                href="#recover"
                className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-bold text-white/80 transition-colors hover:border-white/60 hover:text-white"
              >
                Tour the club
              </Link>
            </div>
          </Reveal>
        </div>
        <Reveal from="right" delay={200}>
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-6 rounded-[2rem] opacity-40 blur-3xl"
              style={{ background: `linear-gradient(140deg, ${LIME}55, transparent 60%)` }}
            />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/15">
              <Image
                src="/img/layouts/gym-dark-floor.jpg"
                alt="Night training on the dark floor"
                width={1600}
                height={1068}
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="aspect-[4/5] w-full object-cover brightness-90"
              />
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl border border-white/15 bg-[#070b14]/70 px-5 py-4 backdrop-blur">
                <div>
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-white/50">
                    Next session
                  </p>
                  <p className={`${display.className} text-sm font-bold uppercase`}>
                    17:30 — Night WOD
                  </p>
                </div>
                <Moon className="size-6" style={{ color: LIME }} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Programs() {
  return (
    <section id="train" className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-28">
      <Reveal>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <h2 className={`${display.className} text-3xl font-black uppercase md:text-5xl`}>
            Train <span style={{ color: LIME }}>/</span> programs
          </h2>
          <p className="max-w-xs text-sm text-white/50">
            Six programs, one floor. Tap in wherever your night takes you.
          </p>
        </div>
      </Reveal>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {GYM_CLASSES.map((item, index) => (
          <Reveal key={item.name} delay={index * 70} className="h-full">
            <Link
              href={item.href}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition-all hover:border-[#c8ff2d66] hover:bg-white/[0.07]"
            >
              <div className="relative mb-5 aspect-video overflow-hidden rounded-2xl">
                <Image
                  src={PROGRAM_IMAGES[index % PROGRAM_IMAGES.length]}
                  alt={item.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover brightness-75 transition-all duration-500 group-hover:scale-105 group-hover:brightness-100"
                />
              </div>
              <h3 className={`${display.className} text-lg font-bold uppercase`}>{item.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">{item.detail}</p>
              <div className="mt-5 flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em]">
                <span style={{ color: LIME }}>{item.coach ? `Coach ${item.coach}` : "All levels"}</span>
                <ArrowRight className="size-4 text-white/40 transition-all group-hover:translate-x-1 group-hover:text-white" />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Recovery() {
  return (
    <section id="recover" className="border-y border-white/10 bg-[#070b14]/60 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} mb-12 text-3xl font-black uppercase md:text-5xl`}>
            Recover <span style={{ color: LIME }}>/</span> reset
          </h2>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FACILITY.map((item, index) => (
            <Reveal key={item.title} delay={index * 80} className="h-full">
              <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <Snowflake className="size-6" style={{ color: LIME }} />
                <h3 className={`${display.className} mt-4 text-sm font-bold uppercase`}>
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Schedule() {
  return (
    <section id="hours" className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-28">
      <Reveal>
        <h2 className={`${display.className} mb-12 text-3xl font-black uppercase md:text-5xl`}>
          Hours <span style={{ color: LIME }}>/</span> the rhythm
        </h2>
      </Reveal>
      <Reveal delay={100}>
        <AfterDarkTimeline displayClass={display.className} />
      </Reveal>
      <p className="mt-6 text-xs uppercase tracking-[0.2em] text-white/40">
        Sessions recur weekly — search the night line above
      </p>
    </section>
  );
}

function Pricing() {
  return (
    <section id="join" className="border-y border-white/10 bg-[#070b14]/60 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <h2 className={`${display.className} text-3xl font-black uppercase md:text-5xl`}>
              Join <span style={{ color: LIME }}>/</span> passes
            </h2>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/50">
              <Sparkles className="size-4" style={{ color: LIME }} />
              Classes, gym, steam &amp; ice
            </p>
          </div>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CLASS_PLANS.map((plan, index) => (
            <Reveal key={plan.name} delay={index * 80} className="h-full">
              <div
                className={`flex h-full flex-col justify-between rounded-3xl border p-7 ${
                  plan.featured
                    ? "border-transparent text-black"
                    : "border-white/10 bg-white/[0.04]"
                }`}
                style={
                  plan.featured
                    ? { backgroundColor: LIME, boxShadow: "0 0 60px rgba(200,255,45,0.25)" }
                    : undefined
                }
              >
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.22em]">{plan.name}</h3>
                  <p className={`${display.className} mt-5 text-4xl font-black`}>
                    ฿{plan.price.toLocaleString()}
                  </p>
                  <p className={`mt-1 text-xs uppercase tracking-[0.2em] ${plan.featured ? "text-black/60" : "text-white/40"}`}>
                    per {plan.unit}
                  </p>
                </div>
                <p className={`mt-7 text-xs font-bold uppercase tracking-[0.15em] ${plan.featured ? "text-black" : ""}`} style={plan.featured ? undefined : { color: LIME }}>
                  {plan.note ?? "No contracts"}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <p className="mt-8 text-xs uppercase tracking-[0.2em] text-white/40">
            More passes and combos at the front desk
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Coaches() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-28">
      <Reveal>
        <h2 className={`${display.className} mb-12 text-3xl font-black uppercase md:text-5xl`}>
          Crew <span style={{ color: LIME }}>/</span> on the floor
        </h2>
      </Reveal>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {GYM_COACHES.map((coach, index) => (
          <Reveal key={coach.name} delay={index * 60}>
            <Link href={coach.href} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src={coach.image}
                  alt={`${coach.name} — ${coach.specialty}`}
                  fill
                  sizes="(min-width: 768px) 17vw, 50vw"
                  className="object-cover brightness-75 transition-all duration-500 group-hover:scale-105 group-hover:brightness-100"
                />
              </div>
              <h3 className={`${display.className} mt-3 text-sm font-bold uppercase`}>
                {coach.name}
              </h3>
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/45">
                {coach.specialty}
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-5 md:flex-row md:items-center md:px-10">
        <div>
          <p className={`${display.className} text-xl font-black uppercase`}>
            See you <span style={{ color: LIME }}>tonight.</span>
          </p>
          <p className="mt-3 flex items-center gap-2 text-sm text-white/50">
            <MapPin className="size-4" style={{ color: LIME }} />
            {CONTACT.address}
          </p>
        </div>
        <div className="flex items-center gap-6 text-sm text-white/60">
          <a href={CONTACT.phoneHref} className="hover:text-white">{CONTACT.phone}</a>
          <a href={CONTACT.emailHref} className="hover:text-white">{CONTACT.email}</a>
          <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <InstagramIcon className="size-5 hover:text-white" />
          </a>
          <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FacebookIcon className="size-5 hover:text-white" />
          </a>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl px-5 text-[0.65rem] uppercase tracking-[0.25em] text-white/30 md:px-10">
        © {new Date().getFullYear()} Afterdark Fitness — fictional demo · Layout 5
      </p>
    </footer>
  );
}

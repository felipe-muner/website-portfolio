import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fraunces, Work_Sans } from "next/font/google";
import { ArrowRight, Droplets, MapPin, Waves } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { TideChart } from "@/components/layouts/schedule/TideChart";
import {
  CLASS_PLANS,
  CONTACT,
  YOGA_CLASSES,
  YOGA_COACHES,
} from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Yoga Layout 2 — Tide",
  robots: { index: false },
};

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "600"], style: ["normal", "italic"] });
const body = Work_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] });

const MIST = "#e9efe6";
const SAGE = "#aebfae";
const FOREST = "#2d4435";
const CLAY = "#b98a68";

// Unique imagery for this layout (public/img/layouts).
const CHAPTER_IMAGES = [
  "/img/layouts/yoga-sunset-pose.jpg",
  "/img/layouts/yoga-backbend.jpg",
  "/img/layouts/yoga-warrior-class.jpg",
  "/img/layouts/breathwork-group.jpg",
  "/img/layouts/yoga-meditation-studio.jpg",
];

function WaveDivider({ flip, fill }: { flip?: boolean; fill: string }) {
  return (
    <svg
      viewBox="0 0 1440 64"
      preserveAspectRatio="none"
      aria-hidden
      className={`block h-12 w-full md:h-16 ${flip ? "rotate-180" : ""}`}
    >
      <path
        d="M0 32 C240 64 480 0 720 24 C960 48 1200 8 1440 36 L1440 64 L0 64 Z"
        fill={fill}
      />
    </svg>
  );
}

export default function TideLayout() {
  return (
    <div className={`${body.className}`} style={{ backgroundColor: MIST, color: FOREST }}>
      <Nav />
      <Hero />
      <Chapters />
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
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 md:px-10">
        <Link href="/" className={`${display.className} flex items-center gap-2 text-xl`} style={{ color: FOREST }}>
          <Waves className="size-5" style={{ color: CLAY }} />
          Tide Studio
        </Link>
        <nav className="hidden gap-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#2d4435]/70 md:flex">
          <a href="#chapters" className="hover:text-[#b98a68]">Practices</a>
          <a href="#tides" className="hover:text-[#b98a68]">Tides</a>
          <a href="#passes" className="hover:text-[#b98a68]">Passes</a>
        </nav>
        <a
          href="#passes"
          className="rounded-full border-2 px-6 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors hover:bg-[#2d4435] hover:text-[#e9efe6]"
          style={{ borderColor: FOREST }}
        >
          Reserve a mat
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pb-0 pt-28 md:pt-36">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div className="pb-16">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: CLAY }}>
                Strength softens here
              </p>
            </Reveal>
            <Reveal delay={120}>
              <h1 className={`${display.className} mt-6 text-6xl font-light leading-[1.02] md:text-8xl`}>
                Practice with
                <br />
                the <em className="font-normal" style={{ color: CLAY }}>tide</em>,
                <br />
                not against it.
              </h1>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-7 max-w-md leading-relaxed text-[#2d4435]/70">
                Five mindful practices by the water — flowing from sunrise
                yoga to evening breathwork and the cold, clear shock of the
                ice bath.
              </p>
              <a
                href="#chapters"
                className="mt-9 inline-flex items-center gap-3 rounded-full px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: FOREST }}
              >
                Begin the journey
                <ArrowRight className="size-4" />
              </a>
            </Reveal>
          </div>
          <Reveal from="right" delay={150}>
            <div className="relative">
              <div
                className="overflow-hidden shadow-xl shadow-[#2d4435]/15"
                style={{ borderRadius: "46% 54% 50% 50% / 60% 58% 42% 40%" }}
              >
                <Image
                  src="/img/layouts/yoga-beach-group.jpg"
                  alt="Beach practice with the Tide community"
                  width={1600}
                  height={1067}
                  priority
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="aspect-[5/6] w-full object-cover"
                />
              </div>
              <Droplets
                className="absolute -left-4 top-8 size-10 animate-landing-float"
                style={{ color: SAGE }}
              />
            </div>
          </Reveal>
        </div>
      </div>
      <WaveDivider fill={FOREST} />
    </section>
  );
}

function Chapters() {
  return (
    <section id="chapters" className="text-white" style={{ backgroundColor: FOREST }}>
      <div className="mx-auto max-w-6xl space-y-24 px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <h2 className={`${display.className} text-5xl font-light md:text-6xl`}>
            Five <em style={{ color: SAGE }}>chapters</em> of practice
          </h2>
        </Reveal>
        {YOGA_CLASSES.slice(0, 5).map((item, index) => (
          <article key={item.name} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal
              from={index % 2 ? "right" : "left"}
              className={index % 2 ? "lg:order-2" : undefined}
            >
              <div
                className="overflow-hidden"
                style={{
                  borderRadius:
                    index % 2
                      ? "54% 46% 40% 60% / 48% 56% 44% 52%"
                      : "46% 54% 60% 40% / 56% 44% 56% 44%",
                }}
              >
                <Image
                  src={CHAPTER_IMAGES[index % CHAPTER_IMAGES.length]}
                  alt={item.name}
                  width={760}
                  height={620}
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="aspect-[6/5] w-full object-cover"
                />
              </div>
            </Reveal>
            <Reveal
              from={index % 2 ? "left" : "right"}
              delay={120}
              className={index % 2 ? "lg:order-1" : undefined}
            >
              <p className={`${display.className} text-7xl font-light text-white/15`}>
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className={`${display.className} mt-2 text-4xl font-light md:text-5xl`}>
                {item.name}
              </h3>
              {item.coach && (
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: SAGE }}>
                  guided by {item.coach}
                </p>
              )}
              <p className="mt-5 max-w-md leading-relaxed text-white/70">{item.detail}</p>
              <Link
                href={item.href}
                className="mt-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] underline-offset-8 hover:underline"
                style={{ color: CLAY }}
              >
                Read about this practice
                <ArrowRight className="size-4" />
              </Link>
            </Reveal>
          </article>
        ))}
      </div>
      <WaveDivider flip fill={MIST} />
    </section>
  );
}

function Schedule() {
  return (
    <section id="tides" className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
      <Reveal>
        <h2 className={`${display.className} text-center text-5xl font-light md:text-6xl`}>
          Daily <em style={{ color: CLAY }}>tides</em>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-center text-sm text-[#2d4435]/60">
          Morning flows, midday reformers, evening stillness. A representative
          week — all classes recur weekly.
        </p>
      </Reveal>
      <div className="mt-14">
        <Reveal delay={100}>
          <TideChart displayClass={display.className} />
        </Reveal>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="passes" className="py-20 md:py-28" style={{ backgroundColor: `${SAGE}40` }}>
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-center text-5xl font-light md:text-6xl`}>
            Choose your <em style={{ color: CLAY }}>current</em>
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CLASS_PLANS.map((plan, index) => (
            <Reveal key={plan.name} delay={index * 80} className="h-full">
              <div
                className={`flex h-full flex-col rounded-[2.5rem] p-8 ${
                  plan.featured ? "text-white shadow-xl shadow-[#2d4435]/25" : "bg-white/70"
                }`}
                style={plan.featured ? { backgroundColor: FOREST } : undefined}
              >
                <h3 className="text-xs font-semibold uppercase tracking-[0.22em]">{plan.name}</h3>
                <p className={`${display.className} mt-6 text-5xl font-light`}>
                  ฿{plan.price.toLocaleString()}
                </p>
                <p className={`mt-1 text-xs uppercase tracking-[0.2em] ${plan.featured ? "text-white/60" : "text-[#2d4435]/50"}`}>
                  per {plan.unit}
                </p>
                <p className={`mt-auto pt-8 text-[0.65rem] font-semibold uppercase tracking-[0.18em]`} style={{ color: plan.featured ? SAGE : CLAY }}>
                  {plan.note ?? "Full studio calendar"}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Teachers() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-28">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className={`${display.className} text-5xl font-light md:text-6xl`}>
            The <em style={{ color: CLAY }}>keepers</em>
          </h2>
          <a
            href="#"
            className="text-xs font-semibold uppercase tracking-[0.2em] underline underline-offset-8"
            style={{ color: FOREST }}
          >
            Meet the whole team
          </a>
        </div>
      </Reveal>
      <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
        {YOGA_COACHES.map((coach, index) => (
          <Reveal key={coach.name} delay={index * 80}>
            <Link href={coach.href} className="group block">
              <div
                className="overflow-hidden"
                style={{ borderRadius: "50% 50% 44% 56% / 56% 52% 48% 44%" }}
              >
                <Image
                  src={coach.image}
                  alt={`${coach.name} — ${coach.specialty}`}
                  width={420}
                  height={480}
                  sizes="(min-width: 1024px) 22vw, 45vw"
                  className="aspect-[7/8] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className={`${display.className} mt-4 text-center text-2xl`}>{coach.name}</h3>
              <p className="text-center text-[0.6rem] font-semibold uppercase tracking-[0.22em]" style={{ color: CLAY }}>
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
    <footer className="text-white" style={{ backgroundColor: FOREST }}>
      <WaveDivider flip fill={MIST} />
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-10">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className={`${display.className} text-4xl font-light italic md:text-5xl`}>
              Come as you are.
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm text-white/60">
              <MapPin className="size-4" style={{ color: SAGE }} />
              {CONTACT.address}
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/70">
            <a href={CONTACT.phoneHref} className="hover:text-white">{CONTACT.phone}</a>
            <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon className="size-5 hover:text-white" />
            </a>
            <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FacebookIcon className="size-5 hover:text-white" />
            </a>
          </div>
        </div>
        <p className="mt-12 text-[0.65rem] uppercase tracking-[0.3em] text-white/40">
          © {new Date().getFullYear()} Tide Studio — fictional demo · Layout 2
        </p>
      </div>
    </footer>
  );
}

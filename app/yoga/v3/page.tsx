import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Marcellus, Nunito_Sans } from "next/font/google";
import { MapPin, Sun, Sunrise } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { DawnArc } from "@/components/layouts/schedule/DawnArc";
import {
  CLASS_PLANS,
  CONTACT,
  YOGA_CLASSES,
  YOGA_COACHES,
} from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Yoga Layout 3 — Dawn",
  robots: { index: false },
};

const display = Marcellus({ subsets: ["latin"], weight: "400" });
const body = Nunito_Sans({ subsets: ["latin"], weight: ["400", "600", "800"] });

const INK = "#4a2c3a";
const ROSE = "#d96f5e";
const GOLD = "#e0a14f";

const SKY = "linear-gradient(180deg, #fdeedd 0%, #fbd9c3 45%, #f3b8a5 100%)";

// Unique imagery for this layout (public/img/layouts).
const PRACTICE_IMAGES = [
  "/img/layouts/yoga-palm-silhouette.jpg",
  "/img/layouts/yoga-beach-group.jpg",
  "/img/layouts/yoga-meditation-studio.jpg",
  "/img/layouts/yoga-props-pink.jpg",
  "/img/layouts/yoga-warrior-class.jpg",
  "/img/layouts/yoga-backbend.jpg",
];

export default function DawnLayout() {
  return (
    <div className={`${body.className}`} style={{ background: "#fdf3e7", color: INK }}>
      <Nav />
      <Hero />
      <Practices />
      <Mornings />
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
      <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-5 md:px-10">
        <Link href="/" className={`${display.className} flex items-center gap-2 text-xl`}>
          <Sun className="size-5" style={{ color: GOLD }} />
          Dawn House
        </Link>
        <nav className="hidden gap-8 text-xs font-extrabold uppercase tracking-[0.25em] text-[#4a2c3a]/70 md:flex">
          <a href="#practices" className="hover:text-[#d96f5e]">Practices</a>
          <a href="#mornings" className="hover:text-[#d96f5e]">Mornings</a>
          <a href="#passes" className="hover:text-[#d96f5e]">Passes</a>
        </nav>
        <a
          href="#passes"
          className="rounded-full px-6 py-2.5 text-xs font-extrabold uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: ROSE }}
        >
          Rise with us
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-36 text-center md:pb-32" style={{ background: SKY }}>
      {/* sun disc */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[16rem] size-[26rem] -translate-x-1/2 rounded-full opacity-80 blur-sm md:top-[14rem] md:size-[34rem]"
        style={{ background: `radial-gradient(circle, ${GOLD}cc 0%, ${GOLD}33 55%, transparent 70%)` }}
      />
      <div className="relative mx-auto max-w-3xl px-5">
        <Reveal>
          <p className="flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-[0.35em]" style={{ color: ROSE }}>
            <Sunrise className="size-4" />
            06:30 · On the island
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h1 className={`${display.className} mt-8 text-6xl leading-[1.05] md:text-8xl`}>
            Salute the sun
            <br />
            before the island
            <br />
            wakes.
          </h1>
        </Reveal>
        <Reveal delay={260}>
          <p className="mx-auto mt-7 max-w-lg leading-relaxed text-[#4a2c3a]/75">
            Morning yoga, pilates and breathwork at Dawn House — start with
            the light, finish with the ice, carry the calm all day.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#mornings"
              className="rounded-full px-8 py-4 text-xs font-extrabold uppercase tracking-[0.22em] text-white shadow-lg shadow-[#d96f5e]/30 transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: ROSE }}
            >
              The morning ritual
            </a>
            <a
              href="#practices"
              className="rounded-full border-2 bg-white/40 px-8 py-4 text-xs font-extrabold uppercase tracking-[0.22em] backdrop-blur transition-colors hover:bg-white/70"
              style={{ borderColor: INK }}
            >
              All practices
            </a>
          </div>
        </Reveal>
        <Reveal delay={400}>
          <div className="relative mx-auto mt-16 max-w-2xl">
            <div className="overflow-hidden rounded-t-full border-8 border-white/70 shadow-2xl shadow-[#4a2c3a]/20">
              <Image
                src="/img/layouts/yoga-sunset-pose.jpg"
                alt="Sunrise practice at Dawn House"
                width={1600}
                height={1009}
                priority
                sizes="(min-width: 768px) 42rem, 92vw"
                className="aspect-[9/7] w-full animate-landing-kenburns object-cover"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Practices() {
  return (
    <section id="practices" className="mx-auto max-w-5xl px-5 py-20 md:px-10 md:py-28">
      <Reveal>
        <h2 className={`${display.className} text-center text-5xl md:text-6xl`}>
          Six ways to greet the day
        </h2>
        <div className="mx-auto mt-4 h-1 w-16 rounded-full" style={{ backgroundColor: GOLD }} />
      </Reveal>
      <div className="mt-16 space-y-10">
        {YOGA_CLASSES.map((item, index) => (
          <Reveal key={item.name} delay={index * 60}>
            <Link
              href={item.href}
              className="group flex flex-col items-center gap-6 rounded-[3rem] bg-white/70 p-6 shadow-sm transition-shadow hover:shadow-xl hover:shadow-[#d96f5e]/15 md:flex-row md:gap-10 md:p-8"
            >
              <div className="relative size-32 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-md md:size-40">
                <Image
                  src={PRACTICE_IMAGES[index % PRACTICE_IMAGES.length]}
                  alt={item.name}
                  fill
                  sizes="160px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className={`${display.className} text-3xl transition-colors group-hover:[color:#d96f5e]`}>
                  {item.name}
                </h3>
                {item.coach && (
                  <p className="mt-1 text-[0.65rem] font-extrabold uppercase tracking-[0.25em]" style={{ color: GOLD }}>
                    with {item.coach}
                  </p>
                )}
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#4a2c3a]/70">
                  {item.detail}
                </p>
              </div>
              <span
                className="ml-auto hidden size-12 shrink-0 items-center justify-center rounded-full text-white transition-transform group-hover:rotate-45 md:flex"
                style={{ backgroundColor: ROSE }}
              >
                →
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Mornings() {
  return (
    <section id="mornings" className="py-20 md:py-28" style={{ background: SKY }}>
      <div className="mx-auto max-w-5xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-center text-5xl md:text-6xl`}>
            The week, sunrise to dusk
          </h2>
          <p className="mx-auto mt-4 max-w-md text-center text-sm" style={{ color: `${INK}99` }}>
            Seven suns on one arc — pick a day and follow its light.
          </p>
        </Reveal>
        <div className="mt-10">
          <Reveal delay={120}>
            <DawnArc displayClass={display.className} />
          </Reveal>
        </div>
        <p className="mt-14 text-center text-xs uppercase tracking-[0.22em]" style={{ color: `${INK}80` }}>
          Representative week — every class recurs weekly
        </p>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="passes" className="py-20 md:py-28" style={{ backgroundColor: "#fff6ea" }}>
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-center text-5xl md:text-6xl`}>
            Light, in four sizes
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CLASS_PLANS.map((plan, index) => (
            <Reveal key={plan.name} delay={index * 80} className="h-full">
              <div
                className={`flex h-full flex-col items-center rounded-t-[6rem] rounded-b-3xl p-8 pt-12 text-center ${
                  plan.featured ? "text-white shadow-xl shadow-[#d96f5e]/30" : "bg-white/75"
                }`}
                style={plan.featured ? { backgroundColor: ROSE } : undefined}
              >
                <span
                  className="flex size-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: plan.featured ? "#ffffff33" : `${GOLD}33` }}
                >
                  <Sun className="size-5" style={{ color: plan.featured ? "#fff" : GOLD }} />
                </span>
                <h3 className="mt-5 text-xs font-extrabold uppercase tracking-[0.22em]">
                  {plan.name}
                </h3>
                <p className={`${display.className} mt-5 text-4xl`}>
                  ฿{plan.price.toLocaleString()}
                </p>
                <p className={`mt-1 text-xs uppercase tracking-[0.2em] ${plan.featured ? "text-white/70" : "text-[#4a2c3a]/50"}`}>
                  per {plan.unit}
                </p>
                <p className="mt-auto pt-7 text-[0.65rem] font-extrabold uppercase tracking-[0.18em]" style={{ color: plan.featured ? "#fff" : ROSE }}>
                  {plan.note ?? "All studio classes"}
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
    <section className="mx-auto max-w-5xl px-5 py-20 md:px-10 md:py-28">
      <Reveal>
        <h2 className={`${display.className} text-center text-5xl md:text-6xl`}>
          Guided by gentle hands
        </h2>
      </Reveal>
      <div className="mt-14 grid grid-cols-2 gap-8 lg:grid-cols-4">
        {YOGA_COACHES.map((coach, index) => (
          <Reveal key={coach.name} delay={index * 90}>
            <Link href={coach.href} className="group block text-center">
              <div className="relative mx-auto w-fit">
                <span
                  aria-hidden
                  className="absolute -inset-2 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ background: `conic-gradient(${GOLD}, ${ROSE}, ${GOLD})` }}
                />
                <div className="relative size-32 overflow-hidden rounded-full border-4 border-white shadow-lg md:size-40">
                  <Image
                    src={coach.image}
                    alt={`${coach.name} — ${coach.specialty}`}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
              </div>
              <h3 className={`${display.className} mt-5 text-2xl`}>{coach.name}</h3>
              <p className="mt-1 text-[0.6rem] font-extrabold uppercase tracking-[0.25em]" style={{ color: ROSE }}>
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
    <footer className="pb-12 pt-16 text-center" style={{ backgroundColor: INK, color: "#fdf3e7" }}>
      <div className="mx-auto max-w-4xl px-5">
        <Reveal>
          <Sun className="mx-auto size-8" style={{ color: GOLD }} />
          <p className={`${display.className} mt-6 text-4xl md:text-5xl`}>
            Tomorrow, at first light.
          </p>
        </Reveal>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-[#fdf3e7]/70">
          <span className="flex items-center gap-2">
            <MapPin className="size-4" style={{ color: GOLD }} />
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
        <p className="mt-10 text-[0.65rem] uppercase tracking-[0.3em] text-[#fdf3e7]/40">
          © {new Date().getFullYear()} Dawn House — fictional demo · Layout 3
        </p>
      </div>
    </footer>
  );
}

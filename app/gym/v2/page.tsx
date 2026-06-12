import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Archivo_Black, IBM_Plex_Mono } from "next/font/google";
import { ArrowRight, Crosshair, MapPin, Plus } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { ConcretePunchCard } from "@/components/layouts/schedule/ConcretePunchCard";
import {
  CONTACT,
  FACILITY,
  GYM_CLASSES,
  GYM_COACHES,
  GYM_PLANS,
} from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Gym Layout 2 — Concrete",
  robots: { index: false },
};

const display = Archivo_Black({ subsets: ["latin"], weight: "400" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "700"] });

const INK = "text-[#161616]";

// Unique imagery for this layout (public/img/layouts).
const FACILITY_IMAGES = [
  "/img/layouts/gym-dumbbell-rack.jpg",
  "/img/layouts/fitness-mat-class.jpg",
  "/img/layouts/gym-plates.jpg",
  "/img/layouts/gym-cable.jpg",
];

export default function ConcreteLayout() {
  return (
    <div className={`${mono.className} ${INK} min-h-dvh bg-[#e8e6e0]`}>
      <Nav />
      <Hero />
      <SpecPrograms />
      <Facility />
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
    <header className="sticky top-0 z-50 border-b-2 border-[#161616] bg-[#e8e6e0]">
      <div className="flex items-stretch divide-x-2 divide-[#161616]">
        <Link
          href="/"
          className={`${display.className} flex items-center px-5 py-4 text-lg uppercase`}
        >
          Foundry
        </Link>
        <nav className="hidden flex-1 items-center gap-8 px-6 text-xs uppercase tracking-widest md:flex">
          <a href="#programs" className="hover:underline">01 / Programs</a>
          <a href="#facility" className="hover:underline">02 / Facility</a>
          <a href="#schedule" className="hover:underline">03 / Schedule</a>
          <a href="#rates" className="hover:underline">04 / Rates</a>
        </nav>
        <a
          href="#rates"
          className="ml-auto flex items-center gap-2 bg-[#161616] px-6 text-xs font-bold uppercase tracking-widest text-[#e8e6e0] transition-colors hover:bg-[#f36100] hover:text-black"
        >
          Get a pass
          <ArrowRight className="size-4" />
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="border-b-2 border-[#161616]">
      <div className="grid lg:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col justify-between border-[#161616] p-6 md:p-12 lg:border-r-2">
          <Reveal>
            <p className="mb-10 text-xs uppercase tracking-[0.3em] text-[#161616]/60">
              Facility № 88 — Sunset Beach Road
            </p>
            <h1 className={`${display.className} text-6xl uppercase leading-[0.95] md:text-8xl`}>
              Strength
              <br />
              is a<br />
              <span className="bg-[#f36100] px-3">system.</span>
            </h1>
          </Reveal>
          <Reveal delay={150}>
            <dl className="mt-14 grid grid-cols-3 gap-px border-2 border-[#161616] bg-[#161616] text-center">
              {[
                { dt: "Programs", dd: "12+" },
                { dt: "Coaches", dd: "13" },
                { dt: "Days / year", dd: "365" },
              ].map((stat) => (
                <div key={stat.dt} className="bg-[#e8e6e0] p-4">
                  <dd className={`${display.className} text-3xl`}>{stat.dd}</dd>
                  <dt className="mt-1 text-[0.6rem] uppercase tracking-[0.2em] text-[#161616]/60">
                    {stat.dt}
                  </dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
        <Reveal from="right" className="relative min-h-[24rem]">
          <Image
            src="/img/layouts/gym-bright.jpg"
            alt="The training floor at Foundry"
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
          <span className="absolute bottom-4 left-4 bg-[#161616] px-3 py-1 text-[0.6rem] uppercase tracking-[0.25em] text-[#e8e6e0]">
            Fig. 1 — main floor
          </span>
        </Reveal>
      </div>
    </section>
  );
}

function SpecPrograms() {
  return (
    <section id="programs" className="border-b-2 border-[#161616]">
      <Reveal>
        <div className="flex items-center justify-between border-b-2 border-[#161616] px-6 py-4 md:px-12">
          <h2 className={`${display.className} text-2xl uppercase md:text-4xl`}>
            01 / Programs
          </h2>
          <Crosshair className="size-6" />
        </div>
      </Reveal>
      <div>
        {GYM_CLASSES.map((item, index) => (
          <Reveal key={item.name}>
            <Link
              href={item.href}
              className="group grid grid-cols-[3rem_1fr] items-center gap-4 border-b border-[#161616]/30 px-6 py-6 transition-colors last:border-b-0 hover:bg-[#161616] hover:text-[#e8e6e0] md:grid-cols-[6rem_1fr_2fr_8rem] md:px-12"
            >
              <span className="text-xs text-[#161616]/50 group-hover:text-[#e8e6e0]/50">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className={`${display.className} text-xl uppercase md:text-3xl`}>
                {item.name}
              </h3>
              <p className="col-span-2 mt-2 text-xs leading-relaxed text-[#161616]/70 group-hover:text-[#e8e6e0]/70 md:col-span-1 md:mt-0">
                {item.detail}
              </p>
              <span className="hidden text-right text-xs uppercase tracking-widest text-[#f36100] md:block">
                {item.coach ?? "Open"}
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Facility() {
  return (
    <section id="facility" className="border-b-2 border-[#161616]">
      <Reveal>
        <div className="border-b-2 border-[#161616] px-6 py-4 md:px-12">
          <h2 className={`${display.className} text-2xl uppercase md:text-4xl`}>
            02 / Facility
          </h2>
        </div>
      </Reveal>
      <div className="grid gap-px bg-[#161616]/30 sm:grid-cols-2 lg:grid-cols-4">
        {FACILITY.map((item, index) => (
          <Reveal key={item.title} delay={index * 80} className="h-full">
            <figure className="flex h-full flex-col bg-[#e8e6e0]">
              <div className="relative aspect-square">
                <Image
                  src={FACILITY_IMAGES[index % FACILITY_IMAGES.length]}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover contrast-110 grayscale transition-all duration-500 hover:grayscale-0"
                />
              </div>
              <figcaption className="flex flex-1 flex-col border-t-2 border-[#161616] p-5">
                <h3 className="text-sm font-bold uppercase tracking-widest">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#161616]/70">{item.body}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Schedule() {
  return (
    <section id="schedule" className="border-b-2 border-[#161616]">
      <Reveal>
        <div className="border-b-2 border-[#161616] px-6 py-4 md:px-12">
          <h2 className={`${display.className} text-2xl uppercase md:text-4xl`}>
            03 / Weekly output
          </h2>
        </div>
      </Reveal>
      <div className="px-6 py-8 md:px-12">
        <Reveal>
          <ConcretePunchCard displayClass={display.className} />
        </Reveal>
      </div>
      <p className="px-6 pb-4 text-[0.65rem] uppercase tracking-[0.2em] text-[#161616]/50 md:px-12">
        * Representative rhythm — times shown above recur weekly
      </p>
    </section>
  );
}

function Pricing() {
  return (
    <section id="rates" className="border-b-2 border-[#161616] bg-[#161616] text-[#e8e6e0]">
      <Reveal>
        <div className="flex items-center justify-between border-b-2 border-[#e8e6e0]/20 px-6 py-4 md:px-12">
          <h2 className={`${display.className} text-2xl uppercase md:text-4xl`}>
            04 / Rate card
          </h2>
          <span className="text-xs uppercase tracking-[0.25em] text-[#e8e6e0]/50">
            THB · no contracts
          </span>
        </div>
      </Reveal>
      <div>
        {GYM_PLANS.map((plan, index) => (
          <Reveal key={plan.name} delay={index * 50}>
            <div
              className={`flex flex-wrap items-baseline justify-between gap-3 border-b border-[#e8e6e0]/15 px-6 py-5 last:border-b-0 md:px-12 ${
                plan.featured ? "bg-[#f36100] text-black" : ""
              }`}
            >
              <div className="flex items-baseline gap-4">
                <Plus className="size-3 shrink-0" />
                <h3 className="text-sm font-bold uppercase tracking-widest">{plan.name}</h3>
                {plan.note && (
                  <span
                    className={`text-[0.65rem] uppercase tracking-[0.2em] ${
                      plan.featured ? "text-black/60" : "text-[#e8e6e0]/50"
                    }`}
                  >
                    {plan.note}
                  </span>
                )}
              </div>
              <p className={`${display.className} text-2xl md:text-3xl`}>
                ฿{plan.price.toLocaleString()}
                <span className="ml-2 text-xs font-normal lowercase tracking-normal opacity-60">
                  / {plan.unit}
                </span>
              </p>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="px-6 py-6 md:px-12">
        <a
          href="#rates"
          className="inline-flex items-center gap-2 border-2 border-[#e8e6e0] px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-[#e8e6e0] hover:text-[#161616]"
        >
          Get a pass
          <ArrowRight className="size-4" />
        </a>
      </div>
    </section>
  );
}

function Coaches() {
  return (
    <section className="border-b-2 border-[#161616]">
      <Reveal>
        <div className="border-b-2 border-[#161616] px-6 py-4 md:px-12">
          <h2 className={`${display.className} text-2xl uppercase md:text-4xl`}>
            05 / Personnel
          </h2>
        </div>
      </Reveal>
      <div className="grid grid-cols-2 gap-px bg-[#161616]/30 md:grid-cols-3 lg:grid-cols-6">
        {GYM_COACHES.map((coach, index) => (
          <Reveal key={coach.name} delay={index * 60} className="h-full">
            <Link href={coach.href} className="group block h-full bg-[#e8e6e0]">
              <div className="relative aspect-[3/4]">
                <Image
                  src={coach.image}
                  alt={`${coach.name} — ${coach.specialty}`}
                  fill
                  sizes="(min-width: 768px) 17vw, 50vw"
                  className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                />
              </div>
              <div className="border-t-2 border-[#161616] p-3">
                <h3 className="text-sm font-bold uppercase tracking-widest group-hover:text-[#f36100]">
                  {coach.name}
                </h3>
                <p className="mt-0.5 text-[0.6rem] uppercase tracking-[0.18em] text-[#161616]/60">
                  {coach.specialty}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#e8e6e0]">
      <div className="grid md:grid-cols-2">
        <div className="border-b-2 border-[#161616] p-6 md:border-b-0 md:border-r-2 md:p-12">
          <h2 className={`${display.className} text-4xl uppercase leading-tight md:text-6xl`}>
            Come and
            <br />
            clock in.
          </h2>
        </div>
        <div className="flex flex-col justify-between p-6 text-xs uppercase tracking-widest md:p-12">
          <div className="space-y-3">
            <p className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-[#f36100]" />
              {CONTACT.address}
            </p>
            <a href={CONTACT.phoneHref} className="block hover:underline">
              {CONTACT.phone}
            </a>
            <a href={CONTACT.emailHref} className="block hover:underline">
              {CONTACT.email}
            </a>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon className="size-5 hover:text-[#f36100]" />
            </a>
            <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FacebookIcon className="size-5 hover:text-[#f36100]" />
            </a>
            <span className="ml-auto text-[0.6rem] text-[#161616]/50">
              © {new Date().getFullYear()} Foundry Gym — fictional demo · Layout 2
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

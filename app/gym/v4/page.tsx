import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Alfa_Slab_One, Libre_Franklin } from "next/font/google";
import { MapPin, Star } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { ChampCalendar } from "@/components/layouts/schedule/ChampCalendar";
import {
  CONTACT,
  GYM_CLASSES,
  GYM_COACHES,
  GYM_PLANS,
} from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Gym Layout 4 — Champ",
  robots: { index: false },
};

const display = Alfa_Slab_One({ subsets: ["latin"], weight: "400" });
const body = Libre_Franklin({ subsets: ["latin"], weight: ["400", "600", "800"] });

const CREAM = "#f3ead9";
const NAVY = "#1d2b4f";
const RED = "#b3322b";

const DOTS: React.CSSProperties = {
  backgroundImage: "radial-gradient(rgba(29,43,79,0.18) 1px, transparent 1.5px)",
  backgroundSize: "14px 14px",
};

export default function ChampLayout() {
  return (
    <div className={`${body.className} min-h-dvh`} style={{ backgroundColor: CREAM, color: NAVY }}>
      <Nav />
      <Hero />
      <FightCard />
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
    <header className="sticky top-0 z-50 border-b-4" style={{ backgroundColor: CREAM, borderColor: NAVY }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-10">
        <Link href="/" className={`${display.className} text-xl uppercase`} style={{ color: RED }}>
          Champ&rsquo;s Club
        </Link>
        <nav className="hidden gap-8 text-xs font-extrabold uppercase tracking-[0.2em] md:flex">
          <a href="#card" className="hover:underline">Fight card</a>
          <a href="#bell" className="hover:underline">Bell times</a>
          <a href="#purse" className="hover:underline">The purse</a>
          <a href="#corner" className="hover:underline">Cornermen</a>
        </nav>
        <a
          href="#purse"
          className="rounded-full border-2 px-5 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-white transition-transform hover:-rotate-2"
          style={{ backgroundColor: RED, borderColor: NAVY }}
        >
          Sign up
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b-4 py-20 md:py-28" style={{ borderColor: NAVY, ...DOTS }}>
      <div className="mx-auto max-w-5xl px-5 text-center md:px-10">
        <Reveal>
          <p className="flex items-center justify-center gap-3 text-xs font-extrabold uppercase tracking-[0.35em]">
            <Star className="size-4 fill-current" style={{ color: RED }} />
            Island Athletic Club · Est. 2015
            <Star className="size-4 fill-current" style={{ color: RED }} />
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h1 className={`${display.className} mt-8 text-6xl uppercase leading-[0.95] md:text-[7.5rem]`}>
            The main
            <br />
            <span style={{ color: RED }}>event</span> is you
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p className="mx-auto mt-8 max-w-xl text-base font-semibold leading-relaxed" style={{ color: `${NAVY}cc` }}>
            One night only — every night. Cross-training, conditioning, heavy
            bags and heavier barbells. Step into the ring at the island&rsquo;s
            biggest training floor.
          </p>
        </Reveal>
        <Reveal delay={360}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#card"
              className="rounded-full border-4 px-8 py-4 text-sm font-extrabold uppercase tracking-[0.15em] text-white shadow-[6px_6px_0_0] shadow-[#1d2b4f] transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: RED, borderColor: NAVY }}
            >
              See the card
            </a>
            <a
              href={CONTACT.phoneHref}
              className="rounded-full border-4 px-8 py-4 text-sm font-extrabold uppercase tracking-[0.15em] shadow-[6px_6px_0_0] shadow-[#1d2b4f] transition-transform hover:-translate-y-0.5"
              style={{ borderColor: NAVY, backgroundColor: CREAM }}
            >
              Ringside: {CONTACT.phone}
            </a>
          </div>
        </Reveal>
        <Reveal delay={480}>
          <div className="relative mx-auto mt-16 max-w-3xl rotate-1 border-4 shadow-[10px_10px_0_0] shadow-[#b3322b]" style={{ borderColor: NAVY }}>
            <Image
              src="/img/layouts/gym-bodybuilder.jpg"
              alt="Posing under the lights at Champ&rsquo;s"
              width={1600}
              height={1067}
              priority
              sizes="(min-width: 768px) 48rem, 100vw"
              className="w-full object-cover sepia-[0.25]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FightCard() {
  return (
    <section id="card" className="border-b-4 py-24" style={{ borderColor: NAVY }}>
      <div className="mx-auto max-w-5xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-center text-5xl uppercase md:text-7xl`}>
            Tonight<span style={{ color: RED }}>s</span> card
          </h2>
          <p className="mt-3 text-center text-xs font-extrabold uppercase tracking-[0.3em]" style={{ color: RED }}>
            ★ All bouts coached · all levels welcome ★
          </p>
        </Reveal>
        <div className="mt-14 space-y-6">
          {GYM_CLASSES.map((item, index) => (
            <Reveal key={item.name} delay={index * 70}>
              <Link
                href={item.href}
                className="group flex flex-wrap items-center justify-between gap-4 border-b-2 border-dashed pb-6"
                style={{ borderColor: `${NAVY}66` }}
              >
                <div className="flex items-center gap-5">
                  <span className={`${display.className} text-3xl`} style={{ color: RED }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className={`${display.className} text-2xl uppercase transition-colors md:text-4xl group-hover:[color:#b3322b]`}>
                      {item.name}
                    </h3>
                    <p className="mt-1 max-w-xl text-sm font-semibold" style={{ color: `${NAVY}b3` }}>
                      {item.detail}
                    </p>
                  </div>
                </div>
                {item.coach && (
                  <span
                    className="rounded-full border-2 px-4 py-1.5 text-[0.65rem] font-extrabold uppercase tracking-[0.2em]"
                    style={{ borderColor: NAVY }}
                  >
                    vs. Coach {item.coach}
                  </span>
                )}
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Schedule() {
  return (
    <section id="bell" className="border-b-4 py-24" style={{ borderColor: NAVY }}>
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-center text-5xl uppercase md:text-6xl`}>
            Bell times
          </h2>
          <p className="mt-3 text-center text-xs font-extrabold uppercase tracking-[0.3em]" style={{ color: RED }}>
            ★ The full month of bouts ★
          </p>
        </Reveal>
        <div className="mt-12">
          <Reveal delay={120}>
            <ChampCalendar displayClass={display.className} />
          </Reveal>
        </div>
        <p className="mt-8 text-center text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: `${NAVY}99` }}>
          Every bout recurs weekly — search the card above
        </p>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="purse" className="border-b-4 py-24" style={{ borderColor: NAVY, ...DOTS }}>
      <div className="mx-auto max-w-4xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-center text-5xl uppercase md:text-7xl`}>
            The purse
          </h2>
          <p className="mt-3 text-center text-xs font-extrabold uppercase tracking-[0.3em]" style={{ color: RED }}>
            Gym access · Thai Baht · no contracts
          </p>
        </Reveal>
        <Reveal delay={150}>
          <div className="mt-12 border-4 bg-white/60 p-8 shadow-[10px_10px_0_0] shadow-[#1d2b4f] md:p-12" style={{ borderColor: NAVY }}>
            {GYM_PLANS.map((plan) => (
              <div
                key={plan.name}
                className="flex items-baseline gap-3 py-3 text-sm font-extrabold uppercase tracking-wide md:text-base"
              >
                <span className={plan.featured ? "" : undefined} style={plan.featured ? { color: RED } : undefined}>
                  {plan.name}
                  {plan.note ? ` · ${plan.note}` : ""}
                </span>
                <span className="flex-1 border-b-2 border-dotted" style={{ borderColor: `${NAVY}80` }} />
                <span className={`${display.className} text-xl md:text-2xl`} style={plan.featured ? { color: RED } : undefined}>
                  ฿{plan.price.toLocaleString()}
                </span>
              </div>
            ))}
            <div className="mt-8 text-center">
              <a
                href="#corner"
                className="inline-block rounded-full border-4 px-8 py-3 text-xs font-extrabold uppercase tracking-[0.2em] text-white transition-transform hover:rotate-1"
                style={{ backgroundColor: RED, borderColor: NAVY }}
              >
                Meet the cornermen →
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Coaches() {
  return (
    <section id="corner" className="border-b-4 py-24" style={{ borderColor: NAVY }}>
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-center text-5xl uppercase md:text-7xl`}>
            Your corner<span style={{ color: RED }}>men</span>
          </h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {GYM_COACHES.map((coach, index) => (
            <Reveal key={coach.name} delay={index * 70}>
              <Link
                href={coach.href}
                className="group block border-4 bg-white p-2 shadow-[6px_6px_0_0] shadow-[#1d2b4f] transition-transform hover:-translate-y-1 hover:rotate-1"
                style={{ borderColor: NAVY }}
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={coach.image}
                    alt={`${coach.name} — ${coach.specialty}`}
                    fill
                    sizes="(min-width: 768px) 17vw, 50vw"
                    className="object-cover sepia-[0.3] transition-all group-hover:sepia-0"
                  />
                </div>
                <p className={`${display.className} mt-2 text-center text-sm uppercase`}>
                  {coach.name}
                </p>
                <p className="pb-1 text-center text-[0.55rem] font-extrabold uppercase tracking-[0.15em]" style={{ color: RED }}>
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
    <footer className="py-16 text-white" style={{ backgroundColor: RED }}>
      <div className="mx-auto max-w-5xl px-5 text-center md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-4xl uppercase md:text-6xl`}>
            Answer the bell.
          </h2>
        </Reveal>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-extrabold uppercase tracking-wide">
          <span className="flex items-center gap-2">
            <MapPin className="size-4" />
            {CONTACT.address}
          </span>
          <a href={CONTACT.phoneHref} className="hover:underline">
            {CONTACT.phone}
          </a>
          <span className="flex items-center gap-4">
            <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon className="size-5" />
            </a>
            <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FacebookIcon className="size-5" />
            </a>
          </span>
        </div>
        <p className="mt-10 text-[0.65rem] font-extrabold uppercase tracking-[0.3em] text-white/70">
          © {new Date().getFullYear()} Champ&rsquo;s Athletic Club — fictional demo · Layout 4
        </p>
      </div>
    </footer>
  );
}

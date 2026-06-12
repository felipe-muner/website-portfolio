import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Cinzel, EB_Garamond } from "next/font/google";
import { MapPin, Moon, Sparkles, Star } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { MoonlightConstellation } from "@/components/layouts/schedule/MoonlightConstellation";
import {
  CLASS_PLANS,
  CONTACT,
  YOGA_CLASSES,
  YOGA_COACHES,
} from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Yoga Layout 5 — Moonlight",
  robots: { index: false },
};

const display = Cinzel({ subsets: ["latin"], weight: ["400", "500", "700"] });
const body = EB_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"] });

const NIGHT = "#141627";
const DEEP = "#1d2038";
const GOLD = "#d8b56c";
const MIST = "#aab0d0";

// Unique imagery for this layout (public/img/layouts).
const PRACTICE_IMAGES = [
  "/img/layouts/breathwork-group.jpg",
  "/img/layouts/yoga-meditation-studio.jpg",
  "/img/layouts/yoga-fold-bw.jpg",
  "/img/layouts/mobility-ball.jpg",
  "/img/layouts/yoga-backbend.jpg",
  "/img/layouts/yoga-palm-silhouette.jpg",
];

const STARS: React.CSSProperties = {
  backgroundImage:
    "radial-gradient(rgba(216,181,108,0.4) 0.8px, transparent 1.2px), radial-gradient(rgba(170,176,208,0.25) 0.8px, transparent 1.2px)",
  backgroundSize: "90px 90px, 55px 55px",
  backgroundPosition: "0 0, 30px 40px",
};

export default function MoonlightLayout() {
  return (
    <div className={`${body.className} text-lg`} style={{ backgroundColor: NIGHT, color: "#ece8dd" }}>
      <Nav />
      <Hero />
      <Ritual />
      <Practices />
      <Schedule />
      <Pricing />
      <Teachers />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function GoldRule() {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="h-px w-14" style={{ backgroundColor: `${GOLD}80` }} />
      <Star className="size-3 fill-current" style={{ color: GOLD }} />
      <span className="h-px w-14" style={{ backgroundColor: `${GOLD}80` }} />
    </div>
  );
}

function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 md:px-10">
        <Link href="/" className={`${display.className} flex items-center gap-2 text-lg tracking-[0.15em]`} style={{ color: GOLD }}>
          <Moon className="size-4" />
          NOCTURNE
        </Link>
        <nav className="hidden gap-8 text-xs uppercase tracking-[0.3em] text-[#ece8dd]/60 md:flex">
          <a href="#ritual" className="hover:text-[#d8b56c]">The ritual</a>
          <a href="#practices" className="hover:text-[#d8b56c]">Practices</a>
          <a href="#evenings" className="hover:text-[#d8b56c]">Evenings</a>
          <a href="#passes" className="hover:text-[#d8b56c]">Passes</a>
        </nav>
        <a
          href="#passes"
          className="border px-6 py-2.5 text-xs uppercase tracking-[0.25em] transition-colors hover:bg-[#d8b56c] hover:text-[#141627]"
          style={{ borderColor: GOLD, color: GOLD }}
        >
          Reserve
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-dvh items-center justify-center overflow-hidden text-center" style={STARS}>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-24 size-40 -translate-x-1/2 rounded-full md:size-52"
        style={{
          background: `radial-gradient(circle, ${GOLD} 0%, ${GOLD}26 60%, transparent 75%)`,
          filter: "blur(2px)",
          opacity: 0.5,
        }}
      />
      <div className="relative mx-auto max-w-3xl px-5 pt-24">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.45em]" style={{ color: MIST }}>
            Evening practice · On the island
          </p>
        </Reveal>
        <Reveal delay={140}>
          <h1 className={`${display.className} mt-8 text-5xl leading-[1.1] md:text-7xl`}>
            When the heat
            <br />
            of the day <span style={{ color: GOLD }}>settles</span>,
            <br />
            the practice begins.
          </h1>
        </Reveal>
        <Reveal delay={280}>
          <p className="mx-auto mt-8 max-w-xl italic leading-relaxed text-[#ece8dd]/70">
            Candle-lit flows, slow breath, and the bright cold of the ice bath
            under an island sky — the Nocturne studio after sundown.
          </p>
        </Reveal>
        <Reveal delay={400}>
          <div className="mt-10">
            <GoldRule />
            <div className="mt-8 flex flex-wrap justify-center gap-5">
              <a
                href="#practices"
                className="px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#141627] transition-opacity hover:opacity-90"
                style={{ backgroundColor: GOLD }}
              >
                The night practices
              </a>
              <a
                href="#ritual"
                className="border border-[#ece8dd]/30 px-8 py-4 text-xs uppercase tracking-[0.3em] text-[#ece8dd]/80 transition-colors hover:border-[#d8b56c] hover:text-[#d8b56c]"
              >
                The ritual
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Ritual() {
  const steps = [
    { time: "18:00", title: "Arrive & soften", text: "Leave the day at the door. The studio is lit low, the mats are out." },
    { time: "18:15", title: "Breathe", text: "Guided breathwork to down-shift the nervous system, round by round." },
    { time: "19:00", title: "The plunge", text: "Three minutes in the ice. The mind goes quiet; everything else gets loud." },
    { time: "19:30", title: "Steam & tea", text: "Warm up slowly in the steam room and close the evening together." },
  ];
  return (
    <section id="ritual" className="py-24 md:py-32" style={{ backgroundColor: DEEP }}>
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-center text-4xl md:text-5xl`}>
            The Saturday <span style={{ color: GOLD }}>ritual</span>
          </h2>
          <p className="mt-4 text-center text-xs uppercase tracking-[0.35em]" style={{ color: MIST }}>
            Breathwork &amp; ice bath
          </p>
        </Reveal>
        <div className="mt-16 grid gap-10 md:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 100}>
              <div className="relative text-center md:text-left">
                <p className={`${display.className} text-3xl`} style={{ color: GOLD }}>
                  {step.time}
                </p>
                <span className="mx-auto mt-4 block h-px w-10 md:mx-0" style={{ backgroundColor: `${GOLD}66` }} />
                <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-base italic leading-relaxed text-[#ece8dd]/60">
                  {step.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={300}>
          <p className="mt-14 text-center">
            <a
              href="#ritual"
              className="text-xs uppercase tracking-[0.3em] underline underline-offset-8"
              style={{ color: GOLD }}
            >
              About breathwork &amp; ice bath →
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Practices() {
  return (
    <section id="practices" className="mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <h2 className={`${display.className} text-center text-4xl md:text-5xl`}>
          Practices by <span style={{ color: GOLD }}>candlelight</span>
        </h2>
        <div className="mt-6">
          <GoldRule />
        </div>
      </Reveal>
      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {YOGA_CLASSES.map((item, index) => (
          <Reveal key={item.name} delay={index * 80} className="h-full">
            <Link
              href={item.href}
              className="group flex h-full flex-col border border-[#ece8dd]/15 p-3 transition-colors hover:border-[#d8b56c]"
            >
              <div className="relative aspect-[5/4] overflow-hidden">
                <Image
                  src={PRACTICE_IMAGES[index % PRACTICE_IMAGES.length]}
                  alt={item.name}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                  className="object-cover brightness-[0.65] saturate-[0.8] transition-all duration-700 group-hover:scale-105 group-hover:brightness-90"
                />
                <Sparkles className="absolute right-3 top-3 size-4" style={{ color: GOLD }} />
              </div>
              <div className="flex flex-1 flex-col p-5 text-center">
                <h3 className={`${display.className} text-xl transition-colors group-hover:[color:#d8b56c]`}>
                  {item.name}
                </h3>
                {item.coach && (
                  <p className="mt-1 text-[0.65rem] uppercase tracking-[0.3em]" style={{ color: MIST }}>
                    {item.coach}
                  </p>
                )}
                <p className="mt-3 flex-1 text-base italic leading-relaxed text-[#ece8dd]/60">
                  {item.detail}
                </p>
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
    <section id="evenings" className="py-24 md:py-32" style={{ backgroundColor: DEEP, ...STARS }}>
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-center text-4xl md:text-5xl`}>
            The week&rsquo;s <span style={{ color: GOLD }}>constellation</span>
          </h2>
        </Reveal>
        <div className="mt-14">
          <Reveal delay={100}>
            <MoonlightConstellation displayClass={display.className} />
          </Reveal>
        </div>
        <p className="mt-10 text-center text-sm italic text-[#ece8dd]/50">
          A representative sky — each night recurs weekly
        </p>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="passes" className="mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <h2 className={`${display.className} text-center text-4xl md:text-5xl`}>
          Passes for <span style={{ color: GOLD }}>night owls</span>
        </h2>
        <p className="mt-4 text-center text-xs uppercase tracking-[0.35em]" style={{ color: MIST }}>
          and early birds — Thai Baht
        </p>
      </Reveal>
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CLASS_PLANS.map((plan, index) => (
          <Reveal key={plan.name} delay={index * 80} className="h-full">
            <div
              className={`relative flex h-full flex-col items-center border p-8 text-center ${
                plan.featured ? "" : "border-[#ece8dd]/15"
              }`}
              style={plan.featured ? { borderColor: GOLD, backgroundColor: `${GOLD}14` } : undefined}
            >
              {plan.featured && (
                <span
                  className="absolute -top-3 px-3 text-[0.6rem] uppercase tracking-[0.3em]"
                  style={{ backgroundColor: NIGHT, color: GOLD }}
                >
                  Most loved
                </span>
              )}
              <h3 className="text-xs uppercase tracking-[0.3em]" style={{ color: MIST }}>
                {plan.name}
              </h3>
              <p className={`${display.className} mt-6 text-4xl`} style={{ color: GOLD }}>
                ฿{plan.price.toLocaleString()}
              </p>
              <p className="mt-1 text-sm italic text-[#ece8dd]/50">per {plan.unit}</p>
              <p className="mt-auto pt-8 text-sm italic text-[#ece8dd]/70">
                {plan.note ?? "Every studio class included"}
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
    <section className="py-24 md:py-32" style={{ backgroundColor: DEEP }}>
      <div className="mx-auto max-w-5xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-center text-4xl md:text-5xl`}>
            Keepers of the <span style={{ color: GOLD }}>flame</span>
          </h2>
        </Reveal>
        <div className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {YOGA_COACHES.map((coach, index) => (
            <Reveal key={coach.name} delay={index * 90}>
              <Link href={coach.href} className="group block text-center">
                <div className="relative mx-auto w-fit p-2">
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full border transition-colors group-hover:border-[#d8b56c]"
                    style={{ borderColor: `${GOLD}4d` }}
                  />
                  <div className="relative size-32 overflow-hidden rounded-full md:size-40">
                    <Image
                      src={coach.image}
                      alt={`${coach.name} — ${coach.specialty}`}
                      fill
                      sizes="160px"
                      className="object-cover brightness-90 transition-all duration-700 group-hover:brightness-105"
                    />
                  </div>
                </div>
                <h3 className={`${display.className} mt-5 text-xl`}>{coach.name}</h3>
                <p className="mt-1 text-[0.6rem] uppercase tracking-[0.3em]" style={{ color: GOLD }}>
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
    <footer className="py-16 text-center" style={STARS}>
      <div className="mx-auto max-w-4xl px-5">
        <Reveal>
          <Moon className="mx-auto size-7" style={{ color: GOLD }} />
          <p className={`${display.className} mt-6 text-3xl md:text-4xl`}>
            The studio is lit. <span style={{ color: GOLD }}>Come in.</span>
          </p>
        </Reveal>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-base italic text-[#ece8dd]/60">
          <span className="flex items-center gap-2">
            <MapPin className="size-4" style={{ color: GOLD }} />
            {CONTACT.address}
          </span>
          <a href={CONTACT.phoneHref} className="hover:text-[#d8b56c]">{CONTACT.phone}</a>
          <a href={CONTACT.emailHref} className="hover:text-[#d8b56c]">{CONTACT.email}</a>
        </div>
        <div className="mt-6 flex items-center justify-center gap-5">
          <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <InstagramIcon className="size-5 hover:text-[#d8b56c]" />
          </a>
          <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FacebookIcon className="size-5 hover:text-[#d8b56c]" />
          </a>
        </div>
        <p className="mt-10 text-[0.65rem] uppercase tracking-[0.35em] text-[#ece8dd]/30">
          © {new Date().getFullYear()} Nocturne Yoga — fictional demo · Layout 5
        </p>
      </div>
    </footer>
  );
}

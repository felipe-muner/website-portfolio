import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import { Leaf, MapPin, Moon, Phone, Sparkles, Sprout, Wind } from "lucide-react";
import { InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { SlotBooking, type SlotOption } from "@/components/layouts/SlotBooking";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Business Layout — Sati Retreat",
  robots: { index: false },
};

const display = Fraunces({ subsets: ["latin"], weight: ["400", "500"], style: ["normal", "italic"] });
const body = Hanken_Grotesk({ subsets: ["latin"], weight: ["300", "400", "600"] });

const LINEN = "#f0ebe0";
const INK = "#2c2a20";
const SAGE = "#6f7d59";
const CLAY = "#b07350";

const PROGRAMS: readonly (SlotOption & { image: string; nights: string })[] = [
  { slug: "reset", name: "3-Day Reset", sub: "A gentle unwind — yoga, massage, clean food and sleep.", price: 12500, image: "/img/layouts/retreat-1.jpg", nights: "3 nights" },
  { slug: "detox", name: "7-Day Detox", sub: "Juice fasting, daily colonics, breathwork and jungle walks.", price: 32000, image: "/img/layouts/retreat-4.jpg", nights: "7 nights" },
  { slug: "deep", name: "10-Day Deep Cleanse", sub: "Our full reset — fasting, therapy, sound healing and coaching.", price: 46000, image: "/img/layouts/retreat-5.jpg", nights: "10 nights" },
  { slug: "yoga", name: "Yoga & Silence", sub: "Twice-daily practice, meditation and two silent days.", price: 24000, image: "/img/layouts/retreat-2.jpg", nights: "5 nights" },
];

const PILLARS = [
  { icon: Sprout, title: "Nourish", body: "Cold-pressed juices, living food and herbal teas prepared by our wellness kitchen." },
  { icon: Wind, title: "Cleanse", body: "Guided fasting, breathwork and daily detox therapies, supervised with care." },
  { icon: Moon, title: "Rest", body: "Open-air rooms in the jungle, no wifi in the villas, and sleep you'd forgotten was possible." },
  { icon: Sparkles, title: "Restore", body: "Massage, sound baths and one-to-one coaching to carry the calm back home." },
];

export default function RetreatLayout() {
  return (
    <div className={body.className} style={{ backgroundColor: LINEN, color: INK }}>
      <Nav />
      <Hero />
      <Pillars />
      <Programs />
      <Booking />
      <Quote />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b" style={{ borderColor: `${INK}12`, backgroundColor: `${LINEN}e6`, backdropFilter: "blur(8px)" }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-10">
        <Link href="/" className={`${display.className} flex items-center gap-2 text-2xl italic`}>
          <Leaf className="size-5" style={{ color: SAGE }} /> Sati
        </Link>
        <nav className="hidden gap-8 text-sm font-semibold md:flex" style={{ color: `${INK}a6` }}>
          <a href="#pillars" className="hover:text-[#6f7d59]">The practice</a>
          <a href="#programs" className="hover:text-[#6f7d59]">Programs</a>
          <a href="#book" className="hover:text-[#6f7d59]">Book</a>
        </nav>
        <a href="#book" className="px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: SAGE, borderRadius: "999px" }}>
          Reserve your stay
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden pt-16">
      <Image src="/img/layouts/retreat-4.jpg" alt="A wellness retreat in the jungle" fill priority sizes="100vw" className="animate-landing-kenburns object-cover" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(115deg, ${INK}e0, ${INK}44 55%, transparent)` }} />
      <div className="relative mx-auto w-full max-w-6xl px-5 text-white md:px-10">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.4em]" style={{ color: "#cdd6b8" }}>
            Detox · yoga · wellness retreat
          </p>
        </Reveal>
        <Reveal delay={140}>
          <h1 className={`${display.className} mt-5 max-w-3xl text-6xl leading-[1.02] md:text-8xl`}>
            Come back to
            <em style={{ color: "#cdd6b8" }}> yourself.</em>
          </h1>
        </Reveal>
        <Reveal delay={280}>
          <p className="mt-6 max-w-lg text-lg font-light leading-relaxed text-white/85">
            A quiet jungle sanctuary for fasting, cleansing and rest. Structured
            programs, warm guidance and nothing to do but heal.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#programs" className="px-8 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: SAGE, borderRadius: "999px" }}>
              Explore programs
            </a>
            <a href="#book" className="border border-white/40 px-8 py-4 text-sm font-semibold transition-colors hover:bg-white/10" style={{ borderRadius: "999px" }}>
              Check availability
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Pillars() {
  return (
    <section id="pillars" className="mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-28">
      <Reveal>
        <h2 className={`${display.className} mb-12 max-w-2xl text-4xl leading-tight md:text-6xl`}>
          Four days or ten, the rhythm is the same
        </h2>
      </Reveal>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((p, i) => (
          <Reveal key={p.title} delay={i * 80}>
            <div className="flex h-full flex-col">
              <div className="flex size-12 items-center justify-center rounded-full" style={{ backgroundColor: `${CLAY}1f` }}>
                <p.icon className="size-6" style={{ color: CLAY }} />
              </div>
              <h3 className={`${display.className} mt-5 text-2xl italic`}>{p.title}</h3>
              <p className="mt-2 text-base font-light leading-relaxed" style={{ color: `${INK}a6` }}>{p.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Programs() {
  return (
    <section id="programs" className="py-24 md:py-28" style={{ backgroundColor: "#fff" }}>
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} mb-12 text-4xl md:text-6xl`}>Choose your program</h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {PROGRAMS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80} className="h-full">
              <div className="group flex h-full overflow-hidden rounded-3xl" style={{ border: `1px solid ${INK}12` }}>
                <div className="relative w-2/5 shrink-0 overflow-hidden">
                  <Image src={p.image} alt={p.name} fill sizes="20vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: CLAY }}>{p.nights}</span>
                  <h3 className={`${display.className} mt-1 text-2xl`}>{p.name}</h3>
                  <p className="mt-2 flex-1 text-sm font-light" style={{ color: `${INK}a6` }}>{p.sub}</p>
                  <p className={`${display.className} mt-3 text-2xl italic`} style={{ color: SAGE }}>
                    ฿{p.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Booking() {
  return (
    <section id="book" className="mx-auto max-w-5xl px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <h2 className={`${display.className} text-4xl md:text-5xl`}>Reserve your stay</h2>
        <p className="mt-3 max-w-md text-base font-light" style={{ color: `${INK}a6` }}>
          Choose a program, a start date and your room. We&rsquo;ll send an
          intake form and a call before you arrive.
        </p>
      </Reveal>
      <Reveal delay={120}>
        <div className="mt-10">
          <SlotBooking
            options={PROGRAMS}
            displayClass={display.className}
            pickerLabel="Choose your program"
            priceUnit="per person"
            variants={{ label: "Room", items: ["Shared", "Private garden", "Private pool villa"] }}
            ctaLabel="Request this retreat"
            note="Deposit secures your place; balance on arrival."
            theme={{ accent: SAGE, accentText: "#ffffff", text: INK, muted: `${INK}99`, surface: LINEN, border: `${INK}1f`, radius: "16px" }}
          />
        </div>
      </Reveal>
    </section>
  );
}

function Quote() {
  return (
    <section className="py-24 md:py-28" style={{ backgroundColor: SAGE }}>
      <div className="mx-auto max-w-3xl px-5 text-center text-white md:px-10">
        <Reveal>
          <p className={`${display.className} text-3xl italic leading-snug md:text-4xl`}>
            &ldquo;I arrived exhausted and left lighter than I&rsquo;ve felt in
            years. The kindest week I&rsquo;ve ever given myself.&rdquo;
          </p>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
            — a very restored demo guest
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ backgroundColor: INK }}>
      <div className="mx-auto max-w-6xl px-5 py-16 text-white md:px-10">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div>
            <p className={`${display.className} flex items-center gap-2 text-3xl italic`}>
              <Leaf className="size-7" style={{ color: "#cdd6b8" }} /> Sati Retreat
            </p>
            <p className="mt-3 max-w-sm font-light text-white/60">A jungle sanctuary for fasting, yoga and deep rest.</p>
          </div>
          <div className="space-y-2 text-sm text-white/80">
            <p className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0" style={{ color: "#cdd6b8" }} />{CONTACT.address}</p>
            <a href={CONTACT.phoneHref} className="flex items-center gap-2 hover:text-white"><Phone className="size-4" style={{ color: "#cdd6b8" }} />{CONTACT.phone}</a>
            <a href={CONTACT.instagram} className="flex items-center gap-2 hover:text-white"><InstagramIcon className="size-4" />{CONTACT.instagramHandle}</a>
          </div>
        </div>
        <p className="mt-12 text-xs uppercase tracking-[0.25em] text-white/40">
          © {new Date().getFullYear()} Sati Retreat — fictional demo · Wellness-retreat layout
        </p>
      </div>
    </footer>
  );
}

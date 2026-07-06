import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Syne, Inter } from "next/font/google";
import { Flame, MapPin, Moon, Music, Phone, Ticket } from "lucide-react";
import { InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { MoonEventBoard } from "@/components/layouts/MoonEventBoard";
import { MOON_EVENTS } from "@/lib/layouts/schedule";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Business Layout — Lantern Beach Sessions",
  robots: { index: false },
};

const display = Syne({ subsets: ["latin"], weight: ["600", "700", "800"] });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

const NIGHT = "#0b0916";
const DEEP = "#141127";
const LIME = "#c6ff4d";
const MAGENTA = "#ff3da6";
const SILVER = "#ece9f6";

const INFO = [
  { icon: Moon, title: "Every full moon", body: "The big one lands on the full-moon night — sunrise sets, fire artists and headline acts on the sand." },
  { icon: Flame, title: "Fire & lanterns", body: "Poi, fire-breathers and a sky full of lanterns between the DJ sets — arrive at dusk for the show." },
  { icon: Ticket, title: "Wristband entry", body: "A single wristband gets you the whole night. Grab one at the gate or any beach bar on the strip." },
];

export default function FullMoonLayout() {
  return (
    <div className={body.className} style={{ backgroundColor: NIGHT, color: SILVER }}>
      <Nav />
      <Hero />
      <Info />
      <Calendar />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10" style={{ backgroundColor: `${NIGHT}d9`, backdropFilter: "blur(8px)" }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-10">
        <Link href="/" className={`${display.className} flex items-center gap-2 text-lg font-extrabold`}>
          <Moon className="size-5" style={{ color: LIME }} /> LANTERN
        </Link>
        <nav className="hidden gap-8 text-sm font-semibold md:flex" style={{ color: "#ece9f6aa" }}>
          <a href="#info" className="hover:text-white">The night</a>
          <a href="#calendar" className="hover:text-white">Line-up</a>
          <a href="#find" className="hover:text-white">Find us</a>
        </nav>
        <a href="#calendar" className="px-5 py-2.5 text-sm font-bold transition-transform hover:-translate-y-0.5" style={{ background: `linear-gradient(90deg, ${LIME}, ${MAGENTA})`, color: NIGHT, borderRadius: "999px" }}>
          See the line-up
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-dvh items-end overflow-hidden pt-16">
      <Image src="/img/layouts/fullmoon-1.jpg" alt="A beach bonfire at night" fill priority sizes="100vw" className="animate-landing-kenburns object-cover opacity-70" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${NIGHT}, ${NIGHT}77 45%, ${NIGHT}33)` }} />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 md:px-10">
        <Reveal>
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.3em]" style={{ color: LIME }}>
            <Music className="size-4" /> Beach party series · by moonlight
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h1 className={`${display.className} mt-4 text-6xl font-extrabold leading-[0.9] md:text-9xl`}>
            Dance till the
            <span className="block" style={{ background: `linear-gradient(90deg, ${LIME}, ${MAGENTA})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              moon sets.
            </span>
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-white/15 pt-6">
            <p className="max-w-md text-base leading-relaxed text-white/80">
              A roaming beach-party series that follows the lunar calendar —
              sunset sessions, jungle bass and one enormous full-moon night
              every month. Real moon phases below.
            </p>
            <a href="#calendar" className="px-7 py-3.5 text-sm font-bold transition-transform hover:-translate-y-0.5" style={{ background: `linear-gradient(90deg, ${LIME}, ${MAGENTA})`, color: NIGHT, borderRadius: "999px" }}>
              When&rsquo;s the next one?
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Info() {
  return (
    <section id="info" className="mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-28">
      <div className="grid gap-6 md:grid-cols-3">
        {INFO.map((it, i) => (
          <Reveal key={it.title} delay={i * 90}>
            <div className="flex h-full flex-col rounded-3xl p-8" style={{ background: `linear-gradient(160deg, ${DEEP}, ${NIGHT})`, border: "1px solid #ffffff14" }}>
              <it.icon className="size-8" style={{ color: LIME }} />
              <h3 className={`${display.className} mt-5 text-2xl font-bold`}>{it.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-white/70">{it.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Calendar() {
  return (
    <section id="calendar" className="py-24 md:py-28" style={{ background: `linear-gradient(180deg, ${NIGHT}, ${DEEP})` }}>
      <div className="mx-auto max-w-4xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-4xl font-extrabold md:text-6xl`}>The moon calendar</h2>
          <p className="mt-3 max-w-lg text-base text-white/70">
            One real moon per night. Tap a moon to see what&rsquo;s on — the
            full moon is where the whole island shows up.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-10">
            <MoonEventBoard
              week={MOON_EVENTS}
              displayClass={display.className}
              theme={{
                accent: LIME,
                accentText: NIGHT,
                dark: "#241f3d",
                text: SILVER,
                muted: "#ece9f699",
                selectedRing: "#ffffff12",
                surface: DEEP,
                border: "#ffffff1f",
                radius: "14px",
              }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="find" style={{ backgroundColor: DEEP }}>
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-10">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div>
            <p className={`${display.className} flex items-center gap-2 text-3xl font-extrabold`}>
              <Moon className="size-7" style={{ color: LIME }} /> Lantern Beach Sessions
            </p>
            <p className="mt-3 max-w-sm text-white/60">Follow us for the location drop — the beach changes with the tide and the crowd.</p>
          </div>
          <div className="space-y-2 text-sm text-white/80">
            <p className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0" style={{ color: LIME }} />{CONTACT.address}</p>
            <a href={CONTACT.phoneHref} className="flex items-center gap-2 hover:text-white"><Phone className="size-4" style={{ color: LIME }} />{CONTACT.phone}</a>
            <a href={CONTACT.instagram} className="flex items-center gap-2 hover:text-white"><InstagramIcon className="size-4" />{CONTACT.instagramHandle}</a>
          </div>
        </div>
        <p className="mt-12 text-xs uppercase tracking-[0.25em] text-white/40">
          © {new Date().getFullYear()} Lantern Beach Sessions — fictional demo · Events layout
        </p>
      </div>
    </footer>
  );
}

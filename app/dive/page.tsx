import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Sora } from "next/font/google";
import { Anchor, Compass, Fish, LifeBuoy, MapPin, Waves } from "lucide-react";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { MenuFinder, type MenuItem } from "@/components/layouts/MenuFinder";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Business Layout — Deep Blue Dive Co.",
  robots: { index: false },
};

const sora = Sora({ subsets: ["latin"], weight: ["300", "400", "700"] });

const ABYSS = "#04263b";
const REEF = "#0a4d6e";
const CYAN = "#2ed3e8";

const COURSES: readonly MenuItem[] = [
  { name: "Discover scuba", detail: "Never dived? Pool morning, reef afternoon — zero experience needed.", price: 3500, category: "Beginner", tags: ["first time", "1 day"] },
  { name: "Open Water course", detail: "Your licence to dive the world, over three island days.", price: 11900, category: "Beginner", tags: ["certification", "3 days"] },
  { name: "Advanced course", detail: "Deep, drift and night adventures — five dives, two days.", price: 9500, category: "Levels", tags: ["certification", "2 days"] },
  { name: "Rescue course", detail: "The course every diver calls the best one. Three days.", price: 10900, category: "Levels", tags: ["certification", "3 days"] },
  { name: "Fun dive (2 tanks)", detail: "Certified already? Two boat dives, guide, fruit and tea.", price: 2600, category: "Fun dives", tags: ["certified", "morning"] },
  { name: "Night dive", detail: "Torches, plankton sparkle and sleeping parrotfish.", price: 1800, category: "Fun dives", tags: ["certified", "night"] },
  { name: "Sail Rock trip", detail: "The gulf's best pinnacle — chevron barracuda guaranteed*.", price: 3900, category: "Trips", tags: ["full day", "famous"] },
  { name: "Whale-shark watch", detail: "Seasonal full-day trip chasing the gentle giant.", price: 4500, category: "Trips", tags: ["full day", "seasonal"] },
] as const;

export default function DeepBlueDive() {
  return (
    <div
      className={`${sora.className} text-white`}
      style={{ background: `linear-gradient(180deg, ${REEF} 0%, ${ABYSS} 38%, #021423 100%)` }}
    >
      <Nav />
      <Hero />
      <Courses />
      <Sites />
      <Boat />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 backdrop-blur" style={{ backgroundColor: `${ABYSS}cc` }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-10">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <Waves className="size-5" style={{ color: CYAN }} />
          Deep Blue Dive Co.
        </Link>
        <nav className="hidden gap-8 text-sm font-semibold md:flex" style={{ color: "#ffffffb3" }}>
          <a href="#courses" className="hover:text-[#2ed3e8]">Courses</a>
          <a href="#sites" className="hover:text-[#2ed3e8]">Dive sites</a>
          <a href="#boat" className="hover:text-[#2ed3e8]">The boat</a>
        </nav>
        <a
          href="#courses"
          className="rounded-full px-6 py-2.5 text-sm font-bold text-[#04263b] transition-shadow hover:shadow-[0_0_24px_rgba(46,211,232,0.5)]"
          style={{ backgroundColor: CYAN }}
        >
          Book a dive
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden pt-16">
      <Image
        src="/img/layouts/dive-fish-school.jpg"
        alt="A diver below a school of fish"
        fill
        priority
        sizes="100vw"
        className="animate-landing-kenburns object-cover opacity-50"
      />
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${REEF}33, ${ABYSS}e6)` }} />
      <div className="relative mx-auto w-full max-w-5xl px-5 text-center md:px-10">
        <Reveal>
          <p className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.35em]" style={{ color: CYAN }}>
            <Fish className="size-4" />
            5-star dive centre · est. 2012
          </p>
        </Reveal>
        <Reveal delay={140}>
          <h1 className="mt-6 text-6xl font-bold leading-[1.02] tracking-tight md:text-8xl">
            Your first breath
            <br />
            <span className="font-light italic" style={{ color: CYAN }}>
              underwater
            </span>
          </h1>
        </Reveal>
        <Reveal delay={280}>
          <p className="mx-auto mt-7 max-w-xl text-lg font-light leading-relaxed text-white/85">
            Small groups, patient pros and thirty years of reef on our
            doorstep — from your very first bubbles to instructor level.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#courses"
              className="rounded-full px-9 py-4 text-base font-bold text-[#04263b] transition-shadow hover:shadow-[0_0_32px_rgba(46,211,232,0.55)]"
              style={{ backgroundColor: CYAN }}
            >
              Find your course
            </a>
            <a
              href="#sites"
              className="rounded-full border border-white/35 px-9 py-4 text-base font-semibold text-white transition-colors hover:border-white"
            >
              See the sites
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Courses() {
  return (
    <section id="courses" className="mx-auto max-w-5xl px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <h2 className="text-center text-4xl font-bold tracking-tight md:text-6xl">
          Courses &amp; dives
        </h2>
        <p className="mx-auto mt-4 max-w-md text-center font-light text-white/70">
          Search your level — beginner, certified, night — and the right trips
          surface.
        </p>
      </Reveal>
      <Reveal delay={140}>
        <div className="mt-12">
          <MenuFinder
            items={COURSES}
            displayClass="font-bold tracking-tight"
            placeholder="First time? Certified? Sail Rock?…"
            unitLabel="trips"
            theme={{
              accent: CYAN,
              accentText: ABYSS,
              text: "#ffffff",
              muted: "#ffffff99",
              surface: `${REEF}66`,
              border: "#ffffff26",
              radius: "1rem",
            }}
          />
        </div>
      </Reveal>
    </section>
  );
}

function Sites() {
  const sites = [
    { name: "Sail Rock", depth: "10–40 m", img: "/img/layouts/dive-diver-blue.jpg", note: "The pinnacle. Barracuda walls and the famous chimney." },
    { name: "Turtle Cove", depth: "5–16 m", img: "/img/layouts/dive-turtle.jpg", note: "Resident green turtles over easy coral gardens." },
    { name: "Anemone Reef", depth: "8–22 m", img: "/img/layouts/dive-reef.jpg", note: "A carpet of colour, clownfish in every cushion." },
  ];
  return (
    <section id="sites" className="border-y border-white/10 py-24 md:py-32" style={{ backgroundColor: `${ABYSS}99` }}>
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              This week&rsquo;s sites
            </h2>
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em]" style={{ color: CYAN }}>
              <Compass className="size-4" />
              Conditions: glassy
            </p>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {sites.map((site, i) => (
            <Reveal key={site.name} delay={i * 90} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={site.img}
                    alt={site.name}
                    fill
                    sizes="(min-width: 768px) 30vw, 90vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <span className="absolute right-3 top-3 rounded-full px-3 py-1 text-sm font-bold" style={{ backgroundColor: CYAN, color: ABYSS }}>
                    {site.depth}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-2xl font-bold tracking-tight">{site.name}</h3>
                  <p className="mt-2 flex-1 font-light leading-relaxed text-white/75">{site.note}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Boat() {
  const rows = [
    { t: "07:30", what: "Morning two-tank boat", who: "Fun divers & courses" },
    { t: "12:30", what: "Afternoon reef boat", who: "Discover scuba & training" },
    { t: "17:45", what: "Night dive (Tue & Fri)", who: "Certified divers" },
  ];
  return (
    <section id="boat" className="mx-auto max-w-5xl px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <h2 className="text-center text-4xl font-bold tracking-tight md:text-5xl">
          MV <span style={{ color: CYAN }}>Salty Dog</span> departures
        </h2>
      </Reveal>
      <div className="mt-12 space-y-3">
        {rows.map((r, i) => (
          <Reveal key={r.t} delay={i * 80}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 transition-colors hover:border-[#2ed3e8]/60">
              <span className="w-20 text-2xl font-bold" style={{ color: CYAN }}>
                {r.t}
              </span>
              <span className="flex-1 text-lg font-semibold">{r.what}</span>
              <span className="text-sm font-light text-white/70">{r.who}</span>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={250}>
        <p className="mt-8 text-center font-light text-white/70">
          <LifeBuoy className="mr-2 inline size-5" style={{ color: CYAN }} />
          Gear, nitrox, towels and sea-sickness sympathy all included.
        </p>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 text-center md:px-10">
        <Anchor className="size-7" style={{ color: CYAN }} />
        <p className="text-2xl font-bold tracking-tight">Deep Blue Dive Co.</p>
        <p className="flex items-center gap-2 font-light text-white/75">
          <MapPin className="size-4" style={{ color: CYAN }} />
          {CONTACT.address}
        </p>
        <p className="font-light text-white/75">
          <a href={CONTACT.phoneHref} className="hover:text-white">{CONTACT.phone}</a> ·{" "}
          <a href={CONTACT.emailHref} className="hover:text-white">{CONTACT.email}</a>
        </p>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/45">
          © {new Date().getFullYear()} Deep Blue Dive Co. — fictional demo · Dive layout
        </p>
      </div>
    </footer>
  );
}

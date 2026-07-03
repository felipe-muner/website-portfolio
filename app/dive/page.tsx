import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, LifeBuoy, MapPin, Navigation, ShoppingBag } from "lucide-react";
import { Reveal } from "@/components/layouts/Reveal";
import { MenuFinder, type MenuItem } from "@/components/layouts/MenuFinder";
import { HeroCarousel } from "@/components/layouts/dive/hero-carousel";
import { ProductCard } from "@/components/layouts/dive/product-card";
import { GearArt } from "@/components/layouts/dive/gear-art";
import { CATEGORIES, PRODUCTS } from "@/lib/layouts/dive/catalog";
import { DIVE_LOCATION } from "@/lib/layouts/dive/location";

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
    <>
      <HeroCarousel />
      <Courses />
      <Sites />
      <Shop />
      <Boat />
      <FindUs />
    </>
  );
}

function Courses() {
  return (
    <section id="courses" className="scroll-mt-20 mx-auto max-w-5xl px-5 py-24 md:px-10 md:py-32">
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
    <section id="sites" className="scroll-mt-20 border-y border-white/10 py-24 md:py-32" style={{ backgroundColor: `${ABYSS}99` }}>
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

function Shop() {
  const bestsellers = PRODUCTS.filter((p) => p.bestseller).slice(0, 4);
  return (
    <section id="shop" className="scroll-mt-20 mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em]" style={{ color: CYAN }}>
              <ShoppingBag className="size-4" />
              Gear shop · powered by Aquamaster
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              Kit up before you splash in
            </h2>
            <p className="mt-3 max-w-lg font-light text-white/70">
              Masks, fins, regs and computers from the brands our instructors
              actually dive — delivered island-wide.
            </p>
          </div>
          <Link
            href="/dive/shop"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold transition-colors hover:border-white"
          >
            Browse all gear <ArrowRight className="size-4" />
          </Link>
        </div>
      </Reveal>

      {/* Category quick links */}
      <Reveal delay={100}>
        <div className="mt-10 flex flex-wrap gap-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/dive/shop?category=${c.slug}`}
              className="group inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 py-2 pl-2 pr-4 text-sm font-semibold text-white/80 transition hover:border-[#2ed3e8]/50 hover:text-white"
            >
              <span className="grid size-8 place-items-center rounded-full bg-[#04263b]">
                <GearArt art={c.art} className="size-5" />
              </span>
              {c.label}
            </Link>
          ))}
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {bestsellers.map((p, i) => (
          <Reveal key={p.slug} delay={i * 80} className="h-full">
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FindUs() {
  return (
    <section id="find-us" className="scroll-mt-20 border-t border-white/10 py-24 md:py-32" style={{ backgroundColor: `${ABYSS}99` }}>
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em]" style={{ color: CYAN }}>
            <MapPin className="size-4" />
            Find us
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Drop by {DIVE_LOCATION.name}
          </h2>
          <p className="mt-3 max-w-lg font-light text-white/70">
            Our shop and dive base on Ko Pha Ngan — come try masks and fins on for
            size, or pick up your order.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          {/* Details */}
          <Reveal className="h-full">
            <div className="flex h-full flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-7">
              <div>
                <h3 className="text-lg font-bold tracking-tight">{DIVE_LOCATION.name}</h3>
                <p className="mt-1.5 flex items-start gap-2 font-light text-white/75">
                  <MapPin className="mt-0.5 size-4 shrink-0" style={{ color: CYAN }} />
                  <span>{DIVE_LOCATION.addressLines.join(", ")}</span>
                </p>
                <p className="mt-1.5">
                  <a
                    href={DIVE_LOCATION.phoneHref}
                    className="font-semibold text-white transition hover:text-[#2ed3e8]"
                  >
                    {DIVE_LOCATION.phone}
                  </a>
                </p>
              </div>

              {/* Opening hours */}
              <div className="border-t border-white/10 pt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">
                  Opening hours
                </h4>
                <dl className="mt-3 space-y-1.5 text-sm">
                  {DIVE_LOCATION.hours.map((h) => (
                    <div key={h.day} className="flex items-center justify-between gap-4">
                      <dt className="font-light text-white/70">{h.day}</dt>
                      <dd className={h.closed ? "font-medium text-white/40" : "font-semibold text-white"}>
                        {h.hours}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <a
                href={DIVE_LOCATION.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-[#04263b] transition-shadow hover:shadow-[0_0_24px_rgba(46,211,232,0.5)]"
                style={{ backgroundColor: CYAN }}
              >
                <Navigation className="size-4" /> Get directions
              </a>
            </div>
          </Reveal>

          {/* Map */}
          <Reveal delay={120} className="h-full">
            <div className="h-full min-h-80 overflow-hidden rounded-3xl border border-white/10">
              <iframe
                title={`Map to ${DIVE_LOCATION.name}`}
                src={DIVE_LOCATION.mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-80 w-full"
                style={{ border: 0 }}
                allowFullScreen
              />
            </div>
          </Reveal>
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
    <section id="boat" className="scroll-mt-20 mx-auto max-w-5xl px-5 py-24 md:px-10 md:py-32">
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

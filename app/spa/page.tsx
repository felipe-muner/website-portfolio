import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Cardo, Mulish } from "next/font/google";
import { Flower2, MapPin, Sparkles } from "lucide-react";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { MenuFinder, type MenuItem } from "@/components/layouts/MenuFinder";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Business Layout — Lotus House Spa",
  robots: { index: false },
};

const display = Cardo({ subsets: ["latin"], weight: ["400", "700"], style: ["normal", "italic"] });
const body = Mulish({ subsets: ["latin"], weight: ["300", "400", "600"] });

const BLUSH = "#f7eee9";
const ROSEWOOD = "#9d5c63";
const SAGE2 = "#8a9b84";
const COCOA = "#3d322f";

const TREATMENTS: readonly MenuItem[] = [
  { name: "Thai classic massage", detail: "Pressure and stretch, the way grandmothers taught it. 60 or 90 min.", price: 500, category: "Massage", tags: ["thai", "60 min", "classic"] },
  { name: "Warm oil flow", detail: "Long, slow strokes with jasmine-infused coconut oil.", price: 700, category: "Massage", tags: ["oil", "relax"] },
  { name: "Hot stone ritual", detail: "Basalt stones melt the week off your shoulders. 90 min.", price: 1100, category: "Massage", tags: ["hot stone", "90 min", "signature"] },
  { name: "Head, neck & shoulders", detail: "The desk-worker's rescue, thirty focused minutes.", price: 350, category: "Massage", tags: ["30 min", "office"] },
  { name: "Lemongrass scrub", detail: "Sea salt and lemongrass polish, ends in a rain shower.", price: 800, category: "Body", tags: ["scrub", "glow"] },
  { name: "After-sun wrap", detail: "Cool aloe and cucumber wrap for a day you slightly regret.", price: 750, category: "Body", tags: ["aloe", "cooling"] },
  { name: "Lotus facial", detail: "Cleanse, jade massage and lotus-petal mask.", price: 900, category: "Face", tags: ["facial", "glow"] },
  { name: "Foot story", detail: "Reflexology hour — maps of the body, read through the feet.", price: 450, category: "Face", tags: ["feet", "60 min"] },
  { name: "The whole afternoon", detail: "Scrub + hot stone + facial + tea ceremony. Three hours of nothing.", price: 2400, category: "Rituals", tags: ["3 hours", "signature", "couples"] },
] as const;

export default function LotusHouseSpa() {
  return (
    <div className={`${body.className}`} style={{ backgroundColor: BLUSH, color: COCOA }}>
      <Nav />
      <Hero />
      <Promise />
      <Treatments />
      <Rooms />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur" style={{ backgroundColor: `${BLUSH}e8`, borderColor: `${COCOA}1a` }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-10">
        <Link href="/" className={`${display.className} flex items-center gap-2 text-2xl`}>
          <Flower2 className="size-5" style={{ color: ROSEWOOD }} />
          Lotus House
        </Link>
        <nav className="hidden gap-9 text-sm font-semibold uppercase tracking-[0.22em] md:flex" style={{ color: `${COCOA}99` }}>
          <a href="#menu" className="hover:text-[#9d5c63]">Treatments</a>
          <a href="#rooms" className="hover:text-[#9d5c63]">The house</a>
          <a href="#visit" className="hover:text-[#9d5c63]">Visit</a>
        </nav>
        <a
          href="#menu"
          className="rounded-full px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: ROSEWOOD }}
        >
          Book a treatment
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:px-10 md:py-24 lg:grid-cols-[1fr_0.9fr]">
      <div>
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.35em]" style={{ color: SAGE2 }}>
            A small spa in a garden house
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h1 className={`${display.className} mt-5 text-6xl leading-[1.04] md:text-8xl`}>
            Two hours
            <br />
            <em style={{ color: ROSEWOOD }}>belong to you.</em>
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-7 max-w-md text-lg font-light leading-relaxed" style={{ color: `${COCOA}b3` }}>
            Six treatment rooms around a lotus pond, therapists with twenty
            gentle years in their hands, and tea that ends every story.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#menu"
              className="rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-[#9d5c63]/25 transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: ROSEWOOD }}
            >
              The treatment menu
            </a>
            <a
              href="#rooms"
              className="rounded-full border px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-white"
              style={{ borderColor: `${COCOA}40` }}
            >
              See the house
            </a>
          </div>
        </Reveal>
      </div>
      <Reveal from="right" delay={150}>
        <div className="relative">
          <span
            aria-hidden
            className="absolute -right-6 -top-6 size-40 animate-landing-breathe rounded-full"
            style={{ backgroundColor: `${SAGE2}33` }}
          />
          <div className="relative overflow-hidden rounded-t-[12rem] rounded-b-[2rem] border-8 border-white shadow-2xl shadow-[#3d322f]/15">
            <Image
              src="/img/layouts/spa-hot-stones.jpg"
              alt="A hot-stone treatment at Lotus House"
              width={760}
              height={950}
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="aspect-[4/5] w-full animate-landing-kenburns object-cover"
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Promise() {
  return (
    <section className="py-16 md:py-20" style={{ backgroundColor: "#efe2da" }}>
      <div className="mx-auto max-w-3xl px-5 text-center">
        <Reveal>
          <Sparkles className="mx-auto size-6" style={{ color: SAGE2 }} />
          <p className={`${display.className} mt-5 text-3xl leading-snug md:text-4xl`}>
            &ldquo;No phones past the pond. <em style={{ color: ROSEWOOD }}>The frogs handle the
            notifications.</em>&rdquo;
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Treatments() {
  return (
    <section id="menu" className="mx-auto max-w-5xl px-5 py-20 md:px-10 md:py-28">
      <Reveal>
        <h2 className={`${display.className} text-center text-5xl md:text-6xl`}>
          The treatment menu
        </h2>
        <p className="mx-auto mt-4 max-w-md text-center font-light" style={{ color: `${COCOA}99` }}>
          Search how you feel — sore, sunburnt, sleepy — and the menu answers.
        </p>
      </Reveal>
      <Reveal delay={140}>
        <div className="mt-12">
          <MenuFinder
            items={TREATMENTS}
            displayClass={display.className}
            placeholder="Hot stone? Facial? Three hours of nothing?…"
            unitLabel="treatments"
            theme={{
              accent: ROSEWOOD,
              accentText: "#ffffff",
              text: COCOA,
              muted: `${COCOA}99`,
              surface: "#ffffff",
              border: `${COCOA}26`,
              radius: "2rem",
            }}
          />
        </div>
      </Reveal>
    </section>
  );
}

function Rooms() {
  const rooms = [
    { src: "/img/layouts/spa-massage.jpg", alt: "A massage in the garden room", cap: "The garden room" },
    { src: "/img/layouts/spa-towels.jpg", alt: "Towels, oils and lotus petals", cap: "Small rituals" },
    { src: "/img/layouts/spa-sauna.jpg", alt: "The warm cedar steam room", cap: "The steam house" },
  ];
  return (
    <section id="rooms" className="py-20 text-white md:py-28" style={{ backgroundColor: SAGE2 }}>
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-center text-4xl md:text-5xl`}>
            Six rooms around a pond
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {rooms.map((room, i) => (
            <Reveal key={room.src} delay={i * 100}>
              <figure>
                <div className={`overflow-hidden ${i === 1 ? "rounded-t-[8rem] rounded-b-2xl" : "rounded-2xl"}`}>
                  <Image
                    src={room.src}
                    alt={room.alt}
                    width={620}
                    height={720}
                    sizes="(min-width: 768px) 30vw, 90vw"
                    className="aspect-[5/6] w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <figcaption className={`${display.className} mt-4 text-center text-2xl italic`}>
                  {room.cap}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <Reveal delay={250}>
          <p className="mx-auto mt-12 max-w-xl text-center text-lg font-light leading-relaxed text-white/90">
            Every booking includes the steam house, the pond deck and as much
            butterfly-pea tea as one human can politely drink.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="visit" className="py-14" style={{ backgroundColor: COCOA, color: BLUSH }}>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 text-center md:px-10">
        <Flower2 className="size-7" style={{ color: ROSEWOOD }} />
        <p className={`${display.className} text-3xl`}>Lotus House</p>
        <p className="flex items-center gap-2 font-light" style={{ color: `${BLUSH}cc` }}>
          <MapPin className="size-4" style={{ color: SAGE2 }} />
          {CONTACT.address}
        </p>
        <p className="font-light" style={{ color: `${BLUSH}cc` }}>
          Daily 10:00 – 21:00 · <a href={CONTACT.phoneHref} className="underline-offset-4 hover:underline">{CONTACT.phone}</a>
        </p>
        <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: `${BLUSH}80` }}>
          © {new Date().getFullYear()} Lotus House — fictional demo · Spa layout
        </p>
      </div>
    </footer>
  );
}

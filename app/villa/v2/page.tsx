import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Italiana, Karla } from "next/font/google";
import { ArrowDown, Leaf, MapPin } from "lucide-react";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { BookingCalendar } from "@/components/layouts/BookingCalendar";
import { CONTACT } from "@/lib/layouts/content";
import { VILLAS, VILLA_AMENITIES, VILLA_REVIEWS } from "@/lib/layouts/villas";

export const metadata: Metadata = {
  title: "Villa Layout 2 — Palma",
  robots: { index: false },
};

const display = Italiana({ subsets: ["latin"], weight: "400" });
const body = Karla({ subsets: ["latin"], weight: ["400", "500", "700"] });

const CREAM = "#f7f3ea";
const LEAF = "#3f5d3a";
const RATTAN = "#a9743f";
const INKB = "#2c2a24";

export default function PalmaLayout() {
  return (
    <div className={`${body.className}`} style={{ backgroundColor: CREAM, color: INKB }}>
      <Nav />
      <Hero />
      <Story />
      <Villas />
      <Booking />
      <Amenities />
      <Review />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur" style={{ backgroundColor: `${CREAM}e6`, borderColor: `${INKB}1f` }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-10">
        <Link href="/" className={`${display.className} text-2xl tracking-[0.12em]`}>
          PALMA<span style={{ color: RATTAN }}>.</span>
        </Link>
        <nav className="hidden gap-8 text-sm uppercase tracking-[0.22em] md:flex" style={{ color: `${INKB}b3` }}>
          <a href="#story" className="hover:text-[#a9743f]">The house</a>
          <a href="#villas" className="hover:text-[#a9743f]">Rooms</a>
          <a href="#book" className="hover:text-[#a9743f]">Stay</a>
        </nav>
        <a
          href="#book"
          className="rounded-full px-6 py-2.5 text-sm font-bold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: LEAF }}
        >
          Stay with us
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 pt-14 md:px-10 md:pt-20">
      <Reveal>
        <h1 className={`${display.className} text-center text-[14vw] leading-[0.95] md:text-[9rem]`}>
          a slower
          <em className="px-3" style={{ color: LEAF }}>
            island
          </em>
          life
        </h1>
      </Reveal>
      <div className="mt-10 grid items-start gap-6 md:grid-cols-[1fr_1.3fr_1fr]">
        <Reveal delay={150} className="hidden md:block">
          <div className="overflow-hidden rounded-t-full">
            <Image
              src="/img/layouts/villa-bedroom-wood.jpg"
              alt="A warm timber bedroom at Palma"
              width={520}
              height={680}
              sizes="(min-width: 768px) 26vw, 90vw"
              className="aspect-[3/4] w-full object-cover"
            />
          </div>
          <p className="mt-3 text-sm italic" style={{ color: `${INKB}99` }}>
            The timber suite, morning light.
          </p>
        </Reveal>
        <Reveal delay={50}>
          <div className="overflow-hidden rounded-3xl">
            <Image
              src="/img/layouts/villa-terrace-view.jpg"
              alt="The Palma terrace looking over the garden"
              width={900}
              height={1100}
              priority
              sizes="(min-width: 768px) 36vw, 100vw"
              className="aspect-[4/5] w-full animate-landing-kenburns object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay={250}>
          <p className="text-lg leading-relaxed" style={{ color: `${INKB}cc` }}>
            Palma is a guesthouse of four villas in a jungle garden — built
            from teak and rattan, run on coffee, sea salt and long breakfasts
            under the mango tree.
          </p>
          <a
            href="#story"
            className="mt-8 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.25em]"
            style={{ color: LEAF }}
          >
            Scroll into the garden
            <ArrowDown className="size-4 animate-landing-float" />
          </a>
          <div className="mt-10 hidden overflow-hidden rounded-3xl md:block">
            <Image
              src="/img/layouts/beach-umbrella.jpg"
              alt="The quiet beach near Palma"
              width={520}
              height={380}
              sizes="(min-width: 768px) 26vw, 0vw"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section id="story" className="py-24 text-white md:py-32" style={{ backgroundColor: LEAF }}>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:px-10 lg:grid-cols-2">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.35em]" style={{ color: "#d9c69a" }}>
            The house story
          </p>
          <h2 className={`${display.className} mt-5 text-5xl leading-tight md:text-6xl`}>
            Built by hand,
            <br />
            kept by heart.
          </h2>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-white/85">
            Two friends found a mango orchard at the end of a red-dirt road
            and spent three years building villas between the trees, moving
            nothing that did not need to move.
          </p>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-white/85">
            Today the orchard still feeds breakfast, and every villa keeps its
            own tree.
          </p>
        </Reveal>
        <Reveal from="right" delay={120}>
          <div className="relative">
            <div className="overflow-hidden rounded-t-full border-8 border-white/15">
              <Image
                src="/img/layouts/villa-living-warm.jpg"
                alt="The shared living pavilion"
                width={760}
                height={950}
                sizes="(min-width: 1024px) 42vw, 90vw"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <Leaf className="absolute -left-3 top-10 size-10 animate-landing-float" style={{ color: "#d9c69a" }} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Villas() {
  return (
    <section id="villas" className="mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <h2 className={`${display.className} text-5xl md:text-7xl`}>
          The four rooms<span style={{ color: RATTAN }}>.</span>
        </h2>
      </Reveal>
      <div className="mt-14 space-y-16">
        {VILLAS.map((villa, index) => (
          <Reveal key={villa.slug} delay={80} from={index % 2 ? "right" : "left"}>
            <article className={`grid items-center gap-8 md:grid-cols-2 ${index % 2 ? "" : ""}`}>
              <div className={`overflow-hidden rounded-3xl ${index % 2 ? "md:order-2" : ""}`}>
                <Image
                  src={villa.image}
                  alt={villa.name}
                  width={860}
                  height={600}
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="aspect-[10/7] w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className={index % 2 ? "md:order-1 md:text-right" : ""}>
                <p className="text-sm font-bold uppercase tracking-[0.3em]" style={{ color: RATTAN }}>
                  {villa.tagline}
                </p>
                <h3 className={`${display.className} mt-2 text-4xl md:text-5xl`}>{villa.name}</h3>
                <p className="mt-4 max-w-md text-lg leading-relaxed md:inline-block" style={{ color: `${INKB}b3` }}>
                  {villa.description}
                </p>
                <p className="mt-5 text-lg font-bold" style={{ color: LEAF }}>
                  ฿{villa.pricePerNight.toLocaleString()} <span className="font-normal" style={{ color: `${INKB}99` }}>/ night · sleeps {villa.guests}</span>
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Booking() {
  return (
    <section id="book" className="border-y py-24 md:py-32" style={{ borderColor: `${INKB}1f`, backgroundColor: "#efe8d8" }}>
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-center text-5xl md:text-6xl`}>
            Pick your tree, pick your nights
          </h2>
          <p className="mx-auto mt-4 max-w-md text-center" style={{ color: `${INKB}99` }}>
            A demo calendar — tap a villa, then your dates.
          </p>
        </Reveal>
        <Reveal delay={140}>
          <div className="mt-12">
            <BookingCalendar
              displayClass={display.className}
              theme={{
                accent: LEAF,
                accentText: "#ffffff",
                text: INKB,
                muted: `${INKB}99`,
                surface: CREAM,
                border: `${INKB}26`,
                radius: "1.5rem",
              }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Amenities() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-28">
      <Reveal>
        <h2 className={`${display.className} text-center text-4xl md:text-5xl`}>
          Always included
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {VILLA_AMENITIES.map((item, index) => (
          <Reveal key={item.title} delay={index * 60}>
            <div className="h-full rounded-3xl bg-white/70 p-7">
              <Leaf className="size-5" style={{ color: RATTAN }} />
              <h3 className={`${display.className} mt-3 text-2xl`}>{item.title}</h3>
              <p className="mt-2 leading-relaxed" style={{ color: `${INKB}b3` }}>
                {item.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Review() {
  const review = VILLA_REVIEWS[0];
  return (
    <section className="px-5 pb-24 md:pb-32">
      <Reveal>
        <figure className="mx-auto max-w-3xl text-center">
          <blockquote className={`${display.className} text-3xl leading-snug md:text-4xl`}>
            &ldquo;{review.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-6 text-sm font-bold uppercase tracking-[0.3em]" style={{ color: RATTAN }}>
            — {review.author}, {review.origin}
          </figcaption>
        </figure>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-14 text-white" style={{ backgroundColor: INKB }}>
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 md:flex-row md:items-center md:px-10">
        <p className={`${display.className} text-3xl`}>
          PALMA<span style={{ color: RATTAN }}>.</span>
        </p>
        <p className="flex items-center gap-2 text-base text-white/80">
          <MapPin className="size-4" style={{ color: RATTAN }} />
          {CONTACT.address}
        </p>
        <div className="flex items-center gap-6 text-base text-white/80">
          <a href={CONTACT.phoneHref} className="hover:text-white">{CONTACT.phone}</a>
          <a href={CONTACT.emailHref} className="hover:text-white">{CONTACT.email}</a>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-6xl px-5 text-sm uppercase tracking-[0.3em] text-white/50 md:px-10">
        © {new Date().getFullYear()} Palma Guesthouse — fictional demo · Villa layout 2
      </p>
    </footer>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Albert_Sans } from "next/font/google";
import { ArrowRight, MapPin, Plus } from "lucide-react";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { BookingCalendar } from "@/components/layouts/BookingCalendar";
import { CONTACT } from "@/lib/layouts/content";
import { VILLAS, VILLA_AMENITIES, VILLA_GALLERY } from "@/lib/layouts/villas";

export const metadata: Metadata = {
  title: "Villa Layout 3 — Frame",
  robots: { index: false },
};

const sans = Albert_Sans({ subsets: ["latin"], weight: ["300", "400", "600", "800"] });

const INKC = "#17181a";
const COBALT = "#2547ff";

export default function FrameLayout() {
  return (
    <div className={`${sans.className} bg-white`} style={{ color: INKC }}>
      <Nav />
      <Hero />
      <Manifesto />
      <Villas />
      <GalleryGrid />
      <Booking />
      <Services />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-5 md:px-12">
        <Link href="/" className="text-lg font-extrabold tracking-tight">
          FRAME<span style={{ color: COBALT }}>°</span>villas
        </Link>
        <nav className="hidden gap-10 text-sm font-semibold md:flex" style={{ color: `${INKC}99` }}>
          <a href="#units" className="hover:text-black">Units</a>
          <a href="#gallery" className="hover:text-black">Gallery</a>
          <a href="#stay" className="hover:text-black">Stay</a>
          <a href="#services" className="hover:text-black">Services</a>
        </nav>
        <a
          href="#stay"
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-85"
          style={{ backgroundColor: COBALT }}
        >
          Book
          <ArrowRight className="size-4" />
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="px-5 pt-14 md:px-12 md:pt-20">
      <Reveal>
        <h1 className="max-w-5xl text-5xl font-light leading-[1.05] tracking-tight md:text-8xl">
          Four concrete frames
          <span className="font-extrabold"> in a green hillside</span>
          <span style={{ color: COBALT }}>.</span>
        </h1>
      </Reveal>
      <Reveal delay={150}>
        <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-black/10 pt-6">
          <p className="max-w-md text-lg font-light leading-relaxed" style={{ color: `${INKC}b3` }}>
            Architect-built villas with nothing extra and nothing missing —
            raw concrete, warm timber, and a horizon that does the decorating.
          </p>
          <p className="text-sm font-semibold" style={{ color: `${INKC}80` }}>
            EST. 2021 · {CONTACT.area}
          </p>
        </div>
      </Reveal>
      <Reveal delay={250}>
        <div className="relative mt-10 overflow-hidden">
          <Image
            src="/img/layouts/villa-exterior-white.jpg"
            alt="The white concrete frame of the main villa"
            width={1600}
            height={1067}
            priority
            sizes="100vw"
            className="aspect-[21/10] w-full animate-landing-kenburns object-cover"
          />
          <span className="absolute bottom-0 left-0 bg-white px-5 py-2 text-sm font-bold">
            № 01 — the hillside elevation
          </span>
        </div>
      </Reveal>
    </section>
  );
}

function Manifesto() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-24 text-center md:py-32">
      <Reveal>
        <p className="text-sm font-bold uppercase tracking-[0.3em]" style={{ color: COBALT }}>
          The idea
        </p>
        <p className="mt-6 text-3xl font-light leading-snug md:text-4xl">
          A villa should be a <span className="font-extrabold">frame</span> —
          the view, the light and the people inside it are the picture.
        </p>
      </Reveal>
    </section>
  );
}

function Villas() {
  return (
    <section id="units" className="border-t border-black/10">
      {VILLAS.map((villa, index) => (
        <Reveal key={villa.slug}>
          <article className="group grid border-b border-black/10 md:grid-cols-[8rem_1.2fr_1fr_auto] md:items-center">
            <p className="px-5 pt-6 text-5xl font-extrabold md:px-12 md:py-10" style={{ color: `${INKC}26` }}>
              {String(index + 1).padStart(2, "0")}
            </p>
            <div className="px-5 py-4 md:px-0 md:py-10">
              <h3 className="text-3xl font-extrabold tracking-tight md:text-4xl">{villa.name}</h3>
              <p className="mt-2 max-w-md font-light leading-relaxed" style={{ color: `${INKC}b3` }}>
                {villa.description}
              </p>
              <p className="mt-3 text-sm font-bold" style={{ color: COBALT }}>
                {villa.bedrooms} BR · {villa.guests} guests · ฿{villa.pricePerNight.toLocaleString()}/night
              </p>
            </div>
            <div className="relative mx-5 mb-6 aspect-[16/10] overflow-hidden md:m-0 md:aspect-[16/9]">
              <Image
                src={villa.image}
                alt={villa.name}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover grayscale-[0.3] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
              />
            </div>
            <a
              href="#stay"
              className="m-5 hidden size-14 items-center justify-center border border-black/15 transition-colors hover:border-transparent hover:bg-[#2547ff] hover:text-white md:flex"
              aria-label={`Book ${villa.name}`}
            >
              <ArrowRight className="size-5" />
            </a>
          </article>
        </Reveal>
      ))}
    </section>
  );
}

function GalleryGrid() {
  return (
    <section id="gallery" className="grid grid-cols-2 gap-px bg-black/10 md:grid-cols-4">
      {VILLA_GALLERY.map((src, i) => (
        <div key={src} className={`group relative overflow-hidden bg-white ${i === 0 || i === 5 ? "col-span-2 row-span-2" : ""}`}>
          <Image
            src={src}
            alt={`Frame villas — frame ${i + 1}`}
            width={800}
            height={800}
            sizes="(min-width: 768px) 25vw, 50vw"
            className="aspect-square h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      ))}
    </section>
  );
}

function Booking() {
  return (
    <section id="stay" className="mx-auto max-w-6xl px-5 py-24 md:px-12 md:py-32">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-4xl font-extrabold tracking-tight md:text-6xl">
            Stay<span style={{ color: COBALT }}>.</span>
          </h2>
          <p className="max-w-xs text-sm font-semibold" style={{ color: `${INKC}80` }}>
            Demo availability — choose a unit, then your nights.
          </p>
        </div>
      </Reveal>
      <Reveal delay={120}>
        <div className="mt-10">
          <BookingCalendar
            displayClass="font-extrabold tracking-tight"
            theme={{
              accent: COBALT,
              accentText: "#ffffff",
              text: INKC,
              muted: `${INKC}80`,
              surface: "#fafafa",
              border: `${INKC}1f`,
              radius: "0px",
            }}
          />
        </div>
      </Reveal>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="border-t border-black/10 py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-12">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
            Included in every frame
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-px bg-black/10 sm:grid-cols-2 lg:grid-cols-3">
          {VILLA_AMENITIES.map((item, index) => (
            <Reveal key={item.title} delay={index * 60} className="h-full">
              <div className="h-full bg-white p-7">
                <Plus className="size-5" style={{ color: COBALT }} />
                <h3 className="mt-4 text-xl font-extrabold">{item.title}</h3>
                <p className="mt-2 font-light leading-relaxed" style={{ color: `${INKC}b3` }}>
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="text-white" style={{ backgroundColor: INKC }}>
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 px-5 py-16 md:flex-row md:items-end md:px-12">
        <div>
          <p className="text-3xl font-extrabold tracking-tight">
            FRAME<span style={{ color: COBALT }}>°</span>villas
          </p>
          <p className="mt-4 flex items-center gap-2 text-base text-white/70">
            <MapPin className="size-4" style={{ color: COBALT }} />
            {CONTACT.address}
          </p>
        </div>
        <div className="text-base text-white/70">
          <a href={CONTACT.phoneHref} className="block hover:text-white">{CONTACT.phone}</a>
          <a href={CONTACT.emailHref} className="block hover:text-white">{CONTACT.email}</a>
          <p className="mt-6 text-sm uppercase tracking-[0.25em] text-white/45">
            © {new Date().getFullYear()} Frame Villas — fictional demo · Villa layout 3
          </p>
        </div>
      </div>
    </footer>
  );
}

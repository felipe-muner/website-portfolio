import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Jost, Prata } from "next/font/google";
import { Anchor, BedDouble, MapPin, Phone, Star, Users } from "lucide-react";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { BookingCalendar } from "@/components/layouts/BookingCalendar";
import { CONTACT } from "@/lib/layouts/content";
import { VILLAS, VILLA_AMENITIES, VILLA_GALLERY, VILLA_REVIEWS } from "@/lib/layouts/villas";

export const metadata: Metadata = {
  title: "Villa Layout 1 — Azure",
  robots: { index: false },
};

const display = Prata({ subsets: ["latin"], weight: "400" });
const body = Jost({ subsets: ["latin"], weight: ["300", "400", "600"] });

const IVORY = "#faf7f0";
const TEAL = "#0e4a5a";
const GOLD = "#c2a05c";

export default function AzureLayout() {
  return (
    <div className={`${body.className}`} style={{ backgroundColor: IVORY, color: TEAL }}>
      <Nav />
      <Hero />
      <Villas />
      <Amenities />
      <Booking />
      <Reviews />
      <GalleryStrip />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 text-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-10">
        <Link href="/" className={`${display.className} text-2xl tracking-[0.08em]`}>
          Azure <span style={{ color: GOLD }}>Villas</span>
        </Link>
        <nav className="hidden gap-9 text-sm uppercase tracking-[0.25em] text-white/85 md:flex">
          <a href="#villas" className="hover:text-white">Villas</a>
          <a href="#amenities" className="hover:text-white">Service</a>
          <a href="#book" className="hover:text-white">Availability</a>
          <a href="#reviews" className="hover:text-white">Guests</a>
        </nav>
        <a
          href="#book"
          className="border px-6 py-2.5 text-sm uppercase tracking-[0.2em] transition-colors hover:bg-[#c2a05c] hover:text-[#0e4a5a]"
          style={{ borderColor: GOLD }}
        >
          Book your stay
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-dvh items-center justify-center overflow-hidden text-center text-white">
      <Image
        src="/img/layouts/villa-pool-palms.jpg"
        alt="The Azure pool wrapped in palms"
        fill
        priority
        sizes="100vw"
        className="animate-landing-kenburns object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/60" />
      <div className="relative mx-auto max-w-3xl px-5">
        <Reveal>
          <p className="flex items-center justify-center gap-4 text-sm uppercase tracking-[0.4em]" style={{ color: GOLD }}>
            <span className="h-px w-12" style={{ backgroundColor: GOLD }} />
            Private pool villas · {CONTACT.area}
            <span className="h-px w-12" style={{ backgroundColor: GOLD }} />
          </p>
        </Reveal>
        <Reveal delay={140}>
          <h1 className={`${display.className} mt-7 text-6xl leading-[1.08] md:text-8xl`}>
            Where the bay
            <br />
            keeps your secrets.
          </h1>
        </Reveal>
        <Reveal delay={280}>
          <p className="mx-auto mt-7 max-w-xl text-lg font-light leading-relaxed text-white/90">
            Four private villas folded into the palms above a quiet bay —
            chefs, drivers and golden-hour massages included in the rhythm.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#book"
              className="px-9 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#0e4a5a] transition-opacity hover:opacity-90"
              style={{ backgroundColor: GOLD }}
            >
              Check availability
            </a>
            <a
              href="#villas"
              className="border border-white/50 px-9 py-4 text-sm uppercase tracking-[0.25em] text-white transition-colors hover:border-white"
            >
              The villas
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Villas() {
  return (
    <section id="villas" className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <p className="text-center text-sm uppercase tracking-[0.35em]" style={{ color: GOLD }}>
          The collection
        </p>
        <h2 className={`${display.className} mt-4 text-center text-4xl md:text-6xl`}>
          Four villas, one quiet bay
        </h2>
      </Reveal>
      <div className="mt-16 grid gap-8 md:grid-cols-2">
        {VILLAS.map((villa, index) => (
          <Reveal key={villa.slug} delay={index * 90}>
            <article className="group overflow-hidden bg-white shadow-sm transition-shadow hover:shadow-2xl hover:shadow-[#0e4a5a]/15">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={villa.image}
                  alt={villa.name}
                  fill
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span
                  className="absolute left-5 top-5 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.2em] text-white"
                  style={{ backgroundColor: TEAL }}
                >
                  ฿{villa.pricePerNight.toLocaleString()} / night
                </span>
              </div>
              <div className="p-7 md:p-9">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className={`${display.className} text-3xl`}>{villa.name}</h3>
                  <p className="flex items-center gap-4 text-sm" style={{ color: `${TEAL}b3` }}>
                    <span className="flex items-center gap-1.5">
                      <BedDouble className="size-4" style={{ color: GOLD }} />
                      {villa.bedrooms}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="size-4" style={{ color: GOLD }} />
                      {villa.guests}
                    </span>
                  </p>
                </div>
                <p className="mt-1 text-sm uppercase tracking-[0.25em]" style={{ color: GOLD }}>
                  {villa.tagline}
                </p>
                <p className="mt-4 leading-relaxed" style={{ color: `${TEAL}cc` }}>
                  {villa.description}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {villa.features.map((f) => (
                    <li
                      key={f}
                      className="border px-3 py-1 text-sm"
                      style={{ borderColor: `${TEAL}33`, color: `${TEAL}b3` }}
                    >
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#book"
                  className="mt-7 inline-block border-b-2 pb-1 text-sm font-semibold uppercase tracking-[0.25em] transition-colors hover:text-[#c2a05c]"
                  style={{ borderColor: GOLD }}
                >
                  Reserve {villa.name.split(" ")[1]}
                </a>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Amenities() {
  return (
    <section id="amenities" className="py-24 text-white md:py-32" style={{ backgroundColor: TEAL }}>
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <p className="text-center text-sm uppercase tracking-[0.35em]" style={{ color: GOLD }}>
            Quietly taken care of
          </p>
          <h2 className={`${display.className} mt-4 text-center text-4xl md:text-5xl`}>
            Service that stays invisible
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {VILLA_AMENITIES.map((item, index) => (
            <Reveal key={item.title} delay={index * 70}>
              <div className="border-t pt-5" style={{ borderColor: `${GOLD}66` }}>
                <h3 className={`${display.className} text-2xl`} style={{ color: GOLD }}>
                  {item.title}
                </h3>
                <p className="mt-3 leading-relaxed text-white/80">{item.body}</p>
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
    <section id="book" className="mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <p className="text-center text-sm uppercase tracking-[0.35em]" style={{ color: GOLD }}>
          Availability
        </p>
        <h2 className={`${display.className} mt-4 text-center text-4xl md:text-5xl`}>
          Choose your villa &amp; your nights
        </h2>
      </Reveal>
      <Reveal delay={140}>
        <div className="mt-12">
          <BookingCalendar
            displayClass={display.className}
            theme={{
              accent: TEAL,
              accentText: "#ffffff",
              text: TEAL,
              muted: `${TEAL}99`,
              surface: "#ffffff",
              border: `${TEAL}26`,
              radius: "0px",
            }}
          />
        </div>
      </Reveal>
    </section>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="border-y py-24 md:py-28" style={{ borderColor: `${TEAL}1f`, backgroundColor: "#f2ecdf" }}>
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <div className="flex items-center justify-center gap-1" style={{ color: GOLD }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-5 fill-current" />
            ))}
          </div>
          <h2 className={`${display.className} mt-5 text-center text-4xl md:text-5xl`}>
            Guests who came back
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {VILLA_REVIEWS.map((review, index) => (
            <Reveal key={review.author} delay={index * 90}>
              <figure className="flex h-full flex-col bg-white p-8 shadow-sm">
                <blockquote className={`${display.className} flex-1 text-xl leading-relaxed`}>
                  &ldquo;{review.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 text-sm uppercase tracking-[0.2em]" style={{ color: GOLD }}>
                  {review.author} · {review.origin}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryStrip() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4">
      {VILLA_GALLERY.slice(0, 4).map((src, i) => (
        <div key={src} className="group relative aspect-square overflow-hidden">
          <Image
            src={src}
            alt={`Azure Villas — gallery ${i + 1}`}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
      ))}
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-16 text-white" style={{ backgroundColor: TEAL }}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 text-center md:px-10">
        <Anchor className="size-7" style={{ color: GOLD }} />
        <p className={`${display.className} text-3xl md:text-4xl`}>
          The bay is waiting.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-base text-white/85">
          <span className="flex items-center gap-2">
            <MapPin className="size-4" style={{ color: GOLD }} />
            {CONTACT.address}
          </span>
          <a href={CONTACT.phoneHref} className="flex items-center gap-2 hover:text-white">
            <Phone className="size-4" style={{ color: GOLD }} />
            {CONTACT.phone}
          </a>
          <a href={CONTACT.emailHref} className="hover:text-white">{CONTACT.email}</a>
        </div>
        <p className="text-sm uppercase tracking-[0.3em] text-white/55">
          © {new Date().getFullYear()} Azure Villas — fictional demo · Villa layout 1
        </p>
      </div>
    </footer>
  );
}

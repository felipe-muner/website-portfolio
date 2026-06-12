import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  MapPin,
  MessageCircle,
  Star,
} from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookingCalendar } from "@/components/layouts/BookingCalendar";
import { ContactForm } from "@/components/layouts/villa/contact-form";
import { InstagramFeed } from "@/components/layouts/villa/instagram-feed";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Nav } from "@/components/layouts/villa/nav";
import { Reveal } from "@/components/layouts/villa/reveal";
import { VillaShowcase } from "@/components/layouts/villa/villa-showcase";
import { LINKS, REVIEWS, SERVICES, VILLAS, heroImg,about1Img,about2Img,about3Img,areaBeachImg,hostsImg,area1Img,area2Img,area3Img,area4Img } from "@/lib/layouts/laguna";
import { Fraunces, Karla } from "next/font/google";

const fraunces = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-fraunces" });
const karla = Karla({ subsets: ["latin"], variable: "--font-karla" });

const BOOKING_THEME = {
  accent: "#20453a",
  accentText: "#f7f3e8",
  text: "#25312b",
  muted: "#5f6a5e",
  surface: "#fffdf7",
  border: "#e3dac6",
  radius: "0.375rem",
} as const;

export const metadata: Metadata = {
  title: "Villa Layout 9 — Arc",
  robots: { index: false },
};

const TICKER_ITEMS = [
  "Private salt pools",
  "5 m to the sand",
  "365 sunsets a year",
  "the harbour town in 2 minutes",
  "SUP boards & kayaks included",
  "In-villa chef & massage",
  "Best rates booking direct",
];

export default function ArcLayout() {
  return (
    <div id="top" className={`${fraunces.variable} ${karla.variable} laguna-theme flex min-h-dvh flex-col bg-background text-foreground`}>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Ticker />
        <BookingBand />
        <About />
        <Villas />
        <Experience />
        <Hosts />
        <Reviews />
        <InstagramFeed />
        <Location />
        <Contact />
      </main>
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Hero() {
  return (
    <section className="overflow-hidden px-5 pt-28 md:px-10 lg:pt-32">
      <div className="mx-auto max-w-7xl text-center">
        <Reveal>
          <p className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.26em] text-terracotta">
            Half Moon Bay · Tropical Island
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="font-heading mx-auto mt-6 max-w-4xl text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
            The <em className="italic text-palm">beachfront sanctuary</em>
            <br />
            of the island
          </h1>
        </Reveal>

        <Reveal delay={240}>
          <div className="relative mx-auto mt-12 flex max-w-5xl items-end justify-center gap-5 md:gap-8">
            <div className="relative hidden aspect-[3/4] w-48 overflow-hidden rounded-t-full md:block lg:w-56">
              <Image
                src={areaBeachImg}
                alt="Boulders and white sand on Half Moon beach"
                fill
                sizes="14rem"
                className="object-cover"
              />
            </div>
            <div className="grain relative aspect-[3/4] w-full max-w-sm shrink-0 overflow-hidden rounded-t-full md:max-w-md">
              <Image
                src={heroImg}
                alt="Infinity pool over the bay at Laguna Bay Villas"
                fill
                priority
                sizes="(min-width: 768px) 28rem, 90vw"
                className="hero-drift object-cover"
              />
            </div>
            <div className="relative hidden aspect-[3/4] w-48 overflow-hidden rounded-t-full md:block lg:w-56">
              <Image
                src={VILLAS[1].cover}
                alt="Villa Lee's infinity edge over the bay"
                fill
                sizes="14rem"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={360}>
          <p className="mx-auto mt-10 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Five private pool villas where breathtaking nature meets stylish
            design — large boulders, soft white sand and year-round sunsets,
            minutes from the harbour town.
          </p>
        </Reveal>
        <Reveal delay={460}>
          <div className="mb-16 mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="h-12 px-7 text-base">
              <a href="#book">
                Check availability
                <ArrowDown data-icon="inline-end" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-7 text-base"
            >
              <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer">
                <MessageCircle data-icon="inline-start" />
                WhatsApp us
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Ticker() {
  return (
    <div
      aria-hidden
      className="overflow-hidden border-y border-terracotta/20 bg-terracotta py-3 text-primary-foreground"
    >
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {TICKER_ITEMS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-6 pr-6 text-xs font-semibold uppercase tracking-[0.22em]"
              >
                {item}
                <span className="text-sun">✺</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

function BookingBand() {
  return (
    <section id="book" className="bg-palm py-16 text-primary-foreground md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-heading text-3xl md:text-4xl">
              Plan your stay
            </h2>
            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-primary-foreground/70">
              <span className="inline-block size-2 animate-pulse rounded-full bg-sun" />
              Live availability · best price direct
            </span>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="rounded-md bg-shell p-6 text-foreground shadow-2xl shadow-black/20 md:p-8">
            <BookingCalendar displayClass="font-heading" villas={VILLAS} theme={BOOKING_THEME} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
            About Laguna
          </p>
          <h2 className="font-heading mt-5 text-4xl leading-tight md:text-5xl">
            Where breathtaking nature meets{" "}
            <em className="italic text-palm">stylish design</em>
          </h2>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            Fully equipped four-bedroom villas only two minutes from the harbour town,
            with private salt pools and direct beach access where the shore
            unfolds in giant boulders and golden light. We are not just villas
            — expect all the comfort a hotel can provide, and much more.
          </p>
        </div>
      </Reveal>
      <div className="mt-16 grid grid-cols-3 items-end gap-4 md:gap-8">
        {[
          {
            src: about2Img,
            alt: "Stone bathroom with hexagonal tiles",
            className: "aspect-[3/4]",
          },
          {
            src: about1Img,
            alt: "Open-plan living room with stone wall and sea breeze",
            className: "aspect-[3/4] md:-mt-10",
          },
          {
            src: about3Img,
            alt: "Villa bedroom opening to the terrace",
            className: "aspect-[3/4]",
          },
        ].map((img, index) => (
          <Reveal key={img.src} delay={index * 140}>
            <div
              className={`relative overflow-hidden rounded-t-full ${img.className}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 768px) 30vw, 33vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={200}>
        <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-3 divide-x divide-border border-y border-border py-6 text-center">
          <div>
            <dt className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
              Private villas
            </dt>
            <dd className="font-heading mt-1 text-3xl">Five</dd>
          </div>
          <div>
            <dt className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
              To the sand
            </dt>
            <dd className="font-heading mt-1 text-3xl">5 m</dd>
          </div>
          <div>
            <dt className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
              Sunsets a year
            </dt>
            <dd className="font-heading mt-1 text-3xl">365</dd>
          </div>
        </dl>
      </Reveal>
    </section>
  );
}

function Villas() {
  return (
    <section id="villas" className="border-y border-border bg-sand/60 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
              The villas
            </p>
            <h2 className="font-heading mt-5 text-4xl leading-tight md:text-5xl">
              Pick your spot on{" "}
              <em className="italic text-palm">Half Moon beach</em>
            </h2>
          </div>
        </Reveal>
        <div className="mt-14">
          <VillaShowcase />
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
            The Laguna way
          </p>
          <h2 className="font-heading mt-5 text-4xl leading-tight md:text-5xl">
            Your stay extends far beyond the villa walls
          </h2>
        </div>
      </Reveal>
      <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
        {SERVICES.map((service, index) => (
          <Reveal key={service.title} delay={index * 140}>
            <div className="text-center">
              <div className="relative mx-auto aspect-[3/4] max-w-[16rem] overflow-hidden rounded-t-full">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="16rem"
                  className="object-cover"
                />
              </div>
              <h3 className="font-heading mt-6 text-2xl">{service.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {service.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={200}>
        <p className="mt-14 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Complimentary with every villa — 2 SUP boards · kayak · trip planning
          · local connections
        </p>
      </Reveal>
    </section>
  );
}

function Hosts() {
  return (
    <section className="border-y border-border bg-sand/60 py-24 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <div className="relative mx-auto aspect-[3/4] w-full max-w-xs overflow-hidden rounded-t-full">
            <Image
              src={hostsImg}
              alt="Mia and Theo on the beach at Laguna"
              fill
              sizes="(min-width: 1024px) 20rem, 80vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
              About the hosts
            </p>
            <h2 className="font-heading mt-5 text-4xl leading-tight md:text-5xl">
              Meet <em className="italic text-palm">Mia &amp; Theo</em>
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
              A dynamic couple with extensive experience in real estate and the
              culinary world, Mia and Theo crafted their dream into reality
              by building Laguna Bay Villas — and they delight in
              welcoming guests to the splendor of the island.
            </p>
            <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
              Ask them anything — from the best pad thai in the harbour town to a
              sunrise kayak route.
            </p>
            <Button asChild variant="outline" size="lg" className="mt-8">
              <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer">
                <MessageCircle data-icon="inline-start" />
                Say hello
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="mx-auto max-w-4xl px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
            Guest reviews
          </p>
          <h2 className="font-heading mt-5 text-4xl leading-tight md:text-5xl">
            Five stars, on <em className="italic text-palm">every platform</em>
          </h2>
        </div>
      </Reveal>
      <div className="mt-14 space-y-12">
        {REVIEWS.map((review, index) => (
          <Reveal key={review.author} delay={index * 80}>
            <figure
              className={`max-w-xl ${index % 2 === 1 ? "ml-auto text-right" : ""}`}
            >
              <div
                className={`flex gap-0.5 text-sun ${index % 2 === 1 ? "justify-end" : ""}`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <blockquote className="font-heading mt-3 text-xl italic leading-relaxed text-foreground/85 md:text-2xl">
                &ldquo;{review.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-3 text-sm text-muted-foreground">
                — {review.author}
                {review.date && <span> · {review.date}</span>}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Location() {
  return (
    <section id="location" className="border-y border-border bg-sand/60 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
                In the area
              </p>
              <h2 className="font-heading mt-5 text-4xl leading-tight md:text-5xl">
                The quiet side of{" "}
                <em className="italic text-palm">the island</em>
              </h2>
              <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
                Laguna sits on the island&rsquo;s quiet western shore — a
                tranquil beach of soft white sand and majestic boulders, three
                minutes from the harbour town&rsquo;s night markets, restaurants and
                ferries.
              </p>
              <ul className="mt-8 grid max-w-xl gap-3 text-sm">
                {[
                  "3 minutes to the harbour town and night market",
                  "90 seconds to the nearest minimart",
                  "5 minutes to restaurants and beach cafés",
                  "Next to a hidden swimming cove",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-terracotta" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild>
                  <a href={LINKS.maps} target="_blank" rel="noopener noreferrer">
                    <MapPin data-icon="inline-start" />
                    Open in Google Maps
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a
                    href={LINKS.favorites}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Our favorite spots
                    <ArrowUpRight data-icon="inline-end" />
                  </a>
                </Button>
              </div>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <Image src={area1Img} alt="The bay from above" width={1200} height={800} sizes="(min-width: 1024px) 50vw, 100vw" className="h-72 w-full rounded-md object-cover md:h-80" />
          </Reveal>
        </div>
        <Reveal delay={200}>
          <div className="mt-12 grid grid-cols-2 items-end gap-4 md:grid-cols-4 md:gap-6">
            {[
              { src: area1Img, alt: "Aerial view of the Half Moon Bay coastline" },
              {
                src: area2Img,
                alt: "Sunset over the boulders at Half Moon Bay",
                lift: true,
              },
              { src: area3Img, alt: "The beach in front of Laguna Villas" },
              {
                src: area4Img,
                alt: "Longtail boats off the western shore",
                lift: true,
              },
            ].map((img) => (
              <div
                key={img.src}
                className={`relative aspect-[3/4] overflow-hidden rounded-t-full ${
                  img.lift ? "md:-mt-8" : ""
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 768px) 24vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
              Contact us
            </p>
            <h2 className="font-heading mt-5 text-4xl leading-tight md:text-5xl">
              We&rsquo;re a <em className="italic text-palm">message</em> away
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
              Our concierge reads every WhatsApp message around the clock and
              answers in seconds with live availability — and Mia &amp; Theo
              are never far behind for the personal touch.
            </p>
            <div className="mt-9 space-y-3">
              <a
                href={LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm font-medium hover:text-palm"
              >
                <MessageCircle className="size-4 text-terracotta" />
                +66 99 123 4567 on WhatsApp
              </a>
              <a
                href={LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm font-medium hover:text-palm"
              >
                <InstagramIcon className="size-4 text-terracotta" />
                @lagunabayvillas
              </a>
              <a
                href={LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm font-medium hover:text-palm"
              >
                <FacebookIcon className="size-4 text-terracotta" />
                Laguna Villas
              </a>
            </div>
            <div className="mt-10 border-t border-border pt-6">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Or book directly on
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {[
                  { label: "Direct", href: LINKS.cloudbeds },
                  { label: "Airbnb", href: LINKS.airbnb },
                  { label: "Booking.com", href: LINKS.booking },
                ].map((platform) => (
                  <Button
                    key={platform.label}
                    asChild
                    variant="outline"
                    size="sm"
                  >
                    <a
                      href={platform.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {platform.label}
                      <ArrowUpRight data-icon="inline-end" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <Card>
            <CardContent className="p-6 md:p-8">
              <ContactForm />
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-palm-deep py-14 text-primary-foreground">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="font-heading text-2xl">Laguna<span className="text-terracotta">.</span></div>
            </div>
            <p className="mt-3 max-w-xs text-sm text-primary-foreground/60">
              Beachfront villas in Half Moon Bay — crafted by Mia &amp; Theo.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-primary-foreground/80">
            <a href="#villas" className="hover:text-primary-foreground">
              The Villas
            </a>
            <a href="#experience" className="hover:text-primary-foreground">
              Experience
            </a>
            <a href="#reviews" className="hover:text-primary-foreground">
              Reviews
            </a>
            <a href="#location" className="hover:text-primary-foreground">
              Location
            </a>
            <a href="#contact" className="hover:text-primary-foreground">
              Contact
            </a>
          </nav>
          <div className="flex gap-3">
            <Button asChild variant="ghost" size="icon-lg" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <a
                href={LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <InstagramIcon className="size-4" />
              </a>
            </Button>
            <Button asChild variant="ghost" size="icon-lg" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <a
                href={LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FacebookIcon className="size-4" />
              </a>
            </Button>
            <Button asChild variant="ghost" size="icon-lg" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <a
                href={LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <MessageCircle />
              </a>
            </Button>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/50 md:flex-row">
          <p>
            © {new Date().getFullYear()} Laguna Villas · Half Moon Bay, Tropical Island
          </p>
          <p>
            Book direct with us for the best rates.
          </p>
        </div>
      </div>
    </footer>
  );
}

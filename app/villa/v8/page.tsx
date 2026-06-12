import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowUpRight,
  MapPin,
  MessageCircle,
  Sparkles,
  Star,
} from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookingCalendar } from "@/components/layouts/BookingCalendar";
import { ContactForm } from "@/components/layouts/villa/contact-form";
import { InstagramFeed } from "@/components/layouts/villa/instagram-feed";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Nav } from "@/components/layouts/villa/nav";
import { Reveal } from "@/components/layouts/villa/reveal";
import { ReviewsMarquee } from "@/components/layouts/villa/reviews-marquee";
import { VillaCarousel } from "@/components/layouts/villa/villa-carousel";
import { LINKS, SERVICES, VILLAS, heroImg,about1Img,about2Img,about3Img,areaBeachImg,hostsImg,area1Img,area2Img,area3Img,area4Img } from "@/lib/layouts/laguna";
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
  title: "Villa Layout 8 — Mosaic",
  robots: { index: false },
};

export default function MosaicLayout() {
  const [featuredVilla, ...moreVillas] = VILLAS;
  return (
    <div id="top" className={`${fraunces.variable} ${karla.variable} laguna-theme flex min-h-dvh flex-col bg-background text-foreground`}>
      <Nav />
      <main className="flex-1">
        <Hero />
        <BookingBand />
        <About />
        <Villas featured={featuredVilla} rest={moreVillas} />
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
    <section className="mx-auto max-w-7xl px-5 pt-28 md:px-10 lg:pt-32">
      <Reveal>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
            <span className="inline-block h-px w-10 bg-terracotta" />
            Half Moon Bay · Tropical Island
            <span className="inline-block h-px w-10 bg-terracotta" />
          </p>
          <h1 className="font-heading mt-6 text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
            Five beachfront villas,
            <br />
            one <em className="italic text-palm">quiet shore</em>.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Private salt pools, giant boulders, soft white sand and 365 days of
            stunning sunsets — minutes from the harbour town.
          </p>
        </div>
      </Reveal>

      <Reveal delay={180}>
        <div className="relative mt-12 grid h-[62vh] min-h-[26rem] grid-cols-4 grid-rows-2 gap-2 md:gap-3">
          <div className="grain relative col-span-4 row-span-2 overflow-hidden rounded-md md:col-span-2">
            <Image
              src={heroImg}
              alt="Infinity pool over the bay at Laguna Bay Villas"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="hero-drift object-cover"
            />
          </div>
          <div className="relative col-span-2 hidden overflow-hidden rounded-md md:block">
            <Image
              src={areaBeachImg}
              alt="Boulders and white sand on Half Moon beach"
              fill
              sizes="50vw"
              className="object-cover"
            />
          </div>
          <div className="relative hidden overflow-hidden rounded-md md:block">
            <Image
              src={about1Img}
              alt="Open-plan living room with stone wall and sea breeze"
              fill
              sizes="25vw"
              className="object-cover"
            />
          </div>
          <div className="relative hidden overflow-hidden rounded-md md:block">
            <Image
              src={area1Img}
              alt="Aerial view of the Half Moon Bay coastline"
              fill
              sizes="25vw"
              className="object-cover"
            />
          </div>
          <figure className="absolute -bottom-5 left-4 max-w-[16rem] rounded-md border bg-shell p-5 shadow-lg md:bottom-6 md:left-6">
            <blockquote className="font-heading text-sm italic leading-snug">
              &ldquo;We&rsquo;re not just hosting, we&rsquo;re crafting
              memories.&rdquo;
            </blockquote>
            <figcaption className="mt-2 text-xs text-muted-foreground">
              — Mia &amp; Theo, your hosts
            </figcaption>
          </figure>
        </div>
      </Reveal>
    </section>
  );
}

function BookingBand() {
  return (
    <section id="book" className="mx-auto max-w-7xl px-5 pt-16 md:px-10">
      <Reveal>
        <div className="rounded-md border border-border bg-shell p-6 shadow-xl shadow-palm/5 md:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-2xl md:text-3xl">
              Plan your stay
            </h2>
            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              <span className="inline-block size-2 animate-pulse rounded-full bg-sun" />
              Live availability · best price direct
            </span>
          </div>
          <BookingCalendar displayClass="font-heading" villas={VILLAS} theme={BOOKING_THEME} />
        </div>
      </Reveal>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <Reveal>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
              About Laguna
            </p>
            <blockquote className="font-heading mt-6 text-3xl leading-snug md:text-4xl">
              &ldquo;Where breathtaking nature meets{" "}
              <em className="italic text-palm">stylish design</em> — fully
              equipped villas, private salt pools and direct beach access, two
              minutes from the harbour town.&rdquo;
            </blockquote>
            <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
              We are not just villas: expect all the comfort a hotel can
              provide, and much more. Complimentary SUP boards and kayaks come
              with every stay.
            </p>
            <dl className="mt-10 grid max-w-md grid-cols-3 divide-x divide-border border-y border-border py-5 text-center">
              <div>
                <dt className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                  Private villas
                </dt>
                <dd className="font-heading mt-1 text-2xl">Five</dd>
              </div>
              <div>
                <dt className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                  To the sand
                </dt>
                <dd className="font-heading mt-1 text-2xl">5 m</dd>
              </div>
              <div>
                <dt className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                  Sunsets a year
                </dt>
                <dd className="font-heading mt-1 text-2xl">365</dd>
              </div>
            </dl>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div className="relative mx-auto max-w-md">
            <Image
              src={about3Img}
              alt="Villa bedroom opening to the terrace"
              width={1920}
              height={1280}
              sizes="(min-width: 1024px) 36vw, 90vw"
              className="rounded-md object-cover"
            />
            <Image
              src={about2Img}
              alt="Stone bathroom with hexagonal tiles"
              width={1920}
              height={1280}
              sizes="(min-width: 1024px) 18vw, 45vw"
              className="absolute -bottom-10 -left-6 w-1/2 rotate-[-2deg] rounded-md border-4 border-shell object-cover shadow-xl"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Villas({
  featured,
  rest,
}: {
  featured: (typeof VILLAS)[number];
  rest: typeof VILLAS;
}) {
  return (
    <section id="villas" className="border-y border-border bg-sand/60 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
                The villas
              </p>
              <h2 className="font-heading mt-5 text-4xl leading-tight md:text-5xl">
                Five ways to live on{" "}
                <em className="italic text-palm">Half Moon beach</em>
              </h2>
            </div>
            <Button asChild variant="outline">
              <a href={LINKS.cloudbeds} target="_blank" rel="noopener noreferrer">
                Book direct
                <ArrowUpRight data-icon="inline-end" />
              </a>
            </Button>
          </div>
        </Reveal>

        {/* Featured villa, full width */}
        <Reveal delay={120}>
          <article className="mt-14 grid items-center gap-8 rounded-md border border-border bg-shell p-5 md:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <div className="min-w-0">
              <VillaCarousel name={featured.name} images={featured.gallery} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
                {featured.number} · Closest to the water
              </p>
              <h3 className="font-heading mt-3 text-3xl md:text-4xl">
                {featured.name}
              </h3>
              <p className="mt-1 text-sm font-medium uppercase tracking-[0.16em] text-palm">
                {featured.tagline}
              </p>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                {featured.description}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {featured.specs.map((spec) => (
                  <li key={spec}>
                    <Badge
                      variant="outline"
                      className="border-border bg-sand/80 px-3 py-1 text-[0.7rem] uppercase tracking-wide text-foreground/80"
                    >
                      {spec}
                    </Badge>
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild>
                  <a href="#book">Check availability</a>
                </Button>
                <Button asChild variant="ghost">
                  <a
                    href={LINKS.cloudbeds}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Book direct
                    <ArrowUpRight data-icon="inline-end" />
                  </a>
                </Button>
              </div>
            </div>
          </article>
        </Reveal>

        {/* Remaining villas in a two-column grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {rest.map((villa, index) => (
            <Reveal
              key={villa.slug}
              className="min-w-0"
              delay={(index % 2) * 120}
            >
              <article className="flex h-full flex-col rounded-md border border-border bg-shell p-5 md:p-6">
                <div className="min-w-0">
                  <VillaCarousel name={villa.name} images={villa.gallery} />
                </div>
                <div className="mt-5 flex flex-1 flex-col">
                  <div className="flex items-baseline gap-3">
                    <span className="font-heading text-3xl text-border">
                      {villa.number}
                    </span>
                    <div>
                      <h3 className="font-heading text-2xl md:text-3xl">
                        {villa.name}
                      </h3>
                      <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.16em] text-terracotta">
                        {villa.tagline}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {villa.description}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {villa.specs.map((spec) => (
                      <li key={spec}>
                        <Badge
                          variant="outline"
                          className="border-border bg-sand/80 px-2.5 py-0.5 text-[0.65rem] uppercase tracking-wide text-foreground/80"
                        >
                          {spec}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                  {villa.note && (
                    <p className="mt-3 flex items-center gap-2 text-sm text-palm">
                      <Sparkles className="size-4 text-sun" />
                      {villa.note}
                    </p>
                  )}
                  <div className="mt-auto flex flex-wrap gap-3 pt-6">
                    <Button asChild size="sm">
                      <a href="#book">Check availability</a>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <a
                        href={LINKS.cloudbeds}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Book direct
                        <ArrowUpRight data-icon="inline-end" />
                      </a>
                    </Button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
            The Laguna way
          </p>
          <h2 className="font-heading mt-5 text-4xl leading-tight md:text-5xl">
            Your stay extends far beyond the villa walls
          </h2>
        </div>
      </Reveal>
      <div className="mt-14 divide-y divide-border border-y border-border">
        {SERVICES.map((service, index) => (
          <Reveal key={service.title}>
            <div className="grid items-center gap-6 py-8 md:grid-cols-[4rem_1fr_18rem] md:gap-10">
              <span className="font-heading text-4xl text-border md:text-5xl">
                0{index + 1}
              </span>
              <div>
                <h3 className="font-heading text-2xl md:text-3xl">
                  {service.title}
                </h3>
                <p className="mt-2 max-w-xl leading-relaxed text-muted-foreground">
                  {service.body}
                </p>
              </div>
              <div className="relative aspect-[3/2] overflow-hidden rounded-md">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(min-width: 768px) 18rem, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={150}>
        <p className="mt-8 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
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
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <div className="relative mx-auto max-w-sm">
            <div className="absolute -inset-3 rotate-2 rounded-md bg-shell" />
            <Image
              src={hostsImg}
              alt="Mia and Theo on the beach at Laguna"
              width={720}
              height={960}
              sizes="(min-width: 1024px) 32vw, 80vw"
              className="relative -rotate-1 rounded-md border-4 border-shell object-cover shadow-xl"
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
    <section id="reviews" className="overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
                Guest reviews
              </p>
              <h2 className="font-heading mt-5 text-4xl leading-tight md:text-5xl">
                Five stars, on{" "}
                <em className="italic text-palm">every platform</em>
              </h2>
            </div>
            <div className="flex items-center gap-1 text-sun">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-6 fill-current" />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
      <Reveal delay={120}>
        <div className="mt-12">
          <ReviewsMarquee />
        </div>
      </Reveal>
    </section>
  );
}

function Location() {
  return (
    <section id="location" className="border-y border-border bg-sand/60 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
              In the area
            </p>
            <h2 className="font-heading mt-5 text-4xl leading-tight md:text-5xl">
              The quiet side of{" "}
              <em className="italic text-palm">the island</em>
            </h2>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal delay={100}>
            <Image src={area1Img} alt="The bay from above" width={1200} height={800} sizes="(min-width: 1024px) 50vw, 100vw" className="h-72 w-full rounded-md object-cover md:h-80" />
          </Reveal>
          <Reveal delay={180}>
            <div>
              <p className="max-w-xl leading-relaxed text-muted-foreground">
                Laguna sits on the island&rsquo;s quiet western shore — a
                tranquil beach of soft white sand and majestic boulders, three
                minutes from the harbour town&rsquo;s night markets, restaurants and
                ferries.
              </p>
              <ul className="mt-6 grid gap-3 text-sm">
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
              <div className="mt-8 flex flex-wrap gap-3">
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
        </div>
        <Reveal delay={220}>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { src: area1Img, alt: "Aerial view of the Half Moon Bay coastline" },
              { src: area2Img, alt: "Sunset over the boulders at Half Moon Bay" },
              { src: area3Img, alt: "The beach in front of Laguna Villas" },
              { src: area4Img, alt: "Longtail boats off the western shore" },
            ].map((img) => (
              <Image
                key={img.src}
                src={img.src}
                alt={img.alt}
                width={620}
                height={820}
                sizes="(min-width: 768px) 24vw, 50vw"
                className="aspect-[3/4] w-full rounded-md object-cover"
              />
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
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
            Contact us
          </p>
          <h2 className="font-heading mt-5 text-4xl leading-tight md:text-5xl">
            We&rsquo;re a <em className="italic text-palm">message</em> away
          </h2>
          <p className="mx-auto mt-6 max-w-md leading-relaxed text-muted-foreground">
            Our concierge reads every WhatsApp message around the clock and
            answers in seconds with live availability.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer">
                <MessageCircle data-icon="inline-start" />
                +66 99 123 4567
              </a>
            </Button>
            {[
              { label: "Direct", href: LINKS.cloudbeds },
              { label: "Airbnb", href: LINKS.airbnb },
              { label: "Booking.com", href: LINKS.booking },
            ].map((platform) => (
              <Button key={platform.label} asChild variant="outline" size="lg">
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
      </Reveal>
      <Reveal delay={150}>
        <Card className="mx-auto mt-12 max-w-3xl">
          <CardContent className="p-6 md:p-8">
            <ContactForm />
          </CardContent>
        </Card>
      </Reveal>
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

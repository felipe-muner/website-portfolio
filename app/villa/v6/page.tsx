import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowDown,
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
import { VillaCarousel } from "@/components/layouts/villa/villa-carousel";
import { LINKS, REVIEWS, SERVICES, VILLAS, heroImg,about1Img,about2Img,areaBeachImg,hostsImg,area1Img,area3Img } from "@/lib/layouts/laguna";
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
  title: "Villa Layout 6 — Horizon",
  robots: { index: false },
};

export default function HorizonVillaLayout() {
  return (
    <div id="top" className={`${fraunces.variable} ${karla.variable} laguna-theme flex min-h-dvh flex-col bg-background text-foreground`}>
      <Nav />
      <main className="flex-1">
        <Hero />
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
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 pt-28 md:px-10 lg:min-h-[92vh] lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-20">
        <div className="flex flex-col justify-center pb-4 lg:pb-24 lg:pt-20">
          <Reveal>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
              <span className="inline-block h-px w-10 bg-terracotta" />
              Half Moon Bay · Tropical Island
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="font-heading mt-6 text-5xl leading-[1.04] text-foreground sm:text-6xl xl:text-7xl">
              Your beachfront
              <br />
              <em className="italic text-palm">sanctuary</em> on the
              <br />
              quiet shore.
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              Five private pool villas where breathtaking nature meets stylish
              design — large boulders, soft white sand and 365 days of stunning
              sunsets, minutes from the harbour town.
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
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
                <a
                  href={LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle data-icon="inline-start" />
                  WhatsApp us
                </a>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={480}>
            <dl className="mt-14 grid max-w-md grid-cols-3 divide-x divide-border border-y border-border py-5 text-center">
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
          </Reveal>
        </div>

        <div className="relative lg:-mr-10">
          <div className="grain relative h-[60vh] overflow-hidden rounded-md lg:h-full lg:rounded-none">
            <Image
              src={heroImg}
              alt="Infinity pool over the bay at Laguna Bay Villas"
              fill
              priority
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="hero-drift object-cover"
            />
          </div>
          <figure className="absolute -bottom-5 left-4 max-w-[16rem] rounded-md border bg-shell p-5 shadow-lg lg:-left-12 lg:bottom-16">
            <blockquote className="font-heading text-sm italic leading-snug">
              &ldquo;We&rsquo;re not just hosting, we&rsquo;re crafting
              memories.&rdquo;
            </blockquote>
            <figcaption className="mt-2 text-xs text-muted-foreground">
              — Mia &amp; Theo, your hosts
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

function BookingBand() {
  return (
    <section id="book" className="relative z-10 mx-auto max-w-7xl px-5 pb-4 pt-16 md:px-10 lg:-mt-6">
      <Reveal>
        <Card className="border-border shadow-xl shadow-palm/5">
          <CardContent className="p-6 md:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-heading text-2xl md:text-3xl">
                Plan your stay
              </h2>
              <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                <span className="inline-block size-2 animate-pulse rounded-full bg-sun" />
                Live availability
              </span>
            </div>
            <BookingCalendar displayClass="font-heading" villas={VILLAS} theme={BOOKING_THEME} />
          </CardContent>
        </Card>
      </Reveal>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
              About Laguna
            </p>
            <h2 className="font-heading mt-5 text-4xl leading-tight md:text-5xl">
              Where breathtaking nature meets{" "}
              <em className="italic text-palm">stylish design</em>
            </h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Laguna Bay Villas offers an exclusive vacation on Koh
              Phangan — fully equipped four-bedroom villas only two minutes from
              the harbour town, with private salt pools and direct beach access where
              the shore unfolds in giant boulders and golden light.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              We are not just villas: expect all the comfort a hotel can
              provide, and much more. Complimentary SUP boards and kayaks come
              with every stay.
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          <Reveal className="col-span-2" delay={100}>
            <Image
              src={about1Img}
              alt="Open-plan living room with stone wall and sea breeze"
              width={1920}
              height={1280}
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="rounded-md object-cover"
            />
          </Reveal>
          <Reveal delay={200}>
            <Image
              src={areaBeachImg}
              alt="Boulders and white sand on Half Moon beach"
              width={360}
              height={480}
              sizes="(min-width: 1024px) 27vw, 50vw"
              className="h-full w-full rounded-md object-cover"
            />
          </Reveal>
          <Reveal delay={300}>
            <Image
              src={about2Img}
              alt="Stone bathroom with hexagonal tiles"
              width={1920}
              height={1280}
              sizes="(min-width: 1024px) 27vw, 50vw"
              className="h-full w-full rounded-md object-cover"
            />
          </Reveal>
        </div>
      </div>
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
              Five ways to live on{" "}
              <em className="italic text-palm">Half Moon beach</em>
            </h2>
          </div>
        </Reveal>

        <div className="mt-16 space-y-24 md:mt-24 md:space-y-32">
          {VILLAS.map((villa, index) => (
            <article
              key={villa.slug}
              className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
            >
              <Reveal
                className={index % 2 === 1 ? "min-w-0 lg:order-2" : "min-w-0"}
                delay={100}
              >
                <VillaCarousel name={villa.name} images={villa.gallery} />
              </Reveal>
              <Reveal className={index % 2 === 1 ? "lg:order-1" : undefined}>
                <div>
                  <div className="flex items-baseline gap-4">
                    <span className="font-heading text-5xl text-border md:text-6xl">
                      {villa.number}
                    </span>
                    <div>
                      <h3 className="font-heading text-3xl md:text-4xl">
                        {villa.name}
                      </h3>
                      <p className="mt-1 text-sm font-medium uppercase tracking-[0.16em] text-terracotta">
                        {villa.tagline}
                      </p>
                    </div>
                  </div>
                  <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">
                    {villa.description}
                  </p>
                  <ul className="mt-6 flex max-w-lg flex-wrap gap-2">
                    {villa.specs.map((spec) => (
                      <li key={spec}>
                        <Badge
                          variant="outline"
                          className="border-border bg-shell/60 px-3 py-1 text-[0.7rem] uppercase tracking-wide text-foreground/80"
                        >
                          {spec}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                  {villa.note && (
                    <p className="mt-4 flex items-center gap-2 text-sm text-palm">
                      <Sparkles className="size-4 text-sun" />
                      {villa.note}
                    </p>
                  )}
                  <div className="mt-8 flex flex-wrap gap-3">
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
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section
      id="experience"
      className="grain relative overflow-hidden bg-palm-deep py-24 text-primary-foreground md:py-32"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sun">
              The Laguna way
            </p>
            <h2 className="font-heading mt-5 text-4xl leading-tight md:text-5xl">
              Your stay extends far beyond the villa walls
            </h2>
            <p className="mt-6 leading-relaxed text-primary-foreground/70">
              Personalized trip planning, exclusive recommendations and
              connections to the island&rsquo;s best workshops and attractions
              — plus a few indulgences you shouldn&rsquo;t skip.
            </p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {SERVICES.map((service, index) => (
            <Reveal key={service.title} delay={index * 130}>
              <div className="group overflow-hidden rounded-md border border-primary-foreground/10 bg-primary-foreground/5">
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(min-width: 768px) 30vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-2xl">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-primary-foreground/70">
                    {service.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <p className="mt-12 border-t border-primary-foreground/15 pt-6 text-center text-xs uppercase tracking-[0.2em] text-primary-foreground/60">
            Complimentary with every villa — 2 SUP boards · kayak · trip
            planning · local connections
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Hosts() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <Reveal>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
              About the hosts
            </p>
            <h2 className="font-heading mt-5 text-4xl leading-tight md:text-5xl">
              Meet <em className="italic text-palm">Mia &amp; Theo</em>
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
              A dynamic couple with extensive experience in real estate and the
              culinary world, Mia and Theo crafted their dream into reality by
              building Laguna Bay Villas — and they delight in welcoming
              guests to the splendor of the island.
            </p>
            <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
              Committed to the best possible experience, they make sure every
              stay is filled with luxury, comfort and memorable moments. Ask
              them anything — from the best pad thai in the harbour town to a
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
        <Reveal delay={150}>
          <div className="relative mx-auto max-w-sm">
            <div className="absolute -inset-3 -rotate-2 rounded-md bg-sand" />
            <Image
              src={hostsImg}
              alt="Mia and Theo on the beach at Laguna"
              width={720}
              height={960}
              sizes="(min-width: 1024px) 32vw, 80vw"
              className="relative rotate-1 rounded-md border-4 border-shell object-cover shadow-xl"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="border-y border-border bg-sand/60 py-24 md:py-32">
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
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {REVIEWS.map((review, index) => (
            <Reveal key={review.author} delay={index * 100}>
              <Card className="h-full">
                <CardContent className="flex h-full flex-col p-7">
                  <span
                    aria-hidden
                    className="font-heading text-5xl leading-none text-sun"
                  >
                    &ldquo;
                  </span>
                  <blockquote className="mt-2 flex-1 leading-relaxed text-foreground/85">
                    {review.quote}
                  </blockquote>
                  <footer className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <div>
                      <div className="font-heading text-lg">{review.author}</div>
                      {review.date && (
                        <div className="text-xs text-muted-foreground">
                          {review.date}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-0.5 text-sun">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="size-3.5 fill-current" />
                      ))}
                    </div>
                  </footer>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Location() {
  return (
    <section id="location" className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
              In the area
            </p>
            <h2 className="font-heading mt-5 text-4xl leading-tight md:text-5xl">
              The quiet side of <em className="italic text-palm">the island</em>
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
              Laguna sits on the island&rsquo;s quiet western shore — a
              tranquil beach of soft white sand and majestic boulders, three
              minutes from the harbour town&rsquo;s night markets, restaurants and
              ferries, and ninety seconds from the nearest 7-Eleven.
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
          <div className="grid gap-4">
            <Image src={area1Img} alt="The bay from above" width={1200} height={800} sizes="(min-width: 1024px) 50vw, 100vw" className="h-72 w-full rounded-md object-cover md:h-80" />
            <div className="grid grid-cols-2 gap-4">
              <Image
                src={area1Img}
                alt="Aerial view of the Half Moon Bay coastline"
                width={620}
                height={960}
                sizes="(min-width: 1024px) 24vw, 50vw"
                className="aspect-[4/5] w-full rounded-md object-cover"
              />
              <Image
                src={area3Img}
                alt="The beach in front of Laguna Villas"
                width={620}
                height={960}
                sizes="(min-width: 1024px) 24vw, 50vw"
                className="aspect-[4/5] w-full rounded-md object-cover"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="border-t border-border bg-sand/60 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
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
                  <Button key={platform.label} asChild variant="outline" size="sm">
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

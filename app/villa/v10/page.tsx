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
import { VillaCarousel } from "@/components/layouts/villa/villa-carousel";
import { cn } from "@/lib/utils";
import { LINKS, REVIEWS, VILLAS, serviceChef, serviceMassage, serviceSup, heroImg,about1Img,about2Img,about3Img,areaBeachImg,hostsImg,area1Img,area2Img,area3Img,area4Img } from "@/lib/layouts/laguna";
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
  title: "Villa Layout 10 — Chapters",
  robots: { index: false },
};

export default function ChaptersLayout() {
  return (
    <div id="top" className={`${fraunces.variable} ${karla.variable} laguna-theme flex min-h-dvh flex-col bg-background text-foreground`}>
      <Nav theme="solid" />
      <main className="flex-1">
        <Intro />
        <AboutChapter />
        <VillaChapters />
        <ExperienceChapter />
        <HostsChapter />
        <Reviews />
        <InstagramFeed className="border-t border-border" />
        <Location />
        <Contact />
      </main>
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

/**
 * Split-screen chapter: a full-height photo pins to one side while the
 * content column scrolls past it. Collapses to image-then-content on mobile.
 */
function Chapter({
  image,
  alt,
  flip = false,
  children,
  id,
}: {
  image: string;
  alt: string;
  flip?: boolean;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="grid border-b border-border lg:grid-cols-2">
      <div className={cn("min-w-0", flip && "lg:order-2")}>
        <div className="grain relative h-[44vh] min-h-[18rem] lg:sticky lg:top-0 lg:h-screen">
          <Image
            src={image}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
      <div
        className={cn(
          "flex min-w-0 flex-col justify-center px-5 py-20 md:px-12 lg:min-h-screen lg:py-28 xl:px-20",
          flip && "lg:order-1",
        )}
      >
        {children}
      </div>
    </section>
  );
}

function ChapterEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-terracotta">
      <span className="inline-block h-px w-10 bg-terracotta" />
      {children}
    </p>
  );
}

function Intro() {
  return (
    <section className="grid border-b border-border lg:grid-cols-2">
      <div className="min-w-0">
        <div className="grain relative h-[48vh] min-h-[20rem] lg:sticky lg:top-0 lg:h-screen">
          <Image
            src={heroImg}
            alt="Infinity pool over the bay at Laguna Bay Villas"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-6 lg:p-10">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/85">
              Half Moon Bay · Tropical Island
            </p>
          </div>
        </div>
      </div>
      <div className="flex min-w-0 flex-col justify-center px-5 py-20 md:px-12 lg:min-h-screen lg:py-32 xl:px-20">
        <Reveal>
          <ChapterEyebrow>Chapter 01 — Arrival</ChapterEyebrow>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="font-heading mt-6 text-5xl leading-[1.04] md:text-6xl">
            A story written
            <br />
            on the <em className="italic text-palm">quiet shore</em>.
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
            Five private pool villas where breathtaking nature meets stylish
            design — large boulders, soft white sand and 365 days of stunning
            sunsets, minutes from the harbour town.
          </p>
        </Reveal>
        <Reveal delay={360}>
          <div id="book" className="mt-10 rounded-md border border-border bg-shell p-5 shadow-lg shadow-palm/5 md:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-heading text-xl">Plan your stay</h2>
              <span className="flex items-center gap-2 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                <span className="inline-block size-2 animate-pulse rounded-full bg-sun" />
                Live availability
              </span>
            </div>
            <BookingCalendar displayClass="font-heading" villas={VILLAS} theme={BOOKING_THEME} />
          </div>
        </Reveal>
        <Reveal delay={460}>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <MessageCircle className="size-4 text-terracotta" />
            Prefer to talk?{" "}
            <a
              href={LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline underline-offset-4 hover:text-palm"
            >
              WhatsApp us
            </a>{" "}
            — we answer in seconds.
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function AboutChapter() {
  return (
    <Chapter
      id="about"
      image={about1Img}
      alt="Open-plan living room with stone wall and sea breeze"
      flip
    >
      <Reveal>
        <ChapterEyebrow>Chapter 02 — The place</ChapterEyebrow>
      </Reveal>
      <Reveal delay={120}>
        <h2 className="font-heading mt-6 text-4xl leading-tight md:text-5xl">
          Where breathtaking nature meets{" "}
          <em className="italic text-palm">stylish design</em>
        </h2>
      </Reveal>
      <Reveal delay={220}>
        <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
          Fully equipped four-bedroom villas only two minutes from the harbour town,
          with private salt pools and direct beach access where the shore
          unfolds in giant boulders and golden light. We are not just villas —
          expect all the comfort a hotel can provide, and much more.
        </p>
      </Reveal>
      <Reveal delay={320}>
        <div className="mt-8 grid max-w-md grid-cols-2 gap-4">
          <Image
            src={about2Img}
            alt="Stone bathroom with hexagonal tiles"
            width={960}
            height={1280}
            sizes="(min-width: 1024px) 14rem, 45vw"
            className="aspect-[3/4] w-full rounded-md object-cover"
          />
          <Image
            src={about3Img}
            alt="Villa bedroom opening to the terrace"
            width={960}
            height={1280}
            sizes="(min-width: 1024px) 14rem, 45vw"
            className="aspect-[3/4] w-full rounded-md object-cover"
          />
        </div>
      </Reveal>
      <Reveal delay={400}>
        <dl className="mt-10 grid max-w-md grid-cols-3 divide-x divide-border border-y border-border py-5 text-center">
          <div>
            <dt className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
              Villas
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
              Sunsets
            </dt>
            <dd className="font-heading mt-1 text-2xl">365</dd>
          </div>
        </dl>
      </Reveal>
    </Chapter>
  );
}

function VillaChapters() {
  return (
    <div id="villas">
      {VILLAS.map((villa, index) => (
        <Chapter
          key={villa.slug}
          image={villa.cover}
          alt={`${villa.name} — ${villa.tagline}`}
          flip={index % 2 === 0}
        >
          <Reveal>
            <ChapterEyebrow>
              Chapter {String(index + 3).padStart(2, "0")} — Villa{" "}
              {villa.number} of 05
            </ChapterEyebrow>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="font-heading mt-6 text-4xl leading-tight md:text-5xl">
              {villa.name}
            </h2>
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.16em] text-palm">
              {villa.tagline}
            </p>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
              {villa.description}
            </p>
          </Reveal>
          <Reveal delay={300}>
            <ul className="mt-5 flex max-w-md flex-wrap gap-2">
              {villa.specs.map((spec) => (
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
            {villa.note && (
              <p className="mt-4 flex items-center gap-2 text-sm text-palm">
                <Sparkles className="size-4 text-sun" />
                {villa.note}
              </p>
            )}
          </Reveal>
          <Reveal delay={380} className="min-w-0">
            <div className="mt-8">
              <VillaCarousel name={villa.name} images={villa.gallery} />
            </div>
          </Reveal>
          <Reveal delay={440}>
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
          </Reveal>
        </Chapter>
      ))}
    </div>
  );
}

function ExperienceChapter() {
  return (
    <Chapter
      id="experience"
      image={serviceSup}
      alt="Paddle boarding on the calm bay in front of Laguna"
      flip
    >
      <Reveal>
        <ChapterEyebrow>Chapter 08 — The Laguna way</ChapterEyebrow>
      </Reveal>
      <Reveal delay={120}>
        <h2 className="font-heading mt-6 text-4xl leading-tight md:text-5xl">
          Your stay extends far beyond the villa walls
        </h2>
      </Reveal>
      <Reveal delay={220}>
        <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
          Personalized trip planning, exclusive recommendations and connections
          to the island&rsquo;s best workshops and attractions — plus a few
          indulgences you shouldn&rsquo;t skip.
        </p>
      </Reveal>
      <div className="mt-10 space-y-8">
        {[
          {
            image: serviceChef,
            title: "In-villa chef",
            body: "Thai classics or family favourites, cooked in your own kitchen. Wake up to breakfast on the terrace or book a private dinner as the sun drops.",
          },
          {
            image: serviceMassage,
            title: "Massage & wellness",
            body: "Traditional Thai or oil massage on your own deck, steps from the water. We bring the therapists — you don't move a muscle.",
          },
        ].map((service, index) => (
          <Reveal key={service.title} delay={300 + index * 100}>
            <div className="flex max-w-lg items-start gap-5">
              <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-md md:w-28">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="7rem"
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-heading text-2xl">{service.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {service.body}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={520}>
        <p className="mt-10 max-w-md border-t border-border pt-5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Complimentary with every villa — 2 SUP boards · kayak · trip planning
        </p>
      </Reveal>
    </Chapter>
  );
}

function HostsChapter() {
  return (
    <Chapter image={hostsImg} alt="Mia and Theo on the beach at Laguna">
      <Reveal>
        <ChapterEyebrow>Chapter 09 — Your hosts</ChapterEyebrow>
      </Reveal>
      <Reveal delay={120}>
        <h2 className="font-heading mt-6 text-4xl leading-tight md:text-5xl">
          Meet <em className="italic text-palm">Mia &amp; Theo</em>
        </h2>
      </Reveal>
      <Reveal delay={220}>
        <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
          A dynamic couple with extensive experience in real estate and the
          culinary world, Mia and Theo crafted their dream into reality by
          building Laguna Bay Villas — and they delight in welcoming
          guests to the splendor of the island.
        </p>
        <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
          Committed to the best possible experience, they make sure every stay
          is filled with luxury, comfort and memorable moments.
        </p>
      </Reveal>
      <Reveal delay={320}>
        <blockquote className="font-heading mt-8 max-w-md border-l-2 border-sun pl-5 text-2xl italic leading-snug">
          &ldquo;We&rsquo;re not just hosting, we&rsquo;re crafting
          memories.&rdquo;
        </blockquote>
      </Reveal>
      <Reveal delay={400}>
        <Button asChild variant="outline" size="lg" className="mt-8 self-start">
          <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer">
            <MessageCircle data-icon="inline-start" />
            Say hello
          </a>
        </Button>
      </Reveal>
    </Chapter>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="border-b border-border bg-sand/60 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
                Chapter 10 — Guest reviews
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
                      <div className="font-heading text-lg">
                        {review.author}
                      </div>
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
    <section id="location" className="border-t border-border">
      <div className="grid lg:grid-cols-2">
        <div className="relative">
          <Image src={area1Img} alt="The bay from above" width={1200} height={800} sizes="(min-width: 1024px) 50vw, 100vw" className="h-72 w-full rounded-md object-cover md:h-80" />
        </div>
        <div className="flex flex-col justify-center px-5 py-20 md:px-12 lg:py-28 xl:px-20">
          <Reveal>
            <ChapterEyebrow>Chapter 11 — In the area</ChapterEyebrow>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="font-heading mt-6 text-4xl leading-tight md:text-5xl">
              The quiet side of{" "}
              <em className="italic text-palm">the island</em>
            </h2>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
              Laguna sits on the island&rsquo;s quiet western shore — a
              tranquil beach of soft white sand and majestic boulders, three
              minutes from the harbour town&rsquo;s night markets, restaurants and
              ferries.
            </p>
            <ul className="mt-7 grid max-w-md gap-3 text-sm">
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
          </Reveal>
          <Reveal delay={320}>
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
          </Reveal>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-px border-t border-border bg-border md:grid-cols-5">
        {[
          { src: areaBeachImg, alt: "Boulders and white sand on Half Moon beach" },
          { src: area1Img, alt: "Aerial view of the Half Moon Bay coastline" },
          { src: area2Img, alt: "Sunset over the boulders at Half Moon Bay" },
          { src: area3Img, alt: "The beach in front of Laguna Villas" },
          { src: area4Img, alt: "Longtail boats off the western shore" },
        ].map((img, index) => (
          <div
            key={img.src}
            className={cn(
              "relative aspect-square",
              index === 0 && "col-span-2 md:col-span-1",
            )}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(min-width: 768px) 20vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
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
            <ChapterEyebrow>Chapter 12 — Contact</ChapterEyebrow>
            <h2 className="font-heading mt-6 text-4xl leading-tight md:text-5xl">
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

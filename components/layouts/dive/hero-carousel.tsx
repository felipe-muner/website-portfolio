"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Compass, Fish, ShoppingBag, Waves } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const ABYSS = "#04263b";

type Cta = { label: string; href: string; internal?: boolean };

interface Slide {
  image: string;
  alt: string;
  accent: string;
  zoom: "in" | "out";
  origin: string;
  Icon: typeof Waves;
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  subtitle: string;
  primary: Cta;
  secondary: Cta;
}

const SLIDES: Slide[] = [
  {
    image: "/img/layouts/dive-fish-school.jpg",
    alt: "A diver below a school of fish",
    accent: "#2ed3e8",
    zoom: "in",
    origin: "center",
    Icon: Fish,
    eyebrow: "5-star dive centre · est. 2012",
    titleTop: "Your first breath",
    titleAccent: "underwater",
    subtitle:
      "Small groups, patient pros and thirty years of reef on our doorstep — from your very first bubbles to instructor level.",
    primary: { label: "Find your course", href: "#courses" },
    secondary: { label: "Shop dive gear", href: "/dive/shop", internal: true },
  },
  {
    image: "/img/layouts/dive-diver-blue.jpg",
    alt: "A diver descending into deep blue water",
    accent: "#5ef0c4",
    zoom: "out",
    origin: "top",
    Icon: Compass,
    eyebrow: "This week's dive sites",
    titleTop: "Barracuda walls",
    titleAccent: "at Sail Rock",
    subtitle:
      "The gulf's best pinnacle, glassy conditions and the famous chimney — book the boat and drop straight onto it.",
    primary: { label: "See the sites", href: "#sites" },
    secondary: { label: "The boat schedule", href: "#boat" },
  },
  {
    image: "/img/layouts/dive-reef.jpg",
    alt: "A vivid coral reef",
    accent: "#ff8a5b",
    zoom: "in",
    origin: "bottom",
    Icon: ShoppingBag,
    eyebrow: "Gear shop · powered by Aquamaster",
    titleTop: "Kit up with",
    titleAccent: "the best brands",
    subtitle:
      "Masks, fins, regs and computers our instructors actually dive — Oceanic, Aqua Lung, Atomic and more, delivered island-wide.",
    primary: { label: "Shop the gear", href: "/dive/shop", internal: true },
    secondary: { label: "Find your course", href: "#courses" },
  },
  {
    image: "/img/layouts/dive-turtle.jpg",
    alt: "A green sea turtle over coral",
    accent: "#ffcf5c",
    zoom: "out",
    origin: "center",
    Icon: Waves,
    eyebrow: "Turtle Cove · glassy conditions",
    titleTop: "Turtles on",
    titleAccent: "every dive",
    subtitle:
      "Resident green turtles over easy coral gardens — the gentlest checkout dive on the island, and a diver's favourite.",
    primary: { label: "Discover scuba", href: "#courses" },
    secondary: { label: "Find us", href: "#find-us" },
  },
];

const AUTOPLAY_MS = 6000;

export function HeroCarousel() {
  const [autoplay] = useState(() =>
    Autoplay({ delay: AUTOPLAY_MS, stopOnInteraction: false, stopOnMouseEnter: true }),
  );
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <section className="relative">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[autoplay]}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {SLIDES.map((slide, i) => {
            const active = i === selected;
            // Staggered reveal that holds the "from" state through the delay
            // (fill-mode: both) so buttons/text never flash before animating.
            const reveal = (delay: number): React.CSSProperties =>
              active
                ? { animation: `landing-fade-down 0.5s ease-out ${delay}ms both` }
                : { opacity: 0 };
            return (
              <CarouselItem key={slide.image} className="pl-0">
                <div className="relative flex min-h-dvh items-center overflow-hidden pt-16">
                  {/* Background image with per-slide zoom */}
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    priority={i === 0}
                    sizes="100vw"
                    className={cn(
                      "object-cover opacity-55",
                      slide.zoom === "in" ? "animate-dive-kb-in" : "animate-dive-kb-out",
                    )}
                    style={{ transformOrigin: slide.origin }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, ${slide.accent}1f 0%, ${ABYSS}cc 55%, ${ABYSS}f2 100%)`,
                    }}
                  />

                  {/* Content — re-animates each time its slide becomes active */}
                  <div className="relative mx-auto w-full max-w-5xl px-5 text-center md:px-10">
                    <p
                      className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.35em] sm:text-sm"
                      style={{ color: slide.accent, ...reveal(0) }}
                    >
                      <slide.Icon className="size-4" />
                      {slide.eyebrow}
                    </p>
                    <h1
                      className="mt-6 text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl md:text-8xl"
                      style={reveal(110)}
                    >
                      {slide.titleTop}
                      <br />
                      <span className="font-light italic" style={{ color: slide.accent }}>
                        {slide.titleAccent}
                      </span>
                    </h1>
                    <p
                      className="mx-auto mt-7 max-w-xl text-base font-light leading-relaxed text-white/85 sm:text-lg"
                      style={reveal(220)}
                    >
                      {slide.subtitle}
                    </p>
                    <div
                      className="mt-10 flex flex-wrap justify-center gap-4"
                      style={reveal(330)}
                    >
                      <CtaButton cta={slide.primary} accent={slide.accent} filled />
                      <CtaButton cta={slide.secondary} accent={slide.accent} />
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* Prev / next arrows */}
      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => api?.scrollPrev()}
        className="absolute left-3 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-[#04263b]/50 text-white backdrop-blur transition hover:border-[#2ed3e8] hover:text-[#2ed3e8] md:left-6 md:size-12"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => api?.scrollNext()}
        className="absolute right-3 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-[#04263b]/50 text-white backdrop-blur transition hover:border-[#2ed3e8] hover:text-[#2ed3e8] md:right-6 md:size-12"
      >
        <ChevronRight className="size-5" />
      </button>

      {/* Dots + progress */}
      <div className="absolute inset-x-0 bottom-7 z-20 flex items-center justify-center gap-3">
        {SLIDES.map((slide, i) => {
          const active = i === selected;
          return (
            <button
              key={slide.image}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className="group relative h-1.5 overflow-hidden rounded-full transition-all"
              style={{
                width: active ? 44 : 18,
                backgroundColor: active ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.35)",
              }}
            >
              {active && (
                <span
                  key={`prog-${selected}`}
                  className="absolute inset-y-0 left-0 block w-full origin-left rounded-full"
                  style={{
                    backgroundColor: slide.accent,
                    animation: `slideshow-progress ${AUTOPLAY_MS}ms linear both`,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function CtaButton({ cta, accent, filled }: { cta: Cta; accent: string; filled?: boolean }) {
  const className = filled
    ? "rounded-full px-8 py-3.5 text-base font-bold text-[#04263b] transition-transform hover:scale-[1.03] sm:px-9 sm:py-4"
    : "rounded-full border border-white/35 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:border-white sm:px-9 sm:py-4";
  const style = filled ? { backgroundColor: accent } : undefined;

  return cta.internal ? (
    <Link href={cta.href} className={className} style={style}>
      {cta.label}
    </Link>
  ) : (
    <a href={cta.href} className={className} style={style}>
      {cta.label}
    </a>
  );
}

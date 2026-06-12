"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export function VillaCarousel({
  name,
  images,
}: {
  name: string;
  images: readonly string[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const thumbsRef = useRef<HTMLDivElement>(null);

  // Keep the active thumbnail in view as the user flips through slides.
  // Skipped on mount — scrollIntoView would otherwise drag the whole page
  // down to the last carousel on load.
  const didMount = useRef(false);
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    const thumb = thumbsRef.current?.children[current];
    thumb?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [current]);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => api?.scrollTo(index),
    [api],
  );

  return (
    <div>
      <Carousel setApi={setApi} opts={{ loop: true }} className="group">
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={src}>
              <div className="grain relative aspect-[4/3] overflow-hidden rounded-md">
                <Image
                  src={src}
                  alt={`${name} — photo ${index + 1} of ${images.length}`}
                  fill
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="object-cover"
                  loading={index === 0 ? undefined : "lazy"}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          variant="ghost"
          className="left-3 -mt-5 size-10 translate-y-0 border-none bg-shell/85 text-foreground opacity-0 shadow-md backdrop-blur transition-opacity hover:bg-shell/85 focus-visible:opacity-100 group-hover:opacity-100"
        />
        <CarouselNext
          variant="ghost"
          className="right-3 -mt-5 size-10 translate-y-0 border-none bg-shell/85 text-foreground opacity-0 shadow-md backdrop-blur transition-opacity hover:bg-shell/85 focus-visible:opacity-100 group-hover:opacity-100"
        />
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-foreground/60 px-3 py-1 text-[0.65rem] font-medium tracking-[0.18em] text-shell backdrop-blur">
          {String(current + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
      </Carousel>

      <div ref={thumbsRef} className="-mx-1 mt-2 flex gap-2 overflow-x-auto scroll-p-1 p-1">
        {images.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => scrollTo(index)}
            aria-label={`Show photo ${index + 1} of ${name}`}
            className={cn(
              "relative aspect-[4/3] w-16 shrink-0 cursor-pointer overflow-hidden rounded-sm transition-opacity md:w-20",
              index === current
                ? "ring-2 ring-terracotta ring-offset-1 ring-offset-sand"
                : "opacity-55 hover:opacity-90",
            )}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

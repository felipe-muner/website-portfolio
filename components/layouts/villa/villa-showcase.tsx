"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VillaCarousel } from "@/components/layouts/villa/villa-carousel";
import { LINKS, VILLAS } from "@/lib/layouts/laguna";
import { cn } from "@/lib/utils";

/**
 * Scroll-pinned villa index. The panel sticks to the viewport while the
 * section spans one screen-height per villa: scrolling steps through the
 * villas one by one, and only after the last villa does the page move on.
 * Clicking/tapping a name jumps the scroll to that villa's segment. Desktop
 * shows the full name list beside the gallery; mobile shows a compact pinned
 * card with number pills so everything fits one phone screen.
 */
export function VillaShowcase() {
  const [active, setActive] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const count = VILLAS.length;
  const villa = VILLAS[active];

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = wrapper.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        if (scrollable <= 0) return;
        const progress = Math.min(Math.max(-rect.top / scrollable, 0), 1);
        setActive(Math.min(count - 1, Math.floor(progress * count)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [count]);

  // Land in the middle of the villa's scroll segment so the scroll handler
  // agrees with the selection.
  const select = useCallback(
    (index: number) => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const scrollable = wrapper.offsetHeight - window.innerHeight;
      const top = wrapper.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: top + ((index + 0.5) / count) * scrollable,
        behavior: "smooth",
      });
    },
    [count],
  );

  return (
    <div
      ref={wrapperRef}
      style={
        { "--showcase-height": `${count * 100}dvh` } as React.CSSProperties
      }
      className="h-[var(--showcase-height)]"
    >
      <div className="sticky top-20 flex h-[calc(100dvh-5rem)] items-center overflow-hidden">
        {/* Mobile: compact pinned card */}
        <div className="my-auto w-full lg:hidden">
          <div className="flex gap-2">
            {VILLAS.map((v, index) => (
              <button
                key={v.slug}
                type="button"
                onClick={() => select(index)}
                aria-pressed={index === active}
                aria-label={`Show ${v.name}`}
                className={cn(
                  "flex-1 cursor-pointer rounded-sm border px-1 py-2 text-center font-heading text-sm transition-colors",
                  index === active
                    ? "border-terracotta bg-terracotta text-primary-foreground"
                    : "border-border bg-shell/60 text-foreground/50",
                )}
              >
                {v.name.replace(/^(Villa|Suite)\s+/, "")}
              </button>
            ))}
          </div>
          <div
            key={villa.slug}
            className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-heading text-3xl">{villa.name}</h3>
              <span className="text-[0.6rem] font-medium uppercase tracking-[0.14em] text-terracotta">
                {villa.tagline}
              </span>
            </div>
            <div className="mt-3 min-w-0">
              <VillaCarousel name={villa.name} images={villa.gallery} />
            </div>
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {villa.description}
            </p>
            <div className="mt-4 flex gap-3">
              <Button asChild size="sm" className="flex-1">
                <a href="#book">Check availability</a>
              </Button>
              <Button asChild variant="outline" size="sm" className="flex-1">
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
        </div>

        {/* Desktop: full name list beside the gallery */}
        <div className="hidden w-full gap-10 lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div className="flex flex-col self-center">
            {VILLAS.map((v, index) => (
              <button
                key={v.slug}
                type="button"
                onClick={() => select(index)}
                aria-pressed={index === active}
                className={cn(
                  "group flex cursor-pointer items-baseline gap-4 border-b border-border py-4 text-left transition-colors",
                  index === active
                    ? "text-foreground"
                    : "text-foreground/40 hover:text-foreground/75",
                )}
              >
                <span
                  className={cn(
                    "text-xs font-semibold tracking-[0.2em]",
                    index === active && "text-terracotta",
                  )}
                >
                  {v.number}
                </span>
                <span className="font-heading text-2xl md:text-3xl">
                  {v.name}
                </span>
                <span
                  className={cn(
                    "ml-auto hidden text-[0.65rem] uppercase tracking-[0.16em] sm:block",
                    index === active
                      ? "text-terracotta"
                      : "opacity-0 transition-opacity group-hover:opacity-60",
                  )}
                >
                  {index === active ? v.tagline : "View"}
                </span>
              </button>
            ))}

            <div
              key={villa.slug}
              className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
                {villa.description}
              </p>
              <ul className="mt-4 flex max-w-lg flex-wrap gap-2">
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
                <p className="mt-3 flex items-center gap-2 text-sm text-palm">
                  <Sparkles className="size-4 text-sun" />
                  {villa.note}
                </p>
              )}
              <div className="mt-5 flex flex-wrap gap-3">
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
          </div>

          <div
            key={villa.slug}
            className="min-w-0 self-center animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <VillaCarousel name={villa.name} images={villa.gallery} />
          </div>
        </div>
      </div>
    </div>
  );
}

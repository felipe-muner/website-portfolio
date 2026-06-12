"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LINKS } from "@/lib/layouts/laguna";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "The Villas", href: "#villas" },
  { label: "Experience", href: "#experience" },
  { label: "Reviews", href: "#reviews" },
  { label: "Location", href: "#location" },
  { label: "Contact", href: "#contact" },
];

export function Nav({
  theme = "light",
}: {
  theme?: "light" | "overlay" | "solid";
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // Over a fullscreen photo hero the bar starts transparent with white
  // chrome, then falls back to the regular light style once scrolled.
  // "solid" keeps the opaque blurred bar even at the top, for layouts whose
  // hero imagery would otherwise swallow the logo and links.
  const onPhoto = theme === "overlay" && !scrolled;
  const solid = scrolled || theme === "solid";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 md:px-10">
        <Link href="#top" aria-label="Laguna Bay Villas — home">
          <span className={cn("font-heading text-2xl tracking-wide", onPhoto ? "text-white" : "text-foreground")}>Laguna<span className="text-terracotta">.</span></span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "text-[0.8rem] font-medium uppercase tracking-[0.14em] transition-colors",
                onPhoto
                  ? "text-white/75 hover:text-white"
                  : "text-foreground/70 hover:text-foreground",
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button
            asChild
            variant="ghost"
            size="lg"
            className={cn(
              onPhoto &&
                "text-white hover:bg-white/10 hover:text-white",
            )}
          >
            <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </Button>
          <Button asChild size="lg" className="px-5">
            <a href="#book">Check availability</a>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className={cn("cursor-pointer lg:hidden", onPhoto && "text-white")}
              aria-label="Open menu"
            >
              <Menu className="size-6" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="top"
            className="gap-0 border-border bg-background/95 p-0 backdrop-blur-md lg:hidden"
          >
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Site navigation
            </SheetDescription>
            <div className="flex h-20 items-center px-5">
              <span className="font-heading text-2xl tracking-wide">Laguna<span className="text-terracotta">.</span></span>
            </div>
            <nav className="flex flex-col px-5 pb-8">
              {NAV_ITEMS.map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="font-heading flex items-baseline gap-4 border-b border-border/60 py-4 text-3xl text-foreground"
                >
                  <span className="text-xs font-medium tracking-[0.18em] text-terracotta">
                    0{index + 1}
                  </span>
                  {item.label}
                </a>
              ))}
              <div className="mt-8 flex gap-3">
                <Button asChild size="lg" className="flex-1">
                  <a href="#book" onClick={() => setOpen(false)}>
                    Check availability
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="flex-1">
                  <a
                    href={LINKS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

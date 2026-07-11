"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import logoImg from "@/public/img/layouts/biosphere-logo.png";
import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

const PAPER = "#f4efe4";
const INK = "#243122";
const CLAY = "#b3572f";
const HAIRLINE = "rgba(36, 49, 34, 0.16)";
const MUTED = "rgba(36, 49, 34, 0.7)";

/** Mirrors biosphere.asia's menu: About ▾, Projects ▾, Contact, Events. */
const MENU = [
  {
    label: "About",
    items: [
      { label: "Main", href: "#top" },
      { label: "About the studio", href: "#about" },
    ],
  },
  {
    label: "Projects",
    items: [
      { label: "La Casa — The Fibonacci", href: "#la-casa" },
      { label: "The Bay", href: "#the-bay" },
    ],
  },
  { label: "Contact", href: "#contact" },
  { label: "Events", href: "#events" },
] as const;

/** Three bars that morph into an X while the sheet is open. */
function BurgerIcon({ open }: { open: boolean }) {
  const bar = "absolute h-[1.5px] w-5 rounded-full bg-current transition-all duration-300";
  return (
    <span className="relative grid size-5 place-items-center" aria-hidden>
      <span className={`${bar} ${open ? "rotate-45" : "-translate-y-[6px]"}`} />
      <span className={`${bar} ${open ? "scale-x-0 opacity-0" : ""}`} />
      <span className={`${bar} ${open ? "-rotate-45" : "translate-y-[6px]"}`} />
    </span>
  );
}

export function BiosphereNav({
  serifClass,
  ctaHref = "#visit",
}: {
  serifClass: string;
  ctaHref?: string;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  return (
    // Above the sheet overlay (z-50) so the burger stays visible while open.
    <header
      className="sticky top-0 z-[60] border-b backdrop-blur-md"
      style={{ borderColor: HAIRLINE, backgroundColor: "rgba(244, 239, 228, 0.88)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#top" className="flex items-center gap-3" style={{ color: INK }}>
          <Image
            src={logoImg}
            alt=""
            width={36}
            height={36}
            priority
            className="size-9"
          />
          <span className={`${serifClass} text-lg tracking-[0.28em]`}>BIOSPHERE</span>
        </a>

        {/* Desktop: same four options as the live site */}
        <nav className="hidden items-center gap-2 text-sm md:flex" style={{ color: MUTED }}>
          {MENU.map((entry) =>
            "items" in entry ? (
              <Popover
                key={entry.label}
                open={openMenu === entry.label}
                onOpenChange={(open) => setOpenMenu(open ? entry.label : null)}
              >
                <PopoverTrigger className="group flex items-center gap-1.5 rounded-full px-3.5 py-2 font-medium transition-colors hover:text-[#243122] data-[state=open]:text-[#243122]">
                  {entry.label}
                  <ChevronDown className="size-3.5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  sideOffset={10}
                  className="w-60 rounded-lg border p-2 shadow-lg"
                  style={{ backgroundColor: PAPER, borderColor: HAIRLINE }}
                >
                  <ul>
                    {entry.items.map((item) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          onClick={() => setOpenMenu(null)}
                          className="block rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-[#243122]/5"
                          style={{ color: INK }}
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </PopoverContent>
              </Popover>
            ) : (
              <a
                key={entry.label}
                href={entry.href}
                className="rounded-full px-3.5 py-2 font-medium transition-colors hover:text-[#243122]"
              >
                {entry.label}
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={ctaHref}
            className="hidden rounded-full px-5 py-2.5 text-sm font-medium text-[#f4efe4] transition hover:opacity-90 sm:inline-block"
            style={{ backgroundColor: CLAY }}
          >
            Walk the land
          </a>

          {/* Mobile: sheet menu behind a morphing burger/X */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <button
              ref={burgerRef}
              type="button"
              aria-expanded={sheetOpen}
              aria-label={sheetOpen ? "Close menu" : "Open menu"}
              onClick={() => setSheetOpen((o) => !o)}
              // pointer-events-auto: Radix locks body pointer events while
              // the sheet is open; this keeps the X clickable to close.
              className="pointer-events-auto grid size-10 place-items-center rounded-full transition-colors hover:bg-[#243122]/5 md:hidden"
              style={{ color: INK }}
            >
              <BurgerIcon open={sheetOpen} />
            </button>
            <SheetContent
              side="right"
              showCloseButton={false}
              // Keep toggle semantics on the burger: block the auto-close so
              // the button's own onClick is the single source of truth.
              onInteractOutside={(event) => {
                if (burgerRef.current?.contains(event.target as Node)) event.preventDefault();
              }}
              // The burger is not a Radix trigger, so restore focus to it
              // ourselves — the default would drop focus on <body>.
              onCloseAutoFocus={(event) => {
                event.preventDefault();
                burgerRef.current?.focus();
              }}
              className="w-4/5 max-w-xs border-l"
              style={{ backgroundColor: PAPER, borderColor: HAIRLINE, color: INK }}
            >
              <SheetTitle className="sr-only">Menu</SheetTitle>
              {/* Keyboard/screen-reader close: the visible X lives outside the
                  focus trap, so the dialog needs its own control. Appears on
                  keyboard focus, invisible to pointer users. */}
              <SheetClose className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:right-5 focus-visible:top-5 focus-visible:z-10 focus-visible:rounded-full focus-visible:bg-[#243122]/10 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm">
                Close menu
              </SheetClose>
              <Image
                src={logoImg}
                alt=""
                width={40}
                height={40}
                className="absolute left-7 top-5 size-10"
              />
              <nav className="flex h-full flex-col gap-7 overflow-y-auto px-7 pb-8 pt-20">
                {MENU.map((entry) =>
                  "items" in entry ? (
                    <div key={entry.label}>
                      <p
                        className="text-[0.65rem] font-semibold uppercase tracking-[0.28em]"
                        style={{ color: MUTED }}
                      >
                        {entry.label}
                      </p>
                      <ul className="mt-2.5 space-y-1">
                        {entry.items.map((item) => (
                          <li key={item.href}>
                            <a
                              href={item.href}
                              onClick={() => setSheetOpen(false)}
                              className={`${serifClass} block py-1 text-2xl transition-colors hover:text-[#b3572f]`}
                            >
                              {item.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <a
                      key={entry.label}
                      href={entry.href}
                      onClick={() => setSheetOpen(false)}
                      className={`${serifClass} text-2xl transition-colors hover:text-[#b3572f]`}
                    >
                      {entry.label}
                    </a>
                  ),
                )}
                <a
                  href={ctaHref}
                  onClick={() => setSheetOpen(false)}
                  className="mt-auto rounded-full px-6 py-3.5 text-center text-sm font-medium text-[#f4efe4]"
                  style={{ backgroundColor: CLAY }}
                >
                  Walk the land
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

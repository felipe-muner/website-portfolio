"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const LINKS = [
  { href: "#templates", label: "Templates" },
  { href: "#how", label: "How it works" },
  { href: "#contact", label: "Contact" },
] as const;

/**
 * Portfolio header nav: pill buttons on desktop, hamburger + shadcn Sheet on
 * mobile. Sheet links close the drawer first and scroll after its exit
 * animation — scrolling while Radix still holds the body scroll-lock kills
 * the smooth scroll mid-flight.
 */
export function PortfolioNav() {
  const [open, setOpen] = useState(false);

  function onSheetLinkClick(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault();
    setOpen(false);
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => {
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      window.history.pushState(null, "", href);
    }, 300);
  }

  return (
    <>
      {/* Desktop */}
      <nav className="ml-auto hidden items-center gap-2 sm:flex">
        {LINKS.slice(0, -1).map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="rounded-full border border-[#d6dee1] px-4 py-2 text-sm font-semibold text-[#0c2340] transition hover:border-[#0c2340] hover:bg-[#0c2340] hover:text-white"
          >
            {link.label}
          </a>
        ))}
        <a
          href="#contact"
          className="rounded-full bg-[#0c2340] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ff5a3c]"
        >
          Contact
        </a>
      </nav>

      {/* Mobile */}
      <div className="ml-auto sm:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open menu"
              className="grid size-10 place-items-center rounded-lg border border-[#d6dee1] text-[#0c2340] transition hover:bg-[#f4f6f6]"
            >
              <Menu className="size-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 border-[#e3e8ea] bg-white">
            <SheetHeader>
              <SheetTitle className="text-left text-[#0c2340]">Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2 px-4 pb-4">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => onSheetLinkClick(e, link.href)}
                  className="rounded-xl border border-[#e3e8ea] px-4 py-3 text-base font-semibold text-[#0c2340] transition hover:border-[#0c2340] hover:bg-[#0c2340] hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

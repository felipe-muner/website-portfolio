"use client";

import { useState, type CSSProperties } from "react";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface MobileMenuLink {
  label: string;
  href: string;
}

/**
 * Mobile nav sheet shared by the biosphere template variants. Each template
 * passes its own palette and typography; the behavior is identical: burger
 * trigger, drawer from the right, and close-before-scroll so Radix's body
 * scroll-lock doesn't kill the smooth scroll mid-flight.
 */
export function BiosphereMobileMenu({
  links,
  cta,
  triggerColor,
  panelStyle,
  linkClassName = "",
  ctaClassName = "",
  ctaStyle,
  hiddenFrom = "md",
}: {
  links: readonly MobileMenuLink[];
  cta?: MobileMenuLink;
  triggerColor: string;
  /** backgroundColor / color / borderColor of the drawer. */
  panelStyle: CSSProperties;
  linkClassName?: string;
  ctaClassName?: string;
  ctaStyle?: CSSProperties;
  /** Breakpoint where the host page's desktop nav takes over. */
  hiddenFrom?: "md" | "lg";
}) {
  const [open, setOpen] = useState(false);

  function onLinkClick(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (!href.startsWith("#")) return;
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className={`grid size-10 place-items-center rounded-full transition-opacity hover:opacity-70 ${
            hiddenFrom === "lg" ? "lg:hidden" : "md:hidden"
          }`}
          style={{ color: triggerColor }}
        >
          <Menu className="size-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-4/5 max-w-xs border-l" style={panelStyle}>
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <nav className="flex h-full flex-col gap-5 overflow-y-auto px-7 pb-8 pt-16">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => onLinkClick(e, link.href)}
              className={`${linkClassName} transition-opacity hover:opacity-70`}
            >
              {link.label}
            </a>
          ))}
          {cta && (
            <a
              href={cta.href}
              onClick={(e) => onLinkClick(e, cta.href)}
              className={`mt-auto ${ctaClassName}`}
              style={ctaStyle}
            >
              {cta.label}
            </a>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

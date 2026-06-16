"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu } from "lucide-react";
import { COACH_NAV } from "@/lib/layouts/coaching";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * Shared header for the Jörg Panek site. `overlay` sits transparently over the
 * home hero (light text); `solid` is a sticky light bar for inner pages.
 */
export function CoachSiteNav({ variant = "solid" }: { variant?: "overlay" | "solid" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overlay = variant === "overlay";

  // Scroll-aware chrome: over the hero the bar is see-through; once you leave the
  // top it fades into a tinted, blurred, semi-transparent bar so the image/content
  // behind stays visible.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On the home hero, light text throughout. On inner pages text stays dark.
  const lightText = overlay;

  const isActive = (href: string) =>
    href === "/coaching" ? pathname === href : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "inset-x-0 top-0 z-50 w-full font-[family-name:var(--font-sans-mulish)] transition-colors duration-500 ease-out",
        // Home: float fixed over the hero. Inner pages: sticky so content reserves space.
        overlay ? "fixed" : "sticky",
        lightText ? "text-[#f4efe4]" : "text-[#33302a]",
        // Over the hero (overlay, at the very top): fully transparent.
        overlay && !scrolled && "bg-transparent",
        // Overlay, scrolled: frosted-glass "bottle" effect — translucent forest
        // tint over a strong backdrop blur, so the image reads soft behind it.
        overlay && scrolled && "bg-[#1e2922]/80 backdrop-blur-lg shadow-[0_12px_30px_-14px_rgba(0,0,0,0.55)]",
        // Inner pages: translucent light bar so the page tints through.
        !overlay && "border-b border-black/10 bg-[#f4efe4]/85 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
        {/* Wordmark */}
        <Link href="/coaching" className="leading-tight">
          <span className="block font-[family-name:var(--font-serif)] text-xl font-medium tracking-tight">
            Jörg Panek
          </span>
          <span className={cn("block max-w-[14rem] text-[0.7rem] leading-snug", overlay ? "text-[#f4efe4]/70" : "text-black/55")}>
            Traumasensible und Nervensystemorientierte Begleitung
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 text-sm lg:flex">
          {COACH_NAV.map((item) =>
            item.children ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 py-2 transition",
                    isActive(item.href) ? "font-semibold" : "opacity-80 hover:opacity-100",
                  )}
                >
                  {item.label}
                  <ChevronDown className="size-3.5 transition group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute left-0 top-full w-60 translate-y-1 rounded-2xl border border-black/10 bg-white p-2 text-[#33302a] opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className={cn(
                        "block rounded-xl px-4 py-2.5 text-sm transition hover:bg-[#f0e9da]",
                        pathname === c.href && "bg-[#f0e9da] font-semibold",
                      )}
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : item.href === "/coaching/termin" ? (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-5 py-2 font-semibold transition",
                  overlay
                    ? "border border-[#f4efe4]/30 hover:bg-[#f4efe4]/10"
                    : "bg-[#2c3a30] text-[#f4efe4] hover:brightness-110",
                )}
              >
                {item.label}
              </Link>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "py-2 transition",
                  isActive(item.href) ? "font-semibold" : "opacity-80 hover:opacity-100",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        {/* Mobile menu — shadcn Sheet */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger aria-label="Menü öffnen" className="lg:hidden">
            <Menu className="size-6" />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[88vw] max-w-sm border-l-0 bg-[#f4efe4] font-[family-name:var(--font-sans-mulish)] text-[#33302a]"
          >
            <SheetHeader className="border-b border-black/10">
              <SheetTitle className="text-left font-[family-name:var(--font-serif)] text-2xl font-medium text-[#2c3a30]">
                Jörg Panek
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col overflow-y-auto px-4 pb-8">
              {COACH_NAV.map((item) => (
                <div key={item.href} className="border-b border-black/5 py-1">
                  <SheetClose asChild>
                    <Link href={item.href} className="block py-2.5 text-lg font-medium">
                      {item.label}
                    </Link>
                  </SheetClose>
                  {item.children && (
                    <div className="pb-2 pl-3">
                      {item.children.map((c) => (
                        <SheetClose asChild key={c.href}>
                          <Link href={c.href} className="block py-1.5 text-sm text-black/65">
                            {c.label}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <SheetClose asChild>
                <Link
                  href="/coaching/termin"
                  className="mt-6 flex items-center justify-center rounded-full bg-[#2c3a30] px-6 py-3.5 text-sm font-semibold text-[#f4efe4]"
                >
                  Termin vereinbaren
                </Link>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

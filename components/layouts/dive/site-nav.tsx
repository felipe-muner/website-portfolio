"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart, Waves } from "lucide-react";
import { useCart } from "@/lib/layouts/dive/cart";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const ABYSS = "#04263b";
const CYAN = "#2ed3e8";

const LINKS = [
  { href: "/dive#courses", label: "Courses" },
  { href: "/dive#sites", label: "Dive sites" },
  { href: "/dive/shop", label: "Shop" },
  { href: "/dive#boat", label: "The boat" },
  { href: "/dive#find-us", label: "Find us" },
];

export function DiveNav() {
  const pathname = usePathname();
  const { count, hydrated } = useCart();
  const [open, setOpen] = useState(false);
  const inShop = pathname.startsWith("/dive/shop");

  // The owner dashboard is a full-screen admin view with its own chrome.
  if (pathname.startsWith("/dive/dashboard")) return null;

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 backdrop-blur"
      style={{ backgroundColor: `${ABYSS}cc` }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:px-10">
        <Link href="/dive" className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
          <Waves className="size-5" style={{ color: CYAN }} />
          Aqua Sport Supply
        </Link>

        <nav className="hidden gap-8 text-sm font-semibold md:flex" style={{ color: "#ffffffb3" }}>
          {LINKS.slice(0, 4).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "transition-colors hover:text-[#2ed3e8]",
                l.href === "/dive/shop" && inShop && "text-[#2ed3e8]",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/dive/cart"
            aria-label="Cart"
            className="relative inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-[#2ed3e8]/60"
          >
            <ShoppingCart className="size-5" />
            {hydrated && count > 0 && (
              <span
                className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full px-1 text-[0.65rem] font-bold"
                style={{ backgroundColor: CYAN, color: ABYSS }}
              >
                {count}
              </span>
            )}
          </Link>

          <Link
            href="/dive/shop"
            className="hidden rounded-full px-6 py-2.5 text-sm font-bold text-[#04263b] transition-shadow hover:shadow-[0_0_24px_rgba(46,211,232,0.5)] md:inline-flex"
            style={{ backgroundColor: CYAN }}
          >
            Shop gear
          </Link>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-[#2ed3e8]/60 md:hidden"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[82vw] max-w-xs border-white/10 text-white"
              style={{ backgroundColor: ABYSS }}
            >
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-left text-lg font-bold text-white">
                  <Waves className="size-5" style={{ color: CYAN }} />
                  Aqua Sport Supply
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col px-4 pb-8">
                {LINKS.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="border-b border-white/10 py-3.5 text-lg font-medium text-white/85 transition-colors hover:text-[#2ed3e8]"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}

                <SheetClose asChild>
                  <Link
                    href="/dive/cart"
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
                  >
                    <ShoppingCart className="size-4" />
                    View cart{hydrated && count > 0 ? ` (${count})` : ""}
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/dive/shop"
                    className="mt-3 rounded-full px-6 py-3 text-center text-sm font-bold text-[#04263b]"
                    style={{ backgroundColor: CYAN }}
                  >
                    Shop gear
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

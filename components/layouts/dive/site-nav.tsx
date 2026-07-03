"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Waves } from "lucide-react";
import { useCart } from "@/lib/layouts/dive/cart";
import { cn } from "@/lib/utils";

const ABYSS = "#04263b";
const CYAN = "#2ed3e8";

const LINKS = [
  { href: "/dive#courses", label: "Courses" },
  { href: "/dive#sites", label: "Dive sites" },
  { href: "/dive/shop", label: "Shop" },
  { href: "/dive#boat", label: "The boat" },
];

export function DiveNav() {
  const pathname = usePathname();
  const { count, hydrated } = useCart();
  const inShop = pathname.startsWith("/dive/shop");

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
          {LINKS.map((l) => (
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
            className="hidden rounded-full px-6 py-2.5 text-sm font-bold text-[#04263b] transition-shadow hover:shadow-[0_0_24px_rgba(46,211,232,0.5)] sm:inline-flex"
            style={{ backgroundColor: CYAN }}
          >
            Shop gear
          </Link>
        </div>
      </div>
    </header>
  );
}

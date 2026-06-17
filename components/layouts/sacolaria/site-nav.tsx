"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Search, ShoppingCart } from "lucide-react";
import { CATEGORIES } from "@/lib/layouts/sacolaria/catalog";
import { useCart } from "@/lib/layouts/sacolaria/cart";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV = [
  { href: "/sacolaria", label: "Início" },
  { href: "/sacolaria/produtos", label: "Produtos" },
  { href: "/sacolaria#contato", label: "Contato" },
];

export function SacolariaNav() {
  const pathname = usePathname();
  const { count, hydrated } = useCart();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/sacolaria" ? pathname === href : pathname.startsWith(href.split("#")[0]);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e7e3d8] bg-white/90 font-[family-name:var(--font-sans-inter)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3.5 sm:px-6">
        {/* Wordmark */}
        <Link href="/sacolaria" className="flex shrink-0 items-center gap-2">
          <span className="grid size-9 place-items-center rounded-lg bg-[#0b3d2e] text-sm font-black text-[#f5c518]">
            SB
          </span>
          <span className="leading-tight">
            <span className="block text-base font-extrabold tracking-tight text-[#0b3d2e]">
              Sacolaria Brasil
            </span>
            <span className="block text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[#8a8f84]">
              Sacolas plásticas no atacado
            </span>
          </span>
        </Link>

        {/* Busca (desktop) */}
        <div className="ml-2 hidden flex-1 lg:block">
          <div className="flex items-center gap-2 rounded-full border border-[#e2ddd0] bg-[#f6f4ee] px-4 py-2 text-sm text-[#8a8f84]">
            <Search className="size-4" />
            <span>Buscar sacolas por tamanho ou modelo…</span>
          </div>
        </div>

        {/* Nav desktop */}
        <nav className="ml-auto hidden items-center gap-6 text-sm font-medium lg:flex">
          {NAV.map((item) =>
            item.label === "Produtos" ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 py-2 transition",
                    isActive(item.href) ? "text-[#0b3d2e]" : "text-[#4b4f47] hover:text-[#0b3d2e]",
                  )}
                >
                  Produtos
                  <ChevronDown className="size-3.5 transition group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute left-0 top-full w-64 translate-y-1 rounded-2xl border border-[#e7e3d8] bg-white p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <Link
                    href="/sacolaria/produtos"
                    className="block rounded-xl px-4 py-2.5 text-sm font-semibold text-[#0b3d2e] hover:bg-[#f1efe7]"
                  >
                    Ver todas as sacolas
                  </Link>
                  {CATEGORIES.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/sacolaria/produtos?categoria=${c.slug}`}
                      className="block rounded-xl px-4 py-2.5 text-sm text-[#4b4f47] hover:bg-[#f1efe7]"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "py-2 transition",
                  isActive(item.href) ? "text-[#0b3d2e]" : "text-[#4b4f47] hover:text-[#0b3d2e]",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        {/* Carrinho */}
        <Link
          href="/sacolaria/carrinho"
          aria-label="Carrinho"
          className="relative ml-auto inline-flex size-10 items-center justify-center rounded-full bg-[#0b3d2e] text-white transition hover:bg-[#0e5440] lg:ml-0"
        >
          <ShoppingCart className="size-5" />
          {hydrated && count > 0 && (
            <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-[#f5c518] px-1 text-[0.65rem] font-bold text-[#0b3d2e]">
              {count}
            </span>
          )}
        </Link>

        {/* Menu mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger aria-label="Abrir menu" className="lg:hidden">
            <Menu className="size-6 text-[#0b3d2e]" />
          </SheetTrigger>
          <SheetContent side="right" className="w-[86vw] max-w-sm bg-white">
            <SheetHeader className="border-b border-[#e7e3d8]">
              <SheetTitle className="text-left text-xl font-extrabold text-[#0b3d2e]">
                Sacolaria Brasil
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col px-4 pb-8">
              {NAV.map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className="border-b border-[#f0ede4] py-3 text-lg font-medium text-[#23261f]"
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
              <p className="mt-5 mb-1 text-xs font-semibold uppercase tracking-wider text-[#8a8f84]">
                Categorias
              </p>
              {CATEGORIES.map((c) => (
                <SheetClose asChild key={c.slug}>
                  <Link
                    href={`/sacolaria/produtos?categoria=${c.slug}`}
                    className="py-2 text-sm text-[#4b4f47]"
                  >
                    {c.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

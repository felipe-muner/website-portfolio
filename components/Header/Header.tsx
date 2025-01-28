"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { APP_NAME } from "@/constants";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavItems } from "./NavItems";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About us" },
  {
    href: "/classes",
    label: "Fitness Classes",
    children: [
      { label: "Classes Schedule", href: "/classes" },
      { label: "Breathwork & Ice Bath", href: "/classes/breathwork-ice-bath" },
      { label: "HIIT Classes", href: "/classes/hiit" },
      { label: "Pilates Mobility", href: "/classes/pilates-mobility" },
      { label: "Tabata", href: "/classes/tabata" },
    ],
  },
  { href: "/prices", label: "Prices" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-between bg-black px-4 md:px-8">
      {/* 1) Hamburger trigger on the left */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="p-2 text-white scale-110">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </SheetTrigger>

        {/* 2) The sheet that slides in from the left */}
        <SheetContent side="left" className="p-0 bg-white">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="text-lg">Menu</SheetTitle>
          </SheetHeader>

          {/* Nav items with link click handler */}
          <nav className="flex flex-col p-2">
            <NavItems navItems={NAV_ITEMS} onLinkClick={handleLinkClick} />
          </nav>
        </SheetContent>
      </Sheet>

      {/* 3) Centered logo */}
      <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Image src="/img/logo.png" alt={APP_NAME} width={300} height={60} />
      </Link>

      {/* Right side can be empty or add something else if needed */}
      <div className="w-6" />
    </header>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { APP_NAME } from "@/constants";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavItems } from "./NavItems";

const NAV_ITEMS = [
  {
    href: "/the-club",
    label: "The Gym",
    children: [
      { label: "Overview", href: "/the-club/overview" },
      { label: "Equipment", href: "/the-club/equipment" },
      { label: "Calisthenics", href: "/the-club/calisthenics" },
      { label: "Ice Bath & Steam Room", href: "/the-club/ice-bath-and-steam-room" },
      { label: "Protein Bar & Shop", href: "/the-club/protein-bar-and-shop" },
    ],
  },
  {
    href: "/crossfit-and-hyrox",
    label: "CrossFit & Hyrox",
    children: [
      { label: "Schedule", href: "/crossfit-and-hyrox/schedule" },
      { label: "WOD", href: "/crossfit-and-hyrox/wod" },
      { label: "Team WOD", href: "/crossfit-and-hyrox/team-wod" },
      { label: "Gymnastics", href: "/crossfit-and-hyrox/gymnastics" },
      { label: "Weightlifting", href: "/crossfit-and-hyrox/weightlifting" },
      { label: "Mobility", href: "/crossfit-and-hyrox/mobility" },
      { label: "Hyrox", href: "/crossfit-and-hyrox/hyrox" },
    ],
  },
  {
    href: "/reformer-pilates",
    label: "Reformer Pilates",
    children: [
      { label: "Schedule", href: "/reformer-pilates" },
      { label: "Book Online", href: "/reformer-pilates#book" },
    ],
  },
  { href: "/schedule", label: "Schedule" },
  { href: "/our-team", label: "Our Team" },
  { href: "/prices", label: "Prices" },
  {
    href: "/contact",
    label: "Contact",
    children: [
      { label: "Gym | Reformer Pilates | Fitness Classes | Pravilo", href: "/contact" },
      { label: "CrossFit", href: "/contact-crossfit" },
      { label: "Brazilian Jiu-Jitsu", href: "/brazilian-jiu-jitsu" },
    ],
  },
  {
    href: "/personal-training",
    label: "Personal Trainers",
    children: [
      { label: "Alex 🇷🇺", href: "/personal-training/alex" },
      { label: "Charlene 🇬🇧", href: "/personal-training/charlene" },
      { label: "Daniel 🇬🇧 🇮🇱", href: "/personal-training/daniel" },
      { label: "Diana 🇬🇧 🇩🇪", href: "/personal-training/diana" },
      { label: "Kate 🇬🇧 🇹🇭", href: "/personal-training/kate" },
      { label: "Namwan 🇬🇧 🇹🇭", href: "/personal-training/namwan" },
    ],
  },
  {
    href: "/classes",
    label: "Fitness Classes",
    children: [
      { label: "Schedule", href: "/classes" },
      { label: "Pilates Mobility", href: "/classes/pilates-mobility" },
      { label: "HIIT", href: "/classes/hiit" },
      { label: "Boot Camp", href: "/classes/boot-camp" },
      { label: "Tabata", href: "/classes/tabata" },
      { label: "Primal Power Yoga", href: "/classes/primal-power-yoga" },
      { label: "Maximum Mobility", href: "/classes/max-power-mobility" },
    ],
  },
  {
    href: "/brazilian-jiu-jitsu",
    label: "Brazilian Jiu-Jitsu",
    children: [
      { label: "Schedule", href: "/brazilian-jiu-jitsu/schedule" },
    ],
  },
  {
    href: "/pravilo",
    label: "Pravilo",
    children: [
      { label: "Schedule", href: "/pravilo/schedule" },
    ],
  },
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

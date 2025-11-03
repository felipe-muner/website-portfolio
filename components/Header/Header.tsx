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
    label: "🏋️‍♀️ The Gym",
    children: [
      { label: "Overview", href: "/the-club/overview" },
      { label: "Equipment", href: "/the-club/equipment" },
      { label: "Calisthenics", href: "/the-club/calisthenics" },
      { label: "Ice Bath & Steam Room", href: "/the-club/ice-bath-and-steam-room" },
      { label: "Protein Bar & Shop", href: "/the-club/protein-bar-and-shop" },
    ],
  },
  {
    href: "/reformer-pilates",
    label: "🧘‍♀️ Reformer Pilates",
    children: [
      { label: "Schedule", href: "/schedule#reformer-schedule" },
      { label: "Book Online", href: "/reformer-pilates#book" },
      { label: "The Team", href: "#", children: [
        { label: "Michal", href: "/coaches-trainers/michal" },
        { label: "Mook", href: "/coaches-trainers/mook" },
        { label: "Vanessa", href: "/coaches-trainers/vanessa" },
      ]},
    ],
  },
  {
    href: "/crossfit-and-hyrox",
    label: "💪 CrossFit & Hyrox",
    children: [
      { label: "Schedule", href: "/schedule#crossfit-schedule" },
      { label: "WOD", href: "/crossfit-and-hyrox/wod" },
      { label: "Team WOD", href: "/crossfit-and-hyrox/team-wod" },
      { label: "Gymnastics", href: "/crossfit-and-hyrox/gymnastics" },
      { label: "Weightlifting", href: "/crossfit-and-hyrox/weightlifting" },
      { label: "Mobility", href: "/crossfit-and-hyrox/mobility" },
      { label: "Hyrox", href: "/crossfit-and-hyrox/hyrox" },
      { label: "The Team", href: "#", children: [
        { label: "Charlene", href: "/coaches-trainers/charlene" },
        { label: "Daniel", href: "/coaches-trainers/daniel" },
        { label: "Diana", href: "/coaches-trainers/diana" },
        { label: "Kate", href: "/coaches-trainers/kate" },
      ]},
    ],
  },
  {
    href: "/classes",
    label: "🏃‍♀️ Fitness Classes",
    children: [
      { label: "Schedule", href: "/schedule#fitness-schedule" },
      { label: "Pilates Mobility — Vanessa", href: "/coaches-trainers/vanessa" },
      { label: "HIIT — Steve", href: "/coaches-trainers/steve" },
      { label: "Boot Camp — Diana", href: "/coaches-trainers/diana" },
      { label: "Tabata — Steve", href: "/coaches-trainers/steve" },
      { label: "Primal Moves — Jace", href: "/coaches-trainers/jace" },
      { label: "Maximum Mobility — Charlene", href: "/coaches-trainers/charlene" },
    ],
  },
  {
    href: "/brazilian-jiu-jitsu",
    label: "🤼 Brazilian Jiu-Jitsu",
    children: [
      { label: "Schedule", href: "/schedule#bjj-schedule" },
      { label: "The Team", href: "#", children: [
        { label: "Jamie", href: "/coaches-trainers/jamie" },
      ]},
    ],
  },
  {
    href: "/pravilo",
    label: "🪢 Právílo",
    children: [
      { label: "Schedule", href: "/schedule#pravilo-schedule" },
      { label: "The Team", href: "#", children: [
        { label: "Micha", href: "/coaches-trainers/micha" },
      ]},
    ],
  },
  {
    href: "/coaches-trainers",
    label: "🧍‍♀️ Coaches & Trainers",
    children: [
      { label: "🏋️ Personal Trainers (1-on-1)", href: "#", children: [
        { label: "Alex — Gym 🇬🇧 English", href: "/coaches-trainers/alex" },
        { label: "Charlene — Hyrox & Gym 🇬🇧 English", href: "/coaches-trainers/charlene" },
        { label: "Code — Gym 🇹🇭 Thai", href: "/coaches-trainers/code" },
        { label: "Daniel — CrossFit 🇮🇱 Hebrew / 🇬🇧 English", href: "/coaches-trainers/daniel" },
        { label: "Diana — Gym & CrossFit 🇩🇪 German / 🇬🇧 English", href: "/coaches-trainers/diana" },
        { label: "Emil — Gym 🇵🇱 Polish", href: "/coaches-trainers/emil" },
        { label: "Eugene — Gym 🇷🇺 Russian", href: "/coaches-trainers/eugene" },
        { label: "Jamie — BJJ 🇬🇧 English", href: "/coaches-trainers/jamie" },
        { label: "Kate — CrossFit & Gym 🇹🇭 Thai / 🇬🇧 English", href: "/coaches-trainers/kate" },
        { label: "Micha — Právílo 🇷🇺 Russian", href: "/coaches-trainers/micha" },
        { label: "Michal — Reformer Pilates 🇬🇧 English", href: "/coaches-trainers/michal" },
        { label: "Namwan — Gym 🇹🇭 Thai / 🇬🇧 English", href: "/coaches-trainers/namwan" },
        { label: "Vanessa — Reformer Pilates 🇬🇧 English / Afrikaans", href: "/coaches-trainers/vanessa" },
      ]},
      { label: "👩‍🏫 Group Class Coaches", href: "#", children: [
        { label: "Reformer Pilates", href: "#", children: [
          { label: "Michal", href: "/coaches-trainers/michal" },
          { label: "Mook", href: "/coaches-trainers/mook" },
          { label: "Vanessa", href: "/coaches-trainers/vanessa" },
        ]},
        { label: "CrossFit & Hyrox", href: "#", children: [
          { label: "Charlene", href: "/coaches-trainers/charlene" },
          { label: "Daniel", href: "/coaches-trainers/daniel" },
          { label: "Diana", href: "/coaches-trainers/diana" },
          { label: "Kate", href: "/coaches-trainers/kate" },
        ]},
        { label: "Fitness Classes", href: "#", children: [
          { label: "Charlene — Maximum Mobility", href: "/coaches-trainers/charlene" },
          { label: "Diana — Boot Camp", href: "/coaches-trainers/diana" },
          { label: "Jace — Primal Moves", href: "/coaches-trainers/jace" },
          { label: "Steve — HIIT & Tabata", href: "/coaches-trainers/steve" },
          { label: "Vanessa — Pilates Mobility", href: "/coaches-trainers/vanessa" },
        ]},
        { label: "BJJ", href: "#", children: [
          { label: "Jamie", href: "/coaches-trainers/jamie" },
        ]},
      ]},
    ],
  },
  { href: "/schedule", label: "📅 Schedule" },
  { href: "/prices", label: "💰 Prices" },
  { href: "/contact", label: "☎️ Contact" },
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
        <SheetContent side="left" className="p-0 bg-white flex flex-col h-full">
          <SheetHeader className="p-4 border-b flex-shrink-0">
            <SheetTitle className="text-lg">Menu</SheetTitle>
          </SheetHeader>

          {/* Nav items with link click handler - scrollable area */}
          <nav className="flex flex-col p-2 overflow-y-auto flex-1">
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

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
        { label: "Elena", href: "/coaches-trainers/elena" },
        { label: "Ploy", href: "/coaches-trainers/ploy" },
        { label: "Sofia", href: "/coaches-trainers/sofia" },
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
        { label: "Clara", href: "/coaches-trainers/clara" },
        { label: "Leo", href: "/coaches-trainers/leo" },
        { label: "Mara", href: "/coaches-trainers/mara" },
        { label: "Nina", href: "/coaches-trainers/nina" },
      ]},
    ],
  },
  {
    href: "/classes",
    label: "🏃‍♀️ Fitness Classes",
    children: [
      { label: "Schedule", href: "/schedule#fitness-schedule" },
      { label: "Pilates Mobility", href: "/classes/pilates-mobility" },
      { label: "HIIT", href: "/classes/hiit" },
      { label: "Boot Camp", href: "/classes/boot-camp" },
      { label: "Tabata", href: "/classes/tabata" },
      { label: "Primal Moves", href: "/classes/primal-power-yoga" },
      { label: "Maximum Mobility", href: "/classes/max-power-mobility" },
    ],
  },
  {
    href: "/brazilian-jiu-jitsu",
    label: "🤼 Brazilian Jiu-Jitsu",
    children: [
      { label: "Schedule", href: "/schedule#bjj-schedule" },
      { label: "The Team", href: "#", children: [
        { label: "Rhys", href: "/coaches-trainers/rhys" },
      ]},
    ],
  },
  {
    href: "/pravilo",
    label: "🪢 Právílo",
    children: [
      { label: "Schedule", href: "/schedule#pravilo-schedule" },
      { label: "The Team", href: "#", children: [
        { label: "Yuri", href: "/coaches-trainers/yuri" },
      ]},
    ],
  },
  {
    href: "/coaches-trainers",
    label: "🧍‍♀️ Coaches & Trainers",
    children: [
      { label: "🏋️ Personal Trainers (1-on-1)", href: "#", children: [
        { label: "Noah — Gym 🇬🇧 English", href: "/coaches-trainers/noah" },
        { label: "Clara — Hyrox & Gym 🇬🇧 English", href: "/coaches-trainers/clara" },
        { label: "Kai — Gym 🇹🇭 Thai", href: "/coaches-trainers/kai" },
        { label: "Leo — CrossFit 🇮🇱 Hebrew / 🇬🇧 English", href: "/coaches-trainers/leo" },
        { label: "Mara — Gym & CrossFit 🇩🇪 German / 🇬🇧 English", href: "/coaches-trainers/mara" },
        { label: "Oskar — Gym 🇵🇱 Polish", href: "/coaches-trainers/oskar" },
        { label: "Ivan — Gym 🇷🇺 Russian", href: "/coaches-trainers/ivan" },
        { label: "Rhys — BJJ 🇬🇧 English", href: "/coaches-trainers/rhys" },
        { label: "Nina — CrossFit & Gym 🇹🇭 Thai / 🇬🇧 English", href: "/coaches-trainers/nina" },
        { label: "Yuri — Právílo 🇷🇺 Russian", href: "/coaches-trainers/yuri" },
        { label: "Elena — Reformer Pilates 🇬🇧 English", href: "/coaches-trainers/elena" },
        { label: "Fah — Gym 🇹🇭 Thai / 🇬🇧 English", href: "/coaches-trainers/fah" },
        { label: "Sofia — Reformer Pilates 🇬🇧 English / Afrikaans", href: "/coaches-trainers/sofia" },
      ]},
      { label: "👩‍🏫 Group Class Coaches", href: "#", children: [
        { label: "Reformer Pilates", href: "#", children: [
          { label: "Elena", href: "/coaches-trainers/elena" },
          { label: "Ploy", href: "/coaches-trainers/ploy" },
          { label: "Sofia", href: "/coaches-trainers/sofia" },
        ]},
        { label: "CrossFit & Hyrox", href: "#", children: [
          { label: "Clara", href: "/coaches-trainers/clara" },
          { label: "Leo", href: "/coaches-trainers/leo" },
          { label: "Mara", href: "/coaches-trainers/mara" },
          { label: "Nina", href: "/coaches-trainers/nina" },
        ]},
        { label: "Fitness Classes", href: "#", children: [
          { label: "Clara — Maximum Mobility", href: "/coaches-trainers/clara" },
          { label: "Mara — Boot Camp", href: "/coaches-trainers/mara" },
          { label: "Theo — Primal Moves", href: "/coaches-trainers/theo" },
          { label: "Owen — HIIT & Tabata", href: "/coaches-trainers/owen" },
          { label: "Sofia — Pilates Mobility", href: "/coaches-trainers/sofia" },
        ]},
        { label: "BJJ", href: "#", children: [
          { label: "Rhys", href: "/coaches-trainers/rhys" },
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
        <Image
          src="/img/logo.png"
          alt={APP_NAME}
          width={300}
          height={60}
          priority
          style={{ width: "auto", height: "auto" }}
        />
      </Link>

      {/* Right side can be empty or add something else if needed */}
      <div className="w-6" />
    </header>
  );
}

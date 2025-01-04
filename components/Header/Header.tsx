import Link from "next/link";

import { NavItem } from "./NavItem";
import { MobileNavbar } from "./MobileNavbar";
import { MobileNavItem } from "./MobileNavItem";
import { APP_NAME } from "@/constants";
import Image from "next/image";

const Header: React.FC = () => {
  return (
    <header className="absolute top-0 left-0 z-50 flex w-full items-center justify-between gap-10 p-4 md:p-[32px]">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src='/img/logo.png'
          alt={APP_NAME}
          width={182}
          height={41}
        />
      </Link>
      <div className="flex items-center gap-10">
        <nav className="hidden items-center gap-10 md:flex justify-end font-oswald">
          <NavItem href="/" label="Home" />
          <NavItem href="/about-us" label="About us" />
          <NavItem href="/classes" label="Classes" />
          <NavItem href="/pricing" label="Pricing" />
          <NavItem href="/contact" label="Contact" />
        </nav>
      </div>
      <MobileNavbar>
        <div className="rounded-b-lg bg-background py-4 text-foreground shadow-xl z-50">
          <nav className="flex flex-col gap-1 pt-2 uppercase">
            <MobileNavItem href="/" label="Home" />
            <MobileNavItem href="/about-us" label="About us" />
            <MobileNavItem href="/classes" label="Classes" />
            <MobileNavItem href="/pricing" label="Pricing" />
            <MobileNavItem href="/contact" label="Contact" />
          </nav>
        </div>
      </MobileNavbar>
    </header>
  );
};

export default Header;
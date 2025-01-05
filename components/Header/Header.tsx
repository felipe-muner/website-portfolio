import Link from "next/link";
import Image from "next/image";
import { NavItem } from "./NavItem";
import { MobileNavbar } from "./MobileNavbar";
import { MobileNavItem } from "./MobileNavItem";
import { APP_NAME } from "@/constants";

/** 1. Shared nav items */
const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About us" },
  { href: "/classes", label: "Classes" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

/** 2. Desktop Navigation extracted into its own component */
const DesktopNavigation: React.FC<{ navItems: typeof NAV_ITEMS }> = ({ navItems }) => {
  return (
    <nav className="hidden items-center gap-10 md:flex justify-end">
      {navItems.map(({ href, label }) => (
        <NavItem key={href} href={href} label={label} />
      ))}
    </nav>
  );
};

/** 3. Mobile Navigation extracted into its own component */
const MobileNavMenu: React.FC<{ navItems: typeof NAV_ITEMS }> = ({ navItems }) => {
  return (
    <div className="rounded-b-lg bg-brand-background-2 py-4 text-foreground shadow-xl z-50">
      <nav className="flex flex-col gap-1 pt-2 uppercase">
        {navItems.map(({ href, label }) => (
          <MobileNavItem key={href} href={href} label={label} />
        ))}
      </nav>
    </div>
  );
};

const Header: React.FC = () => {
  return (
    <header className="absolute top-0 left-0 z-50 flex w-full items-center justify-between gap-10 p-4 md:p-[32px]">
      {/* Logo / Brand */}
      <Link href="/" className="flex items-center gap-3">
        <Image src="/img/logo.png" alt={APP_NAME} width={182} height={41} />
      </Link>

      {/* Desktop Nav */}
      <DesktopNavigation navItems={NAV_ITEMS} />

      {/* Mobile Nav */}
      <MobileNavbar>
        <MobileNavMenu navItems={NAV_ITEMS} />
      </MobileNavbar>
    </header>
  );
};

export default Header;

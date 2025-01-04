'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface NavItemProps {
  label: string;
  href: string;
  className?: string;
}

export function NavItem({ label, href, className }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex cursor-pointer items-center font-medium text-md tracking-[1px] uppercase transition-colors",
        isActive
          ? "text-brand-orange underline underline-offset-8"
          : "text-white hover:text-brand-orange",
        className
      )}
    >
      {label}
    </Link>
  );
}

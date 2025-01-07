'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface MobileNavItemProps {
  label: string;
  href: string;
  className?: string;
}

export function MobileNavItem({ label, href, className }: MobileNavItemProps) {
  const pathname = usePathname();
  const isActive =
    href === "/blog"
      ? pathname.startsWith("/blog")
      : pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex w-full cursor-pointer items-center rounded-md p-2 px-10 font-medium text-brand-gray-darkest",
        isActive ? "text-brand-orange" : "bg-brand-background-2",
        className,
      )}
    >
      {label}
    </Link>
  );
}
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface INavItem {
  href: string;
  label: string;
  children?: { label: string; href: string }[];
}

interface NavItemsProps {
  navItems: INavItem[];
}

export function NavItems({ navItems }: NavItemsProps) {
  const pathname = usePathname();

  return (
    <>
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <div key={item.href} className="flex flex-col">
            <Link
              href={item.href}
              className={cn(
                "block w-full p-3 text-base font-medium transition-colors",
                isActive ? "bg-gray-200 text-brand-orange" : "text-gray-700 hover:bg-gray-50"
              )}
            >
              {item.label}
            </Link>

            {/* If you have children, show them here (e.g. an indented list) */}
            {item.children?.map((child) => {
              const childActive = pathname === child.href;
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className={cn(
                    "ml-4 mt-1 block p-2 text-sm transition-colors rounded",
                    childActive
                      ? "bg-gray-200 text-brand-orange"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  — {child.label}
                </Link>
              );
            })}
          </div>
        );
      })}
    </>
  );
}

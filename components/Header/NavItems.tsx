"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface INavItem {
  href: string;
  label: string;
  children?: { label: string; href: string }[];
}

interface NavItemsProps {
  navItems: INavItem[];
  onLinkClick?: () => void; // Added prop
}

export function NavItems({ navItems, onLinkClick }: NavItemsProps) {
  const pathname = usePathname();
  const [expandedParents, setExpandedParents] = React.useState<Record<string, boolean>>({});

  const handleToggle = (parentHref: string) => {
    setExpandedParents((prev) => ({
      ...prev,
      [parentHref]: !prev[parentHref],
    }));
  };

  return (
    <>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedParents[item.href];

        return (
          <div key={item.href} className="flex flex-col">
            {hasChildren ? (
              <button
                type="button"
                onClick={() => handleToggle(item.href)}
                className={cn(
                  "flex w-full items-center p-3 text-left text-base font-medium transition-colors",
                  isActive ? "bg-gray-200 text-brand-orange" : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <ChevronRight
                  className={cn("mr-2 h-4 w-4 transition-transform duration-300", {
                    "rotate-90": isExpanded,
                  })}
                />
                <span>{item.label}</span>
              </button>
            ) : (
              <Link
                href={item.href}
                onClick={onLinkClick} // Call the handler on link click
                className={cn(
                  "block w-full p-3 text-base font-medium transition-colors",
                  isActive ? "bg-gray-200 text-brand-orange" : "text-gray-700 hover:bg-gray-50"
                )}
              >
                {item.label}
              </Link>
            )}

            {hasChildren && isExpanded && (
              <div className="pl-4">
                {item.children?.map((child) => {
                  const childActive = pathname === child.href;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onLinkClick} // Call the handler on child link click
                      className={cn(
                        "mt-1 block rounded p-2 text-sm transition-colors",
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
            )}
          </div>
        );
      })}
    </>
  );
}

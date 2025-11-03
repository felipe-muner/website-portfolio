"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface INavItem {
  href: string;
  label: string;
  children?: INavItem[];
}

interface NavItemsProps {
  navItems: INavItem[];
  onLinkClick?: () => void;
  depth?: number;
}

export function NavItems({ navItems, onLinkClick, depth = 0 }: NavItemsProps) {
  const pathname = usePathname();
  const [expandedParents, setExpandedParents] = React.useState<Record<string, boolean>>({});

  const handleToggle = (itemKey: string) => {
    setExpandedParents((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

  return (
    <>
      {navItems.map((item, index) => {
        const itemKey = `${item.href}-${depth}-${index}`;
        const isActive = pathname === item.href;
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedParents[itemKey];

        return (
          <div key={itemKey} className="flex flex-col">
            {hasChildren ? (
              <button
                type="button"
                onClick={() => handleToggle(itemKey)}
                className={cn(
                  "flex w-full items-center text-left transition-colors",
                  depth === 0 && "p-3 text-base font-medium",
                  depth === 1 && "p-2 text-sm",
                  depth >= 2 && "p-2 text-sm",
                  isActive ? "bg-gray-200 text-brand-orange" : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <ChevronRight
                  className={cn("mr-2 h-4 w-4 transition-transform duration-300", {
                    "rotate-90": isExpanded,
                  })}
                />
                <span>{depth > 0 ? `— ${item.label}` : item.label}</span>
              </button>
            ) : (
              <Link
                href={item.href}
                onClick={onLinkClick}
                className={cn(
                  "block w-full transition-colors",
                  depth === 0 && "p-3 text-base font-medium",
                  depth === 1 && "p-2 text-sm",
                  depth >= 2 && "p-2 text-sm",
                  isActive ? "bg-gray-200 text-brand-orange" : "text-gray-700 hover:bg-gray-50"
                )}
              >
                {depth > 0 ? `— ${item.label}` : item.label}
              </Link>
            )}

            {hasChildren && isExpanded && (
              <div className="pl-4">
                <NavItems
                  navItems={item.children || []}
                  onLinkClick={onLinkClick}
                  depth={depth + 1}
                />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

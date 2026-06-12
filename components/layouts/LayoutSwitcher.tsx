"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutTemplate } from "lucide-react";
import { PORTFOLIO } from "@/lib/layouts/registry";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** Floating preview tool to flip between all 20 portfolio templates. */
export function LayoutSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const current = PORTFOLIO.flatMap((g) => g.sites).find((s) => s.href === pathname);

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex items-center gap-2 rounded-full border border-white/15 bg-neutral-950/90 py-1.5 pl-4 pr-1.5 font-sans shadow-xl backdrop-blur">
      <LayoutTemplate className="size-4 text-brand-orange" />
      <span className="hidden text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-neutral-300 sm:inline">
        Template
      </span>
      <Select value={current?.href ?? ""} onValueChange={(href) => router.push(href)}>
        <SelectTrigger
          size="sm"
          className="h-8 max-w-44 rounded-full border-none bg-white/10 text-xs font-medium text-white shadow-none sm:max-w-none *:data-[slot=select-value]:text-white"
        >
          <SelectValue placeholder="Pick a template" />
        </SelectTrigger>
        <SelectContent align="end" className="z-[70] max-h-[70vh]">
          {PORTFOLIO.map((group) => (
            <SelectGroup key={group.label}>
              <SelectLabel>{group.label}</SelectLabel>
              {group.sites.map((site) => (
                <SelectItem key={site.href} value={site.href}>
                  <span className="font-medium">{site.name}</span>
                  <span className="text-muted-foreground"> — {site.detail}</span>
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

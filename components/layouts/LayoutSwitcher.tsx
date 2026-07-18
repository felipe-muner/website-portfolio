"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check, ChevronsUpDown, LayoutTemplate } from "lucide-react";
import { PORTFOLIO } from "@/lib/layouts/registry";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/** Floating preview tool to search + flip between all portfolio templates. */
export function LayoutSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const current = PORTFOLIO.flatMap((g) => g.sites).find((s) => s.href === pathname);

  function go(href: string) {
    setOpen(false);
    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    if (href !== pathname) router.push(href);
  }

  return (
    <div
      data-capture-hide
      className="fixed bottom-4 right-4 z-[60] flex items-center gap-2 rounded-full border border-white/15 bg-neutral-950/90 py-1.5 pl-4 pr-1.5 font-sans shadow-xl backdrop-blur"
    >
      <LayoutTemplate className="size-4 text-brand-orange" />
      <span className="hidden text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-neutral-300 sm:inline">
        Template
      </span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            className="flex h-8 max-w-44 items-center gap-2 rounded-full bg-white/10 px-3 text-xs font-medium text-white transition-colors hover:bg-white/20 sm:max-w-none"
          >
            <span className="truncate">{current?.name ?? "Pick a template"}</span>
            <ChevronsUpDown className="size-3.5 shrink-0 opacity-60" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={10}
          className="z-[70] w-72 overflow-hidden p-0"
        >
          <Command
            filter={(value, search) =>
              value.toLowerCase().includes(search.toLowerCase().trim()) ? 1 : 0
            }
          >
            <CommandInput placeholder="Search templates…" />
            <CommandList className="max-h-[60vh]">
              <CommandEmpty>No template found.</CommandEmpty>
              {PORTFOLIO.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.sites.map((site) => (
                    <CommandItem
                      key={site.href}
                      value={`${site.href} ${site.name} ${site.brand} ${site.detail} ${group.label}`}
                      onSelect={() => go(site.href)}
                      className="items-start gap-2"
                    >
                      <div className="flex flex-1 flex-col">
                        <span className="font-medium text-foreground">{site.name}</span>
                        <span className="text-xs text-muted-foreground">{site.detail}</span>
                      </div>
                      <Check
                        className={cn(
                          "mt-0.5 size-4 shrink-0 text-brand-orange",
                          site.href === pathname ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

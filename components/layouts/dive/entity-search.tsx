"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Check, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

function Thumb({ src }: { src: string }) {
  return (
    <span className="relative size-9 shrink-0 overflow-hidden rounded-lg bg-white">
      <Image src={src} alt="" fill sizes="36px" className="object-contain p-1" />
    </span>
  );
}

/**
 * Reusable searchable entity picker (combobox). Generic over the item type —
 * pass items and the accessors, get a filtered dropdown with keyboard support.
 * Modelled on the shared EntitySearch pattern; self-contained here.
 */
export interface EntitySearchProps<T> {
  items: T[];
  value: T | null;
  onChange: (item: T | null) => void;
  getKey: (item: T) => string;
  getLabel: (item: T) => string;
  getSublabel?: (item: T) => string;
  getImage?: (item: T) => string;
  placeholder?: string;
  limit?: number;
  className?: string;
}

export function EntitySearch<T>({
  items,
  value,
  onChange,
  getKey,
  getLabel,
  getSublabel,
  getImage,
  placeholder = "Search…",
  limit = 8,
  className,
}: EntitySearchProps<T>) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  // Close on outside click.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = q
      ? items.filter((i) =>
          `${getLabel(i)} ${getSublabel?.(i) ?? ""}`.toLowerCase().includes(q),
        )
      : items;
    return pool.slice(0, limit);
  }, [query, items, getLabel, getSublabel, limit]);

  function select(item: T) {
    onChange(item);
    setQuery("");
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) select(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={boxRef} className={cn("relative", className)}>
      {value ? (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-[#2ed3e8]/50 bg-[#2ed3e8]/10 px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-3">
            {getImage && <Thumb src={getImage(value)} />}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{getLabel(value)}</p>
              {getSublabel && (
                <p className="truncate text-xs text-white/55">{getSublabel(value)}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            aria-label="Clear selection"
            onClick={() => {
              onChange(null);
              setQuery("");
            }}
            className="grid size-6 shrink-0 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 focus-within:border-[#2ed3e8]">
          <Search className="size-4 shrink-0 text-white/40" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setActive(0);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
          />
        </div>
      )}

      {open && !value && results.length > 0 && (
        <ul className="absolute z-30 mt-1.5 max-h-64 w-full overflow-auto rounded-xl border border-white/10 bg-[#04263b] p-1 shadow-2xl">
          {results.map((item, i) => (
            <li key={getKey(item)}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => select(item)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left transition",
                  i === active ? "bg-[#2ed3e8]/15" : "hover:bg-white/5",
                )}
              >
                <span className="flex min-w-0 items-center gap-3">
                  {getImage && <Thumb src={getImage(item)} />}
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-white">
                      {getLabel(item)}
                    </span>
                    {getSublabel && (
                      <span className="block truncate text-xs text-white/50">
                        {getSublabel(item)}
                      </span>
                    )}
                  </span>
                </span>
                {i === active && <Check className="size-4 shrink-0 text-[#2ed3e8]" />}
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && !value && results.length === 0 && (
        <div className="absolute z-30 mt-1.5 w-full rounded-xl border border-white/10 bg-[#04263b] px-3 py-3 text-sm text-white/50 shadow-2xl">
          No matches.
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect } from "react";

/**
 * Enables smooth anchor scrolling (nav links, category shelves,
 * shared URLs like /portfolio#villas) while the portfolio page is mounted.
 * Scoped here instead of globals.css so the other templates keep their
 * default scroll behavior. Respects prefers-reduced-motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "smooth";
    return () => {
      root.style.scrollBehavior = previous;
    };
  }, []);

  return null;
}

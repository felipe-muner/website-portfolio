"use client";

import { useEffect } from "react";

/**
 * Smooth scrolling for same-page anchor links (nav, category shelves) while
 * the portfolio page is mounted. Implemented as a click handler instead of
 * `scroll-behavior: smooth` on <html>: the CSS approach also animates the
 * router's scroll-to-top when opening a template demo, so the target page
 * appeared mid-scroll and slowly crawled up — looked like a broken redirect.
 * Respects prefers-reduced-motion (native jump behavior).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest?.('a[href^="#"]');
      const href = link?.getAttribute("href");
      if (!href) return;
      const target = document.getElementById(href.slice(1));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", href);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Page-wide Lenis smooth scroll — the same library the reference sites
 * (roadto1million.co, lenis.dev) use. Drives the native scroll position, so
 * Framer Motion's useScroll (e.g. the /showcase horizontal rail) composes on
 * top of it for free.
 *
 * Also smooth-scrolls same-page anchor links through Lenis, so it fully
 * replaces the older anchor-only SmoothScroll. Disabled under
 * prefers-reduced-motion, where native scrolling (instant jumps) is kept.
 */
export function LenisScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      // Slightly weighted ease — settles rather than snaps.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.4,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Route same-page anchor clicks through Lenis so they animate smoothly
    // instead of jumping (native scrollIntoView fights Lenis's rAF loop).
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest?.('a[href^="#"]');
      const href = link?.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.getElementById(href.slice(1));
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -80 });
      window.history.pushState(null, "", href);
    }
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}

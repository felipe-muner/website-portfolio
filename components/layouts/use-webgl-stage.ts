"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useInView } from "react-intersection-observer";

const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribeNever = () => () => {};

/**
 * What a 3D hero needs before it mounts a canvas: whether WebGL2 exists,
 * whether the visitor prefers reduced motion, and whether the stage is on
 * screen (attach `ref` to it — render only while `inView`).
 */
export function useWebglStage() {
  const subscribe = useCallback((onChange: () => void) => {
    const mql = window.matchMedia(REDUCE);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  const reduced = useSyncExternalStore(subscribe, () => window.matchMedia(REDUCE).matches, () => false);
  const webgl = useSyncExternalStore(subscribeNever, () => "WebGL2RenderingContext" in window, () => false);
  const { ref, inView } = useInView({ threshold: 0 });
  return { ref, inView, reduced, webgl };
}

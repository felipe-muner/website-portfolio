"use client";

import { useCallback, useEffect, useState } from "react";
import { useWebglStage } from "@/components/layouts/use-webgl-stage";

/**
 * The timeline behind a particle-swarm hero: steps through `steps` shapes,
 * holding each for `dwellMs`, while the hero is on screen. A hover/focus can
 * preview any step; on release the cycle carries on from there. Stays put
 * under prefers-reduced-motion.
 */
export function useSwarmCycle(steps: number, dwellMs: number) {
  const { ref, inView, reduced, webgl } = useWebglStage();
  const [index, setIndex] = useState(0);
  const [preview, setPreview] = useState<number | null>(null);

  const current = preview ?? index;
  const cycling = !reduced && inView && preview === null;

  useEffect(() => {
    if (!cycling) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % steps), dwellMs);
    return () => window.clearTimeout(id);
  }, [cycling, index, steps, dwellMs]);

  const release = useCallback((i: number) => {
    setIndex(i);
    setPreview(null);
  }, []);

  return {
    /** Attach to the hero stage — the cycle pauses while it's off screen. */
    ref,
    inView,
    reduced,
    webgl,
    /** The step on screen (a preview wins over the cycle). */
    current,
    /** Changes every step; key the dwell bar on it to restart its animation. */
    index,
    cycling,
    preview: setPreview,
    release,
  };
}

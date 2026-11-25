"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";

interface SlicedPhotoProps {
  src: string;
  alt: string;
  /** Number of horizontal strips. */
  slices?: number;
  className?: string;
}

/**
 * A photo cut into horizontal strips that slide in from alternating sides and
 * lock together as the section scrolls into view.
 */
export function SlicedPhoto({ src, alt, slices = 9, className = "" }: SlicedPhotoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} role="img" aria-label={alt}>
      {Array.from({ length: slices }, (_, i) => (
        <Slice key={i} i={i} n={slices} src={src} progress={scrollYProgress} still={!!reduce} />
      ))}
    </div>
  );
}

function Slice({ i, n, src, progress, still }: { i: number; n: number; src: string; progress: MotionValue<number>; still: boolean }) {
  // Each strip starts offset by a different amount, alternating left / right.
  const dir = i % 2 === 0 ? -1 : 1;
  const amount = 18 + ((i * 37) % 5) * 7; // 18–46 %
  const x = useTransform(progress, [0, 1], [`${dir * amount}%`, "0%"]);
  return (
    <motion.div
      aria-hidden
      className="absolute inset-x-0 overflow-hidden"
      style={{ top: `${(i / n) * 100}%`, height: `${100 / n + 0.2}%`, x: still ? 0 : x }}
    >
      <div
        className="absolute inset-x-0 bg-cover bg-center"
        style={{ top: `-${i * 100}%`, height: `${n * 100}%`, backgroundImage: `url(${src})` }}
      />
    </motion.div>
  );
}

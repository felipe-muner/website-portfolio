"use client";

import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Extra transition delay in ms, for staggered groups. */
  delay?: number;
  /** Starting offset direction. */
  from?: "bottom" | "left" | "right" | "none";
}

const HIDDEN = {
  bottom: "translate-y-8",
  left: "-translate-x-8",
  right: "translate-x-8",
  none: "",
} as const;

export function Reveal({ children, className, delay = 0, from = "bottom" }: RevealProps) {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "-64px 0px" });

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out",
        inView ? "translate-x-0 translate-y-0 opacity-100" : `opacity-0 ${HIDDEN[from]}`,
        className,
      )}
    >
      {children}
    </div>
  );
}

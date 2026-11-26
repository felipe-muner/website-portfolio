"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useRef } from "react";
import { MOONDAY, MOON_RULES } from "@/lib/layouts/moonday";

interface Token {
  text: string;
  key: boolean;
}

const TOKENS: Token[] = MOON_RULES.flatMap(([keyword, rest]) => [
  { text: keyword, key: true },
  ...rest.split(" ").map((text) => ({ text, key: false })),
]);

/** The six rules; each word lights up as the paragraph scrolls past. */
export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });

  return (
    <p
      ref={ref}
      className="text-[clamp(1.55rem,2.9vw,2.6rem)] font-[560] leading-[1.18] tracking-[-0.025em]"
    >
      {TOKENS.map((token, i) => (
        <Word key={`${token.text}-${i}`} token={token} index={i} total={TOKENS.length} progress={scrollYProgress} />
      ))}
    </p>
  );
}

function Word({
  token,
  index,
  total,
  progress,
}: {
  token: Token;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const end = Math.min(1, start + 1.5 / total);
  const opacity = useTransform(progress, [start, end], [0.18, 1]);
  return (
    <>
      <motion.span
        style={{ opacity, color: token.key ? MOONDAY.red : MOONDAY.ink, fontWeight: token.key ? 720 : undefined }}
      >
        {token.text}
      </motion.span>{" "}
    </>
  );
}

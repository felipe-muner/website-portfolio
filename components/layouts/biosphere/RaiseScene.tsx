"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";

/* Warm build-site palette — biosphere ink, straw thatch, one clay seal. */
const INK = "#243122";
const INK_SOFT = "rgba(36, 49, 34, 0.5)";
const CLAY = "#b3572f";
const PAPER = "#f4efe4";
const MUTED = "rgba(36, 49, 34, 0.62)";

/* The WebGL house is client-only and heavy — load it off the SSR path. */
const RaiseSceneCanvas = dynamic(() => import("./RaiseSceneCanvas"), {
  ssr: false,
  loading: () => null,
});

/* ------------------------------------------------------------------ */
/* Phase narrative — one caption per construction stage.               */
/* ------------------------------------------------------------------ */

interface Phase {
  numeral: string;
  tag: string;
  title: string;
  line: string;
}

const PHASES: readonly Phase[] = [
  { numeral: "I", tag: "Footing", title: "We read the ground first", line: "Stone-pad footings are set to the slope, lifting the house clear of the wet earth. Nothing is poured that the land didn't ask for." },
  { numeral: "II", tag: "Posts", title: "The skeleton is raised", line: "Whole-culm bamboo posts go up and are plumbed by eye — the six legs that will carry everything above them." },
  { numeral: "III", tag: "Platform", title: "The first place to stand", line: "Beams lash the posts together and a bamboo deck is laid across them. Now the house has a floor before it has walls." },
  { numeral: "IV", tag: "Frame", title: "The roof takes shape", line: "Wall posts, a ridge beam and fanned rafters define the whole roof in the air — before a single leaf is tied on." },
  { numeral: "V", tag: "Roof", title: "Tied dry, course by course", line: "Bundled thatch is lashed from eave to ridge until the house sheds rain — the moment a frame becomes a shelter." },
  { numeral: "VI", tag: "The house", title: "Handed over, ready to live in", line: "A door, a ladder, a veranda rail and a lantern under the eave. The frame is now a home — warm before you arrive." },
];

/* ------------------------------------------------------------------ */
/* The scene                                                           */
/* ------------------------------------------------------------------ */

export function RaiseScene({ serifClass }: { serifClass: string }) {
  const ref = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    const i = Math.min(PHASES.length - 1, Math.max(0, Math.floor(v * PHASES.length)));
    setActive(i);
  });

  // The whole title slab clears out once the first footing is set.
  const introOpacity = useTransform(scrollYProgress, [0, 0.06, 0.13], [1, 1, 0]);

  return (
    <section id="build" ref={ref} className="relative scroll-mt-16" style={{ height: reduced ? "100vh" : "560vh" }}>
      <div className="sticky top-0 flex h-dvh flex-col overflow-hidden" style={{ background: "linear-gradient(180deg, #eef1ea 0%, #f2ede2 46%, #efe1cb 100%)" }}>
        {/* ---- The 3D build ---- */}
        <div className="absolute inset-0">
          <RaiseSceneCanvas progressRef={progressRef} reduced={reduced} />
        </div>

        {/* soft ground fade so the model sits into the page */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40" style={{ background: "linear-gradient(180deg, rgba(239,225,203,0) 0%, #efe1cb 92%)" }} />

        {/* ---- Intro slab, clears once building starts ---- */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 px-6 pt-[clamp(4rem,12vh,8rem)] text-center sm:px-10"
          style={reduced ? { display: "none" } : { opacity: introOpacity }}
        >
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.4em]" style={{ color: MUTED }}>
            Watch it rise
          </p>
          <h2 className={`${serifClass} mx-auto mt-4 max-w-2xl text-4xl leading-[1.08] sm:text-5xl md:text-6xl`} style={{ color: INK }}>
            You bring the land.
            <br />
            <span className="italic">The house rises as you scroll.</span>
          </h2>
        </motion.div>

        {/* ---- Phase caption, bottom-left ---- */}
        <div className="pointer-events-none relative z-10 mt-auto p-5 sm:p-8 md:p-10">
          <div className="relative h-40 max-w-md sm:h-36">
            {PHASES.map((ph, i) => (
              <div
                key={ph.numeral}
                className="absolute inset-0 rounded-lg border p-5 backdrop-blur-sm transition-all duration-500 sm:p-6"
                style={{
                  backgroundColor: "rgba(244, 239, 228, 0.82)",
                  borderColor: "rgba(36, 49, 34, 0.16)",
                  opacity: active === i ? 1 : 0,
                  transform: active === i ? "translateY(0)" : "translateY(14px)",
                }}
              >
                <p className="flex items-center gap-3 text-[0.65rem] font-medium uppercase tracking-[0.28em]" style={{ color: CLAY }}>
                  <span className={`${serifClass} text-base not-italic`}>{ph.numeral}</span>
                  {ph.tag}
                </p>
                <h3 className={`${serifClass} mt-2 text-2xl leading-tight sm:text-[1.7rem]`} style={{ color: INK }}>
                  {ph.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>
                  {ph.line}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ---- Phase rail, right edge ---- */}
        <div className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-3 sm:flex md:right-8">
          {PHASES.map((ph, i) => (
            <div key={ph.numeral} className="flex items-center gap-3">
              <span
                className="text-[0.6rem] font-medium uppercase tracking-[0.2em] transition-all duration-300"
                style={{ color: MUTED, opacity: active === i ? 1 : 0, transform: active === i ? "translateX(0)" : "translateX(6px)" }}
              >
                {ph.tag}
              </span>
              <span
                className={`${serifClass} grid size-8 place-items-center rounded-full border text-xs transition-all duration-300`}
                style={{
                  color: active === i ? PAPER : INK_SOFT,
                  borderColor: active >= i ? CLAY : "rgba(36, 49, 34, 0.2)",
                  backgroundColor: active === i ? CLAY : "transparent",
                }}
              >
                {ph.numeral}
              </span>
            </div>
          ))}
        </div>

        {/* ---- Scroll hint ---- */}
        <motion.div
          className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 text-[0.6rem] uppercase tracking-[0.3em]"
          style={reduced ? { display: "none" } : { opacity: introOpacity, color: MUTED }}
        >
          Scroll ↓
        </motion.div>
      </div>
    </section>
  );
}

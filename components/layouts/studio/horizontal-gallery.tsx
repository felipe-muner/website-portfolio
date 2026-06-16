"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

export interface Project {
  src: string;
  title: string;
  place: string;
  year: string;
  type: string;
}

/**
 * Pinned section: as you scroll down, the project track slides sideways
 * through the viewport. Distance is measured from the real track width so
 * it stays correct across breakpoints.
 */
export function HorizontalGallery({ projects }: { projects: readonly Project[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [projects.length]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative bg-[#15140f] text-[#efe9df]"
      style={{ height: `${Math.max(2, projects.length) * 78 + 40}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex items-center gap-5 px-6 will-change-transform sm:gap-7 sm:px-10"
        >
          {/* Lead-in panel */}
          <div className="flex h-[64vh] w-[78vw] shrink-0 flex-col justify-center sm:w-[34vw]">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#c8a97f]">
              Selected work
            </p>
            <h2 className="mt-5 font-serif text-4xl font-light leading-[1.05] tracking-tight sm:text-5xl">
              Eleven years, forty&nbsp;buildings.
            </h2>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#efe9df]/60">
              Scroll to move through a selection of houses, civic spaces and
              interiors. Each one shaped by light, climate and restraint.
            </p>
            <span className="mt-7 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[#efe9df]/50">
              Scroll <ArrowRight className="size-4" />
            </span>
          </div>

          {projects.map((p, i) => (
            <figure
              key={p.title}
              className="group relative h-[64vh] w-[80vw] shrink-0 overflow-hidden sm:w-[46vw] lg:w-[34vw]"
            >
              <Image
                src={p.src}
                alt={p.title}
                fill
                sizes="(max-width: 1024px) 80vw, 34vw"
                className="object-cover transition duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <span className="absolute left-5 top-5 font-serif text-sm text-[#efe9df]/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <figcaption className="absolute inset-x-5 bottom-5 flex items-end justify-between">
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.18em] text-[#c8a97f]">
                    {p.type}
                  </p>
                  <h3 className="mt-1 font-serif text-2xl font-light leading-tight">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#efe9df]/65">{p.place}</p>
                </div>
                <span className="font-serif text-lg text-[#efe9df]/55">{p.year}</span>
              </figcaption>
            </figure>
          ))}

          {/* Closing panel */}
          <div className="flex h-[64vh] w-[78vw] shrink-0 flex-col justify-center pr-6 sm:w-[28vw]">
            <h2 className="font-serif text-3xl font-light leading-[1.1] tracking-tight sm:text-4xl">
              Have a site in mind?
            </h2>
            <a
              href="#contact"
              className="group mt-6 flex w-fit items-center gap-3 text-sm font-medium uppercase tracking-[0.18em] text-[#c8a97f]"
            >
              <span className="border-b border-[#c8a97f] pb-1 transition group-hover:text-[#efe9df]">
                Start a project
              </span>
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </a>
          </div>
        </motion.div>

        {/* Scroll progress rail */}
        <div className="pointer-events-none absolute inset-x-6 bottom-8 h-px bg-[#efe9df]/15 sm:inset-x-10">
          <motion.div style={{ width: progress }} className="h-full bg-[#c8a97f]" />
        </div>
      </div>
    </section>
  );
}

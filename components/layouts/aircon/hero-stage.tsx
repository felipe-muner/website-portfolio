"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useWebglStage } from "@/components/layouts/use-webgl-stage";
import { Remote } from "./remote";
import { useOutsideTemp } from "./use-outside-temp";
import { coolness, INITIAL_CLIMATE, type Climate } from "./climate";

/* WebGL is client-only and heavy — keep it off the SSR path. */
const AcScene = dynamic(() => import("./ac-scene"), { ssr: false, loading: () => null });

/** Matches the scene's switch-on, so the backdrop starts cooling with it. */
const BOOT_MS = 900;

/**
 * MGM · the hero stage. The remote drives both the 3D unit and the backdrop,
 * which crossfades from Sunshine Coast heat to cool air as the room "cools".
 * Renders as flex items of the hero section: copy (children), stage, remote.
 */
export function HeroStage({ children }: { children: React.ReactNode }) {
  const [climate, setClimate] = useState<Climate>(INITIAL_CLIMATE);
  const [booted, setBooted] = useState(false);
  const outside = useOutsideTemp();
  const { ref, inView, reduced, webgl } = useWebglStage();

  useEffect(() => {
    const id = setTimeout(() => setBooted(true), reduced ? 0 : BOOT_MS);
    return () => clearTimeout(id);
  }, [reduced]);

  const cool = booted ? coolness(climate) : 0;
  const fade = reduced ? "" : "transition-opacity duration-[4000ms] ease-out";

  return (
    <>
      {/* Backdrop: heat haze, crossfading to cool air */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div
          className={`absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_12%_8%,oklch(0.55_0.14_62/0.45),transparent_70%),radial-gradient(ellipse_60%_50%_at_90%_100%,oklch(0.42_0.13_40/0.4),transparent_70%)] ${fade}`}
          style={{ opacity: 1 - cool }}
        />
        <div
          className={`absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_75%_30%,oklch(0.5_0.1_180/0.4),transparent_70%),radial-gradient(ellipse_70%_60%_at_15%_95%,oklch(0.38_0.08_200/0.4),transparent_70%)] ${fade}`}
          style={{ opacity: cool }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#06100c]" />
      </div>

      {children}

      <div
        ref={ref}
        aria-hidden
        className="relative order-2 -mt-6 h-[400px] sm:h-[470px] lg:absolute lg:inset-0 lg:mt-0 lg:h-auto"
      >
        {webgl && (
          <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_80%,transparent)]">
            <AcScene climate={climate} active={inView} reduced={reduced} />
          </div>
        )}
      </div>

      <div className="relative z-20 order-3 flex justify-center px-5 pb-14 lg:absolute lg:right-[5%] lg:bottom-20 lg:p-0 xl:right-[7%]">
        <Remote climate={climate} outside={outside} onChange={(patch) => setClimate((c) => ({ ...c, ...patch }))} />
      </div>
    </>
  );
}

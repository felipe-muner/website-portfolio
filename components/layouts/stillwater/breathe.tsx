"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AudioWaveform, BellRing, Square, Volume2, VolumeX, Wind } from "lucide-react";
import { useWebglStage } from "@/components/layouts/use-webgl-stage";
import { SingingBowl } from "./bowl-audio";
import { SWING, type BowlSignal } from "./bowl-signal";

/* WebGL is client-only and heavy — keep it off the SSR path. */
const BowlScene = dynamic(() => import("./bowl-scene"), { ssr: false, loading: () => null });

/** One breath: in for four, hold for two, out for six. Five of them make the minute. */
const BREATH = [
  { label: "Breathe in", seconds: 4, scale: 1 },
  { label: "Hold", seconds: 2, scale: 1 },
  { label: "Breathe out", seconds: 6, scale: 0.6 },
] as const;
const ROUNDS = 5;
/** Press this long on the bowl and it sings instead of being struck. */
const HOLD_MS = 260;

/**
 * Yoga 6 · Stillwater — "take one minute": a 3D singing bowl you can strike
 * (tap) or sing (press and hold), with real synthesised sound, and a guided
 * minute of breathing paced by a ring of light and the bowl itself.
 */
export function Breathe({ intro }: { intro: React.ReactNode }) {
  const { ref, inView, reduced, webgl } = useWebglStage();
  const signal = useRef<BowlSignal>({ strikes: 0, singing: false });
  const bowl = useRef<SingingBowl | null>(null);
  const press = useRef<number | null>(null);
  const [singing, setSinging] = useState(false);
  const [muted, setMuted] = useState(false);
  /** Index into the minute (round × phase), or null when not breathing. */
  const [step, setStep] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const voice = useCallback(() => (bowl.current ??= new SingingBowl()), []);

  const strike = useCallback(
    (strength = 1) => {
      signal.current.strikes += 1;
      voice().strike(strength, SWING);
    },
    [voice],
  );
  const startSinging = useCallback(() => {
    if (signal.current.singing) return;
    signal.current.singing = true;
    setSinging(true);
    voice().startSinging();
  }, [voice]);
  const stopSinging = useCallback(() => {
    if (!signal.current.singing) return;
    signal.current.singing = false;
    setSinging(false);
    bowl.current?.stopSinging();
  }, []);

  useEffect(() => () => bowl.current?.dispose(), []);

  // The guided minute: each phase hands over to the next; the bowl marks each breath.
  useEffect(() => {
    if (step === null) return;
    const phase = BREATH[step % BREATH.length];
    const id = window.setTimeout(() => {
      const next = step + 1;
      if (next >= ROUNDS * BREATH.length) {
        setStep(null);
        setDone(true);
        strike(0.8);
      } else {
        if (next % BREATH.length === 0) strike(0.35);
        setStep(next);
      }
    }, phase.seconds * 1000);
    return () => window.clearTimeout(id);
  }, [step, strike]);

  useEffect(() => {
    if (!done) return;
    const id = window.setTimeout(() => setDone(false), 5000);
    return () => window.clearTimeout(id);
  }, [done]);

  const begin = () => {
    stopSinging();
    setDone(false);
    setStep(0);
    strike(0.9);
  };
  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    voice().setMuted(next);
  };

  // On the bowl itself: a tap strikes, a press-and-hold sings.
  const onStageDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    press.current = window.setTimeout(() => {
      press.current = null;
      startSinging();
    }, HOLD_MS);
  };
  const onStageUp = () => {
    if (press.current !== null) {
      window.clearTimeout(press.current);
      press.current = null;
      strike();
    } else {
      stopSinging();
    }
  };
  const onStageCancel = () => {
    if (press.current !== null) window.clearTimeout(press.current);
    press.current = null;
    stopSinging();
  };

  const phase = step === null ? null : BREATH[step % BREATH.length];
  const round = step === null ? 0 : Math.floor(step / BREATH.length) + 1;
  const ringScale = phase ? phase.scale : singing ? 0.92 : 0.78;
  const ringSeconds = phase ? phase.seconds : 1.2;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:grid-rows-[auto_auto] lg:gap-x-16 lg:gap-y-0">
      <div className="lg:col-start-1 lg:row-start-1 lg:self-end">{intro}</div>
      <div
        ref={ref}
        onPointerDown={onStageDown}
        onPointerUp={onStageUp}
        onPointerCancel={onStageCancel}
        onPointerLeave={onStageCancel}
        onContextMenu={(e) => e.preventDefault()}
        className="relative mx-auto aspect-square w-full max-w-[640px] cursor-pointer select-none lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center"
      >
        {/* The breath ring, behind the bowl */}
        <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
          <div
            className="aspect-square w-[88%] rounded-full border border-[#f2b46d]/25 bg-[radial-gradient(closest-side,rgba(242,180,109,0.16),rgba(242,180,109,0.05)_62%,transparent)] shadow-[0_0_120px_-30px_rgba(242,180,109,0.55)] ease-in-out"
            style={{ transform: `scale(${ringScale})`, transition: `transform ${ringSeconds}s` }}
          />
        </div>
        {webgl && (
          <div aria-hidden className="absolute inset-0">
            <BowlScene active={inView} reduced={reduced} signal={signal} />
          </div>
        )}
        <span className="sr-only">Singing bowl — tap to strike, press and hold to sing.</span>
      </div>
      <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
        <p aria-live="polite" className="font-display min-h-[1.2em] text-[2.6rem] font-light italic leading-none text-[#f2b46d] sm:text-5xl lg:mt-12">
          {phase ? `${phase.label}…` : done ? "Welcome back." : singing ? "Let it sing…" : "Tap the bowl."}
        </p>
        <p className="mt-4 min-h-[3.5em] max-w-md leading-relaxed text-[#ece4d6]/60">
          {phase
            ? `Breath ${round} of ${ROUNDS}. Follow the ring — in as it grows, out as it settles.`
            : done
              ? "One minute, five slow breaths. That's the whole trick — we do it at the start of every class."
              : "Tap to strike it, press and hold to rub the rim and make it sing. Sound on, headphones are lovely."}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {step === null ? (
            <button
              type="button"
              onClick={begin}
              className="inline-flex h-12 items-center gap-2.5 rounded-full bg-[#f2b46d] px-6 text-[15px] font-semibold text-[#0a1014] transition-colors hover:bg-[#ece4d6]"
            >
              <Wind className="size-4" /> Breathe for one minute
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep(null)}
              className="inline-flex h-12 items-center gap-2.5 rounded-full border border-[#f2b46d]/60 px-6 text-[15px] font-semibold text-[#f2b46d] transition-colors hover:bg-[#f2b46d]/10"
            >
              <Square className="size-3.5" /> Stop
            </button>
          )}
          <button
            type="button"
            onClick={() => strike()}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-[#ece4d6]/20 px-5 text-[15px] text-[#ece4d6]/85 transition-colors hover:border-[#ece4d6]/50 hover:text-[#ece4d6]"
          >
            <BellRing className="size-4" /> Strike
          </button>
          <button
            type="button"
            aria-pressed={singing}
            onPointerDown={startSinging}
            onPointerUp={stopSinging}
            onPointerLeave={stopSinging}
            onPointerCancel={stopSinging}
            onKeyDown={(e) => {
              if ((e.key === " " || e.key === "Enter") && !e.repeat) {
                e.preventDefault();
                startSinging();
              }
            }}
            onKeyUp={(e) => {
              if (e.key === " " || e.key === "Enter") stopSinging();
            }}
            onBlur={stopSinging}
            onContextMenu={(e) => e.preventDefault()}
            className={`inline-flex h-12 touch-none select-none items-center gap-2 rounded-full border px-5 text-[15px] transition-colors ${
              singing
                ? "border-[#f2b46d] bg-[#f2b46d]/15 text-[#f2b46d]"
                : "border-[#ece4d6]/20 text-[#ece4d6]/85 hover:border-[#ece4d6]/50 hover:text-[#ece4d6]"
            }`}
          >
            <AudioWaveform className="size-4" /> Hold to sing
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Sound on" : "Sound off"}
            title={muted ? "Sound on" : "Sound off"}
            className="grid size-12 place-items-center rounded-full border border-[#ece4d6]/15 text-[#ece4d6]/70 transition-colors hover:border-[#ece4d6]/45 hover:text-[#ece4d6]"
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
        </div>

        <ol className="mt-10 flex gap-2" aria-label="Breaths">
          {Array.from({ length: ROUNDS }, (_, i) => (
            <li
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-700 ${
                step !== null && i < round ? "bg-[#f2b46d]" : done ? "bg-[#f2b46d]/60" : "bg-[#ece4d6]/12"
              }`}
            />
          ))}
        </ol>
      </div>
    </div>
  );
}

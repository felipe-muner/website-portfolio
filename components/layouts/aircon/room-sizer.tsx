"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BedDouble, Briefcase, CookingPot, Sofa, type LucideIcon } from "lucide-react";
import {
  AREA_MAX,
  AREA_MIN,
  SPLIT_SIZES,
  sizeRoom,
  type Ceiling,
  type Insulation,
  type Room,
  type RoomType,
  type Sun,
} from "@/lib/layouts/aircon";
import { cn } from "@/lib/utils";
import { addQuoteNote, chooseService } from "./events";

const ROOMS: { value: RoomType; label: string; icon: LucideIcon; area: number }[] = [
  { value: "bedroom", label: "Bedroom", icon: BedDouble, area: 14 },
  { value: "living", label: "Living", icon: Sofa, area: 30 },
  { value: "kitchen", label: "Open-plan", icon: CookingPot, area: 45 },
  { value: "office", label: "Office", icon: Briefcase, area: 18 },
];
const CEILINGS: { value: Ceiling; label: string }[] = [
  { value: "2.4", label: "2.4 m" },
  { value: "2.7", label: "2.7 m" },
  { value: "3.0", label: "3 m +" },
];
const SUNS: { value: Sun; label: string }[] = [
  { value: "shaded", label: "Shaded" },
  { value: "some", label: "Some" },
  { value: "west", label: "Full west" },
];
const INSULATIONS: { value: Insulation; label: string }[] = [
  { value: "good", label: "Good" },
  { value: "average", label: "Average" },
  { value: "poor", label: "Poor / none" },
];

const labelOf = <T extends string>(options: readonly { value: T; label: string }[], value: T) =>
  options.find((o) => o.value === value)?.label ?? value;

function Field({ label, value, children }: { label: string; value?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
        <span>{label}</span>
        {value ? <span className="text-white/80">{value}</span> : null}
      </div>
      {children}
    </div>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-3 gap-1 rounded-2xl bg-white/[0.04] p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-xl px-2 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#66e6ba]",
            o.value === value ? "bg-white text-[#031610]" : "text-white/65 hover:bg-white/[0.06]",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Top-down sketch of the room: grows with the area, a unit on the wall blowing in. */
function FloorPlan({ room }: { room: Room }) {
  const reduce = useReducedMotion();
  const scale = Math.sqrt(room.area / AREA_MAX);
  return (
    <svg viewBox="0 0 200 200" className="size-36 shrink-0 sm:size-44" aria-hidden>
      <g
        style={{
          transform: `scale(${0.35 + scale * 0.65})`,
          transformOrigin: "100px 100px",
          transition: reduce ? undefined : "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <rect x="10" y="10" width="180" height="180" rx="6" fill="oklch(1 0 0 / 0.03)" stroke="oklch(1 0 0 / 0.35)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        {[55, 100, 145].map((v) => (
          <g key={v} stroke="oklch(1 0 0 / 0.06)" vectorEffect="non-scaling-stroke">
            <line x1={v} y1="10" x2={v} y2="190" vectorEffect="non-scaling-stroke" />
            <line x1="10" y1={v} x2="190" y2={v} vectorEffect="non-scaling-stroke" />
          </g>
        ))}
        {/* The unit on the top wall, and its air reaching into the room */}
        <rect x="70" y="14" width="60" height="10" rx="3" fill="#f2f6f4" />
        {[40, 75, 110].map((r, i) => (
          <path
            key={r}
            d={`M ${100 - r} ${24} A ${r} ${r * 0.9} 0 0 0 ${100 + r} ${24}`}
            fill="none"
            stroke="#66e6ba"
            strokeOpacity={0.75 - i * 0.2}
            strokeWidth="1.5"
            strokeDasharray="6 10"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className="aircon-airflow"
          />
        ))}
      </g>
      {/* Afternoon sun on the west wall */}
      {room.sun !== "shaded" ? (
        <g opacity={room.sun === "west" ? 1 : 0.45} style={{ transition: "opacity 0.4s" }}>
          <circle cx="8" cy="100" r="7" fill="#faab3f" />
          {[0, 1, 2, 3, 4].map((i) => {
            const a = ((i - 2) * Math.PI) / 7;
            return (
              <line
                key={i}
                x1={8 + Math.cos(a) * 11}
                y1={100 + Math.sin(a) * 11}
                x2={8 + Math.cos(a) * 17}
                y2={100 + Math.sin(a) * 17}
                stroke="#faab3f"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}
        </g>
      ) : null}
    </svg>
  );
}

/**
 * MGM · "What size do I need?" — a rule-of-thumb sizer. The answer can be
 * sent straight into the quote form.
 */
export function RoomSizer() {
  const [room, setRoom] = useState<Room>({ type: "living", area: 30, ceiling: "2.4", sun: "west", insulation: "average" });
  const reduce = useReducedMotion();
  const areaId = useId();
  const set = (patch: Partial<Room>) => setRoom((r) => ({ ...r, ...patch }));

  const { size, load } = sizeRoom(room);
  const reading = size ? size.toFixed(1) : `${Math.ceil(load)}+`;
  const roomLabel = labelOf(ROOMS, room.type).toLowerCase();
  const side = Math.sqrt(room.area).toFixed(1);

  const quote = () => {
    chooseService(size ? "Split System Installation" : "Ducted System Installation");
    addQuoteNote(
      `From the room sizer: ${roomLabel}, ${room.area} m², ${room.ceiling} m ceiling, ${labelOf(SUNS, room.sun).toLowerCase()} afternoon sun, ${labelOf(INSULATIONS, room.insulation).toLowerCase()} insulation — about ${size ? `${reading} kW split system` : `${reading} kW (multi-head or ducted)`}.`,
    );
  };

  return (
    <div className="mt-14 grid gap-4 lg:mt-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <div className="space-y-8 rounded-[2rem] border border-white/10 bg-white/[0.025] p-5 sm:p-8">
        <Field label="Room">
          <div role="radiogroup" aria-label="Room" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {ROOMS.map(({ value, label, icon: Icon, area }) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={room.type === value}
                onClick={() => set({ type: value, area })}
                className={cn(
                  "flex flex-col items-start gap-3 rounded-2xl border p-3.5 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#66e6ba]",
                  room.type === value
                    ? "border-[#66e6ba]/60 bg-[#66e6ba]/10 text-white"
                    : "border-white/10 text-white/65 hover:border-white/25",
                )}
              >
                <Icon className={cn("size-5", room.type === value ? "text-[#66e6ba]" : "text-white/40")} />
                {label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Floor area" value={`${room.area} m²  ·  ≈ ${side} × ${side} m`}>
          <label htmlFor={areaId} className="sr-only">
            Floor area in square metres
          </label>
          <input
            id={areaId}
            type="range"
            min={AREA_MIN}
            max={AREA_MAX}
            step={1}
            value={room.area}
            onChange={(e) => set({ area: Number(e.target.value) })}
            className="h-2 w-full cursor-pointer accent-[#66e6ba]"
          />
          <div className="mt-2 flex justify-between font-mono text-[10px] text-white/30">
            <span>{AREA_MIN} m²</span>
            <span>{AREA_MAX} m²</span>
          </div>
        </Field>

        <Field label="Ceiling height">
          <Segmented label="Ceiling height" value={room.ceiling} options={CEILINGS} onChange={(ceiling) => set({ ceiling })} />
        </Field>
        <Field label="Afternoon sun">
          <Segmented label="Afternoon sun" value={room.sun} options={SUNS} onChange={(sun) => set({ sun })} />
        </Field>
        <Field label="Insulation">
          <Segmented label="Insulation" value={room.insulation} options={INSULATIONS} onChange={(insulation) => set({ insulation })} />
        </Field>
      </div>

      <div className="relative flex flex-col overflow-hidden rounded-[2rem] border border-[#66e6ba]/20 bg-[radial-gradient(ellipse_at_80%_0%,oklch(0.5_0.1_175/0.35),transparent_60%),oklch(0.19_0.022_170)] p-5 sm:p-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">Recommended capacity</p>

        <div className="mt-4 flex items-end justify-between gap-4">
          <p className="font-display text-[clamp(4.5rem,11vw,7.5rem)] leading-[0.85] font-light tracking-[-0.06em] tabular-nums" aria-live="polite">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={reading}
                className="inline-block"
                initial={reduce ? false : { y: 24, opacity: 0, filter: "blur(6px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={reduce ? undefined : { y: -24, opacity: 0, filter: "blur(6px)" }}
                transition={{ duration: 0.35 }}
              >
                {reading}
              </motion.span>
            </AnimatePresence>
            <span className="ml-2 font-mono text-2xl tracking-normal text-[#66e6ba]">kW</span>
          </p>
          <FloorPlan room={room} />
        </div>

        <p className="mt-3 text-lg font-light text-white/85">
          {size ? "Wall-mounted split system" : "Multi-head or ducted system"}
        </p>

        {/* Where the answer sits among real unit sizes */}
        <div className="mt-8">
          <div className="flex gap-1">
            {SPLIT_SIZES.map((s) => (
              <div key={s} className="flex-1">
                <div
                  className={cn(
                    "h-1.5 rounded-full transition-colors duration-300",
                    size === s ? "bg-[#66e6ba] shadow-[0_0_14px_#66e6ba]" : size && s < size ? "bg-[#66e6ba]/30" : "bg-white/10",
                  )}
                />
                <p className={cn("mt-2 text-center font-mono text-[10px]", size === s ? "text-white" : "text-white/35")}>
                  {s.toFixed(1)}
                </p>
              </div>
            ))}
            <div className="flex-1">
              <div className={cn("h-1.5 rounded-full transition-colors duration-300", size ? "bg-white/10" : "bg-[#faab3f]")} />
              <p className={cn("mt-2 text-center font-mono text-[10px]", size ? "text-white/35" : "text-white")}>9+</p>
            </div>
          </div>
        </div>

        <p className="mt-7 text-sm leading-relaxed text-white/60">
          {size
            ? `A ${reading} kW unit suits a ${room.area} m² ${roomLabel} with ${labelOf(SUNS, room.sun).toLowerCase()} afternoon sun — big enough to keep up on a February scorcher, without the waste of an oversized system.`
            : `At ${room.area} m² that's more than one wall unit can comfortably handle. A multi-head or zoned ducted system will cool it evenly.`}
        </p>

        <div className="mt-auto pt-8">
          <a
            href="#quote"
            onClick={quote}
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#66e6ba] px-6 text-sm font-semibold text-[#001c12] transition-transform hover:-translate-y-0.5 sm:w-auto"
          >
            Quote me for this room
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <p className="mt-4 text-xs leading-relaxed text-white/40">
            A rule-of-thumb estimate. We confirm the right size for free when we visit — orientation,
            windows and how you use the room all count.
          </p>
        </div>
      </div>
    </div>
  );
}

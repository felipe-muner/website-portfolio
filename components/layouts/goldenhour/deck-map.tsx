"use client";

import { useState, type KeyboardEvent } from "react";
import { ArrowRight } from "lucide-react";
import { INCLUDED, KIND_LABEL, SPOTS, baht, spotName, type Spot } from "@/lib/layouts/goldenhour";
import { chooseBed } from "./events";

const TIERS = [
  { row: "Front row · on the sand", price: 500, minSpend: 1500, seats: 2 },
  { row: "Deck · by the pool", price: 300, minSpend: 1000, seats: 2 },
  { row: "Cabana · by the pool", price: 2000, minSpend: 6000, seats: 6 },
] as const;

const LABEL = "fill-[#f6ead7]/50 text-[9px] font-semibold uppercase tracking-[0.2em]";

/**
 * Golden Hour — the deck map: a top-down plan of the club you tap. Front-row
 * beds on the sand, cabanas and a second row on the deck, stools at the sand
 * bar. Picking one shows its price and minimum spend and preselects it in the
 * booking form (through `chooseBed`). Crossed-out beds are gone for today.
 */
export function DeckMap() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = SPOTS.find((s) => s.id === selectedId) ?? null;

  const pick = (spot: Spot) => {
    if (spot.held) return;
    setSelectedId(spot.id);
    if (spot.kind !== "stool") chooseBed(spot.id);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
      <div className="rounded-[28px] border border-[#f6ead7]/10 bg-[#100f24] p-3 sm:p-5">
        <svg viewBox="0 0 800 480" role="group" aria-label="Map of the club's beds, cabanas and bar stools" className="h-auto w-full">
          <defs>
            <linearGradient id="gh-sea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1e8fa3" stopOpacity="0.9" />
              <stop offset="1" stopColor="#3aa9c6" stopOpacity="0.55" />
            </linearGradient>
          </defs>

          {/* The sea, the tideline, the sand, the deck. */}
          <rect x="0" y="0" width="800" height="110" rx="18" fill="url(#gh-sea)" />
          {[26, 52, 78].map((y) => (
            <path
              key={y}
              d={`M0 ${y} C 60 ${y - 8}, 120 ${y + 8}, 180 ${y} S 300 ${y - 8}, 360 ${y} S 480 ${y + 8}, 540 ${y} S 660 ${y - 8}, 720 ${y} S 790 ${y + 6}, 800 ${y}`}
              fill="none"
              stroke="#f6ead7"
              strokeOpacity="0.28"
              strokeWidth="1.5"
            />
          ))}
          <rect x="0" y="104" width="800" height="8" fill="#f6ead7" opacity="0.35" />
          <rect x="0" y="112" width="800" height="98" fill="#e9d3a8" opacity="0.14" />
          <rect x="0" y="210" width="800" height="270" fill="#f6ead7" opacity="0.045" />
          {Array.from({ length: 13 }, (_, i) => 230 + i * 20).map((y) => (
            <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#f6ead7" strokeOpacity="0.05" />
          ))}

          <text x="14" y="24" className="fill-[#f6ead7]/70 text-[9px] font-semibold uppercase tracking-[0.2em]">Sea</text>
          <text x="52" y="138" className={LABEL}>Front row · sand</text>
          <text x="52" y="228" className={LABEL}>Cabanas · deck</text>
          <text x="52" y="328" className={LABEL}>Second row · deck</text>

          {/* The pool, the sand bar, the kitchen, the floor. */}
          <rect x="560" y="228" width="200" height="112" rx="16" fill="#1e8fa3" opacity="0.6" />
          <text x="660" y="289" textAnchor="middle" className="fill-[#f6ead7]/80 text-[10px] font-semibold uppercase tracking-[0.24em]">Pool</text>
          <rect x="560" y="372" width="200" height="30" rx="8" fill="#f6ead7" opacity="0.2" />
          <text x="660" y="391" textAnchor="middle" className="fill-[#f6ead7]/85 text-[9px] font-semibold uppercase tracking-[0.22em]">Sand bar</text>
          <rect x="52" y="408" width="186" height="50" rx="10" fill="none" stroke="#f6ead7" strokeOpacity="0.25" strokeDasharray="4 4" />
          <text x="145" y="437" textAnchor="middle" className={LABEL}>Kitchen · restaurant</text>
          <rect x="268" y="408" width="236" height="50" rx="10" fill="none" stroke="#f6ead7" strokeOpacity="0.25" strokeDasharray="4 4" />
          <text x="386" y="430" textAnchor="middle" className={LABEL}>DJ booth · floor</text>
          <text x="386" y="446" textAnchor="middle" className="fill-[#f6ead7]/40 text-[8px] uppercase tracking-[0.18em]">fire show out front at 19:30</text>

          {/* Umbrellas over the front row. */}
          {SPOTS.filter((s) => s.row.startsWith("Front")).map((s) => (
            <circle key={`u-${s.id}`} cx={s.x + s.w / 2} cy={s.y - 4} r="30" fill="#ff9f43" opacity={s.held ? 0.05 : 0.14} />
          ))}

          {SPOTS.map((spot) => (
            <SpotShape key={spot.id} spot={spot} selected={spot.id === selectedId} onPick={pick} />
          ))}
        </svg>

        <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 px-1 text-[11px] uppercase tracking-[0.16em] text-[#f6ead7]/55">
          <li className="flex items-center gap-2"><span className="size-3 rounded-sm bg-[#f6ead7]" /> Free today</li>
          <li className="flex items-center gap-2"><span className="size-3 rounded-sm bg-[#ff9f43]" /> Your pick</li>
          <li className="flex items-center gap-2"><span className="size-3 rounded-sm bg-[#2a2640] ring-1 ring-[#f6ead7]/20" /> Taken</li>
          <li className="flex items-center gap-2"><span className="size-3 rounded-full bg-[#e9d3a8]" /> Bar stool, no booking</li>
        </ul>
      </div>

      <aside className="flex flex-col rounded-[28px] border border-[#f6ead7]/10 bg-[radial-gradient(90%_60%_at_100%_0%,rgba(255,159,67,0.1),transparent_70%),#100f24] p-6 sm:p-8">
        {selected ? (
          <>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#ff9f43]">{selected.row}</p>
            <h3 className="font-display mt-3 text-[2.4rem] leading-none">{spotName(selected)}</h3>
            <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-[#f6ead7]/10 py-5">
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f6ead7]/40">Seats</dt>
                <dd className="font-display mt-1 text-2xl">{selected.seats}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f6ead7]/40">Hire</dt>
                <dd className="font-display mt-1 text-2xl">{selected.price ? baht(selected.price) : "—"}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f6ead7]/40">Min spend</dt>
                <dd className="font-display mt-1 text-2xl text-[#ff9f43]">{selected.minSpend ? baht(selected.minSpend) : "None"}</dd>
              </div>
            </dl>
            <p className="mt-5 text-sm leading-relaxed text-[#f6ead7]/65">{INCLUDED[selected.kind]}</p>
            {selected.kind === "stool" ? (
              <p className="mt-6 rounded-2xl border border-[#f6ead7]/10 px-4 py-3 text-sm text-[#f6ead7]/70">
                Stools aren&apos;t bookable — turn up, sit down. Happy hour is 17:00 to sunset.
              </p>
            ) : (
              <a
                href="#book"
                className="group mt-7 inline-flex h-[52px] items-center justify-between gap-4 rounded-full bg-[#ff9f43] px-6 text-[15px] font-semibold text-[#0b0a1a] transition-colors hover:bg-[#f6ead7]"
              >
                Book {selected.id} for the day
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
            )}
            {selected.kind !== "stool" && (
              <p className="mt-3 text-xs text-[#f6ead7]/40">Already picked for you in the booking form below. Minimum spend is all food and drink.</p>
            )}
          </>
        ) : (
          <>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#ff9f43]">Pick a spot</p>
            <h3 className="font-display mt-3 text-[2.4rem] leading-none">Tap a bed.</h3>
            <p className="mt-4 text-sm leading-relaxed text-[#f6ead7]/65">
              Front row on the sand with an umbrella, a cabana by the pool, or the second row on the deck. The crossed-out
              ones are gone for today.
            </p>
            <ul className="mt-6 divide-y divide-[#f6ead7]/10 border-y border-[#f6ead7]/10">
              {TIERS.map((t) => (
                <li key={t.row} className="flex items-baseline justify-between gap-4 py-3.5 text-sm">
                  <span className="text-[#f6ead7]/80">
                    {t.row}
                    <span className="block text-xs text-[#f6ead7]/40">
                      {t.seats} seats · hire {baht(t.price)}
                    </span>
                  </span>
                  <span className="font-display whitespace-nowrap text-lg text-[#ff9f43]">{baht(t.minSpend)} min</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-[#f6ead7]/40">{KIND_LABEL.stool}s at the sand bar: no booking, no minimum.</p>
          </>
        )}
      </aside>
    </div>
  );
}

function SpotShape({ spot, selected, onPick }: { spot: Spot; selected: boolean; onPick: (spot: Spot) => void }) {
  const held = spot.held === true;
  const fill = selected ? "#ff9f43" : held ? "#2a2640" : spot.kind === "stool" ? "#e9d3a8" : "#f6ead7";
  const ink = held && !selected ? "#f6ead7" : "#120f22";
  const cx = spot.x + spot.w / 2;
  const cy = spot.y + spot.h / 2;
  const onKey = (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onPick(spot);
    }
  };
  return (
    <g
      role="button"
      tabIndex={held ? -1 : 0}
      aria-label={`${spotName(spot)}${held ? ", taken today" : spot.minSpend ? `, ${baht(spot.minSpend)} minimum spend` : ", no booking needed"}`}
      aria-pressed={selected}
      aria-disabled={held}
      onClick={() => onPick(spot)}
      onKeyDown={onKey}
      className={held ? "cursor-not-allowed" : "group cursor-pointer outline-none"}
    >
      {spot.kind === "stool" ? (
        <circle
          cx={cx}
          cy={cy}
          r={12}
          fill={fill}
          stroke={selected ? "#f6ead7" : "transparent"}
          strokeWidth={2}
          className="transition group-hover:brightness-110 group-focus-visible:stroke-[#f6ead7]"
        />
      ) : (
        <>
          <rect
            x={spot.x}
            y={spot.y}
            width={spot.w}
            height={spot.h}
            rx={spot.kind === "cabana" ? 10 : 7}
            fill={fill}
            stroke={selected ? "#f6ead7" : "transparent"}
            strokeWidth={2}
            className="transition group-hover:brightness-110 group-focus-visible:stroke-[#f6ead7]"
          />
          {spot.kind === "bed" && <rect x={spot.x + 5} y={spot.y + 5} width={11} height={spot.h - 10} rx={3} fill={ink} opacity={0.3} />}
          {spot.kind === "cabana" && (
            <path
              d={`M${spot.x + 8} ${spot.y + 22} L${cx} ${spot.y + 6} L${spot.x + spot.w - 8} ${spot.y + 22}`}
              fill="none"
              stroke={ink}
              strokeOpacity={0.3}
              strokeWidth={2}
            />
          )}
          {held && (
            <line x1={spot.x + 7} y1={spot.y + spot.h - 7} x2={spot.x + spot.w - 7} y2={spot.y + 7} stroke="#f6ead7" strokeOpacity={0.3} strokeWidth={2} />
          )}
        </>
      )}
      <text
        x={cx}
        y={cy + (spot.kind === "cabana" ? 10 : 4)}
        textAnchor="middle"
        fill={ink}
        fillOpacity={held && !selected ? 0.55 : 1}
        fontSize={spot.kind === "stool" ? 9 : 12}
        fontWeight={700}
      >
        {spot.id}
      </text>
    </g>
  );
}

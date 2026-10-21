"use client";

import { useId, useState } from "react";
import { Check, Phone, Search } from "lucide-react";
import { BUSINESS, SERVICE_AREAS, type ServiceArea } from "@/lib/layouts/aircon";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Projection — a simple lng/lat box over the coast, Noosa to Pumicestone */
/* ------------------------------------------------------------------ */

const VIEW_W = 400;
const VIEW_H = 560;
const LNG = [152.9, 153.2] as const;
const LAT = [-26.34, -26.86] as const;

const project = (lng: number, lat: number) => ({
  x: ((lng - LNG[0]) / (LNG[1] - LNG[0])) * VIEW_W,
  y: ((LAT[0] - lat) / (LAT[0] - LAT[1])) * VIEW_H,
});

/** A stylised coastline, north to south (lng, lat). Land lies to the west. */
const COAST: [number, number][] = [
  [153.07, -26.33], [153.075, -26.378], [153.105, -26.383], [153.112, -26.395],
  [153.105, -26.408], [153.101, -26.455], [153.098, -26.482], [153.093, -26.515],
  [153.098, -26.533], [153.1, -26.555], [153.103, -26.613], [153.098, -26.64],
  [153.105, -26.655], [153.112, -26.672], [153.14, -26.683], [153.137, -26.705],
  [153.135, -26.74], [153.137, -26.765], [153.15, -26.8], [153.135, -26.805],
  [153.12, -26.83], [153.11, -26.87],
];

/** Catmull-Rom through the points, as cubic Béziers — a smooth shoreline. */
function smoothPath(points: { x: number; y: number }[]): string {
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

const SHORE = smoothPath(COAST.map(([lng, lat]) => project(lng, lat)));
const LAND = `${SHORE} L -10 ${VIEW_H + 10} L -10 -10 Z`;

/** Suburbs on the map; North Brisbane sits ~90 km south, off the bottom edge. */
const ON_MAP = SERVICE_AREAS.filter((a) => a.lat > LAT[1]);
const OFF_MAP = SERVICE_AREAS.filter((a) => a.lat <= LAT[1]);
/** Inland towns get their label on the left, coastal ones out over the sea. */
const LABEL_LEFT = new Set(["Noosaville", "Nambour", "Buderim", "Sippy Downs"]);

const normalise = (s: string) => s.trim().toLowerCase();

function findArea(query: string): ServiceArea | null {
  const q = normalise(query);
  if (q.length < 2) return null;
  return (
    SERVICE_AREAS.find((a) => normalise(a.name) === q) ??
    SERVICE_AREAS.find((a) => normalise(a.name).startsWith(q)) ??
    null
  );
}

/** MGM · where they work: a stylised coastline with every served suburb, and a checker. */
export function CoverageMap() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const listId = useId();
  const inputId = useId();

  const match = findArea(query);
  const active = selected ?? match?.name ?? null;
  const searched = normalise(query).length >= 2;

  const choose = (name: string) => {
    setSelected(name);
    setQuery(name);
  };

  return (
    <div className="mt-14 grid items-start gap-10 lg:mt-20 lg:grid-cols-2 lg:gap-14">
      <div>
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            if (match) choose(match.name);
          }}
        >
          <label htmlFor={inputId} className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
            Do you cover my suburb?
          </label>
          <div className="mt-3 flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.04] py-1.5 pr-1.5 pl-5 focus-within:border-[#66e6ba]/60">
            <Search className="size-4 shrink-0 text-white/40" />
            <input
              id={inputId}
              list={listId}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelected(null);
              }}
              placeholder="e.g. Buderim"
              autoComplete="address-level2"
              className="h-10 min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/30"
            />
            <button type="submit" className="h-10 shrink-0 rounded-full bg-white px-5 text-sm font-semibold text-[#031610]">
              Check
            </button>
          </div>
          <datalist id={listId}>
            {SERVICE_AREAS.map((a) => (
              <option key={a.name} value={a.name} />
            ))}
          </datalist>
        </form>

        <p aria-live="polite" className="mt-4 min-h-12 text-sm leading-relaxed">
          {active ? (
            <span className="flex items-start gap-2 text-white/85">
              <Check className="mt-0.5 size-4 shrink-0 text-[#66e6ba]" strokeWidth={2.5} />
              <span>{`Yes — ${active} is in our service area. Book a free quote and we'll come to you.`}</span>
            </span>
          ) : searched ? (
            <span className="text-white/60">
              &ldquo;{query.trim()}&rdquo; isn&apos;t on our list — but we cover plenty more. Give us a quick
              call and we&apos;ll let you know.
            </span>
          ) : (
            <span className="text-white/40">Type your suburb, or tap one below.</span>
          )}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {SERVICE_AREAS.map((a) => (
            <li key={a.name}>
              <button
                type="button"
                aria-pressed={active === a.name}
                onClick={() => choose(a.name)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#66e6ba]",
                  active === a.name
                    ? "border-[#66e6ba]/60 bg-[#66e6ba]/15 text-white"
                    : "border-white/10 text-white/60 hover:border-white/25 hover:text-white",
                )}
              >
                {a.name}
              </button>
            </li>
          ))}
        </ul>

        <a
          href={BUSINESS.phoneHref}
          className="mt-10 flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:bg-white/[0.06]"
        >
          <span>
            <span className="block text-sm font-medium">Don&apos;t see your suburb?</span>
            <span className="mt-0.5 block text-sm text-white/50">Chances are we still come to you — just ask.</span>
          </span>
          <span className="flex shrink-0 items-center gap-2 rounded-full bg-[#66e6ba] px-4 py-2.5 text-sm font-semibold text-[#001c12]">
            <Phone className="size-4" />
            <span className="hidden sm:inline">{BUSINESS.phone}</span>
            <span className="sm:hidden">Call</span>
          </span>
        </a>
      </div>

      <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[oklch(0.2_0.035_215)] lg:max-w-none">
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="block h-auto w-full" role="img" aria-label="Map of the Sunshine Coast showing the suburbs MGM services">
          <defs>
            <linearGradient id="mgm-sea" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0" stopColor="oklch(0.22 0.04 220)" />
              <stop offset="1" stopColor="oklch(0.27 0.05 200)" />
            </linearGradient>
          </defs>
          <rect width={VIEW_W} height={VIEW_H} fill="url(#mgm-sea)" />

          {/* Latitude lines */}
          {[-26.4, -26.6, -26.8].map((lat) => {
            const { y } = project(LNG[0], lat);
            return (
              <g key={lat}>
                <line x1="0" y1={y} x2={VIEW_W} y2={y} stroke="oklch(1 0 0 / 0.06)" strokeDasharray="2 6" />
                <text x="10" y={y - 6} className="fill-white/30 font-mono text-[9px]">
                  {Math.abs(lat).toFixed(1)}°S
                </text>
              </g>
            );
          })}

          {/* Swell lines following the shore */}
          {[14, 30, 48].map((dx, i) => (
            <path
              key={dx}
              d={SHORE}
              transform={`translate(${dx} 0)`}
              fill="none"
              stroke="oklch(0.85 0.08 200)"
              strokeOpacity={0.22 - i * 0.06}
              strokeDasharray="3 14"
              strokeLinecap="round"
              className="aircon-airflow"
            />
          ))}

          <path d={LAND} fill="oklch(0.19 0.022 165)" />
          <path d={SHORE} fill="none" stroke="oklch(0.86 0.06 175 / 0.45)" strokeWidth="1.2" />

          {ON_MAP.map((a) => {
            const { x, y } = project(a.lng, a.lat);
            const on = active === a.name;
            const left = LABEL_LEFT.has(a.name);
            return (
              <g
                key={a.name}
                role="button"
                tabIndex={0}
                aria-label={a.name}
                aria-pressed={on}
                onClick={() => choose(a.name)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    choose(a.name);
                  }
                }}
                className="cursor-pointer outline-none [&:focus-visible_circle.pin]:stroke-white"
              >
                <circle cx={x} cy={y} r="14" fill="transparent" />
                <circle cx={x} cy={y} r="5" fill="#66e6ba" opacity={on ? 0.6 : 0.35} className="aircon-ping" />
                <circle className="pin" cx={x} cy={y} r={on ? 5.5 : 3.5} fill={on ? "#fff" : "#66e6ba"} stroke="#66e6ba" strokeWidth={on ? 3 : 0} />
                <text
                  x={left ? x - 10 : x + 10}
                  y={y + 3.5}
                  textAnchor={left ? "end" : "start"}
                  className={cn("text-[12px] transition-all", on ? "fill-white font-semibold" : "fill-white/60")}
                >
                  {a.name}
                </text>
              </g>
            );
          })}

          {/* Off the bottom edge: North Brisbane */}
          {OFF_MAP.map((a) => {
            const on = active === a.name;
            return (
              <g
                key={a.name}
                role="button"
                tabIndex={0}
                aria-label={`${a.name}, about 90 km south`}
                aria-pressed={on}
                onClick={() => choose(a.name)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    choose(a.name);
                  }
                }}
                className="cursor-pointer outline-none"
              >
                <rect x="20" y={VIEW_H - 46} width="168" height="28" rx="14" fill={on ? "#66e6ba" : "oklch(1 0 0 / 0.08)"} />
                <text x="36" y={VIEW_H - 28} className={cn("text-[11px]", on ? "fill-[oklch(0.2_0.04_168)] font-semibold" : "fill-white/75")}>
                  ↓ {a.name} · ~90 km
                </text>
              </g>
            );
          })}

          {/* Scale bar: 10 km ≈ 0.09° of latitude */}
          <g transform={`translate(${VIEW_W - 120} ${VIEW_H - 30})`}>
            <line x1="0" y1="0" x2={(0.09 / (LAT[0] - LAT[1])) * VIEW_H} y2="0" stroke="oklch(1 0 0 / 0.5)" strokeWidth="1.5" />
            <text x="0" y="-6" className="fill-white/40 font-mono text-[9px]">
              10 km
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}

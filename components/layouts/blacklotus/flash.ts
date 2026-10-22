// Black Lotus Tattoo — the flash sheet. FICTIONAL designs, prices and artists.
//
// Every design is a handful of stroke paths in a 200 × 200 box. The flash grid
// draws them as inline SVG and the 3D forearm draws the very same strokes on a
// canvas for its decal, so what you see on paper is what lands on skin.

export const VIEWBOX = 200;
export const INK = "#14100e";

export type FlashSize = "small" | "medium" | "large";

export interface FlashSizeOption {
  id: FlashSize;
  label: string;
  cm: string;
  /** Decal width on the forearm, in arm units (the forearm is ~0.9 wide). */
  scale: number;
}

export const FLASH_SIZES: readonly FlashSizeOption[] = [
  { id: "small", label: "S", cm: "≈ 5 cm", scale: 0.34 },
  { id: "medium", label: "M", cm: "≈ 8 cm", scale: 0.5 },
  { id: "large", label: "L", cm: "≈ 11 cm", scale: 0.66 },
];

export const sizeOption = (id: FlashSize) => FLASH_SIZES.find((s) => s.id === id) ?? FLASH_SIZES[1];

export interface Stroke {
  /** Absolute SVG path data. */
  d: string;
  /** Stroke width in box units. */
  w: number;
  /** Fill as well as stroke (solid shapes: pupils, stripes, dots). */
  fill?: boolean;
}

export interface FlashDesign {
  id: string;
  name: string;
  /** Romanised Thai name. */
  thai: string;
  artist: string;
  style: string;
  /** ฿ per size. */
  prices: Record<FlashSize, number>;
  /** Sitting time at medium, minutes. */
  minutes: number;
  /** Tattooed once already — retired from the sheet. */
  taken?: boolean;
  note: string;
  strokes: readonly Stroke[];
}

/* ------------------------------------------------------------------ */
/* Path helpers                                                        */
/* ------------------------------------------------------------------ */

type Pt = readonly [number, number];

const f = (n: number) => String(Math.round(n * 10) / 10);
const P = (p: Pt) => `${f(p[0])} ${f(p[1])}`;

/** A circle as two arcs, so it can be stroked or filled like any other path. */
const circle = (cx: number, cy: number, r: number) =>
  `M${f(cx - r)} ${f(cy)}A${f(r)} ${f(r)} 0 1 0 ${f(cx + r)} ${f(cy)}A${f(r)} ${f(r)} 0 1 0 ${f(cx - r)} ${f(cy)}Z`;

const poly = (pts: readonly Pt[], close = false) => `M${pts.map(P).join("L")}${close ? "Z" : ""}`;

const sparkle = (x: number, y: number, r: number) => `M${f(x)} ${f(y - r)}L${f(x)} ${f(y + r)}M${f(x - r)} ${f(y)}L${f(x + r)} ${f(y)}`;

/** Mirror absolute path data (M L C Q A Z) across the box's vertical centre line. */
function mirrorX(d: string): string {
  const tokens = d.match(/[A-Za-z]|-?\d*\.?\d+/g) ?? [];
  const out: string[] = [];
  let cmd = "M";
  let i = 0;
  while (i < tokens.length) {
    const t = tokens[i];
    if (/[A-Za-z]/.test(t)) {
      cmd = t;
      out.push(t);
      i += 1;
    } else if (cmd === "A") {
      const [rx, ry, rot, large, sweep, x, y] = tokens.slice(i, i + 7).map(Number);
      out.push(`${f(rx)} ${f(ry)} ${f(rot)} ${large} ${1 - sweep} ${f(VIEWBOX - x)} ${f(y)}`);
      i += 7;
    } else {
      out.push(`${f(VIEWBOX - Number(tokens[i]))} ${f(Number(tokens[i + 1]))}`);
      i += 2;
    }
  }
  return out.join(" ");
}

/** The same stroke on both sides of the centre line. */
const both = (d: string, w: number, fill?: boolean): Stroke[] => [
  { d, w, fill },
  { d: mirrorX(d), w, fill },
];

function cubic(p0: Pt, p1: Pt, p2: Pt, p3: Pt, n: number, withStart: boolean): Pt[] {
  const pts: Pt[] = [];
  for (let i = withStart ? 0 : 1; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    const a = u * u * u;
    const b = 3 * u * u * t;
    const c = 3 * u * t * t;
    const d = t * t * t;
    pts.push([a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]]);
  }
  return pts;
}

const chain = (segs: readonly (readonly [Pt, Pt, Pt, Pt])[], n: number): Pt[] =>
  segs.flatMap((s, i) => cubic(s[0], s[1], s[2], s[3], n, i === 0));

/** Unit normals along a polyline. */
function normals(pts: readonly Pt[]): Pt[] {
  return pts.map((_, i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    return [-dy / len, dx / len];
  });
}

/** Piecewise-linear lookup over [s, value] rows. */
function ramp(table: readonly Pt[]): (s: number) => number {
  return (s) => {
    if (s <= table[0][0]) return table[0][1];
    for (let i = 1; i < table.length; i++) {
      if (s <= table[i][0]) {
        const [s0, v0] = table[i - 1];
        const [s1, v1] = table[i];
        return v0 + ((s - s0) / (s1 - s0)) * (v1 - v0);
      }
    }
    return table[table.length - 1][1];
  };
}

/** Closed outline of a tapered body around a centreline; `hw` is the half-width along 0..1. */
function ribbon(pts: readonly Pt[], hw: (s: number) => number): string {
  const ns = normals(pts);
  const last = pts.length - 1;
  const left: Pt[] = [];
  const right: Pt[] = [];
  pts.forEach((p, i) => {
    const w = hw(i / last);
    left.push([p[0] + ns[i][0] * w, p[1] + ns[i][1] * w]);
    right.push([p[0] - ns[i][0] * w, p[1] - ns[i][1] * w]);
  });
  return poly([...left, ...right.reverse()], true);
}

/** A line running beside the centreline at `k` × half-width, between s = from..to. */
function offsetLine(pts: readonly Pt[], hw: (s: number) => number, k: number, from: number, to: number): string {
  const ns = normals(pts);
  const last = pts.length - 1;
  const out: Pt[] = [];
  pts.forEach((p, i) => {
    const s = i / last;
    if (s < from || s > to) return;
    const w = hw(s) * k;
    out.push([p[0] + ns[i][0] * w, p[1] + ns[i][1] * w]);
  });
  return poly(out);
}

/** Short transverse ticks across one side of the body — ventral scales. */
function scutes(pts: readonly Pt[], hw: (s: number) => number, from: number, to: number, every: number): string {
  const ns = normals(pts);
  const last = pts.length - 1;
  let d = "";
  for (let i = 0; i <= last; i += every) {
    const s = i / last;
    if (s < from || s > to) continue;
    const w = hw(s);
    const p = pts[i];
    const n = ns[i];
    d += `M${f(p[0] + n[0] * w * 0.15)} ${f(p[1] + n[1] * w * 0.15)}L${f(p[0] + n[0] * w * 0.82)} ${f(p[1] + n[1] * w * 0.82)}`;
  }
  return d;
}

function spiral(cx: number, cy: number, turns: number, r0: number, growth: number, n: number): Pt[] {
  const end = turns * Math.PI * 2;
  return Array.from({ length: n + 1 }, (_, i) => {
    const th = (i / n) * end;
    const r = r0 + growth * th;
    return [cx + r * Math.cos(th), cy - r * Math.sin(th)];
  });
}

/* ------------------------------------------------------------------ */
/* The six designs                                                     */
/* ------------------------------------------------------------------ */

const LOTUS: Stroke[] = [
  ...both("M100 150C132 148 164 124 172 86C148 96 122 122 100 150Z", 2.4),
  ...both("M100 150C124 134 148 106 146 60C124 80 108 112 100 150Z", 2.4),
  { d: "M100 36C82 66 76 108 100 150C124 108 118 66 100 36Z", w: 2.4 },
  { d: "M100 150C97 116 97 86 100 60", w: 1.3 },
  ...both("M100 150C118 124 132 100 138 76", 1.3),
  ...both("M100 150C130 142 156 126 166 100", 1.3),
  { d: "M40 164C60 156 80 160 100 164C120 168 140 164 160 156", w: 1.8 },
  { d: "M58 176C78 170 122 170 142 176", w: 1.8 },
  { d: circle(100, 22, 2.6), w: 1, fill: true },
  ...both(circle(78, 34, 1.8), 1, true),
];

/* Naga — a tapered body generated around an S-shaped spine. */
const SPINE = chain(
  [
    [
      [84, 30],
      [140, 40],
      [160, 86],
      [130, 108],
    ],
    [
      [130, 108],
      [104, 126],
      [54, 112],
      [52, 146],
    ],
    [
      [52, 146],
      [50, 176],
      [112, 180],
      [168, 166],
    ],
  ],
  40,
);
const HALF_WIDTH = ramp([
  [0, 0.4],
  [0.02, 4],
  [0.055, 7.6],
  [0.11, 4.2],
  [0.45, 6.2],
  [0.8, 3.6],
  [0.97, 1.2],
  [1, 0.2],
]);
const NAGA_EYES = (() => {
  const i = Math.round(0.05 * (SPINE.length - 1));
  const n = normals(SPINE)[i];
  const p = SPINE[i];
  return circle(p[0] + n[0] * 3.4, p[1] + n[1] * 3.4, 1.5) + circle(p[0] - n[0] * 3.4, p[1] - n[1] * 3.4, 1.5);
})();
const NAGA: Stroke[] = [
  { d: ribbon(SPINE, HALF_WIDTH), w: 2.2 },
  { d: NAGA_EYES, w: 1, fill: true },
  { d: "M84 30L73 27M73 27L68 23M73 27L68 31", w: 1.5 },
  { d: offsetLine(SPINE, HALF_WIDTH, -0.45, 0.14, 0.9), w: 1.2 },
  { d: scutes(SPINE, HALF_WIDTH, 0.14, 0.92, 4), w: 1.1 },
];

const DAGGER: Stroke[] = [
  ...both("M100 14C105 24 110 34 110 44L110 118", 2.4),
  { d: "M100 40L100 108", w: 1.4 },
  { d: "M96 34L95 72", w: 1.1 },
  { d: "M62 118C70 115 130 115 138 118L138 128C130 131 70 131 62 128Z", w: 2.4 },
  { d: "M91 128L109 128L107 166L93 166Z", w: 2.4 },
  { d: "M92 137L108 140M92 146L108 149M92 155L108 158", w: 1.4 },
  { d: circle(100, 176, 8.5), w: 2.4 },
  { d: circle(100, 176, 2.4), w: 1, fill: true },
  ...both("M110 112C120 104 134 100 148 102C140 110 126 116 112 114", 1.5),
];

const SUN = { x: 124, y: 100 };
const RAYS = Array.from({ length: 12 }, (_, k) => {
  const a = (k * Math.PI) / 6;
  const r1 = 28;
  const r2 = k % 2 ? 34 : 40;
  return `M${f(SUN.x + r1 * Math.cos(a))} ${f(SUN.y + r1 * Math.sin(a))}L${f(SUN.x + r2 * Math.cos(a))} ${f(SUN.y + r2 * Math.sin(a))}`;
}).join("");
const SUN_MOON: Stroke[] = [
  { d: "M100 42A58 58 0 0 0 100 158A64 64 0 0 1 100 42Z", w: 2.4 },
  { d: "M71 49.8A48 48 0 0 0 71 150.2", w: 1.2 },
  { d: circle(SUN.x, SUN.y, 24), w: 2.4 },
  { d: RAYS, w: 2 },
  { d: "M114 97Q118 92 122 97M126 97Q130 92 134 97", w: 1.4 },
  { d: "M117 106Q124 113 131 106", w: 1.4 },
  { d: sparkle(48, 44, 5) + sparkle(156, 46, 4) + sparkle(150, 156, 5), w: 1.4 },
];

const TIGER_HEAD =
  "M100 162L110 160L114 168L122 158L130 162L134 151L143 153L147 141L155 141L156 129L163 125L160 113L165 104L159 94L161 86C163 74 164 62 167 52C157 54 147 59 140 64C129 55 115 49 100 49";
const TIGER: Stroke[] = [
  ...both(TIGER_HEAD, 2.4),
  ...both("M155 72C157 66 159 61 161 58", 1.5),
  ...both("M118 93C124 85 136 85 142 93C136 99 124 99 118 93Z", 2),
  ...both(circle(130.5, 92.5, 3.2), 1, true),
  ...both("M115 81C124 76 137 77 147 84", 1.6),
  { d: "M90 118C96 116 104 116 110 118C108 126 103 131 100 131C97 131 92 126 90 118Z", w: 1.5, fill: true },
  { d: "M100 131L100 139", w: 2 },
  ...both("M100 139C100 145 106 148 113 145", 2),
  ...both("M112 121C124 121 129 132 121 142", 1.6),
  ...both(
    circle(107, 135, 1.2) + circle(113, 133, 1.2) + circle(119, 135, 1.2) + circle(110, 140, 1.2) + circle(116, 139, 1.2),
    1,
    true,
  ),
  ...both("M121 133L150 128M122 138L152 140M120 143L148 152", 1.3),
  { d: "M100 56L106 72L100 80L94 72Z", w: 1.2, fill: true },
  ...both("M114 58L124 74L116 78Z", 1.2, true),
  ...both("M132 66L146 76L136 81Z", 1.2, true),
  ...both("M136 108L152 100L146 115Z", 1.2, true),
  ...both("M140 125L154 122L144 133Z", 1.2, true),
  ...both("M126 150L140 143L136 156Z", 1.2, true),
];

/* Yantra — an unalome between two spires over a row of cells. Geometry only:
   no script, nothing sacred copied. */
const UNALOME = poly(spiral(100, 150, 2.25, 0.6, 1.05, 72)) + "C90 130 94 120 100 112C106 104 94 98 100 90C106 82 96 78 100 72L100 50";
const CELLS = Array.from({ length: 7 }, (_, i) => 52 + i * 14);
const YANTRA: Stroke[] = [
  { d: UNALOME, w: 2 },
  { d: circle(100, 44, 2.6), w: 1, fill: true },
  ...both("M48 152L62 138L76 152M51 141L62 130L73 141M54 131L62 123L70 131M57 123L62 117L67 123M62 117L62 100", 2),
  ...both(circle(62, 95, 2), 1, true),
  ...both("M84 72C79 66 83 59 86 54", 1.5),
  { d: "M36 170L164 170M36 192L164 192", w: 2 },
  {
    d: CELLS.map((x) =>
      poly(
        [
          [x, 175],
          [x + 12, 175],
          [x + 12, 187],
          [x, 187],
        ],
        true,
      ),
    ).join(""),
    w: 1.5,
  },
  { d: CELLS.map((x) => circle(x + 6, 181, 1.6)).join(""), w: 1, fill: true },
];

export const FLASH: readonly FlashDesign[] = [
  {
    id: "lotus",
    name: "Lotus",
    thai: "Dok Bua",
    artist: "Nok",
    style: "Fine line",
    prices: { small: 1800, medium: 2800, large: 4200 },
    minutes: 90,
    note: "Single-needle petals with a water line — our namesake, drawn fresh every month.",
    strokes: LOTUS,
  },
  {
    id: "naga",
    name: "Naga",
    thai: "Naak",
    artist: "Teo",
    style: "Blackwork",
    prices: { small: 2200, medium: 3400, large: 5000 },
    minutes: 120,
    note: "The island's serpent, coiled to follow the forearm. Scutes along the belly, nothing filled.",
    strokes: NAGA,
  },
  {
    id: "dagger",
    name: "Dagger",
    thai: "Meet San",
    artist: "Lek",
    style: "Traditional",
    prices: { small: 1500, medium: 2400, large: 3600 },
    minutes: 75,
    taken: true,
    note: "A straight blade with a sprig behind the guard. Tattooed in August — retired.",
    strokes: DAGGER,
  },
  {
    id: "sunmoon",
    name: "Sun & Moon",
    thai: "Athit & Chan",
    artist: "Nok",
    style: "Fine line",
    prices: { small: 1800, medium: 2600, large: 3900 },
    minutes: 80,
    note: "A sleeping sun in the crook of a crescent. Sits well on the inner forearm or the calf.",
    strokes: SUN_MOON,
  },
  {
    id: "tiger",
    name: "Tiger",
    thai: "Suea",
    artist: "Teo",
    style: "Blackwork",
    prices: { small: 2600, medium: 3900, large: 5800 },
    minutes: 150,
    note: "Front-on, stripes as solid wedges. Reads from across the room at medium and up.",
    strokes: TIGER,
  },
  {
    id: "yantra",
    name: "Yantra",
    thai: "Yan",
    artist: "Lek",
    style: "Sak-yant inspired",
    prices: { small: 2000, medium: 3000, large: 4400 },
    minutes: 100,
    note: "Unalome and spires in pure geometry. No sacred script, no blessing claimed — every line explained first.",
    strokes: YANTRA,
  },
];

export const flashById = (id: string) => FLASH.find((d) => d.id === id) ?? FLASH[0];

export const baht = (n: number) => `฿${n.toLocaleString("en-US")}`;

/** Draw a design on a square canvas of `px` pixels — the same strokes the SVG shows. */
export function drawFlash(ctx: CanvasRenderingContext2D, design: FlashDesign, px: number, ink = INK) {
  ctx.save();
  ctx.clearRect(0, 0, px, px);
  const k = px / VIEWBOX;
  ctx.scale(k, k);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = ink;
  ctx.fillStyle = ink;
  ctx.shadowColor = ink;
  ctx.shadowBlur = 1.5;
  for (const s of design.strokes) {
    const path = new Path2D(s.d);
    if (s.fill) ctx.fill(path);
    ctx.lineWidth = s.w;
    ctx.stroke(path);
  }
  ctx.restore();
}

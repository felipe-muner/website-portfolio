// Bean & Bowl — the bowl builder's ingredients: the bowl, the smoothie, each
// topping's geometry and texture, and how toppings are laid out in their
// band. Plain three.js; the scene and its motion live in ./bowl-scene.

import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeGeometries, mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export type Rand = () => number;

/** Seeded PRNG (mulberry32): the same bowl on every visit. */
export function rng(seed: number): Rand {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

/** Smoothie surface height, empty and full. */
export const BASE_EMPTY = 0.07;
export const BASE_FULL = 0.5;
/** The full smoothie domes up this much in the middle. */
const DOME = 0.02;

/** Fruit and granola are laid in bands across the bowl, one band per topping. */
export const ROWS = ["banana", "strawberry", "blueberry", "kiwi", "mango", "granola"] as const;
export type RowKey = (typeof ROWS)[number];
export const SPRINKLES = ["coconut", "chia"] as const;
export type SprinkleKey = (typeof SPRINKLES)[number];

/** How high each band stands above the smoothie — sprinkles and honey settle on top. */
export const ROW_TOP: Record<RowKey, number> = {
  banana: 0.07,
  strawberry: 0.042,
  blueberry: 0.09,
  kiwi: 0.064,
  mango: 0.1,
  granola: 0.075,
};

/** Bands share the whole width of the bowl, within these limits. */
const BAND_MAX = 0.44;
const BAND_MIN = 0.2;

/* The bowl's half-profile (radius, height): the foot, the outer wall up to a
   rounded rim, then the inner wall down. Smoothed through these knots. */
const BOWL_KNOTS: [number, number][] = [
  [0, 0.03],
  [0.27, 0.03],
  [0.3, 0.002],
  [0.34, 0],
  [0.37, 0.03],
  [0.5, 0.09],
  [0.66, 0.2],
  [0.78, 0.34],
  [0.855, 0.48],
  [0.877, 0.58],
  [0.872, 0.616],
  [0.856, 0.632],
  [0.836, 0.616],
  [0.82, 0.58],
  [0.796, 0.47],
  [0.715, 0.33],
  [0.58, 0.2],
  [0.38, 0.11],
  [0.15, 0.075],
  [0, 0.07],
];
export const BOWL = new THREE.CatmullRomCurve3(
  BOWL_KNOTS.map(([x, y]) => new THREE.Vector3(x, y, 0)),
  false,
  "centripetal",
)
  .getPoints(220)
  .map((p) => new THREE.Vector2(Math.max(0, p.x), p.y));
/** Index of the rim's top point in BOWL. */
const RIM = BOWL.reduce((top, p, i) => (p.y > BOWL[top].y ? i : top), 0);
/** Where the foot ends and the glazed outer wall begins. */
const FOOT = BOWL.findIndex((p, i) => i > 8 && p.x > 0.38);

/** The inner wall, bottom to rim. */
const INNER = BOWL.slice(RIM)
  .reverse()
  .map((p) => ({ r: p.x, y: p.y }));
export function innerRadius(y: number): number {
  if (y <= INNER[0].y) return INNER[0].r;
  for (let i = 1; i < INNER.length; i++) {
    const a = INNER[i - 1];
    const b = INNER[i];
    if (y <= b.y) return a.r + ((b.r - a.r) * (y - a.y)) / (b.y - a.y);
  }
  return INNER[INNER.length - 1].r;
}
/** Usable radius of the full smoothie surface (toppings stop just short of the wall). */
export const SURFACE_R = innerRadius(BASE_FULL) - 0.05;
/** Height of the full smoothie surface at (x, z), dome included. */
export const surfaceAt = (x: number, z: number) =>
  BASE_FULL + DOME * Math.max(0, 1 - (x * x + z * z) / (SURFACE_R * SURFACE_R));
/** Band width for `n` toppings: together they span the bowl. */
export const bandWidth = (n: number) => Math.min(BAND_MAX, Math.max(BAND_MIN, (2 * SURFACE_R * 0.97) / Math.max(1, n)));

/* ------------------------------------------------------------------ */
/* Canvas helpers                                                      */
/* ------------------------------------------------------------------ */

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable");
  return { c, ctx };
}

function srgb(c: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function linear(c: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 8;
  return t;
}

/** Writes a vertex colour attribute from a per-vertex RGB function. */
function paint(g: THREE.BufferGeometry, color: (x: number, y: number, z: number, i: number) => [number, number, number]) {
  const p = g.attributes.position;
  const colors = new Float32Array(p.count * 3);
  for (let i = 0; i < p.count; i++) colors.set(color(p.getX(i), p.getY(i), p.getZ(i), i), i * 3);
  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return g;
}

const hex = (h: string): [number, number, number] => {
  const c = new THREE.Color(h);
  return [c.r, c.g, c.b];
};
const mix = (a: [number, number, number], b: [number, number, number], t: number): [number, number, number] => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

/* ------------------------------------------------------------------ */
/* The bowl                                                            */
/* ------------------------------------------------------------------ */

export function bowlGeometry() {
  return new THREE.LatheGeometry(BOWL, 160);
}

/**
 * Handmade stoneware: espresso glaze outside, oat glaze inside, a raw clay
 * rim and foot. Returns the colour map and a map for the glaze (red =
 * clearcoat, green = roughness) so the bare clay stays matte.
 */
export function bowlTextures() {
  const r = rng(4);
  const W = 1024;
  const H = 1024;
  const y = (i: number) => (1 - i / (BOWL.length - 1)) * H; // canvas row of profile index i
  const color = canvas(W, H);
  const glaze = canvas(W, H);
  const band = (from: number, to: number, fill: string, finish: string) => {
    const top = Math.min(y(from), y(to));
    const height = Math.abs(y(from) - y(to));
    color.ctx.fillStyle = fill;
    color.ctx.fillRect(0, top, W, height);
    glaze.ctx.fillStyle = finish;
    glaze.ctx.fillRect(0, top, W, height);
  };
  const GLOSSY = "rgb(255,70,0)";
  const MATTE = "rgb(0,235,0)";
  band(0, FOOT, "#a8714c", MATTE);
  band(FOOT, RIM, "#33251c", GLOSSY);
  band(RIM, BOWL.length - 1, "#eee5d4", GLOSSY);
  // Speckles: dark iron in the oat glaze, pale flecks in the dark one.
  const rimY = y(RIM);
  for (let i = 0; i < 5200; i++) {
    const px = r() * W;
    const py = r() * H;
    const inside = py < rimY;
    color.ctx.fillStyle = inside
      ? `rgba(${95 + r() * 40},${62 + r() * 25},${40 + r() * 20},${0.3 + r() * 0.5})`
      : `rgba(${200 + r() * 40},${170 + r() * 30},${130 + r() * 30},${0.08 + r() * 0.18})`;
    color.ctx.beginPath();
    color.ctx.arc(px, py, 0.6 + r() * 1.6, 0, Math.PI * 2);
    color.ctx.fill();
  }
  // Glaze pooling darker toward the foot on the outside.
  const pool = color.ctx.createLinearGradient(0, rimY, 0, y(FOOT));
  pool.addColorStop(0, "rgba(0,0,0,0)");
  pool.addColorStop(1, "rgba(10,6,4,0.35)");
  color.ctx.fillStyle = pool;
  color.ctx.fillRect(0, rimY, W, y(FOOT) - rimY);
  // The raw clay rim, a hair wider than the very top.
  band(RIM - 5, RIM + 4, "#b9845d", MATTE);
  for (let i = 0; i < 900; i++) {
    color.ctx.fillStyle = `rgba(120,78,48,${0.2 + r() * 0.4})`;
    color.ctx.fillRect(r() * W, Math.min(y(RIM - 5), y(RIM + 4)) + r() * Math.abs(y(RIM - 5) - y(RIM + 4)), 1.5, 1.5);
  }
  return { map: srgb(color.c), glaze: linear(glaze.c) };
}

/* ------------------------------------------------------------------ */
/* The smoothie                                                        */
/* ------------------------------------------------------------------ */

/**
 * The smoothie top: a gentle dome with soft spoon-swirl ridges and a little
 * meniscus up the wall (rising along local +z, i.e. world up). Vertex colours
 * lighten the ridge crests; the base colour tints the lot.
 */
export function smoothieGeometry() {
  const g = new THREE.RingGeometry(0, 1, 180, 64);
  const p = g.attributes.position;
  const shade = new Float32Array(p.count);
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    const rr = Math.min(1, Math.hypot(x, y));
    const a = Math.atan2(y, x);
    const swirl = Math.sin(rr * 19 + a * 2 + 1.4 * Math.sin(a * 3 + rr * 5));
    const envelope = smoothstep(0.04, 0.3, rr) * (1 - smoothstep(0.82, 0.97, rr));
    p.setZ(i, DOME * (1 - rr * rr) + 0.0032 * swirl * envelope + 0.011 * smoothstep(0.9, 1, rr));
    shade[i] = 0.9 + 0.14 * Math.max(0, swirl) * envelope + 0.05 * Math.sin(x * 23 + y * 17);
  }
  g.computeVertexNormals();
  return paint(g, (_x, _y, _z, i) => [shade[i], shade[i], shade[i]]);
}

/* ------------------------------------------------------------------ */
/* Toppings                                                            */
/* ------------------------------------------------------------------ */

/**
 * A fruit slice: a disc with softly rounded edges and a slightly uneven
 * outline, its faces mapped top-down to the slice texture (whose outer ring
 * is the skin the rounded edge picks up).
 */
export function sliceGeometry(radius: number, thickness: number, seed: number) {
  const h = thickness / 2;
  const b = h * 0.9;
  const pts: THREE.Vector2[] = [new THREE.Vector2(0, -h)];
  const arc = (cy: number, from: number, to: number) => {
    for (let i = 0; i <= 8; i++) {
      const a = from + ((to - from) * i) / 8;
      pts.push(new THREE.Vector2(radius - b + Math.cos(a) * b, cy + Math.sin(a) * b));
    }
  };
  arc(-h + b, -Math.PI / 2, 0);
  arc(h - b, 0, Math.PI / 2);
  pts.push(new THREE.Vector2(0, h));
  const g = new THREE.LatheGeometry(pts, 56);
  const p = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const z = p.getZ(i);
    uv.setXY(i, 0.5 + x / (2 * radius), 0.5 + z / (2 * radius));
    const a = Math.atan2(z, x);
    const k = 1 + 0.028 * Math.sin(3 * a + seed) + 0.016 * Math.sin(5 * a + seed * 2.3);
    p.setX(i, x * k);
    p.setZ(i, z * k);
  }
  g.computeVertexNormals();
  return g;
}

export function bananaTexture() {
  const r = rng(5);
  const S = 512;
  const { c, ctx } = canvas(S, S);
  ctx.fillStyle = "#cfae5c";
  ctx.fillRect(0, 0, S, S);
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S * 0.48);
  g.addColorStop(0, "#dcbb73");
  g.addColorStop(0.22, "#e9cf8e");
  g.addColorStop(0.72, "#efd99c");
  g.addColorStop(0.92, "#e2c47f");
  g.addColorStop(1, "#cfae5c");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S * 0.48, 0, Math.PI * 2);
  ctx.fill();
  // Faint fibres running out from the centre.
  for (let i = 0; i < 160; i++) {
    const a = r() * Math.PI * 2;
    ctx.strokeStyle = `rgba(212,186,122,${0.05 + r() * 0.08})`;
    ctx.lineWidth = 1 + r() * 2;
    ctx.beginPath();
    ctx.moveTo(S / 2 + Math.cos(a) * S * 0.09, S / 2 + Math.sin(a) * S * 0.09);
    ctx.lineTo(S / 2 + Math.cos(a) * S * 0.44, S / 2 + Math.sin(a) * S * 0.44);
    ctx.stroke();
  }
  // The three-lobed centre and its seeds.
  for (let k = 0; k < 3; k++) {
    const a = (k * Math.PI * 2) / 3 + 0.3;
    ctx.fillStyle = "rgba(186,150,80,0.6)";
    ctx.beginPath();
    ctx.ellipse(S / 2 + Math.cos(a) * S * 0.045, S / 2 + Math.sin(a) * S * 0.045, S * 0.055, S * 0.022, a, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let k = 0; k < 9; k++) {
    const a = (k * Math.PI * 2) / 9 + r() * 0.3;
    const d = S * (0.045 + r() * 0.04);
    ctx.fillStyle = "rgba(78,50,24,0.85)";
    ctx.beginPath();
    ctx.ellipse(S / 2 + Math.cos(a) * d, S / 2 + Math.sin(a) * d, 3, 4.5, a, 0, Math.PI * 2);
    ctx.fill();
  }
  return srgb(c);
}

export function kiwiTexture() {
  const r = rng(26);
  const S = 512;
  const { c, ctx } = canvas(S, S);
  ctx.fillStyle = "#6a5034";
  ctx.fillRect(0, 0, S, S);
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S * 0.47);
  g.addColorStop(0, "#f2eec4");
  g.addColorStop(0.18, "#d3e48b");
  g.addColorStop(0.32, "#8fc23c");
  g.addColorStop(0.7, "#64a425");
  g.addColorStop(1, "#4a851c");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S * 0.47, 0, Math.PI * 2);
  ctx.fill();
  // Pale rays from the core.
  for (let i = 0; i < 70; i++) {
    const a = (i / 70) * Math.PI * 2 + r() * 0.05;
    ctx.strokeStyle = `rgba(236,246,200,${0.18 + r() * 0.14})`;
    ctx.lineWidth = 1.5 + r() * 1.5;
    ctx.beginPath();
    ctx.moveTo(S / 2 + Math.cos(a) * S * 0.1, S / 2 + Math.sin(a) * S * 0.1);
    ctx.lineTo(S / 2 + Math.cos(a) * S * (0.33 + r() * 0.08), S / 2 + Math.sin(a) * S * (0.33 + r() * 0.08));
    ctx.stroke();
  }
  // The core, then two rings of black seeds pointing outward.
  ctx.fillStyle = "#f6f1cf";
  ctx.beginPath();
  ctx.ellipse(S / 2, S / 2, S * 0.1, S * 0.075, 0.4, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 64; i++) {
    const a = (i / 64) * Math.PI * 2 + r() * 0.06;
    const d = S * (0.15 + r() * 0.06);
    ctx.fillStyle = "#1a140c";
    ctx.beginPath();
    ctx.ellipse(S / 2 + Math.cos(a) * d, S / 2 + Math.sin(a) * d, 7, 3.2, a, 0, Math.PI * 2);
    ctx.fill();
  }
  // Skin round the edge.
  ctx.strokeStyle = "#6a5034";
  ctx.lineWidth = S * 0.035;
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S * 0.482, 0, Math.PI * 2);
  ctx.stroke();
  return srgb(c);
}

/* Strawberry slices: cut lengthwise, a heart-shaped slab with rounded edges. */
const BERRY_W = 0.1;
const BERRY_H = 0.12;
function berryOutline(scale = 1, cy = 0) {
  const s = new THREE.Shape();
  const P = (x: number, y: number): [number, number] => [x * scale, cy + (y - cy) * scale];
  s.moveTo(...P(0, -0.058));
  s.bezierCurveTo(...P(0.04, -0.042), ...P(0.054, 0.006), ...P(0.047, 0.034));
  s.bezierCurveTo(...P(0.041, 0.056), ...P(0.016, 0.058), ...P(0, 0.055));
  s.bezierCurveTo(...P(-0.016, 0.058), ...P(-0.041, 0.056), ...P(-0.047, 0.034));
  s.bezierCurveTo(...P(-0.054, 0.006), ...P(-0.04, -0.042), ...P(0, -0.058));
  return s;
}

/** Two material groups: the cut faces, then the red skin round the side. */
export function strawberrySliceGeometry() {
  const raw = new THREE.ExtrudeGeometry(berryOutline(), {
    depth: 0.006,
    bevelEnabled: true,
    bevelThickness: 0.004,
    bevelSize: 0.004,
    bevelSegments: 4,
    curveSegments: 28,
  });
  raw.translate(0, 0, -0.003);
  raw.rotateX(-Math.PI / 2); // cut face up
  const p = raw.attributes.position;
  const uv = raw.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + BERRY_W / 2) / BERRY_W, (-p.getZ(i) + BERRY_H / 2) / BERRY_H);
  raw.deleteAttribute("normal");
  const g = mergeVertices(raw);
  g.computeVertexNormals();
  return g;
}

export function strawberryTexture() {
  const r = rng(12);
  const S = 512;
  const { c, ctx } = canvas(S, S);
  const X = (x: number) => ((x + BERRY_W / 2) / BERRY_W) * S;
  const Y = (y: number) => (1 - (y + BERRY_H / 2) / BERRY_H) * S;
  const fill = (shape: THREE.Shape, style: string | CanvasGradient) => {
    const pts = shape.getPoints(80);
    ctx.fillStyle = style;
    ctx.beginPath();
    pts.forEach((pt, i) => (i ? ctx.lineTo(X(pt.x), Y(pt.y)) : ctx.moveTo(X(pt.x), Y(pt.y))));
    ctx.closePath();
    ctx.fill();
  };
  ctx.fillStyle = "#b80f2a";
  ctx.fillRect(0, 0, S, S);
  const flesh = ctx.createLinearGradient(0, Y(0.05), 0, Y(-0.055));
  flesh.addColorStop(0, "#f39aa8");
  flesh.addColorStop(0.55, "#ea6479");
  flesh.addColorStop(1, "#d42d48");
  fill(berryOutline(0.8, 0.004), flesh);
  const core = ctx.createRadialGradient(X(0), Y(0.012), 0, X(0), Y(0.012), S * 0.2);
  core.addColorStop(0, "rgba(252,226,230,0.95)");
  core.addColorStop(1, "rgba(252,226,230,0)");
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.ellipse(X(0), Y(0.012), S * 0.1, S * 0.24, 0, 0, Math.PI * 2);
  ctx.fill();
  // Fibres fanning down from the stem end.
  const inner = berryOutline(0.8, 0.004).getPoints(46);
  for (const pt of inner) {
    ctx.strokeStyle = `rgba(206,40,66,${0.25 + r() * 0.2})`;
    ctx.lineWidth = 1.4 + r() * 1.4;
    ctx.beginPath();
    ctx.moveTo(X(0), Y(0.04));
    ctx.quadraticCurveTo(X(pt.x * 0.4), Y(pt.y * 0.4 + 0.012), X(pt.x), Y(pt.y));
    ctx.stroke();
  }
  // The pale centre streak.
  ctx.fillStyle = "rgba(255,238,240,0.8)";
  ctx.beginPath();
  ctx.ellipse(X(0), Y(0.008), S * 0.022, S * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();
  // Seeds caught at the rim.
  for (const pt of berryOutline(0.93, 0.002).getPoints(40)) {
    ctx.fillStyle = "#f3c94b";
    ctx.beginPath();
    ctx.ellipse(X(pt.x), Y(pt.y), 3.2, 4.6, r() * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  return srgb(c);
}

/** A blueberry: slightly squat, a dark crown dimple on top, a touch of colour variation. */
export function blueberryGeometry() {
  const g = new THREE.SphereGeometry(0.04, 32, 22);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    let y = p.getY(i) * 0.88;
    if (y > 0.026) y -= (y - 0.026) * 0.85;
    p.setY(i, y);
  }
  g.computeVertexNormals();
  const base = hex("#2c315d");
  const crown = hex("#15172c");
  return paint(g, (x, y, z) => {
    const c = mix(base, crown, smoothstep(0.022, 0.03, y) * smoothstep(0.02, 0.006, Math.hypot(x, z)));
    const v = 0.94 + 0.08 * Math.sin(x * 160 + z * 110);
    return [c[0] * v, c[1] * v, c[2] * v];
  });
}

/** A mango cube: soft-edged, deeper orange underneath. */
export function mangoGeometry() {
  const g = new RoundedBoxGeometry(0.068, 0.068, 0.068, 4, 0.022);
  const low = hex("#ef8a12");
  const high = hex("#ffc53d");
  return paint(g, (_x, y) => mix(low, high, smoothstep(-0.034, 0.034, y)));
}

/** A granola cluster: soft toasted lumps with a couple of oat flakes stuck on. */
export function granolaGeometry() {
  const r = rng(31);
  const toast = hex("#c4883f");
  const dark = hex("#8e5a24");
  const oat = hex("#e3c88f");
  const lump = (radius: number, x: number, y: number, z: number) => {
    const raw = new THREE.IcosahedronGeometry(radius, 3);
    raw.deleteAttribute("normal");
    raw.deleteAttribute("uv");
    const g = mergeVertices(raw);
    const p = g.attributes.position;
    const v = new THREE.Vector3();
    const [a, b, c] = [r() * 6, r() * 6, r() * 6];
    const shade = new Float32Array(p.count);
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const n = v.clone().normalize();
      const bump = 0.17 * Math.sin(n.x * 5.1 + a) * Math.cos(n.y * 4.3 + b) + 0.1 * Math.sin(n.z * 7.7 + c);
      v.multiplyScalar(1 + bump);
      v.y *= 0.72;
      p.setXYZ(i, v.x + x, v.y + y, v.z + z);
      shade[i] = bump;
    }
    g.computeVertexNormals();
    return paint(g, (_x, py, _z, i) => mix(toast, dark, clamp01(0.45 - shade[i] * 2.4 + (py < y - radius * 0.3 ? 0.25 : 0))));
  };
  const flake = (x: number, z: number, turn: number) => {
    const g = new THREE.SphereGeometry(0.019, 12, 6);
    g.scale(1, 0.22, 0.72);
    g.rotateY(turn);
    g.rotateZ(0.35);
    g.translate(x, 0.012, z);
    g.deleteAttribute("uv");
    return paint(g, () => oat);
  };
  const parts = [
    lump(0.03, 0, 0, 0),
    lump(0.022, 0.026, -0.004, 0.011),
    lump(0.02, -0.021, 0, -0.015),
    flake(0.022, -0.018, 0.6),
    flake(-0.02, 0.016, 2.1),
  ];
  for (const part of parts) if (part.attributes.uv) part.deleteAttribute("uv");
  const merged = mergeGeometries(parts);
  if (!merged) throw new Error("granola geometry failed to merge");
  return merged;
}

/** A curled coconut ribbon, toasted at the ends. */
export function coconutGeometry() {
  const g = new THREE.PlaneGeometry(0.08, 0.022, 14, 2);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const t = p.getX(i) / 0.08 + 0.5;
    p.setZ(i, Math.sin(t * Math.PI) * 0.016 + p.getY(i) * 0.25 * Math.sin(t * 6));
  }
  g.computeVertexNormals();
  const white = hex("#fbf7ee");
  const toasted = hex("#dcb47a");
  return paint(g, (x) => mix(white, toasted, smoothstep(0.022, 0.04, Math.abs(x))));
}

export function chiaGeometry() {
  return new THREE.SphereGeometry(0.0075, 8, 6).scale(1, 0.75, 1.5);
}

/** Soft shadow pooled under the bowl. */
export function blobTexture() {
  const { c, ctx } = canvas(256, 256);
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(60,40,20,0.42)");
  g.addColorStop(0.55, "rgba(60,40,20,0.14)");
  g.addColorStop(0.95, "rgba(60,40,20,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

/* ------------------------------------------------------------------ */
/* Placement                                                           */
/* ------------------------------------------------------------------ */

export interface Piece {
  /** Across (x) and along (z) the band, for a band centred on x = 0. */
  dx: number;
  dz: number;
  /** Rests this far above the smoothie surface. */
  lift: number;
  rot: THREE.Euler;
  scale: number;
  /** Footprint radius, to fit pieces inside their band and the bowl. */
  foot: number;
  /** Seconds after the band is switched on that this piece drops. */
  enter: number;
  /** How far above its resting spot it starts falling from. */
  drop: number;
}

const SPAN = SURFACE_R + 0.03;

/**
 * Every spot a topping could take in the widest band: rows along the band,
 * columns centred on it (odd rows shifted half a step, like a honeycomb).
 */
function lattice(step: number, rowStep: number, place: (dx: number, dz: number, row: number) => void) {
  const cols = Math.ceil(BAND_MAX / step) + 1;
  let row = 0;
  for (let dz = -SPAN; dz <= SPAN; dz += rowStep, row++) {
    const shift = row % 2 ? step / 2 : 0;
    for (let c = 0; c < cols + (row % 2); c++) place((c - (cols - 1) / 2) * step - shift, dz, row);
  }
}

/** How each topping is laid out in its band. */
export function bandPieces(key: RowKey, r: Rand): Piece[] {
  const out: Piece[] = [];
  const j = (n: number) => (r() - 0.5) * n;
  const add = (dx: number, dz: number, lift: number, rot: THREE.Euler, scale: number, foot: number, later = 0) =>
    out.push({
      dx,
      dz,
      lift,
      rot,
      scale,
      foot,
      // Laid along the band from one end to the other, a little across it too.
      enter: ((dz + SPAN) / (2 * SPAN)) * 0.42 + ((dx + BAND_MAX / 2) / BAND_MAX) * 0.08 + r() * 0.05 + later,
      drop: 0.3 + r() * 0.16,
    });
  const tumble = () => new THREE.Euler(r() * 6.28, r() * 6.28, r() * 6.28);
  switch (key) {
    case "banana":
      // Overlapping shingles, every slice leaning onto the next.
      lattice(0.092, 0.064, (dx, dz, row) =>
        add(dx + j(0.012), dz, 0.024 + (row % 2) * 0.006, new THREE.Euler(-0.4 + j(0.12), j(0.35), j(0.12)), 0.94 + r() * 0.12, 0.07),
      );
      break;
    case "kiwi":
      lattice(0.1, 0.072, (dx, dz, row) =>
        add(dx + j(0.012), dz, 0.02 + (row % 2) * 0.005, new THREE.Euler(-0.36 + j(0.12), j(0.4), j(0.12)), 0.94 + r() * 0.12, 0.075),
      );
      break;
    case "strawberry":
      // Slices laid flat, tips mostly the same way, overlapping a little.
      lattice(0.088, 0.072, (dx, dz, row) =>
        add(dx + j(0.012), dz + j(0.01), 0.011 + (row % 2) * 0.007, new THREE.Euler(j(0.14), (r() < 0.82 ? 0 : Math.PI) + j(0.45), j(0.14)), 0.9 + r() * 0.18, 0.052),
      );
      break;
    case "blueberry":
      lattice(0.07, 0.062, (dx, dz) => {
        add(dx + j(0.01), dz + j(0.01), 0.033, tumble(), 0.86 + r() * 0.28, 0.04);
        // A second layer heaped on top here and there.
        if (r() < 0.32) add(dx + 0.035 + j(0.01), dz + 0.031, 0.075, tumble(), 0.86 + r() * 0.28, 0.04, 0.16);
      });
      break;
    case "mango":
      lattice(0.078, 0.076, (dx, dz) => {
        add(dx + j(0.014), dz + j(0.014), 0.035, tumble(), 0.86 + r() * 0.26, 0.045);
        if (r() < 0.3) add(dx + 0.04 + j(0.01), dz + 0.038, 0.088, tumble(), 0.86 + r() * 0.26, 0.045, 0.16);
      });
      break;
    case "granola":
      lattice(0.058, 0.056, (dx, dz) => {
        add(dx + j(0.018), dz + j(0.018), 0.024, tumble(), 0.8 + r() * 0.45, 0.035);
        if (r() < 0.36) add(dx + 0.029 + j(0.012), dz + 0.028, 0.058, tumble(), 0.75 + r() * 0.4, 0.035, 0.14);
      });
      break;
  }
  return out;
}

export interface Sprinkle {
  x: number;
  z: number;
  lift: number;
  rot: THREE.Euler;
  enter: number;
  drop: number;
  phase: number;
}

export function sprinkles(n: number, lift: number, reach: number, rain: number, r: Rand): Sprinkle[] {
  return Array.from({ length: n }, () => {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * reach;
    return {
      x: Math.cos(a) * d,
      z: Math.sin(a) * d,
      lift,
      rot: new THREE.Euler(r() * 0.5, r() * 6.28, r() * 0.5),
      enter: r() * rain,
      drop: 0.28 + r() * 0.18,
      phase: r() * 6.28,
    };
  });
}

/** A squeeze-bottle drizzle: strokes back and forth across the bowl, swinging round in loops at each end. */
export function honeyPath() {
  const R = SURFACE_R - 0.07;
  const a = 0.45;
  const d = new THREE.Vector2(Math.cos(a), Math.sin(a));
  const n = new THREE.Vector2(-d.y, d.x);
  const at = (along: number, side: number) => new THREE.Vector3(d.x * along + n.x * side, 0, d.y * along + n.y * side);
  const strokes = 5;
  const spacing = (R * 1.4) / (strokes - 1);
  const pts: THREE.Vector3[] = [];
  for (let k = 0; k < strokes; k++) {
    const o = -R * 0.7 + k * spacing;
    const L = Math.sqrt(Math.max(0, R * R - o * o)) * 0.8;
    const dir = k % 2 ? -1 : 1;
    // Along the stroke, with the slight wobble of a hand-held bottle.
    for (let i = 0; i <= 8; i++) {
      const t = -1 + (i / 8) * 2;
      pts.push(at(dir * t * L, o + 0.009 * Math.sin(i * 1.3 + k * 2.1)));
    }
    if (k === strokes - 1) break;
    // Swing round to the next stroke: a rounded loop past the end of both.
    const oNext = o + spacing;
    const lNext = Math.sqrt(Math.max(0, R * R - oNext * oNext)) * 0.8;
    const tip = dir * (Math.max(L, lNext) + spacing * 0.32);
    pts.push(at(dir * L + (tip - dir * L) * 0.7, o + spacing * 0.12));
    pts.push(at(tip, o + spacing * 0.5));
    pts.push(at(dir * lNext + (tip - dir * lNext) * 0.7, oNext - spacing * 0.12));
  }
  return new THREE.CatmullRomCurve3(pts, false, "centripetal");
}

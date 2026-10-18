// Point clouds for the /portfolio hero. One particle swarm morphs between
// them: a silhouette per business category the templates cover, then a
// browser window for "yours". Every shape has exactly `count` points, sorted
// bottom-to-top, so particle i always lands at a similar height and a morph
// rebuilds the next shape from the ground up instead of exploding randomly.

/** Shape order. The first five match the PORTFOLIO group slugs. */
export const SHAPE_KEYS = ["gym", "yoga", "villas", "local", "adventure", "yours"] as const;
export type ShapeKey = (typeof SHAPE_KEYS)[number];

/** Index of a category's shape; anything unknown becomes "yours". */
export function shapeIndex(key: string): number {
  const i = (SHAPE_KEYS as readonly string[]).indexOf(key);
  return i < 0 ? SHAPE_KEYS.indexOf("yours") : i;
}

type Vec3 = [number, number, number];
type Rand = () => number;

/** One piece of a shape. `weight` sets its share of the particles. */
interface Part {
  weight: number;
  at: (r: Rand) => Vec3;
}

const TAU = Math.PI * 2;
/** Largest half-extent of every normalised shape, in world units. */
const FIT = 1.15;

/** Small seeded PRNG (mulberry32): the same shapes on every visit. */
export function seeded(seed: number): Rand {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ------------------------------------------------------------------ */
/* Primitive samplers                                                  */
/* ------------------------------------------------------------------ */

/** Cylinder wall along the x axis. */
function onCylX(r: Rand, x0: number, x1: number, radius: number): Vec3 {
  const a = r() * TAU;
  return [lerp(x0, x1, r()), Math.cos(a) * radius, Math.sin(a) * radius];
}

/** Circle in the YZ plane (a disc rim facing along x). */
function onCircleYZ(r: Rand, x: number, radius: number): Vec3 {
  const a = r() * TAU;
  return [x, Math.cos(a) * radius, Math.sin(a) * radius];
}

/** Filled annulus in the YZ plane, uniform by area. */
function onDiscYZ(r: Rand, x: number, radius: number, inner: number): Vec3 {
  const a = r() * TAU;
  const d = Math.sqrt(lerp(inner * inner, radius * radius, r()));
  return [x, Math.cos(a) * d, Math.sin(a) * d];
}

/** Horizontal circle. */
function onCircleXZ(r: Rand, y: number, radius: number): Vec3 {
  const a = r() * TAU;
  return [Math.cos(a) * radius, y, Math.sin(a) * radius];
}

/** Horizontal filled disc, uniform by area. */
function onDiscXZ(r: Rand, y: number, radius: number): Vec3 {
  const a = r() * TAU;
  const d = Math.sqrt(r()) * radius;
  return [Math.cos(a) * d, y, Math.sin(a) * d];
}

/** Filled disc facing the camera (XY plane). */
function onDiscXY(r: Rand, cx: number, cy: number, radius: number, z: number): Vec3 {
  const a = r() * TAU;
  const d = Math.sqrt(r()) * radius;
  return [cx + Math.cos(a) * d, cy + Math.sin(a) * d, z];
}

/** Sphere surface. */
function onSphere(r: Rand, c: Vec3, radius: number): Vec3 {
  const z = r() * 2 - 1;
  const a = r() * TAU;
  const s = Math.sqrt(1 - z * z);
  return [c[0] + Math.cos(a) * s * radius, c[1] + Math.sin(a) * s * radius, c[2] + z * radius];
}

/** Straight line, with optional thickness so it reads as a stroke. */
function onSegment(r: Rand, a: Vec3, b: Vec3, thickness = 0): Vec3 {
  const t = r();
  return [
    lerp(a[0], b[0], t),
    lerp(a[1], b[1], t) + (r() - 0.5) * thickness,
    lerp(a[2], b[2], t) + (r() - 0.5) * thickness * 0.5,
  ];
}

/** Triangle, uniform by area, bellied out along `bulge` like a filled sail. */
function onTriangle(r: Rand, a: Vec3, b: Vec3, c: Vec3, bulge: Vec3 = [0, 0, 0]): Vec3 {
  let u = r();
  let v = r();
  if (u + v > 1) {
    u = 1 - u;
    v = 1 - v;
  }
  const w = 1 - u - v;
  const belly = 27 * u * v * w; // 0 on the edges, 1 in the middle
  return [
    a[0] * w + b[0] * u + c[0] * v + bulge[0] * belly,
    a[1] * w + b[1] * u + c[1] * v + bulge[1] * belly,
    a[2] * w + b[2] * u + c[2] * v + bulge[2] * belly,
  ];
}

/** The three edges of a triangle, weighted by length. */
function onTriangleEdges(r: Rand, a: Vec3, b: Vec3, c: Vec3): Vec3 {
  const edges: [Vec3, Vec3][] = [
    [a, b],
    [b, c],
    [c, a],
  ];
  const lengths = edges.map(([p, q]) => Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]));
  let t = r() * lengths.reduce((s, l) => s + l, 0);
  for (let i = 0; i < edges.length; i++) {
    if (t <= lengths[i] || i === edges.length - 1) return onSegment(r, edges[i][0], edges[i][1]);
    t -= lengths[i];
  }
  return a;
}

/** The 12 edges of an axis-aligned box, weighted by length. */
function onBoxEdges(r: Rand, min: Vec3, max: Vec3): Vec3 {
  const [x0, y0, z0] = min;
  const [x1, y1, z1] = max;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const dz = z1 - z0;
  const pick = (lo: number, hi: number) => (r() < 0.5 ? lo : hi);
  const t = r() * (dx + dy + dz);
  if (t < dx) return [x0 + r() * dx, pick(y0, y1), pick(z0, z1)];
  if (t < dx + dy) return [pick(x0, x1), y0 + r() * dy, pick(z0, z1)];
  return [pick(x0, x1), pick(y0, y1), z0 + r() * dz];
}

/** The faces of an axis-aligned box (bottom left out), weighted by area. */
function onBoxFaces(r: Rand, min: Vec3, max: Vec3): Vec3 {
  const [x0, y0, z0] = min;
  const [x1, y1, z1] = max;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const dz = z1 - z0;
  const sides = dy * dz; // ±x
  const top = dx * dz; // +y
  const fronts = dx * dy; // ±z
  const t = r() * (2 * sides + top + 2 * fronts);
  const rx = x0 + r() * dx;
  const ry = y0 + r() * dy;
  const rz = z0 + r() * dz;
  if (t < 2 * sides) return [t < sides ? x0 : x1, ry, rz];
  if (t < 2 * sides + top) return [rx, y1, rz];
  return [rx, ry, t < 2 * sides + top + fronts ? z0 : z1];
}

/** Rectangle outline lying flat (XZ plane). */
function onRectOutlineXZ(r: Rand, x0: number, x1: number, z0: number, z1: number, y: number): Vec3 {
  const w = x1 - x0;
  const d = z1 - z0;
  const t = r() * (w + d);
  if (t < w) return [x0 + r() * w, y, r() < 0.5 ? z0 : z1];
  return [r() < 0.5 ? x0 : x1, y, z0 + r() * d];
}

/** Filled rectangle facing the camera (XY plane). */
function onRectXY(r: Rand, x0: number, x1: number, y0: number, y1: number, z: number): Vec3 {
  return [lerp(x0, x1, r()), lerp(y0, y1, r()), z];
}

/** Rounded-rectangle outline facing the camera, weighted by arc length. */
function onRoundRectXY(
  r: Rand,
  x0: number,
  x1: number,
  y0: number,
  y1: number,
  radius: number,
  z: number,
): Vec3 {
  const w = x1 - x0 - 2 * radius;
  const h = y1 - y0 - 2 * radius;
  const arc = (Math.PI / 2) * radius;
  let t = r() * (2 * w + 2 * h + 4 * arc);
  if (t < w) return [x0 + radius + t, y0, z];
  t -= w;
  if (t < w) return [x0 + radius + t, y1, z];
  t -= w;
  if (t < h) return [x0, y0 + radius + t, z];
  t -= h;
  if (t < h) return [x1, y0 + radius + t, z];
  t -= h;
  const k = Math.min(3, Math.floor(t / arc));
  const a = ((t - k * arc) / arc) * (Math.PI / 2);
  const corners: [number, number, number][] = [
    [x1 - radius, y1 - radius, 0],
    [x0 + radius, y1 - radius, Math.PI / 2],
    [x0 + radius, y0 + radius, Math.PI],
    [x1 - radius, y0 + radius, Math.PI * 1.5],
  ];
  const [cx, cy, start] = corners[k];
  return [cx + Math.cos(start + a) * radius, cy + Math.sin(start + a) * radius, z];
}

/* ------------------------------------------------------------------ */
/* Rotations, applied once per point after sampling                    */
/* ------------------------------------------------------------------ */

function rotateX([x, y, z]: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [x, y * c - z * s, y * s + z * c];
}

function rotateY([x, y, z]: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [x * c + z * s, y, -x * s + z * c];
}

function rotateZ([x, y, z]: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [x * c - y * s, x * s + y * c, z];
}

/* ------------------------------------------------------------------ */
/* Shapes                                                              */
/* ------------------------------------------------------------------ */

/** Gym & Fitness: a loaded dumbbell. */
function dumbbell(): Part[] {
  const parts: Part[] = [{ weight: 9, at: (r) => onCylX(r, -1.02, 1.02, 0.05) }];
  for (const side of [-1, 1]) {
    // Big plate, both faces plus crisp rims.
    const bx = side * 0.56;
    const bt = 0.07;
    parts.push(
      { weight: 5, at: (r) => onCylX(r, bx - bt, bx + bt, 0.5) },
      { weight: 6, at: (r) => onDiscYZ(r, bx - bt, 0.5, 0.06) },
      { weight: 6, at: (r) => onDiscYZ(r, bx + bt, 0.5, 0.06) },
      { weight: 4, at: (r) => onCircleYZ(r, bx - bt, 0.5) },
      { weight: 4, at: (r) => onCircleYZ(r, bx + bt, 0.5) },
    );
    // Smaller outer plate.
    const sx = side * 0.74;
    const st = 0.055;
    parts.push(
      { weight: 3, at: (r) => onCylX(r, sx - st, sx + st, 0.36) },
      { weight: 3, at: (r) => onDiscYZ(r, sx + side * st, 0.36, 0.06) },
      { weight: 2.5, at: (r) => onCircleYZ(r, sx + side * st, 0.36) },
    );
    // Collar.
    parts.push({ weight: 1.5, at: (r) => onCylX(r, side * 0.84 - 0.035, side * 0.84 + 0.035, 0.085) });
  }
  return parts;
}

interface PetalLayer {
  n: number;
  len: number;
  width: number;
  /** Lean away from vertical, in radians. */
  tilt: number;
  y: number;
  /** Distance of the petal base from the centre. */
  r0: number;
  phase: number;
}

/** 0 at base and tip, 1 at the widest point. */
const petalWidth = (u: number) => Math.pow(Math.sin(Math.PI * Math.pow(u, 0.75)), 0.85);

function petal(r: Rand, layer: PetalLayer, phi: number, edge: boolean): Vec3 {
  let u = r();
  let v: number;
  if (edge) {
    v = r() < 0.5 ? -1 : 1;
  } else {
    // Rejection-sample along the length so the fill density stays even.
    while (r() > petalWidth(u)) u = r();
    v = r() * 2 - 1;
  }
  const w = layer.width * petalWidth(u);
  const lx = v * w;
  const ly = u * layer.len;
  const lz = -0.55 * v * v * w + 0.12 * u * u; // cupped edges, tip curling out
  // Lean outward around the local x axis, push out from the centre…
  const c = Math.cos(layer.tilt);
  const s = Math.sin(layer.tilt);
  const y1 = ly * c - lz * s;
  const z1 = ly * s + lz * c + layer.r0;
  // …then spin into place around the flower.
  const cp = Math.cos(phi);
  const sp = Math.sin(phi);
  return [lx * cp + z1 * sp, y1 + layer.y, -lx * sp + z1 * cp];
}

/** Yoga & Wellness: a three-tier lotus. */
function lotus(): Part[] {
  const layers: PetalLayer[] = [
    { n: 7, len: 1.0, width: 0.34, tilt: 1.2, y: 0, r0: 0.14, phase: 0 },
    { n: 7, len: 0.9, width: 0.3, tilt: 0.78, y: 0.05, r0: 0.1, phase: Math.PI / 7 },
    { n: 5, len: 0.66, width: 0.24, tilt: 0.34, y: 0.1, r0: 0.05, phase: 0.4 },
  ];
  const parts: Part[] = [];
  for (const layer of layers) {
    const area = layer.len * layer.width;
    for (let i = 0; i < layer.n; i++) {
      const phi = layer.phase + (i / layer.n) * TAU;
      parts.push(
        { weight: area * 5, at: (r) => petal(r, layer, phi, false) },
        { weight: area * 2.2, at: (r) => petal(r, layer, phi, true) },
      );
    }
  }
  parts.push(
    { weight: 0.6, at: (r) => onDiscXZ(r, 0.2, 0.13) },
    { weight: 0.5, at: (r) => onCircleXZ(r, 0.2, 0.13) },
  );
  return parts;
}

/** Villas & Stays: a cantilevered modern villa with a pool. */
function villa(): Part[] {
  const floorY = -0.5;
  const ground: [Vec3, Vec3] = [[-0.95, floorY, -0.45], [0.5, 0.04, 0.45]];
  const upper: [Vec3, Vec3] = [[-0.4, 0.04, -0.52], [0.98, 0.42, 0.4]];
  const roof: [Vec3, Vec3] = [[-0.48, 0.42, -0.6], [1.08, 0.47, 0.48]];
  const parts: Part[] = [
    { weight: 14, at: (r) => onBoxEdges(r, ...ground) },
    { weight: 7, at: (r) => onBoxFaces(r, ...ground) },
    { weight: 13, at: (r) => onBoxEdges(r, ...upper) },
    { weight: 6, at: (r) => onBoxFaces(r, ...upper) },
    { weight: 6, at: (r) => onBoxEdges(r, ...roof) },
    { weight: 3, at: (r) => onBoxFaces(r, ...roof) },
    // Glazing: ground-floor mullions and an upper ribbon window.
    { weight: 1.5, at: (r) => onSegment(r, [-0.4, 0.23, 0.401], [0.98, 0.23, 0.401]) },
    // Pool (rim + water) and the terrace it sits in.
    { weight: 5, at: (r) => onRectOutlineXZ(r, -0.85, 0.75, 0.62, 1.12, floorY) },
    { weight: 6, at: (r) => [lerp(-0.85, 0.75, r()), floorY + (r() - 0.5) * 0.02, lerp(0.62, 1.12, r())] },
    { weight: 4, at: (r) => onRectOutlineXZ(r, -1.2, 1.25, -0.75, 1.3, floorY) },
  ];
  for (const x of [-0.62, -0.3, 0.02, 0.32]) {
    parts.push({ weight: 1.2, at: (r) => onSegment(r, [x, floorY, 0.451], [x, 0.04, 0.451]) });
  }
  for (const x of [0.0, 0.45]) {
    parts.push({ weight: 0.8, at: (r) => onSegment(r, [x, 0.04, 0.401], [x, 0.42, 0.401]) });
  }
  return parts;
}

/** Local Business: a steaming coffee cup on its saucer. */
function coffeeCup(): Part[] {
  const yb = -0.42;
  const yt = 0.28;
  const rb = 0.33;
  const rt = 0.5;
  const radiusAt = (y: number) => rb + (rt - rb) * Math.pow((y - yb) / (yt - yb), 0.8);
  return [
    {
      weight: 30,
      at: (r) => {
        const y = lerp(yb, yt, r());
        const a = r() * TAU;
        const d = radiusAt(y);
        return [Math.cos(a) * d, y, Math.sin(a) * d];
      },
    },
    { weight: 8, at: (r) => onCircleXZ(r, yt, rt) },
    { weight: 6, at: (r) => onDiscXZ(r, yt - 0.06, rt - 0.03) },
    { weight: 3, at: (r) => onCircleXZ(r, yb, rb) },
    {
      // Handle: a torus arc in the XY plane, meeting the wall at both ends.
      weight: 9,
      at: (r) => {
        const t = lerp(-2.2, 2.2, r());
        const p = r() * TAU;
        const k = 0.19 + 0.045 * Math.cos(p);
        return [0.52 + Math.cos(t) * k, -0.06 + Math.sin(t) * k, 0.045 * Math.sin(p)];
      },
    },
    {
      // Saucer: a shallow dish rising toward the rim.
      weight: 16,
      at: (r) => {
        const d = Math.sqrt(lerp(0.34 * 0.34, 0.86 * 0.86, r()));
        const a = r() * TAU;
        const y = -0.46 + 0.09 * Math.pow((d - 0.34) / 0.52, 2);
        return [Math.cos(a) * d, y, Math.sin(a) * d];
      },
    },
    { weight: 6, at: (r) => onCircleXZ(r, -0.37, 0.86) },
    {
      // Three wisps of steam.
      weight: 10,
      at: (r) => {
        const k = Math.floor(r() * 3) - 1;
        const y = lerp(0.38, 1.0, r());
        const x = k * 0.16 + 0.07 * Math.sin((y - 0.38) * 9 + k * 1.9);
        return [x + (r() - 0.5) * 0.02, y, 0.03 * Math.cos(y * 6 + k)];
      },
    },
  ];
}

/** Adventure & Nightlife: a sloop under sail, on a little swell. */
function sailboat(): Part[] {
  const deck = -0.3;
  const half = 0.85;
  const curve = (s: number) => Math.sqrt(Math.max(0, 1 - s * s));
  const hull = (r: Rand, a: number): Vec3 => {
    const s = lerp(-0.92, 1, r());
    return [s * half, deck - 0.2 * curve(s) * Math.sin(a), 0.27 * curve(s) * Math.cos(a)];
  };
  const mainsail: [Vec3, Vec3, Vec3] = [[0.1, deck + 0.14, 0], [0.1, 0.96, 0], [-0.6, deck + 0.14, 0]];
  const jib: [Vec3, Vec3, Vec3] = [[0.16, 0.86, 0], [0.16, deck + 0.1, 0], [0.82, deck + 0.04, 0]];
  return [
    { weight: 22, at: (r) => hull(r, r() * Math.PI) },
    { weight: 8, at: (r) => hull(r, r() < 0.5 ? 0 : Math.PI) }, // gunwales
    { weight: 5, at: (r) => onSegment(r, [0.12, deck, 0], [0.12, 1.0, 0]) }, // mast
    { weight: 2, at: (r) => onSegment(r, [-0.62, deck + 0.12, 0], [0.12, deck + 0.12, 0]) }, // boom
    { weight: 20, at: (r) => onTriangle(r, ...mainsail, [0, 0, 0.14]) },
    { weight: 8, at: (r) => onTriangleEdges(r, ...mainsail) },
    { weight: 10, at: (r) => onTriangle(r, ...jib, [0, 0, 0.1]) },
    { weight: 5, at: (r) => onTriangleEdges(r, ...jib) },
    {
      weight: 7,
      at: (r) => {
        const k = Math.floor(r() * 3) - 1;
        const x = lerp(-1.0, 1.05, r());
        return [x, -0.6 + 0.035 * Math.sin(x * 7 + k * 2), k * 0.3 + 0.05 * Math.cos(x * 5)];
      },
    },
  ];
}

/** Yours: a browser window with a hero, a headline and three cards. */
function browserWindow(): Part[] {
  const W = 1.1;
  const H = 0.72;
  const parts: Part[] = [
    { weight: 14, at: (r) => onRoundRectXY(r, -W, W, -H, H, 0.09, 0) },
    { weight: 3, at: (r) => onSegment(r, [-W, H - 0.13, 0], [W, H - 0.13, 0]) },
    { weight: 2, at: (r) => onDiscXY(r, -W + 0.1 + 0.075 * Math.floor(r() * 3), H - 0.065, 0.022, 0) },
    { weight: 2, at: (r) => onRoundRectXY(r, -0.36, 0.36, H - 0.1, H - 0.035, 0.03, 0) },
    // Hero block: frame, a faint fill, headline, copy, button and a visual.
    { weight: 5, at: (r) => onRoundRectXY(r, -1.0, 1.0, -0.04, 0.48, 0.05, 0.05) },
    { weight: 4, at: (r) => onRectXY(r, -1.0, 1.0, -0.04, 0.48, 0.05) },
    { weight: 6, at: (r) => onSegment(r, [-0.86, 0.34, 0.1], [0.18, 0.34, 0.1], 0.02) },
    { weight: 5, at: (r) => onSegment(r, [-0.86, 0.24, 0.1], [-0.08, 0.24, 0.1], 0.02) },
    { weight: 2, at: (r) => onSegment(r, [-0.86, 0.14, 0.1], [0.0, 0.14, 0.1], 0.006) },
    { weight: 2.5, at: (r) => onRoundRectXY(r, -0.86, -0.56, 0.02, 0.08, 0.03, 0.1) },
    { weight: 8, at: (r) => onSphere(r, [0.56, 0.21, 0.16], 0.19) },
  ];
  for (const k of [-1, 0, 1]) {
    const x0 = k * 0.69 - 0.3;
    const x1 = k * 0.69 + 0.3;
    parts.push(
      { weight: 4, at: (r) => onRoundRectXY(r, x0, x1, -0.62, -0.13, 0.04, 0.04) },
      { weight: 2.5, at: (r) => onRectXY(r, x0 + 0.04, x1 - 0.04, -0.38, -0.17, 0.06) },
      { weight: 1.2, at: (r) => onSegment(r, [x0 + 0.05, -0.46, 0.06], [x1 - 0.1, -0.46, 0.06], 0.008) },
      { weight: 0.8, at: (r) => onSegment(r, [x0 + 0.05, -0.54, 0.06], [x0 + 0.33, -0.54, 0.06], 0.006) },
    );
  }
  return parts;
}

/* ------------------------------------------------------------------ */
/* Assembly                                                            */
/* ------------------------------------------------------------------ */

interface ShapeSpec {
  parts: () => Part[];
  /** Turns the shape to a flattering three-quarter view. */
  pose: (p: Vec3) => Vec3;
}

const SPECS: Record<ShapeKey, ShapeSpec> = {
  gym: { parts: dumbbell, pose: (p) => rotateZ(rotateY(p, -0.55), -0.12) },
  yoga: { parts: lotus, pose: (p) => rotateX(p, 0.22) },
  villas: { parts: villa, pose: (p) => rotateX(rotateY(p, -0.6), 0.12) },
  local: { parts: coffeeCup, pose: (p) => rotateX(rotateY(p, -0.5), 0.2) },
  adventure: { parts: sailboat, pose: (p) => rotateX(rotateY(p, 0.45), 0.12) },
  yours: { parts: browserWindow, pose: (p) => rotateX(rotateY(p, -0.32), -0.08) },
};

/** Centre on the bounding box and scale so the largest half-extent is FIT. */
function normalize(points: Vec3[]): Vec3[] {
  const min: Vec3 = [Infinity, Infinity, Infinity];
  const max: Vec3 = [-Infinity, -Infinity, -Infinity];
  for (const p of points) {
    for (let k = 0; k < 3; k++) {
      min[k] = Math.min(min[k], p[k]);
      max[k] = Math.max(max[k], p[k]);
    }
  }
  const centre = [0, 1, 2].map((k) => (min[k] + max[k]) / 2);
  const half = Math.max(...[0, 1, 2].map((k) => (max[k] - min[k]) / 2));
  const s = FIT / half;
  return points.map((p): Vec3 => [(p[0] - centre[0]) * s, (p[1] - centre[1]) * s, (p[2] - centre[2]) * s]);
}

/** Sort bottom-to-top (with a little jitter so layers don't band) and pack. */
function pack(points: Vec3[], r: Rand): Float32Array {
  const keyed = points.map((p) => ({ p, k: p[1] + (r() - 0.5) * 0.25 }));
  keyed.sort((a, b) => a.k - b.k);
  const out = new Float32Array(points.length * 3);
  keyed.forEach(({ p }, i) => out.set(p, i * 3));
  return out;
}

function build(spec: ShapeSpec, count: number, seed: number): Float32Array {
  const r = seeded(seed);
  const parts = spec.parts();
  const total = parts.reduce((s, p) => s + p.weight, 0);
  const points: Vec3[] = [];
  // Cumulative rounding: the per-part counts always add up to `count`.
  let acc = 0;
  for (const part of parts) {
    const start = Math.round((acc / total) * count);
    acc += part.weight;
    const end = Math.round((acc / total) * count);
    for (let i = start; i < end; i++) points.push(spec.pose(part.at(r)));
  }
  return pack(normalize(points), r);
}

/** A wide, loose cloud the swarm flies in from on first load. */
function scatter(count: number, seed: number): Float32Array {
  const r = seeded(seed);
  const points: Vec3[] = [];
  for (let i = 0; i < count; i++) points.push(onSphere(r, [0, 0, 0], lerp(2.6, 7, Math.pow(r(), 0.7))));
  return pack(points, r);
}

/** Every target shape (in SHAPE_KEYS order) plus the intro scatter. */
export function buildShapes(count: number): { intro: Float32Array; targets: Float32Array[] } {
  return {
    intro: scatter(count, 99),
    targets: SHAPE_KEYS.map((key, i) => build(SPECS[key], count, 11 + i * 7)),
  };
}

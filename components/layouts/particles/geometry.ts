// Point-cloud geometry for the /portfolio hero particle swarm.
// A shape is a list of weighted parts, each a sampler that returns one point;
// buildShapeSet() turns a list of shapes into same-length point buffers the
// swarm can morph between.

export type Vec3 = [number, number, number];
export type Rand = () => number;

/** One piece of a shape. `weight` sets its share of the particles. */
export interface Part {
  weight: number;
  at: (r: Rand) => Vec3;
}

export interface ShapeSpec {
  parts: () => Part[];
  /** Turns the shape to a flattering three-quarter view. */
  pose: (p: Vec3) => Vec3;
}

/** Every target shape plus the loose cloud the swarm flies in from. */
export interface ShapeSet {
  intro: Float32Array;
  targets: Float32Array[];
}

export const TAU = Math.PI * 2;
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

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ------------------------------------------------------------------ */
/* Primitive samplers                                                  */
/* ------------------------------------------------------------------ */

/** Cylinder wall along the x axis. */
export function onCylX(r: Rand, x0: number, x1: number, radius: number): Vec3 {
  const a = r() * TAU;
  return [lerp(x0, x1, r()), Math.cos(a) * radius, Math.sin(a) * radius];
}

/** Circle in the YZ plane (a disc rim facing along x). */
export function onCircleYZ(r: Rand, x: number, radius: number): Vec3 {
  const a = r() * TAU;
  return [x, Math.cos(a) * radius, Math.sin(a) * radius];
}

/** Filled annulus in the YZ plane, uniform by area. */
export function onDiscYZ(r: Rand, x: number, radius: number, inner: number): Vec3 {
  const a = r() * TAU;
  const d = Math.sqrt(lerp(inner * inner, radius * radius, r()));
  return [x, Math.cos(a) * d, Math.sin(a) * d];
}

/** Horizontal circle. */
export function onCircleXZ(r: Rand, y: number, radius: number): Vec3 {
  const a = r() * TAU;
  return [Math.cos(a) * radius, y, Math.sin(a) * radius];
}

/** Horizontal filled disc, uniform by area. */
export function onDiscXZ(r: Rand, y: number, radius: number): Vec3 {
  const a = r() * TAU;
  const d = Math.sqrt(r()) * radius;
  return [Math.cos(a) * d, y, Math.sin(a) * d];
}

/** Filled disc facing the camera (XY plane). */
export function onDiscXY(r: Rand, cx: number, cy: number, radius: number, z: number): Vec3 {
  const a = r() * TAU;
  const d = Math.sqrt(r()) * radius;
  return [cx + Math.cos(a) * d, cy + Math.sin(a) * d, z];
}

/** Sphere surface. */
export function onSphere(r: Rand, c: Vec3, radius: number): Vec3 {
  const z = r() * 2 - 1;
  const a = r() * TAU;
  const s = Math.sqrt(1 - z * z);
  return [c[0] + Math.cos(a) * s * radius, c[1] + Math.sin(a) * s * radius, c[2] + z * radius];
}

/** Torus arc in the XY plane, from angle t0 to t1 around (cx, cy). */
export function onTorusArcXY(
  r: Rand,
  cx: number,
  cy: number,
  radius: number,
  tube: number,
  t0: number,
  t1: number,
): Vec3 {
  const t = lerp(t0, t1, r());
  const p = r() * TAU;
  const k = radius + tube * Math.cos(p);
  return [cx + Math.cos(t) * k, cy + Math.sin(t) * k, tube * Math.sin(p)];
}

/** Straight line, with optional thickness so it reads as a stroke. */
export function onSegment(r: Rand, a: Vec3, b: Vec3, thickness = 0): Vec3 {
  const t = r();
  return [
    lerp(a[0], b[0], t),
    lerp(a[1], b[1], t) + (r() - 0.5) * thickness,
    lerp(a[2], b[2], t) + (r() - 0.5) * thickness * 0.5,
  ];
}

/** Triangle, uniform by area, bellied out along `bulge` like a filled sail. */
export function onTriangle(r: Rand, a: Vec3, b: Vec3, c: Vec3, bulge: Vec3 = [0, 0, 0]): Vec3 {
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
export function onTriangleEdges(r: Rand, a: Vec3, b: Vec3, c: Vec3): Vec3 {
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
export function onBoxEdges(r: Rand, min: Vec3, max: Vec3): Vec3 {
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
export function onBoxFaces(r: Rand, min: Vec3, max: Vec3): Vec3 {
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
export function onRectOutlineXZ(r: Rand, x0: number, x1: number, z0: number, z1: number, y: number): Vec3 {
  const w = x1 - x0;
  const d = z1 - z0;
  const t = r() * (w + d);
  if (t < w) return [x0 + r() * w, y, r() < 0.5 ? z0 : z1];
  return [r() < 0.5 ? x0 : x1, y, z0 + r() * d];
}

/** Filled rectangle facing the camera (XY plane). */
export function onRectXY(r: Rand, x0: number, x1: number, y0: number, y1: number, z: number): Vec3 {
  return [lerp(x0, x1, r()), lerp(y0, y1, r()), z];
}

/** Rounded-rectangle outline facing the camera, weighted by arc length. */
export function onRoundRectXY(
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

export function rotateX([x, y, z]: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [x, y * c - z * s, y * s + z * c];
}

export function rotateY([x, y, z]: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [x * c + z * s, y, -x * s + z * c];
}

export function rotateZ([x, y, z]: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [x * c - y * s, x * s + y * c, z];
}

/* ------------------------------------------------------------------ */
/* Assembly                                                            */
/* ------------------------------------------------------------------ */

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

/**
 * Sort bottom-to-top (with a little jitter so layers don't band) and pack.
 * Every shape is sorted the same way, so particle i always lands at a similar
 * height and a morph rebuilds the next shape from the ground up.
 */
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

/** Point buffers for every shape (in the given order) plus the intro scatter. */
export function buildShapeSet(specs: readonly ShapeSpec[], count: number): ShapeSet {
  return {
    intro: scatter(count, 99),
    targets: specs.map((spec, i) => build(spec, count, 11 + i * 7)),
  };
}

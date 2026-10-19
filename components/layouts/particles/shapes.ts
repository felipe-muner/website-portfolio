// The silhouettes the particle swarms morph between. Each is built from the
// samplers in ./geometry and normalised to the same size when a set is built.

import {
  TAU,
  lerp,
  onBoxEdges,
  onBoxFaces,
  onCircleXZ,
  onCircleYZ,
  onCylX,
  onDiscXY,
  onDiscXZ,
  onDiscYZ,
  onRectOutlineXZ,
  onRectXY,
  onRoundRectXY,
  onSegment,
  onSphere,
  onTorusArcXY,
  onTriangle,
  onTriangleEdges,
  rotateX,
  rotateY,
  rotateZ,
  type Part,
  type Rand,
  type ShapeSpec,
  type Vec3,
} from "./geometry";

/* ------------------------------------------------------------------ */
/* Dumbbell                                                            */
/* ------------------------------------------------------------------ */

export const DUMBBELL: ShapeSpec = {
  parts: () => {
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
  },
  pose: (p) => rotateZ(rotateY(p, -0.55), -0.12),
};

/* ------------------------------------------------------------------ */
/* Lotus                                                               */
/* ------------------------------------------------------------------ */

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

export const LOTUS: ShapeSpec = {
  parts: () => {
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
  },
  pose: (p) => rotateX(p, 0.22),
};

/* ------------------------------------------------------------------ */
/* Villa                                                               */
/* ------------------------------------------------------------------ */

export const VILLA: ShapeSpec = {
  parts: () => {
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
      // Upper ribbon window.
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
  },
  pose: (p) => rotateX(rotateY(p, -0.6), 0.12),
};

/* ------------------------------------------------------------------ */
/* Coffee cup                                                          */
/* ------------------------------------------------------------------ */

export const COFFEE_CUP: ShapeSpec = {
  parts: () => {
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
      // Handle: a torus arc meeting the wall at both ends.
      { weight: 9, at: (r) => onTorusArcXY(r, 0.52, -0.06, 0.19, 0.045, -2.2, 2.2) },
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
  },
  pose: (p) => rotateX(rotateY(p, -0.5), 0.2),
};

/* ------------------------------------------------------------------ */
/* Sailboat                                                            */
/* ------------------------------------------------------------------ */

export const SAILBOAT: ShapeSpec = {
  parts: () => {
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
  },
  pose: (p) => rotateX(rotateY(p, 0.45), 0.12),
};

/* ------------------------------------------------------------------ */
/* Browser window                                                      */
/* ------------------------------------------------------------------ */

export const BROWSER: ShapeSpec = {
  parts: () => {
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
  },
  pose: (p) => rotateX(rotateY(p, -0.32), -0.08),
};

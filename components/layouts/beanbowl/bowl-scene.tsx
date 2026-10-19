"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeGeometries, mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { ToppingKey } from "@/lib/layouts/beanbowl";

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

/** Smoothie surface height, empty and full. */
const BASE_EMPTY = 0.07;
const BASE_FULL = 0.5;
/** The full smoothie domes up this much in the middle. */
const DOME = 0.022;
/** Fruit is laid in rows across the bowl; these toppings get a row each. */
const ROWS = ["banana", "strawberry", "blueberry", "kiwi", "mango", "granola"] as const;
type RowKey = (typeof ROWS)[number];
const SPRINKLES = ["coconut", "chia"] as const;
type SprinkleKey = (typeof SPRINKLES)[number];
const ROW_WIDTH = 0.21;
/** How high each row stands above the smoothie — sprinkles and honey settle on top. */
const ROW_TOP: Record<RowKey, number> = {
  banana: 0.05,
  strawberry: 0.082,
  blueberry: 0.074,
  kiwi: 0.046,
  mango: 0.08,
  granola: 0.066,
};

/* Intro timing (seconds after the bowl first comes on screen). */
const FILL_TIME = 1.0;
const ROW_GAP = 0.34;

/* Motion, in bowl units (the bowl is about 1.7 across). */
const SQUASH_K = 520;
const SQUASH_C = 13;
/** How each kind of topping falls: gravity, air drag, bounce, and squash on landing. */
interface Feel {
  gravity: number;
  drag: number;
  bounce: number;
  squash: number;
}
const FRUIT: Feel = { gravity: 5.5, drag: 0, bounce: 0.24, squash: 1 };
const CHIA: Feel = { gravity: 7, drag: 0, bounce: 0.12, squash: 0 };
const FLAKE: Feel = { gravity: 2.6, drag: 3.5, bounce: 0, squash: 0 };

type Rand = () => number;
function rng(seed: number): Rand {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

/* Half a coconut shell (radius, height): outer wall up, over the rim, inner wall down. */
const SHELL_KNOTS: [number, number][] = [
  [0, 0],
  [0.2, 0],
  [0.42, 0.06],
  [0.62, 0.18],
  [0.76, 0.33],
  [0.845, 0.48],
  [0.868, 0.6],
  [0.852, 0.628],
  [0.822, 0.6],
  [0.796, 0.47],
  [0.715, 0.33],
  [0.58, 0.2],
  [0.38, 0.1],
  [0.15, 0.055],
  [0, 0.05],
];
/** The profile, smoothed through the knots — no corners anywhere, the rim included. */
const SHELL = new THREE.CatmullRomCurve3(
  SHELL_KNOTS.map(([x, y]) => new THREE.Vector3(x, y, 0)),
  false,
  "centripetal",
)
  .getPoints(140)
  .map((p) => new THREE.Vector2(Math.max(0, p.x), p.y));
const RIM = SHELL.reduce((top, p, i) => (p.y > SHELL[top].y ? i : top), 0);
/** The inner wall, bottom to rim. */
const INNER = SHELL.slice(RIM)
  .reverse()
  .map((p) => ({ r: p.x, y: p.y }));
function innerRadius(y: number): number {
  if (y <= INNER[0].y) return INNER[0].r;
  for (let i = 1; i < INNER.length; i++) {
    const a = INNER[i - 1];
    const b = INNER[i];
    if (y <= b.y) return a.r + ((b.r - a.r) * (y - a.y)) / (b.y - a.y);
  }
  return INNER[INNER.length - 1].r;
}
/** Usable radius of the full smoothie surface (kept off the shell). */
const SURFACE_R = innerRadius(BASE_FULL) - 0.07;
/** Height of the full smoothie surface at (x, z), dome included. */
const surfaceAt = (x: number, z: number) => {
  const rr = (x * x + z * z) / (SURFACE_R * SURFACE_R);
  return BASE_FULL + DOME * Math.max(0, 1 - rr);
};

/* ------------------------------------------------------------------ */
/* Textures                                                            */
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

/** Polished coconut shell: fibrous brown outside, a pale rim, smooth inside. */
function shellTexture() {
  const r = rng(4);
  const W = 1024;
  const H = 1024;
  const { c, ctx } = canvas(W, H);
  // Lathe v runs along the profile: outer wall (bottom of the canvas) up to the rim, then the inner wall.
  const rim = H * (1 - RIM / (SHELL.length - 1));
  ctx.fillStyle = "#5b3a22";
  ctx.fillRect(0, rim, W, H - rim);
  for (let i = 0; i < 1400; i++) {
    const x = r() * W;
    const y = rim + r() * (H - rim);
    ctx.strokeStyle = `rgba(${r() < 0.5 ? "38,22,12" : "122,84,50"},${0.15 + r() * 0.35})`;
    ctx.lineWidth = 1 + r() * 2.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (r() - 0.5) * 18, y - 20 - r() * 60);
    ctx.stroke();
  }
  ctx.fillStyle = "#efe4cf";
  ctx.fillRect(0, rim - 30, W, 36);
  ctx.fillStyle = "#8a5d37";
  ctx.fillRect(0, 0, W, rim - 30);
  for (let i = 0; i < 500; i++) {
    ctx.fillStyle = `rgba(60,36,20,${0.08 + r() * 0.15})`;
    ctx.fillRect(r() * W, r() * (rim - 30), 2 + r() * 30, 1 + r() * 2);
  }
  return srgb(c);
}

/** Swirled smoothie — a grey map the base colour tints. */
function swirlTexture() {
  const r = rng(9);
  const S = 512;
  const { c, ctx } = canvas(S, S);
  ctx.fillStyle = "#d8d8d8";
  ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 90; i++) {
    ctx.strokeStyle = `rgba(${r() < 0.5 ? 255 : 150},${r() < 0.5 ? 255 : 150},${r() < 0.5 ? 255 : 150},${0.1 + r() * 0.16})`;
    ctx.lineWidth = 3 + r() * 10;
    ctx.beginPath();
    ctx.arc(S / 2 + (r() - 0.5) * 60, S / 2 + (r() - 0.5) * 60, 30 + r() * 220, r() * 6, r() * 6 + 1 + r() * 2);
    ctx.stroke();
  }
  return srgb(c);
}

/** A fruit slice seen from above: flesh, a paler core, a ring of seeds, and the skin at the edge. */
function sliceTexture(flesh: string, core: string, seed: string, seeds: number, ringAt: number, skin: string) {
  const r = rng(seeds);
  const S = 256;
  const { c, ctx } = canvas(S, S);
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, core);
  g.addColorStop(ringAt * 0.8, core);
  g.addColorStop(ringAt * 1.4, flesh);
  g.addColorStop(1, flesh);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < seeds; i++) {
    const a = (i / seeds) * Math.PI * 2 + r() * 0.2;
    const d = S * 0.5 * ringAt * (0.9 + r() * 0.35);
    ctx.fillStyle = seed;
    ctx.beginPath();
    ctx.ellipse(S / 2 + Math.cos(a) * d, S / 2 + Math.sin(a) * d, 3.5, 6, a, 0, Math.PI * 2);
    ctx.fill();
  }
  // The rounded edge samples the outermost ring, so that ring is the skin.
  ctx.strokeStyle = skin;
  ctx.lineWidth = S * 0.05;
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S * 0.475, 0, Math.PI * 2);
  ctx.stroke();
  return srgb(c);
}

/** Strawberry skin: red with little yellow seeds. */
function strawberryTexture() {
  const r = rng(12);
  const { c, ctx } = canvas(256, 256);
  ctx.fillStyle = "#c81d36";
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 160; i++) {
    ctx.fillStyle = `rgba(250,${200 + r() * 40},${90 + r() * 40},0.9)`;
    ctx.beginPath();
    ctx.ellipse(r() * 256, r() * 256, 1.6, 2.6, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  return srgb(c);
}

function blobTexture() {
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
/* Geometry                                                            */
/* ------------------------------------------------------------------ */

/** The smoothie: a gently domed disc (the dome rises along local +z, i.e. world up). */
function surfaceGeometry() {
  const g = new THREE.RingGeometry(0, 1, 96, 24);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const rr = p.getX(i) ** 2 + p.getY(i) ** 2;
    p.setZ(i, DOME * Math.max(0, 1 - rr));
  }
  g.computeVertexNormals();
  return g;
}

/** A fruit slice: a disc with softly rounded edges, its faces mapped top-down to the slice texture. */
function sliceGeometry(radius: number, thickness: number) {
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
  const g = new THREE.LatheGeometry(pts, 48);
  const p = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, 0.5 + p.getX(i) / (2 * radius), 0.5 + p.getZ(i) / (2 * radius));
  return g;
}

/** A small whole strawberry lying on its side, with its green calyx (two material groups). */
function strawberryGeometry() {
  const profile = new THREE.CatmullRomCurve3(
    [
      [0, -0.05],
      [0.016, -0.044],
      [0.03, -0.028],
      [0.039, -0.006],
      [0.04, 0.014],
      [0.034, 0.03],
      [0.02, 0.04],
      [0, 0.043],
    ].map(([x, y]) => new THREE.Vector3(x, y, 0)),
    false,
    "centripetal",
  )
    .getPoints(28)
    .map((v) => new THREE.Vector2(Math.max(0, v.x), v.y));
  const berry = new THREE.LatheGeometry(profile, 32);
  const leaves = mergeGeometries(
    Array.from({ length: 5 }, (_, i) => {
      const leaf = new THREE.SphereGeometry(0.018, 10, 6);
      leaf.scale(1, 0.16, 0.45);
      leaf.translate(0.015, 0, 0);
      leaf.rotateZ(0.35);
      leaf.rotateY((i / 5) * Math.PI * 2);
      leaf.translate(0, 0.04, 0);
      return leaf;
    }),
  );
  const merged = leaves && mergeGeometries([berry, leaves], true);
  if (!merged) throw new Error("strawberry geometry failed to merge");
  return merged;
}

/** A blueberry: slightly squat, with the little crown dimple on top. */
function blueberryGeometry() {
  const g = new THREE.SphereGeometry(0.04, 28, 20);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    let y = p.getY(i) * 0.88;
    if (y > 0.026) y -= (y - 0.026) * 0.85;
    p.setY(i, y);
  }
  g.computeVertexNormals();
  return g;
}

/** A granola cluster: a few soft, toasted lumps baked together. */
function granolaGeometry() {
  const r = rng(31);
  const lump = (radius: number, x: number, y: number, z: number) => {
    const raw = new THREE.IcosahedronGeometry(radius, 3);
    raw.deleteAttribute("normal");
    raw.deleteAttribute("uv");
    const g = mergeVertices(raw);
    const p = g.attributes.position;
    const colors = new Float32Array(p.count * 3);
    const v = new THREE.Vector3();
    const [a, b, c] = [r() * 6, r() * 6, r() * 6];
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const n = v.clone().normalize();
      const bump = 0.16 * Math.sin(n.x * 5.1 + a) * Math.cos(n.y * 4.3 + b) + 0.1 * Math.sin(n.z * 7.7 + c);
      v.multiplyScalar(1 + bump);
      v.y *= 0.72;
      p.setXYZ(i, v.x + x, v.y + y, v.z + z);
      const shade = 0.82 + bump * 1.2 + (n.y < -0.3 ? -0.12 : 0);
      colors.set([shade, shade, shade], i * 3);
    }
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  };
  const merged = mergeGeometries([lump(0.032, 0, 0, 0), lump(0.023, 0.028, -0.004, 0.012), lump(0.021, -0.022, 0, -0.016)]);
  if (!merged) throw new Error("granola geometry failed to merge");
  return merged;
}

/** A curled coconut flake. */
function flakeGeometry() {
  const g = new THREE.PlaneGeometry(0.085, 0.026, 12, 2);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin((p.getX(i) / 0.085 + 0.5) * Math.PI) * 0.014);
  g.computeVertexNormals();
  return g;
}

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

interface Piece {
  dx: number;
  dz: number;
  /** Rests this far above the smoothie surface. */
  lift: number;
  rot: THREE.Euler;
  scale: number;
  /** Seconds after its row is switched on that this piece drops. */
  enter: number;
  /** How far above its resting spot it starts falling from. */
  drop: number;
}

/** Where each piece of a row sits, for a row centred on x = 0. */
function rowPieces(key: RowKey, r: Rand): Piece[] {
  const out: Piece[] = [];
  const jitter = (n: number) => (r() - 0.5) * n;
  const span = SURFACE_R + 0.02;
  const add = (dx: number, dz: number, lift: number, rot: THREE.Euler, scale: number) =>
    out.push({
      dx,
      dz,
      lift,
      rot,
      scale,
      // Laid along the row from one end to the other, like a hand placing them.
      enter: ((dz + span) / (2 * span)) * 0.42 + r() * 0.06,
      drop: 0.32 + r() * 0.16,
    });
  const along = (step: number, place: (z: number) => void) => {
    for (let z = -span; z <= span; z += step) place(z);
  };
  switch (key) {
    case "banana":
      along(0.082, (z) => add(jitter(0.03), z, 0.026, new THREE.Euler(-0.42 + jitter(0.15), r() * 6.28, jitter(0.1)), 0.95 + r() * 0.1));
      break;
    case "kiwi":
      along(0.09, (z) => add(jitter(0.03), z, 0.022, new THREE.Euler(0.4 + jitter(0.15), r() * 6.28, jitter(0.1)), 0.95 + r() * 0.1));
      break;
    case "strawberry":
      along(0.12, (z) => add(jitter(0.04), z, 0.042, new THREE.Euler(Math.PI / 2 + jitter(0.3), jitter(0.6), r() < 0.5 ? 0 : Math.PI), 0.9 + r() * 0.2));
      break;
    case "blueberry":
      along(0.07, (z) => {
        for (const dx of [-0.055, 0, 0.055]) add(dx + jitter(0.02), z + jitter(0.03), 0.036, new THREE.Euler(jitter(0.4), r() * 6, jitter(0.4)), 0.85 + r() * 0.3);
      });
      break;
    case "mango":
      along(0.085, (z) => {
        for (const dx of [-0.045, 0.045]) add(dx + jitter(0.015), z + jitter(0.02), 0.036, new THREE.Euler(jitter(0.5), r() * 6, jitter(0.5)), 0.85 + r() * 0.25);
      });
      break;
    case "granola":
      along(0.06, (z) => {
        for (const dx of [-0.06, 0, 0.06]) if (r() < 0.8) add(dx + jitter(0.03), z + jitter(0.03), 0.03, new THREE.Euler(r() * 0.6, r() * 6, r() * 0.6), 0.75 + r() * 0.5);
      });
      break;
  }
  return out;
}

interface Sprinkle {
  x: number;
  z: number;
  lift: number;
  rot: THREE.Euler;
  enter: number;
  drop: number;
  phase: number;
}

function sprinkles(n: number, lift: number, reach: number, rain: number, r: Rand): Sprinkle[] {
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

/* ------------------------------------------------------------------ */
/* Motion: drop in under gravity, bounce, squash, leave                */
/* ------------------------------------------------------------------ */

const GONE = 0;
const WAITING = 1;
const IN = 2;
const LEAVING = 3;

/** Per-piece motion for one instanced topping. */
interface Track {
  on: boolean;
  /** Height above the resting spot, and its velocity. */
  y: Float32Array;
  vy: Float32Array;
  /** Presence, 0..1 (scales the piece in and out). */
  s: Float32Array;
  /** Squash (+ = flattened by a landing), and its velocity. */
  sq: Float32Array;
  vsq: Float32Array;
  wait: Float32Array;
  mode: Uint8Array;
  enter: Float32Array;
  leave: Float32Array;
  drop: Float32Array;
}

function makeTrack(items: readonly { enter: number; drop: number }[], leaveSpread: number): Track {
  const n = items.length;
  const last = Math.max(1e-3, ...items.map((i) => i.enter));
  return {
    on: false,
    y: new Float32Array(n),
    vy: new Float32Array(n),
    s: new Float32Array(n),
    sq: new Float32Array(n),
    vsq: new Float32Array(n),
    wait: new Float32Array(n),
    mode: new Uint8Array(n),
    enter: Float32Array.from(items, (i) => i.enter),
    // Leave in reverse order of arrival.
    leave: Float32Array.from(items, (i) => leaveSpread * (1 - i.enter / last)),
    drop: Float32Array.from(items, (i) => i.drop),
  };
}

const isEmpty = (t: Track) => t.mode.every((m) => m === GONE);

/** Switch a topping on or off; pieces mid-exit turn round instead of starting over. */
function request(t: Track, on: boolean) {
  if (on === t.on) return;
  t.on = on;
  for (let k = 0; k < t.mode.length; k++) {
    if (on) {
      if (t.mode[k] === LEAVING) t.mode[k] = IN;
      else if (t.mode[k] === GONE) {
        t.mode[k] = WAITING;
        t.wait[k] = t.enter[k];
      }
    } else if (t.mode[k] === WAITING) {
      t.mode[k] = GONE;
    } else if (t.mode[k] === IN) {
      t.mode[k] = LEAVING;
      t.wait[k] = t.leave[k];
    }
  }
}

function step(t: Track, feel: Feel, dt: number, reduced: boolean) {
  for (let k = 0; k < t.mode.length; k++) {
    if (reduced) {
      if (t.mode[k] === WAITING) t.mode[k] = IN;
      if (t.mode[k] === LEAVING) t.mode[k] = GONE;
      t.y[k] = 0;
      t.vy[k] = 0;
      t.sq[k] = 0;
      t.vsq[k] = 0;
      t.s[k] = t.mode[k] === IN ? 1 : 0;
      continue;
    }
    if (t.mode[k] === WAITING) {
      t.wait[k] -= dt;
      if (t.wait[k] > 0) continue;
      t.mode[k] = IN;
      t.y[k] = t.drop[k];
      t.vy[k] = 0;
      t.s[k] = 0;
    }
    if (t.mode[k] === IN) {
      t.s[k] = Math.min(1, t.s[k] + dt / 0.14);
      if (t.y[k] < 0) {
        // Something slid in underneath: rise onto it.
        t.y[k] -= t.y[k] * Math.min(1, dt * 14);
        t.vy[k] = 0;
      } else if (t.y[k] > 0 || t.vy[k] !== 0) {
        t.vy[k] += (-feel.gravity - t.vy[k] * feel.drag) * dt;
        t.y[k] += t.vy[k] * dt;
        if (t.y[k] <= 0) {
          const impact = -t.vy[k];
          t.y[k] = 0;
          if (impact > 0.3 && feel.bounce > 0) {
            t.vy[k] = impact * feel.bounce;
            t.vsq[k] += Math.min(3.2, impact) * 1.25 * feel.squash;
          } else {
            t.vy[k] = 0;
          }
        }
      }
    } else if (t.mode[k] === LEAVING) {
      t.wait[k] -= dt;
      if (t.wait[k] <= 0) {
        // Lifted out: rise a little while shrinking away.
        t.s[k] = Math.max(0, t.s[k] - dt / 0.24);
        t.y[k] += dt * 0.25;
        t.vy[k] = 0;
        if (t.s[k] === 0) {
          t.mode[k] = GONE;
          t.y[k] = 0;
        }
      }
    }
    if (feel.squash > 0) {
      t.vsq[k] += (-SQUASH_K * t.sq[k] - SQUASH_C * t.vsq[k]) * dt;
      t.sq[k] += t.vsq[k] * dt;
    }
  }
}

interface RowMotion {
  track: Track;
  x: number;
  vx: number;
  target: number;
  /** How much of the row is down on the smoothie, 0..1 (sprinkles and honey rest on it). */
  presence: number;
}

interface SprinkleMotion {
  track: Track;
  /** Current resting height of each sprinkle (it rides on whatever is beneath). */
  rest: Float32Array;
}

interface Motion {
  rows: Record<RowKey, RowMotion>;
  sprinkles: Record<SprinkleKey, SprinkleMotion>;
}

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

const HONEY_RINGS = 360;
const HONEY_RADIAL = 12;
const HONEY_RADIUS = 0.0075;

interface BowlProps {
  base: string;
  toppings: ReadonlySet<ToppingKey>;
  reduced: boolean;
  start: boolean;
}

function Bowl({ base, toppings, reduced, start }: BowlProps) {
  const assets = useMemo(() => {
    const r = rng(17);
    const rows = Object.fromEntries(ROWS.map((k) => [k, rowPieces(k, r)])) as Record<RowKey, Piece[]>;
    const path = new THREE.CatmullRomCurve3(
      Array.from({ length: 33 }, (_, i) => {
        const x = -0.62 + (i / 32) * 1.24;
        return new THREE.Vector3(x, 0, 0.36 * Math.sin(x * 7.2) * Math.sqrt(1 - (x / 0.7) ** 2));
      }),
    );
    const honey = new THREE.TubeGeometry(path, HONEY_RINGS, HONEY_RADIUS, HONEY_RADIAL, false);
    const ring = Array.from({ length: HONEY_RINGS + 1 }, (_, j) => path.getPointAt(j / HONEY_RINGS));
    const baseY = Float32Array.from({ length: honey.attributes.position.count }, (_, i) => honey.attributes.position.getY(i));
    return {
      rows,
      sprinkles: {
        coconut: sprinkles(18, 0.012, SURFACE_R - 0.04, 0.7, r),
        chia: sprinkles(160, 0.008, SURFACE_R - 0.02, 0.5, r),
      } satisfies Record<SprinkleKey, Sprinkle[]>,
      shell: new THREE.LatheGeometry(SHELL, 128),
      shellMap: shellTexture(),
      swirl: swirlTexture(),
      shadow: blobTexture(),
      surface: surfaceGeometry(),
      honey,
      honeyRing: ring,
      honeyBaseY: baseY,
      cap: new THREE.SphereGeometry(HONEY_RADIUS, 14, 10),
      geo: {
        banana: sliceGeometry(0.075, 0.026),
        kiwi: sliceGeometry(0.08, 0.022),
        strawberry: strawberryGeometry(),
        blueberry: blueberryGeometry(),
        mango: new RoundedBoxGeometry(0.072, 0.072, 0.072, 4, 0.02),
        granola: granolaGeometry(),
        coconut: flakeGeometry(),
        chia: new THREE.SphereGeometry(0.008, 8, 6).scale(1, 0.8, 1.5),
      } satisfies Record<RowKey | SprinkleKey, THREE.BufferGeometry>,
      tex: {
        banana: sliceTexture("#f3e3a8", "#efe0b4", "#6b4a2a", 9, 0.22, "#e2cf8f"),
        kiwi: sliceTexture("#79b43a", "#eef3c8", "#1d160f", 26, 0.32, "#6b5134"),
        strawberry: strawberryTexture(),
      },
    };
  }, []);

  const mats = useMemo(
    () => ({
      banana: new THREE.MeshStandardMaterial({ map: assets.tex.banana, roughness: 0.5 }),
      kiwi: new THREE.MeshPhysicalMaterial({ map: assets.tex.kiwi, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.25 }),
      strawberry: [
        new THREE.MeshPhysicalMaterial({ map: assets.tex.strawberry, roughness: 0.3, clearcoat: 0.5, clearcoatRoughness: 0.2 }),
        new THREE.MeshStandardMaterial({ color: "#3f7d2c", roughness: 0.6, side: THREE.DoubleSide }),
      ],
      blueberry: new THREE.MeshPhysicalMaterial({
        color: "#2c315f",
        roughness: 0.62,
        sheen: 1,
        sheenColor: new THREE.Color("#8d97d4"),
        sheenRoughness: 0.55,
      }),
      mango: new THREE.MeshPhysicalMaterial({ color: "#f7a623", roughness: 0.3, clearcoat: 0.45, clearcoatRoughness: 0.3 }),
      granola: new THREE.MeshStandardMaterial({ color: "#c08745", vertexColors: true, roughness: 0.85 }),
      coconut: new THREE.MeshStandardMaterial({ color: "#f7f1e4", roughness: 0.65, side: THREE.DoubleSide }),
      chia: new THREE.MeshStandardMaterial({ color: "#2a2724", roughness: 0.5 }),
    }),
    [assets],
  );

  useEffect(
    () => () => {
      const { shell, shellMap, swirl, shadow, surface, honey, cap, geo, tex } = assets;
      for (const d of [shell, shellMap, swirl, shadow, surface, honey, cap, ...Object.values(geo), ...Object.values(tex)]) d.dispose();
    },
    [assets],
  );
  useEffect(
    () => () => {
      for (const m of Object.values(mats).flat()) m.dispose();
    },
    [mats],
  );

  const group = useRef<THREE.Group>(null);
  const surface = useRef<THREE.Mesh>(null);
  const surfaceMat = useRef<THREE.MeshStandardMaterial>(null);
  const honeyMesh = useRef<THREE.Mesh>(null);
  const honeyStart = useRef<THREE.Mesh>(null);
  const honeyEnd = useRef<THREE.Mesh>(null);
  const meshes = useRef<Partial<Record<RowKey | SprinkleKey, THREE.InstancedMesh>>>({});
  const motion = useRef<Motion | null>(null);
  const state = useRef({ intro: reduced ? 1000 : 0, time: 0, honey: 0, color: new THREE.Color(base), pointerX: 0 });
  const scratch = useRef({
    m: new THREE.Matrix4(),
    squash: new THREE.Matrix4(),
    q: new THREE.Quaternion(),
    e: new THREE.Euler(),
    s: new THREE.Vector3(),
    origin: new THREE.Vector3(),
    target: new THREE.Color(),
    ringHeights: new Float32Array(HONEY_RINGS + 1),
  });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "touch") state.current.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    const g = group.current;
    const top = surface.current;
    const topMat = surfaceMat.current;
    const drizzle = honeyMesh.current;
    const capA = honeyStart.current;
    const capB = honeyEnd.current;
    if (!g || !top || !topMat || !drizzle || !capA || !capB) return;
    const st = state.current;
    const dt = Math.min(delta, 1 / 30);
    if (start) st.intro += dt;
    st.time += dt;
    const { m, squash, q, e, s: sc, origin, target, ringHeights } = scratch.current;
    const instanced = (key: RowKey | SprinkleKey) => {
      const cached = meshes.current[key];
      if (cached) return cached;
      const found = g.getObjectByName(key);
      if (found instanceof THREE.InstancedMesh) meshes.current[key] = found;
      return meshes.current[key];
    };
    const mo = (motion.current ??= {
      rows: Object.fromEntries(
        ROWS.map((k) => [k, { track: makeTrack(assets.rows[k], 0.16), x: 0, vx: 0, target: 0, presence: 0 }]),
      ) as Record<RowKey, RowMotion>,
      sprinkles: Object.fromEntries(
        SPRINKLES.map((k) => [
          k,
          { track: makeTrack(assets.sprinkles[k], 0.12), rest: new Float32Array(assets.sprinkles[k].length).fill(BASE_FULL) },
        ]),
      ) as Record<SprinkleKey, SprinkleMotion>,
    });

    // Smoothie: fills on arrival, takes on the chosen base colour.
    const fill = easeOutCubic(clamp01(st.intro / FILL_TIME));
    const level = BASE_EMPTY + (BASE_FULL - BASE_EMPTY) * fill;
    const radius = innerRadius(level) - 0.004;
    top.position.y = level;
    top.scale.set(radius, radius, 1);
    target.set(base);
    st.color.lerp(target, reduced ? 1 : 1 - Math.exp(-dt * 4));
    topMat.color.copy(st.color);

    // Rows: the chosen ones are packed side by side across the bowl and glide when that changes.
    const chosen = ROWS.filter((k) => toppings.has(k));
    const total = chosen.length * ROW_WIDTH;
    for (const key of ROWS) {
      const row = mo.rows[key];
      const slot = chosen.indexOf(key);
      const want = slot >= 0 && st.intro > FILL_TIME + slot * ROW_GAP;
      if (slot >= 0) row.target = -total / 2 + (slot + 0.5) * ROW_WIDTH;
      if (want && !row.track.on && isEmpty(row.track)) {
        row.x = row.target; // a fresh row drops straight into its place
        row.vx = 0;
      }
      request(row.track, want);
      if (reduced) {
        row.x = row.target;
        row.vx = 0;
      } else {
        const w = 8.5; // critically damped glide
        row.vx += (w * w * (row.target - row.x) - 2 * w * row.vx) * dt;
        row.x += row.vx * dt;
      }
      step(row.track, FRUIT, dt / 2, reduced);
      step(row.track, FRUIT, dt / 2, reduced);

      const t = row.track;
      const pieces = assets.rows[key];
      let down = 0;
      for (let k = 0; k < pieces.length; k++) {
        down += t.mode[k] === IN ? t.s[k] * (t.y[k] < 0.04 ? 1 : 0) : t.mode[k] === LEAVING ? t.s[k] : 0;
      }
      row.presence += (down / pieces.length - row.presence) * Math.min(1, dt * 10);

      const mesh = instanced(key);
      if (!mesh) continue;
      pieces.forEach((piece, k) => {
        const px = row.x + piece.dx;
        const reach = Math.sqrt(Math.max(0, SURFACE_R * SURFACE_R - px * px));
        // Pieces near the rim shrink away smoothly instead of being cut off.
        const size = piece.scale * t.s[k] * smoothstep(-0.01, 0.05, reach - Math.abs(piece.dz));
        if (size < 1e-3) {
          m.makeScale(0, 0, 0);
        } else {
          q.setFromEuler(piece.rot);
          m.compose(origin, q, sc.setScalar(size));
          m.premultiply(squash.makeScale(1 + t.sq[k] * 0.5, 1 - t.sq[k], 1 + t.sq[k] * 0.5));
          m.setPosition(px, surfaceAt(px, piece.dz) + piece.lift + t.y[k] - t.sq[k] * 0.02 * size, piece.dz);
        }
        mesh.setMatrixAt(k, m);
      });
      mesh.instanceMatrix.needsUpdate = true;
    }

    /** Height of whatever is on top at x: a row (as far as it's down) or bare smoothie. */
    const cover = (x: number) => {
      let h = 0;
      for (const key of ROWS) {
        const row = mo.rows[key];
        if (row.presence > 0.01) h = Math.max(h, ROW_TOP[key] * row.presence * smoothstep(0.115, 0.07, Math.abs(x - row.x)));
      }
      return h;
    };

    // Sprinkles rain in last and settle on whatever is beneath them.
    const finish = FILL_TIME + chosen.length * ROW_GAP;
    for (const key of SPRINKLES) {
      const { track: t, rest } = mo.sprinkles[key];
      request(t, toppings.has(key) && st.intro > finish + (key === "chia" ? 0.25 : 0));
      const spots = assets.sprinkles[key];
      for (let k = 0; k < spots.length; k++) {
        const f = spots[k];
        const next = surfaceAt(f.x, f.z) + cover(f.x) + f.lift;
        t.y[k] += rest[k] - next; // keep its height when the ground moves; gravity takes it from there
        rest[k] = next;
      }
      const feel = key === "coconut" ? FLAKE : CHIA;
      step(t, feel, dt / 2, reduced);
      step(t, feel, dt / 2, reduced);
      const mesh = instanced(key);
      if (!mesh) continue;
      for (let k = 0; k < spots.length; k++) {
        const f = spots[k];
        if (t.s[k] < 1e-3) {
          m.makeScale(0, 0, 0);
        } else {
          // Coconut flakes flutter and tumble on the way down.
          const air = key === "coconut" ? Math.min(1, t.y[k] / 0.25) : 0;
          e.set(
            f.rot.x + Math.cos(f.phase * 1.7 + st.time * 5) * 0.5 * air,
            f.rot.y,
            f.rot.z + Math.sin(f.phase + st.time * 5.5) * 0.7 * air,
          );
          q.setFromEuler(e);
          m.compose(origin, q, sc.setScalar(t.s[k]));
          m.setPosition(f.x + Math.sin(f.phase + st.time * 6) * 0.03 * air, rest[k] + t.y[k], f.z);
        }
        mesh.setMatrixAt(k, m);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }

    // Honey: drawn across from one end, draped over whatever it crosses.
    const honeyOn = toppings.has("honey") && st.intro > finish + 0.55;
    st.honey = reduced ? (honeyOn ? 1 : 0) : clamp01(st.honey + ((honeyOn ? 1 : -1) * dt) / 1.2);
    const shown = Math.round(easeInOutSine(st.honey) * HONEY_RINGS);
    drizzle.visible = shown > 0;
    capA.visible = shown > 0;
    capB.visible = shown > 0;
    if (shown > 0) {
      const pos = drizzle.geometry.attributes.position;
      for (let j = 0; j <= HONEY_RINGS; j++) {
        const c = assets.honeyRing[j];
        ringHeights[j] = surfaceAt(c.x, c.z) + cover(c.x) + HONEY_RADIUS + 0.004;
        for (let i = 0; i <= HONEY_RADIAL; i++) {
          const v = j * (HONEY_RADIAL + 1) + i;
          pos.setY(v, assets.honeyBaseY[v] + ringHeights[j]);
        }
      }
      pos.needsUpdate = true;
      drizzle.geometry.setDrawRange(0, shown * 6 * HONEY_RADIAL);
      const a = assets.honeyRing[0];
      const b = assets.honeyRing[shown];
      capA.position.set(a.x, ringHeights[0], a.z);
      capB.position.set(b.x, ringHeights[shown], b.z);
    }

    // A slow turntable, nudged by the cursor.
    if (!reduced) g.rotation.y += dt * 0.12;
    g.rotation.x += (st.pointerX * 0.04 - g.rotation.x) * (reduced ? 1 : 1 - Math.exp(-dt * 3));
  });

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[2.3, 2.3]} />
        <meshBasicMaterial map={assets.shadow} transparent depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0005, 0]} receiveShadow>
        <planeGeometry args={[3.4, 3.4]} />
        <shadowMaterial transparent opacity={0.16} />
      </mesh>
      <group ref={group}>
        <mesh geometry={assets.shell} castShadow receiveShadow>
          <meshStandardMaterial map={assets.shellMap} roughness={0.45} metalness={0} side={THREE.DoubleSide} />
        </mesh>
        <mesh ref={surface} geometry={assets.surface} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <meshStandardMaterial ref={surfaceMat} map={assets.swirl} roughness={0.42} />
        </mesh>

        {ROWS.map((key) => (
          <instancedMesh
            key={key}
            name={key}
            args={[assets.geo[key], mats[key], assets.rows[key].length]}
            castShadow
            receiveShadow
            frustumCulled={false}
          />
        ))}
        {SPRINKLES.map((key) => (
          <instancedMesh
            key={key}
            name={key}
            args={[assets.geo[key], mats[key], assets.sprinkles[key].length]}
            castShadow
            frustumCulled={false}
          />
        ))}

        <mesh ref={honeyMesh} geometry={assets.honey} frustumCulled={false}>
          <meshPhysicalMaterial color="#d98a12" roughness={0.08} clearcoat={1} clearcoatRoughness={0.05} transparent opacity={0.9} />
        </mesh>
        <mesh ref={honeyStart} geometry={assets.cap}>
          <meshPhysicalMaterial color="#d98a12" roughness={0.08} clearcoat={1} clearcoatRoughness={0.05} transparent opacity={0.9} />
        </mesh>
        <mesh ref={honeyEnd} geometry={assets.cap}>
          <meshPhysicalMaterial color="#d98a12" roughness={0.08} clearcoat={1} clearcoatRoughness={0.05} transparent opacity={0.9} />
        </mesh>
      </group>
    </>
  );
}

function Lights() {
  const sun = useRef<THREE.DirectionalLight>(null);
  // A tight, soft shadow frustum around the bowl, so toppings ground themselves in the smoothie.
  useLayoutEffect(() => {
    const light = sun.current;
    if (!light) return;
    const cam = light.shadow.camera;
    cam.left = -1.5;
    cam.right = 1.5;
    cam.top = 1.5;
    cam.bottom = -1.5;
    cam.near = 0.5;
    cam.far = 9;
    cam.updateProjectionMatrix();
    light.shadow.mapSize.set(2048, 2048);
    light.shadow.radius = 5;
    light.shadow.bias = -0.0003;
    light.shadow.normalBias = 0.012;
  }, []);
  return (
    <>
      <hemisphereLight args={["#ffffff", "#e7d6bf", 1.05]} />
      <directionalLight ref={sun} position={[-1.5, 3.4, 1.7]} intensity={2.5} color="#fff4e6" castShadow />
      <directionalLight position={[2.5, 2, -1.5]} intensity={0.85} color="#ffe2c2" />
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2.5} position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[5, 5, 1]} />
        <Lightformer intensity={1.6} position={[-4, 2, 2]} rotation={[0, Math.PI / 2, 0]} scale={[2, 4, 1]} />
        <Lightformer intensity={1} position={[4, 2, 2]} rotation={[0, -Math.PI / 2, 0]} scale={[2, 4, 1]} />
      </Environment>
    </>
  );
}

function Stage(props: BowlProps) {
  const viewport = useThree((s) => s.viewport);
  const fit = Math.min(viewport.width / 2.3, viewport.height / 2.15, 1.1);
  return (
    <group scale={fit} position={[0, -0.22, 0]}>
      <Lights />
      <Bowl {...props} />
    </group>
  );
}

/**
 * Bean & Bowl — the bowl builder's 3D bowl: a coconut-shell bowl whose
 * smoothie base fills, then fruit falls in row by row (with a little bounce
 * and squash), finished with coconut, chia and a honey drizzle that drape over
 * whatever is beneath. Reacts live to the base and toppings. Client-only.
 */
export default function BowlScene({
  active,
  start,
  reduced,
  base,
  toppings,
}: {
  active: boolean;
  /** Begin the build (fill, then rows) — the bowl is properly on screen. */
  start: boolean;
  reduced: boolean;
  /** Smoothie colour, as CSS hex. */
  base: string;
  toppings: ReadonlySet<ToppingKey>;
}) {
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 30, position: [0, 2.5, 2.25], near: 0.1, far: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ camera }) => camera.lookAt(0, 0.26, 0)}
      style={{ pointerEvents: "none" }}
    >
      <Stage base={base} toppings={toppings} reduced={reduced} start={start} />
    </Canvas>
  );
}

// Yoga 6 · Stillwater — the river stones of the hero cairn: their shapes,
// how they rest on one another, and a stone surface shader (mottle, granite
// grain, sediment bands, quartz veins, pitting, a wet line at the water).

import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { PERTURB, SIMPLEX } from "./glsl";

/** Seeded PRNG (mulberry32): the same cairn on every visit. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Noise3 = (x: number, y: number, z: number) => number;

/** Seeded 3D gradient noise (Perlin's improved noise), about [-1, 1]. */
function perlin(seed: number): Noise3 {
  const random = rng(seed);
  const perm = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  const p = new Uint8Array(512);
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255];
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a: number, b: number, t: number) => a + t * (b - a);
  const grad = (hash: number, x: number, y: number, z: number) => {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };
  return (x, y, z) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    const u = fade(x);
    const v = fade(y);
    const w = fade(z);
    const A = p[X] + Y;
    const AA = p[A] + Z;
    const AB = p[A + 1] + Z;
    const B = p[X + 1] + Y;
    const BA = p[B] + Z;
    const BB = p[B + 1] + Z;
    return lerp(
      lerp(
        lerp(grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z), u),
        lerp(grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z), u),
        v,
      ),
      lerp(
        lerp(grad(p[AA + 1], x, y, z - 1), grad(p[BA + 1], x - 1, y, z - 1), u),
        lerp(grad(p[AB + 1], x, y - 1, z - 1), grad(p[BB + 1], x - 1, y - 1, z - 1), u),
        v,
      ),
      w,
    );
  };
}

/* ------------------------------------------------------------------ */
/* The cairn                                                           */
/* ------------------------------------------------------------------ */

export interface StoneLook {
  base: string;
  alt: string;
  /** Dark and light grains. */
  dark: string;
  light: string;
  /** 0..1 — granite grain. */
  speckle: number;
  /** 0..1 — sediment bands. */
  bands: number;
  /** 0..1 — a quartz vein. */
  vein: number;
  roughness: number;
  /** Surface pitting. */
  bump: number;
}

export interface StoneSpec {
  /** Half-extents: width (x), height (y), depth (z). */
  size: readonly [number, number, number];
  /** Superellipsoid squareness, vertical then around: 1 = ellipsoid, lower = flatter faces. */
  square: readonly [number, number];
  /** How far the outline wanders from the ideal shape. */
  lump: number;
  seed: number;
  /** Rest pose: tilt about x and z, then yaw (radians). */
  tilt: readonly [number, number];
  yaw: number;
  /** Nudge off the stone below's high point, in stack units. */
  lean: readonly [number, number];
  look: StoneLook;
}

/** Bottom to top. The base sits a third under water. */
export const CAIRN: readonly StoneSpec[] = [
  {
    // A broad, dark river stone.
    size: [0.98, 0.42, 0.8],
    square: [0.62, 0.92],
    lump: 0.07,
    seed: 11,
    tilt: [0.02, -0.04],
    yaw: 0.3,
    lean: [0, 0],
    look: { base: "#4a4641", alt: "#35322e", dark: "#1e1c1a", light: "#827c73", speckle: 0.3, bands: 0, vein: 0, roughness: 0.72, bump: 0.55 },
  },
  {
    // Speckled granite.
    size: [0.74, 0.33, 0.6],
    square: [0.68, 0.88],
    lump: 0.08,
    seed: 23,
    tilt: [-0.05, 0.07],
    yaw: -0.6,
    lean: [0.05, 0],
    look: { base: "#99938a", alt: "#7c766d", dark: "#3a3733", light: "#e2dbcf", speckle: 0.9, bands: 0, vein: 0, roughness: 0.8, bump: 0.45 },
  },
  {
    // Banded sandstone.
    size: [0.6, 0.29, 0.5],
    square: [0.7, 0.9],
    lump: 0.07,
    seed: 37,
    tilt: [0.06, -0.1],
    yaw: 1.1,
    lean: [-0.07, 0.02],
    look: { base: "#a6876b", alt: "#8a6a50", dark: "#5c4433", light: "#cfb293", speckle: 0.25, bands: 0.75, vein: 0, roughness: 0.9, bump: 0.7 },
  },
  {
    // Dark slate with a quartz vein, set on a tilt.
    size: [0.5, 0.25, 0.4],
    square: [0.62, 0.8],
    lump: 0.06,
    seed: 41,
    tilt: [0.04, 0.24],
    yaw: -0.2,
    lean: [0.05, 0],
    look: { base: "#4d545b", alt: "#3a4046", dark: "#1f2327", light: "#727a82", speckle: 0.15, bands: 0, vein: 1, roughness: 0.58, bump: 0.35 },
  },
  {
    // Pale limestone.
    size: [0.36, 0.2, 0.3],
    square: [0.72, 0.88],
    lump: 0.07,
    seed: 53,
    tilt: [-0.06, -0.12],
    yaw: 0.7,
    lean: [-0.04, 0],
    look: { base: "#cdc3b2", alt: "#b2a691", dark: "#8c8170", light: "#eee8dc", speckle: 0.4, bands: 0.2, vein: 0, roughness: 0.86, bump: 0.5 },
  },
  {
    // A small dark pebble to finish.
    size: [0.23, 0.155, 0.2],
    square: [0.8, 0.92],
    lump: 0.06,
    seed: 67,
    tilt: [0.05, 0.08],
    yaw: 0.2,
    lean: [0, 0],
    look: { base: "#5a524c", alt: "#443d39", dark: "#221f1c", light: "#8a827a", speckle: 0.3, bands: 0, vein: 0.6, roughness: 0.66, bump: 0.4 },
  },
];

/** How much of the base stone's height sits under the water line. */
const SUBMERGED = 0.3;

/** A pebble: a superellipsoid (flat-faced, round-edged) with lumps. */
export function stoneGeometry(spec: StoneSpec): THREE.BufferGeometry {
  const detail = Math.round(16 + 26 * Math.min(1, spec.size[0]));
  const ico = new THREE.IcosahedronGeometry(1, detail);
  ico.deleteAttribute("normal");
  ico.deleteAttribute("uv");
  const geometry = mergeVertices(ico);
  ico.dispose();

  const noise = perlin(spec.seed);
  const [a, b, c] = spec.size;
  const [e1, e2] = spec.square;
  const pos = geometry.getAttribute("position");
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    // Where the ray along v meets the superellipsoid surface.
    const around = Math.pow(Math.abs(v.x / a), 2 / e2) + Math.pow(Math.abs(v.z / c), 2 / e2);
    const r = Math.pow(Math.pow(around, e2 / e1) + Math.pow(Math.abs(v.y / b), 2 / e1), -e1 / 2);
    const lumps =
      noise(v.x * 1.3, v.y * 1.3, v.z * 1.3) * 0.65 +
      noise(v.x * 2.7 + 5, v.y * 2.7, v.z * 2.7) * 0.28 +
      noise(v.x * 6 + 9, v.y * 6, v.z * 6) * 0.07;
    const k = r * (1 + lumps * spec.lump);
    pos.setXYZ(i, v.x * k, v.y * k, v.z * k);
  }
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

/* ------------------------------------------------------------------ */
/* Stacking: each stone lowered onto the one below until it touches    */
/* ------------------------------------------------------------------ */

export interface Placement {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  /** Where it touches the stone below — the pivot it rocks on. */
  contact: THREE.Vector3;
}

const CELL = 0.02;
const cellKey = (x: number, z: number) => (Math.floor(x / CELL) + 4096) * 8192 + (Math.floor(z / CELL) + 4096);

/** The highest point of a placed stone in each grid cell — its top, seen from above. */
function topSurface(geometry: THREE.BufferGeometry, position: THREE.Vector3, quaternion: THREE.Quaternion) {
  const top = new Map<number, number>();
  const pos = geometry.getAttribute("position");
  const v = new THREE.Vector3();
  let peak = new THREE.Vector3(position.x, -Infinity, position.z);
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).applyQuaternion(quaternion).add(position);
    const k = cellKey(v.x, v.z);
    const y = top.get(k);
    if (y === undefined || v.y > y) top.set(k, v.y);
    if (v.y > peak.y) peak = v.clone();
  }
  return { top, peak };
}

/** Lower a posed stone, centred over (x, z), until it first touches `top`. */
function settle(geometry: THREE.BufferGeometry, quaternion: THREE.Quaternion, x: number, z: number, top: Map<number, number>) {
  const pos = geometry.getAttribute("position");
  const v = new THREE.Vector3();
  const contact = new THREE.Vector3();
  let lift = -Infinity;
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).applyQuaternion(quaternion);
    const surface = top.get(cellKey(v.x + x, v.z + z));
    if (surface === undefined) continue;
    if (surface - v.y > lift) {
      lift = surface - v.y;
      contact.set(v.x + x, surface, v.z + z);
    }
  }
  return { y: lift, contact };
}

/** Rest poses for the whole cairn, bottom up, in stack space (water line at y = 0). */
export function stackCairn(geometries: readonly THREE.BufferGeometry[], specs: readonly StoneSpec[]): Placement[] {
  const placed: Placement[] = [];
  let below: ReturnType<typeof topSurface> | null = null;
  specs.forEach((spec, i) => {
    const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(spec.tilt[0], spec.yaw, spec.tilt[1], "YXZ"));
    if (!below) {
      const position = new THREE.Vector3(0, spec.size[1] * (1 - 2 * SUBMERGED), 0);
      placed.push({ position, quaternion, contact: new THREE.Vector3(0, -spec.size[1], 0) });
    } else {
      // Start over the high point of the stone below, then shift halfway
      // toward the first touch, so the weight sits roughly over the contact.
      let x = below.peak.x + spec.lean[0];
      let z = below.peak.z + spec.lean[1];
      let rest = settle(geometries[i], quaternion, x, z, below.top);
      x += (rest.contact.x - x) * 0.5;
      z += (rest.contact.z - z) * 0.5;
      rest = settle(geometries[i], quaternion, x, z, below.top);
      // Sink a hair so the stones read as touching, never hovering.
      placed.push({ position: new THREE.Vector3(x, rest.y - 0.004, z), quaternion, contact: rest.contact });
    }
    const p = placed[i];
    below = topSurface(geometries[i], p.position, p.quaternion);
  });
  return placed;
}

/* ------------------------------------------------------------------ */
/* Surface                                                             */
/* ------------------------------------------------------------------ */

const STONE_HEAD = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uAlt;
  uniform vec3 uDark;
  uniform vec3 uLight;
  uniform vec4 uLook;   // speckle, bands, vein, bump
  uniform vec4 uVein;   // vein plane: normal, offset
  uniform float uSeed;
  uniform float uWet;
  varying vec3 vStone;
  varying vec3 vStoneWorld;
  ${SIMPLEX}
  ${PERTURB}
`;

const STONE_COLOR = /* glsl */ `
  #include <color_fragment>
  vec3 sp = vStone * 2.2 + uSeed;
  float mottle = sw_fbm(sp * 0.9);
  vec3 stone = mix(uAlt, uBase, smoothstep(-0.45, 0.45, mottle));
  // Sediment bands, wavering with the mottle.
  float band = sin(vStone.y * 34.0 + mottle * 5.0) * 0.5 + 0.5;
  stone = mix(stone, mix(uAlt, uDark, 0.35), band * band * uLook.y * 0.6);
  // Granite grain: dark and light crystals.
  float grainA = sw_snoise(sp * 11.0);
  float grainB = sw_snoise(sp * 15.0 + 7.3);
  stone = mix(stone, uDark, smoothstep(0.4, 0.74, grainA) * uLook.x * 0.6);
  stone = mix(stone, uLight, smoothstep(0.46, 0.76, grainB) * uLook.x * 0.45);
  // A quartz vein: a thin, wandering band right through the stone.
  float veinD = abs(dot(vStone, uVein.xyz) - uVein.w + sw_snoise(sp * 3.0) * 0.025);
  float vein = (1.0 - smoothstep(0.012, 0.03, veinD)) * uLook.z;
  stone = mix(stone, vec3(0.86, 0.83, 0.77), vein);
  // Wet just above the water line, darker and glassy.
  float wetEdge = 0.07 + sw_snoise(sp * 2.0) * 0.03;
  float wet = uWet * (1.0 - smoothstep(wetEdge - 0.05, wetEdge, vStoneWorld.y));
  stone *= mix(1.0, 0.5, wet);
  diffuseColor.rgb *= stone;
`;

const STONE_ROUGHNESS = /* glsl */ `
  #include <roughnessmap_fragment>
  roughnessFactor = clamp(roughnessFactor + sw_snoise(sp * 7.0) * 0.08 - vein * 0.3, 0.05, 1.0);
  roughnessFactor = mix(roughnessFactor, 0.2, wet);
`;

const STONE_BUMP = /* glsl */ `
  #include <normal_fragment_maps>
  // Pitting, fading out where it would alias.
  float footprint = length(fwidth(sp));
  float fine = 1.0 - smoothstep(0.03, 0.08, footprint);
  float pits = sw_snoise(sp * 6.0) * 0.6 + sw_snoise(sp * 17.0) * 0.3 * fine - smoothstep(0.55, 0.8, grainA) * 0.12 * fine;
  float height = pits * uLook.w * 0.006 * (1.0 - wet * 0.6);
  normal = sw_perturbNormal(-vViewPosition, normal, vec2(dFdx(height), dFdy(height)), faceDirection);
`;

const STONE_COAT = /* glsl */ `
  #include <lights_physical_fragment>
  #ifdef USE_CLEARCOAT
    material.clearcoat = max(wet, 0.08);
    material.clearcoatRoughness = mix(0.45, 0.06, wet);
  #endif
`;

/** A stone's surface: physical material plus the procedural shading above. */
export function stoneMaterial(look: StoneLook, seed: number, wet: boolean): THREE.MeshPhysicalMaterial {
  const random = rng(seed * 7 + 3);
  const veinNormal = new THREE.Vector3(random() - 0.5, (random() - 0.5) * 0.6, random() - 0.5).normalize();
  const uniforms = {
    uBase: { value: new THREE.Color(look.base) },
    uAlt: { value: new THREE.Color(look.alt) },
    uDark: { value: new THREE.Color(look.dark) },
    uLight: { value: new THREE.Color(look.light) },
    uLook: { value: new THREE.Vector4(look.speckle, look.bands, look.vein, look.bump) },
    uVein: { value: new THREE.Vector4(veinNormal.x, veinNormal.y, veinNormal.z, (random() - 0.5) * 0.12) },
    uSeed: { value: seed * 0.37 },
    uWet: { value: wet ? 1 : 0 },
  };
  const material = new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    roughness: look.roughness,
    metalness: 0,
    clearcoat: 0.08,
    clearcoatRoughness: 0.45,
    envMapIntensity: 0.85,
  });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vStone;\nvarying vec3 vStoneWorld;")
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvStone = position;\nvStoneWorld = (modelMatrix * vec4(position, 1.0)).xyz;",
      );
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\n${STONE_HEAD}`)
      .replace("#include <color_fragment>", STONE_COLOR)
      .replace("#include <roughnessmap_fragment>", STONE_ROUGHNESS)
      .replace("#include <normal_fragment_maps>", STONE_BUMP)
      .replace("#include <lights_physical_fragment>", STONE_COAT);
  };
  material.customProgramCacheKey = () => "stillwater-stone";
  return material;
}

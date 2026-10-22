"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* Counts & layout                                                     */
/* ------------------------------------------------------------------ */

const WIDE = typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
const SPARKS = WIDE ? 720 : 360;
const COAL_SHAPES = 3;
const COALS_EACH = 52;
const FLAMES = 14;
const SMOKE = 5;
/** Radius of the coal bed, the basin lip, and the height of the grate. */
const BED = 0.92;
const LIP = 1.2;
const GRATE_Y = 0.6;
const FLOOR_Y = -0.72;
const PAGE_BG = "#0e0c0a";

/** Seeded PRNG (mulberry32), so the coals pile the same way every visit. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const random = rng(23);

/** Deterministic 0–1 from a point — used to lump the coal geometry without opening its seams. */
function hashPoint(x: number, y: number, z: number, seed: number) {
  const v = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719 + seed * 3.17) * 43758.5453;
  return v - Math.floor(v);
}

/* ------------------------------------------------------------------ */
/* Shaders                                                             */
/* ------------------------------------------------------------------ */

const NOISE2 = /* glsl */ `
  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise2(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise2(p);
      p = p * 2.03 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }
`;

const NOISE3 = /* glsl */ `
  float hash31(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash31(i), hash31(i + vec3(1, 0, 0)), f.x), mix(hash31(i + vec3(0, 1, 0)), hash31(i + vec3(1, 1, 0)), f.x), f.y),
      mix(mix(hash31(i + vec3(0, 0, 1)), hash31(i + vec3(1, 0, 1)), f.x), mix(hash31(i + vec3(0, 1, 1)), hash31(i + vec3(1, 1, 1)), f.x), f.y),
      f.z
    );
  }
`;

/* Coals: dark crust with glowing cracks; the whole lump glows when hot. */
const COAL_VERTEX = /* glsl */ `
  attribute float aPhase;
  attribute float aHeat;
  uniform float uTime;
  uniform float uBreath;
  varying vec3 vWorld;
  varying vec3 vObj;
  varying float vHeat;
  varying float vSeed;

  void main() {
    vObj = position;
    vSeed = aPhase;
    vec4 world = modelMatrix * instanceMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    // Each coal breathes on its own slow cycle; stoking adds a fast flicker.
    float slow = 0.5 + 0.5 * sin(uTime * (0.6 + aPhase * 1.1) + aPhase * 6.2831);
    float fast = 0.5 + 0.5 * sin(uTime * 9.0 + aPhase * 31.0);
    vHeat = aHeat * (0.55 + 0.35 * slow) + uBreath * (0.35 + 0.45 * fast) * (0.5 + 0.5 * aHeat);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const COAL_FRAGMENT = /* glsl */ `
  varying vec3 vWorld;
  varying vec3 vObj;
  varying float vHeat;
  varying float vSeed;
  ${NOISE3}

  void main() {
    vec3 n = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
    float up = clamp(n.y, 0.0, 1.0);
    float facing = clamp(dot(n, normalize(cameraPosition - vWorld)), 0.0, 1.0);
    float grain = noise3(vObj * 6.0 + vSeed * 17.0);
    float crack = smoothstep(0.56, 0.42, grain);
    float heat = clamp(vHeat, 0.0, 1.6);
    float emit = mix(crack, 1.0, smoothstep(0.55, 1.3, heat)) * clamp(heat, 0.0, 1.0);
    emit *= 1.0 - 0.3 * up;
    vec3 ember = mix(vec3(0.45, 0.03, 0.0), vec3(1.0, 0.40, 0.05), clamp(heat, 0.0, 1.0));
    ember = mix(ember, vec3(1.0, 0.85, 0.55), smoothstep(0.9, 1.6, heat));
    vec3 ash = vec3(0.075, 0.07, 0.068) * (0.5 + 0.9 * facing) + vec3(0.07, 0.065, 0.06) * up * grain;
    ash += vec3(0.16, 0.05, 0.0) * up * (0.4 + 0.6 * heat);
    vec3 col = mix(ash, ember * (0.75 + 0.7 * heat), clamp(emit, 0.0, 1.0));
    gl_FragColor = vec4(col, 1.0);
  }
`;

/* Flames & smoke: camera-facing quads with a scrolling-noise teardrop. */
const FLAME_VERTEX = /* glsl */ `
  attribute vec3 aSeed;
  uniform float uTime;
  uniform float uBreath;
  uniform float uSmoke;
  varying vec2 vUv;
  varying float vSeed;

  void main() {
    vUv = uv;
    vSeed = aSeed.x;
    vec4 origin = modelViewMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    float h = aSeed.z * (1.0 + uBreath * (0.9 - 0.5 * uSmoke));
    h *= 0.85 + 0.25 * sin(uTime * (1.7 + aSeed.x * 2.5) + aSeed.x * 10.0);
    float w = aSeed.y * (1.0 + 0.25 * uBreath);
    vec2 off = vec2((uv.x - 0.5) * w, uv.y * h);
    float lean = sin(uTime * (1.4 + aSeed.x) + aSeed.x * 7.0) * uv.y * uv.y * 0.18 * w;
    off.x += lean + uBreath * uv.y * uv.y * 0.3;
    origin.xy += off;
    gl_Position = projectionMatrix * origin;
  }
`;

const FLAME_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform float uBreath;
  uniform float uSmoke;
  varying vec2 vUv;
  varying float vSeed;
  ${NOISE2}

  void main() {
    vec2 uv = vUv;
    float speed = (1.2 + uBreath * 1.3) * (1.0 - 0.65 * uSmoke);
    float n = fbm(vec2(uv.x * 2.4 + vSeed * 13.0, uv.y * 2.6 - uTime * speed + vSeed * 7.0));
    float halfW = mix(0.5, 0.05, pow(uv.y, 0.8));
    float d = abs(uv.x - 0.5) / halfW;
    float body = (1.0 - uv.y) * clamp(1.0 - d * d, 0.0, 1.0);
    float field = body * 1.5 - n * 0.95;
    float flame = smoothstep(0.0, 0.32, field);
    float core = smoothstep(0.35, 0.85, field);
    vec3 col = mix(vec3(0.85, 0.12, 0.0), vec3(1.0, 0.48, 0.05), flame);
    col = mix(col, vec3(1.0, 0.9, 0.62), core);
    float alpha = flame * (0.8 + 0.3 * uBreath) * smoothstep(0.0, 0.08, uv.y);
    if (uSmoke > 0.5) {
      col = vec3(0.5, 0.46, 0.43);
      alpha = smoothstep(0.0, 0.3, uv.y) * (1.0 - uv.y) * smoothstep(0.25, 0.7, n + body * 0.35) * (0.14 + 0.08 * uBreath);
    }
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(col, alpha);
  }
`;

/* Sparks: points born on the bed, rising with turbulence, more and faster when stoked. */
const SPARK_VERTEX = /* glsl */ `
  attribute float aSeed;
  attribute float aSpeed;
  attribute float aLife;
  uniform float uTime;
  uniform float uBreath;
  uniform float uPixelRatio;
  varying float vAlpha;
  varying float vHeat;

  void main() {
    float age = mod(uTime * (1.0 + uBreath * 0.8) + aSeed * 37.0, aLife);
    float t = age / aLife;
    // Only a few fly from a calm bed; a breath sends most of them up.
    float gate = step(aSeed, 0.28 + uBreath * 0.72);
    vec3 p = position;
    p.y += age * aSpeed * (1.0 + uBreath * 0.9);
    float wob = age * 0.3;
    p.x += sin(age * 3.1 + aSeed * 40.0) * wob + (aSeed - 0.5) * age * 0.35 + uBreath * age * 0.3;
    p.z += cos(age * 2.7 + aSeed * 31.0) * wob;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float size = (2.2 + aSeed * 2.6) * (1.0 - t * 0.55) * (1.0 + uBreath * 0.3);
    gl_PointSize = size * uPixelRatio * 3.6 / -mv.z;
    float twinkle = 0.65 + 0.35 * sin(age * 23.0 + aSeed * 50.0);
    vAlpha = gate * smoothstep(0.0, 0.04, t) * (1.0 - smoothstep(0.45, 1.0, t)) * twinkle * (0.7 + uBreath * 0.3);
    vHeat = 1.0 - t;
  }
`;

const SPARK_FRAGMENT = /* glsl */ `
  varying float vAlpha;
  varying float vHeat;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = (1.0 - smoothstep(0.35, 1.0, d)) * vAlpha;
    if (a < 0.004) discard;
    vec3 col = mix(vec3(0.9, 0.2, 0.02), vec3(1.0, 0.82, 0.45), vHeat * vHeat);
    gl_FragColor = vec4(col, a);
  }
`;

/* ------------------------------------------------------------------ */
/* Assets                                                              */
/* ------------------------------------------------------------------ */

type Uniforms = Record<string, THREE.IUniform<number>>;

/** A lumpy, slightly flattened coal: a low-poly sphere pushed about per point. */
function lumpGeometry(seed: number) {
  const g = new THREE.SphereGeometry(1, 9, 6);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const d = 0.7 + hashPoint(x, y, z, seed) * 0.55;
    pos.setXYZ(i, x * d, y * d * 0.78, z * d);
  }
  pos.needsUpdate = true;
  g.computeVertexNormals();
  return g;
}

/** The bed: `count` instances of one lump shape, piled up towards the middle. */
function coalBed(geometry: THREE.BufferGeometry, material: THREE.Material, count: number) {
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  const phase = new Float32Array(count);
  const heat = new Float32Array(count);
  const m = new THREE.Matrix4();
  const p = new THREE.Vector3();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const s = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    const r = Math.sqrt(random()) * BED;
    const a = random() * Math.PI * 2;
    const pile = 1 - r / BED;
    const layer = random() < 0.22 ? 0.11 : 0;
    const size = 0.085 + random() * 0.085 + pile * 0.03;
    p.set(Math.cos(a) * r, 0.03 + random() * 0.07 + pile * 0.15 + layer, Math.sin(a) * r);
    q.setFromEuler(e.set(random() * Math.PI, random() * Math.PI, random() * Math.PI));
    s.set(size * (0.8 + random() * 0.45), size * (0.8 + random() * 0.45), size * (0.8 + random() * 0.45));
    mesh.setMatrixAt(i, m.compose(p, q, s));
    phase[i] = random();
    heat[i] = Math.min(1, Math.max(0.12, 1.15 - r / BED + (random() - 0.5) * 0.4) * (layer > 0 ? 0.8 : 1));
  }
  mesh.instanceMatrix.needsUpdate = true;
  geometry.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phase, 1));
  geometry.setAttribute("aHeat", new THREE.InstancedBufferAttribute(heat, 1));
  mesh.frustumCulled = false;
  return mesh;
}

/** Flame (or smoke) quads over the hot middle of the bed. */
function flameSheet(material: THREE.Material, count: number, smoke: boolean) {
  const geometry = new THREE.PlaneGeometry(1, 1);
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  const seed = new Float32Array(count * 3);
  const m = new THREE.Matrix4();
  for (let i = 0; i < count; i++) {
    const r = Math.sqrt(random()) * (smoke ? 0.45 : 0.55);
    const a = random() * Math.PI * 2;
    const x = Math.cos(a) * r - 0.08;
    const z = Math.sin(a) * r + 0.05;
    const mid = 1 - r / 0.6;
    mesh.setMatrixAt(i, m.makeTranslation(x, smoke ? 0.75 + random() * 0.3 : 0.24 + random() * 0.08, z));
    seed.set(
      smoke
        ? [random(), 0.7 + random() * 0.5, 1.3 + random() * 0.8]
        : [random(), 0.3 + random() * 0.28 + mid * 0.1, 0.5 + random() * 0.35 + mid * 0.3],
      i * 3,
    );
  }
  mesh.instanceMatrix.needsUpdate = true;
  geometry.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seed, 3));
  mesh.frustumCulled = false;
  mesh.renderOrder = smoke ? 3 : 2;
  return mesh;
}

function sparkCloud(material: THREE.Material, count: number) {
  const geometry = new THREE.BufferGeometry();
  const origin = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  const speed = new Float32Array(count);
  const life = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = Math.sqrt(random()) * 0.8;
    const a = random() * Math.PI * 2;
    origin.set([Math.cos(a) * r, 0.22 + random() * 0.14, Math.sin(a) * r], i * 3);
    seed[i] = random();
    speed[i] = 0.35 + random() * 0.5;
    life[i] = 1.4 + random() * 1.5;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(origin, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  geometry.setAttribute("aSpeed", new THREE.BufferAttribute(speed, 1));
  geometry.setAttribute("aLife", new THREE.BufferAttribute(life, 1));
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  points.renderOrder = 4;
  return points;
}

/** Soft round blob: the glow sprite and the floor pool share it. */
function blob(inner: string, outer: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable");
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, inner);
  g.addColorStop(0.5, outer.replace(/[\d.]+\)$/, "0.25)"));
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

/** Half-profile (radius, height) of the fire bowl — up the inside, over the lip, down the outside. */
const BASIN_PROFILE: [number, number][] = [
  [0, -0.1],
  [0.7, -0.08],
  [1.0, 0.05],
  [1.1, 0.19],
  [1.16, 0.22],
  [LIP, 0.2],
  [LIP + 0.02, 0.1],
  [LIP, -0.12],
  [1.0, -0.16],
  [0, -0.18],
];

/** Half-profile of the cast-iron pan: base, flared wall, rolled rim, back inside. */
const PAN_PROFILE: [number, number][] = [
  [0, 0],
  [0.26, 0],
  [0.3, 0.015],
  [0.325, 0.085],
  [0.345, 0.1],
  [0.33, 0.105],
  [0.31, 0.09],
  [0.285, 0.03],
  [0.25, 0.016],
  [0, 0.016],
];

const lathe = (profile: [number, number][], segments: number) =>
  new THREE.LatheGeometry(
    profile.map(([r, y]) => new THREE.Vector2(r, y)),
    segments,
  );

/** Grate bars across the bowl: chord length at each z. */
const BARS = Array.from({ length: 11 }, (_, i) => {
  const z = -0.9 + i * 0.18;
  return { z, length: 2 * Math.sqrt(Math.max(0.01, 1.02 * 1.02 - z * z)) };
});
const LEGS = [Math.PI / 2, Math.PI / 2 + (Math.PI * 2) / 3, Math.PI / 2 + (Math.PI * 4) / 3];

function build() {
  const coalUniforms: Uniforms = { uTime: { value: 0 }, uBreath: { value: 0 } };
  const coalMaterial = new THREE.ShaderMaterial({ vertexShader: COAL_VERTEX, fragmentShader: COAL_FRAGMENT, uniforms: coalUniforms });
  const coalGeometries = Array.from({ length: COAL_SHAPES }, (_, i) => lumpGeometry(i + 1));
  const coals = coalGeometries.map((g) => coalBed(g, coalMaterial, COALS_EACH));

  const flameUniforms: Uniforms = { uTime: { value: 0 }, uBreath: { value: 0 }, uSmoke: { value: 0 } };
  const flameMaterial = new THREE.ShaderMaterial({
    vertexShader: FLAME_VERTEX,
    fragmentShader: FLAME_FRAGMENT,
    uniforms: flameUniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const smokeUniforms: Uniforms = { uTime: { value: 0 }, uBreath: { value: 0 }, uSmoke: { value: 1 } };
  const smokeMaterial = new THREE.ShaderMaterial({
    vertexShader: FLAME_VERTEX,
    fragmentShader: FLAME_FRAGMENT,
    uniforms: smokeUniforms,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const flames = flameSheet(flameMaterial, FLAMES, false);
  const smoke = flameSheet(smokeMaterial, SMOKE, true);

  const sparkUniforms: Uniforms = { uTime: { value: 0 }, uBreath: { value: 0 }, uPixelRatio: { value: 1 } };
  const sparkMaterial = new THREE.ShaderMaterial({
    vertexShader: SPARK_VERTEX,
    fragmentShader: SPARK_FRAGMENT,
    uniforms: sparkUniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const sparks = sparkCloud(sparkMaterial, SPARKS);

  const glow = blob("rgba(255,150,60,0.9)", "rgba(255,110,30,0)");
  const pool = blob("rgba(255,140,50,0.7)", "rgba(255,110,30,0)");
  const floorMask = blob("rgba(255,255,255,1)", "rgba(255,255,255,0)");

  return {
    coals,
    flames,
    smoke,
    sparks,
    glow,
    pool,
    floorMask,
    basin: lathe(BASIN_PROFILE, 72),
    pan: lathe(PAN_PROFILE, 56),
    disposable: [coalMaterial, flameMaterial, smokeMaterial, sparkMaterial, ...coalGeometries, flames.geometry, smoke.geometry, sparks.geometry],
  };
}

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

const NDC = new THREE.Vector3();

/** Is the pointer (in canvas NDC) over the bed or the flames above it? */
function overFire(camera: THREE.Camera, px: number, py: number) {
  const c = NDC.set(0, 0.25, 0).project(camera);
  const cx = c.x;
  const cy = c.y;
  const edge = NDC.set(BED, 0.25, 0).project(camera);
  const rx = Math.max(0.01, Math.abs(edge.x - cx));
  const dx = (px - cx) / rx;
  const dy = (py - cy) / (rx * 1.1);
  return dx * dx + dy * dy < 1 || (Math.abs(dx) < 0.6 && py > cy && py - cy < rx * 1.6);
}

function Fire({ reduced, stoking }: { reduced: boolean; stoking: boolean }) {
  const gl = useThree((s) => s.gl);
  const size = useThree((s) => s.size);
  const assets = useMemo(() => build(), []);

  const light = useRef<THREE.PointLight>(null);
  const glow = useRef<THREE.Sprite>(null);
  const pool = useRef<THREE.Mesh>(null);
  // The shader materials are reached through their meshes, so the frame loop
  // never writes into the memoised asset bundle.
  const coalMesh = useRef<THREE.InstancedMesh>(null);
  const flameMesh = useRef<THREE.InstancedMesh>(null);
  const smokeMesh = useRef<THREE.InstancedMesh>(null);
  const sparkPoints = useRef<THREE.Points>(null);
  // Our own clock: R3F resets its clock whenever the frameloop toggles (the
  // hero scrolling away and back). `energy` is how hard the fire has been
  // blown on lately; `breath` eases towards it and drives everything.
  const state = useRef({
    now: 0,
    energy: 0,
    breath: 0,
    px: 0,
    py: 0,
    lx: 0,
    ly: 0,
    moved: false,
    lastMove: -10,
    hover: false,
    dispose: () => {
      for (const d of [...assets.disposable, assets.glow, assets.pool, assets.floorMask, assets.basin, assets.pan]) d.dispose();
    },
  });

  useEffect(() => {
    const s = state.current;
    return () => s.dispose();
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = gl.domElement.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const s = state.current;
      s.px = ((e.clientX - r.left) / r.width) * 2 - 1;
      s.py = -(((e.clientY - r.top) / r.height) * 2 - 1);
      s.moved = true;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [gl]);

  useFrame(({ camera }, delta) => {
    const s = state.current;
    const dt = Math.min(delta, 0.1);
    if (!reduced) s.now += dt;
    const now = s.now;

    // Blowing on the fire: hold the button, or sweep the pointer over the coals.
    let target = 0;
    if (!reduced) {
      if (stoking) s.energy = Math.min(1, s.energy + dt * 1.8);
      if (s.moved) {
        s.moved = false;
        s.hover = overFire(camera, s.px, s.py);
        if (s.hover) {
          s.lastMove = now;
          const puff = Math.min(0.3, Math.hypot(s.px - s.lx, s.py - s.ly) * 2.5);
          s.energy = Math.min(1, s.energy + puff);
        }
        s.lx = s.px;
        s.ly = s.py;
      }
      // …then it settles over a few seconds.
      s.energy = Math.max(0, s.energy - dt * (s.energy > 0.5 ? 0.3 : 0.2));
      target = Math.max(s.energy, s.hover && now - s.lastMove < 1.2 ? 0.2 : 0);
    }
    s.breath += (target - s.breath) * (1 - Math.exp(-dt * (target > s.breath ? 6 : 1.5)));
    const b = s.breath;

    for (const r of [coalMesh, flameMesh, smokeMesh, sparkPoints]) {
      const m = r.current?.material;
      if (!(m instanceof THREE.ShaderMaterial)) continue;
      m.uniforms.uTime.value = now;
      m.uniforms.uBreath.value = b;
      if ("uPixelRatio" in m.uniforms) m.uniforms.uPixelRatio.value = gl.getPixelRatio();
    }

    const flick = reduced ? 1 : 0.86 + 0.09 * Math.sin(now * 11.3) + 0.05 * Math.sin(now * 23.1 + 1.3) + 0.04 * Math.sin(now * 41.7);
    if (light.current) {
      light.current.intensity = (6 + b * 10) * flick;
      light.current.position.set(Math.sin(now * 3.1) * 0.05, 0.4 + b * 0.15, Math.cos(now * 2.7) * 0.05);
      light.current.color.setHSL(0.055 + b * 0.025, 1, 0.56 + b * 0.08);
    }
    if (glow.current) {
      glow.current.material.opacity = (0.16 + b * 0.22) * flick;
      glow.current.scale.setScalar(2.2 + b * 0.6);
    }
    const poolMat = pool.current?.material;
    if (poolMat instanceof THREE.MeshBasicMaterial) poolMat.opacity = (0.28 + b * 0.3) * flick;

    // Camera: low and close. On wide stages the pit sits right of centre, clear of the copy.
    const wide = size.width >= 1024;
    const aspect = size.width / Math.max(1, size.height);
    const dist = wide ? 4.0 : aspect < 1 ? 4.8 : 3.7;
    const pan = wide ? 0.8 : 0;
    const drift = reduced ? 0 : 1;
    camera.position.set(
      -pan + s.px * 0.12 * drift + Math.sin(now * 0.23) * 0.05,
      0.9 + s.py * 0.06 * drift + Math.sin(now * 0.31) * 0.03,
      dist,
    );
    camera.lookAt(-pan, 0.3, 0);
  });

  return (
    <>
      <fog attach="fog" args={[PAGE_BG, 4.5, 9]} />
      <group>
      <ambientLight intensity={0.3} color="#3a2e28" />
      <directionalLight position={[-3, 5, 2]} intensity={1.1} color="#7f93b8" />
      <pointLight ref={light} position={[0, 0.4, 0]} intensity={6} color="#ff7a24" distance={7} decay={2} />

      {/* Floor: a dark stone pad that fades out into the page. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#2a231f" roughness={0.92} metalness={0} alphaMap={assets.floorMask} transparent />
      </mesh>
      <mesh ref={pool} rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y + 0.004, 0]}>
        <planeGeometry args={[4.2, 4.2]} />
        <meshBasicMaterial map={assets.pool} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.3} />
      </mesh>

      {/* The pit: a steel bowl on three legs. */}
      <mesh geometry={assets.basin}>
        <meshStandardMaterial color="#2b2522" roughness={0.55} metalness={0.55} side={THREE.DoubleSide} />
      </mesh>
      {LEGS.map((a) => (
        <mesh key={a} position={[Math.cos(a) * 0.92, (FLOOR_Y - 0.12) / 2, Math.sin(a) * 0.92]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.028, 0.034, -FLOOR_Y - 0.12, 12]} />
          <meshStandardMaterial color="#231e1b" roughness={0.6} metalness={0.5} />
        </mesh>
      ))}

      {/* Coals, flames, smoke, sparks. */}
      {assets.coals.map((mesh, i) => (
        <primitive key={i} object={mesh} ref={i === 0 ? coalMesh : undefined} />
      ))}
      <primitive object={assets.flames} ref={flameMesh} />
      <primitive object={assets.smoke} ref={smokeMesh} />
      <primitive object={assets.sparks} ref={sparkPoints} />
      <sprite ref={glow} position={[0, 0.5, 0]} scale={2.2} renderOrder={1}>
        <spriteMaterial map={assets.glow} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.16} />
      </sprite>

      {/* The grate. */}
      <group position={[0, GRATE_Y, 0]}>
        {BARS.map(({ z, length }) => (
          <mesh key={z} position={[0, 0, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.012, 0.012, length, 10]} />
            <meshStandardMaterial color="#3a3531" roughness={0.45} metalness={0.7} />
          </mesh>
        ))}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.02, 0.02, 10, 72]} />
          <meshStandardMaterial color="#3a3531" roughness={0.45} metalness={0.7} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, -0.02, 0]}>
          <cylinderGeometry args={[0.014, 0.014, 2.04, 10]} />
          <meshStandardMaterial color="#3a3531" roughness={0.45} metalness={0.7} />
        </mesh>
      </group>

      {/* The cast-iron pan, at the cooler side of the grate. */}
      <group position={[0.5, GRATE_Y + 0.02, -0.12]} rotation={[0, -0.5, 0]}>
        <mesh geometry={assets.pan}>
          <meshStandardMaterial color="#1f1b19" roughness={0.6} metalness={0.5} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0.49, 0.1, 0]} rotation={[0, 0, 0.12]}>
          <boxGeometry args={[0.36, 0.014, 0.05]} />
          <meshStandardMaterial color="#1f1b19" roughness={0.6} metalness={0.5} />
        </mesh>
      </group>
      </group>
    </>
  );
}

/**
 * Brasa — the hero: a charcoal fire pit you can stoke. Coals glow and breathe,
 * flames lick through the grate, sparks drift up; blowing on it (the button,
 * or the pointer over the coals) brightens everything, then it settles.
 * `reduced` holds a still frame; `active` false pauses the loop off-screen.
 */
export default function FireScene({ active, reduced, stoking }: { active: boolean; reduced: boolean; stoking: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 34, position: [0, 0.9, 3.7], near: 0.1, far: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ camera }) => camera.lookAt(0, 0.3, 0)}
      style={{ pointerEvents: "none" }}
    >
      <Fire reduced={reduced} stoking={stoking} />
    </Canvas>
  );
}

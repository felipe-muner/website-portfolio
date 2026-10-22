"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* Artist · Maria Meads — the hero canvas you paint                     */
/*                                                                     */
/* A linen canvas with a faint graphite underdrawing of the painting.  */
/* Wherever the pointer goes (or the studio's own brush, when you let  */
/* it), paint goes on. The coverage mask lives entirely on the GPU: a  */
/* render target that brush dabs are drawn into, read by a shader that */
/* lights the strokes as thick, wet impasto. Nothing is uploaded from  */
/* a 2D canvas each frame, so there is nothing to tear or flicker.      */
/* ------------------------------------------------------------------ */

export interface PaintSceneProps {
  /** The painting under the canvas. */
  src: string;
  /** Width ÷ height of the painting. */
  aspect: number;
  /** Every hero painting, so switching is instant. */
  preload: readonly string[];
  /** Render only while on screen. */
  active: boolean;
  /** prefers-reduced-motion: show the finished painting, no brush. */
  reduced: boolean;
  /** Bump to wipe the canvas clean. */
  clearToken: number;
  /** Bump to reveal the whole painting. */
  revealToken: number;
  /** Coverage 0–1, a few times a second. */
  onProgress: (coverage: number) => void;
}

const MASK = 1024;
const GRID = 24;
const WET = 24;
const WET_SECONDS = 1.4;
/** Seconds without pointer painting before the studio brush takes over. */
const IDLE = 1.3;
/** Most dabs drawn in one frame; the rest wait for the next. */
const MAX_DABS = 768;

/* ------------------------------------------------------------------ */
/* Shaders                                                             */
/* ------------------------------------------------------------------ */

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D uArt;
  uniform sampler2D uMask;
  uniform vec2 uTexel;
  uniform float uTime;
  uniform float uAspect;
  uniform vec4 uWet[${WET}];
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

  void main() {
    vec2 uv = vUv;
    vec2 px = uv / uTexel;

    /* Raw linen: two thread directions, a little slub. */
    float weave = 0.5 + 0.22 * sin(px.x * 2.1) + 0.22 * sin(px.y * 2.1);
    weave = mix(weave, noise(px * 0.37), 0.4);
    vec3 cream = mix(vec3(0.80, 0.74, 0.62), vec3(0.93, 0.89, 0.80), weave);

    /* Graphite underdrawing: the painting's edges, lightly. */
    vec2 t = uTexel * 1.5;
    float tl = luma(texture2D(uArt, uv + vec2(-t.x,  t.y)).rgb);
    float tc = luma(texture2D(uArt, uv + vec2( 0.0,  t.y)).rgb);
    float tr = luma(texture2D(uArt, uv + vec2( t.x,  t.y)).rgb);
    float ml = luma(texture2D(uArt, uv + vec2(-t.x,  0.0)).rgb);
    float mr = luma(texture2D(uArt, uv + vec2( t.x,  0.0)).rgb);
    float bl = luma(texture2D(uArt, uv + vec2(-t.x, -t.y)).rgb);
    float bc = luma(texture2D(uArt, uv + vec2( 0.0, -t.y)).rgb);
    float br = luma(texture2D(uArt, uv + vec2( t.x, -t.y)).rgb);
    float gx = (tr + 2.0 * mr + br) - (tl + 2.0 * ml + bl);
    float gy = (bl + 2.0 * bc + br) - (tl + 2.0 * tc + tr);
    float edge = smoothstep(0.10, 0.55, length(vec2(gx, gy)) * 1.6);
    edge *= 0.6 + 0.4 * noise(px * 0.9);
    vec3 sketch = mix(cream, vec3(0.30, 0.27, 0.28), edge * 0.5);

    /* Paint: coverage mask, lit as relief. */
    float m  = texture2D(uMask, uv).r;
    vec2 e = uTexel * 2.0;
    float mL = texture2D(uMask, uv - vec2(e.x, 0.0)).r;
    float mR = texture2D(uMask, uv + vec2(e.x, 0.0)).r;
    float mD = texture2D(uMask, uv - vec2(0.0, e.y)).r;
    float mU = texture2D(uMask, uv + vec2(0.0, e.y)).r;
    vec3 n = normalize(vec3((mL - mR) * 2.6, (mD - mU) * 2.6, 1.0));
    vec3 L = normalize(vec3(-0.45, 0.65, 0.62));
    float diff = clamp(dot(n, L), 0.0, 1.0);
    vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
    float spec = pow(clamp(dot(n, H), 0.0, 1.0), 30.0);

    vec3 art = texture2D(uArt, uv).rgb;
    float streak = noise(vec2(px.x * 0.06 + px.y * 0.8, px.y * 0.045));
    art *= 0.93 + 0.1 * streak;
    vec3 paint = art * (0.80 + 0.26 * diff) + spec * 0.16;

    /* Still wet where the brush just was. */
    float wet = 0.0;
    for (int i = 0; i < ${WET}; i++) {
      vec4 w = uWet[i];
      float age = uTime - w.z;
      if (age >= 0.0 && age < ${WET_SECONDS.toFixed(2)}) {
        float d = distance(vec2(uv.x * uAspect, uv.y), vec2(w.x * uAspect, w.y));
        wet += smoothstep(w.w, w.w * 0.15, d) * (1.0 - age / ${WET_SECONDS.toFixed(2)});
      }
    }
    wet = clamp(wet, 0.0, 1.0);
    paint += wet * (0.06 + spec * 0.9);

    float a = smoothstep(0.06, 0.62, m);
    vec3 col = mix(sketch, paint, a);

    /* Stretched edge of the canvas. */
    vec2 ed = min(uv, 1.0 - uv);
    float rim = smoothstep(0.0, 0.014, min(ed.x, ed.y));
    col *= mix(0.68, 1.0, rim);

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

const SHADOW_FRAG = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vec2 d = abs(vUv - 0.5) * 2.0;
    float box = max(d.x, d.y);
    float a = (1.0 - smoothstep(0.78, 1.0, box)) * 0.55;
    gl_FragColor = vec4(0.0, 0.0, 0.0, a);
  }
`;

/* One dab of paint, drawn into the mask: a soft elongated body plus a few
   ragged bristle hairs along the stroke. Instanced; one quad per dab. */
const DAB_VERT = /* glsl */ `
  attribute vec2 aCenter;
  attribute vec2 aSize;
  attribute float aAngle;
  attribute float aLoad;
  attribute float aSeed;
  uniform vec2 uSize;
  varying vec2 vLocal;
  varying float vLoad;
  varying float vSeed;
  varying float vRadius;
  void main() {
    vLocal = position.xy * 2.0;
    vLoad = aLoad;
    vSeed = aSeed;
    vRadius = aSize.x;
    vec2 local = vLocal * aSize;
    float c = cos(aAngle);
    float s = sin(aAngle);
    vec2 rotated = vec2(local.x * c - local.y * s, local.x * s + local.y * c);
    vec2 clip = (aCenter + rotated) / uSize * 2.0 - 1.0;
    gl_Position = vec4(clip, 0.0, 1.0);
  }
`;

const DAB_FRAG = /* glsl */ `
  varying vec2 vLocal;
  varying float vLoad;
  varying float vSeed;
  varying float vRadius;
  float hash(float n) { return fract(sin(n) * 43758.5453); }
  void main() {
    float d = length(vec2(vLocal.x, vLocal.y / 0.62));
    float body = pow(clamp(1.0 - d, 0.0, 1.0), 1.4) * 0.5;
    float a = body * vLoad;
    for (int i = 0; i < 7; i++) {
      float fi = float(i);
      float oy = (hash(vSeed + fi * 1.7) - 0.5) * 1.1;
      float len = 0.5 + hash(vSeed + fi * 3.1) * 0.8;
      float th = (0.8 + hash(vSeed + fi * 5.3) * 2.2) / vRadius;
      float slope = (hash(vSeed + fi * 7.9) - 0.5) * 0.08;
      float along = vLocal.x / len;
      float fade = 1.0 - smoothstep(0.7, 1.0, abs(along));
      float dy = abs(vLocal.y - oy - slope * vLocal.x);
      float line = 1.0 - smoothstep(th * 0.5, th * 0.5 + 1.5 / vRadius, dy);
      a += (0.16 + hash(vSeed + fi * 11.3) * 0.28) * vLoad * fade * line;
    }
    gl_FragColor = vec4(1.0, 1.0, 1.0, clamp(a, 0.0, 1.0));
  }
`;

/* Box-filters the mask down to a GRID×GRID probe, read back for coverage. */
const PROBE_VERT = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const PROBE_FRAG = /* glsl */ `
  uniform sampler2D uMask;
  uniform float uGrid;
  void main() {
    vec2 cell = floor(gl_FragCoord.xy) / uGrid;
    float sum = 0.0;
    for (int y = 0; y < 6; y++) {
      for (int x = 0; x < 6; x++) {
        vec2 uv = cell + (vec2(float(x), float(y)) + 0.5) / (6.0 * uGrid);
        sum += texture2D(uMask, uv).r;
      }
    }
    gl_FragColor = vec4(vec3(sum / 36.0), 1.0);
  }
`;

/* ------------------------------------------------------------------ */
/* Textures — one shared cache, so switching paintings is instant      */
/* ------------------------------------------------------------------ */

const TEXTURES = new Map<string, THREE.Texture>();
const loader = new THREE.TextureLoader();

function loadTexture(src: string): THREE.Texture {
  let t = TEXTURES.get(src);
  if (!t) {
    t = loader.load(src);
    t.colorSpace = THREE.SRGBColorSpace;
    // Shown near 1:1 — no mipmaps keeps GPU memory down.
    t.generateMipmaps = false;
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    TEXTURES.set(src, t);
  }
  return t;
}

/* ------------------------------------------------------------------ */
/* Brush — dabs queued in JS, drawn into the mask on the GPU           */
/* ------------------------------------------------------------------ */

interface Brush {
  w: number;
  h: number;
  mask: THREE.WebGLRenderTarget;
  probe: THREE.WebGLRenderTarget;
  scene: THREE.Scene;
  camera: THREE.Camera;
  geometry: THREE.InstancedBufferGeometry;
  material: THREE.ShaderMaterial;
  probeScene: THREE.Scene;
  probeMaterial: THREE.ShaderMaterial;
  centers: THREE.InstancedBufferAttribute;
  sizes: THREE.InstancedBufferAttribute;
  angles: THREE.InstancedBufferAttribute;
  loads: THREE.InstancedBufferAttribute;
  seeds: THREE.InstancedBufferAttribute;
  /** Dabs waiting to be drawn: x, y, rx, ry, angle, load, seed. */
  pending: number[];
  /** Fill the mask with this before drawing anything else. */
  clearTo: "black" | "white" | null;
  readback: Uint8Array;
}

function makeBrush(aspect: number): Brush {
  const w = aspect >= 1 ? MASK : Math.round(MASK * aspect);
  const h = aspect >= 1 ? Math.round(MASK / aspect) : MASK;
  const targetOptions = {
    depthBuffer: false,
    stencilBuffer: false,
    generateMipmaps: false,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
  };
  const mask = new THREE.WebGLRenderTarget(w, h, targetOptions);
  const probe = new THREE.WebGLRenderTarget(GRID, GRID, { ...targetOptions, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter });

  const plane = new THREE.PlaneGeometry(1, 1);
  const geometry = new THREE.InstancedBufferGeometry();
  geometry.index = plane.index;
  geometry.setAttribute("position", plane.getAttribute("position"));
  const centers = new THREE.InstancedBufferAttribute(new Float32Array(MAX_DABS * 2), 2);
  const sizes = new THREE.InstancedBufferAttribute(new Float32Array(MAX_DABS * 2), 2);
  const angles = new THREE.InstancedBufferAttribute(new Float32Array(MAX_DABS), 1);
  const loads = new THREE.InstancedBufferAttribute(new Float32Array(MAX_DABS), 1);
  const seeds = new THREE.InstancedBufferAttribute(new Float32Array(MAX_DABS), 1);
  for (const a of [centers, sizes, angles, loads, seeds]) a.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute("aCenter", centers);
  geometry.setAttribute("aSize", sizes);
  geometry.setAttribute("aAngle", angles);
  geometry.setAttribute("aLoad", loads);
  geometry.setAttribute("aSeed", seeds);
  geometry.instanceCount = 0;

  const material = new THREE.ShaderMaterial({
    vertexShader: DAB_VERT,
    fragmentShader: DAB_FRAG,
    uniforms: { uSize: { value: new THREE.Vector2(w, h) } },
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const dabs = new THREE.Mesh(geometry, material);
  dabs.frustumCulled = false;
  const scene = new THREE.Scene();
  scene.add(dabs);

  const probeMaterial = new THREE.ShaderMaterial({
    vertexShader: PROBE_VERT,
    fragmentShader: PROBE_FRAG,
    uniforms: { uMask: { value: mask.texture }, uGrid: { value: GRID } },
    depthTest: false,
    depthWrite: false,
  });
  const probeQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), probeMaterial);
  probeQuad.frustumCulled = false;
  const probeScene = new THREE.Scene();
  probeScene.add(probeQuad);

  return {
    w,
    h,
    mask,
    probe,
    scene,
    camera: new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
    geometry,
    material,
    probeScene,
    probeMaterial,
    centers,
    sizes,
    angles,
    loads,
    seeds,
    pending: [],
    clearTo: "black",
    readback: new Uint8Array(GRID * GRID * 4),
  };
}

function disposeBrush(brush: Brush) {
  brush.mask.dispose();
  brush.probe.dispose();
  brush.geometry.dispose();
  brush.material.dispose();
  brush.probeMaterial.dispose();
}

/** Queue one dab at (x, y) mask pixels, radius r px, pointing along `angle`. */
function dab(brush: Brush, x: number, y: number, angle: number, r: number, load: number) {
  brush.pending.push(x, y, r, r, angle, load, Math.random() * 1000);
}

/** A stroke segment from (x0,y0) to (x1,y1), dabbed every r/3 px. */
function stroke(brush: Brush, x0: number, y0: number, x1: number, y1: number, r: number, load: number) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const dist = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);
  const steps = Math.min(48, Math.max(1, Math.ceil(dist / (r / 3))));
  for (let i = 1; i <= steps; i++) {
    const p = i / steps;
    dab(brush, x0 + dx * p, y0 + dy * p, angle, r * (0.85 + Math.random() * 0.3), load);
  }
}

const CLEAR = new THREE.Color();

/** Draw everything queued into the mask. Runs inside the frame loop. */
function flush(brush: Brush, gl: THREE.WebGLRenderer) {
  if (!brush.clearTo && brush.pending.length === 0) return;
  const prevTarget = gl.getRenderTarget();
  const prevAutoClear = gl.autoClear;
  const prevAlpha = gl.getClearAlpha();
  gl.getClearColor(CLEAR);

  gl.setRenderTarget(brush.mask);
  if (brush.clearTo) {
    gl.setClearColor(brush.clearTo === "white" ? 0xffffff : 0x000000, 1);
    gl.clear(true, false, false);
    brush.clearTo = null;
  }
  const n = Math.min(MAX_DABS, brush.pending.length / 7);
  if (n > 0) {
    const q = brush.pending;
    for (let i = 0; i < n; i++) {
      const o = i * 7;
      brush.centers.setXY(i, q[o], q[o + 1]);
      brush.sizes.setXY(i, q[o + 2], q[o + 3]);
      brush.angles.setX(i, q[o + 4]);
      brush.loads.setX(i, q[o + 5]);
      brush.seeds.setX(i, q[o + 6]);
    }
    for (const a of [brush.centers, brush.sizes, brush.angles, brush.loads, brush.seeds]) {
      a.addUpdateRange(0, n * a.itemSize);
      a.needsUpdate = true;
    }
    brush.geometry.instanceCount = n;
    brush.pending.splice(0, n * 7);
    gl.autoClear = false;
    gl.render(brush.scene, brush.camera);
  }

  gl.setRenderTarget(prevTarget);
  gl.autoClear = prevAutoClear;
  gl.setClearColor(CLEAR, prevAlpha);
}

/* ------------------------------------------------------------------ */
/* Studio brush — paints on its own while nobody is painting           */
/* ------------------------------------------------------------------ */

interface AutoStroke {
  x: number;
  y: number;
  angle: number;
  turn: number;
  speed: number;
  r: number;
  left: number;
}

/** A new stroke starting in a thinly painted part of the canvas. */
function newStroke(brush: Brush, cells: Float32Array): AutoStroke {
  let cx = Math.random();
  let cy = Math.random();
  // Up to eight tries for a cell under 40% covered.
  for (let i = 0; i < 8; i++) {
    const gx = Math.floor(Math.random() * GRID);
    const gy = Math.floor(Math.random() * GRID);
    if (cells[gy * GRID + gx] < 0.4) {
      cx = (gx + Math.random()) / GRID;
      cy = (gy + Math.random()) / GRID;
      break;
    }
  }
  return {
    x: cx * brush.w,
    y: cy * brush.h,
    angle: Math.random() * Math.PI * 2,
    turn: (Math.random() - 0.5) * 5.5,
    speed: brush.w * (0.35 + Math.random() * 0.45),
    r: brush.w * (0.03 + Math.random() * 0.035),
    left: 0.35 + Math.random() * 0.9,
  };
}

/* ------------------------------------------------------------------ */
/* Uniforms and the frame-loop state                                   */
/* ------------------------------------------------------------------ */

type Uniforms = {
  uArt: THREE.IUniform<THREE.Texture>;
  uMask: THREE.IUniform<THREE.Texture>;
  uTexel: THREE.IUniform<THREE.Vector2>;
  uTime: THREE.IUniform<number>;
  uAspect: THREE.IUniform<number>;
  uWet: THREE.IUniform<THREE.Vector4[]>;
};

interface PaintMaterial extends THREE.ShaderMaterial {
  uniforms: Uniforms;
}

/** The brush behind each mask texture. */
const BRUSHES = new WeakMap<THREE.Texture, Brush>();

function createUniforms(src: string, aspect: number): Uniforms {
  const brush = makeBrush(aspect);
  BRUSHES.set(brush.mask.texture, brush);
  return {
    uArt: { value: loadTexture(src) },
    uMask: { value: brush.mask.texture },
    uTexel: { value: new THREE.Vector2(1 / brush.w, 1 / brush.h) },
    uTime: { value: 0 },
    uAspect: { value: aspect },
    uWet: { value: Array.from({ length: WET }, () => new THREE.Vector4(0, 0, -10, 0)) },
  };
}

/** Everything the frame loop and the pointer mutate, kept out of React. */
interface Rig {
  cells: Float32Array;
  last: { x: number; y: number; t: number } | null;
  lastPointerAt: number;
  wetIndex: number;
  coverage: number;
  reported: number;
  frame: number;
  auto: AutoStroke | null;
  wipeStart: number;
  time: number;
}

function createRig(): Rig {
  return {
    cells: new Float32Array(GRID * GRID),
    last: null,
    lastPointerAt: -10,
    wetIndex: 0,
    coverage: 0,
    reported: -1,
    frame: 0,
    auto: null,
    wipeStart: -1,
    time: 0,
  };
}

/** How much of the canvas is painted, overall and per grid cell. */
function measure(rig: Rig, brush: Brush, gl: THREE.WebGLRenderer, onProgress: (coverage: number) => void) {
  const prevTarget = gl.getRenderTarget();
  gl.setRenderTarget(brush.probe);
  gl.render(brush.probeScene, brush.camera);
  gl.readRenderTargetPixels(brush.probe, 0, 0, GRID, GRID, brush.readback);
  gl.setRenderTarget(prevTarget);
  let sum = 0;
  for (let i = 0; i < GRID * GRID; i++) {
    const v = brush.readback[i * 4] / 255;
    rig.cells[i] = v;
    sum += v;
  }
  rig.coverage = sum / (GRID * GRID);
  if (Math.abs(rig.coverage - rig.reported) > 0.004) {
    rig.reported = rig.coverage;
    onProgress(Math.min(1, rig.coverage / 0.97));
  }
}

function markWet(rig: Rig, uniforms: Uniforms, u: number, v: number, r: number) {
  uniforms.uWet.value[rig.wetIndex].set(u, v, rig.time, r);
  rig.wetIndex = (rig.wetIndex + 1) % WET;
}

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

function Painting({ src, aspect, active, reduced, clearToken, revealToken, onProgress }: Omit<PaintSceneProps, "preload">) {
  const { viewport, pointer } = useThree();
  const group = useRef<THREE.Group>(null);
  const material = useRef<PaintMaterial>(null);
  const rigRef = useRef<Rig | null>(null);
  /* The reveal token this painting has already acted on — a new painting
     mounting after an earlier Reveal must start blank, not revealed. */
  const revealed = useRef(revealToken);
  const uniforms = useMemo(() => createUniforms(src, aspect), [src, aspect]);

  /* The live material and its brush — read only from effects, handlers and the frame loop. */
  const live = () => {
    const m = material.current;
    const brush = m ? BRUSHES.get(m.uniforms.uMask.value) : undefined;
    if (!m || !brush) return null;
    if (!rigRef.current) rigRef.current = createRig();
    return { m, brush, rig: rigRef.current };
  };

  useEffect(() => {
    const m = material.current;
    return () => {
      const brush = m ? BRUSHES.get(m.uniforms.uMask.value) : undefined;
      if (brush) disposeBrush(brush);
    };
  }, []);

  /* A fresh canvas for a new painting, or a finished one if motion is off. */
  useEffect(() => {
    const l = live();
    if (!l) return;
    l.brush.pending.length = 0;
    l.brush.clearTo = reduced ? "white" : "black";
    l.rig.auto = null;
    l.rig.wipeStart = -1;
    l.rig.reported = -1;
    l.rig.cells.fill(reduced ? 1 : 0);
    l.rig.coverage = reduced ? 1 : 0;
    onProgress(reduced ? 1 : 0);
  }, [reduced, clearToken, onProgress]);

  useEffect(() => {
    const l = live();
    if (!l || revealToken === revealed.current) return;
    revealed.current = revealToken;
    l.rig.wipeStart = l.rig.time;
    l.rig.auto = null;
  }, [revealToken]);

  const paintAt = (e: ThreeEvent<PointerEvent>, tap: boolean) => {
    const l = live();
    if (!l || reduced || !e.uv) return;
    const { brush, rig, m } = l;
    const x = e.uv.x * brush.w;
    const y = e.uv.y * brush.h;
    const now = rig.time;
    const size = brush.w * 0.046;
    if (tap || !rig.last || now - rig.last.t > 0.25) {
      dab(brush, x, y, Math.random() * Math.PI, size * 1.2, 1);
    } else {
      const speed = Math.hypot(x - rig.last.x, y - rig.last.y) / Math.max(0.008, now - rig.last.t) / brush.w;
      stroke(brush, rig.last.x, rig.last.y, x, y, size * THREE.MathUtils.clamp(1.25 - speed * 0.12, 0.6, 1.25), 1);
    }
    markWet(rig, m.uniforms, e.uv.x, e.uv.y, 0.06);
    rig.last = { x, y, t: now };
    rig.lastPointerAt = now;
    rig.auto = null;
  };

  useFrame(({ gl }, delta) => {
    const l = live();
    if (!l || !active) return;
    const { brush, rig, m } = l;
    const dt = Math.min(delta, 0.05);
    rig.time += dt;
    m.uniforms.uTime.value = rig.time;

    if (rig.wipeStart >= 0) {
      /* Reveal: a widening pool from the centre. */
      const p = (rig.time - rig.wipeStart) / 0.8;
      if (p >= 1) {
        brush.pending.length = 0;
        brush.clearTo = "white";
        rig.wipeStart = -1;
      } else {
        const radius = Math.max(8, p * Math.hypot(brush.w, brush.h) * 0.62);
        brush.pending.push(brush.w / 2, brush.h / 2, radius, radius / 0.62, 0, 1.1, 0);
      }
    } else if (!reduced && rig.time - rig.lastPointerAt > IDLE && rig.coverage < 0.965) {
      /* The studio brush keeps painting while you watch. */
      if (!rig.auto || rig.auto.left <= 0) rig.auto = newStroke(brush, rig.cells);
      const a = rig.auto;
      const nx = a.x + Math.cos(a.angle) * a.speed * dt;
      const ny = a.y + Math.sin(a.angle) * a.speed * dt;
      stroke(brush, a.x, a.y, nx, ny, a.r, 0.9);
      markWet(rig, m.uniforms, nx / brush.w, ny / brush.h, 0.05);
      a.x = nx;
      a.y = ny;
      a.angle += a.turn * dt + Math.sin(rig.time * 7 + a.r) * 1.6 * dt;
      a.left -= dt;
      if (nx < 0 || ny < 0 || nx > brush.w || ny > brush.h) a.left = 0;
    }

    flush(brush, gl);
    if (++rig.frame % 12 === 0) measure(rig, brush, gl, onProgress);

    /* The canvas leans toward the pointer, and breathes a little. */
    const g = group.current;
    if (g) {
      const ty = reduced ? 0 : pointer.x * 0.11;
      const tx = reduced ? 0 : -pointer.y * 0.07;
      g.rotation.y += (ty - g.rotation.y) * 0.05;
      g.rotation.x += (tx - g.rotation.x) * 0.05;
      g.position.y = reduced ? 0 : Math.sin(rig.time * 0.6) * 0.012;
    }
  });

  /* Fit the painting inside the stage with a little air around it. */
  const size = useMemo(() => {
    const pad = 0.9;
    let w = viewport.width * pad;
    let h = w / aspect;
    if (h > viewport.height * pad) {
      h = viewport.height * pad;
      w = h * aspect;
    }
    return { w, h };
  }, [viewport.width, viewport.height, aspect]);

  return (
    <group ref={group}>
      {/* Drop shadow */}
      <mesh position={[size.w * 0.02, -size.h * 0.03, -0.25]}>
        <planeGeometry args={[size.w * 1.06, size.h * 1.06]} />
        <shaderMaterial transparent depthWrite={false} vertexShader={VERT} fragmentShader={SHADOW_FRAG} />
      </mesh>
      {/* Stretcher bars: a thin dark slab behind the linen. Its front face sits
          clearly behind the canvas plane — coplanar, the two z-fight into a
          black-and-cream checkerboard as soon as the canvas tilts. */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[size.w * 1.012, size.h * 1.012, 0.06]} />
        <meshBasicMaterial color="#2a2320" />
      </mesh>
      <mesh
        onPointerMove={(e) => paintAt(e, false)}
        onPointerDown={(e) => paintAt(e, true)}
        onPointerLeave={() => {
          const l = live();
          if (l) l.rig.last = null;
        }}
      >
        <planeGeometry args={[size.w, size.h]} />
        <shaderMaterial ref={material} uniforms={uniforms} vertexShader={VERT} fragmentShader={FRAG} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Canvas                                                              */
/* ------------------------------------------------------------------ */

export default function PaintScene(props: PaintSceneProps) {
  const { preload, ...rest } = props;
  useEffect(() => {
    preload.forEach(loadTexture);
  }, [preload]);

  return (
    <Canvas
      camera={{ fov: 28, position: [0, 0, 3.2], near: 0.1, far: 20 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={props.active ? "always" : "never"}
      style={{ touchAction: "pan-y" }}
    >
      <Painting key={props.src} {...rest} />
    </Canvas>
  );
}

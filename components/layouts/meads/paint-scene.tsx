"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* Artist · Maria Meads — the hero canvas you paint                     */
/*                                                                     */
/* A linen canvas with a faint graphite underdrawing of the painting.  */
/* Wherever the pointer goes (or the studio's own brush, when you let  */
/* it), paint goes on: a coverage mask drawn on a 2D canvas, read by a */
/* shader that lights the strokes as thick, wet impasto.               */
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

/* ------------------------------------------------------------------ */
/* Shader                                                              */
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
    t.anisotropy = 4;
    TEXTURES.set(src, t);
  }
  return t;
}

/* ------------------------------------------------------------------ */
/* Brush                                                               */
/* ------------------------------------------------------------------ */

interface Brush {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  dirty: boolean;
}

function makeBrush(aspect: number): Brush {
  const canvas = document.createElement("canvas");
  const w = aspect >= 1 ? MASK : Math.round(MASK * aspect);
  const h = aspect >= 1 ? Math.round(MASK / aspect) : MASK;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable");
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  return { canvas, ctx, w, h, dirty: true };
}

function wipe(brush: Brush, to: "black" | "white") {
  brush.ctx.globalAlpha = 1;
  brush.ctx.fillStyle = to === "black" ? "#000" : "#fff";
  brush.ctx.fillRect(0, 0, brush.w, brush.h);
  brush.dirty = true;
}

/** One dab of paint: a soft elongated body plus bristle streaks along the stroke. */
function dab(brush: Brush, x: number, y: number, angle: number, r: number, load: number) {
  const { ctx } = brush;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  // Soft body: a circle squashed across the stroke, so the gradient fades to
  // nothing at its rim in both directions — no hard-edged shards.
  ctx.save();
  ctx.scale(1, 0.62);
  const body = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
  body.addColorStop(0, `rgba(255,255,255,${0.5 * load})`);
  body.addColorStop(0.55, `rgba(255,255,255,${0.28 * load})`);
  body.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // Bristles: a few ragged hairs along the stroke, fading at their ends.
  ctx.lineCap = "round";
  for (let i = 0; i < 7; i++) {
    const oy = (Math.random() - 0.5) * r * 1.1;
    const len = r * (0.5 + Math.random() * 0.8);
    const hair = ctx.createLinearGradient(-len, 0, len, 0);
    const a = (0.16 + Math.random() * 0.28) * load;
    hair.addColorStop(0, "rgba(255,255,255,0)");
    hair.addColorStop(0.3, `rgba(255,255,255,${a})`);
    hair.addColorStop(0.7, `rgba(255,255,255,${a})`);
    hair.addColorStop(1, "rgba(255,255,255,0)");
    ctx.strokeStyle = hair;
    ctx.lineWidth = 0.8 + Math.random() * 2.2;
    ctx.beginPath();
    ctx.moveTo(-len, oy);
    ctx.lineTo(len, oy + (Math.random() - 0.5) * 5);
    ctx.stroke();
  }
  ctx.restore();
  brush.dirty = true;
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
  uMask: THREE.IUniform<THREE.CanvasTexture>;
  uTexel: THREE.IUniform<THREE.Vector2>;
  uTime: THREE.IUniform<number>;
  uAspect: THREE.IUniform<number>;
  uWet: THREE.IUniform<THREE.Vector4[]>;
};

interface PaintMaterial extends THREE.ShaderMaterial {
  uniforms: Uniforms;
}

/** The 2D brush canvas behind each mask texture. */
const BRUSHES = new WeakMap<THREE.Texture, Brush>();

function createUniforms(src: string, aspect: number): Uniforms {
  const brush = makeBrush(aspect);
  const mask = new THREE.CanvasTexture(brush.canvas);
  mask.colorSpace = THREE.NoColorSpace;
  mask.minFilter = THREE.LinearFilter;
  mask.magFilter = THREE.LinearFilter;
  mask.generateMipmaps = false;
  BRUSHES.set(mask, brush);
  return {
    uArt: { value: loadTexture(src) },
    uMask: { value: mask },
    uTexel: { value: new THREE.Vector2(1 / brush.w, 1 / brush.h) },
    uTime: { value: 0 },
    uAspect: { value: aspect },
    uWet: { value: Array.from({ length: WET }, () => new THREE.Vector4(0, 0, -10, 0)) },
  };
}

/** Everything the frame loop and the pointer mutate, kept out of React. */
interface Rig {
  sampler: CanvasRenderingContext2D | null;
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
  const sampler = document.createElement("canvas");
  sampler.width = GRID;
  sampler.height = GRID;
  return {
    sampler: sampler.getContext("2d", { willReadFrequently: true }),
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
function measure(rig: Rig, brush: Brush, onProgress: (coverage: number) => void) {
  if (!rig.sampler) return;
  rig.sampler.drawImage(brush.canvas, 0, 0, GRID, GRID);
  const data = rig.sampler.getImageData(0, 0, GRID, GRID).data;
  let sum = 0;
  for (let i = 0; i < GRID * GRID; i++) {
    const v = data[i * 4] / 255;
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
      m?.uniforms.uMask.value.dispose();
    };
  }, []);

  /* A fresh canvas for a new painting, or a finished one if motion is off. */
  useEffect(() => {
    const l = live();
    if (!l) return;
    wipe(l.brush, reduced ? "white" : "black");
    l.rig.auto = null;
    l.rig.wipeStart = -1;
    l.rig.reported = -1;
    measure(l.rig, l.brush, onProgress);
    l.m.uniforms.uMask.value.needsUpdate = true;
  }, [reduced, clearToken, onProgress]);

  useEffect(() => {
    const l = live();
    if (!l || revealToken === 0) return;
    l.rig.wipeStart = l.rig.time;
    l.rig.auto = null;
  }, [revealToken]);

  const paintAt = (e: ThreeEvent<PointerEvent>, tap: boolean) => {
    const l = live();
    if (!l || reduced || !e.uv) return;
    const { brush, rig, m } = l;
    const x = e.uv.x * brush.w;
    const y = (1 - e.uv.y) * brush.h;
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

  useFrame((_, delta) => {
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
        wipe(brush, "white");
        rig.wipeStart = -1;
      } else {
        const radius = Math.max(1, p * Math.hypot(brush.w, brush.h) * 0.62);
        const g = brush.ctx.createRadialGradient(brush.w / 2, brush.h / 2, radius * 0.7, brush.w / 2, brush.h / 2, radius);
        g.addColorStop(0, "rgba(255,255,255,0.5)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        brush.ctx.fillStyle = g;
        brush.ctx.fillRect(0, 0, brush.w, brush.h);
        brush.dirty = true;
      }
    } else if (!reduced && rig.time - rig.lastPointerAt > IDLE && rig.coverage < 0.965) {
      /* The studio brush keeps painting while you watch. */
      if (!rig.auto || rig.auto.left <= 0) rig.auto = newStroke(brush, rig.cells);
      const a = rig.auto;
      const nx = a.x + Math.cos(a.angle) * a.speed * dt;
      const ny = a.y + Math.sin(a.angle) * a.speed * dt;
      stroke(brush, a.x, a.y, nx, ny, a.r, 0.9);
      markWet(rig, m.uniforms, nx / brush.w, 1 - ny / brush.h, 0.05);
      a.x = nx;
      a.y = ny;
      a.angle += a.turn * dt + Math.sin(rig.time * 7 + a.r) * 1.6 * dt;
      a.left -= dt;
      if (nx < 0 || ny < 0 || nx > brush.w || ny > brush.h) a.left = 0;
    }

    if (brush.dirty) {
      m.uniforms.uMask.value.needsUpdate = true;
      brush.dirty = false;
    }
    if (++rig.frame % 12 === 0) measure(rig, brush, onProgress);

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
      {/* Stretcher bars: a thin dark slab behind the linen */}
      <mesh position={[0, 0, -0.03]}>
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
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={props.active ? "always" : "never"}
      style={{ touchAction: "pan-y" }}
    >
      <Painting key={props.src} {...rest} />
    </Canvas>
  );
}

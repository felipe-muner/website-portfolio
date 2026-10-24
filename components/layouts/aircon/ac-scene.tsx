"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { coolness, MAX_TEMP, MIN_TEMP, reading, type Climate, type Mode } from "./climate";

/* ------------------------------------------------------------------ */
/* The unit — a wall-mounted split system, built from rounded boxes    */
/* ------------------------------------------------------------------ */

const W = 3.4;
const H = 0.98;
const D = 0.78;
/** Height of the outlet cavity under the front shell. */
const CAVITY = H * 0.26;
/** Louvre angle (radians) when open, and the swing either side of it. */
const OPEN = 1.0;
const SWING = 0.28;
/** Delay before the unit "switches on" after it first renders. */
const BOOT_MS = 700;

const SMALL =
  typeof window !== "undefined" && !window.matchMedia("(min-width: 768px)").matches;
const STREAKS = SMALL ? 800 : 1500;
const MIST = SMALL ? 900 : 1800;
const MOTES = SMALL ? 380 : 760;

/** Seeded PRNG (mulberry32), so the airflow looks the same every visit. */
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

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable");
  return { c, ctx };
}

function texture(c: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** The mode glyph on the display: snowflake, droplet or fan. */
function drawModeGlyph(ctx: CanvasRenderingContext2D, mode: Mode, x: number, y: number, r: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.lineWidth = r * 0.16;
  ctx.lineCap = "round";
  if (mode === "cool") {
    for (let i = 0; i < 3; i++) {
      ctx.rotate(Math.PI / 3);
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(0, r);
      for (const s of [-1, 1]) {
        ctx.moveTo(0, s * r * 0.55);
        ctx.lineTo(r * 0.28, s * r * 0.8);
        ctx.moveTo(0, s * r * 0.55);
        ctx.lineTo(-r * 0.28, s * r * 0.8);
      }
      ctx.stroke();
    }
  } else if (mode === "dry") {
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.bezierCurveTo(r * 0.9, -r * 0.05, r * 0.75, r, 0, r);
    ctx.bezierCurveTo(-r * 0.75, r, -r * 0.9, -r * 0.05, 0, -r);
    ctx.stroke();
  } else {
    for (let i = 0; i < 3; i++) {
      ctx.rotate((Math.PI * 2) / 3);
      ctx.beginPath();
      ctx.ellipse(0, -r * 0.5, r * 0.26, r * 0.5, 0.5, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  ctx.restore();
}

/** The front display: dark glass, lit with the set point while the unit runs. */
function drawDisplay(ctx: CanvasRenderingContext2D, climate: Climate, on: boolean, fahrenheit?: boolean) {
  const { width: w, height: h } = ctx.canvas;
  ctx.clearRect(0, 0, w, h);
  roundRect(ctx, 4, 4, w - 8, h - 8, h * 0.22);
  ctx.fillStyle = "rgba(8,14,13,0.94)";
  ctx.fill();
  if (!on) return;

  ctx.shadowColor = "rgba(120,255,225,0.85)";
  ctx.shadowBlur = 22;
  ctx.fillStyle = "#a6ffea";
  ctx.strokeStyle = "#a6ffea";

  const { value, unit } = reading(climate.temp, fahrenheit);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "right";
  ctx.font = "600 132px ui-monospace, 'SF Mono', Menlo, monospace";
  ctx.fillText(String(value), w * 0.66, h * 0.8);
  ctx.textAlign = "left";
  ctx.font = "500 44px ui-monospace, 'SF Mono', Menlo, monospace";
  ctx.fillText(unit, w * 0.675, h * 0.42);

  drawModeGlyph(ctx, climate.mode, h * 0.5, h * 0.5, h * 0.24);

  // Fan speed: three rising bars, lit up to the current speed.
  for (let i = 0; i < 3; i++) {
    ctx.globalAlpha = i < climate.fan ? 1 : 0.22;
    const bw = 14;
    const bh = 18 + i * 14;
    ctx.fillRect(w * 0.86 + i * (bw + 7), h * 0.78 - bh, bw, bh);
  }
  ctx.globalAlpha = 1;
}

/** Small debossed-looking maker's mark on the left of the panel. */
function drawBadge(brand: string) {
  const { c, ctx } = canvas(256, 64);
  ctx.fillStyle = "#97a39f";
  ctx.font = "700 40px 'Helvetica Neue', Arial, sans-serif";
  // Longer names shrink to fit in front of "INVERTER".
  const size = Math.min(40, Math.floor((40 * 108) / ctx.measureText(brand).width));
  ctx.font = `700 ${size}px 'Helvetica Neue', Arial, sans-serif`;
  ctx.textBaseline = "middle";
  ctx.fillText(brand, 6, 34);
  ctx.font = "500 15px 'Helvetica Neue', Arial, sans-serif";
  ctx.fillStyle = "#b3bdb9";
  ctx.fillText("INVERTER", 122, 36);
  return texture(c);
}

/* ------------------------------------------------------------------ */
/* Shaders — the airflow is analytic: every particle's path is a pure  */
/* function of its seed and age, so nothing is simulated on the CPU    */
/* ------------------------------------------------------------------ */

const FLOW_GLSL = /* glsl */ `
  uniform float uFlowTime;
  uniform float uAngle;
  uniform float uHalf;
  uniform float uLen;
  uniform float uTurb;

  vec3 flowAt(vec4 seed, float age) {
    // Out along the louvre…
    vec3 dir = normalize(vec3(0.0, -cos(uAngle), sin(uAngle)));
    vec3 p = dir * age * uLen;
    // …cold air is heavy, so the stream bends toward the floor…
    p.y -= age * age * 1.1;
    // …and fans out sideways from the width of the outlet.
    p.x = seed.x * uHalf * (1.0 + age * 0.8) + seed.w * age * age * 1.5;
    // Eddies grow as the air slows down.
    float w = (0.2 + age * age * 1.4) * uTurb;
    float t = uFlowTime * 0.35;
    p.x += sin(age * 4.5 + seed.y * 40.0 + t) * 0.3 * w;
    p.y += sin(age * 3.5 + seed.x * 9.0 - t * 1.3) * 0.2 * w;
    p.z += cos(age * 4.0 + seed.y * 17.0 + t) * 0.22 * w;
    return p;
  }
`;

const STREAK_VERTEX = /* glsl */ `
  attribute vec4 aSeed;
  attribute float aTail;
  varying float vAge;
  varying float vFade;
  ${FLOW_GLSL}
  void main() {
    float age = fract(uFlowTime * 0.16 * aSeed.z + aSeed.y);
    vec3 p = flowAt(aSeed, max(age - aTail * 0.085, 0.0));
    vAge = age;
    // Bright head, transparent tail; fade in at the outlet and out near the viewer.
    vFade = smoothstep(0.0, 0.06, age) * (1.0 - smoothstep(0.5, 0.95, age)) * (1.0 - aTail);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const STREAK_FRAGMENT = /* glsl */ `
  uniform vec3 uHead;
  uniform vec3 uTailColor;
  uniform float uPower;
  uniform float uOpacity;
  varying float vAge;
  varying float vFade;
  void main() {
    vec3 col = mix(uHead, uTailColor, smoothstep(0.0, 0.6, vAge));
    gl_FragColor = vec4(col, vFade * uPower * uOpacity);
  }
`;

const MIST_VERTEX = /* glsl */ `
  attribute vec4 aSeed;
  uniform float uSize;
  uniform float uPixelRatio;
  varying float vAge;
  varying float vFade;
  ${FLOW_GLSL}
  void main() {
    float age = fract(uFlowTime * 0.11 * aSeed.z + aSeed.y);
    vec3 p = flowAt(aSeed, age);
    p += vec3(sin(aSeed.y * 91.0), cos(aSeed.x * 53.0), sin(aSeed.w * 37.0)) * age * 0.35;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * uPixelRatio * (0.4 + age * 1.6) / -mv.z;
    vAge = age;
    vFade = smoothstep(0.0, 0.1, age) * (1.0 - smoothstep(0.35, 0.9, age));
    gl_Position = projectionMatrix * mv;
  }
`;

const MIST_FRAGMENT = /* glsl */ `
  uniform vec3 uHead;
  uniform vec3 uTailColor;
  uniform float uPower;
  uniform float uOpacity;
  varying float vAge;
  varying float vFade;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float soft = smoothstep(0.5, 0.0, d);
    vec3 col = mix(uHead, uTailColor, vAge);
    gl_FragColor = vec4(col, soft * soft * vFade * uPower * uOpacity);
  }
`;

/* Heat haze: warm motes drifting up through the whole hero. Near the airflow
   — and everywhere, as the room cools — they turn from amber to mint. */
const MOTE_VERTEX = /* glsl */ `
  attribute vec3 aBase;
  attribute vec2 aSeed;
  uniform float uRise;
  uniform float uTime;
  uniform float uCool;
  uniform float uPower;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec3 uBox;
  uniform vec3 uFlowOrigin;
  uniform vec3 uFlowDir;
  varying float vCold;
  varying float vAlpha;
  void main() {
    vec3 p = aBase * uBox;
    float half_ = uBox.y * 0.5;
    p.y = mod(p.y + half_ + uRise * aSeed.x, uBox.y) - half_;
    p.x += sin(uTime * 0.4 + aSeed.y * 6.2831) * 0.25;
    p.z += cos(uTime * 0.3 + aSeed.y * 4.0) * 0.15;

    vec3 rel = p - uFlowOrigin;
    float along = dot(rel, uFlowDir);
    float dist = length(rel - uFlowDir * max(along, 0.0));
    float local = (1.0 - smoothstep(0.3, 1.4 + max(along, 0.0) * 0.5, dist)) * step(0.0, along) * uPower;
    vCold = clamp(uCool + local * 0.7, 0.0, 1.0);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * uPixelRatio * (0.6 + aSeed.y) / -mv.z;
    vAlpha = 1.0 - smoothstep(half_ * 0.7, half_, abs(p.y));
    gl_Position = projectionMatrix * mv;
  }
`;

const MOTE_FRAGMENT = /* glsl */ `
  uniform vec3 uHeat;
  uniform vec3 uCold;
  varying float vCold;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float soft = smoothstep(0.5, 0.0, d);
    vec3 col = mix(uHeat, uCold, vCold);
    gl_FragColor = vec4(col, soft * soft * vAlpha * mix(0.5, 0.32, vCold));
  }
`;

/* ------------------------------------------------------------------ */
/* Palette per mode                                                    */
/* ------------------------------------------------------------------ */

const HEAD = { cool: "#f0fffb", dry: "#e6f5ff", fan: "#ffffff" } as const;
const MINT = new THREE.Color("#5eead4");
const ICE = new THREE.Color("#7cc8ff");
const DRY_TAIL = new THREE.Color("#a3c4f3");
const FAN_TAIL = new THREE.Color("#c9d4d1");

function tailColor(climate: Climate, out: THREE.Color) {
  if (climate.mode === "dry") return out.copy(DRY_TAIL);
  if (climate.mode === "fan") return out.copy(FAN_TAIL);
  // Colder set point → icier blue.
  return out.copy(MINT).lerp(ICE, (MAX_TEMP - climate.temp) / (MAX_TEMP - MIN_TEMP));
}

const FAN_SPEED = { 1: 0.62, 2: 1, 3: 1.5 } as const;

/* ------------------------------------------------------------------ */
/* Scene parts                                                         */
/* ------------------------------------------------------------------ */

/** Per-frame state the parts hand each other — read and written in useFrame only. */
type Shared = {
  /** Eased 0..1 — how far the unit is "on". */
  power: number;
  /** Current louvre angle — the airflow leaves along it. */
  angle: number;
  /** Eased 0..1 — how cool the room has become. */
  cool: number;
  /** Outlet position and airflow direction, in world space, for the motes. */
  flowOrigin: THREE.Vector3;
  flowDir: THREE.Vector3;
};

function useAirflowGeometry() {
  return useMemo(() => {
    const random = rng(22);
    const seed = () => [random() * 2 - 1, random(), 0.7 + random() * 0.6, random() * 2 - 1];

    const streaks = new THREE.BufferGeometry();
    const sSeed = new Float32Array(STREAKS * 2 * 4);
    const sTail = new Float32Array(STREAKS * 2);
    for (let i = 0; i < STREAKS; i++) {
      const s = seed();
      for (let v = 0; v < 2; v++) {
        sSeed.set(s, (i * 2 + v) * 4);
        sTail[i * 2 + v] = v;
      }
    }
    streaks.setAttribute("position", new THREE.BufferAttribute(new Float32Array(STREAKS * 2 * 3), 3));
    streaks.setAttribute("aSeed", new THREE.BufferAttribute(sSeed, 4));
    streaks.setAttribute("aTail", new THREE.BufferAttribute(sTail, 1));

    const mist = new THREE.BufferGeometry();
    const mSeed = new Float32Array(MIST * 4);
    for (let i = 0; i < MIST; i++) mSeed.set(seed(), i * 4);
    mist.setAttribute("position", new THREE.BufferAttribute(new Float32Array(MIST * 3), 3));
    mist.setAttribute("aSeed", new THREE.BufferAttribute(mSeed, 4));

    return { streaks, mist };
  }, []);
}

/**
 * Starting uniforms for an airflow material. R3F copies uniforms into the
 * material, so per-frame updates go through the material ref, not these.
 */
function flowUniforms() {
  return {
    uFlowTime: { value: 3 },
    uAngle: { value: 0.35 },
    uHalf: { value: (W - 0.5) / 2 },
    uLen: { value: 4.4 },
    uTurb: { value: 1 },
    uPower: { value: 0 },
    uOpacity: { value: 0 },
    uHead: { value: new THREE.Color(HEAD.cool) },
    uTailColor: { value: MINT.clone() },
    uSize: { value: SMALL ? 170 : 300 },
    uPixelRatio: { value: 1 },
  };
}

/** Peak opacity of the streaks and of the mist; dry and fan modes run softer. */
const STREAK_OPACITY = 0.38;
const MIST_OPACITY = 0.11;
const MODE_STRENGTH: Record<Mode, number> = { cool: 1, dry: 0.6, fan: 0.75 };

/** The cold air: thin wind streaks plus a soft mist, leaving the outlet. */
function Airflow({ climate, sharedRef, reduced }: { climate: Climate; sharedRef: RefObject<Shared>; reduced: boolean }) {
  const { streaks, mist } = useAirflowGeometry();
  const streakUniforms = useMemo(() => flowUniforms(), []);
  const mistUniforms = useMemo(() => flowUniforms(), []);
  const group = useRef<THREE.Group>(null);
  const streakMat = useRef<THREE.ShaderMaterial>(null);
  const mistMat = useRef<THREE.ShaderMaterial>(null);
  const dpr = useThree((s) => s.viewport.dpr);

  // Eased values, copied into both materials every frame.
  const flow = useRef({
    time: 3,
    turb: 1,
    strength: 1,
    head: new THREE.Color(HEAD.cool),
    tail: MINT.clone(),
    target: new THREE.Color(),
    dir: new THREE.Vector3(),
  });

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const shared = sharedRef.current;
    const f = flow.current;
    const speed = FAN_SPEED[climate.fan];
    const k = reduced ? 1 : 1 - Math.exp(-3 * dt);

    if (!reduced) f.time += dt * speed;
    f.turb = THREE.MathUtils.damp(f.turb, climate.mode === "dry" ? 0.6 : 0.6 + speed * 0.4, 2, dt);
    f.strength = reduced ? MODE_STRENGTH[climate.mode] : THREE.MathUtils.damp(f.strength, MODE_STRENGTH[climate.mode], 3, dt);
    f.head.lerp(f.target.set(HEAD[climate.mode]), k);
    f.tail.lerp(tailColor(climate, f.target), k);

    for (const [mat, opacity] of [
      [streakMat.current, STREAK_OPACITY],
      [mistMat.current, MIST_OPACITY],
    ] as const) {
      if (!mat) continue;
      const u = mat.uniforms;
      u.uFlowTime.value = f.time;
      u.uAngle.value = shared.angle;
      u.uPower.value = shared.power;
      u.uTurb.value = f.turb;
      u.uOpacity.value = opacity * f.strength;
      u.uHead.value = f.head;
      u.uTailColor.value = f.tail;
      u.uPixelRatio.value = dpr;
    }

    // Report where the air goes, in world space, for the heat motes.
    const g = group.current;
    if (g) {
      g.updateWorldMatrix(true, false);
      shared.flowOrigin.setFromMatrixPosition(g.matrixWorld);
      f.dir.set(0, -Math.cos(shared.angle), Math.sin(shared.angle)).transformDirection(g.matrixWorld);
      shared.flowDir.copy(f.dir);
    }
  });

  return (
    <group ref={group} position={[0, -H / 2 + CAVITY * 0.45, D / 2 - 0.12]}>
      <lineSegments geometry={streaks} frustumCulled={false}>
        <shaderMaterial
          ref={streakMat}
          uniforms={streakUniforms}
          vertexShader={STREAK_VERTEX}
          fragmentShader={STREAK_FRAGMENT}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      <points geometry={mist} frustumCulled={false}>
        <shaderMaterial
          ref={mistMat}
          uniforms={mistUniforms}
          vertexShader={MIST_VERTEX}
          fragmentShader={MIST_FRAGMENT}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

type Look = {
  /** Maker's mark on the panel. */
  brand?: string;
  /** Show the set point in °F. */
  fahrenheit?: boolean;
};

function Unit({
  climate,
  sharedRef,
  reduced,
  brand = "MGM",
  fahrenheit,
}: { climate: Climate; sharedRef: RefObject<Shared>; reduced: boolean } & Look) {
  const unit = useRef<THREE.Group>(null);
  const louvre = useRef<THREE.Group>(null);
  const glow = useRef<THREE.PointLight>(null);
  const screen = useRef<THREE.MeshBasicMaterial>(null);
  const bootAt = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const lit = useRef<boolean | null>(null);

  const display = useMemo(() => {
    const { c, ctx } = canvas(512, 192);
    return { ctx, map: texture(c) };
  }, []);
  const badge = useMemo(() => drawBadge(brand), [brand]);

  useEffect(() => {
    bootAt.current = performance.now() + (reduced ? 0 : BOOT_MS);
  }, [reduced]);

  // The canvas ignores the pointer (the copy above it stays clickable), so
  // track it on the window for a gentle parallax.
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  // Redraw the display whenever the remote changes something.
  useEffect(() => {
    lit.current = null;
  }, [climate]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const shared = sharedRef.current;
    const on = climate.power && bootAt.current > 0 && performance.now() >= bootAt.current;

    if (lit.current !== on) {
      drawDisplay(display.ctx, climate, on, fahrenheit);
      const map = screen.current?.map;
      if (map) map.needsUpdate = true;
      lit.current = on;
    }

    const ease = (from: number, to: number, rate: number) => (reduced ? to : THREE.MathUtils.damp(from, to, rate, dt));
    shared.power = ease(shared.power, on ? 1 : 0, 1.6);
    shared.cool = ease(shared.cool, on ? coolness(climate) : 0, 0.55);

    const swing = climate.swing && !reduced ? Math.sin(t * 0.9) * SWING : 0;
    if (louvre.current) {
      louvre.current.rotation.x = -ease(-louvre.current.rotation.x, on ? OPEN + swing : 0, 2.4);
      // Air leaves along the louvre (never straight down, even mid-opening).
      shared.angle = Math.max(-louvre.current.rotation.x, 0.35);
    }
    if (glow.current) glow.current.intensity = shared.power * 6;

    if (unit.current) {
      const p = pointer.current;
      unit.current.rotation.y = ease(unit.current.rotation.y, -0.26 + p.x * 0.1, 2);
      unit.current.rotation.x = ease(unit.current.rotation.x, 0.14 + p.y * 0.05, 2);
      unit.current.position.y = reduced ? 0 : Math.sin(t * 0.8) * 0.03;
    }
  });

  return (
    <group ref={unit}>
      {/* Shell: the front body, the set-back base, and two end caps closing the cavity */}
      <RoundedBox args={[W, H * 0.74, D]} radius={0.12} smoothness={5} position={[0, H * 0.13, 0]}>
        <meshPhysicalMaterial color="#eef2f0" roughness={0.3} clearcoat={0.8} clearcoatRoughness={0.2} />
      </RoundedBox>
      <RoundedBox args={[W, H * 0.32, D * 0.5]} radius={0.1} smoothness={4} position={[0, -H / 2 + H * 0.16, -D / 4]}>
        <meshPhysicalMaterial color="#e6ebe9" roughness={0.35} clearcoat={0.6} />
      </RoundedBox>
      {[-1, 1].map((s) => (
        <RoundedBox key={s} args={[0.16, H, D]} radius={0.075} smoothness={4} position={[s * (W / 2 - 0.08), 0, 0]}>
          <meshPhysicalMaterial color="#e9eeec" roughness={0.3} clearcoat={0.8} clearcoatRoughness={0.2} />
        </RoundedBox>
      ))}

      {/* Front cover panel — a slightly brighter, glossier plate */}
      <RoundedBox args={[W - 0.24, H * 0.54, 0.03]} radius={0.014} smoothness={3} position={[0, H * 0.17, D / 2 + 0.006]}>
        <meshPhysicalMaterial color="#f7f9f8" roughness={0.16} clearcoat={1} clearcoatRoughness={0.08} />
      </RoundedBox>

      {/* Outlet: dark throat with vertical deflector vanes */}
      <mesh position={[0, -H / 2 + CAVITY / 2 + 0.01, D / 2 - 0.42]}>
        <boxGeometry args={[W - 0.3, CAVITY, 0.4]} />
        <meshStandardMaterial color="#0b100f" roughness={0.9} />
      </mesh>
      {Array.from({ length: 11 }, (_, i) => (
        <mesh key={i} position={[(i - 5) * 0.28, -H / 2 + CAVITY / 2 + 0.01, D / 2 - 0.13]}>
          <boxGeometry args={[0.018, CAVITY * 0.86, 0.18]} />
          <meshStandardMaterial color="#26302d" roughness={0.6} />
        </mesh>
      ))}

      {/* Louvre, hinged along the bottom edge of the front shell */}
      <group ref={louvre} position={[0, -H / 2 + CAVITY, D / 2 - 0.02]}>
        <mesh position={[0, -CAVITY / 2, 0]}>
          <boxGeometry args={[W - 0.34, CAVITY, 0.024]} />
          <meshPhysicalMaterial color="#f1f4f3" roughness={0.25} clearcoat={0.9} clearcoatRoughness={0.15} />
        </mesh>
      </group>

      {/* Display and maker's mark */}
      <mesh position={[W / 2 - 0.62, -H * 0.02, D / 2 + 0.023]}>
        <planeGeometry args={[0.5, 0.1875]} />
        <meshBasicMaterial ref={screen} map={display.map} transparent toneMapped={false} />
      </mesh>
      <mesh position={[-W / 2 + 0.62, -H * 0.02, D / 2 + 0.023]}>
        <planeGeometry args={[0.5, 0.125]} />
        <meshBasicMaterial map={badge} transparent opacity={0.9} />
      </mesh>

      {/* Cold glow spilling from the outlet onto the louvre */}
      <pointLight ref={glow} position={[0, -H / 2 - 0.25, D / 2 + 0.4]} color="#7ff5dc" intensity={0} distance={3} />

      <Airflow climate={climate} sharedRef={sharedRef} reduced={reduced} />
    </group>
  );
}

function HeatMotes({ sharedRef, reduced }: { sharedRef: RefObject<Shared>; reduced: boolean }) {
  const viewport = useThree((s) => s.viewport);
  const geometry = useMemo(() => {
    const random = rng(7);
    const base = new Float32Array(MOTES * 3);
    const seed = new Float32Array(MOTES * 2);
    for (let i = 0; i < MOTES; i++) {
      base.set([random() - 0.5, random() - 0.5, random() * 1.2 - 0.9], i * 3);
      seed.set([0.6 + random() * 0.8, random()], i * 2);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(MOTES * 3), 3));
    g.setAttribute("aBase", new THREE.BufferAttribute(base, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 2));
    return g;
  }, []);

  const uniforms = useMemo(
    () => ({
      uRise: { value: 0 },
      uTime: { value: 0 },
      uCool: { value: 0 },
      uPower: { value: 0 },
      uSize: { value: 70 },
      uPixelRatio: { value: 1 },
      uBox: { value: new THREE.Vector3(1, 1, 4) },
      uFlowOrigin: { value: new THREE.Vector3() },
      uFlowDir: { value: new THREE.Vector3(0, -1, 0) },
      uHeat: { value: new THREE.Color("#ffb347") },
      uCold: { value: new THREE.Color("#7ff5dc") },
    }),
    [],
  );
  const material = useRef<THREE.ShaderMaterial>(null);
  const motion = useRef({ rise: 0, box: new THREE.Vector3() });

  useFrame((state, delta) => {
    const m = material.current;
    if (!m) return;
    const dt = Math.min(delta, 0.05);
    const shared = sharedRef.current;
    const mo = motion.current;
    // Heat rises; once the room is cool the motes sink like cold air.
    if (!reduced) mo.rise += dt * THREE.MathUtils.lerp(0.32, -0.1, shared.cool);

    const u = m.uniforms;
    // Motes sit behind and in front of the unit; the far plane is wider than
    // the viewport at z = 0, so overscan to keep the edges filled.
    u.uBox.value = mo.box.set(viewport.width * 1.5 + 2, viewport.height * 1.5 + 2, 4);
    u.uPixelRatio.value = viewport.dpr;
    u.uRise.value = mo.rise;
    u.uTime.value = reduced ? 0 : state.clock.elapsedTime;
    u.uCool.value = shared.cool;
    u.uPower.value = shared.power;
    u.uFlowOrigin.value = shared.flowOrigin;
    u.uFlowDir.value = shared.flowDir;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={MOTE_VERTEX}
        fragmentShader={MOTE_FRAGMENT}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** A warm sun key that fades as the room cools, a cool rim, and softboxes. */
function Lights({ sharedRef }: { sharedRef: RefObject<Shared> }) {
  const sun = useRef<THREE.DirectionalLight>(null);
  useFrame(() => {
    if (sun.current) sun.current.intensity = 2.2 * (1 - sharedRef.current.cool * 0.75);
  });
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight ref={sun} position={[-4, 4, 3]} color="#ffc98a" intensity={2.2} />
      <directionalLight position={[4, -1, 2]} color="#9ff3df" intensity={0.9} />
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2.6} position={[0, 5, 2]} rotation={[Math.PI / 2, 0, 0]} scale={[8, 3, 1]} />
        <Lightformer intensity={3} position={[-5, 1, 2]} rotation={[0, Math.PI / 2, 0]} scale={[2, 6, 1]} />
        <Lightformer intensity={1.6} color="#bff8ec" position={[5, 0, 1]} rotation={[0, -Math.PI / 2, 0]} scale={[2, 6, 1]} />
        <Lightformer intensity={1.2} color="#ffd9a8" position={[0, -3, 3]} rotation={[-Math.PI / 2, 0, 0]} scale={[8, 2, 1]} />
      </Environment>
    </>
  );
}

/** Places the unit up and right of the copy on wide screens, centred otherwise. */
function Stage({ climate, reduced, ...look }: { climate: Climate; reduced: boolean } & Look) {
  const viewport = useThree((s) => s.viewport);
  const width = useThree((s) => s.size.width);
  const wide = width >= 1024;
  const fit = Math.min(viewport.width / (wide ? 8.4 : 4.3), viewport.height / 5.2, 0.85);

  const sharedRef = useRef<Shared>({
    power: 0,
    angle: 0.35,
    cool: 0,
    flowOrigin: new THREE.Vector3(),
    flowDir: new THREE.Vector3(0, -1, 0),
  });

  // In reduced-motion mode the canvas renders on demand: one frame per change.
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => invalidate(), [climate, invalidate]);

  return (
    <>
      <Lights sharedRef={sharedRef} />
      <HeatMotes sharedRef={sharedRef} reduced={reduced} />
      <group position={[wide ? viewport.width * 0.21 : 0, viewport.height * (wide ? 0.2 : 0.24), 0]} scale={fit}>
        <Unit climate={climate} sharedRef={sharedRef} reduced={reduced} {...look} />
      </group>
    </>
  );
}

/**
 * The hero's split system: it switches on, opens its louvre and blows cold
 * air across a warm Sunshine Coast haze, which cools to mint. Driven by the
 * remote. Client-only — load it with next/dynamic.
 */
export default function AcScene({
  climate,
  active,
  reduced,
  ...look
}: { climate: Climate; active: boolean; reduced: boolean } & Look) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={!active ? "never" : reduced ? "demand" : "always"}
      camera={{ fov: 32, position: [0, 0, 8], near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <Stage climate={climate} reduced={reduced} {...look} />
    </Canvas>
  );
}

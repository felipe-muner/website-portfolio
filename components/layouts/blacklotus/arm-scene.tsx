"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Decal } from "@react-three/drei";
import * as THREE from "three";
import { drawFlash, FLASH, type FlashDesign } from "./flash";

/* ------------------------------------------------------------------ */
/* Black Lotus — the forearm you place flash on and turn                */
/*                                                                     */
/* A stylised arm (elbow to a loose, mitten-like hand) built as a      */
/* tapered, slightly bowed tube with a procedural skin. The chosen     */
/* flash is projected onto the inner forearm as a decal; drag to turn  */
/* the arm, and freshly placed ink sits under a glossy flush that      */
/* settles over a couple of seconds.                                   */
/* ------------------------------------------------------------------ */

export interface ArmSceneProps {
  design: FlashDesign;
  /** Decal width in arm units (see FLASH_SIZES). */
  size: number;
  /** Render only while on screen. */
  active: boolean;
  /** prefers-reduced-motion: no idle turn, no breathing. */
  reduced: boolean;
  /** Called once, the first time the visitor turns the arm. */
  onTurn: () => void;
}

/* ------------------------------------------------------------------ */
/* Geometry                                                            */
/* ------------------------------------------------------------------ */

/** Elbow (off the bottom of the stage) to fingertip, along local +y. */
const Y0 = -2.9;
const Y1 = 1.3;
/** Where the flash sits: mid inner forearm. */
const DECAL_Y = -0.95;
/** Lean of the whole arm, radians. */
const TILT = 0.16;
const RINGS = 150;
const AROUND = 72;

/** [y, half-width (x), half-thickness (z), spine x, spine z] — elbow to fingertips. */
const PROFILE = [
  [-2.9, 0.57, 0.53, 0.0, 0.0],
  [-2.2, 0.56, 0.51, 0.03, 0.0],
  [-1.5, 0.52, 0.47, 0.07, 0.0],
  [-0.8, 0.44, 0.39, 0.09, 0.0],
  [-0.3, 0.37, 0.3, 0.08, 0.0],
  [-0.05, 0.345, 0.26, 0.07, 0.0],
  [0.15, 0.37, 0.23, 0.06, 0.02],
  [0.5, 0.47, 0.17, 0.05, 0.06],
  [0.8, 0.45, 0.15, 0.04, 0.13],
  [1.05, 0.38, 0.12, 0.03, 0.24],
  [1.3, 0.3, 0.1, 0.02, 0.36],
] as const;

const YS = PROFILE.map((r) => r[0]);

/** Catmull-Rom through one column of the profile, by arm height. */
function profile(col: 1 | 2 | 3 | 4, y: number): number {
  const n = YS.length;
  let i = 0;
  while (i < n - 2 && y > YS[i + 1]) i++;
  const t = THREE.MathUtils.clamp((y - YS[i]) / (YS[i + 1] - YS[i]), 0, 1);
  const p0 = PROFILE[Math.max(0, i - 1)][col];
  const p1 = PROFILE[i][col];
  const p2 = PROFILE[i + 1][col];
  const p3 = PROFILE[Math.min(n - 1, i + 2)][col];
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t)
  );
}

interface Ring {
  y: number;
  rx: number;
  rz: number;
  cx: number;
  cz: number;
  /** Texture row for this ring. */
  v: number;
}

const CAP_FROM = 1.16;

function armRing(s: number): Ring {
  // Rings bunch up toward the fingertips, where the shape closes.
  const y = Y0 + (Y1 - Y0) * Math.sin((s * Math.PI) / 2);
  let rx = profile(1, y);
  let rz = profile(2, y);
  if (y > CAP_FROM) {
    const k = (y - CAP_FROM) / (Y1 - CAP_FROM);
    const m = Math.sqrt(Math.max(0, 1 - k * k));
    rx *= m;
    rz *= m;
  }
  return { y, rx: Math.max(0, rx), rz: Math.max(0, rz), cx: profile(3, y), cz: profile(4, y), v: (y - Y0) / (Y1 - Y0) };
}

function thumbRing(s: number): Ring {
  const base = 0.105 - 0.035 * s;
  const cap = s > 0.78 ? Math.sqrt(Math.max(0, 1 - ((s - 0.78) / 0.22) ** 2)) : 1;
  // Borrow a crease-free band of the arm's skin texture.
  return { y: 0.62 * s, rx: base * cap, rz: base * 0.88 * cap, cx: 0, cz: 0.05 * s * s, v: 0.12 + 0.16 * s };
}

function buildTube(ringAt: (s: number) => Ring, rings: number, around: number): THREE.BufferGeometry {
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= rings; i++) {
    const r = ringAt(i / rings);
    for (let j = 0; j <= around; j++) {
      const th = (j / around) * Math.PI * 2;
      pos.push(r.cx + r.rx * Math.cos(th), r.y, r.cz + r.rz * Math.sin(th));
      uv.push(j / around, r.v);
    }
  }
  for (let i = 0; i < rings; i++) {
    for (let j = 0; j < around; j++) {
      const a = i * (around + 1) + j;
      const b = a + around + 1;
      idx.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

let ARM: THREE.BufferGeometry | null = null;
let THUMB: THREE.BufferGeometry | null = null;
const armGeometry = () => (ARM ??= buildTube(armRing, RINGS, AROUND));
const thumbGeometry = () => (THUMB ??= buildTube(thumbRing, 24, 28));

/** The point on the inner forearm the flash is projected onto. */
const DECAL = {
  x: profile(3, DECAL_Y),
  y: DECAL_Y,
  z: profile(4, DECAL_Y) + profile(2, DECAL_Y),
};
/** Where the thumb roots into the palm. */
const THUMB_AT: [number, number, number] = [profile(3, 0.32) + profile(1, 0.32) - 0.1, 0.32, profile(4, 0.32) + 0.02];

/* ------------------------------------------------------------------ */
/* Procedural skin                                                     */
/* ------------------------------------------------------------------ */

/** Seeded PRNG (mulberry32), so the skin looks the same every visit. */
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
const random = rng(7);

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable");
  return { c, ctx };
}

function texture(source: HTMLCanvasElement, srgb: boolean) {
  const t = new THREE.CanvasTexture(source);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Soft blobs, repeated across the u seam so the skin wraps cleanly. */
function blobs(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  n: number,
  rMin: number,
  rMax: number,
  colour: () => string,
) {
  for (let i = 0; i < n; i++) {
    const x = random() * w;
    const y = random() * h;
    const r = rMin + random() * (rMax - rMin);
    const rgba = colour();
    for (const ox of [-w, 0, w]) {
      if (x + ox + r < 0 || x + ox - r > w) continue;
      const g = ctx.createRadialGradient(x + ox, y, 0, x + ox, y, r);
      g.addColorStop(0, rgba);
      g.addColorStop(1, rgba.replace(/[\d.]+\)$/, "0)"));
      ctx.fillStyle = g;
      ctx.fillRect(x + ox - r, y - r, r * 2, r * 2);
    }
  }
}

function specks(ctx: CanvasRenderingContext2D, w: number, h: number, n: number, colour: () => string, sMax: number) {
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = colour();
    const s = 0.8 + random() * sMax;
    ctx.beginPath();
    ctx.arc(random() * w, random() * h, s, 0, Math.PI * 2);
    ctx.fill();
  }
}

function wrinkles(ctx: CanvasRenderingContext2D, w: number, h: number, n: number, colour: string) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = 0.9;
  ctx.lineCap = "round";
  for (let i = 0; i < n; i++) {
    const x = random() * w;
    const y = random() * h;
    const len = 4 + random() * 12;
    const a = random() * Math.PI;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
    ctx.stroke();
  }
}

interface SkinMaps {
  map: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
}

function makeSkin(): SkinMaps {
  /* Colour: one sheet around the arm (u) and along it (v). */
  const W = 1024;
  const H = 2048;
  const color = canvas(W, H);
  const cx = color.ctx;
  cx.fillStyle = "#d3a082";
  cx.fillRect(0, 0, W, H);
  const tones = ["212,146,118", "228,186,152", "184,118,96", "206,158,138", "222,170,130"];
  blobs(cx, W, H, 480, 40, 190, () => `rgba(${tones[Math.floor(random() * tones.length)]},${(0.05 + random() * 0.08).toFixed(3)})`);

  // Arm height → texture row (v = 0 is the bottom row).
  const row = (y: number) => (1 - (y - Y0) / (Y1 - Y0)) * H;
  // The inner forearm faces +z, which is u = 0.25 → x ≈ 256; the back is x ≈ 768.
  cx.lineCap = "round";
  const vein = (x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) => {
    for (const [lw, a] of [
      [16, 0.045],
      [7, 0.09],
    ]) {
      cx.strokeStyle = `rgba(92,118,128,${a})`;
      cx.lineWidth = lw;
      cx.beginPath();
      cx.moveTo(x0, row(y0));
      cx.bezierCurveTo(x1, row(y1), x2, row(y2), x3, row(y3));
      cx.stroke();
    }
  };
  vein(300, -2.8, 262, -1.9, 240, -1.1, 290, -0.3);
  vein(190, -2.7, 232, -1.8, 170, -1.2, 212, -0.2);
  vein(300, -1.3, 332, -0.9, 300, -0.5, 318, -0.15);

  // Freckles, thickest on the outer forearm.
  for (let i = 0; i < 1800; i++) {
    const gauss = (random() + random() + random() + random() - 2) / 2;
    const x = (((768 + gauss * 520) % W) + W) % W;
    cx.fillStyle = `rgba(104,62,46,${(0.08 + random() * 0.22).toFixed(3)})`;
    cx.beginPath();
    cx.arc(x, random() * H, 0.8 + random() * 2.2, 0, Math.PI * 2);
    cx.fill();
  }

  // Creases: wrist, palm and knuckles.
  cx.strokeStyle = "rgba(122,72,56,0.24)";
  cx.lineWidth = 2.6;
  const crease = (x0: number, y: number, x1: number, amp: number) => {
    cx.beginPath();
    cx.moveTo(x0, row(y));
    cx.quadraticCurveTo((x0 + x1) / 2, row(y) + amp, x1, row(y));
    cx.stroke();
  };
  crease(60, -0.08, 450, 14);
  crease(90, -0.15, 420, -10);
  crease(140, 0.52, 400, 24);
  crease(170, 0.42, 380, 18);
  cx.beginPath();
  cx.moveTo(330, row(0.56));
  cx.quadraticCurveTo(230, row(0.42), 290, row(0.2));
  cx.stroke();
  for (const kx of [640, 720, 800, 880]) {
    cx.beginPath();
    cx.moveTo(kx - 24, row(0.8) + 6);
    cx.quadraticCurveTo(kx, row(0.8) - 10, kx + 24, row(0.8) + 6);
    cx.stroke();
  }

  // Pores and a dusting of lighter cells.
  specks(cx, W, H, 16000, () => `rgba(96,52,40,${(0.05 + random() * 0.08).toFixed(3)})`, 1.4);
  specks(cx, W, H, 9000, () => `rgba(255,236,222,${(0.04 + random() * 0.07).toFixed(3)})`, 1.4);

  /* Roughness and bump: a fine tile repeated over the arm. */
  const S = 512;
  const rough = canvas(S, S);
  rough.ctx.fillStyle = "#8e8e8e";
  rough.ctx.fillRect(0, 0, S, S);
  blobs(rough.ctx, S, S, 160, 20, 90, () => (random() > 0.5 ? "rgba(165,165,165,0.3)" : "rgba(115,115,115,0.3)"));
  specks(rough.ctx, S, S, 7000, () => `rgba(192,192,192,${(0.3 + random() * 0.4).toFixed(2)})`, 1.4);
  wrinkles(rough.ctx, S, S, 2500, "rgba(175,175,175,0.35)");

  const bump = canvas(S, S);
  bump.ctx.fillStyle = "#808080";
  bump.ctx.fillRect(0, 0, S, S);
  blobs(bump.ctx, S, S, 120, 20, 80, () => (random() > 0.5 ? "rgba(140,140,140,0.35)" : "rgba(112,112,112,0.35)"));
  specks(bump.ctx, S, S, 7000, () => `rgba(70,70,70,${(0.35 + random() * 0.4).toFixed(2)})`, 1.4);
  wrinkles(bump.ctx, S, S, 2500, "rgba(96,96,96,0.4)");

  const map = texture(color.c, true);
  map.wrapS = THREE.RepeatWrapping;
  const roughnessMap = texture(rough.c, false);
  const bumpMap = texture(bump.c, false);
  for (const t of [roughnessMap, bumpMap]) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(3, 4.5);
  }
  return { map, roughnessMap, bumpMap };
}

let SKIN: SkinMaps | null = null;
const skinMaps = () => (SKIN ??= makeSkin());

/* ------------------------------------------------------------------ */
/* Flash and the fresh-ink flush                                       */
/* ------------------------------------------------------------------ */

const FLASH_TEXTURES = new Map<string, THREE.CanvasTexture>();

function flashTexture(design: FlashDesign): THREE.CanvasTexture {
  let t = FLASH_TEXTURES.get(design.id);
  if (!t) {
    const { c, ctx } = canvas(1024, 1024);
    drawFlash(ctx, design, 1024);
    t = texture(c, true);
    FLASH_TEXTURES.set(design.id, t);
  }
  return t;
}

let FRESH: THREE.CanvasTexture | null = null;

/** A soft, slightly pink patch — the ointment-and-flush over fresh ink. */
function freshTexture(): THREE.CanvasTexture {
  if (!FRESH) {
    const { c, ctx } = canvas(256, 256);
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(255,150,132,0.6)");
    g.addColorStop(0.55, "rgba(255,160,140,0.28)");
    g.addColorStop(1, "rgba(255,160,140,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    FRESH = texture(c, true);
  }
  return FRESH;
}

/* ------------------------------------------------------------------ */
/* Frame-loop state, kept out of React                                 */
/* ------------------------------------------------------------------ */

interface Rig {
  time: number;
  angle: number;
  velocity: number;
  dragging: boolean;
  lastX: number;
  lastMoveAt: number;
  lastInput: number;
  moved: number;
  told: boolean;
  placedAt: number;
  home: number;
  homingUntil: number;
}

const newRig = (): Rig => ({
  time: 0,
  angle: 0,
  velocity: 0,
  dragging: false,
  lastX: 0,
  lastMoveAt: 0,
  lastInput: -10,
  moved: 0,
  told: false,
  placedAt: 0,
  home: 0,
  homingUntil: -1,
});

const rigOf = (ref: RefObject<Rig | null>) => (ref.current ??= newRig());

const TURN_PER_PX = 0.012;
const IDLE_AFTER = 3;
const IDLE_SPEED = 0.2;
const SETTLE_SECONDS = 2.8;

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

function Arm({ design, size, reduced, onTurn }: Omit<ArmSceneProps, "active">) {
  const { gl, viewport } = useThree();
  const spin = useRef<THREE.Group>(null);
  const inkMat = useRef<THREE.MeshStandardMaterial>(null);
  const freshMat = useRef<THREE.MeshStandardMaterial>(null);
  const rigRef = useRef<Rig | null>(null);
  const onTurnRef = useRef(onTurn);

  const arm = useMemo(() => armGeometry(), []);
  const thumb = useMemo(() => thumbGeometry(), []);
  const skin = useMemo(() => skinMaps(), []);
  const fresh = useMemo(() => freshTexture(), []);
  const ink = useMemo(() => flashTexture(design), [design]);

  useEffect(() => {
    onTurnRef.current = onTurn;
  }, [onTurn]);

  /* Drag anywhere on the stage to turn the arm about its own axis. */
  useEffect(() => {
    const el = gl.domElement;
    const rig = rigOf(rigRef);
    const down = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      rig.dragging = true;
      rig.lastX = e.clientX;
      rig.lastMoveAt = performance.now();
      rig.velocity = 0;
      rig.moved = 0;
      rig.homingUntil = -1;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!rig.dragging) return;
      const now = performance.now();
      const dx = e.clientX - rig.lastX;
      const d = dx * TURN_PER_PX;
      const dt = Math.max(8, now - rig.lastMoveAt) / 1000;
      rig.angle += d;
      rig.velocity = THREE.MathUtils.clamp(d / dt, -7, 7);
      rig.moved += Math.abs(dx);
      rig.lastMoveAt = now;
      rig.lastX = e.clientX;
      rig.lastInput = rig.time;
      if (rig.moved > 12 && !rig.told) {
        rig.told = true;
        onTurnRef.current();
      }
    };
    const up = (e: PointerEvent) => {
      if (!rig.dragging) return;
      rig.dragging = false;
      rig.lastInput = rig.time;
      if (performance.now() - rig.lastMoveAt > 80) rig.velocity = 0;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [gl]);

  /* New flash or new size: fresh ink, and bring the inner forearm round to face you. */
  useEffect(() => {
    const rig = rigOf(rigRef);
    rig.placedAt = rig.time;
    rig.home = Math.round(rig.angle / (Math.PI * 2)) * Math.PI * 2;
    rig.homingUntil = rig.time + 1.1;
    rig.lastInput = rig.time + 1.5;
  }, [design.id, size]);

  useFrame((_, delta) => {
    const rig = rigOf(rigRef);
    const dt = Math.min(delta, 0.05);
    rig.time += dt;

    if (!rig.dragging) {
      if (rig.time < rig.homingUntil) {
        rig.angle += (rig.home - rig.angle) * Math.min(1, 7 * dt);
        rig.velocity = 0;
      } else {
        rig.angle += rig.velocity * dt;
        rig.velocity *= Math.exp(-2.4 * dt);
        if (!reduced && rig.time - rig.lastInput > IDLE_AFTER) rig.angle += IDLE_SPEED * dt;
      }
    }

    const g = spin.current;
    if (g) {
      g.rotation.y = rig.angle;
      g.position.y = reduced ? 0 : Math.sin(rig.time * 0.8) * 0.012;
    }

    /* Fresh ink: glossy and flushed, settling to matte skin. */
    const k = THREE.MathUtils.clamp((rig.time - rig.placedAt) / SETTLE_SECONDS, 0, 1);
    const eased = 1 - (1 - k) * (1 - k);
    if (inkMat.current) inkMat.current.roughness = 0.16 + 0.52 * eased;
    if (freshMat.current) freshMat.current.opacity = 0.85 * (1 - eased);
  });

  /* Fit the arm to the stage and park the flash just below its centre. */
  const fit = Math.min(1, viewport.height / 3.7, viewport.width / 2.4);
  const ax = -(DECAL.x * Math.cos(TILT) - DECAL.y * Math.sin(TILT)) * fit;
  const ay = -(DECAL.x * Math.sin(TILT) + DECAL.y * Math.cos(TILT)) * fit - 0.08;
  const decalAt: [number, number, number] = [DECAL.x, DECAL.y, DECAL.z - 0.15];

  return (
    <group position={[ax, ay, 0]} rotation={[0, 0, TILT]} scale={fit}>
      <group ref={spin}>
        <mesh geometry={arm}>
          <meshStandardMaterial
            map={skin.map}
            roughnessMap={skin.roughnessMap}
            roughness={1}
            bumpMap={skin.bumpMap}
            bumpScale={0.003}
            metalness={0}
          />
          <Decal position={decalAt} rotation={[0, 0, 0]} scale={[size * 1.3, size * 1.3, 0.55]} depthTest renderOrder={1}>
            <meshStandardMaterial
              ref={freshMat}
              map={fresh}
              transparent
              opacity={0}
              roughness={0.12}
              metalness={0}
              emissive="#ff5a46"
              emissiveIntensity={0.3}
              polygonOffset
              polygonOffsetFactor={-3}
              depthWrite={false}
            />
          </Decal>
          <Decal position={decalAt} rotation={[0, 0, 0]} scale={[size, size, 0.55]} depthTest renderOrder={2}>
            <meshStandardMaterial
              ref={inkMat}
              map={ink}
              transparent
              roughness={0.6}
              metalness={0}
              polygonOffset
              polygonOffsetFactor={-5}
              depthWrite={false}
            />
          </Decal>
        </mesh>
        <mesh geometry={thumb} position={THUMB_AT} rotation={[0.45, 0, -0.95]}>
          <meshStandardMaterial
            map={skin.map}
            roughnessMap={skin.roughnessMap}
            roughness={1}
            bumpMap={skin.bumpMap}
            bumpScale={0.003}
            metalness={0}
          />
        </mesh>
      </group>
    </group>
  );
}

function Studio() {
  return (
    <>
      {/* Cool key from the front-left, warm rims from behind, a whisper of fill. */}
      <ambientLight intensity={0.35} color="#8ea0c0" />
      <hemisphereLight args={["#6d80a3", "#3a2620", 0.6]} />
      <directionalLight position={[-3.5, 4, 4.5]} intensity={2.6} color="#d4e2ff" />
      <directionalLight position={[4, 1.5, -3]} intensity={3.4} color="#ff9a5a" />
      <directionalLight position={[-3, -2, -2.5]} intensity={1.1} color="#ff6a4a" />
      <pointLight position={[2.6, -0.5, 3.5]} intensity={5} color="#9fb6dc" decay={2} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Canvas                                                              */
/* ------------------------------------------------------------------ */

export default function ArmScene(props: ArmSceneProps) {
  const { active, ...rest } = props;

  /* Draw every flash once up front, so switching is instant. */
  useEffect(() => {
    FLASH.forEach(flashTexture);
  }, []);

  return (
    <Canvas
      camera={{ fov: 30, position: [0, 0, 6.4], near: 0.1, far: 30 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
      className="cursor-grab active:cursor-grabbing"
      style={{ touchAction: "pan-y" }}
    >
      <Studio />
      <Arm {...rest} />
    </Canvas>
  );
}

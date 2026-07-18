"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows, Sky } from "@react-three/drei";
import * as THREE from "three";

const SUN: [number, number, number] = [9, 8, 6];

/* ---- Geometry, in metres-ish (ridge runs along Z; gable faces +Z) - */
const FOOT_TOP = 0.28;
const DECK_TOP = 2.5;
const DECK_UNDER = 2.28;
const EAVE_Y = 4.4;
const RIDGE_Y = 5.7;
const COLS = [-2.2, 0, 2.2]; // x of the legs
const ROWS = [-1.7, 1.7]; // z of the legs
const DHX = 2.7; // deck half-width (x)
const DHZ = 2.1; // deck half-depth (z)
const EHX = 3.1; // eave overhang half-width
const RZ = 2.5; // ridge half-length (z)

/* ---- Easing ------------------------------------------------------ */
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const roofYAtX = (x: number) => EAVE_Y + (RIDGE_Y - EAVE_Y) * (1 - Math.min(1, Math.abs(x) / EHX));

/* Deterministic jitter so entrance offsets stay constant per part. */
function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/* ---- Phase windows on the scroll timeline ------------------------ */
const PW: Record<string, [number, number]> = {
  foot: [0.02, 0.11],
  posts: [0.12, 0.28],
  floor: [0.29, 0.45],
  frame: [0.46, 0.63],
  walls: [0.6, 0.72],
  roof: [0.7, 0.9],
  finish: [0.9, 0.985],
};

/* ================================================================== */
/* Procedural textures                                                 */
/* ================================================================== */
function makeBamboo() {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 128;
  const ctx = c.getContext("2d")!;
  const b = document.createElement("canvas");
  b.width = 64;
  b.height = 128;
  const bx = b.getContext("2d")!;
  // across-width shading (cylindrical hint) + honey base
  const g = ctx.createLinearGradient(0, 0, 64, 0);
  g.addColorStop(0, "#8f7133");
  g.addColorStop(0.5, "#e0c47c");
  g.addColorStop(1, "#8f7133");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 128);
  bx.fillStyle = "#808080";
  bx.fillRect(0, 0, 64, 128);
  // vertical fibres
  for (let i = 0; i < 180; i++) {
    const x = Math.random() * 64;
    const dark = Math.random() > 0.5;
    ctx.strokeStyle = dark ? "rgba(110,84,36,0.18)" : "rgba(244,222,158,0.2)";
    ctx.lineWidth = 0.5 + Math.random();
    ctx.beginPath();
    ctx.moveTo(x, Math.random() * 128);
    ctx.lineTo(x + (Math.random() - 0.5) * 2, Math.random() * 128);
    ctx.stroke();
  }
  // node band at the tile seam (repeats along the culm)
  ctx.fillStyle = "rgba(74,56,22,0.85)";
  ctx.fillRect(0, 120, 64, 8);
  ctx.fillStyle = "rgba(214,182,120,0.6)";
  ctx.fillRect(0, 114, 64, 4);
  bx.fillStyle = "#ffffff";
  bx.fillRect(0, 112, 64, 6);
  bx.fillStyle = "#3a3a3a";
  bx.fillRect(0, 120, 64, 8);
  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 8;
  const bump = new THREE.CanvasTexture(b);
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
  return { map, bump };
}

function makeThatch() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext("2d")!;
  const b = document.createElement("canvas");
  b.width = 128;
  b.height = 128;
  const bx = b.getContext("2d")!;
  ctx.fillStyle = "#c3a869";
  ctx.fillRect(0, 0, 128, 128);
  bx.fillStyle = "#777";
  bx.fillRect(0, 0, 128, 128);
  // straws hanging downward
  for (let i = 0; i < 1400; i++) {
    const x = Math.random() * 128;
    const y = Math.random() * 128;
    const len = 10 + Math.random() * 34;
    const s = Math.random();
    ctx.strokeStyle = s > 0.6 ? "rgba(228,202,142,0.6)" : s > 0.3 ? "rgba(150,116,56,0.55)" : "rgba(104,78,36,0.5)";
    ctx.lineWidth = 0.7 + Math.random() * 1.3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 2, y + len);
    ctx.stroke();
    bx.strokeStyle = s > 0.5 ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)";
    bx.lineWidth = ctx.lineWidth;
    bx.beginPath();
    bx.moveTo(x, y);
    bx.lineTo(x, y + len);
    bx.stroke();
  }
  // shaggy dark bottom edge of the bundle
  ctx.fillStyle = "rgba(86,62,28,0.4)";
  ctx.fillRect(0, 116, 128, 12);
  bx.fillStyle = "rgba(0,0,0,0.6)";
  bx.fillRect(0, 116, 128, 12);
  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  const bump = new THREE.CanvasTexture(b);
  return { map, bump };
}

/* ================================================================== */
/* Imperative house builder — one mesh per bamboo piece                */
/* ================================================================== */
interface Part {
  mesh: THREE.Mesh;
  mat: THREE.MeshStandardMaterial;
  phase: string;
  offset: THREE.Vector3;
  start: THREE.Vector3;
  final: THREE.Vector3;
  s: number;
  d: number;
}

function buildHouse() {
  const root = new THREE.Group();
  const parts: Part[] = [];
  const bamboo = makeBamboo();
  const thatch = makeThatch();
  const rand = rng(9281);

  const bambooBase = new THREE.MeshStandardMaterial({ map: bamboo.map, bumpMap: bamboo.bump, bumpScale: 0.4, color: "#cdae67", roughness: 0.5, metalness: 0, envMapIntensity: 1.1 });
  const thatchBase = new THREE.MeshStandardMaterial({ map: thatch.map, bumpMap: thatch.bump, bumpScale: 0.8, color: "#c2a86e", roughness: 0.95, envMapIntensity: 0.6 });
  const stoneBase = new THREE.MeshStandardMaterial({ color: "#948a78", roughness: 0.95, flatShading: true, envMapIntensity: 0.5 });
  const darkBase = new THREE.MeshStandardMaterial({ color: "#241811", roughness: 1, emissive: "#ff9d43", emissiveIntensity: 0 });

  const YUP = new THREE.Vector3(0, 1, 0);
  let doorMat: THREE.MeshStandardMaterial | null = null;

  const push = (mesh: THREE.Mesh, phase: string, offset: THREE.Vector3) => {
    root.add(mesh);
    parts.push({ mesh, mat: mesh.material as THREE.MeshStandardMaterial, phase, offset, start: new THREE.Vector3(), final: new THREE.Vector3(), s: 0, d: 1 });
  };

  // A bamboo culm between two points, with node rings baked into the map.
  const culm = (p1: THREE.Vector3, p2: THREE.Vector3, radius: number, phase: string, offset: THREE.Vector3) => {
    const dir = new THREE.Vector3().subVectors(p2, p1);
    const len = dir.length();
    dir.normalize();
    const geo = new THREE.CylinderGeometry(radius * 0.93, radius, len, 12, 1);
    const mat = bambooBase.clone();
    mat.transparent = true;
    mat.map = bamboo.map.clone();
    mat.map.needsUpdate = true;
    mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
    mat.map.repeat.set(1, Math.max(1, Math.round(len / 0.5)));
    mat.bumpMap = bamboo.bump.clone();
    mat.bumpMap.needsUpdate = true;
    mat.bumpMap.wrapS = mat.bumpMap.wrapT = THREE.RepeatWrapping;
    mat.bumpMap.repeat.copy(mat.map.repeat);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.quaternion.setFromUnitVectors(YUP, dir);
    mesh.position.copy(p1).addScaledVector(dir, len / 2);
    push(mesh, phase, offset);
  };
  const vpost = (x: number, y0: number, y1: number, z: number, r: number, phase: string, off: THREE.Vector3) =>
    culm(new THREE.Vector3(x, y0, z), new THREE.Vector3(x, y1, z), r, phase, off);

  // A dark rope lashing wrapped around a joint — the signature bamboo tie.
  const ropeBase = new THREE.MeshStandardMaterial({ color: "#1d160e", roughness: 1, metalness: 0 });
  const lash = (x: number, y: number, z: number, r: number, phase: string, off: THREE.Vector3, axis: "y" | "z") => {
    const geo = new THREE.TorusGeometry(r, 0.032, 6, 16);
    const mat = ropeBase.clone();
    mat.transparent = true;
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = true;
    m.position.set(x, y, z);
    if (axis === "y") m.rotation.x = Math.PI / 2;
    else m.rotation.y = Math.PI / 2;
    push(m, phase, off);
  };

  const DOWN = () => new THREE.Vector3(0, -1.6 - rand() * 0.8, 0);
  const UP = () => new THREE.Vector3((rand() - 0.5) * 0.6, 2 + rand() * 1.2, (rand() - 0.5) * 0.6);
  const SIDE = (sx: number, sz: number) => new THREE.Vector3(sx * (1.4 + rand()), rand() * 0.4, sz * (1.4 + rand()));

  /* I — footings */
  COLS.forEach((x) =>
    ROWS.forEach((z) => {
      const geo = new THREE.SphereGeometry(0.34, 14, 9);
      const m = new THREE.Mesh(geo, Object.assign(stoneBase.clone(), { transparent: true }));
      m.castShadow = m.receiveShadow = true;
      m.position.set(x, 0.12, z);
      push(m, "foot", new THREE.Vector3(0, -0.8, 0));
    })
  );

  /* II — stilt posts + cross bracing */
  COLS.forEach((x) => ROWS.forEach((z) => vpost(x, FOOT_TOP, DECK_UNDER, z, 0.15, "posts", DOWN())));
  ROWS.forEach((z) =>
    [0, 1].forEach((i) => {
      const x1 = COLS[i];
      const x2 = COLS[i + 1];
      culm(new THREE.Vector3(x1, FOOT_TOP + 0.1, z), new THREE.Vector3(x2, DECK_UNDER - 0.1, z), 0.06, "posts", DOWN());
      culm(new THREE.Vector3(x2, FOOT_TOP + 0.1, z), new THREE.Vector3(x1, DECK_UNDER - 0.1, z), 0.06, "posts", DOWN());
    })
  );

  /* III — floor: ring beams, joists, then split-bamboo decking */
  ROWS.forEach((z) => culm(new THREE.Vector3(-DHX, DECK_UNDER + 0.05, z), new THREE.Vector3(DHX, DECK_UNDER + 0.05, z), 0.11, "floor", DOWN()));
  COLS.forEach((x) => culm(new THREE.Vector3(x, DECK_UNDER + 0.12, -DHZ), new THREE.Vector3(x, DECK_UNDER + 0.12, DHZ), 0.09, "floor", DOWN()));
  {
    const n = 20;
    for (let i = 0; i < n; i++) {
      const z = -DHZ + 0.1 + (i * (DHZ * 2 - 0.2)) / (n - 1);
      culm(new THREE.Vector3(-DHX, DECK_TOP - 0.05, z), new THREE.Vector3(DHX, DECK_TOP - 0.05, z), 0.075, "floor", DOWN());
    }
  }

  /* IV — frame: wall posts, top plates, ridge, rafters, gable studs */
  COLS.forEach((x) => ROWS.forEach((z) => vpost(x, DECK_TOP, roofYAtX(x) - 0.05, z, 0.12, "frame", DOWN())));
  // eave top-plates along Z on both long sides
  [-DHX, DHX].forEach((x) => culm(new THREE.Vector3(x, EAVE_Y, -RZ - 0.2), new THREE.Vector3(x, EAVE_Y, RZ + 0.2), 0.1, "frame", UP()));
  // ridge beam along Z
  culm(new THREE.Vector3(0, RIDGE_Y, -RZ - 0.3), new THREE.Vector3(0, RIDGE_Y, RZ + 0.3), 0.12, "frame", UP());
  // rafters: pairs from ridge down to each eave, along the depth
  {
    const n = 7;
    for (let i = 0; i < n; i++) {
      const z = -RZ + (i * (RZ * 2)) / (n - 1);
      culm(new THREE.Vector3(0, RIDGE_Y, z), new THREE.Vector3(-EHX, EAVE_Y, z), 0.06, "frame", UP());
      culm(new THREE.Vector3(0, RIDGE_Y, z), new THREE.Vector3(EHX, EAVE_Y, z), 0.06, "frame", UP());
    }
  }
  // gable studs (front & back triangular ends)
  [RZ, -RZ].forEach((z) => {
    for (let gx = -2; gx <= 2; gx++) {
      const x = gx * 0.9;
      culm(new THREE.Vector3(x, EAVE_Y - 0.1, z), new THREE.Vector3(x, roofYAtX(x), z), 0.05, "frame", UP());
    }
  });

  // rope lashings at the load-bearing joints
  COLS.forEach((x) => ROWS.forEach((z) => lash(x, DECK_UNDER + 0.03, z, 0.19, "floor", new THREE.Vector3(0, -0.4, 0), "y")));
  COLS.forEach((x) => ROWS.forEach((z) => lash(x, roofYAtX(x) - 0.14, z, 0.16, "frame", UP(), "y")));
  {
    const n = 7;
    for (let i = 0; i < n; i++) {
      const z = -RZ + (i * (RZ * 2)) / (n - 1);
      lash(0, RIDGE_Y - 0.02, z, 0.15, "frame", UP(), "z");
    }
  }

  /* V — walls: vertical bamboo slats on 3 sides, with window gaps */
  const wall = (fixed: "x" | "z", fixedVal: number, from: number, to: number, sign: number, win: [number, number] | null) => {
    const n = Math.round((to - from) / 0.2);
    for (let i = 0; i <= n; i++) {
      const t = from + ((to - from) * i) / n;
      const top = fixed === "x" ? Math.min(EAVE_Y, roofYAtX(fixedVal)) : EAVE_Y;
      if (win && t > win[0] && t < win[1]) {
        // window: short slats above and below the opening
        const [a, b] = fixed === "x" ? [new THREE.Vector3(fixedVal, DECK_TOP, t), new THREE.Vector3(fixedVal, DECK_TOP + 0.7, t)] : [new THREE.Vector3(t, DECK_TOP, fixedVal), new THREE.Vector3(t, DECK_TOP + 0.7, fixedVal)];
        culm(a, b, 0.045, "walls", SIDE(fixed === "x" ? sign : 0, fixed === "z" ? sign : 0));
        const [c, d] = fixed === "x" ? [new THREE.Vector3(fixedVal, top - 0.6, t), new THREE.Vector3(fixedVal, top, t)] : [new THREE.Vector3(t, top - 0.6, fixedVal), new THREE.Vector3(t, top, fixedVal)];
        culm(c, d, 0.045, "walls", SIDE(fixed === "x" ? sign : 0, fixed === "z" ? sign : 0));
        continue;
      }
      const p1 = fixed === "x" ? new THREE.Vector3(fixedVal, DECK_TOP, t) : new THREE.Vector3(t, DECK_TOP, fixedVal);
      const p2 = fixed === "x" ? new THREE.Vector3(fixedVal, top, t) : new THREE.Vector3(t, top, fixedVal);
      culm(p1, p2, 0.045, "walls", SIDE(fixed === "x" ? sign : 0, fixed === "z" ? sign : 0));
    }
  };
  wall("z", -DHZ, -2.1, 2.1, -1, [-0.5, 0.9]); // back wall + window
  wall("x", -DHX, -1.8, 1.8, -1, [0.2, 1.4]); // left wall + window
  wall("x", DHX, -1.8, 1.8, 1, [-1.4, -0.2]); // right wall + window
  // gable infill slats above eave (front & back)
  [RZ, -RZ].forEach((z, gi) => {
    for (let gx = -3; gx <= 3; gx++) {
      const x = gx * 0.62;
      const top = roofYAtX(x) - 0.03;
      if (top <= EAVE_Y + 0.05) continue;
      if (gi === 0 && x > -0.5 && x < 0.5) continue; // leave a gable vent at the front apex
      culm(new THREE.Vector3(x, EAVE_Y, z), new THREE.Vector3(x, top, z), 0.04, "walls", new THREE.Vector3(0, 1.5 + rand(), 0));
    }
  });

  /* VI(a) — thatch roof, laid course by course (eave → ridge) */
  const slope = (sideX: number) => {
    const rows = 6;
    const cols = 9;
    const eaveX = sideX * EHX;
    const nx = new THREE.Vector3(sideX * (RIDGE_Y - EAVE_Y), EHX, 0).normalize(); // outward normal
    const ex = new THREE.Vector3(sideX, 0, 0); // dummy; recomputed below
    for (let r = 0; r < rows; r++) {
      const v0 = r / rows;
      const v1 = (r + 1) / rows;
      const yA = EAVE_Y + (RIDGE_Y - EAVE_Y) * v0;
      const yB = EAVE_Y + (RIDGE_Y - EAVE_Y) * v1;
      const xA = eaveX * (1 - v0);
      const xB = eaveX * (1 - v1);
      const cyc = (yA + yB) / 2;
      const cxc = (xA + xB) / 2;
      const along = new THREE.Vector3(xB - xA, yB - yA, 0).normalize(); // up-slope
      const tang = new THREE.Vector3(0, 0, 1); // along ridge (z)
      const norm = new THREE.Vector3().crossVectors(tang, along).normalize();
      if (norm.x * sideX < 0) norm.multiplyScalar(-1);
      const quat = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(tang, norm, along));
      const tileW = ((RZ + 0.3) * 2) / cols;
      const tileH = Math.hypot(xB - xA, yB - yA) * 1.5;
      for (let c = 0; c < cols; c++) {
        const z = -(RZ + 0.3) + tileW * (c + 0.5);
        const geo = new THREE.BoxGeometry(tileW * 1.08, 0.14, tileH);
        const mat = thatchBase.clone();
        mat.transparent = true;
        const m = new THREE.Mesh(geo, mat);
        m.castShadow = m.receiveShadow = true;
        m.quaternion.copy(quat);
        m.position.set(cxc + norm.x * 0.07, cyc + norm.y * 0.07 + 0.03, z);
        push(m, "roof", new THREE.Vector3(norm.x * 1.2, 2 + rand(), 0));
      }
    }
    void ex;
  };
  slope(-1);
  slope(1);
  // ridge capping bundles
  for (let i = 0; i < 6; i++) {
    const z = -RZ + (i * (RZ * 2)) / 5;
    const geo = new THREE.CylinderGeometry(0.19, 0.19, (RZ * 2) / 6 + 0.12, 10);
    const mat = thatchBase.clone();
    mat.transparent = true;
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = true;
    m.rotation.x = Math.PI / 2;
    m.position.set(0, RIDGE_Y + 0.05, z);
    push(m, "roof", new THREE.Vector3(0, 2, 0));
  }

  /* VII — finishing: veranda rail, ladder, door, window lintels */
  // front veranda railing (z = +DHZ)
  culm(new THREE.Vector3(-DHX + 0.2, DECK_TOP + 0.75, DHZ), new THREE.Vector3(DHX - 0.2, DECK_TOP + 0.75, DHZ), 0.05, "finish", UP());
  for (let i = 0; i <= 12; i++) {
    const x = -DHX + 0.3 + (i * (DHX * 2 - 0.6)) / 12;
    if (x > -0.7 && x < 0.7) continue; // door gap
    vpost(x, DECK_TOP, DECK_TOP + 0.75, DHZ, 0.03, "finish", new THREE.Vector3(0, -0.8, 0));
  }
  // door frame + door panel (front, +Z)
  vpost(-0.55, DECK_TOP, EAVE_Y - 0.2, DHZ, 0.06, "finish", DOWN());
  vpost(0.55, DECK_TOP, EAVE_Y - 0.2, DHZ, 0.06, "finish", DOWN());
  culm(new THREE.Vector3(-0.6, EAVE_Y - 0.2, DHZ), new THREE.Vector3(0.6, EAVE_Y - 0.2, DHZ), 0.06, "finish", DOWN());
  {
    const geo = new THREE.PlaneGeometry(0.9, 1.75);
    const mat = darkBase.clone();
    mat.transparent = true;
    doorMat = mat;
    const m = new THREE.Mesh(geo, mat);
    m.position.set(0, DECK_TOP + 0.9, DHZ + 0.02);
    push(m, "finish", new THREE.Vector3(0, -0.8, 0));
  }
  // ladder up to the veranda
  {
    const lx = -1.9;
    const lz = DHZ + 0.4;
    culm(new THREE.Vector3(lx - 0.28, 0, lz + 0.2), new THREE.Vector3(lx - 0.22, DECK_TOP + 0.1, lz), 0.05, "finish", DOWN());
    culm(new THREE.Vector3(lx + 0.28, 0, lz + 0.2), new THREE.Vector3(lx + 0.22, DECK_TOP + 0.1, lz), 0.05, "finish", DOWN());
    for (let i = 0; i < 5; i++) {
      const y = 0.35 + i * 0.5;
      const zz = lz + 0.2 - (y / (DECK_TOP + 0.1)) * 0.2;
      culm(new THREE.Vector3(lx - 0.26, y, zz), new THREE.Vector3(lx + 0.26, y, zz), 0.035, "finish", DOWN());
    }
  }

  /* assign timeline windows per phase, streaming within each phase */
  const byPhase: Record<string, Part[]> = {};
  for (const p of parts) (byPhase[p.phase] ||= []).push(p);
  for (const ph of Object.keys(byPhase)) {
    const arr = byPhase[ph];
    const [a, b] = PW[ph];
    const n = arr.length;
    arr.forEach((p, j) => {
      const c = a + (b - a) * ((j + 0.5) / n);
      const d = Math.max(0.05, (b - a) * 0.8);
      p.s = c - d * 0.5;
      p.d = d;
      p.final.copy(p.mesh.position);
      p.start.copy(p.mesh.position).add(p.offset);
    });
  }

  return { root, parts, doorMat: doorMat as THREE.MeshStandardMaterial | null };
}

/* ================================================================== */
/* React wrapper                                                       */
/* ================================================================== */
function BambooHouse({ progressRef, reduced }: { progressRef: MutableRefObject<number>; reduced: boolean }) {
  const { root, parts, doorMat } = useMemo(buildHouse, []);
  const { camera } = useThree();
  const lantern = useRef<THREE.PointLight>(null);
  const smoothed = useRef(reduced ? 1 : 0);

  useFrame((_, dt) => {
    const target = reduced ? 1 : progressRef.current;
    smoothed.current += (target - smoothed.current) * Math.min(1, dt * 6);
    const p = smoothed.current;

    for (const part of parts) {
      const t = easeOut(clamp01((p - part.s) / part.d));
      const m = part.mesh;
      if (t <= 0.001) {
        m.visible = false;
        continue;
      }
      m.visible = true;
      m.position.lerpVectors(part.start, part.final, t);
      part.mat.opacity = t;
    }

    const glow = easeOut(clamp01((p - 0.9) / 0.1));
    if (doorMat) doorMat.emissiveIntensity = glow * 1.3;
    if (lantern.current) lantern.current.intensity = glow * 7;

    if (!reduced) {
      const a = -0.5 + p * 0.5;
      const rad = 12.5 - p * 0.6;
      camera.position.set(Math.sin(a) * rad, 3.0 + p * 1.6, Math.cos(a) * rad);
      camera.lookAt(0, 2.2 + p * 1.0, 0);
    }
  });

  return (
    <group>
      <primitive object={root} />
      <pointLight ref={lantern} position={[0, DECK_TOP + 1.2, DHZ - 0.3]} color="#ffb861" distance={7} intensity={0} />
    </group>
  );
}

/* ---- Lush tropical surroundings ---------------------------------- */
const TREE_HUES = ["#3f5a2c", "#4c6a33", "#37502a", "#597c3c", "#2f471f"];

function makeGroundTex(base: string, spots: string[], blades: boolean) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 260; i++) {
    ctx.fillStyle = spots[i % spots.length];
    ctx.globalAlpha = 0.25 + Math.random() * 0.4;
    const r = 3 + Math.random() * 16;
    ctx.beginPath();
    ctx.ellipse(Math.random() * 256, Math.random() * 256, r, r * (0.5 + Math.random()), Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  if (blades) {
    ctx.globalAlpha = 0.35;
    for (let i = 0; i < 700; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      ctx.strokeStyle = Math.random() > 0.5 ? "#5c7a34" : "#87a24e";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - 0.5) * 3, y - 3 - Math.random() * 4);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/* A layered broadleaf tree with smooth, colour-varied canopy. */
function Broadleaf({ position, h, r, hue }: { position: [number, number, number]; h: number; r: number; hue: string }) {
  const blobs = useMemo(() => {
    const col = new THREE.Color(hue);
    return Array.from({ length: 5 }, (_, i) => ({
      p: [(Math.random() - 0.5) * r, h + (Math.random() - 0.3) * r * 0.7, (Math.random() - 0.5) * r] as [number, number, number],
      s: r * (0.55 + Math.random() * 0.5),
      c: `#${col.clone().offsetHSL(0, (Math.random() - 0.5) * 0.05, (Math.random() - 0.5) * 0.14).getHexString()}`,
    }));
  }, [h, r, hue]);
  return (
    <group position={position}>
      <mesh position={[0, h * 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.3, h * 0.9, 6]} />
        <meshStandardMaterial color="#5b4a2f" roughness={1} />
      </mesh>
      {blobs.map((b, i) => (
        <mesh key={i} position={b.p} scale={[1, 1.15, 1]} castShadow>
          <icosahedronGeometry args={[b.s, 2]} />
          <meshStandardMaterial color={b.c} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

/* A palm: tapered trunk + a drooping crown of fronds. */
function Palm({ position, h, tilt }: { position: [number, number, number]; h: number; tilt: number }) {
  const fronds = useMemo(() => Array.from({ length: 10 }, (_, i) => ({ a: (i / 10) * Math.PI * 2, droop: 0.5 + (i % 3) * 0.18, len: 1.8 + (i % 4) * 0.35 })), []);
  return (
    <group position={position} rotation={[0, position[0], tilt]}>
      <mesh position={[0, h / 2, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.2, h, 7]} />
        <meshStandardMaterial color="#7a6237" roughness={1} />
      </mesh>
      <group position={[0, h, 0]}>
        {fronds.map((f, i) => (
          <group key={i} rotation={[0, f.a, f.droop]}>
            <mesh position={[f.len / 2, 0, 0]} rotation={[0, 0, -0.1]} scale={[1, 0.12, 1]} castShadow>
              <coneGeometry args={[0.34, f.len, 5]} />
              <meshStandardMaterial color="#4a6a2c" roughness={0.9} side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}
        <mesh castShadow>
          <sphereGeometry args={[0.24, 8, 8]} />
          <meshStandardMaterial color="#6a5a30" roughness={1} />
        </mesh>
      </group>
    </group>
  );
}

/* A cluster of big banana-like leaves fanning up from the ground. */
function LeafPlant({ position, s, hue }: { position: [number, number, number]; s: number; hue: string }) {
  const leaves = useMemo(() => Array.from({ length: 7 }, (_, i) => ({ a: (i / 7) * Math.PI * 2 + Math.random(), lean: 0.5 + Math.random() * 0.5, sc: s * (0.7 + Math.random() * 0.6) })), [s]);
  return (
    <group position={position}>
      {leaves.map((l, i) => (
        <group key={i} rotation={[0, l.a, l.lean]}>
          <mesh position={[0, l.sc * 0.6, 0]} scale={[0.34, l.sc, 0.02]} castShadow>
            <sphereGeometry args={[1, 6, 8]} />
            <meshStandardMaterial color={hue} roughness={0.85} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Scenery() {
  const grass = useMemo(() => makeGroundTex("#5f7a3a", ["#516b30", "#6f8a46", "#455c28", "#7d9850"], true), []);
  const dirt = useMemo(() => makeGroundTex("#b0996d", ["#9d855a", "#c2ac7f", "#8a7448"], false), []);
  useMemo(() => {
    grass.repeat.set(18, 18);
    dirt.repeat.set(3, 3);
  }, [grass, dirt]);

  const trees = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => {
        const ang = (i / 40) * Math.PI * 2 + (i % 4) * 0.25;
        const dist = 17 + (i % 6) * 2.8;
        return { x: Math.cos(ang) * dist, z: Math.sin(ang) * dist, h: 6 + (i % 5) * 1.7, r: 2.6 + (i % 4) * 0.8, hue: TREE_HUES[i % TREE_HUES.length] };
      }),
    []
  );
  // a few large trees close in, framing the plot
  const framers = useMemo(
    () => [
      { x: -9, z: 7, h: 9, r: 3.6, hue: TREE_HUES[2] },
      { x: 11, z: 4, h: 10, r: 3.9, hue: TREE_HUES[0] },
      { x: 8, z: -9, h: 8.5, r: 3.3, hue: TREE_HUES[1] },
    ],
    []
  );
  const palms = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => {
        const ang = i * 1.9;
        const dist = 8 + (i % 5) * 2.2;
        return { x: Math.cos(ang) * dist, z: Math.sin(ang) * dist, h: 4.5 + (i % 4) * 1.6, tilt: (i % 2 ? 1 : -1) * (0.05 + (i % 3) * 0.04) };
      }),
    []
  );
  const plants = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const ang = i * 2.4;
        const dist = 5.6 + (i % 6) * 0.7;
        return { x: Math.cos(ang) * dist, z: Math.sin(ang) * dist, s: 0.8 + (i % 4) * 0.35, hue: ["#436a2a", "#57832f", "#345423"][i % 3] };
      }),
    []
  );
  const rocks = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const ang = i * 1.3;
        const dist = 5.5 + (i % 5) * 0.8;
        return { x: Math.cos(ang) * dist, z: Math.sin(ang) * dist, s: 0.2 + (i % 3) * 0.16, rot: i };
      }),
    []
  );

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[80, 64]} />
        <meshStandardMaterial map={grass} color="#8ea866" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} receiveShadow>
        <circleGeometry args={[6.2, 48]} />
        <meshStandardMaterial map={dirt} color="#c9b487" roughness={1} />
      </mesh>
      {trees.map((t, i) => (
        <Broadleaf key={`t${i}`} position={[t.x, 0, t.z]} h={t.h} r={t.r} hue={t.hue} />
      ))}
      {framers.map((t, i) => (
        <Broadleaf key={`f${i}`} position={[t.x, 0, t.z]} h={t.h} r={t.r} hue={t.hue} />
      ))}
      {palms.map((p, i) => (
        <Palm key={`p${i}`} position={[p.x, 0, p.z]} h={p.h} tilt={p.tilt} />
      ))}
      {plants.map((p, i) => (
        <LeafPlant key={`l${i}`} position={[p.x, 0, p.z]} s={p.s} hue={p.hue} />
      ))}
      {rocks.map((r, i) => (
        <mesh key={`r${i}`} position={[r.x, r.s * 0.4, r.z]} rotation={[r.rot, r.rot * 1.3, 0]} scale={[1, 0.7, 1]} castShadow receiveShadow>
          <dodecahedronGeometry args={[r.s, 0]} />
          <meshStandardMaterial color="#8b8377" roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

/* ---- Public canvas ----------------------------------------------- */
export default function RaiseSceneCanvas({ progressRef, reduced }: { progressRef: MutableRefObject<number>; reduced: boolean }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      camera={{ position: [9, 4.5, 11], fov: 34, near: 0.1, far: 200 }}
      className="absolute inset-0"
      onCreated={({ gl }) => gl.setClearColor("#cfe2ec")}
    >
      <fog attach="fog" args={["#dceaf0", 34, 90]} />
      <Sky distance={450000} sunPosition={SUN} turbidity={5} rayleigh={1.6} mieCoefficient={0.006} mieDirectionalG={0.85} inclination={0.52} azimuth={0.25} />
      <hemisphereLight args={["#dcecff", "#4a5a2e", 0.6]} />
      <ambientLight intensity={0.18} />
      <directionalLight
        position={SUN}
        intensity={2.2}
        color="#ffe6b8"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={3} color="#fff1d6" position={[8, 9, 6]} scale={[10, 10, 1]} target={[0, 3, 0]} />
        <Lightformer form="rect" intensity={0.9} color="#cfe0ff" position={[-8, 8, -4]} scale={[12, 12, 1]} target={[0, 3, 0]} />
        <Lightformer form="ring" intensity={0.5} color="#88a066" position={[0, 1, 10]} scale={[16, 4, 1]} target={[0, 2, 0]} />
      </Environment>
      <Scenery />
      <ContactShadows position={[0, 0.02, 0]} scale={20} far={6} blur={2.4} opacity={0.5} color="#3a2f1a" resolution={1024} />
      <BambooHouse progressRef={progressRef} reduced={reduced} />
    </Canvas>
  );
}

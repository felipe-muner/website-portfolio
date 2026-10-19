"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* The pour, as a pure function of time                                */
/* ------------------------------------------------------------------ */

const BEANS = 48;
const FIRST_DROP = 0.15;
const DROP_EVERY = 0.085;
const GRAVITY = 7.5;
/** How long a bean's share of coffee takes to blend in once it lands. */
const MELT = 0.26;
/** Crema and latte art bloom in after the last bean melts. */
const ART_IN = 1.5;

/** Liquid surface height, empty and full. */
const LEVEL_EMPTY = 0.1;
const LEVEL_FULL = 0.66;
/** The cup's inner floor (see CUP). */
const CUP_FLOOR = 0.095;

/** Seeded PRNG (mulberry32) — the same pour every time. */
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

/* Cup profile (radius, height): outer wall up, over the rim, inner wall down. */
const CUP: [number, number][] = [
  [0, 0],
  [0.25, 0],
  [0.29, 0.015],
  [0.3, 0.05],
  [0.34, 0.1],
  [0.42, 0.22],
  [0.475, 0.38],
  [0.505, 0.55],
  [0.522, 0.7],
  [0.528, 0.775],
  [0.516, 0.795],
  [0.498, 0.79],
  [0.492, 0.75],
  [0.478, 0.62],
  [0.452, 0.47],
  [0.41, 0.33],
  [0.35, 0.21],
  [0.27, 0.13],
  [0.15, 0.1],
  [0, 0.095],
];
/** The inner wall, bottom to rim, for the liquid's radius at any height. */
const INNER = CUP.slice(11)
  .reverse()
  .map(([r, y]) => ({ r, y }));

function innerRadius(y: number): number {
  if (y <= INNER[0].y) return INNER[0].r;
  for (let i = 1; i < INNER.length; i++) {
    const a = INNER[i - 1];
    const b = INNER[i];
    if (y <= b.y) return a.r + ((b.r - a.r) * (y - a.y)) / (b.y - a.y);
  }
  return INNER[INNER.length - 1].r;
}

/* Saucer profile: underside out to the rim, then the top back to the centre.
   Lathe faces point to the right of the direction of travel, so this order
   makes the top face up and the underside face down. */
const SAUCER: [number, number][] = [
  [0, 0],
  [0.36, 0.004],
  [0.79, 0.06],
  [0.82, 0.094],
  [0.8, 0.098],
  [0.72, 0.066],
  [0.34, 0.032],
  [0.3, 0.02],
  [0, 0.02],
];

interface Bean {
  t0: number;
  x: number;
  z: number;
  y0: number;
  vx: number;
  vz: number;
  axis: THREE.Vector3;
  spin: number;
  scale: number;
  /** When it reaches the surface, and how high the surface is then. */
  impact: number;
  landAt: number;
}

/** Schedule every bean: when it drops, where it lands, when it melts. */
function plan(): Bean[] {
  const r = rng(7);
  const beans: Bean[] = [];
  for (let i = 0; i < BEANS; i++) {
    const t0 = FIRST_DROP + i * DROP_EVERY + (r() - 0.5) * 0.06;
    // The surface has risen by however many beans melted before this one.
    const landAt = LEVEL_EMPTY + ((LEVEL_FULL - LEVEL_EMPTY) * i) / BEANS;
    const reach = innerRadius(landAt) * 0.62;
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * reach;
    // Above the top of the frame on every layout, so beans shower in already moving.
    const y0 = 4.0 + r() * 0.6;
    const fall = Math.sqrt((2 * (y0 - landAt - 0.03)) / GRAVITY);
    const drift = 0.08;
    beans.push({
      t0,
      x: Math.cos(a) * d - drift * (r() - 0.5) * fall,
      z: Math.sin(a) * d - drift * (r() - 0.5) * fall,
      y0,
      vx: drift * (r() - 0.5),
      vz: drift * (r() - 0.5),
      axis: new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize(),
      spin: 4 + r() * 6,
      scale: 0.9 + r() * 0.25,
      impact: t0 + fall,
      landAt,
    });
  }
  return beans;
}

/** How far the cup has filled at time t (each bean adds its share as it melts). */
function fillAt(beans: Bean[], t: number): number {
  let melted = 0;
  for (const b of beans) melted += Math.min(1, Math.max(0, (t - b.impact) / MELT));
  return melted / BEANS;
}

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

/** Glazed stoneware: cream with fine iron speckles. */
function ceramicTexture() {
  const r = rng(3);
  const { c, ctx } = canvas(1024, 512);
  ctx.fillStyle = "#f2ebe0";
  ctx.fillRect(0, 0, 1024, 512);
  for (let i = 0; i < 2600; i++) {
    ctx.fillStyle = `rgba(${90 + r() * 40},${60 + r() * 30},${40 + r() * 20},${0.25 + r() * 0.5})`;
    const s = 0.6 + r() * 1.6;
    ctx.beginPath();
    ctx.arc(r() * 1024, r() * 512, s, 0, Math.PI * 2);
    ctx.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Crema with a poured heart — sampled raw by the liquid shader. */
function latteArtTexture() {
  const S = 512;
  const { c, ctx } = canvas(S, S);
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, "#c98b52");
  g.addColorStop(0.7, "#a8642f");
  g.addColorStop(0.93, "#7a421d");
  g.addColorStop(1, "#5e3015");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  // Mottled crema.
  const r = rng(11);
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = `rgba(${230 + r() * 25},${180 + r() * 40},${120 + r() * 40},${0.05 + r() * 0.08})`;
    ctx.beginPath();
    ctx.arc(r() * S, r() * S, 2 + r() * 10, 0, Math.PI * 2);
    ctx.fill();
  }
  // The heart, with the pull-through line.
  ctx.save();
  ctx.translate(S / 2, S * 0.52);
  ctx.fillStyle = "#f6ecdc";
  ctx.shadowColor = "rgba(246,236,220,0.7)";
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.moveTo(0, 120);
  ctx.bezierCurveTo(-30, 80, -150, 20, -140, -55);
  ctx.bezierCurveTo(-130, -125, -40, -135, 0, -70);
  ctx.bezierCurveTo(40, -135, 130, -125, 140, -55);
  ctx.bezierCurveTo(150, 20, 30, 80, 0, 120);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#b8773f";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(0, -150);
  ctx.quadraticCurveTo(6, -10, 0, 128);
  ctx.stroke();
  ctx.restore();
  return new THREE.CanvasTexture(c);
}

/** Dark walnut tabletop, plus a radial mask that fades it into the page. */
function tableTextures() {
  const r = rng(5);
  const wood = canvas(1024, 1024);
  wood.ctx.fillStyle = "#2b1a10";
  wood.ctx.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 260; i++) {
    const y = r() * 1024;
    wood.ctx.strokeStyle = `rgba(${r() < 0.5 ? "16,9,5" : "70,44,26"},${0.15 + r() * 0.3})`;
    wood.ctx.lineWidth = 1 + r() * 3;
    wood.ctx.beginPath();
    wood.ctx.moveTo(0, y);
    for (let x = 0; x <= 1024; x += 64) wood.ctx.lineTo(x, y + Math.sin(x * 0.01 + i) * 6 + (r() - 0.5) * 3);
    wood.ctx.stroke();
  }
  const map = new THREE.CanvasTexture(wood.c);
  map.colorSpace = THREE.SRGBColorSpace;
  const mask = canvas(512, 512);
  const g = mask.ctx.createRadialGradient(256, 256, 20, 256, 256, 256);
  g.addColorStop(0, "#fff");
  g.addColorStop(0.5, "#777");
  g.addColorStop(1, "#000");
  mask.ctx.fillStyle = g;
  mask.ctx.fillRect(0, 0, 512, 512);
  return { map, alphaMap: new THREE.CanvasTexture(mask.c) };
}

function blobTexture(inner: string) {
  const { c, ctx } = canvas(256, 256);
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, inner);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

/* ------------------------------------------------------------------ */
/* Geometry                                                            */
/* ------------------------------------------------------------------ */

/** A roasted coffee bean: a flattened ellipsoid with a groove down its flat face. */
function beanGeometry() {
  const g = new THREE.SphereGeometry(1, 28, 20);
  const p = g.attributes.position;
  const colors = new Float32Array(p.count * 3);
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    let { x, y, z } = v;
    x *= 0.05;
    z *= 0.068;
    y *= y < 0 ? 0.022 : 0.036; // flat face down, domed back up
    // The groove: an S-curve pressed into the flat face.
    const curve = 0.006 * Math.sin(z * 55);
    const groove = Math.exp(-((x - curve) ** 2) / 0.00005);
    if (y < 0) y += groove * 0.016;
    p.setXYZ(i, x, y, z);
    const shade = 1 - groove * (y < 0.004 ? 0.7 : 0);
    colors.set([shade, shade, shade], i * 3);
  }
  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}

/* ------------------------------------------------------------------ */
/* Shaders                                                             */
/* ------------------------------------------------------------------ */

const RIPPLES = 8;

const LIQUID_VERTEX = /* glsl */ `
  varying vec2 vDisc;
  void main() {
    vDisc = position.xy; // the unit disc, before scaling to the cup
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const LIQUID_FRAGMENT = /* glsl */ `
  uniform sampler2D uArt;
  uniform float uArtMix;
  uniform vec4 uRipples[${RIPPLES}];
  varying vec2 vDisc;

  void main() {
    vec2 grad = vec2(0.0);
    for (int i = 0; i < ${RIPPLES}; i++) {
      vec4 r = uRipples[i];
      if (r.w <= 0.0) continue;
      vec2 d = vDisc - r.xy;
      float dist = length(d);
      float env = exp(-dist * 3.0) * exp(-r.z * 2.2) * r.w * 1.6;
      grad += normalize(d + 1e-4) * cos(dist * 42.0 - r.z * 16.0) * env;
    }
    vec3 n = normalize(vec3(-grad.x * 0.6, 1.0, -grad.y * 0.6));

    float edge = length(vDisc);
    vec3 coffee = mix(vec3(0.17, 0.085, 0.035), vec3(0.42, 0.24, 0.11), smoothstep(0.5, 1.0, edge));
    vec3 art = texture2D(uArt, vDisc * 0.5 + 0.5).rgb;
    vec3 base = mix(coffee, art, uArtMix);

    vec3 L = normalize(vec3(-0.5, 1.0, 0.6));
    vec3 V = normalize(vec3(0.0, 0.9, 1.0));
    float diff = 0.62 + 0.38 * max(dot(n, L), 0.0);
    float spec = pow(max(dot(n, normalize(L + V)), 0.0), 60.0) * 0.7;
    // A thin bright meniscus where the coffee meets the cup.
    float meniscus = smoothstep(0.9, 1.0, edge) * 0.12;
    gl_FragColor = vec4(base * diff + spec + meniscus, 1.0);
  }
`;

const STEAM_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const STEAM_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uSeed;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  void main() {
    vec2 uv = vUv;
    float sway = sin(uv.y * 5.0 + uTime * 0.9 + uSeed) * 0.12 * uv.y;
    float x = uv.x - 0.5 - sway;
    float n = noise(vec2(x * 4.0 + uSeed, uv.y * 3.0 - uTime * 0.55));
    n += 0.5 * noise(vec2(x * 9.0, uv.y * 6.0 - uTime * 0.9 + uSeed));
    float column = smoothstep(0.28, 0.0, abs(x)) ;
    float fade = smoothstep(0.0, 0.18, uv.y) * smoothstep(1.0, 0.45, uv.y);
    float a = smoothstep(0.55, 1.15, n) * column * fade * uOpacity;
    gl_FragColor = vec4(vec3(1.0, 0.97, 0.93), a * 0.42);
  }
`;

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

type LiquidUniforms = {
  uArt: THREE.IUniform<THREE.Texture>;
  uArtMix: THREE.IUniform<number>;
  uRipples: THREE.IUniform<THREE.Vector4[]>;
};

type SteamUniforms = {
  uTime: THREE.IUniform<number>;
  uOpacity: THREE.IUniform<number>;
  uSeed: THREE.IUniform<number>;
};

function Coffee({ reduced, pour }: { reduced: boolean; pour: number }) {
  const assets = useMemo(() => {
    const beans = plan();
    const handle = new THREE.CatmullRomCurve3(
      [
        [0.49, 0.6],
        [0.68, 0.64],
        [0.77, 0.47],
        [0.66, 0.27],
        [0.44, 0.24],
      ].map(([x, y]) => new THREE.Vector3(x, y, 0)),
    );
    return {
      beans,
      lastImpact: Math.max(...beans.map((b) => b.impact)),
      cup: new THREE.LatheGeometry(CUP.map(([x, y]) => new THREE.Vector2(x, y)), 96),
      saucer: new THREE.LatheGeometry(SAUCER.map(([x, y]) => new THREE.Vector2(x, y)), 96),
      handle: new THREE.TubeGeometry(handle, 64, 0.042, 16, false),
      bean: beanGeometry(),
      ceramic: ceramicTexture(),
      art: latteArtTexture(),
      table: tableTextures(),
      shadow: blobTexture("rgba(0,0,0,0.9)"),
    };
  }, []);

  useEffect(
    () => () => {
      for (const d of [assets.cup, assets.saucer, assets.handle, assets.bean, assets.ceramic, assets.art, assets.table.map, assets.table.alphaMap, assets.shadow])
        d.dispose();
    },
    [assets],
  );

  const liquidUniforms = useMemo<LiquidUniforms>(
    () => ({
      uArt: { value: assets.art },
      uArtMix: { value: 0 },
      uRipples: { value: Array.from({ length: RIPPLES }, () => new THREE.Vector4()) },
    }),
    [assets],
  );
  const steamUniforms = useMemo<SteamUniforms[]>(
    () => [0, 1, 2].map((i) => ({ uTime: { value: 0 }, uOpacity: { value: 0 }, uSeed: { value: i * 3.7 } })),
    [],
  );

  const cupGroup = useRef<THREE.Group>(null);
  const beansMesh = useRef<THREE.InstancedMesh>(null);
  const liquid = useRef<THREE.Mesh>(null);
  const liquidMat = useRef<THREE.ShaderMaterial>(null);
  const steam = useRef<THREE.Group>(null);
  // Our own clock (R3F resets its clock whenever the frameloop toggles).
  const clock = useRef({ t: 0, pour, pointerX: 0, pointerY: 0, sway: 0 });
  const scratch = useRef({
    m: new THREE.Matrix4(),
    stretch: new THREE.Matrix4(),
    q: new THREE.Quaternion(),
    p: new THREE.Vector3(),
    s: new THREE.Vector3(),
    origin: new THREE.Vector3(),
  });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      clock.current.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      clock.current.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    const c = clock.current;
    const group = cupGroup.current;
    const mesh = beansMesh.current;
    const surface = liquid.current;
    const mat = liquidMat.current;
    const steamGroup = steam.current;
    if (!group || !mesh || !surface || !mat || !steamGroup) return;

    if (c.pour !== pour) {
      c.pour = pour; // "pour again": start the beans over
      c.t = 0;
    }
    c.t += Math.min(delta, 0.1);
    const t = reduced ? 1000 : c.t;
    const { beans, lastImpact } = assets;

    // Beans: fall, stretch into a drop just before they land, then dive into the coffee.
    const { m, stretch: stretchM, q, p, s, origin } = scratch.current;
    const level = LEVEL_EMPTY + (LEVEL_FULL - LEVEL_EMPTY) * fillAt(beans, t);
    const ripples: THREE.Vector4[] = [];
    beans.forEach((b, i) => {
      const fall = b.impact - b.t0;
      let size = b.scale;
      let stretch = 1;
      if (t < b.t0) {
        // Not dropped yet: nothing waits in view — every bean arrives already falling.
        size = 0;
      } else if (t < b.impact) {
        const dt = t - b.t0;
        p.set(b.x + b.vx * dt, b.y0 - 0.5 * GRAVITY * dt * dt, b.z + b.vz * dt);
        q.setFromAxisAngle(b.axis, dt * b.spin);
        stretch = 1 + 0.9 * Math.max(0, 1 - (b.impact - t) / 0.16);
      } else {
        // Under the surface it slows and is gone within a third of a second;
        // the first few, with barely any coffee yet, melt into the puddle.
        const age = t - b.impact;
        const room = Math.max(0, level - (CUP_FLOOR + 0.03));
        const dive = Math.min(room + 0.02, 0.2 * (1 - Math.exp(-age * 11)));
        p.set(b.x + b.vx * fall, b.landAt - dive, b.z + b.vz * fall);
        q.setFromAxisAngle(b.axis, fall * b.spin);
        size *= Math.pow(Math.max(0, 1 - age / 0.32), 1.3);
        stretch = 1 + 0.9 * Math.exp(-age * 10);
        if (age < 1.3) {
          const radius = innerRadius(b.landAt);
          ripples.push(new THREE.Vector4(p.x / radius, -p.z / radius, age, 1 - age / 1.3));
        }
      }
      // Stretched along the fall (world vertical), like a drop, whatever way the bean is tumbling.
      m.compose(origin, q, s.setScalar(size));
      m.premultiply(stretchM.makeScale(1 / Math.sqrt(stretch), stretch, 1 / Math.sqrt(stretch)));
      m.setPosition(p);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;

    // Coffee surface: level and radius follow the cup's inner wall.
    const radius = innerRadius(level) - 0.004;
    surface.position.y = level;
    surface.scale.set(radius, radius, 1);
    surface.visible = level > LEVEL_EMPTY + 0.005;
    const art = Math.min(1, Math.max(0, (t - lastImpact - 0.3) / ART_IN));
    const u = mat.uniforms as LiquidUniforms;
    u.uArtMix.value = art * art * (3 - 2 * art);
    const slots = u.uRipples.value;
    ripples.sort((a, b) => a.z - b.z);
    slots.forEach((v, i) => (ripples[i] ? v.copy(ripples[i]) : v.set(0, 0, 0, 0)));

    // Steam rises once the cup is full.
    const steamOn = Math.min(1, Math.max(0, (t - lastImpact) / 2.2));
    steamGroup.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.ShaderMaterial) {
        const su = child.material.uniforms as SteamUniforms;
        su.uTime.value = c.t + i * 1.3;
        su.uOpacity.value = steamOn;
      }
    });

    // The cup turns gently and leans toward the cursor.
    c.sway += Math.min(delta, 0.1);
    const yaw = reduced ? -0.35 : -0.35 + Math.sin(c.sway * 0.3) * 0.12 + c.pointerX * 0.18;
    group.rotation.y += (yaw - group.rotation.y) * Math.min(1, delta * 3);
    group.rotation.x += ((reduced ? 0 : c.pointerY * 0.05) - group.rotation.x) * Math.min(1, delta * 3);
  });

  return (
    <group>
      {/* Table */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9, 9]} />
        <meshStandardMaterial map={assets.table.map} alphaMap={assets.table.alphaMap} transparent roughness={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[2.2, 2.2]} />
        <meshBasicMaterial map={assets.shadow} transparent depthWrite={false} />
      </mesh>

      <group ref={cupGroup}>
        <mesh geometry={assets.saucer}>
          <meshPhysicalMaterial map={assets.ceramic} roughness={0.3} clearcoat={1} clearcoatRoughness={0.12} />
        </mesh>
        <group position={[0, 0.02, 0]}>
          <mesh geometry={assets.cup}>
            <meshPhysicalMaterial map={assets.ceramic} roughness={0.28} clearcoat={1} clearcoatRoughness={0.1} side={THREE.DoubleSide} />
          </mesh>
          <mesh geometry={assets.handle}>
            <meshPhysicalMaterial map={assets.ceramic} roughness={0.28} clearcoat={1} clearcoatRoughness={0.1} />
          </mesh>
          <mesh ref={liquid} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1, 64]} />
            <shaderMaterial ref={liquidMat} uniforms={liquidUniforms} vertexShader={LIQUID_VERTEX} fragmentShader={LIQUID_FRAGMENT} />
          </mesh>
          <instancedMesh ref={beansMesh} args={[assets.bean, undefined, BEANS]} frustumCulled={false}>
            <meshStandardMaterial color="#3d2215" vertexColors roughness={0.38} metalness={0.06} envMapIntensity={1.2} />
          </instancedMesh>
          <group ref={steam} position={[0, 0.78, 0]}>
            {steamUniforms.map((u, i) => (
              <mesh key={i} position={[(i - 1) * 0.16, 0.55, (i - 1) * 0.05]} rotation={[0, (i - 1) * 0.5, 0]}>
                <planeGeometry args={[0.6, 1.1]} />
                <shaderMaterial
                  uniforms={u}
                  vertexShader={STEAM_VERTEX}
                  fragmentShader={STEAM_FRAGMENT}
                  transparent
                  depthWrite={false}
                  side={THREE.DoubleSide}
                />
              </mesh>
            ))}
          </group>
        </group>
      </group>

    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.22} />
      <directionalLight position={[-2.5, 4, 2.5]} intensity={2.4} color="#ffe6c8" />
      <pointLight position={[1.8, 1.4, -1.6]} intensity={14} color="#ff9a52" />
      <pointLight position={[-1.6, 0.9, -1.4]} intensity={6} color="#ffd2a1" />
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2.4} position={[0, 5, 1]} rotation={[Math.PI / 2, 0, 0]} scale={[5, 3, 1]} />
        <Lightformer intensity={3} position={[-4, 1.6, 1.5]} rotation={[0, Math.PI / 2, 0]} scale={[1.4, 4, 1]} color="#ffe2bf" />
        <Lightformer intensity={1.4} position={[4, 1.2, 1]} rotation={[0, -Math.PI / 2, 0]} scale={[1, 3, 1]} />
      </Environment>
    </>
  );
}

/** Places the cup right of the copy on wide screens, centred otherwise. */
function Stage({ reduced, pour }: { reduced: boolean; pour: number }) {
  const viewport = useThree((s) => s.viewport);
  const width = useThree((s) => s.size.width);
  const wide = width >= 1024;
  const fit = Math.min(viewport.width / (wide ? 5.8 : 2.9), viewport.height / 3.3, 0.9);
  return (
    <group position={[wide ? viewport.width * (width >= 1280 ? 0.2 : 0.22) : 0, -0.32, 0]} scale={fit}>
      <Lights />
      <Coffee reduced={reduced} pour={pour} />
    </group>
  );
}

/**
 * Bean & Bowl — the hero cup: roasted beans tumble in, stretch into drops
 * and melt into coffee, filling the cup until the crema blooms into a latte
 * heart and steam rises. Bump `pour` to pour again. Client-only.
 */
export default function CoffeeScene({ active, reduced, pour }: { active: boolean; reduced: boolean; pour: number }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 30, position: [0, 2.05, 4.4], near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ camera }) => camera.lookAt(0, 0.4, 0)}
      style={{ pointerEvents: "none" }}
    >
      <Stage reduced={reduced} pour={pour} />
    </Canvas>
  );
}

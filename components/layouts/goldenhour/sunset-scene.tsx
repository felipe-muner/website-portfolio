"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { clampHour, daylight, sunDirection, type Daylight } from "./daylight";
import { SKY_FRAGMENT, SKY_VERTEX, paintSky, skyUniforms, tint } from "./sky";
import { WATER_FRAGMENT, WATER_VERTEX, chopTexture, paintWater, rng, waterUniforms } from "./water";

/** Camera, in scene units (a day bed is about 1.9 long). */
const CAM = new THREE.Vector3(0, 1.45, 7.5);
const LOOK = new THREE.Vector3(0, 1.2, 0);
/** The foreground stands at the deck's far (infinity) edge, so the beds read against the sea. */
const FORE_Z = -0.8;

const LANTERNS = 16;

/* ------------------------------------------------------------------ */
/* Lanterns — paper lights let go from the sand after dark             */
/* ------------------------------------------------------------------ */

const LANTERN_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSeed;
  varying float vAlpha;

  void main() {
    float s = aSeed * 6.2831;
    vec3 p = position;
    float rise = mod(uTime * (0.09 + aSeed * 0.06) + aSeed * 9.0, 7.5);
    p.y += rise;
    p.x += sin(uTime * 0.2 + s) * 0.4 + rise * 0.3 * (aSeed - 0.5);
    p.z += cos(uTime * 0.17 + s) * 0.3;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float fadeIn = smoothstep(0.0, 0.5, rise);
    float fadeOut = 1.0 - smoothstep(5.2, 7.5, rise);
    vAlpha = fadeIn * fadeOut * (0.78 + 0.22 * sin(uTime * (2.0 + aSeed * 3.0) + s));
    gl_PointSize = (30.0 + aSeed * 22.0) * uPixelRatio / -mv.z;
  }
`;

const LANTERN_FRAGMENT = /* glsl */ `
  uniform float uNight;
  varying float vAlpha;

  void main() {
    vec2 q = gl_PointCoord - 0.5;
    float d = length(q);
    float body = smoothstep(0.15, 0.08, d);
    float glow = smoothstep(0.5, 0.08, d);
    vec3 c = vec3(1.0, 0.6, 0.26) * glow * 0.9 + vec3(1.0, 0.86, 0.62) * body * 1.6;
    gl_FragColor = vec4(c, (glow * 0.5 + body) * vAlpha * uNight);
  }
`;

type LanternUniforms = {
  uTime: THREE.IUniform<number>;
  uPixelRatio: THREE.IUniform<number>;
  uNight: THREE.IUniform<number>;
};

function paintLanterns(u: LanternUniforms, d: Daylight, time: number, pixelRatio: number) {
  u.uTime.value = time;
  u.uPixelRatio.value = pixelRatio;
  u.uNight.value = d.night;
}

function lanternBuffers() {
  const random = rng(41);
  const position = new Float32Array(LANTERNS * 3);
  const seed = new Float32Array(LANTERNS);
  for (let i = 0; i < LANTERNS; i++) {
    position.set([-3.5 + random() * 9, 0.2 + random() * 1.2, -9 + random() * 7], i * 3);
    seed[i] = random();
  }
  return { position, seed };
}

/* ------------------------------------------------------------------ */
/* Silhouettes — umbrella, day bed, side table, a palm                 */
/* ------------------------------------------------------------------ */

interface Frond {
  geometry: THREE.ShapeGeometry;
  /** Signed rotation about z (mirrored fronds turn the other way). */
  angle: number;
  yaw: number;
  side: 1 | -1;
}

/** A palm frond: a tapering, drooping leaf with a serrated edge. */
function frondShape(length: number, width: number, droop: number): THREE.Shape {
  const shape = new THREE.Shape();
  const steps = 28;
  const spine = (t: number) => ({ x: t * length, y: -droop * t * t * length });
  const half = (t: number, odd: boolean) => width * Math.pow(Math.max(0, Math.sin(Math.PI * t)), 0.55) * (odd ? 1 : 0.55);
  shape.moveTo(0, 0);
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const { x, y } = spine(t);
    shape.lineTo(x, y + half(t, i % 2 === 1));
  }
  for (let i = steps - 1; i >= 0; i--) {
    const t = i / steps;
    const { x, y } = spine(t);
    shape.lineTo(x, y - half(t, i % 2 === 0) * 0.9);
  }
  return shape;
}

function silhouetteGeometry() {
  const trunkCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -0.2, 0),
    new THREE.Vector3(0.12, 1.2, 0),
    new THREE.Vector3(0.42, 2.6, 0),
    new THREE.Vector3(0.9, 3.9, 0),
  ]);
  const random = rng(13);
  const leaves = [
    frondShape(2.3, 0.3, 0.34),
    frondShape(2.0, 0.27, 0.42),
    frondShape(2.5, 0.31, 0.28),
    frondShape(1.8, 0.25, 0.5),
  ].map((s) => new THREE.ShapeGeometry(s));
  const angles: { a: number; side: 1 | -1 }[] = [
    { a: -0.35, side: 1 },
    { a: 0.1, side: 1 },
    { a: 0.55, side: 1 },
    { a: 1.05, side: 1 },
    { a: 1.45, side: 1 },
    { a: -0.2, side: -1 },
    { a: 0.3, side: -1 },
    { a: 0.8, side: -1 },
    { a: 1.3, side: -1 },
  ];
  const fronds: Frond[] = angles.map(({ a, side }, i) => ({
    geometry: leaves[i % leaves.length],
    angle: side * a,
    yaw: (random() - 0.5) * 0.9,
    side,
  }));
  return {
    pole: new THREE.CylinderGeometry(0.03, 0.03, 2.7, 8),
    canopy: new THREE.ConeGeometry(1.25, 0.46, 12),
    finial: new THREE.SphereGeometry(0.06, 8, 8),
    bed: new THREE.BoxGeometry(1.9, 0.26, 0.9),
    leg: new THREE.BoxGeometry(0.06, 0.26, 0.06),
    back: new THREE.BoxGeometry(0.09, 0.56, 0.86),
    roll: new THREE.CylinderGeometry(0.1, 0.1, 0.84, 10),
    tableTop: new THREE.CylinderGeometry(0.24, 0.24, 0.04, 16),
    tableStem: new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8),
    glass: new THREE.CylinderGeometry(0.05, 0.04, 0.17, 8),
    deck: new THREE.PlaneGeometry(80, 14),
    trunk: new THREE.TubeGeometry(trunkCurve, 24, 0.13, 8, false),
    leaves,
    fronds,
  };
}

type Silhouettes = ReturnType<typeof silhouetteGeometry>;

function Lounger({
  geo,
  material,
  position,
  scale = 1,
}: {
  geo: Silhouettes;
  material: THREE.Material;
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh geometry={geo.pole} material={material} position={[0.45, 1.33, -0.25]} rotation={[0, 0, -0.1]} />
      <mesh geometry={geo.canopy} material={material} position={[0.6, 2.74, -0.25]} rotation={[0, 0, -0.12]} />
      <mesh geometry={geo.finial} material={material} position={[0.64, 3.0, -0.25]} />
      <mesh geometry={geo.bed} material={material} position={[0, 0.39, 0]} />
      {[
        [-0.86, -0.38],
        [0.86, -0.38],
        [-0.86, 0.38],
        [0.86, 0.38],
      ].map(([x, z]) => (
        <mesh key={`${x}:${z}`} geometry={geo.leg} material={material} position={[x, 0.13, z]} />
      ))}
      <mesh geometry={geo.back} material={material} position={[-0.84, 0.74, 0]} rotation={[0, 0, 0.42]} />
      <mesh geometry={geo.roll} material={material} position={[-0.52, 0.62, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={geo.tableTop} material={material} position={[1.4, 0.52, 0]} />
      <mesh geometry={geo.tableStem} material={material} position={[1.4, 0.26, 0]} />
      <mesh geometry={geo.glass} material={material} position={[1.4, 0.63, 0]} />
    </group>
  );
}

function Palm({ geo, material, position }: { geo: Silhouettes; material: THREE.Material; position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh geometry={geo.trunk} material={material} />
      {geo.fronds.map((f, i) => (
        <mesh
          key={i}
          geometry={f.geometry}
          material={material}
          position={[0.9, 3.9, (i % 3) * 0.03]}
          rotation={[0, f.yaw, f.angle]}
          scale={[f.side, 1, 1]}
        />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* The scene                                                           */
/* ------------------------------------------------------------------ */

function Scene({ hour, reduced }: { hour: number; reduced: boolean }) {
  const viewport = useThree((s) => s.viewport);
  const width = useThree((s) => s.size.width);
  const invalidate = useThree((s) => s.invalidate);

  // Where the foreground stands: right of the copy on wide screens, a touch right of centre otherwise.
  const wide = width >= 1024;
  const fit = Math.min(viewport.width / (wide ? 8 : 4.8), viewport.height / 5, 1.1);
  const foreX = viewport.width * (wide ? (width >= 1280 ? 0.16 : 0.18) : 0.04);

  const assets = useMemo(() => {
    const chop = chopTexture();
    return {
      chop,
      skyU: skyUniforms(),
      waterU: waterUniforms(chop),
      lanternU: { uTime: { value: 0 }, uPixelRatio: { value: 1 }, uNight: { value: 0 } } satisfies LanternUniforms,
      lanterns: lanternBuffers(),
      geo: silhouetteGeometry(),
      silhouette: new THREE.MeshBasicMaterial({ color: "#130f16", side: THREE.DoubleSide }),
    };
  }, []);

  useEffect(
    () => () => {
      const { geo } = assets;
      assets.chop.dispose();
      assets.silhouette.dispose();
      for (const g of [geo.pole, geo.canopy, geo.finial, geo.bed, geo.leg, geo.back, geo.roll, geo.tableTop, geo.tableStem, geo.glass, geo.deck, geo.trunk, ...geo.leaves]) g.dispose();
    },
    [assets],
  );

  const sky = useRef<THREE.Mesh>(null);
  const target = useRef(hour);
  const sim = useRef({ now: 0, hour, pointerX: 0, pointerY: 0 });
  const scratch = useRef({ sun: new THREE.Vector3() });

  // The hour the stage asks for; in reduced motion the canvas only draws on demand, so ask for a frame.
  useEffect(() => {
    target.current = hour;
    invalidate();
  }, [hour, invalidate]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      sim.current.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      sim.current.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ camera, gl }, delta) => {
    const dome = sky.current;
    if (!dome) return;
    const s = sim.current;
    const { skyU, waterU, lanternU, silhouette } = assets;
    const dt = reduced ? 0 : Math.min(delta, 0.1);
    s.now += dt;

    // Ease toward the asked-for hour (snap when motion is reduced).
    const want = clampHour(target.current);
    s.hour = reduced ? want : s.hour + (want - s.hour) * (1 - Math.exp(-dt * 5));
    const d = daylight(s.hour);
    const [sx, sy, sz] = sunDirection(d);
    const sun = scratch.current.sun.set(sx, sy, sz);

    paintSky(skyU, d, sun, s.now);
    paintWater(waterU, d, sun, s.now);
    tint(silhouette.color, d.silhouette);
    paintLanterns(lanternU, d, s.now, gl.getPixelRatio());

    // A slow drift toward the cursor.
    const k = 1 - Math.exp(-(reduced ? 60 : dt) * 2.2);
    camera.position.x += (CAM.x + s.pointerX * 0.3 - camera.position.x) * k;
    camera.position.y += (CAM.y - s.pointerY * 0.1 - camera.position.y) * k;
    camera.position.z = CAM.z;
    camera.lookAt(LOOK);
    dome.position.copy(camera.position);
  });

  return (
    <>
      <mesh ref={sky} frustumCulled={false} renderOrder={-100}>
        <sphereGeometry args={[60, 48, 24]} />
        <shaderMaterial
          side={THREE.BackSide}
          depthTest={false}
          depthWrite={false}
          uniforms={assets.skyU}
          vertexShader={SKY_VERTEX}
          fragmentShader={SKY_FRAGMENT}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -120]}>
        <planeGeometry args={[1000, 1000]} />
        <shaderMaterial uniforms={assets.waterU} vertexShader={WATER_VERTEX} fragmentShader={WATER_FRAGMENT} />
      </mesh>

      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[assets.lanterns.position, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[assets.lanterns.seed, 1]} />
        </bufferGeometry>
        <shaderMaterial
          uniforms={assets.lanternU}
          vertexShader={LANTERN_VERTEX}
          fragmentShader={LANTERN_FRAGMENT}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* The deck: a dark apron the beds stand on, its far edge the pool's infinity lip. */}
      <mesh geometry={assets.geo.deck} material={assets.silhouette} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 5.5]} />

      <group position={[foreX, 0, FORE_Z]} scale={fit}>
        <Lounger geo={assets.geo} material={assets.silhouette} position={[0, 0, 0]} />
        <Lounger geo={assets.geo} material={assets.silhouette} position={[-2.6, 0, 0.5]} scale={0.85} />
        <Palm geo={assets.geo} material={assets.silhouette} position={[2.6, 0, 1.0]} />
      </group>
    </>
  );
}

/**
 * Golden Hour — the hero: a west-coast sunset you drag through the day.
 * `hour` (12–22, Bangkok time) sets the sun on its arc, the sky from noon
 * white-blue through amber and magenta to indigo and stars, the sea's colour
 * and its glitter path, and after dark a few lanterns drift up off the sand.
 * The foreground — umbrella, day beds, a palm — stays in silhouette.
 * Client-only — load it with next/dynamic.
 */
export default function SunsetScene({ active, reduced, hour }: { active: boolean; reduced: boolean; hour: number }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={active ? (reduced ? "demand" : "always") : "never"}
      camera={{ fov: 34, position: CAM.toArray(), near: 0.1, far: 1500 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ camera }) => camera.lookAt(LOOK)}
      style={{ pointerEvents: "none" }}
    >
      <Scene hour={hour} reduced={reduced} />
    </Canvas>
  );
}

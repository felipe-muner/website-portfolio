"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, SpotLight } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* Timeline — one loop: hang, drop, slam, rest, lift                   */
/* ------------------------------------------------------------------ */

/** Height of the bell's base while it hangs. */
const HANG = 0.95;
const CYCLE = 7.4;
const T_DROP = 3.6;
const FALL = 0.42;
const T_IMPACT = T_DROP + FALL;
const T_LIFT = T_IMPACT + 1.2;
const LIFT = 2.1;
/** Start part-way in, so the first slam lands about two seconds after load. */
const START = 1.6;

const DUST =
  typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches ? 1500 : 800;

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/** Height of the bell's base at `t` seconds into the loop. */
function heightAt(t: number): number {
  if (t < T_DROP) return HANG + Math.sin(t * 1.6) * 0.02;
  if (t < T_IMPACT) {
    const p = (t - T_DROP) / FALL;
    return HANG * (1 - p * p);
  }
  if (t < T_LIFT) return 0;
  if (t < T_LIFT + LIFT) return HANG * easeInOut((t - T_LIFT) / LIFT);
  return HANG + Math.sin(t * 1.6) * 0.02;
}

/* ------------------------------------------------------------------ */
/* Procedural textures                                                 */
/* ------------------------------------------------------------------ */

/** Seeded PRNG (mulberry32), so the iron and chalk look the same every visit. */
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
const random = rng(16);

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable");
  return { c, ctx };
}

/** Speckle noise: `n` tiny dots of random grey within [lo, hi]. */
function speckle(ctx: CanvasRenderingContext2D, w: number, h: number, n: number, lo: number, hi: number) {
  for (let i = 0; i < n; i++) {
    const v = Math.round(lo + random() * (hi - lo));
    ctx.fillStyle = `rgba(${v},${v},${v},${0.35 + random() * 0.5})`;
    const s = 1 + random() * 2.5;
    ctx.fillRect(random() * w, random() * h, s, s);
  }
}

/** Cast-iron body: colour (with a painted "16 KG") and a matching roughness map. */
function bodyTextures() {
  const W = 2048;
  const H = 1024;
  const color = canvas(W, H);
  color.ctx.fillStyle = "#161616";
  color.ctx.fillRect(0, 0, W, H);
  speckle(color.ctx, W, H, 26000, 10, 44);
  // The painted weight, centred on u = 0.5 (the side facing the camera).
  // Lathe UVs stretch horizontally, so the lettering is drawn narrow.
  const paint = (ctx: CanvasRenderingContext2D, fill: string) => {
    ctx.save();
    ctx.translate(W / 2, H * 0.46);
    ctx.scale(0.62, 1);
    ctx.fillStyle = fill;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 250px 'Arial Black', 'Helvetica Neue', Arial, sans-serif";
    ctx.fillText("16", 0, -40);
    ctx.font = "800 92px 'Arial Black', 'Helvetica Neue', Arial, sans-serif";
    ctx.fillText("KG", 0, 130);
    ctx.restore();
  };
  paint(color.ctx, "#f5c518");
  // Worn paint: knock a few flecks back to iron.
  color.ctx.globalCompositeOperation = "source-atop";
  speckle(color.ctx, W, H, 4000, 18, 30);
  color.ctx.globalCompositeOperation = "source-over";

  const rough = canvas(W, H);
  rough.ctx.fillStyle = "#767676";
  rough.ctx.fillRect(0, 0, W, H);
  speckle(rough.ctx, W, H, 30000, 90, 200);
  paint(rough.ctx, "#c8c8c8");

  return { map: texture(color.c, true), roughnessMap: texture(rough.c, false) };
}

/** The handle: iron with a cloud of chalk where the hands go. */
function handleTextures() {
  const W = 1024;
  const H = 256;
  const color = canvas(W, H);
  const rough = canvas(W, H);
  const metal = canvas(W, H);
  color.ctx.fillStyle = "#181818";
  color.ctx.fillRect(0, 0, W, H);
  speckle(color.ctx, W, H, 6000, 12, 40);
  rough.ctx.fillStyle = "#6e6e6e";
  rough.ctx.fillRect(0, 0, W, H);
  metal.ctx.fillStyle = "#a0a0a0";
  metal.ctx.fillRect(0, 0, W, H);
  // u runs along the handle; chalk gathers on the grip in the middle —
  // a fine powder plus smears dragged along the bar by hands.
  const grip = () => 0.5 + (random() + random() + random() - 1.5) * 0.3;
  const dab = (x: number, y: number, rx: number, ry: number, a: number) => {
    color.ctx.fillStyle = `rgba(236,232,224,${a})`;
    rough.ctx.fillStyle = `rgba(255,255,255,${a})`;
    metal.ctx.fillStyle = `rgba(0,0,0,${a})`;
    for (const ctx of [color.ctx, rough.ctx, metal.ctx]) {
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  for (let i = 0; i < 260; i++) dab(grip() * W, random() * H, 18 + random() * 40, 2 + random() * 6, 0.05 + random() * 0.1);
  for (let i = 0; i < 9000; i++) dab(grip() * W, random() * H, 0.6 + random() * 1.4, 0.6 + random() * 1.4, 0.15 + random() * 0.45);
  return { map: texture(color.c, true), roughnessMap: texture(rough.c, false), metalnessMap: texture(metal.c, false) };
}

/** Soft round blob: the contact shadow and the dust sprites share it. */
function blob(inner: string, outer: string) {
  const { c, ctx } = canvas(256, 256);
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, inner);
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return texture(c, false);
}

/** Rubber gym floor tiles, plus a radial mask that fades the floor into the page. */
function floorTextures() {
  const tiles = canvas(512, 512);
  tiles.ctx.fillStyle = "#1d1c1a";
  tiles.ctx.fillRect(0, 0, 512, 512);
  speckle(tiles.ctx, 512, 512, 9000, 14, 46);
  tiles.ctx.strokeStyle = "#0b0b0a";
  tiles.ctx.lineWidth = 4;
  tiles.ctx.strokeRect(0, 0, 512, 512);
  const map = texture(tiles.c, true);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(10, 10);
  const mask = canvas(512, 512);
  const g = mask.ctx.createRadialGradient(256, 256, 30, 256, 256, 256);
  g.addColorStop(0, "#fff");
  g.addColorStop(0.55, "#666");
  g.addColorStop(1, "#000");
  mask.ctx.fillStyle = g;
  mask.ctx.fillRect(0, 0, 512, 512);
  return { map, alphaMap: texture(mask.c, false) };
}

function texture(source: HTMLCanvasElement, srgb: boolean) {
  const t = new THREE.CanvasTexture(source);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/* ------------------------------------------------------------------ */
/* Geometry                                                            */
/* ------------------------------------------------------------------ */

/** Half-profile (radius, height) of the bell, base at y = 0. */
const PROFILE: [number, number][] = [
  [0, 0],
  [0.24, 0],
  [0.34, 0.012],
  [0.43, 0.05],
  [0.5, 0.11],
  [0.545, 0.19],
  [0.568, 0.28],
  [0.575, 0.37],
  [0.566, 0.46],
  [0.54, 0.55],
  [0.495, 0.63],
  [0.43, 0.7],
  [0.35, 0.755],
  [0.26, 0.795],
  [0.16, 0.82],
  [0.07, 0.832],
  [0, 0.835],
];

const HANDLE_PATH: [number, number][] = [
  [-0.34, 0.74],
  [-0.42, 0.92],
  [-0.37, 1.1],
  [-0.2, 1.2],
  [0, 1.225],
  [0.2, 1.2],
  [0.37, 1.1],
  [0.42, 0.92],
  [0.34, 0.74],
];

/* ------------------------------------------------------------------ */
/* Chalk dust                                                          */
/* ------------------------------------------------------------------ */

const DUST_VERTEX = /* glsl */ `
  uniform float uAge;
  uniform float uPixelRatio;
  attribute vec3 aDir;
  attribute float aSpeed;
  attribute float aLife;
  attribute float aSeed;
  varying float vAlpha;

  void main() {
    float t = uAge;
    // Thrown out with drag, then the cloud keeps rising and billowing.
    float k = 2.8;
    vec3 p = position + aDir * aSpeed * (1.0 - exp(-k * t)) / k;
    p.y += 0.1 * t;
    p += vec3(sin(aSeed * 12.0 + t * 1.7), 0.5 * sin(aSeed * 7.0 + t * 1.3), cos(aSeed * 9.0 + t * 1.5)) * 0.07 * t;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (34.0 + aSeed * 60.0) * (1.0 + t * 1.6) * uPixelRatio / -mv.z;
    float fadeIn = smoothstep(0.0, 0.05, t);
    float fadeOut = 1.0 - smoothstep(aLife * 0.3, aLife, t);
    vAlpha = fadeIn * fadeOut * (0.05 + aSeed * 0.11);
  }
`;

const DUST_FRAGMENT = /* glsl */ `
  uniform sampler2D uSprite;
  varying float vAlpha;

  void main() {
    float a = texture2D(uSprite, gl_PointCoord).a * vAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(0.96, 0.94, 0.9, a);
  }
`;

function dustBuffers(count: number) {
  const origin = new Float32Array(count * 3);
  const dir = new Float32Array(count * 3);
  const speed = new Float32Array(count);
  const life = new Float32Array(count);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const a = random() * Math.PI * 2;
    const ring = 0.3 + random() * 0.25;
    origin.set([Math.cos(a) * ring, 0.04 + random() * 0.12, Math.sin(a) * ring], i * 3);
    // Mostly a low, fast shockwave along the floor; some of it kicks upward.
    const up = random() < 0.7 ? 0.05 + random() * 0.35 : 0.4 + random() * 0.8;
    const v = new THREE.Vector3(Math.cos(a), up, Math.sin(a)).normalize();
    dir.set([v.x, v.y, v.z], i * 3);
    speed[i] = 0.6 + random() * 2.4;
    life[i] = 1.6 + random() * 1.8;
    seed[i] = random();
  }
  return { origin, dir, speed, life, seed };
}

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

function Kettlebell({ reduced }: { reduced: boolean }) {
  const gl = useThree((s) => s.gl);
  const assets = useMemo(() => {
    const body = bodyTextures();
    const handle = handleTextures();
    const curve = new THREE.CatmullRomCurve3(HANDLE_PATH.map(([x, y]) => new THREE.Vector3(x, y, 0)));
    return {
      bodyGeometry: new THREE.LatheGeometry(
        PROFILE.map(([r, y]) => new THREE.Vector2(r, y)),
        128,
        Math.PI,
        Math.PI * 2,
      ),
      handleGeometry: new THREE.TubeGeometry(curve, 160, 0.07, 28, false),
      body,
      handle,
      shadow: blob("rgba(0,0,0,1)", "rgba(0,0,0,0)"),
      pool: blob("rgba(255,236,205,0.34)", "rgba(255,236,205,0)"),
      sprite: blob("rgba(255,255,255,1)", "rgba(255,255,255,0)"),
      floor: floorTextures(),
      dust: dustBuffers(DUST),
    };
  }, []);

  useEffect(
    () => () => {
      const { bodyGeometry, handleGeometry, body, handle, shadow, sprite, floor } = assets;
      for (const d of [bodyGeometry, handleGeometry, body.map, body.roughnessMap, handle.map, handle.roughnessMap, handle.metalnessMap, shadow, assets.pool, sprite, floor.map, floor.alphaMap])
        d.dispose();
    },
    [assets],
  );

  const bell = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const dust = useRef<THREE.ShaderMaterial>(null);
  // Our own clock: R3F resets its clock to 0 whenever the frameloop toggles
  // (the hero scrolling away and back), which would scramble the timeline.
  const state = useRef({ now: 0, last: -1, impactAt: -100, pointerX: 0, pointerY: 0 });
  const dustUniforms = useMemo(
    () => ({ uAge: { value: 99 }, uPixelRatio: { value: 1 }, uSprite: { value: assets.sprite } }),
    [assets],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      state.current.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      state.current.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ camera }, delta) => {
    const group = bell.current;
    const blobMesh = shadow.current;
    const dustMat = dust.current;
    if (!group || !blobMesh || !dustMat) return;
    const s = state.current;
    s.now += Math.min(delta, 0.1);
    const now = s.now;
    const t = reduced ? 0 : (now + START) % CYCLE;

    // Slam: crossing the impact moment kicks off the dust and a camera jolt.
    if (!reduced && s.last >= 0 && s.last < T_IMPACT && t >= T_IMPACT) s.impactAt = now;
    s.last = t;
    const since = now - s.impactAt;

    const y = reduced ? 0 : heightAt(t);
    group.position.y = y;
    const settle = since < 1 ? Math.exp(-since * 7) * Math.sin(since * 38) * 0.05 : 0;
    group.rotation.y = reduced ? -0.5 : -0.5 + Math.sin(now * 0.35) * 0.45 + s.pointerX * 0.25;
    group.rotation.x = (reduced ? 0 : s.pointerY * 0.08) + settle;
    group.rotation.z = settle * 0.6;

    // Contact shadow: tight and dark on the floor, wide and faint in the air.
    const lift = y / HANG;
    blobMesh.scale.setScalar(1.25 + lift * 0.7);
    const mat = blobMesh.material;
    if (mat instanceof THREE.MeshBasicMaterial) mat.opacity = 0.9 - lift * 0.55;

    dustMat.uniforms.uAge.value = since;
    dustMat.uniforms.uPixelRatio.value = gl.getPixelRatio();

    // A short, sharp camera jolt on impact.
    const jolt = since < 0.5 ? Math.exp(-since * 10) * 0.025 : 0;
    camera.position.set(Math.sin(now * 90) * jolt, 1.25 + Math.cos(now * 77) * jolt, 5.6);
    camera.lookAt(0, 0.55, 0);
  });

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial
          map={assets.floor.map}
          alphaMap={assets.floor.alphaMap}
          transparent
          roughness={0.95}
          metalness={0}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[4.4, 4.4]} />
        <meshBasicMaterial map={assets.pool} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={shadow} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <planeGeometry args={[1.6, 1.6]} />
        <meshBasicMaterial map={assets.shadow} transparent depthWrite={false} opacity={0.6} />
      </mesh>

      {/* The bell */}
      <group ref={bell}>
        <mesh geometry={assets.bodyGeometry}>
          <meshStandardMaterial
            map={assets.body.map}
            roughnessMap={assets.body.roughnessMap}
            roughness={0.9}
            metalness={0.45}
            envMapIntensity={1.5}
          />
        </mesh>
        <mesh geometry={assets.handleGeometry}>
          <meshStandardMaterial
            map={assets.handle.map}
            roughnessMap={assets.handle.roughnessMap}
            metalnessMap={assets.handle.metalnessMap}
            roughness={1}
            metalness={1}
            envMapIntensity={1.1}
          />
        </mesh>
      </group>

      {/* Chalk dust thrown up by the slam */}
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[assets.dust.origin, 3]} />
          <bufferAttribute attach="attributes-aDir" args={[assets.dust.dir, 3]} />
          <bufferAttribute attach="attributes-aSpeed" args={[assets.dust.speed, 1]} />
          <bufferAttribute attach="attributes-aLife" args={[assets.dust.life, 1]} />
          <bufferAttribute attach="attributes-aSeed" args={[assets.dust.seed, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={dust}
          uniforms={dustUniforms}
          vertexShader={DUST_VERTEX}
          fragmentShader={DUST_FRAGMENT}
          transparent
          depthWrite={false}
        />
      </points>
    </group>
  );
}

/** Lighting: a warm overhead spot, a yellow rim, and softboxes for the reflections. */
function Lights() {
  // The spot aims at an object inside the scene, so it follows the bell.
  const [target] = useState(() => new THREE.Object3D());
  return (
    <>
      <primitive object={target} position={[0, 0.45, 0]} />
      <ambientLight intensity={0.12} />
      <SpotLight
        target={target}
        position={[1.4, 5.4, 2.2]}
        angle={0.36}
        penumbra={0.85}
        intensity={140}
        distance={10}
        attenuation={6.5}
        anglePower={5}
        opacity={0.35}
        color="#fff1d8"
      />
      <pointLight position={[-2.4, 1.7, -1.5]} intensity={26} color="#ffc61a" />
      <pointLight position={[2.5, 1.4, -1.3]} intensity={18} color="#fff6e6" />
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={3} position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[6, 3, 1]} />
        <Lightformer intensity={4} position={[-4, 1.5, 1]} rotation={[0, Math.PI / 2, 0]} scale={[1.2, 5, 1]} />
        <Lightformer intensity={2.4} position={[4, 1.5, 2]} rotation={[0, -Math.PI / 2, 0]} scale={[1.2, 5, 1]} />
        <Lightformer intensity={1.2} color="#ffd23f" position={[0, 1, -5]} scale={[8, 1.5, 1]} />
      </Environment>
    </>
  );
}

/** Places the bell right of the copy on wide screens, centred otherwise. */
function Stage({ reduced }: { reduced: boolean }) {
  const viewport = useThree((s) => s.viewport);
  const width = useThree((s) => s.size.width);
  const wide = width >= 1024;
  const fit = Math.min(viewport.width / (wide ? 5.6 : 3.2), viewport.height / 3.6, 0.9);
  return (
    <group position={[wide ? viewport.width * (width >= 1280 ? 0.2 : 0.22) : 0, -0.78, 0]} scale={fit}>
      <Lights />
      <Kettlebell reduced={reduced} />
    </group>
  );
}

/**
 * Gym 6 · Chalk — the hero's cast-iron kettlebell under a gym spotlight: it
 * hangs, drops, slams into the rubber floor in a burst of chalk, and is lifted
 * back up. Client-only — load it with next/dynamic.
 */
export default function KettlebellScene({ active, reduced }: { active: boolean; reduced: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 30, position: [0, 1.25, 5.6], near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ camera }) => camera.lookAt(0, 0.55, 0)}
      style={{ pointerEvents: "none" }}
    >
      <Stage reduced={reduced} />
    </Canvas>
  );
}

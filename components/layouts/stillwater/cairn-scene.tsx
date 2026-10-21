"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { SKY_FRAGMENT, SKY_VERTEX, skyUniforms, type SkyUniforms } from "./sky";
import { CAIRN, rng, stackCairn, stoneGeometry, stoneMaterial } from "./stones";
import { RIPPLES, chopTexture, waterShader, type WaterUniforms } from "./water";

/* ------------------------------------------------------------------ */
/* Timeline (seconds)                                                  */
/* ------------------------------------------------------------------ */

/** The first stone starts down this long after the scene appears… */
const FIRST = 0.6;
/** …then one more every EVERY seconds, each taking LOWER to come to rest. */
const EVERY = 1.3;
const LOWER = 1.5;
/** "Balance again": stones leave top first, LIFT_GAP apart, each taking LIFT. */
const LIFT_GAP = 0.11;
const LIFT = 0.8;
/** Where a stone waits, above its resting place (well out of frame). */
const HIGH = 5;

const WAITING = 0;
const LOWERING = 1;
const RESTING = 2;
const LIFTING = 3;

/** Camera, in scene units (the base stone is about 2 across). */
const CAM = new THREE.Vector3(0, 1.25, 10);
const LOOK = new THREE.Vector3(0, 1.5, 0);

const FIREFLIES = 40;

/* ------------------------------------------------------------------ */
/* Fireflies                                                           */
/* ------------------------------------------------------------------ */

const FIREFLY_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSeed;
  varying float vAlpha;

  void main() {
    float s = aSeed * 6.2831;
    vec3 p = position;
    p.x += sin(uTime * 0.21 + s) * 0.35 + sin(uTime * 0.53 + s * 2.0) * 0.12;
    p.y += sin(uTime * 0.17 + s * 1.3) * 0.25;
    p.z += cos(uTime * 0.19 + s * 0.7) * 0.3;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vAlpha = pow(0.5 + 0.5 * sin(uTime * (0.7 + aSeed * 1.5) + s * 3.0), 3.0);
    gl_PointSize = (26.0 + aSeed * 22.0) * uPixelRatio / -mv.z;
  }
`;

const FIREFLY_FRAGMENT = /* glsl */ `
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float glow = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vec3(1.0, 0.76, 0.42) * 1.8, glow * glow * vAlpha);
  }
`;

type FireflyUniforms = {
  uTime: THREE.IUniform<number>;
  uPixelRatio: THREE.IUniform<number>;
};

function fireflyBuffers() {
  const random = rng(77);
  const position = new Float32Array(FIREFLIES * 3);
  const seed = new Float32Array(FIREFLIES);
  for (let i = 0; i < FIREFLIES; i++) {
    position.set([(random() - 0.5) * 5.6, 0.3 + random() * 3.2, -1.8 + random() * 3.4], i * 3);
    seed[i] = random();
  }
  return { position, seed };
}

/* ------------------------------------------------------------------ */
/* The scene                                                           */
/* ------------------------------------------------------------------ */

interface Stone {
  mode: number;
  /** When the current move started. */
  at: number;
  /** Height above the resting place when a lift began. */
  from: number;
  /** Height above the resting place now. */
  off: number;
  landedAt: number;
}

function Scene({ reduced, restack }: { reduced: boolean; restack: number }) {
  const viewport = useThree((s) => s.viewport);
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);
  const dpr = useThree((s) => s.viewport.dpr);

  // Where the cairn stands: right of the copy on wide screens, centred otherwise.
  const wide = width >= 1024;
  const fit = Math.min(viewport.width / (wide ? 8.2 : 2.9), viewport.height / 5.4, 0.86);
  const cairnX = wide ? viewport.width * (width >= 1280 ? 0.21 : 0.23) : 0;

  const assets = useMemo(() => {
    const geometries = CAIRN.map(stoneGeometry);
    const rest = stackCairn(geometries, CAIRN);
    const materials = CAIRN.map((spec, i) => stoneMaterial(spec.look, spec.seed, i === 0));
    const random = rng(29);
    // Each stone rocks about its own horizontal axis when it lands.
    const axes = CAIRN.map(() => {
      const a = random() * Math.PI * 2;
      return new THREE.Vector3(Math.cos(a), 0, Math.sin(a));
    });
    return { geometries, rest, materials, axes, fireflies: fireflyBuffers() };
  }, []);

  const lake = useMemo(() => {
    const chop = chopTexture();
    const mirror = new Reflector(new THREE.PlaneGeometry(800, 800), {
      textureWidth: 1024,
      textureHeight: 1024,
      clipBias: 0.002,
      shader: waterShader(),
    });
    mirror.rotation.x = -Math.PI / 2;
    if (mirror.material instanceof THREE.ShaderMaterial) (mirror.material.uniforms as WaterUniforms).uChop.value = chop;
    return { mirror, chop };
  }, []);

  const skyU = useMemo(() => skyUniforms(), []);
  const fireflyU = useMemo(() => ({ uTime: { value: 0 }, uPixelRatio: { value: 1 } }), []);
  // The key light aims at the middle of the cairn, wherever the stage puts it.
  const [target] = useState(() => new THREE.Object3D());

  // The reflection renders at a bit over half resolution: soft, like real water.
  useEffect(() => {
    lake.mirror.getRenderTarget().setSize(Math.round(width * dpr * 0.6), Math.round(height * dpr * 0.6));
  }, [lake, width, height, dpr]);

  useEffect(
    () => () => {
      for (const g of assets.geometries) g.dispose();
      for (const m of assets.materials) m.dispose();
      lake.chop.dispose();
      lake.mirror.geometry.dispose();
      lake.mirror.dispose();
    },
    [assets, lake],
  );

  const stage = useRef<THREE.Group>(null);
  const stack = useRef<THREE.Group>(null);
  const sky = useRef<THREE.Mesh>(null);
  const skyMat = useRef<THREE.ShaderMaterial>(null);
  const water = useRef<Reflector>(null);
  const fireflyMat = useRef<THREE.ShaderMaterial>(null);
  const sim = useRef({
    now: 0,
    restack,
    /** When the current build began (stone i is due EVERY·(i-1) later), or null while clearing. */
    buildAt: (reduced ? -100 : FIRST) as number | null,
    rebuildAt: 0,
    stones: CAIRN.map((_, i): Stone => ({
      mode: i === 0 || reduced ? RESTING : WAITING,
      at: 0,
      from: 0,
      off: i === 0 || reduced ? 0 : HIGH,
      landedAt: -100,
    })),
    ripples: Array.from({ length: RIPPLES }, () => ({ x: 0, z: 0, at: -100, strength: 0, r0: 0 })),
    nextRipple: 0,
    nextDrip: 5,
    pointerX: 0,
    pointerY: 0,
  });
  const scratch = useRef({
    wobble: new THREE.Quaternion(),
    spin: new THREE.Quaternion(),
    v: new THREE.Vector3(),
    base: new THREE.Vector3(),
    up: new THREE.Vector3(0, 1, 0),
    random: rng(91),
  });

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
    const group = stack.current;
    const stageGroup = stage.current;
    const dome = sky.current;
    const skyM = skyMat.current;
    const flies = fireflyMat.current;
    const mat = water.current?.material;
    if (!group || !stageGroup || !dome || !skyM || !flies || !(mat instanceof THREE.ShaderMaterial)) return;
    const s = sim.current;
    const { wobble, spin, v, base, up, random } = scratch.current;
    const dt = reduced ? 0 : Math.min(delta, 0.1);
    s.now += dt;
    const now = s.now;

    const ripple = (x: number, z: number, strength: number, r0: number) => {
      const slot = s.ripples[s.nextRipple];
      s.nextRipple = (s.nextRipple + 1) % RIPPLES;
      Object.assign(slot, { x, z, at: now, strength, r0 });
    };
    // The base stone's place on the water, for rings.
    base.copy(assets.rest[0].position);
    stageGroup.localToWorld(base);
    const baseR = CAIRN[0].size[0] * fit * 0.86;

    // "Balance again": lift the stones off, top first, then build anew.
    if (restack !== s.restack) {
      s.restack = restack;
      let order = 0;
      for (let i = s.stones.length - 1; i >= 1; i--) {
        const st = s.stones[i];
        if (st.mode === WAITING) continue;
        st.mode = LIFTING;
        st.at = now + order++ * LIFT_GAP;
        st.from = st.off;
      }
      s.buildAt = null;
      s.rebuildAt = now + Math.max(0, order - 1) * LIFT_GAP + LIFT + 0.35;
    }
    if (s.buildAt === null && now >= s.rebuildAt) s.buildAt = now;

    s.stones.forEach((st, i) => {
      if (i === 0) return;
      if (st.mode === WAITING && s.buildAt !== null && now >= s.buildAt + (i - 1) * EVERY) {
        st.mode = LOWERING;
        st.at = s.buildAt + (i - 1) * EVERY;
      }
      if (st.mode === LOWERING) {
        const p = Math.min(1, (now - st.at) / LOWER);
        st.off = HIGH * Math.pow(1 - p, 3);
        if (p >= 1) {
          st.mode = RESTING;
          st.off = 0;
          st.landedAt = now;
          ripple(base.x, base.z, 0.006 + CAIRN[i].size[0] * 0.009, baseR);
        }
      } else if (st.mode === LIFTING) {
        const p = Math.max(0, Math.min(1, (now - st.at) / LIFT));
        st.off = st.from + (HIGH - st.from) * Math.pow(p, 2.2);
        if (p >= 1) st.mode = WAITING;
      }
    });

    // Pose each stone: lowered in (turning gently into place), then rocking
    // on its contact point until it finds its balance.
    group.children.forEach((child, i) => {
      const st = s.stones[i];
      const rest = assets.rest[i];
      child.visible = st.mode !== WAITING;
      if (!child.visible) return;
      if (st.mode === LOWERING) {
        const p = Math.min(1, (now - st.at) / LOWER);
        spin.setFromAxisAngle(up, (i % 2 ? 1 : -1) * 0.8 * (1 - p) * (1 - p));
        child.quaternion.copy(spin).multiply(rest.quaternion);
        child.position.copy(rest.position).setY(rest.position.y + st.off);
      } else if (st.mode === RESTING) {
        const since = now - st.landedAt;
        const angle = since < 4 ? 0.05 * Math.exp(-since * 2.6) * Math.sin(since * 12) : 0;
        wobble.setFromAxisAngle(assets.axes[i], angle);
        child.quaternion.copy(wobble).multiply(rest.quaternion);
        v.copy(rest.position).sub(rest.contact).applyQuaternion(wobble).add(rest.contact);
        child.position.copy(v);
      } else {
        child.quaternion.copy(rest.quaternion);
        child.position.copy(rest.position).setY(rest.position.y + st.off);
      }
    });

    // Now and then a drop lands somewhere on the lake.
    if (!reduced && now > s.nextDrip) {
      s.nextDrip = now + 4 + random() * 5;
      ripple(base.x + (random() - 0.5) * 6, 1.2 + random() * 4, 0.0022 + random() * 0.002, 0);
    }

    // Water.
    const u = mat.uniforms as WaterUniforms;
    u.uTime.value = now;
    s.ripples.forEach((r, i) => {
      u.uRipples.value[i].set(r.x, r.z, r.at, r.strength);
      u.uRippleR0.value[i] = r.r0;
    });

    // The sun sits low, just right of the cairn (a direction: it doesn't parallax).
    v.set((base.x + 1.25 * fit - CAM.x) / CAM.z, 0.05, -1).normalize();
    const su = skyM.uniforms as SkyUniforms;
    su.uSunDir.value.copy(v);
    u.uSunDir.value.copy(v);
    su.uTime.value = now;
    const fu = flies.uniforms as FireflyUniforms;
    fu.uTime.value = now;
    fu.uPixelRatio.value = gl.getPixelRatio();

    // A slow drift toward the cursor.
    const k = 1 - Math.exp(-(reduced ? 60 : dt) * 2.2);
    camera.position.x += (CAM.x + s.pointerX * 0.45 - camera.position.x) * k;
    camera.position.y += (CAM.y - s.pointerY * 0.14 - camera.position.y) * k;
    camera.position.z = CAM.z;
    camera.lookAt(LOOK);
    dome.position.copy(camera.position);
  });

  return (
    <>
      <mesh ref={sky} frustumCulled={false} renderOrder={-100}>
        <sphereGeometry args={[60, 48, 24]} />
        <shaderMaterial
          ref={skyMat}
          side={THREE.BackSide}
          depthTest={false}
          depthWrite={false}
          uniforms={skyU}
          vertexShader={SKY_VERTEX}
          fragmentShader={SKY_FRAGMENT}
        />
      </mesh>
      <primitive ref={water} object={lake.mirror} />

      <group ref={stage} position={[cairnX, 0, 0]} scale={fit}>
        <primitive object={target} position={[0, 1.4, 0]} />
        <Lights target={target} />
        <group ref={stack}>
          {assets.geometries.map((geometry, i) => (
            <mesh key={i} geometry={geometry} material={assets.materials[i]} castShadow receiveShadow />
          ))}
        </group>
        <points frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[assets.fireflies.position, 3]} />
            <bufferAttribute attach="attributes-aSeed" args={[assets.fireflies.seed, 1]} />
          </bufferGeometry>
          <shaderMaterial
            ref={fireflyMat}
            uniforms={fireflyU}
            vertexShader={FIREFLY_VERTEX}
            fragmentShader={FIREFLY_FRAGMENT}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>
    </>
  );
}

/** The low sun behind (rim light and shadows), cool dusk fill from the front, softboxes for the gloss. */
function Lights({ target }: { target: THREE.Object3D }) {
  const key = useRef<THREE.DirectionalLight>(null);
  useLayoutEffect(() => {
    const light = key.current;
    if (!light) return;
    const cam = light.shadow.camera;
    cam.left = -2.4;
    cam.right = 2.4;
    cam.top = 2.6;
    cam.bottom = -2.6;
    cam.near = 0.5;
    cam.far = 16;
    cam.updateProjectionMatrix();
    light.shadow.mapSize.set(2048, 2048);
    light.shadow.radius = 6;
    light.shadow.bias = -0.0004;
    light.shadow.normalBias = 0.02;
  }, []);
  return (
    <>
      <hemisphereLight args={["#9fb3c6", "#3a2c22", 1.1]} />
      <directionalLight ref={key} target={target} position={[3.4, 3.6, -4.2]} intensity={3.4} color="#ffb06a" castShadow />
      <directionalLight target={target} position={[-3.2, 2.6, 5.5]} intensity={1.6} color="#d6dfeb" />
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2.6} color="#ffb070" position={[3, 1, -6]} scale={[10, 1.6, 1]} />
        <Lightformer intensity={1.1} color="#9fb4cc" position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[8, 8, 1]} />
        <Lightformer intensity={0.6} color="#d7c7bb" position={[-4, 2, 4]} rotation={[0, Math.PI / 4, 0]} scale={[3, 3, 1]} />
      </Environment>
    </>
  );
}

/**
 * Yoga 6 · Stillwater — the hero: river stones lowered one by one into a
 * balanced cairn on a still lake at dusk. Each finds its balance with a little
 * rock and sends a ring across the water; the cairn and the low sun mirror in
 * the lake. Bump `restack` to lift the stones off and build it again.
 * Client-only — load it with next/dynamic.
 */
export default function CairnScene({ active, reduced, restack }: { active: boolean; reduced: boolean; restack: number }) {
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 1.75]}
      frameloop={active ? (reduced ? "demand" : "always") : "never"}
      camera={{ fov: 30, position: CAM.toArray(), near: 0.1, far: 1200 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ camera }) => camera.lookAt(LOOK)}
      style={{ pointerEvents: "none" }}
    >
      <Scene reduced={reduced} restack={restack} />
    </Canvas>
  );
}

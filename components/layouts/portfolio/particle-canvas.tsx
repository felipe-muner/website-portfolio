"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { buildShapes, seeded } from "./particle-shapes";

/* Denser swarm where there is room (and usually a GPU) for it. */
const COUNT =
  typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches ? 14000 : 7000;
const INTRO_SECONDS = 3.2;
const MORPH_SECONDS = 2.2;
/** Share of a morph the highest particles wait before they set off. */
const STAGGER = 0.45;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type SwarmUniforms = {
  uTime: THREE.IUniform<number>;
  uMorph: THREE.IUniform<number>;
  uTurb: THREE.IUniform<number>;
  uSize: THREE.IUniform<number>;
  uPixelRatio: THREE.IUniform<number>;
  uPointer: THREE.IUniform<THREE.Vector3>;
  uPointerStrength: THREE.IUniform<number>;
};

type FloorUniforms = {
  uTime: THREE.IUniform<number>;
  uPulse: THREE.IUniform<number>;
  uPulseAmp: THREE.IUniform<number>;
  uColor: THREE.IUniform<THREE.Color>;
};

/* ------------------------------------------------------------------ */
/* Shaders                                                             */
/* ------------------------------------------------------------------ */

const SWARM_VERTEX = /* glsl */ `
  const float STAGGER = ${STAGGER.toFixed(2)};

  uniform float uTime;
  uniform float uMorph;
  uniform float uTurb;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec3 uPointer;
  uniform float uPointerStrength;

  attribute vec3 aTo;
  attribute float aRand;
  attribute float aStagger;

  varying vec3 vColor;
  varying float vAlpha;

  vec3 swirl(vec3 p, float t) {
    return vec3(
      sin(p.y * 2.3 + t * 1.3) + sin(p.z * 1.7 - t * 0.9),
      sin(p.z * 2.1 + t * 1.1) + sin(p.x * 1.9 + t * 0.7),
      sin(p.x * 2.2 - t * 1.2) + sin(p.y * 1.5 + t * 1.05)
    ) * 0.5;
  }

  void main() {
    // Low particles leave first, so each shape rebuilds from the ground up.
    float t = clamp((uMorph - aStagger * STAGGER) / (1.0 - STAGGER), 0.0, 1.0);
    t = t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) * 0.5;
    vec3 p = mix(position, aTo, t);

    // While morphing the swarm churns and swells; at rest it only breathes.
    p += swirl(p * 1.15 + aRand * 6.0, uTime * 0.8) * (uTurb * 0.34 + 0.012) * (0.5 + aRand);
    p *= 1.0 + uTurb * 0.08 * aRand;

    vec4 world = modelMatrix * vec4(p, 1.0);

    // The cursor parts the particles around it.
    vec2 away = world.xy - uPointer.xy;
    float near = uPointerStrength * (1.0 - smoothstep(0.0, 0.85, length(away)));
    world.xy += normalize(away + 1e-4) * near * 0.3;
    world.z += near * 0.2;

    vec4 view = viewMatrix * world;
    gl_Position = projectionMatrix * view;

    float sparkle = step(0.985, aRand);
    gl_PointSize = uSize * (0.55 + aRand * 0.9 + sparkle * 1.4) * uPixelRatio / -view.z;

    // Electric blue, a lighter blue, and the odd ice-white sparkle.
    vec3 deep = vec3(0.09, 0.22, 1.0);
    vec3 mid = vec3(0.34, 0.56, 1.0);
    vec3 ice = vec3(0.84, 0.91, 1.0);
    vColor = mix(deep, mid, smoothstep(0.15, 0.95, aRand));
    vColor = mix(vColor, ice, clamp(step(0.965, aRand) * 0.85 + uTurb * 0.15, 0.0, 1.0));

    float twinkle = 0.72 + 0.28 * sin(uTime * (1.2 + aRand * 2.5) + aRand * 40.0);
    float fog = clamp(1.4 - (-view.z - 5.2) * 0.5, 0.3, 1.0);
    vAlpha = twinkle * fog;
  }
`;

const SWARM_FRAGMENT = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float glow = 1.0 - d * 2.0;
    gl_FragColor = vec4(vColor, glow * glow * vAlpha);
  }
`;

const FLOOR_VERTEX = /* glsl */ `
  varying vec2 vPos;

  void main() {
    vPos = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FLOOR_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform float uPulse;
  uniform float uPulseAmp;
  uniform vec3 uColor;
  varying vec2 vPos;

  void main() {
    float r = length(vPos);
    // Concentric rings drifting slowly outward…
    float x = r * 1.35 - uTime * 0.1;
    float f = abs(fract(x) - 0.5);
    float line = 1.0 - smoothstep(0.0, fwidth(x) * 1.5, f);
    float rings = (line * 0.45 + exp(-f * 18.0) * 0.16) * smoothstep(4.0, 0.5, r) * smoothstep(0.1, 0.55, r);
    // …a soft pool of light under the swarm…
    float core = exp(-r * r * 2.2) * 0.5;
    // …and a shockwave each time it takes a new shape.
    float pulse = exp(-abs(r - uPulse) * 8.0) * uPulseAmp * smoothstep(4.2, 0.6, r) * 0.7;
    gl_FragColor = vec4(uColor, rings + core + pulse);
  }
`;

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

function Swarm({ shape, reduced }: { shape: number; reduced: boolean }) {
  // Built once: every target shape, the intro scatter, and per-particle noise.
  const [initial] = useState(() => {
    const { intro, targets } = buildShapes(COUNT);
    const r = seeded(7);
    const rand = new Float32Array(COUNT);
    const stagger = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      rand[i] = r();
      // Points are sorted bottom-to-top, so index order makes a morph rise.
      stagger[i] = 0.65 * (i / COUNT) + 0.35 * r();
    }
    return {
      targets,
      from: (reduced ? targets[shape] : intro).slice(),
      to: targets[shape].slice(),
      rand,
      stagger,
    };
  });
  const [uniforms] = useState<SwarmUniforms>(() => ({
    uTime: { value: 0 },
    uMorph: { value: 0 },
    uTurb: { value: reduced ? 0 : 1 },
    uSize: { value: 19 },
    uPixelRatio: { value: 1 },
    uPointer: { value: new THREE.Vector3(99, 99, 0) },
    uPointerStrength: { value: 0 },
  }));
  const [floorUniforms] = useState<FloorUniforms>(() => ({
    uTime: { value: 0 },
    uPulse: { value: 0 },
    uPulseAmp: { value: 0 },
    uColor: { value: new THREE.Color(0.25, 0.45, 1.0) },
  }));

  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const floor = useRef<THREE.ShaderMaterial>(null);
  const sway = useRef<THREE.Group>(null);
  const anim = useRef({
    shape,
    m: 0,
    duration: reduced ? 0.001 : INTRO_SECONDS,
    turb: reduced ? 0 : 1,
    /** Clock time of the last retarget; -1 = stamp it on the next frame. */
    pulseAt: -1,
  });
  const pointer = useRef({ x: 0, y: 0, active: false });
  const scratch = useRef({
    ray: new THREE.Raycaster(),
    plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    ndc: new THREE.Vector2(),
    hit: new THREE.Vector3(),
  });

  const gl = useThree((s) => s.gl);

  // Track the cursor over the whole page (the hero copy sits above the canvas).
  useEffect(() => {
    const canvas = gl.domElement;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      pointer.current.active = e.clientY >= rect.top && e.clientY <= rect.bottom;
    };
    const onLeave = () => {
      pointer.current.active = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [gl]);

  // Retarget: freeze every particle where it is right now (so switching
  // mid-morph never jumps), then fly from there to the new shape.
  useEffect(() => {
    const a = anim.current;
    const geometry = points.current?.geometry;
    if (!geometry || a.shape === shape) return;
    const from = geometry.getAttribute("position");
    const to = geometry.getAttribute("aTo");
    const f = from.array as Float32Array;
    const t = to.array as Float32Array;
    const s = initial.stagger;
    for (let i = 0; i < s.length; i++) {
      const k = easeInOutCubic(clamp01((a.m - s[i] * STAGGER) / (1 - STAGGER)));
      for (let j = i * 3; j < i * 3 + 3; j++) f[j] += (t[j] - f[j]) * k;
    }
    t.set(initial.targets[shape]);
    from.needsUpdate = true;
    to.needsUpdate = true;
    a.shape = shape;
    a.m = 0;
    a.duration = reduced ? 0.001 : MORPH_SECONDS;
    a.pulseAt = -1;
  }, [shape, reduced, initial]);

  useFrame((state, delta) => {
    const mat = material.current;
    const ground = floor.current;
    const group = sway.current;
    if (!mat || !ground || !group) return;
    const u = mat.uniforms as SwarmUniforms;
    const fu = ground.uniforms as FloorUniforms;
    const a = anim.current;
    const p = pointer.current;
    // Resuming after the hero was off screen can hand us a huge delta.
    const dt = Math.min(delta, 1 / 20);
    const time = state.clock.elapsedTime;
    if (a.pulseAt < 0) a.pulseAt = time;

    // Churn only while particles are in flight, then settle fast so each
    // shape spends most of its dwell crisp and recognisable.
    a.m = Math.min(1, a.m + dt / a.duration);
    const churn = !reduced && a.m < 0.6 ? 1 : 0;
    a.turb += (churn - a.turb) * (1 - Math.exp(-dt * (churn > a.turb ? 5 : 3)));

    const live = p.active && !reduced;
    if (live) {
      const { ray, plane, ndc, hit } = scratch.current;
      ndc.set(p.x, p.y);
      ray.setFromCamera(ndc, state.camera);
      if (ray.ray.intersectPlane(plane, hit)) u.uPointer.value.lerp(hit, 1 - Math.exp(-dt * 10));
    }
    u.uPointerStrength.value += ((live ? 1 : 0) - u.uPointerStrength.value) * (1 - Math.exp(-dt * 4));

    u.uTime.value = time;
    u.uMorph.value = a.m;
    u.uTurb.value = a.turb;
    u.uPixelRatio.value = state.gl.getPixelRatio();

    const since = time - a.pulseAt;
    fu.uTime.value = time;
    fu.uPulse.value = since * 1.5;
    fu.uPulseAmp.value = reduced ? 0 : Math.exp(-since * 0.9);

    // A slow sway, a gentle bob, and a little parallax toward the cursor.
    if (!reduced) {
      const k = 1 - Math.exp(-dt * 2.2);
      const yaw = Math.sin(time * 0.32) * 0.32 + (live ? p.x * 0.22 : 0);
      const pitch = live ? -p.y * 0.08 : 0;
      group.rotation.y += (yaw - group.rotation.y) * k;
      group.rotation.x += (pitch - group.rotation.x) * k;
      group.position.y = Math.sin(time * 0.6) * 0.04;
    }
  });

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.08, 0]} renderOrder={-1}>
        <planeGeometry args={[10, 10]} />
        <shaderMaterial
          ref={floor}
          uniforms={floorUniforms}
          vertexShader={FLOOR_VERTEX}
          fragmentShader={FLOOR_FRAGMENT}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <group ref={sway}>
        <points ref={points} frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[initial.from, 3]} />
            <bufferAttribute attach="attributes-aTo" args={[initial.to, 3]} />
            <bufferAttribute attach="attributes-aRand" args={[initial.rand, 1]} />
            <bufferAttribute attach="attributes-aStagger" args={[initial.stagger, 1]} />
          </bufferGeometry>
          <shaderMaterial
            ref={material}
            uniforms={uniforms}
            vertexShader={SWARM_VERTEX}
            fragmentShader={SWARM_FRAGMENT}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>
    </>
  );
}

/**
 * Places the swarm: right of the copy on wide screens (centred at 69% of the
 * width from 1280px, 72% between 1024 and 1280px), centred otherwise.
 */
function Stage({ shape, reduced }: { shape: number; reduced: boolean }) {
  const viewport = useThree((s) => s.viewport);
  const width = useThree((s) => s.size.width);
  const wide = width >= 1024;
  const roomy = width >= 1280;
  const share = roomy ? 0.42 : wide ? 0.36 : 0.86;
  const fit = Math.min((viewport.width * share) / 2.4, viewport.height / 2.9, 0.92);
  const offset = wide ? viewport.width * (roomy ? 0.19 : 0.22) : 0;
  return (
    <group position={[offset, 0, 0]} scale={fit}>
      <Swarm shape={shape} reduced={reduced} />
    </group>
  );
}

/**
 * The /portfolio hero swarm: a WebGL particle cloud that morphs between one
 * silhouette per template category. Client-only — load it with next/dynamic.
 */
export default function ParticleCanvas({
  shape,
  active,
  reduced,
}: {
  /** Index into SHAPE_KEYS. */
  shape: number;
  /** Render only while the hero is on screen. */
  active: boolean;
  reduced: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 36, position: [0, 1.25, 5.8], near: 0.1, far: 50 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      style={{ pointerEvents: "none" }}
    >
      <Stage shape={shape} reduced={reduced} />
    </Canvas>
  );
}

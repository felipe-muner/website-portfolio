"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Trade } from "@/lib/previews/trades";
import { SHAPES, sphere } from "./shapes";

/**
 * The outreach previews' hero: thousands of glowing points that gather from
 * a sphere into the trade's shapes and morph between them (pipes → drop →
 * wrench for a plumber), over a floor of slow ripples. Every point has its own
 * delay and swirl, so a morph reads as water or air rather than a crossfade.
 */

const MORPH = 1.8; // seconds to travel between shapes
const HOLD = 3.4; // seconds each shape holds still(ish)

const VERT = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute float aRand;
  uniform float uTime;
  uniform float uMorph;
  uniform float uSize;
  uniform float uPixelRatio;
  varying float vRand;
  varying float vGlow;

  void main() {
    float delay = aRand * 0.35;
    float m = smoothstep(delay, delay + 0.65, uMorph);
    vec3 p = mix(aFrom, aTo, m);

    // Mid-flight the points swirl around the axis and lift outwards.
    float burst = sin(m * 3.14159);
    float angle = burst * (aRand - 0.5) * 2.6;
    float c = cos(angle), s = sin(angle);
    p.xz = mat2(c, -s, s, c) * p.xz;
    p += normalize(p + vec3(0.0, 0.001, 0.0)) * burst * (0.2 + aRand * 0.5);

    // A slow shimmer so a held shape still breathes.
    p += vec3(sin(uTime * 0.9 + aRand * 40.0), cos(uTime * 0.7 + aRand * 30.0), sin(uTime * 0.8 + aRand * 20.0)) * 0.012;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.45 + aRand) / -mv.z;
    vRand = aRand;
    vGlow = 0.5 + 0.3 * sin(uTime * 1.6 + aRand * 80.0) + step(0.985, aRand) * 0.8;
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vRand;
  varying float vGlow;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = pow(1.0 - d * 2.0, 1.7);
    vec3 color = mix(uColorA, uColorB, vRand);
    gl_FragColor = vec4(color, a * vGlow * 0.9);
  }
`;

/** Concentric ripples on the floor, drifting outwards like the references' intro. */
const RIPPLE_FRAG = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float r = length(p);
    float spiral = atan(p.y, p.x) / 6.28318;
    float w = abs(fract(r * 7.0 - uTime * 0.25 + spiral * 0.6) - 0.5);
    float line = smoothstep(0.045, 0.0, w);
    float fade = smoothstep(1.0, 0.2, r) * smoothstep(0.02, 0.18, r);
    gl_FragColor = vec4(uColor, line * fade * 0.5);
  }
`;

const RIPPLE_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function Morph({
  trade,
  colors,
  reduced,
  onShape,
}: {
  trade: Trade;
  colors: [string, string];
  reduced: boolean;
  onShape?: (index: number) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const geometry = useRef<THREE.BufferGeometry>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const clock = useRef({ t: 0, start: 0, cycle: -1 });

  const count = useMemo(() => (window.innerWidth < 768 ? 7000 : 14000), []);
  const shapes = useMemo(() => SHAPES[trade]().map((make) => make(count)), [trade, count]);
  const buffers = useMemo(() => {
    const intro = sphere(count);
    return {
      position: intro.slice(),
      from: reduced ? shapes[0].slice() : intro,
      to: shapes[0].slice(),
      rand: Float32Array.from({ length: count }, Math.random),
    };
  }, [count, shapes, reduced]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMorph: { value: reduced ? 1 : 0 },
      uSize: { value: 30 },
      uPixelRatio: { value: 1 },
      uColorA: { value: new THREE.Color(colors[0]) },
      uColorB: { value: new THREE.Color(colors[1]) },
    }),
    [colors, reduced],
  );

  useEffect(() => onShape?.(0), [onShape]);

  useFrame((state, delta) => {
    const m = material.current;
    const g = geometry.current;
    if (!m || !g) return;
    // R3F copies `uniforms` into the material, so update the material's own.
    const u = m.uniforms;
    u.uPixelRatio.value = state.viewport.dpr;
    if (reduced) return;
    const c = clock.current;
    c.t += Math.min(delta, 0.05);
    u.uTime.value = c.t;
    const elapsed = c.t - c.start;
    u.uMorph.value = Math.min(1, elapsed / MORPH);

    if (elapsed > MORPH + HOLD) {
      // Next leg: from the shape we're on to the one after it.
      c.cycle += 1;
      c.start = c.t;
      const from = g.getAttribute("aFrom") as THREE.BufferAttribute;
      const to = g.getAttribute("aTo") as THREE.BufferAttribute;
      (from.array as Float32Array).set(shapes[c.cycle % shapes.length]);
      (to.array as Float32Array).set(shapes[(c.cycle + 1) % shapes.length]);
      from.needsUpdate = true;
      to.needsUpdate = true;
      u.uMorph.value = 0;
      onShape?.((c.cycle + 1) % shapes.length);
    }

    // Turn slowly on its own, and lean towards the pointer.
    const turn = group.current;
    if (turn) {
      turn.rotation.y = THREE.MathUtils.damp(turn.rotation.y, Math.sin(c.t * 0.22) * 0.32 + state.pointer.x * 0.3, 2.5, delta);
      turn.rotation.x = THREE.MathUtils.damp(turn.rotation.x, -state.pointer.y * 0.12, 2.5, delta);
    }
  });

  return (
    <group ref={group}>
      <points frustumCulled={false}>
        <bufferGeometry ref={geometry}>
          <bufferAttribute attach="attributes-position" args={[buffers.position, 3]} />
          <bufferAttribute attach="attributes-aFrom" args={[buffers.from, 3]} />
          <bufferAttribute attach="attributes-aTo" args={[buffers.to, 3]} />
          <bufferAttribute attach="attributes-aRand" args={[buffers.rand, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          vertexShader={VERT}
          fragmentShader={FRAG}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function Ripples({ color, reduced }: { color: string; reduced: boolean }) {
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uColor: { value: new THREE.Color(color) } }), [color]);
  const material = useRef<THREE.ShaderMaterial>(null);
  useFrame((_, delta) => {
    if (material.current && !reduced) material.current.uniforms.uTime.value += Math.min(delta, 0.05);
  });
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -1.55, 0]}>
      <planeGeometry args={[9, 9]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={RIPPLE_VERT}
        fragmentShader={RIPPLE_FRAG}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function Camera() {
  const camera = useThree((s) => s.camera);
  useEffect(() => camera.lookAt(0, 0.05, 0), [camera]);
  return null;
}

export default function ParticleScene({
  trade,
  colors,
  active,
  reduced,
  onShape,
}: {
  trade: Trade;
  colors: [string, string];
  active: boolean;
  reduced: boolean;
  /** Called with the index of the shape being formed. */
  onShape?: (index: number) => void;
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={!active ? "never" : reduced ? "demand" : "always"}
      camera={{ fov: 38, position: [0, 0.9, 6.2], near: 0.1, far: 30 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <Camera />
      <Morph trade={trade} colors={colors} reduced={reduced} onShape={onShape} />
      <Ripples color={colors[0]} reduced={reduced} />
    </Canvas>
  );
}

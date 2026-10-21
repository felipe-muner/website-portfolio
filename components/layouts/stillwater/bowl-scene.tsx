"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { SWING, type BowlSignal } from "./bowl-signal";
import { SIMPLEX, SIMPLEX_GRAD } from "./glsl";
import { rng } from "./stones";

/* ------------------------------------------------------------------ */
/* The bowl                                                            */
/* ------------------------------------------------------------------ */

/* Half-profile (radius, height): outer wall up, over a rounded rim, inner wall
   down to the floor — the same winding as the café's cup. */
const PROFILE: [number, number][] = [
  [0, 0],
  [0.12, 0.004],
  [0.24, 0.02],
  [0.35, 0.055],
  [0.45, 0.11],
  [0.53, 0.18],
  [0.585, 0.26],
  [0.615, 0.34],
  [0.628, 0.41],
  [0.628, 0.455],
  [0.622, 0.476],
  [0.608, 0.486],
  [0.594, 0.479],
  [0.59, 0.456],
  [0.588, 0.41],
  [0.576, 0.34],
  [0.548, 0.265],
  [0.495, 0.19],
  [0.42, 0.13],
  [0.32, 0.085],
  [0.2, 0.06],
  [0.08, 0.05],
  [0, 0.048],
];
const RIM = 0.628;
/** The water's surface, and its radius against the inner wall there. */
const WATER_Y = 0.3;
const WATER_R = 0.556;
/** The bowl sits nested in its ring cushion, on a round rug. */
const SEAT = 0.07;
const RUG = 1.02;

/** Strike and song slots in the water shader. */
const STRIKES = 4;

/* ------------------------------------------------------------------ */
/* Shaders                                                             */
/* ------------------------------------------------------------------ */

/** Hand-hammered bronze: dents, patina, two engraved rings under the rim, turning marks inside. */
function bronzeMaterial(): THREE.MeshPhysicalMaterial {
  const material = new THREE.MeshPhysicalMaterial({
    color: "#c39a5c",
    metalness: 1,
    roughness: 0.3,
    envMapIntensity: 1.35,
  });
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vBowl;\nvarying vec3 vBowlN;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvBowl = position;\nvBowlN = normal;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\nvarying vec3 vBowl;\nvarying vec3 vBowlN;\n${SIMPLEX}\n${SIMPLEX_GRAD}`)
      .replace(
        "#include <color_fragment>",
        /* glsl */ `
        #include <color_fragment>
        float outward = step(0.0, dot(vBowlN.xz, vBowl.xz));
        float patina = sw_fbm(vBowl * 4.0 + 3.0);
        vec3 metal = diffuseColor.rgb * mix(0.66, 1.06, smoothstep(-0.5, 0.45, patina));
        // Darker, browner bronze outside; the polished inside stays bright.
        metal = mix(metal, metal * vec3(0.78, 0.66, 0.52), outward * 0.45);
        float rings = (1.0 - smoothstep(0.0015, 0.004, abs(vBowl.y - 0.402))) + (1.0 - smoothstep(0.001, 0.0028, abs(vBowl.y - 0.42)));
        rings *= outward;
        metal *= 1.0 - rings * 0.65;
        diffuseColor.rgb = metal;
        `,
      )
      .replace(
        "#include <roughnessmap_fragment>",
        /* glsl */ `
        #include <roughnessmap_fragment>
        roughnessFactor = clamp(roughnessFactor + patina * 0.08 + outward * 0.08 + rings * 0.35, 0.08, 1.0);
        `,
      )
      .replace(
        "#include <normal_fragment_maps>",
        /* glsl */ `
        #include <normal_fragment_maps>
        // Hammer marks: soft round dents from the peaks of two noise octaves.
        // The gradient is analytic, so the dents stay smooth at any size (the
        // bowl is never rotated, so object directions are world directions).
        vec3 g1;
        vec3 g2;
        float n1 = sw_snoise(vBowl * 13.0 + 4.0, g1);
        float n2 = sw_snoise(vBowl * 21.0 - 9.0, g2);
        float k1 = 6.0 * clamp((n1 - 0.15) / 0.7, 0.0, 1.0) * (1.0 - clamp((n1 - 0.15) / 0.7, 0.0, 1.0)) / 0.7;
        float k2 = 6.0 * clamp((n2 - 0.2) / 0.7, 0.0, 1.0) * (1.0 - clamp((n2 - 0.2) / 0.7, 0.0, 1.0)) / 0.7;
        vec3 dentGrad = -(k1 * g1 * 13.0 * 0.6 + k2 * g2 * 21.0 * 0.35) * mix(0.0016, 0.0026, outward);
        vec3 grad = (viewMatrix * vec4(dentGrad, 0.0)).xyz;
        normal = normalize(normal - (grad - dot(grad, normal) * normal));
        `,
      );
  };
  material.customProgramCacheKey = () => "stillwater-bronze";
  return material;
}

const WATER_VERTEX = /* glsl */ `
  varying vec2 vDisc;
  varying vec3 vWorld;
  void main() {
    vDisc = position.xy; // the unit disc, before scaling to the bowl
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const WATER_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform vec4 uStrikes[${STRIKES}]; // angle, start time, strength, -
  uniform float uSing;               // 0..1, how loud the bowl sings
  uniform float uSingAngle;          // where the stick is
  varying vec2 vDisc;
  varying vec3 vWorld;

  // Surface height on the unit disc (1 = the wall).
  float height(vec2 q) {
    float r = length(q);
    float th = atan(q.y, q.x);
    float edge = 1.0 - r;
    float h = 0.0;
    for (int i = 0; i < ${STRIKES}; i++) {
      vec4 s = uStrikes[i];
      float age = uTime - s.y;
      if (s.z <= 0.0 || age < 0.0 || age > 9.0) continue;
      // The wall rings in its four-lobed mode: strongest where it was struck,
      // and 90, 180, 270 degrees round from there.
      float mode = cos(2.0 * (th - s.x));
      float lobes = 0.5 + 0.5 * mode * mode;
      // Rings leave the wall and run inward…
      float x = edge - age * 0.34;
      float packet = exp(-x * x / (0.012 + age * 0.03));
      h += s.z * packet * sin(edge * 64.0 - age * 24.0) * exp(-age * 0.75) * lobes;
      // …while the water by the wall shivers as long as it rings.
      h += s.z * 0.55 * exp(-edge * 10.0) * sin(edge * 90.0 - age * 30.0) * mode * exp(-age * 0.55);
    }
    // Singing: standing waves at the four antinodes, which follow the stick,
    // breaking into a Faraday criss-cross when it's loud.
    float lobe = pow(abs(cos(2.0 * (th - uSingAngle))), 3.0);
    h += uSing * exp(-edge * 6.0) * sin(edge * 80.0 - uTime * 16.0) * lobe;
    vec2 grid = q * 58.0;
    h += uSing * uSing * 0.4 * exp(-edge * 3.5) * lobe * sin(grid.x + uTime * 4.0) * sin(grid.y - uTime * 3.0);
    return h * 0.009;
  }

  void main() {
    vec2 q = vDisc;
    float e = 0.004;
    float hx = (height(q + vec2(e, 0.0)) - height(q - vec2(e, 0.0))) / (2.0 * e);
    float hy = (height(q + vec2(0.0, e)) - height(q - vec2(0.0, e))) / (2.0 * e);
    // Disc x is world x, disc y is world -z.
    vec3 n = normalize(vec3(-hx, 1.0, hy) );
    vec3 V = normalize(cameraPosition - vWorld);
    vec3 R = reflect(-V, n);

    // A dim room: a tall warm window behind the bowl (what the still water
    // mirrors, so every ripple bends it) and a cooler lamp off to the side.
    vec3 env = vec3(0.035, 0.03, 0.028);
    float az = atan(R.x, -R.z);
    float el = asin(clamp(R.y, -1.0, 1.0));
    float win = smoothstep(0.055, 0.075, az) * smoothstep(0.175, 0.155, az)
              * smoothstep(0.455, 0.475, el) * smoothstep(0.625, 0.605, el);
    // Window bars: one upright, one across; brighter toward the top.
    win *= step(0.005, abs(az - 0.115)) * step(0.005, abs(el - 0.54));
    win *= 0.7 + 0.3 * smoothstep(0.46, 0.62, el);
    env += vec3(1.0, 0.84, 0.64) * 1.15 * win;
    // A warm glow round the window, and a cool lamp far left.
    env += vec3(0.5, 0.36, 0.22) * 0.25 * exp(-length(vec2(az - 0.11, el - 0.54)) * 9.0);
    env += vec3(0.62, 0.72, 0.9) * 0.9 * smoothstep(0.035, 0.0, length(vec2(az + 0.2, el - 0.5)));
    float fresnel = 0.02 + 0.98 * pow(1.0 - max(dot(n, V), 0.0), 5.0);
    vec3 glow = env * (0.45 + fresnel);
    float bright = max(glow.r, max(glow.g, glow.b));
    // See-through but tinted (the bronze floor shows dimmer), opaque where it shines.
    float alpha = clamp(0.34 + fresnel * 0.5 + bright * 0.9, 0.0, 1.0);
    // A thin bright line where the water meets the wall.
    float rim = smoothstep(0.965, 1.0, length(q));
    gl_FragColor = vec4(glow / max(alpha, 0.001) + rim * 0.25, min(1.0, alpha + rim * 0.3));
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/** Sound made visible: soft rings spreading across the rug from each strike. */
const HALO_VERTEX = /* glsl */ `
  varying vec2 vPos;
  void main() {
    vPos = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const HALO_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform vec4 uRings[6]; // start time, strength, -, -
  varying vec2 vPos;
  void main() {
    float d = length(vPos);
    float a = 0.0;
    for (int i = 0; i < 6; i++) {
      vec4 r = uRings[i];
      float age = uTime - r.x;
      if (r.y <= 0.0 || age < 0.0 || age > 4.0) continue;
      float radius = 0.72 + age * 0.34;
      float w = 0.01 + age * 0.018;
      a += exp(-pow((d - radius) / w, 2.0)) * (1.0 - age / 4.0) * r.y;
    }
    // Fade out before the stage's edges.
    a *= smoothstep(1.55, 1.15, d);
    gl_FragColor = vec4(vec3(1.0, 0.78, 0.5), a * 0.4);
  }
`;

/* ------------------------------------------------------------------ */
/* Textures                                                            */
/* ------------------------------------------------------------------ */

function canvas(size: number) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable");
  return { c, ctx };
}

/** A round, braided jute meditation rug, seen from above. */
function rugTexture(): THREE.CanvasTexture {
  const S = 1024;
  const { c, ctx } = canvas(S);
  const random = rng(8);
  ctx.fillStyle = "#2c241c";
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S / 2 - 6, 0, Math.PI * 2);
  ctx.fill();
  for (let r = 12; r < S / 2 - 12; r += 11) {
    const n = Math.max(10, Math.floor((2 * Math.PI * r) / 8.5));
    const tone = random() * 14;
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2;
      const shade = 54 + tone + random() * 26 + (k % 2) * 12;
      ctx.fillStyle = `rgb(${shade + 34}, ${shade + 20}, ${shade + 4})`;
      ctx.save();
      ctx.translate(S / 2 + Math.cos(a) * r, S / 2 + Math.sin(a) * r);
      ctx.rotate(a + (k % 2 ? 0.55 : -0.55));
      ctx.beginPath();
      ctx.ellipse(0, 0, 6.2, 3.1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

const UP = new THREE.Vector3(0, 1, 0);

type WaterUniforms = {
  uTime: THREE.IUniform<number>;
  uStrikes: THREE.IUniform<THREE.Vector4[]>;
  uSing: THREE.IUniform<number>;
  uSingAngle: THREE.IUniform<number>;
};

type HaloUniforms = {
  uTime: THREE.IUniform<number>;
  uRings: THREE.IUniform<THREE.Vector4[]>;
};

/** Where the stick is: round the rim at `angle`, `out` from the rim, contact at height `y`, leaning out by `tilt`. */
function poseMallet(stick: THREE.Object3D, angle: number, out: number, y: number, tilt: number, drag: number) {
  const radial = new THREE.Vector3(Math.cos(angle), 0, -Math.sin(angle));
  const tangent = new THREE.Vector3(-Math.sin(angle), 0, -Math.cos(angle));
  const dir = UP.clone()
    .multiplyScalar(Math.cos(tilt))
    .addScaledVector(radial, Math.sin(tilt))
    .addScaledVector(tangent, drag)
    .normalize();
  stick.quaternion.setFromUnitVectors(UP, dir);
  // The suede wrap touches the rim a little above the stick's end.
  const contact = radial.multiplyScalar(RIM + 0.034 + out).setY(y);
  stick.position.copy(contact).addScaledVector(dir, -0.11);
}

function Bowl({ reduced, signal }: { reduced: boolean; signal: React.RefObject<BowlSignal> }) {
  const assets = useMemo(() => {
    const curve = new THREE.SplineCurve(PROFILE.map(([r, y]) => new THREE.Vector2(r, y)));
    const points = curve.getSpacedPoints(220);
    points[0].set(0, points[0].y);
    points[points.length - 1].set(0, points[points.length - 1].y);
    return {
      bowl: new THREE.LatheGeometry(points, 180),
      bronze: bronzeMaterial(),
      rug: rugTexture(),
    };
  }, []);
  useEffect(
    () => () => {
      assets.bowl.dispose();
      assets.bronze.dispose();
      assets.rug.dispose();
    },
    [assets],
  );

  const waterU = useMemo(
    () => ({
      uTime: { value: 0 },
      uStrikes: { value: Array.from({ length: STRIKES }, () => new THREE.Vector4()) },
      uSing: { value: 0 },
      uSingAngle: { value: 0 },
    }),
    [],
  );
  const haloU = useMemo(
    () => ({ uTime: { value: 0 }, uRings: { value: Array.from({ length: 6 }, () => new THREE.Vector4()) } }),
    [],
  );

  const mallet = useRef<THREE.Group>(null);
  const waterMat = useRef<THREE.ShaderMaterial>(null);
  const haloMat = useRef<THREE.ShaderMaterial>(null);
  const state = useRef({
    now: 0,
    seen: 0,
    swingAt: -100,
    pending: false,
    angle: -0.55,
    sing: 0,
    hold: 0,
    nextRing: 0,
    strikeSlot: 0,
    ringSlot: 0,
    pointerX: 0,
  });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "touch") state.current.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ camera }, delta) => {
    const stick = mallet.current;
    const sig = signal.current;
    const wm = waterMat.current;
    const hm = haloMat.current;
    if (!stick || !sig || !wm || !hm) return;
    const wu = wm.uniforms as WaterUniforms;
    const hu = hm.uniforms as HaloUniforms;
    const s = state.current;
    const dt = Math.min(delta, 0.1);
    s.now += dt;
    const now = s.now;

    const ring = (strength: number) => {
      hu.uRings.value[s.ringSlot].set(now, strength, 0, 0);
      s.ringSlot = (s.ringSlot + 1) % 6;
    };

    // A strike: the stick swings in, and the water and air answer on contact.
    if (sig.strikes !== s.seen) {
      s.seen = sig.strikes;
      s.swingAt = now;
      s.pending = true;
    }
    if (s.pending && now >= s.swingAt + SWING) {
      s.pending = false;
      wu.uStrikes.value[s.strikeSlot].set(s.angle, now, 1, 0);
      s.strikeSlot = (s.strikeSlot + 1) % STRIKES;
      ring(1);
      ring(0.6);
    }

    // Singing: the stick goes round, the song swells (and fades when it lifts).
    s.hold += ((sig.singing ? 1 : 0) - s.hold) * (1 - Math.exp(-dt * 6));
    s.sing += ((sig.singing ? 1 : 0) - s.sing) * (1 - Math.exp(-dt * (sig.singing ? 0.75 : 0.45)));
    if (sig.singing && !reduced) s.angle += dt * Math.PI * 2 * 0.4;
    if (sig.singing && now > s.nextRing) {
      s.nextRing = now + 1.2;
      ring(0.25 + s.sing * 0.5);
    }
    wu.uTime.value = now;
    wu.uSing.value = s.sing;
    wu.uSingAngle.value = s.angle;
    hu.uTime.value = now;

    // The stick: hovering by the bowl, swinging in to strike, or going round.
    const since = now - s.swingAt;
    let k = 0;
    if (since < SWING) k = (since / SWING) ** 2;
    else if (since < SWING + 0.6) k = 1 - (1 - Math.pow(1 - (since - SWING) / 0.6, 3));
    const bob = reduced ? 0 : Math.sin(now * 1.3) * 0.012;
    const out = THREE.MathUtils.lerp(THREE.MathUtils.lerp(0.2, 0, k), 0, s.hold);
    const y = THREE.MathUtils.lerp(THREE.MathUtils.lerp(0.6 + bob, 0.43, k), 0.43, s.hold);
    const tilt = THREE.MathUtils.lerp(THREE.MathUtils.lerp(0.62, 0.22, k), 0.14, s.hold);
    poseMallet(stick, s.angle, out, y, tilt, 0.16 * s.hold);

    // A slow drift toward the cursor.
    const target = 0.25 * s.pointerX;
    const yaw = Math.atan2(camera.position.x, camera.position.z);
    const next = yaw + (target - yaw) * (1 - Math.exp(-dt * 2));
    camera.position.set(Math.sin(next) * 3.05, 2.05, Math.cos(next) * 3.05);
    camera.lookAt(0, 0.26, 0);
  });

  return (
    <group>
      {/* The rug, and the sound rings spreading over it */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[RUG, 128]} />
        <meshStandardMaterial map={assets.rug} roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
        <planeGeometry args={[3.2, 3.2]} />
        <shaderMaterial
          ref={haloMat}
          uniforms={haloU}
          vertexShader={HALO_VERTEX}
          fragmentShader={HALO_FRAGMENT}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ring cushion */}
      <mesh position={[0, 0.072, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.55]} castShadow receiveShadow>
        <torusGeometry args={[0.4, 0.135, 32, 96]} />
        <meshPhysicalMaterial color="#6a2318" roughness={0.85} sheen={1} sheenColor="#e08a62" sheenRoughness={0.45} />
      </mesh>

      {/* The bowl and its water */}
      <group position={[0, SEAT, 0]}>
        <mesh geometry={assets.bowl} material={assets.bronze} castShadow receiveShadow />
        <mesh position={[0, WATER_Y, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[WATER_R, WATER_R, 1]} renderOrder={2}>
          <circleGeometry args={[1, 128]} />
          <shaderMaterial
            ref={waterMat}
            uniforms={waterU}
            vertexShader={WATER_VERTEX}
            fragmentShader={WATER_FRAGMENT}
            transparent
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* The striker: a turned wooden stick with a suede-wrapped end */}
      <group ref={mallet}>
        <mesh position={[0, 0.11, 0]} castShadow>
          <capsuleGeometry args={[0.036, 0.2, 8, 24]} />
          <meshPhysicalMaterial color="#4a3428" roughness={0.92} sheen={1} sheenColor="#9a7a62" sheenRoughness={0.6} />
        </mesh>
        <mesh position={[0, 0.62, 0]} castShadow>
          <cylinderGeometry args={[0.026, 0.03, 0.82, 24]} />
          <meshStandardMaterial color="#7a4e2c" roughness={0.42} />
        </mesh>
      </group>
    </group>
  );
}

function Lights() {
  const key = useRef<THREE.DirectionalLight>(null);
  useLayoutEffect(() => {
    const light = key.current;
    if (!light) return;
    const cam = light.shadow.camera;
    cam.left = -1.6;
    cam.right = 1.6;
    cam.top = 1.6;
    cam.bottom = -1.6;
    cam.near = 0.5;
    cam.far = 10;
    cam.updateProjectionMatrix();
    light.shadow.mapSize.set(2048, 2048);
    light.shadow.radius = 8;
    light.shadow.bias = -0.0004;
    light.shadow.normalBias = 0.015;
  }, []);
  return (
    <>
      <hemisphereLight args={["#ffe9d2", "#2a1d14", 0.55]} />
      <directionalLight ref={key} position={[-1.8, 3.4, 1.6]} intensity={2.6} color="#ffe2bf" castShadow />
      <directionalLight position={[2.2, 1.6, -2.4]} intensity={1.2} color="#bcd0ff" />
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#2a1e15"]} />
        <Lightformer intensity={3.2} color="#ffd9ad" position={[-3, 3.5, 2]} rotation={[0, Math.PI / 4, 0]} scale={[3, 2.2, 1]} />
        <Lightformer intensity={1.6} color="#b8c9ff" position={[3.5, 2, -2.5]} rotation={[0, -Math.PI / 3, 0]} scale={[1.2, 3, 1]} />
        <Lightformer intensity={1.2} color="#ffffff" position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[4, 4, 1]} />
        <Lightformer intensity={1.1} color="#ffcf9e" position={[0, 0.9, 4]} scale={[7, 1.4, 1]} />
        <Lightformer intensity={0.7} color="#ff9a5c" position={[-4, 0.5, -1]} rotation={[0, Math.PI / 2, 0]} scale={[4, 0.8, 1]} />
      </Environment>
    </>
  );
}

function Stage(props: { reduced: boolean; signal: React.RefObject<BowlSignal> }) {
  const viewport = useThree((s) => s.viewport);
  const fit = Math.min(viewport.width / 2.5, viewport.height / 2.25, 0.82);
  return (
    <group scale={fit} position={[0, -0.02, 0]}>
      <Lights />
      <Bowl {...props} />
    </group>
  );
}

/**
 * Yoga 6 · Stillwater — a hammered bronze singing bowl on its ring cushion.
 * Strike it and the water inside shivers in rings from its four-lobed song
 * while sound rings spread over the rug; rub the rim and the stick goes round,
 * the water building into standing ripples that follow it. Client-only.
 */
export default function BowlScene({
  active,
  reduced,
  signal,
}: {
  active: boolean;
  reduced: boolean;
  signal: React.RefObject<BowlSignal>;
}) {
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 30, position: [0, 2.05, 3.05], near: 0.1, far: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ camera }) => camera.lookAt(0, 0.26, 0)}
      style={{ pointerEvents: "none" }}
    >
      <Stage reduced={reduced} signal={signal} />
    </Canvas>
  );
}

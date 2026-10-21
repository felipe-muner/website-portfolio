// Yoga 6 · Stillwater — the lake: a mirror (three's Reflector) whose shader
// bends the reflection with a slow swell, fine chop and the rings the stones
// send out, darkens it by Fresnel and scatters sun glints.

import * as THREE from "three";
import { rng } from "./stones";

/** Ring slots on the water at once. */
export const RIPPLES = 8;

/** Uniforms the scene drives each frame. */
export type WaterUniforms = {
  uTime: THREE.IUniform<number>;
  uRipples: THREE.IUniform<THREE.Vector4[]>;
  uRippleR0: THREE.IUniform<number[]>;
  uSunDir: THREE.IUniform<THREE.Vector3>;
  uChop: THREE.IUniform<THREE.Texture | null>;
};

const VERTEX = /* glsl */ `
  uniform mat4 textureMatrix;
  varying vec4 vUv;
  varying vec3 vWorld;

  void main() {
    vUv = textureMatrix * vec4(position, 1.0);
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 color;
  uniform sampler2D tDiffuse;
  uniform sampler2D uChop;
  uniform float uTime;
  uniform vec4 uRipples[${RIPPLES}];   // x, z, start time, strength
  uniform float uRippleR0[${RIPPLES}]; // radius each ring starts from
  uniform vec3 uDeep;
  uniform vec3 uHaze;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  varying vec4 vUv;
  varying vec3 vWorld;

  // The swell: long, slow, low waves (analytic slope).
  vec2 swell(vec2 p, float t) {
    vec2 d1 = vec2(0.12, 0.99);
    vec2 d2 = vec2(-0.6, 0.8);
    vec2 d3 = vec2(0.906, 0.423);
    return d1 * (1.9 * 0.010) * cos(dot(p, d1) * 1.9 + t * 0.55)
         + d2 * (2.7 * 0.006) * cos(dot(p, d2) * 2.7 + t * 0.8)
         + d3 * (4.3 * 0.0035) * cos(dot(p, d3) * 4.3 - t * 1.05);
  }

  // Rings: a widening, fading packet of crests that leaves the stone's edge.
  vec2 rings(vec2 p, float t) {
    vec2 g = vec2(0.0);
    for (int i = 0; i < ${RIPPLES}; i++) {
      vec4 r = uRipples[i];
      float age = t - r.z;
      if (r.w <= 0.0 || age <= 0.0 || age > 8.0) continue;
      vec2 off = p - r.xy;
      float d = length(off) + 1e-4;
      float x = d - uRippleR0[i] - age * 0.5;
      float w = 0.06 + age * 0.07;
      float env = exp(-x * x / (w * w)) * exp(-age * 0.42) * r.w;
      float k = 24.0 / (1.0 + age * 0.3);
      float slope = env * (k * cos(k * x) - 2.0 * x / (w * w) * sin(k * x));
      slope *= smoothstep(-0.02, 0.1, d - uRippleR0[i]);
      g += slope * off / d;
    }
    return g;
  }

  void main() {
    vec2 p = vWorld.xz;
    vec3 toEye = cameraPosition - vWorld;
    float dist = length(toEye);
    vec3 V = toEye / dist;

    vec2 slope = swell(p, uTime) + rings(p, uTime);
    // Fine chop from two drifting normal maps, calmer far out where it would shimmer.
    vec2 c1 = texture2D(uChop, p * 0.21 + vec2(uTime * 0.012, uTime * 0.007)).xy * 2.0 - 1.0;
    vec2 c2 = texture2D(uChop, p * 0.47 - vec2(uTime * 0.009, -uTime * 0.013)).xy * 2.0 - 1.0;
    float near = 1.0 - smoothstep(6.0, 40.0, dist);
    slope += (c1 + c2) * 0.035 * (0.3 + 0.7 * near);
    vec3 n = normalize(vec3(-slope.x, 1.0, -slope.y));

    // The mirror image, bent by the waves — more in depth than across, like real water.
    vec4 uv = vUv;
    uv.xy += vec2(n.x * 0.5, n.z) * 0.11 * uv.w;
    vec3 reflected = texture2DProj(tDiffuse, uv).rgb;

    float facing = max(dot(n, V), 0.0);
    float fresnel = 0.02 + 0.98 * pow(1.0 - facing, 5.0);
    fresnel = mix(fresnel, 1.0, 0.38);
    vec3 col = mix(uDeep, reflected, fresnel);

    // Sun glints on the chop.
    vec3 R = reflect(-V, n);
    col += uSunColor * pow(max(dot(R, uSunDir), 0.0), 700.0) * 2.4;

    // Haze toward the far shore.
    col = mix(col, uHaze, smoothstep(40.0, 300.0, dist) * 0.4);
    gl_FragColor = vec4(col, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/** A fresh water shader for the Reflector (it clones the uniforms it's given). */
export function waterShader() {
  return {
    name: "StillwaterLake",
    uniforms: {
      color: { value: null },
      tDiffuse: { value: null },
      textureMatrix: { value: null },
      uChop: { value: null },
      uTime: { value: 0 },
      uRipples: { value: Array.from({ length: RIPPLES }, () => new THREE.Vector4()) },
      uRippleR0: { value: Array.from({ length: RIPPLES }, () => 0) },
      uDeep: { value: new THREE.Color("#0a1216") },
      uHaze: { value: new THREE.Color("#4a4148") },
      uSunDir: { value: new THREE.Vector3(0, 0.05, -1).normalize() },
      uSunColor: { value: new THREE.Color("#ffd2a0").multiplyScalar(4) },
    },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
  };
}

/** Tileable chop normals: a sum of waves with whole-number wavenumbers, so it wraps seamlessly. */
export function chopTexture(): THREE.DataTexture {
  const N = 256;
  const random = rng(5);
  const waves: { kx: number; ky: number; amp: number; phase: number }[] = [];
  while (waves.length < 34) {
    const angle = random() * Math.PI * 2;
    const k = 3 + random() * 22;
    const kx = Math.round(Math.cos(angle) * k);
    const ky = Math.round(Math.sin(angle) * k);
    if (kx === 0 && ky === 0) continue;
    waves.push({ kx, ky, amp: 1 / (1 + Math.hypot(kx, ky) * 0.4), phase: random() * Math.PI * 2 });
  }
  const height = new Float32Array(N * N);
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      let h = 0;
      for (const w of waves) h += w.amp * Math.sin(((w.kx * x + w.ky * y) / N) * Math.PI * 2 + w.phase);
      height[y * N + x] = h;
    }
  }
  const data = new Uint8Array(N * N * 4);
  const at = (x: number, y: number) => height[((y + N) % N) * N + ((x + N) % N)];
  const v = new THREE.Vector3();
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      v.set(-(at(x + 1, y) - at(x - 1, y)) * 2.2, -(at(x, y + 1) - at(x, y - 1)) * 2.2, 1).normalize();
      const i = (y * N + x) * 4;
      data[i] = Math.round((v.x * 0.5 + 0.5) * 255);
      data[i + 1] = Math.round((v.y * 0.5 + 0.5) * 255);
      data[i + 2] = Math.round((v.z * 0.5 + 0.5) * 255);
      data[i + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(data, N, N, THREE.RGBAFormat);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

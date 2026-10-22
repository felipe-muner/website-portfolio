// Golden Hour — the sea: a plane whose shader mixes a deep body colour with
// the sky it reflects (by Fresnel), ruffles it with a slow swell and fine
// chop, and lays the sun's glitter path across it toward the viewer. No
// mirror pass — the whole thing is one draw.

import * as THREE from "three";
import type { Daylight } from "./daylight";
import { tint } from "./sky";

/** Small, seedable PRNG (mulberry32) so the chop texture is the same every visit. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const WATER_VERTEX = /* glsl */ `
  varying vec3 vWorld;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

export const WATER_FRAGMENT = /* glsl */ `
  uniform sampler2D uChop;
  uniform float uTime;
  uniform vec3 uDeep;
  uniform vec3 uSurface;
  uniform vec3 uHorizon;
  uniform vec3 uGlow;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform float uGlitter;
  varying vec3 vWorld;

  // The swell: long, slow waves rolling in toward the beach (analytic slope).
  vec2 swell(vec2 p, float t) {
    vec2 d1 = vec2(0.08, 0.997);
    vec2 d2 = vec2(-0.5, 0.866);
    vec2 d3 = vec2(0.906, 0.423);
    return d1 * (1.3 * 0.03) * cos(dot(p, d1) * 1.3 + t * 0.9)
         + d2 * (2.1 * 0.016) * cos(dot(p, d2) * 2.1 + t * 1.1)
         + d3 * (3.7 * 0.008) * cos(dot(p, d3) * 3.7 - t * 1.4);
  }

  void main() {
    vec2 p = vWorld.xz;
    vec3 toEye = cameraPosition - vWorld;
    float dist = length(toEye);
    vec3 V = toEye / dist;

    vec2 slope = swell(p, uTime);
    vec2 c1 = texture2D(uChop, p * 0.18 + vec2(uTime * 0.02, uTime * 0.011)).xy * 2.0 - 1.0;
    vec2 c2 = texture2D(uChop, p * 0.41 - vec2(uTime * 0.013, -uTime * 0.019)).xy * 2.0 - 1.0;
    float near = 1.0 - smoothstep(5.0, 60.0, dist);
    slope += (c1 + c2) * 0.06 * (0.35 + 0.65 * near);
    vec3 n = normalize(vec3(-slope.x, 1.0, -slope.y));

    // Looking down you see the water; looking out you see the sky in it.
    float facing = max(dot(n, V), 0.0);
    float fresnel = 0.03 + 0.97 * pow(1.0 - facing, 5.0);
    fresnel = mix(fresnel, 1.0, 0.25);
    vec3 skyRef = mix(uSurface, uHorizon, smoothstep(8.0, 220.0, dist));
    // The sky is brightest toward the sun, so the water is too.
    vec2 toSun = normalize(uSunDir.xz);
    vec2 look = normalize(-V.xz);
    float towardSun = pow(max(dot(toSun, look), 0.0), 3.0);
    float sunLow = exp(-abs(uSunDir.y) * 6.0);
    skyRef += uGlow * towardSun * (0.12 + 0.5 * sunLow) * smoothstep(-0.12, 0.0, uSunDir.y);
    vec3 col = mix(uDeep, skyRef, fresnel);

    // The glitter path: a tight sparkle on the chop over a soft, wide road.
    vec3 R = reflect(-V, n);
    float s = max(dot(R, uSunDir), 0.0);
    float sparkle = pow(s, 360.0);
    float road = pow(s, 28.0);
    col += uSunColor * (sparkle * 2.4 + road * 0.22) * uGlitter;

    // Haze toward the horizon.
    col = mix(col, uHorizon, smoothstep(60.0, 420.0, dist) * 0.65);

    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export type WaterUniforms = {
  uChop: THREE.IUniform<THREE.Texture | null>;
  uTime: THREE.IUniform<number>;
  uDeep: THREE.IUniform<THREE.Color>;
  uSurface: THREE.IUniform<THREE.Color>;
  uHorizon: THREE.IUniform<THREE.Color>;
  uGlow: THREE.IUniform<THREE.Color>;
  uSunDir: THREE.IUniform<THREE.Vector3>;
  uSunColor: THREE.IUniform<THREE.Color>;
  uGlitter: THREE.IUniform<number>;
};

export function waterUniforms(chop: THREE.Texture): WaterUniforms {
  return {
    uChop: { value: chop },
    uTime: { value: 0 },
    uDeep: { value: new THREE.Color("#1b3a62") },
    uSurface: { value: new THREE.Color("#cf7a5a") },
    uHorizon: { value: new THREE.Color("#ffb46a") },
    uGlow: { value: new THREE.Color("#ff8c48") },
    uSunDir: { value: new THREE.Vector3(0.3, 0.05, -1).normalize() },
    uSunColor: { value: new THREE.Color("#ffd2a0") },
    uGlitter: { value: 1 },
  };
}

/** Drive the sea from the hour's daylight (call once a frame). */
export function paintWater(u: WaterUniforms, d: Daylight, sun: THREE.Vector3, time: number) {
  u.uSunDir.value.copy(sun);
  tint(u.uDeep.value, d.deep);
  tint(u.uSurface.value, d.surface);
  tint(u.uHorizon.value, d.horizon);
  tint(u.uGlow.value, d.glow, 0.9);
  tint(u.uSunColor.value, d.sun, 3);
  u.uGlitter.value = d.glitter;
  u.uTime.value = time;
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

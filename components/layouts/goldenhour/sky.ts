// Golden Hour — the sky: a dome behind everything whose colours, sun, glow
// and stars are driven each frame from `daylight()`. Noon is white-blue and
// hard; by sunset the sun is a fat red disc with a band of fire along the
// horizon; after it goes the dome turns magenta, then indigo, and the stars
// come out. One hazy island sits off to the left for scale.

import * as THREE from "three";
import type { Daylight, Rgb } from "./daylight";

/** Write an sRGB triple into a three colour (converted to the working space), optionally boosted for HDR. */
export function tint(colour: THREE.Color, rgb: Rgb, boost = 1): THREE.Color {
  return colour.setRGB(rgb[0], rgb[1], rgb[2], THREE.SRGBColorSpace).multiplyScalar(boost);
}

export const SKY_VERTEX = /* glsl */ `
  varying vec3 vWorld;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

export const SKY_FRAGMENT = /* glsl */ `
  uniform vec3 uSunDir;
  uniform vec3 uZenith;
  uniform vec3 uSky;
  uniform vec3 uHorizon;
  uniform vec3 uGlow;
  uniform vec3 uSun;
  uniform vec3 uLand;
  uniform vec3 uBelow;
  uniform float uStars;
  uniform float uSunSize;
  uniform float uTime;
  varying vec3 vWorld;

  float gh_hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  // A soft-shouldered hill: height (as elevation) at angle offset x.
  float hill(float x, float centre, float width, float height) {
    float u = (x - centre) / width;
    return height * exp(-u * u);
  }

  void main() {
    vec3 d = normalize(vWorld - cameraPosition);
    float el = d.y;
    float a = atan(d.x, -d.z);
    float sunA = atan(uSunDir.x, -uSunDir.z);
    float da = a - sunA;
    float ang = acos(clamp(dot(d, uSunDir), -1.0, 1.0));
    float sunEl = uSunDir.y;

    // Horizon haze up to the zenith.
    vec3 col = mix(uHorizon, uSky, smoothstep(0.0, 0.2, el));
    col = mix(col, uZenith, smoothstep(0.12, 0.65, el));
    // Dimmer away from the sun — the lower the sun, the more so.
    float low = 1.0 - smoothstep(0.0, 0.5, sunEl);
    col *= mix(1.0, mix(0.68, 1.0, exp(-abs(da) * 1.2)), low);

    // The glow: a wide bloom, a tight halo and a band hugging the horizon that
    // catches fire when the sun is on it.
    float bloom = exp(-ang * 4.5);
    float halo = exp(-ang * 18.0);
    float band = exp(-abs(da) * 1.4) * exp(-max(el, 0.0) * 18.0);
    float nearHorizon = exp(-abs(sunEl) * 6.0);
    col += uGlow * (bloom * 0.3 + halo * 0.7 + band * (0.3 + 0.7 * nearHorizon));

    // Stars: more of them, and brighter, the darker it gets.
    vec3 cell = floor(d * 240.0);
    float h = gh_hash(cell);
    float star = step(1.0 - 0.0035 * uStars, h);
    vec3 inCell = fract(d * 240.0) - 0.5;
    float twinkle = 0.65 + 0.35 * sin(uTime * (1.0 + gh_hash(cell + 3.1) * 2.0) + gh_hash(cell + 7.7) * 6.28);
    col += vec3(0.85, 0.88, 1.0) * star * smoothstep(0.26, 0.0, length(inCell)) * twinkle
         * smoothstep(0.03, 0.3, el) * uStars * 0.9;

    // The sun: a disc with a soft limb and a little corona.
    float disc = smoothstep(uSunSize, uSunSize * 0.8, ang);
    col += uSun * 0.08 * exp(-ang * 45.0);
    col = mix(col, uSun, disc);

    // A hazy island off to the left.
    float island = hill(a, -0.62, 0.15, 0.021) * (1.0 + 0.1 * sin(a * 57.0)) + hill(a, -0.47, 0.06, 0.009);
    float land = smoothstep(island + 0.0009, island - 0.0009, el) * step(0.0005, island);
    col = mix(col, mix(uHorizon, uLand, 0.72) + uGlow * band * 0.06, land);

    // Below the horizon (only ever seen past the sea's far edge).
    col = mix(col, uBelow, smoothstep(0.0, -0.004, el));

    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export type SkyUniforms = {
  uSunDir: THREE.IUniform<THREE.Vector3>;
  uZenith: THREE.IUniform<THREE.Color>;
  uSky: THREE.IUniform<THREE.Color>;
  uHorizon: THREE.IUniform<THREE.Color>;
  uGlow: THREE.IUniform<THREE.Color>;
  uSun: THREE.IUniform<THREE.Color>;
  uLand: THREE.IUniform<THREE.Color>;
  uBelow: THREE.IUniform<THREE.Color>;
  uStars: THREE.IUniform<number>;
  uSunSize: THREE.IUniform<number>;
  uTime: THREE.IUniform<number>;
};

export function skyUniforms(): SkyUniforms {
  return {
    uSunDir: { value: new THREE.Vector3(0.3, 0.05, -1).normalize() },
    uZenith: { value: new THREE.Color("#3a4f8f") },
    uSky: { value: new THREE.Color("#c0707a") },
    uHorizon: { value: new THREE.Color("#ffb46a") },
    uGlow: { value: new THREE.Color("#ff8c48") },
    uSun: { value: new THREE.Color("#ffcf8e") },
    uLand: { value: new THREE.Color("#1c1626") },
    uBelow: { value: new THREE.Color("#1b3a62") },
    uStars: { value: 0 },
    uSunSize: { value: 0.024 },
    uTime: { value: 0 },
  };
}

/** Drive the dome from the hour's daylight (call once a frame). */
export function paintSky(u: SkyUniforms, d: Daylight, sun: THREE.Vector3, time: number) {
  u.uSunDir.value.copy(sun);
  tint(u.uZenith.value, d.zenith);
  tint(u.uSky.value, d.sky);
  tint(u.uHorizon.value, d.horizon);
  tint(u.uGlow.value, d.glow, 0.9);
  tint(u.uSun.value, d.sun, 5);
  tint(u.uLand.value, d.silhouette, 1.8);
  tint(u.uBelow.value, d.deep);
  u.uStars.value = d.stars;
  u.uSunSize.value = d.sunSize;
  u.uTime.value = time;
}

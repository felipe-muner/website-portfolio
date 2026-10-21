// Yoga 6 · Stillwater — the dusk sky: deep teal overhead, haze at the
// horizon, a low sun with its bloom, misty islands, a few early stars. Drawn
// on a dome behind everything (it reflects in the lake like the rest).

import * as THREE from "three";

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
  uniform vec3 uFar;
  uniform vec3 uNear;
  uniform vec3 uBelow;
  uniform float uTime;
  varying vec3 vWorld;

  float sw_hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  // A soft-shouldered hill: height (as elevation) at angle offset x.
  float hill(float x, float centre, float width, float height) {
    float u = (x - centre) / width;
    return height * exp(-u * u) ;
  }

  void main() {
    // Ray from whichever camera is drawing (the lake's mirror camera too).
    vec3 d = normalize(vWorld - cameraPosition);
    float el = d.y;
    float a = atan(d.x, -d.z);
    float sunA = atan(uSunDir.x, -uSunDir.z);
    float da = a - sunA;
    float ang = acos(clamp(dot(d, uSunDir), -1.0, 1.0));

    // Haze at the horizon up to deep teal; dimmer away from the sun.
    vec3 col = mix(uHorizon, uSky, smoothstep(0.0, 0.17, el));
    col = mix(col, uZenith, smoothstep(0.1, 0.6, el));
    col *= mix(0.62, 1.0, exp(-abs(da) * 1.3));

    // The glow: a soft bloom, a tight halo, and a warm band hugging the horizon.
    float bloom = exp(-ang * 5.5);
    float halo = exp(-ang * 22.0);
    float band = exp(-abs(da) * 1.6) * exp(-max(el, 0.0) * 24.0);
    col += uGlow * (bloom * 0.28 + halo * 0.9 + band * 0.8);

    // A few early stars, high up and away from the sun.
    vec3 cell = floor(d * 260.0);
    float star = step(0.9975, sw_hash(cell));
    vec3 inCell = fract(d * 260.0) - 0.5;
    float twinkle = 0.6 + 0.4 * sin(uTime * (1.0 + sw_hash(cell + 3.1) * 2.0) + sw_hash(cell + 7.7) * 6.28);
    col += vec3(0.75, 0.8, 0.9) * star * smoothstep(0.24, 0.0, length(inCell)) * twinkle
         * smoothstep(0.16, 0.45, el) * smoothstep(0.35, 1.2, ang) * 0.7;

    // The sun, low over the water, with a little corona.
    float disc = smoothstep(0.0105, 0.0088, ang);
    col += uSun * 0.06 * exp(-ang * 70.0);
    col = mix(col, uSun, disc);

    // Islands: a hazy far range, a bigger island left of the sun, a long low
    // ridge to the right and a little islet by the sun — misty at the foot.
    float edge = 0.0009;
    float far = 0.0065 + 0.0025 * sin(a * 9.0 + 2.0) + 0.0012 * sin(a * 27.0 + 1.0);
    float left = hill(da, -0.36, 0.17, 0.03) * (1.0 + 0.08 * sin(a * 61.0)) + hill(da, -0.24, 0.07, 0.011);
    float right = hill(da, 0.33, 0.26, 0.019) * (1.0 + 0.1 * sin(a * 47.0 + 2.0)) + hill(da, 0.52, 0.09, 0.008);
    float islet = hill(da, 0.085, 0.026, 0.0075);
    float mist = smoothstep(0.0, 0.02, el);
    float hazeFar = smoothstep(far + edge, far - edge, el);
    col = mix(col, mix(uHorizon, uFar, 0.45), hazeFar * 0.8);
    float nearIslands = max(max(left, right), islet);
    float land = smoothstep(nearIslands + edge, nearIslands - edge, el) * step(0.0005, nearIslands);
    vec3 islandCol = mix(mix(uHorizon, uFar, 0.6), uNear, 0.35 + 0.65 * mist);
    col = mix(col, islandCol + uGlow * band * 0.08, land);

    // Below the horizon: only seen past the lake's far edge.
    col = mix(col, uBelow, smoothstep(0.0, -0.004, el));

    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export type SkyUniforms = {
  uSunDir: THREE.IUniform<THREE.Vector3>;
  uTime: THREE.IUniform<number>;
};

export function skyUniforms() {
  return {
    uSunDir: { value: new THREE.Vector3(0, 0.05, -1).normalize() },
    uZenith: { value: new THREE.Color("#0a1723") },
    uSky: { value: new THREE.Color("#22384b") },
    uHorizon: { value: new THREE.Color("#6a5e66") },
    uGlow: { value: new THREE.Color("#ff9450").multiplyScalar(0.9) },
    uSun: { value: new THREE.Color("#ffe2b0").multiplyScalar(6) },
    uFar: { value: new THREE.Color("#3b3843") },
    uNear: { value: new THREE.Color("#17191f") },
    uBelow: { value: new THREE.Color("#22232a") },
    uTime: { value: 0 },
  };
}

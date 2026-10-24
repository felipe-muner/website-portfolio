import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { Trade } from "@/lib/previews/trades";

/**
 * The shapes each trade's particle hero morphs through, as point clouds.
 * Every shape is a few simple meshes whose surfaces we scatter points over,
 * fitted to the same box so the morphs line up. Adding a trade (carpenter:
 * saw → hammer → plank…) is just another list here.
 */

/** A set of meshes and the share of the points they get (small parts need a boost to read). */
type Group = { parts: THREE.BufferGeometry[]; share: number };
export type ShapeMaker = (count: number) => Float32Array;

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

function scatter(parts: THREE.BufferGeometry[], count: number, out: Float32Array, offset: number) {
  const merged = mergeGeometries(
    parts.map((g) => {
      const clean = new THREE.BufferGeometry();
      clean.setAttribute("position", (g.index ? g.toNonIndexed() : g).getAttribute("position"));
      return clean;
    }),
  );
  if (!merged) throw new Error("Could not merge shape parts");
  const sampler = new MeshSurfaceSampler(new THREE.Mesh(merged)).build();
  const p = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    sampler.sample(p);
    out.set([p.x, p.y, p.z], (offset + i) * 3);
  }
  merged.dispose();
}

/** Centre the cloud and scale it so its widest side is `size`. */
function fit(points: Float32Array, size = 2.75) {
  const box = new THREE.Box3().setFromArray(points);
  const center = box.getCenter(new THREE.Vector3());
  const extent = box.getSize(new THREE.Vector3());
  const k = size / Math.max(extent.x, extent.y, extent.z);
  for (let i = 0; i < points.length; i += 3) {
    points[i] = (points[i] - center.x) * k;
    points[i + 1] = (points[i + 1] - center.y) * k + 0.1;
    points[i + 2] = (points[i + 2] - center.z) * k;
  }
  return points;
}

function shape(groups: Group[], size?: number): ShapeMaker {
  return (count) => {
    const out = new Float32Array(count * 3);
    let offset = 0;
    groups.forEach(({ parts, share }, i) => {
      const n = i === groups.length - 1 ? count - offset : Math.round(count * share);
      scatter(parts, n, out, offset);
      offset += n;
    });
    groups.forEach(({ parts }) => parts.forEach((g) => g.dispose()));
    return fit(out, size);
  };
}

const tube = (points: THREE.Vector3[], radius: number, segments = 96) =>
  new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), segments, radius, 14);

/** A four-point sparkle with curved sides, puffed up like the chrome star in the references. */
function star(radius: number, waist: number) {
  const s = new THREE.Shape();
  s.moveTo(0, radius);
  s.quadraticCurveTo(waist, waist, radius, 0);
  s.quadraticCurveTo(waist, -waist, 0, -radius);
  s.quadraticCurveTo(-waist, -waist, -radius, 0);
  s.quadraticCurveTo(-waist, waist, 0, radius);
  return new THREE.ExtrudeGeometry(s, {
    depth: radius * 0.18,
    bevelEnabled: true,
    bevelThickness: radius * 0.08,
    bevelSize: radius * 0.05,
    bevelSegments: 4,
    curveSegments: 24,
  }).translate(0, 0, -radius * 0.09);
}

/* ---------------------------------- Plumbing ---------------------------------- */

const faucet = () =>
  shape([
    {
      share: 0.62,
      parts: [
        // Gooseneck spout
        tube([v(0, -0.85, 0), v(0, 0.45, 0), v(0.08, 0.95, 0), v(0.45, 1.18, 0), v(0.82, 0.98, 0), v(0.9, 0.62, 0)], 0.1, 140),
        new THREE.CylinderGeometry(0.3, 0.34, 0.14, 40).translate(0, -0.9, 0),
        // Lever
        new THREE.CylinderGeometry(0.06, 0.06, 0.55, 14).rotateZ(Math.PI / 2.6).translate(-0.26, 0.25, 0),
      ],
    },
    // The basin's rim, under the spout
    { share: 0.16, parts: [new THREE.TorusGeometry(1, 0.05, 10, 120).rotateX(Math.PI / 2).scale(0.85, 1, 0.55).translate(0.9, -1.0, 0.25)] },
    // Running water, and its splash ring where it lands
    {
      share: 0.22,
      parts: [
        new THREE.CylinderGeometry(0.035, 0.06, 1.55, 16, 8, true).translate(0.9, -0.2, 0),
        new THREE.TorusGeometry(0.16, 0.02, 8, 48).rotateX(Math.PI / 2).translate(0.9, -0.98, 0),
      ],
    },
  ]);

const drop = () => {
  const profile: THREE.Vector2[] = [];
  for (let i = 0; i <= 48; i++) {
    const t = Math.PI * (1 - i / 48);
    profile.push(new THREE.Vector2(Math.sin(t) * Math.pow(Math.sin(t / 2), 1.4) * 0.95, Math.cos(t) * 1.25));
  }
  return shape([
    { share: 0.84, parts: [new THREE.LatheGeometry(profile, 72)] },
    {
      share: 0.16,
      parts: [
        new THREE.SphereGeometry(0.17, 24, 16).translate(1.15, -0.65, 0.2),
        new THREE.SphereGeometry(0.11, 20, 12).translate(-1.05, -0.9, -0.3),
        new THREE.SphereGeometry(0.08, 16, 12).translate(0.9, 0.55, 0.1),
      ],
    },
  ]);
};

const wrench = () => {
  const s = new THREE.Shape();
  s.moveTo(-0.15, -1.1);
  s.absarc(0, -1.1, 0.15, Math.PI, 0, false);
  s.lineTo(0.15, 0.55);
  s.absarc(0, 0.95, 0.48, -1.2, 0.87, false);
  s.lineTo(0.12, 1.12);
  s.lineTo(-0.12, 1.12);
  s.lineTo(-0.31, 1.32);
  s.absarc(0, 0.95, 0.48, 2.27, 4.34, false);
  s.lineTo(-0.15, -1.1);
  const body = new THREE.ExtrudeGeometry(s, {
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.03,
    bevelSegments: 3,
    curveSegments: 32,
  });
  const nut = new THREE.CylinderGeometry(0.17, 0.17, 0.22, 6).rotateX(Math.PI / 2).translate(0, 1.32, 0.1);
  return shape([
    { share: 0.86, parts: [body.rotateZ(-0.62)] },
    { share: 0.14, parts: [nut.rotateZ(-0.62)] },
  ]);
};

/* ------------------------------------ AC ------------------------------------- */

const acUnit = () => {
  const airflow = [-1.05, -0.62, -0.2, 0.2, 0.62, 1.05].map((x) =>
    tube([v(x, 0.38, 0.32), v(x * 1.05, 0.0, 0.85), v(x * 1.15, -0.55, 1.1), v(x * 1.3, -1.15, 1.0)], 0.022, 64),
  );
  return shape([
    { share: 0.5, parts: [new RoundedBoxGeometry(2.8, 0.8, 0.62, 4, 0.18).translate(0, 0.78, 0)] },
    {
      share: 0.14,
      parts: [0.42, 0.34].map((y) => new THREE.BoxGeometry(2.3, 0.025, 0.1).translate(0, y, 0.3)),
    },
    { share: 0.36, parts: airflow },
  ]);
};

const snowflake = () => {
  const parts: THREE.BufferGeometry[] = [new THREE.CylinderGeometry(0.22, 0.22, 0.12, 6).rotateX(Math.PI / 2)];
  for (let k = 0; k < 6; k++) {
    const angle = (k * Math.PI) / 3;
    parts.push(new THREE.BoxGeometry(0.11, 1.45, 0.11).translate(0, 0.72, 0).rotateZ(angle));
    for (const [dist, length] of [
      [0.6, 0.42],
      [1.05, 0.3],
    ]) {
      for (const tilt of [Math.PI / 4, -Math.PI / 4]) {
        parts.push(
          new THREE.BoxGeometry(0.08, length, 0.08)
            .translate(0, length / 2, 0)
            .rotateZ(tilt)
            .translate(0, dist, 0)
            .rotateZ(angle),
        );
      }
    }
  }
  return shape([{ share: 1, parts }]);
};

/** A swirl of cold air: three rising helices and the rings they leave. */
const vortex = () => {
  const helices = [0, 1, 2].map((h) => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 80; i++) {
      const t = i / 80;
      const angle = t * Math.PI * 4 + (h * Math.PI * 2) / 3;
      const r = 0.2 + t * 1.15;
      points.push(v(Math.cos(angle) * r, -1.15 + t * 2.4, Math.sin(angle) * r));
    }
    return tube(points, 0.035, 220);
  });
  const rings = [
    [-0.5, 0.5],
    [0.25, 0.95],
    [1.0, 1.3],
  ].map(([y, r]) => new THREE.TorusGeometry(r, 0.018, 8, 96).rotateX(Math.PI / 2).translate(0, y, 0));
  return shape([
    { share: 0.72, parts: helices },
    { share: 0.28, parts: rings },
  ]);
};

/* --------------------------------- Cleaning ---------------------------------- */

const bubbles = () =>
  shape([
    {
      share: 1,
      parts: (
        [
          [0, 0.1, 0, 0.85],
          [1.05, 0.7, -0.2, 0.45],
          [-1.0, 0.85, 0.2, 0.5],
          [0.9, -0.65, 0.3, 0.32],
          [-0.85, -0.55, -0.2, 0.28],
          [0.25, 1.25, 0.1, 0.22],
          [-0.2, -1.05, 0.4, 0.18],
        ] as const
      ).map(([x, y, z, r]) => new THREE.SphereGeometry(r, 48, 32).translate(x, y, z)),
    },
  ]);

const house = () => {
  const s = new THREE.Shape();
  s.moveTo(-1, -1);
  s.lineTo(1, -1);
  s.lineTo(1, 0.3);
  s.lineTo(0, 1.2);
  s.lineTo(-1, 0.3);
  s.lineTo(-1, -1);
  const door = new THREE.Path();
  door.moveTo(-0.22, -0.92);
  door.lineTo(0.22, -0.92);
  door.lineTo(0.22, -0.2);
  door.lineTo(-0.22, -0.2);
  door.lineTo(-0.22, -0.92);
  const window = new THREE.Path();
  window.absarc(0, 0.38, 0.2, 0, Math.PI * 2, false);
  s.holes.push(door, window);
  const body = new THREE.ExtrudeGeometry(s, {
    depth: 0.5,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.04,
    bevelSegments: 2,
    curveSegments: 24,
  }).translate(0, 0, -0.25);
  return shape([
    {
      share: 0.86,
      parts: [body, new THREE.BoxGeometry(0.24, 0.5, 0.24).translate(0.55, 0.85, 0)],
    },
    { share: 0.14, parts: [star(0.32, 0.05).translate(1.15, 1.05, 0)] },
  ]);
};

const sparkles = () =>
  shape([
    { share: 0.7, parts: [star(1.25, 0.18)] },
    { share: 0.3, parts: [star(0.45, 0.07).translate(1.2, 0.95, 0.2), star(0.3, 0.05).translate(-1.15, -0.85, -0.2)] },
  ]);

/** Each trade's shapes, in order. Built on demand: the meshes are only needed once. */
export const SHAPES: Record<Trade, () => ShapeMaker[]> = {
  plumbing: () => [faucet(), drop(), wrench()],
  hvac: () => [acUnit(), snowflake(), vortex()],
  cleaning: () => [bubbles(), house(), sparkles()],
};

/** Where every hero starts: a glowing sphere, like the references' intro. */
export function sphere(count: number) {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random() * 2 - 1;
    const a = Math.random() * Math.PI * 2;
    const r = 1.15 * Math.cbrt(0.85 + Math.random() * 0.15);
    const s = Math.sqrt(1 - u * u);
    out.set([Math.cos(a) * s * r, u * r + 0.1, Math.sin(a) * s * r], i * 3);
  }
  return out;
}

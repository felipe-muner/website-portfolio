"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import type { ToppingKey } from "@/lib/layouts/beanbowl";
import {
  BASE_EMPTY,
  BASE_FULL,
  ROWS,
  ROW_TOP,
  SPRINKLES,
  SURFACE_R,
  bananaTexture,
  bandPieces,
  bandWidth,
  blobTexture,
  blueberryGeometry,
  bowlGeometry,
  bowlTextures,
  chiaGeometry,
  clamp01,
  coconutGeometry,
  granolaGeometry,
  honeyPath,
  innerRadius,
  kiwiTexture,
  mangoGeometry,
  rng,
  sliceGeometry,
  smoothieGeometry,
  smoothstep,
  sprinkles,
  strawberrySliceGeometry,
  strawberryTexture,
  surfaceAt,
  type Piece,
  type RowKey,
  type Sprinkle,
  type SprinkleKey,
} from "./bowl-parts";

/* Intro timing (seconds after the bowl first comes on screen). */
const FILL_TIME = 1.0;
const ROW_GAP = 0.34;

/* Motion, in bowl units (the bowl is about 1.75 across). */
const SQUASH_K = 520;
const SQUASH_C = 13;
/** How each kind of topping falls: gravity, air drag, bounce, and squash on landing. */
interface Feel {
  gravity: number;
  drag: number;
  bounce: number;
  squash: number;
}
const FRUIT: Feel = { gravity: 5.5, drag: 0, bounce: 0.22, squash: 1 };
const CHIA: Feel = { gravity: 7, drag: 0, bounce: 0.12, squash: 0 };
const FLAKE: Feel = { gravity: 2.6, drag: 3.5, bounce: 0, squash: 0 };

const WHITE = new THREE.Color("#ffffff");
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

/* ------------------------------------------------------------------ */
/* Motion: drop in under gravity, bounce, squash, leave                */
/* ------------------------------------------------------------------ */

const GONE = 0;
const WAITING = 1;
const IN = 2;
const LEAVING = 3;

/** Per-piece motion for one instanced topping. */
interface Track {
  on: boolean;
  /** Height above the resting spot, and its velocity. */
  y: Float32Array;
  vy: Float32Array;
  /** Presence, 0..1 (scales the piece in and out). */
  s: Float32Array;
  /** Squash (+ = flattened by a landing), and its velocity. */
  sq: Float32Array;
  vsq: Float32Array;
  wait: Float32Array;
  mode: Uint8Array;
  enter: Float32Array;
  leave: Float32Array;
  drop: Float32Array;
}

function makeTrack(items: readonly { enter: number; drop: number }[], leaveSpread: number): Track {
  const n = items.length;
  const last = Math.max(1e-3, ...items.map((i) => i.enter));
  return {
    on: false,
    y: new Float32Array(n),
    vy: new Float32Array(n),
    s: new Float32Array(n),
    sq: new Float32Array(n),
    vsq: new Float32Array(n),
    wait: new Float32Array(n),
    mode: new Uint8Array(n),
    enter: Float32Array.from(items, (i) => i.enter),
    // Leave in reverse order of arrival.
    leave: Float32Array.from(items, (i) => leaveSpread * (1 - i.enter / last)),
    drop: Float32Array.from(items, (i) => i.drop),
  };
}

const isEmpty = (t: Track) => t.mode.every((m) => m === GONE);

/** Switch a topping on or off; pieces mid-exit turn round instead of starting over. */
function request(t: Track, on: boolean) {
  if (on === t.on) return;
  t.on = on;
  for (let k = 0; k < t.mode.length; k++) {
    if (on) {
      if (t.mode[k] === LEAVING) t.mode[k] = IN;
      else if (t.mode[k] === GONE) {
        t.mode[k] = WAITING;
        t.wait[k] = t.enter[k];
      }
    } else if (t.mode[k] === WAITING) {
      t.mode[k] = GONE;
    } else if (t.mode[k] === IN) {
      t.mode[k] = LEAVING;
      t.wait[k] = t.leave[k];
    }
  }
}

function step(t: Track, feel: Feel, dt: number, reduced: boolean) {
  for (let k = 0; k < t.mode.length; k++) {
    if (reduced) {
      if (t.mode[k] === WAITING) t.mode[k] = IN;
      if (t.mode[k] === LEAVING) t.mode[k] = GONE;
      t.y[k] = 0;
      t.vy[k] = 0;
      t.sq[k] = 0;
      t.vsq[k] = 0;
      t.s[k] = t.mode[k] === IN ? 1 : 0;
      continue;
    }
    if (t.mode[k] === WAITING) {
      t.wait[k] -= dt;
      if (t.wait[k] > 0) continue;
      t.mode[k] = IN;
      t.y[k] = t.drop[k];
      t.vy[k] = 0;
      t.s[k] = 0;
    }
    if (t.mode[k] === IN) {
      t.s[k] = Math.min(1, t.s[k] + dt / 0.14);
      if (t.y[k] < 0) {
        // Something slid in underneath: rise onto it.
        t.y[k] -= t.y[k] * Math.min(1, dt * 14);
        t.vy[k] = 0;
      } else if (t.y[k] > 0 || t.vy[k] !== 0) {
        t.vy[k] += (-feel.gravity - t.vy[k] * feel.drag) * dt;
        t.y[k] += t.vy[k] * dt;
        if (t.y[k] <= 0) {
          const impact = -t.vy[k];
          t.y[k] = 0;
          if (impact > 0.3 && feel.bounce > 0) {
            t.vy[k] = impact * feel.bounce;
            t.vsq[k] += Math.min(3.2, impact) * 1.25 * feel.squash;
          } else {
            t.vy[k] = 0;
          }
        }
      }
    } else if (t.mode[k] === LEAVING) {
      t.wait[k] -= dt;
      if (t.wait[k] <= 0) {
        // Lifted out: rise a little while shrinking away.
        t.s[k] = Math.max(0, t.s[k] - dt / 0.24);
        t.y[k] += dt * 0.25;
        t.vy[k] = 0;
        if (t.s[k] === 0) {
          t.mode[k] = GONE;
          t.y[k] = 0;
        }
      }
    }
    if (feel.squash > 0) {
      t.vsq[k] += (-SQUASH_K * t.sq[k] - SQUASH_C * t.vsq[k]) * dt;
      t.sq[k] += t.vsq[k] * dt;
    }
  }
}

interface RowMotion {
  track: Track;
  x: number;
  vx: number;
  target: number;
  /** How much of the band is down on the smoothie, 0..1 (sprinkles and honey rest on it). */
  presence: number;
}

interface SprinkleMotion {
  track: Track;
  /** Current resting height of each sprinkle (it rides on whatever is beneath). */
  rest: Float32Array;
}

interface Motion {
  rows: Record<RowKey, RowMotion>;
  sprinkles: Record<SprinkleKey, SprinkleMotion>;
  /** Band width, eased as toppings come and go. */
  band: number;
  bandV: number;
}

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

const HONEY_RINGS = 640;
const HONEY_RADIAL = 10;
const HONEY_RADIUS = 0.0052;

interface BowlProps {
  base: string;
  toppings: ReadonlySet<ToppingKey>;
  reduced: boolean;
  start: boolean;
}

function Bowl({ base, toppings, reduced, start }: BowlProps) {
  const assets = useMemo(() => {
    const r = rng(17);
    const rows = Object.fromEntries(ROWS.map((k) => [k, bandPieces(k, r)])) as Record<RowKey, Piece[]>;
    const path = honeyPath();
    const honey = new THREE.TubeGeometry(path, HONEY_RINGS, HONEY_RADIUS, HONEY_RADIAL, false);
    return {
      rows,
      sprinkles: {
        coconut: sprinkles(14, 0.008, SURFACE_R - 0.06, 0.7, r),
        chia: sprinkles(180, 0.006, SURFACE_R - 0.03, 0.5, r),
      } satisfies Record<SprinkleKey, Sprinkle[]>,
      bowl: bowlGeometry(),
      bowlTex: bowlTextures(),
      shadow: blobTexture(),
      smoothie: smoothieGeometry(),
      honey,
      honeyRing: Array.from({ length: HONEY_RINGS + 1 }, (_, j) => path.getPointAt(j / HONEY_RINGS)),
      honeyBaseY: Float32Array.from({ length: honey.attributes.position.count }, (_, i) => honey.attributes.position.getY(i)),
      cap: new THREE.SphereGeometry(HONEY_RADIUS, 14, 10),
      geo: {
        banana: sliceGeometry(0.07, 0.019, 1.3),
        kiwi: sliceGeometry(0.075, 0.022, 4.1),
        strawberry: strawberrySliceGeometry(),
        blueberry: blueberryGeometry(),
        mango: mangoGeometry(),
        granola: granolaGeometry(),
        coconut: coconutGeometry(),
        chia: chiaGeometry(),
      } satisfies Record<RowKey | SprinkleKey, THREE.BufferGeometry>,
      tex: {
        banana: bananaTexture(),
        kiwi: kiwiTexture(),
        strawberry: strawberryTexture(),
      },
    };
  }, []);

  const mats = useMemo(
    () => ({
      banana: new THREE.MeshPhysicalMaterial({ map: assets.tex.banana, roughness: 0.48, clearcoat: 0.25, clearcoatRoughness: 0.35 }),
      kiwi: new THREE.MeshPhysicalMaterial({ map: assets.tex.kiwi, roughness: 0.3, clearcoat: 0.45, clearcoatRoughness: 0.2 }),
      strawberry: [
        new THREE.MeshPhysicalMaterial({ map: assets.tex.strawberry, roughness: 0.28, clearcoat: 0.6, clearcoatRoughness: 0.2 }),
        new THREE.MeshPhysicalMaterial({ color: "#b30f28", roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.2 }),
      ],
      blueberry: new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        roughness: 0.55,
        sheen: 1,
        sheenColor: new THREE.Color("#a3acd9"),
        sheenRoughness: 0.5,
      }),
      mango: new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.22, clearcoat: 0.7, clearcoatRoughness: 0.2 }),
      granola: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.82 }),
      coconut: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55, side: THREE.DoubleSide }),
      chia: new THREE.MeshStandardMaterial({ color: "#2a2724", roughness: 0.4 }),
    }),
    [assets],
  );

  useEffect(
    () => () => {
      const { bowl, bowlTex, shadow, smoothie, honey, cap, geo, tex } = assets;
      for (const d of [bowl, bowlTex.map, bowlTex.glaze, shadow, smoothie, honey, cap, ...Object.values(geo), ...Object.values(tex)]) d.dispose();
    },
    [assets],
  );
  useEffect(
    () => () => {
      for (const m of Object.values(mats).flat()) m.dispose();
    },
    [mats],
  );

  const group = useRef<THREE.Group>(null);
  const surface = useRef<THREE.Mesh>(null);
  const surfaceMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const honeyMesh = useRef<THREE.Mesh>(null);
  const honeyStart = useRef<THREE.Mesh>(null);
  const honeyEnd = useRef<THREE.Mesh>(null);
  const meshes = useRef<Partial<Record<RowKey | SprinkleKey, THREE.InstancedMesh>>>({});
  const motion = useRef<Motion | null>(null);
  const state = useRef({ intro: reduced ? 1000 : 0, time: 0, honey: 0, color: new THREE.Color(base), pointerX: 0 });
  const scratch = useRef({
    m: new THREE.Matrix4(),
    squash: new THREE.Matrix4(),
    q: new THREE.Quaternion(),
    e: new THREE.Euler(),
    s: new THREE.Vector3(),
    origin: new THREE.Vector3(),
    target: new THREE.Color(),
    ringHeights: new Float32Array(HONEY_RINGS + 1),
  });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "touch") state.current.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    const g = group.current;
    const top = surface.current;
    const topMat = surfaceMat.current;
    const drizzle = honeyMesh.current;
    const capA = honeyStart.current;
    const capB = honeyEnd.current;
    if (!g || !top || !topMat || !drizzle || !capA || !capB) return;
    const st = state.current;
    const dt = Math.min(delta, 1 / 30);
    if (start) st.intro += dt;
    st.time += dt;
    const { m, squash, q, e, s: sc, origin, target, ringHeights } = scratch.current;
    const instanced = (key: RowKey | SprinkleKey) => {
      const cached = meshes.current[key];
      if (cached) return cached;
      const found = g.getObjectByName(key);
      if (found instanceof THREE.InstancedMesh) meshes.current[key] = found;
      return meshes.current[key];
    };
    const mo = (motion.current ??= {
      rows: Object.fromEntries(
        ROWS.map((k) => [k, { track: makeTrack(assets.rows[k], 0.16), x: 0, vx: 0, target: 0, presence: 0 }]),
      ) as Record<RowKey, RowMotion>,
      sprinkles: Object.fromEntries(
        SPRINKLES.map((k) => [
          k,
          { track: makeTrack(assets.sprinkles[k], 0.12), rest: new Float32Array(assets.sprinkles[k].length).fill(BASE_FULL) },
        ]),
      ) as Record<SprinkleKey, SprinkleMotion>,
      band: bandWidth(ROWS.filter((k) => toppings.has(k)).length),
      bandV: 0,
    });

    // Smoothie: fills on arrival, takes on the chosen base colour.
    const fill = easeOutCubic(clamp01(st.intro / FILL_TIME));
    const level = BASE_EMPTY + (BASE_FULL - BASE_EMPTY) * fill;
    const radius = innerRadius(level) - 0.003;
    top.position.y = level;
    top.scale.set(radius, radius, 1);
    target.set(base);
    st.color.lerp(target, reduced ? 1 : 1 - Math.exp(-dt * 4));
    // A touch deeper than the swatch: studio light lifts it back to the real colour.
    topMat.color.copy(st.color).multiplyScalar(0.78);
    topMat.sheenColor.copy(st.color).lerp(WHITE, 0.5); // a soft bloom of the base's own colour

    // Bands: the chosen toppings share the bowl's width side by side, and
    // glide (and widen or narrow) when that changes.
    const chosen = ROWS.filter((k) => toppings.has(k));
    const width = bandWidth(chosen.length);
    const w = 8.5; // critically damped
    if (reduced) {
      mo.band = width;
      mo.bandV = 0;
    } else {
      mo.bandV += (w * w * (width - mo.band) - 2 * w * mo.bandV) * dt;
      mo.band += mo.bandV * dt;
    }
    const half = mo.band / 2;
    for (const key of ROWS) {
      const row = mo.rows[key];
      const slot = chosen.indexOf(key);
      const want = slot >= 0 && st.intro > FILL_TIME + slot * ROW_GAP;
      if (slot >= 0) row.target = (slot - (chosen.length - 1) / 2) * width;
      if (want && !row.track.on && isEmpty(row.track)) {
        row.x = row.target; // a fresh band drops straight into its place
        row.vx = 0;
      }
      request(row.track, want);
      if (reduced) {
        row.x = row.target;
        row.vx = 0;
      } else {
        row.vx += (w * w * (row.target - row.x) - 2 * w * row.vx) * dt;
        row.x += row.vx * dt;
      }
      step(row.track, FRUIT, dt / 2, reduced);
      step(row.track, FRUIT, dt / 2, reduced);

      const t = row.track;
      const pieces = assets.rows[key];
      let down = 0;
      for (let k = 0; k < pieces.length; k++) {
        down += t.mode[k] === IN ? t.s[k] * (t.y[k] < 0.04 ? 1 : 0) : t.mode[k] === LEAVING ? t.s[k] : 0;
      }
      row.presence += (down / pieces.length - row.presence) * Math.min(1, dt * 10);

      const mesh = instanced(key);
      if (!mesh) continue;
      for (let k = 0; k < pieces.length; k++) {
        const piece = pieces[k];
        const px = row.x + piece.dx;
        const reach = Math.sqrt(Math.max(0, SURFACE_R * SURFACE_R - px * px));
        // Pieces only show inside their band and the bowl, easing out at the edges.
        const fit =
          smoothstep(half + 0.004, half - 0.03, Math.abs(piece.dx) + piece.foot * 0.55) *
          smoothstep(-0.01, 0.045, reach - Math.abs(piece.dz) - piece.foot * 0.4);
        const size = piece.scale * t.s[k] * fit;
        if (size < 1e-3) {
          m.makeScale(0, 0, 0);
        } else {
          q.setFromEuler(piece.rot);
          m.compose(origin, q, sc.setScalar(size));
          m.premultiply(squash.makeScale(1 + t.sq[k] * 0.5, 1 - t.sq[k], 1 + t.sq[k] * 0.5));
          m.setPosition(px, surfaceAt(px, piece.dz) + piece.lift + t.y[k] - t.sq[k] * 0.02 * size, piece.dz);
        }
        mesh.setMatrixAt(k, m);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }

    /**
     * Height of whatever is on top at x: the bands blended where they meet (so
     * honey drapes smoothly from one to the next), easing down to bare smoothie.
     */
    const cover = (x: number) => {
      let weight = 0;
      let height = 0;
      for (const key of ROWS) {
        const row = mo.rows[key];
        if (row.presence < 0.01) continue;
        const w = row.presence * smoothstep(half + 0.045, half - 0.045, Math.abs(x - row.x));
        weight += w;
        height += w * ROW_TOP[key];
      }
      return height / Math.max(1, weight);
    };

    // Sprinkles rain in last and settle on whatever is beneath them.
    const finish = FILL_TIME + chosen.length * ROW_GAP;
    for (const key of SPRINKLES) {
      const { track: t, rest } = mo.sprinkles[key];
      request(t, toppings.has(key) && st.intro > finish + (key === "chia" ? 0.25 : 0));
      const spots = assets.sprinkles[key];
      for (let k = 0; k < spots.length; k++) {
        const f = spots[k];
        const next = surfaceAt(f.x, f.z) + cover(f.x) + f.lift;
        t.y[k] += rest[k] - next; // keep its height when the ground moves; gravity takes it from there
        rest[k] = next;
      }
      const feel = key === "coconut" ? FLAKE : CHIA;
      step(t, feel, dt / 2, reduced);
      step(t, feel, dt / 2, reduced);
      const mesh = instanced(key);
      if (!mesh) continue;
      for (let k = 0; k < spots.length; k++) {
        const f = spots[k];
        if (t.s[k] < 1e-3) {
          m.makeScale(0, 0, 0);
        } else {
          // Coconut flutters and tumbles on the way down.
          const air = key === "coconut" ? Math.min(1, t.y[k] / 0.25) : 0;
          e.set(
            f.rot.x + Math.cos(f.phase * 1.7 + st.time * 5) * 0.5 * air,
            f.rot.y,
            f.rot.z + Math.sin(f.phase + st.time * 5.5) * 0.7 * air,
          );
          q.setFromEuler(e);
          m.compose(origin, q, sc.setScalar(t.s[k]));
          m.setPosition(f.x + Math.sin(f.phase + st.time * 6) * 0.03 * air, rest[k] + t.y[k], f.z);
        }
        mesh.setMatrixAt(k, m);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }

    // Honey: drizzled back and forth from one end, draped over whatever it crosses.
    const honeyOn = toppings.has("honey") && st.intro > finish + 0.55;
    st.honey = reduced ? (honeyOn ? 1 : 0) : clamp01(st.honey + ((honeyOn ? 1 : -1) * dt) / 1.6);
    const shown = Math.round(easeInOutSine(st.honey) * HONEY_RINGS);
    drizzle.visible = shown > 0;
    capA.visible = shown > 0;
    capB.visible = shown > 0;
    if (shown > 0) {
      const pos = drizzle.geometry.attributes.position;
      for (let j = 0; j <= HONEY_RINGS; j++) {
        const c = assets.honeyRing[j];
        ringHeights[j] = surfaceAt(c.x, c.z) + cover(c.x) + HONEY_RADIUS + 0.003;
        for (let i = 0; i <= HONEY_RADIAL; i++) {
          const v = j * (HONEY_RADIAL + 1) + i;
          pos.setY(v, assets.honeyBaseY[v] + ringHeights[j]);
        }
      }
      pos.needsUpdate = true;
      drizzle.geometry.setDrawRange(0, shown * 6 * HONEY_RADIAL);
      const a = assets.honeyRing[0];
      const b = assets.honeyRing[shown];
      capA.position.set(a.x, ringHeights[0], a.z);
      capB.position.set(b.x, ringHeights[shown], b.z);
    }

    // A slow turntable, nudged by the cursor.
    if (!reduced) g.rotation.y += dt * 0.1;
    g.rotation.x += (st.pointerX * 0.03 - g.rotation.x) * (reduced ? 1 : 1 - Math.exp(-dt * 3));
  });

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[2.4, 2.4]} />
        <meshBasicMaterial map={assets.shadow} transparent depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0005, 0]} receiveShadow>
        <planeGeometry args={[3.6, 3.6]} />
        <shadowMaterial transparent opacity={0.18} />
      </mesh>
      <group ref={group}>
        <mesh geometry={assets.bowl} castShadow receiveShadow>
          <meshPhysicalMaterial
            map={assets.bowlTex.map}
            roughnessMap={assets.bowlTex.glaze}
            clearcoatMap={assets.bowlTex.glaze}
            roughness={1}
            clearcoat={1}
            clearcoatRoughness={0.16}
          />
        </mesh>
        <mesh ref={surface} geometry={assets.smoothie} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <meshPhysicalMaterial
            ref={surfaceMat}
            vertexColors
            roughness={0.58}
            sheen={0.22}
            sheenRoughness={0.5}
            clearcoat={0.1}
            clearcoatRoughness={0.5}
            envMapIntensity={0.7}
          />
        </mesh>

        {ROWS.map((key) => (
          <instancedMesh
            key={key}
            name={key}
            args={[assets.geo[key], mats[key], assets.rows[key].length]}
            castShadow
            receiveShadow
            frustumCulled={false}
          />
        ))}
        {SPRINKLES.map((key) => (
          <instancedMesh
            key={key}
            name={key}
            args={[assets.geo[key], mats[key], assets.sprinkles[key].length]}
            castShadow
            frustumCulled={false}
          />
        ))}

        <mesh ref={honeyMesh} geometry={assets.honey} frustumCulled={false} castShadow>
          <meshPhysicalMaterial color="#c9800f" emissive="#7a3700" emissiveIntensity={0.16} roughness={0.04} clearcoat={1} clearcoatRoughness={0.02} transparent opacity={0.9} />
        </mesh>
        <mesh ref={honeyStart} geometry={assets.cap}>
          <meshPhysicalMaterial color="#c9800f" emissive="#7a3700" emissiveIntensity={0.16} roughness={0.04} clearcoat={1} clearcoatRoughness={0.02} transparent opacity={0.9} />
        </mesh>
        <mesh ref={honeyEnd} geometry={assets.cap}>
          <meshPhysicalMaterial color="#c9800f" emissive="#7a3700" emissiveIntensity={0.16} roughness={0.04} clearcoat={1} clearcoatRoughness={0.02} transparent opacity={0.9} />
        </mesh>
      </group>
    </>
  );
}

/** Soft studio light: a big key from the upper left, a cool rim from behind, softboxes for the gloss. */
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
    light.shadow.radius = 7;
    light.shadow.bias = -0.0003;
    light.shadow.normalBias = 0.012;
  }, []);
  return (
    <>
      <hemisphereLight args={["#fffaf2", "#e2d2bb", 0.85]} />
      <directionalLight ref={key} position={[-1.7, 3.6, 1.3]} intensity={2.7} color="#fff3e2" castShadow />
      <directionalLight position={[1.9, 2.2, -2.4]} intensity={1.3} color="#eef3ff" />
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={3} position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[6, 6, 1]} />
        <Lightformer intensity={2.2} position={[-4, 2.5, 1.5]} rotation={[0, Math.PI / 2, 0]} scale={[2.5, 5, 1]} />
        <Lightformer intensity={1.4} position={[4, 2, 1]} rotation={[0, -Math.PI / 2, 0]} scale={[2, 4, 1]} />
        <Lightformer intensity={0.8} color="#ffe0bd" position={[0, 1, 5]} scale={[6, 1.5, 1]} />
      </Environment>
    </>
  );
}

function Stage(props: BowlProps) {
  const viewport = useThree((s) => s.viewport);
  const fit = Math.min(viewport.width / 2.08, viewport.height / 1.98, 1.2);
  return (
    <group scale={fit} position={[0, -0.24, 0]}>
      <Lights />
      <Bowl {...props} />
    </group>
  );
}

/**
 * Bean & Bowl — the bowl builder's 3D bowl: a stoneware bowl whose smoothie
 * fills, then toppings fall into bands across it (with a little bounce and
 * squash), finished with coconut, chia and a honey drizzle that settle on
 * whatever is beneath. Reacts live to the base and toppings. Client-only.
 */
export default function BowlScene({
  active,
  start,
  reduced,
  base,
  toppings,
}: {
  active: boolean;
  /** Begin the build (fill, then bands) — the bowl is properly on screen. */
  start: boolean;
  reduced: boolean;
  /** Smoothie colour, as CSS hex. */
  base: string;
  toppings: ReadonlySet<ToppingKey>;
}) {
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 24, position: [0, 3.55, 2.45], near: 0.1, far: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ camera }) => camera.lookAt(0, 0.3, 0)}
      style={{ pointerEvents: "none" }}
    >
      <Stage base={base} toppings={toppings} reduced={reduced} start={start} />
    </Canvas>
  );
}

// The /portfolio hero swarm: one silhouette per business category the
// templates cover, then a browser window for "yours".

import { buildShapeSet, type ShapeSet, type ShapeSpec } from "@/components/layouts/particles/geometry";
import { BROWSER, COFFEE_CUP, DUMBBELL, LOTUS, SAILBOAT, VILLA } from "@/components/layouts/particles/shapes";

/** Shape order. The first five match the PORTFOLIO group slugs. */
export const SHAPE_KEYS = ["gym", "yoga", "villas", "local", "adventure", "yours"] as const;
export type ShapeKey = (typeof SHAPE_KEYS)[number];

const SPECS: Record<ShapeKey, ShapeSpec> = {
  gym: DUMBBELL,
  yoga: LOTUS,
  villas: VILLA,
  local: COFFEE_CUP,
  adventure: SAILBOAT,
  yours: BROWSER,
};

/** Index of a category's shape; anything unknown becomes "yours". */
export function shapeIndex(key: string): number {
  const i = (SHAPE_KEYS as readonly string[]).indexOf(key);
  return i < 0 ? SHAPE_KEYS.indexOf("yours") : i;
}

/** Point buffers for every shape, in SHAPE_KEYS order. */
export function buildShapes(count: number): ShapeSet {
  return buildShapeSet(
    SHAPE_KEYS.map((key) => SPECS[key]),
    count,
  );
}

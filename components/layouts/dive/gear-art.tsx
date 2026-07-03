import type { GearArt } from "@/lib/layouts/dive/catalog";

const CYAN = "#2ed3e8";

/**
 * Vector line-art per gear category — no stock photos, so the shop stays
 * self-contained and on-brand with the dark-ocean look.
 */
export function GearArt({ art, className }: { art: GearArt; className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-hidden="true"
      fill="none"
      stroke={CYAN}
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      {SHAPES[art]}
    </svg>
  );
}

const SHAPES: Record<GearArt, React.ReactNode> = {
  mask: (
    <g>
      <path d="M24 44 h72 a8 8 0 0 1 8 8 v10 a14 14 0 0 1 -14 14 h-14 l-6 -10 h-16 l-6 10 h-14 a14 14 0 0 1 -14 -14 v-10 a8 8 0 0 1 8 -8 z" />
      <path d="M40 44 v-6 a10 10 0 0 1 10 -10 h20 a10 10 0 0 1 10 10 v6" />
      <path d="M60 76 v18 a10 10 0 0 0 10 10 h6" stroke="#7fe3f0" />
    </g>
  ),
  fins: (
    <g>
      <path d="M40 20 h26 a8 8 0 0 1 8 8 v6 h-42 v-6 a8 8 0 0 1 8 -8 z" />
      <path d="M32 40 h50 c10 0 16 10 14 22 l-8 34 c-3 12 -17 12 -20 0 l-6 -28 c-2 -8 -8 -8 -10 0 l-6 28 c-3 12 -17 12 -20 0 l-8 -34 c-2 -12 4 -22 14 -22 z" transform="scale(0.94) translate(4 2)" />
      <path d="M46 58 v34 M74 58 v34" stroke="#7fe3f0" strokeWidth={2.4} />
    </g>
  ),
  wetsuit: (
    <g>
      <path d="M42 18 h36 a6 6 0 0 1 6 6 v2 a12 12 0 0 1 -12 12 h-24 a12 12 0 0 1 -12 -12 v-2 a6 6 0 0 1 6 -6 z" />
      <path d="M42 38 l-16 12 6 14 8 -6 v46 a4 4 0 0 0 4 4 h32 a4 4 0 0 0 4 -4 v-46 l8 6 6 -14 -16 -12" />
      <path d="M60 40 v62" stroke="#7fe3f0" strokeWidth={2.4} />
    </g>
  ),
  regulator: (
    <g>
      <rect x="22" y="34" width="26" height="26" rx="6" />
      <path d="M35 34 v-8 M35 60 v6" />
      <path d="M48 47 h16 a10 10 0 0 1 10 10 v0" />
      <circle cx="88" cy="66" r="22" />
      <path d="M88 50 a16 16 0 0 1 14 10" stroke="#7fe3f0" strokeWidth={2.4} />
      <circle cx="88" cy="66" r="6" fill={CYAN} stroke="none" />
    </g>
  ),
  bcd: (
    <g>
      <path d="M40 24 h40 M46 24 v10 M74 24 v10" />
      <path d="M34 34 h52 a10 10 0 0 1 10 10 v34 a14 14 0 0 1 -14 14 h-44 a14 14 0 0 1 -14 -14 v-34 a10 10 0 0 1 10 -10 z" />
      <rect x="52" y="30" width="16" height="66" rx="6" stroke="#7fe3f0" />
      <path d="M24 52 h-8 M96 52 h8" />
    </g>
  ),
  computer: (
    <g>
      <path d="M34 32 h52 M34 88 h52" strokeWidth={4} />
      <rect x="30" y="30" width="60" height="60" rx="14" />
      <rect x="42" y="42" width="36" height="36" rx="6" stroke="#7fe3f0" />
      <path d="M50 60 h20 M60 50 v20" strokeWidth={2.4} />
    </g>
  ),
  accessory: (
    <g>
      <rect x="34" y="20" width="30" height="54" rx="10" />
      <path d="M40 74 v20 a9 9 0 0 0 9 9 h0 a9 9 0 0 0 9 -9 v-20" />
      <path d="M43 34 h12 M43 44 h12" stroke="#7fe3f0" strokeWidth={2.4} />
      <path d="M64 40 l22 -10 M64 54 l22 10" />
    </g>
  ),
};

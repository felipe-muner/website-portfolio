import { COLORS, type ColorName, type Family } from "@/lib/layouts/sacolaria/catalog";

interface BagArtProps {
  family: Family;
  color: ColorName;
  className?: string;
}

/**
 * Ilustração vetorial da sacola — sem dependência de foto/stock.
 * "die-cut" = boca de palhaço (alça vazada); "tshirt" = alça camiseta.
 */
export function BagArt({ family, color, className }: BagArtProps) {
  const swatch = COLORS[color];
  const fill = swatch.hex;
  const opacity = swatch.translucent ? 0.55 : 1;
  const stroke = swatch.needsOutline ? "#c9ccc6" : "rgba(0,0,0,0.18)";
  const isTshirt = family !== "boca-palhaco";

  return (
    <svg
      viewBox="0 0 200 220"
      className={className}
      role="img"
      aria-label={`Sacola ${color}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`sheen-${family}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {isTshirt ? (
        <TshirtShape fill={fill} stroke={stroke} opacity={opacity} family={family} />
      ) : (
        <DieCutShape fill={fill} stroke={stroke} opacity={opacity} family={family} />
      )}

      {family === "reciclada" && <RecycleBadge />}
    </svg>
  );
}

function DieCutShape({
  fill,
  stroke,
  opacity,
  family,
}: {
  fill: string;
  stroke: string;
  opacity: number;
  family: Family;
}) {
  return (
    <g>
      <rect
        x="46"
        y="30"
        width="108"
        height="160"
        rx="6"
        fill={fill}
        fillOpacity={opacity}
        stroke={stroke}
        strokeWidth="2"
      />
      <rect x="46" y="30" width="108" height="160" rx="6" fill={`url(#sheen-${family})`} />
      {/* furo da alça (boca de palhaço) */}
      <rect
        x="82"
        y="44"
        width="36"
        height="13"
        rx="6.5"
        fill="#ffffff"
        stroke={stroke}
        strokeWidth="1.5"
      />
      {/* vinco vertical */}
      <line x1="100" y1="62" x2="100" y2="184" stroke="rgba(0,0,0,0.08)" strokeWidth="2" />
    </g>
  );
}

function TshirtShape({
  fill,
  stroke,
  opacity,
  family,
}: {
  fill: string;
  stroke: string;
  opacity: number;
  family: Family;
}) {
  // Corpo + duas alças (camiseta).
  const body = "M50 70 L50 196 Q50 200 54 200 L146 200 Q150 200 150 196 L150 70 Z";
  const handles =
    "M50 70 L50 54 Q50 50 54 50 L74 50 Q78 50 80 54 Q88 70 100 70 Q112 70 120 54 " +
    "Q122 50 126 50 L146 50 Q150 50 150 54 L150 70 Z";
  return (
    <g>
      <path d={handles} fill={fill} fillOpacity={opacity} stroke={stroke} strokeWidth="2" />
      <path d={body} fill={fill} fillOpacity={opacity} stroke={stroke} strokeWidth="2" />
      <path d={body} fill={`url(#sheen-${family})`} />
      {/* recorte central entre as alças */}
      <path
        d="M88 70 Q100 80 112 70"
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line x1="100" y1="86" x2="100" y2="194" stroke="rgba(0,0,0,0.07)" strokeWidth="2" />
    </g>
  );
}

function RecycleBadge() {
  return (
    <g transform="translate(118 150)">
      <circle cx="22" cy="22" r="20" fill="#ffffff" stroke="#2f8f57" strokeWidth="2" />
      <path
        d="M22 11 l5 8 -4 0 0 6 -4 0 0-6 -4 0 z M13 26 l4-7 2 3.5 5-2 2 3.5 -5 2 2 3.5 z M31 26 l-4-7 -2 3.5 -5-2 -2 3.5 5 2 -2 3.5 z"
        fill="#2f8f57"
        opacity="0.85"
      />
    </g>
  );
}

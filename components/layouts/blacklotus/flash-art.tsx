import { VIEWBOX, type FlashDesign } from "./flash";

/**
 * Black Lotus — a flash design as inline SVG, in `currentColor`. The same
 * strokes the 3D forearm wears, so the sheet and the try-on always agree.
 */
export function FlashArt({ design, className, title }: { design: FlashDesign; className?: string; title?: string }) {
  return (
    <svg
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {title && <title>{title}</title>}
      {design.strokes.map((s, i) => (
        <path key={i} d={s.d} strokeWidth={s.w} fill={s.fill ? "currentColor" : "none"} />
      ))}
    </svg>
  );
}

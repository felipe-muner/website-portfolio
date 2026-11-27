import Image from "next/image";
import Link from "next/link";
import type { ShowcaseEntry } from "@/lib/layouts/showcase";

const KEYFRAMES = `
@keyframes wall-up { from { transform: translateY(0) } to { transform: translateY(-50%) } }
@keyframes wall-down { from { transform: translateY(-50%) } to { transform: translateY(0) } }
@keyframes wall-left { from { transform: translateX(0) } to { transform: translateX(-50%) } }
@media (prefers-reduced-motion: reduce) { .wall-track { animation: none !important } }
`;

const DURATIONS = ["70s", "85s", "64s"];

/**
 * Three columns of real template screenshots drifting up and down behind a
 * slight tilt: the hero shows the work instead of empty space. Each track is
 * rendered twice so the -50% loop is seamless; hovering a column pauses it.
 */
export function HeroWall({ entries }: { entries: ShowcaseEntry[] }) {
  const columns = [0, 1, 2].map((c) => entries.filter((_, i) => i % 3 === c));

  return (
    <div
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-[56%] overflow-hidden lg:block"
      style={{
        maskImage: "linear-gradient(to right, transparent 0%, black 22%), linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    >
      <style>{KEYFRAMES}</style>
      <div className="pointer-events-auto absolute -inset-y-[18%] left-[6%] right-[-8%] grid grid-cols-3 gap-4 [transform:rotate(-7deg)]">
        {columns.map((col, c) => (
          <div key={c} className="group/col overflow-hidden">
            <div
              className="wall-track flex flex-col gap-4 group-hover/col:[animation-play-state:paused]"
              style={{ animation: `${c === 1 ? "wall-down" : "wall-up"} ${DURATIONS[c]} linear infinite` }}
            >
              {[...col, ...col].map((entry, i) => (
                <Shot key={`${entry.slug}-${i}`} entry={entry} eager={i < 3} hidden={i >= col.length} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Phone and tablet version: one row sliding sideways under the headline. */
export function HeroStrip({ entries }: { entries: ShowcaseEntry[] }) {
  return (
    <div
      className="relative -mx-6 overflow-hidden sm:-mx-10 lg:hidden"
      style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}
    >
      <style>{KEYFRAMES}</style>
      <div className="wall-track flex w-max gap-3" style={{ animation: "wall-left 60s linear infinite" }}>
        {[...entries, ...entries].map((entry, i) => (
          <div key={`${entry.slug}-${i}`} className="w-[62vw] max-w-[320px] shrink-0">
            <Shot entry={entry} eager={i < 3} hidden={i >= entries.length} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Shot({ entry, eager, hidden }: { entry: ShowcaseEntry; eager: boolean; hidden: boolean }) {
  return (
    <Link
      href={entry.href}
      target={entry.external ? "_blank" : undefined}
      rel={entry.external ? "noopener noreferrer" : undefined}
      tabIndex={hidden ? -1 : undefined}
      aria-hidden={hidden || undefined}
      className="group/shot relative block aspect-[1200/790] overflow-hidden rounded-xl bg-[#161311] ring-1 ring-white/10 transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:ring-[#e8590c]/70"
    >
      <Image
        src={`/img/rail/${entry.slug}.webp`}
        alt={hidden ? "" : `${entry.brand} — ${entry.detail}`}
        fill
        sizes="(min-width: 1024px) 18vw, 62vw"
        loading={eager ? "eager" : "lazy"}
        className="object-cover object-top"
      />
      <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/85 to-transparent px-3 pb-2.5 pt-6 text-sm font-medium text-[#f4f1ea] transition-transform duration-300 group-hover/shot:translate-y-0">
        {entry.name} <span className="text-[#f4f1ea]/55">· {entry.category}</span>
      </span>
    </Link>
  );
}

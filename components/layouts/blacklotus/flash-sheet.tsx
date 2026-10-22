import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/layouts/Reveal";
import { baht, FLASH, FLASH_SIZES } from "./flash";
import { FlashArt } from "./flash-art";
import { BookFlashLink, TryOnLink } from "./links";

/**
 * Black Lotus — the flash sheet: every design on paper, with its sizes and
 * prices. "Try on arm" sends it up to the forearm; "Book this" preselects it
 * in the form. A design tattooed once is stamped taken and retired.
 */
export function FlashSheet() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {FLASH.map((d, i) => (
        <li key={d.id} className="h-full">
          <Reveal delay={(i % 3) * 70} className="h-full">
            <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-[#14100e]/12 bg-[#f6efe1] shadow-[0_1px_0_rgba(20,16,14,0.08)]">
              <div className="relative aspect-square p-7 sm:p-9">
                <span className="absolute left-4 top-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#14100e]/45">
                  No. {String(i + 1).padStart(2, "0")}
                </span>
                <span className="absolute right-4 top-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#14100e]/45">
                  {d.style}
                </span>
                <FlashArt
                  design={d}
                  title={`${d.name} flash design`}
                  className={`size-full text-[#14100e] transition-transform duration-500 ${d.taken ? "opacity-30" : "group-hover:scale-[1.03]"}`}
                />
                {d.taken && (
                  <span className="font-display absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-sm border-[3px] border-[#c0262f] px-3 py-1 text-3xl uppercase tracking-[0.12em] text-[#c0262f]">
                    Taken
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col border-t border-dashed border-[#14100e]/20 p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-3xl leading-none text-[#14100e]">
                    {d.name} <span className="italic text-[#14100e]/45">{d.thai}</span>
                  </h3>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#14100e]/55">{d.artist}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#14100e]/65">{d.note}</p>
                <dl className="mt-4 grid grid-cols-3 gap-2 font-mono">
                  {FLASH_SIZES.map((s) => (
                    <div key={s.id} className="rounded-md bg-[#14100e]/[0.05] px-2.5 py-2">
                      <dt className="text-[9.5px] uppercase tracking-[0.2em] text-[#14100e]/45">
                        {s.label} · {s.cm}
                      </dt>
                      <dd className={`mt-1 text-[13px] ${d.taken ? "text-[#14100e]/35 line-through" : "text-[#14100e]"}`}>
                        {baht(d.prices[s.id])}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-auto flex items-center gap-2 pt-5">
                  {d.taken ? (
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#14100e]/50">
                      Retired · ask {d.artist} for a one-off redraw
                    </p>
                  ) : (
                    <>
                      <TryOnLink
                        designId={d.id}
                        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-[#14100e]/20 font-mono text-[11px] uppercase tracking-[0.18em] text-[#14100e] transition-colors hover:border-[#14100e] hover:bg-[#14100e] hover:text-[#efe7d8]"
                      >
                        Try on arm <ArrowUpRight className="size-3.5" />
                      </TryOnLink>
                      <BookFlashLink
                        designId={d.id}
                        className="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-[#c0262f] font-mono text-[11px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#14100e]"
                      >
                        Book this
                      </BookFlashLink>
                    </>
                  )}
                </div>
              </div>
            </article>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

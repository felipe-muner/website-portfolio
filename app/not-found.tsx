import Image from "next/image";
import Link from "next/link";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { MissingPath } from "@/components/layouts/portfolio/missing-path";
import { ALL_SITES } from "@/lib/layouts/registry";
import { TEMPLATES } from "@/lib/layouts/showcase";

const sans = Geist({ subsets: ["latin"], variable: "--font-pf-sans" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-pf-serif",
});
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-pf-mono" });

/** The newest showpieces — a dead link still lands somewhere worth seeing. */
const PICKS = TEMPLATES.filter((t) => !t.external).slice(0, 4);

/**
 * Site-wide 404, in the portfolio's look. `data-not-found` hides the legacy gym
 * header/footer the root layout still renders around unknown routes.
 */
export default function NotFound() {
  return (
    <div
      data-not-found
      className={`${sans.variable} ${serif.variable} ${mono.variable} relative isolate min-h-dvh overflow-hidden bg-[#05060f] font-[family-name:var(--font-pf-sans)] text-[#eef1fb] antialiased selection:bg-[#2f5bff]/40 [&_.font-mono]:font-[family-name:var(--font-pf-mono)] [&_.font-serif]:font-[family-name:var(--font-pf-serif)]`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(60%_55%_at_50%_35%,black,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-18rem] -z-10 size-[44rem] -translate-x-1/2 rounded-full bg-[#2f5bff]/[0.16] blur-[120px]"
      />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-[1200px] flex-col px-5 pb-12 pt-5 sm:px-8">
        <header className="flex items-center justify-between">
          <Link href="/portfolio" className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="size-6 rounded-full bg-[radial-gradient(circle_at_35%_30%,#b4c8ff,#2f5bff_55%,#0d1a66)] shadow-[0_0_18px_rgba(79,124,255,0.7)]"
            />
            <span className="text-[15px] font-medium tracking-[-0.01em]">Felipe Muner</span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 sm:inline">
              / Ready-made websites
            </span>
          </Link>
          <Link
            href="/portfolio#contact"
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
          >
            Contact
          </Link>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          <span className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-2.5 pr-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/60 backdrop-blur">
            <span className="size-2 shrink-0 rounded-full bg-[#ff6b6b] shadow-[0_0_10px_2px_rgba(255,107,107,0.6)]" />
            <span className="truncate normal-case tracking-normal">
              <MissingPath />
            </span>
            <span className="shrink-0">· 404</span>
          </span>

          <h1 className="mt-8 text-[clamp(2.8rem,8vw,6.5rem)] font-light leading-[0.95] tracking-[-0.045em]">
            This page doesn&apos;t exist.
            <br />
            <span className="bg-gradient-to-r from-white via-[#b9c9ff] to-[#5b84ff] bg-clip-text pr-[0.12em] font-serif text-[1.08em] italic tracking-[-0.02em] text-transparent">
              Yet.
            </span>
          </h1>
          <p className="mt-7 max-w-[32rem] text-[17px] leading-relaxed text-white/60">
            {`The link may be old or mistyped — but ${ALL_SITES.length} live websites are one click away. Pick the one you love and I'll make it yours.`}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/portfolio#templates"
              className="group inline-flex h-[52px] items-center gap-3 rounded-full bg-white pl-1.5 pr-6 text-[15px] font-medium text-[#05060f] shadow-[0_12px_44px_-12px_rgba(79,124,255,0.75)] transition hover:-translate-y-0.5"
            >
              <span className="grid size-10 place-items-center rounded-full bg-[#2f5bff] text-white transition-transform duration-300 group-hover:-rotate-45">
                <ArrowRight className="size-4" />
              </span>
              Browse templates
            </Link>
            <Link
              href="/showcase"
              className="inline-flex h-[52px] items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 text-[15px] text-white/80 backdrop-blur transition hover:border-white/30 hover:text-white"
            >
              Watch the reel <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>

        <section aria-label="Newest templates">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.24em] text-white/40">Or start with the newest</p>
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {PICKS.map((t) => (
              <li key={t.slug}>
                <Link
                  href={t.href}
                  className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-0.5 hover:border-white/25"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={t.cover}
                      alt={`${t.name} template`}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 px-4 py-3">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{t.name}</span>
                      <span className="block truncate font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                        {t.category}
                      </span>
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 text-white/40 transition group-hover:text-white" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

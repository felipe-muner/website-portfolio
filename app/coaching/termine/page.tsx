import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { Reveal } from "@/components/layouts/Reveal";
import { CoachSiteNav } from "@/components/layouts/coaching/site-nav";
import { CoachPageHeader } from "@/components/layouts/coaching/page-header";
import { TERMINE } from "@/lib/layouts/coaching";

export const metadata: Metadata = {
  title: "Aktuelle Termine · Jörg Panek",
  robots: { index: false },
};

const STATUS_STYLE: Record<string, string> = {
  "Plätze frei": "bg-[#e3ecdd] text-[#3a5a3a]",
  "Wenige Plätze": "bg-[#f6e9d6] text-[#9a6a2c]",
  Ausgebucht: "bg-black/10 text-black/50",
};

export default function TerminePage() {
  return (
    <>
      <CoachSiteNav />
      <CoachPageHeader
        title="Aktuelle Termine"
        intro="Workshops, TRE®-Gruppen und Abende für aufrichtige Kommunikation — in Bamberg und online."
        crumbs={[{ label: "Startseite", href: "/coaching" }, { label: "Aktuelle Termine" }]}
      />

      <section className="mx-auto max-w-4xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="space-y-4">
          {TERMINE.map((t, i) => {
            const full = t.status === "Ausgebucht";
            return (
              <Reveal key={t.title + t.date} delay={i * 70}>
                <article className="flex flex-col gap-5 rounded-[1.5rem] border border-black/10 bg-white p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-7">
                  <div className="flex w-full items-center gap-4 sm:w-44 sm:flex-col sm:items-start sm:gap-1 sm:border-r sm:border-black/10 sm:pr-6">
                    <CalendarDays className="size-5 text-[#b07a5b] sm:hidden" />
                    <div>
                      <p className="font-serif text-2xl font-light leading-none">{t.date}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-black/45">{t.weekday}</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className={`inline-block rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] ${STATUS_STYLE[t.status]}`}>
                      {t.status}
                    </span>
                    <h2 className="mt-3 font-serif text-2xl font-medium">{t.title}</h2>
                    <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-black/55">
                      <span className="flex items-center gap-1.5"><MapPin className="size-4" /> {t.place}</span>
                      <span>{t.note}</span>
                    </p>
                  </div>
                  <Link
                    href="/coaching/termin"
                    aria-disabled={full}
                    className={`flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition ${
                      full
                        ? "pointer-events-none border border-black/15 text-black/35"
                        : "bg-[#2c3a30] text-[#f4efe4] hover:brightness-110"
                    }`}
                  >
                    {full ? "Ausgebucht" : "Anmelden"} {!full && <ArrowRight className="size-4" />}
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={120}>
          <div className="mt-12 rounded-[1.5rem] bg-[#ece5d6] p-8 text-center">
            <p className="font-serif text-2xl font-light">Kein passender Termin dabei?</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-black/60">
              Einzel- und Paarsitzungen sind jederzeit nach Absprache möglich — online oder in Bamberg.
            </p>
            <Link href="/coaching/termin" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2c3a30] px-7 py-3.5 text-sm font-semibold text-[#f4efe4] transition hover:brightness-110">
              Termin vereinbaren <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

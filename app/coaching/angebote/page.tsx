import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/layouts/Reveal";
import { CoachSiteNav } from "@/components/layouts/coaching/site-nav";
import { CoachPageHeader } from "@/components/layouts/coaching/page-header";
import { OFFERINGS } from "@/lib/layouts/coaching";

export const metadata: Metadata = {
  title: "Mein Angebot · Jörg Panek",
  robots: { index: false },
};

const CLAY = "#b07a5b";

export default function AngebotePage() {
  return (
    <>
      <CoachSiteNav />
      <CoachPageHeader
        title="Mein Angebot"
        intro="Begleitung für Einzelne, Paare und Gruppen — online und in Bamberg. Wähle, was sich für dich stimmig anfühlt."
        crumbs={[{ label: "Startseite", href: "/coaching" }, { label: "Mein Angebot" }]}
      />

      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {OFFERINGS.map((o, i) => (
            <Reveal key={o.slug} delay={i * 80}>
              <Link
                href={`/coaching/angebote/${o.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-black/10 bg-white"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={o.image} alt={o.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  {o.recommended && (
                    <span className="absolute left-4 top-4 rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white" style={{ backgroundColor: CLAY }}>
                      Empfehlung
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h2 className="font-serif text-2xl font-medium">{o.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-black/60">{o.tagline}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-black/10 pt-4 text-sm">
                    <span className="text-black/50">{o.duration}</span>
                    <span className="flex items-center gap-1.5 font-semibold transition group-hover:gap-2.5" style={{ color: CLAY }}>
                      Mehr Infos <ArrowRight className="size-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

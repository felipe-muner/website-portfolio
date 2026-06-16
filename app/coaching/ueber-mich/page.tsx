import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/layouts/Reveal";
import { CoachSiteNav } from "@/components/layouts/coaching/site-nav";
import { CoachPageHeader } from "@/components/layouts/coaching/page-header";

export const metadata: Metadata = {
  title: "Über mich · Jörg Panek",
  robots: { index: false },
};

const CLAY = "#b07a5b";

const AUSBILDUNG = [
  { year: "2009", text: "Beginn der Arbeit als Begleiter, eigener Weg durch die Körperarbeit." },
  { year: "2014", text: "Ausbildung in traumasensibler Begleitung und Bindungstheorie." },
  { year: "2018", text: "Zertifizierung als TRE®-Provider (Tension & Trauma Release)." },
  { year: "2022", text: "Vertiefung in nervensystemorientierter Arbeit & Co-Regulation." },
] as const;

export default function UeberMichPage() {
  return (
    <>
      <CoachSiteNav />
      <CoachPageHeader
        title="Über mich"
        crumbs={[{ label: "Startseite", href: "/coaching" }, { label: "Über mich" }]}
      />

      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="grid items-start gap-12 lg:grid-cols-[0.8fr_1fr] lg:gap-20">
          <Reveal from="left">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] lg:sticky lg:top-28">
              <Image src="/img/layouts/coach-portrait.jpg" alt="Porträt von Jörg Panek" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal>
            <div>
              <h2 className="font-serif text-4xl font-light leading-[1.08] tracking-tight sm:text-5xl">
                Hallo, ich bin Jörg.
              </h2>
              <div className="mt-6 space-y-5 leading-relaxed text-black/70">
                <p>
                  Ich begleite Menschen dabei, ihrem Nervensystem wieder zu vertrauen. Mein Weg
                  begann mit eigener Erfahrung — mit der Frage, warum sich so vieles anstrengend
                  anfühlte, obwohl „eigentlich alles in Ordnung“ war.
                </p>
                <p>
                  Über Jahre der Ausbildung in traumasensibler Arbeit, Bindungstheorie und TRE®
                  entstand eine Praxis, die auf Sicherheit, Würde und Verbindung baut. Ich arbeite
                  nicht gegen Symptome, sondern schaffe Bedingungen, unter denen Regulation und
                  Heilung von selbst geschehen dürfen.
                </p>
                <p>
                  Ich arbeite in Bamberg und online — ruhig, klar und an deiner Seite. Was du
                  mitbringst, ist genug. Alles Weitere finden wir gemeinsam heraus.
                </p>
              </div>

              <blockquote className="mt-10 border-l-2 pl-5 font-serif text-2xl font-light italic" style={{ borderColor: CLAY }}>
                „Wir sind weit mehr als unsere Symptome.“
              </blockquote>

              <h3 className="mt-12 font-serif text-2xl font-medium">Mein Weg</h3>
              <div className="mt-6 space-y-5 border-l border-black/10 pl-6">
                {AUSBILDUNG.map((a) => (
                  <div key={a.year} className="relative">
                    <span className="absolute -left-[1.65rem] top-1.5 size-2.5 rounded-full" style={{ backgroundColor: CLAY }} />
                    <p className="font-serif text-xl" style={{ color: CLAY }}>{a.year}</p>
                    <p className="mt-1 text-sm leading-relaxed text-black/65">{a.text}</p>
                  </div>
                ))}
              </div>

              <Link href="/coaching/termin" className="mt-12 inline-flex items-center gap-3 rounded-full bg-[#2c3a30] px-8 py-4 text-sm font-semibold text-[#f4efe4] transition hover:brightness-110">
                Lern mich kennen — Termin vereinbaren <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

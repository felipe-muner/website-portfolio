import type { Metadata } from "next";
import { Clock, Mail, MapPin, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/layouts/Reveal";
import { CoachSiteNav } from "@/components/layouts/coaching/site-nav";
import { CoachPageHeader } from "@/components/layouts/coaching/page-header";

export const metadata: Metadata = {
  title: "Termin vereinbaren · Jörg Panek",
  robots: { index: false },
};

const CLAY = "#b07a5b";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#b07a5b]";

export default function TerminPage() {
  return (
    <>
      <CoachSiteNav />
      <CoachPageHeader
        title="Termin vereinbaren"
        intro="Schreib mir ein paar Zeilen — wir starten mit einem kostenlosen Kennenlerngespräch und finden heraus, ob es passt."
        crumbs={[{ label: "Startseite", href: "/coaching" }, { label: "Termin vereinbaren" }]}
      />

      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.7fr] lg:gap-16">
          {/* Form */}
          <Reveal>
            <form className="rounded-[1.75rem] border border-black/10 bg-white p-8 sm:p-10">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm font-medium">
                  Name
                  <input type="text" placeholder="Dein Name" className={fieldClass} />
                </label>
                <label className="block text-sm font-medium">
                  E-Mail
                  <input type="email" placeholder="dein@email.de" className={fieldClass} />
                </label>
                <label className="block text-sm font-medium">
                  Telefon <span className="text-black/40">(optional)</span>
                  <input type="tel" placeholder="+49 …" className={fieldClass} />
                </label>
                <label className="block text-sm font-medium">
                  Format
                  <select className={fieldClass} defaultValue="">
                    <option value="" disabled>Bitte wählen</option>
                    <option>Online</option>
                    <option>Praxis Bamberg</option>
                    <option>Noch unentschlossen</option>
                  </select>
                </label>
              </div>

              <label className="mt-5 block text-sm font-medium">
                Worum geht es?
                <select className={fieldClass} defaultValue="">
                  <option value="" disabled>Bitte wählen</option>
                  <option>Einzel-Sitzung</option>
                  <option>Paar-Sitzung</option>
                  <option>Langzeitbegleitung</option>
                  <option>Duo 2:1 Sitzung</option>
                  <option>TRE®</option>
                  <option>Workshop / Gruppe</option>
                </select>
              </label>

              <label className="mt-5 block text-sm font-medium">
                Deine Nachricht
                <textarea rows={5} placeholder="Erzähl mir gern, was dich gerade beschäftigt …" className={fieldClass} />
              </label>

              <label className="mt-5 flex items-start gap-3 text-sm text-black/60">
                <input type="checkbox" className="mt-1 size-4 accent-[#2c3a30]" />
                Ich habe die Datenschutzerklärung gelesen und bin einverstanden.
              </label>

              <button
                type="button"
                className="mt-7 w-full rounded-full bg-[#2c3a30] px-8 py-4 text-sm font-semibold text-[#f4efe4] transition hover:brightness-110 sm:w-auto"
              >
                Anfrage senden
              </button>
              <p className="mt-3 text-xs text-black/40">Demo-Formular — es werden keine Daten gesendet.</p>
            </form>
          </Reveal>

          {/* Aside */}
          <Reveal delay={120}>
            <aside className="space-y-8">
              <div className="rounded-[1.75rem] bg-[#2c3a30] p-8 text-[#f4efe4]">
                <h2 className="font-serif text-2xl font-light">So läuft es ab</h2>
                <ul className="mt-5 space-y-4 text-sm text-[#f4efe4]/80">
                  <li className="flex gap-3"><span className="font-serif text-lg text-[#d8b48f]">1.</span> Du schickst deine Anfrage.</li>
                  <li className="flex gap-3"><span className="font-serif text-lg text-[#d8b48f]">2.</span> Wir vereinbaren ein kostenloses Kennenlerngespräch (ca. 20 Min.).</li>
                  <li className="flex gap-3"><span className="font-serif text-lg text-[#d8b48f]">3.</span> Wenn es für beide stimmig ist, planen wir die Begleitung.</li>
                </ul>
              </div>

              <div className="space-y-4 rounded-[1.75rem] border border-black/10 bg-white p-8">
                {[
                  { icon: Mail, label: "E-Mail", value: "kontakt@joerg-panek.de" },
                  { icon: MapPin, label: "Praxis", value: "Bamberg · und online" },
                  { icon: Clock, label: "Antwortzeit", value: "meist innerhalb von 1–2 Tagen" },
                  { icon: ShieldCheck, label: "Vertraulich", value: "Alles, was du teilst, bleibt geschützt" },
                ].map((c) => (
                  <div key={c.label} className="flex items-start gap-3">
                    <c.icon className="mt-0.5 size-5" style={{ color: CLAY }} />
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-black/45">{c.label}</p>
                      <p className="text-sm font-medium">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </Reveal>
        </div>
      </section>
    </>
  );
}

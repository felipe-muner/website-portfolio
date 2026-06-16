import type { Metadata } from "next";
import Image from "next/image";
import { Cormorant_Garamond, Mulish } from "next/font/google";
import { ArrowRight, Heart, Leaf, Mail, MapPin, Quote, Users, Waves } from "lucide-react";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { CoachingHero } from "@/components/layouts/coaching/hero";

export const metadata: Metadata = {
  title: "Business Layout — Jörg Panek · Traumasensible Begleitung",
  robots: { index: false },
};

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-serif",
});
const sans = Mulish({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-sans-mulish" });

const FOREST = "#2c3a30";
const CLAY = "#b07a5b";

const ANGEBOTE = [
  { icon: Heart, title: "Einzelsitzungen", body: "Behutsame Begleitung im geschützten Raum — in deinem Tempo, ohne Druck.", img: "/img/layouts/coach-lotus.jpg" },
  { icon: Users, title: "Paarsitzungen", body: "Wieder in Verbindung kommen: zuhören, verstehen und gemeinsam regulieren.", img: "/img/layouts/coach-river.jpg" },
  { icon: Leaf, title: "Langfristige Begleitung", body: "Ein verlässlicher Prozess über Monate, der Sicherheit und Wachstum trägt.", img: "/img/layouts/coach-tree-roots.jpg" },
  { icon: Waves, title: "TRE® — Tension & Trauma Release", body: "Körperorientierte Übungen, die das Nervensystem auf natürliche Weise entladen.", img: "/img/layouts/coach-forest-mist.jpg" },
] as const;

const SCHRITTE = [
  { n: "01", title: "Ankommen", body: "Wir schaffen zuerst einen sicheren Rahmen — alles darf da sein, nichts muss." },
  { n: "02", title: "Wahrnehmen", body: "Gemeinsam spüren wir, was dein Nervensystem braucht, statt gegen Symptome zu arbeiten." },
  { n: "03", title: "Wiederverbinden", body: "Schritt für Schritt entsteht Kontakt zu dir selbst, deinen Bedürfnissen und deiner Kraft." },
] as const;

const STIMMEN = [
  { quote: "Zum ersten Mal habe ich mich begleitet gefühlt, ohne mich erklären zu müssen. Jörgs Ruhe trägt.", name: "Anna K.", place: "Bamberg" },
  { quote: "Die Arbeit am Nervensystem hat mehr bewegt als Jahre des Redens. Sanft und tief zugleich.", name: "Michael R.", place: "Online" },
  { quote: "Ich habe gelernt, meinem Körper wieder zu vertrauen. Das war unbezahlbar.", name: "Sophie L.", place: "Nürnberg" },
] as const;

export default function CoachingPage() {
  return (
    <main
      className={`${serif.variable} ${sans.variable} bg-[#f4efe4] font-[family-name:var(--font-sans-mulish)] text-[#33302a] [&_.font-serif]:font-[family-name:var(--font-serif)]`}
    >
      <CoachingHero
        image="/img/layouts/coach-forest-path.jpg"
        lines={["Traumasensible &", "nervensystem­orientierte", "Begleitung."]}
      />

      {/* Wie ich arbeite */}
      <section id="arbeit" className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal from="left">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
              <Image
                src="/img/layouts/coach-tree-roots.jpg"
                alt="Ein großer Baum mit weit verzweigten Wurzeln"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: CLAY }}>
              <span className="h-px w-10" style={{ backgroundColor: CLAY }} /> Wie ich arbeite
            </p>
            <h2 className="mt-6 font-serif text-4xl font-light leading-[1.08] tracking-tight sm:text-5xl">
              Sicherheit zuerst. Veränderung folgt von selbst.
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-black/65">
              Als traumasensibler Begleiter arbeite ich nicht gegen deine Symptome, sondern mit
              deinem Nervensystem. In einem ruhigen, wertfreien Raum darf sich entspannen, was lange
              angespannt war.
            </p>
            <div className="mt-10 space-y-6 border-t border-black/10 pt-8">
              {SCHRITTE.map((s) => (
                <div key={s.n} className="flex gap-5">
                  <span className="font-serif text-2xl font-light" style={{ color: CLAY }}>{s.n}</span>
                  <div>
                    <h3 className="text-lg font-semibold">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-black/60">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Entwicklungstrauma verstehen */}
      <section className="relative overflow-hidden bg-[#2c3a30] text-[#f4efe4]">
        <Image
          src="/img/layouts/coach-leaves.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center sm:px-10 sm:py-32">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: "#d8b48f" }}>
              Entwicklungstrauma verstehen
            </p>
            <h2 className="mx-auto mt-6 max-w-3xl font-serif text-3xl font-light leading-[1.2] tracking-tight sm:text-5xl">
              Vieles, was wir als „Persönlichkeit“ erleben, sind erlernte Schutzstrategien eines
              überforderten Nervensystems.
            </h2>
            <p className="mx-auto mt-8 max-w-xl leading-relaxed text-[#f4efe4]/75">
              Frühe Prägungen formen, wie wir Nähe, Stress und uns selbst erleben. Sie sind keine
              Schwäche — und sie sind veränderbar. Begleitung bedeutet, dem System neue Erfahrungen
              von Sicherheit anzubieten.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Angebote */}
      <section id="angebote" className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32">
        <Reveal>
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: CLAY }}>
            <span className="h-px w-10" style={{ backgroundColor: CLAY }} /> Angebote
          </p>
          <h2 className="mt-6 max-w-2xl font-serif text-4xl font-light leading-tight tracking-tight sm:text-5xl">
            Räume für Einzelne, Paare und Gruppen.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {ANGEBOTE.map((a, i) => (
            <Reveal key={a.title} delay={i * 90}>
              <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-black/10 bg-white">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={a.img}
                    alt={a.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <a.icon className="size-6" style={{ color: CLAY }} />
                  <h3 className="mt-4 font-serif text-2xl font-medium">{a.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-black/60">{a.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <div className="mt-8 flex flex-col items-start gap-4 rounded-[1.75rem] border border-black/10 bg-white p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-serif text-2xl font-medium">Workshops &amp; Gruppen für Aufrichtige Kommunikation</h3>
              <p className="mt-1 text-sm text-black/60">Regelmäßige Abende in Bamberg und online — in Verbindung üben.</p>
            </div>
            <a href="#kontakt" className="flex shrink-0 items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:brightness-105" style={{ backgroundColor: FOREST }}>
              Termine ansehen <ArrowRight className="size-4" />
            </a>
          </div>
        </Reveal>
      </section>

      {/* Stimmen */}
      <section className="border-y border-black/10 bg-[#ece5d6]">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
          <Reveal>
            <h2 className="font-serif text-3xl font-light tracking-tight sm:text-4xl">Stimmen aus der Begleitung</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STIMMEN.map((s, i) => (
              <Reveal key={s.name} delay={i * 90}>
                <figure className="flex h-full flex-col rounded-[1.5rem] bg-white p-8">
                  <Quote className="size-7" style={{ color: CLAY }} />
                  <blockquote className="mt-4 flex-1 font-serif text-xl font-light leading-snug">
                    „{s.quote}“
                  </blockquote>
                  <figcaption className="mt-6 text-sm text-black/55">
                    <span className="font-semibold text-black">{s.name}</span> · {s.place}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Über mich */}
      <section id="ueber" className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-20">
          <Reveal from="left">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
              <Image
                src="/img/layouts/coach-portrait.jpg"
                alt="Porträt von Jörg Panek"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: CLAY }}>
              <span className="h-px w-10" style={{ backgroundColor: CLAY }} /> Über mich
            </p>
            <h2 className="mt-6 font-serif text-4xl font-light leading-[1.08] tracking-tight sm:text-5xl">
              Jörg Panek
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-black/65">
              Ich begleite Menschen dabei, ihrem Nervensystem wieder zu vertrauen. Mein Weg
              führte über eigene Erfahrung, langjährige Ausbildung in traumasensibler Arbeit und
              TRE® zu einer Praxis, die auf Sicherheit, Würde und Verbindung baut.
            </p>
            <p className="mt-4 max-w-lg leading-relaxed text-black/65">
              Ich arbeite in Bamberg und online — ruhig, klar und an deiner Seite.
            </p>
            <blockquote className="mt-8 border-l-2 pl-5 font-serif text-2xl font-light italic" style={{ borderColor: CLAY }}>
              „Wir sind weit mehr als unsere Symptome.“
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* Kontakt */}
      <section id="kontakt" className="bg-[#2c3a30] text-[#f4efe4]">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32">
          <Reveal>
            <h2 className="max-w-3xl font-serif text-4xl font-light leading-[1.08] tracking-tight sm:text-6xl">
              Wenn du spürst, dass jetzt der richtige Moment ist.
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-[#f4efe4]/70">
              Schreib mir gern — wir finden in einem ersten Gespräch heraus, ob und wie ich dich
              begleiten kann.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-10 border-t border-[#f4efe4]/15 pt-12 sm:grid-cols-2">
            {[
              { icon: Mail, label: "E-Mail", value: "kontakt@joerg-panek.de" },
              { icon: MapPin, label: "Praxis", value: "Bamberg · und online" },
            ].map((c) => (
              <Reveal key={c.label}>
                <div className="flex items-start gap-4">
                  <c.icon className="mt-0.5 size-5" style={{ color: "#d8b48f" }} />
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#f4efe4]/45">{c.label}</p>
                    <p className="mt-1 text-lg">{c.value}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <a
              href="#"
              className="mt-14 inline-flex items-center gap-3 rounded-full bg-[#d8b48f] px-8 py-4 text-sm font-semibold text-[#2c3a30] transition hover:bg-[#e4c4a2]"
            >
              Termin buchen <ArrowRight className="size-4" />
            </a>
          </Reveal>
        </div>
        <footer className="border-t border-[#f4efe4]/12">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-[#f4efe4]/45 sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <span className="font-serif text-xl text-[#f4efe4]">Jörg Panek</span>
            <p>© {new Date().getFullYear()} Jörg Panek — Fiktive Demo für das Portfolio.</p>
          </div>
        </footer>
      </section>

      <LayoutSwitcher />
    </main>
  );
}

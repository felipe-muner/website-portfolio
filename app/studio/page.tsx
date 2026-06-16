import type { Metadata } from "next";
import Image from "next/image";
import { Fraunces, Inter } from "next/font/google";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { StudioHero } from "@/components/layouts/studio/hero";
import {
  HorizontalGallery,
  type Project,
} from "@/components/layouts/studio/horizontal-gallery";

export const metadata: Metadata = {
  title: "Business Layout — Nocturne Studio",
  robots: { index: false },
};

const serif = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});
const sans = Inter({ subsets: ["latin"], variable: "--font-sans-inter" });

const STONE = "#c8a97f";

const PROJECTS: readonly Project[] = [
  { src: "/img/layouts/studio-1.jpg", title: "House on the Ridge", place: "Chiang Mai, TH", year: "'23", type: "Residential" },
  { src: "/img/layouts/studio-2.jpg", title: "Ribbon Pavilion", place: "Bangkok, TH", year: "'22", type: "Civic" },
  { src: "/img/layouts/studio-3.jpg", title: "Glass Hall", place: "Singapore", year: "'21", type: "Cultural" },
  { src: "/img/layouts/studio-4.jpg", title: "Timber Retreat", place: "Pai, TH", year: "'23", type: "Interior" },
  { src: "/img/layouts/studio-5.jpg", title: "The Reading Room", place: "Penang, MY", year: "'20", type: "Interior" },
  { src: "/img/layouts/studio-6.jpg", title: "Twin Towers Lobby", place: "Bangkok, TH", year: "'19", type: "Commercial" },
];

const EXPERTISE = [
  { n: "01", title: "Architecture", body: "Houses, civic and cultural buildings — from first sketch to final handover." },
  { n: "02", title: "Interiors", body: "Rooms designed around light, material and the way people actually live." },
  { n: "03", title: "Master planning", body: "Sites, landscapes and phasing for developments that grow with intent." },
  { n: "04", title: "Heritage", body: "Careful adaptation of old structures for a second, longer life." },
] as const;

const STATS = [
  { v: "40+", l: "Built projects" },
  { v: "14", l: "Design awards" },
  { v: "9", l: "Architects on staff" },
  { v: "2009", l: "Founded" },
] as const;

export default function StudioPage() {
  return (
    <main className={`${serif.variable} ${sans.variable} bg-[#efe9df] font-[family-name:var(--font-sans-inter)] text-[#15140f] [&_.font-serif]:font-[family-name:var(--font-serif)]`}>
      <StudioHero
        image="/img/layouts/studio-hero.jpg"
        lines={["We design", "quiet buildings", "that age well."]}
      />

      {/* The signature horizontal scroll gallery */}
      <HorizontalGallery projects={PROJECTS} />

      {/* Studio / about */}
      <section id="studio" className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal from="left">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/img/layouts/studio-about.jpg"
                alt="Bright modern living space designed by the studio"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal>
            <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em]" style={{ color: STONE }}>
              <span className="h-px w-10" style={{ backgroundColor: STONE }} /> The studio
            </p>
            <h2 className="mt-6 font-serif text-4xl font-light leading-[1.05] tracking-tight sm:text-5xl">
              We work slowly, on purpose.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-black/65">
              Nocturne is a small architecture practice based in Bangkok. We take on a
              handful of projects each year so every drawing gets the attention it deserves —
              no house style, just buildings that belong to their place.
            </p>
            <p className="mt-4 max-w-md text-base leading-relaxed text-black/65">
              Our work is shaped by tropical climate, natural light and the long view: rooms
              that feel calm now and weather beautifully for decades.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-8 border-t border-black/10 pt-8 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.l}>
                  <dt className="font-serif text-3xl font-light tracking-tight">{s.v}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-[0.14em] text-black/45">{s.l}</dd>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Expertise */}
      <section className="border-y border-black/10 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
          <Reveal>
            <h2 className="max-w-2xl font-serif text-3xl font-light leading-tight tracking-tight sm:text-5xl">
              What we do, end to end.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
            {EXPERTISE.map((e, i) => (
              <Reveal key={e.n} delay={i * 90}>
                <div className="flex h-full flex-col bg-white p-8">
                  <span className="font-serif text-2xl font-light" style={{ color: STONE }}>
                    {e.n}
                  </span>
                  <h3 className="mt-5 text-lg font-medium">{e.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-black/60">{e.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="bg-[#15140f] text-[#efe9df]">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32">
          <Reveal>
            <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em]" style={{ color: STONE }}>
              <span className="h-px w-10" style={{ backgroundColor: STONE }} /> Contact
            </p>
            <h2 className="mt-6 max-w-3xl font-serif text-4xl font-light leading-[1.04] tracking-tight sm:text-6xl">
              Tell us about the building you&rsquo;ve been imagining.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-10 border-t border-[#efe9df]/15 pt-12 sm:grid-cols-3">
            {[
              { icon: Mail, label: "Email", value: "hello@nocturne.studio" },
              { icon: Phone, label: "Phone", value: "+66 2 000 0000" },
              { icon: MapPin, label: "Studio", value: "Soi Aree, Bangkok" },
            ].map((c) => (
              <Reveal key={c.label} from="bottom">
                <div className="flex items-start gap-4">
                  <c.icon className="mt-0.5 size-5" style={{ color: STONE }} />
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[#efe9df]/45">{c.label}</p>
                    <p className="mt-1 text-lg">{c.value}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <a
              href="#"
              className="mt-14 inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-medium uppercase tracking-[0.16em] text-[#15140f] transition hover:brightness-105"
              style={{ backgroundColor: STONE }}
            >
              Start a project <ArrowUpRight className="size-4" />
            </a>
          </Reveal>
        </div>

        <footer className="border-t border-[#efe9df]/12">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-[#efe9df]/45 sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <span className="font-serif text-lg text-[#efe9df]">Nocturne</span>
            <p>© {new Date().getFullYear()} Nocturne Studio — A fictional brand for portfolio demo.</p>
          </div>
        </footer>
      </section>

      <LayoutSwitcher />
    </main>
  );
}

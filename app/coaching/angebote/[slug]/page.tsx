import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Clock, MapPin, Tag } from "lucide-react";
import { Reveal } from "@/components/layouts/Reveal";
import { CoachSiteNav } from "@/components/layouts/coaching/site-nav";
import { OFFERINGS, getOffering } from "@/lib/layouts/coaching";

const CLAY = "#b07a5b";

export function generateStaticParams() {
  return OFFERINGS.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const offering = getOffering(slug);
  return {
    title: offering ? `${offering.title} · Jörg Panek` : "Angebot · Jörg Panek",
    robots: { index: false },
  };
}

export default async function OfferingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const offering = getOffering(slug);
  if (!offering) notFound();

  const others = OFFERINGS.filter((o) => o.slug !== slug).slice(0, 3);
  const meta = [
    { icon: Clock, label: "Dauer", value: offering.duration },
    { icon: MapPin, label: "Format", value: offering.format },
    { icon: Tag, label: "Investition", value: offering.price },
  ];

  return (
    <>
      <CoachSiteNav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#2c3a30] text-[#f4efe4]">
        <Image src={offering.image} alt="" fill sizes="100vw" className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2c3a30] via-[#2c3a30]/70 to-[#2c3a30]/50" />
        <div className="relative mx-auto max-w-5xl px-6 py-20 sm:px-10 sm:py-28">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[#f4efe4]/55">
            <Link href="/coaching" className="hover:text-[#f4efe4]">Startseite</Link>
            <span className="opacity-50">/</span>
            <Link href="/coaching/angebote" className="hover:text-[#f4efe4]">Mein Angebot</Link>
            <span className="opacity-50">/</span>
            <span className="text-[#f4efe4]/80">{offering.title}</span>
          </nav>
          {offering.recommended && (
            <span className="mb-4 inline-block rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[#2c3a30]" style={{ backgroundColor: "#d8b48f" }}>
              Empfehlung
            </span>
          )}
          <h1 className="max-w-3xl font-serif text-4xl font-light leading-[1.05] tracking-tight sm:text-6xl">
            {offering.fullTitle}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#f4efe4]/80">{offering.tagline}</p>
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto max-w-5xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <Reveal>
            <div>
              <p className="font-serif text-2xl font-light leading-snug text-[#2c3a30]">{offering.intro}</p>
              <div className="mt-8 space-y-5 leading-relaxed text-black/70">
                {offering.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <h2 className="mt-12 font-serif text-2xl font-medium">Das erwartet dich</h2>
              <ul className="mt-5 space-y-3">
                {offering.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-black/75">
                    <Check className="mt-0.5 size-5 shrink-0" style={{ color: CLAY }} />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Sidebar */}
          <Reveal delay={120}>
            <aside className="rounded-[1.75rem] border border-black/10 bg-white p-8 lg:sticky lg:top-28">
              <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-2xl">
                <Image src={offering.image} alt={offering.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
              </div>
              <dl className="space-y-4">
                {meta.map((m) => (
                  <div key={m.label} className="flex items-center gap-3">
                    <m.icon className="size-5" style={{ color: CLAY }} />
                    <div>
                      <dt className="text-xs uppercase tracking-[0.14em] text-black/45">{m.label}</dt>
                      <dd className="text-sm font-medium">{m.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
              <Link href="/coaching/termin" className="mt-7 flex items-center justify-center gap-2 rounded-full bg-[#2c3a30] px-6 py-3.5 text-sm font-semibold text-[#f4efe4] transition hover:brightness-110">
                Termin vereinbaren <ArrowRight className="size-4" />
              </Link>
            </aside>
          </Reveal>
        </div>

        <Link href="/coaching/angebote" className="mt-16 flex w-fit items-center gap-2 text-sm font-semibold text-black/60 transition hover:text-black">
          <ArrowLeft className="size-4" /> Zurück zu allen Angeboten
        </Link>
      </section>

      {/* Weitere Angebote */}
      <section className="border-t border-black/10 bg-[#ece5d6]">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-20">
          <h2 className="font-serif text-2xl font-light tracking-tight sm:text-3xl">Weitere Angebote</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {others.map((o) => (
              <Link key={o.slug} href={`/coaching/angebote/${o.slug}`} className="group flex flex-col overflow-hidden rounded-2xl bg-white">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={o.image} alt={o.title} fill sizes="33vw" className="object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-xl font-medium">{o.title}</h3>
                  <span className="mt-2 flex items-center gap-1.5 text-sm font-semibold" style={{ color: CLAY }}>
                    Mehr Infos <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

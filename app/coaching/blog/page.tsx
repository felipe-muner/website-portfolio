import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Reveal } from "@/components/layouts/Reveal";
import { CoachSiteNav } from "@/components/layouts/coaching/site-nav";
import { CoachPageHeader } from "@/components/layouts/coaching/page-header";
import { POSTS } from "@/lib/layouts/coaching";

export const metadata: Metadata = {
  title: "Blog · Jörg Panek",
  robots: { index: false },
};

const CLAY = "#b07a5b";

export default function BlogPage() {
  const [lead, ...rest] = POSTS;

  return (
    <>
      <CoachSiteNav />
      <CoachPageHeader
        title="Blog"
        intro="Gedanken über Trauma, das Nervensystem und das Heilen in Verbindung."
        crumbs={[{ label: "Startseite", href: "/coaching" }, { label: "Blog" }]}
      />

      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
        {/* Lead article */}
        <Reveal>
          <Link href="#" className="group grid overflow-hidden rounded-[2rem] border border-black/10 bg-white lg:grid-cols-2">
            <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
              <Image src={lead.image} alt={lead.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <p className="flex items-center gap-3 text-xs text-black/45">
                <span>{lead.date}</span>
                <span className="flex items-center gap-1"><Clock className="size-3.5" /> {lead.readingTime}</span>
              </p>
              <h2 className="mt-4 font-serif text-3xl font-light leading-tight tracking-tight sm:text-4xl">{lead.title}</h2>
              <p className="mt-4 leading-relaxed text-black/65">{lead.excerpt}</p>
              <span className="mt-6 flex items-center gap-1.5 text-sm font-semibold transition group-hover:gap-2.5" style={{ color: CLAY }}>
                Weiterlesen <ArrowRight className="size-4" />
              </span>
            </div>
          </Link>
        </Reveal>

        {/* Rest */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={i * 90}>
              <Link href="#" className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-black/10 bg-white">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image src={p.image} alt={p.title} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="flex items-center gap-3 text-xs text-black/45">
                    <span>{p.date}</span>
                    <span className="flex items-center gap-1"><Clock className="size-3.5" /> {p.readingTime}</span>
                  </p>
                  <h2 className="mt-3 font-serif text-2xl font-medium leading-snug">{p.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-black/60">{p.excerpt}</p>
                  <span className="mt-5 flex items-center gap-1.5 text-sm font-semibold transition group-hover:gap-2.5" style={{ color: CLAY }}>
                    Weiterlesen <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

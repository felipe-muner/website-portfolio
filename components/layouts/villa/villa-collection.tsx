"use client";

import Image from "next/image";
import Link from "next/link";
import { Jost, Prata } from "next/font/google";
import { ArrowRight, BedDouble, Users } from "lucide-react";
import { Reveal } from "@/components/layouts/Reveal";
import { useVillaStore } from "@/lib/layouts/villa/store";
import { AZURE } from "@/lib/layouts/villa/theme";

const display = Prata({ subsets: ["latin"], weight: "400" });
const body = Jost({ subsets: ["latin"], weight: ["300", "400", "600"] });

/**
 * The villa grid on the Azure Villas landing page. Reads whatever the owner has
 * published in the dashboard (localStorage), so editing there updates the site.
 */
export function VillaCollection() {
  const { published } = useVillaStore();
  const count = published.length;

  return (
    <section id="villas" className={`${body.className} mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32`}>
      <Reveal>
        <p className="text-center text-sm uppercase tracking-[0.35em]" style={{ color: AZURE.gold }}>
          The collection
        </p>
        <h2 className={`${display.className} mt-4 text-center text-4xl md:text-6xl`} style={{ color: AZURE.teal }}>
          {count === 1 ? "One villa, one quiet bay" : `${count} villas, one quiet bay`}
        </h2>
      </Reveal>

      {count === 0 ? (
        <p className="mt-16 text-center text-lg font-light" style={{ color: `${AZURE.teal}99` }}>
          Our villas are being prepared — please check back soon.
        </p>
      ) : (
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {published.map((villa, index) => (
            <Reveal key={villa.id} delay={index * 90}>
              <Link
                href={`/villa/v1/${villa.slug}`}
                className="group block overflow-hidden bg-white shadow-sm transition-shadow hover:shadow-2xl hover:shadow-[#0e4a5a]/15"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={villa.coverImage}
                    alt={villa.name}
                    fill
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span
                    className="absolute left-5 top-5 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.2em] text-white"
                    style={{ backgroundColor: AZURE.teal }}
                  >
                    ฿{villa.pricePerNight.toLocaleString()} / night
                  </span>
                  {villa.status === "booked" && (
                    <span className="absolute right-5 top-5 bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider" style={{ color: "#b4593a" }}>
                      Booked
                    </span>
                  )}
                </div>
                <div className="p-7 md:p-9">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className={`${display.className} text-3xl`} style={{ color: AZURE.teal }}>{villa.name}</h3>
                    <p className="flex items-center gap-4 text-sm" style={{ color: `${AZURE.teal}b3` }}>
                      <span className="flex items-center gap-1.5">
                        <BedDouble className="size-4" style={{ color: AZURE.gold }} />
                        {villa.bedrooms}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="size-4" style={{ color: AZURE.gold }} />
                        {villa.guests}
                      </span>
                    </p>
                  </div>
                  <p className="mt-1 text-sm uppercase tracking-[0.25em]" style={{ color: AZURE.gold }}>
                    {villa.tagline}
                  </p>
                  <p className="mt-4 leading-relaxed" style={{ color: `${AZURE.teal}cc` }}>
                    {villa.description}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {villa.features.slice(0, 4).map((f) => (
                      <li
                        key={f}
                        className="border px-3 py-1 text-sm"
                        style={{ borderColor: `${AZURE.teal}33`, color: `${AZURE.teal}b3` }}
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                  <span
                    className="mt-7 inline-flex items-center gap-2 border-b-2 pb-1 text-sm font-semibold uppercase tracking-[0.25em] transition-colors group-hover:text-[#c2a05c]"
                    style={{ borderColor: AZURE.gold, color: AZURE.teal }}
                  >
                    View {villa.name.split(" ")[1] ?? villa.name}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}

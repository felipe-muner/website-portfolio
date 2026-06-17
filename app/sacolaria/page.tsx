import Link from "next/link";
import {
  ArrowRight,
  BadgePercent,
  CreditCard,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { CATEGORIES, PRODUCTS } from "@/lib/layouts/sacolaria/catalog";
import { Reveal } from "@/components/layouts/Reveal";
import { BagArt } from "@/components/layouts/sacolaria/bag-art";
import { ProductCard } from "@/components/layouts/sacolaria/product-card";
import { QuoteForm } from "@/components/layouts/sacolaria/quote-form";
import { ContactCTA } from "@/components/layouts/sacolaria/contact-cta";

const TRUST = [
  { icon: Truck, title: "Envio para todo o Brasil", text: "Despacho em 1 dia útil pelos Correios e transportadoras." },
  { icon: BadgePercent, title: "5% de desconto no Pix", text: "Pague com Pix e economize em todo o pedido, na hora." },
  { icon: CreditCard, title: "Parcele em até 12x", text: "No cartão de crédito, sem juros, direto no checkout." },
  { icon: ShieldCheck, title: "Nota fiscal + garantia", text: "Emitimos NF-e e trocamos qualquer lote com defeito." },
];

const CATEGORY_COLOR = {
  "boca-palhaco": "Laranja",
  camiseta: "Azul",
  reciclada: "Verde",
} as const;

export default function SacolariaHome() {
  const bestsellers = PRODUCTS.filter((p) => p.bestseller).slice(0, 8);

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0b3d2e] text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-[#14573f] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 size-80 rounded-full bg-[#0e4937] blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-6 md:py-24">
          <Reveal className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-[#d8efe4]">
              <PackageCheck className="size-4 text-[#f5c518]" /> Fábrica · Atacado · Pronta-entrega
            </span>
            <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Sacolas plásticas<br />
              <span className="text-[#f5c518]">no atacado</span>, do jeito da sua marca.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#bfdccf]">
              Boca de palhaço, alça camiseta e linha reciclada — em todos os tamanhos e
              cores. Monte seu pedido, pague com Pix, cartão ou boleto e receba em casa.
            </p>
          </Reveal>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0b3d2e]">
            Escolha por modelo
          </h2>
          <p className="mt-2 max-w-xl text-[#5b5f57]">
            Três linhas para cada necessidade — do delivery ao varejo premium.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 90}>
              <Link
                href={`/sacolaria/produtos?categoria=${c.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-[#e7e3d8] bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(11,61,46,0.5)]"
              >
                <div className="grid h-40 place-items-center rounded-2xl bg-[#f6f4ee]">
                  <BagArt
                    family={c.slug}
                    color={CATEGORY_COLOR[c.slug]}
                    className="h-32 w-auto transition group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#23261f]">{c.label}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-[#7c8076]">{c.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0b3d2e]">
                  Ver tamanhos <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FORMULÁRIO — grandes pedidos */}
      <QuoteForm />

      {/* MAIS VENDIDOS */}
      <section className="bg-[#f3f1e9]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-[#0b3d2e]">
                  Mais vendidos
                </h2>
                <p className="mt-2 text-[#5b5f57]">Os tamanhos que mais saem da fábrica.</p>
              </div>
              <Link
                href="/sacolaria/produtos"
                className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-[#0b3d2e] hover:underline sm:inline-flex"
              >
                Ver tudo <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {bestsellers.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="border-y border-[#ece8dd] bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-12 sm:px-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map((t) => (
            <div key={t.title} className="flex gap-3">
              <t.icon className="size-6 shrink-0 text-[#0b3d2e]" />
              <div>
                <h3 className="text-sm font-bold text-[#23261f]">{t.title}</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-[#7c8076]">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTATO */}
      <ContactCTA />
    </main>
  );
}

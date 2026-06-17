import Link from "next/link";
import { ArrowRight, BadgePercent, PackageCheck } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "@/lib/layouts/sacolaria/catalog";
import { Reveal } from "@/components/layouts/Reveal";
import { BagArt } from "@/components/layouts/sacolaria/bag-art";
import { ProductCard } from "@/components/layouts/sacolaria/product-card";
import { ContactCTA } from "@/components/layouts/sacolaria/contact-cta";

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

      {/* SOBRE / PIX CALLOUT */}
      <section id="sobre" className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
        <div className="grid items-center gap-10 rounded-3xl bg-[#0b3d2e] p-8 text-white md:grid-cols-2 md:p-12">
          <Reveal>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Fábrica própria, preço de quem produz.
            </h2>
            <p className="mt-4 max-w-md text-[#bfdccf]">
              Há mais de 20 anos produzindo embalagens plásticas em Minas Gerais. Controlamos
              cada etapa — da extrusão à entrega — para garantir resistência, pontualidade e o
              melhor custo no atacado.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              {[
                ["+20", "anos de fábrica"],
                ["+5 mil", "clientes ativos"],
                ["27", "estados atendidos"],
              ].map(([n, l]) => (
                <div key={l} className="rounded-2xl bg-white/5 p-4">
                  <p className="text-2xl font-black text-[#f5c518]">{n}</p>
                  <p className="mt-1 text-[0.7rem] uppercase tracking-wide text-[#9cc2b2]">{l}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal from="right" delay={120}>
            <div className="rounded-2xl bg-white/5 p-6">
              <BadgePercent className="size-9 text-[#f5c518]" />
              <h3 className="mt-4 text-xl font-bold">Pague no Pix e economize 5%</h3>
              <p className="mt-2 text-sm text-[#bfdccf]">
                O desconto é aplicado automaticamente no checkout. Prefere parcelar? São até 12x
                sem juros no cartão, ou boleto faturado para empresas.
              </p>
              <Link
                href="/sacolaria/produtos"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#f5c518] px-5 py-3 text-sm font-bold text-[#0b3d2e] transition hover:brightness-105"
              >
                Montar meu pedido <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTATO */}
      <ContactCTA />
    </main>
  );
}

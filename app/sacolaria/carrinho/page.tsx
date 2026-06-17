"use client";

import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import {
  applyPix,
  formatBRL,
  formatInt,
  installments,
  productName,
} from "@/lib/layouts/sacolaria/catalog";
import { useCart } from "@/lib/layouts/sacolaria/cart";
import { BagArt } from "@/components/layouts/sacolaria/bag-art";
import { MinOrderBanner } from "@/components/layouts/sacolaria/min-order-banner";

export default function CarrinhoPage() {
  const { lines, totals, setPacks, remove, hydrated } = useCart();

  if (!hydrated) {
    return <main className="min-h-[50vh] bg-[#faf8f3]" />;
  }

  if (lines.length === 0) {
    return (
      <main className="bg-[#faf8f3]">
        <div className="mx-auto grid max-w-2xl place-items-center px-5 py-24 text-center">
          <div className="grid size-20 place-items-center rounded-full bg-[#eef4f0]">
            <ShoppingBag className="size-9 text-[#0b3d2e]" />
          </div>
          <h1 className="mt-6 text-2xl font-extrabold text-[#0b3d2e]">Seu carrinho está vazio</h1>
          <p className="mt-2 text-[#7c8076]">
            Adicione sacolas ao carrinho para montar seu pedido no atacado.
          </p>
          <Link
            href="/sacolaria/produtos"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#0b3d2e] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#0e5440]"
          >
            Ver catálogo <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>
    );
  }

  const parc = installments(totals.subtotal);

  return (
    <main className="bg-[#faf8f3]">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0b3d2e]">Carrinho</h1>
        <p className="mt-1 text-sm text-[#7c8076]">
          {formatInt(totals.totalUnits)} unidades · {totals.totalPacks}{" "}
          {totals.totalPacks === 1 ? "pacote" : "pacotes"}
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* itens */}
          <ul className="space-y-4">
            {lines.map((l) => (
              <li
                key={l.id}
                className="flex gap-4 rounded-2xl border border-[#e7e3d8] bg-white p-4"
              >
                <Link
                  href={`/sacolaria/produtos/${l.productSlug}`}
                  className="grid size-24 shrink-0 place-items-center rounded-xl bg-[#f6f4ee]"
                >
                  <BagArt family={l.product.family} color={l.color} className="h-20 w-auto" />
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/sacolaria/produtos/${l.productSlug}`}
                        className="text-sm font-semibold text-[#23261f] hover:text-[#0b3d2e]"
                      >
                        {productName(l.product)}
                      </Link>
                      <p className="mt-0.5 text-xs text-[#7c8076]">
                        Cor {l.color} · pacote de {l.units} un.
                      </p>
                      <p className="text-xs text-[#7c8076]">{formatBRL(l.packPriceCents)} / pacote</p>
                    </div>
                    <button
                      type="button"
                      aria-label="Remover"
                      onClick={() => remove(l.id)}
                      className="text-[#b54b4b] transition hover:text-[#8a2f2f]"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                    <div className="inline-flex items-center rounded-full border border-[#e2ddd0]">
                      <button
                        type="button"
                        aria-label="Diminuir"
                        onClick={() => setPacks(l.id, l.packs - 1)}
                        className="grid size-9 place-items-center text-[#0b3d2e]"
                      >
                        <Minus className="size-4" />
                      </button>
                      <span className="w-9 text-center text-sm font-bold">{l.packs}</span>
                      <button
                        type="button"
                        aria-label="Aumentar"
                        onClick={() => setPacks(l.id, l.packs + 1)}
                        className="grid size-9 place-items-center text-[#0b3d2e]"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                    <span className="text-base font-bold text-[#0b3d2e]">
                      {formatBRL(l.lineTotal)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* resumo */}
          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <MinOrderBanner subtotal={totals.subtotal} />

            <div className="rounded-2xl border border-[#e7e3d8] bg-white p-5">
              <h2 className="text-base font-bold text-[#0b3d2e]">Resumo do pedido</h2>
              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-[#4b4f47]">
                  <dt>Subtotal</dt>
                  <dd>{formatBRL(totals.subtotal)}</dd>
                </div>
                <div className="flex justify-between text-[#1f9d55]">
                  <dt>Desconto Pix (5%)</dt>
                  <dd>− {formatBRL(totals.subtotal - applyPix(totals.subtotal))}</dd>
                </div>
                <div className="flex justify-between text-[#8a8f84]">
                  <dt>Frete</dt>
                  <dd>calculado no checkout</dd>
                </div>
                <div className="mt-2 flex items-end justify-between border-t border-[#eee9dd] pt-3">
                  <dt className="text-sm font-semibold text-[#23261f]">Total no Pix</dt>
                  <dd className="text-xl font-black text-[#0b3d2e]">
                    {formatBRL(totals.pixTotal)}
                  </dd>
                </div>
                <p className="text-right text-xs text-[#7c8076]">
                  ou {parc.count}x de {formatBRL(parc.each)} sem juros
                </p>
              </dl>

              <Link
                href={totals.meetsMinimum ? "/sacolaria/checkout" : "#"}
                aria-disabled={!totals.meetsMinimum}
                className={`mt-5 flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition ${
                  totals.meetsMinimum
                    ? "bg-[#0b3d2e] text-white hover:bg-[#0e5440]"
                    : "pointer-events-none bg-[#d8d3c5] text-white"
                }`}
              >
                Finalizar compra <ArrowRight className="size-4" />
              </Link>
              {!totals.meetsMinimum && (
                <p className="mt-2 text-center text-xs text-[#8a6d12]">
                  Adicione mais itens para atingir o pedido mínimo.
                </p>
              )}
              <Link
                href="/sacolaria/produtos"
                className="mt-3 block text-center text-sm font-medium text-[#0b3d2e] hover:underline"
              >
                Continuar comprando
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

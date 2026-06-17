"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Copy, Check, Mail } from "lucide-react";
import { formatBRL } from "@/lib/layouts/sacolaria/catalog";
import { ORDER_STORAGE_KEY, type Order } from "@/lib/layouts/sacolaria/order";

export default function PedidoPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(ORDER_STORAGE_KEY);
      if (raw) setOrder(JSON.parse(raw) as Order);
    } catch {
      // sem pedido salvo
    }
    setReady(true);
  }, []);

  if (!ready) return <main className="min-h-[60vh] bg-[#faf8f3]" />;

  if (!order) {
    return (
      <main className="bg-[#faf8f3]">
        <div className="mx-auto max-w-xl px-5 py-24 text-center">
          <h1 className="text-2xl font-extrabold text-[#0b3d2e]">Nenhum pedido encontrado</h1>
          <p className="mt-2 text-[#7c8076]">Que tal montar um novo pedido?</p>
          <Link
            href="/sacolaria/produtos"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0b3d2e] px-6 py-3.5 text-sm font-bold text-white"
          >
            Ver catálogo <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#faf8f3]">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6">
        <div className="rounded-3xl border border-[#e7e3d8] bg-white p-8 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#eefaf2]">
            <BadgeCheck className="size-9 text-[#1f9d55]" />
          </div>
          <h1 className="mt-5 text-2xl font-extrabold text-[#0b3d2e]">Pedido confirmado!</h1>
          <p className="mt-2 text-[#7c8076]">
            Obrigado, {order.name.split(" ")[0]}. Enviamos os detalhes para{" "}
            <span className="font-medium text-[#4b4f47]">{order.email}</span>.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#f6f4ee] px-4 py-2 text-sm">
            <span className="text-[#8a8f84]">Pedido</span>
            <span className="font-bold text-[#0b3d2e]">{order.id}</span>
            <span className="text-[#d8d3c5]">·</span>
            <span className="text-[#8a8f84]">{order.createdAt}</span>
          </div>
        </div>

        {/* painel de pagamento */}
        <div className="mt-6">
          {order.method === "pix" && <PixPanel order={order} />}
          {order.method === "boleto" && <BoletoPanel order={order} />}
          {order.method === "cartao" && <CartaoPanel order={order} />}
        </div>

        {/* itens */}
        <div className="mt-6 rounded-2xl border border-[#e7e3d8] bg-white p-6">
          <h2 className="text-base font-bold text-[#0b3d2e]">Resumo do pedido</h2>
          <ul className="mt-4 divide-y divide-[#eee9dd] text-sm">
            {order.items.map((it, i) => (
              <li key={i} className="flex justify-between gap-3 py-2.5">
                <span className="text-[#4b4f47]">
                  {it.packs}× {it.name}
                  <span className="block text-xs text-[#8a8f84]">
                    {it.color} · {it.units} un.
                  </span>
                </span>
                <span className="shrink-0 font-medium">{formatBRL(it.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-end justify-between border-t border-[#eee9dd] pt-4">
            <span className="text-sm font-semibold text-[#23261f]">Total pago</span>
            <span className="text-xl font-black text-[#0b3d2e]">{formatBRL(order.total)}</span>
          </div>
          <p className="mt-4 flex items-start gap-2 text-xs text-[#7c8076]">
            <Mail className="mt-0.5 size-3.5 shrink-0" />
            Entrega em <strong className="mx-1 font-semibold text-[#4b4f47]">{order.address}</strong>
            em 3 a 8 dias úteis.
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/sacolaria/produtos"
            className="inline-flex items-center gap-2 rounded-full bg-[#0b3d2e] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#0e5440]"
          >
            Continuar comprando <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(value).then(
          () => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
          },
          () => {},
        );
      }}
      className="inline-flex items-center gap-2 rounded-lg bg-[#0b3d2e] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0e5440]"
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? "Copiado!" : label}
    </button>
  );
}

function PixPanel({ order }: { order: Order }) {
  const code = `00020126580014BR.GOV.BCB.PIX0136${order.id.toLowerCase()}-sacolaria-brasil-demo5204000053039865802BR5916SACOLARIA BRASIL6009CONTAGEM62070503***6304ABCD`;
  return (
    <div className="rounded-2xl border border-[#bfe6cf] bg-[#eefaf2] p-6">
      <h2 className="text-base font-bold text-[#1f7a4d]">Pague com Pix para liberar o envio</h2>
      <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <FakeQR seed={order.id} />
        <div className="flex-1">
          <p className="text-sm text-[#3f8c66]">
            Escaneie o QR Code no app do seu banco ou use o código copia-e-cola. O valor de{" "}
            <strong className="text-[#1f7a4d]">{formatBRL(order.total)}</strong> já está com o
            desconto Pix.
          </p>
          <div className="mt-3 break-all rounded-lg border border-[#bfe6cf] bg-white p-3 font-mono text-[0.7rem] text-[#5b5f57]">
            {code}
          </div>
          <div className="mt-3">
            <CopyButton value={code} label="Copiar código Pix" />
          </div>
        </div>
      </div>
    </div>
  );
}

function BoletoPanel({ order }: { order: Order }) {
  const linha = `34191.79001 01043.510047 91020.150008 ${order.id.replace(/\D/g, "") || "1"} 9${
    String(order.total).padStart(10, "0")
  }`;
  return (
    <div className="rounded-2xl border border-[#e7e3d8] bg-white p-6">
      <h2 className="text-base font-bold text-[#0b3d2e]">Boleto gerado</h2>
      <p className="mt-2 text-sm text-[#7c8076]">
        Vencimento em 3 dias úteis · valor de {formatBRL(order.total)}. Também enviamos o PDF
        para o seu e-mail.
      </p>
      <FakeBarcode />
      <div className="mt-2 rounded-lg border border-[#e2ddd0] bg-[#f6f4ee] p-3 text-center font-mono text-xs text-[#4b4f47]">
        {linha}
      </div>
      <div className="mt-4">
        <CopyButton value={linha} label="Copiar linha digitável" />
      </div>
    </div>
  );
}

function CartaoPanel({ order }: { order: Order }) {
  return (
    <div className="rounded-2xl border border-[#bfe6cf] bg-[#eefaf2] p-6">
      <div className="flex items-center gap-3">
        <BadgeCheck className="size-7 text-[#1f9d55]" />
        <div>
          <h2 className="text-base font-bold text-[#1f7a4d]">Pagamento aprovado</h2>
          <p className="text-sm text-[#3f8c66]">
            {formatBRL(order.total)} no cartão de crédito. Já estamos separando seu pedido.
          </p>
        </div>
      </div>
    </div>
  );
}

/** QR-code decorativo determinístico (não funcional — loja-demo). */
function FakeQR({ seed }: { seed: string }) {
  const N = 21;
  const cells: boolean[] = [];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  for (let i = 0; i < N * N; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    cells.push(((h >> 16) & 1) === 1);
  }
  const isFinder = (r: number, c: number) => {
    const inBox = (br: number, bc: number) => r >= br && r < br + 7 && c >= bc && c < bc + 7;
    return inBox(0, 0) || inBox(0, N - 7) || inBox(N - 7, 0);
  };
  return (
    <svg viewBox={`0 0 ${N} ${N}`} className="size-40 rounded-lg border border-[#bfe6cf] bg-white p-1.5">
      {cells.map((on, i) => {
        const r = Math.floor(i / N);
        const c = i % N;
        if (isFinder(r, c)) return null;
        if (!on) return null;
        return <rect key={i} x={c} y={r} width="1" height="1" fill="#0b3d2e" />;
      })}
      {[
        [0, 0],
        [0, N - 7],
        [N - 7, 0],
      ].map(([br, bc], i) => (
        <g key={i} fill="#0b3d2e">
          <rect x={bc} y={br} width="7" height="7" />
          <rect x={bc + 1} y={br + 1} width="5" height="5" fill="#fff" />
          <rect x={bc + 2} y={br + 2} width="3" height="3" />
        </g>
      ))}
    </svg>
  );
}

function FakeBarcode() {
  const bars = Array.from({ length: 60 }, (_, i) => (i * 7) % 5 < 2);
  return (
    <div className="mt-4 flex h-16 items-stretch gap-[2px] overflow-hidden rounded-lg border border-[#e2ddd0] bg-white p-2">
      {bars.map((wide, i) => (
        <span
          key={i}
          className="bg-[#1f2024]"
          style={{ width: wide ? 3 : 1.5, opacity: i % 9 === 0 ? 0 : 1 }}
        />
      ))}
    </div>
  );
}

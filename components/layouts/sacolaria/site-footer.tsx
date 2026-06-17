import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { CATEGORIES } from "@/lib/layouts/sacolaria/catalog";

const PAYMENTS = ["Pix", "Visa", "Master", "Elo", "Boleto"];

export function SacolariaFooter() {
  return (
    <footer
      id="contato"
      className="border-t border-[#173f31] bg-[#0b3d2e] font-[family-name:var(--font-sans-inter)] text-[#cfe6db]"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-lg bg-[#f5c518] text-sm font-black text-[#0b3d2e]">
              SB
            </span>
            <span className="text-base font-extrabold text-white">Sacolaria Brasil</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#a9cabd]">
            Fábrica de sacolas plásticas para o varejo, delivery e indústria. Pronta-entrega
            e personalização, com envio para todo o Brasil.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {PAYMENTS.map((p) => (
              <span
                key={p}
                className="rounded-md border border-[#2c5747] bg-[#0e4937] px-2.5 py-1 text-[0.7rem] font-semibold text-[#d8efe4]"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Produtos</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/sacolaria/produtos" className="text-[#a9cabd] hover:text-white">
                Todas as sacolas
              </Link>
            </li>
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/sacolaria/produtos?categoria=${c.slug}`}
                  className="text-[#a9cabd] hover:text-white"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Ajuda</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-[#a9cabd]">
            <li>Prazo de entrega: 3 a 8 dias úteis</li>
            <li>Trocas e devoluções em até 7 dias</li>
            <li>Emissão de nota fiscal (NF-e)</li>
            <li>Pedido mínimo de R$ 250,00</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Contato</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2.5">
              <MessageCircle className="size-4 text-[#f5c518]" />
              <a href="https://wa.me/5531900000000" className="hover:text-white">
                WhatsApp (31) 90000-0000
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 text-[#f5c518]" />
              (31) 3000-0000
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 text-[#f5c518]" />
              <a href="mailto:vendas@sacolariabrasil.com.br" className="hover:text-white">
                vendas@sacolariabrasil.com.br
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 text-[#f5c518]" />
              <span>Contagem · MG · Brasil</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#173f31]">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-5 text-xs text-[#8db3a4] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Sacolaria Brasil · CNPJ 00.000.000/0001-00 (fictício)</p>
          <p>Loja-demonstração — template de portfólio. Nenhuma cobrança é realizada.</p>
        </div>
      </div>
    </footer>
  );
}

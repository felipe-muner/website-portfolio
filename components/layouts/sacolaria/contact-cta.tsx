import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { CONTACT, WHATSAPP_LINK } from "@/lib/layouts/sacolaria/contact";

/** Seção de contato com acesso direto a WhatsApp, telefone e e-mail. */
export function ContactCTA() {
  return (
    <section id="contato" className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
      <div className="rounded-3xl border border-[#e7e3d8] bg-white p-8 text-center md:p-12">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#1f9d55]">
          Atendimento
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0b3d2e]">
          Fale com a gente
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[#5b5f57]">
          Tire dúvidas, peça um orçamento para grandes volumes ou personalize sua sacola.
          Respondemos rápido pelo WhatsApp, telefone ou e-mail.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {/* WhatsApp — ação principal */}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2 rounded-2xl bg-[#1faf54] p-6 text-white transition hover:bg-[#199048]"
          >
            <MessageCircle className="size-7" />
            <span className="text-base font-bold">WhatsApp</span>
            <span className="text-sm text-white/90">{CONTACT.whatsappDisplay}</span>
            <span className="mt-1 text-xs font-semibold uppercase tracking-wide text-white/80">
              Iniciar conversa
            </span>
          </a>

          {/* Telefone */}
          <a
            href={`tel:${CONTACT.phone}`}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-[#e2ddd0] bg-[#f6f4ee] p-6 transition hover:border-[#0b3d2e]/40"
          >
            <Phone className="size-7 text-[#0b3d2e]" />
            <span className="text-base font-bold text-[#23261f]">Telefone</span>
            <span className="text-sm text-[#5b5f57]">{CONTACT.phoneDisplay}</span>
            <span className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#8a8f84]">
              Seg a sex, 8h–18h
            </span>
          </a>

          {/* E-mail */}
          <a
            href={`mailto:${CONTACT.email}`}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-[#e2ddd0] bg-[#f6f4ee] p-6 transition hover:border-[#0b3d2e]/40"
          >
            <Mail className="size-7 text-[#0b3d2e]" />
            <span className="text-base font-bold text-[#23261f]">E-mail</span>
            <span className="break-all text-sm text-[#5b5f57]">{CONTACT.email}</span>
            <span className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#8a8f84]">
              Orçamentos e NF-e
            </span>
          </a>
        </div>

        <p className="mt-6 inline-flex items-center gap-2 text-sm text-[#7c8076]">
          <MapPin className="size-4 text-[#0b3d2e]" /> {CONTACT.city}
        </p>
      </div>
    </section>
  );
}

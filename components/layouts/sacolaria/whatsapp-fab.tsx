import { MessageCircle } from "lucide-react";
import { WHATSAPP_LINK } from "@/lib/layouts/sacolaria/contact";

/**
 * Botão flutuante de WhatsApp, fixo no canto inferior direito em todas as páginas.
 * Fica acima do seletor de templates do portfólio para não sobrepor.
 */
export function WhatsappFab() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="group fixed bottom-20 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] py-3 pl-3 pr-4 text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.6)] transition hover:brightness-105"
    >
      <span className="absolute inline-flex size-12 animate-ping rounded-full bg-[#25D366] opacity-30" />
      <MessageCircle className="relative size-6" />
      <span className="relative hidden text-sm font-bold sm:inline">Fale conosco</span>
    </a>
  );
}

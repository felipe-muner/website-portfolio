"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { WHATSAPP_LINK } from "@/lib/layouts/sacolaria/contact";
import { cn } from "@/lib/utils";

/**
 * Botão flutuante de WhatsApp, fixo no canto inferior direito.
 * Aparece com uma animação suave assim que o usuário começa a rolar a página.
 */
export function WhatsappFab() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className={cn(
        // Mobile: círculo perfeito (tamanho fixo). sm+: vira "pílula" com o texto.
        "group fixed bottom-20 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.6)] transition-all duration-500 ease-out hover:brightness-105 sm:size-auto sm:gap-2 sm:py-3 sm:pl-3 sm:pr-5",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      {/* Halo verde que se expande para além do botão — visível em qualquer fundo */}
      <span className="absolute inset-0 -z-10 rounded-full bg-[#25D366] opacity-75 animate-ping" />
      <WhatsAppIcon size={26} className="relative shrink-0" />
      <span className="relative hidden text-sm font-bold sm:inline">Fale conosco</span>
    </a>
  );
}

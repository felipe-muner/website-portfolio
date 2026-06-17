import { applyPix, formatBRL, installments } from "@/lib/layouts/sacolaria/catalog";
import { cn } from "@/lib/utils";

interface PriceBlockProps {
  /** Preço total no cartão/boleto, em centavos. */
  cents: number;
  size?: "sm" | "lg";
  className?: string;
}

/** Bloco de preço padrão da loja: valor, "com Pix" (verde) e parcelamento. */
export function PriceBlock({ cents, size = "sm", className }: PriceBlockProps) {
  const pix = applyPix(cents);
  const parc = installments(cents);
  const lg = size === "lg";

  return (
    <div className={className}>
      <p className={cn("font-bold leading-none text-[#0b3d2e]", lg ? "text-4xl" : "text-2xl")}>
        {formatBRL(cents)}
      </p>
      <p className={cn("mt-1 font-semibold text-[#1f9d55]", lg ? "text-base" : "text-sm")}>
        {formatBRL(pix)} no Pix
      </p>
      <p className={cn("mt-0.5 text-[#5b5f57]", lg ? "text-sm" : "text-xs")}>
        ou {parc.count}x de {formatBRL(parc.each)} sem juros
      </p>
    </div>
  );
}

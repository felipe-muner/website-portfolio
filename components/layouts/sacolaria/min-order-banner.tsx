import { formatBRL, MIN_ORDER } from "@/lib/layouts/sacolaria/catalog";
import { cn } from "@/lib/utils";

/** Barra de progresso até o pedido mínimo. */
export function MinOrderBanner({ subtotal }: { subtotal: number }) {
  const met = subtotal >= MIN_ORDER;
  const pct = Math.min(100, Math.round((subtotal / MIN_ORDER) * 100));
  const missing = Math.max(0, MIN_ORDER - subtotal);

  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        met ? "border-[#bfe6cf] bg-[#eefaf2]" : "border-[#f3e2b8] bg-[#fdf7e6]",
      )}
    >
      <p className={cn("text-sm font-semibold", met ? "text-[#1f7a4d]" : "text-[#8a6d12]")}>
        {met
          ? "Pedido mínimo atingido — você já pode finalizar!"
          : `Faltam ${formatBRL(missing)} para atingir o pedido mínimo de ${formatBRL(MIN_ORDER)}`}
      </p>
      <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-black/10">
        <div
          className={cn("h-full rounded-full transition-all", met ? "bg-[#1f9d55]" : "bg-[#f0b429]")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

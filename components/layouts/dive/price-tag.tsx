import { formatTHB, type Product } from "@/lib/layouts/dive/catalog";
import { cn } from "@/lib/utils";

const CYAN = "#2ed3e8";

/** Price with optional strikethrough compare-at, in the dive palette. */
export function PriceTag({
  product,
  size = "sm",
  className,
}: {
  product: Product;
  size?: "sm" | "lg";
  className?: string;
}) {
  const lg = size === "lg";
  const onSale = !!product.compareAt && product.compareAt > product.price;

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2.5 gap-y-1", className)}>
      <span
        className={cn("font-bold leading-none", lg ? "text-3xl" : "text-lg")}
        style={{ color: CYAN }}
      >
        {formatTHB(product.price)}
      </span>
      {onSale && (
        <span
          className={cn("font-light text-white/45 line-through", lg ? "text-lg" : "text-sm")}
        >
          {formatTHB(product.compareAt!)}
        </span>
      )}
    </div>
  );
}

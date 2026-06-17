import type { Metadata } from "next";
import { categoryBySlug, type Family } from "@/lib/layouts/sacolaria/catalog";
import { ProductsBrowser } from "@/components/layouts/sacolaria/products-browser";

export const metadata: Metadata = {
  title: "Catálogo de sacolas — Sacolaria Brasil",
  robots: { index: false },
};

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const initial: Family | "all" =
    categoria && categoryBySlug(categoria) ? (categoria as Family) : "all";

  return (
    <main className="bg-[#faf8f3]">
      <ProductsBrowser initialCategoria={initial} />
    </main>
  );
}

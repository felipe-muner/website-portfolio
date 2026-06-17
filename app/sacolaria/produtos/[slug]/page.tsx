import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS, productBySlug, productName } from "@/lib/layouts/sacolaria/catalog";
import { ProductDetail } from "@/components/layouts/sacolaria/product-detail";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = productBySlug(slug);
  return {
    title: product
      ? `${productName(product)} — Sacolaria Brasil`
      : "Produto não encontrado — Sacolaria Brasil",
    robots: { index: false },
  };
}

export default async function ProdutoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) notFound();

  const related = PRODUCTS.filter((p) => p.family === product.family && p.slug !== product.slug).slice(
    0,
    4,
  );

  return (
    <main className="bg-[#faf8f3]">
      <ProductDetail product={product} related={related} />
    </main>
  );
}

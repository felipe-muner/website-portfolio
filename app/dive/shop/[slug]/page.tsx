import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS, productBySlug, relatedProducts } from "@/lib/layouts/dive/catalog";
import { ProductDetail } from "@/components/layouts/dive/product-detail";

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
      ? `${product.brand} ${product.name} — Aqua Sport Supply`
      : "Gear not found — Aqua Sport Supply",
    robots: { index: false },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) notFound();

  return (
    <main className="pt-16">
      <ProductDetail product={product} related={relatedProducts(product, 4)} />
    </main>
  );
}

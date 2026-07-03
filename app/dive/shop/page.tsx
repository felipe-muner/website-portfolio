import type { Metadata } from "next";
import { categoryBySlug, type Category } from "@/lib/layouts/dive/catalog";
import { ProductsBrowser } from "@/components/layouts/dive/products-browser";

export const metadata: Metadata = {
  title: "Dive gear shop — Aqua Sport Supply",
  robots: { index: false },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const initial: Category | "all" =
    category && categoryBySlug(category) ? (category as Category) : "all";

  return (
    <main className="pt-16">
      <ProductsBrowser initialCategory={initial} />
    </main>
  );
}

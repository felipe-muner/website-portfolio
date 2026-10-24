import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TradePreview } from "@/components/previews/trade-preview";
import { PREVIEWS, getPreview } from "@/lib/previews";
import { TRADES } from "@/lib/previews/trades";

/**
 * A website preview built for one real local business (from a Google Maps lead
 * list), linked from the cold email offering it to them. Not indexed, and only
 * reachable by its link: slugs carry a short hash.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return PREVIEWS.map(({ slug }) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lead = getPreview((await params).slug);
  if (!lead) return {};
  const { label } = TRADES[lead.trade];
  return {
    title: `${lead.short} | ${label} in ${lead.place}`,
    description: `${lead.short}: ${label.toLowerCase()} in ${lead.place}. Call for a free quote.`,
    robots: { index: false, follow: false },
  };
}

export default async function PreviewPage({ params }: Props) {
  const lead = getPreview((await params).slug);
  if (!lead) notFound();
  return <TradePreview lead={lead} />;
}

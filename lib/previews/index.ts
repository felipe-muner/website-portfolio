import leads from "./leads.json";
import type { Trade } from "./trades";

/**
 * A business we built a preview site for. Generated from a Google Maps lead
 * list by scripts/leads/build-previews.ts — don't edit leads.json by hand.
 */
export type PreviewLead = {
  slug: string;
  /** Name as listed on Google. */
  name: string;
  /** Cleaned-up name for headlines ("Joe's Plumbing LLC | Tampa" → "Joe's Plumbing"). */
  short: string;
  trade: Trade;
  city: string;
  /** "Tampa, FL" */
  place: string;
  /** City centre, for live local weather; null if the city couldn't be found. */
  location: { latitude: number; longitude: number } | null;
  phone: { display: string; tel: string } | null;
  rating: number;
  reviews: number;
  /** Google Maps listing, linked from the rating badge. */
  maps: string;
};

export const PREVIEWS = leads as PreviewLead[];

export const getPreview = (slug: string) => PREVIEWS.find((p) => p.slug === slug);

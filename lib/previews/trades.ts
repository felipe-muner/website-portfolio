import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  CalendarDays,
  Clock,
  DollarSign,
  Droplet,
  House,
  MapPin,
  Package,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Thermometer,
  ThumbsUp,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";

export type Trade = "plumbing" | "hvac" | "cleaning";

/** What a trade's copy can mention about the business. */
export type CopyContext = { short: string; city: string; place: string };

type Item = { icon: LucideIcon; title: string; text: string };

export type TradeContent = {
  label: string;
  colors: { brand: string; dark: string; accent: string; ink: string; tint: string };
  eyebrow: (c: CopyContext) => string;
  /** Second line is shown in the accent colour. */
  headline: (c: CopyContext) => [string, string];
  lead: (c: CopyContext) => string;
  services: Item[];
  why: (c: CopyContext) => Item[];
  steps: { title: string; text: string }[];
  band: (c: CopyContext) => [string, string];
};

/**
 * Copy for the personalised previews at /preview/[slug]. It stays generic on
 * purpose (no licences, years in business or reviews we can't vouch for): the
 * owner fills in the real details once they buy the site.
 */
export const TRADES: Record<Trade, TradeContent> = {
  plumbing: {
    label: "Plumbing",
    colors: { brand: "#123c69", dark: "#0a2540", accent: "#f59e0b", ink: "#1c1300", tint: "#eef3f9" },
    eyebrow: (c) => `Plumbing in ${c.place}`,
    headline: (c) => [`Plumbing done right in ${c.city}.`, "Fast, honest, on time."],
    lead: (c) =>
      `From dripping faucets to burst pipes, ${c.short} shows up on time, explains the fix in plain English and gives you the price before any work starts.`,
    services: [
      { icon: Droplet, title: "Leak Detection & Repair", text: "Find and fix hidden leaks before they turn into water damage." },
      { icon: Wrench, title: "Drain Cleaning", text: "Clogged sinks, showers and main lines cleared fast." },
      { icon: Thermometer, title: "Water Heaters", text: "Repair and replacement of tank and tankless water heaters." },
      { icon: House, title: "Toilets & Faucets", text: "Running toilets, dripping faucets and new fixtures installed." },
      { icon: ShieldCheck, title: "Repiping", text: "Swap old, corroded pipes for durable new lines." },
      { icon: Zap, title: "Emergency Plumbing", text: "Burst pipe or no water? Call and we'll get there fast." },
    ],
    why: (c) => [
      { icon: DollarSign, title: "Upfront pricing", text: "You get the price before we start. No surprises on the bill." },
      { icon: Clock, title: "On time", text: "We respect your time and call ahead when we're on the way." },
      { icon: House, title: "Clean, careful work", text: "We protect your floors and clean up when we're done." },
      { icon: MapPin, title: "Local team", text: `We live and work in ${c.city} and know local homes.` },
    ],
    steps: [
      { title: "Call or request a quote", text: "Tell us what's going on and we'll find a time that works for you." },
      { title: "We diagnose and quote", text: "We find the cause and give you a clear price before any work begins." },
      { title: "Fixed and cleaned up", text: "We do the job right and leave your home as clean as we found it." },
    ],
    band: (c) => ["Got a plumbing problem?", `Call ${c.short} today and we'll get it sorted.`],
  },
  hvac: {
    label: "AC & Heating",
    colors: { brand: "#0369a1", dark: "#0c2d48", accent: "#fb923c", ink: "#2a1103", tint: "#eaf6fd" },
    eyebrow: (c) => `AC & heating in ${c.place}`,
    headline: (c) => [`Stay cool in ${c.city}.`, "AC repair you can count on."],
    lead: (c) =>
      `When your AC quits in the ${c.city} heat, ${c.short} gets it running again, with honest advice on repair vs. replace and the price upfront.`,
    services: [
      { icon: Snowflake, title: "AC Repair", text: "Warm air, strange noises or no power? We find the problem fast." },
      { icon: Wind, title: "AC Installation", text: "New, efficient systems sized right for your home." },
      { icon: Wrench, title: "Maintenance & Tune-ups", text: "Seasonal check-ups that prevent breakdowns and lower bills." },
      { icon: Thermometer, title: "Heating Repair", text: "Heat pumps and furnaces fixed before the cold nights." },
      { icon: Wind, title: "Ductwork & Airflow", text: "Even cooling in every room, with less dust in the air." },
      { icon: Zap, title: "Thermostats", text: "Smart thermostat installs that save energy automatically." },
    ],
    why: (c) => [
      { icon: DollarSign, title: "Upfront pricing", text: "You know the price before we start. No surprises." },
      { icon: Clock, title: "Fast response", text: "We know a broken AC can't wait, so we move quickly." },
      { icon: ShieldCheck, title: "Honest advice", text: "We only recommend a new system when it really makes sense." },
      { icon: MapPin, title: "Local team", text: `We know the ${c.city} climate and what it does to AC units.` },
    ],
    steps: [
      { title: "Call or book online", text: "Tell us what your system is doing and pick a time." },
      { title: "We diagnose the problem", text: "A clear explanation and a fixed price before any work." },
      { title: "Cool air is back", text: "Your home is comfortable again, and we tidy up after ourselves." },
    ],
    band: (c) => ["AC not keeping up?", `Call ${c.short} and get your home comfortable again.`],
  },
  cleaning: {
    label: "House Cleaning",
    colors: { brand: "#0f766e", dark: "#083d3a", accent: "#fde047", ink: "#2a2300", tint: "#ecfaf7" },
    eyebrow: (c) => `House cleaning in ${c.place}`,
    headline: (c) => [`A spotless home in ${c.city}.`, "Without lifting a finger."],
    lead: (c) =>
      `${c.short} takes care of the dusting, scrubbing and mopping so you can get your weekends back. One-time deep cleans or regular visits, your choice.`,
    services: [
      { icon: House, title: "Standard Cleaning", text: "Kitchens, bathrooms, floors and dusting, done top to bottom." },
      { icon: Sparkles, title: "Deep Cleaning", text: "Baseboards, inside appliances and every corner that gets missed." },
      { icon: Package, title: "Move-In / Move-Out", text: "Leave the old place spotless and start fresh in the new one." },
      { icon: CalendarDays, title: "Recurring Cleaning", text: "Weekly, bi-weekly or monthly visits on your schedule." },
      { icon: Briefcase, title: "Office Cleaning", text: "A clean, healthy workspace for your team and clients." },
      { icon: Wrench, title: "Post-Construction", text: "Dust and debris cleared after a remodel or renovation." },
    ],
    why: (c) => [
      { icon: CalendarDays, title: "Easy booking", text: "Get a quote and a time slot in minutes." },
      { icon: ThumbsUp, title: "Consistent results", text: "The same checklist every visit, so nothing gets skipped." },
      { icon: Clock, title: "Flexible scheduling", text: "Mornings, afternoons or while you're at work." },
      { icon: MapPin, title: "Local team", text: `Proudly cleaning homes all around ${c.city}.` },
    ],
    steps: [
      { title: "Tell us about your home", text: "Size, number of rooms and what you need done." },
      { title: "Get your price", text: "A clear, upfront quote with no hidden fees." },
      { title: "Come home to clean", text: "Relax. We'll take care of the rest." },
    ],
    band: (c) => ["Ready for a cleaner home?", `Get a free quote from ${c.short} today.`],
  },
};

import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  CalendarDays,
  Droplet,
  Fan,
  Flame,
  Hammer,
  House,
  Package,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Thermometer,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";

export type Trade = "plumbing" | "hvac" | "cleaning";

/** What a trade's copy can mention about the business. */
export type CopyContext = { short: string; city: string; place: string };

type Text = { title: string; body: string };

/** Colours for one trade, applied as CSS variables (see TradePreview). */
export type Theme = {
  bg: string;
  /** Raised sections, a shade off the page. */
  raised: string;
  /** The trust strip under the hero. */
  strip: string;
  card: string;
  cardHover: string;
  footer: string;
  accent: string;
  /** Text on the accent colour. */
  ink: string;
  soft: string;
  /** The accent's glow, as "r g b". */
  glow: string;
  /** Headline gradients: the first line and the second. */
  lineOne: [string, string, string];
  lineTwo: [string, string, string];
};

export type TradeContent = {
  label: string;
  theme: Theme;
  /** The particle hero; trades without one use the AC template's 3D unit. */
  particles?: { colors: [string, string]; captions: string[] };
  headline: [string, string];
  heroCopy: (c: CopyContext) => string;
  services: {
    title: [string, string];
    body: (c: CopyContext) => string;
    items: (Text & { icon: LucideIcon })[];
  };
  process: { title: [string, string]; steps: Text[] };
  why: (c: CopyContext) => Text[];
  faq: (c: CopyContext) => { q: string; a: string }[];
  cta: { title: [string, string]; body: string };
  footer: (c: CopyContext) => string;
};

/**
 * Copy and colours for the personalised previews at /preview/[slug]. Copy
 * stays generic on purpose — no licences, years in business or reviews we
 * can't vouch for: the owner fills in the real details once they buy the site.
 */
export const TRADES: Record<Trade, TradeContent> = {
  hvac: {
    label: "AC & Heating",
    // The MGM template's own palette (/aircon).
    theme: {
      bg: "#06100c",
      raised: "#07130f",
      strip: "#081410",
      card: "#091712",
      cardHover: "#0b1b16",
      footer: "#040b08",
      accent: "#66e6ba",
      ink: "#001c12",
      soft: "#99f2e0",
      glow: "102 230 186",
      lineOne: ["#ffd59a", "#faab3f", "#ff9f5a"],
      lineTwo: ["#ffffff", "#d9fff4", "#99f2e0"],
    },
    headline: ["Hot outside.", "Perfect inside."],
    heroCopy: (c) =>
      `${c.short} keeps ${c.city} homes cool. AC repair, new systems and tune-ups, with honest advice, tidy work and a team that picks up the phone.`,
    services: {
      title: ["Every kind of cool,", "fitted and looked after properly."],
      body: (c) => `From a quick repair to a whole new system, ${c.short} installs, services and repairs it all across ${c.city}.`,
      items: [
        { icon: Wrench, title: "AC Repair", body: "Warm air, odd noises or water on the floor? We find the fault fast and fix it properly." },
        { icon: Snowflake, title: "New AC Installation", body: "Central air and heat pump systems sized for your home and installed neatly." },
        { icon: Wind, title: "Ductless Mini-Splits", body: "Quiet, efficient cooling for additions, garages and rooms the ducts don't reach." },
        { icon: ShieldCheck, title: "Maintenance & Tune-ups", body: "A yearly check-up that keeps bills down and stops breakdowns before summer." },
        { icon: Thermometer, title: "Heating & Heat Pumps", body: "Heat pump and furnace repair and replacement, for the cold snaps too." },
        { icon: Fan, title: "Indoor Air Quality", body: "Filters, duct cleaning and dehumidifiers for cleaner, drier air at home." },
      ],
    },
    process: {
      title: ["From hello to all done.", "No pushy sales, no jargon."],
      steps: [
        { title: "Call or book online", body: "Tell us what your system is doing. We'll ask the right questions and find a time that works." },
        { title: "Diagnosis & clear quote", body: "We find the cause and give you an upfront price before any work starts. No surprises." },
        { title: "Fixed or installed, tidy", body: "We do the job properly, test everything and leave your home as clean as we found it." },
        { title: "Here after the job", body: "Maintenance reminders and real local support, so your system keeps running for years." },
      ],
    },
    why: (c) => [
      { title: `Local to ${c.city}`, body: `A ${c.city} team that knows what this heat does to an AC, and shows up when it quits.` },
      { title: "Upfront pricing", body: "Clear quotes before we start. We'll tell you straight whether to repair or replace." },
      { title: "Tidy, careful work", body: "Drop cloths down, clean finishes, and your home left the way we found it." },
      { title: "All major brands", body: "Daikin, Mitsubishi, Fujitsu and more: the right unit for your home, not the one we're pushing." },
      { title: "Fast response", body: `We know a broken AC can't wait in ${c.city}. Call and we'll get you on the schedule fast.` },
      { title: "Real people", body: `Call and you talk to ${c.short}, not a call center.` },
    ],
    faq: (c) => [
      { q: "What areas do you serve?", a: `${c.short} serves ${c.city} and the surrounding area. Not sure if you're in range? Give us a call, chances are we can help.` },
      { q: "How much does a new AC cost?", a: "It depends on the size and type of system and how involved the install is. We give free, no-obligation quotes so you know the price before any work starts." },
      { q: "What size AC do I need?", a: "It depends on your home's square footage, insulation, windows and sun. Too small struggles, too big wastes energy, so we measure and recommend the right size." },
      { q: "Should I repair or replace my AC?", a: "If your system is 10–15 years old or needs a major repair, replacing it can save you money. We'll give you honest numbers for both." },
      { q: "How often should I service my AC?", a: "At least once a year, ideally before summer. A tune-up keeps the air clean, lowers your bills and catches small problems early." },
    ],
    cta: {
      title: ["Next heat wave?", "Be ready for it."],
      body: "A free, no-obligation quote: honest advice, tidy work and local support long after the install.",
    },
    footer: (c) => `AC repair, installation and maintenance for ${c.city} and nearby.`,
  },

  plumbing: {
    label: "Plumbing",
    // Deep water blues, with copper for the warm line.
    theme: {
      bg: "#050b14",
      raised: "#07101c",
      strip: "#081322",
      card: "#0a1627",
      cardHover: "#0d1b30",
      footer: "#03070d",
      accent: "#5cc8ff",
      ink: "#00131f",
      soft: "#a8e4ff",
      glow: "92 200 255",
      lineOne: ["#ffd9b0", "#f4a261", "#e07a3f"],
      lineTwo: ["#ffffff", "#d8f3ff", "#8fdcff"],
    },
    particles: { colors: ["#c9eeff", "#4f9dff"], captions: ["Pipes", "Water", "Repairs"] },
    headline: ["Every drop", "in its place."],
    heroCopy: (c) =>
      `${c.short} keeps ${c.city} homes running: leaks, drains, water heaters and repipes, with upfront prices and a team that picks up the phone.`,
    services: {
      title: ["From a drip to a burst pipe,", "fixed properly the first time."],
      body: (c) => `Repairs, installs and emergencies: ${c.short} handles the plumbing for homes and businesses across ${c.city}.`,
      items: [
        { icon: Droplet, title: "Leak Detection & Repair", body: "Find and fix hidden leaks before they turn into water damage." },
        { icon: Wrench, title: "Drain Cleaning", body: "Clogged sinks, showers and main lines cleared fast, without the mess." },
        { icon: Flame, title: "Water Heaters", body: "Repair and replacement of tank and tankless water heaters." },
        { icon: House, title: "Toilets & Faucets", body: "Running toilets, dripping faucets and new fixtures, installed right." },
        { icon: ShieldCheck, title: "Repiping", body: "Swap old, corroded pipes for durable new lines that last." },
        { icon: Zap, title: "Emergency Plumbing", body: "Burst pipe or no water? Call and we'll get there fast." },
      ],
    },
    process: {
      title: ["From the first call to fixed.", "No surprises on the bill."],
      steps: [
        { title: "Call or book online", body: "Tell us what's going on. We'll ask the right questions and find a time that works for you." },
        { title: "Diagnosis & clear quote", body: "We find the cause and give you an upfront price before any work begins." },
        { title: "Fixed properly", body: "We do the job right the first time, and test it before we call it done." },
        { title: "Cleaned up after", body: "Floors protected, mess gone. Your home left as clean as we found it." },
      ],
    },
    why: (c) => [
      { title: `Local to ${c.city}`, body: `A ${c.city} team that knows local homes, and gets to you fast when water's where it shouldn't be.` },
      { title: "Upfront pricing", body: "You get the price before we start. No surprises on the bill, ever." },
      { title: "Clean, careful work", body: "Shoe covers on, floors protected, and everything cleaned up when we're done." },
      { title: "Fixed the first time", body: "We find the real cause, not just the symptom, so the problem stays fixed." },
      { title: "On time", body: "We respect your time and call ahead when we're on the way." },
      { title: "Real people", body: `Call and you talk to ${c.short}, not a call center.` },
    ],
    faq: (c) => [
      { q: "What areas do you serve?", a: `${c.short} serves ${c.city} and the surrounding area. Not sure if you're in range? Give us a call, chances are we can help.` },
      { q: "Do you handle emergencies?", a: "Yes. Burst pipes, major leaks and no hot water can't wait, so call us and we'll get to you as fast as we can." },
      { q: "How much will it cost?", a: "It depends on the job. We diagnose first and give you a clear, upfront price before any work starts, so there are no surprises." },
      { q: "Tank or tankless water heater?", a: "Tankless saves space and energy and never runs out; a tank costs less upfront. We'll help you pick the right one for your home." },
      { q: "How do I know if I have a hidden leak?", a: "A higher water bill, the sound of running water, damp spots or a musty smell are all signs. We can find it without tearing up your home." },
    ],
    cta: {
      title: ["Leak, clog or no hot water?", "We're one call away."],
      body: "A free, no-obligation quote: upfront prices, clean work and a team that picks up the phone.",
    },
    footer: (c) => `Plumbing repairs, installs and emergencies for ${c.city} and nearby.`,
  },

  cleaning: {
    label: "House Cleaning",
    // Fresh mint and soft lilac, like light on a soap bubble.
    theme: {
      bg: "#09080f",
      raised: "#0c0a14",
      strip: "#0f0c19",
      card: "#110e1d",
      cardHover: "#151124",
      footer: "#06050a",
      accent: "#c4b5fd",
      ink: "#1a0b3d",
      soft: "#e4dcff",
      glow: "196 181 253",
      lineOne: ["#d1fff2", "#8af2d8", "#5eead4"],
      lineTwo: ["#ffffff", "#efeaff", "#c4b5fd"],
    },
    particles: { colors: ["#bdfbe6", "#d9ceff"], captions: ["Bubbles", "Home", "Spotless"] },
    headline: ["Come home to", "spotless."],
    heroCopy: (c) =>
      `${c.short} takes care of the dusting, scrubbing and mopping across ${c.city}, so you get your weekends back. One-time deep cleans or regular visits, your choice.`,
    services: {
      title: ["Every room, every corner,", "cleaned like it's our own."],
      body: (c) => `From a one-off deep clean to weekly visits, ${c.short} keeps homes and offices across ${c.city} spotless.`,
      items: [
        { icon: House, title: "Standard Cleaning", body: "Kitchens, bathrooms, floors and dusting, done top to bottom." },
        { icon: Sparkles, title: "Deep Cleaning", body: "Baseboards, inside appliances and every corner that gets missed." },
        { icon: Package, title: "Move-In / Move-Out", body: "Leave the old place spotless and start fresh in the new one." },
        { icon: CalendarDays, title: "Recurring Cleaning", body: "Weekly, bi-weekly or monthly visits on your schedule." },
        { icon: Briefcase, title: "Office Cleaning", body: "A clean, healthy workspace for your team and your clients." },
        { icon: Hammer, title: "Post-Construction", body: "Dust and debris cleared after a remodel or renovation." },
      ],
    },
    process: {
      title: ["Booked in minutes.", "Spotless by the time you're home."],
      steps: [
        { title: "Tell us about your home", body: "Size, number of rooms and what you'd like done. It takes a minute." },
        { title: "Get your price", body: "A clear, upfront quote with no hidden fees, before we start." },
        { title: "We clean", body: "The same checklist every visit, so nothing gets skipped." },
        { title: "Come home to clean", body: "Relax. If anything's missed, tell us and we'll make it right." },
      ],
    },
    why: (c) => [
      { title: `Local to ${c.city}`, body: `A ${c.city} team that's close by, easy to reach and easy to book.` },
      { title: "Upfront pricing", body: "A clear price before we start. No hidden fees, no surprises." },
      { title: "Consistent results", body: "The same detailed checklist on every visit, so nothing gets skipped." },
      { title: "Flexible scheduling", body: "Mornings, afternoons or while you're at work. We fit around you." },
      { title: "Easy booking", body: "A quote and a time slot in minutes, by phone or online." },
      { title: "Real people", body: `Call and you talk to ${c.short}, not a call center.` },
    ],
    faq: (c) => [
      { q: "What areas do you serve?", a: `${c.short} cleans homes across ${c.city} and the surrounding area. Not sure if you're in range? Just ask.` },
      { q: "Do I need to be home?", a: "No. Plenty of clients give us a key or a door code and come home to a clean house." },
      { q: "Do you bring your own supplies?", a: "Yes, we bring everything we need. If you'd like us to use your products, just let us know." },
      { q: "What's the difference between a standard and a deep clean?", a: "A standard clean keeps things fresh; a deep clean adds baseboards, inside appliances, grout and the spots that build up over time." },
      { q: "How much does a clean cost?", a: "It depends on the size of your home and how often you'd like us. Ask for a free quote and you'll know the price before we start." },
    ],
    cta: {
      title: ["Ready for a cleaner home?", "Book your first clean."],
      body: "A free, no-obligation quote: clear prices, a detailed clean and a team that picks up the phone.",
    },
    footer: (c) => `House cleaning, deep cleans and recurring visits for ${c.city} and nearby.`,
  },
};

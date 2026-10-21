// FICTIONAL content for Yoga 6 · Stillwater (/yoga/v6). Classes, teachers
// and the timetable come from the shared yoga content; everything here —
// paces, passes, prices, answers — is invented for the demo.

export type Pace = 1 | 2 | 3;

export const PACE_LABEL: Record<Pace, string> = { 1: "Gentle", 2: "Steady", 3: "Strong" };

/** How each class on the timetable feels, and what it is in a line. */
export const CLASS_FEEL: Record<string, { pace: Pace; minutes: number; line: string }> = {
  "Power Vinyasa": { pace: 3, minutes: 75, line: "Strong, sweaty, breath-led flow" },
  "Mat Pilates": { pace: 2, minutes: 60, line: "Deep core work, slow and precise" },
  "Reformer Pilates": { pace: 2, minutes: 60, line: "Springs and straps, eight beds" },
  "Slow Flow & Balance": { pace: 1, minutes: 60, line: "Long holds and balance work" },
  "Deep Stretch & Mobility": { pace: 1, minutes: 60, line: "Loaded stretching for stiff bodies" },
  "Sunset Flow": { pace: 2, minutes: 60, line: "Golden-hour vinyasa, all levels" },
  "Breathwork & Ice Bath": { pace: 2, minutes: 90, line: "Guided breathing, then the plunge" },
  "Yin & Restore": { pace: 1, minutes: 75, line: "Floor-based, bolsters, very slow" },
  "Full Moon Flow": { pace: 1, minutes: 60, line: "Candlelit flow under the full moon" },
};

export const feelOf = (className: string) => CLASS_FEEL[className] ?? { pace: 2 as Pace, minutes: 60, line: "" };

/** Mats in the sala — each session shows how many are still free. */
export const MATS = 18;

/** A steady, made-up number of mats left for a session (the same on every render). */
export function matsLeft(sessionId: string): number {
  let h = 0;
  for (const ch of sessionId) h = (h * 31 + ch.charCodeAt(0)) % 997;
  return h % 4 === 0 ? 0 : 2 + (h % 11);
}

export interface Pass {
  name: string;
  /** ฿ — demo prices. */
  price: number;
  unit: string;
  note: string;
  /** Pebble size on the scale of the four, 0 smallest. */
  size: number;
  featured?: boolean;
}

export const PASSES: readonly Pass[] = [
  { name: "Drop-in", price: 350, unit: "one class", note: "Mat, props and tea included", size: 0 },
  { name: "Five classes", price: 1600, unit: "valid 2 months", note: "฿320 a class", size: 1 },
  { name: "Ten classes", price: 3000, unit: "valid 3 months", note: "฿300 a class · shareable", size: 2 },
  { name: "Unlimited month", price: 3900, unit: "30 days", note: "Every class, every day, ice bath too", size: 3, featured: true },
];

export const AMENITIES = [
  { title: "Mats & props", body: "Cork blocks, straps, bolsters and eye pillows — bring nothing but yourself." },
  { title: "Open-air sala", body: "Teak floor, sea breeze, eighteen mats. Mosquito screens come down at dusk." },
  { title: "Ice bath & showers", body: "Two plunge tubs after breathwork, hot showers and lockers downstairs." },
  { title: "Tea after class", body: "Fresh ginger and lemongrass tea on the deck, every class, always free." },
] as const;

export const FAQ = [
  {
    q: "I've never done yoga. Where do I start?",
    a: "Anything marked Gentle — Slow Flow & Balance or Yin & Restore are perfect first classes. Tell the teacher it's your first time; they'll offer options all the way through.",
  },
  {
    q: "Do I need to book?",
    a: "Booking holds your mat; walk-ins are welcome while mats last. Each class on the timetable shows how many are free right now.",
  },
  {
    q: "What should I bring?",
    a: "Comfortable clothes and water. Mats, props, towels for the ice bath and tea are all here.",
  },
  {
    q: "Is the free class really free?",
    a: "Yes — any class, no card, no catch. If you like it, the drop-in or a pass is waiting at the desk.",
  },
  {
    q: "What if it rains?",
    a: "The sala has a deep roof and roll-down screens. Monsoon classes are some of our favourites.",
  },
] as const;

export const GALLERY = [
  { src: "/img/layouts/retreat-1.jpg", alt: "Meditation on a teak deck at sunrise, palms behind", note: "sunrise, before the first class" },
  { src: "/img/layouts/retreat-2.jpg", alt: "A woman in the infinity pool facing the jungle hills", note: "the pool, after" },
  { src: "/img/layouts/yoga-sunset-pose.jpg", alt: "Low lunge silhouetted against a pink sunset sky", note: "sunset flow" },
  { src: "/img/layouts/retreat-4.jpg", alt: "A stone Buddha among ferns in the garden", note: "the garden path" },
] as const;

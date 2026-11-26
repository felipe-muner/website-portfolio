// FICTIONAL content for the Moonday yoga layout (/yoga/v5). Every name,
// price and detail is invented — the page is a demo shown to prospects.

import { SYNODIC_MONTH } from "@/lib/layouts/moon";

export const MOONDAY = {
  red: "#c2361d",
  frame: "#ec5a3d",
  cream: "#f6f2e7",
  ink: "#5e5850",
  line: "#f1bcab",
  blush: "#f6dccf",
  deep: "#a42c15",
} as const;

export interface LunarStage {
  name: string;
  /** Phase used to draw the glyph: 0 new, 0.5 full. */
  phase: number;
  /** Moon age range in days, on a 0 – 29.53 track. */
  from: number;
  to: number;
  label: string;
  title: string;
  text: string;
  image?: string;
}

const STEP = SYNODIC_MONTH / 8;

function stage(i: number, s: Omit<LunarStage, "phase" | "from" | "to">): LunarStage {
  const from = i === 0 ? 0 : (i - 0.5) * STEP;
  const to = i === 7 ? SYNODIC_MONTH : (i + 0.5) * STEP;
  return { ...s, phase: i / 8, from, to };
}

/** The month, phase by phase, and what the timetable does in each. */
export const LUNAR_STAGES: readonly LunarStage[] = [
  stage(0, {
    name: "New moon",
    label: "Days 0 to 2",
    title: "Begin in the dark",
    text: "Long Yin holds, a notebook and an early night. Nobody is asked to go upside down this week.",
  }),
  stage(1, {
    name: "Waxing crescent",
    label: "Days 2 to 6",
    title: "Lay the base",
    text: "Mat Pilates and alignment work: feet, knees and shoulders lined up before anything gets heavy.",
    image: "/img/layouts/yoga-home-plant.jpg",
  }),
  stage(2, {
    name: "First quarter",
    label: "Days 6 to 9",
    title: "Push a little",
    text: "Power Vinyasa at its hardest. Arm balances, longer flows, and the most sweat of the month.",
    image: "/img/layouts/yoga-warrior-class.jpg",
  }),
  stage(3, {
    name: "Waxing gibbous",
    label: "Days 9 to 13",
    title: "Refine it",
    text: "Fewer, better reps on the reformer. Small rooms, precise cues, the shape of the pose made clean.",
    image: "/img/layouts/yoga-backbend.jpg",
  }),
  stage(4, {
    name: "Full moon",
    label: "Days 13 to 17",
    title: "Open everything",
    text: "Breathwork and ice on the deck, then the Full Moon Flow on the sand with the whole studio.",
  }),
  stage(5, {
    name: "Waning gibbous",
    label: "Days 17 to 20",
    title: "Share it",
    text: "Partner yoga and community classes. Bring the friend who keeps saying they'll come.",
    image: "/img/layouts/yoga-beach-group.jpg",
  }),
  stage(6, {
    name: "Last quarter",
    label: "Days 20 to 24",
    title: "Let go",
    text: "Deep stretch and mobility. Undo the strong weeks and find the range they built.",
    image: "/img/layouts/mobility-ball.jpg",
  }),
  stage(7, {
    name: "Waning crescent",
    label: "Days 24 to 29½",
    title: "Soften",
    text: "Slow flow, sound bath and an easy last week before the sky goes dark and it all starts again.",
    image: "/img/layouts/yoga-fold-bw.jpg",
  }),
];

export interface MoondayClass {
  name: string;
  text: string;
  meta: string;
  when: string;
  image: string;
}

export const MOONDAY_CLASSES: readonly MoondayClass[] = [
  {
    name: "Vinyasa",
    text: "Strong flows tied to the breath, built up through the waxing week and at their hardest around the first quarter.",
    meta: "75 minutes · All levels · Up to 18 people",
    when: "Busiest as the moon fills",
    image: "/img/layouts/yoga-warrior-class.jpg",
  },
  {
    name: "Yin",
    text: "Long, quiet holds on the floor with bolsters and blankets. The class we schedule most when the sky is dark.",
    meta: "75 minutes · All levels · Up to 14 people",
    when: "Every new moon",
    image: "/img/layouts/yoga-meditation-studio.jpg",
  },
  {
    name: "Ice",
    text: "Three rounds of guided breathing, then three minutes in the cold tub. Saturday at dusk, and on every full moon.",
    meta: "90 minutes · Over 16s · Up to 10 people",
    when: "Saturdays and full moons",
    image: "/img/layouts/breathwork-group.jpg",
  },
  {
    name: "Moon flow",
    text: "Once a month on the beach below the studio: candles, a slow flow and a long savasana with the sea.",
    meta: "60 minutes · Everyone · Up to 40 people",
    when: "The night of the full moon",
    image: "/img/layouts/fullmoon-4.jpg",
  },
];

/** The manifesto: [keyword, rest of the sentence]. */
export const MOON_RULES: readonly (readonly [string, string])[] = [
  ["Rest", "is part of the practice, never a break from it."],
  ["Rhythm", "beats willpower: a month has a shape, and so does progress."],
  ["Patience,", "because nothing worth building is full in one night."],
  ["Light", "comes back every time, even after the darkest week."],
  ["Release", "what the full moon showed you."],
  ["Return", "to the mat, because the cycle always starts again."],
];

export interface MoondayTeacher {
  name: string;
  role: string;
  bio: string;
  image: string;
  /** Moon phase used as the teacher's symbol. */
  phase: number;
}

export const MOONDAY_TEACHERS: readonly MoondayTeacher[] = [
  {
    name: "Amara Duval",
    role: "Founder · Yin and the moon flows",
    bio: "Trained in Lyon and Mysore. Teaches the new-moon Yin and has led every Full Moon Flow on the sand.",
    image: "/img/layouts/person-f6.jpg",
    phase: 0.5,
  },
  {
    name: "Noah Reyes",
    role: "Vinyasa · Breathwork and ice",
    bio: "A former lifeguard who still counts breaths like laps. Runs the dawn flows and the Saturday ice.",
    image: "/img/layouts/person-m2.jpg",
    phase: 0.25,
  },
  {
    name: "Isla Marsh",
    role: "Pilates · Backs and alignment",
    bio: "Ten years as a physiotherapist before the island. Leads the waxing-week strength block.",
    image: "/img/layouts/person-f4.jpg",
    phase: 0.125,
  },
  {
    name: "Mali Srisuk",
    role: "Reformer · Small rooms",
    bio: "Born on the island and trained in Bangkok. Precise cues, very few spare reps, a lot of laughing.",
    image: "/img/layouts/person-f8.jpg",
    phase: 0.75,
  },
];

export const AUDIENCES = [
  {
    title: "Surfers and runners",
    text: "Hips that open and shoulders that paddle longer, timed around your big days.",
    image: "/img/layouts/yoga-sunset-pose.jpg",
  },
  {
    title: "Desk backs",
    text: "Laptop hours undone on the mat: a spine that moves again and shoulders that drop.",
    image: "/img/layouts/yoga-fold-bw.jpg",
  },
  {
    title: "First timers",
    text: "No flexibility needed. Start on a new moon, with the slowest class we teach.",
    image: "/img/layouts/yoga-home-plant.jpg",
  },
  {
    title: "Travellers",
    text: "Here for a week or a season. Drop in, or follow one whole cycle with us.",
    image: "/img/layouts/retreat-2.jpg",
  },
] as const;

export const SALA_FACTS = [
  { title: "Teak sala", text: "Forty mats, open on three sides" },
  { title: "Ice and steam", text: "Two cold tubs, one steam room" },
  { title: "Props", text: "Bolsters, blocks and straps included" },
  { title: "The beach", text: "Two minutes down the path" },
] as const;

export const MOONDAY_PLANS = [
  {
    name: "First class",
    price: "฿300",
    unit: "Any one class",
    text: "A full class on the timetable, with a few minutes before it for your teacher to ask about your body.",
    cta: "Book a first class",
  },
  {
    name: "One moon",
    price: "฿2,600",
    unit: "Ten classes · use them in two cycles",
    text: "Any class, any teacher. Most people come three times a week and finish the pass within one moon.",
    cta: "Buy ten classes",
    featured: true,
  },
  {
    name: "Unlimited",
    price: "฿3,300",
    unit: "A month · stop with a cycle's notice",
    text: "Every class on the timetable, the ice and steam, and a place at every Full Moon Flow on the beach.",
    cta: "Go unlimited",
  },
] as const;

// FICTIONAL content for Golden Hour Beach Club (/goldenhour). Every name,
// price, time, bed, review and rule here is invented for the portfolio demo;
// the address and phone come from the shared fictional CONTACT.

/** Demo sunset, Bangkok time — the hero, the timeline and the copy all agree on it. */
export const SUNSET = "18:35";

/** Hours the pool, deck and kitchen keep (Bangkok time). */
export const HOURS = { open: "11:00", lastCall: "23:30", kitchenClose: "22:00" } as const;

/** "18:35" → minutes since midnight. */
export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** 1500 → "฿1,500". */
export const baht = (n: number) => `฿${n.toLocaleString("en-US")}`;

export type SpotKind = "bed" | "cabana" | "stool";

export interface Spot {
  id: string;
  kind: SpotKind;
  /** Which part of the club it sits in. */
  row: string;
  /** Where on the deck map (SVG units, 800 × 480). */
  x: number;
  y: number;
  w: number;
  h: number;
  seats: number;
  /** ฿ — hire for the day; nothing for a bar stool. */
  price: number;
  /** ฿ — all of it credited to food & drink. */
  minSpend: number;
  /** Already taken today (demo). */
  held?: boolean;
}

export const KIND_LABEL: Record<SpotKind, string> = { bed: "Day bed", cabana: "Cabana", stool: "Bar stool" };

const FRONT = "Front row · on the sand";
const DECK = "Deck · by the pool";
const BAR = "Sand bar";

/** The deck, bed by bed. Ids read like the little brass plates on the real thing. */
export const SPOTS: readonly Spot[] = [
  // Front row, on the sand — umbrellas, feet in the water at high tide.
  ...[1, 2, 3, 4, 5, 6, 7, 8].map(
    (n): Spot => ({
      id: `S${n}`,
      kind: "bed",
      row: FRONT,
      x: 52 + (n - 1) * 90,
      y: 152,
      w: 62,
      h: 36,
      seats: 2,
      price: 500,
      minSpend: 1500,
      held: n === 3 || n === 6,
    }),
  ),
  // Cabanas along the pool.
  ...[1, 2, 3, 4].map(
    (n): Spot => ({
      id: `C${n}`,
      kind: "cabana",
      row: DECK,
      x: 52 + (n - 1) * 118,
      y: 238,
      w: 92,
      h: 66,
      seats: 6,
      price: 2000,
      minSpend: 6000,
      held: n === 2,
    }),
  ),
  // Second row, on the deck.
  ...[1, 2, 3, 4, 5, 6].map(
    (n): Spot => ({
      id: `D${n}`,
      kind: "bed",
      row: DECK,
      x: 52 + (n - 1) * 80,
      y: 336,
      w: 62,
      h: 36,
      seats: 2,
      price: 300,
      minSpend: 1000,
      held: n === 4,
    }),
  ),
  // Stools at the sand bar — first come, first poured.
  ...[1, 2, 3, 4, 5, 6].map(
    (n): Spot => ({
      id: `B${n}`,
      kind: "stool",
      row: BAR,
      x: 572 + (n - 1) * 32,
      y: 420,
      w: 24,
      h: 24,
      seats: 1,
      price: 0,
      minSpend: 0,
    }),
  ),
];

export const spotName = (s: Spot) => `${KIND_LABEL[s.kind]} ${s.id}`;

/** What a bed comes with, by kind. */
export const INCLUDED: Record<SpotKind, string> = {
  bed: "Two towels, a cold-water carafe, reef-safe sunscreen and an umbrella that follows the sun.",
  cabana: "Curtains, a ceiling fan, six towels, a fruit plate on arrival and your own waiter.",
  stool: "A frosted glass and the best view of the pour. No booking, no minimum.",
};

export interface Moment {
  time: string;
  title: string;
  note: string;
}

/** Today at the club — the same every day except the names on the decks. */
export const TODAY: readonly Moment[] = [
  { time: "11:00", title: "Pool & beds open", note: "Towels out, carafes filled, the first espresso of the day." },
  { time: "12:30", title: "Kitchen opens", note: "Charcoal lit; the som tam station runs until 22:00." },
  { time: "15:00", title: "Afternoon set · Nok", note: "Slow disco and Thai funk 45s from the booth on the sand." },
  { time: "17:00", title: "Happy hour", note: "Spritzes and house pours ฿150 until the sun touches the water." },
  { time: "17:45", title: "Golden hour set · Marlo", note: "The resident takes it down and lets the sky do the work." },
  { time: SUNSET, title: "Sunset", note: "The deck goes quiet for a minute. It always does." },
  { time: "19:30", title: "Fire show on the sand", note: "Twenty minutes. The front row feels the heat." },
  { time: "21:00", title: "Night session", note: "Guest selector, lanterns up, the deck becomes a floor." },
  { time: "23:30", title: "Last call", note: "Songthaews wait at the gate until midnight." },
];

export interface Session {
  day: string;
  title: string;
  time: string;
  lineup: string;
  note: string;
  cover: string;
}

/** The week's sunset sessions. */
export const SESSIONS: readonly Session[] = [
  {
    day: "Tue",
    title: "Vinyl Sundowners",
    time: "16:00 – 22:00",
    lineup: "Nok · all 45s",
    note: "Dusty disco, Thai funk and rare groove — nothing newer than 1985.",
    cover: "Free",
  },
  {
    day: "Thu",
    title: "Balearic Thursday",
    time: "17:00 – 23:00",
    lineup: "Marlo & guests",
    note: "Slow house and chuggers for the longest sunset of the week.",
    cover: "Free",
  },
  {
    day: "Fri",
    title: "Fire & Bass",
    time: "17:00 – 01:00",
    lineup: "Fire show · Kesa (live) · DJ Lamai",
    note: "Fire on the sand at 19:30, then the deck turns into a dance floor.",
    cover: "฿300 after 20:00",
  },
  {
    day: "Sat",
    title: "Golden Hour Sessions",
    time: "15:00 – 02:00",
    lineup: "Headline guest · residents",
    note: "The big one. Beds go a week ahead; the front row goes first.",
    cover: "฿500 after 20:00",
  },
  {
    day: "Sun",
    title: "Slow Sunday",
    time: "11:00 – 22:00",
    lineup: "Acoustic trio · brunch till 15:00",
    note: "Bloody Marys, eggs on the sand and a band on the tideline.",
    cover: "Free",
  },
];

export interface Dish {
  name: string;
  detail: string;
  /** ฿ */
  price: number;
}

export const MENU: { kitchen: readonly Dish[]; bar: readonly Dish[] } = {
  kitchen: [
    { name: "Whole grilled sea bass", detail: "Charcoal, nam jim seafood, lime leaf, steamed rice", price: 690 },
    { name: "Som tam with soft-shell crab", detail: "Green papaya, peanuts, as spicy as you dare", price: 320 },
    { name: "Tuna tataki tostadas", detail: "Three, with avocado, chilli jam and crispy shallots", price: 360 },
    { name: "Wood-fired margherita", detail: "Buffalo mozzarella, island basil, ninety seconds in the oven", price: 390 },
    { name: "Mango sticky rice sundae", detail: "Coconut soft serve, toasted mung beans, salted caramel", price: 220 },
  ],
  bar: [
    { name: "Golden Hour spritz", detail: "Aperol, passion fruit, prosecco, a bruised stem of lemongrass", price: 290 },
    { name: "Coconut & kaffir daiquiri", detail: "Young coconut, white rum, kaffir lime, shaken hard", price: 280 },
    { name: "Tamarind margarita", detail: "Tequila blanco, tamarind, a chilli-salt rim", price: 300 },
    { name: "Watermelon & basil cooler", detail: "No alcohol, a lot of ice", price: 150 },
    { name: "Island lager", detail: "Draught, frosted glass — ฿120 at happy hour", price: 160 },
  ],
};

export const GALLERY = [
  { src: "/img/layouts/beachclub-1.jpg", alt: "Golden hour over the beachfront day beds", note: "front row, 18:20" },
  { src: "/img/layouts/beachclub-2.jpg", alt: "Cabanas along the infinity pool edge", note: "the cabanas" },
  { src: "/img/layouts/beachclub-4.jpg", alt: "The lounge bar lit up after dark", note: "the sand bar, after" },
  { src: "/img/layouts/beachclub-5.jpg", alt: "Dancers on the sand under string lights", note: "saturday, late" },
  { src: "/img/layouts/beach-umbrella.jpg", alt: "A beach umbrella over an empty sun bed", note: "noon, nobody's bed yet" },
] as const;

export const RULES = [
  {
    title: "Minimum spend, not a fee",
    body: "Every baht of a bed's minimum goes on food and drink. A bottle, a feast or forty spritzes — it all counts.",
  },
  {
    title: "We hold beds for 30 minutes",
    body: "Past that, the bed goes to the waitlist. Message us if the ferry is late and we'll do our best.",
  },
  {
    title: "Kids until sunset",
    body: "Families are welcome on the sand and in the pool until 18:00. After the sun goes, the club is 20+.",
  },
  {
    title: "No glass on the sand",
    body: "Bottles stay on the deck. Bare feet and the tideline don't mix with broken glass.",
  },
  {
    title: "Reef-safe sunscreen only",
    body: "Ours is free at the towel hut. The bay's coral is forty metres out and we'd like to keep it.",
  },
  {
    title: "Swim in swimwear, dine in a cover-up",
    body: "Pool and sand, anything goes. From 19:00 the deck restaurant asks for a shirt or a sarong.",
  },
] as const;

export const GETTING_THERE = [
  { how: "Songthaew", detail: "Twelve minutes from Thong Sala pier. Say Golden Hour — every driver knows. About ฿100 a head." },
  { how: "Scooter", detail: "Free parking for forty scooters inside the gate. The last 300 m is packed sand; take it slow." },
  { how: "Longtail", detail: "On calm days boats drop at our jetty. We can arrange one from Haad Rin for ฿600 each way." },
  { how: "Club shuttle", detail: "Leaves the Srithanu 7-Eleven at 15:00 and 17:00, back at 23:30. ฿100 return — add it to your booking." },
] as const;

export const REVIEWS = [
  { quote: "Front-row bed, the fire show ten metres away, a sea bass that was swimming that morning.", who: "Hanna · Berlin" },
  { quote: "The only beach club on the island where the DJ turns it down for the sunset.", who: "Tom · Melbourne" },
  { quote: "We came for one spritz at four and left in a songthaew at midnight.", who: "Priya · Bangkok" },
  { quote: "Cabana 3 with six of us and the waiter never let a glass sit empty.", who: "Lukas · Zürich" },
  { quote: "Tamarind margarita. That's the review.", who: "Mei · Singapore" },
  { quote: "Kids in the pool till six, then it turned into the best night of the trip.", who: "Sophie · Bristol" },
  { quote: "The minimum spend is easy when the som tam is this good.", who: "Daniel · Tel Aviv" },
  { quote: "Lanterns over the water after dark — nobody warned us, nobody needed to.", who: "Aroon · Chiang Mai" },
] as const;

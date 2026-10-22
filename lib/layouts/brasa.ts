// FICTIONAL content for Brasa Fire Kitchen (/brasa) — an island open-fire
// restaurant template. Every dish, price, person, review and opening hour here
// is invented for the demo; the contact details come from the shared CONTACT.

export const BRAND = {
  name: "Brasa Fire Kitchen",
  short: "BRASA",
  line: "Open-fire kitchen",
} as const;

/** Service hours in studio (Bangkok) time. Closed one day a week. */
export const HOURS = {
  open: "17:00",
  lastOrders: "22:30",
  barClose: "00:00",
  /** 0 = Monday … 6 = Sunday. */
  closedWeekday: 0,
  days: "Tue – Sun",
} as const;

/** Sitting times offered in the booking form. */
export const SITTINGS = ["17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"] as const;
export type Sitting = (typeof SITTINGS)[number];

export interface TableOption {
  name: string;
  seats: string;
  blurb: string;
  /** Preselect this sitting when the table is chosen from a chip. */
  sitting?: Sitting;
}

export const ANY_TABLE = "Any table";

export const TABLES: readonly TableOption[] = [
  { name: ANY_TABLE, seats: "1 – 8", blurb: "We'll seat you wherever the room is best that night." },
  {
    name: "Chef's counter",
    seats: "6 stools",
    blurb: "Elbows on steel, a metre from the pit. Every plate goes on and comes off in front of you.",
  },
  {
    name: "Sunset table",
    seats: "2 – 4",
    blurb: "West edge of the terrace, nothing between you and the water. The sun goes down around a quarter past six.",
    sitting: "18:00",
  },
  { name: "Terrace", seats: "2 – 6", blurb: "Under the tamarind tree, sea breeze, lanterns after dark." },
  { name: "The long table", seats: "8 – 14", blurb: "One slab of reclaimed teak for groups — whole fish and ribs down the middle." },
];

export const MENU_SECTIONS = ["To start", "From the coals", "Sides & salads", "Sweet", "Drinks"] as const;
export type MenuSection = (typeof MENU_SECTIONS)[number];

export const MENU_TAGS = ["spicy", "seafood", "vegan", "vegetarian", "gluten-free", "to share"] as const;
export type MenuTag = (typeof MENU_TAGS)[number];

/** 0 none … 3 properly hot. */
export type Heat = 0 | 1 | 2 | 3;
export const HEAT_LABEL: Record<Heat, string> = { 0: "No chilli", 1: "Mild", 2: "Medium", 3: "Hot" };

export interface Dish {
  name: string;
  detail: string;
  /** ฿ — demo prices. */
  price: number;
  /** "for two", "600 g" — shown after the price. */
  note?: string;
  section: MenuSection;
  heat: Heat;
  tags: readonly MenuTag[];
  /** Which wood it's cooked over, when it matters. */
  wood?: string;
}

export const MENU: readonly Dish[] = [
  // To start
  { name: "Charred corn ribs", detail: "Nam prik pao butter, lime, crispy shallots", price: 180, section: "To start", heat: 1, tags: ["vegetarian", "gluten-free"] },
  { name: "Ember-roasted beetroot", detail: "Buried in the coals for an hour; coconut labneh, cashew, holy basil oil", price: 190, section: "To start", heat: 0, tags: ["vegan", "gluten-free"] },
  { name: "Grilled squid", detail: "Scored and flashed over tamarind, green mango, roasted chilli jam", price: 260, section: "To start", heat: 2, tags: ["seafood", "spicy"], wood: "tamarind" },
  { name: "Smoked bone marrow", detail: "Split and roasted, tamarind glaze, grilled roti to drag through it", price: 320, section: "To start", heat: 0, tags: ["to share"] },
  { name: "Blistered long beans & shishito", detail: "Black garlic, sesame, a little fish-sauce caramel (vegan on request)", price: 170, section: "To start", heat: 1, tags: ["vegetarian", "spicy"] },
  { name: "Scallops in the shell", detail: "Four, straight on the coals, lemongrass butter and lime leaf", price: 390, section: "To start", heat: 0, tags: ["seafood", "gluten-free"] },

  // From the coals
  { name: "Whole Andaman snapper", detail: "Packed in sea salt, buried in longan embers; nam jim seafood, herbs, rice", price: 890, note: "for two", section: "From the coals", heat: 2, tags: ["seafood", "to share", "gluten-free", "spicy"], wood: "longan" },
  { name: "Tiger prawns", detail: "Split and grilled over tamarind, chilli-lime butter, charred lime", price: 620, section: "From the coals", heat: 2, tags: ["seafood", "spicy", "gluten-free"], wood: "tamarind" },
  { name: "Dry-aged pork chop", detail: "Thick-cut, hung over the pit, burnt pineapple and holy basil", price: 590, section: "From the coals", heat: 1, tags: [], wood: "longan" },
  { name: "Bone-in ribeye, 48 days", detail: "Charcoal salt, jaew dipping sauce, roasted bone marrow butter", price: 1450, note: "600 g, for two", section: "From the coals", heat: 2, tags: ["to share", "gluten-free", "spicy"], wood: "tamarind" },
  { name: "Half jungle chicken", detail: "Turmeric, black pepper and lemongrass; hung for forty minutes, charred lime", price: 420, section: "From the coals", heat: 1, tags: ["gluten-free"], wood: "longan" },
  { name: "Smoked young jackfruit", detail: "Ember-roasted eggplant, green curry oil, toasted rice, Thai basil", price: 360, section: "From the coals", heat: 2, tags: ["vegan", "spicy", "gluten-free"] },
  { name: "Lamb ribs, twelve hours", detail: "Slow over longan, then crisped on the grate; mint nahm jim, pickled shallot", price: 680, section: "From the coals", heat: 2, tags: ["spicy", "to share"], wood: "longan" },

  // Sides & salads
  { name: "Grilled roti", detail: "Burnt-honey butter, flaky sea salt", price: 90, section: "Sides & salads", heat: 0, tags: ["vegetarian"] },
  { name: "Coal-baked sweet potato", detail: "Split, smoked chilli crema, spring onion", price: 140, section: "Sides & salads", heat: 1, tags: ["vegetarian", "gluten-free"] },
  { name: "Som tam of charred papaya", detail: "Green papaya off the plancha, peanuts, dried shrimp, a lot of chilli", price: 160, section: "Sides & salads", heat: 3, tags: ["spicy", "seafood", "gluten-free"] },
  { name: "Watermelon, feta & ash", detail: "Mint, lime, burnt-shallot ash", price: 170, section: "Sides & salads", heat: 0, tags: ["vegetarian", "gluten-free"] },
  { name: "Sticky rice from the embers", detail: "Steamed in banana leaf, finished in the coals", price: 70, section: "Sides & salads", heat: 0, tags: ["vegan", "gluten-free"] },
  { name: "Jasmine rice", detail: "Plain, because the fish deserves it", price: 40, section: "Sides & salads", heat: 0, tags: ["vegan", "gluten-free"] },

  // Sweet
  { name: "Burnt coconut custard", detail: "Palm sugar, grilled banana, toasted coconut", price: 190, section: "Sweet", heat: 0, tags: ["vegetarian", "gluten-free"] },
  { name: "Mango & sticky rice", detail: "Coconut cream warmed by the fire, black sesame", price: 180, section: "Sweet", heat: 0, tags: ["vegan", "gluten-free"] },
  { name: "Charred pineapple", detail: "Chilli-lime salt, coconut sorbet", price: 160, section: "Sweet", heat: 1, tags: ["vegan", "spicy", "gluten-free"] },
  { name: "Smoked chocolate tart", detail: "Cacao from Chumphon, sea salt, cold cream", price: 210, section: "Sweet", heat: 0, tags: ["vegetarian"] },

  // Drinks
  { name: "Smoked old fashioned", detail: "Mekhong, burnt orange, palm sugar, a cloud of longan smoke", price: 320, section: "Drinks", heat: 0, tags: [] },
  { name: "Lemongrass & chilli margarita", detail: "Tequila blanco, lemongrass, bird's-eye tincture, lime", price: 290, section: "Drinks", heat: 1, tags: ["spicy", "vegan"] },
  { name: "Burnt pineapple sour", detail: "Rum, grilled pineapple, lime, aquafaba", price: 280, section: "Drinks", heat: 0, tags: ["vegan"] },
  { name: "Island draught", detail: "Singha or the local brewery's pale ale, ice-cold", price: 150, section: "Drinks", heat: 0, tags: ["vegan"] },
  { name: "Wine by the glass", detail: "A chilled red and a dry white that both stand up to smoke", price: 220, section: "Drinks", heat: 0, tags: ["vegan"] },
  { name: "Fresh coconut", detail: "Opened to order, charred lime wedge", price: 90, section: "Drinks", heat: 0, tags: ["vegan", "gluten-free"] },
  { name: "Toasted-rice iced tea", detail: "Unsweetened, lots of ice — the best thing with the som tam", price: 80, section: "Drinks", heat: 0, tags: ["vegan", "gluten-free"] },
];

export interface Wood {
  name: string;
  burns: string;
  use: string;
  body: string;
}

export const WOODS: readonly Wood[] = [
  {
    name: "Longan",
    burns: "Low & long",
    use: "Whole fish, lamb, the hanging meats",
    body: "Dense orchard wood from up north that would otherwise be burned as waste. It settles into a bed that holds a steady heat for hours and gives a sweet, soft smoke.",
  },
  {
    name: "Tamarind",
    burns: "Hot & fast",
    use: "Prawns, squid, the ribeye",
    body: "Burns bright and quick with a sharp, almost citrus smoke. We feed it in by the handful for the things that want a fierce sear and thirty seconds, not thirty minutes.",
  },
  {
    name: "Coconut-shell charcoal",
    burns: "Even & clean",
    use: "The base bed, the plancha",
    body: "Made on the island from husks the copra farms throw away. Almost no flare, almost no flavour of its own — the quiet floor the other two woods sit on.",
  },
];

export const TECHNIQUES = [
  { name: "In the embers", body: "Beetroot, sweet potato and the sticky rice go straight into the coals, no tray, no foil. The skin burns; everything inside steams in its own sugar." },
  { name: "On the hooks", body: "Chicken and pork hang from a rail over the pit, turned by hand. The drippings hit the fire and come back up as smoke." },
  { name: "Salt crust", body: "The snapper is packed in sea salt and egg white and buried for twenty-five minutes. We crack it open at the table." },
  { name: "The plancha", body: "A thick steel plate at the cool end of the pit for scallops, corn, the roti and anything too delicate for the grate." },
] as const;

export const GALLERY = [
  { src: "/img/layouts/restaurant-warm.jpg", alt: "A dark dining room with copper extraction hoods over an open kitchen", note: "the room — six counter stools face the pit" },
  { src: "/img/layouts/restaurant-rooftop.jpg", alt: "A wooden terrace with white tables under a canopy, facing the sea at sunset", note: "the terrace, west-facing — sunset is the best seat" },
  { src: "/img/layouts/food-feast.jpg", alt: "Three plates of grilled meat with chillies, cashews and herbs on a wooden table", note: "from the coals — ribeye, jaew, lots of chilli" },
  { src: "/img/layouts/food-fine-dining.jpg", alt: "A plate of seared fish being set down at a candlelit table", note: "the long table, late" },
] as const;

export const CHEF = {
  name: "Tanit Srisuk",
  nickname: "Tan",
  role: "Chef & fire-keeper",
  image: "/img/layouts/cooking-2.jpg",
  imageAlt: "A dark street-kitchen station at night, a wok over a low flame",
  quote: "The fire sets the pace. My job is to listen to it.",
  note: [
    "I grew up on my grandmother's charcoal stove in Surat Thani — one clay pot, one palm-leaf fan, and a week's worth of flavour from a handful of coals. Brasa is that stove, scaled up and moved to the beach. There is no gas in this kitchen and nothing electric except the fridges and the lights.",
    "We buy whole fish from the longtails at the north pier each morning, pork from a farm an hour inland, and wood from orchards that would otherwise burn it as rubbish. The menu changes with what comes in; the fire never does.",
    "Sit at the counter and you'll see every plate go on and come off. Sit on the terrace and you'll smell it. Either way — come hungry, and don't rush.",
  ],
} as const;

export const REVIEWS = [
  { quote: "The salt-crust snapper changed my mind about fish. We went back the next night.", who: "Hannah · Melbourne" },
  { quote: "Six seats at the counter, a metre from the coals. Best dinner theatre on the island.", who: "Marcus · Berlin" },
  { quote: "Lamb ribs fell off the bone, the mint nahm jim was outrageous. Book the sunset table.", who: "Priya · London" },
  { quote: "Came for a cocktail, stayed for the prawns, left smelling of tamarind smoke. No regrets.", who: "Ploy · Bangkok" },
  { quote: "Vegan here and ate like a king — the smoked jackfruit is the real deal.", who: "Jonas · Copenhagen" },
  { quote: "Honest cooking, zero fuss, insane fire. Our kids were hypnotised by the pit.", who: "The Okafors · Lagos" },
  { quote: "The smoked old fashioned alone is worth the taxi from the other side of the island.", who: "Elena · Madrid" },
  { quote: "Sticky rice from the embers. I've thought about it every day since.", who: "Ken · Osaka" },
] as const;

export const TICKER = [
  "Longan wood",
  "Tamarind smoke",
  "Whole snapper in salt",
  "Chef's counter · 6 seats",
  "Sunset terrace",
  "No gas in the kitchen",
  "Fire lit at 15:00",
  `Last orders ${HOURS.lastOrders}`,
] as const;

export const STATS = [
  { v: "15:00", l: "Fire lit daily" },
  { v: "3", l: "Woods on the pit" },
  { v: "6", l: "Counter stools" },
  { v: "0", l: "Gas burners" },
] as const;

export const VISIT = [
  { title: "Getting here", body: "Ten minutes south of the main pier on the beach road. Look for the tamarind tree and the smoke." },
  { title: "Parking", body: "Scooter parking at the gate; taxis and songthaews drop you under the tree." },
  { title: "Kids & dogs", body: "Both welcome on the terrace. The counter is for ages twelve and up — it gets hot." },
  { title: "Rain", body: "The terrace has a deep roof; the room seats forty when the monsoon does its thing." },
] as const;

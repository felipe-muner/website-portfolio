// Content for the artist template (/artist): Maria Meads Art — a visionary
// painter (soul portraits, visionary canvases, hand-painted denim). Artwork,
// titles and statements are hers (instagram.com/maria_meads_art, her Etsy shop
// descriptions, lightly edited); prices, tiers, timelines, quotes and the
// studio schedule are DEMO placeholders invented for the preview.

export const ARTIST = {
  name: "Maria Meads",
  studio: "Maria Meads Art",
  tagline: "Transmuting the beautiful chaos of existence into colourful creations",
  base: "Painting between Bali and the Thai islands",
  instagram: "https://www.instagram.com/maria_meads_art/",
  handle: "@maria_meads_art",
  etsy: "https://mariameadsart.etsy.com",
  email: "hello@mariameads.art",
  emailHref: "mailto:hello@mariameads.art",
} as const;

export type Series = "Visionary" | "Soul portraits" | "Animals & nature" | "Wearable art";

export const SERIES: readonly Series[] = ["Visionary", "Soul portraits", "Animals & nature", "Wearable art"];

export interface Work {
  slug: string;
  title: string;
  series: Series;
  year: number;
  medium: string;
  size: string;
  /** Width ÷ height of the image. */
  aspect: number;
  image: string;
  statement: string;
  status: "available" | "sold" | "commission";
  /** Print available in the shop. */
  print?: boolean;
}

export const WORKS: readonly Work[] = [
  {
    slug: "resonance",
    title: "Resonance",
    series: "Visionary",
    year: 2024,
    medium: "Acrylic on canvas",
    size: "60 × 75 cm",
    aspect: 0.8,
    image: "/img/layouts/meads-resonance.jpg",
    statement:
      "The power of music to move us: the ancestral frequencies of love and union that run through our veins, feeding all life and creation.",
    status: "sold",
    print: true,
  },
  {
    slug: "balance",
    title: "Balance",
    series: "Visionary",
    year: 2024,
    medium: "Acrylic on canvas",
    size: "60 × 75 cm",
    aspect: 0.8,
    image: "/img/layouts/meads-balance.jpg",
    statement:
      "Vast ocean and the majestic creatures of the sea. The harmony of fluidity, breaking through resistance, swimming the tidal currents. Powerful and strong while nurturing with tenderness: spirit of water, wash me with your love.",
    status: "available",
    print: true,
  },
  {
    slug: "sacred-whispers",
    title: "Sacred Whispers",
    series: "Visionary",
    year: 2023,
    medium: "Acrylic on canvas",
    size: "50 × 70 cm",
    aspect: 0.707,
    image: "/img/layouts/meads-sacred-whispers.jpg",
    statement:
      "Falling through the valleys of space and time, held by divinity and grace entwined. Feeling the warm presence of the mother as she carries me on this journey, welcomed into the arms of angels and all the love this world offers.",
    status: "available",
    print: true,
  },
  {
    slug: "gentle-earthling",
    title: "Gentle Earthling",
    series: "Soul portraits",
    year: 2025,
    medium: "Acrylic on canvas",
    size: "50 × 70 cm",
    aspect: 0.74,
    image: "/img/layouts/meads-gentle-earthling.jpg",
    statement:
      "A soul portrait painted from one long conversation and a single photograph: the sitter's quiet strength rendered in leaves and butterflies, a third eye of still water at the brow.",
    status: "commission",
    print: true,
  },
  {
    slug: "lotus-rising",
    title: "Lotus Rising",
    series: "Soul portraits",
    year: 2025,
    medium: "Acrylic on round canvas",
    size: "60 cm diameter",
    aspect: 0.755,
    image: "/img/layouts/meads-peacock.jpg",
    statement:
      "A commissioned round canvas: a meditating figure held inside a crown of peacock feathers, a lotus opening at the base of the circle as the feathers turn into river and jungle.",
    status: "commission",
  },
  {
    slug: "keeper-of-the-waterfall",
    title: "Keeper of the Waterfall",
    series: "Animals & nature",
    year: 2025,
    medium: "Acrylic on round canvas",
    size: "60 cm diameter",
    aspect: 0.75,
    image: "/img/layouts/meads-elephant.jpg",
    statement:
      "The elephant as keeper of memory, standing over a waterfall at sunrise, two hummingbirds and a ring of daisies closing the circle. Painted for a family home by the sea.",
    status: "commission",
  },
  {
    slug: "elemental",
    title: "Elemental",
    series: "Visionary",
    year: 2023,
    medium: "Acrylic on canvas",
    size: "50 × 70 cm",
    aspect: 0.725,
    image: "/img/layouts/meads-elemental.jpg",
    statement:
      "Born in Bali from the building blocks of life: the first sparks of atoms, protons and energy that form everything we know. Layer by layer it became a meditation on the foundations of existence, where the elements meet spirit and creation begins.",
    status: "available",
    print: true,
  },
  {
    slug: "saraswati",
    title: "Saraswati",
    series: "Visionary",
    year: 2024,
    medium: "Acrylic on canvas",
    size: "60 × 75 cm",
    aspect: 0.8,
    image: "/img/layouts/meads-saraswati.jpg",
    statement:
      "The goddess of knowledge, music and the arts, seated on her lotus with the veena and her swan. Painted as a devotion to the creative current itself.",
    status: "sold",
    print: true,
  },
  {
    slug: "sword-of-discernment",
    title: "Sword of Discernment",
    series: "Visionary",
    year: 2024,
    medium: "Acrylic on canvas",
    size: "50 × 70 cm",
    aspect: 0.73,
    image: "/img/layouts/meads-sword.jpg",
    statement:
      "Rising like a phoenix from the ashes, a warrior reclaims her power and lifts a flaming sword to the sky: a declaration of courage, and of the freedom to choose your own path.",
    status: "available",
    print: true,
  },
  {
    slug: "new-horizons",
    title: "New Horizons",
    series: "Soul portraits",
    year: 2025,
    medium: "Acrylic on canvas",
    size: "80 × 60 cm",
    aspect: 1.32,
    image: "/img/layouts/meads-new-horizons.jpg",
    statement:
      "The courage it takes to face a changed world beside someone you love. The uncertainty of starting again, and the hope of what might be: a new direction, unexpected possibilities, a brighter horizon.",
    status: "commission",
    print: true,
  },
  {
    slug: "soundscape",
    title: "Soundscape",
    series: "Visionary",
    year: 2022,
    medium: "Acrylic on paper",
    size: "42 × 59 cm",
    aspect: 0.707,
    image: "/img/layouts/meads-soundscape.jpg",
    statement:
      "Music sometimes takes me on a journey through time and space, surrendering to the flows, textures and emotions it stirs: a technicolour world of vibrations, floating above the clouds and diving into the depths.",
    status: "sold",
    print: true,
  },
  {
    slug: "prayer-for-a-new-earth",
    title: "Prayer for a New Earth",
    series: "Visionary",
    year: 2025,
    medium: "Acrylic ink on paper",
    size: "32 × 45 cm",
    aspect: 0.75,
    image: "/img/layouts/meads-prayer.jpg",
    statement:
      "Dedicated to the starseeds, the shadow-walkers and the dreamers who quietly hold the vision while everything transforms. A portal for meditation, a fierce guardian for your altar, a daily vow to grow something kinder from the ashes.",
    status: "available",
    print: true,
  },
  {
    slug: "take-it-easy",
    title: "Take It Easy",
    series: "Wearable art",
    year: 2025,
    medium: "Hand-painted recycled denim, sequin fringe",
    size: "Jacket · one of one",
    aspect: 0.667,
    image: "/img/layouts/meads-denim-fringe.jpg",
    statement:
      "A one-of-a-kind jacket painted and adorned by hand: a psychedelic landscape across the back and holographic fringe that catches the light while you dance.",
    status: "available",
  },
  {
    slug: "sparkle-eagle",
    title: "Sparkle Eagle",
    series: "Wearable art",
    year: 2025,
    medium: "Hand-painted light denim, hand-sewn appliqué",
    size: "Jacket · one of one",
    aspect: 0.667,
    image: "/img/layouts/meads-denim-eagle.jpg",
    statement:
      "An eagle in flight across the shoulders, built from paint and hand-stitched sparkle. Made for festival nights and ordinary Tuesdays.",
    status: "available",
  },
  {
    slug: "floral-dream",
    title: "Floral Dream",
    series: "Wearable art",
    year: 2025,
    medium: "Hand-painted high-waist denim",
    size: "Jeans · one of one",
    aspect: 0.667,
    image: "/img/layouts/meads-denim-floral.jpg",
    statement: "Ethereal flowers and vines climbing one leg of a cropped high-waist pair. Painted to move with the body.",
    status: "available",
  },
];

/** The paintings you can paint in the hero, in palette order. */
export const HERO_WORKS: readonly Work[] = ["resonance", "balance", "sacred-whispers", "gentle-earthling", "elemental", "saraswati", "sword-of-discernment"]
  .map((slug) => WORKS.find((w) => w.slug === slug))
  .filter((w): w is Work => w !== undefined);

export const STATUS_LABEL: Record<Work["status"], string> = {
  available: "Original available",
  sold: "Original sold",
  commission: "Private commission",
};

export interface Tier {
  name: string;
  size: string;
  /** USD — demo price. */
  from: number;
  weeks: string;
  note: string;
  featured?: boolean;
}

export const SOUL_PORTRAIT_TIERS: readonly Tier[] = [
  { name: "Intimate", size: "40 × 50 cm", from: 650, weeks: "4–5 weeks", note: "One figure, your symbols, signed and varnished" },
  { name: "Signature", size: "60 × 80 cm", from: 1200, weeks: "6–8 weeks", note: "Full scene with animals, landscape and a written key", featured: true },
  { name: "Round", size: "60 cm diameter", from: 1100, weeks: "6–8 weeks", note: "A mandala composition on a circular canvas" },
];

export const PROCESS = [
  {
    step: "01",
    title: "The listening",
    body: "A long call about your story: the animals that keep turning up, the places you feel held, the chapter you're closing. Bring one photo you love.",
  },
  {
    step: "02",
    title: "Sketch & symbols",
    body: "A pencil composition with every symbol explained, so the painting means what you need it to mean before a drop of colour.",
  },
  {
    step: "03",
    title: "Layers",
    body: "Weeks of glazing: twenty, thirty translucent layers of acrylic that give the work its glow. You get progress photos from the easel.",
  },
  {
    step: "04",
    title: "Unveiling",
    body: "Signed, varnished and shipped worldwide in a hand-built crate, with a written key to every symbol in the painting.",
  },
] as const;

export type CommissionType = "Soul portrait" | "Custom canvas" | "Hand-painted denim" | "Mural or live painting";

export const COMMISSION_TYPES: readonly CommissionType[] = ["Soul portrait", "Custom canvas", "Hand-painted denim", "Mural or live painting"];

export const COMMISSION_SIZES: Record<CommissionType, readonly string[]> = {
  "Soul portrait": ["Intimate · 40 × 50 cm", "Signature · 60 × 80 cm", "Round · 60 cm"],
  "Custom canvas": ["50 × 70 cm", "60 × 80 cm", "80 × 100 cm", "Larger · let's talk"],
  "Hand-painted denim": ["Jacket back panel", "Full jacket", "Jeans · one leg", "Jeans · both legs"],
  "Mural or live painting": ["Wall up to 3 m", "Wall over 3 m", "Live painting at an event"],
};

export const BUDGETS = ["Under $500", "$500 – $1,000", "$1,000 – $2,500", "$2,500+"] as const;
export const TIMELINES = ["No rush", "Within 2 months", "For a date · tell me when"] as const;

export interface Print {
  title: string;
  image: string;
  aspect: number;
  /** USD — demo price. */
  from: number;
  sizes: string;
}

export const PRINTS: readonly Print[] = [
  { title: "Resonance", image: "/img/layouts/meads-resonance.jpg", aspect: 0.8, from: 38, sizes: "30 × 40 · 35.5 × 45.5 cm" },
  { title: "Balance", image: "/img/layouts/meads-balance.jpg", aspect: 0.8, from: 38, sizes: "30 × 40 · 35.5 × 45.5 cm" },
  { title: "Sacred Whispers", image: "/img/layouts/meads-sacred-whispers.jpg", aspect: 0.707, from: 38, sizes: "30 × 40 · 35.5 × 45.5 cm" },
  { title: "Elemental", image: "/img/layouts/meads-elemental.jpg", aspect: 0.725, from: 38, sizes: "30 × 40 · 35.5 × 45.5 cm" },
  { title: "Sword of Discernment", image: "/img/layouts/meads-sword.jpg", aspect: 0.73, from: 38, sizes: "30 × 40 · 35.5 × 45.5 cm" },
  { title: "Saraswati", image: "/img/layouts/meads-saraswati.jpg", aspect: 0.8, from: 38, sizes: "30 × 40 · 35.5 × 45.5 cm" },
  { title: "New Horizons", image: "/img/layouts/meads-new-horizons.jpg", aspect: 1.32, from: 42, sizes: "40 × 30 · 45.5 × 35.5 cm" },
  { title: "Prayer for a New Earth", image: "/img/layouts/meads-prayer.jpg", aspect: 0.75, from: 34, sizes: "32 × 45 cm" },
];

export const OBJECTS = [
  { title: "Ornate Snake woven blanket", image: "/img/layouts/meads-snake-blanket.jpg", note: "100% cotton, fringed, three sizes", from: 89 },
  { title: "Heart · Universe · Coherence journal", image: "/img/layouts/meads-journal.jpg", note: "128 ruled pages, lies flat", from: 24 },
  { title: "Framed prints, ready to hang", image: "/img/layouts/meads-mockup-balance.jpg", note: "Oak frame, museum glass", from: 120 },
] as const;

export const STUDIO_GALLERY = [
  { src: "/img/layouts/meads-studio-2.jpg", alt: "Finished canvases leaning against the studio wall in afternoon light", note: "the studio, most afternoons" },
  { src: "/img/layouts/meads-portrait-1.jpg", alt: "Maria holding Resonance on an outdoor staircase", note: "Resonance, the day it dried" },
  { src: "/img/layouts/meads-detail-coral.jpg", alt: "Close detail of coral and shell from Balance", note: "Balance, detail" },
  { src: "/img/layouts/meads-portrait-3.jpg", alt: "Maria smiling, holding a tiger painting", note: "a commission on its way home" },
] as const;

export const COLLECTORS = [
  {
    quote: "She painted things about me I had only ever said out loud once. It hangs where I drink my coffee and I still find new details.",
    name: "Lena",
    piece: "Soul portrait · round canvas",
    image: "/img/layouts/meads-collector-peacock.jpg",
  },
  {
    quote: "The crate arrived in Lisbon in perfect condition, with a handwritten key to every symbol. The whole family cried a bit.",
    name: "Tom & Ana",
    piece: "Keeper of the Waterfall",
    image: "/img/layouts/meads-collector-elephant.jpg",
  },
  {
    quote: "I wore the jacket to one festival and came home with three friends asking for their own.",
    name: "Priya",
    piece: "Hand-painted denim",
    image: "/img/layouts/meads-collector-night.jpg",
  },
] as const;

export const FAQ = [
  {
    q: "What do you need from me for a soul portrait?",
    a: "An hour on a call, one photograph you love, and honesty. Everything else — the animals, the landscape, the symbols — we find together in the listening.",
  },
  {
    q: "How long does a commission take?",
    a: "Four to eight weeks depending on size, plus shipping. Paintings are glazed in many thin layers, and each one needs to dry. I take one portrait at a time.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes. Canvases travel in a hand-built crate, works on paper in a tube. Prints and denim ship from the Etsy shop with tracking.",
  },
  {
    q: "Can you paint my own jacket?",
    a: "Please do send it. Worn-in denim takes paint beautifully. Tell me the story you want on your back and we'll sketch it first.",
  },
  {
    q: "Is a deposit required?",
    a: "Half to begin, half at the unveiling. If the sketch isn't right we keep drawing until it is, before any paint.",
  },
] as const;

/** Open studio afternoon: Saturdays, studio time. Demo schedule. */
export const OPEN_STUDIO = { weekday: 5, start: "16:00", end: "19:00" } as const;

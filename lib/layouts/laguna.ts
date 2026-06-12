// FICTIONAL "Laguna Bay Villas" content for the ported villa templates
// (/villa/v6 … /villa/v10). Mirrors the data shape those layouts were built
// around, with plain image paths and dead-end links — no real business data.

export const LINKS = {
  cloudbeds: "#book",
  airbnb: "#book",
  booking: "#book",
  maps: "#location",
  favorites: "#location",
  whatsapp: "#contact",
  instagram: "#instagram",
  facebook: "#",
  mapsEmbed: "#",
} as const;

// Imagery (public/img/layouts) under the names the layouts expect.
export const heroImg = "/img/layouts/villa-home-pool.jpg";
export const about1Img = "/img/layouts/villa-living-sofa.jpg";
export const about2Img = "/img/layouts/villa-bathroom.jpg";
export const about3Img = "/img/layouts/villa-bedroom-canopy.jpg";
export const areaBeachImg = "/img/layouts/beach-turquoise.jpg";
export const hostsImg = "/img/layouts/villa-hosts.jpg";
export const area1Img = "/img/layouts/villa-resort-aerial.jpg";
export const area2Img = "/img/layouts/ocean-wave-sunset.jpg";
export const area3Img = "/img/layouts/beach-umbrella.jpg";
export const area4Img = "/img/layouts/coast-cliffs.jpg";
export const serviceChef = "/img/layouts/food-fine-dining.jpg";
export const serviceMassage = "/img/layouts/spa-massage.jpg";
export const serviceSup = "/img/layouts/villa-water-bungalow.jpg";

export type Villa = {
  number: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  specs: string[];
  note?: string;
  cover: string;
  gallery: string[];
  bedrooms: number;
  guests: number;
  pricePerNight: number;
};

export const VILLAS: Villa[] = [
  {
    number: "01",
    name: "Villa Mar",
    slug: "mar",
    tagline: "Three steps from the waterline",
    description:
      "The closest you can sleep to the lagoon without an anchor. Floor-to-ceiling glass pulls the water into the living room, and the private pool sits where the garden gives way to sand.",
    specs: ["10 m to the beach", "220 sqm", "4 bedrooms", "3.5 bathrooms", "Private pool"],
    cover: "/img/layouts/villa-modern-pool.jpg",
    gallery: [
      "/img/layouts/villa-modern-pool.jpg",
      "/img/layouts/villa-living-bright.jpg",
      "/img/layouts/villa-bedroom-luxe.jpg",
      "/img/layouts/villa-bathroom.jpg",
      "/img/layouts/beach-turquoise.jpg",
    ],
    bedrooms: 4,
    guests: 8,
    pricePerNight: 8200,
  },
  {
    number: "02",
    name: "Villa Sol",
    slug: "sol",
    tagline: "An infinity edge over the lagoon",
    description:
      "Sol's pool deck hangs above the rocks with an uninterrupted line to the horizon. Mornings start with coffee under the sala; evenings end with the bay turning gold.",
    specs: ["30 m to the beach", "210 sqm", "4 bedrooms", "3.5 bathrooms", "Infinity pool"],
    cover: "/img/layouts/villa-home-pool.jpg",
    gallery: [
      "/img/layouts/villa-home-pool.jpg",
      "/img/layouts/villa-pool-sunset.jpg",
      "/img/layouts/villa-terrace-view.jpg",
      "/img/layouts/villa-room-luxe.jpg",
      "/img/layouts/villa-kitchen.jpg",
    ],
    bedrooms: 4,
    guests: 8,
    pricePerNight: 8900,
  },
  {
    number: "03",
    name: "Villa Luna",
    slug: "luna",
    tagline: "Two floors of sea view",
    description:
      "The largest footprint of the family — four suites across two floors, each with its own bathroom, wrapped around a free-form pool that looks straight across the lagoon.",
    specs: ["60 m to the beach", "320 sqm", "2 floors", "4 master bedrooms", "5 bathrooms", "Private pool"],
    cover: "/img/layouts/villa-luxury-house.jpg",
    gallery: [
      "/img/layouts/villa-luxury-house.jpg",
      "/img/layouts/villa-living-warm.jpg",
      "/img/layouts/villa-resort-bedroom.jpg",
      "/img/layouts/villa-bedroom-wood.jpg",
      "/img/layouts/villa-pool-night.jpg",
    ],
    bedrooms: 4,
    guests: 8,
    pricePerNight: 10500,
  },
  {
    number: "04",
    name: "Villa Vista",
    slug: "vista",
    tagline: "The treetop panorama",
    description:
      "Perched a little higher on the shore, Vista trades proximity for perspective — an elevated pool and a shaded terrace with the widest sunset view on the property.",
    specs: ["80 m to the beach", "300 sqm", "2 floors", "4 master bedrooms", "5 bathrooms", "Private pool"],
    note: "Add Suite Brisa for +2 bedrooms and up to 4 extra guests.",
    cover: "/img/layouts/villa-pool-bali.jpg",
    gallery: [
      "/img/layouts/villa-pool-bali.jpg",
      "/img/layouts/villa-exterior-white.jpg",
      "/img/layouts/villa-bedroom-canopy.jpg",
      "/img/layouts/villa-living-sofa.jpg",
      "/img/layouts/coast-cliffs.jpg",
    ],
    bedrooms: 4,
    guests: 8,
    pricePerNight: 9800,
  },
  {
    number: "05",
    name: "Suite Brisa",
    slug: "brisa",
    tagline: "The intimate hideaway",
    description:
      "A two-bedroom suite with the same calm design language as its bigger sisters. Perfect for couples and small families — or as an extension to Villa Vista for larger groups.",
    specs: ["80 m to the beach", "120 sqm", "2 master bedrooms", "2 bathrooms"],
    cover: "/img/layouts/villa-hotel-room.jpg",
    gallery: [
      "/img/layouts/villa-hotel-room.jpg",
      "/img/layouts/villa-bedroom-luxe.jpg",
      "/img/layouts/villa-bathroom.jpg",
      "/img/layouts/beach-umbrella.jpg",
    ],
    bedrooms: 2,
    guests: 4,
    pricePerNight: 4900,
  },
];

export type Review = {
  author: string;
  date?: string;
  quote: string;
};

export const REVIEWS: Review[] = [
  {
    author: "Camille & Hugo",
    date: "March 2026",
    quote:
      "The photos undersell it. We swam before breakfast, kayaked at noon and ate the chef's mango sticky rice every single night. Mia and Theo think of everything before you do.",
  },
  {
    author: "The Larsen family",
    date: "January 2026",
    quote:
      "Three generations under one roof and not a single argument — the villa is that big and the lagoon is that calm. Already rebooked for next year.",
  },
  {
    author: "Aditi",
    quote:
      "An absolute five-star stay. The infinity pool at golden hour is the single best view I have ever had from a swimming pool, and I include hotels three times the price.",
  },
  {
    author: "Tom & Joana",
    date: "February 2026",
    quote:
      "The most beautiful place we have stayed, anywhere. Stunning design that blends luxury and simplicity, run by people who clearly love what they built.",
  },
];

export type InstagramPost = {
  image: string;
  alt: string;
  href: string;
};

export const INSTAGRAM_POSTS: InstagramPost[] = [
  { image: "/img/layouts/villa-pool-night.jpg", alt: "Reel: the pool after dark", href: "#" },
  { image: "/img/layouts/villa-bedroom-luxe.jpg", alt: "Reel: slow mornings in the suite", href: "#" },
  { image: "/img/layouts/beach-turquoise.jpg", alt: "Reel: the lagoon at noon", href: "#" },
  { image: "/img/layouts/villa-terrace-view.jpg", alt: "Reel: breakfast on the terrace", href: "#" },
  { image: "/img/layouts/spa-resort-pool.jpg", alt: "Reel: massage by the water", href: "#" },
  { image: "/img/layouts/villa-pool-bali.jpg", alt: "Reel: POV — your private pool", href: "#" },
  { image: "/img/layouts/villa-pool-sunset.jpg", alt: "Reel: golden hour from the deck", href: "#" },
  { image: "/img/layouts/villa-kitchen.jpg", alt: "Reel: the chef takes over", href: "#" },
];

export const SERVICES = [
  {
    title: "In-villa chef",
    body: "Island classics or family favourites, cooked in your own kitchen. Wake up to breakfast on the terrace or book a private dinner as the sun drops.",
    image: serviceChef,
  },
  {
    title: "Massage & wellness",
    body: "Traditional or oil massage on your own deck, steps from the water. We bring the therapists — you don't move a muscle.",
    image: serviceMassage,
  },
  {
    title: "SUP boards & kayaks",
    body: "Every villa comes with complimentary paddle boards and a kayak. The lagoon is calm, shallow and yours from sunrise to sunset.",
    image: serviceSup,
  },
] as const;

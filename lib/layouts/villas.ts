// FICTIONAL villa-resort content for the /villa/v* portfolio previews.

export interface Villa {
  slug: string;
  name: string;
  tagline: string;
  bedrooms: number;
  guests: number;
  pricePerNight: number;
  description: string;
  image: string;
  features: readonly string[];
}

export const VILLAS: readonly Villa[] = [
  {
    slug: "breeze",
    name: "Villa Breeze",
    tagline: "The hideaway for two",
    bedrooms: 1,
    guests: 2,
    pricePerNight: 3200,
    description:
      "A one-bedroom nest above the palms with an outdoor rain shower and a plunge pool that catches the sunset.",
    image: "/img/layouts/villa-bedroom-luxe.jpg",
    features: ["Plunge pool", "Outdoor shower", "King bed", "Sunset deck"],
  },
  {
    slug: "reef",
    name: "Villa Reef",
    tagline: "Family calm by the water",
    bedrooms: 2,
    guests: 4,
    pricePerNight: 4500,
    description:
      "Two bright bedrooms around a private courtyard pool, five barefoot minutes from the quiet end of the beach.",
    image: "/img/layouts/villa-modern-pool.jpg",
    features: ["Private pool", "Courtyard garden", "Full kitchen", "Beach 5 min"],
  },
  {
    slug: "palms",
    name: "Villa Palms",
    tagline: "The entertainer",
    bedrooms: 3,
    guests: 6,
    pricePerNight: 6800,
    description:
      "An open-plan living pavilion, a twelve-metre lap pool and a built-in barbecue made for long island evenings.",
    image: "/img/layouts/villa-pool-palms.jpg",
    features: ["12 m lap pool", "BBQ pavilion", "Media room", "Daily housekeeping"],
  },
  {
    slug: "horizon",
    name: "Villa Horizon",
    tagline: "Front-row to the sea",
    bedrooms: 4,
    guests: 8,
    pricePerNight: 9500,
    description:
      "The estate villa: four suites, an infinity edge that melts into the bay and a private chef on request.",
    image: "/img/layouts/villa-resort-aerial.jpg",
    features: ["Infinity pool", "Beachfront", "Private chef", "Cinema room"],
  },
] as const;

export const VILLA_AMENITIES = [
  { title: "Private chef", body: "Thai and western menus cooked in your villa, market-fresh every morning." },
  { title: "Airport transfers", body: "Met at the pier or airstrip and driven straight to your door." },
  { title: "Daily housekeeping", body: "Quietly reset every day — towels, linens and a swept deck." },
  { title: "Scooters & drivers", body: "Explore on two wheels or call a driver any hour." },
  { title: "In-villa spa", body: "Massage and yoga teachers who come to your deck at golden hour." },
  { title: "Fast wifi", body: "Fibre in every room, strong enough for the office you left behind." },
] as const;

export const VILLA_REVIEWS = [
  {
    quote:
      "We came for a week and stayed for three. The villa felt like ours by day two — the team felt like family by day three.",
    author: "Clara & Tom",
    origin: "Berlin",
  },
  {
    quote:
      "The infinity pool at sunset is worth the flight alone. Breakfast on the deck every morning, arranged before we woke.",
    author: "The Nakamura family",
    origin: "Osaka",
  },
  {
    quote:
      "Quietly the best stay of our lives. We have already booked next year.",
    author: "Priya & Dev",
    origin: "London",
  },
] as const;

export const VILLA_GALLERY = [
  "/img/layouts/villa-pool-night.jpg",
  "/img/layouts/villa-bedroom-wood.jpg",
  "/img/layouts/villa-terrace-view.jpg",
  "/img/layouts/villa-living-sofa.jpg",
  "/img/layouts/villa-exterior-white.jpg",
  "/img/layouts/villa-living-bright.jpg",
  "/img/layouts/beach-turquoise.jpg",
  "/img/layouts/villa-kitchen.jpg",
] as const;

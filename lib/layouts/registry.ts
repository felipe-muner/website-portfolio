// The 20 portfolio templates, grouped for the switcher and the index page.

export interface PortfolioSite {
  href: string;
  name: string;
  brand: string;
  detail: string;
  /** Cover image for the /portfolio index. */
  cover: string;
}

export interface PortfolioGroup {
  label: string;
  sites: readonly PortfolioSite[];
}

export const PORTFOLIO: readonly PortfolioGroup[] = [
  {
    label: "Gym & Fitness",
    sites: [
      { href: "/gym/v1", name: "Forge", brand: "Forge Strength Club", detail: "Brutalist black & orange, weekly board", cover: "/img/layouts/gym-deadlift.jpg" },
      { href: "/gym/v2", name: "Foundry", brand: "Foundry Gym", detail: "Industrial spec sheet, punch-card matrix", cover: "/img/layouts/gym-bright.jpg" },
      { href: "/gym/v3", name: "Velocity", brand: "Velocity Performance", detail: "Carbon & red, race-lane schedule", cover: "/img/layouts/gym-sled-push.jpg" },
      { href: "/gym/v4", name: "Champ", brand: "Champ's Athletic Club", detail: "Retro fight poster, month calendar", cover: "/img/layouts/gym-bodybuilder.jpg" },
      { href: "/gym/v5", name: "After Dark", brand: "Afterdark Fitness", detail: "Neon night gym, moon-phase calendar", cover: "/img/layouts/gym-dark-floor.jpg" },
    ],
  },
  {
    label: "Yoga & Wellness",
    sites: [
      { href: "/yoga/v1", name: "Sanctuary", brand: "Sanctuary Yoga", detail: "Warm sand & arches, week garden", cover: "/img/layouts/yoga-meditation-studio.jpg" },
      { href: "/yoga/v2", name: "Tide", brand: "Tide Studio", detail: "Eucalyptus chapters, moon & tide chart", cover: "/img/layouts/yoga-beach-group.jpg" },
      { href: "/yoga/v3", name: "Dawn", brand: "Dawn House", detail: "Sunrise gradient, sun-arc schedule", cover: "/img/layouts/yoga-sunset-pose.jpg" },
      { href: "/yoga/v4", name: "Journal", brand: "The Practice Journal", detail: "Editorial agenda, month in type", cover: "/img/layouts/yoga-fold-bw.jpg" },
      { href: "/yoga/v5", name: "Moonlight", brand: "Nocturne Yoga", detail: "Indigo & gold, lunar-month schedule", cover: "/img/layouts/yoga-palm-silhouette.jpg" },
    ],
  },
  {
    label: "Villas & Stays",
    sites: [
      { href: "/villa/v1", name: "Azure", brand: "Azure Villas", detail: "Classic luxury, teal & gold", cover: "/img/layouts/villa-pool-palms.jpg" },
      { href: "/villa/v2", name: "Palma", brand: "Palma Guesthouse", detail: "Boutique garden editorial", cover: "/img/layouts/villa-terrace-view.jpg" },
      { href: "/villa/v3", name: "Frame", brand: "Frame Villas", detail: "Minimal architectural, cobalt accents", cover: "/img/layouts/villa-exterior-white.jpg" },
      { href: "/villa/v4", name: "Selva", brand: "Selva Villas", detail: "Dark jungle luxe, brass lanterns", cover: "/img/layouts/villa-pool-night.jpg" },
      { href: "/villa/v5", name: "Postcard", brand: "Casa Coco", detail: "Playful retro travel postcards", cover: "/img/layouts/beach-turquoise.jpg" },
      { href: "/villa/v6", name: "Horizon", brand: "Laguna Bay Villas", detail: "Split hero, warm classic resort", cover: "/img/layouts/villa-home-pool.jpg" },
      { href: "/villa/v7", name: "Cinema", brand: "Laguna Bay Villas", detail: "Fullscreen slideshow, dark palm", cover: "/img/layouts/villa-pool-sunset.jpg" },
      { href: "/villa/v8", name: "Mosaic", brand: "Laguna Bay Villas", detail: "Editorial photo-grid hero", cover: "/img/layouts/villa-living-bright.jpg" },
      { href: "/villa/v9", name: "Arc", brand: "Laguna Bay Villas", detail: "Arched frames & scrolling ticker", cover: "/img/layouts/villa-bedroom-canopy.jpg" },
      { href: "/villa/v10", name: "Chapters", brand: "Laguna Bay Villas", detail: "Split-screen story chapters", cover: "/img/layouts/villa-luxury-house.jpg" },
    ],
  },
  {
    label: "Local Business",
    sites: [
      { href: "/restaurant", name: "Ember", brand: "Ember", detail: "Open-fire restaurant, searchable menu", cover: "/img/layouts/food-dark-plate.jpg" },
      { href: "/cafe", name: "Crumb & Co.", brand: "Crumb & Co.", detail: "Bakery café, warm & rounded", cover: "/img/layouts/cafe-bread.jpg" },
      { href: "/barber", name: "Fade District", brand: "Fade District", detail: "Vintage barbershop, price list", cover: "/img/layouts/barber-chairs.jpg" },
      { href: "/dive", name: "Deep Blue", brand: "Deep Blue Dive Co.", detail: "Ocean dive school, course finder", cover: "/img/layouts/dive-fish-school.jpg" },
      { href: "/spa", name: "Lotus House", brand: "Lotus House Spa", detail: "Blush & sage spa, treatment menu", cover: "/img/layouts/spa-hot-stones.jpg" },
    ],
  },
] as const;

export const ALL_SITES: readonly PortfolioSite[] = PORTFOLIO.flatMap((g) => g.sites);

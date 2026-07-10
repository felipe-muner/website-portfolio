// The 20 portfolio templates, grouped for the switcher and the index page.

export interface PortfolioSite {
  href: string;
  name: string;
  brand: string;
  detail: string;
  /** Cover image for the /portfolio index. */
  cover: string;
  /** href is an absolute URL to a real production site (opens in a new tab). */
  external?: boolean;
}

export interface PortfolioGroup {
  label: string;
  /** Shareable anchor on the index page, e.g. /portfolio#villas. */
  slug: string;
  sites: readonly PortfolioSite[];
}

export const PORTFOLIO: readonly PortfolioGroup[] = [
  {
    label: "Gym & Fitness",
    slug: "gym",
    sites: [
      { href: "/gym/v1", name: "Forge", brand: "Forge Strength Club", detail: "Brutalist black & orange, weekly board", cover: "/img/layouts/gym-deadlift.jpg" },
      { href: "/gym/v2", name: "Foundry", brand: "Foundry Gym", detail: "Industrial spec sheet, punch-card matrix", cover: "/img/layouts/gym-bright.jpg" },
      { href: "/gym/v3", name: "Velocity", brand: "Velocity Performance", detail: "Carbon & red, race-lane schedule", cover: "/img/layouts/gym-sled-push.jpg" },
      { href: "/gym/v4", name: "Champ", brand: "Champ's Athletic Club", detail: "Retro fight poster, month calendar", cover: "/img/layouts/gym-bodybuilder.jpg" },
      { href: "/gym/v5", name: "After Dark", brand: "Afterdark Fitness", detail: "Neon night gym, moon-phase calendar", cover: "/img/layouts/gym-dark-floor.jpg" },
      { href: "/muaythai", name: "Rai Sabai", brand: "Rai Sabai Muay Thai", detail: "Fight-bill poster, tale of the tape, timetable", cover: "/img/layouts/muaythai-1.jpg" },
    ],
  },
  {
    label: "Yoga & Wellness",
    slug: "yoga",
    sites: [
      { href: "/yoga/v1", name: "Sanctuary", brand: "Sanctuary Yoga", detail: "Warm sand & arches, week garden", cover: "/img/layouts/yoga-meditation-studio.jpg" },
      { href: "/yoga/v2", name: "Tide", brand: "Tide Studio", detail: "Eucalyptus chapters, moon & tide chart", cover: "/img/layouts/yoga-beach-group.jpg" },
      { href: "/yoga/v3", name: "Dawn", brand: "Dawn House", detail: "Sunrise gradient, sun-arc schedule", cover: "/img/layouts/yoga-sunset-pose.jpg" },
      { href: "/yoga/v4", name: "Journal", brand: "The Practice Journal", detail: "Editorial agenda, month in type", cover: "/img/layouts/yoga-fold-bw.jpg" },
      { href: "/yoga/v5", name: "Moonlight", brand: "Nocturne Yoga", detail: "Indigo & gold, lunar-month schedule", cover: "/img/layouts/yoga-palm-silhouette.jpg" },
      { href: "/retreat", name: "Sati", brand: "Sati Retreat", detail: "One quiet column, the day as a vertical rhythm", cover: "/img/layouts/retreat-4.jpg" },
      { href: "https://lipemoves.com", name: "Lipe Moves", brand: "Lipe Moves", detail: "Felipe's own movement platform — live in production", cover: "/img/layouts/lipemoves.jpg", external: true },
    ],
  },
  {
    label: "Villas & Stays",
    slug: "villas",
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
      { href: "/realestate", name: "Baan & Bay", brand: "Baan & Bay Property", detail: "Search-first portal, featured spec spread, area guide", cover: "/img/layouts/villa-resort-aerial.jpg" },
      { href: "/biosphere", name: "Elements", brand: "Biosphere Land & Ecosystem Studio", detail: "Earth, water, wind & fire — element chapters", cover: "/img/layouts/biosphere-hero.jpg" },
      { href: "/biosphere-bambu", name: "Bambu", brand: "Biosphere Land & Ecosystem Studio", detail: "Ink-painted bamboo grove, scroll-painting rhythm", cover: "/img/layouts/biosphere-build.jpg" },
      { href: "/biosphere-masterplan", name: "Masterplan", brand: "Biosphere Land & Ecosystem Studio", detail: "Dark drafting table — contours, sheets & coordinates", cover: "/img/layouts/biosphere-plan.jpg" },
    ],
  },
  {
    label: "Local Business",
    slug: "local",
    sites: [
      { href: "/restaurant", name: "Ember", brand: "Ember", detail: "Open-fire restaurant, searchable menu", cover: "/img/layouts/food-dark-plate.jpg" },
      { href: "/cafe", name: "Crumb & Co.", brand: "Crumb & Co.", detail: "Bakery café, warm & rounded", cover: "/img/layouts/cafe-bread.jpg" },
      { href: "/barber", name: "Fade District", brand: "Fade District", detail: "Vintage barbershop, price list", cover: "/img/layouts/barber-chairs.jpg" },
      { href: "/dive", name: "Aqua Sport Supply", brand: "Aqua Sport Supply", detail: "Dive shop & centre — real gear catalogue, cart & checkout", cover: "/img/layouts/dive-fish-school.jpg" },
      { href: "/spa", name: "Lotus House", brand: "Lotus House Spa", detail: "Blush & sage spa, treatment menu", cover: "/img/layouts/spa-hot-stones.jpg" },
      { href: "/courier", name: "Wyvern", brand: "Wyvern Courier", detail: "Cinematic scroll-zoom hero, logistics", cover: "/img/layouts/courier-aerial-port.jpg" },
      { href: "/studio", name: "Nocturne", brand: "Nocturne Studio", detail: "Architecture studio, horizontal-scroll gallery", cover: "/img/layouts/studio-hero.jpg" },
      { href: "/coaching", name: "Jörg Panek", brand: "Jörg Panek", detail: "German trauma-coach, calm forest, breathing hero", cover: "/img/layouts/coach-forest-path.jpg" },
      { href: "/sacolaria", name: "Sacolaria Brasil", brand: "Sacolaria Brasil", detail: "Loja B2B de sacolas plásticas (pt-BR), carrinho + checkout", cover: "/img/layouts/sacolaria.svg" },
      { href: "/tattoo", name: "Lucky Hand", brand: "Lucky Hand Tattoo", detail: "Flash-sheet grid on aged paper, artist cards", cover: "/img/layouts/tattoo-1.jpg" },
      { href: "/cooking", name: "Som Tam Kitchen", brand: "Som Tam Kitchen", detail: "Recipe-card menu, chili-heat dots, market ticker", cover: "/img/layouts/cooking-1.jpg" },
      { href: "/coworking", name: "Beam", brand: "Beam Coworking", detail: "Grid-paper spec sheet, speed stats, price table", cover: "/img/layouts/coworking-1.jpg" },
    ],
  },
  {
    label: "Adventure & Nightlife",
    slug: "adventure",
    sites: [
      { href: "/rental", name: "Loop", brand: "Loop Island Rides", detail: "Roadside price board, film-strip fleet", cover: "/img/layouts/rental-3.jpg" },
      { href: "/boat", name: "Blue Horizon", brand: "Blue Horizon Boat Co.", detail: "Captain's chart, day plotted hour by hour", cover: "/img/layouts/boat-3.jpg" },
      { href: "/beachclub", name: "Sundown", brand: "Sundown Beach Club", detail: "Festival poster, noon-to-night colour ramp", cover: "/img/layouts/beachclub-1.jpg" },
      { href: "/fullmoon", name: "Lantern", brand: "Lantern Beach Sessions", detail: "Night almanac, real-phase CSS moon", cover: "/img/layouts/fullmoon-1.jpg" },
    ],
  },
] as const;

export const ALL_SITES: readonly PortfolioSite[] = PORTFOLIO.flatMap((g) => g.sites);

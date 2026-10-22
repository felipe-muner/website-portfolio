// FICTIONAL content for Black Lotus Tattoo (/blacklotus). The studio, its
// artists, prices, hours, reviews and policies are all invented for the demo;
// the flash designs themselves live in components/layouts/blacklotus/flash.ts.

export const STUDIO = {
  name: "Black Lotus Tattoo",
  short: "Black Lotus",
  since: 2017,
  chairs: 3,
  /** ฿ — holds the slot, comes off the final price. */
  deposit: 1000,
  /** ฿ per hour for custom work. */
  hourly: 3500,
  tagline: "A private three-chair studio above the bay.",
} as const;

export type ArtistStatus = "open" | "waitlist" | "limited";

export interface Artist {
  slug: string;
  name: string;
  nickname: string;
  role: string;
  styles: readonly string[];
  status: ArtistStatus;
  statusLabel: string;
  bio: string;
  languages: string;
  since: number;
  image: string;
}

export const ARTISTS: readonly Artist[] = [
  {
    slug: "nok",
    name: "Nok Saengthong",
    nickname: "Nok",
    role: "Fine line & botanical",
    styles: ["Fine line", "Botanical", "Micro lettering"],
    status: "open",
    statusLabel: "Books open · next slot in 9 days",
    bio: "Trained in Bangkok under a medical illustrator before she ever held a machine. Single-needle work that stays sharp for years — flowers, hands, and tiny lettering nobody else will touch.",
    languages: "Thai / English",
    since: 2017,
    image: "/img/layouts/person-f6.jpg",
  },
  {
    slug: "teo",
    name: "Teo Albuquerque",
    nickname: "Teo",
    role: "Blackwork & neo-tribal",
    styles: ["Blackwork", "Neo-tribal", "Large scale"],
    status: "waitlist",
    statusLabel: "Waitlist · about 6 weeks",
    bio: "Heavy black and clean geometry, built to the body rather than printed on it. Teo works in long sittings and books one client a day, so the piece gets the whole of him.",
    languages: "Portuguese / English / Spanish",
    since: 2019,
    image: "/img/layouts/person-m7.jpg",
  },
  {
    slug: "lek",
    name: "Lek Phromsiri",
    nickname: "Lek",
    role: "Traditional & yantra-inspired",
    styles: ["Traditional", "Sak-yant inspired", "Cover-ups"],
    status: "limited",
    statusLabel: "Fridays & Saturdays only",
    bio: "Island-born, hand-poke and machine. Lek learned yantra geometry from his uncle and tattoos it the respectful way: no sacred script, no blessing claimed, every line explained. Also our cover-up specialist.",
    languages: "Thai / English",
    since: 2017,
    image: "/img/layouts/person-m2.jpg",
  },
];

export const artistBySlug = (slug: string) => ARTISTS.find((a) => a.slug === slug);

export const PROCESS = [
  {
    step: "01",
    title: "Consult",
    meta: "20 min · free · WhatsApp or in the studio",
    body: "Tell us the idea, the placement and your budget. We'll say honestly what will heal well here — sun, sea and sweat change what we recommend.",
  },
  {
    step: "02",
    title: "Stencil",
    meta: "Same day for flash · drawn with you for custom",
    body: "The stencil goes on in the mirror and moves until you're happy. You can sleep on a custom drawing; we don't charge for changes.",
  },
  {
    step: "03",
    title: "Session",
    meta: `Flash: fixed price · Custom: ฿${STUDIO.hourly.toLocaleString("en-US")} an hour`,
    body: "Sealed single-use needles opened in front of you, numbing on request, breaks whenever you want. Long pieces split across days at no extra cost.",
  },
  {
    step: "04",
    title: "Aftercare",
    meta: "Second-skin film · check-in at day 3 · touch-up at 6 weeks",
    body: "You leave wrapped in breathable film with a printed sheet. We message on day three, and the healed check and any touch-up are free.",
  },
] as const;

export const AFTERCARE = [
  {
    q: "The first 24 hours",
    a: "Leave the film on for 24 hours, or up to three days if it stays sealed. Clear fluid under it is normal. A leak or a lifted edge means take it off, wash, and switch to the ointment routine.",
  },
  {
    q: "Washing and ointment",
    a: "Wash twice a day with lukewarm water and the fragrance-free soap we give you, pat dry with paper, then the thinnest layer of ointment you can manage. Thick ointment suffocates the ink.",
  },
  {
    q: "Sea, pool and sun",
    a: "No sea, pool or bath for 14 days — warm island water carries bacteria a fresh tattoo can't handle. Keep it out of direct sun for a month; after that, SPF 50 every time, forever. Sun is what turns black to grey.",
  },
  {
    q: "Itching, peeling and scabs",
    a: "Days four to ten it flakes like sunburn. Don't scratch, don't pick, don't soak. A light tap or a cold compress kills the itch. Thin scabs are fine; if one lifts, leave it alone.",
  },
  {
    q: "Sweat, gym and motorbikes",
    a: "Skip the gym for three days and anything that rubs the area for a week — a helmet strap, a backpack, tight denim. Road dust on a bike is a good reason to keep the film on.",
  },
  {
    q: "When to message us",
    a: "Redness spreading past the lines, heat, pus or a fever: message us straight away, not a forum. We'll look the same day and send you to the clinic if it needs one. Everything else: a photo at day three and at six weeks.",
  },
] as const;

export const REVIEWS = [
  { quote: "Fine line that healed as fine as it went in. Nok is a surgeon.", name: "Jules", from: "Berlin" },
  { quote: "Walked in for a Sunday flash, left with the naga and a new friend.", name: "Priya", from: "Bangalore" },
  { quote: "Teo talked me out of a bigger piece. Then drew a better one.", name: "Marcus", from: "Melbourne" },
  { quote: "The try-on arm is a gimmick until it saves you from a mistake.", name: "Anouk", from: "Rotterdam" },
  { quote: "Cleanest studio on the island. Sealed needles opened in front of you.", name: "Dao", from: "Chiang Mai" },
  { quote: "Free touch-up at six weeks, no questions asked. Who does that?", name: "Sam", from: "Bristol" },
  { quote: "My yantra was done with respect and zero tourist nonsense.", name: "Kritsada", from: "Surat Thani" },
] as const;

export const HOURS = [
  { days: "Tue – Sat", time: "11:00 – 19:00", note: "by appointment" },
  { days: "Sunday", time: "12:00 – 17:00", note: "walk-in flash" },
  { days: "Monday", time: "Closed", note: "autoclave day" },
] as const;

export const PLACEMENTS = [
  "Inner forearm",
  "Outer forearm",
  "Upper arm",
  "Shoulder",
  "Shoulder blade",
  "Chest",
  "Ribs",
  "Thigh",
  "Calf",
  "Ankle",
  "Back of hand",
  "Behind the ear",
  "Spine",
  "Somewhere else — I'll explain",
] as const;

export type DesignType = "flash" | "custom" | "cover";

export const DESIGN_TYPES: readonly { id: DesignType; label: string; hint: string }[] = [
  { id: "flash", label: "Flash", hint: "From the sheet · fixed price" },
  { id: "custom", label: "Custom", hint: "Drawn with you · hourly" },
  { id: "cover", label: "Cover-up", hint: "Bring a photo · Lek looks first" },
];

export const SESSION_TIMES = ["Morning (11:00 – 14:00)", "Afternoon (14:00 – 19:00)", "Either"] as const;

export const HERO_FACTS = [
  { v: String(STUDIO.chairs), l: "Resident artists" },
  { v: "฿1,500", l: "Flash from" },
  { v: String(STUDIO.since), l: "Inking since" },
  { v: "Free", l: "6-week touch-up" },
] as const;

export const HOUSE_RULES = [
  "18 and over, with ID — no exceptions, no parental letters.",
  "Not while sunburnt, hungover or on blood thinners. Eat first.",
  `A ฿${STUDIO.deposit.toLocaleString("en-US")} deposit holds the slot and comes off the price. Move it up to 48 h before and it carries over.`,
  "One guest in the room. Pets stay on the porch, where the fan is.",
] as const;

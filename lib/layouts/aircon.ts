// REAL content for the MGM Air Conditioning template (/aircon): a family-owned
// air conditioning business on the Sunshine Coast, Queensland. Copy, services,
// licences, Google reviews and photos come from the client's own site
// (mgmaircon.com.au). The room-sizing rule of thumb at the bottom is ours.

import { Building2, RefreshCw, ShieldCheck, Snowflake, Wind, Wrench, type LucideIcon } from "lucide-react";

export const BUSINESS = {
  name: "MGM Air Conditioning",
  tagline: "Freshening the Coast, with Care",
  phone: "0434 248 296",
  phoneHref: "tel:+61434248296",
  email: "info@mgmaircon.com.au",
  instagram: "https://www.instagram.com/mgm.airconditioning/",
  instagramHandle: "@mgm.airconditioning",
  hours: "Open 24/7",
  owners: "Matheus & Mariana",
  serviceArea: "Sunshine Coast (Caloundra to Noosa) & North Brisbane",
  licenses: [
    { label: "QBCC", value: "15512119" },
    { label: "ARC", value: "L158148" },
    { label: "AU", value: "066 033" },
  ],
} as const;

export interface Service {
  title: string;
  short: string;
  description: string;
  icon: LucideIcon;
  points: readonly string[];
  image: string;
  imageAlt: string;
}

export const SERVICES: readonly Service[] = [
  {
    title: "Split System Installation",
    short: "Cool a single room or your whole home with the right wall-mounted unit.",
    description:
      "From compact bedroom units to powerful living-area systems, we size, supply and install split systems that match your space and budget — neatly and to spec.",
    icon: Snowflake,
    points: [
      "Correct sizing for the room and climate",
      "Tidy pipe runs and discreet outdoor placement",
      "Back-to-back and longer pipe-run installs",
      "All major brands supplied and fitted",
    ],
    image: "/img/layouts/aircon-install-indoor.jpg",
    imageAlt: "MGM technicians mounting a new split system head unit indoors",
  },
  {
    title: "Ducted System Installation",
    short: "Whole-of-home comfort with zoned, climate-controlled ducted air.",
    description:
      "Discreet, even comfort throughout the home with zoned ducted systems. We design the layout, manage the install and commission the system so every room feels right.",
    icon: Wind,
    points: [
      "Custom zoning for each living area",
      "Energy-efficient inverter systems",
      "New builds and retrofits",
      "Smart controller setup",
    ],
    image: "/img/layouts/aircon-finished-split.jpg",
    imageAlt: "Neatly installed outdoor condenser unit on a modern home",
  },
  {
    title: "VRF / VRV Systems",
    short: "Scalable, efficient climate control for larger homes & commercial sites.",
    description:
      "Variable refrigerant systems deliver independent control across many indoor units from a single outdoor unit — ideal for larger residences, offices and commercial fit-outs.",
    icon: Building2,
    points: [
      "Multiple zones, independent control",
      "High efficiency for bigger spaces",
      "Commercial and multi-room residential",
      "Designed, installed and commissioned",
    ],
    image: "/img/layouts/aircon-finished-outdoor.jpg",
    imageAlt: "Commercial-grade outdoor air conditioning unit installed by MGM",
  },
  {
    title: "Upgrades & Replacements",
    short: "Swap an old, noisy or failing unit for a quiet, efficient new system.",
    description:
      "If your system is past its best, we'll recommend the most cost-effective replacement, remove the old gear responsibly and get you back to comfortable — fast.",
    icon: RefreshCw,
    points: [
      "Honest advice on repair vs replace",
      "Removal and recycling of old units",
      "Efficiency upgrades that cut running costs",
      "Like-for-like or full redesign",
    ],
    image: "/img/layouts/aircon-install-outdoor.jpg",
    imageAlt: "MGM technician installing a replacement outdoor condenser",
  },
  {
    title: "Preventive Maintenance",
    short: "Keep your system efficient, healthy and reliable all year round.",
    description:
      "Regular servicing keeps your air clean, your energy bills down and your warranty intact. We clean, test and tune so small issues never become big ones.",
    icon: ShieldCheck,
    points: [
      "Filter, coil and drain cleaning",
      "Refrigerant and pressure checks",
      "Performance and electrical testing",
      "Scheduled service reminders",
    ],
    image: "/img/layouts/aircon-maintenance-gauges.jpg",
    imageAlt: "MGM technician checking refrigerant pressures with gauges",
  },
  {
    title: "Servicing & Repairs",
    short: "Fast, reliable local support when your air con isn't behaving.",
    description:
      "Not cooling, leaking or making noise? We diagnose the fault, explain it plainly and fix it properly — with the local support you can actually reach.",
    icon: Wrench,
    points: [
      "Fault diagnosis and repair",
      "Re-gas and leak detection",
      "All makes and models",
      "Honest, upfront pricing",
    ],
    image: "/img/layouts/aircon-service-split.jpg",
    imageAlt: "Smiling MGM technician servicing an indoor split system",
  },
];

export const NOT_SURE = "Not sure yet";

/** Supplied and fitted. Logos are white-on-transparent or simple marks, shown inverted to white. */
export const BRANDS = [
  { name: "Daikin", logo: "/img/layouts/aircon-brand-daikin.svg" },
  { name: "Mitsubishi", logo: "/img/layouts/aircon-brand-mitsubishi.svg" },
  { name: "Fujitsu", logo: "/img/layouts/aircon-brand-fujitsu.svg" },
  { name: "Samsung", logo: "/img/layouts/aircon-brand-samsung.png" },
  { name: "Panasonic", logo: "/img/layouts/aircon-brand-panasonic.svg" },
  { name: "Hisense", logo: "/img/layouts/aircon-brand-hisense.avif" },
] as const;

export const WHY_US = [
  {
    title: "Family-owned & local",
    body: `Run hands-on by ${BUSINESS.owners}, you deal with the owners directly — not a call centre. We treat your home like our own.`,
  },
  {
    title: "Fully licensed & insured",
    body: "QBCC and ARC certified, so every install and gas handling job is done legally, safely and to Australian standards.",
  },
  {
    title: "Honest, upfront pricing",
    body: "Clear quotes with no surprises. We'll tell you straight whether to repair or replace — even when it earns us less.",
  },
  {
    title: "Attention to detail",
    body: "Tidy pipe runs, clean finishes and a workspace left better than we found it. The little things matter to us.",
  },
  {
    title: "All major brands",
    body: "Daikin, Mitsubishi, Fujitsu, Samsung, Panasonic and Hisense — we'll recommend the right unit, not the one we're pushing.",
  },
  {
    title: "Here when you need us",
    body: "Open 24/7 across the Sunshine Coast and North Brisbane, with genuine local support after the install is done.",
  },
] as const;

export const PROCESS = [
  { step: "01", title: "Get in touch", body: "Call or send a quick message about your space and what you need. We'll ask the right questions." },
  { step: "02", title: "Free assessment & quote", body: "We assess the job, recommend the right system and send a clear, honest quote — no obligation." },
  { step: "03", title: "Professional install", body: "Licensed, tidy and on time. We install, commission and test the system, then show you how it works." },
  { step: "04", title: "Ongoing local support", body: "Servicing reminders and genuine after-care, so your system keeps running at its best for years." },
] as const;

export const GALLERY = [
  { src: "/img/layouts/aircon-finished-split.jpg", alt: "Completed Panasonic split system install", tag: "Split system" },
  { src: "/img/layouts/aircon-install-outdoor.jpg", alt: "Outdoor Hisense condenser installation", tag: "Installation" },
  { src: "/img/layouts/aircon-service-split.jpg", alt: "Indoor split system service", tag: "Servicing" },
  { src: "/img/layouts/aircon-maintenance-daikin.jpg", alt: "Daikin system maintenance with gauges", tag: "Maintenance" },
  { src: "/img/layouts/aircon-wall-bracket.jpg", alt: "Mounting an indoor unit's wall bracket", tag: "Installation" },
  { src: "/img/layouts/aircon-finished-outdoor.jpg", alt: "Finished Panasonic outdoor unit", tag: "Completed" },
] as const;

export interface Review {
  name: string;
  quote: string;
}

/** Verified Google reviews, verbatim. */
export const REVIEWS: readonly Review[] = [
  { name: "Kellie Rose", quote: "Excellent workmanship and lovely customer service." },
  {
    name: "Fabiola Carvalho",
    quote:
      "Guys did an excellent job! My daughter's portable air con was smelling mould and they left it smelling nice and fresh! Highly recommended!",
  },
  {
    name: "Travis Barff",
    quote: "Matheus & Mariana were fantastic with communication, service and friendliness. 10/10 would recommend!",
  },
  {
    name: "Kemosabe",
    quote:
      "Matheus & Mariana from MGM Air Conditioning have just serviced & cleaned 2 A/C split systems for me. They did a very thorough job and were friendly & easy to deal with. I would highly recommend 😊",
  },
  {
    name: "Michelle",
    quote:
      "I'm delighted to share my experience with MGM Air Conditioning. I didn't realize how much my unit needed cleaning until I turned it on after the service. It's so much quieter, more efficient, and the air feels fresher. The unit itself looks brand new, especially after they cleaned the exterior! The customer service was exceptional from start to finish. The team was incredibly accommodating with their scheduling, which I truly appreciated. Matheus and Mariana make an excellent team – not only are they professional, but they're also such kind and friendly people.",
  },
  { name: "Mia Stockton", quote: "Absolutely amazing service and outcome! Would highly recommend!" },
  { name: "Tanya Thomson", quote: "Efficient and thorough job done in servicing aircons. Would recommend." },
  {
    name: "Jayde Coleborn",
    quote:
      "We had Matheus and Mariana come out and look at our air con unit that was leaking water. They were so lovely. They came out earlier than the original appointment booked due to it being so hot. They made the time to fit us in earlier than expected which was very kind.",
  },
  {
    name: "Macour2508",
    quote:
      "I had the air conditioning installed in my apartment a few days ago. Excellent service and attention, focused on detail, punctuality and cleanliness. I have a carpet at home and they were concerned the whole time about not getting it dirty. I would recommend this service to everyone.",
  },
  { name: "Ky Colley", quote: "Best of the best! Love your work guys everything is amazing." },
];

export const FAQ = [
  {
    q: "What areas do you service?",
    a: "We cover the entire Sunshine Coast from Caloundra to Noosa, as well as North Brisbane. If you're not sure whether you're in range, just give us a call — chances are we can help.",
  },
  {
    q: "How much does a new air conditioner cost to install?",
    a: "It depends on the system size, type (split, multi-head or ducted) and the complexity of the install. We provide free, no-obligation quotes so you know exactly what you're paying before any work starts.",
  },
  {
    q: "What size air conditioner do I need?",
    a: "The right size depends on room dimensions, ceiling height, insulation, window orientation and how the space is used. An undersized unit struggles and an oversized one wastes energy — we'll measure up and recommend the correct capacity.",
  },
  {
    q: "Which brands do you install?",
    a: "We supply and install all major brands including Daikin, Mitsubishi, Fujitsu, Samsung, Panasonic and Hisense. We'll recommend the best unit for your needs and budget rather than pushing one brand.",
  },
  {
    q: "Are you licensed and insured?",
    a: "Yes. We hold QBCC licence 15512119 and ARC refrigerant handling licence L158148, and we're fully insured. Every install meets Australian standards.",
  },
  {
    q: "How often should I service my air conditioner?",
    a: "We recommend a service at least once a year — ideally before summer. Regular maintenance keeps your air clean, lowers running costs, prevents breakdowns and protects your manufacturer's warranty.",
  },
] as const;

export interface ServiceArea {
  name: string;
  /** Approximate town centre, used to place the pin on the coverage map. */
  lat: number;
  lng: number;
}

/** North to south, Noosa down the coast to Caloundra, then North Brisbane. */
export const SERVICE_AREAS: readonly ServiceArea[] = [
  { name: "Noosa", lat: -26.394, lng: 153.09 },
  { name: "Noosaville", lat: -26.4, lng: 153.064 },
  { name: "Peregian", lat: -26.481, lng: 153.096 },
  { name: "Coolum", lat: -26.528, lng: 153.088 },
  { name: "Nambour", lat: -26.627, lng: 152.959 },
  { name: "Maroochydore", lat: -26.66, lng: 153.099 },
  { name: "Mooloolaba", lat: -26.682, lng: 153.119 },
  { name: "Buderim", lat: -26.684, lng: 153.057 },
  { name: "Sippy Downs", lat: -26.718, lng: 153.059 },
  { name: "Kawana", lat: -26.735, lng: 153.125 },
  { name: "Caloundra", lat: -26.804, lng: 153.133 },
  { name: "North Brisbane", lat: -27.385, lng: 153.031 },
];

/* ------------------------------------------------------------------ */
/* Room sizing — a rule of thumb for South-East Queensland, a starting */
/* point for a conversation rather than a heat-load calculation        */
/* ------------------------------------------------------------------ */

export type RoomType = "bedroom" | "living" | "kitchen" | "office";
export type Ceiling = "2.4" | "2.7" | "3.0";
export type Sun = "shaded" | "some" | "west";
export type Insulation = "good" | "average" | "poor";

export interface Room {
  type: RoomType;
  /** Floor area in m². */
  area: number;
  ceiling: Ceiling;
  sun: Sun;
  insulation: Insulation;
}

export const AREA_MIN = 8;
export const AREA_MAX = 90;

/** Common wall-split capacities, in kW. Beyond the last, go multi-head or ducted. */
export const SPLIT_SIZES = [2.5, 3.5, 5.0, 6.0, 7.1, 8.0, 9.0] as const;

/** kW per m² for a standard 2.4 m ceiling, average insulation, some sun. */
const BASE_KW_PER_M2 = 0.12;

const ROOM_FACTOR: Record<RoomType, number> = {
  bedroom: 0.9, // used mostly in the cooler evening
  living: 1,
  kitchen: 1.15, // appliances and cooking add heat
  office: 1.05, // people and screens
};
const CEILING_FACTOR: Record<Ceiling, number> = { "2.4": 1, "2.7": 1.12, "3.0": 1.25 };
const SUN_FACTOR: Record<Sun, number> = { shaded: 0.9, some: 1, west: 1.15 };
const INSULATION_FACTOR: Record<Insulation, number> = { good: 0.9, average: 1, poor: 1.15 };

export interface Sizing {
  /** Estimated load in kW, before rounding up to a real unit. */
  load: number;
  /** The smallest common split size that covers the load, or null if none does. */
  size: (typeof SPLIT_SIZES)[number] | null;
}

export function sizeRoom(room: Room): Sizing {
  const load =
    room.area *
    BASE_KW_PER_M2 *
    ROOM_FACTOR[room.type] *
    CEILING_FACTOR[room.ceiling] *
    SUN_FACTOR[room.sun] *
    INSULATION_FACTOR[room.insulation];
  const size = SPLIT_SIZES.find((s) => s >= load) ?? null;
  return { load, size };
}

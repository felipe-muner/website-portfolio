// Real contact + location details for the dive shop's physical store,
// Blue Reef Dive Supply on Ko Pha Ngan. Kept separate from the shared demo
// CONTACT so the fictional templates stay fictional.

export interface OpeningHour {
  day: string;
  hours: string;
  closed?: boolean;
}

export const DIVE_LOCATION = {
  name: "Blue Reef Dive Supply",
  addressLines: ["Ko Pha Ngan", "Surat Thani, Thailand"],
  phone: "555 010 0005",
  phoneHref: "tel:+15550100005",
  /** Short link the customer shared. */
  mapLink: "https://www.google.com/maps",
  /** Keyless Google Maps embed centred on the store pin. */
  mapEmbed: "https://www.google.com/maps?q=Ko+Pha+Ngan&output=embed",
  hours: [
    { day: "Monday", hours: "11:00 – 18:00" },
    { day: "Tuesday", hours: "11:00 – 18:00" },
    { day: "Wednesday", hours: "11:00 – 18:00" },
    { day: "Thursday", hours: "11:00 – 18:00" },
    { day: "Friday", hours: "11:00 – 18:00" },
    { day: "Saturday", hours: "11:00 – 18:00" },
    { day: "Sunday", hours: "Closed", closed: true },
  ] satisfies OpeningHour[],
  /** Compact summary for tight spots. */
  hoursSummary: "Mon – Sat · 11:00–18:00 · Sun closed",
} as const;

// Real contact + location details for the dive shop's physical store,
// Aqua Sport Supply on Ko Pha Ngan. Kept separate from the shared demo
// CONTACT so the fictional templates stay fictional.

export interface OpeningHour {
  day: string;
  hours: string;
  closed?: boolean;
}

export const DIVE_LOCATION = {
  name: "Aqua Sport Supply",
  addressLines: ["Ko Pha Ngan", "Surat Thani, Thailand"],
  phone: "065 007 6958",
  phoneHref: "tel:+66650076958",
  /** Short link the customer shared. */
  mapLink: "https://maps.app.goo.gl/2rtgbgd1jmWQYG6J7",
  /** Keyless Google Maps embed centred on the store pin. */
  mapEmbed: "https://www.google.com/maps?q=9.7117292,99.9865372&z=16&output=embed",
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

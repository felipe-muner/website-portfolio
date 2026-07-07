import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IBM_Plex_Mono, Libre_Franklin, Source_Serif_4 } from "next/font/google";
import { format, getISOWeek } from "date-fns";
import { Mail, MapPin, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { ListingBrowser, type Listing } from "@/components/layouts/ListingBrowser";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Business Layout — Baan & Bay Property",
  robots: { index: false },
};

const sans = Libre_Franklin({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const serif = Source_Serif_4({ subsets: ["latin"], weight: ["500", "600"] });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"] });

const PAPER = "#f3f5f2";
const INK = "#182220";
const LAGOON = "#0d5c50";
const MUTED = "#5c6763";
const LINE = "#d8ddd8";

const LISTINGS: readonly Listing[] = [
  { id: "l1", title: "Ocean-view pool villa above the bay", area: "Haad Yao", type: "Villa", status: "For sale", price: 18500000, per: "", beds: 3, baths: 3, sqm: 320, image: "/img/layouts/villa-pool-palms.jpg", tags: ["sea view", "pool", "new build"] },
  { id: "l2", title: "Modern glass house in the hills", area: "Chaloklum", type: "House", status: "For sale", price: 12900000, per: "", beds: 4, baths: 3, sqm: 280, image: "/img/layouts/villa-exterior-white.jpg", tags: ["hillside", "quiet", "pool"] },
  { id: "l3", title: "Beachfront bungalow, steps from sand", area: "Chaloklum", type: "Bungalow", status: "For rent", price: 55000, per: "month", beds: 2, baths: 2, sqm: 140, image: "/img/layouts/villa-terrace-view.jpg", tags: ["beachfront", "furnished", "sea view"] },
  { id: "l4", title: "Tropical garden villa with studio", area: "Srithanu", type: "Villa", status: "For rent", price: 68000, per: "month", beds: 3, baths: 2, sqm: 210, image: "/img/layouts/villa-home-pool.jpg", tags: ["garden", "pool", "long-term"] },
  { id: "l5", title: "Minimalist sea-view apartment", area: "Srithanu", type: "Apartment", status: "For sale", price: 6900000, per: "", beds: 1, baths: 1, sqm: 74, image: "/img/layouts/villa-living-bright.jpg", tags: ["sea view", "turnkey", "investment"] },
  { id: "l6", title: "Family home with mango orchard", area: "Thong Sala", type: "House", status: "For sale", price: 9500000, per: "", beds: 4, baths: 3, sqm: 260, image: "/img/layouts/villa-luxury-house.jpg", tags: ["land", "garden", "family"] },
  { id: "l7", title: "Boutique studio for the digital nomad", area: "Thong Sala", type: "Studio", status: "For rent", price: 22000, per: "month", beds: 1, baths: 1, sqm: 42, image: "/img/layouts/villa-bedroom-wood.jpg", tags: ["walkable", "wifi ready", "furnished"] },
  { id: "l8", title: "Cliffside villa with infinity pool", area: "Chaloklum", type: "Villa", status: "For sale", price: 24500000, per: "", beds: 4, baths: 4, sqm: 380, image: "/img/layouts/villa-pool-night.jpg", tags: ["sea view", "pool", "luxury"] },
  { id: "l9", title: "Rustic teak house near the pier", area: "Thong Sala", type: "House", status: "For rent", price: 38000, per: "month", beds: 2, baths: 1, sqm: 120, image: "/img/layouts/villa-living-warm.jpg", tags: ["central", "traditional", "long-term"] },
];

const AREAS = [
  { name: "Srithanu", note: "Yoga village on the west coast — cafés, co-working, long-stay community." },
  { name: "Chaloklum", note: "Working fishing village up north; dive schools and calm-water bays." },
  { name: "Haad Yao", note: "Long sunset beach with a quiet family feel and hillside sea views." },
  { name: "Thong Sala", note: "The main town — pier, night market, schools and every practical errand." },
] as const;

export default function RealEstateLayout() {
  return (
    <div className={sans.className} style={{ backgroundColor: PAPER, color: INK }}>
      <style>{`
        @keyframes bbp-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
        .bbp-live-dot { animation: bbp-pulse 2.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .bbp-live-dot { animation: none; } }
      `}</style>
      <TopBar />
      <Header />
      <SearchDesk />
      <FeaturedListing />
      <AreaGuide />
      <MeetTheAgent />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function TopBar() {
  return (
    <div style={{ backgroundColor: INK }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-2 text-xs text-white/75 md:px-8">
        <p className={mono.className}>Koh Phangan · Surat Thani · Thailand</p>
        <div className="flex items-center gap-5">
          <a href={CONTACT.phoneHref} className={`${mono.className} hover:text-white`}>{CONTACT.phone}</a>
          <a href={CONTACT.emailHref} className="hidden hover:text-white sm:block">{CONTACT.email}</a>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="border-b bg-white" style={{ borderColor: LINE }}>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-4 md:px-8">
        <Link href="/" className="leading-tight">
          <span className={`${serif.className} block text-2xl font-semibold`}>Baan &amp; Bay Property</span>
          <span className={`${mono.className} block text-[11px] uppercase tracking-[0.18em]`} style={{ color: MUTED }}>
            Licensed island brokerage · since 2014
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex" style={{ color: MUTED }}>
          <a href="#search" className="hover:text-[#0d5c50]">Search</a>
          <a href="#featured" className="hover:text-[#0d5c50]">Featured</a>
          <a href="#areas" className="hover:text-[#0d5c50]">Areas</a>
          <a href="#agent" className="hover:text-[#0d5c50]">Your agent</a>
        </nav>
        <div className="text-right leading-tight">
          <a href={CONTACT.phoneHref} className={`${mono.className} block text-sm font-medium hover:underline`} style={{ color: LAGOON }}>
            {CONTACT.phone}
          </a>
          <span className="block text-[11px]" style={{ color: MUTED }}>Office open Mon–Sat, 9:00–18:00</span>
        </div>
      </div>
    </header>
  );
}

function SearchDesk() {
  const today = new Date();
  return (
    <section id="search" className="border-b" style={{ borderColor: LINE, backgroundColor: "#e7ede9" }}>
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div className="max-w-xl">
            <h1 className={`${serif.className} text-3xl font-semibold leading-tight md:text-4xl`}>
              Find property on Koh Phangan
            </h1>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>
              Every listing on the register is title-checked before publication.
              Search by area, type or feature — or filter sale from rent.
            </p>
          </div>
          <p className={`${mono.className} flex items-center gap-2 text-xs`} style={{ color: MUTED }}>
            <span className="bbp-live-dot inline-block size-2 rounded-full" style={{ backgroundColor: LAGOON }} aria-hidden />
            Register updated {format(today, "EEE d MMM, HH:00")} · {LISTINGS.length} live listings
          </p>
        </div>
        <div className="border bg-white p-4 shadow-sm md:p-6" style={{ borderColor: LINE }}>
          <ListingBrowser
            listings={LISTINGS}
            displayClass={serif.className}
            theme={{ accent: LAGOON, accentText: "#ffffff", text: INK, muted: MUTED, surface: PAPER, card: "#ffffff", border: LINE, radius: "3px" }}
          />
        </div>
      </div>
    </section>
  );
}

function FeaturedListing() {
  const week = getISOWeek(new Date());
  const specs: readonly [string, string][] = [
    ["Asking price", "฿16,800,000"],
    ["Land size", "1,600 m² (1 rai)"],
    ["Built area", "290 m²"],
    ["Bedrooms / bathrooms", "3 / 3"],
    ["Title deed", "Chanote (Nor Sor 4 Jor)"],
    ["Distance to beach", "650 m to Haad Yao"],
    ["Ownership route", "Thai freehold · 30-year lease option"],
  ];
  return (
    <section id="featured" className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.1fr_1fr] md:items-start md:px-8 md:py-20">
        <figure>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/img/layouts/villa-modern-pool.jpg"
              alt="Featured property: modern pool villa near Haad Yao"
              fill
              sizes="(min-width: 768px) 55vw, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className={`${mono.className} mt-2 flex justify-between text-[11px] uppercase tracking-[0.14em]`} style={{ color: MUTED }}>
            <span>Viewing by appointment</span>
            <span>Ref BB-1108</span>
          </figcaption>
        </figure>
        <div>
          <p className={`${mono.className} text-xs uppercase tracking-[0.18em]`} style={{ color: LAGOON }}>
            Featured listing · Week {week}
          </p>
          <h2 className={`${serif.className} mt-3 text-3xl font-semibold leading-tight md:text-4xl`}>
            Garden pool villa on a full rai, walkable to Haad Yao
          </h2>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: MUTED }}>
            A single-storey three-bedroom villa set in mature gardens on a flat,
            fully-walled plot. Clean Chanote title, town water plus a registered
            well, and a legal build with permits on file — the paperwork is as
            tidy as the house.
          </p>
          <table className="mt-6 w-full border-t text-sm" style={{ borderColor: LINE }}>
            <tbody>
              {specs.map(([label, value]) => (
                <tr key={label} className="border-b" style={{ borderColor: LINE }}>
                  <th scope="row" className="py-2.5 pr-4 text-left font-medium" style={{ color: MUTED }}>{label}</th>
                  <td className={`${mono.className} py-2.5 text-right`}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a href={CONTACT.phoneHref} className="px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: LAGOON }}>
              Call about this property
            </a>
            <a href={CONTACT.emailHref} className="text-sm font-semibold underline underline-offset-4" style={{ color: LAGOON }}>
              Request the full dossier
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function AreaGuide() {
  return (
    <section id="areas" className="border-y" style={{ borderColor: LINE }}>
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className={`${serif.className} text-2xl font-semibold md:text-3xl`}>Know your bay before you buy</h2>
          <p className="text-sm" style={{ color: MUTED }}>Four areas we cover daily — each with its own character and price band.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AREAS.map((area) => {
            const count = LISTINGS.filter((l) => l.area === area.name).length;
            return (
              <a key={area.name} href="#search" className="group block border bg-white p-5 transition-colors hover:border-[#0d5c50]" style={{ borderColor: LINE }}>
                <p className="flex items-baseline justify-between">
                  <span className={`${serif.className} text-lg font-semibold group-hover:text-[#0d5c50]`}>{area.name}</span>
                  <span className={`${mono.className} text-[11px]`} style={{ color: MUTED }}>
                    {count} listing{count === 1 ? "" : "s"}
                  </span>
                </p>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>{area.note}</p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MeetTheAgent() {
  return (
    <section id="agent" className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-[minmax(0,320px)_1fr] md:items-center md:px-8 md:py-20">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src="/img/layouts/villa-hosts.jpg"
            alt="Kanya Boonmee, principal agent at Baan and Bay Property"
            fill
            sizes="(min-width: 768px) 320px, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className={`${mono.className} text-xs uppercase tracking-[0.18em]`} style={{ color: LAGOON }}>Your agent</p>
          <h2 className={`${serif.className} mt-3 text-3xl font-semibold md:text-4xl`}>Kanya Boonmee</h2>
          <p className={`${mono.className} mt-1 text-xs`} style={{ color: MUTED }}>
            Principal agent · licensed broker · 11 years on the island
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed" style={{ color: MUTED }}>
            Kanya grew up in Thong Sala and has walked every plot on this register
            herself. She works buyer-side in Thai and English: title search, land
            office, lawyers, transfer and keys. One person, start to signature —
            no call centre in between.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a href={CONTACT.phoneHref} className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: LAGOON }}>
              <Phone className="size-4" /> Call Kanya directly
            </a>
            <span className="text-sm" style={{ color: MUTED }}>Same-day replies, Mon–Sat</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const columns: readonly { heading: string; links: readonly string[] }[] = [
    { heading: "Buy", links: ["Villas for sale", "Houses for sale", "Land & plots", "Apartments"] },
    { heading: "Rent", links: ["Long-term rentals", "Monthly rentals", "Studios", "Beachfront"] },
    { heading: "Areas", links: [...AREAS.map((a) => a.name)] },
    { heading: "Company", links: ["Featured listing", "Area guide", "Your agent", "Contact the office"] },
  ];
  return (
    <footer className="border-t" style={{ borderColor: LINE, backgroundColor: "#e9ece8" }}>
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div>
            <p className={`${serif.className} text-xl font-semibold`}>Baan &amp; Bay Property</p>
            <div className="mt-3 space-y-1.5 text-sm" style={{ color: MUTED }}>
              <p className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0" style={{ color: LAGOON }} />{CONTACT.address}</p>
              <a href={CONTACT.phoneHref} className="flex items-center gap-2 hover:text-[#182220]"><Phone className="size-4" style={{ color: LAGOON }} />{CONTACT.phone}</a>
              <a href={CONTACT.emailHref} className="flex items-center gap-2 hover:text-[#182220]"><Mail className="size-4" style={{ color: LAGOON }} />{CONTACT.email}</a>
              <a href={CONTACT.instagram} className="flex items-center gap-2 hover:text-[#182220]"><InstagramIcon className="size-4" />{CONTACT.instagramHandle}</a>
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.heading}>
              <p className={`${mono.className} text-[11px] uppercase tracking-[0.18em]`} style={{ color: MUTED }}>{col.heading}</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#search" className="hover:text-[#0d5c50]" style={{ color: INK }}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t pt-6 text-xs leading-relaxed" style={{ borderColor: LINE, color: MUTED }}>
          <p>
            Baan &amp; Bay Property is a fictional brand created for a website
            layout demo — the listings, prices, agent and reference numbers on
            this page are illustrative only. Prices shown are indicative and
            exclude transfer fees and taxes. Foreign freehold ownership of land
            is restricted under Thai law; always seek independent legal advice
            before entering into any purchase or lease agreement.
          </p>
          <p className={`${mono.className} mt-4`}>
            © {format(new Date(), "yyyy")} Baan &amp; Bay Property · Fictional demo · Real-estate portal layout
          </p>
        </div>
      </div>
      <div className="h-1.5" style={{ backgroundColor: LAGOON }} />
    </footer>
  );
}

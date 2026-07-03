import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { CartProvider } from "@/lib/layouts/dive/cart";
import { DiveNav } from "@/components/layouts/dive/site-nav";
import { DiveFooter } from "@/components/layouts/dive/site-footer";
import { WhatsappFab } from "@/components/layouts/dive/whatsapp-fab";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";

const sora = Sora({ subsets: ["latin"], weight: ["300", "400", "700"] });

const REEF = "#0a4d6e";
const ABYSS = "#04263b";

const SITE_TITLE = "Aqua Sport Supply — Dive shop & centre, Ko Pha Ngan";
const SITE_DESC =
  "The island dive shop, online. Masks, fins, regulators, BCDs and dive computers from Oceanic, Aqua Lung, Atomic, Garmin and more — with courses, dives and island-wide delivery.";

export const metadata: Metadata = {
  metadataBase: new URL("https://website-portfolio-felipe-muner.vercel.app"),
  title: SITE_TITLE,
  description: SITE_DESC,
  robots: { index: false },
  openGraph: {
    type: "website",
    url: "/dive",
    siteName: "Aqua Sport Supply",
    title: SITE_TITLE,
    description: SITE_DESC,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
  },
};

export default function DiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${sora.className} min-h-dvh scroll-smooth text-white`}
      style={{ background: `linear-gradient(180deg, ${REEF} 0%, ${ABYSS} 38%, #021423 100%)` }}
    >
      <CartProvider>
        <DiveNav />
        {children}
        <DiveFooter />
        <WhatsappFab />
      </CartProvider>
      <LayoutSwitcher />
    </div>
  );
}

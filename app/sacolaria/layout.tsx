import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CartProvider } from "@/lib/layouts/sacolaria/cart";
import { SacolariaNav } from "@/components/layouts/sacolaria/site-nav";
import { SacolariaFooter } from "@/components/layouts/sacolaria/site-footer";
import { HomeStatsTop } from "@/components/layouts/sacolaria/home-stats-top";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-sans-inter",
});

const SITE_TITLE = "Sacolaria Brasil — Sacolas plásticas no atacado";
const SITE_DESCRIPTION =
  "Fábrica de sacolas plásticas: boca de palhaço, alça camiseta e linha reciclada. Compre no atacado com Pix, cartão ou boleto e receba em todo o Brasil.";

export const metadata: Metadata = {
  metadataBase: new URL("https://website-portfolio-felipe-muner.vercel.app"),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  robots: { index: false },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/sacolaria",
    siteName: "Sacolaria Brasil",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function SacolariaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${inter.variable} min-h-dvh bg-[#faf8f3] font-[family-name:var(--font-sans-inter)] text-[#23261f] antialiased`}
    >
      <CartProvider>
        <HomeStatsTop />
        <SacolariaNav />
        {children}
        <SacolariaFooter />
      </CartProvider>
      <LayoutSwitcher />
    </div>
  );
}

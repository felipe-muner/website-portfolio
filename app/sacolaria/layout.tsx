import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CartProvider } from "@/lib/layouts/sacolaria/cart";
import { SacolariaNav } from "@/components/layouts/sacolaria/site-nav";
import { SacolariaFooter } from "@/components/layouts/sacolaria/site-footer";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-sans-inter",
});

export const metadata: Metadata = {
  title: "Sacolaria Brasil — Sacolas plásticas no atacado",
  description:
    "Fábrica de sacolas plásticas: boca de palhaço, alça camiseta e linha reciclada. Compre no atacado com Pix, cartão ou boleto e receba em todo o Brasil.",
  robots: { index: false },
};

export default function SacolariaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${inter.variable} min-h-dvh bg-[#faf8f3] font-[family-name:var(--font-sans-inter)] text-[#23261f] antialiased`}
    >
      <CartProvider>
        <SacolariaNav />
        {children}
        <SacolariaFooter />
      </CartProvider>
      <LayoutSwitcher />
    </div>
  );
}

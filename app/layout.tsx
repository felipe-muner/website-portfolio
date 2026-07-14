import type { Metadata } from "next";
import { Oswald, Mulish } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChromeGate } from "@/components/layouts/ChromeGate";
import { AuthProvider } from "@/components/providers/auth-provider";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "700"]
});

// Muli Font
const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  weight: ["400", "600", "700"]
});

const SITE_TITLE = "Launch Your Dream Website in Days";
const SITE_DESCRIPTION =
  "Live, fully working designs for gyms, yoga studios, villas and local businesses — pick one and I'll make it yours: your name, colors, photos, content and language.";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    siteName: "Ready-Made Websites",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${oswald.variable} ${mulish.variable} antialiased bg-brand-background-2`}
      >
        <AuthProvider>
          <ChromeGate>
            <Header />
          </ChromeGate>
          <main className="flex flex-col">{children}</main>
          <ChromeGate>
            <Footer />
          </ChromeGate>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}

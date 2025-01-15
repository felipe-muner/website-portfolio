import type { Metadata } from "next";
import { Oswald, Mulish } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { APP_NAME } from "@/constants";

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

export const metadata: Metadata = {
  title: APP_NAME,
  description: `Empower your fitness journey with ${APP_NAME}.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${oswald.variable} ${mulish.variable} antialiased bg-brand-background-2`}
      >
        <Header />
        <main className="flex flex-col">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}

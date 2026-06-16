import { Cormorant_Garamond, Mulish } from "next/font/google";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { CoachSiteFooter } from "@/components/layouts/coaching/site-footer";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-serif",
});
const sans = Mulish({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-sans-mulish",
});

export default function CoachingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${serif.variable} ${sans.variable} min-h-screen bg-[#f4efe4] font-[family-name:var(--font-sans-mulish)] text-[#33302a] [&_.font-serif]:font-[family-name:var(--font-serif)]`}
    >
      {children}
      <CoachSiteFooter />
      <LayoutSwitcher />
    </div>
  );
}

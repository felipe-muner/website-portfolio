"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { cn } from "@/lib/utils";

// Aqua Sport Supply's number (+66 65 007 6958) with a friendly prefilled message.
const WHATSAPP_LINK = `https://wa.me/66650076958?text=${encodeURIComponent(
  "Hi Aqua Sport Supply! I have a question about your dive gear.",
)}`;

/**
 * Floating WhatsApp button, pinned bottom-right. Fades up as soon as the
 * user starts scrolling. Same style/animation as the Sacolaria FAB.
 */
export function WhatsappFab() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hidden on the full-screen owner dashboard.
  if (pathname.startsWith("/dive/dashboard")) return null;

  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={cn(
        // Mobile: perfect circle. sm+: expands into a pill with the label.
        "group fixed bottom-20 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.6)] transition-all duration-500 ease-out hover:brightness-105 sm:size-auto sm:gap-2 sm:py-3 sm:pl-3 sm:pr-5",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      {/* Green halo — a slow, chill sonar pulse, visible on any background */}
      <span className="absolute inset-0 -z-10 rounded-full bg-[#25D366] animate-dive-chill-pulse" />
      <WhatsAppIcon size={26} className="relative shrink-0" />
      <span className="relative hidden text-sm font-bold sm:inline">Chat with us</span>
    </a>
  );
}

import { WhatsAppIcon } from "@/components/ui/brand-icons";

// Felipe's number with a friendly prefilled message.
const WHATSAPP_LINK = `https://wa.me/5521984852802?text=${encodeURIComponent(
  "Hi Felipe! I'm browsing your templates and I'd like to talk about one.",
)}`;

/**
 * Floating WhatsApp button, pinned bottom-right. Same style/animation as the
 * dive and Sacolaria FABs, but always visible — it's the page's main contact CTA.
 */
export function WhatsappFab() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Felipe on WhatsApp"
      // Mobile: perfect circle. sm+: expands into a pill with the label.
      className="group fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.6)] transition hover:brightness-105 sm:size-auto sm:gap-2 sm:py-3 sm:pl-3 sm:pr-5"
    >
      {/* Green halo — a slow, chill sonar pulse, visible on any background */}
      <span className="absolute inset-0 -z-10 rounded-full bg-[#25D366] animate-dive-chill-pulse" />
      <WhatsAppIcon size={26} className="relative shrink-0" />
      <span className="relative hidden text-sm font-bold sm:inline">WhatsApp me</span>
    </a>
  );
}

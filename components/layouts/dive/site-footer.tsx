import Link from "next/link";
import { Anchor, MapPin } from "lucide-react";
import { CONTACT } from "@/lib/layouts/content";

const CYAN = "#2ed3e8";

export function DiveFooter() {
  return (
    <footer className="border-t border-white/10 py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 text-center md:px-10">
        <Anchor className="size-7" style={{ color: CYAN }} />
        <p className="text-2xl font-bold tracking-tight">Aqua Sport Supply</p>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold text-white/70">
          <Link href="/dive#courses" className="hover:text-white">Courses</Link>
          <Link href="/dive#sites" className="hover:text-white">Dive sites</Link>
          <Link href="/dive/shop" className="hover:text-white">Gear shop</Link>
          <Link href="/dive/cart" className="hover:text-white">Cart</Link>
        </nav>
        <p className="flex items-center gap-2 font-light text-white/75">
          <MapPin className="size-4" style={{ color: CYAN }} />
          {CONTACT.address}
        </p>
        <p className="font-light text-white/75">
          <a href={CONTACT.phoneHref} className="hover:text-white">{CONTACT.phone}</a> ·{" "}
          <a href={CONTACT.emailHref} className="hover:text-white">{CONTACT.email}</a>
        </p>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/45">
          © {new Date().getFullYear()} Aqua Sport Supply · Ko Pha Ngan, Thailand
        </p>
      </div>
    </footer>
  );
}

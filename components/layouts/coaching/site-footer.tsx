import Link from "next/link";
import { COACH_NAV } from "@/lib/layouts/coaching";

export function CoachSiteFooter() {
  return (
    <footer className="bg-[#2c3a30] text-[#f4efe4]">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:px-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="font-[family-name:var(--font-serif)] text-2xl">Jörg Panek</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#f4efe4]/65">
            Traumasensible und nervensystemorientierte Begleitung — in Bamberg und online.
          </p>
          <p className="mt-6 font-[family-name:var(--font-serif)] text-lg italic text-[#d8b48f]">
            „Wir sind weit mehr als unsere Symptome.“
          </p>
        </div>

        <nav className="text-sm">
          <p className="mb-4 text-xs uppercase tracking-[0.18em] text-[#f4efe4]/40">Navigation</p>
          <ul className="space-y-2">
            {COACH_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-[#f4efe4]/75 transition hover:text-[#f4efe4]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm">
          <p className="mb-4 text-xs uppercase tracking-[0.18em] text-[#f4efe4]/40">Kontakt</p>
          <p className="text-[#f4efe4]/75">kontakt@joerg-panek.de</p>
          <p className="mt-2 text-[#f4efe4]/75">Bamberg · und online</p>
        </div>
      </div>

      <div className="border-t border-[#f4efe4]/12">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-[#f4efe4]/45 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p>© {new Date().getFullYear()} Jörg Panek — Fiktive Demo für das Portfolio.</p>
          <p className="flex gap-4">
            <span>Impressum</span>
            <span>Datenschutz</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

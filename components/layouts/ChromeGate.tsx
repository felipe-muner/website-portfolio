"use client";

import { usePathname } from "next/navigation";

// The portfolio template previews ship their own nav and footer, so the
// global site chrome must stay out of the way there.
const LANDING_PREVIEW = /^\/(gym|yoga|villa)(\/v\d+)?$|^\/(gym|yoga|villa)\/v\d+|^\/(restaurant|cafe|barber|dive|spa|courier|studio|coaching|sacolaria|rental|boat|beachclub|realestate|biosphere-bambu|biosphere-build|biosphere-masterplan|biosphere-field|biosphere-estate|biosphere|muaythai|tattoo|cooking|coworking|beanbowl|aircon|artist|brasa|goldenhour|blacklotus|retreat|fullmoon|portfolio|showcase|work|preview)(\/|$)/;

export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (LANDING_PREVIEW.test(pathname)) return null;
  // `contents` adds no box; the marker lets the 404 page hide this chrome
  // (see `[data-site-chrome]` in globals.css).
  return (
    <div data-site-chrome className="contents">
      {children}
    </div>
  );
}

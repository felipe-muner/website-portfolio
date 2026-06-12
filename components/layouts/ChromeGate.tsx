"use client";

import { usePathname } from "next/navigation";

// The portfolio template previews ship their own nav and footer, so the
// global site chrome must stay out of the way there.
const LANDING_PREVIEW = /^\/(gym|yoga|villa)(\/v\d+)?$|^\/(gym|yoga|villa)\/v\d+|^\/(restaurant|cafe|barber|dive|spa|portfolio)(\/|$)/;

export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (LANDING_PREVIEW.test(pathname)) return null;
  return <>{children}</>;
}

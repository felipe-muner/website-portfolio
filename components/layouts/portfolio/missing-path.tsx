"use client";

import { usePathname } from "next/navigation";

/** The address that wasn't found, for the 404 page. */
export function MissingPath() {
  const pathname = usePathname();
  return <>{pathname}</>;
}

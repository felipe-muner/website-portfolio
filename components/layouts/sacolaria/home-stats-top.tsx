"use client";

import { usePathname } from "next/navigation";
import { StatsBar } from "@/components/layouts/sacolaria/stats-bar";

/** Barra de números como primeira seção do site (acima do header) — só na home. */
export function HomeStatsTop() {
  const pathname = usePathname();
  if (pathname !== "/sacolaria") return null;
  return <StatsBar />;
}

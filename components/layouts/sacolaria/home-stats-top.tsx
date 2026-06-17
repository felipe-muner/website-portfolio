"use client";

import { usePathname } from "next/navigation";
import { StatsBar } from "@/components/layouts/sacolaria/stats-bar";

/** Mostra a barra de números como primeira seção — só na home. */
export function HomeStatsTop() {
  const pathname = usePathname();
  if (pathname !== "/sacolaria") return null;
  return <StatsBar />;
}

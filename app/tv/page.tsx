// pages/tv.tsx (or wherever your TV page is defined)

import { TvClient } from "@/components/TvClient";
import { prisma } from "@/lib/prisma";

export default async function TvPage() {
  // Fetch sessions ordered by their start datetime
  const sessions = await prisma.classSession.findMany({
    orderBy: { startDatetime: "asc" },
  });

  // Pass the sessions to the client component
  return <TvClient sessions={sessions} />;
}

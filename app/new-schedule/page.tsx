// pages/index.tsx (or wherever your HomePage component is defined)
import { SessionForm } from "@/components/SessionForm";
import SessionsList from "@/components/SessionList/SessionList";

import { prisma } from "@/lib/prisma";

// Force dynamic rendering so the page always uses fresh data.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch sessions ordered by their start datetime
  const sessions = await prisma.classSession.findMany({
    orderBy: { startDatetime: "asc" },
  });

  return (
    <section className="w-full bg-brand-background-2 py-10 lg:pt-28 lg:pb-36 text-white font-mulish">
      <div className="mx-auto w-full max-w-7xl px-4 flex flex-col gap-8">
        <h1 className="font-oswald text-3xl font-bold text-brand-orange text-center">
          Class Sessions
        </h1>

        {/* Form Section */}
        <div className="bg-brand-background-1 p-6 border border-brand-gray-charcoal rounded-md shadow-lg">
          <h2 className="font-oswald text-2xl font-semibold mb-4 text-white">Create</h2>
          <SessionForm />
        </div>

        {/* Sessions List */}
        <h2 className="font-oswald text-2xl font-bold mt-8 text-brand-orange text-center">
          Sessions List
        </h2>
        <SessionsList sessions={sessions} />
      </div>
    </section>
  );
}

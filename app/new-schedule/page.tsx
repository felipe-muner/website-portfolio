
import { SessionForm } from "@/components/SessionForm";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  const sessions = await prisma.classSession.findMany({
    orderBy: { startDatetime: "asc" }
  });

  return (
    <section className="w-full bg-brand-background-2 py-10 lg:pt-28 lg:pb-36 text-white font-semibold">
      <div className="mx-auto w-full max-w-7xl px-4 flex flex-col gap-6">
        <h1 className="text-2xl text-brand-orange">Class Sessions</h1>

        {/* Form Section */}
        <div className="bg-brand-background-1 p-6 border border-brand-gray-charcoal rounded-md">
          <h2 className="text-xl font-semibold mb-4 text-white">Add a New Session</h2>
          <SessionForm />
        </div>

        {/* Sessions List */}
        <h2 className="text-xl font-semibold mt-8 text-brand-orange">Sessions List</h2>
        {sessions.length === 0 ? (
          <p className="text-white/70">No sessions found.</p>
        ) : (
          <div className="border border-brand-gray-charcoal bg-brand-gray-charcoal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  "bg-brand-background-1 p-4 border border-brand-gray-darker rounded-lg flex flex-col gap-2"
                )}
              >
                <h3 className="text-lg font-semibold text-white">{session.classname}</h3>
                <p className="text-sm text-white/70">
                  <strong>Teacher:</strong> {session.teacher}
                </p>
                <p className="text-sm text-white/70">
                  <strong>Start:</strong> {new Date(session.startDatetime).toLocaleString()}
                </p>
                <p className="text-sm text-white/70">
                  <strong>End:</strong> {new Date(session.endDatetime).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

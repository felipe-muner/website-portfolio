import { SessionForm } from "@/components/SessionForm";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  // Fetch all sessions ordered by their start datetime
  const sessions = await prisma.classSession.findMany({
    orderBy: { startDatetime: "asc" }
  });

  // Define the days of the week (Monday first, Sunday last)
  const daysOfWeek = [
    { name: "Monday", index: 1 },
    { name: "Tuesday", index: 2 },
    { name: "Wednesday", index: 3 },
    { name: "Thursday", index: 4 },
    { name: "Friday", index: 5 },
    { name: "Saturday", index: 6 },
    { name: "Sunday", index: 0 }
  ];

  // Group sessions by the day of the week (based on session.startDatetime)
  const sessionsByDay = daysOfWeek.map(day => {
    const daySessions = sessions.filter(
      (session) => new Date(session.startDatetime).getDay() === day.index
    );
    return { ...day, sessions: daySessions };
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
        {/* Using a grid that adapts the number of columns based on the screen size.
            On larger screens (lg) it will show 7 columns. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 p-4">
          {sessionsByDay.map((day) => (
            <div
              key={day.name}
              className="bg-brand-gray-charcoal p-4 border border-brand-gray-darker rounded-lg"
            >
              <h3 className="text-lg font-semibold text-brand-orange mb-2">
                {day.name}
              </h3>
              {day.sessions.length === 0 ? (
                <p className="text-white/70">No sessions found.</p>
              ) : (
                day.sessions.map((session) => (
                  <div
                    key={session.id}
                    className={cn(
                      "bg-brand-background-1 p-2 border border-brand-gray-darker rounded-lg flex flex-col gap-1 mb-2"
                    )}
                  >
                    <h4 className="text-md font-semibold text-white">
                      {session.classname}
                    </h4>
                    <p className="text-sm text-white/70">
                      <strong>Teacher:</strong> {session.teacher}
                    </p>
                    <p className="text-sm text-white/70">
                      <strong>Start:</strong>{" "}
                      {new Date(session.startDatetime).toLocaleString()}
                    </p>
                    <p className="text-sm text-white/70">
                      <strong>End:</strong>{" "}
                      {new Date(session.endDatetime).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

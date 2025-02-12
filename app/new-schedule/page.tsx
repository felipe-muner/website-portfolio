import { DeleteSessionButton } from "@/components/DeleteSessionButton";
import { SessionForm } from "@/components/SessionForm";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

// Force dynamic rendering so the page is always server-rendered with fresh data.
// Alternatively, you can use:
// export const revalidate = 0;
export const dynamic = "force-dynamic";

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

  // Calculate Monday's date for the current week.
  const today = new Date();
  const diffToMonday = (today.getDay() + 6) % 7; // Sunday (0) => 6, Monday (1) => 0, etc.
  const monday = new Date(today);
  monday.setDate(today.getDate() - diffToMonday);

  // Helper function to format a Date as "MM/DD"
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString([], { month: "2-digit", day: "2-digit" });
  };

  // Helper function to format a Date as "HH:MM"
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Helper function to capitalize the first letter of each word
  const capitalizeWords = (str: string): string => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Group sessions by day of the week and attach the corresponding date for each day.
  const sessionsByDay = daysOfWeek.map((day) => {
    // For our calculation, treat Sunday (index 0) as the 7th day.
    const offset = day.index === 0 ? 6 : day.index - 1; // Monday offset 0, Tuesday 1, ..., Sunday 6.
    const dateForDay = new Date(monday);
    dateForDay.setDate(monday.getDate() + offset);

    const daySessions = sessions.filter(
      (session) => new Date(session.startDatetime).getDay() === day.index
    );
    return { ...day, sessions: daySessions, date: dateForDay };
  });

  return (
    <section className="w-full bg-brand-background-2 py-10 lg:pt-28 lg:pb-36 text-white font-mulish">
      <div className="mx-auto w-full max-w-7xl px-4 flex flex-col gap-8">
        <h1 className="font-oswald text-3xl font-bold text-brand-orange text-center">
          Class Sessions
        </h1>

        {/* Form Section */}
        <div className="bg-brand-background-1 p-6 border border-brand-gray-charcoal rounded-md shadow-lg">
          <h2 className="font-oswald text-2xl font-semibold mb-4 text-white">
            Add a New Session
          </h2>
          <SessionForm />
        </div>

        {/* Sessions List */}
        <h2 className="font-oswald text-2xl font-bold mt-8 text-brand-orange text-center">
          Sessions List
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
          {sessionsByDay.map((day) => (
            <div
              key={day.name}
              className="bg-brand-gray-charcoal p-2 border border-brand-gray-darker rounded-lg shadow-md flex flex-col"
            >
              <h3 className="font-oswald text-xl font-bold text-brand-orange mb-4 border-b border-brand-gray-darker pb-2 text-center">
                {day.name}
                <span className="block text-xs font-normal text-white/70">
                  {formatDate(day.date)}
                </span>
              </h3>
              {day.sessions.length === 0 ? (
                <p className="text-white/70 text-center mt-4">
                  No sessions found.
                </p>
              ) : (
                day.sessions.map((session) => (
                  <div
                    key={session.id}
                    className={cn(
                      "bg-brand-background-1 p-1 border border-brand-gray-darker rounded-lg flex flex-col gap-2 mb-4 hover:shadow-lg transition-shadow duration-300"
                    )}
                  >
                    {/* Delete Button on its own line, right aligned */}
                    <div className="w-full flex justify-end">
                      <DeleteSessionButton sessionId={session.id} />
                    </div>
                    {/* Time Range */}
                    <p className="text-sm font-bold text-white text-center">
                      {formatTime(session.startDatetime)} - {formatTime(session.endDatetime)}
                    </p>
                    {/* Classname and Teacher on two separate lines */}
                    <p className="text-md font-semibold text-white text-center">
                      {capitalizeWords(session.classname)}
                    </p>
                    <p className="text-sm text-white/70 text-center">
                      {capitalizeWords(session.teacher)}
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

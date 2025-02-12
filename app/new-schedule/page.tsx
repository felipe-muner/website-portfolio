
import { SessionForm } from "@/components/SessionForm";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const sessions = await prisma.classSession.findMany({
    orderBy: { startDatetime: "asc" }
  });

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Class Sessions</h1>
      
      <SessionForm />

      <h2 className="text-xl font-semibold mt-8">Sessions List</h2>
      {sessions.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        <ul className="mt-4">
          {sessions.map((session) => (
            <li key={session.id} className="border p-2 mb-2 rounded">
              <p>
                <strong>Teacher:</strong> {session.teacher}
              </p>
              <p>
                <strong>Classname:</strong> {session.classname}
              </p>
              <p>
                <strong>Start:</strong>{" "}
                {new Date(session.startDatetime).toLocaleString()}
              </p>
              <p>
                <strong>End:</strong>{" "}
                {new Date(session.endDatetime).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

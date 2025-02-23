// components/SessionsList.tsx
import React from "react";
import { DeleteSessionButton } from "@/components/DeleteSessionButton";
import { cn } from "@/lib/utils";

interface ClassSession {
  id: number;
  classname: string;
  teacher: string;
  startDatetime: string | Date;
  endDatetime: string | Date;
}

interface SessionsListProps {
  sessions: ClassSession[];
}

export default function SessionsList({ sessions }: SessionsListProps) {
  // Define days of the week
  const daysOfWeek = [
    { name: "Monday", index: 1 },
    { name: "Tuesday", index: 2 },
    { name: "Wednesday", index: 3 },
    { name: "Thursday", index: 4 },
    { name: "Friday", index: 5 },
    { name: "Saturday", index: 6 },
    { name: "Sunday", index: 0 },
  ];

  // Calculate Monday's date for the current week.
  const today = new Date();
  const diffToMonday = (today.getDay() + 6) % 7; // Sunday (0) => 6, Monday (1) => 0, etc.
  const monday = new Date(today);
  monday.setDate(today.getDate() - diffToMonday);

  // Helper functions
  const formatDate = (date: Date): string =>
    date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" });

  const formatTime = (date: string | Date): string => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const capitalizeWords = (str: string): string =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

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
            <p className="text-white/70 text-center mt-4">No sessions found.</p>
          ) : (
            day.sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  "bg-brand-background-1 p-1 border border-brand-gray-darker rounded-lg flex flex-col gap-2 mb-4 hover:shadow-lg transition-shadow duration-300"
                )}
              >
                {/* Delete Button */}
                <div className="w-full flex justify-end">
                  <DeleteSessionButton sessionId={session.id} />
                </div>
                {/* Time Range */}
                <p className="text-sm font-bold text-white text-center">
                  {formatTime(session.startDatetime)} - {formatTime(session.endDatetime)}
                </p>
                {/* Classname and Teacher */}
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
  );
}

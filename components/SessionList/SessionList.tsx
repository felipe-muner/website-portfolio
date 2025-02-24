import React from "react";
import { DeleteSessionButton } from "@/components/DeleteSessionButton";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ClassSession {
  id: number;
  classname: string;
  teacher: string;
  startDatetime: string | Date;
  endDatetime: string | Date;
}

interface SessionsListProps {
  sessions: ClassSession[];
  className?: string;
  isTv?: boolean;
}

const gridContainerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const gridItemVariants = {
  hidden: { opacity: 0, x: -20, y: -20 },
  show: { opacity: 1, x: 0, y: 0 },
};

const sessionContainerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const sessionItemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function SessionsList(props: SessionsListProps) {
  const p = { ...props };

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
  const diffToMonday = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - diffToMonday);

  // Helper functions
  const formatDate = (date: Date): string =>
    date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" });

  const formatTime = (date: string | Date): string => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }); // Converts to local time
  };

  const capitalizeWords = (str: string): string =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // Group sessions by day of the week and attach the corresponding date for each day.
  const sessionsByDay = daysOfWeek.map((day) => {
    const offset = day.index === 0 ? 6 : day.index - 1;
    const dateForDay = new Date(monday);
    dateForDay.setDate(monday.getDate() + offset);

    const daySessions = p.sessions.filter(
      (session) => new Date(session.startDatetime).getDay() === day.index
    );
    return { ...day, sessions: daySessions, date: dateForDay };
  });

  // Conditionally use motion components when isTv is true.
  const GridContainer = p.isTv ? motion.div : "div";
  const GridItem = p.isTv ? motion.div : "div";
  const SessionContainer = p.isTv ? motion.div : "div";
  const SessionItem = p.isTv ? motion.div : "div";

  return (
    <section className={cn("py-16 px-4 w-full", p.className)}>
      {p.isTv && (
        <h2 className="text-5xl font-bold text-white uppercase text-center py-20 font-mulish">
          Schedule
        </h2>
      )}
      <GridContainer
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2"
        {...(p.isTv && { initial: "hidden", animate: "show", variants: gridContainerVariants })}
      >
        {sessionsByDay.map((day) => (
          <GridItem
            key={day.name}
            className="bg-brand-gray-charcoal p-2 border border-brand-gray-darker rounded-lg shadow-md flex flex-col"
            {...(p.isTv && { variants: gridItemVariants })}
          >
            <h3 className="font-oswald text-xl font-bold text-brand-orange mb-4 border-b border-brand-gray-darker pb-2 text-center">
              {day.name}
              <span className="block text-xs font-normal text-white/70">
                {formatDate(day.date)}
              </span>
            </h3>
            {day.sessions.length === 0 ? (
              <p className="text-white/70 text-center mt-4">No Sessions</p>
            ) : (
              <SessionContainer
                className="flex flex-col gap-2"
                {...(p.isTv && {
                  initial: "hidden",
                  animate: "show",
                  variants: sessionContainerVariants,
                })}
              >
                {day.sessions.map((session) => (
                  <SessionItem
                    key={session.id}
                    className="bg-brand-background-1 p-4 border border-brand-gray-darker rounded-lg flex flex-col gap-2 hover:shadow-lg transition-shadow duration-300"
                    {...(p.isTv && { variants: sessionItemVariants })}
                  >
                    {!p.isTv && (
                      <div className="w-full flex justify-end">
                        <DeleteSessionButton sessionId={session.id} />
                      </div>
                    )}
                    <p className="text-sm font-bold text-white text-center">
                      {formatTime(session.startDatetime)} - {formatTime(session.endDatetime)}
                    </p>
                    <p className="text-md font-semibold text-white text-center">
                      {capitalizeWords(session.classname)}
                    </p>
                    <p className="text-md text-white/70 text-center">
                      {capitalizeWords(session.teacher)}
                    </p>
                  </SessionItem>
                ))}
              </SessionContainer>
            )}
          </GridItem>
        ))}
      </GridContainer>
    </section>
  );
}

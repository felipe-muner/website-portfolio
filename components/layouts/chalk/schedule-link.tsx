"use client";

import { filterSchedule } from "./events";

/** A link to the timetable that also searches it for `term` on the way. */
export function ScheduleLink({
  term,
  className,
  children,
}: {
  term: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href="#schedule" onClick={() => filterSchedule(term)} className={className}>
      {children}
    </a>
  );
}

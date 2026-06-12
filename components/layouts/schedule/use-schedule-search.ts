"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { addDays, eachDayOfInterval, endOfMonth, getDay, startOfMonth, startOfWeek } from "date-fns";
import type { ScheduleSession } from "@/lib/layouts/schedule";
import { classesOf, teachersOf } from "@/lib/layouts/schedule";

/**
 * Entity search over a weekly timetable (lipemoves-style): free text matches
 * teacher, class name or style tags. Components highlight matches and dim
 * the rest.
 */
export function useScheduleSearch(week: readonly ScheduleSession[]) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const matches = useCallback(
    (s: ScheduleSession) =>
      q.length === 0 ||
      s.className.toLowerCase().includes(q) ||
      s.teacher.toLowerCase().includes(q) ||
      s.tags.some((tag) => tag.toLowerCase().includes(q)),
    [q],
  );

  const matchCount = useMemo(() => week.filter(matches).length, [week, matches]);

  const teachers = useMemo(() => teachersOf(week), [week]);
  const classNames = useMemo(() => classesOf(week), [week]);

  /** Toggle helper for the quick-pick chips. */
  const toggle = useCallback(
    (term: string) => setQuery((prev) => (prev.trim().toLowerCase() === term.toLowerCase() ? "" : term)),
    [],
  );

  const isActive = useCallback(
    (term: string) => q.length > 0 && term.toLowerCase() === q,
    [q],
  );

  return {
    query,
    setQuery,
    toggle,
    isActive,
    matches,
    hasQuery: q.length > 0,
    matchCount,
    teachers,
    classNames,
  };
}

/**
 * Dates (Mon–Sun) of the current week, resolved after mount so statically
 * prerendered pages never hydrate against a stale build-time date.
 */
export function useWeekDates(): Date[] | null {
  const [dates, setDates] = useState<Date[] | null>(null);
  useEffect(() => {
    const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
    setDates(Array.from({ length: 7 }, (_, i) => addDays(monday, i)));
  }, []);
  return dates;
}

export interface MonthGrid {
  label: string;
  /** Calendar cells padded to full weeks; null = blank leading/trailing cell. */
  cells: (Date | null)[];
  today: Date;
}

/** Current month as Monday-first calendar cells, resolved after mount. */
export function useMonthGrid(): MonthGrid | null {
  const [grid, setGrid] = useState<MonthGrid | null>(null);
  useEffect(() => {
    const today = new Date();
    const days = eachDayOfInterval({ start: startOfMonth(today), end: endOfMonth(today) });
    // getDay: 0 = Sunday — shift to Monday-first.
    const lead = (getDay(days[0]) + 6) % 7;
    const cells: (Date | null)[] = [...Array.from({ length: lead }, () => null), ...days];
    while (cells.length % 7 !== 0) cells.push(null);
    setGrid({
      label: today.toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
      cells,
      today,
    });
  }, []);
  return grid;
}

/** 0 = Monday … 6 = Sunday for a date. */
export function mondayIndex(date: Date): number {
  return (getDay(date) + 6) % 7;
}

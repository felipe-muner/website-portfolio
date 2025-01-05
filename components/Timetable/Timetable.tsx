"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select"; // Adjust path for your shadcn exports

type TimetableDay = {
  name?: string;
  instructor?: string;
};

type TimetableRow = {
  time: string;
  days: TimetableDay[];
};

const TIMETABLE_DATA: TimetableRow[] = [
  {
    time: "6.00am - 8.00am",
    days: [
      { name: "Weight Loss", instructor: "RLefew D. Loee" },
      { name: "Cardio", instructor: "RLefew D. Loee" },
      { name: "Yoga", instructor: "Keaf Shen" },
      { name: "Fitness", instructor: "Kimberly Stone" },
      { name: "Yoga", instructor: "Kimberly Stone" },
      { name: "Boxing", instructor: "Rachel Adam" },
      { name: "Body Building", instructor: "Robert Cage" },
    ],
  },
  {
    time: "10.00am - 12.00am",
    days: [
      {},
      { name: "Fitness", instructor: "Kimberly Stone" },
      { name: "Weight Loss", instructor: "RLefew D. Loee" },
      { name: "Cardio", instructor: "RLefew D. Loee" },
      { name: "Body Building", instructor: "Robert Cage" },
      { name: "Karate", instructor: "Donald Grey" },
      {},
    ],
  },
  {
    time: "5.00pm - 7.00pm",
    days: [
      { name: "Boxing", instructor: "Rachel Adam" },
      { name: "Karate", instructor: "Donald Grey" },
      { name: "Body Building", instructor: "Robert Cage" },
      {},
      { name: "Yoga", instructor: "Keaf Shen" },
      { name: "Cardio", instructor: "RLefew D. Loee" },
      { name: "Fitness", instructor: "Kimberly Stone" },
    ],
  },
  {
    time: "7.00pm - 9.00pm",
    days: [
      { name: "Cardio", instructor: "RLefew D. Loee" },
      {},
      { name: "Boxing", instructor: "Rachel Adam" },
      { name: "Yoga", instructor: "Keaf Shen" },
      { name: "Karate", instructor: "Donald Grey" },
      { name: "Boxing", instructor: "Rachel Adam" },
      { name: "Weight Loss", instructor: "RLefew D. Loee" },
    ],
  },
];

/**
 * Gather unique classes => gather their teachers => group by class
 */
function getClassTeacherStructure(data: TimetableRow[]) {
  const map = new Map<string, Set<string>>();

  data.forEach((row) => {
    row.days.forEach((day) => {
      if (day.name && day.instructor) {
        if (!map.has(day.name)) {
          map.set(day.name, new Set());
        }
        map.get(day.name)!.add(day.instructor);
      }
    });
  });

  // Convert Map => array of { className, teachers[] }
  const result = Array.from(map.entries()).map(([className, teacherSet]) => ({
    className,
    teachers: Array.from(teacherSet).sort(),
  }));

  // Sort by className
  result.sort((a, b) => a.className.localeCompare(b.className));
  return result;
}

const groupedData = getClassTeacherStructure(TIMETABLE_DATA);

export default function Timetable() {
  const [selectedPair, setSelectedPair] = useState("all");

  /**
   * If "all" => show everything
   * If "Yoga" => show only day.name = "Yoga"
   * If "Yoga|Keaf Shen" => exact match of class + teacher
   */
  function cellMatchesFilter(day: TimetableDay) {
    if (selectedPair === "all") return true;
    if (!day.name || !day.instructor) return false;

    // If user chose a single class only (e.g. "Yoga")
    if (!selectedPair.includes("|")) {
      return day.name === selectedPair;
    }

    // Otherwise user chose "class|teacher"
    const [className, teacherName] = selectedPair.split("|");
    return day.name === className && day.instructor === teacherName;
  }

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <section className="w-full bg-brand-background-2 py-10 lg:py-16 text-white font-semibold">
      <div className="mx-auto w-full max-w-7xl px-4 flex flex-col gap-6">
        <h2 className="text-2xl">Classes Timetable</h2>

        {/* SINGLE SELECT */}
        <div>
          <Select value={selectedPair} onValueChange={(val) => setSelectedPair(val)}>
            <SelectTrigger
              className={cn(
                "max-w-[250px]",
                "bg-brand-background-2 text-white border border-brand-gray-darker rounded-none px-4 py-3",
                "focus:outline-none focus:ring-2 focus:ring-brand-orange font-mulish"
              )}
            >
              <SelectValue placeholder="Select class or teacher" />
            </SelectTrigger>
            <SelectContent
              className={cn(
                "bg-brand-background-2 text-white border border-brand-gray-darker rounded-none font-mulish"
              )}
            >
              <SelectItem
                value="all"
                className={cn(
                  "bg-brand-background-2 text-white cursor-pointer rounded-none",
                  "data-[highlighted]:bg-brand-background-1 data-[highlighted]:text-brand-orange"
                )}
              >
                All classes
              </SelectItem>

              {/* Group by class */}
              {groupedData.map(({ className, teachers }) => (
                <SelectGroup key={className}>
                  <SelectLabel className="px-2 py-1 text-sm text-white/70">
                    {className}
                  </SelectLabel>
                  <SelectItem
                    value={className}
                    className={cn(
                      "bg-brand-background-2 text-white cursor-pointer rounded-none",
                      "data-[highlighted]:bg-brand-background-1 data-[highlighted]:text-brand-orange"
                    )}
                  >
                    — All teachers
                  </SelectItem>
                  {teachers.map((teacher) => {
                    const comboValue = `${className}|${teacher}`;
                    return (
                      <SelectItem
                        key={comboValue}
                        value={comboValue}
                        className={cn(
                          "bg-brand-background-2 text-white cursor-pointer rounded-none",
                          "data-[highlighted]:bg-brand-background-1 data-[highlighted]:text-brand-orange"
                        )}
                      >
                        — {teacher}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* TIMETABLE GRID */}
        <div className="overflow-x-auto">
          {/**
           * We use a container with:
           *   - border (1px)
           *   - background color = brand-gray-charcoal (our line color)
           *   - gap-[1px] so there's exactly 1px between each cell
           * We remove borders from individual cells to avoid double borders.
           */}
          <div
            className={cn(
              // Outer border: 1px
              "border border-brand-gray-charcoal",
              // Container background => gap color
              "bg-brand-gray-charcoal",

              // 8 columns, each min-w:145px, expands to fill available space
              "grid grid-cols-[repeat(8,minmax(145px,1fr))]",

              // 1px gap between cells
              "gap-[1px]"
            )}
          >
            {/* HEADER ROW */}
            {/* Empty top-left cell */}
            <div
              className={cn(
                "bg-brand-orange font-mulish text-white",
                "h-[60px] flex items-center justify-center",
                // No border here; the 1px gap is handled by the container
              )}
            >
              &nbsp;
            </div>
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className={cn(
                  "bg-brand-orange font-mulish text-white text-sm font-normal",
                  "h-[60px] flex items-center justify-center p-2 text-center"
                )}
              >
                {day}
              </div>
            ))}

            {/* TIMETABLE ROWS */}
            {TIMETABLE_DATA.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {/* Time cell */}
                <div
                  className={cn(
                    "bg-brand-black text-brand-orange font-mulish text-xs",
                    "min-h-[120px] flex items-center justify-center px-3 text-center"
                  )}
                >
                  {row.time}
                </div>

                {/* 7 day-cells */}
                {row.days.map((day, dayIndex) => {
                  const isMatch = cellMatchesFilter(day);
                  const hasClass = !!day.name;
                  const backgroundClass = hasClass
                    ? "bg-brand-background-1"
                    : "bg-brand-background-2";

                  return (
                    <div
                      key={dayIndex}
                      className={cn(
                        // Each cell has no border of its own, letting the container gap show
                        backgroundClass,
                        "min-h-[120px] flex flex-col items-center justify-center relative",
                        "transition-colors text-center px-2 py-1",
                        {
                          // Dim non-matching cells
                          "opacity-20 pointer-events-none": !isMatch,
                        }
                      )}
                    >
                      {hasClass ? (
                        <>
                          <h5
                            className={cn(
                              "mb-1 text-lg font-semibold uppercase",
                              isMatch ? "text-white" : "text-white/20"
                            )}
                          >
                            {day.name}
                          </h5>
                          <span
                            className={cn(
                              "text-xs",
                              isMatch
                                ? "text-brand-gray-medium hover:text-brand-gray-light"
                                : "text-white/20"
                            )}
                          >
                            {day.instructor}
                          </span>
                        </>
                      ) : (
                        // Slash line if no class
                        <div
                          className={cn(
                            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                            "rotate-[-35deg] w-full h-[1px] bg-brand-gray-charcoal/40"
                          )}
                        />
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Adjust path for your shadcn exports

type TimetableDay = {
  name?: string;
  instructor?: string;
  type?: "dark";
};

type TimetableRow = {
  time: string;
  days: TimetableDay[];
};

const TIMETABLE_DATA: TimetableRow[] = [
  {
    time: "6.00am - 8.00am",
    days: [
      { name: "Weight Loss", instructor: "RLefew D. Loee", type: "dark" },
      { name: "Cardio", instructor: "RLefew D. Loee" },
      { name: "Yoga", instructor: "Keaf Shen", type: "dark" },
      { name: "Fitness", instructor: "Kimberly Stone" },
      {},
      { name: "Boxing", instructor: "Rachel Adam" },
      { name: "Body Building", instructor: "Robert Cage", type: "dark" },
    ],
  },
  {
    time: "10.00am - 12.00am",
    days: [
      {},
      { name: "Fitness", instructor: "Kimberly Stone", type: "dark" },
      { name: "Weight Loss", instructor: "RLefew D. Loee" },
      { name: "Cardio", instructor: "RLefew D. Loee", type: "dark" },
      { name: "Body Building", instructor: "Robert Cage" },
      { name: "Karate", instructor: "Donald Grey", type: "dark" },
      {},
    ],
  },
  {
    time: "5.00pm - 7.00pm",
    days: [
      { name: "Boxing", instructor: "Rachel Adam", type: "dark" },
      { name: "Karate", instructor: "Donald Grey" },
      { name: "Body Building", instructor: "Robert Cage", type: "dark" },
      {},
      { name: "Yoga", instructor: "Keaf Shen", type: "dark" },
      { name: "Cardio", instructor: "RLefew D. Loee" },
      { name: "Fitness", instructor: "Kimberly Stone", type: "dark" },
    ],
  },
  {
    time: "7.00pm - 9.00pm",
    days: [
      { name: "Cardio", instructor: "RLefew D. Loee" },
      {},
      { name: "Boxing", instructor: "Rachel Adam" },
      { name: "Yoga", instructor: "Keaf Shen", type: "dark" },
      { name: "Karate", instructor: "Donald Grey" },
      { name: "Boxing", instructor: "Rachel Adam", type: "dark" },
      { name: "Weight Loss", instructor: "RLefew D. Loee" },
    ],
  },
];

/** 
 * 1) Gather all unique (teacher, class) pairs from the timetable
 */
function getTeacherClassCombos(data: TimetableRow[]) {
  const pairs = new Set<string>(); // We'll store "teacher|className" to ensure uniqueness

  data.forEach((row) => {
    row.days.forEach((day) => {
      if (day.instructor && day.name) {
        const combo = `${day.instructor}|${day.name}`;
        pairs.add(combo);
      }
    });
  });

  // Convert each unique pair string into a structured object
  const teacherClassCombos = Array.from(pairs).map((pair) => {
    const [teacher, className] = pair.split("|");
    return { teacher, className };
  });

  // 2) Sort by teacher, then by class (alphabetically)
  teacherClassCombos.sort((a, b) => {
    // Compare teacher first
    const teacherCompare = a.teacher.localeCompare(b.teacher);
    if (teacherCompare !== 0) {
      return teacherCompare;
    }
    // If same teacher, compare by className
    return a.className.localeCompare(b.className);
  });

  return teacherClassCombos;
}

const teacherClassCombos = getTeacherClassCombos(TIMETABLE_DATA);

export default function Timetable() {
  // Single select: "all" or "teacher|className"
  const [selectedPair, setSelectedPair] = useState("all");

  /**
   * Filtering logic:
   * If selectedPair is "all", we show everything.
   * Otherwise, only highlight cells that match the chosen teacher + class.
   */
  function cellMatchesFilter(day: TimetableDay) {
    if (selectedPair === "all") return true;
    if (!day.instructor || !day.name) return false; // No class or no instructor => can't match

    // Decompose selected teacher + class from the state
    const [selectedTeacher, selectedClass] = selectedPair.split("|");
    return day.instructor === selectedTeacher && day.name === selectedClass;
  }

  return (
    <section className="w-full bg-brand-background-2 py-10 lg:py-16 text-white font-semibold">
      <div className="mx-auto w-full max-w-7xl px-4 flex flex-col gap-6">
        <h2 className="text-2xl">Classes Timetable</h2>

        {/* SINGLE SELECT */}
        <div>
          <Select value={selectedPair} onValueChange={(val) => setSelectedPair(val)}>
            <SelectTrigger
              className={cn(
                "w-[250px]",
                // Remove rounded corners -> "rounded-none"
                // Use "bg-brand-background-2" for the closed trigger background
                // Same border + ring focus style if desired
                "bg-brand-background-2 text-white border border-brand-gray-darker rounded-none px-4 py-3",
                "focus:outline-none focus:ring-2 focus:ring-brand-orange font-mulish"
              )}
            >
              <SelectValue placeholder="Select teacher & class" />
            </SelectTrigger>

            <SelectContent
              // The dropdown container
              className={cn(
                "bg-brand-background-2 text-white border border-brand-gray-darker rounded-none font-mulish"
              )}
            >
              {/* The "All" option */}
              <SelectItem
                value="all"
                // Use same background and no radius
                className="bg-brand-background-2 text-white cursor-pointer rounded-none hover:bg-brand-black"
              >
                All classes
              </SelectItem>

              {/* Each (teacher, className) pair */}
              {teacherClassCombos.map(({ teacher, className }) => {
                const comboValue = `${teacher}|${className}`;
                const comboLabel = `${teacher} • ${className}`;

                return (
                  <SelectItem
                    key={comboValue}
                    value={comboValue}
                    className={cn(
                      // Force the item to keep the same background
                      "bg-brand-background-2 text-white cursor-pointer rounded-none hover:bg-brand-black"
                    )}
                  >
                    {comboLabel}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* TIMETABLE TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed border-collapse border border-[#363636] text-center">
            <thead>
              <tr className="bg-brand-orange font-mulish text-white">
                <th className="p-4 w-24 text-sm border-r border-brand-gray-darker font-normal">&nbsp;</th>
                <th className="p-4 w-24 text-sm border-r border-brand-gray-darker font-normal">Monday</th>
                <th className="p-4 w-24 text-sm border-r border-brand-gray-darker font-normal">Tuesday</th>
                <th className="p-4 w-24 text-sm border-r border-brand-gray-darker font-normal">Wednesday</th>
                <th className="p-4 w-24 text-sm border-r border-brand-gray-darker font-normal">Thursday</th>
                <th className="p-4 w-24 text-sm border-r border-brand-gray-darker font-normal">Friday</th>
                <th className="p-4 w-24 text-sm border-r border-brand-gray-darker font-normal">Saturday</th>
                <th className="p-4 w-24 text-sm font-normal">Sunday</th>
              </tr>
            </thead>
            <tbody>
              {TIMETABLE_DATA.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {/* TIME CELL */}
                  <td className="border border-[#363636] bg-brand-black p-4 w-24 h-24 text-brand-orange font-mulish text-xs">
                    {row.time}
                  </td>
                  {/* DAY CELLS */}
                  {row.days.map((day, dayIndex) => {
                    const isMatch = cellMatchesFilter(day);

                    // Decide the background color:
                    // If there's a class (day.name), use brand-background-1
                    // If it's empty, use brand-background-2
                    const backgroundClass = day.name
                      ? "bg-brand-background-1"
                      : "bg-brand-background-2";

                    return (
                      <td
                        key={dayIndex}
                        className={cn(
                          "border border-[#363636] py-6 w-24 h-24 text-sm relative transition-colors",
                          backgroundClass,
                          {
                            // Dim non-matching cells
                            "opacity-20 pointer-events-none": !isMatch,
                          }
                        )}
                      >
                        {day.name ? (
                          <div className="group">
                            <h5
                              className={cn(
                                "mb-[10px] text-lg font-semibold uppercase transition",
                                isMatch
                                  ? "text-white group-hover:text-opacity-100"
                                  : "text-white text-opacity-20"
                              )}
                            >
                              {day.name}
                            </h5>
                            <span
                              className={cn(
                                "text-xs transition",
                                isMatch
                                  ? "text-brand-gray-medium group-hover:text-brand-gray-light"
                                  : "text-white text-opacity-20"
                              )}
                            >
                              {day.instructor}
                            </span>
                          </div>
                        ) : (
                          // No class => slash line
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-35deg] w-[188px] h-[1px] bg-[#363636]" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

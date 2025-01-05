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
    teachers: Array.from(teacherSet).sort(), // sort teacher names
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
   * If "Yoga" => show only day.name = "Yoga" (all teachers)
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
              {/* Keep original style for items */}
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
                  {/* You can style the label if you like, or leave it minimal */}
                  <SelectLabel className="px-2 py-1 text-sm text-white/70">
                    {className}
                  </SelectLabel>

                  {/* Class-only item => all teachers for this class */}
                  <SelectItem
                    value={className}
                    className={cn(
                      "bg-brand-background-2 text-white cursor-pointer rounded-none",
                      "data-[highlighted]:bg-brand-background-1 data-[highlighted]:text-brand-orange"
                    )}
                  >
                    —  All teachers
                  </SelectItem>

                  {/* One <SelectItem> per teacher */}
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

        {/* TIMETABLE TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed border-collapse border border-[#363636] text-center">
            <thead>
              <tr className="bg-brand-orange font-mulish text-white">
                <th className="p-4 w-24 text-sm border-r border-brand-gray-darker font-normal">
                  &nbsp;
                </th>
                <th className="p-4 w-24 text-sm border-r border-brand-gray-darker font-normal">
                  Monday
                </th>
                <th className="p-4 w-24 text-sm border-r border-brand-gray-darker font-normal">
                  Tuesday
                </th>
                <th className="p-4 w-24 text-sm border-r border-brand-gray-darker font-normal">
                  Wednesday
                </th>
                <th className="p-4 w-24 text-sm border-r border-brand-gray-darker font-normal">
                  Thursday
                </th>
                <th className="p-4 w-24 text-sm border-r border-brand-gray-darker font-normal">
                  Friday
                </th>
                <th className="p-4 w-24 text-sm border-r border-brand-gray-darker font-normal">
                  Saturday
                </th>
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

                    // If there's a class => brand-background-1
                    // If empty => brand-background-2
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
                                  ? "text-white"
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
                          // Slash line if no class
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

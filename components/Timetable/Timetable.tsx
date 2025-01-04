"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Update this path to match where you exported shadcn's Select components

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
      { name: "WEIGHT LOOSE", instructor: "RLefew D. Loee" },
    ],
  },
];

// Extract unique teachers and classes
function extractUniqueValues(data: TimetableRow[]) {
  const allTeachers = new Set<string>();
  const allClasses = new Set<string>();

  data.forEach((row) => {
    row.days.forEach((day) => {
      if (day.instructor) {
        allTeachers.add(day.instructor);
      }
      if (day.name) {
        allClasses.add(day.name);
      }
    });
  });

  return {
    teachers: Array.from(allTeachers),
    classes: Array.from(allClasses),
  };
}

const { teachers, classes } = extractUniqueValues(TIMETABLE_DATA);

export default function Timetable() {
  // Use "all-teachers" and "all-classes" to represent "no specific filter"
  const [selectedTeacher, setSelectedTeacher] = useState("all-teachers");
  const [selectedClass, setSelectedClass] = useState("all-classes");

  // Decide if a cell matches the user filters
  function cellMatchesFilter(day: TimetableDay) {
    // If user picked "all-teachers" or "all-classes", treat them as no filter
    const isAllTeachers = selectedTeacher === "all-teachers";
    const isAllClasses = selectedClass === "all-classes";

    // If both are 'all', everything matches
    if (isAllTeachers && isAllClasses) return true;

    // Compare day.instructor/day.name to selected values
    const matchTeacher = isAllTeachers || day.instructor === selectedTeacher;
    const matchClass = isAllClasses || day.name === selectedClass;

    return matchTeacher && matchClass;
  }

  return (
    <section className="overflow-x-auto bg-brand-background-2 lg:p-4 lg:container lg:mx-auto my-28 flex flex-col gap-6 text-white text-xl font-semibold">
      <div>
        <h2 className="mb-4 text-2xl">Classes Timetable</h2>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Teacher Filter */}
          <div>
            <Select
              value={selectedTeacher}
              onValueChange={(val) => setSelectedTeacher(val)}
            >
              <SelectTrigger className="w-[200px] text-brand-background-1 font-mulish">
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-teachers">All Teachers</SelectItem>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher} value={teacher}>
                    {teacher}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Class Filter */}
          <div>
            <Select
              value={selectedClass}
              onValueChange={(val) => setSelectedClass(val)}
            >
              <SelectTrigger className="w-[200px] text-brand-background-1 font-mulish">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-classes">All Classes</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* TIMETABLE TABLE */}
      <table className="min-w-full table-fixed border-collapse border border-[#363636] text-center">
        <thead>
          <tr className="bg-brand-orange font-mulish">
            <th className="p-4 w-24 text-sm text-white border-r border-brand-gray-darker font-normal">
              &nbsp;
            </th>
            <th className="p-4 w-24 text-sm text-white border-r border-brand-gray-darker font-normal">
              Monday
            </th>
            <th className="p-4 w-24 text-sm text-white border-r border-brand-gray-darker font-normal">
              Tuesday
            </th>
            <th className="p-4 w-24 text-sm text-white border-r border-brand-gray-darker font-normal">
              Wednesday
            </th>
            <th className="p-4 w-24 text-sm text-white border-r border-brand-gray-darker font-normal">
              Thursday
            </th>
            <th className="p-4 w-24 text-sm text-white border-r border-brand-gray-darker font-normal">
              Friday
            </th>
            <th className="p-4 w-24 text-sm text-white border-r border-brand-gray-darker font-normal">
              Saturday
            </th>
            <th className="p-4 w-24 text-sm text-white font-normal">Sunday</th>
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
                      // No class => show slash
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-35deg] w-[188px] h-[1px] bg-[#363636]" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

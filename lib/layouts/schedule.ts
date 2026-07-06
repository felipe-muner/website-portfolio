// FICTIONAL weekly timetable used by the portfolio layout previews.
// Teachers and classes are invented — no real business data.

export interface ScheduleSession {
  id: string;
  className: string;
  teacher: string;
  /** 0 = Monday … 6 = Sunday */
  weekday: number;
  /** 24h "HH:mm" */
  start: string;
  end: string;
  tags: readonly string[];
  href: string;
}

export const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const WEEKDAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function session(
  id: string,
  className: string,
  teacher: string,
  weekday: number,
  start: string,
  end: string,
  tags: readonly string[],
): ScheduleSession {
  return { id, className, teacher, weekday, start, end, tags, href: "#" };
}

export const GYM_WEEK: readonly ScheduleSession[] = [
  // 07:00 Cross-Training WOD, Mon–Fri + Saturday team session
  session("g01", "Cross-Training WOD", "Marco", 0, "07:00", "08:00", ["strength", "conditioning"]),
  session("g02", "Cross-Training WOD", "Nadia", 1, "07:00", "08:00", ["strength", "conditioning"]),
  session("g03", "Cross-Training WOD", "Marco", 2, "07:00", "08:00", ["strength", "conditioning"]),
  session("g04", "Cross-Training WOD", "Nadia", 3, "07:00", "08:00", ["strength", "conditioning"]),
  session("g05", "Cross-Training WOD", "Marco", 4, "07:00", "08:00", ["strength", "conditioning"]),
  session("g06", "Team Workout", "Marco", 5, "08:30", "09:30", ["team", "conditioning"]),
  // mid-morning
  session("g07", "HIIT", "Theo", 0, "09:00", "09:45", ["cardio", "intervals"]),
  session("g08", "Race Prep", "Lena", 1, "09:00", "10:00", ["engine", "race"]),
  session("g09", "HIIT", "Theo", 2, "09:00", "09:45", ["cardio", "intervals"]),
  session("g10", "Race Prep", "Lena", 3, "09:00", "10:00", ["engine", "race"]),
  session("g11", "HIIT", "Theo", 4, "09:00", "09:45", ["cardio", "intervals"]),
  session("g12", "Race Prep", "Lena", 5, "09:00", "10:00", ["engine", "race"]),
  session("g13", "Weightlifting", "Nadia", 1, "10:30", "11:30", ["barbell", "strength", "technique"]),
  session("g14", "Weightlifting", "Nadia", 3, "10:30", "11:30", ["barbell", "strength", "technique"]),
  session("g15", "Open Gym Coaching", "Diana", 5, "10:30", "12:00", ["open gym", "strength"]),
  // afternoon
  session("g16", "Boot Camp", "Diana", 0, "16:00", "17:00", ["outdoor", "conditioning", "team"]),
  session("g17", "Tabata", "Theo", 1, "16:00", "16:40", ["cardio", "intervals"]),
  session("g18", "Boot Camp", "Diana", 2, "16:00", "17:00", ["outdoor", "conditioning", "team"]),
  session("g19", "Tabata", "Theo", 3, "16:00", "16:40", ["cardio", "intervals"]),
  session("g20", "Boot Camp", "Diana", 4, "16:00", "17:00", ["outdoor", "conditioning", "team"]),
  // evening
  session("g21", "Cross-Training WOD", "Nadia", 0, "17:30", "18:30", ["strength", "conditioning"]),
  session("g22", "Cross-Training WOD", "Marco", 1, "17:30", "18:30", ["strength", "conditioning"]),
  session("g23", "Cross-Training WOD", "Nadia", 2, "17:30", "18:30", ["strength", "conditioning"]),
  session("g24", "Cross-Training WOD", "Marco", 3, "17:30", "18:30", ["strength", "conditioning"]),
  session("g25", "Cross-Training WOD", "Diana", 4, "17:30", "18:30", ["strength", "conditioning"]),
  session("g26", "Jiu-Jitsu", "Eli", 1, "18:30", "20:00", ["martial arts", "grappling"]),
  session("g27", "Jiu-Jitsu", "Eli", 3, "18:30", "20:00", ["martial arts", "grappling"]),
  // sunday
  session("g28", "Mobility & Recovery", "Lena", 6, "09:00", "10:00", ["mobility", "recovery"]),
  session("g29", "Open Gym Coaching", "Diana", 6, "10:30", "12:00", ["open gym", "strength"]),
] as const;

export const YOGA_WEEK: readonly ScheduleSession[] = [
  // sunrise
  session("y01", "Power Vinyasa", "Noah", 0, "07:30", "08:45", ["yoga", "power", "flow"]),
  session("y02", "Power Vinyasa", "Noah", 2, "07:30", "08:45", ["yoga", "power", "flow"]),
  session("y03", "Power Vinyasa", "Noah", 4, "07:30", "08:45", ["yoga", "power", "flow"]),
  // morning
  session("y04", "Mat Pilates", "Isla", 1, "09:00", "10:00", ["pilates", "core", "mobility"]),
  session("y05", "Mat Pilates", "Isla", 3, "09:00", "10:00", ["pilates", "core", "mobility"]),
  session("y06", "Reformer Pilates", "Mali", 0, "10:00", "11:00", ["pilates", "reformer", "precision"]),
  session("y07", "Reformer Pilates", "Isla", 1, "10:00", "11:00", ["pilates", "reformer", "precision"]),
  session("y08", "Reformer Pilates", "Mali", 2, "10:00", "11:00", ["pilates", "reformer", "precision"]),
  session("y09", "Reformer Pilates", "Isla", 3, "10:00", "11:00", ["pilates", "reformer", "precision"]),
  session("y10", "Reformer Pilates", "Mali", 4, "10:00", "11:00", ["pilates", "reformer", "precision"]),
  session("y11", "Reformer Pilates", "Isla", 5, "10:00", "11:00", ["pilates", "reformer", "precision"]),
  // afternoon
  session("y12", "Slow Flow & Balance", "Amara", 0, "16:30", "17:30", ["yoga", "balance", "restorative"]),
  session("y13", "Slow Flow & Balance", "Amara", 2, "16:30", "17:30", ["yoga", "balance", "restorative"]),
  session("y14", "Deep Stretch & Mobility", "Lena", 1, "17:30", "18:30", ["mobility", "stretch"]),
  session("y15", "Deep Stretch & Mobility", "Lena", 3, "17:30", "18:30", ["mobility", "stretch"]),
  // evenings & weekend rituals
  session("y16", "Sunset Flow", "Noah", 5, "17:00", "18:00", ["yoga", "flow", "sunset"]),
  session("y17", "Breathwork & Ice Bath", "Noah", 5, "18:00", "19:30", ["breathwork", "ice bath", "recovery"]),
  session("y18", "Yin & Restore", "Amara", 6, "09:00", "10:15", ["yoga", "restorative", "slow"]),
  session("y19", "Breathwork & Ice Bath", "Noah", 6, "17:00", "18:30", ["breathwork", "ice bath", "recovery"]),
  session("y20", "Full Moon Flow", "Amara", 6, "18:30", "19:30", ["yoga", "flow", "moonlight"]),
] as const;

export const MUAYTHAI_WEEK: readonly ScheduleSession[] = [
  // morning
  session("m01", "Technique", "Kru Somchai", 0, "07:30", "09:00", ["muay thai", "technique", "pads"]),
  session("m02", "Technique", "Kru Somchai", 2, "07:30", "09:00", ["muay thai", "technique", "pads"]),
  session("m03", "Technique", "Kru Somchai", 4, "07:30", "09:00", ["muay thai", "technique", "pads"]),
  session("m04", "Strength & Conditioning", "Coach Tai", 1, "08:00", "09:00", ["conditioning", "strength"]),
  session("m05", "Strength & Conditioning", "Coach Tai", 3, "08:00", "09:00", ["conditioning", "strength"]),
  // midday beginners
  session("m06", "Beginner Muay Thai", "Kru Nok", 0, "10:00", "11:00", ["muay thai", "beginner", "fundamentals"]),
  session("m07", "Beginner Muay Thai", "Kru Nok", 2, "10:00", "11:00", ["muay thai", "beginner", "fundamentals"]),
  session("m08", "Beginner Muay Thai", "Kru Nok", 4, "10:00", "11:00", ["muay thai", "beginner", "fundamentals"]),
  session("m09", "Clinch & Sparring", "Kru Somchai", 5, "10:00", "11:30", ["muay thai", "clinch", "sparring"]),
  // afternoon
  session("m10", "Pad Work", "Kru Nok", 0, "16:00", "17:30", ["muay thai", "pads", "technique"]),
  session("m11", "Pad Work", "Kru Nok", 1, "16:00", "17:30", ["muay thai", "pads", "technique"]),
  session("m12", "Pad Work", "Kru Nok", 2, "16:00", "17:30", ["muay thai", "pads", "technique"]),
  session("m13", "Pad Work", "Kru Nok", 3, "16:00", "17:30", ["muay thai", "pads", "technique"]),
  session("m14", "Pad Work", "Kru Nok", 4, "16:00", "17:30", ["muay thai", "pads", "technique"]),
  // evening
  session("m15", "Fighter Training", "Kru Somchai", 1, "17:30", "19:00", ["muay thai", "fighter", "sparring"]),
  session("m16", "Fighter Training", "Kru Somchai", 3, "17:30", "19:00", ["muay thai", "fighter", "sparring"]),
  session("m17", "Boxing & Bag Work", "Coach Tai", 5, "16:00", "17:00", ["boxing", "bag work", "conditioning"]),
  session("m18", "Open Mat & Recovery", "Kru Nok", 6, "09:00", "10:30", ["recovery", "open mat", "stretch"]),
] as const;

// Recurring event "sessions" for the moon-calendar lineup (full-moon template).
export const MOON_EVENTS: readonly ScheduleSession[] = [
  session("e01", "Sunset Sessions", "Resident DJs", 5, "17:00", "21:00", ["sunset", "house", "chill"]),
  session("e02", "Jungle Bass Night", "Kaya & guests", 5, "22:00", "04:00", ["bass", "jungle", "late"]),
  session("e03", "Beach Fire Show", "Fire Krew", 6, "20:00", "22:00", ["fire show", "acrobatics", "family"]),
  session("e04", "Full Moon Rave", "Headline + support", 6, "22:00", "06:00", ["full moon", "trance", "techno", "headline"]),
  session("e05", "Sunday Sundowner", "Acoustic set", 6, "16:30", "18:30", ["acoustic", "chill", "sunset"]),
  session("e06", "Half-Moon Warmup", "Local selectors", 2, "21:00", "02:00", ["house", "warmup", "midweek"]),
  session("e07", "Drum Circle", "Open jam", 3, "18:00", "20:00", ["drum circle", "community", "free"]),
] as const;

/** Unique teachers of a week, in first-appearance order. */
export function teachersOf(week: readonly ScheduleSession[]): string[] {
  return [...new Set(week.map((s) => s.teacher))];
}

/** Unique class names of a week, in first-appearance order. */
export function classesOf(week: readonly ScheduleSession[]): string[] {
  return [...new Set(week.map((s) => s.className))];
}

/** Sessions of a weekday sorted by start time. */
export function sessionsOn(week: readonly ScheduleSession[], weekday: number): ScheduleSession[] {
  return week
    .filter((s) => s.weekday === weekday)
    .sort((a, b) => a.start.localeCompare(b.start));
}

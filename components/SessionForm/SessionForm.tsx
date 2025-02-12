"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export default function SessionForm() {
  const [teacher, setTeacher] = useState("");
  const [classname, setClassname] = useState("");
  const [startDatetime, setStartDatetime] = useState("");
  const [endDatetime, setEndDatetime] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacher, classname, startDatetime, endDatetime }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create session");
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred");
    }
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "bg-brand-background-1 border-brand-gray-charcoal rounded-lg shadow-lg flex flex-col gap-4"
      )}
    >
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Fields in a row on larger screens, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col">
          <label className="text-white/80">Teacher</label>
          <input
            type="text"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
            className="w-full bg-brand-background-2 text-white border border-brand-gray-darker rounded px-4 py-2 focus:ring-2 focus:ring-brand-orange focus:outline-none"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-white/80">Classname</label>
          <input
            type="text"
            value={classname}
            onChange={(e) => setClassname(e.target.value)}
            className="w-full bg-brand-background-2 text-white border border-brand-gray-darker rounded px-4 py-2 focus:ring-2 focus:ring-brand-orange focus:outline-none"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-white/80">Start Date and Time</label>
          <input
            type="datetime-local"
            value={startDatetime}
            onChange={(e) => setStartDatetime(e.target.value)}
            className="w-full bg-brand-background-2 text-white border border-brand-gray-darker rounded px-4 py-2 focus:ring-2 focus:ring-brand-orange focus:outline-none"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-white/80">End Date and Time</label>
          <input
            type="datetime-local"
            value={endDatetime}
            onChange={(e) => setEndDatetime(e.target.value)}
            className="w-full bg-brand-background-2 text-white border border-brand-gray-darker rounded px-4 py-2 focus:ring-2 focus:ring-brand-orange focus:outline-none"
            required
          />
        </div>
      </div>

      {/* Button on a separate line */}
      <div className="mt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-orange text-white font-semibold px-6 py-2 rounded-md hover:bg-brand-orange-dark transition duration-300 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Session"}
        </button>
      </div>
    </form>
  );
}

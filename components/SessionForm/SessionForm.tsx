"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SessionForm() {
  const router = useRouter();
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
      // Convert local time input to UTC before sending
      const startUTC = new Date(startDatetime).toISOString();
      const endUTC = new Date(endDatetime).toISOString();
  
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacher,
          classname,
          startDatetime: startUTC, // Ensure UTC
          endDatetime: endUTC, // Ensure UTC
        }),
      });
  
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create session");
      } else {
        router.refresh();
        setStartDatetime("");
        setEndDatetime("");
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
      className={cn("bg-brand-background-1 border-brand-gray-charcoal rounded-lg shadow-lg flex flex-col gap-4")}
    >
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-white/80">Teacher</Label>
          <Input
            type="text"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
            className="w-full bg-brand-background-2 text-white border border-brand-gray-darker rounded px-4 py-2"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-white/80">Classname</Label>
          <Input
            type="text"
            value={classname}
            onChange={(e) => setClassname(e.target.value)}
            className="w-full bg-brand-background-2 text-white border border-brand-gray-darker rounded px-4 py-2"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-white/80">Start Date and Time</Label>
          <Input
            type="datetime-local"
            value={startDatetime}
            onChange={(e) => setStartDatetime(e.target.value)}
            className="w-full bg-brand-background-2 text-white border border-brand-gray-darker rounded px-4 py-2"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-white/80">End Date and Time</Label>
          <Input
            type="datetime-local"
            value={endDatetime}
            onChange={(e) => setEndDatetime(e.target.value)}
            className="w-full bg-brand-background-2 text-white border border-brand-gray-darker rounded px-4 py-2"
            required
          />
        </div>
      </div>

      <div className="mt-2">
        <Button type="submit" disabled={loading} className="bg-brand-orange text-white font-semibold px-6 py-2 rounded-md">
          {loading ? "Saving..." : "Save Session"}
        </Button>
      </div>
    </form>
  );
}

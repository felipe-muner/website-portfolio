import { Breadcrumb } from "@/components/Breadcrumb";
import { Timetable } from "@/components/Timetable";

export default function Classes() {
  return (
    <main className="flex flex-col">
      <Breadcrumb route={'Classes'} />      
      <Timetable />
    </main>
  );
}

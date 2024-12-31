import { Breadcrumb } from "@/components/Breadcrumb";
import { Timetable } from "@/components/Timetable";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Classes" });
export default function Classes() {
  return (
    <main className="flex flex-col">
      <Breadcrumb route={'Classes'} />      
      <Timetable />
    </main>
  );
}

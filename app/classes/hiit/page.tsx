import { Breadcrumb } from "@/components/Breadcrumb";
import { Timetable } from "@/components/Timetable";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "hiit" });
export default function BreathworkIceBath() {
  return (
    <>
      <Breadcrumb route={'HIIT'} />      
      <Timetable />
    </>
  );
}

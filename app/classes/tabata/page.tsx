import { Breadcrumb } from "@/components/Breadcrumb";
import { Timetable } from "@/components/Timetable";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Tabata" });
export default function BreathworkIceBath() {
  return (
    <>
      <Breadcrumb route={'Tabata'} />      
      <Timetable />
    </>
  );
}

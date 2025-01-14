import { Breadcrumb } from "@/components/Breadcrumb";
import { Timetable } from "@/components/Timetable";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Pilates Mobility" });
export default function BreathworkIceBath() {
  return (
    <>
      <Breadcrumb route={'Pilates Mobility'} />      
      <Timetable />
    </>
  );
}

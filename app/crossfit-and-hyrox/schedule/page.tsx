import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Schedule" });
export default function Schedule() {
  return (
    <>
      <Breadcrumb route={'Schedule'} isClass />
      <div className="flex flex-col gap-4 items-center justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[700px] font-mulish">
        <h1 className="text-2xl font-bold text-center">Class Schedule</h1>
        <p className="text-center">
          Plan your week with our comprehensive schedule of classes, training sessions, and programs
        </p>
        <p className="text-center font-semibold text-white mt-4">
          No booking needed. Please check in at reception 15 minutes before class starts.
        </p>
      </div>
    </>
  );
}

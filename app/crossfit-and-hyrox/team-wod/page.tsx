import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Team WOD" });
export default function TeamWOD() {
  return (
    <>
      <Breadcrumb route={'Team WOD'} isClass />
      <div className="flex flex-col gap-4 items-center justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[700px] font-mulish">
        <h1 className="text-2xl font-bold text-center">Team WOD</h1>
        <p className="text-center">
          Team WOD is a fun and challenging workout that is designed to be done with a partner or in a group. These workouts are a great way to build camaraderie, push yourself to new limits, and have fun while getting fit. Team WODs are scalable to all fitness levels and are a great way to mix up your regular routine and try something new.
        </p>
      </div>
    </>
  );
}

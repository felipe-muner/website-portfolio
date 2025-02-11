import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "WOD" });
export default function WOD() {
  return (
    <>
      <Breadcrumb route={'WOD'} isClass />
      <div className="flex flex-col gap-4 items-center justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[700px] font-mulish">
        <h1 className="text-2xl font-bold text-center">WOD</h1>
        <p className="text-center">
          The Workout of the Day (WOD) is a daily workout that is designed to challenge your fitness and push you to new limits. Each WOD is different and is designed to improve your strength, endurance, and overall fitness. Our WODs are scalable to all fitness levels, so whether you're a beginner or an experienced athlete, you can participate in our daily workouts.
        </p>
      </div>
    </>
  );
}

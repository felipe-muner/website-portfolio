import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Schedule" });
export default function Schedule() {
  return (
    <>
      <Breadcrumb route={'Schedule'} isClass />
      <div className="flex flex-col gap-4 items-center justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[700px] font-mulish">
        <h1 className="text-2xl font-bold text-center">Schedule</h1>
        <p className="text-center">
          Our schedule is updated weekly and includes a variety of classes to fit your fitness goals and lifestyle. Whether you&apos;re looking for high-intensity workouts, strength training, or yoga, we have something for everyone. Check out our schedule below and sign up for a class today!
        </p>
      </div>
    </>
  );
}

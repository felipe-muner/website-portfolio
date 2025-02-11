import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Open Gym" });
export default function OpenGym() {
  return (
    <>
      <Breadcrumb route={'Open Gym'} isClass />
      <div className="flex flex-col gap-4 items-center justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[700px] font-mulish">
        <h1 className="text-2xl font-bold text-center">Open Gym</h1>
        <p className="text-center">
          Open gym is a time for members to come in and work on their own fitness goals. Whether you want to practice a specific skill, work on strength training, or do your own workout, open gym is the perfect opportunity to do so. Our open gym hours are a great way to supplement your regular classes and get in some extra training time.
        </p>
      </div>
    </>
  );
}

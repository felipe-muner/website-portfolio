import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "hiit" });
export default function Hiit() {
  return (
    <>
      <Breadcrumb route={"HIIT"} isClass />
      <div className="flex flex-col gap-4 items-center justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[700px] font-mulish">
        <h1 className="text-2xl font-bold text-center">HIIT</h1>
        <p className="text-center">
          HIIT, or High-Intensity Interval Training, is a form of cardiovascular
          exercise that alternates between short bursts of intense activity and
          brief periods of rest or recovery. This type of workout is designed to
          burn fat, build muscle, and improve overall fitness in a short amount
          of time. HIIT is a great way to increase your metabolism, boost your
          endurance, and improve your cardiovascular health. Whether you&apos;re a
          beginner or an experienced athlete, HIIT can help you achieve your
          fitness goals and take your workout to the next level.
        </p>
      </div>
    </>
  );
}

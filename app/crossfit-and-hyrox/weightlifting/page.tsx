import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Weightlifting" });
export default function Weightlifting() {
  return (
    <>
      <Breadcrumb route={'Weightlifting'} isClass />
      <div className="flex flex-col gap-4 items-center justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[700px] font-mulish">
        <h1 className="text-2xl font-bold text-center">Weightlifting</h1>
        <p className="text-center">
          Weightlifting is a sport that involves lifting heavy weights in a controlled manner to build strength and muscle mass. This class
          is designed to improve your technique, increase your strength, and help you reach your fitness goals. Whether you&apos;re new to weightlifting
          or an experienced lifter, our classes are suitable for all levels and will help you become a better athlete.
        </p>
      </div>
    </>
  );
}

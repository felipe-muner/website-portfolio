import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Mobility" });
export default function Mobility() {
  return (
    <>
      <Breadcrumb route={'Mobility'} isClass />
      <div className="flex flex-col gap-4 items-center justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[700px] font-mulish">
        <h1 className="text-2xl font-bold text-center">Mobility</h1>
        <p className="text-center">
          Mobility is the ability to move freely and easily without pain or restriction. This class is designed
          to improve your flexibility, strength, and range of motion by targeting the muscles and joints that are
          essential for everyday movement. Mobility is a great way to reduce your risk of injury, improve your
          posture, and enhance your overall well-being.
        </p>
      </div>
    </>
  );
}

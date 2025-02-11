import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Pilates Mobility" });
export default function PilatesMobility() {
  return (
    <>
      <Breadcrumb route={'Pilates Mobility'} isClass />   
      <div className="flex flex-col gap-4 items-center justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[700px] font-mulish">
        <h1 className="text-2xl font-bold text-center">Pilates Mobility</h1>
        <p className="text-center">
          Pilates Mobility is a low-impact exercise class that focuses on improving flexibility, strength, and balance. This class is designed to help you move more efficiently and with greater ease by targeting the muscles that support your spine and joints. Pilates Mobility is a great way to improve your posture, reduce your risk of injury, and enhance your overall well-being.
        </p>
      </div>   
    </>
  );
}

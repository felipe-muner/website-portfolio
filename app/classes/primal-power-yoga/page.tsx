import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Primal Power Yoga" });
export default function PrimalPowerYoga() {
  return (
    <>
      <Breadcrumb route={'Primal Power Yoga'} isClass />
      <div className="flex flex-col gap-4 items-center justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[700px] font-mulish">
        <h1 className="text-2xl font-bold text-center">Primal Power Yoga</h1>
        <p className="text-center">
          Primal Power Yoga is a dynamic and powerful style of yoga that combines traditional yoga postures with modern fitness techniques. This class is designed
          to build strength, flexibility, and balance while promoting mindfulness and relaxation. Primal Power Yoga is a great way to improve your overall fitness
          and well-being while reducing stress and anxiety.
        </p>
      </div>
    </>
  );
}

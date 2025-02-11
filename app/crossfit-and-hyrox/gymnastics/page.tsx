import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Gymnastics" });
export default function Gymnastics() {
  return (
    <>
      <Breadcrumb route={'Gymnastics'} isClass />
      <div className="flex flex-col gap-4 items-center justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[700px] font-mulish">
        <h1 className="text-2xl font-bold text-center">Gymnastics</h1>
        <p className="text-center">
          Gymnastics is a sport that involves performing a series of acrobatic and artistic movements on various pieces of equipment, such as the balance beam, uneven bars, and vault. This type of exercise requires strength, flexibility, and coordination, as well as balance and agility. Gymnastics is a great way to improve your overall fitness, build muscle, and increase your flexibility. Whether you're a beginner or an experienced gymnast, this class can help you achieve your fitness goals and take your workout to the next level.
        </p>
      </div>
    </>
  );
}

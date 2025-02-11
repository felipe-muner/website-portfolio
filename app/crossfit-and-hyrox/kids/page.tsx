import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Kids" });
export default function Kids() {
  return (
    <>
      <Breadcrumb route={'Kids'} isClass />
      <div className="flex flex-col gap-4 items-center justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[700px] font-mulish">
        <h1 className="text-2xl font-bold text-center">Kids</h1>
        <p className="text-center">
          CrossFit Kids is a strength and conditioning program that is specifically designed for children and teenagers. This program helps kids develop a lifelong love of fitness by teaching them how to move well, stay active, and have fun. CrossFit Kids is a great way to improve your child's physical fitness, coordination, and confidence while promoting a healthy and active lifestyle.
        </p>
      </div>
    </>
  );
}

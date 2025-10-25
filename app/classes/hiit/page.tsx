import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";
import { Check } from "lucide-react";
import Link from "next/link";

export const metadata = getMetadata({ routeName: "hiit" });

export default function Hiit() {
  return (
    <>
      <Breadcrumb route={'HIIT'} isClass />
      <div className="flex flex-col gap-4 items-start justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[700px] font-mulish">
        <h1 className="text-3xl font-semibold text-white text-left">HIIT with <Link href="/our-team" className="text-brand-orange hover:underline">Steve</Link></h1>
        <p>HIIT is a fast and effective workout that alternates between short bursts of intense exercise and brief recovery periods. Designed to burn fat, build muscle, and boost endurance, it maximises calorie burn and improves cardiovascular health in minimal time.</p>
        
        <p>Our HIIT class combines bodyweight exercises, strength training, and cardio intervals for a full-body workout that’s scalable for all fitness levels. Get ready to push your limits, increase your metabolism, and leave feeling stronger, faster, and more energised!</p>
        
        <h2 className="text-3xl font-semibold mt-4 text-white">Key Benefits</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Efficient fat burning & muscle building</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Increased cardiovascular endurance</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Boosted metabolism for continuous calorie burn</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Improved strength, agility & power</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Time-saving workout with maximum results</span>
          </li>
        </ul>
      </div>
    </>
  );
}

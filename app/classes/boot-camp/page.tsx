import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";
import { Check } from "lucide-react";
import Link from "next/link";

export const metadata = getMetadata({ routeName: "Boot Camp" });

export default function BootCamp() {
  return (
    <>
      <Breadcrumb route={'Boot Camp'} isClass />
      <div className="flex flex-col gap-4 items-start justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[700px] font-mulish">
        <h1 className="text-3xl font-semibold text-white text-left">Boot Camp</h1>
        <p>All classes with names of the Coach and when clicking on name, goes to <Link href="/our-team" className="text-brand-orange hover:underline">Our Team</Link> page.</p>
        <p>Boot Camp is an intense, military-inspired workout combining cardio, strength training, and functional movements. Get ready to push your limits!</p>

        <h2 className="text-3xl font-semibold mt-4 text-white">Key Benefits</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Full-body strength & conditioning</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Improved cardiovascular endurance</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Team motivation & accountability</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Mental toughness development</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Functional fitness for daily life</span>
          </li>
        </ul>
      </div>
    </>
  );
}

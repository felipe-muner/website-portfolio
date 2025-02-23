import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";
import { Check, Clock10, Clock7 } from "lucide-react";

export const metadata = getMetadata({ routeName: "overview" });

export default function Overview() {
  return (
    <>
      <Breadcrumb route={'Overview'} isClass />
      <div className="flex flex-col gap-4 items-start justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[700px] font-mulish">
        <h1 className="text-3xl font-semibold text-white text-left">Experience Premium Fitness in the Heart of Koh Phangan</h1>
        <p className="text-white font-semibold">Open daily from <span className="text-white flex items-center gap-1"><Clock7 className="text-brand-orange" size={20} /> 7:00 to <Clock10 className="text-brand-orange" size={20} /> 22:00</span></p>
        
        <p>Spanning 1,000m² (5,400 sq. ft.), our modern fitness center is designed for those who prioritize performance, hygiene, and well-being.</p>
        
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Cutting-Edge Gym – Fully air-conditioned, equipped with the latest industry-leading machines and free weights.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Pristine Facilities – Showers, lockers, towel service (with deposit), and a purified water fountain.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Recovery & Wellness – Ice bath and steam room for optimal muscle recovery.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Group Fitness Classes – Energising morning sessions to kickstart your day.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>CrossFit – Group sessions and flexible Open Gym access.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Onsite Bar & Shop – Refresh and recharge with premium protein shakes, and soon-to-come snacks & fitness gear.</span>
          </li>
        </ul>
      </div>
    </>
  );
}

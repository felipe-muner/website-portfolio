import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";
import { Check } from "lucide-react";

export const metadata = getMetadata({ routeName: "Body Balance" });

export default function BodyBalance() {
  return (
    <>
      <Breadcrumb route={'Body Balance'} isClass />
      <div className="flex flex-col gap-4 items-start justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[700px] font-mulish">
        <h1 className="text-3xl font-semibold text-white text-left">Body Balance with Anastasia</h1>
        <p>Body Balance is a dynamic yet controlled workout designed to enhance balance and coordination, strengthen joint stability, and activate deep core muscles. While incorporating static postures, the use of an inflatable fitness ball introduces movement, making the training engaging, effective, and highly functional.</p>

        <p>Balance is maintained by engaging the core, hamstrings, quads, and dorsal muscles, playing with joint mobility, while focusing on breath-work and mindful awareness guiding each movement.</p>

        <h2 className="text-3xl font-semibold mt-4 text-white">Key Benefits</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Improves joint stability and mobility</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Develops coordination and body control</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Strengthens core, back, and leg muscles</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Helps prevent injuries from falls</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Enhances concentration & mindfulness</span>
          </li>
        </ul>
      </div>
    </>
  );
}

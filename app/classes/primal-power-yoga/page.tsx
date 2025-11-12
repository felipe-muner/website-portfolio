import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";
import { Check } from "lucide-react";
import Link from "next/link";

export const metadata = getMetadata({ routeName: "Primal Moves" });

export default function PrimalPowerYoga() {
  return (
    <>
      <Breadcrumb route={'Primal Moves'} isClass />
      <div className="flex flex-col gap-4 items-start justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[700px] font-mulish">
        <h1 className="text-3xl font-semibold text-white text-left">Primal Moves with <Link href="/coaches-trainers/jace" className="text-brand-orange hover:underline">Jace</Link></h1>
        <p>Primal Moves is a return to the body&apos;s original design, the way humans are built to move. Drawing from animal locomotion, natural movement, and bodyweight training. Primal builds strength, mobility, and control through intentional and grounded motion.</p>
        <p>Each movement engages the whole body as one system, developing functional strength, joint resilience, and coordination for real-world performance. Through fluid transitions, crawling, squatting, rolling, leaping, and balancing, you rediscover agility, stability and control.</p>

        <p>Primal Moves is more than training, it&apos;s a reclamation of natural, powerful and efficient human movement.</p>

        <h2 className="text-3xl font-semibold mt-4 text-white">Key Benefits</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Functional strength for real-world performance</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Enhanced mobility and control</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Joint resilience and coordination</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Improved agility and stability</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Natural, powerful movement patterns</span>
          </li>
        </ul>
      </div>
    </>
  );
}

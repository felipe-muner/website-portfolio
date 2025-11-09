import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";
import { Check } from "lucide-react";
import Link from "next/link";

export const metadata = getMetadata({ routeName: "Primal Power Yoga" });

export default function PrimalPowerYoga() {
  return (
    <>
      <Breadcrumb route={'Primal Power Yoga'} isClass />
      <div className="flex flex-col gap-4 items-start justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[700px] font-mulish">
        <h1 className="text-3xl font-semibold text-white text-left">Power Primal Yoga with <Link href="/coaches-trainers/jace" className="text-brand-orange hover:underline">Jace</Link></h1>
        <p>Experience Power Primal Yoga, a fusion of Vinyasa Yoga, animal locomotion, and calisthenics, where every movement is performed with full intention and maximum engagement.</p>
        <p>Rooted in primal movement patterns, this practice is designed to build functional strength, improve mobility, flexibility, and stability, and refine neuromuscular control, enabling you to move with greater ease, agility, and power.</p>
        
        <p>Through a flow of dynamic sequences that activate your core, enhance balance and coordination, and expand your range of motion, the practice emphasizes postural alignment, deep breathing, and mental focus.</p>
        
        <p>Power Primal Yoga challenges both your mind and body, fostering resilience, endurance, and purpose-driven movement. This challenging yet deeply rewarding practice is an opportunity to redefine movement and unlock a new level of physical mastery, with progressions for all levels, making it accessible for beginners while providing advanced practitioners the tools to push their limits.</p>
        
        <h2 className="text-3xl font-semibold mt-4 text-white">Key Benefits</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Increased strength, power & endurance</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Enhanced mobility, agility & flexibility</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Sharpened coordination & neuromuscular control</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Heightened body awareness</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Deepened mind-body connection</span>
          </li>
        </ul>
      </div>
    </>
  );
}

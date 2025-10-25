import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";
import { Check } from "lucide-react";
import Link from "next/link";

export const metadata = getMetadata({ routeName: "Pilates Mobility" });

export default function PilatesMobility() {
  return (
    <>
      <Breadcrumb route={'Pilates Mobility'} isClass />
      <div className="flex flex-col gap-4 items-start justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[700px] font-mulish">
        <h1 className="text-3xl font-semibold text-white text-left">Pilates Mobility with <Link href="/our-team" className="text-brand-orange hover:underline">Vanessa</Link></h1>
        <p>Pilates Mobility is a class designed to improve flexibility, strength, and body awareness through controlled movements that emphasize core engagement and proper alignment.</p>
        <p>Using props like resistance bands, yoga balls, and magic circles, this class enhances joint mobility and stability, making it suitable for all fitness levels.</p>
        
        <p>Whether you&apos;re an elite athlete, post-natal, or recovering from injury, Pilates serves as the foundation for movement in daily life. With spinal health at its core, this practice strengthens deep stabilizing muscles, promotes postural balance, and enhances freedom of movement while toning the abdominals, waistline, thighs, and buttocks.</p>
        
        <p>Additionally, Pilates supports organ detoxification, breath activation, and improved muscle function, contributing to overall well-being.</p>
        
        <h2 className="text-3xl font-semibold mt-4 text-white">Key Benefits</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Improved strength & stability</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Full-body toning & posture alignment</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Enhanced breath control</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Nervous system regulation</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Deeper body-mind connection</span>
          </li>
        </ul>
      </div>   
    </>
  );
}

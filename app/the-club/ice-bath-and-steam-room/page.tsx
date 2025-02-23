import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";
import { Check } from "lucide-react";

export const metadata = getMetadata({ routeName: "Ice Bath And Steam Room" });

export default function IceBathAndSteamRoom() {
  return (
    <>
      <Breadcrumb route={'Ice Bath And Steam Room'} isClass />
      <div className="flex flex-col gap-4 items-start justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[800px] font-mulish">
        <h1 className="text-3xl font-semibold mt-4 text-white">Maximise Recovery with Our Steam Room & Ice Bath</h1>
        <p>Enhance your post-workout recovery with our steam room and ice bath, designed to boost muscle recovery, reduce soreness, and improve overall well-being.</p>
        
        <h2 className="text-3xl font-semibold mt-4 text-white">Benefits</h2>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span><strong className="text-white">Ice Bath</strong> – Reduces inflammation, relieves muscle soreness, and accelerates recovery by constricting blood vessels and flushing out toxins.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span><strong className="text-white">Steam Room</strong> – Promotes relaxation, increases circulation, detoxifies the skin, and soothes muscles by opening blood vessels and improving oxygen flow.</span>
          </li>
        </ul>
        
        <h2 className="text-3xl font-semibold mt-4 text-white">The Ideal Recovery Sequence</h2>
        <ol className="list-decimal list-inside space-y-2 text-brand-gray-medium">
          <li><strong className="text-white">Start with the Ice Bath (1-3 minutes)</strong> – Reduce inflammation and minimise muscle fatigue.</li>
          <li><strong className="text-white">Follow with the Steam Room (10-15 minutes)</strong> – Relax, improve circulation, and release muscle tension.</li>
        </ol>
      </div>
    </>
  );
}

import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";
import { Check } from "lucide-react";
import Link from "next/link";

export const metadata = getMetadata({ routeName: "Tabata" });

export default function Tabata() {
  return (
    <>
      <Breadcrumb route={'Tabata'} isClass />
      <div className="flex flex-col gap-4 items-start justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[700px] font-mulish">
        <h1 className="text-3xl font-semibold text-white text-left">Tabata Training with <Link href="/coaches-trainers/steve" className="text-brand-orange hover:underline">Steve</Link></h1>
        <p>This high-intensity workout is built on short, explosive rounds: 25 seconds of all-out effort, followed by 10 seconds of rest.</p>

        <p>We cycle through multiple exercises targeting strength, cardio, and endurance, moving quickly, resting briefly, and pushing your limits with every round.</p>

        <h2 className="text-3xl font-semibold mt-4 text-white">Expect</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>A variety of bodyweight and weighted moves</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Minimal breaks, maximum output</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>A serious metabolic boost</span>
          </li>
        </ul>

        <p>It&apos;s intense, efficient, and over before you know it.</p>

        <p>Perfect for anyone who wants to feel the burn, build stamina, and get stronger, fast.</p>

        <p className="font-semibold text-white">Beginners welcome, modifications always available.</p>
      </div>
    </>
  );
}

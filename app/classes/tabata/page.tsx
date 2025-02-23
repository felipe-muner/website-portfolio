import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";
import { Check } from "lucide-react";

export const metadata = getMetadata({ routeName: "Tabata" });

export default function Tabata() {
  return (
    <>
      <Breadcrumb route={'Tabata'} isClass />
      <div className="flex flex-col gap-4 items-start justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[700px] font-mulish">
        <h1 className="text-3xl font-semibold text-white text-left">Tabata with Steve – Maximum Efficiency, Maximum Results.</h1>
        <p>Tabata is a structured form of high-intensity interval training (HIIT) involving one round of 18 exercises that follow a precise 25 seconds of intense effort, followed by 15 seconds of rest, repeated for three rounds. This scientifically proven method boosts endurance, burns fat, and enhances muscular power in a short, highly efficient session.</p>
        
        <p>Our Tabata class delivers an explosive workout that targets strength, speed, and stamina through rapid, high-energy movements. Using a mix of bodyweight exercises, resistance training, and cardio drills, this class pushes your limits while keeping workouts short and effective.</p>
        
        <h2 className="text-3xl font-semibold mt-4 text-white">Key Benefits</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Rapid fat loss & improved cardiovascular health</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Increased power, speed & muscular endurance</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Enhanced metabolism for post-workout calorie burn</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Short, high-intensity sessions for maximum efficiency</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={20} className="text-brand-orange flex-shrink-0 mt-1" /> <span>Scalable for all fitness levels</span>
          </li>
        </ul>
      </div>
    </>
  );
}

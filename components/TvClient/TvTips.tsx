import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface TvTipsProps {
  className?: string;
}

export default function TvTips(props: TvTipsProps) {
  const p = { ...props };

  return (
    <section className={cn("py-16 px-4 w-full", p.className)}>
      <h2 className="text-5xl font-bold text-white uppercase text-center py-20 font-mulish">
        Tips
      </h2>
      <div className="flex flex-col gap-6 items-center justify-center p-10 mx-auto text-brand-gray-medium font-mulish bg-brand-background-2 max-w-4xl rounded-md">
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <Check size={24} className="text-brand-orange flex-shrink-0 mt-1" />
            <span className="text-xl text-white">
              Enjoy your workout with the stunning turquoise sea and lush tropical views.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Check size={24} className="text-brand-orange flex-shrink-0 mt-1" />
            <span className="text-xl text-white">
              Start your day with an energizing beach run along Koh Phangan&apos;s pristine shores.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Check size={24} className="text-brand-orange flex-shrink-0 mt-1" />
            <span className="text-xl text-white">
              Embrace outdoor yoga sessions at sunrise to connect with nature.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Check size={24} className="text-brand-orange flex-shrink-0 mt-1" />
            <span className="text-xl text-white">
              Stay refreshed with cool coconut water available right at the gym.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Check size={24} className="text-brand-orange flex-shrink-0 mt-1" />
            <span className="text-xl text-white">
              Protect your skin with quality sunscreen during outdoor workouts.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Check size={24} className="text-brand-orange flex-shrink-0 mt-1" />
            <span className="text-xl text-white">
              Try beach bootcamp classes for a dynamic, group workout experience.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Check size={24} className="text-brand-orange flex-shrink-0 mt-1" />
            <span className="text-xl text-white">
              Balance outdoor circuits with indoor strength sessions to beat the heat.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Check size={24} className="text-brand-orange flex-shrink-0 mt-1" />
            <span className="text-xl text-white">
              Unwind with recovery sessions overlooking the serene ocean views.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Check size={24} className="text-brand-orange flex-shrink-0 mt-1" />
            <span className="text-xl text-white">
              Join local fitness events to become part of Koh Phangan’s vibrant community.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Check size={24} className="text-brand-orange flex-shrink-0 mt-1" />
            <span className="text-xl text-white">
              End your day with calming meditation under a starlit tropical sky.
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}

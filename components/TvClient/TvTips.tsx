import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface TvTipsProps {
  className?: string;
}

const tips = [
  "Enjoy your workout with the stunning turquoise sea and lush tropical views.",
  "Start your day with an energizing beach run along Koh Phangan's pristine shores.",
  "Embrace outdoor yoga sessions at sunrise to connect with nature.",
  "Stay refreshed with cool coconut water available right at the gym.",
  "Protect your skin with quality sunscreen during outdoor workouts.",
  "Try beach bootcamp classes for a dynamic, group workout experience.",
  "Balance outdoor circuits with indoor strength sessions to beat the heat.",
  "Unwind with recovery sessions overlooking the serene ocean views.",
  "Join local fitness events to become part of Koh Phangan’s vibrant community.",
  "End your day with calming meditation under a starlit tropical sky."
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15, // delay between each tip's animation
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function TvTips(props: TvTipsProps) {
  const p = { ...props };

  return (
    <section className={cn("py-16 px-4 w-full", p.className)}>
      <h2 className="text-5xl font-bold text-white uppercase text-center py-20 font-mulish">
        Tips
      </h2>
      <motion.div
        className="flex flex-col gap-6 items-center justify-center p-10 mx-auto text-brand-gray-medium font-mulish bg-brand-background-2 max-w-4xl rounded-md"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        <motion.ul className="space-y-4">
          {tips.map((tip, index) => (
            <motion.li
              key={index}
              className="flex items-start gap-3"
              variants={itemVariants}
            >
              <Check size={24} className="text-brand-orange flex-shrink-0 mt-1" />
              <span className="text-xl text-white">{tip}</span>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}

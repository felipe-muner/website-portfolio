import { TitleSection } from "@/components/TitleSection";
import { cn } from "@/lib/utils";
import { membershipPlans } from "./membershipData";
import { motion } from "framer-motion";

interface OurPlanProps {
  className?: string;
  isTv?: boolean;
}

const planTypes = [
  "Drop-in",
  "5-pass",
  "1-month",
  "3-month",
  "6-month",
  "12-month",
];

const subCategories = membershipPlans.flatMap(
  (membership) => membership.plans
);

// Motion variants for animated (TV) mode
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const paragraphsContainerVariants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: planTypes.length * 0.15, // delay after table rows animate (6 * 0.15 = 0.9s)
      staggerChildren: 0.15,
    },
  },
};

export default function OurPlan(props: OurPlanProps) {
  const p = { ...props };

  return (
    <section className={cn("py-16", p.className)}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Conditional title/header */}
        {p.isTv ? (
          <h2 className="text-5xl font-bold text-white uppercase text-center py-20 font-mulish">
            Prices
          </h2>
        ) : (
          <TitleSection
            title="Your membership, an investment in your health"
            subtitle="Choose your plan"
            className="pb-10"
          />
        )}

        <div className="overflow-x-auto mt-10">
          <table className="min-w-full border-collapse border border-brand-gray-light rounded-xl shadow-lg">
            <thead>
              <tr className="bg-brand-gray-darker">
                <th className="px-4 py-2 border-brand-gray-light"></th>
                {membershipPlans.map((membership, index) => (
                  <th
                    key={index}
                    colSpan={membership.plans.length}
                    className="px-4 py-2 text-center text-white text-xl border border-brand-gray-light"
                  >
                    {membership.type}
                  </th>
                ))}
              </tr>
              <tr className="bg-brand-gray-darker">
                <th className="px-4 py-2 border-brand-gray-light"></th>
                {subCategories.map((sub, index) => (
                  <th
                    key={index}
                    className="px-4 py-2 text-center text-white border border-brand-gray-light"
                  >
                    {sub.category}
                  </th>
                ))}
              </tr>
            </thead>
            {p.isTv ? (
              <motion.tbody
                initial="hidden"
                animate="show"
                variants={containerVariants}
              >
                {planTypes.map((type, rowIndex) => (
                  <motion.tr
                    key={rowIndex}
                    className="border-t border-brand-gray-light"
                    variants={rowVariants}
                  >
                    <th className="px-4 py-2 text-left text-white font-mulish border border-brand-gray-light bg-brand-gray-dark">
                      {type}
                      {type.toLowerCase() === "5-pass" && (
                        <div className="text-xs text-gray-400">
                          Validity: 1 month - Cannot be shared
                        </div>
                      )}
                    </th>
                    {subCategories.map((sub, colIndex) => {
                      const plan = sub.plans.find(
                        (p) => p.name.toLowerCase() === type.toLowerCase()
                      );
                      return (
                        <td
                          key={colIndex}
                          className="px-4 py-2 text-center text-brand-orange font-bold border border-brand-gray-light"
                        >
                          {plan ? plan.price : "-"}
                        </td>
                      );
                    })}
                  </motion.tr>
                ))}
              </motion.tbody>
            ) : (
              <tbody>
                {planTypes.map((type, rowIndex) => (
                  <tr key={rowIndex} className="border-t border-brand-gray-light">
                    <th className="px-4 py-2 text-left text-white font-mulish border border-brand-gray-light bg-brand-gray-dark">
                      {type}
                      {type.toLowerCase() === "5-pass" && (
                        <div className="text-xs text-gray-400">
                          Validity: 1 month - Cannot be shared
                        </div>
                      )}
                    </th>
                    {subCategories.map((sub, colIndex) => {
                      const plan = sub.plans.find(
                        (p) => p.name.toLowerCase() === type.toLowerCase()
                      );
                      return (
                        <td
                          key={colIndex}
                          className="px-4 py-2 text-center text-brand-orange font-bold border border-brand-gray-light"
                        >
                          {plan ? plan.price : "-"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {p.isTv ? (
            <motion.div
              className="mt-4 space-y-2"
              initial="hidden"
              animate="show"
              variants={paragraphsContainerVariants}
            >
              <motion.p
                className="px-4 text-left text-gray-400 font-mulish"
                variants={rowVariants}
              >
                * CrossFit 1, 3, 6 months & Fitness Classes 1-month = 500 ฿ / month for Gym, Steam & Ice-bath access - NOT valid for Open-gym only.
              </motion.p>
              <motion.p
                className="px-4 text-left text-gray-400 font-mulish"
                variants={rowVariants}
              >
                * Membership PAUSE = 1 month: 1, 3-month: 2, 6-month: 3, 12-month: 4. Duration: maximum 3 weeks per time.
              </motion.p>
            </motion.div>
          ) : (
            <div className="mt-4 space-y-2">
              <p className="px-4 text-left text-gray-400">
                * CrossFit 1, 3, 6 months & Fitness Classes 1-month = 500 ฿ / month for Gym, Steam & Ice-bath access - NOT valid for Open-gym only.
              </p>
              <p className="px-4 text-left text-gray-400">
                * Membership PAUSE = 1 month: 1, 3-month: 2, 6-month: 3, 12-month: 4. Duration: maximum 3 weeks per time.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

import { TitleSection } from "@/components/TitleSection";
import { cn } from "@/lib/utils";
import { membershipPlans } from "./membershipData";

interface OurPlanProps {
  className?: string;
}

export default function OurPlan(props: OurPlanProps) {
  const p = { ...props };

  // Define the 6 plan types (rows)
  const planTypes = [
    "Drop-in",
    "5-pass",
    "1-month",
    "3-month",
    "6-month",
    "12-month",
  ];

  // Flatten the subcategories in order
  const subCategories = membershipPlans.flatMap(
    (membership) => membership.plans
  );

  return (
    <section className={cn("bg-brand-background-2 py-16", p.className)}>
      <div className="container mx-auto px-4">
        <TitleSection
          title="Your membership, an investment in your health"
          subtitle="Choose your plan"
          className="pb-10"
        />
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
          </table>
          <div className="mt-4 space-y-2">
            <p className="px-4 text-left text-gray-400">
              * CrossFit 1, 3, 6 months & Fitness Classes 1-month = 500 ฿ / month for Gym, Steam & Ice-bath access - NOT valid for Open-gym only.
            </p>
            <p className="px-4 text-left text-gray-400">
              * Membership PAUSE = 1 month: 1, 3-month: 2, 6-month: 3, 12-month: 4. Duration: maximum 3 weeks per time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

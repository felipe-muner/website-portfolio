import { cn } from "@/lib/utils";
import { membershipPlans } from "../OurPlan/membershipData";

interface TvOurPlanProps {
  className?: string;
}

export default function TvOurPlan(props: TvOurPlanProps) {
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
    <section className={cn("py-16 px-4 w-full", p.className)}>
      <h2 className="text-5xl font-bold text-white uppercase text-center py-20 font-mulish">
        Prices
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-brand-gray-light rounded-xl shadow-lg">
          <thead>
            <tr className="bg-brand-gray-darker">
              <th className="px-4 py-3 border-brand-gray-light"></th>
              {membershipPlans.map((membership, index) => (
                <th
                  key={index}
                  colSpan={membership.plans.length}
                  className="px-4 py-3 text-center text-white text-xl font-semibold border border-brand-gray-light"
                >
                  {membership.type}
                </th>
              ))}
            </tr>
            <tr className="bg-brand-gray-darker">
              <th className="px-4 py-3 border-brand-gray-light"></th>
              {subCategories.map((sub, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-center text-white text-lg font-medium border border-brand-gray-light"
                >
                  {sub.category}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {planTypes.map((type, rowIndex) => (
              <tr key={rowIndex} className="border-t border-brand-gray-light">
                <th className="px-4 py-3 text-left text-white font-mulish bg-brand-gray-dark text-xl font-semibold border border-brand-gray-light">
                  {type}
                  {type.toLowerCase() === "5-pass" && (
                    <div className="text-xs text-gray-400 mt-1">
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
                      className="px-4 py-3 text-center text-brand-orange font-bold text-xl border border-brand-gray-light"
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
          <p className="px-4 text-left text-gray-400 font-mulish text-base">
            * CrossFit 1, 3, 6 months & Fitness Classes 1-month = 500 ฿ / month for Gym, Steam & Ice-bath access - NOT valid for Open-gym only.
          </p>
          <p className="px-4 text-left text-gray-400 font-mulish text-base">
            * Membership PAUSE = 1 month: 1, 3-month: 2, 6-month: 3, 12-month: 4. Duration: maximum 3 weeks per time.
          </p>
        </div>
      </div>
    </section>
  );
}

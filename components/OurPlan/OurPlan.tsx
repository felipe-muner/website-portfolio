import { TitleSection } from "@/components/TitleSection";
import { cn } from "@/lib/utils";

const membershipPlans = [
  {
    type: "Gym",
    plans: [
      {
        category: "Gym / Steam / Ice-bath",
        plans: [
          { name: "Drop-in", price: "300 ฿" },
          { name: "5-pass", price: "1,250 ฿" },
          { name: "1-month", price: "1,900 ฿" },
          { name: "3-month", price: "5,100 ฿" },
          { name: "6-month", price: "9,000 ฿" },
          { name: "12-month", price: "16,000 ฿" },
        ],
      },
      {
        category: "Fitness Classes",
        plans: [
          { name: "Drop-in", price: "300 ฿" },
          { name: "5-pass", price: "1,250 ฿" },
          { name: "1-month", price: "2,800 ฿" },
        ],
      },
    ],
  },
  {
    type: "Crossfit",
    plans: [
      {
        category: "Group Training",
        plans: [
          { name: "Drop-in", price: "600 ฿" },
          { name: "5-pass", price: "2,250 ฿" },
          { name: "1-month", price: "4,200 ฿" },
          { name: "3-month", price: "11,400 ฿" },
          { name: "6-month", price: "21,600 ฿" },
        ],
      },
      {
        category: "Open-Gym",
        plans: [
          { name: "Drop-in", price: "450 ฿" },
          { name: "1-month", price: "3,000 ฿" },
        ],
      },
      {
        category: "Group Training + Open-Gym",
        plans: [
          { name: "1-month", price: "5,000 ฿" },
          { name: "3-month", price: "13,500 ฿" },
          { name: "6-month", price: "25,800 ฿" },
        ],
      },
    ],
  },
];

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
              {/* First header row: Group columns by membership type */}
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
              {/* Second header row: Display subcategory names */}
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
                  {/* Row header for the plan type with full border */}
                  <th className="px-4 py-2 text-left text-white font-mulish border border-brand-gray-light bg-brand-gray-dark">
                    {type}
                    {type.toLowerCase() === "5-pass" && (
                      <div className="text-xs text-gray-400">
                        Validity: 1 month - Cannot be shared
                      </div>
                    )}
                  </th>
                  {subCategories.map((sub, colIndex) => {
                    // Find matching plan (case-insensitive)
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
        </div>
      </div>
    </section>
  );
}

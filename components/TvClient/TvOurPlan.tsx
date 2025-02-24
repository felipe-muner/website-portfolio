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

export default function TvOurPlan(props: OurPlanProps) {
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
    <section className={cn("py-16", p.className)}>
      <div className="px-4">
        <h2 className="text-5xl font-bold text-white uppercase text-center mb-10 font-mulish">
          Prices
        </h2>
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
            <p className="px-4 text-left text-gray-400 font-mulish">
              * CrossFit 1, 3, 6 months & Fitness Classes 1-month = 500 ฿ / month for Gym, Steam & Ice-bath access - NOT valid for Open-gym only.
            </p>
            <p className="px-4 text-left text-gray-400 font-mulish">
              * Membership PAUSE = 1 month: 1, 3-month: 2, 6-month: 3, 12-month: 4. Duration: maximum 3 weeks per time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { TitleSection } from "../TitleSection";

const pricingPlans = [
  {
    title: "Class drop-in",
    price: "$39.0",
    subtitle: "SINGLE CLASS",
    features: [
      "Free riding",
      "Unlimited equipments",
      "Personal trainer",
      "Weight losing classes",
      "Month to mouth",
      "No time restriction",
    ],
    icon: "fa-picture-o",
  },
  {
    title: "12 Month unlimited",
    price: "$99.0",
    subtitle: "SINGLE CLASS",
    features: [
      "Free riding",
      "Unlimited equipments",
      "Personal trainer",
      "Weight losing classes",
      "Month to mouth",
      "No time restriction",
    ],
    icon: "fa-picture-o",
  },
  {
    title: "6 Month unlimited",
    price: "$59.0",
    subtitle: "SINGLE CLASS",
    features: [
      "Free riding",
      "Unlimited equipments",
      "Personal trainer",
      "Weight losing classes",
      "Month to mouth",
      "No time restriction",
    ],
    icon: "fa-picture-o",
  },
];

const OurPlan: React.FC = () => {
  return (
    <section className="bg-brand-background-2 py-20 w-full">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <TitleSection
          subtitle="Our Plan"
          title="Choose your pricing plan"
        />

        {/* Pricing Cards */}
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className="bg-transparent border w-full border-brand-gray-dark rounded-lg text-center p-8 transform -skew-y-4 hover:skew-y-0 hover:bg-white transition-all duration-500 relative"
            >
              <h3 className="text-2xl font-semibold text-white mb-4 transform skew-y-4">
                {plan.title}
              </h3>
              <div className="mb-6 transform skew-y-4">
                <h2 className="text-5xl font-bold text-brand-orange">{plan.price}</h2>
                <span className="text-sm font-semibold text-brand-gray-light uppercase">
                  {plan.subtitle}
                </span>
              </div>
              <ul className="mb-8 transform skew-y-4 space-y-2">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="text-sm text-brand-gray-light list-none leading-relaxed hover:text-black hover:font-bold"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="block bg-gray-800 text-white py-3 px-6 rounded transform skew-y-4 hover:bg-brand-orange transition-all"
              >
                Enroll now
              </a>
              <a
                href="#"
                className="absolute text-brand-orange text-4xl left-10 bottom-[120px] opacity-0 invisible transform skew-y-4 transition-all hover:opacity-100 hover:visible"
              >
                <i className={`fa ${plan.icon}`}></i>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurPlan;

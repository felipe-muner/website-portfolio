import React from "react";
import { Bike, Salad, Dumbbell, Heart } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Bike size={40} />,
    title: "Modern equipment",
    description:
      "Access state-of-the-art machines designed to maximize your performance and comfort.",
  },
  {
    icon: <Salad size={40} />,
    title: "Healthy nutrition plan",
    description:
      "Customized meal plans tailored to your goals, ensuring proper balance and nutrition.",
  },
  {
    icon: <Dumbbell size={40} />,
    title: "Professional training plan",
    description:
      "Expert-designed routines to help you achieve results efficiently and safely.",
  },
  {
    icon: <Heart size={40} />,
    title: "Unique to your needs",
    description:
      "Personalized programs created to match your fitness level, goals, and lifestyle.",
  },
];

const FeatureCard: React.FC<Feature> = ({ icon, title, description }) => (
  <div className="group flex flex-col items-center text-center">
    <div className="flex items-center justify-center h-[90px] w-[90px] bg-white/10 rounded-full text-brand-orange transition-all duration-300 group-hover:bg-brand-orange group-hover:text-white">
      {icon}
    </div>
    <h4 className="text-xl font-semibold text-white mt-6 mb-4">
      {title}
    </h4>
    <p className="text-brand-gray-medium transition-colors duration-300 group-hover:text-white">
      {description}
    </p>
  </div>
);

const WhyChooseUs: React.FC = () => {
  return (
    <section className="bg-brand-background-1 pb-[70px] pt-[100px] w-full">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-11">
          <span className="text-brand-orange text-md uppercase font-mulish font-bold">Why choose us?</span>
          <h2 className="text-[32px] font-bold text-white mt-1">PUSH YOUR LIMITS FORWARD</h2>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "equipment" });

export default function Equipment() {
  return (
    <>
      <Breadcrumb route={'Equipment'} isClass />
      <div className="flex flex-col gap-4 items-start justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[800px] font-mulish">
        <h1 className="text-3xl font-semibold mt-4 text-white">Optimize Your Workout with Top-Tier Equipment</h1>
        <p>Train with confidence using our quality and modern equipment, carefully selected to support all fitness levels and training styles. From strength training to functional fitness, we provide everything you need for an effective and well-rounded workout.</p>
        
        <h2 className="text-3xl font-semibold mt-4 text-white">Cardio</h2>
        <ul className="space-y-2 list-disc list-inside text-brand-orange">
          {["Class Cycle", "Eliptical", "Treadmill", "Recumbent Bike", "Seated Cycle", "Seated Rower", "Stairmaster"].map((item) => (
            <li key={item} className="text-brand-gray-medium">{item}</li>
          ))}
        </ul>

        <h2 className="text-3xl font-semibold mt-4 text-white">Resistance Machines</h2>
        <ul className="space-y-2 list-disc list-inside text-brand-orange">
          {["4-Way Resistance", "Adjustable Cable Crossover", "Dual Cable Resistance", "Hip Abductor", "Lat Pulldown", "Leg Extension", "Leg Extension & Curl", "Leg Press", "Non-Pulley Dips", "Pec Fly", "Prone Leg Curl", "Pulley Dip"].map((item, index) => (
            <li key={index} className="text-brand-gray-medium">{item}</li>
          ))}
        </ul>

        <h2 className="text-3xl font-semibold mt-4 text-white">Free Weights</h2>
        <h3 className="text-2xl font-medium mt-2 text-white">Equipment</h3>
        <ul className="space-y-2 list-disc list-inside text-brand-orange">
          {["Back Prone Ab Curl", "Barbell", "Bench Fitness", "Bench Press", "Core Curl", "Core Weight", "EZ Bar", "Flat Bench", "Floor Crunch", "Hip Thrust", "Incline Barbell Bench Press", "Inspire Bench", "Large Squat Rack", "Preacher Curl", "Seated Calf Raise", "Smaller Squat Rack", "Smith Machine", "Unbranded Bench", "Weighted Ab Curl"].map((item) => (
            <li key={item} className="text-brand-gray-medium">{item}</li>
          ))}
        </ul>

        <h3 className="text-2xl font-medium mt-2 text-white">Plates</h3>
        <ul className="space-y-2 list-disc list-inside text-brand-orange">
          {["1.25 Kg", "2.5 Kg", "5 Kg", "10 Kg", "15 Kg", "20 Kg", "25 Kg"].map((item) => (
            <li key={item} className="text-brand-gray-medium">{item}</li>
          ))}
        </ul>

        <h3 className="text-2xl font-medium mt-2 text-white">Dumbbells</h3>
        <ul className="space-y-2 list-disc list-inside text-brand-orange">
          {["2.5 Kg", "5 Kg", "7.5 Kg", "10 Kg", "12.5 Kg", "15 Kg", "17.5 Kg", "20 Kg", "22.5 Kg", "25 Kg", "30 Kg", "32.5 Kg", "35 Kg", "37.5 Kg", "40 Kg", "42.5 Kg", "45 Kg", "47.5 Kg", "50 Kg"].map((item) => (
            <li key={item} className="text-brand-gray-medium">{item}</li>
          ))}
        </ul>

        <h3 className="text-2xl font-medium mt-2 text-white">Kettlebells</h3>
        <ul className="space-y-2 list-disc list-inside text-brand-orange">
          {["4 Kg", "6 Kg", "8 Kg", "10 Kg", "12 Kg"].map((item) => (
            <li key={item} className="text-brand-gray-medium">{item}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

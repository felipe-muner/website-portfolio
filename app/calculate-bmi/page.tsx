import { BMICalculator } from "@/components/BMICalculator";
import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Calulate BMI" });

export default function CalculateBMI() {
  return (
    <>
      <Breadcrumb route={'BMI calculator'} />
      <BMICalculator />
    </>
  );
}

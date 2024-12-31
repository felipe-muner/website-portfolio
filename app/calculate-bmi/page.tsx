import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Calulate BMI" });

export default function CalculateBMI() {
  return (
    <main className="flex flex-col">
      <Breadcrumb route={'BMI calculator'} />
    </main>
  );
}

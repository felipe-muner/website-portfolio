import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Protein Bar and Shop" });
export default function ProteinBarAndShop() {
  return (
    <>
      <Breadcrumb route={'Protein bar and Shop'} isClass />
    </>
  );
}

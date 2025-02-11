import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "equipment" });
export default function Equipment() {
  return (
    <>
      <Breadcrumb route={'Equipment'} isClass />      
    </>
  );
}

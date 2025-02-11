import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Namwan" });
export default function Namwan() {
  return (
    <>
      <Breadcrumb route={'Namwan'} />      
    </>
  );
}

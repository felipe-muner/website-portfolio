import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "overview" });
export default function Overview() {
  return (
    <>
      <Breadcrumb route={'Overview'} isClass />      
    </>
  );
}

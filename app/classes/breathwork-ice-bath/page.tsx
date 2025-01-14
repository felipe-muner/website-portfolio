import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Breathwork Ice Bath" });
export default function BreathworkIceBath() {
  return (
    <>
      <Breadcrumb route={'Breathwork & Ice Bath'} isClass />
    </>
  );
}

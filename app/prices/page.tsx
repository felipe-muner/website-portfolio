import { Breadcrumb } from "@/components/Breadcrumb";
import { OurPlan } from "@/components/OurPlan";
import { TitleSection } from "@/components/TitleSection";
import { WhatWeDo } from "@/components/WhatWeDo";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Prices" });


export default function Prices() {
  return (
    <>
      <Breadcrumb route={'Prices'} />
      <TitleSection title="PUSH YOUR LIMITS FORWARD" subtitle="What we do?" className="mt-24" />
      <WhatWeDo />
      <OurPlan />
    </>
  );
}

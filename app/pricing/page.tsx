import { Breadcrumb } from "@/components/Breadcrumb";
import { OurPlan } from "@/components/OurPlan";
import { TitleSection } from "@/components/TitleSection";
import { WhatWeDo } from "@/components/WhatWeDo";

export default function Pricing() {
  return (
    <main className="flex flex-col">
      <Breadcrumb route={'Pricing'} />
      <TitleSection title="PUSH YOUR LIMITS FORWARD" subtitle="What we do?" className="mt-24" />
      <WhatWeDo />
      <OurPlan />      
    </main>
  );
}

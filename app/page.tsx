import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { OurClasses } from "@/components/OurClasses";
import { OurPlan } from "@/components/OurPlan";
import { OurTeam } from "@/components/OurTeam";
import { Registration } from "@/components/Registration";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Home" });

export default function Home() {
  return (
    <main className="flex flex-col row-start-2 items-center sm:items-start">
      <Hero />
      <WhyChooseUs />
      <OurClasses />
      <Registration lead="registration now to get more deals" sublead="Where health, beauty and fitness meet" />
      <OurPlan />
      <Gallery />
      <OurTeam />
    </main>
  );
}

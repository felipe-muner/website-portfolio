import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { OurClasses } from "@/components/OurClasses";
import { OurPlan } from "@/components/OurPlan";
import { OurTeam } from "@/components/OurTeam";
import { Registration } from "@/components/Registration";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { getMetadata } from "@/lib/utils";
import { FadeInOnScroll } from "@/components/FadeInOnScroll";

export const metadata = getMetadata({ routeName: "Home" });

export default function Home() {
  return (
    <>
      <FadeInOnScroll>
        <Hero />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <WhyChooseUs />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <OurClasses />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <Registration
          lead="registration now to get more deals"
          sublead="Where health, beauty and fitness meet"
        />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <OurPlan />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <Gallery />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <OurTeam />
      </FadeInOnScroll>
    </>
  );
}

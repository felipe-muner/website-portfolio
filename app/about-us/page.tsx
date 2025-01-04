import { Breadcrumb } from "@/components/Breadcrumb";
import { OurTeam } from "@/components/OurTeam";
import { Registration } from "@/components/Registration";
import { Testimonial } from "@/components/Testimonial";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "About Us" });

export default function AboutUs() {
  return (
    <>
      <Breadcrumb route={'About Us'} />
      <WhyChooseUs />
      <OurTeam />
      <Registration lead="registration now to get more deals" sublead="Where health, beauty, and fitness meet" />
      <Testimonial />
    </>
  );
}

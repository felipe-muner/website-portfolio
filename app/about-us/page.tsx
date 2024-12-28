import { Breadcrumb } from "@/components/Breadcrumb";
import { OurTeam } from "@/components/OurTeam";
import { Registration } from "@/components/Registration";
import { Testimonial } from "@/components/Testimonial";
import { WhyChooseUs } from "@/components/WhyChooseUs";

export default function AboutUs() {
  return (
    <main className="flex flex-col">
      <Breadcrumb route={'About Us'} />
      <WhyChooseUs />
      <OurTeam />
      <Registration lead="registration now to get more deals" sublead="Where health, beauty, and fitness meet" />
      <Testimonial />
    </main>
  );
}

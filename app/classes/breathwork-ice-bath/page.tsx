import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Breathwork Ice Bath" });
export default function BreathworkIceBath() {
  return (
    <>
      <Breadcrumb route={'Breathwork & Ice Bath'} isClass />
      <div className="flex flex-col gap-4 items-center justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[700px] font-mulish">
        <p>Looking to take your fitness to the next level?</p>

        <p>Join our high-energy HIIT class and crush your goals in just 60 minutes!</p>

        <p className="text-center">Whether you’re aiming to build strength, burn fat, or boost endurance, our High-Intensity Interval Training is designed for maximum results in minimal time. It’s the perfect challenge for anyone looking to push their limits and leave each session feeling stronger and more energised.</p>

        <p>Get ready to sweat, torch calories, and feel amazing!</p>

        <p>All fitness levels welcome.</p>
      </div>
    </>
  );
}

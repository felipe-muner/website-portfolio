import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Tabata" });
export default function BreathworkIceBath() {
  return (
    <>
      <Breadcrumb route={'Tabata'} isClass />
      <div className="flex flex-col gap-4 items-center justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[700px] font-mulish">
        <h1 className="text-2xl font-bold text-center">Tabata</h1>
        <p className="text-center">
          Tabata is a high-intensity interval training (HIIT) workout that consists of 20 seconds of intense exercise followed by 10 seconds of rest, repeated for a total of 4 minutes. This type of workout is designed to burn fat, build muscle, and improve cardiovascular fitness in a short amount of time. Tabata is a great way to increase your metabolism, boost your endurance, and take your fitness to the next level.
        </p>
      </div>
    </>
  );
}

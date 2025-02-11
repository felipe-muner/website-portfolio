import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Hyrox" });
export default function Hyrox() {
  return (
    <>
      <Breadcrumb route={'Hyrox'} isClass />
      <div className="flex flex-col gap-4 items-center justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[700px] font-mulish">
        <h1 className="text-2xl font-bold text-center">Hyrox</h1>
        <p className="text-center">
          Hyrox is a high-intensity functional fitness competition that combines running with functional exercises in a timed workout. This event is designed to test your strength, endurance, and mental toughness while pushing you to your limits. Hyrox is a great way to challenge yourself, improve your fitness, and connect with other athletes in a fun and supportive environment.
        </p>
      </div>
    </>
  );
}

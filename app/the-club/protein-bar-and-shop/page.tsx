import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Protein Bar and Shop" });

export default function ProteinBarAndShop() {
  return (
    <>
      <Breadcrumb route={'Protein Bar and Shop'} isClass />
      <div className="flex flex-col gap-4 items-start justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[800px] font-mulish">
        <h1 className="text-3xl font-semibold mt-4 text-white">Refuel & Recover</h1>
        <p>Elevate your fitness experience at our <strong className="text-white">bar and shop</strong>, where <strong className="text-white">health meets convenience</strong>. Enjoy <strong className="text-white">nutritious protein and vegan shakes</strong> to keep you fuelled and ready <strong className="text-white">before or after your workout</strong>.</p>
        
        <p>Looking to stock up? Our shop offers <strong className="text-white">bulk protein and a variety of supplements</strong> to support your fitness journey. <strong className="text-white">Stay strong, stay nourished!</strong></p>
      </div>
    </>
  );
}

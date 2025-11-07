import { Breadcrumb } from "@/components/Breadcrumb";
import { GymmoAppDownload } from "@/components/GymmoAppDownload";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Reformer Pilates" });

export default function ReformerPilates() {
  return (
    <>
      <Breadcrumb route={'Reformer Pilates'} />
      <div className="flex flex-col gap-4 items-start justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[700px] font-mulish">
        <h1 className="text-3xl font-semibold text-white text-left">Reformer Pilates</h1>

        <h2 className="text-2xl font-semibold mt-4 text-white">Description</h2>
        <p>Experience a dynamic full-body workout that strengthens, tones, and realigns your body using the Pilates Reformer machine. This class focuses on core stability, posture, and mindful movement, combining resistance and control for balanced strength and flexibility.</p>

        <p>Whether you&apos;re new to Pilates or experienced, our instructors will guide you through precise movements that improve coordination, mobility, and body awareness. The Reformer adds a unique level of support and challenge, helping you move with greater ease both inside and outside the studio.</p>

        <p>Perfect for anyone looking to sculpt lean muscles, relieve tension, and restore balance in a calm yet energizing environment.</p>

        <GymmoAppDownload />
      </div>
    </>
  );
}

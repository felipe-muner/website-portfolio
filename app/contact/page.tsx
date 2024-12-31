import { Breadcrumb } from "@/components/Breadcrumb";
import { GetInTouch } from "@/components/GetInTouch";
import { GoogleMapEmbed } from "@/components/GoogleMapEmbed";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Contact" });

export default function Contact() {
  return (
    <main className="flex flex-col">
      <Breadcrumb route={'Contact'} />
      <GetInTouch />
      <GoogleMapEmbed />
    </main>
  );
}

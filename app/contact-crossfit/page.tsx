import { Breadcrumb } from "@/components/Breadcrumb";
import { GetInTouch } from "@/components/GetInTouch";
import { GoogleMapEmbed } from "@/components/GoogleMapEmbed";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Contact CrossFit" });

export default function ContactCrossFit() {
  return (
    <>
      <Breadcrumb route={'Contact CrossFit'} />
      <GetInTouch />
      <GoogleMapEmbed />
    </>
  );
}

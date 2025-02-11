import { Breadcrumb } from "@/components/Breadcrumb";
import { GetInTouch } from "@/components/GetInTouch";
import { GoogleMapEmbed } from "@/components/GoogleMapEmbed";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Contact GYM" });

export default function ContactGYM() {
  return (
    <>
      <Breadcrumb route={'Contact GYM'} />
      <GetInTouch />
      <GoogleMapEmbed />
    </>
  );
}

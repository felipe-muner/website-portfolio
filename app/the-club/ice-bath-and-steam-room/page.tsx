import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Ice Bath And Steam Room" });
export default function IceBathAndSteamRoom() {
  return (
    <>
      <Breadcrumb route={'Ice Bath And Steam Room'} isClass />
    </>
  );
}

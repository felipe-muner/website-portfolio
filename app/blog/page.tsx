import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Blog" });

export default function Blog() {
  return (
    <main className="flex flex-col">
      <Breadcrumb route={'Blog'} />      
    </main>
  );
}

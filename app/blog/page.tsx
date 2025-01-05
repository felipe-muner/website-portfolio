import { BlogList } from "@/components/Blog";
import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";

export const metadata = getMetadata({ routeName: "Blog" });

export default function Blog() {
  return (
    <>
      <Breadcrumb route={'Blog'} />
      <BlogList />
    </>
  );
}

import { redirect } from "next/navigation";

// The root of this repo is the website-template portfolio.
export default function Home() {
  redirect("/portfolio");
}

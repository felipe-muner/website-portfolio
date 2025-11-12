import { Breadcrumb } from "@/components/Breadcrumb";
import { getMetadata } from "@/lib/utils";
import { Check } from "lucide-react";
import Link from "next/link";

export const metadata = getMetadata({ routeName: "hiit" });

export default function Hiit() {
  return (
    <>
      <Breadcrumb route={'HIIT'} isClass />
      <div className="flex flex-col gap-4 items-start justify-center p-4 my-20 text-brand-gray-medium container mx-auto max-w-[700px] font-mulish">
        <h1 className="text-3xl font-semibold text-white text-left">High-Intensity Interval Training with <Link href="/coaches-trainers/steve" className="text-brand-orange hover:underline">Steve</Link></h1>
        <p>This class designed to boost your fitness level, burn calories, and increase strength in a short amount of time.</p>

        <p>This fast-paced workout combines bursts of intense exercises with short recovery periods, ensuring a full-body workout that will leave you feeling energized.</p>

        <p>Whether you&apos;re a beginner or an experienced athlete, our HIIT class is scalable to meet your fitness needs, making it perfect for anyone looking to challenge themselves.</p>

        <p className="font-semibold text-white">Get ready to sweat, push your limits, and have fun!</p>
      </div>
    </>
  );
}

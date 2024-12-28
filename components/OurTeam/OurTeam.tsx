"use client"

import React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { TitleSection } from "../TitleSection"
import { Cta } from "../Cta"

type TeamMember = {
  name: string
  role: string
  image: string
}

export default function OurTeam() {
  // Replace these with your actual images/names if needed
  const team: TeamMember[] = [
    { name: "Athart Rachel", role: "Gym Trainer", image: "/img/team/team-1.jpg" },
    { name: "Athart Rachel", role: "Gym Trainer", image: "/img/team/team-2.jpg" },
    { name: "Athart Rachel", role: "Gym Trainer", image: "/img/team/team-3.jpg" },
    { name: "Athart Rachel", role: "Gym Trainer", image: "/img/team/team-4.jpg" },
    { name: "Athart Rachel", role: "Gym Trainer", image: "/img/team/team-5.jpg" },
    { name: "Athart Rachel", role: "Gym Trainer", image: "/img/team/team-6.jpg" },
  ]

  return (
    <section className="bg-brand-background-2 py-16 w-full">
      <div className="container w-full mx-auto px-4">
        {/* Top row: Title + Button */}
        <div className="flex justify-between items-start mb-8">
          <TitleSection title="Our Team" subtitle="Train with experts" className="text-left mb-0" />
          <Cta href="#" label="appoitment" className="mt-2" />
        </div>
      </div>
    </section>
  )
}

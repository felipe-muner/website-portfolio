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
import { Card, CardContent } from "../ui/card"

type TeamMember = {
  name: string
  role: string
  image: string
}

export default function OurTeam() {
  // Your real images, names, and roles
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
      <div className="container w-full mx-auto px-4 flex flex-col">
        {/* Top row: Title + Button */}
        <div className="flex justify-between items-start mb-8">
          <TitleSection title="Our Team" subtitle="Train with experts" className="text-left mb-0" />
          <Cta href="#" label="appoitment" className="mt-2" />
        </div>

        {/* Carousel Container */}
        <div>
          <Carousel
            // Adjust Embla options as needed:
            opts={{
              loop: true,
              align: "start", // Ensure slides start left-aligned
            }}
          >
            {/* Slides Wrapper */}
            <CarouselContent className="flex gap-4 w-full">
              {team.map((member, index) => (
                <CarouselItem
                  key={index}
                  // 1 slide on small screens, 2 on md, 3 on lg
                  className="w-full md:basis-1/2 lg:basis-1/3"
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw,
                               (max-width: 1200px) 50vw,
                               33vw"
                  className="object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Previous & Next buttons */}
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  )
}

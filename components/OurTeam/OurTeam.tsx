"use client"

import React from "react"
import Image from "next/image"
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
  const team: TeamMember[] = [
    { name: "Athart Rachel", role: "Gym Trainer", image: "/img/team/team-1.jpg" },
    { name: "John Doe", role: "Yoga Instructor", image: "/img/team/team-2.jpg" },
    { name: "Jane Smith", role: "Dietitian", image: "/img/team/team-3.jpg" },
    { name: "Mark Johnson", role: "Strength Coach", image: "/img/team/team-4.jpg" },
    { name: "Sophia Lee", role: "Personal Trainer", image: "/img/team/team-5.jpg" },
    { name: "Chris Brown", role: "Cardio Specialist", image: "/img/team/team-6.jpg" },
  ]

  return (
    <section className="bg-brand-background-2 py-16 w-full">
      <div className="container w-full mx-auto px-4 flex flex-col">
        {/* Top row: Title + Button */}
        <div className="flex justify-between items-start mb-8">
          <TitleSection title="Our Team" subtitle="Train with experts" className="text-left mb-0" />
          <Cta href="#" label="appointment" className="mt-2" />
        </div>

        {/* Carousel Container */}
        <Carousel className="w-full text-white" opts={{ loop: true }}>
          <CarouselContent className="-ml-1">
            {team.map((member, index) => (
              <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
                <div className="bg-white rounded-lg shadow p-4">
                  <Image
                    src={member.image}
                    alt={`${member.name} - ${member.role}`}
                    width={200}
                    height={200}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <div className="mt-4 text-center">
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-gray-500">{member.role}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  )
}

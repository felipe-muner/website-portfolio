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
    <section className="bg-[#151515] py-16 w-full">
      <div className="container w-full mx-auto px-4 flex flex-col">
        {/* Top row: Title + Button */}
        <div className="flex justify-between items-start mb-8">
          <TitleSection title="Our Team" subtitle="Train with experts" className="text-left mb-0" />
          <Cta href="#" label="appointment" className="mt-2" />
        </div>

        {/* Carousel Container */}
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-7">
            {team.map((member, index) => (
              <CarouselItem
                key={index}
                className="w-full md:basis-1/2 lg:basis-1/3 relative pl-6"
              >
                {/* Team Member Image */}
                <div className="relative w-full h-[450px] overflow-hidden group">
                  <Image
                    src={member.image}
                    alt={`${member.name} - ${member.role}`}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute bottom-[-250px] left-0 w-full bg-[#0a0a0a] border-t-4 border-[#464646] skew-y-[-5deg] transition-all duration-300 group-hover:-bottom-10 group-hover:pb-10">
                    <div className="text-center p-6 skew-y-[5deg]">
                      <h4 className="text-white font-semibold text-2xl mb-1">{member.name}</h4>
                      <span className="text-gray-400 uppercase text-xs font-bold font-mulish">
                        {member.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Animated Text Box */}
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

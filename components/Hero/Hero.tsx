"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Cta } from "../Cta"

const slides = [
  {
    src: "/img/hero/hero-1.jpg",
    alt: "Hero Slide 1",
    span: "Shape your body",
    heading: (
      <>
        Be <strong>strong</strong> training hard
      </>
    ),
    linkHref: "#",
    linkLabel: "Get info",
  },
  {
    src: "/img/hero/hero-2.jpg",
    alt: "Hero Slide 2",
    span: "Shape your body",
    heading: (
      <>
        Be <strong>strong</strong> training hard
      </>
    ),
    linkHref: "#",
    linkLabel: "Get info",
  },
]

export default function Hero() {
  return (
    <Carousel className="relative w-full">
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index} className="relative">
            <div className="relative w-full aspect-[3/4] md:aspect-[16/9]">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4">
                  <div className="grid grid-cols-12">
                    <div className="hidden lg:block lg:col-span-6" />
                    <div className="col-span-12 lg:col-span-6">
                      <div className="hi-text text-white">
                        <span className="block text-lg uppercase font-bold mb-[18px] font-mulish tracking-[6px]">
                          {slide.span}
                        </span>
                        <h1 className="text-4xl font-bold uppercase mb-10 leading-[1.2] text-[48px] md:text-[80px]">
                          {slide.heading}
                        </h1>
                        <Cta
                          href={slide.linkHref}
                          label={slide.linkLabel}
                          className="bg-brand-orange"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* No hover color changes — force with !important */}
      <CarouselPrevious
        className="
          absolute 
          left-6 
          top-1/2 
          -translate-y-1/2
          ml-4 
          w-12 
          h-12 
          flex 
          items-center 
          justify-center
          rounded-none
          border-none
          bg-white/10
          text-[#a9a9a9]
          hover:bg-white/10
          hover:text-[#a9a9a9]
        "
      >
        <ChevronLeft className="w-6 h-6" />
      </CarouselPrevious>
      <CarouselNext
        className="
          absolute 
          right-6 
          top-1/2 
          -translate-y-1/2
          ml-4 
          w-12 
          h-12 
          flex 
          items-center 
          justify-center
          // rounded-none
          // border-none
          bg-white/10
          text-[#a9a9a9]
          hover:bg-white/10
          hover:text-[#a9a9a9]
        "
      >
        <ChevronRight className="w-6 h-6" />
      </CarouselNext>
    </Carousel>
  )
}

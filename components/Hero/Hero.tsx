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
        Be <strong className="text-brand-orange">strong</strong> training hard
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
        Be <strong className="text-brand-orange">strong</strong> training hard
      </>
    ),
    linkHref: "#",
    linkLabel: "Get info",
  },
]

export default function Hero() {
  return (
    <Carousel className="relative w-full" opts={{ loop: true }}>
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={slide.src} className="relative">
            <div className="relative w-full aspect-[3/4] md:aspect-[6/4]">
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
                        {/* Animate from bottom with a slight delay */}
                        <span
                          className="
                            block 
                            text-lg 
                            uppercase 
                            font-bold 
                            mb-[18px] 
                            font-mulish 
                            tracking-[6px]
                            animate-fade-up-delay-100
                          "
                        >
                          {slide.span}
                        </span>

                        <h1
                          className="
                            text-4xl 
                            font-bold 
                            uppercase 
                            mb-10 
                            leading-[1.2] 
                            text-[48px] 
                            md:text-[80px]
                            animate-fade-up-delay-250
                          "
                        >
                          {slide.heading}
                        </h1>

                        <div className="animate-fade-up-delay-500">
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
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="rounded-none border-none w-12 h-12 flex items-center justify-center bg-gray-800/40 text-white left-0">
        <ChevronLeft className="w-6 h-6" />
      </CarouselPrevious>
      <CarouselNext className="rounded-none border-none w-12 h-12 flex items-center justify-center bg-gray-800/40 text-white right-0">
        <ChevronRight className="w-6 h-6" />
      </CarouselNext>
    </Carousel>
  )
}

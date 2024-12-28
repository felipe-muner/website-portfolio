"use client"

import * as React from "react"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

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
    <Carousel className="w-full">
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index} className="relative">
            {/* Keep a fixed aspect ratio for each slide */}
            <div className="relative w-full aspect-[3/4] md:aspect-[16/9]">
              {/* Background Image */}
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
                priority={index === 0}
              />

              {/* Text Overlay */}
              <div className="absolute inset-0 flex items-center">
                {/* Container + offset-lg-6 analog */}
                <div className="container mx-auto px-4">
                  <div className="grid grid-cols-12">
                    {/* Leave half the grid empty on lg screens (offset) */}
                    <div className="hidden lg:block lg:col-span-6" />
                    <div className="col-span-12 lg:col-span-6">
                      <div className="hi-text text-white">
                        <span className="block text-lg uppercase font-bold mb-[18px] font-mulish tracking-[6px]">
                          {slide.span}
                        </span>
                        <h1 className="text-4xl font-bold uppercase mb-10 leading-[1.2] text-[48px] md:text-[80px]">
                          {slide.heading}
                        </h1>
                        <a
                          href={slide.linkHref}
                          className="primary-btn inline-block px-6 py-2 bg-brand-orange text-white font-semibold uppercase"
                        >
                          {slide.linkLabel}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Navigation arrows */}
      <CarouselPrevious className="left-6" />
      <CarouselNext className="right-6" />
    </Carousel>
  )
}

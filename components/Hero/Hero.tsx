"use client"

import * as React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
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
  },
  {
    src: "/img/hero/hero-2.jpg",
    alt: "Hero Slide 2",
  },
]

export default function Hero() {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index}>
            <div>
              <Card className="border-0">
                <CardContent className="flex aspect-[16/9] items-center justify-center p-0">
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    width={1280}
                    height={720}
                    className="object-cover w-full h-full"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  )
}

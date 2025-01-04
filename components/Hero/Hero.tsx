"use client"

import * as React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
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

const animationVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: custom, ease: "easeOut" },
  }),
}

export default function Hero() {
  const [api, setApi] = React.useState<CarouselApi | null>(null)
  const [activeSlide, setActiveSlide] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    // Update active slide on initialization
    setActiveSlide(api.selectedScrollSnap())

    // Listen to slide changes
    const handleSelect = () => {
      setActiveSlide(api.selectedScrollSnap())
    }

    api.on("select", handleSelect)

    // Cleanup listener on unmount
    return () => {
      api.off("select", handleSelect)
    }
  }, [api])

  return (
    <Carousel
      className="relative w-full"
      setApi={setApi}
      opts={{ loop: true }}
      plugins={[
        Autoplay({
          delay: 4000,
          stopOnInteraction: false,
          stopOnMouseEnter: false
        }),
      ]}
    >
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
                      {activeSlide === index && (
                        <div className="text-white">
                          <motion.span
                            key={`span-${activeSlide}`}
                            className="
                              block 
                              text-lg 
                              uppercase 
                              font-bold 
                              mb-[18px] 
                              font-mulish 
                              tracking-[6px]
                            "
                            initial="hidden"
                            animate="visible"
                            custom={0.2} // Delay for span
                            variants={animationVariants}
                          >
                            {slide.span}
                          </motion.span>

                          <motion.h1
                            key={`heading-${activeSlide}`}
                            className="
                              text-4xl 
                              font-bold 
                              uppercase 
                              mb-10 
                              leading-[1.2] 
                              text-[48px] 
                              md:text-[80px]
                            "
                            initial="hidden"
                            animate="visible"
                            custom={0.4} // Delay for heading
                            variants={animationVariants}
                          >
                            {slide.heading}
                          </motion.h1>

                          <motion.div
                            key={`cta-${activeSlide}`}
                            initial="hidden"
                            animate="visible"
                            custom={0.6} // Delay for Cta button
                            variants={animationVariants}
                          >
                            <Cta
                              href={slide.linkHref}
                              label={slide.linkLabel}
                              className="bg-brand-orange"
                            />
                          </motion.div>
                        </div>
                      )}
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

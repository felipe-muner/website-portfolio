"use client"

import React from "react";
import { TitleSection } from "../TitleSection";
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image";

// Your real testimonials array
const testimonials = [
  { src: "/img/testimonial/testimonial-1.jpg", alt: "Testimonial 1" },
  { src: "/img/testimonial/testimonial-2.jpg", alt: "Testimonial 2" },
];

const Testimonial: React.FC = () => {
  return (
    <section className="bg-brand-background-2 py-20 w-full">
      {/* Container to control overall width if desired */}
      <div className="container mx-auto">
        <TitleSection subtitle="Testimonial" title="Our client say" />

        {/* Wrapper to center the carousel */}
        <div className="flex justify-center w-full">
          <Carousel className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="w-full">
                  <Card className="bg-transparent border-none">
                    <CardContent className="flex items-center justify-center p-6">
                      {/* Here’s the image instead of the number */}
                      <span className="text-white">
                        {index + 1}
                        </span>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;

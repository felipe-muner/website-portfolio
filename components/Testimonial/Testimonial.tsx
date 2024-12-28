"use client";

import React from "react";
import { TitleSection } from "../TitleSection";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  src: string;
  alt: string;
  text: string;
  name: string;
  stars: number;
}

const testimonials: Array<Testimonial> = [
  {
    src: "/img/testimonial/testimonial-1.jpg",
    alt: "Sarah Johnson",
    text: "I love everything about this gym. The trainers push me to be better every day, and I’ve seen amazing results already! The facilities are top-notch, and the community is incredibly supportive. Whether you're just starting out or looking to reach new fitness goals, this gym has everything you need to succeed.",
    name: "Sarah Johnson",
    stars: 5,
  },
  {
    src: "/img/testimonial/testimonial-2.jpg",
    alt: "Michael Roberts",
    text: "Clean, friendly, and motivating environment. Whether you’re new or advanced, you’ll find the support you need here. The variety of classes offered keeps my workouts interesting, and the staff always go above and beyond to ensure I have everything I need. Highly recommend to anyone looking to improve their fitness journey.",
    name: "Michael Roberts",
    stars: 5,
  },
];

const Testimonial: React.FC = () => {
  return (
    <section className="bg-brand-background-2 py-20 w-full">
      <div className="container mx-auto px-4">
        <TitleSection subtitle="Testimonial" title="Our Clients Say" />
        <div className="flex justify-center w-full mt-10">
          <Carousel className="w-full max-w-4xl" opts={{ loop: true }}>
            <CarouselContent className="flex gap-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="w-full">
                  <Card className="bg-transparent border-none">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      {/* Image */}
                      <div className="relative mb-5">
                        <Image
                          src={testimonial.src}
                          alt={testimonial.alt}
                          width={200}
                          height={200}
                          className="object-cover rounded-full"
                        />
                      </div>

                      {/* Testimonial Text */}
                      <div className="font-mulish text-center mb-4 w-4/5">
                        <p className="text-sm text-white leading-6">
                          {testimonial.text}
                        </p>
                      </div>

                      {/* Customer Name */}
                      <div className="text-lg font-semibold text-white mb-2">
                        <p className="uppercase">{testimonial.name}</p>
                      </div>

                      {/* Star Ratings */}
                      <div className="flex space-x-1">
                        {Array.from({ length: testimonial.stars }).map((_, i) => (
                          <Star key={i} className="text-[#FFD700]" fill="currentColor" size={12} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Carousel Navigation */}
            <CarouselPrevious className="rounded-none border-none w-12 h-12 flex items-center justify-center bg-gray-800 text-white">
              <ChevronLeft className="w-6 h-6" />
            </CarouselPrevious>
            <CarouselNext className="rounded-none border-none w-12 h-12 flex items-center justify-center bg-gray-800 text-white">
              <ChevronRight className="w-6 h-6" />
            </CarouselNext>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;

import { ChevronRight } from "lucide-react";
import React from "react";
import Image from "next/image";
import { TitleSection } from "../TitleSection";

const classes = [
  {
    img: "/img/classes/class-1.jpg",
    category: "STRENGTH",
    title: "Weightlifting",
  },
  {
    img: "/img/classes/class-2.jpg",
    category: "Cardio",
    title: "Indoor cycling",
  },
  {
    img: "/img/classes/class-3.jpg",
    category: "STRENGTH",
    title: "Kettlebell power",
  },
  {
    img: "/img/classes/class-4.jpg",
    category: "Cardio",
    title: "Indoor cycling",
  },
  {
    img: "/img/classes/class-5.jpg",
    category: "Training",
    title: "Boxing",
  },
];

const OurClasses: React.FC = () => {
  return (
    <section className="bg-brand-background-2 py-20 w-full">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <TitleSection
          subtitle="Our Classes"
          title="WHAT WE CAN OFFER"
        />
        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {classes.map((classItem, index) => (
            <div
              key={index}
              className="relative bg-brand-background-1 rounded-lg shadow-lg overflow-hidden"
            >
              {/* Image */}
              <div className="relative w-full h-56">
                <Image
                  src={classItem.img}
                  alt={classItem.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>

              {/* Text Content */}
              <div className="relative p-6 text-white bg-brand-background-1">
                {/* Diagonal Background */}
                <div className="absolute -top-7 -left-1 w-[600px] h-[60px] bg-[rgb(10,10,10)] border-t-4 border-brand-gray-darkest rotate-[-5deg] z-0"></div>

                {/* Text Content */}
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <span className="text-brand-orange text-xs font-semibold uppercase font-mulish">
                      {classItem.category}
                    </span>
                    <h5 className="text-xl font-bold uppercase mt-2">{classItem.title}</h5>
                  </div>
                  <a
                    href="#"
                    className="ml-4 w-12 h-12 flex items-center justify-center bg-[rgba(255,255,255,0.1)] hover:bg-brand-orange transition-colors duration-300"
                  >
                    <ChevronRight className="text-white w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurClasses;

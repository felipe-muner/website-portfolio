import React from "react";
import Image from "next/image";

const services = [
  {
    image: "/img/services/services-1.jpg",
    title: "Personal training",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ut dolore facilisis.",
  },
  {
    image: "/img/services/services-2.jpg",
    title: "Group fitness classes",
    description: "Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus.",
  },
  {
    image: "/img/services/services-3.jpg",
    title: "Strength training",
    description: "Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus.",
  },
  {
    image: "/img/services/services-4.jpg",
    title: "Body building",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ut dolore facilisis.",
  },
];

const WhatWeDo: React.FC = () => {
  return (
    <section className="bg-brand-background-2 pt-12 pb-36">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
          {services.map((service, index) => (
            <div
              key={index}
              className={`flex ${index === 2 || index === 3 ? "md:flex-row-reverse" : "md:flex-row"} flex-col items-center`}
            >
              <div className="overflow-hidden h-64 w-full md:w-1/2 relative">
                <Image
                  src={service.image}
                  alt={service.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                />
              </div>
              <div className="group bg-[#252525] p-6 text-white relative h-64 w-full md:w-1/2 flex flex-col justify-evenly">
                <h4 className="text-lg font-semibold mb-2">{service.title}</h4>
                <p className="text-sm mb-4 text-brand-gray-light font-mulish">
                  {service.description}
                </p>
                <a
                  href="#"
                  className="text-sm font-bold uppercase text-white group-hover:text-brand-orange transition"
                >
                  Explore
                </a>
                <div
                  className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 bg-[#252525] rotate-45 ${index === 2 || index === 3 ? "-right-2" : index === 0 ? "-left-2" : index % 2 === 0 ? "-right-2" : "-left-2"}`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;

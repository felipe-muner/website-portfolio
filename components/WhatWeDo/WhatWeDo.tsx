import React from "react"

const services = [
  {
    image: "img/services/services-1.jpg",
    title: "Personal training",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ut dolore facilisis.",
  },
  {
    image: "img/services/services-2.jpg",
    title: "Group fitness classes",
    description: "Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus.",
  },
  {
    image: "img/services/services-3.jpg",
    title: "Strength training",
    description: "Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus.",
  },
  {
    image: "img/services/services-4.jpg",
    title: "Body building",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ut dolore facilisis.",
  },
];


const WhatWeDo: React.FC = () => {
  return (
    <section className="bg-brand-background-2 py-12">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <span className="text-brand-orange text-sm uppercase tracking-widest">What we do?</span>
          <h2 className="text-white text-3xl font-bold">PUSH YOUR LIMITS FORWARD</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <div key={index} className="flex flex-col items-stretch">
              <div className="overflow-hidden h-64 w-full">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className={`bg-brand-background-1 p-6 text-white relative h-64 w-full flex flex-col justify-between`}>
                <h4 className="text-lg font-semibold mb-2">{service.title}</h4>
                <p className="text-sm mb-4 text-brand-gray-light">
                  {service.description}
                </p>
                <a
                  href="#"
                  className="text-sm font-bold uppercase text-white hover:text-brand-orange transition"
                >
                  Explore
                </a>
                <div
                  className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 bg-brand-background-1 rotate-45 ${index % 2 === 0 ? "-right-2" : "-left-2"
                    }`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhatWeDo;
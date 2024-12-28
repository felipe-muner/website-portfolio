"use client"

import React from "react"
import { TitleSection } from "../TitleSection"

export default function OurPlan() {
  const plans = [
    {
      title: "Class drop-in",
      price: "$39.0",
      label: "Single Class",
      features: [
        "Free riding",
        "Unlimited equipments",
        "Personal trainer",
        "Weight losing classes",
        "Month to mouth",
        "No time restriction",
      ],
    },
    {
      title: "12 Month unlimited",
      price: "$99.0",
      label: "Single Class",
      features: [
        "Free riding",
        "Unlimited equipments",
        "Personal trainer",
        "Weight losing classes",
        "Month to mouth",
        "No time restriction",
      ],
    },
    {
      title: "6 Month unlimited",
      price: "$59.0",
      label: "Single Class",
      features: [
        "Free riding",
        "Unlimited equipments",
        "Personal trainer",
        "Weight losing classes",
        "Month to mouth",
        "No time restriction",
      ],
    },
  ]

  return (
    <section className="bg-brand-background-2 py-16 w-full">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-14">
          <TitleSection subtitle="Our Plans" title="Choose your pricing plan" />
        </div>

        {/* Pricing cards */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3 justify-items-center">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`
                w-full
                relative 
                border border-brand-gray-darkest
                text-center 
                p-10
                transition-all 
                duration-500
                hover:bg-white 
                hover:border-white 
                group
              `}
              style={{ transform: "skewY(-4deg)" }} // Outer skew
            >
              {/* Title */}
              <h3
                className="text-[28px] font-semibold mb-4 text-white transition-colors duration-500 group-hover:text-brand-black"
                style={{ transform: "skewY(4deg)" }} // Opposite skew for content
              >
                {plan.title}
              </h3>

              {/* Price + Label */}
              <div
                className="mb-6"
                style={{ transform: "skewY(4deg)" }}
              >
                <h2 className="text-[48px] md:text-[60px] text-brand-orange font-semibold leading-none">
                  {plan.price}
                </h2>
                <span className="block text-base font-bold uppercase text-brand-gray-light font-mulish group-hover:text-[#444]">
                  {plan.label}
                </span>
              </div>

              {/* Features */}
              <ul
                className="mb-8"
                style={{ transform: "skewY(4deg)" }}
              >
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="text-sm leading-8 text-brand-gray-light transition-colors duration-300 group-hover:text-brand-black font-mulish"
                  >
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Enroll button */}
              <a
                href="#"
                className={`
                  block 
                  bg-[#333] 
                  text-white 
                  py-4 px-[30px] mt-2
                  font-mulish
                  uppercase 
                  transition-colors 
                  duration-300
                  group-hover:bg-brand-orange
                  font-bold
                `}
                style={{ transform: "skewY(4deg)" }}
              >
                Enroll now
              </a>

            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

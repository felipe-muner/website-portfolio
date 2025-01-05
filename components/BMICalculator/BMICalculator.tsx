"use client";

import React, { useState } from "react";
import { TitleSection } from "../TitleSection";

// ShadCN UI components (make sure they're correctly configured in your project)
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const BMICalculator: React.FC = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [bmi, setBmi] = useState("");

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(height);
    const w = parseFloat(weight);

    // Basic validation
    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
      setBmi("");
      return;
    }

    // BMI formula: weight (kg) / [height (m)]²
    const calculatedBmi = (w / ((h / 100) ** 2)).toFixed(2);
    setBmi(calculatedBmi);
  };

  return (
    <section className="bg-brand-background-2 py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* BMI Chart Section */}
          <div>
            <TitleSection
              title="BMI Calculator Chart"
              subtitle="Understand your range"
              className="text-left"
            />
            <div className="grid grid-cols-2 border border-brand-gray-darkest">
              <div className="bg-brand-background-1 text-brand-gray-light py-3 px-6 uppercase text-sm font-medium border-r border-brand-gray-darkest">
                BMI
              </div>
              <div className="bg-brand-background-1 text-brand-gray-light py-3 px-6 uppercase text-sm font-medium">
                Weight Status
              </div>
              <div className="text-brand-gray-light py-3 px-6 border-t border-brand-gray-darkest border-r font-mulish">
                Below 18.5
              </div>
              <div className="text-brand-gray-light py-3 px-6 border-t border-brand-gray-darkest font-mulish">
                Underweight
              </div>
              <div className="text-brand-gray-light py-3 px-6 border-t border-brand-gray-darkest border-r font-mulish">
                18.5 - 24.9
              </div>
              <div className="text-brand-gray-light py-3 px-6 border-t border-brand-gray-darkest font-mulish">
                Healthy
              </div>
              <div className="text-brand-gray-light py-3 px-6 border-t border-brand-gray-darkest border-r font-mulish">
                25.0 - 29.9
              </div>
              <div className="text-brand-gray-light py-3 px-6 border-t border-brand-gray-darkest font-mulish">
                Overweight
              </div>
              <div className="text-brand-gray-light py-3 px-6 border-t border-brand-gray-darkest border-r font-mulish">
                30.0 and Above
              </div>
              <div className="text-brand-gray-light py-3 px-6 border-t border-brand-gray-darkest font-mulish">
                Obese
              </div>
            </div>
          </div>

          {/* BMI Calculator Form Section */}
          <div>
            <TitleSection
              title="Calculate Your BMI"
              subtitle="Track your health"
              className="text-left"
            />
            <p className="text-brand-gray-light mb-6 font-mulish">
              Body Mass Index (BMI) is a quick way to estimate if you’re at a
              healthy weight. It factors in your height and weight to categorize
              you as underweight, healthy, overweight, or obese. Remember that
              BMI alone doesn’t account for muscle mass or overall body
              composition, so use it as a general guide.
            </p>
            <form className="space-y-4 font-mulish" onSubmit={handleCalculate}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Height Input */}
                <input
                  type="text"
                  placeholder="Height / cm"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="input w-full h-12 bg-transparent border border-brand-gray-darker text-brand-gray-light px-4 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />

                {/* Weight Input */}
                <input
                  type="text"
                  placeholder="Weight / kg"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="input w-full h-12 bg-transparent border border-brand-gray-darker text-brand-gray-light px-4 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />

                {/* Age Input */}
                <input
                  type="text"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="input w-full h-12 bg-transparent border border-brand-gray-darker text-brand-gray-light px-4 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />

                {/* Sex as Radio Buttons via shadcn/ui */}
                <RadioGroup
                  className="flex items-center space-x-4"
                  value={sex}
                  onValueChange={(value) => setSex(value)}
                >
                  {/* Male */}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      id="male"
                      value="Male"
                      className="peer h-4 w-4 
                 border border-brand-gray-darker rounded-full 
                 text-brand-orange ring-offset-2 ring-brand-orange 
                 focus:outline-none focus:ring-2 focus:ring-brand-orange
                 data-[state=checked]:bg-brand-orange data-[state=checked]:border-brand-orange 
                 data-[state=checked]:text-white"
                    />
                    <Label
                      htmlFor="male"
                      className="text-brand-gray-light 
                 cursor-pointer peer-checked:font-semibold
                 peer-checked:text-brand-orange"
                    >
                      Male
                    </Label>
                  </div>

                  {/* Female */}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      id="female"
                      value="Female"
                      className="peer h-4 w-4 
                 border border-brand-gray-darker rounded-full 
                 text-brand-orange ring-offset-2 ring-brand-orange 
                 focus:outline-none focus:ring-2 focus:ring-brand-orange
                 data-[state=checked]:bg-brand-orange data-[state=checked]:border-brand-orange 
                 data-[state=checked]:text-white"
                    />
                    <Label
                      htmlFor="female"
                      className="text-brand-gray-light 
                 cursor-pointer peer-checked:font-semibold
                 peer-checked:text-brand-orange"
                    >
                      Female
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <button
                type="submit"
                className="btn w-full py-3 bg-brand-orange text-white text-sm font-bold uppercase hover:bg-opacity-90 font-mulish"
              >
                Calculate
              </button>

              {/* Read-only field to display BMI result */}
              <input
                type="text"
                readOnly
                value={bmi ? `Your BMI is ${bmi}` : ""}
                placeholder="Your BMI will appear here"
                className="input w-full h-12 bg-transparent border border-brand-gray-darker text-brand-gray-light px-4 focus:outline-none"
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BMICalculator;

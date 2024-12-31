import { TitleSection } from "../TitleSection";

const BMICalculator: React.FC = () => {
  return (
    <section className="bg-brand-background-2 py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* BMI Chart Section */}
          <div>
            <TitleSection title="BMI Calculator Chart" subtitle="Check your body" className="text-left" />
            <div className="grid grid-cols-2 border border-brand-gray-darkest">
              <div className="bg-brand-background-1 text-brand-gray-light py-3 px-6 uppercase text-sm font-medium border-r border-brand-gray-darkest">
                BMI
              </div>
              <div className="bg-brand-background-1 text-brand-gray-light py-3 px-6 uppercase text-sm font-medium">
                Weight Status
              </div>
              <div className="text-brand-gray-light py-3 px-6 border-t border-brand-gray-darkest border-r">
                Below 18.5
              </div>
              <div className="text-brand-gray-light py-3 px-6 border-t border-brand-gray-darkest">
                Underweight
              </div>
              <div className="text-brand-gray-light py-3 px-6 border-t border-brand-gray-darkest border-r">
                18.5 - 24.9
              </div>
              <div className="text-brand-gray-light py-3 px-6 border-t border-brand-gray-darkest">
                Healthy
              </div>
              <div className="text-brand-gray-light py-3 px-6 border-t border-brand-gray-darkest border-r">
                25.0 - 29.9
              </div>
              <div className="text-brand-gray-light py-3 px-6 border-t border-brand-gray-darkest">
                Overweight
              </div>
              <div className="text-brand-gray-light py-3 px-6 border-t border-brand-gray-darkest border-r">
                30.0 - and Above
              </div>
              <div className="text-brand-gray-light py-3 px-6 border-t border-brand-gray-darkest">
                Obese
              </div>
            </div>
          </div>

          {/* BMI Calculator Form Section */}
          <div>
            <TitleSection title="Calculate Your BMI" subtitle="Check your body" className="text-left" />
            <p className="text-brand-gray-light mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan
              lacus vel facilisis.
            </p>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Height / cm"
                  className="input w-full h-12 bg-transparent border border-brand-gray-darker text-brand-gray-light px-4 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
                <input
                  type="text"
                  placeholder="Weight / kg"
                  className="input w-full h-12 bg-transparent border border-brand-gray-darker text-brand-gray-light px-4 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
                <input
                  type="text"
                  placeholder="Age"
                  className="input w-full h-12 bg-transparent border border-brand-gray-darker text-brand-gray-light px-4 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
                <input
                  type="text"
                  placeholder="Sex"
                  className="input w-full h-12 bg-transparent border border-brand-gray-darker text-brand-gray-light px-4 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>
              <button
                type="submit"
                className="btn w-full py-3 bg-brand-orange text-white text-sm font-bold uppercase hover:bg-opacity-90 font-mulish"
              >
                Calculate
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BMICalculator;

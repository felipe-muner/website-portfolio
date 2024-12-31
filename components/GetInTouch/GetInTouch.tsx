import React from "react";
import { TitleSection } from "../TitleSection";
import { ContactData } from "../ContactData";

const GetInTouch = () => {
  return (
    <div className="bg-brand-background-1 py-16 px-4">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <TitleSection subtitle="Contact Us" title="Get in touch" className="text-left" />
          <ContactData className="flex-col" />
        </div>
        <div>
          <form className="space-y-6 font-mulish">
            <input
              type="text"
              placeholder="Name"
              className="w-full px-4 py-3 bg-brand-darker bg-current border border-brand-gray-darker focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <input
              type="text"
              placeholder="Email"
              className="w-full px-4 py-3 bg-brand-darker bg-current border border-brand-gray-darker focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <input
              type="text"
              placeholder="Website"
              className="w-full px-4 py-3 bg-brand-darker bg-current border border-brand-gray-darker focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <textarea
              placeholder="Comment"
              className="w-full px-4 py-3 bg-brand-darker bg-current border border-brand-gray-darker focus:outline-none focus:ring-2 focus:ring-brand-orange h-32 resize-none"
            ></textarea>
            <button
              type="submit"
              className="w-full text-sm py-3 bg-brand-orange font-bold uppercase hover:bg-brand-gray-darker transition text-white "
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GetInTouch;

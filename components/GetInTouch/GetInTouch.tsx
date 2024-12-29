import React from "react";
import { TitleSection } from "../TitleSection";

const GetInTouch = () => {
  return (
    <div className="bg-brand-background-1 py-16">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <TitleSection subtitle="Contact Us" title="Get in touch" className="text-left" />
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-16 h-16 bg-brand-darker text-brand-orange rounded-full flex items-center justify-center">
                <i className="fa fa-map-marker text-2xl"></i>
              </div>
              <p className="text-brand-gray-medium">333 Middle Winchendon Rd, Rindge,<br /> NH 03461</p>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-16 h-16 bg-brand-darker text-brand-orange rounded-full flex items-center justify-center">
                <i className="fa fa-mobile text-2xl"></i>
              </div>
              <ul className="text-brand-gray-medium space-y-1">
                <li>125-711-811</li>
                <li>125-668-886</li>
              </ul>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-16 h-16 bg-brand-darker text-brand-orange rounded-full flex items-center justify-center">
                <i className="fa fa-envelope text-2xl"></i>
              </div>
              <p className="text-brand-gray-medium">Support.gymcenter@gmail.com</p>
            </div>
          </div>
        </div>
        <div>
          <form className="space-y-6">
            <input
              type="text"
              placeholder="Name"
              className="w-full px-4 py-3 bg-brand-darker text-brand-gray-light rounded focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <input
              type="text"
              placeholder="Email"
              className="w-full px-4 py-3 bg-brand-darker text-brand-gray-light rounded focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <input
              type="text"
              placeholder="Website"
              className="w-full px-4 py-3 bg-brand-darker text-brand-gray-light rounded focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <textarea
              placeholder="Comment"
              className="w-full px-4 py-3 bg-brand-darker text-brand-gray-light rounded focus:outline-none focus:ring-2 focus:ring-brand-orange h-32 resize-none"
            ></textarea>
            <button
              type="submit"
              className="w-full py-3 bg-brand-orange text-brand-black font-bold uppercase rounded hover:bg-brand-gray-darker transition"
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

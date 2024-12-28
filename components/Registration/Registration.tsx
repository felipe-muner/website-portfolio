import React from 'react';
import { Cta } from '../Cta';

const Registration = () => {
  return (
    <section
      className="h-[550px] flex items-center w-full justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('/img/banner-bg.jpg')` }}
    >
      <div className="container mx-auto">
        <div className="text-center">
          <div>
            <h2 className="text-5xl text-white font-bold uppercase mb-8">
              Registration now to get more deals
            </h2>
            <div className="text-brand-gray-light text-xl uppercase mb-12 font-mulish font-bold">
              Where health, beauty, and fitness meet.
            </div>
            <Cta href='/' label='appointment' />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Registration;
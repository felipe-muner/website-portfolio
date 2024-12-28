import React from 'react';
import { Cta } from '../Cta';

interface RegistrationProps {
  lead: string;
  sublead: string;
}

const Registration: React.FC<RegistrationProps> = ({ lead, sublead }) => {
  return (
    <section
      className="h-[550px] flex items-center w-full justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('/img/banner-bg.jpg')` }}
    >
      <div className="container mx-auto">
        <div className="text-center">
          <div>
            <h2 className="text-5xl text-white font-bold uppercase mb-8">
              {lead}
            </h2>
            <div className="text-brand-gray-light text-xl uppercase mb-12 font-mulish font-bold">
              {sublead}
            </div>
            <Cta href='/' label='appointment' />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Registration;
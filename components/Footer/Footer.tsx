import { Mail } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/brand-icons";
import Link from "next/link";
import { APP_NAME } from "@/constants";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <>
      <footer className="bg-brand-black pt-12">
        <div className="container mx-auto px-4">
          {/* ROW */}
          <div className="flex flex-wrap -mx-4">
            {/* col-lg-4 (About) */}
            <div className="w-full px-4 mb-8 lg:mb-0 lg:w-1/3">
              <div>
                <Link href="#">
                  <Image
                    src="/img/logo.png"
                    alt={APP_NAME} width={300} height={60}
                  />
                </Link>
              </div>
              <p className="text-brand-gray-light text-sm font-mulish leading-7 mt-8">
                Peak Performance Gym fosters strength, endurance, and balance through equipment,
                trainers, and workouts, empowering everyone to achieve a healthier lifestyle.
              </p>
              <div className="flex space-x-4 mt-4">
                <Link
                  href="https://www.facebook.com/PodiumGym"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-gray-light text-sm"
                >
                  <FacebookIcon size={16} />
                </Link>
                {/* <Link
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-gray-light text-sm"
                >
                  <Youtube size={16} />
                </Link> */}
                <Link
                  href="https://www.instagram.com/podium.gym"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-gray-light text-sm"
                >
                  <InstagramIcon size={16} />
                </Link>
                <Link
                  href="mailto:info@podiumgym.com"
                  className="text-brand-gray-light text-sm"
                >
                  <Mail size={16} />
                </Link>
              </div>
            </div>

            {/* col-lg-2 col-md-3 col-sm-6 (Useful Links) */}
            <div className="w-full px-4 mb-8 lg:mb-0 sm:w-1/2 md:w-1/4 lg:w-1/6">
              <h4 className="text-white font-semibold text-2xl mb-4">Useful Links</h4>
              <ul className="space-y-2 font-mulish leading-6">
                <li>
                  <Link href="/about-us" className="text-brand-gray-light text-sm">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/prices" className="text-brand-gray-light text-sm">
                    Prices
                  </Link>
                </li>
              </ul>
            </div>

            {/* col-lg-2 col-md-3 col-sm-6 (Support) */}
            <div className="w-full px-4 mb-8 lg:mb-0 sm:w-1/2 md:w-1/4 lg:w-1/6">
              <h4 className="text-white font-semibold text-2xl mb-4">Support</h4>
              <ul className="space-y-2 font-mulish leading-6">
                <li>
                  <Link href="/contact" className="text-brand-gray-light text-sm">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/calculate-bmi" className="text-brand-gray-light text-sm">
                    Calculate BMI
                  </Link>
                </li>
              </ul>
            </div>

            {/* col-lg-4 col-md-6 (Tips & Guides) */}
            <div className="w-full px-4 md:w-1/2 lg:w-1/3">
              <h4 className="text-white font-semibold text-2xl mb-4">Group Classes</h4>
              <ul className="space-y-2 font-mulish leading-6">
                <li>
                  <Link href="/classes/breathwork-ice-bath" className="text-brand-gray-light text-sm">
                    Breathwork & Ice Bath
                  </Link>
                </li>
                <li>
                  <Link href="/classes/hiit" className="text-brand-gray-light text-sm">
                    HIIT
                  </Link>
                </li>
                <li>
                  <Link href="/classes/pilates-mobility" className="text-brand-gray-light text-sm">
                    Pilates Mobility
                  </Link>
                </li>
                <li>
                  <Link href="/classes/tabata" className="text-brand-gray-light text-sm">
                    Tabata
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          {/* END ROW */}

          {/* COPYRIGHT SECTION */}
          <div className="mt-12 py-8 border-t border-brand-gray-dark text-center">
            <p className="text-sm text-brand-gray-light">
              Copyright &copy; {new Date().getFullYear() + ' '}
              All rights reserved | {' '}
              <span className="text-brand-orange">
                Podium Gym & Crossfit
              </span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

import { Facebook, Twitter, Youtube, Instagram, Mail } from "lucide-react";
import { APP_NAME } from "@/constants";
import Link from "next/link";
import { ContactData } from "../ContactData";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <>
      <ContactData />
      <footer className="bg-brand-black pt-12">
        <div className="container mx-auto px-4">
          {/* ROW */}
          <div className="flex flex-wrap -mx-4">

            {/* col-lg-4 (About) */}
            <div className="w-full px-4 mb-8 lg:mb-0 lg:w-1/3">
              <div>
                <a href="#">
                  <Image
                    src="/img/logo.png"
                    alt={APP_NAME}
                    width={182}
                    height={41}
                  />
                </a>
              </div>
              <p className="text-brand-gray-light leading-7 mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore dolore magna aliqua endisse
                ultrices gravida lorem.
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-brand-gray-light text-sm">
                  <Facebook size={16} />
                </a>
                <a href="#" className="text-brand-gray-light text-sm">
                  <Twitter size={16} />
                </a>
                <a href="#" className="text-brand-gray-light text-sm">
                  <Youtube size={16} />
                </a>
                <a href="#" className="text-brand-gray-light text-sm">
                  <Instagram size={16} />
                </a>
                <a href="#" className="text-brand-gray-light text-sm">
                  <Mail size={16} />
                </a>
              </div>
            </div>

            {/* col-lg-2 col-md-3 col-sm-6 (Useful Links) */}
            <div className="w-full px-4 mb-8 lg:mb-0 sm:w-1/2 md:w-1/4 lg:w-1/6">
              <h4 className="text-white font-semibold mb-4">Useful Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/about-us" className="text-brand-gray-light text-sm">
                    About us
                  </a>
                </li>
                <li>
                  <a href="/blog" className="text-brand-gray-light text-sm">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="/classes" className="text-brand-gray-light text-sm">
                    Classes
                  </a>
                </li>
              </ul>
            </div>

            {/* col-lg-2 col-md-3 col-sm-6 (Support) */}
            <div className="w-full px-4 mb-8 lg:mb-0 sm:w-1/2 md:w-1/4 lg:w-1/6">
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/contact" className="text-brand-gray-light text-sm">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/calculate-bmi" className="text-brand-gray-light text-sm">
                    Calculate BMI
                  </a>
                </li>
              </ul>
            </div>

            {/* col-lg-4 col-md-6 (Tips & Guides) */}
            <div className="w-full px-4 md:w-1/2 lg:w-1/3">
              <h4 className="text-white font-semibold mb-4">Tips & Guides</h4>
              <div className="space-y-6">
                <div className="border-b border-brand-gray-dark pb-4">
                  <h6 className="mb-2">
                    <a
                      href="#"
                      className="text-brand-gray-light text-base leading-6"
                    >
                      Physical fitness may help prevent depression, anxiety
                    </a>
                  </h6>
                  <ul className="text-xs text-brand-gray-darker">
                    <li>3 min read</li>
                  </ul>
                </div>
                <div>
                  <h6 className="mb-2">
                    <a
                      href="#"
                      className="text-brand-gray-light text-base leading-6"
                    >
                      Fitness: The best exercise to lose belly fat and tone
                      up...
                    </a>
                  </h6>
                  <ul className="text-xs text-brand-gray-darker">
                    <li>3 min read</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* END ROW */}

          {/* COPYRIGHT SECTION */}
          <div className="mt-12 border-t border-brand-gray-dark pt-6 text-center">
            <p className="text-sm text-brand-gray-light">
              Copyright &copy; {new Date().getFullYear()} All rights
              reserved | This template is made by{" "}
              <a
                href="https://felipemuner.com/portfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-orange"
              >
                Felipe Muner
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

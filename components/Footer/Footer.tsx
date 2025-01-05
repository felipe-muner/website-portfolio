import { Facebook, Twitter, Youtube, Instagram, Mail } from "lucide-react";
import Link from "next/link";
import { APP_NAME } from "@/constants";
import Image from "next/image";
import { ContactData } from "@/components/ContactData";
import { blogPosts } from "../Blog/data";


const Footer: React.FC = () => {
  // Sort blog posts by date and take the latest 2
  const latestBlogPosts = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2);

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
                <Link href="#">
                  <Image
                    src="/img/logo.png"
                    alt={APP_NAME}
                    width={182}
                    height={41}
                  />
                </Link>
              </div>
              <p className="text-brand-gray-light text-sm font-mulish leading-7 mt-8">
                Peak Performance Gym fosters strength, endurance, and balance through equipment,
                trainers, and workouts, empowering everyone to achieve a healthier lifestyle.
              </p>
              <div className="flex space-x-4 mt-4">
                <Link
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-gray-light text-sm"
                >
                  <Facebook size={16} />
                </Link>
                <Link
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-gray-light text-sm"
                >
                  <Twitter size={16} />
                </Link>
                <Link
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-gray-light text-sm"
                >
                  <Youtube size={16} />
                </Link>
                <Link
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-gray-light text-sm"
                >
                  <Instagram size={16} />
                </Link>
                <Link
                  href="mailto:yourgym@example.com"
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
                    About us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-brand-gray-light text-sm">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/classes" className="text-brand-gray-light text-sm">
                    Classes
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
              <h4 className="text-white font-semibold text-2xl mb-4">Blog — Tips & Guides</h4>
              <div className="space-y-6">
                {latestBlogPosts.map((post) => (
                  <div key={post.slug} className="border-b border-[#1a1a1a] pb-4">
                    <h6 className="mb-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-brand-gray-light text-base leading-6"
                      >
                        {post.title}
                      </Link>
                    </h6>
                    <ul className="text-xs text-brand-gray-darker font-mulish">
                      <li>{post.readTime} min read</li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* END ROW */}

          

          {/* COPYRIGHT SECTION */}
          <div className="mt-12 py-8 border-t border-brand-gray-dark text-center">
            <p className="text-sm text-brand-gray-light">
              Copyright &copy; {new Date().getFullYear() + ' '}
              All rights reserved | This template is made by{" "}
              <Link
                href="https://felipemuner.com/portfolio"
                target="_blank"
                rel="noreferrer"
                className="text-brand-orange"
              >
                Felipe Muner
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

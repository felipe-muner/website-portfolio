import React from "react";
import { MapPin, Smartphone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactDataProps {
  className?: string;
}

const ContactData: React.FC<ContactDataProps> = ({ className }) => {
  const isFlexCol = className?.includes("flex-col");

  return (
    <div className="bg-brand-background-1 py-8 w-full">
      <div className="container mx-auto px-4">
        <div
          className={cn(
            "flex flex-wrap justify-between",
            className,
            isFlexCol ? "flex-col gap-2" : "flex-row"
          )}
        >
          {/* Address Section */}
          <div
            className={cn(
              "text-left mb-6 md:mb-0",
              isFlexCol ? "w-full" : "w-full md:w-1/3"
            )}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-brand-orange text-white flex items-center justify-center h-16 w-16 rounded-full shrink-0">
                <MapPin size={30} className="h-8 w-8" />
              </div>
              <p className="text-white">
                333 Middle Winchendon Rd, Rindge,
                <br /> NH 03461
              </p>
            </div>
          </div>

          {/* Phone Section */}
          <div
            className={cn(
              "text-left mb-6 md:mb-0",
              isFlexCol ? "w-full" : "w-full md:w-1/3"
            )}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-brand-orange text-white flex items-center justify-center h-16 w-16 rounded-full shrink-0">
                <Smartphone size={30} className="h-8 w-8" />
              </div>
              <ul className="flex items-center space-x-6 text-white">
                <li className="relative">
                  125-711-811
                </li>
              </ul>
            </div>
          </div>

          {/* Email Section */}
          <div
            className={cn(
              "text-left",
              isFlexCol ? "w-full" : "w-full md:w-1/3"
            )}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-brand-orange text-white flex items-center justify-center h-16 w-16 rounded-full shrink-0">
                <Mail size={30} className="h-8 w-8" />
              </div>
              <p className="text-white">Support.gymcenter@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactData;

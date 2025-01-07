"use client";

import { Menu, X } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "../ui/button";

export function MobileNavbar({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const overflow = isOpen ? "hidden" : "auto";
    document.documentElement.style.overflow = overflow;
  }, [isOpen]);

  useEffect(() => {
    const closeHamburgerNavigation = () => setIsOpen(false);
    window.addEventListener("orientationchange", closeHamburgerNavigation);
    window.addEventListener("resize", closeHamburgerNavigation);

    return () => {
      window.removeEventListener("orientationchange", closeHamburgerNavigation);
      window.removeEventListener("resize", closeHamburgerNavigation);
    };
  }, []);

  return (
    <>
      <Button className="md:hidden text-white border p-2" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X /> : <Menu />}
      </Button>
      {isOpen && (
        <div
          className="fixed inset-0 top-[70px] z-40 size-full overflow-auto bg-black/50 animate-in slide-in-from-bottom-24 md:hidden"
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </>
  );
}
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BreadcrumbProps {
  route: string;
  isClass?: boolean;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ route, isClass }) => {
  return (
    <>
      <section className="h-[500px] pt-[230px] bg-[url('/img/breadcrumb-bg.jpg')] bg-cover bg-center bg-brand-background-2 w-full">
        <div className="mx-auto">
          <div className="flex justify-center items-center">
            <div className="text-center">
              <h2 className="text-6xl text-white font-semibold uppercase mb-4">
                {route}
              </h2>
              {isClass && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mt-4 bg-transparent hover:bg-brand-orange px-8 py-6 uppercase border-2 hover:border-brand-orange font-mulish font-bold">
                      Take a tour
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="p-0 bg-transparent border-0 max-w-[800px]">
                    <DialogHeader>
                      <DialogTitle></DialogTitle>
                    </DialogHeader>
                    <div className="w-full aspect-w-16 aspect-h-9">
                      <iframe
                        width="100%"
                        height="500"
                        frameBorder={0}
                        className="w-full"
                        src="https://www.youtube.com/embed/qPU8mENUBXk?autoplay=1&mute=1"
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Breadcrumb;

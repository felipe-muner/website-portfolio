"use client"

import Image from "next/image"
import * as React from "react"

type GalleryItem = {
  src: string
  wide?: boolean // If true => spans 2 columns on larger screens
}

const galleryItems: GalleryItem[] = [
  { src: "/img/gallery/gallery-1.jpg", wide: true },
  { src: "/img/gallery/gallery-2.jpg" },
  { src: "/img/gallery/gallery-3.jpg" },
  { src: "/img/gallery/gallery-4.jpg" },
  { src: "/img/gallery/gallery-5.jpg" },
  { src: "/img/gallery/gallery-6.jpg", wide: true },
]

export default function Gallery() {
  return (
    <section className="bg-brand-background-2 overflow-hidden py-10 w-full">
      <div>
        {/* 
          - grid-cols-1 on very small screens (one column),
          - sm:grid-cols-2 on small screens (two columns),
          - md:grid-cols-4 for medium screens and above (four columns).
          - auto-rows-[250px] on smaller screens, auto-rows-[472px] on md+ screens
        */}
        <div className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-4 
          gap-2 
          auto-rows-[250px] 
          md:auto-rows-[472px]
        ">
          {galleryItems.map((item, id) => (
            <div
              key={item.src}
              className={`
                relative 
                group 
                h-full 
                w-full 
                ${item.wide ? "md:col-span-2" : "col-span-1"}
              `}
            >
              <Image
                src={item.src}
                alt={`Gallery item ${id + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

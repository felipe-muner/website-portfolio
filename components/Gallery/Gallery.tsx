"use client"

import Image from "next/image"
import * as React from "react"

type GalleryItem = {
  src: string
  wide?: boolean // If true => spans 2 columns
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
    <section className="bg-[#151515] overflow-hidden py-10 w-full">
      <div className="mx-auto">
        <div className="grid grid-cols-4 gap-2 auto-rows-[472px]">
          {galleryItems.map((item, id) => (
            <div
              key={item.src}
              className={`relative group h-full w-full ${item.wide ? "col-span-2" : "col-span-1"
                }`}
            >
              <Image
                src={item.src}
                alt={`Gallery item ${id + 1}`}
                fill
              />              
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

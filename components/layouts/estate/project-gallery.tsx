"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Project photo viewer copied from off-plan developer sites: a tall main
 * render with a rail of thumbnails — vertical beside it on desktop,
 * horizontal underneath on mobile.
 */
export function ProjectGallery({
  images,
  alt,
  flip = false,
}: {
  images: readonly string[];
  alt: string;
  /** Puts the thumbnail rail on the right side of the main image. */
  flip?: boolean;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className={`flex flex-col gap-3 md:flex-row ${flip ? "md:flex-row-reverse" : ""}`}>
      <div className="order-2 flex gap-3 md:order-none md:w-20 md:flex-col">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            aria-label={`Photo ${i + 1}`}
            onClick={() => setActive(i)}
            className={`relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-lg transition md:w-full ${
              i === active ? "ring-2 ring-[#4d4239] ring-offset-2 ring-offset-[#efedea]" : "opacity-70 hover:opacity-100"
            }`}
          >
            <Image src={src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
      <div className="relative aspect-[4/3] flex-1 overflow-hidden rounded-xl md:aspect-auto md:min-h-[460px]">
        <Image
          key={images[active]}
          src={images[active]}
          alt={alt}
          fill
          sizes="(min-width: 768px) 55vw, 92vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}

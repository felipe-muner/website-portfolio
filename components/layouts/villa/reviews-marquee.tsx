"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { REVIEWS } from "@/lib/layouts/laguna";

/**
 * Reviews drift by in a slow continuous loop. Hovering (desktop) or touching
 * and holding (mobile) pauses the scroll so the quote can be read.
 */
export function ReviewsMarquee() {
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="marquee-viewport overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      onTouchCancel={() => setPaused(false)}
    >
      <div
        className="marquee-track"
        style={
          {
            "--marquee-duration": "55s",
            animationPlayState: paused ? "paused" : "running",
          } as React.CSSProperties
        }
      >
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 gap-6 pr-6"
          >
            {REVIEWS.map((review) => (
              <li
                key={review.author}
                className="w-[20rem] sm:w-[24rem] lg:w-[27rem]"
              >
                <Card className="h-full">
                  <CardContent className="flex h-full flex-col p-7">
                    <span
                      aria-hidden
                      className="font-heading text-5xl leading-none text-sun"
                    >
                      &ldquo;
                    </span>
                    <blockquote className="mt-2 flex-1 leading-relaxed text-foreground/85">
                      {review.quote}
                    </blockquote>
                    <footer className="mt-6 flex items-center justify-between border-t border-border pt-4">
                      <div>
                        <div className="font-heading text-lg">
                          {review.author}
                        </div>
                        {review.date && (
                          <div className="text-xs text-muted-foreground">
                            {review.date}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-0.5 text-sun">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="size-3.5 fill-current" />
                        ))}
                      </div>
                    </footer>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

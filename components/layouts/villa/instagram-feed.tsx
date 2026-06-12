import Image from "next/image";
import { Play } from "lucide-react";
import { InstagramIcon } from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/layouts/villa/reveal";
import { INSTAGRAM_POSTS, LINKS } from "@/lib/layouts/laguna";
import { cn } from "@/lib/utils";

/**
 * "Catch up with our latest stories" — reel-style grid linking to Instagram.
 * Color props let each landing layout keep its own palette (light vs dark).
 */
export function InstagramFeed({
  className,
  eyebrowClassName = "text-terracotta",
  accentClassName = "text-palm",
  buttonVariant = "default",
}: {
  className?: string;
  eyebrowClassName?: string;
  accentClassName?: string;
  buttonVariant?: "default" | "secondary";
}) {
  return (
    <section id="instagram" className={cn("py-24 md:py-32", className)}>
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p
              className={cn(
                "flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.22em]",
                eyebrowClassName,
              )}
            >
              <InstagramIcon className="size-4" />
              @lagunabayvillas
            </p>
            <h2 className="font-heading mt-5 text-4xl leading-tight md:text-5xl">
              Catch up with our{" "}
              <em className={cn("italic", accentClassName)}>latest stories</em>
            </h2>
            <Button asChild size="lg" variant={buttonVariant} className="mt-7 px-7">
              <a
                href={LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon data-icon="inline-start" />
                Follow us
              </a>
            </Button>
          </div>
        </Reveal>
        <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {INSTAGRAM_POSTS.map((post, index) => (
            <Reveal key={post.image} delay={(index % 4) * 80}>
              <a
                href={post.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={post.alt}
                className="group relative block aspect-square overflow-hidden rounded-md"
              >
                <Image
                  src={post.image}
                  alt={post.alt}
                  fill
                  sizes="(min-width: 768px) 24vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex size-12 items-center justify-center rounded-full border border-white/70 bg-black/25 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <Play className="ml-0.5 size-5 fill-current" />
                  </span>
                </span>
                <InstagramIcon className="absolute right-3 top-3 size-4 text-white/85" />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

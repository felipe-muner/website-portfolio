import type { Metadata } from "next";
import Image from "next/image";
import { Manrope } from "next/font/google";
import { ArrowRight, ChevronRight, KeyRound, MessageCircle, Phone, Send, Tag } from "lucide-react";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { BiosphereMobileMenu } from "@/components/layouts/biosphere/mobile-menu";
import { ProjectGallery } from "@/components/layouts/estate/project-gallery";
import { SmoothScroll } from "@/components/layouts/portfolio/smooth-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const metadata: Metadata = {
  title: "Business Layout — Isla Verde Estate",
  robots: { index: false },
};

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "800"] });

/* Developer-brochure palette: espresso brown, rosy taupe, warm greige paper. */
const BROWN = "#4d4239";
const TAUPE = "#b59a8e";
const CREAM = "#efedea";
const CREAM2 = "#e6e3df";
const MUTED = "rgba(77, 66, 57, 0.62)";

const PHONE = "+66 93 000 11 22";
const PHONE_HREF = "tel:+66930001122";
const WA_HREF = "https://wa.me/66930001122?text=Hi!%20I%27m%20interested%20in%20Isla%20Verde%20Estate.";

const NAV = [
  { label: "Vista Alta Villas", href: "#vista-alta" },
  { label: "The Palm Grove", href: "#palm-grove" },
  { label: "Land for sale", href: "#land" },
  { label: "About the island", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

const GALLERY = [
  { src: "/img/layouts/villa-living-bright.jpg", alt: "Double-height living room in light wood" },
  { src: "/img/layouts/villa-modern-pool.jpg", alt: "Private pool terrace at midday" },
  { src: "/img/layouts/villa-bedroom-canopy.jpg", alt: "Canopy bedroom opening to the garden" },
  { src: "/img/layouts/villa-kitchen.jpg", alt: "Open kitchen with island counter" },
  { src: "/img/layouts/villa-pool-sunset.jpg", alt: "Sea-view pool at sunset" },
] as const;

const PROJECTS = [
  {
    id: "vista-alta",
    name: "Vista Alta Villas · Phase 1",
    tagline: "Two-level tropical style sea-view villas with a pool",
    specs: [
      ["Floor area", "144 m²"],
      ["Bedrooms", "2"],
      ["Location", "Haad Yao"],
      ["To the beach", "300 m"],
    ],
    stats: [
      ["18%", "ROI"],
      ["0%", "installment plan"],
      ["50%", "capitalisation"],
      ["5/5", "sold"],
    ],
    images: [
      "/img/layouts/villa-luxury-house.jpg",
      "/img/layouts/villa-living-warm.jpg",
      "/img/layouts/villa-kitchen.jpg",
      "/img/layouts/villa-bedroom-canopy.jpg",
    ],
    flip: false,
  },
  {
    id: "palm-grove",
    name: "The Palm Grove · Phase 2",
    tagline: "Four-bedroom garden estates around a shared lagoon pool",
    specs: [
      ["Floor area", "210 m²"],
      ["Bedrooms", "4"],
      ["Location", "Sri Thanu"],
      ["To the beach", "450 m"],
    ],
    stats: [
      ["17%", "ROI"],
      ["10%", "installment plan"],
      ["40%", "capitalisation"],
      ["3/5", "sold"],
    ],
    images: [
      "/img/layouts/villa-home-pool.jpg",
      "/img/layouts/villa-living-sofa.jpg",
      "/img/layouts/villa-bedroom-luxe.jpg",
      "/img/layouts/villa-pool-bali.jpg",
    ],
    flip: true,
  },
] as const;

/** Big two-tone uppercase display block — the site's whole personality. */
function TwoTone({
  dark,
  soft,
  as: Tag = "h2",
  size = "text-4xl sm:text-5xl md:text-6xl",
}: {
  dark: string;
  soft?: string;
  as?: "h1" | "h2";
  size?: string;
}) {
  return (
    <Tag className={`${size} font-extrabold uppercase leading-[0.98] tracking-tight`} style={{ color: BROWN }}>
      {dark}
      {soft && (
        <>
          <br />
          <span style={{ color: TAUPE }}>{soft}</span>
        </>
      )}
    </Tag>
  );
}

export default function EstatePage() {
  return (
    <div className={`${manrope.className} min-h-dvh antialiased`} style={{ backgroundColor: CREAM, color: BROWN }}>
      <SmoothScroll />

      {/* Floating white pill nav */}
      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-5 rounded-2xl bg-white px-4 shadow-[0_10px_30px_-18px_rgba(77,66,57,0.5)] sm:px-6">
          <a href="#top" className="shrink-0 border-2 px-2.5 py-1 leading-tight" style={{ borderColor: BROWN }}>
            <span className="block text-sm font-extrabold">Isla Verde</span>
            <span className="block text-[9px] font-medium uppercase tracking-[0.14em]" style={{ color: MUTED }}>
              Estate · Koh Phangan
            </span>
          </a>
          <nav className="hidden flex-1 items-center justify-center gap-6 text-[11px] font-semibold uppercase tracking-[0.1em] lg:flex">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="py-2 transition-colors hover:text-[#b59a8e]">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <div className="hidden text-right sm:block">
              <a href={PHONE_HREF} className="block text-base font-extrabold leading-tight">
                {PHONE}
              </a>
              <span className="text-[10px]" style={{ color: MUTED }}>
                WhatsApp, Telegram
              </span>
            </div>
            <a
              href={WA_HREF}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="grid size-9 place-items-center rounded-full transition hover:opacity-80"
              style={{ backgroundColor: TAUPE, color: "#fff" }}
            >
              <MessageCircle className="size-4" />
            </a>
            <a
              href={WA_HREF}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="hidden size-9 place-items-center rounded-full transition hover:opacity-80 sm:grid"
              style={{ backgroundColor: TAUPE, color: "#fff" }}
            >
              <Send className="size-4" />
            </a>
            <div className="lg:hidden">
              <BiosphereMobileMenu
                links={NAV}
                cta={{ label: "All projects", href: "#projects" }}
                hiddenFrom="lg"
                triggerColor={BROWN}
                panelStyle={{ backgroundColor: "#ffffff", color: BROWN, borderColor: "rgba(77, 66, 57, 0.12)" }}
                linkClassName="text-xl font-extrabold uppercase tracking-tight"
                ctaClassName="rounded-full px-6 py-3.5 text-center text-sm font-bold uppercase tracking-[0.08em]"
                ctaStyle={{ backgroundColor: BROWN, color: CREAM }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-16 pt-10 sm:px-6 md:pb-24 md:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
          <Reveal>
            <TwoTone
              as="h1"
              dark="Your home in the tropics"
              soft="on the Koh Phangan island"
              size="text-5xl sm:text-6xl md:text-7xl"
            />
            <p className="mt-8 max-w-sm text-lg leading-snug" style={{ color: MUTED }}>
              Stylish high-yield property on the island, from $89 000
            </p>
            <a
              href="#projects"
              className="mt-8 inline-block rounded-full px-8 py-4 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90"
              style={{ backgroundColor: BROWN }}
            >
              All projects
            </a>
          </Reveal>
          <Reveal delay={150} from="right">
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:aspect-[10/8]">
                <Image
                  src="/img/layouts/villa-luxury-house.jpg"
                  alt="Two-level glass villa under the palms"
                  fill
                  priority
                  sizes="(min-width: 1024px) 52vw, 94vw"
                  className="object-cover"
                />
              </div>
              {/* floating project card */}
              <a
                href="#palm-grove"
                className="absolute bottom-4 right-4 block w-72 rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur transition hover:-translate-y-0.5"
              >
                <span className="flex items-center gap-3">
                  <span className="relative block size-14 shrink-0 overflow-hidden rounded-lg">
                    <Image src="/img/layouts/villa-home-pool.jpg" alt="" fill sizes="56px" className="object-cover" />
                  </span>
                  <span>
                    <span className="block text-xs font-extrabold uppercase leading-snug">
                      The Palm Grove · Phase 2
                    </span>
                    <span className="mt-0.5 inline-flex items-center gap-0.5 text-[11px] font-semibold" style={{ color: TAUPE }}>
                      More <ChevronRight className="size-3" />
                    </span>
                  </span>
                </span>
                <span className="mt-3 grid grid-cols-2 gap-2 border-t pt-3" style={{ borderColor: "rgba(77,66,57,0.1)" }}>
                  {(
                    [
                      [Tag, "ROI", "17%"],
                      [KeyRound, "Sold", "3/5"],
                    ] as const
                  ).map(([Icon, label, value]) => (
                    <span key={label} className="flex items-center gap-2">
                      <span className="grid size-8 place-items-center rounded-lg" style={{ backgroundColor: CREAM }}>
                        <Icon className="size-3.5" />
                      </span>
                      <span>
                        <span className="block text-[9px] font-semibold uppercase tracking-[0.12em]" style={{ color: MUTED }}>
                          {label}
                        </span>
                        <span className="block text-sm font-extrabold">{value}</span>
                      </span>
                    </span>
                  ))}
                </span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* About / manifesto */}
      <section id="about" className="scroll-mt-24" style={{ backgroundColor: CREAM2 }}>
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <Reveal from="left">
            <div className="relative aspect-[4/5] max-w-md overflow-hidden rounded-2xl">
              <Image
                src="/img/layouts/villa-pool-sunset.jpg"
                alt="Deck chairs under a palapa looking at the sea"
                fill
                sizes="(min-width: 768px) 42vw, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <TwoTone dark="Start living" soft="the life you've always dreamed of" />
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-8 max-w-lg text-lg leading-relaxed">
                Isla Verde Estate is a development company that turns dreams of living in a
                tropical paradise into reality. We create unique projects on Koh Phangan
                island, seamlessly blending modern architecture with the perfection of nature.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <p className="mt-6 max-w-lg text-lg leading-relaxed" style={{ color: MUTED }}>
                With us, you can be confident that your investment in residential property on
                the island will not only be enjoyable but also fully legal, thanks to our
                extensive knowledge and experience in Thai law.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Big numbers */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        {(
          [
            ["4", "unique development projects"],
            ["12–18%", "target annual ROI"],
            ["From 95 000 THB", "deposit for purchase agreement"],
          ] as const
        ).map(([value, label], i) => (
          <Reveal key={label} delay={i * 100}>
            <p className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t py-7 first:border-t-0" style={{ borderColor: "rgba(77,66,57,0.15)" }}>
              <span className="text-5xl font-extrabold uppercase tracking-tight sm:text-6xl md:text-7xl">
                {value}
              </span>
              <span
                className="rounded-md px-3 py-1.5 text-base font-medium sm:text-lg"
                style={{ backgroundColor: CREAM2, color: MUTED }}
              >
                {label}
              </span>
            </p>
          </Reveal>
        ))}
      </section>

      {/* Gallery slider */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-24">
        <Reveal>
          <Carousel opts={{ loop: true }} className="group">
            <CarouselContent>
              {GALLERY.map((shot) => (
                <CarouselItem key={shot.src}>
                  <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
                    <Image src={shot.src} alt={shot.alt} fill sizes="(min-width: 1280px) 1216px, 94vw" className="object-cover" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 size-12 border-0 bg-white/90 text-[#4d4239] shadow-md hover:bg-white" />
            <CarouselNext className="right-4 size-12 border-0 bg-white/90 text-[#4d4239] shadow-md hover:bg-white" />
          </Carousel>
        </Reveal>
      </section>

      {/* Projects */}
      <div id="projects" className="scroll-mt-24">
        {PROJECTS.map((project, i) => (
          <section
            key={project.id}
            id={project.id}
            className="scroll-mt-24"
            style={{ backgroundColor: i % 2 === 0 ? CREAM2 : CREAM }}
          >
            <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1fr_1.15fr]">
              <div className={project.flip ? "lg:order-2" : ""}>
                <Reveal>
                  <TwoTone dark={project.name} />
                  <p className="mt-5 max-w-sm text-sm font-semibold uppercase tracking-[0.06em]">
                    {project.tagline}
                  </p>
                </Reveal>
                <Reveal delay={120}>
                  <dl className="mt-10 max-w-sm space-y-3">
                    {project.specs.map(([k, v]) => (
                      <div key={k} className="flex items-baseline justify-between gap-6">
                        <dt className="text-sm font-semibold uppercase tracking-[0.08em]" style={{ color: TAUPE }}>
                          {k}
                        </dt>
                        <dd className="text-lg font-extrabold">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
                <Reveal delay={200}>
                  <div className="mt-10 grid max-w-md grid-cols-2 gap-x-10 gap-y-6">
                    {project.stats.map(([value, label]) => (
                      <p
                        key={label}
                        className="flex items-baseline justify-between gap-3 border-b pb-2.5"
                        style={{ borderColor: "rgba(77,66,57,0.25)" }}
                      >
                        <span className="text-3xl font-extrabold sm:text-4xl">{value}</span>
                        <span className="text-sm" style={{ color: MUTED }}>
                          {label}
                        </span>
                      </p>
                    ))}
                  </div>
                  <a
                    href={WA_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-10 inline-block rounded-full px-8 py-4 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90"
                    style={{ backgroundColor: TAUPE }}
                  >
                    More info
                  </a>
                </Reveal>
              </div>
              <Reveal delay={150} from={project.flip ? "left" : "right"} className={project.flip ? "lg:order-1" : ""}>
                <ProjectGallery images={project.images} alt={project.name} flip={project.flip} />
              </Reveal>
            </div>
          </section>
        ))}
      </div>

      {/* Land for sale */}
      <section id="land" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 md:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <Reveal>
            <TwoTone dark="Land for sale" soft="chanote titles, ready to build" />
            <p className="mt-7 max-w-md text-lg leading-relaxed" style={{ color: MUTED }}>
              Flat and gently sloping sea-view plots from 400 m², with road access, water and
              electricity at the boundary. We handle the survey, the paperwork and the
              masterplan.
            </p>
            <a
              href={WA_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full px-8 py-4 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90"
              style={{ backgroundColor: BROWN }}
            >
              Request the plot list <ArrowRight className="size-4" />
            </a>
          </Reveal>
          <Reveal delay={150} from="right">
            <div className="relative aspect-[16/11] overflow-hidden rounded-2xl">
              <Image
                src="/img/layouts/villa-resort-aerial.jpg"
                alt="Aerial view of a green hillside meeting the sea"
                fill
                sizes="(min-width: 768px) 46vw, 94vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact / footer */}
      <footer id="contact" className="scroll-mt-24" style={{ backgroundColor: BROWN, color: CREAM }}>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
          <Reveal>
            <h2 className="text-4xl font-extrabold uppercase leading-[0.98] tracking-tight sm:text-5xl">
              Talk to us
              <br />
              <span style={{ color: TAUPE }}>before the next phase sells out</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={PHONE_HREF}
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-extrabold transition hover:opacity-90"
                style={{ color: BROWN }}
              >
                <Phone className="size-4" /> {PHONE}
              </a>
              <a
                href={WA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white transition hover:opacity-90"
                style={{ backgroundColor: TAUPE }}
              >
                <MessageCircle className="size-4" /> WhatsApp
              </a>
            </div>
          </Reveal>
          <p className="mt-12 text-xs" style={{ color: "rgba(239,237,234,0.55)" }}>
            Isla Verde Estate Co. Ltd. · Koh Phangan, Surat Thani · Concept demo — fictional
            brand, demo content and prices.
          </p>
        </div>
      </footer>

      <LayoutSwitcher />
    </div>
  );
}

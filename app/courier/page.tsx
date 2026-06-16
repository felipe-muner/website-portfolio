import type { Metadata } from "next";
import Image from "next/image";
import { Sora } from "next/font/google";
import {
  ArrowUpRight,
  BadgeCheck,
  Boxes,
  Clock,
  Globe2,
  PackageCheck,
  Plane,
  Quote,
  ShieldCheck,
  Ship,
  Truck,
} from "lucide-react";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { CourierHero } from "@/components/layouts/courier/hero";

export const metadata: Metadata = {
  title: "Business Layout — Wyvern Courier",
  robots: { index: false },
};

const display = Sora({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const INK = "#08090c";
const RED = "#e0322d";

const HERO_IMG = "/img/layouts/courier-aerial-port.jpg";

const SERVICES = [
  {
    icon: Plane,
    name: "Express air",
    detail: "Door-to-door in 3–5 days with duty, tax and customs settled before it lands.",
  },
  {
    icon: Ship,
    name: "Sea freight",
    detail: "Pallets and bulk by ocean container — the economical lane for heavy loads.",
  },
  {
    icon: Truck,
    name: "Last mile",
    detail: "Our own riders cover all 77 Thai provinces, with live GPS to the doorstep.",
  },
  {
    icon: Boxes,
    name: "Fulfilment",
    detail: "Warehousing, pick-and-pack and returns for sellers shipping out of Thailand.",
  },
] as const;

const STEPS = [
  { n: "01", title: "Book online", body: "Drop in pickup and delivery addresses and get an all-in price in seconds." },
  { n: "02", title: "We collect", body: "A Wyvern rider grabs your parcel and seals it into the network the same day." },
  { n: "03", title: "Customs cleared", body: "Duty and tax are paid up front — nothing to settle, no surprise fees." },
  { n: "04", title: "Tracked home", body: "Follow the dragon on the live map until it's signed for at the door." },
] as const;

const NETWORK = [
  { src: "/img/layouts/courier-warehouse.jpg", alt: "Sorting warehouse stacked with pallets", label: "12 fulfilment hubs" },
  { src: "/img/layouts/courier-truck-dusk.jpg", alt: "Long-haul truck on the highway at dusk", label: "Nightly line-haul" },
  { src: "/img/layouts/courier-ship.jpg", alt: "Container ship loading at the port", label: "Weekly sea sailings" },
] as const;

const PROMISES = [
  { icon: ShieldCheck, title: "Inclusive pricing", body: "Duty and tax are baked into one quote. The number you see is the number you pay." },
  { icon: Clock, title: "On-time or refunded", body: "Miss the committed window on express air and the shipping comes back to you." },
  { icon: Globe2, title: "220+ countries", body: "From a Bangkok soi to a doorstep in Berlin — one carrier, one tracking number." },
  { icon: BadgeCheck, title: "30 years in", body: "Three decades moving freight in and out of Thailand for sellers and families alike." },
] as const;

export default function CourierPage() {
  return (
    <main className={`${display.className} bg-[#f6f4ef] text-[#08090c]`}>
      <CourierHero
        image={HERO_IMG}
        line1={[{ text: "Door" }, { text: "to" }, { text: "door," }]}
        line2={[{ text: "duty" }, { text: "&" }, { text: "tax" }, { text: "included.", accent: true }]}
      />

      {/* Trust strip */}
      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-5 text-sm font-medium text-black/55">
          <span className="flex items-center gap-2">
            <PackageCheck className="size-4" style={{ color: RED }} /> Trusted by 6,000+ Thai sellers
          </span>
          <span className="hidden h-4 w-px bg-black/15 sm:block" />
          <span>eBay Thailand partner</span>
          <span className="hidden h-4 w-px bg-black/15 sm:block" />
          <span>DHL · FedEx · UPS lanes</span>
          <span className="hidden h-4 w-px bg-black/15 sm:block" />
          <span>Customs-bonded warehouse</span>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28 sm:px-10">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: RED }}>
            What we move
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
            One carrier for every leg of the journey.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.name} delay={i * 80}>
              <article className="group flex h-full flex-col rounded-2xl border border-black/10 bg-white p-7 transition hover:-translate-y-1 hover:border-black/20 hover:shadow-xl hover:shadow-black/5">
                <span
                  className="flex size-12 items-center justify-center rounded-xl text-white"
                  style={{ backgroundColor: INK }}
                >
                  <s.icon className="size-5" />
                </span>
                <h3 className="mt-5 text-xl font-semibold">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/60">{s.detail}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold opacity-0 transition group-hover:opacity-100" style={{ color: RED }}>
                  Learn more <ArrowUpRight className="size-4" />
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#08090c] text-white">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28 sm:px-10">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: RED }}>
              How it works
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Four steps from your hands to theirs.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 90}>
                <div className="flex h-full flex-col bg-[#0d0f13] p-7">
                  <span className="text-3xl font-bold" style={{ color: RED }}>
                    {step.n}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Network gallery */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28 sm:px-10">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-5xl">
              A network built for the long haul.
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-black/60">
              Air, sea and road stitched into one route. Whatever the lane, your parcel
              never leaves the Wyvern chain of custody.
            </p>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {NETWORK.map((n, i) => (
            <Reveal key={n.label} delay={i * 90}>
              <figure className="group relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Image
                  src={n.src}
                  alt={n.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <figcaption className="absolute bottom-5 left-5 text-lg font-semibold text-white">
                  {n.label}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Promises */}
      <section className="border-y border-black/10 bg-white">
        <div className="mx-auto grid max-w-6xl gap-px overflow-hidden bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
          {PROMISES.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <div className="flex h-full flex-col bg-white p-8">
                <p.icon className="size-7" style={{ color: RED }} />
                <h3 className="mt-5 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/60">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center sm:px-10">
        <Reveal>
          <Quote className="mx-auto size-10" style={{ color: RED }} />
          <blockquote className="mt-6 text-2xl font-medium leading-snug tracking-tight sm:text-4xl">
            “We ship 400 orders a week out of Chiang Mai and Wyvern has never lost one.
            The duty-inclusive pricing is the only reason our buyers keep coming back.”
          </blockquote>
          <figcaption className="mt-8 text-sm text-black/55">
            <span className="font-semibold text-black">Ploy Srisai</span> — Founder, Lanna Silk Co.
          </figcaption>
        </Reveal>
      </section>

      {/* Quote CTA */}
      <section id="quote" className="relative overflow-hidden bg-[#08090c] text-white">
        <Image
          src="/img/layouts/courier-truck-mountain.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-[#08090c]/80 to-[#08090c]/60" />
        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center sm:px-10">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              Ready to send something?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-white/70">
              Get an all-inclusive quote in under a minute. No account, no customs paperwork,
              no surprises at the door.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#"
                className="flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
                style={{ backgroundColor: RED }}
              >
                Get a quote <ArrowUpRight className="size-4" />
              </a>
              <a
                href="#"
                className="rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white/90 transition hover:bg-white/10"
              >
                Talk to sales
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#08090c] text-white/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 border-t border-white/10 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div className="flex items-center gap-2.5">
            <span
              className="flex size-8 items-center justify-center rounded-lg text-white"
              style={{ backgroundColor: RED }}
            >
              <Truck className="size-4" />
            </span>
            <span className="text-lg font-semibold text-white">Wyvern Courier</span>
          </div>
          <p className="text-sm">
            © {new Date().getFullYear()} Wyvern Courier Co. — A fictional brand for portfolio demo.
          </p>
        </div>
      </footer>

      <LayoutSwitcher />
    </main>
  );
}

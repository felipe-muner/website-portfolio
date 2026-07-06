import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DM_Serif_Display, Hanken_Grotesk } from "next/font/google";
import { ChefHat, Leaf, MapPin, Phone, ShoppingBasket, Utensils } from "lucide-react";
import { InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { SlotBooking, type SlotOption } from "@/components/layouts/SlotBooking";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Business Layout — Som Tam Kitchen",
  robots: { index: false },
};

const display = DM_Serif_Display({ subsets: ["latin"], weight: "400" });
const body = Hanken_Grotesk({ subsets: ["latin"], weight: ["300", "400", "600"] });

const CREAM = "#fbf3e4";
const INK = "#2a1a10";
const TERRA = "#c6512b";
const LIME = "#5f8b2c";

const CLASSES: readonly (SlotOption & { image: string; time: string })[] = [
  { slug: "market", name: "Morning Market Class", sub: "Shop the market with chef, then cook four dishes for lunch.", price: 1400, image: "/img/layouts/cooking-2.jpg", time: "09:00 – 13:30" },
  { slug: "curry", name: "Curry & Wok Night", sub: "Pound your own curry paste, master wok hei over real fire.", price: 1200, image: "/img/layouts/cooking-3.jpg", time: "16:00 – 19:30" },
  { slug: "vegan", name: "Plant-Based Thai", sub: "Vibrant vegan classics — no fish sauce, all flavour.", price: 1200, image: "/img/layouts/cooking-4.jpg", time: "10:00 – 13:00" },
  { slug: "private", name: "Private Family Class", sub: "Your own session for up to six — pick your menu.", price: 3500, image: "/img/layouts/cooking-1.jpg", time: "Your time" },
];

const STEPS = [
  { icon: ShoppingBasket, title: "Shop the market", body: "Meet the vendors, smell the herbs and learn what to look for — the class starts among the stalls." },
  { icon: ChefHat, title: "Cook four dishes", body: "Hands-on at your own wok station: a curry, a stir-fry, a salad and a sweet — from scratch." },
  { icon: Utensils, title: "Feast together", body: "Sit down and eat everything you made, then leave with the recipe book to do it at home." },
];

export default function CookingLayout() {
  return (
    <div className={body.className} style={{ backgroundColor: CREAM, color: INK }}>
      <Nav />
      <Hero />
      <Steps />
      <Classes />
      <Booking />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b" style={{ borderColor: `${INK}14`, backgroundColor: `${CREAM}e6`, backdropFilter: "blur(8px)" }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-10">
        <Link href="/" className={`${display.className} flex items-center gap-2 text-2xl`}>
          <ChefHat className="size-5" style={{ color: TERRA }} /> Som Tam Kitchen
        </Link>
        <nav className="hidden gap-8 text-sm font-semibold md:flex" style={{ color: `${INK}a6` }}>
          <a href="#how" className="hover:text-[#c6512b]">How it works</a>
          <a href="#classes" className="hover:text-[#c6512b]">Classes</a>
          <a href="#book" className="hover:text-[#c6512b]">Book</a>
        </nav>
        <a href="#book" className="px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: TERRA, borderRadius: "999px" }}>
          Book a class
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden pt-16">
      <Image src="/img/layouts/cooking-1.jpg" alt="Thai dishes and fresh ingredients" fill priority sizes="100vw" className="animate-landing-kenburns object-cover" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(110deg, ${INK}e6, ${INK}55 55%, transparent)` }} />
      <div className="relative mx-auto w-full max-w-6xl px-5 text-white md:px-10">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.35em]" style={{ color: "#f6c8a3" }}>
            Thai cooking class · small groups
          </p>
        </Reveal>
        <Reveal delay={140}>
          <h1 className={`${display.className} mt-5 max-w-3xl text-6xl leading-[1.02] md:text-8xl`}>
            Take the island home
            <span style={{ color: "#f6c8a3" }}> on a plate.</span>
          </h1>
        </Reveal>
        <Reveal delay={280}>
          <p className="mt-6 max-w-lg text-lg font-light leading-relaxed text-white/85">
            Half a day with a local chef: from the morning market to your own
            wok, cooking the dishes you fell in love with — then eating the lot.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#classes" className="px-8 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: TERRA, borderRadius: "999px" }}>
              See the classes
            </a>
            <a href="#book" className="border border-white/40 px-8 py-4 text-sm font-semibold transition-colors hover:bg-white/10" style={{ borderRadius: "999px" }}>
              Check dates
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-28">
      <Reveal>
        <h2 className={`${display.className} mb-12 text-4xl md:text-6xl`}>Your afternoon, three courses</h2>
      </Reveal>
      <div className="grid gap-8 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <Reveal key={s.title} delay={i * 90}>
            <div className="flex h-full flex-col">
              <div className="flex size-12 items-center justify-center rounded-full" style={{ backgroundColor: `${LIME}1f` }}>
                <s.icon className="size-6" style={{ color: LIME }} />
              </div>
              <h3 className={`${display.className} mt-5 text-2xl`}>{s.title}</h3>
              <p className="mt-2 text-base font-light leading-relaxed" style={{ color: `${INK}a6` }}>{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Classes() {
  return (
    <section id="classes" className="py-24 md:py-28" style={{ backgroundColor: "#fff" }}>
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} mb-12 text-4xl md:text-6xl`}>Choose your class</h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {CLASSES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 80} className="h-full">
              <div className="group flex h-full flex-col overflow-hidden rounded-3xl" style={{ border: `1px solid ${INK}12` }}>
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image src={c.image} alt={c.name} fill sizes="(min-width: 768px) 45vw, 90vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute right-3 top-3 flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-white" style={{ backgroundColor: `${INK}cc`, borderRadius: "999px" }}>
                    <Leaf className="size-3.5" /> {c.time}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className={`${display.className} text-2xl`}>{c.name}</h3>
                  <p className="mt-2 flex-1 text-base font-light" style={{ color: `${INK}a6` }}>{c.sub}</p>
                  <p className={`${display.className} mt-4 text-2xl`} style={{ color: TERRA }}>
                    ฿{c.price.toLocaleString()} <span className="text-sm font-light" style={{ color: `${INK}80` }}>per person</span>
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Booking() {
  return (
    <section id="book" className="mx-auto max-w-5xl px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <h2 className={`${display.className} text-4xl md:text-5xl`}>Save your seats</h2>
        <p className="mt-3 max-w-md text-base font-light" style={{ color: `${INK}a6` }}>
          Classes are capped at eight so everyone gets a wok. Pick a class, a
          day and your seats.
        </p>
      </Reveal>
      <Reveal delay={120}>
        <div className="mt-10">
          <SlotBooking
            options={CLASSES}
            displayClass={display.className}
            pickerLabel="Choose your class"
            priceUnit="per person"
            qty={{ label: "Seats", min: 1, max: 8 }}
            ctaLabel="Request these seats"
            note="Vegetarian & allergy-friendly on request."
            theme={{ accent: TERRA, accentText: "#ffffff", text: INK, muted: `${INK}99`, surface: CREAM, border: `${INK}1f`, radius: "16px" }}
          />
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ backgroundColor: INK }}>
      <div className="mx-auto max-w-6xl px-5 py-16 text-white md:px-10">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div>
            <p className={`${display.className} flex items-center gap-2 text-3xl`}>
              <ChefHat className="size-7" style={{ color: "#f6c8a3" }} /> Som Tam Kitchen
            </p>
            <p className="mt-3 max-w-sm font-light text-white/60">Daily classes · vegetarian friendly · recipe book to take home.</p>
          </div>
          <div className="space-y-2 text-sm text-white/80">
            <p className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0" style={{ color: "#f6c8a3" }} />{CONTACT.address}</p>
            <a href={CONTACT.phoneHref} className="flex items-center gap-2 hover:text-white"><Phone className="size-4" style={{ color: "#f6c8a3" }} />{CONTACT.phone}</a>
            <a href={CONTACT.instagram} className="flex items-center gap-2 hover:text-white"><InstagramIcon className="size-4" />{CONTACT.instagramHandle}</a>
          </div>
        </div>
        <p className="mt-12 text-xs uppercase tracking-[0.25em] text-white/40">
          © {new Date().getFullYear()} Som Tam Kitchen — fictional demo · Cooking-class layout
        </p>
      </div>
    </footer>
  );
}

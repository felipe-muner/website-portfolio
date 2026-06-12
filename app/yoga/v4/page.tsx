import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Lora, Playfair_Display } from "next/font/google";
import { ArrowUpRight, Asterisk } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { JournalAgenda } from "@/components/layouts/schedule/JournalAgenda";
import {
  CLASS_PLANS,
  CONTACT,
  YOGA_CLASSES,
  YOGA_COACHES,
} from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Yoga Layout 4 — Journal",
  robots: { index: false },
};

const display = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "700"], style: ["normal", "italic"] });
const body = Lora({ subsets: ["latin"], weight: ["400", "500", "600"] });

const PAPER = "#faf6ee";
const INK = "#1f1d1a";
const RUST = "#a4502c";

export default function JournalLayout() {
  return (
    <div className={`${body.className}`} style={{ backgroundColor: PAPER, color: INK }}>
      <Masthead />
      <Hero />
      <Index />
      <PullQuote />
      <Schedule />
      <Pricing />
      <Teachers />
      <Footer />
      <LayoutSwitcher />
    </div>
  );
}

function Masthead() {
  return (
    <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: PAPER, borderColor: `${INK}33` }}>
      <div className="mx-auto grid max-w-6xl grid-cols-3 items-center px-5 py-4 text-xs uppercase tracking-[0.25em] md:px-10">
        <p className="hidden text-[0.65rem] md:block" style={{ color: `${INK}99` }}>
          Vol. I — The Practice Issue
        </p>
        <Link
          href="/"
          className={`${display.className} col-span-2 text-2xl normal-case tracking-normal md:col-span-1 md:text-center md:text-3xl`}
        >
          The Practice <em style={{ color: RUST }}>Journal</em>
        </Link>
        <nav className="flex items-center justify-end gap-6 text-[0.65rem]">
          <a href="#index" className="hidden hover:underline md:block">Index</a>
          <a href="#notes" className="hidden hover:underline md:block">Notes</a>
          <a
            href="#subscribe"
            className="border px-4 py-2 transition-colors hover:bg-[#1f1d1a] hover:text-[#faf6ee]"
            style={{ borderColor: INK }}
          >
            Subscribe
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl border-b px-5 py-16 md:px-10 md:py-24" style={{ borderColor: `${INK}33` }}>
      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em]" style={{ color: RUST }}>
              An essay on slowing down
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className={`${display.className} mt-6 text-6xl leading-[1.04] md:text-8xl`}>
              On the art
              <br />
              of <em style={{ color: RUST }}>arriving</em>
              <br />
              on the mat.
            </h1>
          </Reveal>
          <Reveal delay={260}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed first-letter:float-left first-letter:mr-3 first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.85] first-letter:[font-family:inherit]" style={{ color: `${INK}cc` }}>
              Between the palms and the sea there is a quiet room. In it: yoga
              that builds heat, pilates that builds precision, and breathwork
              that builds the nerve to sit in an ice bath and smile. This is
              the studio&rsquo;s field guide.
            </p>
            <div className="mt-9 flex items-center gap-6 text-[0.65rem] font-semibold uppercase tracking-[0.25em]">
              <a
                href="#index"
                className="border-b-2 pb-1 transition-colors hover:text-[#a4502c]"
                style={{ borderColor: RUST }}
              >
                Read the index ↓
              </a>
              <span style={{ color: `${INK}66` }}>6 practices · 4 teachers</span>
            </div>
          </Reveal>
        </div>
        <Reveal from="right" delay={200}>
          <figure className="lg:mt-10">
            <div className="overflow-hidden">
              <Image
                src="/img/layouts/yoga-fold-bw.jpg"
                alt="A deep forward fold, in black and white"
                width={1600}
                height={1065}
                priority
                sizes="(min-width: 1024px) 36vw, 90vw"
                className="aspect-[4/5] w-full object-cover transition-transform duration-[2000ms] hover:scale-[1.03]"
              />
            </div>
            <figcaption
              className="mt-3 flex items-start gap-2 text-xs italic leading-relaxed"
              style={{ color: `${INK}99` }}
            >
              <Asterisk className="mt-0.5 size-3 shrink-0" style={{ color: RUST }} />
              Fig. 1 — The reformer studio, mid-morning. Springs, straps and
              absolute concentration.
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

function Index() {
  return (
    <section id="index" className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
      <Reveal>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className={`${display.className} text-4xl md:text-6xl`}>
            Index of practices
          </h2>
          <span className="text-[0.65rem] uppercase tracking-[0.3em]" style={{ color: `${INK}66` }}>
            p. 01 — 06
          </span>
        </div>
      </Reveal>
      <div className="mt-12">
        {YOGA_CLASSES.map((item, index) => (
          <Reveal key={item.name} delay={index * 50}>
            <Link
              href={item.href}
              className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 border-t py-7 transition-colors hover:bg-white/60 md:grid-cols-[5rem_1fr_16rem_auto] md:px-4"
              style={{ borderColor: `${INK}33` }}
            >
              <span className={`${display.className} text-2xl italic`} style={{ color: RUST }}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className={`${display.className} text-3xl transition-all group-hover:italic md:text-4xl`}>
                  {item.name}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed" style={{ color: `${INK}99` }}>
                  {item.detail}
                </p>
              </div>
              <p className="hidden text-xs uppercase tracking-[0.25em] md:block" style={{ color: `${INK}80` }}>
                {item.coach ? `Taught by ${item.coach}` : "Open practice"}
              </p>
              <ArrowUpRight
                className="size-5 self-center transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                style={{ color: RUST }}
              />
            </Link>
          </Reveal>
        ))}
        <div className="border-t" style={{ borderColor: `${INK}33` }} />
      </div>
    </section>
  );
}

function PullQuote() {
  return (
    <section className="border-y py-16 md:py-20" style={{ borderColor: `${INK}33`, backgroundColor: "#f2ecdf" }}>
      <div className="mx-auto max-w-4xl px-5 text-center md:px-10">
        <Reveal>
          <p className={`${display.className} text-3xl leading-snug md:text-5xl`}>
            &ldquo;Strength without stillness is just{" "}
            <em style={{ color: RUST }}>noise</em>.&rdquo;
          </p>
          <p className="mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.3em]" style={{ color: `${INK}80` }}>
            — overheard after breathwork, Saturday 18:00
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Schedule() {
  return (
    <section id="notes" className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
      <Reveal>
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className={`${display.className} text-4xl md:text-6xl`}>
            The month&rsquo;s <em style={{ color: RUST }}>appointments</em>
          </h2>
          <p className="max-w-xs text-sm italic leading-relaxed" style={{ color: `${INK}99` }}>
            A representative agenda. Every entry recurs weekly.
          </p>
        </div>
      </Reveal>
      <div className="mt-10">
        <Reveal delay={120}>
          <JournalAgenda displayClass={display.className} />
        </Reveal>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="subscribe" className="border-y py-16 md:py-24" style={{ borderColor: `${INK}33` }}>
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <h2 className={`${display.className} text-4xl md:text-6xl`}>
            Subscription <em style={{ color: RUST }}>rates</em>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ backgroundColor: `${INK}33` }}>
          {CLASS_PLANS.map((plan, index) => (
            <Reveal key={plan.name} delay={index * 70} className="h-full">
              <div
                className="flex h-full flex-col p-8"
                style={{ backgroundColor: plan.featured ? INK : PAPER, color: plan.featured ? PAPER : INK }}
              >
                <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.25em]">
                  {plan.name}
                </h3>
                <p className={`${display.className} mt-6 text-4xl`}>
                  ฿{plan.price.toLocaleString()}
                  <span className="text-base italic" style={{ color: plan.featured ? `${PAPER}99` : `${INK}80` }}>
                    {" "}
                    / {plan.unit}
                  </span>
                </p>
                <p className="mt-auto pt-8 text-xs italic" style={{ color: plan.featured ? `${PAPER}b3` : RUST }}>
                  {plan.note ?? "Includes every studio class"}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Teachers() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
      <Reveal>
        <h2 className={`${display.className} text-4xl md:text-6xl`}>
          The <em style={{ color: RUST }}>contributors</em>
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {YOGA_COACHES.map((coach, index) => (
          <Reveal key={coach.name} delay={index * 80}>
            <Link href={coach.href} className="group block">
              <div className="overflow-hidden">
                <Image
                  src={coach.image}
                  alt={`${coach.name} — ${coach.specialty}`}
                  width={460}
                  height={560}
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                  className="aspect-[4/5] w-full object-cover grayscale-[0.4] transition-all duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                />
              </div>
              <h3 className={`${display.className} mt-4 text-2xl group-hover:italic`}>
                {coach.name}
              </h3>
              <p className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.25em]" style={{ color: RUST }}>
                {coach.specialty}
              </p>
              <p className="mt-1 text-xs italic" style={{ color: `${INK}80` }}>
                speaks {coach.languages}
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t py-14" style={{ borderColor: INK, backgroundColor: "#f2ecdf" }}>
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className={`${display.className} text-3xl`}>
              The Practice <em style={{ color: RUST }}>Journal</em>
            </p>
            <p className="mt-3 max-w-sm text-sm italic leading-relaxed" style={{ color: `${INK}99` }}>
              Published daily at {CONTACT.address}.
            </p>
          </div>
          <div className="text-sm" style={{ color: `${INK}b3` }}>
            <p className="flex items-center gap-4">
              <a href={CONTACT.phoneHref} className="hover:underline">{CONTACT.phone}</a>
              <a href={CONTACT.emailHref} className="hover:underline">{CONTACT.email}</a>
            </p>
            <p className="mt-3 flex items-center gap-4">
              <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <InstagramIcon className="size-5 hover:text-[#a4502c]" />
              </a>
              <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FacebookIcon className="size-5 hover:text-[#a4502c]" />
              </a>
              <span className="text-[0.6rem] uppercase tracking-[0.25em]" style={{ color: `${INK}66` }}>
                © {new Date().getFullYear()} The Practice Journal — fictional demo · Layout 4
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { Golos_Text } from "next/font/google";
import { ArrowUp } from "lucide-react";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { Reveal } from "@/components/layouts/Reveal";
import { LenisScroll } from "@/components/layouts/showcase/lenis-scroll";
import { ClassCards } from "@/components/layouts/moonday/class-cards";
import { FirstClassForm } from "@/components/layouts/moonday/first-class-form";
import { MoondayHero } from "@/components/layouts/moonday/hero";
import { LunarCycle } from "@/components/layouts/moonday/lunar-cycle";
import { Manifesto } from "@/components/layouts/moonday/manifesto";
import { MonthSky } from "@/components/layouts/moonday/month-sky";
import { MoonGlyph } from "@/components/layouts/moonday/moon";
import { Wordmark } from "@/components/layouts/moonday/wordmark";
import { CONTACT } from "@/lib/layouts/content";
import { AUDIENCES, MOONDAY, MOONDAY_PLANS, MOONDAY_TEACHERS, SALA_FACTS } from "@/lib/layouts/moonday";

export const metadata: Metadata = {
  title: "Yoga Layout 5 — Moonday",
  description: "A yoga studio that plans its month around the moon. Fictional demo.",
  robots: { index: false },
};

const golos = Golos_Text({ subsets: ["latin"], weight: "variable" });

const NAV = [
  { href: "#classes", label: "Classes" },
  { href: "#cycle", label: "Moon cycle" },
  { href: "#sky", label: "Calendar" },
  { href: "#teachers", label: "Teachers" },
  { href: "#prices", label: "Prices" },
] as const;

const H2 = "text-[clamp(2.5rem,5.2vw,4.6rem)] font-[760] leading-[0.95] tracking-[-0.05em]";
const WRAP = "mx-auto w-full max-w-[1400px] px-6 md:px-10";

export default function MoondayLayout() {
  return (
    <div id="top" className={`${golos.className} min-h-dvh antialiased`} style={{ backgroundColor: MOONDAY.frame, color: MOONDAY.ink }}>
      <LenisScroll />

      {/* The vermilion frame, drawn over everything with rounded inner corners */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-2 z-[60] rounded-[14px] md:inset-[18px] md:rounded-[18px]"
        style={{ boxShadow: `0 0 0 40px ${MOONDAY.frame}` }}
      />

      <div className="p-2 md:p-[18px]">
        <div className="relative rounded-[14px] md:rounded-[18px]" style={{ backgroundColor: MOONDAY.cream }}>
          <Header />
          <main>
            <MoondayHero />
            <Classes />
            <Rules />
            <LunarCycle />
            <Sky />
            <Teachers />
            <Audiences />
            <Sala />
            <Prices />
            <Contact />
          </main>
          <Footer />
        </div>
      </div>

      <LayoutSwitcher />
    </div>
  );
}

function Header() {
  return (
    <header
      className="sticky top-2 z-50 rounded-t-[14px] border-b md:top-[18px] md:rounded-t-[18px]"
      style={{ backgroundColor: MOONDAY.cream, borderColor: `${MOONDAY.line}aa` }}
    >
      <div className={`${WRAP} flex h-16 items-center justify-between gap-6`}>
        <a href="#top" className="text-[1.6rem] font-[780] tracking-[-0.05em]" style={{ color: MOONDAY.frame }}>
          <Wordmark light={MOONDAY.frame} dark={MOONDAY.blush} />
        </a>
        <nav className="hidden items-center gap-7 text-[0.95rem] font-medium lg:flex" style={{ color: MOONDAY.red }}>
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="transition-opacity hover:opacity-60">
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="rounded-full px-5 py-2.5 text-[0.9rem] font-semibold transition-transform hover:-translate-y-0.5"
          style={{ backgroundColor: MOONDAY.red, color: MOONDAY.cream }}
        >
          Book a class
        </a>
      </div>
    </header>
  );
}

function SectionHead({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <Reveal>
      <div className="grid gap-5 md:grid-cols-2 md:items-end md:gap-16">
        <h2 className={H2} style={{ color: MOONDAY.frame }}>
          {title}
        </h2>
        <p className="max-w-xl text-[1.02rem] leading-relaxed md:justify-self-end">{children}</p>
      </div>
    </Reveal>
  );
}

function Classes() {
  return (
    <section id="classes" className={`${WRAP} scroll-mt-20 py-24 md:py-32`}>
      <SectionHead title={<>Four ways onto the&nbsp;mat</>}>
        Most people start with Vinyasa and add the others as the month asks for
        them. Every class is booked by the mat, and every mat comes with a
        teacher who knows your name.
      </SectionHead>
      <ClassCards />
    </section>
  );
}

function Rules() {
  return (
    <section className="border-t py-24 md:py-32" style={{ borderColor: MOONDAY.line }}>
      <div className={`${WRAP} grid gap-8 md:grid-cols-[minmax(0,0.42fr)_1fr] md:gap-16`}>
        <div className="md:sticky md:top-28 md:self-start">
          <h2 className="text-[clamp(1.8rem,2.6vw,2.4rem)] font-[760] leading-[1] tracking-[-0.045em]" style={{ color: MOONDAY.frame }}>
            Six things the moon taught us
          </h2>
          <div className="mt-6 flex gap-1.5">
            {[0, 0.125, 0.25, 0.375, 0.5, 0.625].map((p) => (
              <MoonGlyph key={p} phase={p} size={22} light={MOONDAY.frame} dark={MOONDAY.blush} />
            ))}
          </div>
        </div>
        <Manifesto />
      </div>
    </section>
  );
}

function Sky() {
  return (
    <section id="sky" className="scroll-mt-20 border-t py-24 md:py-32" style={{ borderColor: MOONDAY.line }}>
      <div className={WRAP}>
        <SectionHead title={<>This month&rsquo;s&nbsp;sky</>}>
          Every night of the month with the moon you will see that evening.
          Choose a night to read its classes, or a teacher to light up their days.
          The flow on the beach moves with the full moon, never the calendar.
        </SectionHead>
        <MonthSky />
      </div>
    </section>
  );
}

function Teachers() {
  return (
    <section id="teachers" className={`${WRAP} scroll-mt-20 py-24 md:py-32`}>
      <SectionHead title="Teachers who notice">
        Four teachers, each with 500 hours of training and a phase of the moon
        they love to teach. Small rooms on purpose: watching you is the job.
      </SectionHead>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOONDAY_TEACHERS.map((t, i) => (
          <Reveal key={t.name} delay={i * 90} className="h-full">
            <article className="group flex h-full flex-col rounded-[16px] border p-3 transition-colors duration-500 hover:bg-[#f6dccf]" style={{ borderColor: MOONDAY.line }}>
              <div className="flex items-start justify-between px-1.5 pb-4 pt-1.5">
                <h3 className="text-xl font-[740] tracking-[-0.03em]" style={{ color: MOONDAY.frame }}>
                  {t.name}
                </h3>
                <MoonGlyph phase={t.phase} size={24} light={MOONDAY.frame} dark={MOONDAY.blush} />
              </div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[12px]">
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 92vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <p className="mt-4 px-1.5 text-sm font-semibold" style={{ color: MOONDAY.red }}>
                {t.role}
              </p>
              <p className="mt-2 px-1.5 pb-2 leading-relaxed">{t.bio}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Audiences() {
  const offsets = ["md:mt-0", "md:mt-0", "md:mt-6", "md:mt-24"];
  return (
    <section className={`${WRAP} pb-24 md:pb-32`}>
      <SectionHead title={<>Who walks in on a Moonday</>}>
        There is no yoga body. There are surfers, laptop backs, first timers and
        people passing through, and the same moon over all of them.
      </SectionHead>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {AUDIENCES.map((a, i) => (
          <Reveal key={a.title} delay={i * 100} className={offsets[i]}>
            <h3 className="text-[1.65rem] font-[740] tracking-[-0.035em]" style={{ color: MOONDAY.frame }}>
              {a.title}
            </h3>
            <div className="group relative mt-3 aspect-[2/3] overflow-hidden rounded-[14px]">
              <Image
                src={a.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 92vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-[1.05]"
              />
            </div>
            <p className="mt-4 leading-relaxed">{a.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Sala() {
  return (
    <section className="border-t py-24 md:py-32" style={{ borderColor: MOONDAY.line }}>
      <div className={WRAP}>
        <div className="grid gap-8 md:grid-cols-2 md:gap-16">
          <Reveal>
            <h2 className={H2} style={{ color: MOONDAY.frame }}>
              One sala above Sunset&nbsp;Beach
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="max-w-xl text-[1.02rem] leading-relaxed">
              A teak floor open to the sea breeze, forty mats, two cold tubs on
              the deck and a sandy path down to where the Full Moon Flow happens.
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-x-6">
              {SALA_FACTS.map((f) => (
                <div key={f.title} className="border-t py-3.5" style={{ borderColor: MOONDAY.line }}>
                  <dt className="text-sm font-semibold" style={{ color: MOONDAY.red }}>
                    {f.title}
                  </dt>
                  <dd className="mt-0.5">{f.text}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-6 gap-3">
          {[
            { src: "/img/layouts/retreat-1.jpg", span: "col-span-6 md:col-span-4", alt: "Morning sit on the deck" },
            { src: "/img/layouts/retreat-4.jpg", span: "col-span-3 md:col-span-2", alt: "The garden path" },
            { src: "/img/layouts/retreat-5.jpg", span: "col-span-3 md:col-span-2", alt: "Stone steps through the jungle" },
            { src: "/img/layouts/fullmoon-2.jpg", span: "col-span-6 md:col-span-4", alt: "The beach below the studio at night" },
          ].map((img, i) => (
            <Reveal key={img.src} delay={i * 80} className={img.span}>
              <div className="group relative aspect-[16/10] overflow-hidden rounded-[14px] md:h-[360px] md:aspect-auto">
                <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 60vw, 92vw" className="object-cover transition-transform duration-1000 group-hover:scale-[1.04]" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Prices() {
  return (
    <section id="prices" className="scroll-mt-20 border-t py-24 md:py-32" style={{ borderColor: MOONDAY.line }}>
      <div className={WRAP}>
        <SectionHead title="Three ways to pay">
          No joining fee and no contract. Mats and props are free, and the towels
          for the ice are on us.
        </SectionHead>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {MOONDAY_PLANS.map((plan, i) => {
            const featured = "featured" in plan && plan.featured;
            return (
              <Reveal key={plan.name} delay={i * 100} className="h-full">
                <div
                  className="flex h-full flex-col rounded-[16px] border p-7 md:p-8"
                  style={
                    featured
                      ? { backgroundColor: MOONDAY.red, borderColor: MOONDAY.red, color: MOONDAY.cream }
                      : { borderColor: MOONDAY.line }
                  }
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold" style={{ color: featured ? MOONDAY.cream : MOONDAY.red }}>
                      {plan.name}
                    </p>
                    <MoonGlyph
                      phase={[0.06, 0.5, 0.25][i]}
                      size={26}
                      light={featured ? MOONDAY.cream : MOONDAY.frame}
                      dark={featured ? MOONDAY.deep : MOONDAY.blush}
                    />
                  </div>
                  <p className="mt-6 text-[3.6rem] font-[760] leading-none tracking-[-0.05em]" style={{ color: featured ? MOONDAY.cream : MOONDAY.frame }}>
                    {plan.price}
                  </p>
                  <p className="mt-2 text-sm font-semibold" style={{ color: featured ? MOONDAY.cream : MOONDAY.red }}>
                    {plan.unit}
                  </p>
                  <p className="mt-5 leading-relaxed">{plan.text}</p>
                  <a
                    href="#contact"
                    className="mt-auto w-fit rounded-full px-5 py-3 text-[0.92rem] font-semibold transition-transform hover:-translate-y-0.5"
                    style={featured ? { backgroundColor: MOONDAY.cream, color: MOONDAY.red, marginTop: "2.5rem" } : { backgroundColor: MOONDAY.red, color: MOONDAY.cream, marginTop: "2.5rem" }}
                  >
                    {plan.cta}
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 border-t py-24 md:py-32" style={{ borderColor: MOONDAY.line }}>
      <div className={`${WRAP} grid gap-14 md:grid-cols-2 md:gap-16`}>
        <Reveal>
          <h2 className={H2} style={{ color: MOONDAY.frame }}>
            Come in for a first&nbsp;class
          </h2>
          <p className="mt-6 max-w-lg text-[clamp(1.15rem,1.6vw,1.5rem)] font-[480] leading-snug tracking-[-0.012em]">
            Tell us a little about your body and where you are in your week, and
            we will suggest a class and a teacher. Or just call: the front desk
            picks up between classes.
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 text-[0.95rem]">
            <div>
              <dt className="text-sm font-semibold" style={{ color: MOONDAY.red }}>Studio</dt>
              <dd className="mt-1">{CONTACT.address}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold" style={{ color: MOONDAY.red }}>Hours</dt>
              <dd className="mt-1">Daily 07:00–20:00<br />Full moon until late</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold" style={{ color: MOONDAY.red }}>Phone</dt>
              <dd className="mt-1">
                <a href={CONTACT.phoneHref} className="hover:underline">{CONTACT.phone}</a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold" style={{ color: MOONDAY.red }}>Email</dt>
              <dd className="mt-1">
                <a href={CONTACT.emailHref} className="hover:underline">{CONTACT.email}</a>
              </dd>
            </div>
          </dl>
        </Reveal>
        <Reveal delay={120}>
          <FirstClassForm />
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="rounded-b-[14px] md:rounded-b-[18px]" style={{ backgroundColor: MOONDAY.red, color: MOONDAY.cream }}>
      <div className={`${WRAP} pb-8 pt-16 md:pt-20`}>
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="text-[clamp(3.2rem,8vw,6.5rem)] font-[800] leading-[0.85] tracking-[-0.06em]">
              <Wordmark light={MOONDAY.cream} dark={MOONDAY.deep} />
            </p>
            <p className="mt-5 max-w-xs leading-relaxed opacity-90">
              Yoga by the lunar month on Sunset Beach. Small rooms, cold water and
              one long flow under every full moon.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold opacity-80">Visit</p>
            <p className="mt-3 leading-relaxed">{CONTACT.address}</p>
          </div>
          <div>
            <p className="text-sm font-semibold opacity-80">Talk to us</p>
            <ul className="mt-3 space-y-1.5">
              <li><a href={CONTACT.phoneHref} className="hover:underline">{CONTACT.phone}</a></li>
              <li><a href={CONTACT.emailHref} className="hover:underline">{CONTACT.email}</a></li>
              <li><a href={CONTACT.instagram} className="hover:underline">Instagram</a></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold opacity-80">On this page</p>
            <ul className="mt-3 space-y-1.5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="hover:underline">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t pt-6 text-sm" style={{ borderColor: "rgba(246,242,231,0.25)" }}>
          <p className="opacity-80">© {new Date().getFullYear()} Moonday Yoga — fictional demo · Layout 5</p>
          <a href="#top" className="flex items-center gap-1.5 font-semibold hover:underline">
            Back to the top <ArrowUp className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}

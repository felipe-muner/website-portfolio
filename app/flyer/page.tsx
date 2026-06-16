import type { Metadata } from "next";
import { Archivo, Fraunces } from "next/font/google";
import {
  ArrowRight,
  Check,
  Coffee,
  Dumbbell,
  Flower2,
  Mail,
  Scissors,
  Sparkles,
  TreePalm,
  UtensilsCrossed,
  Waves,
  X,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/brand-icons";

export const metadata: Metadata = {
  title: "Flyer — Felipe Muner",
  robots: { index: false },
};

const display = Fraunces({ subsets: ["latin"], weight: ["400", "600"], style: ["normal", "italic"] });
const body = Archivo({ subsets: ["latin"], weight: ["400", "500", "700"] });

const INK = "#15130f";
const PAPER = "#f4f1ea";
const ACCENT = "#e8590c";

/* ------------------------------------------------------------------ */
/* Shared flyer chrome                                                 */
/* ------------------------------------------------------------------ */

/** A 1.87:1 horizontal flyer canvas. Everything inside scales with the
 *  container width (cqw units), so each frame stays crisp and proportional
 *  at any size — screenshot it at whatever width you like. */
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="@container w-full">
      <div
        className="relative aspect-[1.87/1] w-full overflow-hidden shadow-2xl"
        style={{ backgroundColor: PAPER, color: INK }}
      >
        <div className="pointer-events-none absolute inset-0 border-[0.16cqw]" style={{ borderColor: INK }} />
        <div className="pointer-events-none absolute inset-[1.1cqw] border-[0.1cqw]" style={{ borderColor: `${INK}cc` }} />
        <div className={`${body.className} relative flex h-full flex-col px-[3.6cqw] py-[3cqw]`}>{children}</div>
      </div>
    </div>
  );
}

function BrandRow() {
  return (
    <div className="shrink-0">
      <div className="flex items-baseline justify-between gap-[2cqw]">
        <span className="text-[2cqw] font-bold uppercase tracking-[0.26em]">Felipe Muner</span>
        <span className={`${display.className} text-[1.85cqw] font-semibold italic`} style={{ color: ACCENT }}>
          websites &amp; systems for your business
        </span>
      </div>
      <div className="mt-[1.3cqw] border-t-[0.14cqw]" style={{ borderColor: INK }} />
    </div>
  );
}

function ContactRow() {
  return (
    <div className="flex shrink-0 items-center gap-[1.4cqw] pt-[0.4cqw]">
      <span
        className="flex items-center gap-[1cqw] rounded-full px-[2.2cqw] py-[1.05cqw] text-[1.65cqw] font-bold text-white"
        style={{ backgroundColor: "#25D366" }}
      >
        <WhatsAppIcon className="size-[2cqw]" /> +55 21 98485-2802
      </span>
      <span
        className="flex items-center gap-[1cqw] rounded-full border-[0.16cqw] px-[2.2cqw] py-[1.05cqw] text-[1.65cqw] font-bold"
        style={{ borderColor: INK }}
      >
        <Mail className="size-[2cqw]" /> felipe.muner@gmail.com
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Variant A — Real scenarios (closest to the original)                */
/* ------------------------------------------------------------------ */

const SCENARIOS = [
  {
    title: "Sunrise class, booked overnight",
    body: "A yoga studio’s 7am flow fills itself while clients sleep — no DMs, no back-and-forth.",
  },
  {
    title: "The villa that never closes",
    body: "Guests check dates and reserve at 2am; the calendar updates itself and blocks double-bookings.",
  },
  {
    title: "No more chasing payments",
    body: "The gym’s CRM flags who’s due, renews them online and sends the reminder for you.",
  },
  {
    title: "Your phone does the admin",
    body: "New bookings, reminders and a weekly report land straight on WhatsApp — wherever you are.",
  },
];

function FlyerScenarios() {
  return (
    <Frame>
      <BrandRow />
      <div className="flex flex-1 gap-[3cqw] py-[1.6cqw]">
        <div className="flex w-[38%] flex-col">
          <h2 className={`${display.className} text-[5.2cqw] font-semibold leading-[0.96]`}>
            Real businesses,
            <br />
            <span className="italic" style={{ color: ACCENT }}>
              running themselves.
            </span>
          </h2>
          <div className="mt-auto">
            <p className="text-[1.45cqw] font-bold uppercase tracking-[0.3em]" style={{ color: `${INK}99` }}>
              25 ready templates
            </p>
            <p className="text-[1.45cqw] font-bold uppercase tracking-[0.3em]" style={{ color: `${INK}99` }}>
              see them live — just ask
            </p>
          </div>
        </div>

        <div className="w-[0.1cqw] self-stretch" style={{ backgroundColor: `${INK}33` }} />

        <div className="flex flex-1 flex-col justify-center">
          {SCENARIOS.map((s, i) => (
            <div
              key={s.title}
              className={`flex gap-[1.6cqw] py-[1.05cqw] ${i < SCENARIOS.length - 1 ? "border-b-[0.1cqw]" : ""}`}
              style={{ borderColor: `${INK}22` }}
            >
              <span className={`${display.className} text-[2.1cqw] italic leading-none`} style={{ color: ACCENT }}>
                0{i + 1}
              </span>
              <div>
                <h3 className={`${display.className} text-[2.3cqw] font-semibold leading-tight`}>{s.title}</h3>
                <p className="mt-[0.4cqw] text-[1.4cqw] leading-snug" style={{ color: `${INK}cc` }}>
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ContactRow />
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Variant B — Before / After                                          */
/* ------------------------------------------------------------------ */

const BEFORE = [
  "Bookings lost in endless WhatsApp threads",
  "A paper schedule only you can read",
  "Members who quietly stopped paying",
  "The same villa booked twice by mistake",
  "“Where did I save that client’s number?”",
];

const AFTER = [
  "Clients book 24/7 from any phone",
  "One live schedule everyone can see",
  "Renewals tracked, reminders sent for you",
  "Calendar syncs — no double-bookings, ever",
  "Every member, plan & payment in one place",
];

function Column({
  title,
  items,
  tone,
}: {
  title: string;
  items: readonly string[];
  tone: "before" | "after";
}) {
  const after = tone === "after";
  const Icon = after ? Check : X;
  return (
    <div
      className="flex flex-1 flex-col rounded-[1.4cqw] border-[0.14cqw] px-[2cqw] py-[1.8cqw]"
      style={{
        borderColor: after ? ACCENT : `${INK}33`,
        backgroundColor: after ? `${ACCENT}0d` : "transparent",
      }}
    >
      <p className="text-[1.45cqw] font-bold uppercase tracking-[0.22em]" style={{ color: after ? ACCENT : `${INK}80` }}>
        {title}
      </p>
      <ul className="mt-[1.3cqw] flex flex-1 flex-col justify-between">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-[1cqw] text-[1.55cqw] leading-snug">
            <Icon className="mt-[0.2cqw] size-[1.9cqw] shrink-0" style={{ color: after ? ACCENT : `${INK}66` }} />
            <span style={{ color: after ? INK : `${INK}99` }}>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FlyerBeforeAfter() {
  return (
    <Frame>
      <BrandRow />
      <div className="flex flex-1 flex-col py-[2cqw]">
        <h2 className={`${display.className} text-[3.4cqw] font-semibold leading-tight`}>
          What changes when it just <span className="italic" style={{ color: ACCENT }}>works.</span>
        </h2>
        <div className="mt-[1.6cqw] flex flex-1 items-stretch gap-[1.6cqw]">
          <Column title="Without a system" items={BEFORE} tone="before" />
          <div className="flex items-center">
            <ArrowRight className="size-[3cqw]" style={{ color: ACCENT }} />
          </div>
          <Column title="With Felipe’s setup" items={AFTER} tone="after" />
        </div>
      </div>
      <ContactRow />
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Variant C — Industries grid                                         */
/* ------------------------------------------------------------------ */

const INDUSTRIES = [
  { icon: Dumbbell, label: "Gyms & CrossFit", line: "Class booking, memberships & check-ins" },
  { icon: Flower2, label: "Yoga & Pilates", line: "Schedules clients love to book from" },
  { icon: TreePalm, label: "Villas & Stays", line: "Availability & reservations, 24/7" },
  { icon: UtensilsCrossed, label: "Restaurants", line: "Menus, reservations & a real online face" },
  { icon: Coffee, label: "Cafés & Bakeries", line: "Warm sites with menus that update fast" },
  { icon: Scissors, label: "Barbershops", line: "Price lists & bookings, no phone tag" },
  { icon: Waves, label: "Dive Schools", line: "Course finders & trip sign-ups" },
  { icon: Sparkles, label: "Spas & Wellness", line: "Treatment menus & easy reservations" },
];

function FlyerIndustries() {
  return (
    <Frame>
      <BrandRow />
      <div className="flex flex-1 flex-col py-[2cqw]">
        <h2 className={`${display.className} text-[3.4cqw] font-semibold leading-tight`}>
          I build for businesses <span className="italic" style={{ color: ACCENT }}>like yours.</span>
        </h2>
        <div className="mt-[1.8cqw] grid flex-1 grid-cols-4 grid-rows-2 gap-[1.4cqw]">
          {INDUSTRIES.map(({ icon: Icon, label, line }) => (
            <div
              key={label}
              className="flex flex-col rounded-[1.2cqw] border-[0.12cqw] px-[1.5cqw] py-[1.4cqw]"
              style={{ borderColor: `${INK}26` }}
            >
              <Icon className="size-[2.6cqw]" style={{ color: ACCENT }} />
              <p className={`${display.className} mt-[0.9cqw] text-[1.85cqw] font-semibold leading-tight`}>{label}</p>
              <p className="mt-[0.4cqw] text-[1.2cqw] leading-snug" style={{ color: `${INK}b3` }}>
                {line}
              </p>
            </div>
          ))}
        </div>
      </div>
      <ContactRow />
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Variant D — A day that runs itself                                  */
/* ------------------------------------------------------------------ */

const DAY = [
  { time: "06:30", text: "Sunrise class books out from clients’ phones" },
  { time: "09:00", text: "New member signs up & pays online" },
  { time: "13:00", text: "Class reminders go out automatically" },
  { time: "17:30", text: "Tomorrow’s schedule updates itself" },
  { time: "21:00", text: "Daily report lands on your WhatsApp" },
];

function FlyerDay() {
  return (
    <Frame>
      <BrandRow />
      <div className="flex flex-1 flex-col py-[2.2cqw]">
        <h2 className={`${display.className} text-[3.6cqw] font-semibold leading-tight`}>
          A day your business <span className="italic" style={{ color: ACCENT }}>runs itself.</span>
        </h2>

        <div className="relative mt-auto flex items-stretch gap-[1.4cqw]">
          <div
            className="absolute left-[2cqw] right-[2cqw] top-[1.1cqw] h-[0.16cqw]"
            style={{ backgroundColor: `${INK}22` }}
          />
          {DAY.map((d) => (
            <div key={d.time} className="relative flex flex-1 flex-col items-start">
              <span className="size-[2.2cqw] rounded-full" style={{ backgroundColor: ACCENT }} />
              <span className={`${display.className} mt-[1.1cqw] text-[2.2cqw] font-semibold`} style={{ color: ACCENT }}>
                {d.time}
              </span>
              <span className="mt-[0.5cqw] text-[1.45cqw] leading-snug" style={{ color: `${INK}cc` }}>
                {d.text}
              </span>
            </div>
          ))}
        </div>
      </div>
      <ContactRow />
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Page — all variants stacked, each ready to screenshot               */
/* ------------------------------------------------------------------ */

const FLYERS = [
  { id: "scenarios", label: "A · Real scenarios", node: <FlyerScenarios /> },
  { id: "before-after", label: "B · Before → After", node: <FlyerBeforeAfter /> },
  { id: "industries", label: "C · Businesses like yours", node: <FlyerIndustries /> },
  { id: "day", label: "D · A day that runs itself", node: <FlyerDay /> },
];

export default function FlyerPage() {
  return (
    <div className={`${body.className} min-h-dvh px-5 py-12 md:px-10`} style={{ backgroundColor: "#e7e3da", color: INK }}>
      <div className="mx-auto max-w-[1200px]">
        <header className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.35em]" style={{ color: ACCENT }}>
            Flyers
          </p>
          <h1 className={`${display.className} mt-3 text-4xl md:text-5xl`}>Pick a flyer — screenshot any frame.</h1>
          <p className="mt-3 max-w-2xl text-sm" style={{ color: `${INK}aa` }}>
            Four horizontal concepts, all in your portfolio’s look. Each is a 1.87:1 canvas that scales to fit —
            open on a wide window and screenshot the frame for a clean export.
          </p>
        </header>

        <div className="space-y-14">
          {FLYERS.map((f) => (
            <section key={f.id} id={f.id}>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: `${INK}80` }}>
                {f.label}
              </p>
              {f.node}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

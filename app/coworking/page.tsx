import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IBM_Plex_Mono, Manrope, Sora } from "next/font/google";
import { format, getDayOfYear } from "date-fns";
import { Check } from "lucide-react";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { SlotBooking, type SlotOption } from "@/components/layouts/SlotBooking";
import { CONTACT } from "@/lib/layouts/content";

export const metadata: Metadata = {
  title: "Business Layout — Beam Coworking",
  robots: { index: false },
};

const display = Sora({ subsets: ["latin"], weight: ["600", "700"] });
const body = Manrope({ subsets: ["latin"], weight: ["400", "500", "700"] });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"] });

const INK = "#101d17";
const PAPER = "#f6f7f3";
const GREEN = "#0d7a52";
const SIGNAL = "#15b374";
const RULE = "rgba(16,29,23,0.16)";
const MUTED = "rgba(16,29,23,0.62)";
const GRIDLINE = "rgba(16,80,55,0.055)";

const PLANS: readonly SlotOption[] = [
  { slug: "day", name: "Day pass", sub: "Any open desk, 08:00–20:00, unlimited coffee.", price: 350 },
  { slug: "week", name: "Week pass", sub: "Seven days of flexible desks plus a locker.", price: 1800 },
  { slug: "month", name: "Dedicated desk", sub: "Your own desk and 4K monitor, 24/7 keycard.", price: 5500 },
  { slug: "office", name: "Private studio", sub: "Lockable room for a small team, month to month.", price: 14000 },
];

const STATS = [
  { label: "download", value: "940", unit: "Mbps" },
  { label: "ping · SIN", value: "4", unit: "ms" },
  { label: "uptime · 90d", value: "99.98", unit: "%" },
] as const;

const AMENITIES = [
  { item: "Fibre lines", spec: "2 × 1 Gbps, AIS + True" },
  { item: "Failover", spec: "5G router, auto-switch" },
  { item: "Power backup", spec: "UPS + diesel generator" },
  { item: "Aircon", spec: "24 °C, every room" },
  { item: "Meeting rooms", spec: "3, bookable by the hour" },
  { item: "Call booths", spec: "6, first come" },
  { item: "Monitors", spec: "27″ 4K on dedicated desks" },
  { item: "Chairs", spec: "full-height ergonomic" },
  { item: "Espresso bar", spec: "07:30–17:00, in-house" },
  { item: "Lockers", spec: "free from week pass up" },
  { item: "Printing", spec: "A4 / A3, pay per page" },
  { item: "Keycard access", spec: "24/7 for members" },
] as const;

type Cell = boolean | string;

const TABLE_ROWS: readonly { feature: string; day: Cell; week: Cell; month: Cell }[] = [
  { feature: "Access hours", day: "08:00–20:00", week: "08:00–20:00", month: "24/7 keycard" },
  { feature: "Seat", day: "any open desk", week: "any open desk", month: "your own desk" },
  { feature: "Gigabit wifi + failover", day: true, week: true, month: true },
  { feature: "Call booths", day: true, week: true, month: true },
  { feature: "Unlimited filter coffee", day: true, week: true, month: true },
  { feature: "Locker", day: false, week: true, month: true },
  { feature: "27″ 4K monitor", day: false, week: false, month: true },
  { feature: "Meeting-room credits", day: false, week: "2 h", month: "8 h / month" },
  { feature: "Guest day passes", day: false, week: false, month: "2 / month" },
];

const DESKS = [
  { path: "/commons", name: "The commons", note: "The main floor. Long shared tables, a low hum of keyboards, best seats by the garden windows.", image: "/img/layouts/coworking-1.jpg" },
  { path: "/focus-room", name: "Focus room", note: "Silent by house rule. No calls, no meetings, phone on the shelf at the door.", image: "/img/layouts/coworking-2.jpg" },
  { path: "/call-booths", name: "Call booths", note: "Six sound-treated booths wired straight into the fibre. Take the standup without taking the room with you.", image: "/img/layouts/coworking-3.jpg" },
  { path: "/dedicated", name: "Dedicated row", note: "Your desk, your monitor, your mess exactly as you left it. Keycard in, any hour.", image: "/img/layouts/coworking-4.jpg" },
] as const;

const STATUS_LINES = [
  { system: "network", state: "operational" },
  { system: "power", state: "operational" },
  { system: "aircon", state: "operational" },
  { system: "espresso machine", state: "operational" },
] as const;

function seatsFreeToday(now: Date): number {
  return 7 + (getDayOfYear(now) % 9);
}

export default function CoworkingLayout() {
  const now = new Date();
  return (
    <div
      className={body.className}
      style={{
        backgroundColor: PAPER,
        color: INK,
        backgroundImage: `linear-gradient(to right, ${GRIDLINE} 1px, transparent 1px), linear-gradient(to bottom, ${GRIDLINE} 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }}
    >
      <style>{`
        @keyframes bxbeam-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
        .bxbeam-live { animation: bxbeam-blink 1.6s steps(1) infinite; }
        @media (prefers-reduced-motion: reduce) { .bxbeam-live { animation: none; } }
      `}</style>

      <TopBar now={now} />
      <Hero now={now} />
      <Amenities />
      <PriceTable />
      <Desks />
      <Booking />
      <StatusFooter now={now} />
      <LayoutSwitcher />
    </div>
  );
}

function TopBar({ now }: { now: Date }) {
  return (
    <header className="border-b" style={{ borderColor: RULE }}>
      <div className={`${mono.className} border-b px-5 py-1.5 text-[11px] md:px-10`} style={{ borderColor: RULE, color: MUTED }}>
        beam coworking · srithanu, koh phangan · 9.7423° N, 99.9866° E · GMT+7
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-x-8 gap-y-2 px-5 py-5 md:px-10">
        <Link href="/" className={`${display.className} text-2xl font-bold tracking-tight`}>
          Beam<span style={{ color: GREEN }}>_</span>
        </Link>
        <nav className={`${mono.className} flex flex-wrap gap-x-6 gap-y-1 text-[13px]`}>
          <a href="#specs" className="hover:underline" style={{ color: MUTED }}>01 specs</a>
          <a href="#plans" className="hover:underline" style={{ color: MUTED }}>02 plans</a>
          <a href="#desks" className="hover:underline" style={{ color: MUTED }}>03 desks</a>
          <a href="#book" className="font-semibold underline underline-offset-4" style={{ color: GREEN }}>
            reserve a seat →
          </a>
        </nav>
      </div>
      <div className={`${mono.className} hidden border-t px-5 py-1.5 text-[11px] md:block md:px-10`} style={{ borderColor: RULE, color: MUTED }}>
        spec sheet · rev. {format(now, "yyyy-MM")} · for people who work online
      </div>
    </header>
  );
}

function Hero({ now }: { now: Date }) {
  const seats = seatsFreeToday(now);
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 pt-14 md:px-10 md:pt-20">
      <div className="grid gap-10 md:grid-cols-[1.6fr_1fr] md:items-end">
        <div>
          <h1 className={`${display.className} max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl`}>
            The fastest place to work on Koh Phangan.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: MUTED }}>
            Two fibre lines, a generator, cold aircon and two hundred people
            shipping real work. We measure our internet so you don&rsquo;t have
            to ask. The beach is still there at six.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <a
              href="#book"
              className={`${mono.className} px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-85`}
              style={{ backgroundColor: INK, color: PAPER }}
            >
              reserve a seat ↓
            </a>
            <a href="#plans" className={`${mono.className} text-sm underline underline-offset-4`} style={{ color: GREEN }}>
              compare plans
            </a>
          </div>
        </div>
        <dl className={`${mono.className} space-y-1.5 border-l pl-5 text-[13px]`} style={{ borderColor: RULE }}>
          {[
            ["doc", "BEAM-SPEC-01"],
            ["location", "Srithanu, Koh Phangan"],
            ["members", "200+ from 30 countries"],
            ["hours", "24/7 · café till 17:00"],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-3">
              <dt className="w-20 shrink-0" style={{ color: MUTED }}>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-14 border" style={{ borderColor: INK, backgroundColor: "#ffffff" }}>
        <div className={`${mono.className} flex items-center gap-2 border-b px-4 py-2 text-[11px] uppercase`} style={{ borderColor: RULE, color: MUTED }}>
          <span className="bxbeam-live size-2 rounded-full" style={{ backgroundColor: SIGNAL }} aria-hidden />
          live readout · measured {format(now, "d MMM yyyy")} at 08:00 · speedtest to SIN
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="border-b px-4 py-5 md:border-b-0 md:border-r md:px-6"
              style={{ borderColor: RULE, ...(i % 2 === 0 ? { borderRight: `1px solid ${RULE}` } : {}) }}
            >
              <p className={`${mono.className} text-[11px] uppercase tracking-wide`} style={{ color: MUTED }}>{s.label}</p>
              <p className={`${mono.className} mt-1 text-3xl font-semibold md:text-4xl`}>
                {s.value}
                <span className="ml-1.5 text-base font-normal" style={{ color: MUTED }}>{s.unit}</span>
              </p>
            </div>
          ))}
          <div className="px-4 py-5 md:px-6">
            <p className={`${mono.className} text-[11px] uppercase tracking-wide`} style={{ color: MUTED }}>seats free today</p>
            <p className={`${mono.className} mt-1 text-3xl font-semibold md:text-4xl`} style={{ color: GREEN }}>
              {seats}
              <span className="ml-1.5 text-base font-normal" style={{ color: MUTED }}>/ 64</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHead({ no, title, sub }: { no: string; title: string; sub?: string }) {
  return (
    <div className="border-t pt-8" style={{ borderColor: INK }}>
      <p className={`${mono.className} text-[12px]`} style={{ color: GREEN }}>sec. {no}</p>
      <h2 className={`${display.className} mt-2 text-3xl font-bold tracking-tight md:text-4xl`}>{title}</h2>
      {sub && <p className="mt-3 max-w-xl leading-relaxed" style={{ color: MUTED }}>{sub}</p>}
    </div>
  );
}

function Amenities() {
  return (
    <section id="specs" className="mx-auto max-w-6xl px-5 py-16 md:px-10">
      <SectionHead
        no="01"
        title="What's in the building"
        sub="The full inventory, no marketing weight. If it matters to a workday, it's listed; if it's not listed, ask and we'll probably add it."
      />
      <ul className={`${mono.className} mt-10 grid gap-x-14 gap-y-3 text-[14px] sm:grid-cols-2`}>
        {AMENITIES.map((a) => (
          <li key={a.item} className="flex items-baseline gap-3">
            <Check className="size-3.5 shrink-0 translate-y-0.5" style={{ color: GREEN }} aria-hidden />
            <span className="shrink-0">{a.item}</span>
            <span aria-hidden className="min-w-4 flex-1 border-b border-dotted" style={{ borderColor: RULE }} />
            <span className="text-right" style={{ color: MUTED }}>{a.spec}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TableCell({ value }: { value: Cell }) {
  if (value === true) return <Check className="mx-auto size-4" style={{ color: GREEN }} aria-label="included" />;
  if (value === false) return <span style={{ color: MUTED }} aria-label="not included">—</span>;
  return <span>{value}</span>;
}

function PriceTable() {
  const cols = [
    { key: "day", name: "Day", price: "฿350", per: "per day" },
    { key: "week", name: "Week", price: "฿1,800", per: "per week" },
    { key: "month", name: "Month", price: "฿5,500", per: "per month" },
  ] as const;
  return (
    <section id="plans" className="mx-auto max-w-6xl px-5 py-16 md:px-10">
      <SectionHead
        no="02"
        title="Plans, side by side"
        sub="Three ways in, one table. Private studios for teams of 2–5 run ฿14,000 a month — email us for a viewing."
      />
      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left" style={{ backgroundColor: "#ffffff", border: `1px solid ${INK}` }}>
          <caption className="sr-only">Comparison of Beam Coworking day, week and month plans</caption>
          <thead>
            <tr className="border-b" style={{ borderColor: INK }}>
              <th scope="col" className={`${mono.className} w-[34%] px-5 py-4 text-[11px] font-medium uppercase tracking-wide`} style={{ color: MUTED }}>
                feature
              </th>
              {cols.map((c) => (
                <th key={c.key} scope="col" className="border-l px-5 py-4 align-top" style={{ borderColor: RULE, backgroundColor: c.key === "month" ? "#eaf5ef" : undefined }}>
                  <span className={`${display.className} block text-lg font-bold`}>{c.name}</span>
                  <span className={`${mono.className} text-[13px]`} style={{ color: GREEN }}>{c.price} <span style={{ color: MUTED }}>{c.per}</span></span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`${mono.className} text-[13px]`}>
            {TABLE_ROWS.map((r) => (
              <tr key={r.feature} className="border-b" style={{ borderColor: RULE }}>
                <th scope="row" className="px-5 py-3 text-left font-normal">{r.feature}</th>
                <td className="border-l px-5 py-3 text-center" style={{ borderColor: RULE }}><TableCell value={r.day} /></td>
                <td className="border-l px-5 py-3 text-center" style={{ borderColor: RULE }}><TableCell value={r.week} /></td>
                <td className="border-l px-5 py-3 text-center" style={{ borderColor: RULE, backgroundColor: "#eaf5ef" }}><TableCell value={r.month} /></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className={`${mono.className} px-5 py-3 text-[11px]`} style={{ color: MUTED }}>prices in THB, incl. VAT</td>
              {cols.map((c) => (
                <td key={c.key} className="border-l px-5 py-3 text-center" style={{ borderColor: RULE, backgroundColor: c.key === "month" ? "#eaf5ef" : undefined }}>
                  <a href="#book" className={`${mono.className} text-[13px] font-semibold underline underline-offset-4`} style={{ color: GREEN }}>
                    book {c.name.toLowerCase()} →
                  </a>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

function Desks() {
  return (
    <section id="desks" className="mx-auto max-w-6xl px-5 py-16 md:px-10">
      <SectionHead
        no="03"
        title="A desk for every mode"
        sub="Deep work, calls, company — different rooms enforce different rules, so you pick the mode instead of fighting for it."
      />
      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {DESKS.map((d) => (
          <figure key={d.path} className="overflow-hidden rounded-lg border shadow-sm" style={{ borderColor: RULE, backgroundColor: "#ffffff" }}>
            <div className="flex items-center gap-2 border-b px-4 py-2.5" style={{ borderColor: RULE, backgroundColor: "#eef0ea" }}>
              <span aria-hidden className="flex gap-1.5">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: "#ff5f57" }} />
                <span className="size-2.5 rounded-full" style={{ backgroundColor: "#febc2e" }} />
                <span className="size-2.5 rounded-full" style={{ backgroundColor: "#28c840" }} />
              </span>
              <span className={`${mono.className} ml-2 truncate text-[12px]`} style={{ color: MUTED }}>
                beam.co.th{d.path}
              </span>
            </div>
            <div className="relative aspect-[16/10]">
              <Image src={d.image} alt={`${d.name} at Beam Coworking`} fill sizes="(min-width: 640px) 45vw, 90vw" className="object-cover" />
            </div>
            <figcaption className="px-4 py-4">
              <p className={`${display.className} font-bold`}>{d.name}</p>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: MUTED }}>{d.note}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Booking() {
  return (
    <section id="book" className="mx-auto max-w-6xl px-5 py-16 md:px-10">
      <SectionHead
        no="04"
        title="Reserve a seat"
        sub="Pick a plan and a start day. Day passes are charged per day; desks and studios bill monthly. First day is free if you tour the space first."
      />
      <div className="mt-10">
        <SlotBooking
          options={PLANS}
          displayClass={display.className}
          pickerLabel="Choose your plan"
          priceUnit="from"
          ctaLabel="Request this seat"
          note="Demo widget — nothing is submitted."
          theme={{
            accent: GREEN,
            accentText: "#ffffff",
            text: INK,
            muted: MUTED,
            surface: "#ffffff",
            border: RULE,
            radius: "4px",
          }}
        />
      </div>
    </section>
  );
}

function StatusFooter({ now }: { now: Date }) {
  return (
    <footer className={`${mono.className} text-[13px]`} style={{ backgroundColor: INK, color: "rgba(246,247,243,0.75)" }}>
      <div className="flex items-center gap-2.5 border-b px-5 py-3 md:px-10" style={{ borderColor: "rgba(246,247,243,0.15)" }}>
        <span className="bxbeam-live size-2 rounded-full" style={{ backgroundColor: SIGNAL }} aria-hidden />
        <span style={{ color: SIGNAL }}>all systems operational</span>
        <span className="ml-auto hidden sm:block">{format(now, "EEE d MMM yyyy")} · GMT+7</span>
      </div>
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-2 md:px-10">
        <ul className="space-y-2">
          {STATUS_LINES.map((s) => (
            <li key={s.system} className="flex items-baseline gap-3">
              <span>{s.system}</span>
              <span aria-hidden className="min-w-4 flex-1 border-b border-dotted" style={{ borderColor: "rgba(246,247,243,0.25)" }} />
              <span style={{ color: SIGNAL }}>{s.state}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-2 md:text-right">
          <p>{CONTACT.address}</p>
          <p>
            <a href={CONTACT.phoneHref} className="underline underline-offset-4 hover:text-white">{CONTACT.phone}</a>
            {" · "}
            <a href={CONTACT.instagram} className="underline underline-offset-4 hover:text-white">{CONTACT.instagramHandle}</a>
          </p>
          <p>
            <a href={CONTACT.emailHref} className="underline underline-offset-4 hover:text-white">{CONTACT.email}</a>
          </p>
        </div>
      </div>
      <p className="border-t px-5 py-4 text-[11px] md:px-10" style={{ borderColor: "rgba(246,247,243,0.15)", color: "rgba(246,247,243,0.45)" }}>
        © {format(now, "yyyy")} Beam Coworking — a fictional demo · coworking layout · BEAM-SPEC-01
      </p>
    </footer>
  );
}

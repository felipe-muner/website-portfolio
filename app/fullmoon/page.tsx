import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fraunces, IBM_Plex_Mono, Caveat } from "next/font/google";
import { addDays, format } from "date-fns";
import { LayoutSwitcher } from "@/components/layouts/LayoutSwitcher";
import { MoonEventBoard } from "@/components/layouts/MoonEventBoard";
import { MOON_EVENTS } from "@/lib/layouts/schedule";
import { CONTACT } from "@/lib/layouts/content";
import { moonPhase, moonIllumination, moonPhaseName } from "@/lib/layouts/moon";

export const metadata: Metadata = {
  title: "Business Layout — Lantern Beach Sessions",
  robots: { index: false },
};

const display = Fraunces({ subsets: ["latin"], weight: ["400", "600"], style: ["normal", "italic"] });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"] });
const hand = Caveat({ subsets: ["latin"], weight: ["500"] });

const NIGHT = "#060811";
const INK = "#0d1020";
const MOONLIGHT = "#f3ecdb";
const GOLD = "#d8b45f";
const MIST = "#9298b0";
const PAPER = "#f2ead6";
const PAPER_INK = "#241e10";

const SYNODIC_MONTH = 29.530588853; // days; matches lib/layouts/moon.ts

interface Star {
  top: string;
  left: string;
  size: number;
  delay: number;
  opacity: number;
}

const STARS: readonly Star[] = [
  { top: "8%", left: "12%", size: 2, delay: 0, opacity: 0.9 },
  { top: "14%", left: "78%", size: 2, delay: 1.2, opacity: 0.7 },
  { top: "22%", left: "32%", size: 1, delay: 2.1, opacity: 0.6 },
  { top: "9%", left: "55%", size: 1, delay: 0.6, opacity: 0.8 },
  { top: "31%", left: "88%", size: 2, delay: 1.8, opacity: 0.9 },
  { top: "27%", left: "8%", size: 1, delay: 2.6, opacity: 0.5 },
  { top: "40%", left: "18%", size: 2, delay: 0.9, opacity: 0.7 },
  { top: "44%", left: "70%", size: 1, delay: 1.5, opacity: 0.6 },
  { top: "12%", left: "40%", size: 1, delay: 3, opacity: 0.7 },
  { top: "18%", left: "64%", size: 2, delay: 0.3, opacity: 0.8 },
  { top: "36%", left: "48%", size: 1, delay: 2.4, opacity: 0.45 },
  { top: "52%", left: "10%", size: 1, delay: 1.1, opacity: 0.55 },
  { top: "56%", left: "84%", size: 2, delay: 2.9, opacity: 0.8 },
  { top: "62%", left: "28%", size: 1, delay: 0.4, opacity: 0.5 },
  { top: "66%", left: "58%", size: 1, delay: 1.9, opacity: 0.6 },
  { top: "48%", left: "38%", size: 1, delay: 3.2, opacity: 0.4 },
  { top: "6%", left: "90%", size: 1, delay: 0.8, opacity: 0.6 },
  { top: "72%", left: "76%", size: 1, delay: 2.2, opacity: 0.55 },
  { top: "76%", left: "14%", size: 2, delay: 1.4, opacity: 0.7 },
  { top: "82%", left: "46%", size: 1, delay: 0.2, opacity: 0.5 },
  { top: "20%", left: "22%", size: 1, delay: 1.7, opacity: 0.65 },
  { top: "58%", left: "50%", size: 1, delay: 2.7, opacity: 0.4 },
  { top: "34%", left: "60%", size: 1, delay: 0.5, opacity: 0.55 },
  { top: "86%", left: "68%", size: 1, delay: 1.3, opacity: 0.6 },
] as const;

const BRING = [
  "A sarong — the sand gets cold after two",
  "Cash: the fire bar takes no cards",
  "A refillable cup, 10-baht refills all night",
  "Reef-safe glitter only",
  "A torch for the walk back through the trees",
] as const;

const RULES = [
  "No glass past the treeline",
  "Lanterns launch at the waterline, nowhere else",
  "The fire circle belongs to the fire krew",
  "Nothing left on the sand by sunrise",
  "Look after strangers — the moon looks after you",
] as const;

const POLAROIDS = [
  { src: "/img/layouts/fullmoon-1.jpg", alt: "A bonfire burning on the beach at night", caption: "the fire, lit at dusk", tilt: -3 },
  { src: "/img/layouts/fullmoon-2.jpg", alt: "Crowd dancing on the sand under string lights", caption: "moonrise, 19:04", tilt: 2 },
  { src: "/img/layouts/fullmoon-3.jpg", alt: "Fire performer spinning poi on the shoreline", caption: "fire krew warming up", tilt: -1.5 },
  { src: "/img/layouts/fullmoon-4.jpg", alt: "Paper lanterns rising over the water at night", caption: "lanterns at the waterline", tilt: 2.5 },
  { src: "/img/layouts/fullmoon-5.jpg", alt: "First light over the beach after the party", caption: "the stragglers, 05:40", tilt: -2 },
] as const;

export default function FullMoonLayout() {
  const now = new Date();
  const phase = moonPhase(now);
  const illumination = Math.round(moonIllumination(phase) * 100);
  const phaseName = moonPhaseName(phase);
  const nightsToFull = Math.round(((0.5 - phase + 1) % 1) * SYNODIC_MONTH);
  const fullMoonDate = addDays(now, nightsToFull);

  return (
    <div className={mono.className} style={{ backgroundColor: NIGHT, color: MOONLIGHT }}>
      <style>{`
        @keyframes fmalm-rise {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fmalm-rise { animation: fmalm-rise 0.9s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .fmalm-rise { animation: none; }
        }
      `}</style>

      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex max-w-4xl items-baseline justify-between px-6 py-6">
          <Link href="/" className={`${display.className} text-xl italic`} style={{ color: MOONLIGHT }}>
            Lantern
          </Link>
          <a href="#calendar" className="text-xs underline underline-offset-4" style={{ color: MIST }}>
            the calendar ↓
          </a>
        </div>
      </header>

      <Hero phase={phase} phaseName={phaseName} illumination={illumination} nightsToFull={nightsToFull} fullMoonDate={fullMoonDate} />
      <Calendar />
      <Ticket />
      <Polaroids />
      <AlmanacFooter now={now} phaseName={phaseName} illumination={illumination} fullMoonDate={fullMoonDate} />
      <LayoutSwitcher />
    </div>
  );
}

function Hero({
  phase,
  phaseName,
  illumination,
  nightsToFull,
  fullMoonDate,
}: {
  phase: number;
  phaseName: string;
  illumination: number;
  nightsToFull: number;
  fullMoonDate: Date;
}) {
  const fullMoonLine =
    nightsToFull === 0
      ? "The full moon is tonight. The big one. You know where."
      : `Next full moon in ${nightsToFull} ${nightsToFull === 1 ? "night" : "nights"} — ${format(fullMoonDate, "EEEE d MMMM")}.`;

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="animate-landing-twinkle absolute rounded-full"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              backgroundColor: MOONLIGHT,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 pb-20 pt-28 text-center md:pb-28 md:pt-32">
        <p className="fmalm-rise text-xs" style={{ color: MIST }}>
          koh phangan · 9°44′ N, 100°00′ E · a night almanac
        </p>

        <div className="fmalm-rise my-10 md:my-12" style={{ animationDelay: "0.15s" }}>
          <PhaseMoon phase={phase} />
        </div>

        <p className="fmalm-rise text-sm" style={{ color: GOLD, animationDelay: "0.3s" }}>
          {phaseName.toLowerCase()} · {illumination}% lit · tonight, as rendered
        </p>

        <h1
          className={`${display.className} fmalm-rise mt-6 max-w-2xl text-4xl leading-tight md:text-6xl`}
          style={{ animationDelay: "0.45s" }}
        >
          The beach keeps <em>lunar</em> time.
        </h1>

        <div
          className="fmalm-rise mt-10 w-full max-w-xl py-4"
          style={{ borderTop: `1px solid ${MOONLIGHT}33`, borderBottom: `1px solid ${MOONLIGHT}33`, animationDelay: "0.6s" }}
        >
          <p className="text-sm leading-relaxed md:text-base">{fullMoonLine}</p>
          <p className="mt-1 text-xs" style={{ color: MIST }}>
            Sunset sessions, drum circles and one enormous party, all set by the sky above this page.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * The current moon, rendered as a CSS sphere: a lit disc with painted
 * craters, eclipsed by a soft shadow disc whose offset is derived from the
 * real illuminated fraction. No images.
 */
function PhaseMoon({ phase }: { phase: number }) {
  const f = moonIllumination(phase);
  const waxing = phase < 0.5;
  // Shadow disc slides off the lit limb as illumination grows: 0% at new
  // moon (fully covered) to ±112% of the diameter at full (fully clear).
  const shift = f * 112 * (waxing ? -1 : 1);

  return (
    <div
      aria-label={`${moonPhaseName(phase)}, ${Math.round(f * 100)} percent illuminated`}
      role="img"
      className="relative rounded-full"
      style={{
        width: "min(68vw, 22rem)",
        aspectRatio: "1",
        boxShadow: `0 0 ${40 + f * 80}px ${8 + f * 20}px rgba(243, 236, 219, 0.14)`,
      }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: [
              "radial-gradient(circle at 63% 34%, rgba(120, 111, 88, 0.45) 0 5.5%, transparent 6.5%)",
              "radial-gradient(circle at 30% 58%, rgba(120, 111, 88, 0.38) 0 8%, transparent 9%)",
              "radial-gradient(circle at 74% 66%, rgba(120, 111, 88, 0.3) 0 4.5%, transparent 5.5%)",
              "radial-gradient(circle at 46% 22%, rgba(120, 111, 88, 0.26) 0 3.5%, transparent 4.5%)",
              "radial-gradient(circle at 55% 78%, rgba(120, 111, 88, 0.22) 0 3%, transparent 4%)",
              "radial-gradient(circle at 20% 32%, rgba(120, 111, 88, 0.2) 0 5%, transparent 6%)",
              "radial-gradient(circle at 35% 32%, #fbf5e6, #ecdfc0 55%, #cdbf9c)",
            ].join(", "),
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            inset: "-4%",
            transform: `translateX(${shift}%)`,
            backgroundColor: "rgba(4, 5, 12, 0.94)",
            boxShadow: "0 0 28px 14px rgba(4, 5, 12, 0.94)",
          }}
        />
      </div>
    </div>
  );
}

function ChapterHead({ numeral, title }: { numeral: string; title: string }) {
  return (
    <div className="flex items-center gap-4">
      <span aria-hidden className="h-px flex-1" style={{ backgroundColor: `${MOONLIGHT}26` }} />
      <div className="text-center">
        <p className="text-xs" style={{ color: GOLD }}>
          ☾ {numeral}
        </p>
        <h2 className={`${display.className} mt-1 text-3xl md:text-4xl`}>{title}</h2>
      </div>
      <span aria-hidden className="h-px flex-1" style={{ backgroundColor: `${MOONLIGHT}26` }} />
    </div>
  );
}

function Calendar() {
  return (
    <section id="calendar" className="mx-auto max-w-4xl px-6 py-20 md:py-24">
      <ChapterHead numeral="I" title="The moon calendar" />
      <p className="mx-auto mt-4 max-w-md text-center text-sm leading-relaxed" style={{ color: MIST }}>
        A month of real phases, each with its night on the sand. Tap a moon; the full one is where the whole island turns up.
      </p>
      <div className="mt-12">
        <MoonEventBoard
          week={MOON_EVENTS}
          displayClass={display.className}
          theme={{
            accent: GOLD,
            accentText: NIGHT,
            dark: "#191d32",
            text: MOONLIGHT,
            muted: MIST,
            selectedRing: "#ffffff14",
            surface: INK,
            border: "#ffffff1c",
            radius: "10px",
          }}
        />
      </div>
    </section>
  );
}

function Ticket() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20 md:py-24">
      <ChapterHead numeral="II" title="The night, in writing" />
      <div
        className="relative mx-auto mt-12 max-w-3xl md:-rotate-1"
        style={{ backgroundColor: PAPER, color: PAPER_INK, boxShadow: "0 18px 50px rgba(0,0,0,0.55)" }}
      >
        {/* punch notches on the stub perforation */}
        <span aria-hidden className="absolute -top-3 left-20 hidden size-6 rounded-full md:block" style={{ backgroundColor: NIGHT }} />
        <span aria-hidden className="absolute -bottom-3 left-20 hidden size-6 rounded-full md:block" style={{ backgroundColor: NIGHT }} />

        <div className="flex flex-col md:flex-row">
          <div
            className="flex items-center justify-between gap-2 border-b border-dashed px-5 py-3 md:w-[5.75rem] md:flex-col md:border-b-0 md:border-r md:py-6"
            style={{ borderColor: `${PAPER_INK}55` }}
          >
            <p className="text-[0.65rem] font-semibold tracking-[0.3em] md:[writing-mode:vertical-rl]">ADMIT ONE</p>
            <p className="text-[0.65rem] md:[writing-mode:vertical-rl]" style={{ color: `${PAPER_INK}99` }}>
              Nº 000229
            </p>
          </div>

          <div className="relative flex-1 p-7 md:p-10">
            <p className="text-[0.7rem] font-semibold tracking-[0.2em]">LANTERN BEACH SESSIONS — FULL MOON NIGHT</p>
            <p className="mt-1 text-[0.7rem]" style={{ color: `${PAPER_INK}99` }}>
              gate opens at dusk · ends when the moon sets · one wristband, whole night
            </p>

            <div className="mt-7 grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className={`${display.className} text-xl italic`}>Bring</h3>
                <ul className="mt-3 space-y-2 text-[0.8rem] leading-relaxed">
                  {BRING.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden style={{ color: `${PAPER_INK}77` }}>☐</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className={`${display.className} text-xl italic`}>Rules of the beach</h3>
                <ul className="mt-3 space-y-2 text-[0.8rem] leading-relaxed">
                  {RULES.map((item, i) => (
                    <li key={item} className="flex gap-2">
                      <span style={{ color: `${PAPER_INK}77` }}>{i + 1}.</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div
              aria-hidden
              className="pointer-events-none absolute bottom-6 right-6 rotate-[-12deg] rounded-full border-2 px-4 py-2 text-[0.65rem] font-semibold tracking-[0.25em]"
              style={{ borderColor: "#a5462f", color: "#a5462f", opacity: 0.55 }}
            >
              PAID · MOONLIGHT
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Polaroids() {
  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <ChapterHead numeral="III" title="From the last moons" />
      </div>
      <div className="mt-14 overflow-x-auto pb-6">
        <div className="mx-auto flex w-max gap-6 px-6 md:gap-8">
          {POLAROIDS.map((p) => (
            <figure
              key={p.src}
              className="relative w-52 shrink-0 p-3 pb-4 md:w-60"
              style={{
                backgroundColor: PAPER,
                transform: `rotate(${p.tilt}deg)`,
                boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
              }}
            >
              <span
                aria-hidden
                className="absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 rounded-full"
                style={{ backgroundColor: GOLD, boxShadow: "0 2px 5px rgba(0,0,0,0.5)" }}
              />
              <div className="relative aspect-square overflow-hidden">
                <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 15rem, 13rem" className="object-cover" />
              </div>
              <figcaption className={`${hand.className} mt-2 text-center text-xl`} style={{ color: PAPER_INK }}>
                {p.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function AlmanacFooter({
  now,
  phaseName,
  illumination,
  fullMoonDate,
}: {
  now: Date;
  phaseName: string;
  illumination: number;
  fullMoonDate: Date;
}) {
  const rows = [
    { night: `Tonight · ${format(now, "EEE d MMM")}`, moonrise: "19:04", moonset: "05:41", phase: phaseName, lit: `${illumination}%`, tide: "21:36" },
    { night: `Full moon · ${format(fullMoonDate, "EEE d MMM")}`, moonrise: "18:47", moonset: "05:58", phase: "Full moon", lit: "100%", tide: "22:12" },
  ] as const;

  return (
    <footer className="border-t px-6 py-14" style={{ borderColor: `${MOONLIGHT}1f`, backgroundColor: INK }}>
      <div className="mx-auto max-w-4xl">
        <p className="text-xs" style={{ color: GOLD }}>
          ☾ IV · tonight&rsquo;s almanac
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left text-xs">
            <thead>
              <tr style={{ color: MIST }}>
                {["Night", "Moonrise", "Moonset", "Phase", "Lit", "High tide"].map((h) => (
                  <th key={h} className="border-b py-2 pr-6 font-normal" style={{ borderColor: `${MOONLIGHT}26` }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.night}>
                  <td className="border-b py-2.5 pr-6" style={{ borderColor: `${MOONLIGHT}14` }}>{r.night}</td>
                  <td className="border-b py-2.5 pr-6 tabular-nums" style={{ borderColor: `${MOONLIGHT}14` }}>{r.moonrise}</td>
                  <td className="border-b py-2.5 pr-6 tabular-nums" style={{ borderColor: `${MOONLIGHT}14` }}>{r.moonset}</td>
                  <td className="border-b py-2.5 pr-6" style={{ borderColor: `${MOONLIGHT}14`, color: GOLD }}>{r.phase}</td>
                  <td className="border-b py-2.5 pr-6 tabular-nums" style={{ borderColor: `${MOONLIGHT}14` }}>{r.lit}</td>
                  <td className="border-b py-2.5 tabular-nums" style={{ borderColor: `${MOONLIGHT}14` }}>{r.tide}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-xs leading-relaxed" style={{ color: MIST }}>
          Lantern Beach Sessions · {CONTACT.area} ·{" "}
          <a href={CONTACT.phoneHref} className="underline underline-offset-2 hover:text-white">
            {CONTACT.phone}
          </a>{" "}
          ·{" "}
          <a href={CONTACT.instagram} className="underline underline-offset-2 hover:text-white">
            {CONTACT.instagramHandle}
          </a>
        </p>
        <p className="mt-2 text-[0.65rem]" style={{ color: `${MIST}99` }}>
          © {now.getFullYear()} Lantern Beach Sessions — a fictional demo. Moon phase is real; moonrise and tide times are illustrative.
        </p>
      </div>
    </footer>
  );
}

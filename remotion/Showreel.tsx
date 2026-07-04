import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  COLORS,
  fraunces,
  archivo,
  CUSTOMER_FEATURES,
  INTEGRATIONS,
  PAYOUTS,
  PAYOUT_TOTAL,
  MOON_GLYPHS,
} from "./theme";
import { BrowserFrame } from "./BrowserFrame";

// ── timing (30fps) ───────────────────────────────────────────────────
const T = {
  roast: 100,
  imagine: 152,
  fGym: 88,
  moon: 104,
  fMenu: 84,
  fVilla: 112,
  payout: 132,
  dive: 100,
  reel: 150,
  cta: 96,
} as const;

const clampOpts = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const useSceneFade = (len: number, pad = 12) => {
  const f = useCurrentFrame();
  return interpolate(f, [0, pad, len - pad, len], [0, 1, 1, 0], clampOpts);
};
const easeOut = (p: number) => 1 - (1 - p) * (1 - p);
const comma = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const usePortrait = () => {
  const { width, height } = useVideoConfig();
  return height > width;
};

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background: "radial-gradient(120% 120% at 50% 40%, transparent 55%, rgba(0,0,0,0.28) 100%)",
      pointerEvents: "none",
    }}
  />
);

const Rise: React.FC<{ children: React.ReactNode; delay?: number; style?: React.CSSProperties }> = ({
  children,
  delay = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 90 } });
  return (
    <div style={{ transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`, opacity: s, ...style }}>
      {children}
    </div>
  );
};

/** Portrait full-bleed mobile screenshot with a bottom scrim + caption. */
const PortraitFull: React.FC<{ mobileImg: string; kb: number; bg?: string; children: React.ReactNode }> = ({
  mobileImg,
  kb,
  bg = COLORS.ink,
  children,
}) => (
  <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
    <AbsoluteFill style={{ transform: `scale(${kb})` }}>
      <Img src={staticFile(`img/showreel/${mobileImg}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "48%", background: "linear-gradient(0deg, rgba(0,0,0,0.92) 6%, rgba(0,0,0,0.55) 46%, transparent)" }} />
    <div style={{ position: "absolute", bottom: 116, left: 56, right: 56 }}>{children}</div>
  </AbsoluteFill>
);

// ── 1. ROAST hook ────────────────────────────────────────────────────
const Roast: React.FC = () => {
  const frame = useCurrentFrame();
  const portrait = usePortrait();
  const opacity = useSceneFade(T.roast);
  const tilt = interpolate(frame, [8, 40], [-8, -3.5], clampOpts);
  const drop = interpolate(frame, [8, 34], [-40, 0], clampOpts);
  const punch = interpolate(frame, [58, 70], [0, 1], clampOpts);
  const days = ["MON", "TUE", "WED", "THU", "FRI"];
  return (
    <AbsoluteFill style={{ background: COLORS.ink, justifyContent: "center", alignItems: "center", padding: 60, opacity }}>
      <div style={{ textAlign: "center", opacity: interpolate(frame, [4, 18], [0, 1], clampOpts) }}>
        <span style={{ fontFamily: archivo, fontSize: portrait ? 30 : 38, color: COLORS.paper, fontWeight: 700 }}>How most island businesses</span>
        <br />
        <span style={{ fontFamily: archivo, fontSize: portrait ? 30 : 38, color: `${COLORS.paper}88`, fontWeight: 700 }}>share their schedule 👇</span>
      </div>
      <div
        style={{
          marginTop: 40,
          transform: `rotate(${tilt}deg) translateY(${drop}px)`,
          background: "#dcd7c4",
          padding: 24,
          borderRadius: 4,
          boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
          filter: "saturate(0.7) contrast(0.9)",
          width: portrait ? 640 : 760,
        }}
      >
        <div style={{ fontFamily: "Comic Sans MS, cursive", color: "#3a3a3a", fontSize: 22, fontWeight: 700, textAlign: "center", marginBottom: 12 }}>~ WEEKLY TIMETABLE ~</div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${days.length}, 1fr)`, gap: 2, background: "#9a9482" }}>
          {days.map((d) => (
            <div key={d} style={{ background: "#c7c1ac", padding: "6px 4px", textAlign: "center", fontFamily: "Comic Sans MS, cursive", fontSize: 15, color: "#333" }}>{d}</div>
          ))}
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} style={{ background: "#d7d1bd", padding: "10px 4px", textAlign: "center", fontFamily: "Comic Sans MS, cursive", fontSize: 13, color: "#555" }}>
              {i % 3 === 0 ? "9am Yoga" : i % 3 === 1 ? "5pm HIIT" : "—"}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, textAlign: "right", fontFamily: "monospace", fontSize: 12, color: "#7a7460" }}>IMG_4823_final_FINAL(2).jpg</div>
      </div>
      <div style={{ marginTop: 34, fontFamily: fraunces, fontSize: portrait ? 52 : 64, fontWeight: 600, color: COLORS.accent, transform: `scale(${interpolate(punch, [0, 1], [0.8, 1])})`, opacity: punch }}>
        …in 2026. 😬
      </div>
    </AbsoluteFill>
  );
};

// ── 2. IMAGINE — kinetic list with per-line sound ────────────────────
const IMAGINE_ITEMS = ["a gym", "a yoga studio", "a villa", "a restaurant", "a café", "a barbershop", "a spa", "a dive shop"] as const;
const IM_START = 22;
const IM_STEP = 11;
const Imagine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const portrait = usePortrait();
  const opacity = useSceneFade(T.imagine);
  return (
    <AbsoluteFill style={{ background: COLORS.paper, justifyContent: "center", alignItems: portrait ? "center" : "flex-start", padding: portrait ? 60 : 130, opacity }}>
      {IMAGINE_ITEMS.map((_, i) => (
        <Sequence key={`sfx-${i}`} from={IM_START + i * IM_STEP} durationInFrames={16}>
          <Audio src={staticFile("audio/pop.wav")} volume={0.9} playbackRate={1 + i * 0.045} />
        </Sequence>
      ))}
      <div style={{ textAlign: portrait ? "center" : "left" }}>
        <div
          style={{
            fontFamily: archivo,
            fontSize: portrait ? 30 : 40,
            fontWeight: 700,
            letterSpacing: 1,
            color: `${COLORS.ink}99`,
            opacity: interpolate(frame, [4, 16], [0, 1], clampOpts),
            transform: `translateY(${interpolate(frame, [4, 16], [20, 0], clampOpts)}px)`,
          }}
        >
          Imagine you have…
        </div>
        <div style={{ marginTop: portrait ? 16 : 20 }}>
          {IMAGINE_ITEMS.map((item, i) => {
            const st = IM_START + i * IM_STEP;
            const s = spring({ frame: frame - st, fps, config: { damping: 11, stiffness: 140, mass: 0.8 } });
            const shown = frame >= st;
            return (
              <div
                key={item}
                style={{
                  fontFamily: fraunces,
                  fontSize: portrait ? 52 : 74,
                  fontWeight: 600,
                  color: COLORS.ink,
                  lineHeight: 1.1,
                  opacity: shown ? Math.min(1, s) : 0,
                  transform: `translateY(${interpolate(s, [0, 1], [-45, 0])}px) scale(${interpolate(s, [0, 1], [1.18, 1])})`,
                }}
              >
                {item}
                <span style={{ color: COLORS.accent }}>.</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── reusable FEATURE scene ───────────────────────────────────────────
const Feature: React.FC<{
  len: number;
  img: string;
  eyebrow: string;
  headline: string;
  sub: string;
  badges?: readonly string[];
  index: number;
}> = ({ len, img, eyebrow, headline, sub, badges, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const portrait = usePortrait();
  const opacity = useSceneFade(len);
  const s = spring({ frame, fps, config: { damping: 22, stiffness: 65 } });
  const kb = interpolate(frame, [0, len], [1.04, 1.12]);
  const fromLeft = index % 2 === 0;

  const badgePills = badges ? (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 16 }}>
      {badges.map((b, i) => {
        const bs = spring({ frame: frame - 18 - i * 5, fps, config: { damping: 16 } });
        return (
          <span key={b} style={{ fontFamily: archivo, fontSize: portrait ? 20 : 22, fontWeight: 700, color: portrait ? COLORS.ink : COLORS.paper, background: portrait ? COLORS.paper : COLORS.ink, padding: "7px 16px", borderRadius: 999, opacity: bs, transform: `scale(${interpolate(bs, [0, 1], [0.7, 1])})` }}>{b}</span>
        );
      })}
    </div>
  ) : null;

  // PORTRAIT: full-screen mobile screenshot + caption over a bottom scrim
  if (portrait) {
    return (
      <AbsoluteFill style={{ opacity }}>
        <PortraitFull mobileImg={`${img}-m`} kb={kb}>
          <Rise>
            <span style={{ fontFamily: archivo, fontSize: 26, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: COLORS.accent }}>{eyebrow}</span>
          </Rise>
          <Rise delay={5}>
            <div style={{ fontFamily: fraunces, fontSize: 64, fontWeight: 600, color: "#fff", lineHeight: 1.05, marginTop: 12 }}>{headline}</div>
          </Rise>
          <Rise delay={10}>
            <div style={{ fontFamily: archivo, fontSize: 26, color: "rgba(255,255,255,0.82)", marginTop: 12 }}>{sub}</div>
          </Rise>
          {badgePills}
        </PortraitFull>
      </AbsoluteFill>
    );
  }

  // LANDSCAPE: desktop screenshot in a browser frame + side caption
  const shot = (
    <div style={{ width: "60%", transform: `translateX(${interpolate(s, [0, 1], [fromLeft ? -70 : 70, 0])}px) scale(${kb})`, opacity: s }}>
      <BrowserFrame src={img} />
    </div>
  );
  const copy = (
    <div style={{ width: "34%", textAlign: "left" }}>
      <Rise><span style={{ fontFamily: archivo, fontSize: 24, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: COLORS.accent }}>{eyebrow}</span></Rise>
      <Rise delay={5}><div style={{ fontFamily: fraunces, fontSize: 62, fontWeight: 600, color: COLORS.ink, lineHeight: 1.05, marginTop: 14 }}>{headline}</div></Rise>
      <Rise delay={10}><div style={{ fontFamily: archivo, fontSize: 26, color: `${COLORS.ink}99`, marginTop: 16 }}>{sub}</div></Rise>
      {badgePills}
    </div>
  );
  return (
    <AbsoluteFill style={{ background: COLORS.paper, opacity, overflow: "hidden", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 60, padding: 80 }}>
      {fromLeft ? (<>{copy}{shot}</>) : (<>{shot}{copy}</>)}
    </AbsoluteFill>
  );
};

// ── built: MOON CALENDAR + weather ───────────────────────────────────
const MoonCalendar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const portrait = usePortrait();
  const opacity = useSceneFade(T.moon);
  const cols = 7;
  const rows = 5;
  const cells = cols * rows;
  const fullMoonIdx = 18;
  const cell = portrait ? 128 : 96;
  return (
    <AbsoluteFill style={{ background: "#0e1030", justifyContent: "center", alignItems: "center", gap: 34, padding: 50, opacity }}>
      <div style={{ textAlign: "center" }}>
        <Rise><span style={{ fontFamily: archivo, fontSize: portrait ? 22 : 24, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: "#e9c46a" }}>Built for island life</span></Rise>
        <Rise delay={5}><div style={{ fontFamily: fraunces, fontSize: portrait ? 52 : 66, fontWeight: 600, color: "#f4f1ea", marginTop: 10 }}>A calendar with the <span style={{ color: "#e9c46a", fontStyle: "italic" }}>moon.</span></div></Rise>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${cell}px)`, gap: portrait ? 12 : 10 }}>
        {Array.from({ length: cells }).map((_, i) => {
          const glyph = MOON_GLYPHS[i % MOON_GLYPHS.length];
          const cs = spring({ frame: frame - 12 - i * 1.4, fps, config: { damping: 16, stiffness: 90 } });
          const isFull = i === fullMoonIdx;
          return (
            <div key={i} style={{ width: cell, height: cell, display: "grid", placeItems: "center", borderRadius: 16, background: isFull ? "rgba(233,196,106,0.14)" : "rgba(255,255,255,0.03)", boxShadow: isFull ? "0 0 26px rgba(233,196,106,0.5)" : "none", fontSize: portrait ? 64 : 46, opacity: cs, transform: `scale(${interpolate(cs, [0, 1], [0.4, isFull ? 1.08 : 1])})` }}>{glyph}</div>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 999, padding: "12px 22px", opacity: interpolate(frame, [40, 56], [0, 1], clampOpts) }}>
        <span style={{ fontSize: 26 }}>☀️</span>
        <span style={{ fontFamily: archivo, fontSize: portrait ? 24 : 26, fontWeight: 700, color: "#f4f1ea" }}>30°C</span>
        <span style={{ fontFamily: archivo, fontSize: portrait ? 20 : 22, color: "rgba(244,241,234,0.6)" }}>· moon phases · tides · daily weather</span>
      </div>
    </AbsoluteFill>
  );
};

// ── built: AUTOMATIC PAYOUTS ─────────────────────────────────────────
const Payouts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const portrait = usePortrait();
  const opacity = useSceneFade(T.payout);
  const total = Math.round(PAYOUT_TOTAL * easeOut(interpolate(frame, [40, 96], [0, 1], clampOpts)));
  const cardW = portrait ? 900 : 1040;
  return (
    <AbsoluteFill style={{ background: COLORS.ink, justifyContent: "center", alignItems: "center", gap: 30, padding: 50, opacity }}>
      <div style={{ textAlign: "center" }}>
        <Rise><span style={{ fontFamily: archivo, fontSize: portrait ? 22 : 24, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: COLORS.accent }}>And behind the scenes</span></Rise>
        <Rise delay={5}><div style={{ fontFamily: fraunces, fontSize: portrait ? 48 : 60, fontWeight: 600, color: COLORS.paper, marginTop: 8 }}>Teacher payouts, <span style={{ color: COLORS.accent, fontStyle: "italic" }}>automatic.</span></div></Rise>
      </div>
      <div style={{ width: cardW, maxWidth: "94%", background: "rgba(255,255,255,0.04)", borderRadius: 24, padding: portrait ? 30 : 40 }}>
        {PAYOUTS.map((p, i) => {
          const rs = spring({ frame: frame - 18 - i * 10, fps, config: { damping: 20, stiffness: 80 } });
          const val = Math.round(p.total * easeOut(interpolate(frame, [26 + i * 10, 90], [0, 1], clampOpts)));
          return (
            <div key={p.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: portrait ? "16px 4px" : "18px 6px", borderBottom: "1px solid rgba(255,255,255,0.08)", opacity: rs, transform: `translateX(${interpolate(rs, [0, 1], [40, 0])}px)` }}>
              <span style={{ fontFamily: fraunces, fontSize: portrait ? 34 : 38, color: COLORS.paper, width: "30%" }}>{p.name}</span>
              <span style={{ fontFamily: archivo, fontSize: portrait ? 20 : 24, color: `${COLORS.paper}88` }}>{p.classes} classes</span>
              <span style={{ fontFamily: archivo, fontSize: portrait ? 20 : 24, color: COLORS.accent, fontWeight: 700 }}>{p.pct}%</span>
              <span style={{ fontFamily: archivo, fontSize: portrait ? 28 : 34, color: COLORS.paper, fontWeight: 700, width: "26%", textAlign: "right" }}>฿{comma(val)}</span>
            </div>
          );
        })}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 22 }}>
          <span style={{ fontFamily: archivo, fontSize: portrait ? 22 : 26, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: `${COLORS.paper}99` }}>This month</span>
          <span style={{ fontFamily: fraunces, fontSize: portrait ? 44 : 56, fontWeight: 600, color: COLORS.accent }}>฿{comma(total)}</span>
        </div>
      </div>
      <div style={{ fontFamily: archivo, fontSize: portrait ? 22 : 24, color: `${COLORS.paper}88`, opacity: interpolate(frame, [70, 86], [0, 1], clampOpts) }}>Set each teacher&apos;s % once. Every class adds up.</div>
    </AbsoluteFill>
  );
};

// ── DIVE ─────────────────────────────────────────────────────────────
const Dive: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const portrait = usePortrait();
  const opacity = useSceneFade(T.dive);
  const s = spring({ frame, fps, config: { damping: 22, stiffness: 65 } });
  const kb = interpolate(frame, [0, T.dive], [1.04, 1.12]);

  if (portrait) {
    return (
      <AbsoluteFill style={{ opacity }}>
        <PortraitFull mobileImg="dive-stock-m" kb={kb} bg="#04263b">
          <Rise><span style={{ fontFamily: archivo, fontSize: 26, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#2ed3e8" }}>Run a shop? /dive</span></Rise>
          <Rise delay={5}><div style={{ fontFamily: fraunces, fontSize: 62, fontWeight: 600, color: "#fff", lineHeight: 1.05, marginTop: 12 }}>Sell online. Stock updates <span style={{ color: "#2ed3e8", fontStyle: "italic" }}>itself.</span></div></Rise>
          <Rise delay={10}><div style={{ fontFamily: archivo, fontSize: 26, color: "rgba(255,255,255,0.82)", marginTop: 12 }}>Live inventory, sold-count drill-downs, one-tap accountant CSV.</div></Rise>
        </PortraitFull>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: "#04263b", opacity, overflow: "hidden", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 60, padding: 80 }}>
      <div style={{ width: "36%" }}>
        <Rise><span style={{ fontFamily: archivo, fontSize: 24, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#2ed3e8" }}>Run a shop? /dive</span></Rise>
        <Rise delay={5}><div style={{ fontFamily: fraunces, fontSize: 60, fontWeight: 600, color: "#f4f1ea", lineHeight: 1.05, marginTop: 12 }}>Sell online. Stock updates <span style={{ color: "#2ed3e8", fontStyle: "italic" }}>itself.</span></div></Rise>
        <Rise delay={10}><div style={{ fontFamily: archivo, fontSize: 26, color: "rgba(244,241,234,0.7)", marginTop: 16 }}>Live inventory, sold-count drill-downs, and a one-tap accountant CSV.</div></Rise>
      </div>
      <div style={{ width: "56%", transform: `translateY(${interpolate(s, [0, 1], [50, 0])}px) scale(${interpolate(frame, [0, T.dive], [1.0, 1.05])})`, opacity: s }}>
        <BrowserFrame src="dive-stock" />
      </div>
    </AbsoluteFill>
  );
};

// ── REEL ─────────────────────────────────────────────────────────────
const REEL = ["forge", "horizon", "ember", "cinema", "barber", "spa"] as const;
const Reel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const portrait = usePortrait();
  const opacity = useSceneFade(T.reel);
  const each = T.reel / REEL.length;
  const active = Math.min(REEL.length - 1, Math.floor(frame / each));
  const local = frame - active * each;
  const s = spring({ frame: local, fps, config: { damping: 20, stiffness: 70 } });
  const caption = (
    <div style={{ fontFamily: fraunces, fontSize: portrait ? 52 : 54, fontWeight: 600, color: portrait ? "#fff" : COLORS.ink, textAlign: portrait ? "left" : "center" }}>
      29 designs. <span style={{ color: COLORS.accent, fontStyle: "italic" }}>Yours in a week.</span>
    </div>
  );

  if (portrait) {
    return (
      <AbsoluteFill style={{ opacity }}>
        <PortraitFull mobileImg={`${REEL[active]}-m`} kb={interpolate(local, [0, each], [1.04, 1.1])}>{caption}</PortraitFull>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: COLORS.paper, justifyContent: "center", alignItems: "center", overflow: "hidden", opacity }}>
      <div style={{ width: 1180, transform: `translateX(${interpolate(s, [0, 1], [50, 0])}px) scale(${interpolate(local, [0, each], [1.0, 1.05])})`, opacity: s }}>
        <BrowserFrame src={REEL[active]} />
      </div>
      <div style={{ position: "absolute", bottom: 70, left: 0, right: 0 }}>{caption}</div>
    </AbsoluteFill>
  );
};

// ── CTA ──────────────────────────────────────────────────────────────
const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const portrait = usePortrait();
  const opacity = useSceneFade(T.cta);
  const s = spring({ frame, fps, config: { damping: 16 } });
  return (
    <AbsoluteFill style={{ background: COLORS.ink, justifyContent: "center", alignItems: "center", textAlign: "center", padding: 40, opacity }}>
      <div style={{ fontFamily: fraunces, fontSize: portrait ? 84 : 132, fontWeight: 600, color: COLORS.paper, transform: `scale(${interpolate(s, [0, 1], [0.86, 1])})` }}>
        Get found. <span style={{ color: COLORS.accent, fontStyle: "italic" }}>Get booked.</span>
      </div>
      <span style={{ fontFamily: archivo, fontSize: portrait ? 22 : 28, letterSpacing: 4, color: `${COLORS.paper}b0`, marginTop: 30, opacity: interpolate(frame, [20, 40], [0, 1], clampOpts) }}>WhatsApp · felipe.muner@gmail.com</span>
    </AbsoluteFill>
  );
};

// ── composition ──────────────────────────────────────────────────────
const ORDER: Array<[keyof typeof T, React.ReactNode]> = [
  ["roast", <Roast key="roast" />],
  ["imagine", <Imagine key="imagine" />],
  ["fGym", <Feature key="g" len={T.fGym} index={0} {...CUSTOMER_FEATURES[0]} />],
  ["moon", <MoonCalendar key="moon" />],
  ["fMenu", <Feature key="m" len={T.fMenu} index={1} {...CUSTOMER_FEATURES[1]} />],
  ["fVilla", <Feature key="v" len={T.fVilla} index={2} {...CUSTOMER_FEATURES[2]} badges={INTEGRATIONS} />],
  ["payout", <Payouts key="p" />],
  ["dive", <Dive key="d" />],
  ["reel", <Reel key="reel" />],
  ["cta", <CTA key="cta" />],
];

let _acc = 0;
const STARTS = ORDER.map(([k]) => {
  const s = _acc;
  _acc += T[k];
  return s;
});

export const Showreel: React.FC = () => (
  <AbsoluteFill style={{ background: COLORS.ink }}>
    {ORDER.map(([k, node], i) => (
      <Sequence key={k} from={STARTS[i]} durationInFrames={T[k]}>
        {node}
      </Sequence>
    ))}
    <Vignette />
  </AbsoluteFill>
);

export const SHOWREEL_DURATION = Object.values(T).reduce((a, b) => a + b, 0);

import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, fraunces, archivo, FEATURED, PACKAGES } from "./theme";
import { BrowserFrame } from "./BrowserFrame";

// ── scene timing (30fps) ─────────────────────────────────────────────
const MONT_EACH = 46; // frames each template holds in the montage
const T = {
  open: 60,
  title: 110,
  montage: FEATURED.length * MONT_EACH,
  values: 120,
  packages: 130,
  cta: 88,
};

const clampOpts = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Fade a scene's content in at the start and out before it ends. */
const useSceneFade = (len: number, pad = 12) => {
  const f = useCurrentFrame();
  return interpolate(f, [0, pad, len - pad, len], [0, 1, 1, 0], clampOpts);
};

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(120% 120% at 50% 40%, transparent 55%, rgba(0,0,0,0.28) 100%)",
      pointerEvents: "none",
    }}
  />
);

// ── 1. cold open ─────────────────────────────────────────────────────
const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const portrait = height > width;
  const fs = portrait ? 34 : 46;
  const ls = portrait ? 10 : 14;
  const s = spring({ frame, fps, config: { damping: 200 } });
  const opacity = useSceneFade(T.open);
  const blink = Math.floor(frame / 15) % 2 === 0 ? 1 : 0;

  return (
    <AbsoluteFill
      style={{
        background: COLORS.ink,
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          transform: `translateY(${interpolate(s, [0, 1], [22, 0])}px)`,
        }}
      >
        <span
          style={{
            fontFamily: archivo,
            color: COLORS.paper,
            fontSize: fs,
            fontWeight: 700,
            letterSpacing: ls,
            paddingLeft: ls,
          }}
        >
          FELIPE MUNER
        </span>
        <span
          style={{
            width: fs * 0.42,
            height: fs,
            marginLeft: 10,
            background: COLORS.accent,
            opacity: blink,
          }}
        />
      </div>
      <span
        style={{
          fontFamily: archivo,
          color: `${COLORS.paper}80`,
          fontSize: fs * 0.43,
          letterSpacing: portrait ? 5 : 8,
          marginTop: 22,
          textTransform: "uppercase",
          opacity: interpolate(frame, [18, 34], [0, 1], clampOpts),
        }}
      >
        Web design · done for you
      </span>
    </AbsoluteFill>
  );
};

// ── 2. title ─────────────────────────────────────────────────────────
const Word: React.FC<{ children: React.ReactNode; delay: number; color?: string; italic?: boolean }> = ({
  children,
  delay,
  color = COLORS.ink,
  italic,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 90 } });
  return (
    <span
      style={{
        display: "inline-block",
        color,
        fontStyle: italic ? "italic" : "normal",
        transform: `translateY(${interpolate(s, [0, 1], [90, 0])}px)`,
        opacity: s,
      }}
    >
      {children}
    </span>
  );
};

const TitleScene: React.FC = () => {
  const { width, height } = useVideoConfig();
  const portrait = height > width;
  const opacity = useSceneFade(T.title);
  return (
    <AbsoluteFill
      style={{
        background: COLORS.paper,
        justifyContent: "center",
        paddingLeft: portrait ? 70 : 130,
        paddingRight: portrait ? 60 : 0,
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: fraunces,
          fontSize: portrait ? 96 : 150,
          lineHeight: 1.02,
          fontWeight: 600,
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <Word delay={0}>29 websites,</Word>
        </div>
        <div style={{ overflow: "hidden", marginTop: 4 }}>
          <Word delay={8}>ready to&nbsp;</Word>
          <Word delay={16} color={COLORS.accent} italic>
            make yours.
          </Word>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── 3. montage — one large, centered site at a time ──────────────────
const Shot: React.FC<{ src: string; label: string; name: string; index: number }> = ({
  src,
  label,
  name,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const portrait = height > width;
  const opacity = useSceneFade(MONT_EACH, 7);
  const s = spring({ frame, fps, config: { damping: 22, stiffness: 65 } });
  const kb = interpolate(frame, [0, MONT_EACH], [1.0, 1.07]); // ken-burns
  const fromLeft = index % 2 === 0;
  const x = interpolate(s, [0, 1], [fromLeft ? -90 : 90, 0]);
  const frameW = portrait ? Math.round(width * 0.94) : 1380;

  const frameEl = (
    <div
      style={{
        width: frameW,
        transform: `translateX(${x}px) translateY(${interpolate(s, [0, 1], [50, 0])}px) scale(${kb})`,
        opacity: s,
      }}
    >
      <BrowserFrame src={src} />
    </div>
  );
  const nameEl = (
    <span style={{ fontFamily: fraunces, fontStyle: "italic", fontSize: portrait ? 68 : 52, color: COLORS.accent }}>
      {name}
    </span>
  );
  const labelEl = (
    <span
      style={{
        fontFamily: archivo,
        fontSize: portrait ? 26 : 22,
        fontWeight: 700,
        letterSpacing: 4,
        color: `${COLORS.ink}99`,
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );

  // Portrait: eyebrow + frame + caption stacked and centred as one group.
  if (portrait) {
    return (
      <AbsoluteFill
        style={{
          background: COLORS.paper,
          opacity,
          overflow: "hidden",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 56,
        }}
      >
        <span
          style={{
            fontFamily: archivo,
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 9,
            textTransform: "uppercase",
            color: `${COLORS.ink}66`,
          }}
        >
          Selected work
        </span>
        {frameEl}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {nameEl}
          {labelEl}
        </div>
      </AbsoluteFill>
    );
  }

  // Landscape: big centred frame with a bottom-left caption.
  return (
    <AbsoluteFill
      style={{
        background: COLORS.paper,
        opacity,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {frameEl}
      <div style={{ position: "absolute", bottom: 64, left: 90, display: "flex", flexDirection: "column" }}>
        {nameEl}
        {labelEl}
      </div>
    </AbsoluteFill>
  );
};

const Montage: React.FC = () => (
  <AbsoluteFill>
    {FEATURED.map((f, i) => (
      <Sequence key={f.src} from={i * MONT_EACH} durationInFrames={MONT_EACH}>
        <Shot src={f.src} label={f.label} name={f.name} index={i} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

// ── 4. value props ───────────────────────────────────────────────────
const VALUES = ["Your brand.", "Live in a week.", "Built to win customers."];
const ValuesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const portrait = height > width;
  const opacity = useSceneFade(T.values);
  return (
    <AbsoluteFill
      style={{
        background: COLORS.ink,
        justifyContent: "center",
        alignItems: "center",
        gap: portrait ? 18 : 10,
        padding: 40,
        textAlign: "center",
        opacity,
      }}
    >
      {VALUES.map((v, i) => {
        const s = spring({ frame: frame - 10 - i * 16, fps, config: { damping: 16, stiffness: 120 } });
        return (
          <div
            key={v}
            style={{
              fontFamily: fraunces,
              fontSize: portrait ? 74 : 96,
              fontWeight: 600,
              color: COLORS.paper,
              transform: `scale(${interpolate(s, [0, 1], [0.8, 1])})`,
              opacity: s,
            }}
          >
            {v.slice(0, -1)}
            <span style={{ color: COLORS.accent }}>.</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ── 5. packages ──────────────────────────────────────────────────────
const PackagesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const portrait = height > width;
  const opacity = useSceneFade(T.packages);
  const cardW = portrait ? Math.round(width * 0.78) : 380;
  return (
    <AbsoluteFill
      style={{
        background: COLORS.paper,
        justifyContent: "center",
        alignItems: "center",
        gap: portrait ? 26 : 34,
        flexDirection: portrait ? "column" : "row",
        opacity,
      }}
    >
      {PACKAGES.map((p, i) => {
        const s = spring({ frame: frame - i * 10, fps, config: { damping: 18, stiffness: 90 } });
        const featured = "featured" in p && p.featured;
        const cardH = portrait ? (featured ? 300 : 268) : featured ? 460 : 410;
        return (
          <div
            key={p.name}
            style={{
              width: cardW,
              height: cardH,
              borderRadius: 26,
              background: featured ? COLORS.ink : COLORS.white,
              color: featured ? COLORS.paper : COLORS.ink,
              boxShadow: "0 40px 80px rgba(0,0,0,0.18)",
              padding: portrait ? 40 : 44,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              transform: `translateY(${interpolate(s, [0, 1], [80, 0])}px)`,
              opacity: s,
            }}
          >
            {featured ? (
              <span
                style={{
                  alignSelf: "flex-start",
                  background: COLORS.accent,
                  color: COLORS.white,
                  fontFamily: archivo,
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: 2,
                  padding: "8px 16px",
                  borderRadius: 999,
                  marginBottom: "auto",
                }}
              >
                MOST POPULAR
              </span>
            ) : null}
            <span style={{ fontFamily: fraunces, fontSize: portrait ? 60 : 58, fontWeight: 600 }}>{p.name}</span>
            <span style={{ fontFamily: archivo, fontSize: 30, opacity: 0.8, marginTop: 8 }}>
              from ${p.price}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ── 6. CTA ───────────────────────────────────────────────────────────
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const portrait = height > width;
  const opacity = useSceneFade(T.cta);
  const s = spring({ frame, fps, config: { damping: 16 } });
  return (
    <AbsoluteFill
      style={{
        background: COLORS.ink,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 40,
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: fraunces,
          fontSize: portrait ? 82 : 132,
          fontWeight: 600,
          color: COLORS.paper,
          transform: `scale(${interpolate(s, [0, 1], [0.86, 1])})`,
        }}
      >
        Let&apos;s build{" "}
        <span style={{ color: COLORS.accent, fontStyle: "italic" }}>yours.</span>
      </div>
      <span
        style={{
          fontFamily: archivo,
          fontSize: portrait ? 22 : 28,
          letterSpacing: 4,
          color: `${COLORS.paper}b0`,
          marginTop: 30,
          opacity: interpolate(frame, [20, 40], [0, 1], clampOpts),
        }}
      >
        WhatsApp · felipe.muner@gmail.com
      </span>
    </AbsoluteFill>
  );
};

// ── composition ──────────────────────────────────────────────────────
// Cumulative start frame for each scene (no render-time mutation).
const OFF = {
  open: 0,
  title: T.open,
  montage: T.open + T.title,
  values: T.open + T.title + T.montage,
  packages: T.open + T.title + T.montage + T.values,
  cta: T.open + T.title + T.montage + T.values + T.packages,
};

export const Showreel: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.ink }}>
      <Sequence from={OFF.open} durationInFrames={T.open}>
        <ColdOpen />
      </Sequence>
      <Sequence from={OFF.title} durationInFrames={T.title}>
        <TitleScene />
      </Sequence>
      <Sequence from={OFF.montage} durationInFrames={T.montage}>
        <Montage />
      </Sequence>
      <Sequence from={OFF.values} durationInFrames={T.values}>
        <ValuesScene />
      </Sequence>
      <Sequence from={OFF.packages} durationInFrames={T.packages}>
        <PackagesScene />
      </Sequence>
      <Sequence from={OFF.cta} durationInFrames={T.cta}>
        <CTAScene />
      </Sequence>
      <Vignette />
    </AbsoluteFill>
  );
};

export const SHOWREEL_DURATION = T.open + T.title + T.montage + T.values + T.packages + T.cta;

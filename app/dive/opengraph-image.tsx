import { ImageResponse } from "next/og";

// Social share image (WhatsApp, Facebook, X…) for the Aqua Sport Supply shop.
export const alt = "Aqua Sport Supply — the island dive shop, online";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ABYSS = "#04263b";
const REEF = "#0a4d6e";
const CYAN = "#2ed3e8";

const PILLS = ["PromptPay · Cards · Apple / Google Pay", "Free island delivery", "Shop online 24/7"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          position: "relative",
          background: `linear-gradient(150deg, ${REEF} 0%, ${ABYSS} 55%, #021723 100%)`,
          color: "#ffffff",
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Ambient cyan glow, top-right */}
        <div
          style={{
            position: "absolute",
            top: -260,
            right: -220,
            width: 640,
            height: 640,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${CYAN}59 0%, ${CYAN}00 68%)`,
            display: "flex",
          }}
        />
        {/* Deep glow, bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: -280,
            left: -180,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${REEF}cc 0%, ${REEF}00 70%)`,
            display: "flex",
          }}
        />

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 96,
              borderRadius: 24,
              background: CYAN,
            }}
          >
            <svg width="58" height="58" viewBox="0 0 24 24" fill="none" stroke={ABYSS} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" />
              <path d="M2 17c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" />
              <path d="M2 7c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: -0.5 }}>Aqua Sport Supply</div>
            <div style={{ fontSize: 22, color: "#8fc7d6", letterSpacing: 4 }}>
              DIVE SHOP · KO PHA NGAN, THAILAND
            </div>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.0, letterSpacing: -1.5 }}>
            The island dive shop,
          </div>
          <div style={{ display: "flex", fontSize: 88, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5 }}>
            <span style={{ color: CYAN, fontStyle: "italic" }}>now online.</span>
          </div>
          <div style={{ marginTop: 24, fontSize: 31, color: "#cfe9ef", maxWidth: 940, lineHeight: 1.3 }}>
            Masks, fins, regulators, BCDs &amp; dive computers — Oceanic, Aqua&nbsp;Lung, Atomic,
            Garmin &amp; more, delivered across the island.
          </div>
        </div>

        {/* Highlights */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {PILLS.map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                border: `2px solid ${CYAN}59`,
                background: "rgba(255,255,255,0.07)",
                borderRadius: 999,
                padding: "13px 26px",
                fontSize: 24,
                color: "#dff3f8",
                fontWeight: 600,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}

import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * One horizontal-rail card: a browser window that scrolls a captured template
 * screenshot top → bottom → top, so the clip loops seamlessly under `<video loop>`.
 *
 * Rendered once per template by scripts/render-rail.ts, which feeds `slug` +
 * source dimensions from public/img/rail/manifest.json via --props.
 */
export type RailClipProps = {
  slug: string;
  /** Logical capture size (CSS px) from the manifest — used only for aspect. */
  srcWidth: number;
  srcHeight: number;
  label: string;
};

export const RAIL_FPS = 30;
export const RAIL_DURATION = 165; // 5.5s — unhurried, reads as a real scroll

// Card geometry (must stay even for h264). Content area is 16:10, matching the
// 1440×900 capture viewport; a slim macOS chrome bar sits on top.
const CHROME = 40;
const CONTENT_W = 1200;
const CONTENT_H = 750;

const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

export const RailClip: React.FC<RailClipProps> = ({ slug, srcWidth, srcHeight, label }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // The screenshot is fit to the content width; this is its scaled height.
  const scaledH = CONTENT_W * (srcHeight / srcWidth);
  const pan = Math.max(0, scaledH - CONTENT_H);

  // Hold top → scroll to bottom → hold → scroll back to top. Symmetric, so the
  // first and last frame are identical and the loop has no visible seam.
  const t = frame / durationInFrames;
  const phase = interpolate(
    t,
    [0, 0.12, 0.5, 0.62, 1],
    [0, 0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const y = -pan * easeInOut(phase);

  return (
    <AbsoluteFill style={{ background: "#0e0d0b" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 22,
          overflow: "hidden",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* macOS-style title bar */}
        <div
          style={{
            height: CHROME,
            flexShrink: 0,
            background: "#e9e6df",
            display: "flex",
            alignItems: "center",
            gap: 9,
            paddingLeft: 18,
          }}
        >
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div key={c} style={{ width: 13, height: 13, borderRadius: 999, background: c }} />
          ))}
          <div
            style={{
              marginLeft: 14,
              height: 22,
              flex: 1,
              maxWidth: 420,
              borderRadius: 999,
              background: "rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              paddingLeft: 14,
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              fontSize: 12,
              color: "#8a857b",
              letterSpacing: 0.2,
            }}
          >
            {label.toLowerCase().replace(/\s+/g, "")}.com
          </div>
        </div>

        {/* Scrolling page */}
        <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
          <Img
            src={staticFile(`img/rail/${slug}.png`)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${y}px)`,
              willChange: "transform",
              display: "block",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

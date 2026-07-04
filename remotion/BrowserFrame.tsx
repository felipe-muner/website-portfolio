import React from "react";
import { Img, staticFile } from "remotion";

/** A macOS-style browser window wrapping a template screenshot. */
export const BrowserFrame: React.FC<{
  src: string;
  style?: React.CSSProperties;
}> = ({ src, style }) => {
  return (
    <div
      style={{
        borderRadius: 20,
        overflow: "hidden",
        background: "#ffffff",
        boxShadow: "0 50px 110px rgba(0,0,0,0.38)",
        ...style,
      }}
    >
      <div
        style={{
          height: 40,
          background: "#e9e6df",
          display: "flex",
          alignItems: "center",
          gap: 9,
          paddingLeft: 18,
        }}
      >
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div
            key={c}
            style={{ width: 13, height: 13, borderRadius: 999, background: c }}
          />
        ))}
      </div>
      <Img
        src={staticFile(`img/showreel/${src}.png`)}
        style={{ width: "100%", display: "block" }}
      />
    </div>
  );
};

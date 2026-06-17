import { ImageResponse } from "next/og";

// Imagem de compartilhamento (WhatsApp, Facebook, X…) — gerada como PNG real.
export const alt = "Sacolaria Brasil — Sacolas plásticas no atacado";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PILLS = ["Pix com 5% off", "Até 12x sem juros", "Entrega para todo o Brasil"];

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
          background: "linear-gradient(135deg, #0e4937 0%, #0b3d2e 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* marca */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 96,
              borderRadius: 22,
              background: "#f5c518",
              color: "#0b3d2e",
              fontSize: 44,
              fontWeight: 800,
            }}
          >
            SB
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 40, fontWeight: 800 }}>Sacolaria Brasil</div>
            <div style={{ fontSize: 22, color: "#9cc2b2", letterSpacing: 2 }}>
              SACOLAS PLÁSTICAS · ATACADO
            </div>
          </div>
        </div>

        {/* título */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 86, fontWeight: 800, lineHeight: 1.02 }}>Sacolas plásticas</div>
          <div style={{ fontSize: 86, fontWeight: 800, lineHeight: 1.02, color: "#f5c518" }}>
            no atacado.
          </div>
          <div style={{ marginTop: 22, fontSize: 30, color: "#cfe6db" }}>
            Boca de palhaço · Alça camiseta · Linha reciclada
          </div>
        </div>

        {/* destaques */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {PILLS.map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                border: "2px solid #2c5747",
                background: "#0e4937",
                borderRadius: 999,
                padding: "12px 24px",
                fontSize: 24,
                color: "#d8efe4",
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

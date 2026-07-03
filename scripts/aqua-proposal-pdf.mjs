// Client-facing one-page proposal / roadmap for Aqua Sport Supply (no prices):
// what's built, how payments work, and the Phase 2 owner dashboard (cash flow
// in/out, stock control, accountant sales reports with filters).
// Usage: node scripts/aqua-proposal-pdf.mjs
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { writeFileSync } from "node:fs";

const ABYSS = [4, 38, 59];
const REEF = [10, 77, 110];
const CYAN = [46, 211, 232];
const INK = [16, 38, 48];
const GRAY = [86, 114, 123];
const LIGHT = [240, 247, 249];
const CARD = [231, 244, 247];

const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
const PW = 210;
const PH = 297;
const M = 15;
const W = PW - M * 2;
const MONTH = new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" });

function wave(x, y, color, s = 1) {
  doc.setDrawColor(...color);
  doc.setLineWidth(1.1 * s);
  for (let i = 0; i < 3; i++) {
    const yy = y + i * 2.4 * s;
    doc.lines([[2 * s, -1.5 * s], [2 * s, 1.5 * s], [2 * s, -1.5 * s], [2 * s, 1.5 * s]], x, yy);
  }
}
function eyebrow(t, y) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...CYAN);
  doc.text(t.toUpperCase(), M, y);
  doc.setDrawColor(...CYAN);
  doc.setLineWidth(0.5);
  const tw = doc.getTextWidth(t.toUpperCase());
  doc.line(M + tw + 4, y - 1.1, PW - M, y - 1.1);
}
function para(t, y, size = 9, color = GRAY, lineH = 4.4, w = W, x = M) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(size);
  doc.setTextColor(...color);
  const lines = doc.splitTextToSize(t, w);
  doc.text(lines, x, y);
  return y + lines.length * lineH;
}

// ---------- Header band ----------
doc.setFillColor(...ABYSS);
doc.rect(0, 0, PW, 30, "F");
doc.setFillColor(...REEF);
doc.rect(0, 27, PW, 3, "F");
wave(M, 13, CYAN, 1.05);
doc.setFont("helvetica", "bold");
doc.setTextColor(255, 255, 255);
doc.setFontSize(16);
doc.text("Aqua Sport Supply", M + 12, 15);
doc.setFont("helvetica", "normal");
doc.setTextColor(150, 210, 224);
doc.setFontSize(9);
doc.text("Your dive shop, now selling online — proposal & roadmap", M + 12, 21.5);
doc.setTextColor(...CYAN);
doc.setFontSize(8);
doc.text("KO PHA NGAN · THAILAND", PW - M, 15, { align: "right" });

// ---------- Intro ----------
let y = 41;
y = para(
  "A complete online store for your gear — built, mobile-ready and payment-ready — plus a clear plan for the owner dashboard that keeps your cash flow, stock and accounting under control.",
  y,
  10,
  INK,
  4.8,
);

// ---------- Phase 1: what's built ----------
y += 4;
eyebrow("Phase 1 — the online shop (built)", y);
y += 6;
const FEATURES = [
  ["Real gear catalogue", "Live photos, prices, brands & stock."],
  ["Filters & search", "By category, brand and price."],
  ["Cart & checkout", "Quantities, free-delivery, clean checkout."],
  ["Payment-ready", "PromptPay, cards, Apple / Google Pay."],
  ["Mobile + WhatsApp", "Slide-out menu, one-tap chat button."],
  ["Fast & shareable", "Map, hours & a branded share image."],
];
const cW = (W - 8) / 2;
const cH = 15;
FEATURES.forEach((f, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = M + col * (cW + 8);
  const cy = y + row * (cH + 5);
  doc.setFillColor(...CARD);
  doc.roundedRect(x, cy, cW, cH, 2.5, 2.5, "F");
  doc.setFillColor(...CYAN);
  doc.roundedRect(x + 5, cy + 5, 5, 5, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...ABYSS);
  doc.text(f[0], x + 13, cy + 6.4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.text(f[1], x + 13, cy + 11);
});
y += 3 * (cH + 5) + 2;

// ---------- Payments ----------
eyebrow("How you get paid", y);
y += 6;
const STEPS = ["Customer pays", "Provider confirms", "You're paid & notified"];
const sW = (W - 2 * 6) / 3;
STEPS.forEach((s, i) => {
  const x = M + i * (sW + 6);
  doc.setFillColor(...LIGHT);
  doc.roundedRect(x, y, sW, 13, 2.5, 2.5, "F");
  doc.setFillColor(...CYAN);
  doc.circle(x + 7, y + 6.5, 3.6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text(String(i + 1), x + 7, y + 7.7, { align: "center" });
  doc.setTextColor(...ABYSS);
  doc.setFontSize(9);
  doc.text(s, x + 13, y + 7.8);
  if (i < 2) {
    doc.setTextColor(...CYAN);
    doc.setFontSize(11);
    doc.text(">", x + sW + 1.6, y + 8.2);
  }
});
y += 17;
y = para(
  "You pick the provider — all four support PromptPay, cards and Apple / Google Pay. Typical fees per sale:",
  y,
  9,
  GRAY,
  4.4,
);
y += 2;
autoTable(doc, {
  startY: y,
  margin: { left: M, right: M },
  head: [["Provider", "Cards", "PromptPay", "Apple / Google Pay", "Notes"]],
  body: [
    ["Stripe", "~3.65%", "~1.65%", "Yes", "Cleanest for visiting tourists"],
    ["Opn Payments", "~3.65%", "~1.65%", "Yes", "Widest Thai wallets; negotiable"],
    ["2C2P", "By quote", "By quote", "Yes", "Volume & card installments"],
    ["GB Prime Pay", "~3.2%", "~0.8%", "Partial", "Cheapest PromptPay; Thai SMEs"],
  ],
  theme: "grid",
  headStyles: { fillColor: ABYSS, textColor: [255, 255, 255], fontSize: 7.6, fontStyle: "bold" },
  bodyStyles: { fontSize: 7.6, textColor: [40, 55, 60] },
  alternateRowStyles: { fillColor: LIGHT },
  styles: { lineColor: [210, 226, 229], cellPadding: 1.6 },
  columnStyles: {
    0: { cellWidth: 34, fontStyle: "bold" },
    1: { cellWidth: 20, halign: "center" },
    2: { cellWidth: 24, halign: "center" },
    3: { cellWidth: 26, halign: "center" },
    4: { cellWidth: W - 34 - 20 - 24 - 26 },
  },
});
y = doc.lastAutoTable.finalY + 3;
doc.setFont("helvetica", "italic");
doc.setFontSize(7);
doc.setTextColor(...GRAY);
y = para(
  "Indicative only, before 7% VAT — the fee is paid to the provider per sale, not to us. Please confirm current pricing directly with each provider before deciding, as rates are set and updated on their side.",
  y,
  7,
  GRAY,
  3.4,
);

// ---------- Phase 2 ----------
y += 5;
eyebrow("Phase 2 — your owner dashboard", y);
y += 6.5;
const P2 = [
  ["Cash flow in & out", "money spent restocking vs. money from sales, with live profit at a glance."],
  ["Live stock control", "every sale lowers stock, every restock raises it, with low-stock alerts."],
  ["Accountant reports", "one-click sales export — filter by product, brand & date range, with a VAT summary."],
];
P2.forEach((p) => {
  doc.setFillColor(...CYAN);
  doc.circle(M + 2, y - 1.2, 1.7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...ABYSS);
  doc.text(`${p[0]} — `, M + 6, y);
  const lead = doc.getTextWidth(`${p[0]} — `);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GRAY);
  doc.setFontSize(9);
  const lines = doc.splitTextToSize(p[1], W - 6 - lead);
  doc.text(lines[0], M + 6 + lead, y);
  if (lines[1]) doc.text(lines.slice(1).join(" "), M + 6, y + 4.4);
  y += lines[1] ? 9.5 : 6.5;
});

// ---------- CTA ----------
y += 4;
doc.setFillColor(...ABYSS);
doc.roundedRect(M, y, W, 18, 3, 3, "F");
doc.setFont("helvetica", "bold");
doc.setFontSize(9.5);
doc.setTextColor(...CYAN);
doc.text("Ready when you are", M + 6, y + 7);
doc.setFont("helvetica", "normal");
doc.setFontSize(8.6);
doc.setTextColor(255, 255, 255);
doc.text(
  doc.splitTextToSize(
    "The store is live and waiting — the moment you choose a payment provider, Aqua Sport Supply can start taking orders online, and we build the dashboard alongside your first sales.",
    W - 12,
  ),
  M + 6,
  y + 12,
);

// ---------- Footer ----------
doc.setDrawColor(...REEF);
doc.setLineWidth(0.3);
doc.line(M, PH - 12, PW - M, PH - 12);
doc.setFont("helvetica", "normal");
doc.setFontSize(7);
doc.setTextColor(...GRAY);
doc.text("Aqua Sport Supply · online shop proposal", M, PH - 7);
doc.text(MONTH, PW - M, PH - 7, { align: "right" });

const out = new URL("../aqua-sport-supply-proposal.pdf", import.meta.url);
writeFileSync(out, Buffer.from(doc.output("arraybuffer")));
console.log("PDF generated:", out.pathname, "— pages:", doc.getNumberOfPages());

// Generates the Aqua Sport Supply "how the shop takes payments" PDF:
// a flow diagram (customer -> cart -> payment -> provider confirms -> owner
// notified) plus a Thailand payment-provider comparison for the customer.
// Usage: node scripts/aqua-payments-pdf.mjs
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { writeFileSync } from "node:fs";

// Ocean palette (matches the dive site)
const ABYSS = [4, 38, 59];
const REEF = [10, 77, 110];
const CYAN = [46, 211, 232];
const INK = [16, 38, 48];
const GRAY = [86, 114, 123];
const LIGHT = [240, 247, 249];

// Actor colours for the flow diagram
const CUSTOMER = [13, 127, 151]; // end customer (teal)
const SITE = [10, 77, 110]; // our website (reef navy)
const PROVIDER = [17, 140, 120]; // payment provider (seafoam)

const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
const PW = 210;
const M = 14;
const W = PW - M * 2;

const heading = (t, yy) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...ABYSS);
  doc.text(t, M, yy);
};
const para = (t, yy, size = 9, color = GRAY, lineH = 4.5, w = W) => {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(size);
  doc.setTextColor(...color);
  const lines = doc.splitTextToSize(t, w);
  doc.text(lines, M, yy);
  return yy + lines.length * lineH;
};

// ---------- Header ----------
function header() {
  doc.setFillColor(...ABYSS);
  doc.rect(0, 0, PW, 30, "F");
  // little wave mark
  doc.setDrawColor(...CYAN);
  doc.setLineWidth(1.1);
  doc.line(M, 14, M + 4, 12.5);
  doc.line(M + 4, 12.5, M + 8, 14);
  doc.line(M, 17, M + 4, 15.5);
  doc.line(M + 4, 15.5, M + 8, 17);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text("Aqua Sport Supply", M + 12, 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(150, 210, 224);
  doc.text("How the online shop takes payments", M + 12, 20.5);
  doc.setTextColor(...CYAN);
  doc.setFontSize(8);
  doc.text("PromptPay · Cards · Apple / Google Pay", PW - M, 18, { align: "right" });
}

// ---------- Footer ----------
function footer() {
  doc.setDrawColor(...REEF);
  doc.setLineWidth(0.3);
  doc.line(M, 286, PW - M, 286);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...GRAY);
  doc.text("Aqua Sport Supply · Ko Pha Ngan, Thailand", M, 291);
  doc.text("PromptPay · Cards · Apple / Google Pay", PW - M, 291, { align: "right" });
}

// ============================ PAGE 1 — the flow ============================
header();
let y = 40;

heading("How a sale works, start to finish", y);
y += 6;
y = para(
  "Your shop already lets customers browse the real gear catalogue, add items to a cart and reach the " +
    "checkout screen. The last step to go live is connecting a payment provider so cards and PromptPay are " +
    "actually charged. Here is exactly what happens on every order.",
  y,
);
y += 3;

// actor legend
const legend = [
  ["End customer", CUSTOMER],
  ["Our website", SITE],
  ["Payment provider", PROVIDER],
];
let lx = M;
doc.setFontSize(8);
legend.forEach(([label, color]) => {
  doc.setFillColor(...color);
  doc.circle(lx + 2, y - 1, 1.8, "F");
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.text(label, lx + 5.5, y);
  lx += doc.getTextWidth(label) + 16;
});
y += 6;

// step cards
function stepCard(n, color, actor, title, desc) {
  const h = 21;
  doc.setFillColor(...LIGHT);
  doc.roundedRect(M, y, W, h, 2.6, 2.6, "F");
  // number badge
  doc.setFillColor(...color);
  doc.circle(M + 12, y + h / 2, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(String(n), M + 12, y + h / 2 + 1.6, { align: "center" });
  // actor tag (right)
  doc.setFontSize(6.8);
  doc.setTextColor(...color);
  doc.text(actor.toUpperCase(), PW - M - 4, y + 6, { align: "right" });
  // title + desc
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(...INK);
  doc.text(title, M + 24, y + 9);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.3);
  doc.setTextColor(...GRAY);
  doc.text(doc.splitTextToSize(desc, W - 24 - 34), M + 24, y + 14.5);
  y += h;
  // connector arrow
  doc.setDrawColor(190, 205, 210);
  doc.setLineWidth(0.5);
  doc.line(M + 12, y + 1, M + 12, y + 4.5);
  doc.setFillColor(190, 205, 210);
  doc.triangle(M + 10, y + 4, M + 14, y + 4, M + 12, y + 6.2, "F");
  y += 7;
}

stepCard(1, CUSTOMER, "End customer", "Adds gear to the cart",
  "The diver browses the shop, adds masks, fins or a regulator and opens their cart.");
stepCard(2, SITE, "Our website", "We show the payment step",
  "At checkout the site presents the ways to pay — PromptPay QR, credit / debit card, or Apple / Google Pay.");
stepCard(3, CUSTOMER, "End customer", "Pays for the order",
  "They scan the PromptPay QR, enter a card, or tap Apple / Google Pay — handled securely by the provider.");
stepCard(4, PROVIDER, "Payment provider", "Confirms the payment to us",
  "The provider processes the charge and tells our website the result — “paid” or “declined”.");
stepCard(5, SITE, "Our website", "Order confirmed — you're notified",
  "On “paid” we mark the order complete, show the customer a receipt, and alert you so you can prepare it.");

y = para(
  "The five steps are identical whichever method the customer picks — PromptPay, card or Apple / Google Pay. " +
    "The money settles into your Thai bank account; you never handle card details yourself.",
  y + 1,
  8.5,
  REEF,
);

footer();

// ==================== PAGE 2 — choosing a provider ====================
doc.addPage();
header();
y = 40;

heading("Choose a payment provider", y);
y += 6;
y = para(
  "The provider is the company that actually moves the money (like an online card machine). These four all " +
    "work in Thailand and cover PromptPay, cards and Apple / Google Pay. Fees are per successful sale — pick " +
    "the one that fits how you sell.",
  y,
);
y += 2;

autoTable(doc, {
  startY: y,
  margin: { left: M, right: M },
  head: [["Provider", "Prompt-\nPay", "Cards", "Apple /\nGoogle Pay", "Card fee", "PromptPay fee", "Best for"]],
  body: [
    ["Stripe", "Yes", "Yes", "Yes", "~3.65%", "~1.65%", "Visiting divers; cleanest checkout & one-tap wallets"],
    ["Opn Payments\n(was Omise)", "Yes", "Yes", "Yes", "~3.65%", "~1.65%", "Widest Thai wallets (TrueMoney, LINE Pay); negotiable"],
    ["2C2P", "Yes", "Yes", "Yes", "Quote", "Quote", "Higher volume, card installments, enterprise"],
    ["GB Prime Pay\n(now Xendit)", "Yes", "Yes", "Partial", "~3.2%", "~0.8%", "Thai SMEs; cheapest PromptPay; simple setup"],
  ],
  theme: "grid",
  headStyles: { fillColor: ABYSS, textColor: [255, 255, 255], fontSize: 8, fontStyle: "bold", valign: "middle" },
  bodyStyles: { fontSize: 8, textColor: [40, 55, 60], valign: "middle" },
  alternateRowStyles: { fillColor: LIGHT },
  styles: { lineColor: [210, 226, 229], cellPadding: 2 },
  columnStyles: {
    0: { cellWidth: 27, fontStyle: "bold" },
    1: { cellWidth: 15, halign: "center" },
    2: { cellWidth: 13, halign: "center" },
    3: { cellWidth: 19, halign: "center" },
    4: { cellWidth: 18, halign: "center" },
    5: { cellWidth: 20, halign: "center" },
    6: { cellWidth: W - 27 - 15 - 13 - 19 - 18 - 20 },
  },
});
y = doc.lastAutoTable.finalY + 3;

doc.setFont("helvetica", "italic");
doc.setFontSize(6.9);
doc.setTextColor(...GRAY);
y = para(
  "Indicative rates, before 7% VAT and before any volume discount — confirm the current pricing on each " +
    "provider's site. Left out on purpose: PayPal (no PromptPay) and Adyen (great, but aimed at big enterprises).",
  y,
  6.9,
  GRAY,
  3.4,
);
y += 4;

heading("What you'll need to switch it on", y);
y += 6;
y = para(
  "• A registered Thai company (or sole proprietor) and a Thai bank account for THB payouts\n" +
    "• KYC documents (company papers + ID) — approval is usually a few business days\n" +
    "• Your live domain and real contact details; payouts land in your account in about 1–3 days",
  y,
  9,
  INK,
  4.7,
);
y += 4;

// recommendation box
doc.setFillColor(...REEF);
doc.roundedRect(M, y, W, 20, 3, 3, "F");
doc.setFont("helvetica", "bold");
doc.setFontSize(9.5);
doc.setTextColor(...CYAN);
doc.text("Our recommendation", M + 5, y + 6.5);
doc.setFont("helvetica", "normal");
doc.setFontSize(8.6);
doc.setTextColor(255, 255, 255);
doc.text(
  doc.splitTextToSize(
    "Start with Stripe if most sales are to visiting divers — foreign cards, Apple / Google Pay and PromptPay " +
      "in one checkout, paid out in THB. Pick Opn Payments if you want the deepest Thai wallet coverage and room " +
      "to negotiate fees as you grow. Either way, the shop flow on page 1 stays exactly the same.",
    W - 10,
  ),
  M + 5,
  y + 11.5,
);

footer();

const out = new URL("../aqua-sport-supply-payments.pdf", import.meta.url);
writeFileSync(out, Buffer.from(doc.output("arraybuffer")));
console.log("PDF generated:", out.pathname, "— pages:", doc.getNumberOfPages());

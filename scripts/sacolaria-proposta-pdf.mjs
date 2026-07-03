// Gera a proposta da Sacolaria Brasil em PDF (1 página, marca verde + amarelo).
// Uso: node scripts/sacolaria-proposta-pdf.mjs
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { writeFileSync } from "node:fs";

// Paleta da marca
const GREEN = [11, 61, 46];
const EMERALD = [14, 122, 74];
const YELLOW = [245, 197, 24];
const INK = [35, 38, 31];
const GRAY = [91, 95, 87];
const LIGHT = [244, 241, 234];

const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
const PW = 210;
const M = 14;
const W = PW - M * 2;

// ---------- Cabeçalho ----------
doc.setFillColor(...GREEN);
doc.rect(0, 0, PW, 32, "F");
doc.setFillColor(...YELLOW);
doc.roundedRect(M, 8, 16, 16, 3, 3, "F");
doc.setTextColor(...GREEN);
doc.setFont("helvetica", "bold");
doc.setFontSize(13);
doc.text("SB", M + 8, 18.5, { align: "center" });
doc.setTextColor(255, 255, 255);
doc.setFontSize(17);
doc.text("Sacolaria Brasil", M + 21, 15);
doc.setFont("helvetica", "normal");
doc.setFontSize(9);
doc.setTextColor(200, 226, 213);
doc.text("Proposta · Sua loja de sacolas vendendo online", M + 21, 22);
doc.setTextColor(...YELLOW);
doc.setFontSize(8);
doc.text("Pix · Cartão · Boleto", PW - M, 19, { align: "right" });

let y = 42;

const heading = (t) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11.5);
  doc.setTextColor(...GREEN);
  doc.text(t, M, y);
  y += 5.5;
};
const para = (t, size = 9, color = GRAY, lineH = 4.4) => {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(size);
  doc.setTextColor(...color);
  const lines = doc.splitTextToSize(t, W);
  doc.text(lines, M, y);
  y += lines.length * lineH;
};

// ---------- Intro ----------
heading("Como sua loja vai vender online");
para(
  "Hoje o site é uma demonstração: o cliente já navega, escolhe tamanho e cor, monta o carrinho e " +
    "vê as telas de pagamento — mas ainda não há cobrança real. Abaixo, como ele se torna uma loja de verdade.",
);
y += 1.5;

// ---------- Como a venda acontece ----------
heading("Como a venda acontece");
para(
  "1) O cliente escolhe as sacolas e a quantidade de pacotes   2) Coloca no carrinho   " +
    "3) Paga no Pix (na hora) ou no cartão (à vista ou parcelado)   4) Você recebe o pedido e envia.",
  9,
  INK,
);
para(
  "Para processar Pix e cartão, a loja se conecta a uma empresa de pagamentos (a \"maquininha\" online). " +
    "O dinheiro cai direto na SUA conta. Como em qualquer maquininha, há uma pequena taxa por venda.",
);
y += 2;

// ---------- Tabela 1: meios de pagamento ----------
heading("Comparativo das empresas de pagamento");
autoTable(doc, {
  startY: y,
  margin: { left: M, right: M },
  head: [["Empresa", "Pix", "Cartão crédito", "Boleto", "Cadastro", "Observação"]],
  body: [
    ["Mercado Pago  ★", "~0,99%", "~3,98% a 4,98%", "~R$3,49", "Fácil (CPF/CNPJ)", "A mais usada por PMEs; Pix cai na hora"],
    ["Stripe", "~1,2%", "3,99% + R$0,39", "~1,2%", "Exige CNPJ", "Excelente para crescer/escalar"],
    ["Asaas", "~R$1,99", "~2,99% a 4,99%", "~R$1,99", "Fácil (PME)", "Pix e boleto baratinhos"],
    ["PagBank / Pagar.me", "~0,99%", "~3,99%", "~R$3,49", "Fácil", "Alternativas BR conhecidas"],
  ],
  theme: "grid",
  headStyles: { fillColor: GREEN, textColor: [255, 255, 255], fontSize: 8, fontStyle: "bold" },
  bodyStyles: { fontSize: 7.6, textColor: [45, 48, 41] },
  alternateRowStyles: { fillColor: LIGHT },
  styles: { lineColor: [225, 221, 208], cellPadding: 1.6 },
  columnStyles: {
    0: { cellWidth: 27, fontStyle: "bold" },
    1: { cellWidth: 18 },
    2: { cellWidth: 28 },
    3: { cellWidth: 18 },
    4: { cellWidth: 28 },
    5: { cellWidth: W - 27 - 18 - 28 - 18 - 28 },
  },
});
y = doc.lastAutoTable.finalY + 3;
doc.setFont("helvetica", "italic");
doc.setFontSize(6.8);
doc.setTextColor(...GRAY);
doc.text(
  "Valores aproximados — mudam conforme plano, volume e prazo de recebimento (na hora, 14 ou 30 dias). Confirme a tabela atual no site da empresa.",
  M,
  y,
);
y += 6;

// ---------- Como acompanha ----------
heading("Como você acompanha os pedidos");
para(
  "Cada venda traz os itens (tamanho, cor e quantidade), o valor pago, a forma de pagamento e os dados do " +
    "comprador (nome, contato, CNPJ e endereço). Você recebe de até 4 formas, podendo combinar: " +
    "painel da empresa de pagamentos · e-mail · seu WhatsApp · área exclusiva sua dentro do site.",
);
y += 2;

// ---------- Tabela 2: planos ----------
heading("Planos para deixar a loja pronta");
autoTable(doc, {
  startY: y,
  margin: { left: M, right: M },
  head: [["Plano", "O que inclui", "Indicado para"]],
  body: [
    ["1 — Simples", "Vendas reais (Pix + cartão); você acompanha pelo painel da empresa de pagamentos + e-mail", "Começar rápido e econômico"],
    ["2 — Recomendado ★", "Tudo do Plano 1 + pedidos guardados + avisos automáticos no seu e-mail e WhatsApp a cada venda + e-mail de confirmação ao cliente", "Melhor custo-benefício"],
    ["3 — Completo", "Tudo do Plano 2 + painel próprio seu no site (gerenciar pedidos, marcar como enviado, relatórios)", "Quando o volume crescer"],
  ],
  theme: "grid",
  headStyles: { fillColor: GREEN, textColor: [255, 255, 255], fontSize: 8, fontStyle: "bold" },
  bodyStyles: { fontSize: 7.8, textColor: [45, 48, 41] },
  alternateRowStyles: { fillColor: LIGHT },
  styles: { lineColor: [225, 221, 208], cellPadding: 1.8 },
  columnStyles: {
    0: { cellWidth: 34, fontStyle: "bold" },
    1: { cellWidth: 100 },
    2: { cellWidth: W - 34 - 100 },
  },
});
y = doc.lastAutoTable.finalY + 6;

// ---------- O que providenciar ----------
heading("O que você precisa providenciar");
para(
  "• Conta na empresa de pagamentos no CNPJ da empresa (libera Pix e cartão)\n" +
    "• Endereço do site (ex.: sacolariabrasil.com.br)\n" +
    "• Seus dados reais: WhatsApp, e-mail, endereço e regras de frete/troca",
  9,
  INK,
  4.6,
);
y += 3;

// ---------- Recomendação ----------
doc.setFillColor(...EMERALD);
doc.roundedRect(M, y, W, 16, 3, 3, "F");
doc.setFont("helvetica", "bold");
doc.setFontSize(9.5);
doc.setTextColor(...YELLOW);
doc.text("Recomendação", M + 5, y + 6);
doc.setFont("helvetica", "normal");
doc.setFontSize(8.5);
doc.setTextColor(255, 255, 255);
doc.text(
  doc.splitTextToSize(
    "Comece com o Plano 2 + Mercado Pago: vendas reais no Pix e cartão, pedidos guardados e aviso de cada venda no seu e-mail e WhatsApp — sem o custo de um painel. Quando crescer, subimos para o Plano 3.",
    W - 10,
  ),
  M + 5,
  y + 11,
);

// ---------- Rodapé ----------
doc.setDrawColor(...GREEN);
doc.setLineWidth(0.3);
doc.line(M, 286, PW - M, 286);
doc.setFont("helvetica", "normal");
doc.setFontSize(7);
doc.setTextColor(...GRAY);
doc.text("Sacolaria Brasil · Proposta de loja virtual", M, 291);
doc.text("Pix · Cartão · Boleto · Entrega para todo o Brasil", PW - M, 291, { align: "right" });

const out = new URL("../sacolaria-proposta.pdf", import.meta.url);
writeFileSync(out, Buffer.from(doc.output("arraybuffer")));
console.log("PDF gerado:", out.pathname, "— páginas:", doc.getNumberOfPages());

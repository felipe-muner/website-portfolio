// Dados de contato da loja — fonte única (usados no header, footer e seção de contato).
// ⚠️ Valores fictícios de demonstração. Troque pelos reais aqui e tudo atualiza junto.

export const CONTACT = {
  /** Apenas dígitos com DDI, para links wa.me / WhatsApp. */
  whatsappNumber: "5531900000000",
  whatsappDisplay: "(31) 90000-0000",
  /** Formato tel: com DDI. */
  phone: "+553130000000",
  phoneDisplay: "(31) 3000-0000",
  email: "vendas@sacolariabrasil.com.br",
  city: "Contagem · MG · Brasil",
} as const;

/** Mensagem pré-preenchida ao abrir o WhatsApp. */
export const WHATSAPP_LINK = `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(
  "Olá! Vim pelo site e gostaria de um orçamento de sacolas.",
)}`;

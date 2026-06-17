"use client";

import { useState } from "react";
import { BadgeCheck, ClipboardList, MessageCircle, Send } from "lucide-react";
import { z } from "zod";
import { CONTACT } from "@/lib/layouts/sacolaria/contact";
import { formatCep, formatCnpj, formatPhone, onlyDigits, UFS } from "@/lib/layouts/sacolaria/format";
import { cn } from "@/lib/utils";

const QUANTITIES = [
  "1.000 a 5.000 sacolas",
  "5.000 a 30.000 sacolas",
  "30.000 a 60.000 sacolas",
  "Acima de 60.000 sacolas",
];

const CONTATO_VIA = ["WhatsApp", "E-mail", "Telefone"];

const schema = z.object({
  nome: z.string().trim().min(3, "Informe seu nome completo"),
  email: z.string().trim().email("E-mail inválido"),
  telefone: z.string().refine((v) => onlyDigits(v).length >= 10, "Telefone inválido"),
  cep: z.string().refine((v) => onlyDigits(v).length === 8, "CEP inválido"),
  quantidade: z.string().min(1, "Selecione a quantidade"),
});

type Errors = Record<string, string>;
type Fields = Record<string, string>;

// Campos sempre como string (evita o erro "expected string, received undefined" do zod).
const EMPTY_FIELDS: Fields = {
  nome: "",
  email: "",
  telefone: "",
  contato: "WhatsApp",
  cep: "",
  cnpj: "",
  uf: "",
  quantidade: "",
};

export function QuoteForm() {
  const [fields, setFields] = useState<Fields>({ ...EMPTY_FIELDS });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function set(name: string, value: string) {
    setFields((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  }

  function submit() {
    const result = schema.safeParse(fields);
    if (!result.success) {
      const next: Errors = {};
      for (const issue of result.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    // Demo: monta a mensagem e abre o WhatsApp com os dados preenchidos.
    const msg =
      `Olá! Quero um orçamento de sacolas.\n` +
      `Nome: ${fields.nome}\n` +
      `E-mail: ${fields.email}\n` +
      `Telefone: ${fields.telefone}\n` +
      `Contato via: ${fields.contato ?? "WhatsApp"}\n` +
      `CEP: ${fields.cep ?? "-"} · UF: ${fields.uf ?? "-"}\n` +
      `CNPJ: ${fields.cnpj ?? "-"}\n` +
      `Quantidade: ${fields.quantidade}`;
    window.open(
      `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setSent(true);
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-[#e7e3d8] bg-white shadow-[0_30px_60px_-40px_rgba(11,61,46,0.4)] md:grid md:grid-cols-2">
        {/* painel explicativo */}
        <div className="relative overflow-hidden bg-[#0b3d2e] p-8 text-white md:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 size-60 rounded-full bg-[#14573f] blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center rounded-full bg-[#f5c518] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#0b3d2e]">
              Pedido mínimo de 1.000 un.
            </span>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight">
              Dar o próximo passo leva menos de um minuto
            </h2>
            <p className="mt-3 text-sm text-[#bfdccf]">
              Para grandes volumes e sacolas personalizadas, peça um orçamento sob medida. Nosso
              time fala com você direto pelo canal que preferir.
            </p>

            <div className="mt-8 space-y-4">
              <Step
                icon={ClipboardList}
                title="Preencha o formulário"
                text="Envie suas informações. Seus dados ficam seguros com a gente."
              />
              <Step
                icon={MessageCircle}
                title="Receba o contato por WhatsApp"
                text="Um especialista entra em contato pelo canal que você escolher."
              />
            </div>
          </div>
        </div>

        {/* formulário */}
        <div className="p-8 md:p-10">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="grid size-16 place-items-center rounded-full bg-[#eefaf2]">
                <BadgeCheck className="size-9 text-[#1f9d55]" />
              </div>
              <h3 className="mt-5 text-2xl font-extrabold text-[#0b3d2e]">Pedido enviado!</h3>
              <p className="mt-2 max-w-xs text-[#5b5f57]">
                Abrimos o WhatsApp com os seus dados. É só enviar a mensagem que já entramos em
                contato.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setFields({ ...EMPTY_FIELDS });
                }}
                className="mt-6 text-sm font-semibold text-[#0b3d2e] hover:underline"
              >
                Enviar outro pedido
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <Field label="Nome completo" name="nome" value={fields.nome} error={errors.nome} onChange={set} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="E-mail" name="email" type="email" value={fields.email} error={errors.email} onChange={set} />
                <Field
                  label="Telefone"
                  name="telefone"
                  value={fields.telefone}
                  error={errors.telefone}
                  onChange={(n, v) => set(n, formatPhone(v))}
                  placeholder="(31) 90000-0000"
                />
              </div>

              <div>
                <Label>Contate-me via</Label>
                <select
                  value={fields.contato ?? "WhatsApp"}
                  onChange={(e) => set("contato", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[#e2ddd0] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0b3d2e]"
                >
                  {CONTATO_VIA.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr_1fr_110px]">
                <Field
                  label="CEP"
                  name="cep"
                  value={fields.cep}
                  error={errors.cep}
                  onChange={(n, v) => set(n, formatCep(v))}
                  placeholder="00000-000"
                />
                <Field
                  label="CNPJ"
                  name="cnpj"
                  value={fields.cnpj}
                  onChange={(n, v) => set(n, formatCnpj(v))}
                  placeholder="00.000.000/0001-00"
                  optional
                />
                <div>
                  <Label>UF</Label>
                  <select
                    value={fields.uf ?? ""}
                    onChange={(e) => set("uf", e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-[#e2ddd0] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0b3d2e]"
                  >
                    <option value="">—</option>
                    {UFS.map((uf) => (
                      <option key={uf} value={uf}>
                        {uf}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label>Quantas unidades?</Label>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {QUANTITIES.map((q) => {
                    const active = fields.quantidade === q;
                    return (
                      <button
                        key={q}
                        type="button"
                        onClick={() => set("quantidade", q)}
                        className={cn(
                          "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition",
                          active
                            ? "border-[#0b3d2e] bg-[#eef4f0] font-semibold text-[#0b3d2e]"
                            : "border-[#e2ddd0] bg-white text-[#4b4f47] hover:border-[#0b3d2e]/40",
                        )}
                      >
                        <span
                          className={cn(
                            "grid size-4 shrink-0 place-items-center rounded-full border",
                            active ? "border-[#0b3d2e] bg-[#0b3d2e]" : "border-[#c4c8bd]",
                          )}
                        >
                          {active && <span className="size-1.5 rounded-full bg-white" />}
                        </span>
                        {q}
                      </button>
                    );
                  })}
                </div>
                {errors.quantidade && (
                  <p className="mt-1 text-xs text-[#c0392b]">{errors.quantidade}</p>
                )}
              </div>

              <button
                type="button"
                onClick={submit}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b3d2e] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#0e5440]"
              >
                <Send className="size-4" /> Solicitar orçamento
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Step({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3 rounded-2xl bg-white/5 p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#1f9d55] text-white">
        <Icon className="size-5" />
      </span>
      <div>
        <h3 className="text-sm font-bold text-white">{title}</h3>
        <p className="mt-0.5 text-xs leading-relaxed text-[#bfdccf]">{text}</p>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-[#4b4f47]">{children}</label>;
}

function Field({
  label,
  name,
  value,
  error,
  onChange,
  type = "text",
  placeholder,
  optional,
}: {
  label: string;
  name: string;
  value?: string;
  error?: string;
  onChange: (name: string, value: string) => void;
  type?: string;
  placeholder?: string;
  optional?: boolean;
}) {
  return (
    <div>
      <Label>
        {label}
        {optional && <span className="ml-1 text-xs text-[#a7a99f]">(opcional)</span>}
      </Label>
      <input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(name, e.target.value)}
        className={cn(
          "mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#0b3d2e]",
          error ? "border-[#d97373]" : "border-[#e2ddd0]",
        )}
      />
      {error && <p className="mt-1 text-xs text-[#c0392b]">{error}</p>}
    </div>
  );
}

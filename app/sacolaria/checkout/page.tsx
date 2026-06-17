"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  Barcode,
  Check,
  CreditCard,
  Loader2,
  Lock,
  QrCode,
} from "lucide-react";
import {
  applyPix,
  formatBRL,
  installments,
  productName,
} from "@/lib/layouts/sacolaria/catalog";
import { useCart } from "@/lib/layouts/sacolaria/cart";
import {
  generateOrderId,
  ORDER_STORAGE_KEY,
  type Order,
  type PaymentMethod,
} from "@/lib/layouts/sacolaria/order";
import { cn } from "@/lib/utils";

const onlyDigits = (s: string) => s.replace(/\D/g, "");

// ---- formatadores ----
const formatCpfCnpj = (v: string) => {
  const d = onlyDigits(v).slice(0, 14);
  if (d.length <= 11) {
    return d
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return d
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
};
const formatPhone = (v: string) => {
  const d = onlyDigits(v).slice(0, 11);
  return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2");
};
const formatCep = (v: string) => onlyDigits(v).slice(0, 8).replace(/(\d{5})(\d{1,3})/, "$1-$2");
const formatCard = (v: string) =>
  onlyDigits(v)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
const formatExp = (v: string) => onlyDigits(v).slice(0, 4).replace(/(\d{2})(\d{1,2})/, "$1/$2");

// ---- schemas ----
const dadosSchema = z.object({
  nome: z.string().trim().min(3, "Informe seu nome completo"),
  email: z.string().trim().email("E-mail inválido"),
  telefone: z.string().refine((v) => onlyDigits(v).length >= 10, "Telefone inválido"),
  documento: z
    .string()
    .refine((v) => [11, 14].includes(onlyDigits(v).length), "CPF ou CNPJ inválido"),
});
const entregaSchema = z.object({
  cep: z.string().refine((v) => onlyDigits(v).length === 8, "CEP inválido"),
  endereco: z.string().trim().min(3, "Informe o endereço"),
  numero: z.string().trim().min(1, "Nº"),
  bairro: z.string().trim().min(2, "Informe o bairro"),
  cidade: z.string().trim().min(2, "Informe a cidade"),
  uf: z.string().trim().length(2, "UF"),
});
const cartaoSchema = z.object({
  cardNome: z.string().trim().min(3, "Nome impresso no cartão"),
  cardNumero: z.string().refine((v) => onlyDigits(v).length === 16, "Número do cartão inválido"),
  cardExp: z.string().refine((v) => onlyDigits(v).length === 4, "Validade MM/AA"),
  cardCvv: z.string().refine((v) => onlyDigits(v).length >= 3, "CVV"),
});

type Errors = Record<string, string>;
type Fields = Record<string, string>;

const STEPS = ["Dados", "Entrega", "Pagamento"] as const;
const UFS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, totals, clear, hydrated } = useCart();
  const [step, setStep] = useState(0);
  const [fields, setFields] = useState<Fields>({});
  const [errors, setErrors] = useState<Errors>({});
  const [method, setMethod] = useState<PaymentMethod>("pix");
  const [cepLoading, setCepLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const totalForMethod = useMemo(
    () => (method === "pix" ? applyPix(totals.subtotal) : totals.subtotal),
    [method, totals.subtotal],
  );

  function set(name: string, value: string) {
    setFields((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  }

  function applyErrors(result: { success: boolean; error?: z.ZodError }): boolean {
    if (result.success || !result.error) return true;
    const next: Errors = {};
    for (const issue of result.error.issues) next[String(issue.path[0])] = issue.message;
    setErrors(next);
    return false;
  }

  async function lookupCep(raw: string) {
    const cep = onlyDigits(raw);
    if (cep.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = (await res.json()) as {
        erro?: boolean;
        logradouro?: string;
        bairro?: string;
        localidade?: string;
        uf?: string;
      };
      if (!data.erro) {
        setFields((f) => ({
          ...f,
          endereco: data.logradouro || f.endereco || "",
          bairro: data.bairro || f.bairro || "",
          cidade: data.localidade || f.cidade || "",
          uf: data.uf || f.uf || "",
        }));
        setErrors((e) => ({ ...e, endereco: "", bairro: "", cidade: "", uf: "" }));
      }
    } catch {
      // ViaCEP indisponível — o usuário preenche manualmente
    } finally {
      setCepLoading(false);
    }
  }

  function next() {
    if (step === 0 && !applyErrors(dadosSchema.safeParse(fields))) return;
    if (step === 1 && !applyErrors(entregaSchema.safeParse(fields))) return;
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }

  function finish() {
    if (method === "cartao" && !applyErrors(cartaoSchema.safeParse(fields))) return;
    setProcessing(true);
    // Simula o processamento do pagamento (nenhuma cobrança real).
    window.setTimeout(() => {
      const order: Order = {
        id: generateOrderId(),
        createdAt: format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR }),
        method,
        name: fields.nome ?? "",
        email: fields.email ?? "",
        address: `${fields.endereco}, ${fields.numero} — ${fields.bairro}, ${fields.cidade}/${fields.uf}`,
        items: lines.map((l) => ({
          name: productName(l.product),
          color: l.color,
          units: l.units,
          packs: l.packs,
          lineTotal: l.lineTotal,
        })),
        total: totalForMethod,
        subtotal: totals.subtotal,
      };
      try {
        window.sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
      } catch {
        // sem storage — a página de pedido mostra estado genérico
      }
      clear();
      router.push("/sacolaria/pedido");
    }, 1400);
  }

  // Guards
  if (!hydrated) return <main className="min-h-[60vh] bg-[#faf8f3]" />;
  if (lines.length === 0 || !totals.meetsMinimum) {
    return (
      <main className="bg-[#faf8f3]">
        <div className="mx-auto max-w-xl px-5 py-24 text-center">
          <h1 className="text-2xl font-extrabold text-[#0b3d2e]">Seu carrinho não está pronto</h1>
          <p className="mt-2 text-[#7c8076]">
            {lines.length === 0
              ? "Adicione produtos antes de finalizar a compra."
              : "É preciso atingir o pedido mínimo de R$ 250,00 para finalizar."}
          </p>
          <Link
            href="/sacolaria/produtos"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0b3d2e] px-6 py-3.5 text-sm font-bold text-white"
          >
            Voltar ao catálogo <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>
    );
  }

  const parc = installments(totals.subtotal);

  return (
    <main className="bg-[#faf8f3]">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0b3d2e]">Finalizar compra</h1>

        {/* stepper */}
        <ol className="mt-6 flex items-center gap-2 text-sm">
          {STEPS.map((label, i) => (
            <li key={label} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold",
                  i < step
                    ? "bg-[#1f9d55] text-white"
                    : i === step
                      ? "bg-[#0b3d2e] text-white"
                      : "bg-[#e5e0d3] text-[#8a8f84]",
                )}
              >
                {i < step ? <Check className="size-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  "font-medium",
                  i === step ? "text-[#0b3d2e]" : "text-[#8a8f84]",
                )}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && <span className="h-px flex-1 bg-[#e5e0d3]" />}
            </li>
          ))}
        </ol>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="rounded-2xl border border-[#e7e3d8] bg-white p-6">
            {/* STEP 0 — Dados */}
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-[#0b3d2e]">Seus dados</h2>
                <Field label="Nome completo" name="nome" value={fields.nome} error={errors.nome} onChange={set} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="E-mail" name="email" type="email" value={fields.email} error={errors.email} onChange={set} />
                  <Field
                    label="Telefone / WhatsApp"
                    name="telefone"
                    value={fields.telefone}
                    error={errors.telefone}
                    onChange={(n, v) => set(n, formatPhone(v))}
                    placeholder="(31) 90000-0000"
                  />
                </div>
                <Field
                  label="CPF ou CNPJ"
                  name="documento"
                  value={fields.documento}
                  error={errors.documento}
                  onChange={(n, v) => set(n, formatCpfCnpj(v))}
                  placeholder="000.000.000-00"
                />
              </div>
            )}

            {/* STEP 1 — Entrega */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-[#0b3d2e]">Endereço de entrega</h2>
                <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
                  <div>
                    <Field
                      label="CEP"
                      name="cep"
                      value={fields.cep}
                      error={errors.cep}
                      onChange={(n, v) => set(n, formatCep(v))}
                      onBlur={(v) => lookupCep(v)}
                      placeholder="00000-000"
                      adornment={cepLoading ? <Loader2 className="size-4 animate-spin text-[#8a8f84]" /> : null}
                    />
                  </div>
                  <div className="hidden items-end pb-2 text-xs text-[#8a8f84] sm:flex">
                    Digite o CEP que preenchemos o endereço automaticamente.
                  </div>
                </div>
                <Field label="Endereço" name="endereco" value={fields.endereco} error={errors.endereco} onChange={set} />
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Número" name="numero" value={fields.numero} error={errors.numero} onChange={set} />
                  <Field label="Bairro" name="bairro" value={fields.bairro} error={errors.bairro} onChange={set} />
                  <Field label="Complemento" name="complemento" value={fields.complemento} onChange={set} optional />
                </div>
                <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
                  <Field label="Cidade" name="cidade" value={fields.cidade} error={errors.cidade} onChange={set} />
                  <div>
                    <label className="block text-sm font-medium text-[#4b4f47]">UF</label>
                    <select
                      value={fields.uf ?? ""}
                      onChange={(e) => set("uf", e.target.value)}
                      className={cn(
                        "mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0b3d2e]",
                        errors.uf ? "border-[#d97373]" : "border-[#e2ddd0]",
                      )}
                    >
                      <option value="">—</option>
                      {UFS.map((uf) => (
                        <option key={uf} value={uf}>
                          {uf}
                        </option>
                      ))}
                    </select>
                    {errors.uf && <p className="mt-1 text-xs text-[#c0392b]">{errors.uf}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 — Pagamento */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-[#0b3d2e]">Pagamento</h2>
                <div className="grid gap-3 sm:grid-cols-3">
                  <MethodCard icon={QrCode} title="Pix" hint="5% off · aprovação na hora" active={method === "pix"} onClick={() => setMethod("pix")} />
                  <MethodCard icon={CreditCard} title="Cartão" hint={`até ${parc.count}x sem juros`} active={method === "cartao"} onClick={() => setMethod("cartao")} />
                  <MethodCard icon={Barcode} title="Boleto" hint="vence em 3 dias" active={method === "boleto"} onClick={() => setMethod("boleto")} />
                </div>

                {method === "pix" && (
                  <div className="rounded-xl border border-[#bfe6cf] bg-[#eefaf2] p-5 text-sm text-[#1f7a4d]">
                    <p className="font-semibold">Você economiza {formatBRL(totals.subtotal - applyPix(totals.subtotal))} no Pix.</p>
                    <p className="mt-1 text-[#3f8c66]">
                      Ao confirmar, geramos o QR Code e o código copia-e-cola para pagamento imediato.
                    </p>
                  </div>
                )}

                {method === "boleto" && (
                  <div className="rounded-xl border border-[#e2ddd0] bg-[#f6f4ee] p-5 text-sm text-[#5b5f57]">
                    O boleto é gerado na confirmação e enviado para o seu e-mail. A compensação
                    leva até 2 dias úteis.
                  </div>
                )}

                {method === "cartao" && (
                  <div className="space-y-4">
                    <Field label="Nome impresso no cartão" name="cardNome" value={fields.cardNome} error={errors.cardNome} onChange={set} />
                    <Field
                      label="Número do cartão"
                      name="cardNumero"
                      value={fields.cardNumero}
                      error={errors.cardNumero}
                      onChange={(n, v) => set(n, formatCard(v))}
                      placeholder="0000 0000 0000 0000"
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        label="Validade"
                        name="cardExp"
                        value={fields.cardExp}
                        error={errors.cardExp}
                        onChange={(n, v) => set(n, formatExp(v))}
                        placeholder="MM/AA"
                      />
                      <Field
                        label="CVV"
                        name="cardCvv"
                        value={fields.cardCvv}
                        error={errors.cardCvv}
                        onChange={(n, v) => set(n, onlyDigits(v).slice(0, 4))}
                        placeholder="000"
                      />
                    </div>
                    <p className="text-xs text-[#7c8076]">
                      Parcelado em {parc.count}x de {formatBRL(parc.each)} sem juros.
                    </p>
                  </div>
                )}

                <p className="flex items-center gap-1.5 text-xs text-[#8a8f84]">
                  <Lock className="size-3.5" /> Ambiente de demonstração — nenhum pagamento real é
                  processado.
                </p>
              </div>
            )}

            {/* nav */}
            <div className="mt-7 flex items-center justify-between">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4b4f47] hover:text-[#0b3d2e]"
                >
                  <ArrowLeft className="size-4" /> Voltar
                </button>
              ) : (
                <Link href="/sacolaria/carrinho" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4b4f47] hover:text-[#0b3d2e]">
                  <ArrowLeft className="size-4" /> Carrinho
                </Link>
              )}

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0b3d2e] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0e5440]"
                >
                  Continuar <ArrowRight className="size-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={finish}
                  disabled={processing}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0b3d2e] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0e5440] disabled:opacity-70"
                >
                  {processing ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Processando…
                    </>
                  ) : (
                    <>
                      Pagar {formatBRL(totalForMethod)} <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* resumo */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-[#e7e3d8] bg-white p-5">
              <h2 className="text-base font-bold text-[#0b3d2e]">Resumo</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {lines.map((l) => (
                  <li key={l.id} className="flex justify-between gap-3 text-[#4b4f47]">
                    <span>
                      {l.packs}× {productName(l.product)}
                      <span className="block text-xs text-[#8a8f84]">
                        {l.color} · {l.units} un.
                      </span>
                    </span>
                    <span className="shrink-0 font-medium">{formatBRL(l.lineTotal)}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 space-y-2 border-t border-[#eee9dd] pt-4 text-sm">
                <div className="flex justify-between text-[#4b4f47]">
                  <dt>Subtotal</dt>
                  <dd>{formatBRL(totals.subtotal)}</dd>
                </div>
                {method === "pix" && (
                  <div className="flex justify-between text-[#1f9d55]">
                    <dt>Desconto Pix</dt>
                    <dd>− {formatBRL(totals.subtotal - applyPix(totals.subtotal))}</dd>
                  </div>
                )}
                <div className="flex justify-between text-[#8a8f84]">
                  <dt>Frete</dt>
                  <dd>Grátis</dd>
                </div>
                <div className="flex items-end justify-between border-t border-[#eee9dd] pt-3">
                  <dt className="font-semibold text-[#23261f]">Total</dt>
                  <dd className="text-xl font-black text-[#0b3d2e]">{formatBRL(totalForMethod)}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------

function Field({
  label,
  name,
  value,
  error,
  onChange,
  onBlur,
  type = "text",
  placeholder,
  optional,
  adornment,
}: {
  label: string;
  name: string;
  value?: string;
  error?: string;
  onChange: (name: string, value: string) => void;
  onBlur?: (value: string) => void;
  type?: string;
  placeholder?: string;
  optional?: boolean;
  adornment?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#4b4f47]">
        {label}
        {optional && <span className="ml-1 text-xs text-[#a7a99f]">(opcional)</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value ?? ""}
          placeholder={placeholder}
          onChange={(e) => onChange(name, e.target.value)}
          onBlur={onBlur ? (e) => onBlur(e.target.value) : undefined}
          className={cn(
            "mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#0b3d2e]",
            error ? "border-[#d97373]" : "border-[#e2ddd0]",
            adornment ? "pr-10" : "",
          )}
        />
        {adornment && <span className="absolute right-3 top-1/2 -translate-y-1/2">{adornment}</span>}
      </div>
      {error && <p className="mt-1 text-xs text-[#c0392b]">{error}</p>}
    </div>
  );
}

function MethodCard({
  icon: Icon,
  title,
  hint,
  active,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  hint: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition",
        active ? "border-[#0b3d2e] bg-[#eef4f0]" : "border-[#e2ddd0] bg-white hover:border-[#0b3d2e]/40",
      )}
    >
      <Icon className={cn("size-5", active ? "text-[#0b3d2e]" : "text-[#7c8076]")} />
      <span className="text-sm font-bold text-[#23261f]">{title}</span>
      <span className="text-xs text-[#7c8076]">{hint}</span>
    </button>
  );
}

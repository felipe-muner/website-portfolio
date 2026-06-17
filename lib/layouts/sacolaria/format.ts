// Formatadores de campos brasileiros (telefone, CEP, CNPJ) para os formulários.

export const onlyDigits = (s: string): string => s.replace(/\D/g, "");

export function formatPhone(v: string): string {
  return onlyDigits(v)
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

export function formatCep(v: string): string {
  return onlyDigits(v).slice(0, 8).replace(/(\d{5})(\d{1,3})/, "$1-$2");
}

export function formatCnpj(v: string): string {
  return onlyDigits(v)
    .slice(0, 14)
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

export const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

// Pedido finalizado — guardado em sessionStorage entre o checkout e a confirmação.
// (Loja-demonstração: nenhuma cobrança real é feita.)

export type PaymentMethod = "pix" | "cartao" | "boleto";

export interface OrderItem {
  name: string;
  color: string;
  units: number;
  packs: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  createdAt: string; // já formatado em pt-BR
  method: PaymentMethod;
  name: string;
  email: string;
  address: string;
  items: OrderItem[];
  /** Total cobrado no método escolhido, em centavos. */
  total: number;
  /** Subtotal sem desconto, em centavos. */
  subtotal: number;
}

export const ORDER_STORAGE_KEY = "sacolaria.lastOrder.v1";

export function generateOrderId(): string {
  return `SB-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

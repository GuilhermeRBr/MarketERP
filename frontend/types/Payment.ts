export type PaymentType = "pix" | "credit" | "debit" | "cash" | "other";

export interface Payment {
  id: number;
  sale_id: number;
  type: PaymentType;
  amount: number;
  created_at: string;
}

export interface CreatePaymentDTO {
  sale_id: number;
  type: PaymentType;
  amount: number;
}

export interface PaymentMethod {
  type: PaymentType;
  label: string;
  icon: string;
  color: string;
}

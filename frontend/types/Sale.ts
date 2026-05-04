export interface Sale {
  id: number;
  created_at: string;
  total: number;
  status: "completed" | "cancelled";
}

export interface SaleItem {
  product_id: number;
  quantity: number;
}

export interface CreateSaleDTO {
  items: SaleItem[];
}

export interface SaleDetail extends Sale {
  items: SaleItemDetail[];
}

export interface SaleItemDetail {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

// Para o carrinho local
export interface CartItem {
  product_id: number;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

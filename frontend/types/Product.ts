export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  barcode?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductDTO {
  name: string;
  price: number;
  stock: number;
  barcode?: string;
  active: boolean;
}

export interface UpdateProductDTO {
  name?: string;
  price?: number;
  stock?: number;
  barcode?: string;
  active?: boolean;
}

export interface ProductSearchParams {
  query?: string;
  category?: string;
  active?: boolean;
}

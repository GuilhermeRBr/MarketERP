import api from "./api";
import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
  ProductSearchParams,
} from "@/types/Product";
import { ApiResponse } from "@/types/ApiResponse";

class ProductService {
  private readonly basePath = "/products";

  // Listar todos os produtos
  async getAll(): Promise<Product[]> {
    const response = await api.get<Product[]>(this.basePath);
    return response.data;
  }

  // Buscar produto por ID
  async getById(id: number): Promise<Product> {
    const response = await api.get<Product>(`${this.basePath}/${id}`);
    return response.data;
  }

  // Criar novo produto
  async create(data: CreateProductDTO): Promise<Product> {
    const response = await api.post<Product>(this.basePath, data);
    return response.data;
  }

  // Atualizar produto
  async update(id: number, data: UpdateProductDTO): Promise<Product> {
    const response = await api.patch<Product>(`${this.basePath}/${id}`, data);
    return response.data;
  }

  // Soft delete - desativar produto
  async deactivate(id: number): Promise<Product> {
    return this.update(id, { active: false });
  }

  // Reativar produto
  async activate(id: number): Promise<Product> {
    return this.update(id, { active: true });
  }

  // Buscar produtos
  async search(params: ProductSearchParams): Promise<Product[]> {
    const response = await api.get<Product[]>(`${this.basePath}/search`, {
      params,
    });
    return response.data;
  }
}

export const productService = new ProductService();

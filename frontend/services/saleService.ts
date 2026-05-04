import api from "./api";
import { Sale, CreateSaleDTO, SaleDetail } from "@/types/Sale";

class SaleService {
  private readonly basePath = "/sales";

  // Listar todas as vendas
  async getAll(): Promise<Sale[]> {
    const response = await api.get<Sale[]>(this.basePath);
    return response.data;
  }

  // Buscar venda por ID
  async getById(id: number): Promise<SaleDetail> {
    const response = await api.get<SaleDetail>(`${this.basePath}/${id}`);
    return response.data;
  }

  // Criar nova venda
  async create(data: CreateSaleDTO): Promise<Sale> {
    const response = await api.post<Sale>(this.basePath, data);
    return response.data;
  }

  // Cancelar venda
  async cancel(id: number): Promise<void> {
    await api.patch(`${this.basePath}/${id}`);
  }
}

export const saleService = new SaleService();

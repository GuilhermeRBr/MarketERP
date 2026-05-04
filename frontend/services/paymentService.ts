import api from "./api";
import { Payment, CreatePaymentDTO } from "@/types/Payment";

class PaymentService {
  private readonly basePath = "/payments";

  // Criar novo pagamento
  async create(data: CreatePaymentDTO): Promise<Payment> {
    const response = await api.post<Payment>(this.basePath, data);
    return response.data;
  }

  // Listar todos os pagamentos
  async getAll(): Promise<Payment[]> {
    const response = await api.get<Payment[]>(this.basePath);
    return response.data;
  }

  // Buscar pagamentos por venda
  async getBySale(saleId: number): Promise<Payment[]> {
    const response = await api.get<Payment[]>(`${this.basePath}/sale/${saleId}`);
    return response.data;
  }
}

export const paymentService = new PaymentService();

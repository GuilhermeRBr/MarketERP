import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "@/services/paymentService";
import { CreatePaymentDTO } from "@/types/Payment";
import { saleKeys } from "./useSales";

// Query keys
export const paymentKeys = {
  all: ["payments"] as const,
  lists: () => [...paymentKeys.all, "list"] as const,
  list: (filters: string) => [...paymentKeys.lists(), { filters }] as const,
  details: () => [...paymentKeys.all, "detail"] as const,
  detail: (id: number) => [...paymentKeys.details(), id] as const,
  bySale: (saleId: number) => [...paymentKeys.all, "sale", saleId] as const,
};

// Hook para listar todos os pagamentos
export function usePayments() {
  return useQuery({
    queryKey: paymentKeys.lists(),
    queryFn: () => paymentService.getAll(),
  });
}

// Hook para buscar pagamentos por venda
export function usePaymentsBySale(saleId: number) {
  return useQuery({
    queryKey: paymentKeys.bySale(saleId),
    queryFn: () => paymentService.getBySale(saleId),
    enabled: !!saleId,
  });
}

// Hook para criar pagamento
export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentDTO) => paymentService.create(data),
    onSuccess: () => {
      // Invalidar cache de vendas e pagamentos
      queryClient.invalidateQueries({ queryKey: saleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
    },
  });
}

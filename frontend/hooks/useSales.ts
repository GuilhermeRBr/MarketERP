import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { saleService } from "@/services/saleService";
import { CreateSaleDTO } from "@/types/Sale";

// Query keys
export const saleKeys = {
  all: ["sales"] as const,
  lists: () => [...saleKeys.all, "list"] as const,
  details: () => [...saleKeys.all, "detail"] as const,
  detail: (id: number) => [...saleKeys.details(), id] as const,
};

// Hook para listar todas as vendas
export function useSales() {
  return useQuery({
    queryKey: saleKeys.lists(),
    queryFn: () => saleService.getAll(),
  });
}

// Hook para buscar venda por ID
export function useSale(id: number) {
  return useQuery({
    queryKey: saleKeys.detail(id),
    queryFn: () => saleService.getById(id),
    enabled: !!id,
  });
}

// Hook para criar venda
export function useCreateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSaleDTO) => saleService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: saleKeys.lists() });
    },
  });
}

// Hook para cancelar venda
export function useCancelSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => saleService.cancel(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: saleKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: saleKeys.lists() });
    },
  });
}

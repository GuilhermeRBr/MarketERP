import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/productService";
import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
  ProductSearchParams,
} from "@/types/Product";

// Query keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters?: ProductSearchParams) =>
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};

// Hook para listar todos os produtos
export function useProducts() {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: () => productService.getAll(),
  });
}

// Hook para buscar produto por ID
export function useProduct(id: number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
}

// Hook para buscar produtos
export function useProductSearch(params: ProductSearchParams) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productService.search(params),
    enabled: !!params.query || !!params.category,
  });
}

// Hook para criar produto
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductDTO) => productService.create(data),
    onSuccess: () => {
      // Invalidar cache para recarregar lista
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

// Hook para atualizar produto
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductDTO }) =>
      productService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidar cache do produto específico e da lista
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

// Hook para desativar produto (soft delete)
export function useDeactivateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productService.deactivate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

// Hook para reativar produto
export function useActivateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productService.activate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

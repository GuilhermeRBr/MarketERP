"use client";

import { useState, useMemo } from "react";
import { useProducts, useCreateProduct, useUpdateProduct, useDeactivateProduct, useActivateProduct } from "@/hooks/useProducts";
import { Product, CreateProductDTO, UpdateProductDTO } from "@/types/Product";
import { Loader2, Package, Plus, AlertCircle } from "lucide-react";
import ProductTable from "@/components/produtos/ProductTable";
import ProductFilters from "@/components/produtos/ProductFilters";
import ProductForm from "@/components/produtos/ProductForm";

export default function ProdutosPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);

  // Queries
  const { data: products, isLoading, error } = useProducts();

  // Mutations
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deactivateMutation = useDeactivateProduct();
  const activateMutation = useActivateProduct();

  // Filtrar produtos
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      // Filtro de busca
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.barcode?.includes(searchQuery);

      // Filtro de status
      const matchesActive =
        activeFilter === undefined || product.active === activeFilter;

      return matchesSearch && matchesActive;
    });
  }, [products, searchQuery, activeFilter]);

  // Handlers
  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (data: CreateProductDTO | UpdateProductDTO) => {
    try {
      if (editingProduct) {
        // Atualizar
        await updateMutation.mutateAsync({
          id: editingProduct.id,
          data: data as UpdateProductDTO,
        });
      } else {
        // Criar
        await createMutation.mutateAsync(data as CreateProductDTO);
      }
      handleCancel();
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
    }
  };

  const handleToggleActive = async (product: Product) => {
    const action = product.active ? "desativar" : "ativar";
    if (confirm(`Deseja ${action} o produto "${product.name}"?`)) {
      try {
        if (product.active) {
          await deactivateMutation.mutateAsync(product.id);
        } else {
          await activateMutation.mutateAsync(product.id);
        }
      } catch (err) {
        console.error(`Erro ao ${action} produto:`, err);
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Produtos</h1>
          <p className="text-gray-600 mt-1">
            Gerencie o catálogo de produtos
          </p>
        </div>
        {!showForm && (
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Novo Produto
          </button>
        )}
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingProduct ? "Editar Produto" : "Novo Produto"}
          </h2>
          <ProductForm
            product={editingProduct || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </div>
      )}

      {/* Filtros */}
      {!showForm && (
        <ProductFilters
          onSearch={setSearchQuery}
          onFilterActive={setActiveFilter}
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">Carregando produtos...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 mb-1">
              Erro ao carregar produtos
            </h3>
            <p className="text-red-700 text-sm">
              {error instanceof Error ? error.message : "Erro desconhecido"}
            </p>
          </div>
        </div>
      )}

      {/* Tabela de Produtos */}
      {!isLoading && !error && !showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {searchQuery || activeFilter !== undefined
                  ? "Nenhum produto encontrado"
                  : "Nenhum produto cadastrado"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || activeFilter !== undefined
                  ? "Tente ajustar os filtros de busca"
                  : "Comece adicionando seu primeiro produto"}
              </p>
              {!searchQuery && activeFilter === undefined && (
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  <Plus size={20} />
                  Adicionar Produto
                </button>
              )}
            </div>
          ) : (
            <>
              <ProductTable
                products={filteredProducts}
                onEdit={handleEdit}
                onToggleActive={handleToggleActive}
                isLoading={
                  deactivateMutation.isPending || activateMutation.isPending
                }
              />
              {/* Contador */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-600">
                  Exibindo {filteredProducts.length} de {products?.length || 0}{" "}
                  produto(s)
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

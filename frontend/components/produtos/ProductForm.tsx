"use client";

import { useState, useEffect } from "react";
import { Product, CreateProductDTO, UpdateProductDTO } from "@/types/Product";
import { Loader2, Save, X } from "lucide-react";

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: CreateProductDTO | UpdateProductDTO) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ProductForm({
  product,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
    barcode: product?.barcode || "",
    active: product?.active ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        stock: product.stock,
        barcode: product.barcode || "",
        active: product.active,
      });
    }
  }, [product]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    } else if (formData.name.length < 3) {
      newErrors.name = "Nome deve ter no mínimo 3 caracteres";
    } else if (formData.name.length > 100) {
      newErrors.name = "Nome deve ter no máximo 100 caracteres";
    }

    if (formData.price <= 0) {
      newErrors.price = "Preço deve ser maior que zero";
    }

    if (formData.stock < 0) {
      newErrors.stock = "Estoque não pode ser negativo";
    }

    if (formData.barcode && (formData.barcode.length < 8 || formData.barcode.length > 13)) {
      newErrors.barcode = "Código de barras deve ter entre 8 e 13 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const data = {
      name: formData.name.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      barcode: formData.barcode.trim() || undefined,
      active: formData.active,
    };

    onSubmit(data);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpar erro do campo ao editar
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nome */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nome do Produto *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Ex: Coca-Cola 2L"
          disabled={isLoading}
        />
        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Preço e Estoque */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Preço */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Preço (R$) *
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.price}
            onChange={(e) => handleChange("price", e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.price ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="0.00"
            disabled={isLoading}
          />
          {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
        </div>

        {/* Estoque */}
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
            Estoque *
          </label>
          <input
            id="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.stock ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="0"
            disabled={isLoading}
          />
          {errors.stock && <p className="text-red-600 text-sm mt-1">{errors.stock}</p>}
        </div>
      </div>

      {/* Código de Barras */}
      <div>
        <label htmlFor="barcode" className="block text-sm font-medium text-gray-700 mb-2">
          Código de Barras
        </label>
        <input
          id="barcode"
          type="text"
          value={formData.barcode}
          onChange={(e) => handleChange("barcode", e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.barcode ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="1234567890123"
          maxLength={13}
          disabled={isLoading}
        />
        {errors.barcode && <p className="text-red-600 text-sm mt-1">{errors.barcode}</p>}
        <p className="text-gray-500 text-xs mt-1">8 a 13 caracteres (opcional)</p>
      </div>

      {/* Status */}
      <div className="flex items-center gap-3">
        <input
          id="active"
          type="checkbox"
          checked={formData.active}
          onChange={(e) => handleChange("active", e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          disabled={isLoading}
        />
        <label htmlFor="active" className="text-sm font-medium text-gray-700">
          Produto ativo
        </label>
      </div>

      {/* Botões */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <X size={20} />
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save size={20} />
              {product ? "Atualizar" : "Criar"} Produto
            </>
          )}
        </button>
      </div>
    </form>
  );
}

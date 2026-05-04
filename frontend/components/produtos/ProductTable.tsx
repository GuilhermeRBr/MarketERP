"use client";

import { Product } from "@/types/Product";
import { formatCurrency } from "@/utils/formatters";
import { Edit, Power, PowerOff, Trash2 } from "lucide-react";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onToggleActive: (product: Product) => void;
  isLoading?: boolean;
}

export default function ProductTable({
  products,
  onEdit,
  onToggleActive,
  isLoading = false,
}: ProductTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Produto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Código
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Preço
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estoque
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr
              key={product.id}
              className={`hover:bg-gray-50 transition-colors ${
                !product.active ? "opacity-60" : ""
              }`}
            >
              {/* Nome */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {product.name}
                </div>
              </td>

              {/* Código de Barras */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {product.barcode || "-"}
                </div>
              </td>

              {/* Preço */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {formatCurrency(product.price)}
                </div>
              </td>

              {/* Estoque */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div
                  className={`text-sm font-medium ${
                    product.stock === 0
                      ? "text-red-600"
                      : product.stock < 10
                      ? "text-yellow-600"
                      : "text-gray-900"
                  }`}
                >
                  {product.stock} un.
                </div>
              </td>

              {/* Status */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.active ? "Ativo" : "Inativo"}
                </span>
              </td>

              {/* Ações */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  {/* Editar */}
                  <button
                    onClick={() => onEdit(product)}
                    disabled={isLoading}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>

                  {/* Ativar/Desativar */}
                  <button
                    onClick={() => onToggleActive(product)}
                    disabled={isLoading}
                    className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      product.active
                        ? "text-red-600 hover:bg-red-50"
                        : "text-green-600 hover:bg-green-50"
                    }`}
                    title={product.active ? "Desativar" : "Ativar"}
                  >
                    {product.active ? <PowerOff size={18} /> : <Power size={18} />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum produto encontrado</p>
        </div>
      )}
    </div>
  );
}

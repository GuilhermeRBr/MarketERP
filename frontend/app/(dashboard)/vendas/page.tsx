"use client";

import { useState } from "react";
import { useSales, useCancelSale } from "@/hooks/useSales";
import { Sale } from "@/types/Sale";
import { Loader2, ShoppingCart, AlertCircle, Plus } from "lucide-react";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import Link from "next/link";

export default function VendasPage() {
  const { data: sales, isLoading, error } = useSales();
  const cancelMutation = useCancelSale();

  const handleCancel = async (sale: Sale) => {
    if (sale.status === "cancelled") {
      alert("Esta venda já está cancelada!");
      return;
    }

    if (
      confirm(
        `Deseja cancelar a venda #${sale.id} no valor de ${formatCurrency(
          sale.total
        )}?`
      )
    ) {
      try {
        await cancelMutation.mutateAsync(sale.id);
      } catch (err) {
        console.error("Erro ao cancelar venda:", err);
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Vendas</h1>
          <p className="text-gray-600 mt-1">Histórico de vendas realizadas</p>
        </div>
        <Link
          href="/vendas/caixa"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Nova Venda
        </Link>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">Carregando vendas...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 mb-1">
              Erro ao carregar vendas
            </h3>
            <p className="text-red-700 text-sm">
              {error instanceof Error ? error.message : "Erro desconhecido"}
            </p>
          </div>
        </div>
      )}

      {/* Lista de Vendas */}
      {!isLoading && !error && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {!sales || sales.length === 0 ? (
            <div className="p-12 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Nenhuma venda realizada
              </h3>
              <p className="text-gray-500 mb-4">
                Comece realizando sua primeira venda
              </p>
              <Link
                href="/vendas/caixa"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Nova Venda
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data/Hora
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
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
                    {sales.map((sale) => (
                      <tr
                        key={sale.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          sale.status === "cancelled" ? "opacity-60" : ""
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{sale.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDateTime(sale.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(sale.total)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              sale.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {sale.status === "completed"
                              ? "Concluída"
                              : "Cancelada"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {sale.status === "completed" && (
                            <button
                              onClick={() => handleCancel(sale)}
                              disabled={cancelMutation.isPending}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                              Cancelar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-600">
                  Total de {sales.length} venda(s) registrada(s)
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

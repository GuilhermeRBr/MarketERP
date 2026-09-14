"use client";

import { useAnalytics } from "@/hooks/useAnalytics";
import { formatCurrency } from "@/utils/formatters";
import {
  AlertTriangle,
  TrendingUp,
  Clock,
  ShoppingBag,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function AnalyticsInsights() {
  const { data: analytics, isLoading, error } = useAnalytics();

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm">Carregando análise de estoque...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-6 rounded-xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-red-900 text-sm">Erro ao carregar análise</p>
          <p className="text-red-700 text-xs mt-1">
            {error instanceof Error ? error.message : "Erro desconhecido"}
          </p>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Header da seção */}
      <div className="flex items-center gap-2">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Análise Inteligente de Estoque
          </h2>
          <p className="text-xs text-gray-500">
            Baseado nos últimos {analytics.analysis_period_days} dias de vendas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produtos Críticos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            Previsão de Ruptura de Estoque
          </h3>

          {analytics.critical_products.length === 0 ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
              <p className="text-sm text-green-800">
                Nenhum produto em situação crítica no momento.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {analytics.critical_products.map((item) => (
                <div
                  key={item.product_id}
                  className={`p-3 rounded-lg border ${
                    item.alert_level === "critical"
                      ? "bg-red-50 border-red-200"
                      : "bg-yellow-50 border-yellow-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-semibold truncate ${
                          item.alert_level === "critical"
                            ? "text-red-900"
                            : "text-yellow-900"
                        }`}
                      >
                        {item.product_name}
                      </p>
                      <div className="flex flex-wrap gap-x-3 mt-1">
                        <span className="text-xs text-gray-600">
                          Estoque:{" "}
                          <span className="font-semibold">{item.stock} un.</span>
                        </span>
                        {item.avg_daily_sales > 0 && (
                          <span className="text-xs text-gray-600">
                            Saída média:{" "}
                            <span className="font-semibold">
                              {item.avg_daily_sales} un./dia
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Badge de previsão */}
                    <div className="shrink-0 text-right">
                      {item.stock === 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold bg-red-600 text-white rounded-full">
                          Sem estoque
                        </span>
                      ) : item.days_until_empty !== null ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                            item.days_until_empty <= 3
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          ~{item.days_until_empty}d
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                          Estoque baixo
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Produtos Mais Vendidos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-indigo-500" />
            Produtos Mais Vendidos
          </h3>

          {analytics.top_selling.length === 0 ? (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-500">
                Nenhuma venda registrada nos últimos {analytics.analysis_period_days} dias.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {analytics.top_selling.map((item, index) => {
                const maxQty = analytics.top_selling[0].total_quantity_sold;
                const barWidth = Math.max(
                  8,
                  Math.round((item.total_quantity_sold / maxQty) * 100)
                );

                return (
                  <div key={item.product_id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-bold text-gray-400 w-4 shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-800 truncate">
                          {item.product_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-2">
                        <span className="text-xs text-gray-500">
                          {item.total_quantity_sold} un.
                        </span>
                        <span className="text-xs font-semibold text-indigo-700">
                          {formatCurrency(item.total_revenue)}
                        </span>
                      </div>
                    </div>
                    {/* Barra de progresso */}
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

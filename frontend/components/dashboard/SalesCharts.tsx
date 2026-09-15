"use client";

import { useState } from "react";
import { useCharts } from "@/hooks/useAnalytics";
import { ChartRange } from "@/types/Analytics";
import { formatCurrency } from "@/utils/formatters";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Loader2,
  AlertCircle,
  BarChart3,
} from "lucide-react";

const RANGES: { label: string; value: ChartRange }[] = [
  { label: "24h", value: "1d" },
  { label: "7 dias", value: "7d" },
  { label: "30 dias", value: "30d" },
  { label: "3 meses", value: "90d" },
  { label: "1 ano", value: "1y" },
  { label: "Tudo", value: "all" },
];

// Tooltip customizado para o gráfico de receita
function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      <p className="text-indigo-600">
        Receita: <span className="font-bold">{formatCurrency(payload[0]?.value ?? 0)}</span>
      </p>
      <p className="text-gray-500">
        Vendas: <span className="font-semibold">{payload[1]?.value ?? 0}</span>
      </p>
    </div>
  );
}

// Tooltip customizado para o gráfico de produtos
function ProductTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1 max-w-[180px] truncate">{label}</p>
      <p className="text-violet-600">
        Quantidade: <span className="font-bold">{payload[0]?.value ?? 0} un.</span>
      </p>
      <p className="text-gray-500">
        Receita:{" "}
        <span className="font-semibold">
          {formatCurrency(payload[1]?.value ?? 0)}
        </span>
      </p>
    </div>
  );
}

export default function SalesCharts() {
  const [range, setRange] = useState<ChartRange>("30d");
  const { data, isLoading, error } = useCharts(range);

  return (
    <div className="space-y-6">
      {/* Header + seletor de range */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Gráficos de Vendas
            </h2>
            <p className="text-xs text-gray-500">
              {data?.period_label ?? "Carregando..."}
            </p>
          </div>
        </div>

        {/* Botões de range */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                range === r.value
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 p-16 flex flex-col items-center gap-3 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm">Carregando gráficos...</p>
        </div>
      )}

      {/* Erro */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 p-5 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">
            {error instanceof Error ? error.message : "Erro ao carregar gráficos"}
          </p>
        </div>
      )}

      {/* Conteúdo */}
      {!isLoading && !error && data && (
        <>
          {/* KPIs do período */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg shrink-0">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Receita no período</p>
                <p className="text-xl font-bold text-gray-800">
                  {formatCurrency(data.total_revenue)}
                </p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg shrink-0">
                <ShoppingCart className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Vendas concluídas</p>
                <p className="text-xl font-bold text-gray-800">
                  {data.total_sales}
                </p>
              </div>
            </div>
          </div>

          {/* Gráfico de Receita ao longo do tempo */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-semibold text-gray-700">
                Receita ao longo do tempo
              </h3>
            </div>

            {data.revenue_over_time.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                Nenhuma venda no período selecionado.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart
                  data={data.revenue_over_time}
                  margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    yAxisId="revenue"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                    width={52}
                  />
                  <YAxis
                    yAxisId="count"
                    orientation="right"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={false}
                    width={30}
                  />
                  <Tooltip content={<RevenueTooltip />} />
                  <Area
                    yAxisId="revenue"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#revenueGrad)"
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Area
                    yAxisId="count"
                    type="monotone"
                    dataKey="sales_count"
                    stroke="#8b5cf6"
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                    fill="url(#salesGrad)"
                    dot={false}
                    activeDot={{ r: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
            <div className="flex items-center gap-6 mt-3 justify-center">
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="inline-block w-4 h-0.5 bg-indigo-500 rounded" />
                Receita (R$)
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="inline-block w-4 border-t-2 border-dashed border-violet-500" />
                Nº de vendas
              </span>
            </div>
          </div>

          {/* Gráfico de Top Produtos */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-4 h-4 text-violet-500" />
              <h3 className="text-sm font-semibold text-gray-700">
                Top produtos vendidos
              </h3>
            </div>

            {data.top_products.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                Nenhuma venda no período selecionado.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={data.top_products}
                  layout="vertical"
                  margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="product_name"
                    tick={{ fontSize: 11, fill: "#374151" }}
                    tickLine={false}
                    axisLine={false}
                    width={110}
                    tickFormatter={(v: string) =>
                      v.length > 14 ? v.slice(0, 13) + "…" : v
                    }
                  />
                  <Tooltip content={<ProductTooltip />} />
                  <Bar
                    dataKey="total_quantity_sold"
                    fill="#6366f1"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={24}
                  />
                  <Bar
                    dataKey="total_revenue"
                    fill="#a78bfa"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
            <div className="flex items-center gap-6 mt-3 justify-center">
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="inline-block w-3 h-3 rounded-sm bg-indigo-500" />
                Quantidade (un.)
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="inline-block w-3 h-3 rounded-sm bg-violet-300" />
                Receita (R$)
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

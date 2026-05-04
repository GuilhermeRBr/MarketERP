"use client";

import { usePayments } from "@/hooks/usePayments";
import { useSales } from "@/hooks/useSales";
import { formatCurrency } from "@/utils/formatters";
import {
  CreditCard,
  Loader2,
  DollarSign,
  Calendar,
  Filter,
  TrendingUp,
  Smartphone,
  Banknote,
  Wallet,
  HelpCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Payment, PaymentType } from "@/types/Payment";

// Mapeamento de ícones e cores por tipo de pagamento
const paymentTypeConfig: Record<
  PaymentType,
  { label: string; icon: any; color: string; bgColor: string }
> = {
  pix: {
    label: "PIX",
    icon: Smartphone,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  credit: {
    label: "Crédito",
    icon: CreditCard,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  debit: {
    label: "Débito",
    icon: CreditCard,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  cash: {
    label: "Dinheiro",
    icon: Banknote,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  other: {
    label: "Outro",
    icon: Wallet,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
};

export default function PagamentosPage() {
  const { data: payments = [], isLoading: loadingPayments } = usePayments();
  const { data: sales = [], isLoading: loadingSales } = useSales();
  const [filterType, setFilterType] = useState<PaymentType | "all">("all");

  // Calcular estatísticas
  const stats = useMemo(() => {
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalPayments = payments.length;

    // Agrupar por tipo
    const byType = payments.reduce((acc, payment) => {
      if (!acc[payment.type]) {
        acc[payment.type] = { count: 0, amount: 0 };
      }
      acc[payment.type].count++;
      acc[payment.type].amount += payment.amount;
      return acc;
    }, {} as Record<PaymentType, { count: number; amount: number }>);

    // Pagamentos de hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const paymentsToday = payments.filter((p) => {
      const paymentDate = new Date(p.created_at);
      paymentDate.setHours(0, 0, 0, 0);
      return paymentDate.getTime() === today.getTime();
    });
    const amountToday = paymentsToday.reduce((sum, p) => sum + p.amount, 0);

    return {
      totalAmount,
      totalPayments,
      byType,
      paymentsToday: paymentsToday.length,
      amountToday,
    };
  }, [payments]);

  // Agrupar pagamentos por venda
  const paymentsBySale = useMemo(() => {
    const grouped = new Map<
      number,
      {
        sale: (typeof sales)[0];
        payments: Payment[];
        total: number;
      }
    >();

    payments.forEach((payment) => {
      const sale = sales.find((s) => s.id === payment.sale_id);
      if (sale) {
        if (!grouped.has(sale.id)) {
          grouped.set(sale.id, {
            sale,
            payments: [],
            total: 0,
          });
        }
        const group = grouped.get(sale.id)!;
        group.payments.push(payment);
        group.total += payment.amount;
      }
    });

    return Array.from(grouped.values()).sort(
      (a, b) =>
        new Date(b.sale.created_at).getTime() -
        new Date(a.sale.created_at).getTime()
    );
  }, [payments, sales]);

  // Filtrar por tipo
  const filteredPaymentsBySale = useMemo(() => {
    if (filterType === "all") return paymentsBySale;
    return paymentsBySale.filter((group) =>
      group.payments.some((p) => p.type === filterType)
    );
  }, [paymentsBySale, filterType]);

  const isLoading = loadingPayments || loadingSales;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Pagamentos</h1>
        <p className="text-gray-600 mt-1">
          Histórico e estatísticas de pagamentos
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Recebido */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
              Total
            </span>
          </div>
          <h3 className="text-3xl font-bold mb-1">
            {formatCurrency(stats.totalAmount)}
          </h3>
          <p className="text-green-100 text-sm">Total Recebido</p>
          <div className="mt-3 pt-3 border-t border-white/20 text-xs">
            {stats.totalPayments} pagamentos
          </div>
        </div>

        {/* Recebido Hoje */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs text-gray-500 font-semibold">Hoje</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">
            {formatCurrency(stats.amountToday)}
          </h3>
          <p className="text-gray-600 text-sm">Recebido Hoje</p>
          <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-blue-600 font-medium">
            {stats.paymentsToday} pagamentos
          </div>
        </div>

        {/* Ticket Médio */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs text-gray-500 font-semibold">Média</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">
            {formatCurrency(
              stats.totalPayments > 0
                ? stats.totalAmount / stats.totalPayments
                : 0
            )}
          </h3>
          <p className="text-gray-600 text-sm">Valor Médio</p>
          <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
            Por pagamento
          </div>
        </div>

        {/* Total de Transações */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-xs text-gray-500 font-semibold">Total</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">
            {stats.totalPayments}
          </h3>
          <p className="text-gray-600 text-sm">Transações</p>
          <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
            Pagamentos registrados
          </div>
        </div>
      </div>

      {/* Distribuição por Tipo de Pagamento */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Distribuição por Método de Pagamento
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {(Object.keys(paymentTypeConfig) as PaymentType[]).map((type) => {
            const config = paymentTypeConfig[type];
            const data = stats.byType[type] || { count: 0, amount: 0 };
            const Icon = config.icon;

            return (
              <div
                key={type}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 ${config.bgColor} rounded-lg`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <span className="font-semibold text-gray-900">
                    {config.label}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(data.amount)}
                  </p>
                  <p className="text-xs text-gray-500">{data.count} transações</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">
            Filtrar por método:
          </span>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterType === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos
            </button>
            {(Object.keys(paymentTypeConfig) as PaymentType[]).map((type) => {
              const config = paymentTypeConfig[type];
              return (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filterType === type
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lista de Pagamentos por Venda */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Histórico de Pagamentos
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Pagamentos agrupados por venda
          </p>
        </div>

        {filteredPaymentsBySale.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              Nenhum pagamento encontrado
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {filterType !== "all"
                ? "Tente alterar o filtro"
                : "Os pagamentos aparecerão aqui"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPaymentsBySale.map((group) => (
              <div key={group.sale.id} className="p-6 hover:bg-gray-50 transition-colors">
                {/* Header da Venda */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Venda #{group.sale.id}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(group.sale.created_at).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total da Venda</p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(group.sale.total)}
                    </p>
                  </div>
                </div>

                {/* Pagamentos da Venda */}
                <div className="space-y-2 ml-12">
                  {group.payments.map((payment) => {
                    const config = paymentTypeConfig[payment.type];
                    const Icon = config.icon;

                    return (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 ${config.bgColor} rounded-lg`}>
                            <Icon className={`w-4 h-4 ${config.color}`} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {config.label}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(payment.created_at).toLocaleString("pt-BR")}
                            </p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(payment.amount)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Total Pago */}
                {group.payments.length > 1 && (
                  <div className="mt-3 ml-12 pt-3 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Total Pago ({group.payments.length} pagamentos)
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(group.total)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

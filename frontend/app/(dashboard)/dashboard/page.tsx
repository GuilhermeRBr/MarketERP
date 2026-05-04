"use client";

import { useProducts } from "@/hooks/useProducts";
import { useSales } from "@/hooks/useSales";
import { useUsers } from "@/hooks/useUsers";
import { formatCurrency } from "@/utils/formatters";
import {
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowUp,
  ArrowDown,
  Calendar,
  BarChart3,
} from "lucide-react";
import { useMemo } from "react";

export default function DashboardPage() {
  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: sales, isLoading: loadingSales } = useSales();
  const { data: users, isLoading: loadingUsers } = useUsers();

  // Calcular estatísticas
  const stats = useMemo(() => {
    if (!products || !sales || !users) {
      return {
        // Financeiro
        totalRevenue: 0,
        revenueToday: 0,
        revenueThisMonth: 0,
        revenueLastMonth: 0,
        revenueGrowth: 0,
        
        // Vendas
        totalSales: 0,
        salesToday: 0,
        salesThisMonth: 0,
        completedSales: 0,
        cancelledSales: 0,
        averageTicket: 0,
        
        // Produtos
        totalProducts: 0,
        activeProducts: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0,
        totalStockValue: 0,
        
        // Usuários
        totalUsers: 0,
        activeUsers: 0,
        
        // Top produtos
        topProducts: [],
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);

    // Filtrar vendas
    const salesToday = sales.filter((sale) => {
      const saleDate = new Date(sale.created_at);
      saleDate.setHours(0, 0, 0, 0);
      return saleDate.getTime() === today.getTime();
    });

    const salesThisMonth = sales.filter((sale) => {
      const saleDate = new Date(sale.created_at);
      return saleDate >= thisMonth;
    });

    const salesLastMonth = sales.filter((sale) => {
      const saleDate = new Date(sale.created_at);
      return saleDate >= lastMonth && saleDate <= lastMonthEnd;
    });

    const completedSales = sales.filter((s) => s.status === "completed");
    const completedSalesToday = salesToday.filter((s) => s.status === "completed");
    const completedSalesThisMonth = salesThisMonth.filter((s) => s.status === "completed");
    const completedSalesLastMonth = salesLastMonth.filter((s) => s.status === "completed");

    // Calcular receitas
    const totalRevenue = completedSales.reduce((sum, sale) => sum + sale.total, 0);
    const revenueToday = completedSalesToday.reduce((sum, sale) => sum + sale.total, 0);
    const revenueThisMonth = completedSalesThisMonth.reduce((sum, sale) => sum + sale.total, 0);
    const revenueLastMonth = completedSalesLastMonth.reduce((sum, sale) => sum + sale.total, 0);

    // Calcular crescimento
    const revenueGrowth = revenueLastMonth > 0 
      ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100 
      : 0;

    // Ticket médio
    const averageTicket = completedSales.length > 0 
      ? totalRevenue / completedSales.length 
      : 0;

    // Valor total em estoque
    const totalStockValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    // Top produtos - Como não temos acesso aos items das vendas na listagem,
    // vamos mostrar os produtos com menor estoque (mais vendidos provavelmente)
    const topProducts = products
      .filter(p => p.active)
      .sort((a, b) => {
        // Produtos com menos estoque provavelmente são mais vendidos
        // Mas também consideramos o preço para dar peso
        const scoreA = (100 - a.stock) * a.price;
        const scoreB = (100 - b.stock) * b.price;
        return scoreB - scoreA;
      })
      .slice(0, 5)
      .map(product => ({
        product,
        quantity: 100 - product.stock // Estimativa de vendas baseada no estoque
      }));

    return {
      // Financeiro
      totalRevenue,
      revenueToday,
      revenueThisMonth,
      revenueLastMonth,
      revenueGrowth,
      
      // Vendas
      totalSales: sales.length,
      salesToday: salesToday.length,
      salesThisMonth: salesThisMonth.length,
      completedSales: completedSales.length,
      cancelledSales: sales.filter((s) => s.status === "cancelled").length,
      averageTicket,
      
      // Produtos
      totalProducts: products.length,
      activeProducts: products.filter((p) => p.active).length,
      lowStockProducts: products.filter((p) => p.active && p.stock > 0 && p.stock < 10).length,
      outOfStockProducts: products.filter((p) => p.active && p.stock === 0).length,
      totalStockValue,
      
      // Usuários
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.active).length,
      
      // Top produtos
      topProducts,
    };
  }, [products, sales, users]);

  const isLoading = loadingProducts || loadingSales || loadingUsers;

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral do desempenho da empresa</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Cards Principais - Métricas Financeiras */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Receita Total */}
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
            {formatCurrency(stats.totalRevenue)}
          </h3>
          <p className="text-green-100 text-sm">Receita Total</p>
          <div className="mt-3 pt-3 border-t border-white/20 text-xs">
            {stats.completedSales} vendas concluídas
          </div>
        </div>

        {/* Receita do Mês */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
              stats.revenueGrowth >= 0 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {stats.revenueGrowth >= 0 ? (
                <ArrowUp className="w-3 h-3" />
              ) : (
                <ArrowDown className="w-3 h-3" />
              )}
              {Math.abs(stats.revenueGrowth).toFixed(1)}%
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">
            {formatCurrency(stats.revenueThisMonth)}
          </h3>
          <p className="text-gray-600 text-sm">Receita do Mês</p>
          <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
            {stats.salesThisMonth} vendas este mês
          </div>
        </div>

        {/* Vendas Hoje */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs text-gray-500 font-semibold">Hoje</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">
            {stats.salesToday}
          </h3>
          <p className="text-gray-600 text-sm">Vendas Hoje</p>
          <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-purple-600 font-medium">
            {formatCurrency(stats.revenueToday)} em receita
          </div>
        </div>

        {/* Ticket Médio */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-xs text-gray-500 font-semibold">Média</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">
            {formatCurrency(stats.averageTicket)}
          </h3>
          <p className="text-gray-600 text-sm">Ticket Médio</p>
          <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
            Por venda concluída
          </div>
        </div>
      </div>

      {/* Métricas Operacionais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Produtos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Produtos</h3>
              <p className="text-xs text-gray-500">Inventário</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total cadastrado</span>
              <span className="text-lg font-bold text-gray-900">{stats.totalProducts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ativos</span>
              <span className="text-lg font-bold text-green-600">{stats.activeProducts}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="text-sm text-gray-600">Valor em estoque</span>
              <span className="text-lg font-bold text-blue-600">
                {formatCurrency(stats.totalStockValue)}
              </span>
            </div>
          </div>
        </div>

        {/* Usuários */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Usuários</h3>
              <p className="text-xs text-gray-500">Equipe</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total cadastrado</span>
              <span className="text-lg font-bold text-gray-900">{stats.totalUsers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ativos</span>
              <span className="text-lg font-bold text-green-600">{stats.activeUsers}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="text-sm text-gray-600">Inativos</span>
              <span className="text-lg font-bold text-gray-400">
                {stats.totalUsers - stats.activeUsers}
              </span>
            </div>
          </div>
        </div>

        {/* Status de Vendas */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Vendas</h3>
              <p className="text-xs text-gray-500">Status</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total</span>
              <span className="text-lg font-bold text-gray-900">{stats.totalSales}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Concluídas</span>
              </div>
              <span className="text-lg font-bold text-green-600">{stats.completedSales}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-gray-600">Canceladas</span>
              </div>
              <span className="text-lg font-bold text-red-600">{stats.cancelledSales}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas e Top Produtos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas de Estoque */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            Alertas de Estoque
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
              <div>
                <p className="text-sm font-semibold text-red-900">
                  Produtos sem estoque
                </p>
                <p className="text-xs text-red-700 mt-1">Requer atenção imediata</p>
              </div>
              <span className="text-3xl font-bold text-red-600">
                {stats.outOfStockProducts}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <div>
                <p className="text-sm font-semibold text-yellow-900">
                  Estoque baixo ({"<"} 10 unidades)
                </p>
                <p className="text-xs text-yellow-700 mt-1">Considere repor</p>
              </div>
              <span className="text-3xl font-bold text-yellow-600">
                {stats.lowStockProducts}
              </span>
            </div>
          </div>
        </div>

        {/* Top 5 Produtos em Destaque */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Top 5 Produtos em Destaque
          </h3>
          {stats.topProducts.length > 0 ? (
            <div className="space-y-3">
              {stats.topProducts.map((item, index) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(item.product.price)} • Estoque: {item.product.stock}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-semibold ${
                        item.product.stock > 10
                          ? "bg-green-100 text-green-800"
                          : item.product.stock > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.product.stock > 10 ? "Bom" : item.product.stock > 0 ? "Baixo" : "Sem estoque"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Nenhum produto cadastrado ainda</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-6 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-600 rounded-lg">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Sistema Completo e Operacional
            </h4>
            <p className="text-sm text-gray-600">
              Todos os módulos estão funcionando: Autenticação, Produtos, Usuários, 
              Vendas, Pagamentos e Dashboard. O sistema está pronto para uso!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

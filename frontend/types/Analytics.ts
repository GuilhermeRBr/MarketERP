export interface CriticalProduct {
  product_id: number;
  product_name: string;
  stock: number;
  avg_daily_sales: number;
  days_until_empty: number | null;
  alert_level: "critical" | "warning" | "ok";
}

export interface TopSellingProduct {
  product_id: number;
  product_name: string;
  total_quantity_sold: number;
  total_revenue: number;
  price: number;
}

export interface Analytics {
  low_stock_count: number;
  out_of_stock_count: number;
  critical_products: CriticalProduct[];
  top_selling: TopSellingProduct[];
  analysis_period_days: number;
}

// --- Charts ---

export type ChartRange = "1d" | "7d" | "30d" | "90d" | "1y" | "all";

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  sales_count: number;
}

export interface TopProductChartItem {
  product_name: string;
  total_quantity_sold: number;
  total_revenue: number;
}

export interface ChartsData {
  revenue_over_time: RevenueDataPoint[];
  top_products: TopProductChartItem[];
  total_revenue: number;
  total_sales: number;
  period_label: string;
}

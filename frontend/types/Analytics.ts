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

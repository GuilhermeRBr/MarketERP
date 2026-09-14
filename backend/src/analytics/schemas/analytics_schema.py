from pydantic import BaseModel
from typing import List, Optional


class CriticalProductResponse(BaseModel):
    product_id: int
    product_name: str
    stock: int
    avg_daily_sales: float
    days_until_empty: Optional[float]  # None se não houver histórico de vendas
    alert_level: str  # "critical", "warning", "ok"


class TopSellingProductResponse(BaseModel):
    product_id: int
    product_name: str
    total_quantity_sold: int
    total_revenue: float
    price: float


class AnalyticsResponse(BaseModel):
    low_stock_count: int
    out_of_stock_count: int
    critical_products: List[CriticalProductResponse]
    top_selling: List[TopSellingProductResponse]
    analysis_period_days: int

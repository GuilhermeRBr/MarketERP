from datetime import datetime, timedelta
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import func

from src.products.models.product_model import Product
from src.sales.models.sales_model import Sale, SaleItem, SaleStatus
from src.analytics.schemas.analytics_schema import (
    AnalyticsResponse,
    CriticalProductResponse,
    TopSellingProductResponse,
)

# Limiar de estoque baixo e dias de histórico para análise
LOW_STOCK_THRESHOLD = 10
ANALYSIS_DAYS = 30


class AnalyticsService:

    @staticmethod
    def get_analytics(db: Session) -> AnalyticsResponse:
        cutoff_date = datetime.utcnow() - timedelta(days=ANALYSIS_DAYS)

        # --- Top produtos mais vendidos no período ---
        top_selling_query = (
            db.query(
                Product.id.label("product_id"),
                Product.name.label("product_name"),
                Product.price.label("price"),
                func.sum(SaleItem.quantity).label("total_qty"),
                func.sum(SaleItem.quantity * SaleItem.price).label("total_revenue"),
            )
            .join(SaleItem, SaleItem.product_id == Product.id)
            .join(Sale, Sale.id == SaleItem.sale_id)
            .filter(
                Sale.status == SaleStatus.COMPLETED,
                Sale.created_at >= cutoff_date,
            )
            .group_by(Product.id, Product.name, Product.price)
            .order_by(func.sum(SaleItem.quantity).desc())
            .limit(10)
            .all()
        )

        top_selling: List[TopSellingProductResponse] = [
            TopSellingProductResponse(
                product_id=row.product_id,
                product_name=row.product_name,
                total_quantity_sold=int(row.total_qty),
                total_revenue=float(row.total_revenue),
                price=float(row.price),
            )
            for row in top_selling_query
        ]

        # Mapa de média de vendas por dia por produto (nos últimos ANALYSIS_DAYS dias)
        avg_map: dict[int, float] = {
            row.product_id: float(row.total_qty) / ANALYSIS_DAYS
            for row in top_selling_query
        }

        # --- Produtos ativos com estoque baixo ou zerado ---
        active_products = (
            db.query(Product)
            .filter(Product.active == True)
            .all()
        )

        low_stock_count = sum(
            1 for p in active_products if 0 < p.stock <= LOW_STOCK_THRESHOLD
        )
        out_of_stock_count = sum(
            1 for p in active_products if p.stock == 0
        )

        # --- Produtos críticos: estoque <= threshold OU com previsão de acabar ---
        critical_products: List[CriticalProductResponse] = []

        for product in active_products:
            avg_daily = avg_map.get(product.id, 0.0)

            # Calcula dias até zerar (None se nunca vendeu)
            if avg_daily > 0:
                days_until_empty = product.stock / avg_daily
            else:
                days_until_empty = None

            # Determina nível de alerta
            if product.stock == 0:
                alert_level = "critical"
            elif product.stock <= LOW_STOCK_THRESHOLD:
                alert_level = "warning"
            elif days_until_empty is not None and days_until_empty <= 7:
                # Estoque vai acabar em 7 dias mesmo sem estar abaixo do threshold
                alert_level = "warning"
            else:
                alert_level = "ok"

            # Inclui apenas produtos que merecem atenção
            if alert_level in ("critical", "warning"):
                critical_products.append(
                    CriticalProductResponse(
                        product_id=product.id,
                        product_name=product.name,
                        stock=product.stock,
                        avg_daily_sales=round(avg_daily, 2),
                        days_until_empty=(
                            round(days_until_empty, 1)
                            if days_until_empty is not None
                            else None
                        ),
                        alert_level=alert_level,
                    )
                )

        # Ordenar: críticos primeiro, depois por dias_until_empty asc
        critical_products.sort(
            key=lambda x: (
                0 if x.alert_level == "critical" else 1,
                x.days_until_empty if x.days_until_empty is not None else 9999,
            )
        )

        return AnalyticsResponse(
            low_stock_count=low_stock_count,
            out_of_stock_count=out_of_stock_count,
            critical_products=critical_products,
            top_selling=top_selling,
            analysis_period_days=ANALYSIS_DAYS,
        )

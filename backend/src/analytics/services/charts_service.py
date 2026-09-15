from datetime import datetime, timedelta, date
from typing import List, Literal
from collections import defaultdict
from sqlalchemy.orm import Session
from sqlalchemy import func

from src.products.models.product_model import Product
from src.sales.models.sales_model import Sale, SaleItem, SaleStatus
from src.analytics.schemas.analytics_schema import (
    ChartsResponse,
    RevenueDataPoint,
    TopProductChartItem,
)

RangeType = Literal["1d", "7d", "30d", "90d", "1y", "all"]


def _get_range_config(range: RangeType):
    """Retorna (cutoff_date, granularidade, label, date_fmt)."""
    now = datetime.utcnow()

    if range == "1d":
        return now - timedelta(days=1), "hour", "Últimas 24 horas", "%H:00"
    elif range == "7d":
        return now - timedelta(days=7), "day", "Últimos 7 dias", "%d/%m"
    elif range == "30d":
        return now - timedelta(days=30), "day", "Últimos 30 dias", "%d/%m"
    elif range == "90d":
        return now - timedelta(days=90), "week", "Últimos 3 meses", "Sem %W/%y"
    elif range == "1y":
        return now - timedelta(days=365), "month", "Último ano", "%b/%y"
    else:  # all
        return datetime(2000, 1, 1), "month", "Todo o período", "%b/%y"


def _group_key(dt: datetime, granularity: str, fmt: str) -> str:
    if granularity == "hour":
        return dt.strftime(fmt)
    elif granularity == "day":
        return dt.strftime(fmt)
    elif granularity == "week":
        return dt.strftime(fmt)
    else:  # month
        return dt.strftime(fmt)


class ChartsService:

    @staticmethod
    def get_charts(db: Session, range: RangeType) -> ChartsResponse:
        cutoff, granularity, period_label, date_fmt = _get_range_config(range)

        # Busca todas as vendas concluídas no período
        sales = (
            db.query(Sale)
            .filter(
                Sale.status == SaleStatus.COMPLETED,
                Sale.created_at >= cutoff,
            )
            .order_by(Sale.created_at)
            .all()
        )

        # --- Agrupa receita por período ---
        revenue_map: dict[str, float] = defaultdict(float)
        count_map: dict[str, int] = defaultdict(int)

        for sale in sales:
            key = _group_key(sale.created_at, granularity, date_fmt)
            revenue_map[key] += float(sale.total)
            count_map[key] += 1

        # Garante que o eixo X é contínuo (sem gaps)
        revenue_over_time = _fill_gaps(cutoff, granularity, date_fmt, revenue_map, count_map)

        # --- Top 8 produtos mais vendidos no período ---
        top_query = (
            db.query(
                Product.name.label("product_name"),
                func.sum(SaleItem.quantity).label("total_qty"),
                func.sum(SaleItem.quantity * SaleItem.price).label("total_revenue"),
            )
            .join(SaleItem, SaleItem.product_id == Product.id)
            .join(Sale, Sale.id == SaleItem.sale_id)
            .filter(
                Sale.status == SaleStatus.COMPLETED,
                Sale.created_at >= cutoff,
            )
            .group_by(Product.name)
            .order_by(func.sum(SaleItem.quantity).desc())
            .limit(8)
            .all()
        )

        top_products = [
            TopProductChartItem(
                product_name=row.product_name,
                total_quantity_sold=int(row.total_qty),
                total_revenue=round(float(row.total_revenue), 2),
            )
            for row in top_query
        ]

        total_revenue = sum(s.total for s in sales)
        total_sales = len(sales)

        return ChartsResponse(
            revenue_over_time=revenue_over_time,
            top_products=top_products,
            total_revenue=round(float(total_revenue), 2),
            total_sales=total_sales,
            period_label=period_label,
        )


def _fill_gaps(
    cutoff: datetime,
    granularity: str,
    date_fmt: str,
    revenue_map: dict,
    count_map: dict,
) -> List[RevenueDataPoint]:
    """Gera todos os pontos do eixo X mesmo sem vendas (valor 0)."""
    now = datetime.utcnow()
    points: List[RevenueDataPoint] = []
    seen: set[str] = set()

    current = cutoff

    if granularity == "hour":
        # Arredonda para hora cheia
        current = current.replace(minute=0, second=0, microsecond=0)
        while current <= now:
            key = current.strftime(date_fmt)
            if key not in seen:
                seen.add(key)
                points.append(RevenueDataPoint(
                    date=key,
                    revenue=round(revenue_map.get(key, 0.0), 2),
                    sales_count=count_map.get(key, 0),
                ))
            current += timedelta(hours=1)

    elif granularity == "day":
        current = current.replace(hour=0, minute=0, second=0, microsecond=0)
        while current <= now:
            key = current.strftime(date_fmt)
            if key not in seen:
                seen.add(key)
                points.append(RevenueDataPoint(
                    date=key,
                    revenue=round(revenue_map.get(key, 0.0), 2),
                    sales_count=count_map.get(key, 0),
                ))
            current += timedelta(days=1)

    elif granularity == "week":
        # Começa na segunda-feira da semana do cutoff
        current = current - timedelta(days=current.weekday())
        current = current.replace(hour=0, minute=0, second=0, microsecond=0)
        while current <= now:
            key = current.strftime(date_fmt)
            if key not in seen:
                seen.add(key)
                points.append(RevenueDataPoint(
                    date=key,
                    revenue=round(revenue_map.get(key, 0.0), 2),
                    sales_count=count_map.get(key, 0),
                ))
            current += timedelta(weeks=1)

    else:  # month
        current = current.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        while current <= now:
            key = current.strftime(date_fmt)
            if key not in seen:
                seen.add(key)
                points.append(RevenueDataPoint(
                    date=key,
                    revenue=round(revenue_map.get(key, 0.0), 2),
                    sales_count=count_map.get(key, 0),
                ))
            # Avança um mês
            if current.month == 12:
                current = current.replace(year=current.year + 1, month=1)
            else:
                current = current.replace(month=current.month + 1)

    return points

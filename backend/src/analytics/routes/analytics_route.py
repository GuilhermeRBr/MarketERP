from fastapi import APIRouter, Depends, Query
from typing import Literal
from sqlalchemy.orm import Session

from src.core.dependency import require_owner
from src.data.database import get_db
from src.analytics.schemas.analytics_schema import AnalyticsResponse, ChartsResponse
from src.analytics.services.analytics_service import AnalyticsService
from src.analytics.services.charts_service import ChartsService
from src.user.models.user_model import User

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get(
    "/",
    summary="Get product analytics and stock insights",
    description=(
        "Returns stock alerts, top-selling products and days-until-empty "
        "predictions based on the last 30 days of sales. Owner only."
    ),
    response_model=AnalyticsResponse,
)
def get_analytics(
    _: User = Depends(require_owner),
    db: Session = Depends(get_db),
):
    return AnalyticsService.get_analytics(db)


@router.get(
    "/charts",
    summary="Get chart data for a given date range",
    description=(
        "Returns revenue over time and top products for the selected range. "
        "Ranges: 1d (24h by hour), 7d, 30d (by day), 90d (by week), 1y / all (by month). Owner only."
    ),
    response_model=ChartsResponse,
)
def get_charts(
    range: Literal["1d", "7d", "30d", "90d", "1y", "all"] = Query(
        default="30d", description="Date range for the chart data"
    ),
    _: User = Depends(require_owner),
    db: Session = Depends(get_db),
):
    return ChartsService.get_charts(db, range)

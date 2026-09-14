from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.core.dependency import require_owner
from src.data.database import get_db
from src.analytics.schemas.analytics_schema import AnalyticsResponse
from src.analytics.services.analytics_service import AnalyticsService
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

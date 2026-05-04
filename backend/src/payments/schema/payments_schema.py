from pydantic import BaseModel, Field
from datetime import datetime
from src.payments.models.payments_model import PaymentType


class PaymentCreate(BaseModel):
    sale_id: int = Field(gt=0)
    type: PaymentType
    amount: float = Field(gt=0)


class PaymentResponse(BaseModel):
    id: int
    sale_id: int
    type: str
    amount: float
    created_at: datetime

    class Config:
        from_attributes = True

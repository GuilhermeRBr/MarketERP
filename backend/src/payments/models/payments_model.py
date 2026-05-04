from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Numeric,
)
from src.data.database import Base
from datetime import datetime
import enum

class PaymentType(str, enum.Enum):
    PIX = "pix"
    CREDIT = "credit"
    DEBIT = "debit"
    CASH = "cash"
    OTHER = "other"


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    sale_id = Column(Integer, ForeignKey("sales.id"), nullable=False)
    type = Column(String, nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

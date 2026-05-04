from fastapi import HTTPException
from sqlalchemy.orm import Session
from src.payments.models.payments_model import Payment
from src.payments.schema.payments_schema import PaymentCreate
from src.sales.models.sales_model import Sale
from src.payments.messages.payments_messages import PaymentMessages


class PaymentService:
    @staticmethod
    def create_payment(data: PaymentCreate, db: Session):
        if data.amount <= 0:
            raise HTTPException(
                status_code=400,
                detail=PaymentMessages.INVALID_PAYMENT_AMOUNT,
            )

        sale = db.query(Sale).filter(Sale.id == data.sale_id).first()
        if not sale:
            raise HTTPException(
                status_code=404,
                detail=PaymentMessages.SALE_NOT_FOUND,
            )

        new_payment = Payment(
            sale_id=data.sale_id,
            type=data.type,
            amount=data.amount,
        )

        db.add(new_payment)
        db.commit()
        db.refresh(new_payment)

        return new_payment

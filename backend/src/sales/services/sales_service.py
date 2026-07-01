from fastapi import HTTPException
from sqlalchemy.orm import Session
from src.products.models.product_model import Product
from src.sales.models.sales_model import (
    Sale,
    SaleItem,
    SaleStatus,
)
from src.sales.schemas.sales_schema import SaleCreate
from src.sales.messages.sales_messages import SalesMessages
from src.user.messages.user_message import USER_MESSAGES
from src.user.models.user_model import User


class SalesService:
    @staticmethod
    def new_sale(data: SaleCreate, db: Session):
        if not data.items:
            raise HTTPException(
                status_code=422,
                detail=SalesMessages.INVALID_SALE,
            )

        new_sale = Sale(total=0, status=SaleStatus.PENDING)
        db.add(new_sale)
        db.flush()

        total = 0

        try:
            for item in data.items:

                product = (
                    db.query(Product)
                    .filter(Product.id == item.product_id)
                    .first()
                )

                if not product:
                    raise HTTPException(
                        status_code=404,
                        detail=SalesMessages.PRODUCT_NOT_FOUND,
                    )

                if product.stock < item.quantity:
                    raise HTTPException(
                        status_code=400,
                        detail=SalesMessages.STOCK_NOT_ENOUGH
                        + product.name,
                    )
                if product.active is False:
                    raise HTTPException(
                        status_code=400,
                        detail=SalesMessages.PRODUCT_NOT_ACTIVE,
                    )

                subtotal = product.price * item.quantity
                total += subtotal

                product.stock -= item.quantity

                sales_item = SaleItem(
                    sale_id=new_sale.id,
                    product_id=item.product_id,
                    quantity=item.quantity,
                    price=product.price,
                )

                db.add(sales_item)

            new_sale.total = total
            new_sale.status = SaleStatus.COMPLETED

            db.commit()
            db.refresh

            db.refresh(new_sale)
            return new_sale

        except Exception as e:
            new_sale.status = SaleStatus.CANCELLED
            db.commit()
            raise e

    @staticmethod
    def get_sales(db: Session, current_user: User):
        if current_user.role != "OWNER":
            raise HTTPException(
                status_code=401,
                detail=USER_MESSAGES.UNAUTHORIZED,
            )

        sales = db.query(Sale).all()
        return sales

    @staticmethod
    def get_sale_by_id(db: Session, sale_id: int):
        sale = db.query(Sale).filter(Sale.id == sale_id).first()
        if not sale:
            raise HTTPException(
                status_code=404, detail=SalesMessages.SALE_NOT_FOUND
            )
        return sale

    @staticmethod
    def cancel_sale(db: Session, sale_id: int):
        sale = db.query(Sale).filter(Sale.id == sale_id).first()

        if not sale:
            raise HTTPException(
                status_code=404, detail=SalesMessages.SALE_NOT_FOUND
            )

        if sale.status == SaleStatus.CANCELLED:
            raise HTTPException(
                status_code=400,
                detail=SalesMessages.SALE_ALREADY_CANCELLED,
            )

        items = (
            db.query(SaleItem)
            .filter(SaleItem.sale_id == sale_id)
            .all()
        )

        product_ids = [item.product_id for item in items]

        products = (
            db.query(Product)
            .filter(Product.id.in_(product_ids))
            .all()
        )
        product_map = {product.id: product for product in products}

        for item in items:
            product = product_map.get(item.product_id)

            if not product:
                raise HTTPException(
                    status_code=404,
                    detail=SalesMessages.PRODUCT_NOT_FOUND,
                )

            product.stock += item.quantity

        sale.status = SaleStatus.CANCELLED

        db.commit()

        return sale

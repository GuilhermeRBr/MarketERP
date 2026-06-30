from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from src.products.models.product_model import Product
from src.products.schemas.product_schema import ProductResponse
from src.products.messages.product_messages import (
    ProductMessages,
)
from src.user.messages.user_message import USER_MESSAGES
from src.user.models.user_model import User


class ProductService:
    @staticmethod
    def create_new_product(db: Session, data, current_user: User):
        if current_user.role != "OWNER":
            raise HTTPException(
                status_code=401,
                detail=USER_MESSAGES.UNAUTHORIZED,
            )

        if (
            data.barcode is not None
            and db.query(Product)
            .filter(Product.barcode == data.barcode)
            .first()
        ):
            raise HTTPException(
                status_code=409,
                detail=ProductMessages.PRODUCT_ALREADY_EXISTS_BARCODE,
            )

        if (
            db.query(Product)
            .filter(Product.name == data.name)
            .first()
        ):
            raise HTTPException(
                status_code=409,
                detail=ProductMessages.PRODUCT_ALREADY_EXISTS_NAME,
            )
        elif data.stock <= 0:
            raise HTTPException(
                status_code=422, detail=ProductMessages.INVALID_STOCK
            )
        elif data.price <= 0:
            raise HTTPException(
                status_code=422, detail=ProductMessages.INVALID_PRICE
            )

        new_product = Product(**data.model_dump())
        db.add(new_product)
        db.commit()
        db.refresh(new_product)
        return ProductResponse.model_validate(new_product)

    @staticmethod
    def list_products(db: Session):
        products = db.query(Product).all()
        if not products:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=ProductMessages.NO_PRODUCTS_FOUND,
            )
        return [
            ProductResponse.model_validate(product)
            for product in products
        ]

    @staticmethod
    def get_product(db: Session, product_id: int):
        product = (
            db.query(Product).filter(Product.id == product_id).first()
        )
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=ProductMessages.PRODUCT_NOT_FOUND,
            )
        return ProductResponse.model_validate(product)

    @staticmethod
    def search_products_by_name(db: Session, name: str):
        products = (
            db.query(Product)
            .filter(Product.name.ilike(f"%{name}%"))
            .all()
        )
        if not products:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=ProductMessages.PRODUCT_NOT_FOUND,
            )
        return [
            ProductResponse.model_validate(product)
            for product in products
        ]

    @staticmethod
    def update_product(
        db: Session, product_id: int, data, current_user: User
    ):
        if current_user.role != "OWNER":
            raise HTTPException(
                status_code=401,
                detail=USER_MESSAGES.UNAUTHORIZED,
            )

        product = (
            db.query(Product).filter(Product.id == product_id).first()
        )
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=ProductMessages.PRODUCT_NOT_FOUND,
            )

        update_data = data.model_dump(exclude_unset=True)

        if data.barcode is not None:
            barcode_exists = (
                db.query(Product)
                .filter(
                    Product.barcode == data.barcode,
                    Product.id != product_id,
                )
                .first()
            )

            if barcode_exists:
                raise HTTPException(
                    status_code=409,
                    detail=ProductMessages.PRODUCT_ALREADY_EXISTS_BARCODE,
                )

        if data.name is not None:
            name_exists = (
                db.query(Product)
                .filter(
                    Product.name == data.name,
                    Product.id != product_id,
                )
                .first()
            )

            if name_exists:
                raise HTTPException(
                    status_code=409,
                    detail=ProductMessages.PRODUCT_ALREADY_EXISTS_NAME,
                )

        for key, value in update_data.items():
            setattr(product, key, value)

        db.commit()
        db.refresh(product)

        return ProductResponse.model_validate(product)

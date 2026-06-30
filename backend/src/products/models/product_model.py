from sqlalchemy import Column, Integer, Numeric, String, Boolean
from src.data.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    price = Column(Numeric(10, 2), nullable=False)
    stock = Column(Integer, default=0)
    barcode = Column(String, nullable=True, unique=True)
    active = Column(Boolean, default=True)

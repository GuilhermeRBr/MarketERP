from sqlalchemy import Column, Integer, String, Boolean
from src.data.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False, default="operator")
    active = Column(Boolean, default=True)

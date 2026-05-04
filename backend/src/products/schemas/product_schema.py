from typing import Optional
from pydantic import BaseModel, Field, field_validator, ConfigDict


class ProductCreate(BaseModel):

    name: str = Field(
        ...,
        min_length=3,
        max_length=100,
        json_schema_extra={"example": "Coca-Cola 2L"},
        pattern=r"^[a-zA-ZÀ-ÿ0-9 .\-+]+$",
    )

    @field_validator("name")
    def clean_name(cls, value):
        return value.strip()

    price: float = Field(
        ..., gt=0, json_schema_extra={"example": 9.99}
    )

    stock: int = Field(
        ..., ge=0, json_schema_extra={"example": 100}, le=1_000_000
    )

    barcode: Optional[str] = Field(
        None,
        min_length=8,
        max_length=13,
        json_schema_extra={"example": "1234567890123"},
    )

    active: bool = Field(..., json_schema_extra={"example": True})


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(
        None,
        min_length=3,
        max_length=100,
        json_schema_extra={"example": "Coca-Cola 2L"},
        pattern=r"^[a-zA-ZÀ-ÿ0-9 .\-+]+$",
    )

    @field_validator("name")
    def clean_name(cls, value):
        return value.strip()

    price: Optional[float] = Field(None, gt=0, example=9.99)
    stock: Optional[int] = Field(
        None, ge=0, json_schema_extra={"example": 100}, le=1_000_000
    )
    barcode: Optional[str] = Field(
        None,
        min_length=8,
        max_length=13,
        json_schema_extra={"example": "1234567890123"},
    )
    active: Optional[bool] = Field(
        None, json_schema_extra={"example": True}
    )


class ProductResponse(BaseModel):
    id: int
    name: str
    price: float
    stock: int
    barcode: str
    active: bool

    model_config = ConfigDict(from_attributes=True)

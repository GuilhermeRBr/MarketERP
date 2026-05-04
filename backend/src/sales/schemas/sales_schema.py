from pydantic import BaseModel, Field
from typing import List


class SaleItemCreate(BaseModel):
    product_id: int = Field(
        gt=0, le=1_000_000, json_schema_extra={"example": 1}
    )
    quantity: int = Field(
        gt=0, le=1_000_000, json_schema_extra={"example": 1}
    )


class SaleCreate(BaseModel):
    items: List[SaleItemCreate] = Field(min_length=1)

from src.utils.common_schemas import PriceDetails
from pydantic import BaseModel
from typing import Optional

class IndustryDetails(BaseModel):
    industry: Optional[str] = None
    sector: Optional[str] = None

class StockItem(BaseModel):
    displayName: Optional[str] = None
    shortName: Optional[str] = None
    longName: Optional[str] = None
    summary: Optional[str] = None
    marketState: Optional[str] = None
    marketCap: Optional[int] = None
    industryDetails: IndustryDetails
    priceDetails: PriceDetails
    
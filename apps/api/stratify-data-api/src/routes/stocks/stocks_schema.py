from pydantic import BaseModel
from typing import Optional

class Address(BaseModel):
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None

class IndustryDetails(BaseModel):
    industry: Optional[str] = None
    sector: Optional[str] = None

class FinancialDetails(BaseModel):
    marketCap: Optional[float] = None

class Market(BaseModel):
    marketRegion: Optional[str] = None
    marketState: Optional[str] = None
    industryDetails: IndustryDetails
    financialDetails: FinancialDetails

class PriceDetails(BaseModel):
    currentPrice: Optional[float] = None
    previousClose: Optional[float] = None
    dayChange: Optional[float] = None
    dayChangePercent: Optional[float] = None

class StockItem(BaseModel):
    displayName: Optional[str] = None
    shortName: Optional[str] = None
    longName: Optional[str] = None
    address: Address
    summary: Optional[str] = None
    market: Market
    priceDetails: PriceDetails
    
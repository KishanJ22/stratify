from pydantic import BaseModel
from typing import List, Optional

class AssetPrice(BaseModel):
    date: str # YYYY-MM-DD
    open: float
    high: float
    low: float
    close: float
    volume: float
    
class Asset(BaseModel):
    ticker: str
    country: str
    type: str
    assetPriceList: List[AssetPrice]

class PricingIngestorSuccess(BaseModel):
    data: Asset
    success: bool
    
class PricingIngestorFailure(BaseModel):
    filepath: str
    error: Optional[str] = None
    success: bool
    
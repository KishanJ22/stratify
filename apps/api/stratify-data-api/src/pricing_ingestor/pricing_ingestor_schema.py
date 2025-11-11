from pydantic import BaseModel
from typing import List, Optional

class AssetPrice(BaseModel):
    ticker: str
    country: str
    date: str # YYYY-MM-DD
    open: float
    high: float
    low: float
    close: float
    volume: float

class PricingIngestorSuccess(BaseModel):
    data: List[AssetPrice]
    success: bool
    
class PricingIngestorFailure(BaseModel):
    filepath: str
    error: Optional[str] = None
    success: bool
    
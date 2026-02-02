from src.utils.common_schemas import PriceDetails
from pydantic import BaseModel
from typing import List, Optional

class QuoteItem(BaseModel):
    symbol: Optional[str] = None
    displayName: Optional[str] = None
    shortName: Optional[str] = None
    longName: Optional[str] = None
    marketState: Optional[str] = None
    marketCap: Optional[int] = None
    priceDetails: PriceDetails
    
class QuoteListGetResponse(BaseModel):
    data: List[QuoteItem]
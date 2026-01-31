from src.utils.common_schemas import PriceDetails, ExchangeDetails
from pydantic import BaseModel
from typing import List, Optional

class QuoteItem(BaseModel):
    displayName: Optional[str] = None
    shortName: Optional[str] = None
    longName: Optional[str] = None
    marketState: Optional[str] = None
    marketCap: Optional[float] = None
    exchange: ExchangeDetails
    priceDetails: PriceDetails
    
class QuoteListGetResponse(BaseModel):
    data: List[QuoteItem]
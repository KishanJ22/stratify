from src.utils.common_schemas import PriceDetails
from pydantic import BaseModel
from typing import List, Optional

class QuoteItem(BaseModel):
    symbol: str
    marketState: str
    priceDetails: PriceDetails
    
class QuoteListGetResponse(BaseModel):
    data: List[QuoteItem]
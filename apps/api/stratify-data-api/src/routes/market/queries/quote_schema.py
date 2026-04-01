from src.utils.common_schemas import PriceDetails
from pydantic import BaseModel
from typing import List

class QuoteItem(BaseModel):
    symbol: str
    marketState: str
    assetType: str
    priceDetails: PriceDetails
    
class QuoteListGetResponse(BaseModel):
    data: List[QuoteItem]
from src.utils.common_schemas import PriceDetails, ExchangeDetails
from pydantic import BaseModel
from typing import List

class SectorWeight(BaseModel):
    sector: str
    weight: float

class FundItem(BaseModel):
    shortName: str
    longName: str
    symbol: str
    type: str
    fundFamily: str
    marketState: str
    currency: str
    exchange: ExchangeDetails
    priceDetails: PriceDetails
    sectorWeights: List[SectorWeight]
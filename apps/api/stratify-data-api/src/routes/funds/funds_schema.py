from src.utils.common_schemas import PriceDetails, ExchangeDetails
from pydantic import BaseModel

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
    sectorWeights: dict[str, float]
from src.utils.common_schemas import PriceDetails, ExchangeDetails
from pydantic import BaseModel

class CryptocurrencyItem(BaseModel):
    name: str
    symbol: str
    description: str
    fromCurrency: str
    toCurrency: str
    marketCap: float
    allTimeHigh: float
    allTimeLow: float
    priceDetails: PriceDetails
    exchange: ExchangeDetails
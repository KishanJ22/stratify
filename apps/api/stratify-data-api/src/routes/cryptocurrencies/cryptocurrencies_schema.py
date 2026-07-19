from src.utils.common_schemas import PriceDetails, IndustryDetails
from pydantic import BaseModel

class CryptocurrencyItem(BaseModel):
    name: str
    symbol: str
    description: str
    fromCurrency: str
    toCurrency: str
    marketCap: float
    marketState: str
    allTimeHigh: float
    allTimeLow: float
    industryDetails: IndustryDetails
    priceDetails: PriceDetails
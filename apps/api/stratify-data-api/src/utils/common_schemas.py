from pydantic import BaseModel
from typing import Optional

class ExchangeDetails(BaseModel):
    exchangeName: Optional[str] = None
    exchangeTimezone: Optional[str] = None

class OHLCV(BaseModel):
    open: float
    high: float
    low: float
    close: float
    volume: int
    change: float
    changePercent: float

class PriceDetails(BaseModel):
    currentPrice: float
    dayTradingActivity: OHLCV
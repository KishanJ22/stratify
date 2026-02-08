from pydantic import BaseModel
from typing import Optional

class ExchangeDetails(BaseModel):
    exchangeName: Optional[str] = None
    exchangeTimezone: Optional[str] = None

class OHLCV(BaseModel):
    open: Optional[float] = None
    high: Optional[float] = None
    low: Optional[float] = None
    close: Optional[float] = None
    volume: Optional[int] = None
    change: Optional[float] = None
    changePercent: Optional[float] = None

class PriceDetails(BaseModel):
    currentPrice: Optional[float] = None
    dayTradingActivity: OHLCV
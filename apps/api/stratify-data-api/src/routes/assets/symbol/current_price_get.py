from fastapi import APIRouter, Query, HTTPException
from yfinance import Ticker
from pydantic import BaseModel
from src.utils.clean_symbol import clean_symbol

class CurrentPrice(BaseModel):
    currentPrice: float
    change: float
    changePercent: float
    
class CurrentPriceResponse(BaseModel):
    data: CurrentPrice

def format_current_price_details(ticker_info):
    return {
        "currentPrice": ticker_info.get("regularMarketPrice"),
        "change": ticker_info.get("regularMarketChange"),
        "changePercent": ticker_info.get("regularMarketChangePercent"),
    }

current_price_get = APIRouter()

@current_price_get.get("/assets/{symbol}/current-price", tags=["stocks", "cryptocurrencies", "funds"])
async def get_current_price(symbol: str) -> CurrentPriceResponse:
    try:
        cleaned_symbol = clean_symbol(symbol)
        
        if not cleaned_symbol:
            raise HTTPException(status_code=400, detail="A valid symbol is required")
            
        ticker = Ticker(cleaned_symbol)
        ticker_info = ticker.info
        
        if not ticker_info or ticker_info.get("quoteType") == "NONE":
            raise HTTPException(status_code=404, detail="Symbol not found")
            
        current_price_details = format_current_price_details(ticker_info)
        
        return CurrentPriceResponse(data=current_price_details)
    except HTTPException:
        raise
    except Exception as err:
        print(f"Error retrieving current price data: {err}")
        
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )
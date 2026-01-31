from src.routes.funds.funds_schema import FundItem
from src.utils.clean_symbol import clean_symbol
from fastapi import APIRouter, Query, HTTPException
from yfinance import Tickers
from pydantic import BaseModel
from typing import List

def format_fund_info(ticker_info) -> FundItem:
    return {
        "shortName": ticker_info.get("shortName"),
        "longName": ticker_info.get("longName"),
        "symbol": ticker_info.get("symbol"),
        "type": ticker_info.get("quoteType"),
        "fundFamily": ticker_info.get("fundFamily"),
        "marketState": ticker_info.get("marketState"),
        "currency": ticker_info.get("currency"),
        "exchange": {
          "exchangeName": ticker_info.get("fullExchangeName"),
          "exchangeTimezone": ticker_info.get("exchangeTimezoneShortName")
        },
        "priceDetails": {
            "currentPrice": ticker_info.get("regularMarketPrice"),
            "dayTradingActivity": {
                "open": ticker_info.get("regularMarketOpen"),
                "high": ticker_info.get("regularMarketDayHigh"),
                "low": ticker_info.get("regularMarketDayLow"),
                "close": ticker_info.get("regularMarketPreviousClose"),
                "volume": ticker_info.get("regularMarketVolume"),
                "change": ticker_info.get("regularMarketChange"),
                "changePercent": ticker_info.get("regularMarketChangePercent"),
            },
        }
    }
    
class FundsGetResponse(BaseModel):
    data: List[FundItem]

funds_get = APIRouter()

@funds_get.get("/funds", tags=["funds"])
async def get_funds(
    symbols: str = Query(
        description="Comma-separated fund symbols",
        examples={"Symbols": "VUAG.L, IITU.L"},
        )
    ) -> FundsGetResponse:
        try:
            symbol_list = []
            
            for symbol in symbols.split(","):
                cleaned = clean_symbol(symbol)
                if cleaned:
                    symbol_list.append(cleaned)
                    
            if not symbol_list or len(symbol_list) < 1:
                raise HTTPException(status_code=400, detail="No valid fund symbols provided")
            
            tickers = Tickers(' '.join(symbol_list)).tickers
            
            formatted_funds = []
            
            for ticker in tickers:
                ticker_data = tickers[ticker].info
                
                if not ticker_data or ticker_data.get("quoteType") == "NONE":
                    print(f"No info found for ticker: {ticker}")
                    continue
                
                formatted_funds.append(format_fund_info(ticker_data))
            
            return FundsGetResponse(data=formatted_funds)
        except HTTPException:
            raise
        
        except Exception as e:
            print("Error fetching funds:", e)
            raise HTTPException(status_code=500, detail="Internal Server Error")
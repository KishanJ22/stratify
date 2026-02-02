from fastapi import APIRouter, Query, HTTPException
from src.routes.stocks.stocks_schema import StockItem
from src.utils.clean_symbol import clean_symbol
from yfinance import Tickers
from pydantic import BaseModel
from typing import List

class StocksGetResponse(BaseModel):
    data: List[StockItem]

def format_stock_info(ticker_info) -> StockItem:    
    return {
        "displayName": ticker_info.get("displayName"),
        "shortName": ticker_info.get("shortName"),
        "longName": ticker_info.get("longName"),
        "summary": ticker_info.get("longBusinessSummary"),
        "marketState": ticker_info.get("marketState"),
        "marketCap": ticker_info.get("marketCap"),
        "industryDetails": {
            "industry": ticker_info.get("industry"),
            "sector": ticker_info.get("sector"),
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

symbols_get = APIRouter()

@symbols_get.get("/stocks", tags=["stocks"])
async def get_stocks(
    symbols: str = Query(
        description="Comma-separated stock symbols",
        examples={"Symbols": "AAPL,MSFT,GOOGL"},
        )
    ):
        try:
            symbol_list = []
            for symbol in symbols.split(","):
                cleaned = clean_symbol(symbol)
                if cleaned:  # Only add non-empty symbols
                    symbol_list.append(cleaned)

            if not symbol_list or len(symbol_list) < 1:
                raise HTTPException(status_code=400, detail="At least one symbol is required")

            tickers = Tickers(' '.join(symbol_list)).tickers
            formatted_stocks = []

            
            for ticker in tickers:
                ticker_data = tickers[ticker].info
                if not ticker_data or ticker_data.get("quoteType") == "NONE":
                    print(f"No info found for ticker: {ticker}")
                    continue

                ticker_info = format_stock_info(ticker_data)

                if ticker_info:
                    formatted_stocks.append(ticker_info)

            if not formatted_stocks or len(formatted_stocks) == 0:
                raise HTTPException(
                    status_code=404, 
                    detail="No stock data found for the provided symbols"
                )

            return StocksGetResponse(data=formatted_stocks)
        except HTTPException:
            # Required for properly returning error responses
            raise
        
        except Exception as err:
            print(f"Error retrieving stock data: {err}")
            raise HTTPException(
                status_code=500,
                detail="Internal server error"
            )

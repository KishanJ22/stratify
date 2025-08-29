from fastapi import APIRouter, Query, HTTPException
from src.utils.calculate_change import calculate_change, calculate_change_percent
from src.routes.stocks.stocks_schema import StockItem
from yfinance import Tickers
from pydantic import BaseModel
from typing import List
import re

class StocksList(BaseModel):
    stocks: List[StockItem]

class StocksGetResponse(BaseModel):
    data: StocksList

def format_ticker_info(ticker_info):    
    return {
        "displayName": ticker_info.get("displayName"),
        "shortName": ticker_info.get("shortName"),
        "longName": ticker_info.get("longName"),
        "address": {
            "address": ticker_info.get("address1"),
            "city": ticker_info.get("city"),
            "state": ticker_info.get("state"),
            "zip": ticker_info.get("zip"),
            "country": ticker_info.get("country"),
            "phone": ticker_info.get("phone")
        },
        "summary": ticker_info.get("longBusinessSummary"),
        "market": {
            "marketRegion": ticker_info.get("market"),
            "marketState": ticker_info.get("marketState"),
            "industryDetails": {
                "industry": ticker_info.get("industry"),
                "sector": ticker_info.get("sector"),
            },
            "financialDetails": {
                "marketCap": ticker_info.get("marketCap"),
            }
        },
        "priceDetails": {
            "currentPrice": ticker_info.get("currentPrice"),
            "previousClose": ticker_info.get("previousClose"),
            "dayChange": calculate_change(
                ticker_info.get("currentPrice"), 
                ticker_info.get("previousClose")
            ),
            "dayChangePercent": calculate_change_percent(
                ticker_info.get("currentPrice"), 
                ticker_info.get("previousClose")
            ),
        }
    }
    
def clean_symbol(symbol: str):
    cleaned = re.sub(r'["\'\s]', '', symbol.strip())
    # Keep only alphanumeric characters, hyphens, and dots (common in stock symbols)
    cleaned = re.sub(r'[^A-Za-z0-9\-\.]', '', cleaned)
    return cleaned.upper()

symbols_get = APIRouter()

@symbols_get.get("/stocks", tags=["stocks"])
async def get_stocks(
    symbols: str = Query(
        description="Comma-separated stock symbols",
        examples={"Symbols": "AAPL,MSFT,GOOGL"},
        )
    ) -> StocksGetResponse:
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

                ticker_info = format_ticker_info(ticker_data)

                if ticker_info:
                    formatted_stocks.append(ticker_info)  

            if not formatted_stocks:
                raise HTTPException(
                    status_code=404, 
                    detail="No stock data found for the provided symbols"
                )

            return StocksGetResponse(
                data=StocksList(stocks=formatted_stocks)
            )
        except HTTPException:
            # Required for properly returning error responses
            raise
        except Exception as err:
            print(f"Error retrieving stock data: {err}")
            raise HTTPException(
                status_code=500,
                detail="Internal server error"
            )

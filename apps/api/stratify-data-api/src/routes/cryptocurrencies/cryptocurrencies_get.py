from src.routes.cryptocurrencies.cryptocurrencies_schema import CryptocurrencyItem
from src.utils.clean_symbol import clean_symbol
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from yfinance import Tickers
from typing import List
import logging

def format_cryptocurrency_data(crypto_data) -> CryptocurrencyItem:
    return {
        "name": crypto_data.get("name"),
        "symbol": crypto_data.get("symbol"),
        "description": crypto_data.get("description"),
        "fromCurrency": crypto_data.get("fromCurrency"),
        "toCurrency": crypto_data.get("currency"),
        "marketCap": crypto_data.get("marketCap"),
        "allTimeHigh": crypto_data.get("allTimeHigh"),
        "allTimeLow": crypto_data.get("allTimeLow"),
        "priceDetails": {
            "currentPrice": crypto_data.get("regularMarketPrice"),
            "dayTradingActivity": {
                "open": crypto_data.get("regularMarketOpen"),
                "high": crypto_data.get("regularMarketDayHigh"),
                "low": crypto_data.get("regularMarketDayLow"),
                "close": crypto_data.get("regularMarketPreviousClose"),
                "volume": crypto_data.get("regularMarketVolume"),
                "change": crypto_data.get("regularMarketChange"),
                "changePercent": crypto_data.get("regularMarketChangePercent"),
            },
        }
    }

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CryptoCurrenciesGetResponse(BaseModel):
    data: List[CryptocurrencyItem]

crypto_symbols_get = APIRouter()

@crypto_symbols_get.get("/cryptocurrencies", tags=["cryptocurrencies"])
async def get_cryptocurrencies(symbols: str = Query(
        description="Comma-separated cryptocurrency symbols",
        examples={"Symbols": "BTC-USD,ETH-USD,ADA-GBP"}
        )
    ):
    try:
        symbol_list = []
        
        for symbol in symbols.split(","):
            cleaned = clean_symbol(symbol)
            if cleaned:
                symbol_list.append(cleaned)
                
        if not symbol_list or len(symbol_list) == 0:
            raise HTTPException(status_code=400, detail="At least one symbol is required")
        
        tickers = Tickers(' '.join(symbol_list)).tickers
        
        formatted_cryptocurrencies = []
        
        for ticker in tickers:
            ticker_data = tickers[ticker].info
            
            if not ticker_data or ticker_data.get("quoteType") == "NONE":
                logger.error(f"No info found for ticker: {ticker}")
                continue
            
            crypto_info = format_cryptocurrency_data(ticker_data)
            
            if crypto_info:
                formatted_cryptocurrencies.append(crypto_info)
                
            if not formatted_cryptocurrencies:
                raise HTTPException(
                    status_code=404,
                    detail="No cryptocurrency data found for the provided symbols"
                )
            
        return CryptoCurrenciesGetResponse(data=formatted_cryptocurrencies)
    except HTTPException:
            # Required for properly returning error responses
            raise
        
    except Exception as err:
        logger.error(f"Error retrieving stock data: {err}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

from concurrent.futures import ThreadPoolExecutor, as_completed
from src.routes.cryptocurrencies.cryptocurrencies_schema import CryptocurrencyItem
from src.utils.clean_symbol import clean_symbol
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from yfinance import Tickers
from typing import List

def format_cryptocurrency_data(crypto_data) -> CryptocurrencyItem:
    return {
        "name": crypto_data.get("name"),
        "symbol": crypto_data.get("symbol"),
        "description": crypto_data.get("description"),
        "fromCurrency": crypto_data.get("fromCurrency"),
        "toCurrency": crypto_data.get("currency"),
        "marketCap": crypto_data.get("marketCap"),
        "marketState": crypto_data.get("marketState"),
        "allTimeHigh": crypto_data.get("allTimeHigh"),
        "allTimeLow": crypto_data.get("allTimeLow"),
        "industryDetails": {
            "industry": "fintech",
            "sector": "cryptocurrency"
        },
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

class CryptoCurrenciesGetResponse(BaseModel):
    data: List[CryptocurrencyItem]
    
def fetch_crypto_ticker(ticker, tickers):
    data = tickers[ticker].info
    
    if not data or data.get("quoteType") == "NONE":
        return None
    
    return format_cryptocurrency_data(data)
    

crypto_symbols_get = APIRouter()

@crypto_symbols_get.get("/cryptocurrencies", tags=["cryptocurrencies"])
async def get_cryptocurrencies(symbols: str = Query(
        description="Comma-separated cryptocurrency symbols",
        examples={"Symbols": "BTC-USD,ETH-USD,ADA-GBP"}
        )
    ) -> CryptoCurrenciesGetResponse:
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
        
        with ThreadPoolExecutor() as executor:
            futures = [executor.submit(fetch_crypto_ticker, t, tickers) for t in tickers]
            
            for future in as_completed(futures):
                result = future.result()
                
                if result:
                    formatted_cryptocurrencies.append(result)
                
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
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

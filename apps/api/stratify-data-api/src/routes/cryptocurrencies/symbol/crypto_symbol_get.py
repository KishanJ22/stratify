from src.routes.cryptocurrencies.cryptocurrencies_schema import CryptocurrencyItem
from src.routes.cryptocurrencies.cryptocurrencies_get import format_cryptocurrency_data
from src.utils.clean_symbol import clean_symbol
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from yfinance import Ticker
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CryptoSymbolGetResponse(BaseModel):
    data: CryptocurrencyItem

crypto_symbol_get = APIRouter()

@crypto_symbol_get.get("/cryptocurrencies/{symbol}", tags=["cryptocurrencies"])
async def get_cryptocurrency(symbol: str) -> CryptoSymbolGetResponse:
    try:
        cleaned_symbol = clean_symbol(symbol)
        crypto_data = Ticker(cleaned_symbol).info
        
        if not crypto_data or crypto_data.get("quoteType") == "NONE":
            raise HTTPException(status_code=404, detail=f"Cryptocurrency with symbol {symbol} not found")
        
        formatted_data = format_cryptocurrency_data(crypto_data)
        
        return CryptoSymbolGetResponse(data=formatted_data)
    except HTTPException:
            # Required for properly returning error responses
            raise
    except Exception as err:
        logger.error(f"Error retrieving cryptocurrency data: {err}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

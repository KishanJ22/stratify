from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from yfinance import Ticker
from src.routes.stocks.stocks_schema import StockItem
from src.routes.stocks.stocks_get import format_ticker_info
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SymbolGetResponse(BaseModel):
    data: StockItem

symbol_get = APIRouter()

@symbol_get.get("/stocks/{symbol}", tags=["stocks"])
async def get_stock(symbol: str):
    try:
        symbol_data = Ticker(symbol).info

        if not symbol_data.get("symbol") or symbol_data.get("quoteType") == "NONE":
            raise HTTPException(status_code=404, detail="Stock details not found")
        
        formatted_data = format_ticker_info(symbol_data)
        return SymbolGetResponse(data=formatted_data)
    except HTTPException:
            # Required for properly returning error responses
            raise
    except Exception as err:
        logger.error(f"Error retrieving stock data: {err}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

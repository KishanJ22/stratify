from src.routes.funds.funds_schema import FundItem
from src.routes.funds.funds_get import format_fund_info
from src.utils.clean_symbol import clean_symbol
from fastapi import APIRouter, HTTPException
from yfinance import Ticker
from pydantic import BaseModel

class FundSymbolGetResponse(BaseModel):
    data: FundItem
    
fund_symbol_get = APIRouter()

@fund_symbol_get.get("/funds/{symbol}", tags=["funds"])
async def get_fund(symbol: str) -> FundSymbolGetResponse:
    try:
        cleaned_symbol = clean_symbol(symbol)
        ticker = Ticker(cleaned_symbol)
        fund_data = ticker.info
        sector_weights = ticker.funds_data.sector_weightings
        
        if not fund_data or fund_data.get("quoteType") == "NONE":
            raise HTTPException(status_code=404, detail=f"No data found for symbol: {symbol}")
        
        formatted_data = format_fund_info(fund_data, sector_weights)
        
        
        return FundSymbolGetResponse(data=formatted_data)
    except HTTPException:
            # Required for properly returning error responses
            raise
        
    except Exception as err:
        print(f"Error retrieving fund data: {err}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )
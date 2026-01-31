from fastapi import APIRouter, HTTPException
from src.routes.market.query_stocks_by_activity import query_by_trading_activity
from src.routes.market.quote_schema import QuoteListGetResponse

most_active_get = APIRouter()

@most_active_get.get("/market/most-active", tags=["market"])
async def get_most_active(
    marketCap: int = 2000000000,
    dayVolume: int = 5000000,
    limit: int = 10,
) -> QuoteListGetResponse:
    try:
        most_active_assets = query_by_trading_activity(
            marketCap,
            dayVolume,
            limit,
        )
        
        if not most_active_assets or len(most_active_assets) == 0:
            raise HTTPException(status_code=404, detail="No most active assets found with the specified criteria.")
        
        return QuoteListGetResponse(data=most_active_assets)
    except HTTPException:
        raise
    except Exception as e:
        print("Error fetching most active assets:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")
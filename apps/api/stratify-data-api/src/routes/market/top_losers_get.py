from fastapi import APIRouter, HTTPException
from src.routes.market.query_stocks_by_percent_change import query_by_percent_change
from src.routes.market.quote_schema import QuoteListGetResponse

top_losers_get = APIRouter()

@top_losers_get.get("/market/top-losers", tags=["market"])
async def get_top_losers(
    minimumPercentageChange: float = -3.0,
    limit: int = 10,
) -> QuoteListGetResponse:
    try:
        top_losers = query_by_percent_change(
            'LT',
            minimumPercentageChange,
            limit,
            True
        )
        
        if not top_losers or len(top_losers) == 0:
            raise HTTPException(status_code=404, detail="No assets found with the specified criteria.")
        
        return QuoteListGetResponse(data=top_losers)
    except HTTPException:
        raise
    except Exception as e:
        print("Error fetching top losers:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
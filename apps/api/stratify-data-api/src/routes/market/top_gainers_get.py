from fastapi import APIRouter, HTTPException
from src.routes.market.query_stocks_by_percent_change import query_by_percent_change
from src.routes.market.quote_schema import QuoteListGetResponse

top_gainers_get = APIRouter()

@top_gainers_get.get("/market/top-gainers", tags=["market"])
async def get_top_gainers(
    minimumPercentageChange: float = 3.0, # default to 3 percent gain
    minimumVolume: int = 1000000, # default to 1 million volume
    limit: int = 10, # default to top 10 gainers
) -> QuoteListGetResponse:
    try:
        top_gainers = query_by_percent_change(
            'GT',
            minimumPercentageChange,
            minimumVolume,
            limit,
        )
        
        if not top_gainers or len(top_gainers) == 0:
            raise HTTPException(status_code=404, detail="No assets found with the specified criteria.")
        
        return QuoteListGetResponse(data=top_gainers)
    except HTTPException:
        raise
    except Exception as e:
        print("Error fetching top gainers:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")
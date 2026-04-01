from src.routes.market.queries.query_stocks_by_activity import query_stocks_by_activity
from src.routes.market.queries.query_cryptocurrencies_by_activity import query_cryptocurrencies_by_activity
from src.routes.market.queries.query_funds_by_activity import query_funds_by_activity
from fastapi import APIRouter, HTTPException
from src.routes.market.queries.quote_schema import QuoteListGetResponse

most_active_get = APIRouter()

@most_active_get.get("/market/most-active", tags=["market"])
async def get_most_active(
    minimumMarketCap: int = 2000000000, # default to 2 billion market cap
    minimumVolume: int = 1000000, # default to 1 million volume
    limit: int = 20, # default to top 20 most active stocks
) -> QuoteListGetResponse:
    try:
        most_active_stocks = query_stocks_by_activity(
            minimumMarketCap,
            minimumVolume,
            limit,
        )
        
        most_active_cryptocurrencies = query_cryptocurrencies_by_activity(
            limit
        )
        
        most_active_funds = query_funds_by_activity(
            limit
        )
        
        most_active_assets = most_active_stocks + most_active_cryptocurrencies + most_active_funds
        most_active_assets = sorted(most_active_assets, key=lambda x: x['priceDetails']['dayTradingActivity']['volume'], reverse=True)[:limit]
        
        if not most_active_assets or len(most_active_assets) == 0:
            raise HTTPException(status_code=404, detail="No assets found with the specified criteria.")
        
        return QuoteListGetResponse(data=most_active_assets)
    except HTTPException:
        raise
    except Exception as e:
        print("Error fetching most active assets:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")
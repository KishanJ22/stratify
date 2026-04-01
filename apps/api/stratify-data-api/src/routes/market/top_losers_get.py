from fastapi import APIRouter, HTTPException
from src.routes.market.queries.query_stocks_by_percent_change import query_stocks_by_percent_change
from src.routes.market.queries.query_cryptocurrencies_by_percentage_change import query_cryptocurrencies_by_percentage_change
from src.routes.market.queries.query_funds_by_percentage_change import query_funds_by_percentage_change
from src.routes.market.queries.quote_schema import QuoteListGetResponse

top_losers_get = APIRouter()

@top_losers_get.get("/market/top-losers", tags=["market"])
async def get_top_losers(
    minimumPercentageChange: float = -3.0, # default to 3 percent price decrease
    minimumVolume: int = 1000000, # default to 1 million volume
    limit: int = 20, # default to top 20 losers
) -> QuoteListGetResponse:
    try:
        top_losers_stocks = query_stocks_by_percent_change(
            'LT',
            minimumPercentageChange,
            minimumVolume,
            limit,
            True
        )
        
        top_losers_cryptocurrencies = query_cryptocurrencies_by_percentage_change(
            'LT',
            minimumPercentageChange,
            limit,
            True
        )
        
        top_losers_funds = query_funds_by_percentage_change(
            'LT',
            minimumPercentageChange,
            limit,
            True
        )
        
        top_losers_assets = top_losers_stocks + top_losers_cryptocurrencies + top_losers_funds
        top_losers_assets = sorted(top_losers_assets, key=lambda x: x['priceDetails']['dayTradingActivity']['changePercent'])[:limit]

        if not top_losers_assets or len(top_losers_assets) == 0:
            raise HTTPException(status_code=404, detail="No assets found with the specified criteria.")
        
        return QuoteListGetResponse(data=top_losers_assets)
    except HTTPException:
        raise
    except Exception as e:
        print("Error fetching top losers:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
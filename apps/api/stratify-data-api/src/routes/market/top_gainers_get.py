from fastapi import APIRouter, HTTPException
from src.routes.market.queries.query_stocks_by_percent_change import query_stocks_by_percent_change
from src.routes.market.queries.query_cryptocurrencies_by_percentage_change import query_cryptocurrencies_by_percentage_change
from src.routes.market.queries.query_funds_by_percentage_change import query_funds_by_percentage_change
from src.routes.market.queries.quote_schema import QuoteListGetResponse

top_gainers_get = APIRouter()

@top_gainers_get.get("/market/top-gainers", tags=["market"])
async def get_top_gainers(
    minimumPercentageChange: float = 3.0, # default to 3 percent gain
    minimumVolume: int = 1000000, # default to 1 million volume
    limit: int = 20, # default to top 20 gainers
) -> QuoteListGetResponse:
    try:
        top_gainers_stocks = query_stocks_by_percent_change(
            'GT',
            minimumPercentageChange,
            minimumVolume,
            limit,
        )
        
        top_gainers_cryptocurrencies = query_cryptocurrencies_by_percentage_change(
            'GT',
            minimumPercentageChange,
            limit,
        )
        
        top_gainers_funds = query_funds_by_percentage_change(
            'GT',
            minimumPercentageChange,
            limit
        )
        
        top_gainers_assets = top_gainers_stocks + top_gainers_cryptocurrencies + top_gainers_funds
        top_gainers_assets = sorted(top_gainers_assets, key=lambda x: x['priceDetails']['dayTradingActivity']['changePercent'], reverse=True)[:limit]
        
        if not top_gainers_assets or len(top_gainers_assets) == 0:
            raise HTTPException(status_code=404, detail="No assets found with the specified criteria.")
        
        return QuoteListGetResponse(data=top_gainers_assets)
    except HTTPException:
        raise
    except Exception as e:
        print("Error fetching top gainers:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")
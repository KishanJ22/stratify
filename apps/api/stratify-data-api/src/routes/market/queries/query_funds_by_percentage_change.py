from yahooquery import Screener
from src.routes.market.queries.format_quote_info import format_quote_info

def query_funds_by_percentage_change(
    percentageOperation: str, 
    minimumPercentageChange: float, 
    limit: int = 10, 
    sortAscending: bool = False
    ):
    try:
        screener = Screener()
        fund_assets = screener.get_screeners('top_etfs_us', 50).get('top_etfs_us').get('quotes', [])
        
        filtered_assets = []
        for asset in fund_assets:
            change_percent = asset.get('regularMarketChangePercent')
            if percentageOperation == 'GT':
                if change_percent > minimumPercentageChange:
                    filtered_assets.append(asset)
            elif percentageOperation == 'LT':
                if change_percent < minimumPercentageChange:
                    filtered_assets.append(asset)
        
        formatted_assets = [format_quote_info(asset) for asset in filtered_assets]

        return sorted(formatted_assets, key=lambda x: x['priceDetails']['dayTradingActivity']['changePercent'], reverse=not sortAscending)[:limit]
    except Exception as e:
        print("Error querying funds by percentage change:", e)
        return []

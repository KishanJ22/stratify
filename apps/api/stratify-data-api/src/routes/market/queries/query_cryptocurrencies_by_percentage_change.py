from yahooquery import Screener
from src.routes.market.queries.format_quote_info import format_quote_info

def query_cryptocurrencies_by_percentage_change(
    percentageOperation: str, 
    minimumPercentageChange: float, 
    limit: int = 10, 
    sortAscending: bool = False
    ):
    try:
        screener = Screener()
        #? Assets are sorted by trading volume by default
        #? So more assets are retrieved to ensure there are enough for filtering by percentage change
        crypto_assets = screener.get_screeners('all_cryptocurrencies_us', 50).get('all_cryptocurrencies_us', {}).get('quotes', [])
        
        filtered_assets = []
        for asset in crypto_assets:
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
        print("Error querying cryptocurrencies by activity:", e)
        return []

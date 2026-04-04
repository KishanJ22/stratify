from yahooquery import Screener
from src.routes.market.queries.format_quote_info import format_quote_info

def query_cryptocurrencies_by_activity(limit: int = 10):
    try:
        screener = Screener()
        crypto_assets = screener.get_screeners('all_cryptocurrencies_us', limit).get('all_cryptocurrencies_us').get('quotes', [])
        filtered_assets = [asset for asset in crypto_assets if asset.get("regularMarketChange") > 0.1 or asset.get("regularMarketChangePercent") > 1.0]
        
        formatted_assets = [format_quote_info(asset, "CRYPTOCURRENCY") for asset in filtered_assets]

        return sorted(formatted_assets, key=lambda x: x['priceDetails']['dayTradingActivity']['volume'], reverse=True)[:limit]
    except Exception as e:
        print("Error querying cryptocurrencies by activity:", e)
        return []

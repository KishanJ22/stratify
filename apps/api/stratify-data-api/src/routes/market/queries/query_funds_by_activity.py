from yahooquery import Screener
from src.routes.market.queries.format_quote_info import format_quote_info

def query_funds_by_activity(
    limit: int = 20,
):
    try:
        screener = Screener()
        #? Can only retrieve ETFs in the US for now, there is no screener for ETFs in the UK at the moment
        fund_assets = screener.get_screeners('top_etfs_us', limit).get('top_etfs_us').get('quotes', [])
        
        formatted_assets = [format_quote_info(asset, "ETF") for asset in fund_assets]
        return sorted(formatted_assets, key=lambda x: x['priceDetails']['dayTradingActivity']['volume'], reverse=True)[:limit]
    except Exception as e:
        print("Error querying funds by activity:", e)
        return []
from yfinance import EquityQuery, screen
from src.routes.market.format_quote_info import format_quote_info

def query_by_trading_activity(
    minimumMarketCap: int = 2000000000,
    minimumVolume: int = 5000000,
    limit: int = 10,
):
    try:
        query = EquityQuery('and', [
            EquityQuery('is-in', ['region', 'us', 'gb']), # US and UK markets
            EquityQuery('is-in', ['exchange', 'LSE', 'NYQ', 'ASE', 'NGM', 'NMS']), # Exchanges that data is available for
            EquityQuery('GT', ['intradaymarketcap', minimumMarketCap]),
            EquityQuery('GT', ['dayvolume', minimumVolume])
        ])
        
        results = screen(query, size=limit, sortField='dayvolume', sortAsc=False)
        assets = results.get("quotes")
        
        formatted_assets = [format_quote_info(asset) for asset in assets]
        return formatted_assets
    except Exception as e:
        print("Error querying stocks by activity:", e)
        return []
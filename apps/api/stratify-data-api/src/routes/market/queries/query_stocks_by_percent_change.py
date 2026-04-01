from yfinance import EquityQuery, screen
from src.routes.market.queries.format_quote_info import format_quote_info

def query_stocks_by_percent_change(
        percentageOperation: str, 
        minimumPercentageChange: float,
        minimumVolume: int,
        limit: int,
        sortAscending: bool = False,
    ):
    try:
        query = EquityQuery('and', [
            EquityQuery('is-in', ['region', 'us', 'gb']), # US and UK markets
            EquityQuery('is-in', ['exchange', 'LSE', 'NYQ', 'ASE', 'NGM', 'NMS']), # Exchanges that data is available for
            EquityQuery(percentageOperation, ['percentchange', minimumPercentageChange]), # More than 3 percent gain
            EquityQuery('GT', ['dayvolume', minimumVolume]), # Minimum volume
        ])
        
        results = screen(query, size=limit, sortField='percentchange', sortAsc=sortAscending)
        assets = results.get("quotes")
        
        formatted_assets = [format_quote_info(asset) for asset in assets]
        return formatted_assets
    except Exception as e:
        print("Error querying stocks by percent change:", e)
        return []

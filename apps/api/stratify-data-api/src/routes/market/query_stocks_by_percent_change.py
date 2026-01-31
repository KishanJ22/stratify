from yfinance import EquityQuery, screen
from src.routes.market.quote_schema import QuoteItem

def format_quote_info(quote_info) -> QuoteItem:
        return {
        "displayName": quote_info.get("displayName"),
        "shortName": quote_info.get("shortName"),
        "longName": quote_info.get("longName"),
        "marketState": quote_info.get("marketState"),
        "marketCap": quote_info.get("marketCap"),
        "exchange": {
            "exchangeName": quote_info.get("fullExchangeName"),
            "exchangeTimezoneName": quote_info.get("exchangeTimezoneShortName"),
        },
        "priceDetails": {
            "currentPrice": quote_info.get("regularMarketPrice"),
            "dayTradingActivity": {
                "open": quote_info.get("regularMarketOpen"),
                "high": quote_info.get("regularMarketDayHigh"),
                "low": quote_info.get("regularMarketDayLow"),
                "close": quote_info.get("regularMarketPreviousClose"),
                "volume": quote_info.get("regularMarketVolume"),
                "change": quote_info.get("regularMarketChange"),
                "changePercent": quote_info.get("regularMarketChangePercent"),
            },
        }
    }

def query_by_percent_change(
        percentageOperation: str, 
        minimumPercentageChange: float, 
        limit: int, 
        sortAscending: bool = False
    ):
    try:
        query = EquityQuery('and', [
            EquityQuery('is-in', ['region', 'us', 'gb']), # US and UK markets
            EquityQuery('is-in', ['exchange', 'LSE', 'NYQ', 'ASE', 'NGM', 'NMS']), # Exchanges that data is available for
            EquityQuery(percentageOperation, ['percentchange', minimumPercentageChange]), # More than 3 percent gain
        ])
        
        results = screen(query, size=limit, sortField='percentchange', sortAsc=sortAscending)
        assets = results.get("quotes", [])
        
        formatted_assets = [format_quote_info(asset) for asset in assets]
        return formatted_assets
    except Exception as e:
        print("Error querying stocks by percent change:", e)
        return []

from src.routes.market.queries.quote_schema import QuoteItem

def format_quote_info(quote_info) -> QuoteItem:
    return {
        "symbol": quote_info.get("symbol"),
        "marketState": quote_info.get("marketState"),
        "assetType": quote_info.get("quoteType"),
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
        },
    }
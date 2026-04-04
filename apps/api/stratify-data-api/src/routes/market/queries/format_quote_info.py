from src.routes.market.queries.quote_schema import QuoteItem

def format_quote_info(quoteInfo, assetType: str) -> QuoteItem:
    return {
        "symbol": quoteInfo.get("symbol"),
        "marketState": quoteInfo.get("marketState"),
        "assetType": assetType,
        "priceDetails": {
            "currentPrice": quoteInfo.get("regularMarketPrice"),
            "dayTradingActivity": {
                "open": quoteInfo.get("regularMarketOpen"),
                "high": quoteInfo.get("regularMarketDayHigh"),
                "low": quoteInfo.get("regularMarketDayLow"),
                "close": quoteInfo.get("regularMarketPreviousClose"),
                "volume": quoteInfo.get("regularMarketVolume"),
                "change": quoteInfo.get("regularMarketChange"),
                "changePercent": quoteInfo.get("regularMarketChangePercent"),
            },
        },
    }
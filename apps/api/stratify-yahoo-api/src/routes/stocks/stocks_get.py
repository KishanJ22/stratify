from fastapi import APIRouter
from src.utils.calculate_change import calculate_change, calculate_change_percent
from src.routes.stocks.stocks_schema import StocksResponse
import yfinance as yf

def format_ticker_info(ticker_info):
    return {
        "displayName": ticker_info.get("displayName"),
        "shortName": ticker_info.get("shortName"),
        "longName": ticker_info.get("longName"),
        "address": {
            "address": ticker_info.get("address1"),
            "city": ticker_info.get("city"),
            "state": ticker_info.get("state"),
            "zip": ticker_info.get("zip"),
            "country": ticker_info.get("country"),
            "phone": ticker_info.get("phone")
        },
        "summary": ticker_info.get("longBusinessSummary"),
        "market": {
            "marketRegion": ticker_info.get("market"),
            "marketState": ticker_info.get("marketState"),
            "industryDetails": {
                "industry": ticker_info.get("industry"),
                "sector": ticker_info.get("sector"),
            },
            "financialDetails": {
                "marketCap": ticker_info.get("marketCap"),
            }
        },
        "priceDetails": {
            "currentPrice": ticker_info.get("currentPrice"),
            "previousClose": ticker_info.get("previousClose"),
            "dayChange": calculate_change(
                ticker_info.get("currentPrice"), 
                ticker_info.get("previousClose")
            ),
            "dayChangePercent": calculate_change_percent(
                ticker_info.get("currentPrice"), 
                ticker_info.get("previousClose")
            ),
        }
    }

router = APIRouter()

@router.get("/stocks", tags=["stocks"], status_code=200)
async def get_stocks() -> StocksResponse:
    try:
        
        tickers = yf.Tickers(tickers='AAPL MSFT').tickers
        
        formatted_stocks = []

        for ticker in tickers:
            ticker_data = tickers[ticker]
            formatted_stocks.append(format_ticker_info(ticker_data.info))

        return { 
            "data": {
                "stocks": formatted_stocks
            }
        }
    except Exception as e:
        print(f"Error retrieving stock data: {e}")

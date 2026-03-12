mock_fund_data = {
    "shortName": "S&P 500 ETF fund",
    "longName": "Standard & Poorer 500 ETF Fund",
    "symbol": "SP500",
    "type": "ETF",
    "fundFamily": "S&P",
    "marketState": "REGULAR",
    "currency": "USD",
    "exchange": {
      "exchangeName": "A stock exchange",
      "exchangeTimezone": "EST"
    },
    "priceDetails": {
        "currentPrice": 450.25,
        "dayTradingActivity": {
            "open": 448.00,
            "high": 452.00,
            "low": 447.50,
            "close": 449.00,
            "volume": 1200000,
            "change": 1.25,
            "changePercent": 0.28,
        },
    },
    "sectorWeights": [
        {
            "sector": "technology", 
            "weight": 0.95
        },
        {
            "sector": "communications", 
            "weight": 0.02
        },
        {
            "sector": "energy", 
            "weight": 0.02
        },
        {
            "sector": "financial", 
            "weight": 0.01
        }
    ]
}
